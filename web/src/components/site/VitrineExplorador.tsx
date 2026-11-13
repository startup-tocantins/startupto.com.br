'use client'

import {useMemo, useState} from 'react'
import type {VitrineCard} from '@/lib/supabase/vitrine'
import {MapaColeta} from './MapaColeta'
import {tituloDe, VitrineFicha, type Listas} from './VitrineFicha'
import {Botao, Campo, Selecao} from '@/components/ui'

/** Vitrine com filtros por setor, estágio e cidade (e clique no mapa). */
export function VitrineExplorador({cards, listas}: {cards: VitrineCard[]; listas: Listas}) {
  const [setor, setSetor] = useState('')
  const [estagio, setEstagio] = useState('')
  const [cidade, setCidade] = useState('')

  const usados = useMemo(
    () => ({
      setores: listas.setores.filter((s) => cards.some((c) => c.setor === s.slug)),
      estagios: listas.estagios.filter((s) => cards.some((c) => c.estagio === s.slug)),
      cidades: listas.cidades.filter((s) => cards.some((c) => c.cidade === s.slug)),
    }),
    [cards, listas],
  )

  const filtrados = cards.filter(
    (c) => (!setor || c.setor === setor) && (!estagio || c.estagio === estagio) && (!cidade || c.cidade === cidade),
  )
  const algumFiltro = Boolean(setor || estagio || cidade)
  const limpar = () => {
    setSetor('')
    setEstagio('')
    setCidade('')
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[18rem_1fr] lg:gap-12">
      <aside className="flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-ficha bg-prancha p-4 ring-1 ring-linha">
          <MapaColeta
            tema="claro"
            destaques={usados.cidades.map((c) => c.slug)}
            selecionada={cidade || null}
            onSelecionar={(s) => setCidade(s ?? '')}
            titulo="Mapa do Tocantins: cidades com startups associadas em laranja. Clique em uma cidade para filtrar."
          />
          <p className="mt-2 text-center text-sm text-tinta-suave">
            Clique em um ponto laranja para filtrar pela cidade.
          </p>
        </div>
        <form role="search" aria-label="Filtrar startups" className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <Campo id="f-setor" rotulo="Setor">
            <Selecao id="f-setor" value={setor} onChange={(e) => setSetor(e.target.value)}>
              <option value="">Todos os setores</option>
              {usados.setores.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.titulo}
                </option>
              ))}
            </Selecao>
          </Campo>
          <Campo id="f-estagio" rotulo="Estágio">
            <Selecao id="f-estagio" value={estagio} onChange={(e) => setEstagio(e.target.value)}>
              <option value="">Todos os estágios</option>
              {usados.estagios.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.titulo}
                </option>
              ))}
            </Selecao>
          </Campo>
          <Campo id="f-cidade" rotulo="Cidade">
            <Selecao id="f-cidade" value={cidade} onChange={(e) => setCidade(e.target.value)}>
              <option value="">Todas as cidades</option>
              {usados.cidades.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.titulo}
                </option>
              ))}
            </Selecao>
          </Campo>
          {algumFiltro && (
            <Botao type="button" variante="fantasma" onClick={limpar} className="self-start">
              Limpar filtros
            </Botao>
          )}
        </form>
      </aside>

      <div>
        <p className="mb-5 text-[0.9375rem] text-tinta-suave" aria-live="polite">
          {filtrados.length === cards.length
            ? `${cards.length} ${cards.length === 1 ? 'startup associada' : 'startups associadas'}`
            : `${filtrados.length} de ${cards.length} startups`}
          {cidade && ` em ${tituloDe(listas.cidades, cidade)}`}
        </p>
        {filtrados.length ? (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtrados.map((card) => (
              <li key={card.id}>
                <VitrineFicha card={card} listas={listas} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-ficha border border-dashed border-linha-forte px-6 py-10 text-center">
            <p className="font-display text-lg font-bold text-azul-noite">Nenhuma startup com esses filtros</p>
            <Botao type="button" variante="contorno" onClick={limpar} className="mt-4">
              Limpar filtros
            </Botao>
          </div>
        )}
      </div>
    </div>
  )
}
