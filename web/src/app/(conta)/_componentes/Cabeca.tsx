import type {ReactNode} from 'react'
import {Container} from '@/components/ui'

/** Faixa de título das páginas de conta: prancha azul compacta. */
export function CabecaConta({rotulo, titulo, children}: {rotulo: string; titulo: ReactNode; children?: ReactNode}) {
  return (
    <div className="bg-azul-fundo text-white">
      <Container className="py-12 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-laranja">{rotulo}</p>
        <h1 className="mt-3 max-w-3xl font-display text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.04]">
          {titulo}
        </h1>
        {children && <div className="mt-4 max-w-[60ch] font-texto text-[1.1875rem] leading-relaxed text-white/85">{children}</div>}
      </Container>
    </div>
  )
}
