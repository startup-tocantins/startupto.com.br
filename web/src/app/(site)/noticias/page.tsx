import type {Metadata} from 'next'
import Link from 'next/link'
import {Suspense} from 'react'
import {CATEGORIAS, getPosts, type Categoria} from '@/sanity/queries'
import {ItemPost} from '@/components/site/Itens'
import {cx, EstadoVazio, Prancha} from '@/components/ui'

export const metadata: Metadata = {
  title: 'Notícias, editais e benefícios',
  description: 'Notícias do ecossistema de startups do Tocantins, editais abertos e benefícios para associados.',
  alternates: {canonical: '/noticias'},
}

const FILTROS: Array<{valor: Categoria | null; rotulo: string}> = [
  {valor: null, rotulo: 'Tudo'},
  {valor: 'noticia', rotulo: CATEGORIAS.noticia.plural},
  {valor: 'edital', rotulo: CATEGORIAS.edital.plural},
  {valor: 'beneficio', rotulo: CATEGORIAS.beneficio.plural},
]

async function Lista({searchParams}: {searchParams: PageProps<'/noticias'>['searchParams']}) {
  const sp = await searchParams
  const bruto = Array.isArray(sp.categoria) ? sp.categoria[0] : sp.categoria
  const categoria = bruto && bruto in CATEGORIAS ? (bruto as Categoria) : null
  const posts = (await getPosts()).filter((p) => !categoria || p.categoria === categoria)

  return (
    <>
      <nav aria-label="Filtrar por categoria" className="mb-8">
        <ul className="flex flex-wrap gap-2">
          {FILTROS.map((f) => {
            const on = f.valor === categoria
            return (
              <li key={f.rotulo}>
                <Link
                  href={f.valor ? `/noticias?categoria=${f.valor}` : '/noticias'}
                  aria-current={on ? 'page' : undefined}
                  scroll={false}
                  className={cx(
                    'inline-flex min-h-11 items-center rounded-full px-5 text-[0.9375rem] font-medium transition-colors',
                    on ? 'bg-azul text-white' : 'bg-prancha text-azul-noite ring-1 ring-linha hover:ring-azul',
                  )}
                >
                  {f.rotulo}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      {posts.length ? (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => (
            <li key={p._id}>
              <ItemPost post={p} comResumo prioridade={i < 3} />
            </li>
          ))}
        </ul>
      ) : (
        <EstadoVazio titulo={categoria ? `Nenhum ${CATEGORIAS[categoria].singular.toLowerCase()} publicado ainda` : 'Nenhuma publicação ainda'}>
          Assim que a Diretoria publicar, as novidades aparecem aqui.
        </EstadoVazio>
      )}
    </>
  )
}

export default function Noticias(props: PageProps<'/noticias'>) {
  return (
    <Prancha
      nivel={1}
      rotulo="Notícias e oportunidades"
      titulo="Notícias, editais e benefícios"
      introducao="O que está acontecendo no ecossistema, oportunidades abertas e vantagens para quem é associado."
      fundo="papel"
     
    >
      <Suspense fallback={<div className="h-64 animate-pulse rounded-ficha bg-linha/40" aria-hidden="true" />}>
        <Lista searchParams={props.searchParams} />
      </Suspense>
    </Prancha>
  )
}
