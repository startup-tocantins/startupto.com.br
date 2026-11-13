# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Monorepo greenfield na raiz desta pasta:

- `studio/` — Sanity Studio **standalone** (não embutido no Next). Projeto `megra9kk`, dataset `production`. Todo o conteúdo editorial.
- `web/` — Next.js (App Router, TypeScript, Tailwind, `src/`, alias `@/*`).
- **Supabase** — autenticação (e-mail e senha; link por e-mail para primeiro acesso e "esqueci a senha"), Postgres dos associados com RLS, Storage para logos da Vitrine e documentos restritos.
- **Stripe** — assinatura anual do Associado, **somente cartão de crédito**.
- **Resend** — e-mails transacionais e SMTP do Supabase Auth, enviando de `@startupto.com.br`.
- **Vercel Hobby** — hospedagem do `web/`, repositório GitHub **privado em conta pessoal** (o plano Hobby não faz deploy de repo de organização). A Diretoria aceitou conscientemente o risco da cláusula de uso não comercial do Hobby.
- Studio publicado com `sanity deploy`.
- Domínio `startupto.com.br` (hoje aponta para um site antigo no GitHub Pages, que será substituído).

## Users

1. **Empreendedores e startups do Tocantins** — querem saber o que a Associação faz, ver eventos/editais e se associar. Muitos acessam pelo celular, vindos de link no WhatsApp/Instagram.
2. **Associados** — entram para editar seu card na Vitrine, ver a situação da anuidade, gerenciar pagamento e acessar atas.
3. **Ecossistema externo** (governo, universidades, investidores, imprensa, potenciais mantenedores) — avaliam a credibilidade da Associação e procuram startups na Vitrine.
4. **Diretoria** (pessoas majoritariamente não técnicas) — publicam conteúdo no Sanity Studio e gerem associados no `/admin`.

## Product Purpose

Site institucional e plataforma de associação da **Associação Tocantinense de Startups** (CNPJ 57.921.002/0001-30, Palmas – TO), organização sem fins lucrativos que representa, conecta e fortalece startups do Tocantins.

O site precisa: comunicar quem é a Associação e quem a dirige; publicar notícias, editais, benefícios e eventos; mostrar as startups associadas (Vitrine) e os Mantenedores; e operar o ciclo de associação de ponta a ponta (cadastro → pagamento recorrente → gestão).

Sucesso = novos cadastros na Comunidade, conversão Comunidade → Associado, anuidades em dia, e Diretoria publicando conteúdo sem depender de desenvolvedor.

## Positioning

É a entidade formal e representativa das startups tocantinenses — com CNPJ, Estatuto, Regimento, Assembleia, voto e Diretoria regional (Metropolitana, Centro, Sul, Norte). A Vitrine é o retrato público do ecossistema do estado. Herdeira da comunidade Startup Tocantins, ativa desde 2014.

## Operating Context

- **Modalidades** (Regimento, art. 7º):
  - **Comunidade** — gratuita. Cadastro simples, sem aprovação. Entra no grupo de WhatsApp "Startup Tocantins" e participa de eventos gratuitos. Sem direito a voto.
  - **Associado** — pago (anuidade de **R$ 250/ano**, confirmada; o preço exibido vem do Stripe, nunca fixo no código). Grupo de Associados, Assembleias, voto, benefícios, card na Vitrine.
  - **Mantenedor** — taxa anual paga fora do site. **Cadastrado manualmente no Sanity** (nome, logo, link). Sem formulário, sem Stripe, sem login. Integra o Conselho Consultivo.
- **Fluxo de adesão do Associado**: formulário → Stripe Checkout na sequência (sem aprovação prévia) → assinatura anual ativa assim que o pagamento é confirmado. Quem não concluir o pagamento recebe por e-mail o link para a página logada de pagamento. Decisão de 13/11/2026: o site deixou de exigir a aprovação prévia da Diretoria. O Regimento Interno (art. 6º, II) ainda prevê essa aprovação e a declaração de adesão (`termos.md`) ainda a menciona; ajustar o Regimento ou tratar a aprovação como homologação posterior no `/admin` é decisão da Diretoria.
- **Categorias** (Estatuto, art. 12): **Fundador** (signatários da ata de fundação de 24/08/2024) ou **Titular** (admitidos depois). Mesmos direitos. Definida só pelo admin; padrão Titular. Fundadores ganham selo na Vitrine.
- **Isenção** (Estatuto, art. 26): membros da Diretoria são isentos da anuidade. O admin marca o associado como isento, com motivo obrigatório; ele fica `ativo` sem assinatura no Stripe. A isenção pode ser revogada (ex.: fim de mandato), voltando a exigir pagamento.
- **Inadimplência** (art. 9º-A): falha/atraso de pagamento marca o associado como `inadimplente` e alerta a Diretoria. O sistema **não exclui automaticamente** — a exclusão exige notificação e prazo de defesa de 10 dias, decididos pela Diretoria.
- **Benefícios** são publicados como posts (categoria Benefício) e são **públicos**.
- **Comunicação oficial** (art. 25–27): site, e-mail, redes. Dados de associados tratados conforme LGPD.

