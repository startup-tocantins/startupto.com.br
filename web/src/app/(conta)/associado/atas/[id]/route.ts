import {NextResponse, type NextRequest} from 'next/server'
import {getSessao} from '@/lib/associados/sessao'
import {createAdminClient} from '@/lib/supabase/server'

/** Download de ata: só associados ativos e admins; URL assinada válida por 2 minutos. */
export async function GET(req: NextRequest, ctx: RouteContext<'/associado/atas/[id]'>) {
  const {id} = await ctx.params
  const sessao = await getSessao()
  const p = sessao?.perfil
  if (!p) return NextResponse.redirect(new URL('/entrar?proximo=/associado', req.nextUrl.origin))
  if (p.status !== 'ativo' && p.papel !== 'admin') {
    return NextResponse.redirect(new URL('/associado', req.nextUrl.origin))
  }
  const admin = createAdminClient()
  const {data: ata} = await admin.from('atas').select('caminho, titulo').eq('id', id).maybeSingle()
  if (!ata) return NextResponse.json({erro: 'Ata não encontrada'}, {status: 404})
  const {data, error} = await admin.storage.from('atas').createSignedUrl(ata.caminho, 120, {download: `${ata.titulo}.pdf`})
  if (error || !data) return NextResponse.json({erro: 'Arquivo indisponível'}, {status: 500})
  return NextResponse.redirect(data.signedUrl)
}
