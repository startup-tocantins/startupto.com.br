import Image from 'next/image'
import {PortableText, type PortableTextComponents} from '@portabletext/react'
import type {PortableTextBlock} from 'next-sanity'
import {urlFor} from '@/sanity/image'
import type {Imagem} from '@/sanity/queries'
import {cx} from '@/components/ui'

type Tabela = {linhas?: {_key: string; celulas?: string[]}[]}

const componentes: PortableTextComponents = {
  marks: {
    link: ({value, children}) => {
      const href: string = value?.href ?? '#'
      const externo = /^https?:/.test(href)
      return (
        <a href={href} {...(externo ? {target: '_blank', rel: 'noopener noreferrer'} : {})}>
          {children}
          {externo && <span className="sr-only"> (abre em nova aba)</span>}
        </a>
      )
    },
  },
  types: {
    image: ({value}: {value: Imagem & {legenda?: string}}) =>
      value?.asset ? (
        <figure className="my-8">
          <Image
            src={urlFor(value).width(1400).fit('max').url()}
            alt={value.alt ?? ''}
            width={1400}
            height={900}
            sizes="(min-width: 768px) 68ch, 100vw"
            className="h-auto w-full rounded-ficha"
          />
          {value.legenda && (
            <figcaption className="mt-2 text-[0.9375rem] italic text-tinta-suave">{value.legenda}</figcaption>
          )}
        </figure>
      ) : null,
    tabela: ({value}: {value: Tabela}) => {
      const [cab, ...corpo] = value.linhas ?? []
      if (!cab) return null
      return (
        <div className="-mx-4 my-8 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[34rem] border-collapse text-left font-sans text-[0.9375rem] leading-snug">
            <thead>
              <tr>
                {cab.celulas?.map((c, i) => (
                  <th
                    key={i}
                    scope="col"
                    className="border-b-2 border-azul-noite py-2 pr-4 align-bottom text-xs font-bold uppercase tracking-[0.08em] text-azul-noite"
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {corpo.map((l) => (
                <tr key={l._key} className="border-b border-linha">
                  {l.celulas?.map((c, i) => (
                    <td key={i} className={cx('py-3 pr-4 align-top', i === 0 && 'font-semibold text-azul-noite')}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    },
  },
}

export function TextoRico({valor, className}: {valor?: PortableTextBlock[]; className?: string}) {
  if (!valor?.length) return null
  return (
    <div className={cx('leitura', className)}>
      <PortableText value={valor} components={componentes} />
    </div>
  )
}
