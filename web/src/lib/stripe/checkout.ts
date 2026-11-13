import 'server-only'
import {env} from '@/lib/env'
import {getStripe} from '@/lib/stripe'
import {getPrecoAssociado} from '@/lib/stripe/preco'
import {createAdminClient} from '@/lib/supabase/server'
import type {Perfil} from '@/lib/supabase/types'

/** Página de pagamento com aviso de indisponibilidade (fallback quando o Checkout não abre). */
export const PAGAMENTO_INDISPONIVEL = '/associado/pagamento?erro=indisponivel'

/** Garante um cliente no Stripe para o perfil e devolve o id. */
async function clienteStripe(p: Perfil): Promise<string> {
  if (p.stripe_customer_id) return p.stripe_customer_id
  const stripe = getStripe()
  const cliente = await stripe.customers.create({
    email: p.email,
    name: p.startup_nome ? `${p.startup_nome} (${p.nome})` : p.nome,
    metadata: {perfil_id: p.id},
  })
  await createAdminClient().from('perfis').update({stripe_customer_id: cliente.id}).eq('id', p.id)
  return cliente.id
}

/**
 * Abre uma sessão do Stripe Checkout (assinatura anual) para a anuidade do perfil.
 * Devolve a URL do Checkout, ou `null` se o preço/Stripe estiver indisponível.
 */
export async function urlCheckoutAnuidade(p: Perfil): Promise<string | null> {
  const preco = await getPrecoAssociado()
  if (!preco) return null
  try {
    const stripe = getStripe()
    const customer = await clienteStripe(p)
    const sessao = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer,
      client_reference_id: p.id,
      line_items: [{price: preco.id, quantity: 1}],
      allowed_payment_method_types: ['card'],
      locale: 'pt-BR',
      subscription_data: {metadata: {perfil_id: p.id}, description: 'Anuidade — Associação Tocantinense de Startups'},
      metadata: {perfil_id: p.id},
      success_url: `${env.siteUrl()}/associado?pagamento=confirmado`,
      cancel_url: `${env.siteUrl()}/associado/pagamento?cancelado=1`,
    })
    return sessao.url
  } catch (e) {
    console.error('[checkout]', e)
    return null
  }
}
