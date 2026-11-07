const TZ = 'America/Araguaina'

export function formatarWhatsapp(numero: string) {
  const d = numero.replace(/\D/g, '').replace(/^55/, '')
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return numero
}

export function dataLonga(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', {dateStyle: 'long', timeZone: TZ}).format(new Date(iso))
}

export function dataCurta(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', {day: '2-digit', month: 'short', year: 'numeric', timeZone: TZ})
    .format(new Date(iso))
    .replace('.', '')
}

export function hora(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', {hour: '2-digit', minute: '2-digit', timeZone: TZ}).format(new Date(iso))
}

/** Partes de data para o "carimbo" dos eventos. */
export function partesData(iso: string) {
  const d = new Date(iso)
  const f = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('pt-BR', {...o, timeZone: TZ}).format(d)
  return {
    dia: f({day: '2-digit'}),
    mes: f({month: 'short'}).replace('.', ''),
    ano: f({year: 'numeric'}),
    semana: f({weekday: 'long'}),
  }
}

export function periodoEvento(inicio: string, fim?: string) {
  const di = dataLonga(inicio)
  if (!fim) return `${di}, ${hora(inicio)}`
  const df = dataLonga(fim)
  if (di === df) return `${di}, ${hora(inicio)} às ${hora(fim)}`
  return `${di}, ${hora(inicio)} a ${df}, ${hora(fim)}`
}

export function tamanhoArquivo(bytes?: number) {
  if (!bytes) return ''
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')} MB`
}

export function iniciais(nome: string) {
  const partes = nome
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((p) => p.length > 2 || /^[A-ZÀ-Ý0-9]/.test(p))
  const primeira = partes[0]?.[0] ?? ''
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : ''
  return (primeira + ultima).toUpperCase()
}

/** Instante atual (fora do corpo de componentes, para a regra de pureza do React). */
export function agoraMs() {
  return Date.now()
}
