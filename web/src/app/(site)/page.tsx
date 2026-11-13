import {agoraMs} from '@/lib/formatos'
import Image from 'next/image'
import Link from 'next/link'
import {Suspense, type ReactNode} from 'react'
import {connection} from 'next/server'
import type {PortableTextBlock} from 'next-sanity'
import {getVitrine} from '@/lib/supabase/vitrine'
import {
  getConfiguracoes,
  getEventos,
  getListas,
  getMantenedores,
  getPosts,
  getValores,
} from '@/sanity/queries'
import {urlFor} from '@/sanity/image'
import {ItemEvento, ItemPost} from '@/components/site/Itens'
import {Carrossel} from '@/components/site/Carrossel'
import {Modalidades} from '@/components/site/Modalidades'
import {VitrineFicha} from '@/components/site/VitrineFicha'
import {
  BotaoLink,
  CabecalhoSecao,
  Container,
  EstadoVazio,
  IconeAgenda,
  IconeCamadas,
  IconeDiamante,
  IconeFoguete,
  IconeNoticias,
  IconeOlho,
  IconeParceria,
  IconeSeta,
  LinkSeta,
  Prancha,
  Rotulo,
} from '@/components/ui'
import {ROTAS_CONTA} from '@/components/site/navegacao'
import {JsonLdOrganizacao} from '@/components/site/JsonLd'

const CHAMADA_PADRAO = 'Conectando startups, pessoas e oportunidades no Tocantins'

/** Texto puro do primeiro bloco de um Portable Text. */
function primeiroParagrafo(blocos?: PortableTextBlock[]) {
  const b = blocos?.find((x) => x._type === 'block')
  if (!b || !Array.isArray(b.children)) return null
  return (b.children as Array<{text?: string}>).map((c) => c.text ?? '').join('')
}

/** Primeira oração de um texto institucional longo (até a primeira vírgula), para a faixa da Home. */
function primeiraOracao(texto?: string) {
  if (!texto) return null
  const corte = texto.indexOf(', ')
  const curto = corte >= 40 ? texto.slice(0, corte) : texto
  return curto.replace(/[.;:]?\s*$/, '.')
}

/* ---------------- Abertura ---------------- */

async function Abertura() {
  const c = await getConfiguracoes()
  const titulo = c.heroTitulo && c.heroTitulo !== c.nomeOficial ? c.heroTitulo : CHAMADA_PADRAO
  const texto =
    primeiroParagrafo(c.introducao) ??
    'A entidade que representa, conecta e fortalece as startups tocantinenses, impulsionando a inovação no estado.'
  return (
    <section className="relative isolate overflow-hidden" aria-labelledby="abertura-titulo">
      {/* luz suave de fundo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(60rem_30rem_at_20%_0%,#ffffff_0%,transparent_60%),radial-gradient(40rem_24rem_at_100%_100%,#eaf2fd_0%,transparent_70%)]"
      />
      <span aria-hidden="true" className="campo-ipe pointer-events-none absolute -left-12 top-4 -z-10 hidden h-64 w-24 sm:block sm:h-80 sm:w-32 lg:top-0 lg:h-[19rem] lg:w-36 xl:w-44" />

      {/* Foto de Palmas: paralelogramo que sangra para a direita no desktop */}
      <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-[52%] lg:block xl:w-[58%]">
        <div className="recorte-hero absolute bottom-24 right-0 top-2 h-1/2 w-full -translate-x-9 bg-azul-claro/80" />
        <div className="recorte-hero absolute bottom-24 right-0 top-2 w-full -translate-x-[3px] bg-laranja" />
        <div className="recorte-hero absolute bottom-24 right-0 top-2 w-full overflow-hidden">
          <Image
            src="/imagens/palmas-por-do-sol-hero.webp"
            alt=""
            fill
            priority
            sizes="54vw"
            className="object-cover object-[60%_50%]"
          />
        </div>
        <span className="absolute -right-12 bottom-8 h-44 w-36 rounded-[44px] border-2 border-laranja/80" />
      </div>

      <Container className="relative grid gap-10 pb-10 pt-8 sm:pt-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:pb-24 lg:pt-8">
        <div className="relative max-w-[34rem] lg:max-w-[31rem]">
          <Rotulo>Ecossistema de inovação do Tocantins</Rotulo>
          <h1
            id="abertura-titulo"
            className="mt-4 font-display text-[clamp(2rem,2.6vw,2.4rem)] font-bold leading-[1.1] tracking-[-0.02em] text-azul-noite"
          >
            {titulo}
          </h1>
          <p className="mt-4 max-w-[48ch] text-[1.0625rem] leading-relaxed text-tinta">{texto}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <BotaoLink href="/associe-se" tamanho="lg" className="px-7">
              Associe-se agora <IconeSeta />
            </BotaoLink>
            <BotaoLink href="/quem-somos" variante="contorno" tamanho="lg">
              <span aria-hidden="true" className="size-3 rounded-full rounded-bl-[2px] bg-azul" />
              Conheça a Associação
            </BotaoLink>
          </div>
          <p className="mt-5 text-[0.9375rem] text-tinta-suave">
            A Comunidade é gratuita.{' '}
            <Link href={ROTAS_CONTA.comunidade} className="font-medium text-azul underline hover:text-azul-fundo">
              Entre em 1 minuto
            </Link>
            .
          </p>
        </div>

        {/* Celular e tablet: foto em fluxo */}
        <div className="relative lg:hidden">
          <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-faixa bg-laranja" aria-hidden="true" />
          <Image
            src="/imagens/palmas-por-do-sol-hero.webp"
            alt="Palmas ao pôr do sol, com a orla do lago e a ponte"
            width={1600}
            height={800}
            priority
            sizes="100vw"
            className="relative aspect-[2/1] w-full rounded-faixa object-cover"
          />
        </div>
      </Container>
    </section>
  )
}