## Capabilities and Constraints

**Páginas públicas**

- **Home**, nesta ordem (template `design/design.png`, ver `DESIGN.md`): hero (chamada + 1º parágrafo da introdução, CTAs "Associe-se agora" e "Conheça a Associação", mapa de pontos dos 139 municípios do Tocantins) → faixa Missão/Visão/Valores → próximos eventos (carrossel) e últimas notícias/editais/benefícios lado a lado → prévia da Vitrine → faixa de Mantenedores → comparativo de modalidades com CTA "Associe-se" → rodapé.
- **Quem somos**: bloco "Quem Somos", missão curta em destaque + missão longa, Visão, Valores. **Sem linha do tempo e sem "Áreas de atuação".**
- **Diretoria**: 11 membros, Presidente primeiro, ordem do `sobre.md`. Foto (ou placeholder com iniciais), nome, cargo, mini bio **recolhida** (expandir/recolher acessível).
- **Manifesto**: página própria com o texto de `manifesto.md` (versão aprovada), editável no Sanity.
- **Notícias**: posts com categorias Notícia, Edital, Benefício; listagem com filtro por categoria e página de detalhe.
- **Eventos**: tipo próprio (título, data/hora início e fim, local ou online, link de inscrição, capa, descrição); listas "Próximos" e "Passados"; botão "Adicionar à agenda" (.ics).
- **Vitrine**: pública; somente Associados com status `ativo` **e** opt-in. Card: logo, nome da startup, setor, estágio, cidade, site e selo **"Fundador"** quando aplicável. Filtros por setor, estágio e cidade. **Mantenedores não entram na Vitrine.**
- **Mantenedores**: seção/página própria + faixa na Home, a partir do Sanity.
- **Documentos**: Estatuto e Regimento públicos (PDF no Sanity).
- **Política de Privacidade**: texto de `privacidade.md`, editável no Sanity.
- **Associe-se**: comparativo das modalidades + formulários.

**Formulários**

- **Comunidade**: nome, e-mail, WhatsApp, cidade, aceite da Política de Privacidade.
- **Associado** (PF ou PJ, mesmos campos): nome, e-mail, WhatsApp, cidade, **CPF ou CNPJ** (com validação de dígitos), nome da startup, setor, estágio, site, logo, aceite do Estatuto e Regimento, aceite da Política de Privacidade, opt-in para aparecer na Vitrine.
- Quem já é Comunidade faz upgrade para Associado pela área logada, completando os campos.

**Área do associado (logada)**: perfil editável; card da Vitrine com preview; situação (modalidade, status, vencimento); "Gerenciar pagamento" (Stripe Customer Portal); documentos restritos (atas de Assembleia); upgrade Comunidade → Associado; solicitação de exclusão de dados (LGPD).

**Admin (`/admin`)**: papel `admin` no Supabase (inicialmente Luana, Rai e Luiz). Lista de associados com busca e filtros (modalidade, status, setor, cidade); detalhe; definir categoria (Fundador/Titular); marcar/revogar isenção; situação de pagamento; exportar CSV e XLSX; upload de atas; edição do link do grupo de WhatsApp. Conteúdo editorial é editado no Sanity Studio por quem a Diretoria convidar.

**Listas controladas (Sanity)**

