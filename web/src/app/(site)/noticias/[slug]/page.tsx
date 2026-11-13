import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {CATEGORIAS, getPost, getPosts} from '@/sanity/queries'
import {urlFor} from '@/sanity/image'
import {dataLonga} from '@/lib/formatos'
import {TextoRico} from '@/components/site/TextoRico'
import {BotaoLink, Container, Selo} from '@/components/ui'

const VAZIO = '__sem-publicacoes__'

/** Página por slug, pré-gerada em generateStaticParams: sem validação de navegação instantânea. */
export const instant = false

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.length ? posts.map((p) => ({slug: p.slug})) : [{slug: VAZIO}]
}

export async function generateMetadata(props: PageProps<'/noticias/[slug]'>): Promise<Metadata> {
  const {slug} = await props.params
  const p = slug === VAZIO ? null : await getPost(slug)
  if (!p) return {title: 'Publicação não encontrada'}
  const img = p.seo?.imagem?.asset ? p.seo.imagem : p.capa
  return {
    title: p.seo?.titulo ?? p.titulo,
    description: p.seo?.descricao ?? p.resumo,
    alternates: {canonical: `/noticias/${p.slug}`},
    openGraph: {
      type: 'article',
      publishedTime: p.dataPublicacao,
      images: img?.asset ? [{url: urlFor(img).width(1200).height(630).fit('crop').url(), width: 1200, height: 630}] : undefined,
    },
  }
}

const tom = {noticia: 'roxo', edital: 'azul', beneficio: 'buriti'} as const

export default async function PostPage(props: PageProps<'/noticias/[slug]'>) {
  const {slug} = await props.params
  const post = slug === VAZIO ? null : await getPost(slug)
  if (!post) notFound()
  return (
    <article className="relative overflow-hidden bg-papel">
      <span aria-hidden="true" className="campo-ipe pointer-events-none absolute -left-10 top-6 hidden h-48 w-28 md:block" />
      <Container className="relative pb-6 pt-10 sm:pt-12">
        <Link href="/noticias" className="inline-flex min-h-11 items-center text-[0.9375rem] font-medium text-azul hover:underline">
          ← Notícias, editais e benefícios
        </Link>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-[0.9375rem] text-tinta-suave">
          <Selo tom={tom[post.categoria]}>{CATEGORIAS[post.categoria].singular}</Selo>
          <time dateTime={post.dataPublicacao}>{dataLonga(post.dataPublicacao)}</time>
        </div>
        <h1 className="mt-4 max-w-[22ch] font-display text-[clamp(2rem,4.4vw,3.25rem)] font-bold leading-[1.08] tracking-[-0.02em] text-azul-noite">
          {post.titulo}
        </h1>
        {post.resumo && (
          <p className="mt-4 max-w-[60ch] text-lg leading-relaxed text-tinta-suave">{post.resumo}</p>
        )}
      </Container>
      {post.capa?.asset && (
        <Container className="py-6">
          <Image
            src={urlFor(post.capa).width(1600).height(900).fit('crop').url()}
            alt={post.capa.alt ?? ''}
            width={1600}
            height={900}
            priority
            sizes="(min-width: 1216px) 1152px, 100vw"
            className="aspect-[16/9] h-auto w-full max-w-5xl rounded-faixa object-cover shadow-ficha"
          />
        </Container>
      )}
      <Container className="pb-20 pt-6">
        <TextoRico valor={post.corpo} />
        {post.categoria === 'beneficio' && (
          <div className="mt-12 max-w-[70ch] rounded-ficha bg-buriti-claro p-6 ring-1 ring-buriti/20">
            <p className="font-display text-lg font-bold text-[#0f4d27]">Benefício para associados</p>
            <p className="mt-1 text-base text-[#0f4d27]">
              Associados em dia aproveitam este e outros benefícios.
            </p>
            <BotaoLink href="/associe-se" variante="secundario" className="mt-4">
              Conheça a associação
            </BotaoLink>
          </div>
        )}
      </Container>
    </article>
  )
}
