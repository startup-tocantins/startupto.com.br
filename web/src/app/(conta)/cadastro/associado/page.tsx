import type {Metadata} from 'next'
import {Container} from '@/components/ui'
import {getListas} from '@/lib/associados/listas'
import {DECLARACAO_ADESAO} from '@/lib/associados/textos'
import {getPrecoAssociado} from '@/lib/stripe/preco'
import {CabecaConta} from '../../_componentes/Cabeca'
import {FormAssociado} from '../../_componentes/FormCadastro'

export const metadata: Metadata = {
  title: 'Pedido de associação',
  description: 'Associe sua startup à Associação Tocantinense de Startups: voto nas Assembleias, benefícios e Vitrine.',
}

const PASSOS = [
  {t: 'Pedido', d: 'Você preenche este formulário. Nada é cobrado agora.'},
  {t: 'Análise', d: 'A Diretoria avalia o pedido, conforme o Estatuto e o Regimento Interno.'},
  {t: 'Anuidade', d: 'Aprovado o pedido, você recebe por e-mail o link para pagar no cartão.'},
  {t: 'Ativo', d: 'Com o pagamento confirmado, sua associação fica ativa e a startup entra na Vitrine.'},
]

export default async function CadastroAssociadoPage() {
  const [listas, preco] = await Promise.all([getListas(), getPrecoAssociado()])
  return (
    <>
      <CabecaConta titulo="Pedido de associação">
        {preco ? `Anuidade de ${preco.formatado}, paga no cartão de crédito depois da aprovação.` : 'Anuidade paga no cartão de crédito depois da aprovação.'}{' '}
        Pessoas físicas e jurídicas preenchem os mesmos campos.
      </CabecaConta>
      <Container className="grid gap-12 py-12 sm:py-16 lg:grid-cols-[minmax(0,40rem)_1fr]">
        <FormAssociado listas={listas} declaracao={[...DECLARACAO_ADESAO]} />
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="font-display text-xl font-extrabold text-azul-noite">Como funciona</h2>
          <ol className="mt-4 flex flex-col">
            {PASSOS.map((p, i) => (
              <li key={p.t} className="relative flex gap-4 pb-6 last:pb-0">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-azul font-display text-sm font-extrabold text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="font-display font-bold text-azul-noite">{p.t}</p>
                  <p className="font-texto text-[1.0625rem] leading-snug text-tinta-suave">{p.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </Container>
    </>
  )
}
