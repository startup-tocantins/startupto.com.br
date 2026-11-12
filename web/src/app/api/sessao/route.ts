import {NextResponse} from 'next/server'
import {getSessao} from '@/lib/associados/sessao'
import {iniciais} from '@/lib/formatos'

/** Dados mínimos de quem está logado, para o menu de conta do cabeçalho. */
export async function GET() {
  const sessao = await getSessao()
  const p = sessao?.perfil
  const corpo = p
    ? {
        logado: true as const,
        nome: p.nome,
        primeiroNome: p.nome.split(/\s+/)[0],
        iniciais: iniciais(p.nome) || p.nome.slice(0, 1).toUpperCase(),
        email: p.email,
        admin: p.papel === 'admin',
      }
    : {logado: false as const}
  return NextResponse.json(corpo, {headers: {'Cache-Control': 'private, no-store'}})
}
