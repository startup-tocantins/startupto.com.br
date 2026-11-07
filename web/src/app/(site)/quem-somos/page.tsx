import type {Metadata} from 'next'
import Link from 'next/link'
import {getConfiguracoes, getPagina, getValores} from '@/sanity/queries'
import {TextoRico} from '@/components/site/TextoRico'
import {BotaoLink, Container, IconeSeta, Prancha} from '@/components/ui'

export async function generateMetadata(): Promise<Metadata> {
  const p = await getPagina('quem-somos')
  return {
    title: p?.seo?.titulo ?? 'Quem somos',
    description:
      p?.seo?.descricao ??
      'A Associação Tocantinense de Startups representa, conecta e fortalece as startups de todas as regiões do Tocantins.',
    alternates: {canonical: '/quem-somos'},
  }
}

export default async function QuemSomos() {
  const [pagina, c, valores] = await Promise.all([getPagina('quem-somos'), getConfiguracoes(), getValores()])
  return (
    <>
      <Prancha nivel={1} titulo={pagina?.titulo ?? 'Quem somos'} fundo="papel" numero={1} className="pb-10 sm:pb-12 lg:pb-14">
        <TextoRico
          valor={pagina?.corpo}
          className="text-[1.25rem] [&>p:last-child]:font-display [&>p:last-child]:text-[1.5rem] [&>p:last-child]:font-bold [&>p:last-child]:leading-snug [&>p:last-child]:text-azul"
        />
      </Prancha>

      {c.missaoCurta && (
        <section className="bg-azul-fundo py-16 text-white sm:py-20" aria-labelledby="missao-titulo">
          <Container className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div>
              <h2 id="missao-titulo" className="font-display text-sm font-bold uppercase tracking-[0.14em] text-laranja">
                Missão
              </h2>
              <p className="mt-5 font-texto text-[clamp(1.5rem,2.8vw,2.1rem)] italic leading-snug">“{c.missaoCurta}”</p>
            </div>
            <div className="flex flex-col gap-8 font-texto text-[1.125rem] leading-relaxed text-white/85 lg:pt-10">
              {c.missaoLonga && <p>{c.missaoLonga}</p>}
              {c.visao && (
                <div>
                  <h2 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-laranja">Visão</h2>
                  <p className="mt-3">{c.visao}</p>
                </div>
              )}
            </div>
          </Container>
        </section>
      )}

      {valores.length > 0 && (
        <Prancha id="valores" titulo="Valores" fundo="branco" numero={2}>
          <dl className="grid gap-x-12 gap-y-9 md:grid-cols-2">
            {valores.map((v) => (
              <div key={v._id} className="grid grid-cols-[1.25rem_1fr] gap-x-4">
                <span aria-hidden="true" className="mt-2.5 size-3 rounded-full bg-laranja" />
                <div>
                  <dt className="font-display text-xl font-bold text-azul-noite">{v.titulo}</dt>
                  <dd className="mt-1.5 font-texto text-[1.125rem] leading-relaxed text-tinta-suave">{v.descricao}</dd>
                </div>
              </div>
            ))}
          </dl>
        </Prancha>
      )}

      <section className="border-t border-linha bg-papel py-14">
        <Container className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="max-w-[46ch] font-texto text-[1.25rem] leading-snug text-azul-noite">
            Conheça quem conduz a Associação e as regras que nos organizam.
          </p>
          <div className="flex flex-wrap gap-3">
            <BotaoLink href="/diretoria" variante="secundario">
              Diretoria <IconeSeta />
            </BotaoLink>
            <BotaoLink href="/manifesto" variante="contorno">
              Manifesto
            </BotaoLink>
            <Link href="/documentos" className="inline-flex min-h-11 items-center px-3 font-semibold text-azul underline">
              Estatuto e Regimento
            </Link>
          </div>
        </Container>
      </section>
    </>
  )
}