/* ---------------- Missão, visão, valores ---------------- */

async function FaixaIdentidade() {
  const [c, valores] = await Promise.all([getConfiguracoes(), getValores()])
  const itens: Array<{titulo: string; texto: string | null; icone: ReactNode}> = [
    {titulo: 'Missão', texto: primeiraOracao(c.missaoCurta), icone: <IconeFoguete />},
    {titulo: 'Visão', texto: primeiraOracao(c.visao), icone: <IconeOlho />},
    {
      titulo: 'Valores',
      texto: valores.length
        ? `${valores
            .map((v, i) => (i === 0 ? v.titulo : v.titulo.toLowerCase()))
            .join(', ')
            .replace(/, ([^,]*)$/, ' e $1')}.`
        : null,
      icone: <IconeDiamante />,
    },
  ]
  return (
    <div className="relative z-10 lg:-mt-20">
      <Container>
        <Link
          href="/quem-somos"
          aria-label="Missão, visão e valores — ler na página Quem somos"
          className="group grid gap-6 rounded-faixa bg-prancha/95 px-6 py-6 ring-1 ring-linha/70 shadow-ficha transition-shadow duration-300 hover:shadow-ficha-alta sm:px-8 md:grid-cols-3 md:gap-0 md:py-6"
        >
          {itens
            .filter((i) => i.texto)
            .map((i, n) => (
              <div
                key={i.titulo}
                className={`flex items-start gap-4 md:px-6 lg:px-8 ${n > 0 ? 'border-t border-linha pt-6 md:border-l md:border-t-0 md:pt-0' : ''}`}
              >
                <span className="shrink-0 text-azul [&>svg]:size-10 lg:[&>svg]:size-11">{i.icone}</span>
                <span>
                  <span className="block font-display text-xl font-bold text-azul-noite">{i.titulo}</span>
                  <span className="mt-1 block text-[0.9375rem] leading-snug text-tinta">{i.texto}</span>
                </span>
              </div>
            ))}
        </Link>
      </Container>
    </div>
  )
}

/* ---------------- Eventos ---------------- */

async function ProximosEventos() {
  await connection()
  const agora = agoraMs()
  const eventos = (await getEventos())
    .filter((e) => new Date(e.fim ?? e.inicio).getTime() >= agora)
    .slice(0, 4)
  if (!eventos.length) {
    return (
      <EstadoVazio
        titulo="Nenhum evento agendado no momento"
        acao={
          <BotaoLink href={ROTAS_CONTA.comunidade} variante="contorno">
            Avise-me pelo grupo da Comunidade
          </BotaoLink>
        }
      >
        Os próximos encontros, mentorias e capacitações aparecem aqui assim que forem anunciados.
      </EstadoVazio>
    )
  }
  return (
    <Carrossel rotulo="Próximos eventos">
      {eventos.map((e) => (
        <ItemEvento key={e._id} evento={e} />
      ))}
    </Carrossel>
  )
}

/* ---------------- Notícias ---------------- */

async function UltimasNoticias() {
  const posts = (await getPosts()).slice(0, 3)
  if (!posts.length) {
    return (
      <EstadoVazio titulo="As primeiras notícias estão a caminho">
        Notícias do ecossistema, editais abertos e benefícios para associados serão publicados aqui.
      </EstadoVazio>
    )
  }
  return (
    <ul className="grid gap-4 sm:grid-cols-3">
      {posts.map((p) => (
        <li key={p._id}>
          <ItemPost post={p} />
        </li>
      ))}
    </ul>
  )
}

/* ---------------- Vitrine ---------------- */

