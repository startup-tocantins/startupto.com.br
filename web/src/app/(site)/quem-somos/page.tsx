import type {Metadata} from 'next'
import Link from 'next/link'
import {getConfiguracoes, getPagina, getValores} from '@/sanity/queries'
import {TextoRico} from '@/components/site/TextoRico'
import {BotaoLink, Container, IconeDiamante, IconeFoguete, IconeOlho, IconeSeta, Prancha} from '@/components/ui'

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
      <Prancha
        nivel={1}
        rotulo="A Associação"
        titulo={pagina?.titulo ?? 'Quem somos'}
        fundo="papel"
        className="pb-10 sm:pb-12 lg:pb-14"
      >
        <TextoRico
          valor={pagina?.corpo}
          className="text-[1.0625rem] [&>p:last-child]:font-display [&>p:last-child]:text-xl [&>p:last-child]:font-bold [&>p:last-child]:leading-snug [&>p:last-child]:text-azul"
        />
      </Prancha>

      {(c.missaoCurta || c.visao) && (
        <section className="pb-14 sm:pb-16" aria-label="Missão e visão">
          <Container className="grid gap-5 lg:grid-cols-2">
            {c.missaoCurta && (
              <article className="rounded-faixa bg-prancha p-7 ring-1 ring-linha/70 shadow-ficha sm:p-9">
                <IconeFoguete className="size-12 text-azul" />
                <h2 className="mt-4 font-display text-2xl font-bold text-azul-noite">Missão</h2>
                <p className="mt-3 text-lg leading-relaxed text-azul-noite">{c.missaoCurta}</p>
                {c.missaoLonga && <p className="mt-4 text-base leading-relaxed text-tinta-suave">{c.missaoLonga}</p>}
              </article>
            )}
            {c.visao && (
              <article className="rounded-faixa bg-prancha p-7 ring-1 ring-linha/70 shadow-ficha sm:p-9">
                <IconeOlho className="size-12 text-azul" />
                <h2 className="mt-4 font-display text-2xl font-bold text-azul-noite">Visão</h2>
                <p className="mt-3 text-lg leading-relaxed text-azul-noite">{c.visao}</p>
              </article>
            )}
          </Container>
        </section>
      )}

      {valores.length > 0 && (
        <Prancha id="valores" titulo="Valores" icone={<IconeDiamante />} fundo="branco" className="border-y border-linha/70">
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {valores.map((v) => (
              <div key={v._id} className="rounded-ficha bg-papel p-6 ring-1 ring-linha/70">
                <dt className="flex items-center gap-3 font-display text-lg font-bold text-azul-noite">
                  <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-laranja" />
                  {v.titulo}
                </dt>
                <dd className="mt-2 text-[0.9375rem] leading-relaxed text-tinta-suave">{v.descricao}</dd>
              </div>
            ))}
          </dl>
        </Prancha>
      )}

      <section className="py-14">
        <Container className="flex flex-col gap-6 rounded-faixa bg-prancha p-7 ring-1 ring-linha/70 shadow-ficha sm:p-9 md:flex-row md:items-center md:justify-between">
          <p className="max-w-[46ch] font-display text-xl font-bold leading-snug text-azul-noite">
            Conheça quem conduz a Associação e as regras que nos organizam.
          </p>
          <div className="flex flex-wrap gap-3">
            <BotaoLink href="/diretoria" variante="secundario">
              Diretoria <IconeSeta />
            </BotaoLink>
            <BotaoLink href="/manifesto" variante="contorno">
              Manifesto
            </BotaoLink>
            <Link href="/documentos" className="inline-flex min-h-11 items-center px-3 font-medium text-azul underline">
              Estatuto e Regimento
            </Link>
          </div>
        </Container>
      </section>
    </>
  )
}
