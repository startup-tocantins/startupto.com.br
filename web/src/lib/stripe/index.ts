import 'server-only'
import Stripe from 'stripe'
import {env} from '@/lib/env'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  const key = env.stripeSecretKey()
  if (!key) throw new Error('Stripe não configurado (STRIPE_SECRET_KEY).')
  if (!_stripe) _stripe = new Stripe(key, {appInfo: {name: 'startupto-web'}})
  return _stripe
}

export const stripeConfigurado = () => Boolean(env.stripeSecretKey())

export {assinaturaDaFatura, fimDoPeriodo} from './webhook'

export const clienteId = (c: string | Stripe.Customer | Stripe.DeletedCustomer | null) =>
  !c ? null : typeof c === 'string' ? c : c.id
