import Image from 'next/image'
import Link from 'next/link'
import {urlFor} from '@/sanity/image'
import {CATEGORIAS, type EventoResumo, type PostResumo} from '@/sanity/queries'
import {dataLonga, hora, partesData} from '@/lib/formatos'
import {cx, IconeLocal, Selo} from '@/components/ui'

const tomCategoria = {noticia: 'azul', edital: 'laranja', beneficio: 'buriti'} as const

/** Notícia/edital/benefício em lista: título forte, data e categoria. */
export function ItemPost({post, compacto}: {post: PostResumo; compacto?: boolean}) {
  return (
    <article className="group relative grid gap-4 border-t border-linha py-6 sm:grid-cols-[1fr_auto] sm:gap-8">
      <div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-tinta-suave">
          <Selo tom={tomCategoria[post.categoria]}>{CATEGORIAS[post.categoria].singular}</Selo>
          <time dateTime={post.dataPublicacao}>{dataLonga(post.dataPublicacao)}</time>
        </div>
        <h3 className={cx('mt-2 font-display font-bold leading-snug text-azul-noite', compacto ? 'text-lg' : 'text-xl sm:text-2xl')}>
          <Link href={`/noticias/${post.slug}`} className="after:absolute after:inset-0 group-hover:underline">
            {post.titulo}
          </Link>
        </h3>
        {post.resumo && !compacto && (
          <p className="mt-2 max-w-[62ch] font-texto text-[1.0625rem] leading-relaxed text-tinta-suave">{post.resumo}</p>
        )}
      </div>
      {post.capa?.asset && !compacto && (
        <Image
          src={urlFor(post.capa).width(480).height(320).fit('crop').url()}
          alt={post.capa.alt ?? ''}
          width={240}
          height={160}
          className="aspect-[3/2] w-full rounded-[4px] object-cover sm:w-60"
        />
      )}
    </article>
  )
}

/** Evento: carimbo de data à esquerda, etiqueta de local. */
export function ItemEvento({evento, passado}: {evento: EventoResumo; passado?: boolean}) {
  const p = partesData(evento.inicio)
  const local =
    evento.formato === 'online'
      ? 'Online'
      : [evento.local, evento.cidade && `${evento.cidade} – TO`].filter(Boolean).join(' · ')
  return (
    <article
      className={cx(
        'group relative grid grid-cols-[4.75rem_1fr] gap-4 rounded-ficha bg-prancha p-4 ring-1 ring-linha shadow-ficha sm:grid-cols-[5.5rem_1fr] sm:gap-6 sm:p-5',
        'transition-[box-shadow,transform] duration-300 ease-saida hover:-translate-y-0.5 hover:shadow-ficha-alta',
        passado && 'opacity-85',
      )}
    >
      <div
        className={cx(
          'flex flex-col items-center justify-center rounded-[4px] py-2 text-center',
          passado ? 'bg-papel text-tinta-suave' : 'bg-buriti text-white',
        )}
      >
        <span className="text-xs font-semibold uppercase tracking-[0.12em]">{p.mes}</span>
        <span className="font-display text-[2rem] font-extrabold leading-none sm:text-[2.4rem]">{p.dia}</span>
        <span className="text-xs opacity-80">{p.ano}</span>
      </div>
      <div className="min-w-0 self-center">
        <h3 className="font-display text-lg font-bold leading-snug text-azul-noite sm:text-xl">
          <Link href={`/eventos/${evento.slug}`} className="after:absolute after:inset-0 group-hover:underline">
            {evento.titulo}
          </Link>
        </h3>
        <p className="mt-1 text-[0.9375rem] capitalize text-tinta-suave">
          {p.semana}, {hora(evento.inicio)}
        </p>
        {local && (
          <p className="mt-1 flex items-center gap-1.5 font-texto text-[1rem] italic text-tinta-suave">
            <IconeLocal className="size-4 shrink-0 not-italic text-buriti" /> {local}
          </p>
        )}
      </div>
    </article>
  )
}