- **Cidade**: os 139 municípios do Tocantins (fonte IBGE).
- **Estágio**: Ideação, Validação, Operação, Tração, Escala.
- **Setor**: Agro / AgTech; FoodTech; Fintech; InsurTech; HealthTech; EdTech; GovTech; LegalTech; Construtech; PropTech; CleanTech / Energia; ClimateTech / Ambiental; Mineração; Logística / Mobilidade; Varejo / E-commerce; Turismo / Hospitalidade; MarTech / Comunicação; HR Tech; SaaS / B2B; IA / Dados; Cibersegurança; IoT / Hardware; Indústria 4.0; Economia Criativa / Games; Impacto Social; Serviços Profissionais; Outro.

**Restrições**

- Dados pessoais (CPF/CNPJ, e-mail, WhatsApp, pagamento, consentimentos) **nunca** no Sanity — só no Supabase.
- Nada privado no Sanity: o dataset é legível publicamente. Link do grupo de WhatsApp e atas ficam no Supabase.
- Stripe em modo de teste até autorização explícita da Diretoria.
- Analytics: Vercel Analytics (sem cookies, sem banner).
- Idioma: português do Brasil.

## Brand Commitments

- **Nome oficial em tudo**: "Associação Tocantinense de Startups". "Startup Tocantins" só aparece como nome do grupo da Comunidade e no parêntese já presente nos textos do `sobre.md`. Variações nas bios ("Associação Startup Tocantins", "Associação de Startups do Tocantins") devem ser normalizadas para o nome oficial.
- Logo: `logo.pdf` (azul `#0C4D9F`, laranja `#FB9A17`, mapa do Tocantins formado por pontos).
- Princípios declarados (Regimento, art. 3º): inovação, colaboração, ética, transparência, sustentabilidade, diversidade e inclusão.
- Voz: próxima, confiante, regional, institucional sem ser burocrática. Fala com o empreendedor do interior tanto quanto com o secretário de Estado.

## Evidence on Hand

- `sobre.md` — Visão, duas Missões (a curta, entre aspas, é a frase de destaque; a longa vai no corpo), Valores, texto de introdução (1º bloco → introdução da Home), bloco "Quem Somos" (→ página Quem somos) e **lista oficial de nomes e cargos da Diretoria** (fonte de verdade para nomes e cargos).
- `diretoria/minibios.md` — mini bios dos 11 membros (texto das bios; nomes e cargos seguem o `sobre.md`).
- `diretoria/*.{jpeg,jpg,PNG}` — fotos de Luana, Rai, Lecticia, Thatyana, Kamylla, Gleyciane e Luiz. **Sem foto**: Karoline, Gabriela, Romualdo, Emerson → placeholder com iniciais.
- `documentos/Regimento Interno - Final (29-10-2026)-2.docx` — Regimento aprovado em 02/11/2026.
- `documentos/estatuto.pdf` — Estatuto Social (15 páginas).
- `manifesto.md` — Manifesto aprovado.
- `privacidade.md` — Política de Privacidade (LGPD).
- `emails.md` — textos de todos os e-mails (auth, associado, alertas da Diretoria).
- `logo.pdf` — logo vetorial.
- `design/` — template visual de referência (`design.png`) e assets de exemplo, base do `DESIGN.md`. **Pasta local, fora do git** (`.gitignore`); o que o site usa já está em `web/public/imagens/` e nos ícones de `web/src/components/ui`.
- `sanity.md` — instruções de setup do Sanity.
- Contatos atuais: `startuptocantins@gmail.com`, WhatsApp (63) 99235-3262, Instagram `@startuptocantins_`.

**Ausências — não inventar**: depoimentos, números de impacto, lista de associados, logos de Mantenedores, fotos de eventos, atas, LinkedIn institucional. Use estados vazios honestos ou placeholders marcados.

## Product Principles

1. **Credibilidade primeiro** — nome oficial, CNPJ, Diretoria com rosto e documentos públicos; nada inventado.
2. **A Diretoria opera sozinha** — todo conteúdo e toda aprovação sem desenvolvedor.
3. **Associar-se é a ação principal** — todo caminho leva a "Associe-se", com o valor da modalidade visível.
4. **O Tocantins inteiro** — cidades do interior têm o mesmo peso que Palmas, na Vitrine e na linguagem.
5. **Dados pessoais são do associado** — mínimo necessário, consentimento explícito, LGPD.

## Accessibility & Inclusion

WCAG 2.2 AA. Público amplo, muitos no celular e em conexões lentas do interior: páginas leves, imagens otimizadas, alvos de toque ≥ 44px, formulários com mensagens de erro claras em português, sem depender de cor para transmitir estado.
