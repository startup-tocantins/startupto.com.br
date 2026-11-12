import {createClient} from '@supabase/supabase-js'
import {loadEnv} from '../scripts/env'

loadEnv()

export const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
  auth: {persistSession: false},
})

/** CNPJ válido aleatório (dígitos verificadores corretos). */
export function gerarCNPJ(): string {
  const base = Array.from({length: 8}, () => Math.floor(Math.random() * 10)).concat([0, 0, 0, 1])
  const dv = (n: number[]) => {
    const pesos = n.length === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    const r = n.reduce((a, d, i) => a + d * pesos[i], 0) % 11
    return r < 2 ? 0 : 11 - r
  }
  const d1 = dv(base)
  const d2 = dv([...base, d1])
  return [...base, d1, d2].join('')
}

/** URL de login direto (sem e-mail), via link mágico gerado pela API admin. */
export async function linkDeAcesso(email: string, proximo = '/associado') {
  const {data, error} = await db.auth.admin.generateLink({type: 'magiclink', email})
  if (error) throw error
  return `/auth/confirm?token_hash=${data.properties.hashed_token}&type=magiclink&proximo=${encodeURIComponent(proximo)}`
}

export async function perfilPorEmail(email: string) {
  const {data} = await db.from('perfis').select('*').ilike('email', email).maybeSingle()
  return data
}

export async function apagarUsuario(email: string) {
  const p = await perfilPorEmail(email)
  if (p?.logo_path) await db.storage.from('logos').remove([p.logo_path])
  if (p) await db.auth.admin.deleteUser(p.id)
}

/** Cria usuário como o servidor faz (com a chave exigida pelo trigger do banco). */
export async function criarUsuarioTeste(email: string, senha?: string) {
  const {data, error} = await db.auth.admin.createUser({
    email,
    ...(senha ? {password: senha} : {}),
    email_confirm: true,
    user_metadata: {chave_cadastro: process.env.SUPABASE_CHAVE_CADASTRO},
  })
  if (error || !data.user) throw error ?? new Error('createUser falhou')
  await db.auth.admin.updateUserById(data.user.id, {user_metadata: {chave_cadastro: null}})
  return data.user
}
