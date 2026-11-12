# Prompt — Site da Associação Tocantinense de Startups

> Cole este prompt no Claude Code, aberto na raiz desta pasta (`startupto/`).

---

Você vai construir o site institucional e a plataforma de associação da **Associação Tocantinense de Startups**. Tudo que foi decidido está em arquivos nesta pasta — leia-os **antes de qualquer ação** e trate-os como fonte de verdade:

- `PRODUCT.md` — produto, usuários, regras de negócio, páginas, formulários, listas, restrições.
- `DESIGN.md` — restrições de marca e direção visual.
- `sanity.md` — instruções de setup do Sanity (onde ele diz "pasta `startuptocantins`", entenda **esta pasta**, `startupto/`).
- `sobre.md` — textos institucionais e **lista oficial de nomes e cargos** da Diretoria.
- `manifesto.md` — Manifesto aprovado.
- `privacidade.md` — Política de Privacidade.
- `emails.md` — textos de todos os e-mails.
- `diretoria/minibios.md` e `diretoria/*` — bios e fotos.
- `documentos/Regimento Interno - Final (29-10-2026)-2.docx` e `documentos/estatuto.pdf` — regras de associação.
- `logo.pdf` — logo vetorial.

Se algo neste prompt conflitar com `PRODUCT.md`, siga o `PRODUCT.md` e me avise.

## Regras gerais

1. **Não invente conteúdo.** Manifesto, Política de Privacidade e e-mails já estão escritos: use os textos dos arquivos sem reescrever. Microcopy de interface que você precisar criar segue a voz do `PRODUCT.md`. Valores não confirmados: `[CONFIRMAR]`. Nada de depoimentos, números, startups ou parceiros fictícios — use estados vazios honestos.
2. **Nome oficial em tudo**: "Associação Tocantinense de Startups". Normalize as variações das bios.
3. **Dados pessoais só no Supabase.** O dataset do Sanity é público: nada privado nele (nem link de grupo, nem atas).
4. **Segredos** só em arquivos `.env*` fora do git e nas variáveis da Vercel. Já existe um `.env` na raiz com `SANITY_TOKEN` (use-o no seed; nunca o exiba nem o commite). Mantenha `.env.example` atualizado em `web/` e `studio/`.
5. **Stripe em modo de teste** até eu autorizar produção.
6. Todo texto da interface em **português do Brasil**. Código, nomes de tabelas e schemas podem ficar em português sem acento ou inglês — escolha um padrão e mantenha.
7. Quando precisar de uma chave/credencial ou de uma ação minha (criar conta, configurar DNS, convidar usuário), **pare e me peça**, dizendo exatamente o que fazer.
8. **Não altere o DNS de `startupto.com.br`** nem publique em produção sem minha confirmação.
9. Ao fim de cada etapa: rode lint, typecheck e build; faça um commit; me dê um resumo curto. Nas etapas marcadas **⏸ CHECKPOINT**, pare e espere minha aprovação.

## Skills

- **`sanity-best-practices`** — para todo o Sanity (setup, schemas, GROQ, integração com Next, revalidação). Se não estiver instalada: `npx skills add sanity-io/agent-toolkit --skill sanity-best-practices -y`; se falhar, pare e me peça.
- **`impeccable`** — para toda decisão visual e toda tela. Comece por `impeccable context`; use `new-work` para o mundo visual, `audit`/`polish`/`harden` no fim. Ao fechar o design, atualize o `DESIGN.md` com `impeccable document`.

## Etapa 0 — Preparação

- Leia todos os arquivos listados acima.
- Confirme que você está na raiz `startupto/`.
- `git init`. Já existe um `.gitignore` na raiz (com `.env`): **complete-o** sem apagar o que há (node_modules, .env*, .next, dist, .sanity, .vercel). `README.md` com visão geral e como rodar.

## Etapa 1 — Scaffold do monorepo

Rode exatamente:

```bash
npm create sanity@latest -- --project hy28b6oa --dataset production --template clean --typescript --output-path studio
npx create-next-app@latest web --tailwind --ts --app --src-dir --eslint --import-alias "@/*"
```

Estrutura final:

