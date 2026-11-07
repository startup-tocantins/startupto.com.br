import type {Metadata} from 'next'
import Link from 'next/link'
import {Suspense} from 'react'
import {Container, Spinner} from '@/components/ui'
import {exigirAdmin} from '@/lib/associados/sessao'
import {NavAdmin} from './_componentes/NavAdmin'

export const metadata: Metadata = {title: {default: 'Painel da Diretoria', template: '%s · Painel da Diretoria'}, robots: {index: false}}

const STUDIO = process.env.NEXT_PUBLIC_STUDIO_URL ?? 'https://startupto.sanity.studio'

/** Só renderiza o conteúdo depois de confirmar o papel admin no servidor. */
async function SomenteAdmin({children}: {children: React.ReactNode}) {
  await exigirAdmin()
  return <>{children}</>
}

/** Páginas por usuário (sessão): fora da validação de navegação instantânea. */
export const instant = false

export default function AdminLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-papel">
      <header className="bg-azul-noite text-white">
        <Container className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-4">
          <Link href="/admin" className="flex items-baseline gap-3">
            <span className="font-display text-lg font-extrabold leading-tight">Painel da Diretoria</span>
            <span className="hidden text-sm text-white/70 sm:inline">Associação Tocantinense de Startups</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <a href={STUDIO} target="_blank" rel="noreferrer" className="font-semibold underline-offset-4 hover:underline">
              Editar conteúdo (Sanity)
            </a>
            <Link href="/" className="font-semibold underline-offset-4 hover:underline">
              Ver site
            </Link>
            <Link href="/associado" className="text-white/80 underline-offset-4 hover:underline">
              Minha área
            </Link>
          </div>
        </Container>
        <NavAdmin />
      </header>
      <main id="conteudo" className="flex-1 py-8 sm:py-10">
        <Container>
          <Suspense
            fallback={
              <div className="flex items-center gap-3 py-16 text-tinta-suave">
                <Spinner className="size-5" /> Carregando…
              </div>
            }
          >
            <SomenteAdmin>{children}</SomenteAdmin>
          </Suspense>
        </Container>
      </main>
    </div>
  )
}
