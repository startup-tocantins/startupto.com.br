import type {Metadata} from 'next'
import {redirect} from 'next/navigation'
import {Aviso, Container} from '@/components/ui'
import {getSessao} from '@/lib/associados/sessao'
import {CabecaConta} from '../_componentes/Cabeca'
import {FormEntrar, FormLinkAcesso} from '../_componentes/FormEntrar'

export const metadata: Metadata = {title: 'Entrar', robots: {index: false}}
export const instant = false

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
  const porLink = sp.modo === 'link' || sp.erro === 'link'
  return (
    <>
      <CabecaConta titulo={porLink ? 'Receber link de acesso' : 'Entrar'}>
        {porLink
          ? 'Para o primeiro acesso ou se você esqueceu a senha: enviamos um link para o e-mail do seu cadastro.'
          : 'Use o e-mail do seu cadastro e a sua senha.'}
      </CabecaConta>
      <Container className="py-12 sm:py-16">
        <div className="max-w-lg">
          {erro && (
            <Aviso tom="atencao" className="mb-6">
              {erro}
            </Aviso>
          )}
          {porLink ? <FormLinkAcesso /> : <FormEntrar proximo={proximo} />}
        </div>
      </Container>
    </>
  )
}
