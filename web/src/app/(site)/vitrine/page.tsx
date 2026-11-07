import type {Metadata} from 'next'
import {Suspense} from 'react'
import {getVitrine} from '@/lib/supabase/vitrine'
import {getListas} from '@/sanity/queries'
import {VitrineExplorador} from '@/components/site/VitrineExplorador'
import {MapaColeta} from '@/components/site/MapaColeta'
import {BotaoLink, EstadoVazio, Prancha} from '@/components/ui'
import {ROTAS_CONTA} from '@/components/site/navegacao'

export const metadata: Metadata = {
  title: 'Vitrine de startups',
  description: 'Startups associadas à Associação Tocantinense de Startups, de todas as regiões do Tocantins.',
  alternates: {canonical: '/vitrine'},
}

async function Conteudo() {
  const [cards, listas] = await Promise.all([getVitrine(), getListas()])
  if (!cards.length) {
    return (
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_20rem]">
        <EstadoVazio
          titulo="A Vitrine começa com a sua startup"
          acao={
            <>
              <BotaoLink href={ROTAS_CONTA.associado}>Associar minha startup</BotaoLink>
              <BotaoLink href="/associe-se" variante="contorno">
                Como funciona
              </BotaoLink>
            </>
          }
        >
          Associados em dia que autorizarem a exibição aparecem aqui, com setor, estágio e cidade. Cada ponto do mapa é
          um município esperando a sua primeira startup na Vitrine.
        </EstadoVazio>
        <div className="mx-auto w-full max-w-[18rem] rounded-ficha bg-prancha p-4 ring-1 ring-linha">
          <MapaColeta tema="claro" />
        </div>
      </div>
    )
  }
  return <VitrineExplorador cards={cards} listas={listas} />
}

export default function Vitrine() {
  return (
    <Prancha
      nivel={1}
      titulo="Vitrine de startups"
      introducao="O retrato público do ecossistema tocantinense: startups associadas, de Palmas ao Bico do Papagaio."
      fundo="papel"
      numero={1}
    >
      <Suspense fallback={<div className="h-96 animate-pulse rounded-ficha bg-linha/40" aria-hidden="true" />}>
        <Conteudo />
      </Suspense>
    </Prancha>
  )
}
