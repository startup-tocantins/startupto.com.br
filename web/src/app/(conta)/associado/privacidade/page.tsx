import type {Metadata} from 'next'
import Link from 'next/link'
import {Container, Ficha} from '@/components/ui'
import {exigirSessao} from '@/lib/associados/sessao'
import {CabecaConta} from '../../_componentes/Cabeca'
import {FormExclusao} from '../../_componentes/FormsArea'

export const metadata: Metadata = {title: 'Privacidade e exclusão de dados', robots: {index: false}}

/** Página por usuário (sessão/banco): fora da validação de navegação instantânea. */
export const instant = false

export default async function PrivacidadePage() {
  await exigirSessao('/associado/privacidade')
  return (
    <>
      <CabecaConta titulo="Privacidade e exclusão de dados">
        Seus dados pessoais são seus. Você pode corrigi-los ou pedir a exclusão a qualquer momento.
      </CabecaConta>
      <Container className="py-12 sm:py-14">
        <Link href="/associado" className="font-semibold text-azul underline underline-offset-4">
          ← Voltar para minha área
        </Link>
        <div className="mt-8 grid max-w-3xl gap-6">
          <Ficha className="p-6 sm:p-8" como="section">
            <h2 className="font-display text-xl font-extrabold text-azul-noite">Corrigir seus dados</h2>
            <p className="mt-2 font-texto text-[1.0625rem] leading-relaxed text-tinta-suave">
              Nome, WhatsApp, cidade e os dados da startup podem ser editados direto na sua área.
            </p>
            <Link href="/associado/perfil" className="mt-4 inline-block font-semibold text-azul underline underline-offset-4">
              Editar meus dados
            </Link>
          </Ficha>
          <Ficha className="p-6 sm:p-8" como="section">
            <h2 className="font-display text-xl font-extrabold text-azul-noite">Pedir a exclusão dos seus dados</h2>
            <p className="mt-2 font-texto text-[1.0625rem] leading-relaxed text-tinta-suave">
              Conforme a LGPD (art. 18), respondemos em até 15 dias. Alguns registros precisam ser guardados por
              obrigação legal, como os contábeis e fiscais; explicaremos na resposta o que foi excluído. Se houver
              assinatura ativa, ela será cancelada. Veja a{' '}
              <Link href="/privacidade" className="text-azul underline underline-offset-2">
                Política de Privacidade
              </Link>
              .
            </p>
            <div className="mt-5">
              <FormExclusao />
            </div>
          </Ficha>
        </div>
      </Container>
    </>
  )
}
