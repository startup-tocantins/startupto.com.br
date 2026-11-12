'use client'

import Link from 'next/link'
import {useActionState} from 'react'
import {Aviso, BotaoLink} from '@/components/ui'
import {entrarComSenha, enviarLinkAcesso} from '../acoes-auth'
import type {EstadoForm} from '@/lib/associados/esquemas'
import {BotaoEnviar, CampoSenha, CampoTexto, MensagemGeral} from './comum'

function SemCadastro() {
  return (
    <p className="font-texto text-[1.0625rem] text-tinta-suave">
      Ainda não tem cadastro?{' '}
      <BotaoLink href="/associe-se" variante="fantasma" tamanho="sm" className="-ml-2 align-baseline">
        Conheça as modalidades
      </BotaoLink>
    </p>
  )
}

/** Entrada principal: e-mail e senha. */
export function FormEntrar({proximo}: {proximo?: string}) {
  const [estado, acao] = useActionState<EstadoForm, FormData>(entrarComSenha, {})
  return (
    <form action={acao} className="flex flex-col gap-5" noValidate>
      <input type="hidden" name="proximo" value={proximo ?? '/associado'} />
      <MensagemGeral estado={estado} />
      <CampoTexto
        nome="email"
        rotulo="E-mail do cadastro"
        estado={estado}
        type="email"
        autoComplete="username"
        inputMode="email"
        obrigatorio
      />
      <CampoSenha estado={estado} />
      <BotaoEnviar tamanho="lg" pendente="Entrando…">
        Entrar
      </BotaoEnviar>
      <p className="font-texto text-[1.0625rem] text-tinta-suave">
        Primeiro acesso ou esqueceu a senha?{' '}
        <Link href="/entrar?modo=link" className="font-semibold text-azul underline underline-offset-4">
          Receba um link de acesso por e-mail
        </Link>{' '}
        e crie uma nova senha.
      </p>
      <SemCadastro />
    </form>
  )
}

/** Alternativa: link de acesso por e-mail, que leva à página de criar senha. */
export function FormLinkAcesso() {
  const [estado, acao] = useActionState<EstadoForm, FormData>(enviarLinkAcesso, {})
  if (estado.ok) {
    return (
      <Aviso tom="sucesso" titulo="Confira seu e-mail">
        Se houver um cadastro com <strong>{estado.valores?.email}</strong>, enviamos um link de acesso. Ele vale por 1
        hora e só pode ser usado uma vez; ao entrar, você cria sua senha. Não chegou? Veja a caixa de spam ou{' '}
        <a href="/entrar?modo=link" className="underline underline-offset-2">
          tente de novo
        </a>
        .
      </Aviso>
    )
  }
  return (
    <form action={acao} className="flex flex-col gap-5" noValidate>
      <input type="hidden" name="proximo" value="/associado/senha" />
      <MensagemGeral estado={estado} />
      <CampoTexto
        nome="email"
        rotulo="E-mail do cadastro"
        estado={estado}
        type="email"
        autoComplete="email"
        inputMode="email"
        obrigatorio
        ajuda="Enviaremos um link para você entrar e criar uma nova senha."
      />
      <BotaoEnviar tamanho="lg" pendente="Enviando link…">
        Receber link de acesso
      </BotaoEnviar>
      <p className="font-texto text-[1.0625rem] text-tinta-suave">
        Já tem senha?{' '}
        <Link href="/entrar" className="font-semibold text-azul underline underline-offset-4">
          Entrar com e-mail e senha
        </Link>
      </p>
    </form>
  )
}
