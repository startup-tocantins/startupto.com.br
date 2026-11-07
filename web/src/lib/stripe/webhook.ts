/**
 * Regras de negócio dos webhooks do Stripe, isoladas das dependências
 * (banco, e-mail, API do Stripe) para poderem ser testadas.
 *
 * - invoice.paid                 → ativo + novo vencimento (e-mail B5 no primeiro pagamento)
 * - invoice.payment_failed       → inadimplente + e-mail B7 + alerta C2 (nunca exclui — Regimento art. 9º-A)
 * - invoice.upcoming             → lembrete de renovação (B6)
 * - customer.subscription.deleted→ cancelado + e-mail B8 + alerta C3
 * - customer.subscription.updated→ sincroniza vencimento
 * - checkout.session.completed   → vincula customer/subscription ao perfil
 * Associados isentos (Estatuto art. 26) não são afetados por eventos de cobrança.
 */
import type Stripe from 'stripe'
import type {Perfil, StatusAssociado} from '@/lib/supabase/types'

export type Deps = {
  jaProcessado(eventId: string): Promise<boolean>
  marcarProcessado(eventId: string, tipo: string): Promise<void>
  perfilPorId(id: string): Promise<Perfil | null>
  perfilPorCustomer(customerId: string): Promise<Perfil | null>
  atualizarPerfil(id: string, dados: Partial<Perfil>): Promise<void>
  registrar(r: {perfilId: string; acao: string; anterior: StatusAssociado; novo: StatusAssociado; observacao?: string}): Promise<void>
  buscarAssinatura(id: string): Promise<Stripe.Subscription>
  notificar: {
    ativa(p: Perfil, vencimento: Date): Promise<void>
    renovacao(p: Perfil, info: {vencimento: Date; valorCentavos: number; cartaoFinal: string}): Promise<void>
    falha(p: Perfil, info: {cartaoFinal: string; data: Date}): Promise<void>
    cancelada(p: Perfil, data: Date): Promise<void>
  }
  cartaoFinal(customerId: string): Promise<string>
}

const dataISO = (d: Date) => d.toISOString().slice(0, 10)

function idDe(x: string | {id: string} | null | undefined): string | null {
  if (!x) return null
  return typeof x === 'string' ? x : x.id
}

export function assinaturaDaFatura(invoice: Stripe.Invoice): string | null {
  const inv = invoice as unknown as {
    parent?: {subscription_details?: {subscription?: string | {id: string}}}
    subscription?: string | {id: string}
  }
  return idDe(inv.parent?.subscription_details?.subscription ?? inv.subscription)
}

export function fimDoPeriodo(sub: Stripe.Subscription): Date | null {
  const item = sub.items?.data?.[0] as unknown as {current_period_end?: number} | undefined
  const ts = item?.current_period_end ?? (sub as unknown as {current_period_end?: number}).current_period_end
  return ts ? new Date(ts * 1000) : null
}

async function perfilDoEvento(deps: Deps, customer: string | null, perfilIdMeta?: string | null) {
  if (perfilIdMeta) {
    const p = await deps.perfilPorId(perfilIdMeta)
    if (p) return p
  }
  return customer ? deps.perfilPorCustomer(customer) : null
}

export async function processarEvento(event: Stripe.Event, deps: Deps): Promise<string> {
  if (await deps.jaProcessado(event.id)) return 'duplicado'
  const resultado = await tratar(event, deps)
  await deps.marcarProcessado(event.id, event.type)
  return resultado
}

