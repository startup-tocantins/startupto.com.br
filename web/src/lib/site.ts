/** URL canônica: NEXT_PUBLIC_SITE_URL; na Vercel sem domínio próprio, o domínio de produção do projeto. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://startupto.com.br')
).replace(/\/$/, '')
export const NOME_OFICIAL = 'Associação Tocantinense de Startups'
export const CNPJ = '57.921.002/0001-30'
