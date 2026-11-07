import 'server-only'

/** Variáveis de ambiente do servidor. Funções retornam null quando o serviço não está configurado. */
export const env = {
  siteUrl: () =>
    (
      process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
    ).replace(/\/$/, ''),
  supabaseUrl: () => process.env.NEXT_PUBLIC_SUPABASE_URL ?? null,
  supabaseAnonKey: () =>
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? null,
  supabaseServiceKey: () =>
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY ?? null,
  stripeSecretKey: () => process.env.STRIPE_SECRET_KEY ?? null,
  stripeWebhookSecret: () => process.env.STRIPE_WEBHOOK_SECRET ?? null,
  stripePriceLookupKey: () => process.env.STRIPE_PRICE_LOOKUP_KEY ?? 'associado_anual',
  resendApiKey: () => process.env.RESEND_API_KEY ?? process.env.RESEND_APIKEY ?? null,
  emailFrom: () =>
    process.env.EMAIL_FROM ?? 'Associação Tocantinense de Startups <contato@startupto.com.br>',
  emailReplyTo: () => process.env.EMAIL_REPLY_TO ?? 'startuptocantins@gmail.com',
}

export const supabaseConfigurado = () => Boolean(env.supabaseUrl() && env.supabaseAnonKey())
