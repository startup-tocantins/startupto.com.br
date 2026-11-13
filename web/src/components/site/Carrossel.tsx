'use client'

import {Children, useEffect, useRef, useState, type ReactNode} from 'react'
import {cx} from '@/components/ui'

/**
 * Carrossel leve: rolagem horizontal com snap (funciona com toque e teclado)
 * e pontos de navegação. Sem autoplay.
 */
export function Carrossel({children, rotulo}: {children: ReactNode; rotulo: string}) {
  const itens = Children.toArray(children)
  const trilho = useRef<HTMLUListElement>(null)
  const [atual, setAtual] = useState(0)

  useEffect(() => {
    const el = trilho.current
    if (!el) return
    const onScroll = () => setAtual(Math.round(el.scrollLeft / Math.max(el.clientWidth, 1)))
    el.addEventListener('scroll', onScroll, {passive: true})
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  const ir = (i: number) => {
    const el = trilho.current
    if (!el) return
    el.scrollTo({left: i * el.clientWidth, behavior: 'smooth'})
  }

  return (
    <div role="region" aria-roledescription="carrossel" aria-label={rotulo}>
      <ul
        ref={trilho}
        className="-mx-2 -my-2 flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {itens.map((item, i) => (
          <li
            key={i}
            className="w-full shrink-0 snap-start p-2"
            aria-roledescription="slide"
            aria-label={`${i + 1} de ${itens.length}`}
          >
            {item}
          </li>
        ))}
      </ul>
      {itens.length > 1 && (
        <div className="mt-4 flex justify-center gap-1">
          {itens.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => ir(i)}
              aria-label={`Ir para o item ${i + 1}`}
              aria-current={i === atual ? 'true' : undefined}
              className="group flex size-6 items-center justify-center rounded-full"
            >
              <span
                className={cx(
                  'block rounded-full transition-all duration-300',
                  i === atual ? 'size-3 bg-azul' : 'size-2 bg-linha-forte group-hover:bg-tinta-fraca',
                )}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
