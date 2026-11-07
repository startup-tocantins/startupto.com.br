import 'server-only'
import {env} from '@/lib/env'
import {createPublicClient} from './server'
import type {Categoria} from './types'

export type VitrineCard = {
  id: string
  nome_startup: string
  logo_url: string | null
  setor: string | null
  estagio: string | null
  cidade: string
  site: string | null
  categoria: Categoria
}

export function logoPublicUrl(path: string | null) {
  const base = env.supabaseUrl()
  if (!path || !base) return null
  return `${base}/storage/v1/object/public/logos/${path}`
}

/** Associados ativos com opt-in. Retorna [] se o Supabase ainda não estiver configurado. */
export async function getVitrine(): Promise<VitrineCard[]> {
  const supabase = createPublicClient()
  if (!supabase) return []
  const {data, error} = await supabase
    .from('vitrine')
    .select('id, nome_startup, logo_path, setor, estagio, cidade, site, categoria')
    .order('nome_startup')
  if (error) {
    console.error('[vitrine]', error.message)
    return []
  }
  return (data ?? []).map(({logo_path, ...r}) => ({...r, logo_url: logoPublicUrl(logo_path)}))
}
