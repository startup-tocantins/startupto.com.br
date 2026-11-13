import {Suspense} from 'react'
import {Cabecalho} from '@/components/site/Cabecalho'
import {Rodape} from '@/components/site/Rodape'
import {Container, Spinner} from '@/components/ui'

function Carregando() {
  return (
    <Container className="flex min-h-[50vh] items-center justify-center gap-3 py-24 text-tinta-suave">
      <Spinner className="size-5" />
      <span className="text-base">Carregando…</span>
    </Container>
  )
}

/** Páginas por usuário (sessão): fora da validação de navegação instantânea. */
export const instant = false

export default function ContaLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      <Cabecalho />
      <main id="conteudo" className="flex-1">
        <Suspense fallback={<Carregando />}>{children}</Suspense>
      </main>
      <Rodape />
    </>
  )
}