async function tratar(event: Stripe.Event, deps: Deps): Promise<string> {
  switch (event.type) {
    case 'checkout.session.completed': {
      const s = event.data.object as Stripe.Checkout.Session
      if (s.mode !== 'subscription') return 'ignorado'
      const perfil = await perfilDoEvento(deps, idDe(s.customer), s.client_reference_id ?? s.metadata?.perfil_id)
      if (!perfil) return 'perfil-nao-encontrado'
      await deps.atualizarPerfil(perfil.id, {
        stripe_customer_id: idDe(s.customer),
        stripe_subscription_id: idDe(s.subscription),
      })
      return 'vinculado'
    }

    case 'invoice.paid': {
      const inv = event.data.object as Stripe.Invoice
      const subId = assinaturaDaFatura(inv)
      if (!subId) return 'ignorado'
      const sub = await deps.buscarAssinatura(subId)
      const perfil = await perfilDoEvento(deps, idDe(inv.customer), sub.metadata?.perfil_id)
      if (!perfil) return 'perfil-nao-encontrado'
      if (perfil.isento) return 'isento'
      const fim = fimDoPeriodo(sub)
      const anterior = perfil.status
      await deps.atualizarPerfil(perfil.id, {
        status: 'ativo',
        modalidade: 'associado',
        stripe_customer_id: idDe(inv.customer),
        stripe_subscription_id: subId,
        vencimento: fim ? dataISO(fim) : perfil.vencimento,
      })
      if (anterior !== 'ativo') {
        await deps.registrar({perfilId: perfil.id, acao: 'pagamento_confirmado', anterior, novo: 'ativo'})
        if (fim && (anterior === 'aguardando_pagamento' || anterior === 'cancelado' || anterior === 'recusado')) {
          await deps.notificar.ativa({...perfil, status: 'ativo'}, fim)
        }
      }
      return 'ativo'
    }

    case 'invoice.payment_failed': {
      const inv = event.data.object as Stripe.Invoice
      const perfil = await perfilDoEvento(deps, idDe(inv.customer))
      if (!perfil) return 'perfil-nao-encontrado'
      if (perfil.isento) return 'isento'
      if (perfil.status === 'inadimplente') return 'ja-inadimplente'
      const anterior = perfil.status
      await deps.atualizarPerfil(perfil.id, {status: 'inadimplente'})
      await deps.registrar({perfilId: perfil.id, acao: 'pagamento_recusado', anterior, novo: 'inadimplente'})
      const cartaoFinal = await deps.cartaoFinal(idDe(inv.customer) ?? '')
      await deps.notificar.falha(perfil, {cartaoFinal, data: new Date(event.created * 1000)})
      return 'inadimplente'
    }

    case 'invoice.upcoming': {
      const inv = event.data.object as Stripe.Invoice
      const perfil = await perfilDoEvento(deps, idDe(inv.customer))
      if (!perfil || perfil.isento) return 'ignorado'
      const subId = assinaturaDaFatura(inv)
      const sub = subId ? await deps.buscarAssinatura(subId) : null
      const vencimento =
        (sub && fimDoPeriodo(sub)) ?? (inv.next_payment_attempt ? new Date(inv.next_payment_attempt * 1000) : null)
      if (!vencimento) return 'ignorado'
      const cartaoFinal = await deps.cartaoFinal(idDe(inv.customer) ?? '')
      await deps.notificar.renovacao(perfil, {vencimento, valorCentavos: inv.amount_due, cartaoFinal})
      return 'lembrete'
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const perfil = await perfilDoEvento(deps, idDe(sub.customer), sub.metadata?.perfil_id)
      if (!perfil || perfil.isento) return 'ignorado'
      const fim = fimDoPeriodo(sub)
      if (fim) await deps.atualizarPerfil(perfil.id, {vencimento: dataISO(fim), stripe_subscription_id: sub.id})
      return 'sincronizado'
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const perfil = await perfilDoEvento(deps, idDe(sub.customer), sub.metadata?.perfil_id)
      if (!perfil) return 'perfil-nao-encontrado'
      if (perfil.isento || perfil.stripe_subscription_id !== sub.id) return 'ignorado'
      const anterior = perfil.status
      await deps.atualizarPerfil(perfil.id, {status: 'cancelado', stripe_subscription_id: null})
      await deps.registrar({perfilId: perfil.id, acao: 'assinatura_cancelada', anterior, novo: 'cancelado'})
      await deps.notificar.cancelada(perfil, new Date(event.created * 1000))
      return 'cancelado'
    }

    default:
      return 'ignorado'
  }
}
