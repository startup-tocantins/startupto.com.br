import Link from 'next/link'
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react'
import clsx from 'clsx'

export {clsx as cx}

/* ------------------------------------------------------------------ */
/* Botões                                                              */
/* ------------------------------------------------------------------ */

type Variante = 'primario' | 'secundario' | 'contorno' | 'fantasma' | 'claro' | 'perigo'
type Tamanho = 'md' | 'lg' | 'sm'

const varianteClasse: Record<Variante, string> = {
  // laranja-sol com tinta azul-noite: contraste ≥ 7:1
  primario:
    'bg-laranja text-azul-noite hover:bg-[#ffab3d] active:bg-[#e88a0a] shadow-[0_1px_0_rgb(8_38_77/0.25)]',
  secundario: 'bg-azul text-white hover:bg-azul-fundo active:bg-azul-noite',
  contorno:
    'bg-transparent text-azul ring-1 ring-inset ring-azul/40 hover:ring-azul hover:bg-azul-claro',
  fantasma: 'bg-transparent text-azul hover:bg-azul-claro',
  claro: 'bg-white text-azul-noite hover:bg-azul-claro',
  perigo: 'bg-erro text-white hover:bg-[#93201a]',
}

const tamanhoClasse: Record<Tamanho, string> = {
  sm: 'min-h-9 px-4 text-sm',
  md: 'min-h-11 px-5 text-[0.9375rem]',
  lg: 'min-h-13 px-7 text-base',
}

export function botaoClasse(variante: Variante = 'primario', tamanho: Tamanho = 'md', extra?: string) {
  return clsx(
    'inline-flex items-center justify-center gap-2 rounded-botao font-semibold tracking-[-0.01em]',
    'transition-[background-color,box-shadow,color,transform] duration-200 ease-saida',
    'active:translate-y-px disabled:cursor-not-allowed disabled:opacity-55 aria-disabled:opacity-55',
    varianteClasse[variante],
    tamanhoClasse[tamanho],
    extra,
  )
}

type BotaoProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: Variante
  tamanho?: Tamanho
  carregando?: boolean
}

export const Botao = forwardRef<HTMLButtonElement, BotaoProps>(function Botao(
  {variante, tamanho, carregando, className, children, disabled, ...props},
  ref,
) {
  return (
    <button
      ref={ref}
      className={botaoClasse(variante, tamanho, className)}
      disabled={disabled || carregando}
      aria-busy={carregando || undefined}
      {...props}
    >
      {carregando && <Spinner />}
      {children}
    </button>
  )
})

type BotaoLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  variante?: Variante
  tamanho?: Tamanho
}

export function BotaoLink({href, variante, tamanho, className, children, ...props}: BotaoLinkProps) {
  const externo = /^https?:|^mailto:|^tel:/.test(href)
  if (externo) {
    return (
      <a href={href} className={botaoClasse(variante, tamanho, className)} {...props}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={botaoClasse(variante, tamanho, className)} {...props}>
      {children}
    </Link>
  )
}

export function Spinner({className}: {className?: string}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={clsx('size-4 animate-spin', className)}
      aria-hidden="true"
      fill="none"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Formulários                                                         */
/* ------------------------------------------------------------------ */

const campoBase =
  'block w-full min-h-12 rounded-[4px] border border-linha-forte bg-white px-3.5 py-2.5 text-base text-tinta ' +
  'placeholder:text-tinta-fraca transition-[border-color,box-shadow] duration-150 ' +
  'hover:border-tinta-suave focus:border-azul focus:outline-none focus:ring-3 focus:ring-azul/20 ' +
  'aria-[invalid=true]:border-erro aria-[invalid=true]:ring-erro/15 disabled:bg-papel disabled:text-tinta-fraca'

type CampoProps = {
  id: string
  rotulo: ReactNode
  ajuda?: ReactNode
  erro?: string | string[] | null
  obrigatorio?: boolean
  children: ReactNode
  className?: string
}

/** Envolve um controle com rótulo, ajuda e erro acessíveis. */
export function Campo({id, rotulo, ajuda, erro, obrigatorio, children, className}: CampoProps) {
  const msg = Array.isArray(erro) ? erro[0] : erro
  return (
    <div className={clsx('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-[0.9375rem] font-semibold text-azul-noite">
        {rotulo}
        {obrigatorio && (
          <span className="ml-1 font-normal text-tinta-fraca" aria-hidden="true">
            (obrigatório)
          </span>
        )}
      </label>
      {children}
      {ajuda && !msg && (
        <p id={`${id}-ajuda`} className="font-texto text-[0.9375rem] leading-snug text-tinta-suave">
          {ajuda}
        </p>
      )}
      {msg && (
        <p id={`${id}-erro`} role="alert" className="flex items-start gap-1.5 text-sm font-medium text-erro">
          <IconeAlerta className="mt-0.5 size-4 shrink-0" />
          {msg}
        </p>
      )}
    </div>
  )
}

export function descricaoCampo(id: string, temErro: boolean, temAjuda: boolean) {
  if (temErro) return `${id}-erro`
  if (temAjuda) return `${id}-ajuda`
  return undefined
}

export const Entrada = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Entrada({className, ...props}, ref) {
    return <input ref={ref} className={clsx(campoBase, className)} {...props} />
  },
)

export const AreaTexto = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function AreaTexto({className, ...props}, ref) {
    return <textarea ref={ref} className={clsx(campoBase, 'min-h-28 leading-relaxed', className)} {...props} />
  },
)

export const Selecao = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Selecao({className, children, ...props}, ref) {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={clsx(campoBase, 'appearance-none pr-10', className)}
          {...props}
        >
          {children}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-tinta-suave"
        >
          <path d="m6 8 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      </div>
    )
  },
)

