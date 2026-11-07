'use client'

import Image from 'next/image'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useEffect, useRef, useState} from 'react'
import {botaoClasse, cx, IconeFechar, IconeMenu} from '@/components/ui'
import {ABAS, ROTAS_CONTA, type Tinta} from './navegacao'

const tintaAba: Record<Tinta, {base: string; ativa: string}> = {
  azul: {base: 'bg-azul text-white', ativa: 'bg-azul text-white'},
  noite: {base: 'bg-azul-noite text-white', ativa: 'bg-azul-noite text-white'},
  laranja: {base: 'bg-laranja text-azul-noite', ativa: 'bg-laranja text-azul-noite'},
  buriti: {base: 'bg-buriti text-white', ativa: 'bg-buriti text-white'},
}

export function Cabecalho() {
  const pathname = usePathname()
  // O menu fica aberto só na rota em que foi aberto: navegar o fecha sem efeito colateral.
  const [abertoEm, setAbertoEm] = useState<string | null>(null)
  const aberto = abertoEm === pathname
  const setAberto = (v: boolean | ((atual: boolean) => boolean)) =>
    setAbertoEm((atualEm) => {
      const novo = typeof v === 'function' ? v(atualEm === pathname) : v
      return novo ? pathname : null
    })
  const botaoRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!aberto) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAbertoEm(null)
        botaoRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [aberto])

  const ativa = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className="sticky top-0 z-40 border-b border-linha bg-prancha/95 backdrop-blur-[6px]">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded focus:bg-azul-noite focus:px-4 focus:py-2 focus:text-white"
      >
        Pular para o conteúdo
      </a>
      <div className="mx-auto flex h-[4.5rem] w-full max-w-[86rem] items-stretch gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center py-3" aria-label="Associação Tocantinense de Startups — página inicial">
          <Image
            src="/logo.webp"
            alt=""
            width={1200}
            height={413}
            priority
            className="h-10 w-auto sm:h-11"
          />
        </Link>

        {/* Índice do guia: abas que pendem do topo */}
        <nav aria-label="Principal" className="ml-auto hidden lg:flex">
          <ul className="flex items-start gap-1.5">
            {ABAS.map((aba) => {
              const on = ativa(aba.href)
              return (
                <li key={aba.href}>
                  <Link
                    href={aba.href}
                    aria-current={on ? 'page' : undefined}
                    className={cx(
                      'flex items-end rounded-b-[6px] px-4 text-[0.9375rem] font-semibold transition-[height,padding,filter] duration-300 ease-saida',
                      tintaAba[aba.tinta].base,
                      on ? 'h-[3.6rem] pb-2.5 shadow-ficha' : 'h-12 pb-2 brightness-100 hover:h-[3.3rem]',
                      !on && 'opacity-[0.92] hover:opacity-100',
                    )}
                  >
                    {aba.rotulo}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-4">
          <Link
            href={ROTAS_CONTA.entrar}
            className="hidden min-h-11 items-center rounded-botao px-3 text-[0.9375rem] font-semibold text-azul hover:bg-azul-claro sm:inline-flex"
          >
            Entrar
          </Link>
          <Link href="/associe-se" className={botaoClasse('primario', 'md', 'hidden sm:inline-flex')}>
            Associe-se
          </Link>
          <button
            ref={botaoRef}
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full text-azul-noite hover:bg-azul-claro lg:hidden"
            aria-expanded={aberto}
            aria-controls="menu-movel"
            onClick={() => setAberto((v) => !v)}
          >
            {aberto ? <IconeFechar /> : <IconeMenu />}
            <span className="sr-only">{aberto ? 'Fechar menu' : 'Abrir menu'}</span>
          </button>
        </div>
      </div>

      {aberto && (
        <div
          id="menu-movel"
          className="fixed inset-x-0 bottom-0 top-[4.5rem] z-40 overflow-y-auto bg-papel lg:hidden"
        >
          <nav aria-label="Principal (celular)" className="px-4 pb-10 pt-4">
            <ul className="flex flex-col gap-2">
              {ABAS.map((aba) => (
                <li key={aba.href}>
                  <Link
                    href={aba.href}
                    aria-current={ativa(aba.href) ? 'page' : undefined}
                    className={cx(
                      'flex min-h-14 items-center justify-between rounded-[6px] px-5 font-display text-xl font-bold',
                      tintaAba[aba.tinta].base,
                    )}
                  >
                    {aba.rotulo}
                    {ativa(aba.href) && <span className="text-sm font-semibold opacity-80">você está aqui</span>}
                  </Link>
                </li>
              ))}
              <li className="mt-4 grid grid-cols-2 gap-2">
                <Link href={ROTAS_CONTA.entrar} className={botaoClasse('contorno', 'lg')}>
                  Entrar
                </Link>
                <Link href="/associe-se" className={botaoClasse('primario', 'lg')}>
                  Associe-se
                </Link>
              </li>
              <li className="mt-6 flex flex-col gap-1 border-t border-linha pt-4 font-texto text-lg">
                <Link href="/manifesto" className="py-2 text-azul-noite">Manifesto</Link>
                <Link href="/mantenedores" className="py-2 text-azul-noite">Mantenedores</Link>
                <Link href="/documentos" className="py-2 text-azul-noite">Estatuto e Regimento</Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}
