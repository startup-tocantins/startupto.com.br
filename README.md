# Associação Tocantinense de Startups — site e plataforma de associação

Monorepo com o site institucional e o ciclo completo de associação (cadastro → aprovação → anuidade → gestão).

```
startupto/
├── web/        Next.js 16 (App Router, Cache Components, Tailwind) — site, área do associado e /admin
├── studio/     Sanity Studio (projeto megra9kk, dataset production) — conteúdo editorial
├── supabase/   migrations (perfis, RLS, Vitrine, atas, LGPD) e templates de e-mail do Auth
└── *.md        PRODUCT.md, DESIGN.md, textos aprovados (manifesto, privacidade, e-mails, termos)
```

| Serviço | Para quê |
|---|---|
| **Sanity** | Notícias, editais, benefícios, eventos, Diretoria, Mantenedores, documentos e páginas |
| **Supabase** | Login por link mágico e dados dos associados (nunca no Sanity) |
| **Stripe** | Assinatura anual do Associado, só cartão; Portal do Cliente |
| **Resend** | E-mails transacionais (`web/src/emails`) |

## Rodar localmente

```bash
# Studio (http://localhost:3333)
cd studio && npm install && npm run dev

# Site (http://localhost:3000)
cd web && npm install
cp .env.example .env.local      # preencha as chaves
npm run dev

# Webhooks do Stripe em desenvolvimento (outro terminal)
stripe listen --api-key "$STRIPE_SECRET_KEY" --forward-to localhost:3000/api/stripe/webhook
# copie o whsec_... exibido para STRIPE_WEBHOOK_SECRET no web/.env.local
```

## Scripts úteis

| Comando | O que faz |
|---|---|
| `cd studio && npm run seed` | Carrega/atualiza o conteúdo inicial (idempotente; usa `SANITY_TOKEN` do `.env` da raiz) |
| `cd web && npm run stripe:setup` | Cria/atualiza o produto e o preço anual (R$ 250) e o Portal do Cliente no Stripe |
| `cd web && npm run admin:grant -- email@x.com` | Dá papel de admin a um cadastro existente (`--revogar` retira) |
| `cd web && npm test` | Testes unitários (CPF/CNPJ, regras do webhook) |
| `cd web && EMAIL_DESATIVADO=1 npm run dev` + `npx playwright test` | Testes E2E com Supabase e Stripe de teste |
| `cd web && npm run email:dev` | Pré-visualização dos e-mails |

## Banco (Supabase)

Migrations em `supabase/migrations/`, já aplicadas no projeto `gcbeufdcjygmrogjyavw`.
Regras de acesso: cada pessoa lê e edita só os próprios dados (colunas limitadas); admin lê tudo;
a Vitrine pública expõe apenas colunas públicas de associados ativos com autorização;
atas ficam em bucket privado e são baixadas por URL assinada.

Antes de publicar, siga o [checklist de go-live](GO-LIVE.md).
