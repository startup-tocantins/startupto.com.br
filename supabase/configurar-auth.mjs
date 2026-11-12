#!/usr/bin/env node
/**
 * Aplica a configuração de Authentication do projeto Supabase via Management API.
 *
 *   node supabase/configurar-auth.mjs            → desliga cadastro público, URLs e templates
 *   node supabase/configurar-auth.mjs --smtp     → também liga o SMTP do Resend
 *                                                  (só depois de verificar startupto.com.br no Resend)
 *
 * Token: SUPABASE_ACCESS_TOKEN (env ou .env da raiz) ou ~/.supabase/access-token (`npx supabase login`).
 */
import {existsSync, readFileSync} from 'node:fs'
import {homedir} from 'node:os'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const REF = 'gcbeufdcjygmrogjyavw'
const SITE = process.env.SITE_URL ?? 'https://startupto.com.br'

function lerEnv() {
  const p = resolve(RAIZ, '.env')
  if (!existsSync(p)) return {}
  return Object.fromEntries(
    readFileSync(p, 'utf8')
      .split('\n')
      .map((l) => /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(l))
      .filter(Boolean)
      .map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]),
  )
}
const envRaiz = lerEnv()
const arquivoToken = resolve(homedir(), '.supabase/access-token')
const token =
  process.env.SUPABASE_ACCESS_TOKEN ||
  envRaiz.SUPABASE_ACCESS_TOKEN ||
  envRaiz.SUPABASE_ACCESS_KEY ||
  (existsSync(arquivoToken) ? readFileSync(arquivoToken, 'utf8').trim() : '')
if (!token) {
  console.error('Sem token. Rode `npx supabase login` ou defina SUPABASE_ACCESS_TOKEN no .env da raiz.')
  process.exit(1)
}

const template = (nome) => readFileSync(resolve(RAIZ, 'supabase/templates', nome), 'utf8')

const config = {
  disable_signup: true,
  site_url: SITE,
  uri_allow_list: [
    'https://startupto.vercel.app/**',
    'https://startupto.com.br/**',
    'https://www.startupto.com.br/**',
    'http://localhost:3000/**',
  ].join(','),
  mailer_otp_exp: 3600,
  mailer_subjects_magic_link: 'Seu link de acesso',
  mailer_templates_magic_link_content: template('link-de-acesso.html'),
  mailer_subjects_email_change: 'Confirme seu novo e-mail',
  mailer_templates_email_change_content: template('troca-de-email.html'),
}

if (process.argv.includes('--smtp')) {
  const resend = process.env.RESEND_API_KEY || envRaiz.RESEND_API_KEY || envRaiz.RESEND_APIKEY
  if (!resend) throw new Error('RESEND_API_KEY ausente')
  Object.assign(config, {
    smtp_host: 'smtp.resend.com',
    smtp_port: '465',
    smtp_user: 'resend',
    smtp_pass: resend,
    smtp_admin_email: 'contato@startupto.com.br',
    smtp_sender_name: 'Associação Tocantinense de Startups',
    rate_limit_email_sent: 60,
  })
}

const url = `https://api.supabase.com/v1/projects/${REF}/config/auth`
const res = await fetch(url, {
  method: 'PATCH',
  headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
  body: JSON.stringify(config),
})
if (!res.ok) {
  console.error(`Falhou (${res.status}):`, await res.text())
  process.exit(1)
}
const atual = await res.json()
console.log('✓ Auth configurado:', {
  disable_signup: atual.disable_signup,
  site_url: atual.site_url,
  uri_allow_list: atual.uri_allow_list,
  smtp: atual.smtp_host ? `${atual.smtp_host} (${atual.smtp_admin_email})` : 'padrão do Supabase',
  template_magic_link: atual.mailer_subjects_magic_link,
})
