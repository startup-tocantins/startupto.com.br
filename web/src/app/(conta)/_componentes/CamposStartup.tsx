'use client'

import {useState} from 'react'
import {Campo, CaixaMarcacao, Entrada, descricaoCampo} from '@/components/ui'
import type {EstadoForm} from '@/lib/associados/esquemas'
import {CampoSelecao, CampoTexto, type Opcao} from './comum'

export type ValoresStartup = {
  startup_nome?: string | null
  setor?: string | null
  estagio?: string | null
  site?: string | null
  vitrine_opt_in?: boolean
}

/** Campos da startup (comuns a PF e PJ): nome, setor, estágio, site, logo e opt-in da Vitrine. */
export function CamposStartup({
  estado,
  setores,
  estagios,
  padrao = {},
  logoAtual,
}: {
  estado: EstadoForm
  setores: Opcao[]
  estagios: Opcao[]
  padrao?: ValoresStartup
  logoAtual?: string | null
}) {
  const [nomeArquivo, setNomeArquivo] = useState<string | null>(null)
  const erroLogo = estado.erros?.logo
  const optIn = estado.valores ? estado.valores.vitrine_opt_in === 'on' : (padrao.vitrine_opt_in ?? true)
  return (
    <>
      <CampoTexto nome="startup_nome" rotulo="Nome da startup" estado={estado} obrigatorio padrao={padrao.startup_nome} autoComplete="organization" />
      <div className="grid gap-5 sm:grid-cols-2">
        <CampoSelecao nome="setor" rotulo="Setor" estado={estado} opcoes={setores} obrigatorio padrao={padrao.setor} />
        <CampoSelecao
          nome="estagio"
          rotulo="Estágio"
          estado={estado}
          opcoes={estagios}
          obrigatorio
          padrao={padrao.estagio}
          ajuda="Ideação, Validação, Operação, Tração ou Escala."
        />
      </div>
      <CampoTexto
        nome="site"
        rotulo="Site"
        estado={estado}
        padrao={padrao.site}
        inputMode="url"
        autoComplete="url"
        placeholder="startup.com.br"
        ajuda="Opcional. Pode ser o perfil do Instagram ou LinkedIn."
      />
      <Campo
        id="logo"
        rotulo="Logo"
        erro={erroLogo}
        ajuda={
          nomeArquivo
            ? `Selecionado: ${nomeArquivo}`
            : logoAtual
              ? 'Já existe um logo. Envie outro só se quiser trocar. PNG, JPG, WebP ou SVG, até 1 MB.'
              : 'Opcional. PNG, JPG, WebP ou SVG, até 1 MB. Fundo transparente fica melhor na Vitrine.'
        }
      >
        <Entrada
          id="logo"
          name="logo"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          aria-invalid={erroLogo ? true : undefined}
          aria-describedby={descricaoCampo('logo', Boolean(erroLogo), true)}
          onChange={(e) => setNomeArquivo(e.currentTarget.files?.[0]?.name ?? null)}
          className="py-2 file:mr-3 file:rounded-full file:border-0 file:bg-azul-claro file:px-4 file:py-1.5 file:font-semibold file:text-azul"
        />
      </Campo>
      <CaixaMarcacao
        id="vitrine_opt_in"
        name="vitrine_opt_in"
        defaultChecked={optIn}
        rotulo={
          <>
            Autorizo exibir minha startup na <strong>Vitrine pública</strong> (nome, logo, setor, estágio, cidade e site)
            enquanto minha associação estiver ativa. Posso retirar a autorização quando quiser.
          </>
        }
      />
    </>
  )
}
