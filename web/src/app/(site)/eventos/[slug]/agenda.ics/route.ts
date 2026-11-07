import {getEvento} from '@/sanity/queries'
import {SITE_URL} from '@/lib/site'

const escapar = (s: string) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1')
const dataIcs = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

/** Linhas de no máximo 75 octetos (RFC 5545). */
function dobrar(linha: string) {
  const partes: string[] = []
  let atual = ''
  for (const ch of linha) {
    if (Buffer.byteLength(atual + ch) > 73) {
      partes.push(atual)
      atual = ' ' + ch
    } else atual += ch
  }
  partes.push(atual)
  return partes.join('\r\n')
}

export async function GET(_req: Request, ctx: RouteContext<'/eventos/[slug]/agenda.ics'>) {
  const {slug} = await ctx.params
  const e = await getEvento(slug)
  if (!e) return new Response('Evento não encontrado', {status: 404})
  const fim = e.fim ?? new Date(new Date(e.inicio).getTime() + 2 * 3600_000).toISOString()
  const local = e.formato === 'online' ? 'Online' : [e.local, e.cidade && `${e.cidade} - TO`].filter(Boolean).join(', ')
  const url = `${SITE_URL}/eventos/${e.slug}`
  const linhas = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Associacao Tocantinense de Startups//Site//PT-BR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${e._id}@startupto.com.br`,
    `DTSTAMP:${dataIcs(e.inicio)}`,
    `DTSTART:${dataIcs(e.inicio)}`,
    `DTEND:${dataIcs(fim)}`,
    `SUMMARY:${escapar(e.titulo)}`,
    `DESCRIPTION:${escapar([e.resumo, url].filter(Boolean).join('\n\n'))}`,
    local ? `LOCATION:${escapar(local)}` : '',
    `URL:${url}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean)
  return new Response(linhas.map(dobrar).join('\r\n') + '\r\n', {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${e.slug}.ics"`,
    },
  })
}
