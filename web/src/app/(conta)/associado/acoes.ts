'use server'

import {revalidatePath} from 'next/cache'
import {redirect} from 'next/navigation'
import {errosDe, perfilSchema, senhaSchema, validarLogo, valoresDe, type EstadoForm} from '@/lib/associados/esquemas'
import {enviarLogo} from '@/lib/associados/logo'
import {notificar} from '@/lib/associados/notificacoes'
import {exigirSessao, getSessao} from '@/lib/associados/sessao'
import {PAGAMENTO_INDISPONIVEL, urlCheckoutAnuidade} from '@/lib/stripe/checkout'
import {createAdminClient, createClient} from '@/lib/supabase/server'

export async function atualizarPerfil(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  const valores = valoresDe(fd)
  const sessao = await getSessao()
  if (!sessao?.perfil) return {mensagem: 'Sua sessão expirou. Entre novamente.', valores}

  const r = perfilSchema.safeParse(Object.fromEntries([...fd.entries()].filter(([, v]) => typeof v === 'string')))
  const logo = validarLogo(fd.get('logo'))
  if (!r.success || logo.erro) {
    const erros = r.success ? {} : errosDe(r.error)
    if (logo.erro) erros.logo = [logo.erro]
    return {erros, valores}
  }
  const p = sessao.perfil
  if (p.modalidade === 'associado' && (!r.data.startup_nome || !r.data.setor || !r.data.estagio)) {
    return {
      erros: {
        ...(r.data.startup_nome ? {} : {startup_nome: ['Informe o nome da startup.']}),
        ...(r.data.setor ? {} : {setor: ['Escolha o setor.']}),
        ...(r.data.estagio ? {} : {estagio: ['Escolha o estágio.']}),
      },
      valores,
    }
  }

  let logo_path = p.logo_path
  if (logo.arquivo) logo_path = await enviarLogo(p.id, logo.arquivo)

  // Cliente com a sessão do usuário: RLS + privilégios de coluna limitam o que pode mudar.
  const supabase = await createClient()
  const {error} = await supabase
    .from('perfis')
    .update({...r.data, logo_path})
    .eq('id', p.id)
  if (error) {
    console.error('[perfil]', error.message)
    return {mensagem: 'Não foi possível salvar agora. Tente novamente.', valores}
  }
  revalidatePath('/associado')
  revalidatePath('/vitrine')
  return {ok: true, mensagem: 'Dados salvos.'}
}

export async function iniciarPagamento(): Promise<void> {
  const {perfil: p} = await exigirSessao('/associado/pagamento')
  if (p.isento) redirect('/associado')
  if (p.status === 'inadimplente' && p.stripe_customer_id) redirect('/associado/portal')
  if (p.status !== 'aguardando_pagamento') redirect('/associado')
  redirect((await urlCheckoutAnuidade(p)) ?? PAGAMENTO_INDISPONIVEL)
}

export async function solicitarExclusao(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  const sessao = await getSessao()
  if (!sessao?.perfil) return {mensagem: 'Sua sessão expirou. Entre novamente.'}
  if (fd.get('confirmacao') !== 'on') {
    return {erros: {confirmacao: ['Marque a confirmação para enviar o pedido.']}}
  }
  const p = sessao.perfil
  const admin = createAdminClient()
  const {data: aberto} = await admin
    .from('solicitacoes_exclusao')
    .select('id')
    .eq('perfil_id', p.id)
    .is('concluida_em', null)
    .maybeSingle()
  if (aberto) return {ok: true, mensagem: 'Seu pedido de exclusão já está com a Diretoria.'}

  const {data, error} = await admin
    .from('solicitacoes_exclusao')
    .insert({perfil_id: p.id, nome: p.nome, email: p.email})
    .select('criado_em, prazo')
    .single()
  if (error || !data) {
    console.error('[exclusão]', error?.message)
    return {mensagem: 'Não foi possível registrar o pedido agora. Tente novamente ou escreva para startuptocantins@gmail.com.'}
  }
  await notificar.exclusaoSolicitada(p, new Date(data.criado_em), new Date(`${data.prazo}T12:00:00`))
  return {ok: true, mensagem: 'Pedido registrado. Você receberá a resposta por e-mail em até 15 dias.'}
}

/** Cria ou troca a senha de acesso de quem está logado (inclusive quem entrou pelo link de "esqueci a senha"). */
export async function definirSenha(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  const sessao = await getSessao()
  if (!sessao) return {mensagem: 'Sua sessão expirou. Peça um novo link de acesso e tente de novo.'}
  const r = senhaSchema.safeParse(fd.get('senha_nova'))
  if (!r.success) return {erros: {senha_nova: r.error.issues.map((i) => i.message)}}
  if (fd.get('senha_confirmacao') !== r.data) {
    return {erros: {senha_confirmacao: ['As duas senhas não são iguais. Digite a mesma senha nos dois campos.']}}
  }
  const supabase = await createClient()
  const {error} = await supabase.auth.updateUser({password: r.data})
  if (error) {
    if (/different|same/i.test(error.message)) {
      return {erros: {senha_nova: ['A nova senha precisa ser diferente da atual.']}}
    }
    if (/weak|short|characters/i.test(error.message)) {
      return {erros: {senha_nova: ['Escolha uma senha mais forte, com pelo menos 8 caracteres.']}}
    }
    console.error('[definir senha]', error.message)
    return {mensagem: 'Não foi possível salvar a senha agora. Tente novamente em alguns minutos.'}
  }
  return {ok: true, mensagem: 'Senha salva. Da próxima vez, entre com seu e-mail e esta senha.'}
}
