# Checklist de go-live

Nada abaixo foi feito automaticamente: são ações que publicam o site, mexem em DNS ou ligam cobrança real.

## 1. Supabase — Authentication (painel do projeto `gcbeufdcjygmrogjyavw`)

- [x] **Cadastro público bloqueado** (08/11/2026) — trigger em `auth.users` (migration `20261108090000_bloquear_cadastro_publico.sql`): só o servidor do site, com `SUPABASE_CHAVE_CADASTRO`, cria contas. Verificado: `signup` e OTP com criação de usuário pela API pública são recusados; cadastro pelo site funciona em produção.
- [x] **URLs e templates do Auth** (12/11/2026) — `disable_signup` também ligado no painel, Site URL `https://startupto.com.br`, Redirect URLs e template "Seu link de acesso" aplicados via `node supabase/configurar-auth.mjs`.
- [x] **SMTP próprio (Resend)** (12/11/2026) — `smtp.resend.com`, remetente `contato@startupto.com.br`.

## 2. Resend

- [x] Domínio `startupto.com.br` verificado no Resend (12/11/2026; envio de teste de `contato@startupto.com.br` aceito).
- [x] Remetente `contato@startupto.com.br` (confirmado pela Diretoria). Respostas vão para `startuptocantins@gmail.com` (`EMAIL_REPLY_TO`).
- [x] A chave atual é "somente envio" — está correta para produção.

## 3. Sanity

- [x] Studio publicado em **https://startupto.sanity.studio** (`studioHost` e `appId` fixados em `studio/sanity.cli.ts`).
- [ ] Convidar a Diretoria no projeto `megra9kk` (papel *Editor*).
- [x] CORS liberado para `http://localhost:3000`, `https://startupto.com.br`, `https://www.startupto.com.br` e `https://*.vercel.app` (previews). Dataset é público e sem credenciais, então o curinga não expõe nada a mais.

## 4. Vercel (Hobby)

- [x] Projeto **`startupto`** criado no time *StartupTocantins* (Hobby), com `web/vercel.json` fixando o framework Next.js. Preview funcionando, protegido pelo login da Vercel: https://startupto-4fkp95lia-startup-tocantins.vercel.app
- [x] Variáveis de **Preview** cadastradas (chaves de teste; `EMAIL_DESATIVADO=1` para o preview não enviar e-mails).
- [x] **Produção no ar em https://startupto.vercel.app** (autorizado em 08/11/2026), com chaves de **teste** do Stripe e `EMAIL_DESATIVADO=1` até o Resend ser verificado.
- [ ] Em Production: definir `NEXT_PUBLIC_SITE_URL=https://startupto.com.br`, **remover** `EMAIL_DESATIVADO` e refazer o deploy (`vercel deploy --prod` logado na conta dona do time).
- [ ] Opcional: conectar um repositório GitHub **privado na conta pessoal** para deploy automático (o Hobby não faz deploy de repo de organização). Sem isso, publicar com `cd web && vercel deploy --prod`.
- [ ] Lembrete: a Diretoria aceitou o risco da cláusula de uso não comercial do plano Hobby.

## 5. Stripe

- [x] Webhook (modo de teste) criado para `https://startupto.vercel.app/api/stripe/webhook`, com segredo em `STRIPE_WEBHOOK_SECRET` na Vercel. Ao ligar o modo real, criar o mesmo endpoint na conta live: eventos `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `invoice.upcoming`, `customer.subscription.updated`, `customer.subscription.deleted`. Copiar o segredo para `STRIPE_WEBHOOK_SECRET`.
- [ ] *Settings → Billing → Subscriptions and emails*: ativar o evento de "upcoming renewal" (é ele que dispara o lembrete de renovação) com antecedência de 7 a 30 dias.
- [ ] **Só com autorização da Diretoria:** trocar para as chaves de produção e rodar `STRIPE_ALLOW_LIVE=1 npm run stripe:setup` com a chave live.

## 6. DNS e lançamento

- [x] `startupto.com.br` aponta para a Vercel e já serve o site novo (12/11/2026). **Falta `www.startupto.com.br`**: adicionar no projeto (Settings → Domains), redirecionando para o domínio principal — hoje o certificado só cobre o domínio sem www. O site antigo está no GitHub Pages (`startup-tocantins/startup-tocantins.github.io`) — desativar depois da troca.
- [ ] Depois do primeiro acesso de cada um, dar admin: `npm run admin:grant -- <email>` para Luana, Rai e Luiz.
- [ ] No `/admin → Configurações`, colar o link de convite do grupo "Startup Tocantins" no WhatsApp.
- [ ] No `/admin`, marcar os membros da Diretoria como **isentos** (Estatuto, art. 26) e os signatários da ata de 24/08/2024 como **Fundadores** (art. 12).

## 7. Revisões de conteúdo

- [x] Política de Privacidade: revisão jurídica confirmada pela Diretoria (08/11/2026). A data de atualização é editável no Sanity.
- [ ] Cadastrar Mantenedores (logo, nome, link) no Sanity — enquanto não houver nenhum, a faixa da Home mostra um convite em vez de logos.
- [ ] Fotos que faltam na Diretoria: Karoline, Gabriela, Romualdo e Emerson (hoje aparecem as iniciais).
