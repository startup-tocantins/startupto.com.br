import {Suspense} from 'react'
import {getPrecoAssociado} from '@/lib/stripe/preco'
import {botaoClasse, cx, IconeCheck} from '@/components/ui'
import Link from 'next/link'
import {ROTAS_CONTA} from './navegacao'

// Direitos conforme o Regimento Interno, art. 7º
const COMUNIDADE = [
  'Cadastro na plataforma',
  'Inclusão no grupo “Startup Tocantins” no WhatsApp',
  'Participação nos eventos gratuitos organizados pela Associação',
]
const ASSOCIADO = [
  'Cadastro na plataforma',
  'Inclusão no grupo de Associados',
  'Participação nas Assembleias, com direito a voto',
  'Acesso a benefícios exclusivos',
  'Sua startup na Vitrine do ecossistema tocantinense',
]

async function Preco() {
  const preco = await getPrecoAssociado()
  if (!preco) return <span className="font-display text-3xl font-bold">Anuidade</span>
  return (
    <span className="flex items-baseline gap-1.5">
      <span className="font-display text-[2.6rem] font-bold leading-none tracking-[-0.03em]">{preco.formatado}</span>
      <span className="text-base font-medium opacity-80">por ano</span>
    </span>
  )
}

function Lista({itens, escuro}: {itens: string[]; escuro?: boolean}) {
  return (
    <ul className="mt-6 flex flex-col gap-3">
      {itens.map((i) => (
        <li key={i} className="flex items-start gap-3 text-base leading-snug">
          <span
            className={cx(
              'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full',
              escuro ? 'bg-laranja text-azul-noite' : 'bg-azul-claro text-azul',
            )}
          >
            <IconeCheck className="size-3.5" />
          </span>
          {i}
        </li>
      ))}
    </ul>
  )
}

/** Comparativo das modalidades: duas pranchas lado a lado. */
export function Modalidades({tituloNivel = 3}: {tituloNivel?: 2 | 3}) {
  const H = tituloNivel === 2 ? 'h2' : 'h3'
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.15fr]">
      <div className="flex flex-col rounded-ficha bg-prancha p-7 text-tinta ring-1 ring-linha shadow-ficha sm:p-9">
        <H className="font-display text-2xl font-bold text-azul-noite">Comunidade</H>
        <p className="mt-3 flex items-baseline gap-1.5 text-azul-noite">
          <span className="font-display text-[2.6rem] font-bold leading-none tracking-[-0.03em]">Grátis</span>
        </p>
        <p className="mt-3 text-base leading-relaxed text-tinta-suave">
          Para quem quer acompanhar o ecossistema, participar dos eventos e conhecer gente que empreende no Tocantins.
        </p>
        <Lista itens={COMUNIDADE} />
        <p className="mt-6 text-sm text-tinta-suave">Sem direito a voto nas Assembleias.</p>
        <div className="mt-auto pt-8">
          <Link href={ROTAS_CONTA.comunidade} className={botaoClasse('contorno', 'lg', 'w-full')}>
            Entrar na Comunidade
          </Link>
        </div>
      </div>

      <div className="flex flex-col rounded-ficha bg-azul-fundo p-7 text-white shadow-ficha-alta sm:p-9">
        <H className="font-display text-2xl font-bold">Associado</H>
        <p className="mt-3 text-white">
          <Suspense fallback={<span className="font-display text-3xl font-bold">Anuidade</span>}>
            <Preco />
          </Suspense>
        </p>
        <p className="mt-3 text-base leading-relaxed text-white/85">
          Para startups e pessoas que querem voz e voto nas decisões da Associação e aparecer para o ecossistema.
        </p>
        <Lista itens={ASSOCIADO} escuro />
        <p className="mt-6 text-sm text-white/75">
          Pagamento anual no cartão de crédito, após aprovação do pedido pela Diretoria.
        </p>
        <div className="mt-auto pt-8">
          <Link href={ROTAS_CONTA.associado} className={botaoClasse('primario', 'lg', 'w-full')}>
            Quero me associar
          </Link>
        </div>
      </div>
    </div>
  )
}
