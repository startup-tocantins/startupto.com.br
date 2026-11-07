import 'server-only'
import {createAdminClient} from '@/lib/supabase/server'

const EXT: Record<string, string> = {'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/svg+xml': 'svg'}

/** Envia o logo para o bucket público "logos" na pasta do associado. Retorna o caminho. */
export async function enviarLogo(perfilId: string, arquivo: File): Promise<string> {
  const caminho = `${perfilId}/logo-${Date.now()}.${EXT[arquivo.type] ?? 'png'}`
  const admin = createAdminClient()
  const {error} = await admin.storage
    .from('logos')
    .upload(caminho, Buffer.from(await arquivo.arrayBuffer()), {contentType: arquivo.type, upsert: true})
  if (error) throw new Error(`Falha ao enviar o logo: ${error.message}`)
  return caminho
}

export async function removerLogo(caminho: string | null) {
  if (!caminho) return
  await createAdminClient().storage.from('logos').remove([caminho])
}