type CaixaProps = InputHTMLAttributes<HTMLInputElement> & {rotulo: ReactNode; erro?: string | null}

export const CaixaMarcacao = forwardRef<HTMLInputElement, CaixaProps>(function CaixaMarcacao(
  {rotulo, erro, id, className, ...props},
  ref,
) {
  return (
    <div className={className}>
      <label htmlFor={id} className="group flex cursor-pointer items-start gap-3 py-1">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          aria-invalid={erro ? true : undefined}
          aria-describedby={erro ? `${id}-erro` : undefined}
          className="mt-0.5 size-5 shrink-0 cursor-pointer rounded-[3px] border-linha-forte accent-azul"
          {...props}
        />
        <span className="font-texto text-[1.0625rem] leading-snug text-tinta">{rotulo}</span>
      </label>
      {erro && (
        <p id={`${id}-erro`} role="alert" className="ml-8 text-sm font-medium text-erro">
          {erro}
        </p>
      )}
    </div>
  )
})

/* ------------------------------------------------------------------ */
/* Avisos                                                              */
/* ------------------------------------------------------------------ */

type Tom = 'info' | 'sucesso' | 'erro' | 'atencao'
const tomClasse: Record<Tom, string> = {
  info: 'bg-azul-claro text-azul-noite ring-azul/20',
  sucesso: 'bg-buriti-claro text-[#123f2b] ring-buriti/25',
  erro: 'bg-erro-claro text-[#7a1712] ring-erro/25',
  atencao: 'bg-laranja-claro text-laranja-tinta ring-laranja/40',
}

