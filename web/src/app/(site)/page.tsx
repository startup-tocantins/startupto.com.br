import {agoraMs} from '@/lib/formatos'
import Image from 'next/image'
import Link from 'next/link'
import {Suspense} from 'react'
import {connection} from 'next/server'
import {getVitrine} from '@/lib/supabase/vitrine'
import {
  getConfiguracoes,
  getEventos,
  getListas,
  getMantenedores,
  getPosts,
} from '@/sanity/queries'
import {urlFor} from '@/sanity/image'
import {MapaColeta} from '@/components/site/MapaColeta'
import {ItemEvento, ItemPost} from '@/components/site/Itens'
import {Modalidades} from '@/components/site/Modalidades'
import {VitrineFicha} from '@/components/site/VitrineFicha'
import {TextoRico} from '@/components/site/TextoRico'
import {BotaoLink, Container, EstadoVazio, IconeSeta, Prancha} from '@/components/ui'
import {ROTAS_CONTA} from '@/components/site/navegacao'
import {JsonLdOrganizacao} from '@/components/site/JsonLd'

/* ---------------- Primeira dobra: prancha 01 ---------------- */

async function MapaComDestaques() {
  const vitrine = await getVitrine()
  const cidades = [...new Set(vitrine.map((v) => v.cidade).filter(Boolean))]
  return <MapaColeta destaques={cidades} tema="escuro" />
}

async function Abertura() {
  const c = await getConfiguracoes()
  return (
    <section className="relative overflow-hidden bg-azul-fundo text-white" aria-labelledby="abertura-titulo">
      <Container className="grid items-center gap-10 pb-14 pt-12 sm:pt-16 lg:grid-cols-[1.25fr_1fr] lg:gap-16 lg:pb-20 lg:pt-20">
        <div className="relative z-10">
          <h1
            id="abertura-titulo"
            className="font-display text-[clamp(2.6rem,6.4vw,5.25rem)] font-extrabold leading-[0.98] tracking-[-0.035em]"
          >
            {c.heroTitulo ?? c.nomeOficial}
          </h1>
          {c.missaoCurta && (
            <p className="mt-6 max-w-[34ch] font-texto text-[clamp(1.25rem,2.1vw,1.6rem)] italic leading-snug text-white/90">
              {c.missaoCurta}
            </p>
          )}
          <div className="mt-9 flex flex-wrap gap-3">
            <BotaoLink href="/associe-se" tamanho="lg">
              Associe-se
            </BotaoLink>
            <BotaoLink href="/vitrine" variante="claro" tamanho="lg">
              Conheça a Vitrine <IconeSeta />
            </BotaoLink>
          </div>
          <p className="mt-6 text-[0.9375rem] text-white/75">
            A Comunidade é gratuita.{' '}
            <Link href={ROTAS_CONTA.comunidade} className="font-semibold text-white underline hover:text-laranja">
              Entre em 1 minuto
            </Link>
            .
          </p>
        </div>
        <div className="relative mx-auto w-full max-w-[15rem] sm:max-w-[20rem] lg:max-w-[26rem]">
          <Suspense fallback={<MapaColeta tema="escuro" />}>
            <MapaComDestaques />
          </Suspense>
          <p className="mt-3 text-center font-texto text-[1rem] italic text-white/70">
            139 municípios, um ponto para cada. Representamos o Tocantins inteiro.
          </p>
        </div>
      </Container>
    </section>
  )
}

/* ---------------- Introdução ---------------- */

async function Introducao() {
  const c = await getConfiguracoes()
  return (
    <Prancha id="introducao" fundo="papel" numero={2}>
      <div className="grid gap-10 lg:grid-cols-[1fr_20rem] lg:gap-16">
        <TextoRico
          valor={c.introducao}
          className="text-[1.25rem] [&>p:first-child]:font-display [&>p:first-child]:text-[clamp(1.5rem,2.6vw,2rem)] [&>p:first-child]:font-bold [&>p:first-child]:leading-[1.2] [&>p:first-child]:tracking-[-0.015em] [&>p:first-child]:text-azul-noite"
        />
        <nav aria-label="Conheça a Associação" className="flex flex-col gap-3 self-start lg:pt-2">
          {[
            {href: '/quem-somos', t: 'Quem somos', d: 'Missão, visão e valores'},
            {href: '/manifesto', t: 'Manifesto', d: 'No que acreditamos'},
            {href: '/diretoria', t: 'Diretoria', d: 'Quem conduz a Associação'},
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group flex items-center justify-between gap-4 rounded-ficha bg-prancha px-5 py-4 ring-1 ring-linha transition-shadow duration-300 hover:shadow-ficha-alta"
            >
              <span>
                <span className="block font-display text-lg font-bold text-azul-noite">{l.t}</span>
                <span className="block font-texto text-[1rem] italic text-tinta-suave">{l.d}</span>
              </span>
              <IconeSeta className="size-5 text-azul transition-transform duration-300 ease-saida group-hover:translate-x-1" />
            </Link>
          ))}
        </nav>
      </div>
    </Prancha>
  )
}

