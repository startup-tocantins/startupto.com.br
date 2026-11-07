'use server'

import {revalidatePath} from 'next/cache'
import {z} from 'zod'
import type {EstadoForm} from '@/lib/associados/esquemas'
import {notificar} from '@/lib/associados/notificacoes'
import {exigirAdmin, registrarHistorico} from '@/lib/associados/sessao'
import {createAdminClient} from '@/lib/supabase/server'
import type {Categoria, Perfil} from '@/lib/supabase/types'

async function carregar(id: string): Promise<Perfil> {
  const {data, error} = await createAdminClient().from('perfis').select('*').eq('id', id).single()
  if (error || !data) throw new Error('Associado não encontrado.')
  return data as Perfil
}

function revalidar(id: string) {
  revalidatePath('/admin')
  revalidatePath(`/admin/associados/${id}`)
  revalidatePath('/vitrine')
}

const id = z.string().uuid()

export async function aprovar(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  const admin = await exigirAdmin()
  const p = await carregar(id.parse(fd.get('id')))
  if (p.status !== 'pendente_aprovacao') return {mensagem: 'Este pedido não está aguardando aprovação.'}
  const {error} = await createAdminClient().from('perfis').update({status: 'aguardando_pagamento'}).eq('id', p.id)
  if (error) return {mensagem: `Não foi possível aprovar: ${error.message}`}
  await registrarHistorico({perfilId: p.id, acao: 'aprovado', anterior: p.status, novo: 'aguardando_pagamento', autorId: admin.userId})
  await notificar.aprovado(p)
  revalidar(p.id)
  return {ok: true, mensagem: 'Pedido aprovado. O link de pagamento foi enviado por e-mail.'}
}

export async function recusar(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  const admin = await exigirAdmin()
  const p = await carregar(id.parse(fd.get('id')))
  if (p.status !== 'pendente_aprovacao') return {mensagem: 'Este pedido não está aguardando aprovação.'}
  const motivo = String(fd.get('motivo') ?? '').trim() || null
  const {error} = await createAdminClient().from('perfis').update({status: 'recusado'}).eq('id', p.id)
  if (error) return {mensagem: `Não foi possível recusar: ${error.message}`}
  await registrarHistorico({perfilId: p.id, acao: 'recusado', anterior: p.status, novo: 'recusado', autorId: admin.userId, observacao: motivo})
  await notificar.recusado(p, motivo)
  revalidar(p.id)
  return {ok: true, mensagem: 'Pedido recusado. A pessoa foi avisada por e-mail.'}
}

export async function definirCategoria(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  const admin = await exigirAdmin()
  const p = await carregar(id.parse(fd.get('id')))
  const categoria = z.enum(['fundador', 'titular']).parse(fd.get('categoria')) as Categoria
  if (categoria === p.categoria) return {ok: true, mensagem: 'Nenhuma alteração.'}
  const {error} = await createAdminClient().from('perfis').update({categoria}).eq('id', p.id)
  if (error) return {mensagem: `Não foi possível alterar: ${error.message}`}
  await registrarHistorico({
    perfilId: p.id,
    acao: 'categoria',
    autorId: admin.userId,
    observacao: categoria === 'fundador' ? 'Definido como Fundador (Estatuto, art. 12)' : 'Definido como Titular',
  })
  revalidar(p.id)
  return {ok: true, mensagem: 'Categoria atualizada.'}
}

export async function marcarIsento(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  const admin = await exigirAdmin()
  const p = await carregar(id.parse(fd.get('id')))
  const motivo = String(fd.get('motivo') ?? '').trim()
  if (!motivo) return {erros: {motivo: ['Informe o motivo da isenção, por exemplo: Diretoria — Estatuto, art. 26.']}}
  if (p.modalidade !== 'associado' || !p.documento) {
    return {mensagem: 'Só é possível isentar quem tem cadastro completo de Associado (CPF/CNPJ e dados da startup).'}
  }
  const {error} = await createAdminClient()
    .from('perfis')
    .update({isento: true, motivo_isencao: motivo, status: 'ativo'})
    .eq('id', p.id)
  if (error) return {mensagem: `Não foi possível isentar: ${error.message}`}
  await registrarHistorico({perfilId: p.id, acao: 'isencao_concedida', anterior: p.status, novo: 'ativo', autorId: admin.userId, observacao: motivo})
  await notificar.isencaoConcedida(p, motivo)
  revalidar(p.id)
  return {ok: true, mensagem: 'Isenção registrada. A associação está ativa sem cobrança.'}
}