```
startupto/
├── studio/   # Sanity Studio (standalone)
├── web/      # Next.js app
├── PRODUCT.md · DESIGN.md · PROMPT.md · sanity.md · sobre.md
└── diretoria/ · documentos/ · logo.pdf
```

Converta `logo.pdf` em SVG otimizado (ex.: `pdftocairo -svg` + SVGO) para `web/public/` e gere favicon/ícones a partir do mapa do logo.

## Etapa 2 — Sanity (conteúdo)

Siga o `sanity.md` e a skill `sanity-best-practices`. Studio standalone, em pt-BR, com estrutura de menu amigável para a Diretoria (nada de jargão técnico).

**Schemas** (nomes indicativos):

| Tipo | Campos principais |
|---|---|
| `configuracoesSite` (singleton) | textos da Home (hero, introdução), missão curta, missão longa, visão, e-mail, WhatsApp, Instagram, LinkedIn (opcional), nome oficial, CNPJ, cidade |
| `paginaInstitucional` | slug (quem-somos, manifesto, privacidade), título, corpo (Portable Text), SEO |
| `valor` | título, descrição, ordem |
| `membroDiretoria` | nome, cargo, foto (opcional), bio, LinkedIn (opcional), ordem |
| `post` | título, slug, categoria (Notícia, Edital, Benefício), capa, resumo, corpo, data de publicação, SEO |
| `evento` | título, slug, início, fim, local / online, link de inscrição, capa, descrição |
| `mantenedor` | nome, logo, link, ordem, ativo |
| `documentoPublico` | título, arquivo PDF, descrição, ordem (Estatuto, Regimento) |
| `setor`, `estagio`, `cidade` | título, slug, ordem (cidade com código IBGE) |

Configure **revalidação sob demanda**: webhook do Sanity → rota protegida no Next que revalida as tags afetadas.

## Etapa 3 — Seed de conteúdo

Script idempotente em `studio/scripts/seed.ts` (ou equivalente) que importa:

- Textos do `sobre.md`: missão curta (a frase entre aspas) e longa, visão, valores, introdução (1º bloco → Home), "Quem Somos" (→ página).
- **Diretoria**: os 11 membros **na ordem e com os nomes/cargos do `sobre.md`**; bios do `minibios.md` (normalizando o nome da associação); fotos de `diretoria/` (Rai, Lecticia, Thatyana, Kamylla, Gleyciane, Luiz). Os demais ficam sem foto (o front mostra placeholder com iniciais).
- **Manifesto**: importe `manifesto.md` **tal como está** (texto aprovado, sem `[REVISAR]`), preservando negritos e parágrafos em Portable Text.
- **Política de Privacidade**: importe `privacidade.md` tal como está; `{{data_publicacao}}` vira um campo de data no Sanity. Se a implementação divergir do que a política descreve (dados coletados, fornecedores, cookies, prazos), **me avise** em vez de mudar o texto por conta própria.
- **Listas**: 139 municípios do TO via API do IBGE (`https://servicodados.ibge.gov.br/api/v1/localidades/estados/17/municipios`); estágios e setores exatamente como no `PRODUCT.md`.
- Configurações do site com os contatos do `PRODUCT.md`.
- Documentos públicos: `documentos/estatuto.pdf` (Estatuto Social) e o Regimento (converta o `.docx` em PDF), cadastrados como `documentoPublico`.

Não crie posts, eventos ou mantenedores fictícios.

## Etapa 4 — Design ⏸ CHECKPOINT

Com a skill **impeccable**: rode `impeccable context`, depois `new-work` para definir o mundo visual seguindo o `DESIGN.md` (vibrante e regional, azul `#0C4D9F` + laranja `#FB9A17`, mapa em pontos como assinatura). Defina tipografia, escala, neutros, espaçamento, formas e tokens no Tailwind.

Entregue para aprovação: **Home** completa e **Diretoria**, com conteúdo real do seed, em desktop e mobile (screenshots). Depois de aprovado, registre o sistema no `DESIGN.md` com `impeccable document`.

## Etapa 5 — Páginas públicas ⏸ CHECKPOINT

