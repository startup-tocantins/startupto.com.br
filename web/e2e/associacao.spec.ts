import {expect, test} from '@playwright/test'
import {apagarUsuario, criarUsuarioTeste, db, gerarCNPJ, linkDeAcesso, perfilPorEmail} from './apoio'

const sufixo = Date.now()
const comunidade = `e2e.comunidade.${sufixo}@example.com`
const associado = `e2e.associado.${sufixo}@example.com`
const admin = `e2e.admin.${sufixo}@example.com`
const startup = `Startup E2E ${sufixo}`

test.afterAll(async () => {
  for (const e of [comunidade, associado, admin]) await apagarUsuario(e)
})

test('cadastro na Comunidade cria o perfil', async ({page}) => {
  await page.goto('/cadastro/comunidade')
  await page.locator('#nome').fill('Pessoa da Comunidade')
  await page.locator('#email').fill(comunidade)
  await page.locator('#whatsapp').fill('(63) 99999-0001')
  await page.locator('#cidade').selectOption({label: 'Araguaína'})
  await page.locator('#aceite_privacidade').check()
  await page.getByRole('button', {name: 'Entrar na Comunidade'}).click()
  await expect(page.getByText('Cadastro confirmado!')).toBeVisible()

  const p = await perfilPorEmail(comunidade)
  expect(p).toMatchObject({modalidade: 'comunidade', status: 'comunidade', cidade: 'araguaina', whatsapp: '63999990001'})
})

test('formulário de associado valida CPF/CNPJ e campos obrigatórios', async ({page}) => {
  await page.goto('/cadastro/associado')
  await page.locator('#documento').fill('11.111.111/1111-11')
  await page.getByRole('button', {name: 'Enviar pedido de associação'}).click()
  await expect(page.getByText(/Corrija \d+ campos para continuar/)).toBeVisible()
  await expect(page.getByText('CPF ou CNPJ inválido. Confira os números digitados.').first()).toBeVisible()
})

test('ciclo completo: pedido → aprovação → pagamento → Vitrine', async ({page, browser}) => {
  // 1. Pedido de associação (pessoa jurídica)
  await page.goto('/cadastro/associado')
  await page.locator('#nome').fill('Fundadora E2E')
  await page.locator('#email').fill(associado)
  await page.locator('#whatsapp').fill('63999990002')
  await page.locator('#cidade').selectOption({label: 'Gurupi'})
  await page.locator('#documento').fill(gerarCNPJ())
  await page.locator('#startup_nome').fill(startup)
  await page.locator('#setor').selectOption({label: 'Agro / AgTech'})
  await page.locator('#estagio').selectOption({label: 'Tração'})
  await page.locator('#site').fill('example.com')
  await page.locator('#aceite_estatuto').check()
  await page.locator('#aceite_privacidade').check()
  await page.getByRole('button', {name: 'Enviar pedido de associação'}).click()
  await expect(page.getByText('Pedido enviado à Diretoria')).toBeVisible()
  let p = await perfilPorEmail(associado)
  expect(p).toMatchObject({modalidade: 'associado', status: 'pendente_aprovacao', site: 'https://example.com', vitrine_opt_in: true})

  // 2. Associado entra pelo link mágico e vê o pedido em análise
  await page.goto(await linkDeAcesso(associado))
  await expect(page).toHaveURL(/\/associado$/)
  await expect(page.getByText('Aguardando aprovação')).toBeVisible()

  // 3. Admin aprova no painel
  const u = {user: await criarUsuarioTeste(admin)}
  await db.from('perfis').insert({
    id: u.user!.id, nome: 'Admin E2E', email: admin, whatsapp: '63999990003', cidade: 'palmas',
    aceite_privacidade_em: new Date().toISOString(), papel: 'admin',
  })
  const ctxAdmin = await browser.newContext()
  const pa = await ctxAdmin.newPage()
  await pa.goto(await linkDeAcesso(admin, '/admin'))
  await expect(pa.getByRole('heading', {name: 'Associados'})).toBeVisible()
  await pa.getByRole('link', {name: 'Fundadora E2E'}).click()
  await expect(pa.getByText('Pedido aguardando análise')).toBeVisible()
  await pa.getByRole('button', {name: 'Aprovar pedido'}).click()
  await expect(pa.getByText(/Pedido aprovado/)).toBeVisible()
  p = await perfilPorEmail(associado)
  expect(p?.status).toBe('aguardando_pagamento')

  // 4. Associado paga no Stripe Checkout (cartão de teste)
  await page.goto('/associado/pagamento')
  await expect(page.getByText('R$ 250,00 por ano')).toBeVisible()
  await page.getByRole('button', {name: 'Ir para o pagamento seguro'}).click()
  await page.waitForURL(/checkout\.stripe\.com/)
  await page.locator('#cardNumber').fill('4242 4242 4242 4242')
  await page.locator('#cardExpiry').fill('12 / 34')
  await page.locator('#cardCvc').fill('123')
  await page.locator('#billingName').fill('Fundadora E2E')
  const pais = page.locator('#billingCountry')
  if (await pais.isVisible().catch(() => false)) await pais.selectOption('BR')
  await page.locator('button[type="submit"]').first().click()
  await page.waitForURL(/\/associado\?pagamento=confirmado/, {timeout: 90_000})

  // 5. Webhook ativa a associação
  await expect
    .poll(async () => (await perfilPorEmail(associado))?.status, {timeout: 60_000, intervals: [1000]})
    .toBe('ativo')
  p = await perfilPorEmail(associado)
  expect(p?.vencimento).toBeTruthy()
  expect(p?.stripe_subscription_id).toMatch(/^sub_/)
  const {data: hist} = await db.from('historico_associado').select('acao').eq('perfil_id', p!.id)
  expect(hist!.map((h) => h.acao)).toEqual(expect.arrayContaining(['pedido_associacao', 'aprovado', 'pagamento_confirmado']))

  // 6. Aparece na Vitrine pública (view com RLS, papel anon)
  const anon = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/vitrine?select=nome_startup&nome_startup=eq.${encodeURIComponent(startup)}`, {
    headers: {apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!},
  })
  expect(await anon.json()).toEqual([{nome_startup: startup}])

  // 7. Admin exporta XLSX com o associado
  const download = pa.waitForEvent('download')
  await pa.goto('/admin')
  await pa.getByRole('link', {name: /Exportar XLSX/}).click()
  expect((await download).suggestedFilename()).toMatch(/^associados-\d{4}-\d{2}-\d{2}\.xlsx$/)

  // 8. Cancela a assinatura de teste no Stripe e confirma o status "cancelado"
  const stripe = new (await import('stripe')).default(process.env.STRIPE_SECRET_KEY!)
  await stripe.subscriptions.cancel(p!.stripe_subscription_id!)
  await expect
    .poll(async () => (await perfilPorEmail(associado))?.status, {timeout: 60_000, intervals: [1000]})
    .toBe('cancelado')
  await stripe.customers.del(p!.stripe_customer_id!)
  await ctxAdmin.close()
})

test('áreas logadas exigem login', async ({page}) => {
  await page.goto('/admin')
  await expect(page).toHaveURL(/\/entrar\?proximo=%2Fadmin/)
  await page.goto('/associado')
  await expect(page).toHaveURL(/\/entrar/)
})
