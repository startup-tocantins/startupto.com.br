import type {Metadata} from 'next'
import Link from 'next/link'
import {Container, Ficha} from '@/components/ui'
import {exigirSessao} from '@/lib/associados/sessao'
import {CabecaConta} from '../../_componentes/Cabeca'
import {FormSenha} from '../../_componentes/FormsArea'

export const metadata: Metadata = {title: 'Senha de acesso', robots: {index: false}}

/** Página por usuário (sessão): fora da validação de navegação instantânea. */
export const instant = false

export default async function SenhaPage() {
  const {perfil} = await exigirSessao('/associado/senha')
  return (
    <>
      <CabecaConta titulo="Senha de acesso">
        Crie ou troque a senha que você usa para entrar, junto com o e-mail <strong>{perfil.email}</strong>.
      </CabecaConta>
      <Container className="py-12 sm:py-14">
        <Link href="/associado" className="font-semibold text-azul underline underline-offset-4">
          ← Voltar para minha área
        </Link>
        <Ficha className="mt-8 max-w-3xl p-6 sm:p-8" como="section">
          <FormSenha email={perfil.email} />
        </Ficha>
      </Container>
    </>
  )
}