export async function revogarIsencao(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  const admin = await exigirAdmin()
  const p = await carregar(id.parse(fd.get('id')))
  if (!p.isento) return {mensagem: 'Este associado não está isento.'}
  const motivo = String(fd.get('motivo') ?? '').trim() || null
  const {error} = await createAdminClient()
    .from('perfis')
    .update({isento: false, motivo_isencao: null, status: 'aguardando_pagamento'})
    .eq('id', p.id)
  if (error) return {mensagem: `Não foi possível revogar: ${error.message}`}
  await registrarHistorico({
    perfilId: p.id,
    acao: 'isencao_revogada',
    anterior: p.status,
    novo: 'aguardando_pagamento',
    autorId: admin.userId,
    observacao: motivo,
  })
  await notificar.isencaoEncerrada(p, motivo)
  revalidar(p.id)
  return {ok: true, mensagem: 'Isenção encerrada. O link de pagamento foi enviado por e-mail.'}
}

export async function salvarGrupoWhatsapp(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  const admin = await exigirAdmin()
  const link = String(fd.get('link') ?? '').trim()
  if (link && !/^https:\/\/(chat\.whatsapp\.com|wa\.me|whatsapp\.com)\//.test(link)) {
    return {erros: {link: ['Cole o link de convite do grupo, que começa com https://chat.whatsapp.com/']}, valores: {link}}
  }
  const {error} = await createAdminClient()
    .from('configuracoes_privadas')
    .upsert({chave: 'whatsapp_grupo_comunidade', valor: link, atualizado_em: new Date().toISOString(), atualizado_por: admin.userId})
  if (error) return {mensagem: `Não foi possível salvar: ${error.message}`, valores: {link}}
  revalidatePath('/admin/configuracoes')
  return {ok: true, mensagem: link ? 'Link salvo. Novos cadastros da Comunidade vão recebê-lo por e-mail.' : 'Link removido.', valores: {link}}
}

export async function enviarAta(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  const admin = await exigirAdmin()
  const titulo = String(fd.get('titulo') ?? '').trim()
  const data = String(fd.get('data_assembleia') ?? '')
  const arquivo = fd.get('arquivo')
  const erros: Record<string, string[]> = {}
  if (titulo.length < 3) erros.titulo = ['Informe o título da ata.']
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) erros.data_assembleia = ['Informe a data da Assembleia.']
  if (!(arquivo instanceof File) || arquivo.size === 0) erros.arquivo = ['Escolha o arquivo PDF da ata.']
  else if (arquivo.type !== 'application/pdf') erros.arquivo = ['A ata deve ser um arquivo PDF.']
  else if (arquivo.size > 20 * 1024 * 1024) erros.arquivo = ['O arquivo deve ter até 20 MB.']
  if (Object.keys(erros).length) return {erros, valores: {titulo, data_assembleia: data}}

  const db = createAdminClient()
  const caminho = `${data}-${crypto.randomUUID()}.pdf`
  const up = await db.storage
    .from('atas')
    .upload(caminho, Buffer.from(await (arquivo as File).arrayBuffer()), {contentType: 'application/pdf'})
  if (up.error) return {mensagem: `Falha no envio: ${up.error.message}`, valores: {titulo, data_assembleia: data}}
  const {error} = await db.from('atas').insert({titulo, data_assembleia: data, caminho, criado_por: admin.userId})
  if (error) {
    await db.storage.from('atas').remove([caminho])
    return {mensagem: `Não foi possível registrar: ${error.message}`, valores: {titulo, data_assembleia: data}}
  }
  revalidatePath('/admin/atas')
  revalidatePath('/associado')
  return {ok: true, mensagem: 'Ata publicada para os associados ativos.'}
}

export async function excluirAta(fd: FormData): Promise<void> {
  await exigirAdmin()
  const ataId = id.parse(fd.get('id'))
  const db = createAdminClient()
  const {data} = await db.from('atas').select('caminho').eq('id', ataId).maybeSingle()
  if (data) {
    await db.storage.from('atas').remove([data.caminho])
    await db.from('atas').delete().eq('id', ataId)
  }
  revalidatePath('/admin/atas')
  revalidatePath('/associado')
}

export async function concluirExclusao(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  await exigirAdmin()
  const pedidoId = id.parse(fd.get('id'))
  const observacao = String(fd.get('observacao') ?? '').trim() || null
  const {error} = await createAdminClient()
    .from('solicitacoes_exclusao')
    .update({concluida_em: new Date().toISOString(), observacao})
    .eq('id', pedidoId)
  if (error) return {mensagem: `Não foi possível concluir: ${error.message}`}
  revalidatePath('/admin/exclusoes')
  return {ok: true, mensagem: 'Pedido marcado como concluído.'}
}
