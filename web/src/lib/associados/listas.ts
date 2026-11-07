import 'server-only'
import {cacheLife, cacheTag} from 'next/cache'

/** Títulos das listas controladas (Sanity, dataset público), para e-mails, admin e exportação. */
type Item = {slug: string; titulo: string}
export type Listas = {setores: Item[]; estagios: Item[]; cidades: Item[]}

const PROJECT = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'megra9kk'
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

const QUERY = `{
  "setores": *[_type=="setor" && !(_id in path("drafts.**"))]|order(ordem asc){"slug": slug.current, titulo},
  "estagios": *[_type=="estagio" && !(_id in path("drafts.**"))]|order(ordem asc){"slug": slug.current, titulo},
  "cidades": *[_type=="cidade" && !(_id in path("drafts.**"))]|order(titulo asc){"slug": slug.current, titulo}
}`

export async function getListas(): Promise<Listas> {
  'use cache'
  cacheLife('hours')
  cacheTag('listas')
  const url = `https://${PROJECT}.apicdn.sanity.io/v2026-02-01/data/query/${DATASET}?query=${encodeURIComponent(QUERY)}`
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Sanity ${res.status}`)
    const json = (await res.json()) as {result: Listas}
    return json.result
  } catch (e) {
    console.error('[listas]', e)
    return {setores: [], estagios: [], cidades: []}
  }
}

export function tituloDe(lista: Item[], slug: string | null | undefined): string {
  if (!slug) return '—'
  return lista.find((i) => i.slug === slug)?.titulo ?? slug
}
