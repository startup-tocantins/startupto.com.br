import type {Metadata} from 'next'
import {redirect} from 'next/navigation'
import {Aviso, Container} from '@/components/ui'
import {getSessao} from '@/lib/associados/sessao'
import {CabecaConta} from '../_componentes/Cabeca'
import {FormEntrar} from '../_componentes/FormEntrar'

export const metadata: Metadata = {title: 'Entrar', robots: {index: false}}

const ERROS: Record<string, string> = {
  link: 'O link de acesso expirou ou já foi usado. Peça um novo abaixo.',
  perfil: 'Não encontramos um cadastro para este acesso. Fale com a gente se o problema continuar.',
}

export default async function EntrarPage({searchParams}: PageProps<'/entrar'>) {
  const sp = await searchParams
  const proximo = typeof sp.proximo === 'string' ? sp.proximo : undefined
  const sessao = await getSessao()
  if (sessao?.perfil) redirect(proximo?.startsWith('/') ? proximo : '/associado')
  const erro = typeof sp.erro === 'string' ? ERROS[sp.erro] : undefined
  return (
    <>
      <CabecaConta rotulo="Área do associado" titulo="Entrar">
        Sem senha: digite o e-mail do seu cadastro e enviamos um link de acesso.
      </CabecaConta>
      <Container className="py-12 sm:py-16">
        <div className="max-w-lg">
          {erro && (
            <Aviso tom="atencao" className="mb-6">
              {erro}
            </Aviso>
          )}
          <FormEntrar proximo={proximo} />
        </div>
      </Container>
    </>
  )
}
