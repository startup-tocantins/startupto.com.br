import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {getPagina} from '@/sanity/queries'
import {TextoRico} from '@/components/site/TextoRico'
import {BotaoLink, Container} from '@/components/ui'

export async function generateMetadata(): Promise<Metadata> {
  const p = await getPagina('manifesto')
  return {
    title: p?.seo?.titulo ?? 'Manifesto',
    description: p?.seo?.descricao ?? 'Acreditamos que inovação não tem CEP. O manifesto da Associação Tocantinense de Startups.',
    alternates: {canonical: '/manifesto'},
  }
}

export default async function Manifesto() {
  const p = await getPagina('manifesto')
  if (!p) notFound()
  return (
    <article>
      <header className="bg-laranja py-16 sm:py-20">
        <Container>
          <h1 className="font-display text-[clamp(3rem,9vw,7rem)] font-extrabold leading-[0.9] tracking-[-0.04em] text-azul-noite">
            {p.titulo}
          </h1>
        </Container>
      </header>
      <Container className="py-14 sm:py-20">
        <TextoRico
          valor={p.corpo}
          className="mx-auto text-[1.3125rem] [&>p:first-child]:font-display [&>p:first-child]:text-[clamp(1.9rem,4vw,2.8rem)] [&>p:first-child]:font-extrabold [&>p:first-child]:leading-[1.08] [&>p:first-child]:tracking-[-0.02em] [&>p:first-child]:text-azul"
        />
        <div className="mx-auto mt-14 flex max-w-[68ch] flex-wrap gap-3 border-t border-linha pt-8">
          <BotaoLink href="/associe-se">Este manifesto também é seu: associe-se</BotaoLink>
        </div>
      </Container>
    </article>
  )
}
