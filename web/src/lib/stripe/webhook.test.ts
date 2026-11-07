import {describe, expect, it, vi} from 'vitest'
import type Stripe from 'stripe'
import type {Perfil} from '@/lib/supabase/types'
import {processarEvento, type Deps} from './webhook'

const base: Perfil = {
  id: 'p1', nome: 'Bia', email: 'b@x.com', whatsapp: '63999999999', cidade: 'gurupi',
  tipo_documento: 'cnpj', documento: '57921002000130', startup_nome: 'AgroBia', setor: 'agro-agtech',
  estagio: 'tracao', site: null, logo_path: null, modalidade: 'associado', status: 'aguardando_pagamento',
  categoria: 'titular', isento: false, motivo_isencao: null, vitrine_opt_in: true,
  aceite_estatuto_em: '2026-11-07', aceite_privacidade_em: '2026-11-07', stripe_customer_id: 'cus_1',
  stripe_subscription_id: 'sub_1', vencimento: null, papel: 'membro', criado_em: '', atualizado_em: '',
}

function criarDeps(perfil: Perfil) {
  const estado = {perfil: {...perfil}, processados: new Set<string>()}
  const deps: Deps = {
    jaProcessado: async (id) => estado.processados.has(id),
    marcarProcessado: async (id) => void estado.processados.add(id),
    perfilPorId: async (id) => (id === estado.perfil.id ? estado.perfil : null),
    perfilPorCustomer: async (c) => (c === estado.perfil.stripe_customer_id ? estado.perfil : null),
    atualizarPerfil: async (_id, dados) => void Object.assign(estado.perfil, dados),
    registrar: vi.fn(async () => {}),
    buscarAssinatura: async (id) =>
      ({id, customer: 'cus_1', metadata: {perfil_id: 'p1'}, items: {data: [{current_period_end: 1825000000}]}}) as unknown as Stripe.Subscription,
    notificar: {ativa: vi.fn(async () => {}), renovacao: vi.fn(async () => {}), falha: vi.fn(async () => {}), cancelada: vi.fn(async () => {})},
    cartaoFinal: async () => '4242',
  }
  return {deps, estado}
}

const evento = (id: string, type: string, object: object) =>
  ({id, type, created: 1790000000, data: {object}}) as unknown as Stripe.Event

const fatura = {customer: 'cus_1', parent: {subscription_details: {subscription: 'sub_1'}}, amount_due: 25000}

describe('webhook do Stripe', () => {
  it('invoice.paid ativa o associado, define vencimento e envia boas-vindas', async () => {
    const {deps, estado} = criarDeps(base)
    expect(await processarEvento(evento('e1', 'invoice.paid', fatura), deps)).toBe('ativo')
    expect(estado.perfil.status).toBe('ativo')
    expect(estado.perfil.vencimento).toBe('2027-10-31')
    expect(deps.notificar.ativa).toHaveBeenCalledOnce()
  })

  it('é idempotente: o mesmo evento não é processado duas vezes', async () => {
    const {deps} = criarDeps(base)
    await processarEvento(evento('e1', 'invoice.paid', fatura), deps)
    expect(await processarEvento(evento('e1', 'invoice.paid', fatura), deps)).toBe('duplicado')
    expect(deps.notificar.ativa).toHaveBeenCalledOnce()
  })

  it('renovação de quem já está ativo não reenvia boas-vindas', async () => {
    const {deps} = criarDeps({...base, status: 'ativo'})
    await processarEvento(evento('e2', 'invoice.paid', fatura), deps)
    expect(deps.notificar.ativa).not.toHaveBeenCalled()
  })

  it('invoice.payment_failed marca inadimplente, avisa e nunca exclui', async () => {
    const {deps, estado} = criarDeps({...base, status: 'ativo'})
    expect(await processarEvento(evento('e3', 'invoice.payment_failed', fatura), deps)).toBe('inadimplente')
    expect(estado.perfil.status).toBe('inadimplente')
    expect(estado.perfil.id).toBe('p1')
    expect(deps.notificar.falha).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({cartaoFinal: '4242'}))
  })

  it('isentos não são afetados por cobrança', async () => {
    const {deps, estado} = criarDeps({...base, status: 'ativo', isento: true, motivo_isencao: 'Diretoria — art. 26'})
    expect(await processarEvento(evento('e4', 'invoice.payment_failed', fatura), deps)).toBe('isento')
    expect(estado.perfil.status).toBe('ativo')
  })

  it('subscription.deleted cancela e notifica', async () => {
    const {deps, estado} = criarDeps({...base, status: 'ativo'})
    const sub = {id: 'sub_1', customer: 'cus_1', metadata: {perfil_id: 'p1'}, items: {data: []}}
    expect(await processarEvento(evento('e5', 'customer.subscription.deleted', sub), deps)).toBe('cancelado')
    expect(estado.perfil.status).toBe('cancelado')
    expect(deps.notificar.cancelada).toHaveBeenCalledOnce()
  })

  it('invoice.upcoming envia lembrete com valor e cartão', async () => {
    const {deps} = criarDeps({...base, status: 'ativo'})
    expect(await processarEvento(evento('e6', 'invoice.upcoming', fatura), deps)).toBe('lembrete')
    expect(deps.notificar.renovacao).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({valorCentavos: 25000, cartaoFinal: '4242'}),
    )
  })
})
