import type {Metadata} from 'next'
import Link from 'next/link'
import {redirect} from 'next/navigation'
import {Aviso, Container, Etiqueta, Ficha} from '@/components/ui'
import {exigirSessao} from '@/lib/associados/sessao'
import {getPrecoAssociado} from '@/lib/stripe/preco'
import {CabecaConta} from '../../_componentes/Cabeca'
import {BotaoEnviar} from '../../_componentes/comum'
import {iniciarPagamento} from '../acoes'

export const metadata: Metadata = {title: 'Pagar anuidade', robots: {index: false}}

/** Página por usuário (sessão/banco): fora da validação de navegação instantânea. */
export const instant = false

export default async function PagamentoPage({searchParams}: PageProps<'/associado/pagamento'>) {
  const sp = await searchParams
  const {perfil: p} = await exigirSessao('/associado/pagamento')
  if (p.status === 'inadimplente') redirect('/associado/portal')
  if (p.status !== 'aguardando_pagamento' || p.isento) redirect('/associado')
  const preco = await getPrecoAssociado()

  return (
    <>
      <CabecaConta titulo="Pagar anuidade">
        Conclua o pagamento da anuidade para ativar a associação.
      </CabecaConta>
      <Container className="py-12 sm:py-14">
        <div className="max-w-xl">
          {sp.cancelado && (
            <Aviso tom="atencao" className="mb-6">
              O pagamento não foi concluído. Você pode tentar de novo quando quiser.
            </Aviso>
          )}
          {(sp.erro || !preco) && (
            <Aviso tom="erro" className="mb-6">
              O pagamento está indisponível no momento. Tente novamente em alguns minutos.
            </Aviso>
          )}
          <Ficha className="p-6 sm:p-8" como="section">
            <h2 className="font-display text-2xl font-bold text-azul-noite">Resumo</h2>
            <Etiqueta
              className="mt-5"
              linhas={[
                {rotulo: 'Associado', valor: p.startup_nome ?? p.nome},
                {rotulo: 'Anuidade', valor: preco ? `${preco.formatado} por ano` : '—'},
                {rotulo: 'Pagamento', valor: 'Cartão de crédito, renovação automática anual'},
              ]}
            />
            <form action={iniciarPagamento} className="mt-6">
              <BotaoEnviar tamanho="lg" disabled={!preco} pendente="Abrindo pagamento seguro…">
                Ir para o pagamento seguro
              </BotaoEnviar>
            </form>
            <p className="mt-4 text-[0.9375rem] leading-snug text-tinta-suave">
              O pagamento é processado pelo Stripe. A Associação não recebe nem guarda o número do seu cartão. Você pode
              cancelar a renovação quando quiser pela sua área.
            </p>
          </Ficha>
          <Link href="/associado" className="mt-6 inline-block font-medium text-azul underline underline-offset-4">
            ← Voltar para minha área
          </Link>
        </div>
      </Container>
    </>
  )
}
