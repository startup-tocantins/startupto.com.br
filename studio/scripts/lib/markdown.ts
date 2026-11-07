/**
 * Conversor mínimo de Markdown → Portable Text, suficiente para os textos
 * institucionais do projeto (títulos, parágrafos, listas, citações, tabelas,
 * negrito, itálico e links).
 */
import {randomUUID} from 'node:crypto'

const key = () => randomUUID().replace(/-/g, '').slice(0, 12)

type Span = {_type: 'span'; _key: string; text: string; marks: string[]}
type MarkDef = {_type: 'link'; _key: string; href: string}
export type Block = {
  _type: 'block'
  _key: string
  style: string
  markDefs: MarkDef[]
  children: Span[]
  listItem?: 'bullet' | 'number'
  level?: number
}
export type Tabela = {
  _type: 'tabela'
  _key: string
  linhas: {_type: 'linha'; _key: string; celulas: string[]}[]
}
export type PTNode = Block | Tabela

/** Converte texto inline (com **negrito**, *itálico*, `código` e [links](url)) em spans. */
export function inline(text: string): {children: Span[]; markDefs: MarkDef[]} {
  const children: Span[] = []
  const markDefs: MarkDef[] = []
  const re = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\))/g
  let last = 0
  let m: RegExpExecArray | null
  const push = (t: string, marks: string[] = []) => {
    if (t) children.push({_type: 'span', _key: key(), text: t, marks})
  }
  while ((m = re.exec(text))) {
    push(text.slice(last, m.index))
    if (m[2] !== undefined) push(m[2], ['strong'])
    else if (m[3] !== undefined) push(m[3], ['em'])
    else if (m[4] !== undefined) push(m[4])
    else if (m[5] !== undefined) {
      const k = key()
      markDefs.push({_type: 'link', _key: k, href: m[6]})
      push(m[5], [k])
    }
    last = m.index + m[0].length
  }
  push(text.slice(last))
  if (!children.length) push(' ')
  return {children, markDefs}
}

function block(text: string, style = 'normal', extra: Partial<Block> = {}): Block {
  const {children, markDefs} = inline(text)
  return {_type: 'block', _key: key(), style, markDefs, children, ...extra}
}

export function markdownToPortableText(md: string): PTNode[] {
  const lines = md.replace(/\r/g, '').split('\n')
  const out: PTNode[] = []
  let para: string[] = []
  const flush = () => {
    if (para.length) out.push(block(para.join(' ').trim()))
    para = []
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const t = line.trim()
    if (!t) {
      flush()
      continue
    }
    // Tabela
    if (t.startsWith('|')) {
      flush()
      const rows: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('|')) rows.push(lines[i++].trim())
      i--
      const linhas = rows
        .filter((r) => !/^\|[\s:|-]+\|$/.test(r))
        .map((r) => ({
          _type: 'linha' as const,
          _key: key(),
          celulas: r
            .slice(1, -1)
            .split('|')
            .map((c) => c.trim().replace(/\*\*/g, '')),
        }))
      out.push({_type: 'tabela', _key: key(), linhas})
      continue
    }
    const h = /^(#{1,6})\s+(.*)$/.exec(t)
    if (h) {
      flush()
      out.push(block(h[2], h[1].length <= 2 ? 'h2' : 'h3'))
      continue
    }
    if (t.startsWith('>')) {
      flush()
      out.push(block(t.replace(/^>\s?/, ''), 'blockquote'))
      continue
    }
    const ul = /^[-*]\s+(.*)$/.exec(t)
    if (ul) {
      flush()
      out.push(block(ul[1], 'normal', {listItem: 'bullet', level: 1}))
      continue
    }
    const ol = /^\d+\.\s+(.*)$/.exec(t)
    if (ol) {
      flush()
      out.push(block(ol[1], 'normal', {listItem: 'number', level: 1}))
      continue
    }
    // Quebra de linha "dura" (linhas consecutivas em bloco de endereço etc.)
    para.push(t)
    if (line.endsWith('  ') || /^\*[^*].*\*$/.test(t)) flush()
  }
  flush()
  return out
}

export const paragraphs = (text: string): Block[] =>
  text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => block(p.replace(/\n/g, ' ')))
