'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useEffect, useId, useRef, useState} from 'react'
import {sair} from '@/app/(conta)/acoes-auth'
import {botaoClasse, cx} from '@/components/ui'
import {ROTAS_CONTA} from './navegacao'

type Sessao =
  | {logado: false}
  | {logado: true; nome: string; primeiroNome: string; iniciais: string; email: string; admin: boolean}

/** Há cookie de sessão do Supabase? (evita chamar a API para quem não está logado) */
function temCookieDeSessao() {
  return typeof document !== 'undefined' && /(?:^|;\s*)sb-[^=]+-auth-token(?:\.0)?=/.test(document.cookie)
}

/** Sessão do visitante: null enquanto carrega. */
export function useSessao(): Sessao | null {
  const pathname = usePathname()
  const [sessao, setSessao] = useState<Sessao | null>(null)

  useEffect(() => {
    let ativo = true
    if (!temCookieDeSessao()) {
      Promise.resolve().then(() => ativo && setSessao({logado: false}))
      return () => {
        ativo = false
      }
    }
    fetch('/api/sessao', {cache: 'no-store'})
      .then((r) => (r.ok ? r.json() : {logado: false}))
      .then((s: Sessao) => ativo && setSessao(s))
      .catch(() => ativo && setSessao({logado: false}))
    return () => {
      ativo = false
    }
  }, [pathname])

  return sessao
}

const itemClasse =
  'flex min-h-11 w-full items-center rounded-[10px] px-3 text-left text-[0.9375rem] font-medium text-azul-noite hover:bg-azul-claro focus-visible:bg-azul-claro'

/** Cabeçalho (desktop): "Entrar" ou as iniciais com menu da conta. */
export function MenuConta({sessao}: {sessao: Sessao | null}) {
  const [aberto, setAberto] = useState(false)
  const raiz = useRef<HTMLDivElement>(null)
  const botao = useRef<HTMLButtonElement>(null)
  const idMenu = useId()
  const pathname = usePathname()
  const [rotaAberta, setRotaAberta] = useState(pathname)
  if (aberto && rotaAberta !== pathname) {
    setAberto(false)
    setRotaAberta(pathname)
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

  if (sessao === null) {
    // Carregando: reserva o espaço do botão para não pular o layout.
    return <span aria-hidden="true" className="hidden size-11 sm:inline-block" />
  }

  if (!sessao.logado) {
    return (
      <Link
        href={ROTAS_CONTA.entrar}
        className="hidden min-h-11 items-center rounded-botao px-3 text-[0.9375rem] font-medium text-azul hover:bg-azul-claro sm:inline-flex"
      >
        Entrar
      </Link>
    )
  }

  return (
    <div ref={raiz} className="relative hidden sm:block">
      <button
        ref={botao}
        type="button"
        aria-haspopup="menu"
        aria-expanded={aberto}
        aria-controls={idMenu}
        onClick={() => {
          setRotaAberta(pathname)
          setAberto((v) => !v)
        }}
        className={cx(
          'flex size-11 items-center justify-center rounded-full bg-azul font-display text-[0.9375rem] font-bold tracking-[0.02em] text-white',
          'ring-2 ring-transparent transition-[box-shadow] duration-200 hover:ring-azul/30',
          aberto && 'ring-laranja',
        )}
      >
        <span aria-hidden="true">{sessao.iniciais}</span>
        <span className="sr-only">Menu da conta de {sessao.nome}</span>
      </button>
      {aberto && (
        <div
          id={idMenu}
          role="menu"
          aria-label="Conta"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-72 rounded-ficha bg-prancha p-2 shadow-ficha-alta ring-1 ring-linha"
        >
          <div className="border-b border-linha px-3 pb-3 pt-2">
            <p className="font-display font-bold text-azul-noite">{sessao.nome}</p>
            <p className="truncate text-sm text-tinta-suave">{sessao.email}</p>
          </div>
          <div className="flex flex-col py-1">
            <Link role="menuitem" href="/associado" className={itemClasse}>
              Minha área
            </Link>
            {sessao.admin && (
              <Link role="menuitem" href="/admin" className={itemClasse}>
                Painel da Diretoria
              </Link>
            )}
            <Link role="menuitem" href="/associado/perfil" className={itemClasse}>
              Editar meus dados
            </Link>
            <Link role="menuitem" href="/associado/senha" className={itemClasse}>
              Senha de acesso
            </Link>
            <Link role="menuitem" href="/associado/privacidade" className={itemClasse}>
              Privacidade e exclusão de dados
            </Link>
          </div>
          <form action={sair} className="border-t border-linha pt-1">
            <button role="menuitem" type="submit" className={itemClasse}>
              Sair
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

/** Menu do celular: botões de conta conforme a sessão. */
export function ContaMovel({sessao}: {sessao: Sessao | null}) {
  if (sessao?.logado) {
    return (
      <li className="mt-4 flex flex-col gap-2">
        <p className="px-1 text-base text-tinta-suave">
          Olá, <strong className="text-azul-noite">{sessao.primeiroNome}</strong>
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Link href="/associado" className={botaoClasse('secundario', 'lg')}>
            Minha área
          </Link>
          <form action={sair} className="contents">
            <button type="submit" className={botaoClasse('contorno', 'lg')}>
              Sair
            </button>
          </form>
        </div>
        {sessao.admin && (
          <Link href="/admin" className={botaoClasse('contorno', 'lg')}>
            Painel da Diretoria
          </Link>
        )}
        <Link href="/associado/senha" className="px-1 py-2 text-base text-azul-noite underline underline-offset-4">
          Senha de acesso
        </Link>
        <Link href="/associado/privacidade" className="px-1 py-2 text-base text-azul-noite underline underline-offset-4">
          Privacidade e exclusão de dados
        </Link>
      </li>
    )
  }
  return (
    <li className="mt-4 grid grid-cols-2 gap-2">
      <Link href={ROTAS_CONTA.entrar} className={botaoClasse('contorno', 'lg')}>
        Entrar
      </Link>
      <Link href="/associe-se" className={botaoClasse('primario', 'lg')}>
        Associe-se
      </Link>
    </li>
  )
}
