import {NextResponse, type NextRequest} from 'next/server'
import type Stripe from 'stripe'
import {env} from '@/lib/env'
import {notificar} from '@/lib/associados/notificacoes'
import {registrarHistorico} from '@/lib/associados/sessao'
import {getStripe} from '@/lib/stripe'
import {processarEvento, type Deps} from '@/lib/stripe/webhook'
import {createAdminClient} from '@/lib/supabase/server'
import type {Perfil} from '@/lib/supabase/types'

export async function POST(req: NextRequest) {
  const segredo = env.stripeWebhookSecret()
  const assinatura = req.headers.get('stripe-signature')
  if (!segredo || !assinatura) {
    return NextResponse.json({erro: 'Webhook não configurado'}, {status: 400})
  }

  const stripe = getStripe()
  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(await req.text(), assinatura, segredo)
  } catch (e) {
    console.error('[stripe-webhook] assinatura inválida', e)
    return NextResponse.json({erro: 'Assinatura inválida'}, {status: 400})
  }

  const db = createAdminClient()
  const deps: Deps = {
    async jaProcessado(id) {
      const {data} = await db.from('stripe_eventos').select('id').eq('id', id).maybeSingle()
      return Boolean(data)
    },
    async marcarProcessado(id, tipo) {
      await db.from('stripe_eventos').upsert({id, tipo})
    },
    async perfilPorId(id) {
      const {data} = await db.from('perfis').select('*').eq('id', id).maybeSingle()
      return (data as Perfil | null) ?? null
    },
    async perfilPorCustomer(customerId) {
      const {data} = await db.from('perfis').select('*').eq('stripe_customer_id', customerId).maybeSingle()
      return (data as Perfil | null) ?? null
    },
    async atualizarPerfil(id, dados) {
      const {error} = await db.from('perfis').update(dados).eq('id', id)
      if (error) throw new Error(error.message)
    },
    async registrar(r) {
      await registrarHistorico({perfilId: r.perfilId, acao: r.acao, anterior: r.anterior, novo: r.novo, observacao: r.observacao})
    },
    buscarAssinatura: (id) => stripe.subscriptions.retrieve(id),
    async cartaoFinal(customerId) {
      if (!customerId) return '••••'
      try {
        const metodos = await stripe.customers.listPaymentMethods(customerId, {type: 'card', limit: 1})
        return metodos.data[0]?.card?.last4 ?? '••••'
      } catch {
        return '••••'
      }
    },
    notificar: {
      ativa: notificar.ativa,
      renovacao: notificar.renovacao,
      falha: notificar.falha,
      cancelada: notificar.cancelada,
    },
  }

  try {
    const resultado = await processarEvento(event, deps)
    return NextResponse.json({recebido: true, resultado})
  } catch (e) {
    console.error('[stripe-webhook]', event.type, e)
    // 500 faz o Stripe reenviar o evento mais tarde.
    return NextResponse.json({erro: 'Falha ao processar'}, {status: 500})
  }
}
