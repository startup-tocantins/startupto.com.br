/**
 * Dá (ou retira) o papel de admin a um cadastro existente.
 * Uso: npm run admin:grant -- email@exemplo.com [--revogar]
 */
import {createClient} from '@supabase/supabase-js'
import {loadEnv} from './env'

loadEnv()
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
const email = process.argv.find((a) => a.includes('@'))?.toLowerCase()
const revogar = process.argv.includes('--revogar')
if (!url || !key) throw new Error('Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SECRET_KEY.')
if (!email) throw new Error('Informe o e-mail: npm run admin:grant -- email@exemplo.com')

async function main() {
const db = createClient(url!, key!, {auth: {persistSession: false}})
const {data, error} = await db
  .from('perfis')
  .update({papel: revogar ? 'membro' : 'admin'})
  .ilike('email', email!)
  .select('nome, email, papel')
if (error) throw error
if (!data?.length) {
  console.error(`Nenhum cadastro com ${email}. A pessoa precisa se cadastrar no site antes (Comunidade basta).`)
  process.exit(1)
}
console.log(`✓ ${data[0].nome} <${data[0].email}> agora é ${data[0].papel}.`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
