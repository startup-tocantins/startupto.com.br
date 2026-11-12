import {createServerClient} from '@supabase/ssr'
import type {EmailOtpType} from '@supabase/supabase-js'
import {NextResponse, type NextRequest} from 'next/server'

/** Recebe o link mágico (token_hash ou code PKCE), abre a sessão e redireciona. */
export async function GET(req: NextRequest) {
  const url = req.nextUrl
  const proximoParam = url.searchParams.get('proximo') ?? url.searchParams.get('next') ?? '/associado'
  const proximo = proximoParam.startsWith('/') && !proximoParam.startsWith('//') ? proximoParam : '/associado'
  const tokenHash = url.searchParams.get('token_hash')
  const type = url.searchParams.get('type') as EmailOtpType | null
  const code = url.searchParams.get('code')

  // Os cookies da sessão são gravados diretamente na resposta de redirecionamento.
  const resposta = NextResponse.redirect(new URL(proximo, url.origin))
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (toSet) => toSet.forEach(({name, value, options}) => resposta.cookies.set(name, value, options)),
      },
    },
  )

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
    // Link já usado (ex.: clicado de novo), mas a sessão aberta por ele continua válida: segue em frente.
    const {data} = await supabase.auth.getUser()
    if (data.user) return NextResponse.redirect(new URL(proximo, url.origin))
    console.error('[auth/confirm]', erro)
    return NextResponse.redirect(new URL('/entrar?erro=link', url.origin))
  }
  return resposta
}
