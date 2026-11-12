'use client'

import {useActionState} from 'react'
import Link from 'next/link'
import {Aviso, CaixaMarcacao} from '@/components/ui'
import type {EstadoForm} from '@/lib/associados/esquemas'
import type {Perfil} from '@/lib/supabase/types'
import {atualizarPerfil, definirSenha, solicitarExclusao} from '../associado/acoes'
import {pedirAssociacao} from '../cadastro/acoes'
import {CamposStartup} from './CamposStartup'
import {BotaoEnviar, CampoSelecao, CampoSenha, CampoTexto, MensagemGeral, ResumoErros, type Opcao} from './comum'
import type {ListasForm} from './FormCadastro'

const ROTULOS: Record<string, string> = {
  nome: 'Nome completo', whatsapp: 'WhatsApp', cidade: 'Cidade', documento: 'CPF ou CNPJ',
  startup_nome: 'Nome da startup', setor: 'Setor', estagio: 'Estágio', site: 'Site', logo: 'Logo',
  aceite_estatuto: 'Declaração de adesão',
}

export function FormPerfil({perfil, listas, logoUrl}: {perfil: Perfil; listas: ListasForm; logoUrl: string | null}) {
  const [estado, acao] = useActionState<EstadoForm, FormData>(atualizarPerfil, {})
  const associado = perfil.modalidade === 'associado'
  return (
    <form action={acao} className="flex flex-col gap-8" noValidate>
      {estado.ok && <Aviso tom="sucesso">{estado.mensagem}</Aviso>}
      <ResumoErros estado={estado} rotulos={ROTULOS} />
      <MensagemGeral estado={estado} />
      <fieldset className="flex flex-col gap-5">
        <legend className="mb-4 font-display text-xl font-extrabold text-azul-noite">Seus dados</legend>
        <CampoTexto nome="nome" rotulo="Nome completo" estado={estado} obrigatorio padrao={perfil.nome} autoComplete="name" />
        <div className="grid gap-5 sm:grid-cols-2">
          <CampoTexto nome="whatsapp" rotulo="WhatsApp" estado={estado} obrigatorio padrao={perfil.whatsapp} type="tel" inputMode="tel" />
          <CampoSelecao nome="cidade" rotulo="Cidade" estado={estado} opcoes={listas.cidades} obrigatorio padrao={perfil.cidade} />
        </div>
        <p className="font-texto text-[1rem] text-tinta-suave">
          E-mail: <strong>{perfil.email}</strong>. Para trocar o e-mail ou o CPF/CNPJ, escreva para
          startuptocantins@gmail.com.
        </p>
      </fieldset>
      {associado && (
        <fieldset className="flex flex-col gap-5">
          <legend className="mb-4 font-display text-xl font-extrabold text-azul-noite">Sua startup e a Vitrine</legend>
          <CamposStartup
            estado={estado}
            setores={listas.setores}
            estagios={listas.estagios}
            logoAtual={logoUrl}
            padrao={{
              startup_nome: perfil.startup_nome,
              setor: perfil.setor,
              estagio: perfil.estagio,
              site: perfil.site,
              vitrine_opt_in: perfil.vitrine_opt_in,
            }}
          />
        </fieldset>
      )}
      <div>
        <BotaoEnviar tamanho="lg" pendente="Salvando…">
          Salvar alterações
        </BotaoEnviar>
      </div>
    </form>
  )
}

export function FormAssociar({listas, declaracao, perfil}: {listas: ListasForm; declaracao: string[]; perfil: Perfil}) {
  const [estado, acao] = useActionState<EstadoForm, FormData>(pedirAssociacao, {})
  if (estado.ok) {
    return (
      <Aviso tom="sucesso" titulo="Pedido enviado à Diretoria">
        Você receberá a resposta por e-mail. Acompanhe a situação na{' '}
        <Link href="/associado" className="underline underline-offset-2">
          sua área
        </Link>
        .
      </Aviso>
    )
  }
  return (
    <form action={acao} className="flex flex-col gap-8" noValidate>
      <ResumoErros estado={estado} rotulos={ROTULOS} />
      <MensagemGeral estado={estado} />
      <fieldset className="flex flex-col gap-5">
        <legend className="mb-4 font-display text-xl font-extrabold text-azul-noite">Documento</legend>
        <CampoTexto
          nome="documento"
          rotulo="CPF ou CNPJ"
          estado={estado}
          obrigatorio
          inputMode="numeric"
          ajuda="Pessoa física informa o CPF; pessoa jurídica, o CNPJ."
        />
      </fieldset>
      <fieldset className="flex flex-col gap-5">
        <legend className="mb-4 font-display text-xl font-extrabold text-azul-noite">Sua startup</legend>
        <CamposStartup
          estado={estado}
          setores={listas.setores}
          estagios={listas.estagios}
          padrao={{startup_nome: perfil.startup_nome, setor: perfil.setor, estagio: perfil.estagio, site: perfil.site}}
        />
      </fieldset>
      <fieldset className="flex flex-col gap-4">
        <legend className="mb-4 font-display text-xl font-extrabold text-azul-noite">Declaração de adesão</legend>
        <div className="rounded-ficha bg-papel px-5 py-4 font-texto text-[1.0625rem] leading-relaxed ring-1 ring-linha">
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
      </fieldset>
      <div>
        <BotaoEnviar tamanho="lg" pendente="Enviando pedido…">
          Enviar pedido de associação
        </BotaoEnviar>
      </div>
    </form>
  )
}

export function FormExclusao() {
  const [estado, acao] = useActionState<EstadoForm, FormData>(solicitarExclusao, {})
  if (estado.ok) return <Aviso tom="sucesso">{estado.mensagem}</Aviso>
  return (
    <form action={acao} className="flex flex-col gap-4">
      <MensagemGeral estado={estado} />
      <CaixaMarcacao
        id="confirmacao"
        name="confirmacao"
        erro={estado.erros?.confirmacao?.[0]}
        rotulo="Quero que a Associação exclua meus dados pessoais. Entendo que isso encerra meu cadastro e, se houver, minha associação."
      />
      <div>
        <BotaoEnviar variante="contorno" pendente="Enviando…">
          Solicitar exclusão dos meus dados
        </BotaoEnviar>
      </div>
    </form>
  )
}

export type {Opcao}

export function FormSenha({email}: {email: string}) {
  const [estado, acao] = useActionState<EstadoForm, FormData>(definirSenha, {})
  if (estado.ok) {
    return (
      <Aviso tom="sucesso" titulo="Senha salva">
        {estado.mensagem}{' '}
        <Link href="/associado" className="underline underline-offset-2">
          Ir para minha área
        </Link>
        .
      </Aviso>
    )
  }
  return (
    <form action={acao} className="flex max-w-md flex-col gap-5" noValidate>
      <MensagemGeral estado={estado} />
      {/* Ajuda gerenciadores de senha a associarem a senha à conta certa. */}
      <input type="email" name="username" value={email} autoComplete="username" readOnly hidden />
      <CampoSenha
        nome="senha_nova"
        rotulo="Nova senha"
        estado={estado}
        autoComplete="new-password"
        ajuda="Pelo menos 8 caracteres. Uma frase curta é fácil de lembrar e difícil de adivinhar."
      />
      <CampoSenha nome="senha_confirmacao" rotulo="Repita a nova senha" estado={estado} autoComplete="new-password" />
      <div>
        <BotaoEnviar tamanho="lg" pendente="Salvando…">
          Salvar senha
        </BotaoEnviar>
      </div>
    </form>
  )
}
