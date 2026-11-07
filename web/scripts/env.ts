import {existsSync, readFileSync} from 'node:fs'
import {resolve} from 'node:path'

/** Carrega web/.env.local e depois o .env da raiz do monorepo (sem sobrescrever). */
export function loadEnv() {
  for (const p of [resolve(__dirname, '../.env.local'), resolve(__dirname, '../../.env')]) {
    if (!existsSync(p)) continue
    for (const line of readFileSync(p, 'utf8').split('\n')) {
      const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  }
}
