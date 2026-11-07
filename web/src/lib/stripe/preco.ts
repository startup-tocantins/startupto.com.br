import 'server-only'
import {cacheLife, cacheTag} from 'next/cache'
import {env} from '@/lib/env'
import {getStripe, stripeConfigurado} from './index'

export type PrecoAssociado = {
  id: string
  valorCentavos: number
  moeda: 'brl'
  formatado: string
}

export const formatarBRL = (centavos: number) =>
  new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(centavos / 100)

async function buscarPreco(lookupKey: string): Promise<PrecoAssociado | null> {
  'use cache'
  cacheLife('hours')
  cacheTag('preco-associado')
  const precos = await getStripe().prices.list({lookup_keys: [lookupKey], active: true, limit: 1})
  const p = precos.data[0]
  if (!p || p.unit_amount == null) return null
  return {id: p.id, valorCentavos: p.unit_amount, moeda: 'brl', formatado: formatarBRL(p.unit_amount)}
}

/** Preço anual do Associado, lido do Stripe (cache de 1 h). null se o Stripe não estiver configurado. */
export async function getPrecoAssociado(): Promise<PrecoAssociado | null> {
  if (!stripeConfigurado()) return null
  try {
    return await buscarPreco(env.stripePriceLookupKey())
  } catch (e) {
    console.error('[preco]', e)
    return null
  }
}
