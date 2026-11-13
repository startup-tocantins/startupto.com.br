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
  // laranja do sol com tinta azul-noite: contraste ≥ 6:1 (branco sobre laranja não passa AA)
  primario: 'bg-laranja text-azul-noite shadow-botao hover:bg-laranja-forte active:bg-[#d96f00]',
  secundario: 'bg-azul text-white hover:bg-azul-fundo active:bg-azul-noite',
  contorno:
    'bg-prancha text-azul-noite ring-1 ring-inset ring-azul-tinta hover:ring-azul hover:bg-azul-claro',
  fantasma: 'bg-transparent text-azul hover:bg-azul-claro',
  claro: 'bg-white text-azul-noite hover:bg-azul-claro',
  perigo: 'bg-erro text-white hover:bg-[#93201a]',
}

const tamanhoClasse: Record<Tamanho, string> = {
  sm: 'min-h-9 px-3.5 text-sm',
  md: 'min-h-11 px-5 text-[0.9375rem]',
  lg: 'min-h-13 px-6 text-base',
}

export function botaoClasse(variante: Variante = 'primario', tamanho: Tamanho = 'md', extra?: string) {
  return clsx(
    'inline-flex items-center justify-center gap-2.5 rounded-botao font-medium',
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
  'block w-full min-h-12 rounded-campo border border-linha-forte bg-white px-3.5 py-2.5 text-base text-tinta ' +
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
      <label htmlFor={id} className="text-[0.9375rem] font-medium text-azul-noite">
        {rotulo}
        {obrigatorio && (
          <span className="ml-1 font-normal text-tinta-fraca" aria-hidden="true">
            (obrigatório)
          </span>
        )}
      </label>
      {children}
      {ajuda && !msg && (
        <p id={`${id}-ajuda`} className="text-sm leading-snug text-tinta-suave">
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
          className="mt-0.5 size-5 shrink-0 cursor-pointer rounded-[10px] border-linha-forte accent-azul"
          {...props}
        />
        <span className="text-base leading-snug text-tinta">{rotulo}</span>
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
  sucesso: 'bg-buriti-claro text-[#0f4d27] ring-buriti/25',
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
      className={clsx('rounded-[12px] px-4 py-3.5 ring-1 ring-inset', tomClasse[tom], className)}
    >
      {titulo && <p className="font-bold">{titulo}</p>}
      {children && <div className={clsx('text-[0.9375rem] leading-snug', titulo && 'mt-1')}>{children}</div>}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Ficha (cartão) + etiqueta                                           */
/* ------------------------------------------------------------------ */

/**
 * Ficha: cartão branco de cantos generosos. Base de cards da Vitrine,
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
        'relative rounded-ficha bg-prancha ring-1 ring-linha/70 shadow-ficha',
        interativa &&
          'transition-[box-shadow,transform] duration-300 ease-saida hover:-translate-y-0.5 hover:shadow-ficha-alta focus-within:shadow-ficha-alta',
        className,
      )}
    >
      {children}
    </Tag>
  )
}

/** Etiqueta: pares rótulo/valor com régua fina. */
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
          <dt className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-tinta-fraca">
            {l.rotulo}
          </dt>
          <dd className="text-[0.9375rem] leading-snug text-tinta">{l.valor}</dd>
        </div>
      ))}
    </dl>
  )
}

export type TomSelo = 'azul' | 'laranja' | 'ipe' | 'buriti' | 'roxo' | 'neutro' | 'erro'

/** Selo pequeno (categoria, status, “Fundador”). */
export function Selo({
  children,
  tom = 'azul',
  className,
}: {
  children: ReactNode
  tom?: TomSelo
  className?: string
}) {
  const t = {
    azul: 'bg-azul-claro text-azul-noite',
    laranja: 'bg-laranja-claro text-laranja-tinta',
    ipe: 'bg-ipe-claro text-ipe-tinta ring-1 ring-inset ring-ipe/60',
    buriti: 'bg-buriti-claro text-[#0f4d27]',
    roxo: 'bg-roxo-claro text-roxo',
    neutro: 'bg-papel text-tinta-suave ring-1 ring-inset ring-linha',
    erro: 'bg-erro-claro text-[#7a1712]',
  }[tom]
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
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
  return <div className={clsx('mx-auto w-full max-w-[80rem] px-4 sm:px-6 lg:px-8', className)}>{children}</div>
}

type Fundo = 'papel' | 'branco' | 'laranja'
const fundoClasse: Record<Fundo, string> = {
  papel: 'bg-papel text-tinta',
  branco: 'bg-prancha text-tinta',
  laranja: 'bg-gradient-to-br from-laranja-claro via-ipe-claro to-papel text-tinta',
}

