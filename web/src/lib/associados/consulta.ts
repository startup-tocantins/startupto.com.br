import 'server-only'
import {createAdminClient} from '@/lib/supabase/server'
import type {Perfil} from '@/lib/supabase/types'

export type Filtros = {q?: string; status?: string; modalidade?: string; setor?: string; cidade?: string; pagina?: number}

export const POR_PAGINA = 25

export function filtrosDe(sp: Record<string, string | string[] | undefined>): Filtros {
  const um = (k: string) => {
    const v = sp[k]
    return (Array.isArray(v) ? v[0] : v)?.trim() || undefined
  }
  return {
    q: um('q'),
    status: um('status'),
    modalidade: um('modalidade'),
    setor: um('setor'),
    cidade: um('cidade'),
    pagina: Math.max(1, Number(um('pagina') ?? 1) || 1),
  }
}

/** Busca associados para o admin (service role; chamar só após exigirAdmin()). */
export async function buscarAssociados(f: Filtros, opts: {todos?: boolean} = {}) {
  let q = createAdminClient().from('perfis').select('*', {count: 'exact'}).order('criado_em', {ascending: false})
  if (f.status) q = q.eq('status', f.status as Perfil['status'])
  if (f.modalidade) q = q.eq('modalidade', f.modalidade as Perfil['modalidade'])
  if (f.setor) q = q.eq('setor', f.setor)
  if (f.cidade) q = q.eq('cidade', f.cidade)
  if (f.q) {
    const termo = f.q.replace(/[%,()]/g, ' ')
    q = q.or(`nome.ilike.%${termo}%,email.ilike.%${termo}%,startup_nome.ilike.%${termo}%,documento.ilike.%${termo.replace(/\D/g, '') || termo}%`)
  }
  if (!opts.todos) {
    const de = ((f.pagina ?? 1) - 1) * POR_PAGINA
    q = q.range(de, de + POR_PAGINA - 1)
  }
  const {data, count, error} = await q
  if (error) throw new Error(error.message)
  return {associados: (data ?? []) as Perfil[], total: count ?? 0}
}
