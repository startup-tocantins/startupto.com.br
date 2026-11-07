'use server'

import {redirect} from 'next/navigation'
import {z} from 'zod'
import {env, supabaseConfigurado} from '@/lib/env'
import {createClient} from '@/lib/supabase/server'
import type {EstadoForm} from '@/lib/associados/esquemas'

const destinoSeguro = (d: unknown) =>
  typeof d === 'string' && d.startsWith('/') && !d.startsWith('//') ? d : '/associado'

/** Envia o link de acesso. Resposta sempre igual, exista ou não cadastro (evita enumeração de e-mails). */
export async function enviarLinkAcesso(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  const email = z.string().trim().toLowerCase().email().safeParse(fd.get('email'))
  if (!email.success) {
    return {erros: {email: ['Informe um e-mail válido, como nome@exemplo.com.']}, valores: {email: String(fd.get('email') ?? '')}}
  }
  if (!supabaseConfigurado()) {
    return {mensagem: 'O acesso à área do associado ainda não está disponível. Tente novamente em breve.'}
  }
  const proximo = destinoSeguro(fd.get('proximo'))
  const supabase = await createClient()
  const {error} = await supabase.auth.signInWithOtp({
    email: email.data,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: `${env.siteUrl()}/auth/confirm?proximo=${encodeURIComponent(proximo)}`,
    },
  })
  if (error && !/signups not allowed|not found|user/i.test(error.message)) {
    console.error('[entrar]', error.message)
    if (/rate|seconds/i.test(error.message)) {
      return {mensagem: 'Muitas tentativas seguidas. Aguarde um minuto e tente de novo.', valores: {email: email.data}}
    }
  }
  return {ok: true, valores: {email: email.data}}
}

export async function sair() {
  if (supabaseConfigurado()) {
    const supabase = await createClient()
    await supabase.auth.signOut()
  }
  redirect('/')
}
