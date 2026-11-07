import type {EmailOtpType} from '@supabase/supabase-js'
import {NextResponse, type NextRequest} from 'next/server'
import {createClient} from '@/lib/supabase/server'

/** Recebe o link mágico (token_hash ou code PKCE), abre a sessão e redireciona. */
export async function GET(req: NextRequest) {
  const url = req.nextUrl
  const proximoParam = url.searchParams.get('proximo') ?? url.searchParams.get('next') ?? '/associado'
  const proximo = proximoParam.startsWith('/') && !proximoParam.startsWith('//') ? proximoParam : '/associado'
  const tokenHash = url.searchParams.get('token_hash')
  const type = url.searchParams.get('type') as EmailOtpType | null
  const code = url.searchParams.get('code')

  const supabase = await createClient()
  let erro: string | null = null
  if (tokenHash && type) {
    const {error} = await supabase.auth.verifyOtp({type, token_hash: tokenHash})
    erro = error?.message ?? null
  } else if (code) {
    const {error} = await supabase.auth.exchangeCodeForSession(code)
    erro = error?.message ?? null
  } else {
    erro = 'link incompleto'
  }

  if (erro) {
    console.error('[auth/confirm]', erro)
    return NextResponse.redirect(new URL('/entrar?erro=link', url.origin))
  }
  return NextResponse.redirect(new URL(proximo, url.origin))
}
