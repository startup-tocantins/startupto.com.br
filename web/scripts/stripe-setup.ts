/**
 * Configura o Stripe (idempotente): produto "Associado", preço anual recorrente
 * (lookup_key "associado_anual") e o Portal do Cliente.
 * Uso: npx tsx scripts/stripe-setup.ts   (lê STRIPE_SECRET_KEY de .env.local ou do .env da raiz)
 */
import Stripe from 'stripe'
import {loadEnv} from './env'

loadEnv()
const key = process.env.STRIPE_SECRET_KEY
if (!key) throw new Error('STRIPE_SECRET_KEY ausente')
if (!key.startsWith('sk_test_') && process.env.STRIPE_ALLOW_LIVE !== '1') {
  throw new Error('Chave de produção detectada. Defina STRIPE_ALLOW_LIVE=1 para confirmar.')
}
const stripe = new Stripe(key)

const LOOKUP_KEY = 'associado_anual'
const VALOR_CENTAVOS = 25000

async function main() {
  const precos = await stripe.prices.list({lookup_keys: [LOOKUP_KEY], expand: ['data.product']})
  let preco = precos.data[0]
  if (!preco) {
    const produto = await stripe.products.create({
      name: 'Associado — Associação Tocantinense de Startups',
      description: 'Anuidade de Associado: voto nas Assembleias, benefícios exclusivos e Vitrine.',
      metadata: {modalidade: 'associado'},
    })
    preco = await stripe.prices.create({
      product: produto.id,
      currency: 'brl',
      unit_amount: VALOR_CENTAVOS,
      recurring: {interval: 'year'},
      lookup_key: LOOKUP_KEY,
      nickname: 'Anuidade Associado',
    })
    console.log(`✓ Produto ${produto.id} e preço ${preco.id} criados`)
  } else {
    console.log(`✓ Preço já existe: ${preco.id} (${(preco.unit_amount ?? 0) / 100} ${preco.currency})`)
  }

  const productId = typeof preco.product === 'string' ? preco.product : preco.product.id
  const configs = await stripe.billingPortal.configurations.list({limit: 10})
  const existente = configs.data.find((c) => c.metadata?.app === 'startupto')
  const params: Stripe.BillingPortal.ConfigurationCreateParams = {
    business_profile: {
      headline: 'Associação Tocantinense de Startups — sua anuidade',
      privacy_policy_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://startupto.com.br'}/privacidade`,
    },
    features: {
      payment_method_update: {enabled: true},
      invoice_history: {enabled: true},
      customer_update: {enabled: true, allowed_updates: ['email', 'name']},
      subscription_cancel: {
        enabled: true,
        mode: 'at_period_end',
        cancellation_reason: {
          enabled: true,
          options: ['too_expensive', 'unused', 'other'],
        },
      },
      subscription_update: {enabled: false},
    },
    metadata: {app: 'startupto', product: productId},
  }
  if (existente) {
    await stripe.billingPortal.configurations.update(existente.id, {
      business_profile: params.business_profile,
      features: params.features,
    })
    console.log(`✓ Portal do cliente atualizado (${existente.id})`)
  } else {
    const c = await stripe.billingPortal.configurations.create(params)
    console.log(`✓ Portal do cliente criado (${c.id})`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
