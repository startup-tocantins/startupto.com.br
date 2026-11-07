import Image from 'next/image'
import type {VitrineCard} from '@/lib/supabase/vitrine'
import type {ItemLista} from '@/sanity/queries'
import {iniciais} from '@/lib/formatos'
import {Etiqueta, IconeExterno, Selo} from '@/components/ui'

export type Listas = {setores: ItemLista[]; estagios: ItemLista[]; cidades: ItemLista[]}

export const tituloDe = (lista: ItemLista[], slug: string | null | undefined) =>
  slug ? (lista.find((i) => i.slug === slug)?.titulo ?? slug) : null

function dominio(site: string) {
  try {
    return new URL(site.startsWith('http') ? site : `https://${site}`).hostname.replace(/^www\./, '')
  } catch {
    return site
  }
}

/** Ficha de herbário de uma startup associada. */
export function VitrineFicha({card, listas}: {card: VitrineCard; listas: Listas}) {
  const setor = tituloDe(listas.setores, card.setor)
  const estagio = tituloDe(listas.estagios, card.estagio)
  const cidade = tituloDe(listas.cidades, card.cidade)
  return (
    <article className="flex h-full flex-col rounded-ficha bg-prancha p-4 ring-1 ring-linha shadow-ficha">
      <div className="flex items-start gap-3.5">
        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-[4px] bg-papel ring-1 ring-linha">
          {card.logo_url ? (
            <Image
              src={card.logo_url}
              alt={`Logo de ${card.nome_startup}`}
              width={64}
              height={64}
              className="size-full object-contain p-1.5"
            />
          ) : (
            <span className="font-display text-xl font-extrabold text-azul" aria-hidden="true">
              {iniciais(card.nome_startup)}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-bold leading-tight text-azul-noite">{card.nome_startup}</h3>
          {card.categoria === 'fundador' && (
            <Selo tom="laranja" className="mt-1.5">
              Fundador
            </Selo>
          )}
        </div>
      </div>
      <Etiqueta
        className="mt-4"
        linhas={[
          cidade && {rotulo: 'Localidade', valor: `${cidade} – TO`},
          setor && {rotulo: 'Setor', valor: setor},
          estagio && {rotulo: 'Estágio', valor: estagio},
        ]}
      />
      {card.site && (
        <a
          href={card.site.startsWith('http') ? card.site : `https://${card.site}`}
          rel="noopener"
          target="_blank"
          className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-3 text-[0.9375rem] font-semibold text-azul hover:text-azul-noite hover:underline"
        >
          {dominio(card.site)}
          <IconeExterno className="size-3.5" />
          <span className="sr-only">(abre em nova aba)</span>
        </a>
      )}
    </article>
  )
}