async function PreviaVitrine() {
  const [vitrine, listas] = await Promise.all([getVitrine(), getListas()])
  if (!vitrine.length) {
    return (
      <EstadoVazio
        titulo="A Vitrine começa com a sua startup"
        acao={<BotaoLink href={ROTAS_CONTA.associado}>Quero aparecer na Vitrine <IconeSeta /></BotaoLink>}
      >
        Associados em dia que autorizarem a exibição terão a startup apresentada aqui, com setor, estágio e cidade.
      </EstadoVazio>
    )
  }
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {vitrine.slice(0, 4).map((card) => (
        <li key={card.id}>
          <VitrineFicha card={card} listas={listas} compacta />
        </li>
      ))}
    </ul>
  )
}

/* ---------------- Mantenedores ---------------- */

async function FaixaMantenedores() {
  const [mantenedores, c] = await Promise.all([getMantenedores(), getConfiguracoes()])
  return (
    <section className="py-10 sm:py-12" aria-labelledby="mantenedores-titulo">
      <Container className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">
        <div className="flex items-start gap-3.5 lg:w-[25rem] lg:shrink-0 lg:border-r lg:border-linha lg:pr-10">
          <IconeParceria className="mt-0.5 size-9 shrink-0 text-azul" />
          <div>
            <h2 id="mantenedores-titulo" className="font-display text-[1.625rem] font-bold leading-tight text-azul-noite">
              Nossos Mantenedores
            </h2>
            <p className="mt-1 text-[0.9375rem] leading-snug text-tinta">
              Parceiros que acreditam e investem no ecossistema de startups do Tocantins.
            </p>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-5 rounded-faixa bg-prancha px-6 py-5 ring-1 ring-linha/70 shadow-ficha sm:flex-row sm:items-center sm:px-8">
          {mantenedores.length ? (
            <ul className="flex flex-1 flex-wrap items-center justify-around gap-x-10 gap-y-5">
              {mantenedores.map((m) => {
                const logo = m.logo?.asset ? (
                  <Image
                    src={urlFor(m.logo).height(112).fit('max').url()}
                    alt={m.nome}
                    width={180}
                    height={56}
                    className="h-12 w-auto object-contain"
                  />
                ) : (
                  <span className="font-display text-lg font-bold text-azul-noite">{m.nome}</span>
                )
                return (
                  <li key={m._id}>
                    {m.link ? (
                      <a href={m.link} rel="noopener" className="block opacity-90 transition-opacity hover:opacity-100">
                        {logo}
                      </a>
                    ) : (
                      logo
                    )}
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="flex-1 text-[0.9375rem] leading-relaxed text-tinta-suave">
              Sua organização pode apoiar o ecossistema de startups do Tocantins e integrar o Conselho Consultivo.{' '}
              {c.email && (
                <a href={`mailto:${c.email}?subject=Quero%20ser%20mantenedor`} className="font-medium text-azul underline">
                  Fale com a Diretoria
                </a>
              )}
            </p>
          )}
          <BotaoLink href="/mantenedores" variante="contorno" tamanho="sm" className="shrink-0 self-start sm:self-center">
            Ver todos <IconeSeta />
          </BotaoLink>
        </div>
      </Container>
    </section>
  )
}

/* ---------------- Página ---------------- */

const esqueleto = <div className="h-40 animate-pulse rounded-ficha bg-linha/40" aria-hidden="true" />

export default function Home() {
  return (
    <>
      <JsonLdOrganizacao />
      <Abertura />
      <FaixaIdentidade />

      <section className="pb-10 pt-10 sm:pt-12" aria-label="Agenda e publicações">
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-10">
          <div aria-labelledby="eventos-titulo" role="region" className="min-w-0">
            <CabecalhoSecao
              id="eventos-titulo"
              titulo="Próximos eventos"
              icone={<IconeAgenda />}
              acao={<LinkSeta href="/eventos">Ver todos</LinkSeta>}
            />
            <Suspense fallback={esqueleto}>
              <ProximosEventos />
            </Suspense>
          </div>
          <div aria-labelledby="noticias-titulo" role="region" className="min-w-0">
            <CabecalhoSecao
              id="noticias-titulo"
              titulo="Últimas notícias"
              icone={<IconeNoticias />}
              acao={<LinkSeta href="/noticias">Ver todas</LinkSeta>}
            />
            <UltimasNoticias />
          </div>
        </Container>
      </section>

      <Prancha
        id="vitrine"
        titulo="Vitrine de Startups"
        introducao="Conheça as startups associadas da nossa rede."
        icone={<IconeCamadas />}
        fundo="branco"
        className="border-y border-linha/70 !py-10 sm:!py-12"
        acao={<LinkSeta href="/vitrine">Ver todas</LinkSeta>}
      >
        <Suspense fallback={esqueleto}>
          <PreviaVitrine />
        </Suspense>
      </Prancha>

      <FaixaMantenedores />

      <Prancha
        id="associe-se"
        titulo="Faça parte"
        introducao="Comece de graça na Comunidade ou associe-se para ter voz e voto nas decisões da Associação."
        fundo="laranja"
      >
        <Modalidades />
      </Prancha>
    </>
  )
}
