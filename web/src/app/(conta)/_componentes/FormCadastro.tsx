'use client'

import Link from 'next/link'
import {useActionState} from 'react'
import {Aviso, CaixaMarcacao, botaoClasse} from '@/components/ui'
import type {EstadoForm} from '@/lib/associados/esquemas'
import {cadastrarAssociado, cadastrarComunidade} from '../cadastro/acoes'
import {CamposStartup} from './CamposStartup'
import {BotaoEnviar, CampoSelecao, CampoSenha, CampoTexto, MensagemGeral, ResumoErros, type Opcao} from './comum'

const ROTULOS: Record<string, string> = {
  nome: 'Nome completo',
  email: 'E-mail',
  whatsapp: 'WhatsApp',
  cidade: 'Cidade',
  senha: 'Senha',
  documento: 'CPF ou CNPJ',
  startup_nome: 'Nome da startup',
  setor: 'Setor',
  estagio: 'Estágio',
  site: 'Site',
  logo: 'Logo',
  aceite_estatuto: 'Declaração de adesão',
  aceite_privacidade: 'Política de Privacidade',
}

export type ListasForm = {cidades: Opcao[]; setores: Opcao[]; estagios: Opcao[]}

function CamposPessoais({estado, cidades}: {estado: EstadoForm; cidades: Opcao[]}) {
  return (
    <>
      <CampoTexto nome="nome" rotulo="Nome completo" estado={estado} obrigatorio autoComplete="name" />
      <div className="grid gap-5 sm:grid-cols-2">
        <CampoTexto nome="email" rotulo="E-mail" estado={estado} obrigatorio type="email" autoComplete="email" inputMode="email" />
        <CampoTexto
          nome="whatsapp"
          rotulo="WhatsApp"
          estado={estado}
          obrigatorio
          type="tel"
          autoComplete="tel-national"
          inputMode="tel"
          placeholder="(63) 99999-9999"
        />
      </div>
      <CampoSelecao nome="cidade" rotulo="Cidade" estado={estado} opcoes={cidades} obrigatorio vazio="Escolha sua cidade no Tocantins…" />
      <CampoSenha
        rotulo="Crie uma senha"
        estado={estado}
        autoComplete="new-password"
        ajuda="Pelo menos 8 caracteres. É com ela e o seu e-mail que você entra na sua área."
      />
    </>
  )
}

function AceitePrivacidade({estado}: {estado: EstadoForm}) {
  return (
    <CaixaMarcacao
      id="aceite_privacidade"
      name="aceite_privacidade"
      required
      defaultChecked={estado.valores?.aceite_privacidade === 'on'}
      erro={estado.erros?.aceite_privacidade?.[0]}
      rotulo={
        <>
          Li e aceito a{' '}
          <Link href="/privacidade" target="_blank" className="font-semibold text-azul underline underline-offset-2">
            Política de Privacidade
          </Link>
          .
        </>
      }
    />
  )
}

function Sucesso({email, associado}: {email?: string; associado?: boolean}) {
  return (
    <Aviso tom="sucesso" titulo={associado ? 'Pedido enviado à Diretoria' : 'Cadastro confirmado!'}>
      {associado ? (
        <>
          Recebemos seu pedido de associação. A Diretoria vai analisar e você recebe a resposta em{' '}
          <strong>{email}</strong>. Enquanto isso, acompanhe tudo pela sua área.
        </>
      ) : (
        <>
          Bem-vindo(a) à Comunidade! Enviamos para <strong>{email}</strong> o link do grupo de WhatsApp. Não chegou? Veja
          a caixa de spam.
        </>
      )}
      {/* Navegação completa: o cabeçalho passa a mostrar a conta recém-aberta. */}
      <p className="mt-4">
        <a href="/associado" className={botaoClasse('secundario', 'md')}>
          Ir para minha área
        </a>
      </p>
    </Aviso>
  )
}

export function FormComunidade({listas}: {listas: ListasForm}) {
  const [estado, acao] = useActionState<EstadoForm, FormData>(cadastrarComunidade, {})
  if (estado.ok) return <Sucesso email={estado.mensagem} />
  return (
    <form action={acao} className="flex flex-col gap-5" noValidate>
      <ResumoErros estado={estado} rotulos={ROTULOS} />
      <MensagemGeral estado={estado} />
      <CamposPessoais estado={estado} cidades={listas.cidades} />
      <AceitePrivacidade estado={estado} />
      <BotaoEnviar tamanho="lg" pendente="Cadastrando…">
        Entrar na Comunidade
      </BotaoEnviar>
    </form>
  )
}

export function FormAssociado({listas, declaracao}: {listas: ListasForm; declaracao: string[]}) {
  const [estado, acao] = useActionState<EstadoForm, FormData>(cadastrarAssociado, {})
  if (estado.ok) return <Sucesso email={estado.mensagem} associado />
  return (
    <form action={acao} className="flex flex-col gap-8" noValidate>
      <ResumoErros estado={estado} rotulos={ROTULOS} />
      <MensagemGeral estado={estado} />
      <fieldset className="flex flex-col gap-5">
        <legend className="mb-4 font-display text-xl font-extrabold text-azul-noite">Seus dados</legend>
        <CamposPessoais estado={estado} cidades={listas.cidades} />
        <CampoTexto
          nome="documento"
          rotulo="CPF ou CNPJ"
          estado={estado}
          obrigatorio
          inputMode="numeric"
          autoComplete="off"
          ajuda="Pessoa física informa o CPF; pessoa jurídica, o CNPJ. Pode digitar com ou sem pontos."
        />
      </fieldset>
      <fieldset className="flex flex-col gap-5">
        <legend className="mb-4 font-display text-xl font-extrabold text-azul-noite">Sua startup</legend>
        <CamposStartup estado={estado} setores={listas.setores} estagios={listas.estagios} />
      </fieldset>
      <fieldset className="flex flex-col gap-4">
        <legend className="mb-4 font-display text-xl font-extrabold text-azul-noite">Declaração de adesão</legend>
        <div className="rounded-ficha bg-papel px-5 py-4 font-texto text-[1.0625rem] leading-relaxed text-tinta ring-1 ring-linha">
          {declaracao.map((p) => (
            <p key={p} className="mb-2 last:mb-0">
              {p}
            </p>
          ))}
        </div>
        <CaixaMarcacao
          id="aceite_estatuto"
          name="aceite_estatuto"
          required
          defaultChecked={estado.valores?.aceite_estatuto === 'on'}
          erro={estado.erros?.aceite_estatuto?.[0]}
          rotulo={
            <>
              Concordo com a declaração acima, com o{' '}
              <Link href="/documentos" target="_blank" className="font-semibold text-azul underline underline-offset-2">
                Estatuto Social e o Regimento Interno
              </Link>
              .
            </>
          }
        />
        <AceitePrivacidade estado={estado} />
      </fieldset>
      <div className="flex flex-col gap-3 border-t border-linha pt-6">
        <BotaoEnviar tamanho="lg" pendente="Enviando pedido…">
          Enviar pedido de associação
        </BotaoEnviar>
        <p className="font-texto text-[1rem] text-tinta-suave">
          Nada é cobrado agora. A anuidade só é paga depois que a Diretoria aprovar o pedido.
        </p>
      </div>
    </form>
  )
}