export function Aviso({
  tom = 'info',
  titulo,
  children,
  className,
}: {
  tom?: Tom
  titulo?: ReactNode
  children?: ReactNode
  className?: string
}) {
  return (
    <div
      role={tom === 'erro' ? 'alert' : 'status'}
      className={clsx('rounded-ficha px-4 py-3.5 ring-1 ring-inset', tomClasse[tom], className)}
    >
      {titulo && <p className="font-semibold">{titulo}</p>}
      {children && <div className={clsx('font-texto text-[1.0625rem] leading-snug', titulo && 'mt-1')}>{children}</div>}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Ficha de herbário + etiqueta                                        */
/* ------------------------------------------------------------------ */

/**
 * Ficha: folha branca com etiqueta de herbário. Base de cards da Vitrine,
 * eventos, notícias e painéis da área do associado.
 */
export function Ficha({
  children,
  className,
  como: Tag = 'article',
  interativa,
}: {
  children: ReactNode
  className?: string
  como?: 'article' | 'div' | 'section' | 'li'
  interativa?: boolean
}) {
  return (
    <Tag
      className={clsx(
        'relative rounded-ficha bg-prancha ring-1 ring-linha shadow-ficha',
        interativa &&
          'transition-[box-shadow,transform] duration-300 ease-saida hover:-translate-y-0.5 hover:shadow-ficha-alta focus-within:shadow-ficha-alta',
        className,
      )}
    >
      {children}
    </Tag>
  )
}

/** Etiqueta tabular de herbário: pares rótulo/valor com régua fina. */
export function Etiqueta({
  linhas,
  className,
}: {
  linhas: Array<{rotulo: string; valor: ReactNode} | null | false | undefined | ''>
  className?: string
}) {
  const itens = linhas.filter(Boolean) as Array<{rotulo: string; valor: ReactNode}>
  return (
    <dl className={clsx('divide-y divide-linha border-y border-linha text-sm', className)}>
      {itens.map((l) => (
        <div key={l.rotulo} className="grid grid-cols-[6.5rem_1fr] items-baseline gap-3 py-1.5">
          <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-tinta-fraca">
            {l.rotulo}
          </dt>
          <dd className="font-texto text-[1rem] leading-snug text-tinta">{l.valor}</dd>
        </div>
      ))}
    </dl>
  )
}

/** Selo pequeno (categoria, status, “Fundador”). */
export function Selo({
  children,
  tom = 'azul',
  className,
}: {
  children: ReactNode
  tom?: 'azul' | 'laranja' | 'buriti' | 'neutro' | 'erro'
  className?: string
}) {
  const t = {
    azul: 'bg-azul-claro text-azul-noite',
    laranja: 'bg-laranja-claro text-laranja-tinta',
    buriti: 'bg-buriti-claro text-[#123f2b]',
    neutro: 'bg-papel text-tinta-suave ring-1 ring-inset ring-linha',
    erro: 'bg-erro-claro text-[#7a1712]',
  }[tom]
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-[0.01em]',
        t,
        className,
      )}
    >
      {children}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Estrutura de página                                                 */
/* ------------------------------------------------------------------ */

export function Container({children, className}: {children: ReactNode; className?: string}) {
  return <div className={clsx('mx-auto w-full max-w-[76rem] px-4 sm:px-6 lg:px-8', className)}>{children}</div>
}

type Fundo = 'papel' | 'branco' | 'azul' | 'laranja' | 'buriti' | 'noite'
const fundoClasse: Record<Fundo, string> = {
  papel: 'bg-papel text-tinta',
  branco: 'bg-prancha text-tinta',
  azul: 'bg-azul-fundo text-white',
  laranja: 'bg-laranja text-azul-noite',
  buriti: 'bg-buriti text-white',
  noite: 'bg-azul-noite text-white',
}

/**
 * Prancha: uma seção do guia de campo. O número da prancha corre na margem
 * (nunca acima do título).
 */
export function Prancha({
  id,
  titulo,
  introducao,
  numero,
  fundo = 'papel',
  acao,
  children,
  className,
  nivel = 2,
}: {
  id?: string
  titulo?: ReactNode
  introducao?: ReactNode
  numero?: number
  fundo?: Fundo
  acao?: ReactNode
  children?: ReactNode
  className?: string
  nivel?: 1 | 2
}) {
  const escuro = fundo === 'azul' || fundo === 'buriti' || fundo === 'noite'
  const H = nivel === 1 ? 'h1' : 'h2'
  return (
    <section
      id={id}
      aria-labelledby={titulo && id ? `${id}-titulo` : undefined}
      className={clsx('relative py-16 sm:py-20 lg:py-24', fundoClasse[fundo], className)}
    >
      {numero !== undefined && (
        <span
          aria-hidden="true"
          className={clsx(
            'absolute right-3 top-20 hidden origin-top-right translate-x-0 rotate-90 text-[0.6875rem] font-semibold uppercase tracking-[0.22em] xl:block',
            escuro ? 'text-white/55' : 'text-tinta-fraca',
          )}
        >
          Prancha {String(numero).padStart(2, '0')}
        </span>
      )}
      <Container>
        {(titulo || acao) && (
          <div className="mb-10 flex flex-col gap-5 sm:mb-12 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              {titulo && (
                <H
                  id={id ? `${id}-titulo` : undefined}
                  className={clsx(
                    'font-display font-extrabold leading-[1.02]',
                    nivel === 1
                      ? 'text-[clamp(2.4rem,5.5vw,4.25rem)]'
                      : 'text-[clamp(1.9rem,3.8vw,3rem)]',
                    escuro ? 'text-white' : 'text-azul-noite',
                  )}
                >
                  {titulo}
                </H>
              )}
              {introducao && (
                <div
                  className={clsx(
                    'mt-4 max-w-[60ch] font-texto text-[1.1875rem] leading-relaxed',
                    escuro ? 'text-white/85' : fundo === 'laranja' ? 'text-azul-noite' : 'text-tinta-suave',
                  )}
                >
                  {introducao}
                </div>
              )}
            </div>
            {acao && <div className="shrink-0">{acao}</div>}
          </div>
        )}
        {children}
      </Container>
    </section>
  )
}

