'use client'

import {useId, useMemo, useState} from 'react'
import mapa from '@/data/tocantins.json'
import {cx} from '@/components/ui'

type Municipio = {codigo: number; nome: string; slug: string; x: number; y: number}
const MUNICIPIOS = mapa.municipios as Municipio[]

type Props = {
  /** Slugs de cidades com startups associadas (ganham o laranja). */
  destaques?: string[]
  /** Slug selecionado (Vitrine). */
  selecionada?: string | null
  onSelecionar?: (slug: string | null) => void
  tema?: 'escuro' | 'claro'
  className?: string
  titulo?: string
}

/**
 * Mapa de coleta: os 139 municípios do Tocantins, um ponto por cidade, nas
 * coordenadas reais (centroides IBGE). O mesmo mapa em pontos do logo,
 * agora com cada ponto sendo uma cidade.
 */
export function MapaColeta({
  destaques = [],
  selecionada = null,
  onSelecionar,
  tema = 'escuro',
  className,
  titulo = 'Mapa do Tocantins com os 139 municípios',
}: Props) {
  const [foco, setFoco] = useState<Municipio | null>(null)
  const descId = useId()
  const set = useMemo(() => new Set(destaques), [destaques])
  const interativo = Boolean(onSelecionar)
  const escuro = tema === 'escuro'
  const ativo = foco ?? MUNICIPIOS.find((m) => m.slug === selecionada) ?? null

  return (
    <figure className={cx('relative', className)}>
      <svg
        viewBox={`-12 -12 ${mapa.largura + 24} ${mapa.altura + 24}`}
        className="h-auto w-full overflow-visible"
        role="img"
        aria-labelledby={descId}
      >
        <title id={descId}>{titulo}</title>
        <path
          d={mapa.contorno}
          className={escuro ? 'fill-white/[0.06] stroke-white/25' : 'fill-azul-claro/60 stroke-azul/25'}
          strokeWidth={1}
          strokeLinejoin="round"
        />
        {MUNICIPIOS.map((m, i) => {
          const destaque = set.has(m.slug)
          const sel = selecionada === m.slug
          const emFoco = ativo?.slug === m.slug
          const r = sel || emFoco ? 5.6 : destaque ? 4.4 : 3
          return (
            <circle
              key={m.codigo}
              cx={m.x}
              cy={m.y}
              r={r}
              style={{animationDelay: `${Math.round((m.y / mapa.altura) * 900)}ms`}}
              className={cx(
                'mapa-ponto transition-[r,fill] duration-300 ease-saida',
                destaque || sel
                  ? 'fill-laranja'
                  : escuro
                    ? emFoco
                      ? 'fill-white'
                      : 'fill-[#9fc0ea]'
                    : emFoco
                      ? 'fill-azul-noite'
                      : 'fill-azul/70',
                interativo && 'cursor-pointer',
              )}
              onMouseEnter={() => setFoco(m)}
              onMouseLeave={() => setFoco(null)}
              onClick={interativo ? () => onSelecionar?.(sel ? null : m.slug) : undefined}
              data-i={i}
            />
          )
        })}
        {ativo && (
          <g pointerEvents="none">
            <text
              x={Math.min(Math.max(ativo.x, 40), mapa.largura - 40)}
              y={ativo.y - 11}
              textAnchor="middle"
              className={cx(
                'font-display text-[11px] font-bold',
                escuro ? 'fill-white' : 'fill-azul-noite',
              )}
              style={{paintOrder: 'stroke', stroke: escuro ? '#0a3f84' : '#ffffff', strokeWidth: 4}}
            >
              {ativo.nome}
            </text>
          </g>
        )}
      </svg>
      <figcaption className="sr-only">
        Cada ponto representa um dos 139 municípios do Tocantins.
        {destaques.length > 0 && ` ${destaques.length} cidades têm startups associadas.`}
      </figcaption>
    </figure>
  )
}
