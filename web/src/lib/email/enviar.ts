import 'server-only'
import {render} from '@react-email/components'
import {Resend} from 'resend'
import {env} from '@/lib/env'
import type {Email} from '@/emails/templates'
import {formatarWhatsapp} from '@/lib/validacao/documento'

let _resend: Resend | null = null
const resend = () => {
  const key = env.resendApiKey()
  if (!key) return null
  if (!_resend) _resend = new Resend(key)
  return _resend
}

const WHATSAPP_CONTATO = process.env.WHATSAPP_CONTATO ?? '5563992353262'

/**
 * Envia um e-mail transacional. Nunca lança: falhas são registradas no log
 * para não interromper o fluxo (cadastro, webhook) que disparou o envio.
 */
export async function enviarEmail(para: string | string[], email: Email): Promise<boolean> {
  const destinatarios = (Array.isArray(para) ? para : [para]).filter(Boolean)
  if (!destinatarios.length) return false
  const rodape = {
    whatsappContato: formatarWhatsapp(WHATSAPP_CONTATO),
    urlPrivacidade: `${env.siteUrl()}/privacidade`,
  }
  if (process.env.EMAIL_DESATIVADO === '1') {
    // Testes: renderiza (valida o template) mas não envia.
    const texto = await render(email.corpo(rodape), {plainText: true})
    console.info(`[email:desativado] "${email.assunto}" → ${destinatarios.join(', ')} (${texto.length} caracteres)`)
    return true
  }
  const cliente = resend()
  if (!cliente) {
    console.warn(`[email] Resend não configurado — "${email.assunto}" não enviado para ${destinatarios.join(', ')}`)
    return false
  }
  try {
    const elemento = email.corpo(rodape)
    const [html, text] = await Promise.all([render(elemento), render(elemento, {plainText: true})])
    const {error} = await cliente.emails.send({
      from: env.emailFrom(),
      to: destinatarios,
      replyTo: env.emailReplyTo(),
      subject: email.assunto,
      html,
      text,
    })
    if (error) {
      console.error('[email]', email.assunto, error)
      return false
    }
    return true
  } catch (e) {
    console.error('[email]', email.assunto, e)
    return false
  }
}
