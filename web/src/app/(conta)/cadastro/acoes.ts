'use server'

import {revalidatePath} from 'next/cache'
import {supabaseConfigurado} from '@/lib/env'
import {
  associadoSchema,
  comunidadeSchema,
  errosDe,
  upgradeSchema,
  validarLogo,
  valoresDe,
  type EstadoForm,
} from '@/lib/associados/esquemas'
import {enviarLogo} from '@/lib/associados/logo'
import {notificar} from '@/lib/associados/notificacoes'
import {getSessao, registrarHistorico} from '@/lib/associados/sessao'
import {createAdminClient, createClient} from '@/lib/supabase/server'
import type {Perfil} from '@/lib/supabase/types'

const INDISPONIVEL: EstadoForm = {
  mensagem: 'Os cadastros ainda não estão abertos no site. Fale com a gente pelo WhatsApp ou e-mail.',
}

async function linkGrupoWhatsapp(): Promise<string | null> {
  const admin = createAdminClient()
  const {data} = await admin.from('configuracoes_privadas').select('valor').eq('chave', 'whatsapp_grupo_comunidade').maybeSingle()
  return data?.valor || null
}

/** Abre a sessão logo após o cadastro (sem e-mail de link). Falha aqui não desfaz o cadastro. */
async function abrirSessao(email: string, senha: string) {
  const supabase = await createClient()
  const {error} = await supabase.auth.signInWithPassword({email, password: senha})
  if (error) console.error('[cadastro] sessão', error.message)
}

/** Cria o usuário no Supabase Auth. Retorna o id ou um erro amigável. */
async function criarUsuario(email: string, nome: string, senha: string): Promise<{id: string} | {erro: EstadoForm}> {
  const admin = createAdminClient()
  const chave = process.env.SUPABASE_CHAVE_CADASTRO
  if (!chave) {
    console.error('[cadastro] SUPABASE_CHAVE_CADASTRO ausente')
    return {erro: {mensagem: 'Os cadastros estão temporariamente indisponíveis. Tente novamente mais tarde.'}}
  }
  // A chave prova ao trigger do banco que a conta vem do servidor (cadastro público bloqueado).
  const {data, error} = await admin.auth.admin.createUser({
    email,
    password: senha,
    email_confirm: true,
    user_metadata: {nome, chave_cadastro: chave},
  })
  if (data?.user) {
    // A chave não fica guardada na conta.
    await admin.auth.admin.updateUserById(data.user.id, {user_metadata: {nome, chave_cadastro: null}})
  }
  if (error || !data.user) {
    if (/already|exists|registered/i.test(error?.message ?? '')) {
      return {
        erro: {
          erros: {email: ['Este e-mail já tem cadastro. Entre na sua área para continuar.']},
        },
      }
    }
    if (/password/i.test(error?.message ?? '')) {
      return {erro: {erros: {senha: ['Escolha uma senha mais forte, com pelo menos 8 caracteres.']}}}
    }
    console.error('[cadastro] createUser', error?.message)
    return {erro: {mensagem: 'Não foi possível concluir o cadastro agora. Tente novamente em alguns minutos.'}}
  }
  return {id: data.user.id}
}

async function desfazerUsuario(id: string) {
  await createAdminClient().auth.admin.deleteUser(id)
}

export async function cadastrarComunidade(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  const valores = valoresDe(fd)
  const r = comunidadeSchema.safeParse(Object.fromEntries(fd))
  if (!r.success) return {erros: errosDe(r.error), valores}
  if (!supabaseConfigurado()) return {...INDISPONIVEL, valores}

  const u = await criarUsuario(r.data.email, r.data.nome, r.data.senha)
  if ('erro' in u) return {...u.erro, valores}

  const admin = createAdminClient()
  const {data: perfil, error} = await admin
    .from('perfis')
    .insert({
      id: u.id,
      nome: r.data.nome,
      email: r.data.email,
      whatsapp: r.data.whatsapp,
      cidade: r.data.cidade,
      modalidade: 'comunidade',
      status: 'comunidade',
      aceite_privacidade_em: new Date().toISOString(),
      tipo_documento: null,
      documento: null,
      startup_nome: null,
      setor: null,
      estagio: null,
      site: null,
      logo_path: null,
      motivo_isencao: null,
      aceite_estatuto_em: null,
      stripe_customer_id: null,
      stripe_subscription_id: null,
      vencimento: null,
    })
    .select('*')
    .single()
  if (error || !perfil) {
    console.error('[cadastro comunidade]', error?.message)
    await desfazerUsuario(u.id)
    return {mensagem: 'Não foi possível concluir o cadastro agora. Tente novamente em alguns minutos.', valores}
  }

  await registrarHistorico({perfilId: u.id, acao: 'cadastro_comunidade', novo: 'comunidade'})
  await notificar.boasVindasComunidade(perfil as Perfil, await linkGrupoWhatsapp())
  await abrirSessao(r.data.email, r.data.senha)
  return {ok: true, mensagem: r.data.email}
}

