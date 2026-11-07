import type {Metadata} from 'next'
import {getDocumentos} from '@/sanity/queries'
import {tamanhoArquivo} from '@/lib/formatos'
import {EstadoVazio, IconeDocumento, IconeDownload, Prancha} from '@/components/ui'

export const metadata: Metadata = {
  title: 'Estatuto e Regimento',
  description: 'Estatuto Social e Regimento Interno da Associação Tocantinense de Startups.',
  alternates: {canonical: '/documentos'},
}

export default async function Documentos() {
  const docs = await getDocumentos()
  return (
    <Prancha
      nivel={1}
      titulo="Documentos"
      introducao="Transparência é um dos nossos princípios. Estes são os documentos que regem a Associação."
      fundo="papel"
      numero={1}
    >
      {docs.length ? (
        <ul className="grid max-w-4xl gap-4">
          {docs.map((d) => (
            <li key={d._id}>
              <a
                href={d.url ? `${d.url}?dl=` : '#'}
                className="group flex items-center gap-5 rounded-ficha bg-prancha p-5 ring-1 ring-linha shadow-ficha transition-shadow duration-300 hover:shadow-ficha-alta sm:p-6"
              >
                <span className="flex size-14 shrink-0 items-center justify-center rounded-[4px] bg-azul-claro text-azul">
                  <IconeDocumento className="size-7" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-xl font-bold text-azul-noite group-hover:underline">{d.titulo}</span>
                  {d.descricao && (
                    <span className="mt-0.5 block font-texto text-[1.0625rem] text-tinta-suave">{d.descricao}</span>
                  )}
                </span>
                <span className="hidden shrink-0 items-center gap-2 text-[0.9375rem] font-semibold text-azul sm:inline-flex">
                  <IconeDownload /> PDF {tamanhoArquivo(d.tamanho) && `· ${tamanhoArquivo(d.tamanho)}`}
                </span>
                <span className="sr-only">(baixar PDF)</span>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <EstadoVazio titulo="Documentos em breve">O Estatuto e o Regimento Interno serão publicados aqui.</EstadoVazio>
      )}
    </Prancha>
  )
}
