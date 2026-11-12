'use server'

import {redirect} from 'next/navigation'
import {z} from 'zod'
import {env, supabaseConfigurado} from '@/lib/env'
import {createClient} from '@/lib/supabase/server'
import type {EstadoForm} from '@/lib/associados/esquemas'

const destinoSeguro = (d: unknown) =>
  typeof d === 'string' && d.startsWith('/') && !d.startsWith('//') ? d : '/associado'

/** Entra com e-mail e senha. A mensagem de erro não diz se o e-mail existe. */
export async function entrarComSenha(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  const emailDigitado = String(fd.get('email') ?? '')
  const email = z.string().trim().toLowerCase().email().safeParse(emailDigitado)
  const senha = fd.get('senha')
  const erros: Record<string, string[]> = {}
  if (!email.success) erros.email = ['Informe um e-mail válido, como nome@exemplo.com.']
  if (typeof senha !== 'string' || !senha) erros.senha = ['Digite sua senha.']
  if (!email.success || typeof senha !== 'string' || !senha) return {erros, valores: {email: emailDigitado}}
  if (!supabaseConfigurado()) {
    return {mensagem: 'O acesso à área do associado ainda não está disponível. Tente novamente em breve.'}
  }
  const supabase = await createClient()
  const {error} = await supabase.auth.signInWithPassword({email: email.data, password: senha})
  if (error) {
    if (/rate|too many|seconds/i.test(error.message)) {
      return {mensagem: 'Muitas tentativas seguidas. Aguarde alguns minutos e tente de novo.', valores: {email: email.data}}
    }
    if (!/invalid|credentials|not confirmed/i.test(error.message)) console.error('[entrar senha]', error.message)
    return {
      mensagem:
        'E-mail ou senha incorretos. Se você ainda não criou uma senha ou esqueceu a sua, peça um link de acesso por e-mail.',
      valores: {email: email.data},
    }
  }
  redirect(destinoSeguro(fd.get('proximo')))
}

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
