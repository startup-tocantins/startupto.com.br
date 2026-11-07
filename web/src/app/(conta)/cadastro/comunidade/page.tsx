import type {Metadata} from 'next'
import Link from 'next/link'
import {Container} from '@/components/ui'
import {getListas} from '@/lib/associados/listas'
import {CabecaConta} from '../../_componentes/Cabeca'
import {FormComunidade} from '../../_componentes/FormCadastro'

export const metadata: Metadata = {
  title: 'Cadastro na Comunidade',
  description: 'Entre gratuitamente na Comunidade da Associação Tocantinense de Startups.',
}

export default async function CadastroComunidadePage() {
  const listas = await getListas()
  return (
    <>
      <CabecaConta rotulo="Comunidade · gratuita" titulo="Entre na Comunidade">
        Cadastro rápido e sem custo. Você entra no grupo Startup Tocantins no WhatsApp e participa dos eventos
        gratuitos da Associação.
      </CabecaConta>
      <Container className="grid gap-12 py-12 sm:py-16 lg:grid-cols-[minmax(0,36rem)_1fr]">
        <FormComunidade listas={listas} />
        <aside className="font-texto text-[1.0625rem] leading-relaxed text-tinta-suave lg:pt-2">
          <p className="font-display text-lg font-bold text-azul-noite">Quer votar e aparecer na Vitrine?</p>
          <p className="mt-2">
            Associados participam das Assembleias com direito a voto, acessam benefícios exclusivos e têm a startup
            exibida na Vitrine.
          </p>
          <Link href="/cadastro/associado" className="mt-3 inline-block font-semibold text-azul underline underline-offset-4">
            Pedir associação
          </Link>
        </aside>
      </Container>
    </>
  )
}
