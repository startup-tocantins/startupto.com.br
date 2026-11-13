import type {ReactNode} from 'react'
import {Container} from '@/components/ui'

/** Faixa de título das páginas de conta: fundo claro, campo amarelo-ipê na borda. */
export function CabecaConta({titulo, children}: {titulo: ReactNode; children?: ReactNode}) {
  return (
    <div className="relative overflow-hidden border-b border-linha/70 bg-prancha">
      <span aria-hidden="true" className="campo-ipe pointer-events-none absolute -left-10 top-4 hidden h-40 w-24 md:block" />
      <Container className="relative py-10 sm:py-12">
        <h1 className="max-w-3xl font-display text-[clamp(1.9rem,3.6vw,2.75rem)] font-bold leading-[1.08] tracking-[-0.02em] text-azul-noite">
          {titulo}
        </h1>
        {children && <div className="mt-3 max-w-[60ch] text-[1.0625rem] leading-relaxed text-tinta-suave">{children}</div>}
      </Container>
    </div>
  )
}