/* ---------------- Eventos ---------------- */

async function ProximosEventos() {
  await connection()
  const agora = agoraMs()
  const eventos = (await getEventos())
    .filter((e) => new Date(e.fim ?? e.inicio).getTime() >= agora)
    .slice(0, 3)
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
    <div className="grid gap-4 md:grid-cols-3">
      {eventos.map((e) => (
        <ItemEvento key={e._id} evento={e} />
      ))}
    </div>
  )
}

/* ---------------- Notícias ---------------- */

async function UltimasNoticias() {
  const posts = (await getPosts()).slice(0, 4)
  if (!posts.length) {
    return (
      <EstadoVazio titulo="As primeiras notícias estão a caminho">
        Notícias do ecossistema, editais abertos e benefícios para associados serão publicados aqui.
      </EstadoVazio>
    )
  }
  return (
    <div className="border-b border-linha">
      {posts.map((p) => (
        <ItemPost key={p._id} post={p} compacto />
      ))}
    </div>
  )
}

/* ---------------- Vitrine ---------------- */

async function PreviaVitrine() {
  const [vitrine, listas] = await Promise.all([getVitrine(), getListas()])
  if (!vitrine.length) {
    return (
      <EstadoVazio
        titulo="A Vitrine começa com a sua startup"
        acao={<BotaoLink href={ROTAS_CONTA.associado}>Quero aparecer na Vitrine</BotaoLink>}
      >
        Associados em dia que autorizarem a exibição terão a startup apresentada aqui, com setor, estágio e cidade.
      </EstadoVazio>
    )
  }
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {vitrine.slice(0, 6).map((card) => (
        <li key={card.id}>
          <VitrineFicha card={card} listas={listas} />
        </li>
      ))}
    </ul>
  )
}

/* ---------------- Mantenedores ---------------- */

async function FaixaMantenedores() {
  const [mantenedores, c] = await Promise.all([getMantenedores(), getConfiguracoes()])
  return (
    <section className="border-t border-linha bg-prancha py-14" aria-labelledby="mantenedores-titulo">
      <Container className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-14">
        <div className="lg:w-72 lg:shrink-0">
          <h2 id="mantenedores-titulo" className="font-display text-2xl font-extrabold text-azul-noite">
            Mantenedores
          </h2>
          <p className="mt-2 font-texto text-[1.0625rem] leading-snug text-tinta-suave">
            Organizações que sustentam a Associação e integram o Conselho Consultivo.
          </p>
        </div>
        {mantenedores.length ? (
          <ul className="flex flex-1 flex-wrap items-center gap-x-10 gap-y-6">
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
          <div className="flex-1 rounded-ficha border border-dashed border-linha-forte px-6 py-6 font-texto text-[1.0625rem] text-tinta-suave">
            Sua organização pode apoiar o ecossistema de startups do Tocantins.{' '}
            {c.email ? (
              <a href={`mailto:${c.email}?subject=Quero%20ser%20mantenedor`} className="font-semibold text-azul underline">
                Fale com a Diretoria
              </a>
            ) : (
              <Link href="/mantenedores" className="font-semibold text-azul underline">
                Saiba como
              </Link>
            )}
            .
          </div>
        )}
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
      <Introducao />

      <Prancha
        id="eventos"
        titulo="Próximos eventos"
        fundo="branco"
        numero={3}
        acao={
          <BotaoLink href="/eventos" variante="fantasma">
            Agenda completa <IconeSeta />
          </BotaoLink>
        }
      >
        <Suspense fallback={esqueleto}>
          <ProximosEventos />
        </Suspense>
      </Prancha>

      <Prancha
        id="noticias"
        titulo="Notícias e editais"
        fundo="papel"
        numero={4}
        acao={
          <BotaoLink href="/noticias" variante="fantasma">
            Todas as publicações <IconeSeta />
          </BotaoLink>
        }
      >
        <UltimasNoticias />
      </Prancha>

      <Prancha
        id="vitrine"
        titulo="Vitrine de startups"
        introducao="Startups associadas, de todas as regiões do estado."
        fundo="branco"
        numero={5}
        acao={
          <BotaoLink href="/vitrine" variante="fantasma">
            Ver a Vitrine <IconeSeta />
          </BotaoLink>
        }
      >
        <Suspense fallback={esqueleto}>
          <PreviaVitrine />
        </Suspense>
      </Prancha>

      <Prancha
        id="associe-se"
        titulo="Faça parte"
        introducao="Comece de graça na Comunidade ou associe-se para ter voz e voto nas decisões da Associação."
        fundo="laranja"
        numero={6}
      >
        <Modalidades />
      </Prancha>

      <FaixaMantenedores />
    </>
  )
}
