'use client'

import Image from 'next/image'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useEffect, useId, useRef, useState} from 'react'
import {botaoClasse, cx, IconeChevronBaixo, IconeFechar, IconeMenu, IconeSeta} from '@/components/ui'
import {ContaMovel, MenuConta, useSessao} from './MenuConta'
import {DOCUMENTOS, NAV} from './navegacao'

/** Submenu “Documentos” (desktop): abre no clique, fecha com Esc ou clique fora. */
function MenuDocumentos({ativo}: {ativo: boolean}) {
  const [aberto, setAberto] = useState(false)
  const raiz = useRef<HTMLLIElement>(null)
  const botao = useRef<HTMLButtonElement>(null)
  const id = useId()
  const pathname = usePathname()
  const [rota, setRota] = useState(pathname)
  if (aberto && rota !== pathname) {
    setAberto(false)
    setRota(pathname)
  }

  useEffect(() => {
    if (!aberto) return
    const fora = (e: MouseEvent) => {
      if (raiz.current && !raiz.current.contains(e.target as Node)) setAberto(false)
    }
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAberto(false)
        botao.current?.focus()
      }
    }
    document.addEventListener('mousedown', fora)
    document.addEventListener('keydown', tecla)
    return () => {
      document.removeEventListener('mousedown', fora)
      document.removeEventListener('keydown', tecla)
    }
  }, [aberto])

  return (
    <li ref={raiz} className="relative">
      <button
        ref={botao}
        type="button"
        aria-expanded={aberto}
        aria-controls={id}
        onClick={() => {
          setRota(pathname)
          setAberto((v) => !v)
        }}
        className={cx(itemNav(ativo), 'gap-1.5')}
      >
        Documentos
        <IconeChevronBaixo className={cx('size-4 transition-transform duration-200', aberto && 'rotate-180')} />
      </button>
      {aberto && (
        <ul
          id={id}
          className="absolute right-0 top-[calc(100%+0.25rem)] z-50 w-64 rounded-ficha bg-prancha p-2 shadow-ficha-alta ring-1 ring-linha"
        >
          {DOCUMENTOS.map((d) => (
            <li key={d.href}>
              <Link
                href={d.href}
                aria-current={pathname === d.href ? 'page' : undefined}
                className="flex min-h-11 items-center rounded-[10px] px-3 text-[0.9375rem] font-medium text-azul-noite hover:bg-azul-claro aria-[current=page]:text-azul"
              >
                {d.rotulo}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

const itemNav = (on: boolean) =>
  cx(
    'relative inline-flex h-11 items-center whitespace-nowrap rounded-[8px] px-2.5 text-[0.9375rem] font-medium transition-colors xl:px-3',
    'after:absolute after:inset-x-2.5 after:-bottom-1 after:h-[3px] after:rounded-full after:transition-colors xl:after:inset-x-3',
    on ? 'text-azul after:bg-azul' : 'text-azul-noite after:bg-transparent hover:text-azul',
  )

export function Cabecalho() {
  const pathname = usePathname()
  // O menu fica aberto só na rota em que foi aberto: navegar o fecha sem efeito colateral.
  const [abertoEm, setAbertoEm] = useState<string | null>(null)
  const aberto = abertoEm === pathname
  const botaoRef = useRef<HTMLButtonElement>(null)
  const sessao = useSessao()

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

  const ativa = (href: string) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`))
  const docAtivo = DOCUMENTOS.some((d) => ativa(d.href))

  return (
    <header className="sticky top-0 z-40 border-b border-linha/70 bg-prancha">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded focus:bg-azul-noite focus:px-4 focus:py-2 focus:text-white"
      >
        Pular para o conteúdo
      </a>
      <div className="mx-auto flex h-[4.75rem] w-full max-w-[90rem] items-center gap-4 px-4 sm:px-6 lg:h-[5.5rem] lg:px-8">
        <Link href="/" className="flex shrink-0 items-center" aria-label="Associação Tocantinense de Startups — página inicial">
          <Image src="/logo.webp" alt="" width={1200} height={413} priority className="h-11 w-auto lg:h-[3.75rem]" />
        </Link>

        <nav aria-label="Principal" className="ml-auto hidden xl:block">
          <ul className="flex items-center gap-0.5 2xl:gap-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={ativa(item.href) ? 'page' : undefined} className={itemNav(ativa(item.href))}>
                  {item.rotulo}
                </Link>
              </li>
            ))}
            <MenuDocumentos ativo={docAtivo} />
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 xl:ml-4">
          <MenuConta sessao={sessao} />
          {!sessao?.logado && (
            <Link href="/associe-se" className={botaoClasse('primario', 'md', 'hidden sm:inline-flex')}>
              Associe-se <IconeSeta />
            </Link>
          )}
          <button
            ref={botaoRef}
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-[10px] text-azul-noite ring-1 ring-linha hover:bg-azul-claro xl:hidden"
            aria-expanded={aberto}
            aria-controls="menu-movel"
            onClick={() => setAbertoEm(aberto ? null : pathname)}
          >
            {aberto ? <IconeFechar /> : <IconeMenu />}
            <span className="sr-only">{aberto ? 'Fechar menu' : 'Abrir menu'}</span>
          </button>
        </div>
      </div>

      {aberto && (
        <div
          id="menu-movel"
          className="fixed inset-x-0 bottom-0 top-[4.75rem] z-40 overflow-y-auto bg-papel lg:top-[5.5rem] xl:hidden"
        >
          <nav aria-label="Principal (celular)" className="mx-auto max-w-xl px-4 pb-10 pt-4">
            <ul className="flex flex-col gap-1.5">
              {[...NAV, ...DOCUMENTOS].map((item) => {
                const on = ativa(item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={on ? 'page' : undefined}
                      className={cx(
                        'flex min-h-13 items-center justify-between rounded-[12px] px-4 text-lg font-medium',
                        on ? 'bg-azul text-white' : 'bg-prancha text-azul-noite ring-1 ring-linha/70',
                      )}
                    >
                      {item.rotulo}
                      {on ? (
                        <span className="text-sm font-normal text-white/85">você está aqui</span>
                      ) : (
                        <IconeSeta className="size-4 text-azul" />
                      )}
                    </Link>
                  </li>
                )
              })}
              <ContaMovel sessao={sessao} />
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}
