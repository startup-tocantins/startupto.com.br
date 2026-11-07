import type {Metadata} from 'next'
import Link from 'next/link'
import {redirect} from 'next/navigation'
import {Container} from '@/components/ui'
import {getListas} from '@/lib/associados/listas'
import {exigirSessao} from '@/lib/associados/sessao'
import {DECLARACAO_ADESAO} from '@/lib/associados/textos'
import {getPrecoAssociado} from '@/lib/stripe/preco'
import {CabecaConta} from '../../_componentes/Cabeca'
import {FormAssociar} from '../../_componentes/FormsArea'

export const metadata: Metadata = {title: 'Quero ser Associado', robots: {index: false}}

export default async function AssociarPage() {
  const {perfil} = await exigirSessao('/associado/associar')
  if (!['comunidade', 'recusado', 'cancelado'].includes(perfil.status)) redirect('/associado')
  const [listas, preco] = await Promise.all([getListas(), getPrecoAssociado()])
  return (
    <>
      <CabecaConta rotulo="Comunidade → Associado" titulo="Quero ser Associado">
        Complete os dados da startup. A Diretoria analisa o pedido e, se aprovado, você recebe o link para pagar a
        anuidade{preco ? ` de ${preco.formatado}` : ''} no cartão de crédito.
      </CabecaConta>
      <Container className="py-12 sm:py-14">
        <Link href="/associado" className="font-semibold text-azul underline underline-offset-4">
          ← Voltar para minha área
        </Link>
        <div className="mt-8 max-w-2xl">
          <FormAssociar listas={listas} declaracao={[...DECLARACAO_ADESAO]} perfil={perfil} />
        </div>
      </Container>
    </>
  )
}
