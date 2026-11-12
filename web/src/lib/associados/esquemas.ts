import {z} from 'zod'
import {somenteDigitos, validarDocumento} from '@/lib/validacao/documento'

const marcado = (msg: string) => z.literal('on', {error: msg})

/** Senha de acesso: mínimo de 8 (igual ao Supabase Auth); 72 é o limite do bcrypt. */
export const senhaSchema = z
  .string()
  .min(8, 'A senha precisa ter pelo menos 8 caracteres.')
  .max(72, 'Use no máximo 72 caracteres.')

export const comunidadeSchema = z.object({
  nome: z.string().trim().min(2, 'Informe seu nome completo.').max(200, 'Nome muito longo.'),
  email: z.string().trim().toLowerCase().email('Informe um e-mail válido, como nome@exemplo.com.'),
  whatsapp: z
    .string()
    .transform(somenteDigitos)
    .transform((v) => v.replace(/^55(?=\d{10,11}$)/, ''))
    .refine((v) => /^\d{10,11}$/.test(v), 'Informe o WhatsApp com DDD, como (63) 99999-9999.'),
  cidade: z.string().min(1, 'Escolha sua cidade.'),
  senha: senhaSchema,
  aceite_privacidade: marcado('Para se cadastrar, aceite a Política de Privacidade.'),
})

export const camposStartup = {
  documento: z
    .string()
    .transform((v) => validarDocumento(v))
    .refine((v) => v !== null, 'CPF ou CNPJ inválido. Confira os números digitados.'),
  startup_nome: z.string().trim().min(2, 'Informe o nome da startup.').max(120, 'Nome muito longo.'),
  setor: z.string().min(1, 'Escolha o setor.'),
  estagio: z.string().min(1, 'Escolha o estágio.'),
  site: z
    .string()
    .trim()
    .transform((v) => (v && !/^https?:\/\//i.test(v) ? `https://${v}` : v))
    .refine((v) => !v || /^https?:\/\/[^\s.]+\.[^\s]+$/i.test(v), 'Informe um endereço válido, como startup.com.br.')
    .optional()
    .transform((v) => v || null),
  vitrine_opt_in: z
    .string()
    .optional()
    .transform((v) => v === 'on'),
}

export const associadoSchema = comunidadeSchema.extend({
  ...camposStartup,
  aceite_estatuto: marcado('Para se associar, aceite o Estatuto Social e o Regimento Interno.'),
})

export const upgradeSchema = z.object({
  ...camposStartup,
  aceite_estatuto: marcado('Para se associar, aceite o Estatuto Social e o Regimento Interno.'),
})

export const perfilSchema = z.object({
  nome: comunidadeSchema.shape.nome,
  whatsapp: comunidadeSchema.shape.whatsapp,
  cidade: comunidadeSchema.shape.cidade,
  startup_nome: z.string().trim().max(120).optional().transform((v) => v || null),
  setor: z.string().optional().transform((v) => v || null),
  estagio: z.string().optional().transform((v) => v || null),
  site: camposStartup.site,
  vitrine_opt_in: camposStartup.vitrine_opt_in,
})

export const TIPOS_LOGO = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
export const LOGO_MAX_BYTES = 1024 * 1024

export function validarLogo(arquivo: FormDataEntryValue | null): {arquivo: File | null; erro?: string} {
  if (!arquivo || typeof arquivo === 'string' || arquivo.size === 0) return {arquivo: null}
  if (!TIPOS_LOGO.includes(arquivo.type)) return {arquivo: null, erro: 'Envie o logo em PNG, JPG, WebP ou SVG.'}
  if (arquivo.size > LOGO_MAX_BYTES) return {arquivo: null, erro: 'O logo deve ter até 1 MB.'}
  return {arquivo}
}

export type EstadoForm = {
  ok?: boolean
  mensagem?: string
  erros?: Record<string, string[] | undefined>
  valores?: Record<string, string>
}

export function errosDe(e: z.ZodError): Record<string, string[]> {
  const out: Record<string, string[]> = {}
  for (const issue of e.issues) {
    const k = String(issue.path[0] ?? '_')
    ;(out[k] ??= []).push(issue.message)
  }
  return out
}

/** Devolve os valores digitados (exceto arquivos e senhas) para repovoar o formulário após erro. */
export function valoresDe(fd: FormData): Record<string, string> {
  const v: Record<string, string> = {}
  fd.forEach((val, k) => {
    if (typeof val === 'string' && !k.startsWith('$') && !k.startsWith('senha')) v[k] = val
  })
  return v
}
