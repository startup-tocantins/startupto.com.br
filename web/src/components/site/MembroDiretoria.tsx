import Image from 'next/image'
import {urlFor} from '@/sanity/image'
import type {Membro} from '@/sanity/queries'
import {iniciais} from '@/lib/formatos'
import {IconeLinkedin, IconeMais} from '@/components/ui'

/** Retrato: foto real ou placeholder com iniciais sobre o mapa em pontos. */
function Retrato({membro, prioridade}: {membro: Membro; prioridade?: boolean}) {
  if (membro.foto?.asset) {
    return (
      <Image
        src={urlFor(membro.foto).width(560).height(700).fit('crop').url()}
        alt={`Foto de ${membro.nome}`}
        width={560}
        height={700}
        sizes="(min-width: 1024px) 18rem, (min-width: 640px) 45vw, 90vw"
        priority={prioridade}
        className="aspect-[4/5] h-auto w-full object-cover"
      />
    )
  }
  return (
    <div
      className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden bg-azul-fundo"
      role="img"
      aria-label={`Iniciais de ${membro.nome} (foto em breve)`}
    >
      <svg viewBox="0 0 120 150" className="absolute inset-0 size-full" aria-hidden="true">
        {Array.from({length: 70}, (_, i) => {
          const col = i % 7
          const lin = Math.floor(i / 7)
          const r = 1.4 + ((i * 13) % 7) * 0.45
          return (
            <circle
              key={i}
              cx={10 + col * 16.5 + (lin % 2) * 6}
              cy={9 + lin * 15}
              r={r}
              className="fill-white/[0.09]"
            />
          )
        })}
      </svg>
      <span className="relative font-display text-[clamp(3rem,7vw,4.5rem)] font-extrabold tracking-[-0.03em] text-laranja">
        {iniciais(membro.nome)}
      </span>
    </div>
  )
}

export function MembroDiretoria({membro, destaque, prioridade}: {membro: Membro; destaque?: boolean; prioridade?: boolean}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-ficha bg-prancha ring-1 ring-linha shadow-ficha">
      <Retrato membro={membro} prioridade={prioridade} />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className={destaque ? 'font-display text-2xl font-extrabold leading-tight text-azul-noite' : 'font-display text-lg font-bold leading-tight text-azul-noite'}>
            {membro.nome}
          </h3>
          <p className="mt-1 font-texto text-[1.0625rem] italic leading-snug text-azul">{membro.cargo}</p>
        </div>
        {membro.bio && (
          <details className="group/bio mt-auto border-t border-linha pt-3">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 text-[0.9375rem] font-semibold text-azul marker:hidden hover:text-azul-noite [&::-webkit-details-marker]:hidden">
              <span className="group-open/bio:hidden">Ler bio</span>
              <span className="hidden group-open/bio:inline">Recolher bio</span>
              <IconeMais className="size-4 transition-transform duration-300 ease-saida group-open/bio:rotate-45" />
            </summary>
            <p className="pb-1 pt-2 font-texto text-[1rem] leading-relaxed text-tinta-suave">{membro.bio}</p>
          </details>
        )}
        {membro.linkedin && (
          <a
            href={membro.linkedin}
            rel="noopener"
            className="inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-semibold text-azul hover:text-azul-noite"
          >
            <IconeLinkedin className="size-4" /> LinkedIn
          </a>
        )}
      </div>
    </article>
  )
}