Implemente todas as páginas públicas descritas no `PRODUCT.md` (Home na ordem definida, Quem somos, Diretoria, Manifesto, Notícias com filtro por categoria + detalhe, Eventos próximos/passados + detalhe + `.ics`, Vitrine, Mantenedores, Documentos, Política de Privacidade, Associe-se).

- Vitrine e prévia da Vitrine leem do Supabase (etapa 6); até lá, mostre o estado vazio.
- Preço do Associado no comparativo lido do Stripe (etapa 8); até lá, placeholder.
- Diretoria: bio recolhida com controle acessível (`aria-expanded`, teclado).
- SEO: metadata por página, Open Graph (imagem gerada com a marca), `sitemap.xml`, `robots.txt`, JSON-LD `Organization` com nome oficial e CNPJ.
- `@vercel/analytics`.

## Etapa 6 — Supabase (auth e dados)

Peça-me as chaves do projeto Supabase. Use migrations versionadas (`supabase/migrations`).

- **Auth**: e-mail e senha (mín. 8 caracteres), criada no cadastro; link mágico só para primeiro acesso e "esqueci a senha" (leva a `/associado/senha`); SMTP customizado via Resend (remetente `contato@startupto.com.br`). Templates A1 e A2 do `emails.md`.
- **Tabela `perfis`** (1:1 com `auth.users`): nome, e-mail, WhatsApp, cidade (slug), tipo de documento (CPF/CNPJ), documento, nome da startup, setor (slug), estágio (slug), site, caminho do logo, modalidade (`comunidade` | `associado`), categoria (`fundador` | `titular`, padrão `titular`, alterável só por admin), isento (booleano) + motivo da isenção, status (`comunidade` | `pendente_aprovacao` | `aguardando_pagamento` | `ativo` | `inadimplente` | `recusado` | `cancelado`), opt-in Vitrine, data de aceite do Estatuto/Regimento, data de aceite da Privacidade, IDs do Stripe (customer, subscription), vencimento, papel (`membro` | `admin`), timestamps.
- **Tabela `historico_associado`**: mudanças de status, quem fez, quando, observação (auditoria).
- **Tabela `configuracoes_privadas`**: link do grupo de WhatsApp da Comunidade (editável no `/admin`).
- **View pública `vitrine`**: só campos públicos (incluindo categoria, para o selo "Fundador") de perfis com `status = 'ativo'` e opt-in.
- **RLS** em tudo: o usuário lê/edita só o próprio perfil (sem poder alterar status, papel, categoria, isenção nem IDs do Stripe); admin lê e altera todos; a view da Vitrine é pública.
- **Storage**: bucket público `logos` (com limite de tamanho e tipos de imagem) e bucket **privado** `atas` (acesso por URL assinada só para associados `ativo` e admins).
- Script `npm run admin:grant -- <email>` para dar papel de admin (vou usar para Luana, Rai e Luiz).

## Etapa 7 — Associe-se e área do associado

- **Comunidade**: formulário simples (nome, e-mail, WhatsApp, cidade, aceite da Privacidade) → cria conta → e-mail de boas-vindas com o link do grupo de WhatsApp (de `configuracoes_privadas`). Sem aprovação.
- **Associado**: formulário completo (PF ou PJ, mesmos campos; CPF **ou** CNPJ com validação de dígitos; upload de logo; aceites; opt-in Vitrine) → status `pendente_aprovacao` → e-mail de confirmação de recebimento → aviso à Diretoria.
- **Upgrade** Comunidade → Associado pela área logada.
- **Área do associado** (`/associado`): perfil; card da Vitrine com preview ao vivo; situação (modalidade, status, vencimento) com rótulos claros; botão de pagamento quando `aguardando_pagamento`; "Gerenciar pagamento" (Stripe Customer Portal) quando houver assinatura; atas (só `ativo`); solicitação de exclusão de dados (registra o pedido e avisa a Diretoria).
- Validação no cliente **e** no servidor (Server Actions + Zod). Mensagens de erro em português, claras.

## Etapa 8 — Stripe ⏸ CHECKPOINT

Peça-me as chaves de teste.

