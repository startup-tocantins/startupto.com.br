import 'server-only'
import {cache} from 'react'
import {redirect} from 'next/navigation'
import {connection} from 'next/server'
import {supabaseConfigurado} from '@/lib/env'
import {createAdminClient, createClient} from '@/lib/supabase/server'
import type {Perfil, StatusAssociado} from '@/lib/supabase/types'

export type Sessao = {userId: string; email: string; perfil: Perfil | null}

/** Usuário logado + perfil (null se não logado ou Supabase não configurado). */
export const getSessao = cache(async (): Promise<Sessao | null> => {
  // Sessão é sempre por requisição (e o SDK lê o relógio): nunca entra no prerender.
  await connection()
  if (!supabaseConfigurado()) return null
  const supabase = await createClient()
  const {data, error} = await supabase.auth.getUser()
  if (error || !data.user) return null
  const {data: perfil} = await supabase.from('perfis').select('*').eq('id', data.user.id).maybeSingle()
  return {userId: data.user.id, email: data.user.email ?? '', perfil: perfil ?? null}
})

export async function exigirSessao(destino = '/associado'): Promise<Sessao & {perfil: Perfil}> {
  const s = await getSessao()
  if (!s) redirect(`/entrar?proximo=${encodeURIComponent(destino)}`)
  if (!s.perfil) redirect('/entrar?erro=perfil')
  return s as Sessao & {perfil: Perfil}
}

/** Garante papel admin (checagem no servidor, além do proxy). */
export async function exigirAdmin(): Promise<Sessao & {perfil: Perfil}> {
  const s = await exigirSessao('/admin')
  if (s.perfil.papel !== 'admin') redirect('/associado?erro=sem-permissao')
  return s
}

export async function registrarHistorico(r: {
  perfilId: string
  acao: string
  anterior?: StatusAssociado | null
  novo?: StatusAssociado | null
  autorId?: string | null
  observacao?: string | null
}) {
  const admin = createAdminClient()
  const {error} = await admin.from('historico_associado').insert({
    perfil_id: r.perfilId,
    acao: r.acao,
    status_anterior: r.anterior ?? null,
    status_novo: r.novo ?? null,
    autor_id: r.autorId ?? null,
    observacao: r.observacao ?? null,
  })
  if (error) console.error('[historico]', error.message)
}

export async function emailsDosAdmins(): Promise<string[]> {
  const admin = createAdminClient()
  const {data} = await admin.from('perfis').select('email').eq('papel', 'admin')
  const extras = (process.env.ALERTAS_DIRETORIA_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean)
  return [...new Set([...(data ?? []).map((p) => p.email), ...extras])]
}
