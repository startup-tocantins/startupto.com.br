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
  const regionais = membros.filter((m) => /Ecossistema de Inovação/i.test(m.cargo))
  return (
    <Prancha
      nivel={1}
      rotulo="Quem conduz a Associação"
      titulo="Diretoria"
      introducao="Eleita em Assembleia Geral, a Diretoria conduz a gestão da Associação, com diretorias regionais para que o Tocantins inteiro esteja representado."
      fundo="papel"
     
    >
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {membros.map((m, i) => (
          <li key={m._id}>
            <MembroDiretoria membro={m} prioridade={i < 4} />
          </li>
        ))}
      </ul>
      {regionais.length > 0 && (
        <div className="mt-12 rounded-ficha bg-prancha p-6 ring-1 ring-linha sm:p-8">
          <h2 className="font-display text-xl font-bold text-azul-noite">Diretorias regionais</h2>
          <p className="mt-2 max-w-[52ch] text-base leading-relaxed text-tinta-suave">
            Cada região do estado tem uma diretoria dedicada ao seu ecossistema de inovação.
          </p>
          <dl className="mt-5 grid border-t border-linha sm:grid-cols-2 sm:gap-x-10">
            {regionais.map((m) => (
              <div key={m._id} className="grid grid-cols-[8.5rem_1fr] items-baseline gap-3 border-b border-linha py-2.5">
                <dt className="text-xs font-medium uppercase tracking-[0.1em] text-tinta-fraca">
                  {m.cargo.replace(/^Diretora? de Ecossistema de Inovação\s*/i, '')}
                </dt>
                <dd className="text-base text-azul-noite">{m.nome}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </Prancha>
  )
}
