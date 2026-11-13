import Image from 'next/image'
import Link from 'next/link'
import {urlFor} from '@/sanity/image'
import {CATEGORIAS, type Categoria, type EventoResumo, type PostResumo} from '@/sanity/queries'
import {dataCurta, dataLonga, hora, partesData} from '@/lib/formatos'
import {cx, IconeCalendario, IconeChevron, IconeLocal} from '@/components/ui'

/** Selo cheio sobre a foto: cada categoria, uma cor (sempre com texto). */
const seloCategoria: Record<Categoria, string> = {
  noticia: 'bg-roxo text-white',
  edital: 'bg-azul text-white',
  beneficio: 'bg-buriti text-white',
}

/** Capa genérica por categoria quando a publicação não tem foto própria. */
const capaPadrao: Record<Categoria | 'evento', string> = {
  noticia: '/imagens/noticia-comunidade-startups.webp',
  edital: '/imagens/noticia-edital-apoio.webp',
  beneficio: '/imagens/noticia-parceria-beneficios.webp',
  evento: '/imagens/evento-inovacao-palestra.webp',
}

function periodoCurto(inicio: string, fim?: string) {
  const di = dataLonga(inicio)
  if (!fim) return `${di}, ${hora(inicio).replace(':', 'h')}`
  const df = dataLonga(fim)
  const hi = hora(inicio).replace(':', 'h')
  const hf = hora(fim).replace(':', 'h')
  return di === df ? `${di}, ${hi} às ${hf}` : `${di}, ${hi} a ${df}, ${hf}`
}

/** Notícia/edital/benefício em cartão: foto com selo, título e data. */
export function ItemPost({post, comResumo, prioridade}: {post: PostResumo; comResumo?: boolean; prioridade?: boolean}) {
  const capa = post.capa?.asset ? urlFor(post.capa).width(720).height(405).fit('crop').url() : capaPadrao[post.categoria]
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-ficha bg-prancha p-2 ring-1 ring-linha/70 shadow-ficha transition-[box-shadow,transform] duration-300 ease-saida hover:-translate-y-0.5 hover:shadow-ficha-alta">
      <div className="relative">
        <Image
          src={capa}
          alt={post.capa?.alt ?? ''}
          width={720}
          height={405}
          priority={prioridade}
          sizes="(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw"
          className="aspect-[16/9] w-full rounded-[12px] object-cover"
        />
        <span
          className={cx(
            'absolute bottom-2.5 left-2.5 rounded-[12px] px-2 py-0.5 text-xs font-medium',
            seloCategoria[post.categoria],
          )}
        >
          {CATEGORIAS[post.categoria].singular}
        </span>
      </div>
      <div className="flex flex-1 flex-col px-3 pb-3 pt-3.5">
        <h3 className="font-display text-base font-bold leading-snug text-azul-noite">
          <Link href={`/noticias/${post.slug}`} className="after:absolute after:inset-0 group-hover:text-azul">
            {post.titulo}
          </Link>
        </h3>
        {comResumo && post.resumo && (
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-tinta-suave">{post.resumo}</p>
        )}
        <p className="mt-auto flex items-center gap-2 pt-4 text-sm text-tinta-suave">
          <IconeCalendario className="size-4 shrink-0 text-azul-noite" />
          <time dateTime={post.dataPublicacao}>{dataCurta(post.dataPublicacao)}</time>
        </p>
      </div>
    </article>
  )
}

/** Evento: foto, carimbo de data azul-claro, período e local; seta para o detalhe. */
export function ItemEvento({
  evento,
  passado,
  compacto,
}: {
  evento: EventoResumo
  passado?: boolean
  /** Sem foto (listas densas). */
  compacto?: boolean
}) {
  const p = partesData(evento.inicio)
  const local =
    evento.formato === 'online'
      ? 'Online'
      : [evento.local, evento.cidade && `${evento.cidade} – TO`].filter(Boolean).join(' · ')
  const capa = evento.capa?.asset ? urlFor(evento.capa).width(560).height(400).fit('crop').url() : capaPadrao.evento
  return (
    <article
      className={cx(
        'group relative grid h-full gap-4 rounded-ficha bg-prancha p-3 ring-1 ring-linha/70 shadow-ficha sm:p-4',
        'transition-[box-shadow,transform] duration-300 ease-saida hover:-translate-y-0.5 hover:shadow-ficha-alta',
        compacto ? 'grid-cols-[3.5rem_1fr_auto] items-center' : 'sm:grid-cols-[minmax(0,9rem)_3.5rem_1fr_auto] sm:items-center sm:gap-x-4',
        passado && 'opacity-85',
      )}
    >
      {!compacto && (
        <Image
          src={capa}
          alt={evento.capa?.alt ?? ''}
          width={560}
          height={400}
          sizes="(min-width: 640px) 12rem, 100vw"
          className={cx('aspect-[16/9] w-full rounded-[12px] object-cover sm:aspect-[7/5]', passado && 'grayscale-[40%]')}
        />
      )}
      <div className={compacto ? 'contents' : 'flex items-center gap-4 sm:contents'}>
        <div
          className={cx(
            'flex size-14 shrink-0 flex-col items-center justify-center self-center rounded-[12px] text-center ring-1',
            passado ? 'bg-papel text-tinta-suave ring-linha' : 'bg-azul-claro text-azul ring-azul-tinta',
          )}
        >
          <span className="font-display text-[1.5rem] font-bold leading-none">{p.dia}</span>
          <span className="mt-0.5 text-xs font-medium uppercase tracking-[0.06em]">{p.mes}</span>
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-lg font-bold leading-snug text-azul-noite">
            <Link href={`/eventos/${evento.slug}`} className="after:absolute after:inset-0 group-hover:text-azul">
              {evento.titulo}
            </Link>
          </h3>
          <p className="mt-2 flex items-start gap-2 text-[0.9375rem] text-tinta">
            <IconeCalendario className="mt-0.5 size-4 shrink-0 text-tinta-suave" />
            {periodoCurto(evento.inicio, evento.fim)}
          </p>
          {local && (
            <p className="mt-1.5 flex items-start gap-2 text-[0.9375rem] text-tinta">
              <IconeLocal className="mt-0.5 size-4 shrink-0 text-tinta-suave" /> {local}
            </p>
          )}
        </div>
      </div>
      <IconeChevron className="hidden size-5 text-azul-noite transition-transform duration-300 ease-saida group-hover:translate-x-1 sm:block" />
    </article>
  )
}