/** Estado vazio como convite: nunca conteúdo falso. */
export function EstadoVazio({
  titulo,
  children,
  acao,
  className,
}: {
  titulo: ReactNode
  children?: ReactNode
  acao?: ReactNode
  className?: string
}) {
  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-ficha border border-dashed border-linha-forte bg-prancha/60 px-6 py-10 text-center sm:px-10',
        className,
      )}
    >
      <PontosDecorativos className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-16 w-64 text-azul/15" />
      <p className="relative font-display text-xl font-bold text-azul-noite">{titulo}</p>
      {children && (
        <div className="relative mx-auto mt-2 max-w-[48ch] font-texto text-[1.0625rem] leading-relaxed text-tinta-suave">
          {children}
        </div>
      )}
      {acao && <div className="relative mt-6 flex flex-wrap justify-center gap-3">{acao}</div>}
    </div>
  )
}

function PontosDecorativos({className}: {className?: string}) {
  return (
    <svg viewBox="0 0 256 64" className={className} aria-hidden="true">
      {Array.from({length: 48}, (_, i) => {
        const x = 8 + (i % 16) * 16
        const y = 10 + Math.floor(i / 16) * 18
        const r = 2 + ((i * 7) % 5) * 0.6
        return <circle key={i} cx={x} cy={y} r={r} fill="currentColor" />
      })}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Ícones (traço único 1.75)                                           */
/* ------------------------------------------------------------------ */

type IconeProps = {className?: string}
const svgProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

export const IconeSeta = ({className}: IconeProps) => (
  <svg {...svgProps} className={clsx('size-4', className)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)
export const IconeExterno = ({className}: IconeProps) => (
  <svg {...svgProps} className={clsx('size-4', className)}>
    <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </svg>
)
export const IconeCalendario = ({className}: IconeProps) => (
  <svg {...svgProps} className={clsx('size-4', className)}>
    <rect x="3.5" y="5" width="17" height="15" rx="1.5" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </svg>
)
export const IconeLocal = ({className}: IconeProps) => (
  <svg {...svgProps} className={clsx('size-4', className)}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
)
export const IconeDocumento = ({className}: IconeProps) => (
  <svg {...svgProps} className={clsx('size-4', className)}>
    <path d="M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8l-5-5Z" />
    <path d="M14 3v5h5M8.5 13h7M8.5 16.5h5" />
  </svg>
)
export const IconeDownload = ({className}: IconeProps) => (
  <svg {...svgProps} className={clsx('size-4', className)}>
    <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
  </svg>
)
export const IconeMais = ({className}: IconeProps) => (
  <svg {...svgProps} className={clsx('size-4', className)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)
export const IconeFechar = ({className}: IconeProps) => (
  <svg {...svgProps} className={clsx('size-5', className)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)
export const IconeMenu = ({className}: IconeProps) => (
  <svg {...svgProps} className={clsx('size-5', className)}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)
export const IconeAlerta = ({className}: IconeProps) => (
  <svg {...svgProps} className={clsx('size-4', className)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5.5M12 16.5v.01" />
  </svg>
)
export const IconeCheck = ({className}: IconeProps) => (
  <svg {...svgProps} className={clsx('size-4', className)}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
)
export const IconeWhatsapp = ({className}: IconeProps) => (
  <svg {...svgProps} className={clsx('size-5', className)}>
    <path d="M4.5 19.5 5.7 15.6A7.8 7.8 0 1 1 8.6 18.4l-4.1 1.1Z" />
    <path d="M9.3 8.6c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c-.1.1-.1.3 0 .5.6 1 1.4 1.8 2.4 2.4.2.1.4.1.5 0l.6-.5c.2-.1.4-.2.6-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3 0 .6-.5.8-.6.3-1.4.5-2.2.3-2.6-.7-4.6-2.7-5.3-5.3-.2-.8 0-1.6.3-2.2Z" />
  </svg>
)
export const IconeInstagram = ({className}: IconeProps) => (
  <svg {...svgProps} className={clsx('size-5', className)}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
    <circle cx="12" cy="12" r="3.8" />
    <path d="M17.2 6.8v.01" />
  </svg>
)
export const IconeLinkedin = ({className}: IconeProps) => (
  <svg {...svgProps} className={clsx('size-5', className)}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
    <path d="M8 10.5V16M8 7.8v.01M11.5 16v-3.2a2.2 2.2 0 0 1 4.4 0V16M11.5 10.5V16" />
  </svg>
)
export const IconeEmail = ({className}: IconeProps) => (
  <svg {...svgProps} className={clsx('size-5', className)}>
    <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
    <path d="m3.5 7 8.5 6 8.5-6" />
  </svg>
)
