import type {Metadata} from 'next'
import Image from 'next/image'
import {getConfiguracoes, getMantenedores} from '@/sanity/queries'
import {urlFor} from '@/sanity/image'
import {BotaoLink, EstadoVazio, IconeEmail, Prancha} from '@/components/ui'

export const metadata: Metadata = {
  title: 'Mantenedores',
  description: 'Organizações que mantêm a Associação Tocantinense de Startups e integram seu Conselho Consultivo.',
  alternates: {canonical: '/mantenedores'},
}

export default async function Mantenedores() {
  const [mantenedores, c] = await Promise.all([getMantenedores(), getConfiguracoes()])
  const contato = c.email ? `mailto:${c.email}?subject=Quero%20ser%20mantenedor` : null
  return (
    <>
      <Prancha
        nivel={1}
      rotulo="Quem sustenta a Associação"
        titulo="Mantenedores"
        introducao="Pessoas e organizações que contribuem anualmente para a manutenção da Associação. Os Mantenedores integram o Conselho Consultivo, órgão de assessoramento estratégico."
        fundo="papel"
       
      >
        {mantenedores.length ? (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {mantenedores.map((m) => {
              const conteudo = (
                <>
                  <div className="flex h-24 items-center justify-center">
                    {m.logo?.asset ? (
                      <Image
                        src={urlFor(m.logo).height(192).fit('max').url()}
                        alt={`Logo de ${m.nome}`}
                        width={240}
                        height={96}
                        className="max-h-20 w-auto object-contain"
                      />
                    ) : null}
                  </div>
                  <p className="mt-3 border-t border-linha pt-3 text-center font-display font-bold text-azul-noite">{m.nome}</p>
                </>
              )
              return (
                <li key={m._id} className="rounded-ficha bg-prancha p-5 ring-1 ring-linha shadow-ficha">
                  {m.link ? (
                    <a href={m.link} rel="noopener" className="block hover:opacity-90">
                      {conteudo}
                    </a>
                  ) : (
                    conteudo
                  )}
                </li>
              )
            })}
          </ul>
        ) : (
          <EstadoVazio
            titulo="Seja um dos primeiros mantenedores"
            acao={
              contato && (
                <BotaoLink href={contato}>
                  <IconeEmail className="size-4" /> Falar com a Diretoria
                </BotaoLink>
              )
            }
          >
            A sua organização pode sustentar o ecossistema de startups do Tocantins e ocupar uma cadeira no Conselho
            Consultivo.
          </EstadoVazio>
        )}
      </Prancha>
      <Prancha titulo="Como se tornar mantenedor" fundo="branco">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              t: 'Taxa anual de manutenção',
              d: 'O valor é definido pela Diretoria e pode ser parcelado. A adesão é combinada diretamente com a Associação.',
            },
            {
              t: 'Conselho Consultivo',
              d: 'As cadeiras destinadas aos Mantenedores são ocupadas por ordem de adesão, até o limite de nove membros.',
            },
            {
              t: 'Sem direito a voto',
              d: 'Mantenedores não votam nas Assembleias, mas podem também se associar, com voto, pagando a anuidade.',
            },
          ].map((i) => (
            <div key={i.t} className="border-t-2 border-azul-noite pt-4">
              <h3 className="font-display text-lg font-bold text-azul-noite">{i.t}</h3>
              <p className="mt-2 text-base leading-relaxed text-tinta-suave">{i.d}</p>
            </div>
          ))}
        </div>
        {contato && (
          <BotaoLink href={contato} variante="secundario" className="mt-10">
            Quero ser mantenedor
          </BotaoLink>
        )}
      </Prancha>
    </>
  )
}
