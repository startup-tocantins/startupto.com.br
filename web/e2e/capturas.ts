/** Captura telas da área logada para revisão visual. Uso: npx tsx e2e/capturas.ts */
import {chromium} from '@playwright/test'
import {apagarUsuario, db, gerarCNPJ, linkDeAcesso} from './apoio'

const BASE = process.env.E2E_BASE_URL ?? 'http://localhost:3000'
const OUT = process.env.CAPTURAS_DIR ?? '../.impeccable/review'

async function main() {
  const email = `captura.${Date.now()}@example.com`
  const {data} = await db.auth.admin.createUser({email, email_confirm: true})
  const id = data.user!.id
  await db.from('perfis').insert({
    id, nome: 'Maria Captura', email, whatsapp: '63999990009', cidade: 'porto-nacional',
    aceite_privacidade_em: new Date().toISOString(), aceite_estatuto_em: new Date().toISOString(),
    modalidade: 'associado', status: 'aguardando_pagamento', tipo_documento: 'cnpj', documento: gerarCNPJ(),
    startup_nome: 'Cerrado Dados (exemplo)', setor: 'agro-agtech', estagio: 'validacao', site: 'https://example.com',
    vitrine_opt_in: true, papel: 'admin',
  })
  const browser = await chromium.launch()
  try {
    for (const [nome, viewport] of [['desktop', {width: 1440, height: 900}], ['mobile', {width: 390, height: 844}]] as const) {
      const ctx = await browser.newContext({viewport, locale: 'pt-BR'})
      const page = await ctx.newPage()
      page.on('console', (m) => m.type() === 'error' && console.log(`[console ${nome}] ${page.url()} :: ${m.text().slice(0, 300)}`))
      page.on('pageerror', (e) => console.log(`[pageerror ${nome}] ${page.url()} :: ${e.message.slice(0, 300)}`))
      await page.goto(BASE + '/entrar')
      await page.waitForLoadState('networkidle'); await page.screenshot({path: `${OUT}/conta-entrar-${nome}.png`, fullPage: true})
      await page.goto(BASE + '/cadastro/associado')
      await page.waitForLoadState('networkidle'); await page.screenshot({path: `${OUT}/conta-cadastro-associado-${nome}.png`, fullPage: true})
      await page.goto(BASE + (await linkDeAcesso(email)))
      await page.waitForURL(/\/associado$/)
      await page.waitForLoadState('networkidle'); await page.screenshot({path: `${OUT}/conta-area-${nome}.png`, fullPage: true})
      await page.goto(BASE + '/associado/pagamento')
      await page.waitForLoadState('networkidle'); await page.screenshot({path: `${OUT}/conta-pagamento-${nome}.png`, fullPage: true})
      await page.goto(BASE + '/admin')
      await page.waitForLoadState('networkidle'); await page.screenshot({path: `${OUT}/admin-lista-${nome}.png`, fullPage: true})
      await page.goto(`${BASE}/admin/associados/${id}`)
      await page.waitForLoadState('networkidle'); await page.screenshot({path: `${OUT}/admin-detalhe-${nome}.png`, fullPage: true})
      await ctx.close()
    }
  } finally {
    await browser.close()
    await apagarUsuario(email)
  }
}
main()
