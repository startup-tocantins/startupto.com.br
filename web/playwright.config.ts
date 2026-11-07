import {defineConfig, devices} from '@playwright/test'

/**
 * E2E contra o servidor local (npm run dev com EMAIL_DESATIVADO=1) e os serviços
 * de teste reais (Supabase do projeto, Stripe em modo de teste + `stripe listen`).
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 180_000,
  expect: {timeout: 20_000},
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:3000',
    locale: 'pt-BR',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [{name: 'chromium', use: {...devices['Desktop Chrome']}}],
})
