import {NextResponse, type NextRequest} from 'next/server'
import {env} from '@/lib/env'
import {getSessao} from '@/lib/associados/sessao'
import {getStripe} from '@/lib/stripe'

/** Abre o Portal do Cliente do Stripe (trocar cartão, ver faturas, cancelar). */
export async function GET(req: NextRequest) {
  const sessao = await getSessao()
  if (!sessao?.perfil) {
    return NextResponse.redirect(new URL('/entrar?proximo=/associado/portal', req.nextUrl.origin))
  }
  const customer = sessao.perfil.stripe_customer_id
  if (!customer) return NextResponse.redirect(new URL('/associado', req.nextUrl.origin))
  try {
    const portal = await getStripe().billingPortal.sessions.create({
      customer,
      return_url: `${env.siteUrl()}/associado`,
      locale: 'pt-BR',
    })
    return NextResponse.redirect(portal.url)
  } catch (e) {
    console.error('[portal]', e)
    return NextResponse.redirect(new URL('/associado?erro=portal', req.nextUrl.origin))
  }
}
