import Image from 'next/image'
import type {VitrineCard} from '@/lib/supabase/vitrine'
import type {ItemLista} from '@/sanity/queries'
import {iniciais} from '@/lib/formatos'
import {IconeExterno, IconeLocal, IconeSetor, Selo, cx} from '@/components/ui'

export type Listas = {setores: ItemLista[]; estagios: ItemLista[]; cidades: ItemLista[]}

export const tituloDe = (lista: ItemLista[], slug: string | null | undefined) =>
  slug ? (lista.find((i) => i.slug === slug)?.titulo ?? slug) : null

function formatarSiteUrl(site: string | null | undefined): string | null {
  if (!site) return null
  const limpo = site.trim()
  if (!limpo) return null
  if (/^https?:\/\//i.test(limpo)) {
    return limpo
  }
  return `https://${limpo}`
}

function dominio(site: string) {
  try {
    const url = site.trim().startsWith('http') ? site.trim() : `https://${site.trim()}`
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return site.trim()
  }
}

/** Cartão de uma startup associada: símbolo, nome, setor, cidade e selo “Fundador”. */
export function VitrineFicha({card, listas, compacta}: {card: VitrineCard; listas: Listas; compacta?: boolean}) {
  const setor = tituloDe(listas.setores, card.setor)
  const estagio = tituloDe(listas.estagios, card.estagio)
  const cidade = tituloDe(listas.cidades, card.cidade)
  const siteUrl = formatarSiteUrl(card.site)

  return (
    <article
      className={cx(
        'relative flex h-full flex-col rounded-ficha bg-prancha p-4 ring-1 ring-linha shadow-ficha sm:p-5',
        siteUrl &&
          'group transition-[box-shadow,transform] duration-300 ease-saida hover:-translate-y-0.5 hover:shadow-ficha-alta focus-within:shadow-ficha-alta focus-within:ring-2 focus-within:ring-azul',
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-papel">
          {card.logo_url ? (
            <Image
              src={card.logo_url}
              alt={`Logo de ${card.nome_startup}`}
              width={56}
              height={56}
              className="size-full object-contain p-1"
            />
          ) : (
            <span className="font-display text-lg font-bold text-azul" aria-hidden="true">
              {iniciais(card.nome_startup)}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg font-bold leading-tight text-azul-noite">
              {siteUrl ? (
                <a
                  href={siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="after:absolute after:inset-0 group-hover:text-azul focus:outline-none"
                >
                  {card.nome_startup}
                  <span className="sr-only"> (abre o site em nova aba)</span>
                </a>
              ) : (
                card.nome_startup
              )}
            </h3>
            {card.categoria === 'fundador' && (
              <Selo tom="ipe" className="shrink-0">
                Fundador
              </Selo>
            )}
          </div>
          <ul className="mt-2 flex flex-col gap-1 text-sm text-tinta">
            {setor && (
              <li className="flex items-center gap-2">
                <IconeSetor className="size-4 shrink-0 text-tinta-suave" />
                <span className="sr-only">Setor:</span> {setor}
              </li>
            )}
            {cidade && (
              <li className="flex items-center gap-2">
                <IconeLocal className="size-4 shrink-0 text-tinta-suave" />
                <span className="sr-only">Cidade:</span> {cidade} – TO
              </li>
            )}
            {!compacta && estagio && (
              <li className="flex items-center gap-2 text-tinta-suave">
                <span className="inline-block size-4 shrink-0 text-center" aria-hidden="true">
                  •
                </span>
                Estágio: {estagio}
              </li>
            )}
          </ul>
        </div>
      </div>
      {!compacta && card.site && (
        <span
          className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-3 text-[0.9375rem] font-medium text-azul group-hover:text-azul-fundo group-hover:underline"
          aria-hidden="true"
        >
          {dominio(card.site)}
          <IconeExterno className="size-3.5" />
        </span>
      )}
    </article>
  )
}