- Produto "Associado" com **preço anual recorrente de R$ 250** (confirmado). O site **lê o preço do Stripe** (com cache) — nunca fixo no código.
- Aprovado no `/admin` → status `aguardando_pagamento` → e-mail com link para `/associado/pagamento` (exige login) → cria **Checkout Session em modo assinatura**, **somente cartão de crédito** (sem boleto, sem Pix).
- **Webhook** (rota com verificação de assinatura, idempotente): `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `invoice.upcoming`, `customer.subscription.updated`, `customer.subscription.deleted` → atualizam status/vencimento em `perfis` e gravam `historico_associado`.
  - `invoice.paid` → `ativo` + novo vencimento.
  - `invoice.payment_failed` / atraso → `inadimplente` + e-mail ao associado + alerta à Diretoria. **Nunca excluir automaticamente** (Regimento, art. 9º-A).
  - `invoice.upcoming` → lembrete de renovação por e-mail.
- **Customer Portal** configurado (trocar cartão, ver faturas, cancelar).
- Teste o ciclo completo com Stripe CLI e me mostre.

## Etapa 9 — Admin (`/admin`)

Só para papel `admin` (proteção no middleware **e** no servidor).

- Lista de associados com busca e filtros (modalidade, status, setor, cidade), ordenação e paginação.
- Detalhe do associado com histórico.
- **Aprovar / Recusar** (com motivo opcional) → e-mail automático.
- **Categoria** Fundador/Titular (Estatuto, art. 12).
- **Marcar como isento** (Estatuto, art. 26 — Diretoria): motivo obrigatório → status `ativo` sem assinatura no Stripe, registrado no histórico. **Revogar isenção** → status `aguardando_pagamento` + e-mail com link de pagamento. Isentos não são afetados pelos webhooks de inadimplência.
- Situação de pagamento e link para o cliente no Stripe.
- **Exportar CSV e XLSX** (respeitando os filtros aplicados).
- Upload/gestão de **atas** (bucket privado).
- Edição do link do grupo de WhatsApp.
- Interface sóbria e eficiente — é ferramenta de trabalho para pessoas não técnicas.

## Etapa 10 — E-mails

React Email + Resend, com a identidade visual, remetente `contato@startupto.com.br`. Implemente **todos** os e-mails do `emails.md` (seções B e C; A já está no Supabase Auth) com os textos, assuntos, pré-visualizações, gatilhos e variáveis exatamente como lá. Rodapé padrão em todos. Se algum gatilho do `emails.md` não existir no fluxo implementado (ou vice-versa), me avise.

## Etapa 11 — Qualidade

- Com a **impeccable**: `audit` em todas as telas, depois `harden` (estados vazios, erros, carregamento, textos longos, imagens ausentes) e `polish`.
- WCAG 2.2 AA (contraste — lembre que o laranja não serve para texto pequeno em fundo claro —, foco visível, navegação por teclado, labels, alvos ≥ 44px).
- Performance: Lighthouse mobile ≥ 90 em Home, Vitrine e Diretoria; imagens via `next/image` e CDN do Sanity.
- Testes: unitários para validação de CPF/CNPJ e para o handler do webhook do Stripe; e2e (Playwright) para cadastro Comunidade, pedido de associação, aprovação e pagamento em modo teste.

## Etapa 12 — Deploy ⏸ CHECKPOINT

- Repositório GitHub **privado na minha conta pessoal** (o Hobby não faz deploy de repo de organização).
- Vercel **Hobby**: projeto apontando para `web/` (root directory), variáveis de ambiente configuradas.
- `sanity deploy` para publicar o Studio; configure CORS do Sanity para o domínio do site e do Studio.
- Webhooks de produção (Sanity → revalidação; Stripe → `/api/stripe/webhook`).
- Domínio do Resend verificado (registros DNS).
- Me entregue um **checklist de go-live**: registros DNS para apontar `startupto.com.br` para a Vercel (o site antigo está no GitHub Pages), troca do Stripe para produção, convite da Diretoria no Sanity, `admin:grant` para Luana, Rai e Luiz, a recomendação de revisão da Política de Privacidade pela Diretoria Jurídica antes de publicar, e a lista de todos os `[CONFIRMAR]` e `[PENDENTE]` restantes.

Comece pela Etapa 0.

---

associado ao se associar deve aceitar os termos. termos.md