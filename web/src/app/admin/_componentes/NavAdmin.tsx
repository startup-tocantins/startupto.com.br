'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {Suspense} from 'react'
import {Container, cx} from '@/components/ui'

const ITENS = [
  {href: '/admin', rotulo: 'Associados'},
  {href: '/admin/atas', rotulo: 'Atas'},
  {href: '/admin/exclusoes', rotulo: 'Pedidos de exclusão (LGPD)'},
  {href: '/admin/configuracoes', rotulo: 'Configurações'},
]

function Itens({pathname}: {pathname: string | null}) {
  const ativo = (href: string) => !pathname ? false : (href === '/admin' ? pathname === '/admin' || pathname.startsWith('/admin/associados') : pathname.startsWith(href))
  return (
    <nav aria-label="Seções do painel" className="border-t border-white/10">
      <Container>
        <ul className="-mb-px flex gap-1 overflow-x-auto">
          {ITENS.map((i) => (
            <li key={i.href}>
              <Link
                href={i.href}
                aria-current={ativo(i.href) ? 'page' : undefined}
                className={cx(
                  'inline-flex min-h-11 items-center whitespace-nowrap border-b-3 px-3 text-sm font-medium',
                  ativo(i.href) ? 'border-laranja text-white' : 'border-transparent text-white/70 hover:text-white',
                )}
              >
                {i.rotulo}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </nav>
  )
}

function ItensComRota() {
  return <Itens pathname={usePathname()} />
}

/** A rota atual só é conhecida em tempo de execução: o shell estático mostra o menu sem destaque. */
export function NavAdmin() {
  return (
    <Suspense fallback={<Itens pathname={null} />}>
      <ItensComRota />
    </Suspense>
  )
}
