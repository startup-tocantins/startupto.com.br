import 'server-only'
import {createServerClient} from '@supabase/ssr'
import {createClient as createSupabaseClient} from '@supabase/supabase-js'
import {cookies} from 'next/headers'
import {env} from '@/lib/env'
import type {Database} from './types'

/** Cliente com a sessão do usuário (cookies). Respeita RLS. */
export async function createClient() {
  const url = env.supabaseUrl()
  const key = env.supabaseAnonKey()
  if (!url || !key) throw new Error('Supabase não configurado (NEXT_PUBLIC_SUPABASE_URL / ANON_KEY).')
  const cookieStore = await cookies()
  return createServerClient<Database>(url, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(toSet) {
        try {
          toSet.forEach(({name, value, options}) => cookieStore.set(name, value, options))
        } catch {
          // Chamado de um Server Component: o proxy renova a sessão.
        }
      },
    },
  })
}

/** Cliente com a service role. Ignora RLS — usar só no servidor, após checar permissões. */
export function createAdminClient() {
  const url = env.supabaseUrl()
  const key = env.supabaseServiceKey()
  if (!url || !key) throw new Error('Supabase não configurado (SUPABASE_SERVICE_ROLE_KEY).')
  return createSupabaseClient<Database>(url, key, {
    auth: {persistSession: false, autoRefreshToken: false},
  })
}

/** Cliente anônimo sem cookies, para leituras públicas cacheáveis (Vitrine). */
export function createPublicClient() {
  const url = env.supabaseUrl()
  const key = env.supabaseAnonKey()
  if (!url || !key) return null
  return createSupabaseClient<Database>(url, key, {auth: {persistSession: false}})
}
