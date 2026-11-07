import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {getEvento, getEventos} from '@/sanity/queries'
import {urlFor} from '@/sanity/image'
import {periodoEvento} from '@/lib/formatos'
import {TextoRico} from '@/components/site/TextoRico'
import {BotaoLink, Container, Etiqueta, IconeCalendario, IconeExterno} from '@/components/ui'

const VAZIO = '__sem-eventos__'
const FORMATO = {presencial: 'Presencial', online: 'Online', hibrido: 'Híbrido'}

export async function generateStaticParams() {
  const eventos = await getEventos()
  return eventos.length ? eventos.map((e) => ({slug: e.slug})) : [{slug: VAZIO}]
}

export async function generateMetadata(props: PageProps<'/eventos/[slug]'>): Promise<Metadata> {
  const {slug} = await props.params
  const e = slug === VAZIO ? null : await getEvento(slug)
  if (!e) return {title: 'Evento não encontrado'}
  return {
    title: e.seo?.titulo ?? e.titulo,
    description: e.seo?.descricao ?? e.resumo ?? `${periodoEvento(e.inicio, e.fim)}`,
    alternates: {canonical: `/eventos/${e.slug}`},
    openGraph: e.capa?.asset
      ? {images: [{url: urlFor(e.capa).width(1200).height(630).fit('crop').url(), width: 1200, height: 630}]}
      : undefined,
  }
}

export default async function EventoPage(props: PageProps<'/eventos/[slug]'>) {
  const {slug} = await props.params
  const e = slug === VAZIO ? null : await getEvento(slug)
  if (!e) notFound()
  const local =
    e.formato === 'online'
      ? null
      : [e.local, e.cidade && `${e.cidade} – TO`].filter(Boolean).join(', ') || null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: e.titulo,
    startDate: e.inicio,
    endDate: e.fim,
    eventAttendanceMode:
      e.formato === 'online'
        ? 'https://schema.org/OnlineEventAttendanceMode'
        : e.formato === 'hibrido'
          ? 'https://schema.org/MixedEventAttendanceMode'
          : 'https://schema.org/OfflineEventAttendanceMode',
    location: local ? {'@type': 'Place', name: local, address: local} : undefined,
    organizer: {'@type': 'Organization', name: 'Associação Tocantinense de Startups'},
  }

  return (
    <article className="bg-papel">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd).replace(/</g, '\\u003c')}} />
      <header className="bg-buriti text-white">
        <Container className="py-12 sm:py-16">
          <Link href="/eventos" className="inline-flex min-h-11 items-center text-[0.9375rem] font-semibold text-white/85 hover:text-white hover:underline">
            ← Eventos
          </Link>
          <h1 className="mt-3 max-w-[22ch] font-display text-[clamp(2.1rem,4.8vw,3.6rem)] font-extrabold leading-[1.04]">
            {e.titulo}
          </h1>
          <p className="mt-4 font-texto text-[1.375rem] italic text-white/90 first-letter:uppercase">
            {periodoEvento(e.inicio, e.fim)}
          </p>
        </Container>
      </header>
      <Container className="grid gap-10 py-12 lg:grid-cols-[1fr_22rem] lg:gap-16 lg:py-16">
        <div>
          {e.capa?.asset && (
            <Image
              src={urlFor(e.capa).width(1400).height(788).fit('crop').url()}
              alt={e.capa.alt ?? ''}
              width={1400}
              height={788}
              priority
              className="mb-10 aspect-[16/9] h-auto w-full rounded-ficha object-cover"
            />
          )}
          {e.resumo && <p className="mb-6 max-w-[60ch] font-texto text-[1.3125rem] leading-snug text-azul-noite">{e.resumo}</p>}
          <TextoRico valor={e.descricao} />
        </div>
        <aside className="self-start rounded-ficha bg-prancha p-6 ring-1 ring-linha shadow-ficha lg:sticky lg:top-28">
          <Etiqueta
            linhas={[
              {rotulo: 'Quando', valor: periodoEvento(e.inicio, e.fim)},
              e.formato && {rotulo: 'Formato', valor: FORMATO[e.formato]},
              local && {rotulo: 'Local', valor: local},
            ]}
          />
          <div className="mt-6 flex flex-col gap-3">
            {e.linkInscricao && (
              <BotaoLink href={e.linkInscricao} tamanho="lg" target="_blank" rel="noopener">
                Inscrever-se <IconeExterno />
                <span className="sr-only">(abre em nova aba)</span>
              </BotaoLink>
            )}
            <BotaoLink href={`/eventos/${e.slug}/agenda.ics`} variante="contorno" download>
              <IconeCalendario /> Adicionar à agenda
            </BotaoLink>
          </div>
        </aside>
      </Container>
    </article>
  )
}
