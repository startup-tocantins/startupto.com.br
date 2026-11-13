import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {getEvento, getEventos} from '@/sanity/queries'
import {urlFor} from '@/sanity/image'
import {partesData, periodoEvento} from '@/lib/formatos'
import {TextoRico} from '@/components/site/TextoRico'
import {BotaoLink, Container, Etiqueta, IconeCalendario, IconeExterno} from '@/components/ui'

const VAZIO = '__sem-eventos__'
const FORMATO = {presencial: 'Presencial', online: 'Online', hibrido: 'Híbrido'}

/** Página por slug, pré-gerada em generateStaticParams: sem validação de navegação instantânea. */
export const instant = false

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
      <header className="relative overflow-hidden">
        <span aria-hidden="true" className="campo-ipe pointer-events-none absolute -left-10 top-6 hidden h-48 w-28 md:block" />
        <Container className="relative pb-2 pt-10 sm:pt-12">
          <Link href="/eventos" className="inline-flex min-h-11 items-center gap-1.5 text-[0.9375rem] font-medium text-azul hover:underline">
            ← Eventos
          </Link>
          <div className="mt-3 flex items-start gap-5">
            <div className="hidden size-[4.5rem] shrink-0 flex-col items-center justify-center rounded-[14px] bg-azul-claro text-azul ring-1 ring-azul-tinta sm:flex">
              <span className="font-display text-[1.875rem] font-bold leading-none">{partesData(e.inicio).dia}</span>
              <span className="mt-0.5 text-xs font-medium uppercase tracking-[0.06em]">{partesData(e.inicio).mes}</span>
            </div>
            <div>
              <h1 className="max-w-[24ch] font-display text-[clamp(2rem,4.4vw,3.25rem)] font-bold leading-[1.08] tracking-[-0.02em] text-azul-noite">
                {e.titulo}
              </h1>
              <p className="mt-3 flex items-center gap-2 text-lg text-tinta first-letter:uppercase">
                <IconeCalendario className="size-5 shrink-0 text-azul" />
                {periodoEvento(e.inicio, e.fim)}
              </p>
            </div>
          </div>
        </Container>
      </header>
      <Container className="grid gap-10 pb-16 pt-8 lg:grid-cols-[1fr_22rem] lg:gap-14 lg:pb-20">
        <div>
          {e.capa?.asset && (
            <Image
              src={urlFor(e.capa).width(1400).height(788).fit('crop').url()}
              alt={e.capa.alt ?? ''}
              width={1400}
              height={788}
              priority
              className="mb-10 aspect-[16/9] h-auto w-full rounded-faixa object-cover shadow-ficha"
            />
          )}
          {e.resumo && <p className="mb-6 max-w-[60ch] text-lg leading-snug text-azul-noite">{e.resumo}</p>}
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