/** Rótulo em pílula azul-clara (ex.: “Ecossistema de inovação do Tocantins”). */
export function Rotulo({children, className}: {children: ReactNode; className?: string}) {
  return (
    <p
      className={clsx(
        'inline-flex items-center rounded-full bg-azul-claro px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.04em] text-azul',
        className,
      )}
    >
      {children}
    </p>
  )
}

/** Link “Ver todos →” do canto das seções. */
export function LinkSeta({href, children, className}: {href: string; children: ReactNode; className?: string}) {
  return (
    <Link
      href={href}
      className={clsx(
        'group inline-flex min-h-11 items-center gap-2 rounded-botao px-2 text-[0.9375rem] font-medium text-azul hover:text-azul-fundo',
        className,
      )}
    >
      {children}
      <IconeSeta className="size-4 transition-transform duration-300 ease-saida group-hover:translate-x-1" />
    </Link>
  )
}

/** Cabeçalho de seção: ícone azul, título, subtítulo e ação à direita. */
export function CabecalhoSecao({
  id,
  titulo,
  introducao,
  icone,
  acao,
  nivel = 2,
  className,
}: {
  id?: string
  titulo: ReactNode
  introducao?: ReactNode
  icone?: ReactNode
  acao?: ReactNode
  nivel?: 2 | 3
  className?: string
}) {
  const H = nivel === 2 ? 'h2' : 'h3'
  return (
    <div className={clsx('mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-3', className)}>
      <div className="flex min-w-0 items-start gap-3.5">
        {icone && <span className="mt-0.5 shrink-0 text-azul [&>svg]:size-8">{icone}</span>}
        <div className="min-w-0">
          <H id={id} className="font-display text-[1.5rem] font-bold leading-tight text-azul-noite sm:text-[1.625rem]">
            {titulo}
          </H>
          {introducao && <div className="mt-1 max-w-[60ch] text-[0.9375rem] leading-snug text-tinta-suave">{introducao}</div>}
        </div>
      </div>
      {acao && <div className="shrink-0">{acao}</div>}
    </div>
  )
}

/**
 * Seção de página. Com nível 1 vira o cabeçalho da página: rótulo em pílula,
 * título grande e o campo amarelo-ipê entrando pela borda esquerda.
 */
