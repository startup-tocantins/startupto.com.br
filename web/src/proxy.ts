import {createServerClient} from '@supabase/ssr'
import {NextResponse, type NextRequest} from 'next/server'

/**
 * Renova a sessão do Supabase e faz a checagem otimista de acesso às áreas
 * logadas. A autorização real (papel admin, dono do perfil) é verificada
 * de novo no servidor em cada página e ação.
 */
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) return NextResponse.next()

  let response = NextResponse.next({request})
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(toSet) {
        toSet.forEach(({name, value}) => request.cookies.set(name, value))
        response = NextResponse.next({request})
        toSet.forEach(({name, value, options}) => response.cookies.set(name, value, options))
      },
    },
  })

  const {data} = await supabase.auth.getUser()
  const caminho = request.nextUrl.pathname
  const protegido = caminho.startsWith('/associado') || caminho.startsWith('/admin')
  if (protegido && !data.user) {
    const destino = new URL('/entrar', request.url)
    destino.searchParams.set('proximo', caminho)
    return NextResponse.redirect(destino)
  }
  return response
}

export const config = {
  matcher: ['/associado/:path*', '/admin/:path*', '/entrar', '/auth/:path*', '/cadastro/:path*'],
}