export async function cadastrarAssociado(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  const valores = valoresDe(fd)
  const r = associadoSchema.safeParse(Object.fromEntries([...fd.entries()].filter(([, v]) => typeof v === 'string')))
  const logo = validarLogo(fd.get('logo'))
  if (!r.success || logo.erro) {
    const erros = r.success ? {} : errosDe(r.error)
    if (logo.erro) erros.logo = [logo.erro]
    return {erros, valores}
  }
  if (!supabaseConfigurado()) return {...INDISPONIVEL, valores}

  const u = await criarUsuario(r.data.email, r.data.nome, r.data.senha)
  if ('erro' in u) return {...u.erro, valores}

  let logoPath: string | null = null
  try {
    if (logo.arquivo) logoPath = await enviarLogo(u.id, logo.arquivo)
  } catch (e) {
    console.error(e)
  }

  const agora = new Date().toISOString()
  const admin = createAdminClient()
  const {data: perfil, error} = await admin
    .from('perfis')
    .insert({
      id: u.id,
      nome: r.data.nome,
      email: r.data.email,
      whatsapp: r.data.whatsapp,
      cidade: r.data.cidade,
      tipo_documento: r.data.documento!.tipo,
      documento: r.data.documento!.numero,
      startup_nome: r.data.startup_nome,
      setor: r.data.setor,
      estagio: r.data.estagio,
      site: r.data.site,
      logo_path: logoPath,
      vitrine_opt_in: r.data.vitrine_opt_in,
      modalidade: 'associado',
      status: 'pendente_aprovacao',
      aceite_estatuto_em: agora,
      aceite_privacidade_em: agora,
      motivo_isencao: null,
      stripe_customer_id: null,
      stripe_subscription_id: null,
      vencimento: null,
    })
    .select('*')
    .single()
  if (error || !perfil) {
    console.error('[cadastro associado]', error?.message)
    await desfazerUsuario(u.id)
    return {mensagem: 'Não foi possível enviar o pedido agora. Tente novamente em alguns minutos.', valores}
  }

  await registrarHistorico({perfilId: u.id, acao: 'pedido_associacao', novo: 'pendente_aprovacao'})
  await notificar.pedidoRecebido(perfil as Perfil)
  await abrirSessao(r.data.email, r.data.senha)
  return {ok: true, mensagem: r.data.email}
}

/** Comunidade (ou quem foi recusado/cancelou) pede para virar Associado pela área logada. */
export async function pedirAssociacao(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  const valores = valoresDe(fd)
  const sessao = await getSessao()
  if (!sessao?.perfil) return {mensagem: 'Sua sessão expirou. Entre novamente para continuar.', valores}
  const p = sessao.perfil
  if (!['comunidade', 'recusado', 'cancelado'].includes(p.status)) {
    return {mensagem: 'Você já tem um pedido de associação em andamento ou ativo.', valores}
  }

  const r = upgradeSchema.safeParse(Object.fromEntries([...fd.entries()].filter(([, v]) => typeof v === 'string')))
  const logo = validarLogo(fd.get('logo'))
  if (!r.success || logo.erro) {
    const erros = r.success ? {} : errosDe(r.error)
    if (logo.erro) erros.logo = [logo.erro]
    return {erros, valores}
  }

  let logoPath = p.logo_path
  if (logo.arquivo) {
    try {
      logoPath = await enviarLogo(p.id, logo.arquivo)
    } catch (e) {
      console.error(e)
    }
  }

  const admin = createAdminClient()
  const {data: atualizado, error} = await admin
    .from('perfis')
    .update({
      tipo_documento: r.data.documento!.tipo,
      documento: r.data.documento!.numero,
      startup_nome: r.data.startup_nome,
      setor: r.data.setor,
      estagio: r.data.estagio,
      site: r.data.site,
      logo_path: logoPath,
      vitrine_opt_in: r.data.vitrine_opt_in,
      aceite_estatuto_em: new Date().toISOString(),
      modalidade: 'associado',
      status: 'pendente_aprovacao',
    })
    .eq('id', p.id)
    .select('*')
    .single()
  if (error || !atualizado) {
    console.error('[pedir associação]', error?.message)
    return {mensagem: 'Não foi possível enviar o pedido agora. Tente novamente em alguns minutos.', valores}
  }

  await registrarHistorico({perfilId: p.id, acao: 'pedido_associacao', anterior: p.status, novo: 'pendente_aprovacao', autorId: p.id})
  await notificar.pedidoRecebido(atualizado as Perfil)
  revalidatePath('/associado')
  return {ok: true}
}
