import type {Metadata} from 'next'
import {getDiretoria} from '@/sanity/queries'
import {MembroDiretoria} from '@/components/site/MembroDiretoria'
import {Prancha} from '@/components/ui'

export const metadata: Metadata = {
  title: 'Diretoria',
  description: 'Conheça a Diretoria da Associação Tocantinense de Startups.',
  alternates: {canonical: '/diretoria'},
}

export default async function Diretoria() {
  const membros = await getDiretoria()
  const [presidencia, ...demais] = membros
  const regionais = membros.filter((m) => /Ecossistema de Inovação/i.test(m.cargo))
  return (
    <Prancha
      nivel={1}
      titulo="Diretoria"
      introducao="Eleita em Assembleia Geral, a Diretoria conduz a gestão da Associação, com diretorias regionais para que o Tocantins inteiro esteja representado."
      fundo="papel"
      numero={1}
    >
      {presidencia && (
        <div className="mb-12 grid gap-8 md:grid-cols-[minmax(0,20rem)_1fr] md:items-start">
          <MembroDiretoria membro={presidencia} destaque prioridade />
          {regionais.length > 0 && (
            <div className="rounded-ficha bg-prancha p-6 ring-1 ring-linha sm:p-8 md:mt-2">
              <h2 className="font-display text-xl font-extrabold text-azul-noite">Diretorias regionais</h2>
              <p className="mt-2 max-w-[52ch] font-texto text-[1.0625rem] leading-relaxed text-tinta-suave">
                Cada região do estado tem uma diretoria dedicada ao seu ecossistema de inovação.
              </p>
              <dl className="mt-5 divide-y divide-linha border-y border-linha">
                {regionais.map((m) => (
                  <div key={m._id} className="grid grid-cols-[8.5rem_1fr] items-baseline gap-3 py-2.5">
                    <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-tinta-fraca">
                      {m.cargo.replace(/^Diretora? de Ecossistema de Inovação\s*/i, '')}
                    </dt>
                    <dd className="font-texto text-[1.0625rem] text-azul-noite">{m.nome}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      )}
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {demais.map((m, i) => (
          <li key={m._id}>
            <MembroDiretoria membro={m} prioridade={i < 4} />
          </li>
        ))}
      </ul>
    </Prancha>
  )
}
