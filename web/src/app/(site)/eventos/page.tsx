import {agoraMs} from '@/lib/formatos'
import type {Metadata} from 'next'
import {Suspense} from 'react'
import {connection} from 'next/server'
import {getEventos} from '@/sanity/queries'
import {ItemEvento} from '@/components/site/Itens'
import {BotaoLink, CabecalhoSecao, EstadoVazio, IconeAgenda, Prancha} from '@/components/ui'
import {ROTAS_CONTA} from '@/components/site/navegacao'

export const metadata: Metadata = {
  title: 'Eventos',
  description: 'Encontros, mentorias e capacitações da Associação Tocantinense de Startups em todo o Tocantins.',
  alternates: {canonical: '/eventos'},
}

async function Agenda() {
  await connection()
  const agora = agoraMs()
  const eventos = await getEventos()
  const proximos = eventos.filter((e) => new Date(e.fim ?? e.inicio).getTime() >= agora)
  const passados = eventos.filter((e) => new Date(e.fim ?? e.inicio).getTime() < agora).reverse()

  return (
    <>
      <section aria-labelledby="proximos-titulo">
        <CabecalhoSecao id="proximos-titulo" titulo="Próximos" icone={<IconeAgenda />} />
        {proximos.length ? (
          <ul className="grid gap-4 lg:grid-cols-2">
            {proximos.map((e) => (
              <li key={e._id}>
                <ItemEvento evento={e} />
              </li>
            ))}
          </ul>
        ) : (
          <EstadoVazio
            titulo="Nenhum evento agendado no momento"
            acao={
              <BotaoLink href={ROTAS_CONTA.comunidade} variante="contorno">
                Entrar na Comunidade
              </BotaoLink>
            }
          >
            Quem está na Comunidade recebe os convites pelo grupo do WhatsApp assim que um evento é anunciado.
          </EstadoVazio>
        )}
      </section>
      {passados.length > 0 && (
        <section aria-labelledby="passados-titulo" className="mt-16">
          <CabecalhoSecao id="passados-titulo" titulo="Já aconteceram" />
          <ul className="grid gap-4 lg:grid-cols-2">
            {passados.map((e) => (
              <li key={e._id}>
                <ItemEvento evento={e} passado compacto />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}

export default function Eventos() {
  return (
    <Prancha
      nivel={1}
      rotulo="Agenda do ecossistema"
      titulo="Eventos"
      introducao="Encontros, mentorias e capacitações em todas as regiões do estado."
      fundo="papel"
     
    >
      <Suspense fallback={<div className="h-64 animate-pulse rounded-ficha bg-linha/40" aria-hidden="true" />}>
        <Agenda />
      </Suspense>
    </Prancha>
  )
}
