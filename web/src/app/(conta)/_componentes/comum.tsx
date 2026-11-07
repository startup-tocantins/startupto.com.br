'use client'

import {useFormStatus} from 'react-dom'
import type {ReactNode} from 'react'
import {Aviso, Botao, Campo, Entrada, Selecao, descricaoCampo} from '@/components/ui'
import type {EstadoForm} from '@/lib/associados/esquemas'

export type Opcao = {slug: string; titulo: string}

export function BotaoEnviar({children, pendente = 'Enviando…', ...props}: {children: ReactNode; pendente?: string} & React.ComponentProps<typeof Botao>) {
  const {pending} = useFormStatus()
  return (
    <Botao type="submit" carregando={pending} {...props}>
      {pending ? pendente : children}
    </Botao>
  )
}

export function MensagemGeral({estado}: {estado: EstadoForm}) {
  if (!estado.mensagem || estado.ok) return null
  return <Aviso tom="erro">{estado.mensagem}</Aviso>
}

/** Resumo de erros no topo, com links para os campos (WCAG 3.3.1). */
export function ResumoErros({estado, rotulos}: {estado: EstadoForm; rotulos: Record<string, string>}) {
  const chaves = Object.keys(estado.erros ?? {}).filter((k) => estado.erros?.[k]?.length)
  if (!chaves.length) return null
  return (
    <Aviso tom="erro" titulo={chaves.length === 1 ? 'Corrija 1 campo para continuar' : `Corrija ${chaves.length} campos para continuar`}>
      <ul className="mt-1 list-disc pl-5">
        {chaves.map((k) => (
          <li key={k}>
            <a href={`#${k}`} className="underline underline-offset-2">
              {rotulos[k] ?? k}
            </a>
            : {estado.erros?.[k]?.[0]}
          </li>
        ))}
      </ul>
    </Aviso>
  )
}

type CampoTextoProps = {
  nome: string
  rotulo: ReactNode
  estado: EstadoForm
  ajuda?: ReactNode
  obrigatorio?: boolean
  padrao?: string | null
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'id' | 'defaultValue'>

export function CampoTexto({nome, rotulo, estado, ajuda, obrigatorio, padrao, ...props}: CampoTextoProps) {
  const erro = estado.erros?.[nome]
  return (
    <Campo id={nome} rotulo={rotulo} ajuda={ajuda} erro={erro} obrigatorio={obrigatorio}>
      <Entrada
        id={nome}
        name={nome}
        required={obrigatorio}
        aria-invalid={erro ? true : undefined}
        aria-describedby={descricaoCampo(nome, Boolean(erro), Boolean(ajuda))}
        defaultValue={estado.valores?.[nome] ?? padrao ?? ''}
        {...props}
      />
    </Campo>
  )
}

export function CampoSelecao({
  nome,
  rotulo,
  estado,
  opcoes,
  ajuda,
  obrigatorio,
  padrao,
  vazio = 'Escolha…',
}: {
  nome: string
  rotulo: ReactNode
  estado: EstadoForm
  opcoes: Opcao[]
  ajuda?: ReactNode
  obrigatorio?: boolean
  padrao?: string | null
  vazio?: string
}) {
  const erro = estado.erros?.[nome]
  return (
    <Campo id={nome} rotulo={rotulo} ajuda={ajuda} erro={erro} obrigatorio={obrigatorio}>
      <Selecao
        id={nome}
        name={nome}
        required={obrigatorio}
        aria-invalid={erro ? true : undefined}
        aria-describedby={descricaoCampo(nome, Boolean(erro), Boolean(ajuda))}
        defaultValue={estado.valores?.[nome] ?? padrao ?? ''}
      >
        <option value="">{vazio}</option>
        {opcoes.map((o) => (
          <option key={o.slug} value={o.slug}>
            {o.titulo}
          </option>
        ))}
      </Selecao>
    </Campo>
  )
}
