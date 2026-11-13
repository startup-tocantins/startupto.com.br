import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {getPagina} from '@/sanity/queries'
import {TextoRico} from '@/components/site/TextoRico'
import {BotaoLink, IconeSeta, Prancha} from '@/components/ui'

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
      <Prancha nivel={1} rotulo="No que acreditamos" titulo={p.titulo} fundo="papel">
        <div className="rounded-faixa bg-prancha px-6 py-10 ring-1 ring-linha/70 shadow-ficha sm:px-12 sm:py-14">
          <TextoRico
            valor={p.corpo}
            className="mx-auto text-lg [&>p:first-child]:font-display [&>p:first-child]:text-[clamp(1.6rem,3.2vw,2.25rem)] [&>p:first-child]:font-bold [&>p:first-child]:leading-[1.15] [&>p:first-child]:tracking-[-0.015em] [&>p:first-child]:text-azul-noite"
          />
          <div className="mx-auto mt-12 flex max-w-[70ch] flex-wrap gap-3 border-t border-linha pt-8">
            <BotaoLink href="/associe-se" tamanho="lg">
              Este manifesto também é seu: associe-se <IconeSeta />
            </BotaoLink>
          </div>
        </div>
      </Prancha>
    </article>
  )
}
