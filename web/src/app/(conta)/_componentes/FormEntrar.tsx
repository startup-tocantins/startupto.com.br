'use client'

import {useActionState} from 'react'
import {Aviso, BotaoLink} from '@/components/ui'
import {enviarLinkAcesso} from '../acoes-auth'
import type {EstadoForm} from '@/lib/associados/esquemas'
import {BotaoEnviar, CampoTexto, MensagemGeral} from './comum'

export function FormEntrar({proximo}: {proximo?: string}) {
  const [estado, acao] = useActionState<EstadoForm, FormData>(enviarLinkAcesso, {})
  if (estado.ok) {
    return (
      <Aviso tom="sucesso" titulo="Confira seu e-mail">
        Se houver um cadastro com <strong>{estado.valores?.email}</strong>, enviamos um link de acesso. Ele vale por 1
        hora e só pode ser usado uma vez. Não chegou? Veja a caixa de spam ou{' '}
        <a href="/entrar" className="underline underline-offset-2">
          tente de novo
        </a>
        .
      </Aviso>
    )
  }
  return (
    <form action={acao} className="flex flex-col gap-5" noValidate>
      <input type="hidden" name="proximo" value={proximo ?? '/associado'} />
      <MensagemGeral estado={estado} />
      <CampoTexto
        nome="email"
        rotulo="E-mail do cadastro"
        estado={estado}
        type="email"
        autoComplete="email"
        inputMode="email"
        obrigatorio
        ajuda="Enviaremos um link para você entrar, sem senha."
      />
      <BotaoEnviar tamanho="lg" pendente="Enviando link…">
        Receber link de acesso
      </BotaoEnviar>
      <p className="font-texto text-[1.0625rem] text-tinta-suave">
        Ainda não tem cadastro?{' '}
        <BotaoLink href="/associe-se" variante="fantasma" tamanho="sm" className="-ml-2 align-baseline">
          Conheça as modalidades
        </BotaoLink>
      </p>
    </form>
  )
}