export function Prancha({
  id,
  titulo,
  introducao,
  rotulo,
  icone,
  fundo = 'papel',
  acao,
  children,
  className,
  nivel = 2,
}: {
  id?: string
  titulo?: ReactNode
  introducao?: ReactNode
  rotulo?: ReactNode
  icone?: ReactNode
  fundo?: Fundo
  acao?: ReactNode
  children?: ReactNode
  className?: string
  nivel?: 1 | 2
}) {
  const idTitulo = titulo && id ? `${id}-titulo` : undefined
  if (nivel === 1) {
    return (
      <section
        id={id}
        aria-labelledby={idTitulo}
        className={clsx('relative overflow-hidden pb-16 sm:pb-20 lg:pb-24', fundoClasse[fundo], className)}
      >
        <span aria-hidden="true" className="campo-ipe pointer-events-none absolute -left-10 top-6 hidden h-56 w-28 opacity-90 md:block lg:w-36" />
        <Container className="relative pt-10 sm:pt-14 lg:pt-16">
          {(titulo || acao) && (
            <header className="mb-10 flex flex-col gap-6 sm:mb-12 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                {rotulo && <Rotulo className="mb-4">{rotulo}</Rotulo>}
                {titulo && (
                  <h1
                    id={idTitulo}
                    className="font-display text-[clamp(2.2rem,4.8vw,3.5rem)] font-bold leading-[1.06] tracking-[-0.02em] text-azul-noite"
                  >
                    {titulo}
                  </h1>
                )}
                {introducao && (
                  <div className="mt-4 max-w-[60ch] text-[1.0625rem] leading-relaxed text-tinta-suave sm:text-lg">
                    {introducao}
                  </div>
                )}
              </div>
              {acao && <div className="shrink-0">{acao}</div>}
            </header>
          )}
          {children}
        </Container>
      </section>
    )
  }
  return (
    <section
      id={id}
      aria-labelledby={idTitulo}
      className={clsx('relative py-14 sm:py-16 lg:py-20', fundoClasse[fundo], className)}
    >
      <Container>
        {titulo && <CabecalhoSecao id={idTitulo} titulo={titulo} introducao={introducao} icone={icone} acao={acao} />}
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
        'relative overflow-hidden rounded-ficha border border-dashed border-linha-forte bg-prancha px-6 py-10 text-center sm:px-10',
        className,
      )}
    >
      <PontosDecorativos className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-16 w-64 text-azul/10" />
      <p className="relative font-display text-xl font-bold text-azul-noite">{titulo}</p>
      {children && (
        <div className="relative mx-auto mt-2 max-w-[48ch] text-[0.9375rem] leading-relaxed text-tinta-suave">
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
  <svg {...svgProps} strokeWidth={2} className={clsx('size-4', className)}>
    <path d="M4 12h16M13.5 6l6 6-6 6" />
  </svg>
)
export const IconeChevron = ({className}: IconeProps) => (
  <svg {...svgProps} strokeWidth={2} className={clsx('size-4', className)}>
    <path d="m9 6 6 6-6 6" />
  </svg>
)
export const IconeChevronBaixo = ({className}: IconeProps) => (
  <svg {...svgProps} strokeWidth={2} className={clsx('size-4', className)}>
    <path d="m6 9 6 6 6-6" />
  </svg>
)

/* Ícones de seção do template (viewBox 48, traço 2.6) */
const svg48 = {...svgProps, viewBox: '0 0 48 48', strokeWidth: 2.6}

export const IconeFoguete = ({className}: IconeProps) => (
  <svg {...svg48} className={clsx('size-10', className)}>
    <path d="M40.5 7.5c-8.5-.4-16.4 3.6-21.6 11.2L15.5 24l8.5 8.5 5.3-3.4c7.6-5.2 11.6-13.1 11.2-21.6Z" />
    <circle cx="30.5" cy="17.5" r="3.2" />
    <path d="M18.6 19.2 11.5 18.6 6.5 24l8.7 1.8" />
    <path d="m28.8 29.4.6 7.1-5.4 5-1.8-8.7" />
    <path d="M15.2 31.2c-3.4.6-5.6 3.5-6.2 8.8 5.3-.6 8.2-2.8 8.8-6.2" />
  </svg>
)
export const IconeOlho = ({className}: IconeProps) => (
  <svg {...svg48} className={clsx('size-10', className)}>
    <path d="M4 24s7-12 20-12 20 12 20 12-7 12-20 12S4 24 4 24Z" />
    <circle cx="24" cy="24" r="5" fill="currentColor" />
  </svg>
)
export const IconeDiamante = ({className}: IconeProps) => (
  <svg {...svg48} className={clsx('size-10', className)}>
    <path d="m8 16 6-8h20l6 8-16 25Z" />
    <path d="M8 16h32M14 8l10 8 10-8M18 16l6 25 6-25" />
  </svg>
)
export const IconeAgenda = ({className}: IconeProps) => (
  <svg {...svg48} className={clsx('size-8', className)}>
    <rect x="7" y="10" width="34" height="31" rx="3" />
    <path d="M7 19h34M16 6v8M32 6v8" />
  </svg>
)
export const IconeNoticias = ({className}: IconeProps) => (
  <svg {...svg48} className={clsx('size-8', className)}>
    <path d="M13 6h18l7 7v29H13z" />
    <path d="M31 6v8h7M19 21h13M19 27h13M19 33h9" />
    <rect x="7" y="12" width="25" height="29" rx="2" />
  </svg>
)
export const IconeCamadas = ({className}: IconeProps) => (
  <svg {...svg48} className={clsx('size-8', className)}>
    <path d="m24 6 15 8-15 8L9 14zM9 23l15 8 15-8M9 32l15 8 15-8" />
  </svg>
)
export const IconeParceria = ({className}: IconeProps) => (
  <svg {...svg48} className={clsx('size-8', className)}>
    <path d="m6 24 8-8 8 5 5-4 8 7-8 9-6-4-5 5-10-8z" />
    <path d="m20 27 6 5M16 31l5 5M28 22l6 5" />
  </svg>
)
export const IconePessoas = ({className}: IconeProps) => (
  <svg {...svg48} className={clsx('size-8', className)}>
    <circle cx="18" cy="17" r="6" />
    <path d="M7 39c1-7 5.5-11 11-11s10 4 11 11" />
    <circle cx="33" cy="19" r="4.5" />
    <path d="M31 28.5c5-.8 9 2.5 10 9" />
  </svg>
)
export const IconeSetor = ({className}: IconeProps) => (
  <svg {...svgProps} className={clsx('size-4', className)}>
    <rect x="3.5" y="4" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="4" width="7" height="7" rx="1.5" />
    <rect x="3.5" y="14" width="7" height="6.5" rx="1.5" />
    <rect x="13.5" y="14" width="7" height="6.5" rx="1.5" />
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
