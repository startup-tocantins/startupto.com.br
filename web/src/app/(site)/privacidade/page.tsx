import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {getPagina} from '@/sanity/queries'
import {dataLonga} from '@/lib/formatos'
import {TextoRico} from '@/components/site/TextoRico'
import {Container} from '@/components/ui'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Como a Associação Tocantinense de Startups trata dados pessoais, conforme a LGPD.',
  alternates: {canonical: '/privacidade'},
}

export default async function Privacidade() {
  const p = await getPagina('privacidade')
  if (!p) notFound()
  return (
    <article className="bg-papel">
      <Container className="py-14 sm:py-20">
        <h1 className="font-display text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold leading-[1.04] text-azul-noite">{p.titulo}</h1>
        {p.dataAtualizacao && (
          <p className="mt-3 font-texto text-[1.125rem] italic text-tinta-suave">
            Última atualização: {dataLonga(`${p.dataAtualizacao}T12:00:00`)}
          </p>
        )}
        <TextoRico valor={p.corpo} className="mt-10" />
      </Container>
    </article>
  )
}
