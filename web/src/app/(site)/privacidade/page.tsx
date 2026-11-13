import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {getPagina} from '@/sanity/queries'
import {dataLonga} from '@/lib/formatos'
import {TextoRico} from '@/components/site/TextoRico'
import {Prancha} from '@/components/ui'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Como a Associação Tocantinense de Startups trata dados pessoais, conforme a LGPD.',
  alternates: {canonical: '/privacidade'},
}

export default async function Privacidade() {
  const p = await getPagina('privacidade')
  if (!p) notFound()
  return (
    <article>
      <Prancha
        nivel={1}
        rotulo="Documentos"
        titulo={p.titulo}
        introducao={p.dataAtualizacao ? `Última atualização: ${dataLonga(`${p.dataAtualizacao}T12:00:00`)}` : undefined}
        fundo="papel"
      >
        <div className="rounded-faixa bg-prancha px-6 py-10 ring-1 ring-linha/70 shadow-ficha sm:px-12 sm:py-12">
          <TextoRico valor={p.corpo} />
        </div>
      </Prancha>
    </article>
  )
}
