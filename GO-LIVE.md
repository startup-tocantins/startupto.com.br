# Checklist de go-live

Nada abaixo foi feito automaticamente: são ações que publicam o site, mexem em DNS ou ligam cobrança real.

## 1. Supabase — Authentication (painel do projeto `gcbeufdcjygmrogjyavw`)

- [ ] **Desligar cadastro público** — *Authentication → Sign In / Providers → Allow new users to sign up*: **off**. O site cria contas só pelo servidor; hoje a API aceita cadastros diretos.
- [ ] **URL Configuration** — Site URL `https://startupto.com.br`; Redirect URLs: `https://startupto.com.br/**` e `http://localhost:3000/**`.
- [ ] **SMTP próprio (Resend)** — *Authentication → Emails → SMTP Settings*: host `smtp.resend.com`, porta `465`, usuário `resend`, senha = chave do Resend, remetente `contato@startupto.com.br`. Sem isso o Supabase só envia link de acesso para membros da equipe do projeto e com limite baixo.
- [ ] **Templates** — colar `supabase/templates/link-de-acesso.html` (Magic Link) e `troca-de-email.html` (Change Email). Ver `supabase/templates/README.md`.

## 2. Resend

- [ ] Verificar o domínio `startupto.com.br` (registros DNS SPF/DKIM indicados pelo Resend).
- [ ] Criar a caixa `contato@startupto.com.br` (ou ajustar `EMAIL_FROM`). Respostas vão para `startuptocantins@gmail.com` (`EMAIL_REPLY_TO`).
- [ ] A chave atual é "somente envio" — está correta para produção.

## 3. Sanity

- [x] Studio publicado em **https://startupto.sanity.studio** (`studioHost` e `appId` fixados em `studio/sanity.cli.ts`).
- [ ] Convidar a Diretoria no projeto `megra9kk` (papel *Editor*).
- [x] CORS liberado para `http://localhost:3000`, `https://startupto.com.br`, `https://www.startupto.com.br` e `https://*.vercel.app` (previews). Dataset é público e sem credenciais, então o curinga não expõe nada a mais.

## 4. Vercel (Hobby)

- [x] Projeto **`startupto`** criado no time *StartupTocantins* (Hobby), com `web/vercel.json` fixando o framework Next.js. Preview funcionando, protegido pelo login da Vercel: https://startupto-4fkp95lia-startup-tocantins.vercel.app
- [x] Variáveis de **Preview** cadastradas (chaves de teste; `EMAIL_DESATIVADO=1` para o preview não enviar e-mails).
- [ ] Variáveis de **Production**: as de `web/.env.example`, com `NEXT_PUBLIC_SITE_URL=https://startupto.com.br` e o `STRIPE_WEBHOOK_SECRET` do endpoint de produção. **Não** definir `EMAIL_DESATIVADO`.
- [ ] Opcional: conectar um repositório GitHub **privado na conta pessoal** para deploy automático (o Hobby não faz deploy de repo de organização). Sem isso, publicar com `cd web && vercel deploy --prod`.
- [ ] Lembrete: a Diretoria aceitou o risco da cláusula de uso não comercial do plano Hobby.

## 5. Stripe

- [ ] Webhook de produção: endpoint `https://startupto.com.br/api/stripe/webhook`, eventos `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `invoice.upcoming`, `customer.subscription.updated`, `customer.subscription.deleted`. Copiar o segredo para `STRIPE_WEBHOOK_SECRET`.
- [ ] *Settings → Billing → Subscriptions and emails*: ativar o evento de "upcoming renewal" (é ele que dispara o lembrete de renovação) com antecedência de 7 a 30 dias.
- [ ] **Só com autorização da Diretoria:** trocar para as chaves de produção e rodar `STRIPE_ALLOW_LIVE=1 npm run stripe:setup` com a chave live.

## 6. DNS e lançamento

- [ ] Apontar `startupto.com.br` para a Vercel (registros indicados no painel da Vercel). O site antigo está no GitHub Pages (`startup-tocantins/startup-tocantins.github.io`) — desativar depois da troca.
- [ ] Depois do primeiro acesso de cada um, dar admin: `npm run admin:grant -- <email>` para Luana, Rai e Luiz.
- [ ] No `/admin → Configurações`, colar o link de convite do grupo "Startup Tocantins" no WhatsApp.
- [ ] No `/admin`, marcar os membros da Diretoria como **isentos** (Estatuto, art. 26) e os signatários da ata de 24/08/2024 como **Fundadores** (art. 12).

## 7. Revisões de conteúdo

- [ ] Política de Privacidade: revisão da Diretoria Jurídica (Gabriela) antes de publicar. A data de atualização é editável no Sanity.
- [ ] Cadastrar Mantenedores (logo, nome, link) no Sanity — enquanto não houver nenhum, a faixa da Home mostra um convite em vez de logos.
- [ ] Fotos que faltam na Diretoria: Karoline, Gabriela, Romualdo e Emerson (hoje aparecem as iniciais).
