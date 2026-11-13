---
name: Associação Tocantinense de Startups
description: Tocantins luminoso — portal institucional claro, cartões brancos e o sol de Palmas nos CTAs
source: design/design.png (template de referência) + design/assets/
colors:
  azul: "#0B5BD3"
  azul-marca: "#0C4D9F"
  azul-noite: "#0E1E42"
  azul-claro: "#E8F1FD"
  azul-tinta: "#B9D1F5"
  laranja: "#F7870F"
  laranja-forte: "#E97A05"
  laranja-claro: "#FFF1DC"
  laranja-tinta: "#8A4A00"
  ipe: "#FEC446"
  ipe-claro: "#FFF6D6"
  ipe-tinta: "#6B4A00"
  verde: "#15803D"
  verde-claro: "#E6F6EC"
  roxo: "#6D28D9"
  roxo-claro: "#F1EAFE"
  papel: "#F5F8FD"
  prancha: "#FFFFFF"
  linha: "#E3E9F2"
  linha-forte: "#C3CDDC"
  tinta: "#1B2740"
  tinta-suave: "#475569"
  tinta-fraca: "#64748B"
  erro: "#B3261E"
  erro-claro: "#FDE8E6"
typography:
  display:
    fontFamily: "Ubuntu, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 2.6vw, 2.4rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  page-title:
    fontFamily: "Ubuntu, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.2rem, 4.8vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.06
  section-title:
    fontFamily: "Ubuntu, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.625rem"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "Ubuntu, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem–1.25rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Ubuntu, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.7
  ui:
    fontFamily: "Ubuntu, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 500
  rotulo:
    fontFamily: "Ubuntu, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    letterSpacing: "0.04em"
rounded:
  campo: "10px"
  botao: "10px"
  ficha: "16px"
  faixa: "28px"
  pilula: "999px"
spacing:
  secao-mobile: "56px"
  secao-desktop: "80px"
  gutter: "16px / 24px / 32px"
  container: "80rem"
components:
  button-primary:
    backgroundColor: "{colors.laranja}"
    textColor: "{colors.azul-noite}"
    rounded: "{rounded.botao}"
    height: "44px (md) · 52px (lg)"
  button-contorno:
    backgroundColor: "{colors.prancha}"
    textColor: "{colors.azul-noite}"
    border: "1px {colors.azul-tinta}"
    rounded: "{rounded.botao}"
  button-secondary:
    backgroundColor: "{colors.azul}"
    textColor: "{colors.prancha}"
    rounded: "{rounded.botao}"
  rotulo:
    backgroundColor: "{colors.azul-claro}"
    textColor: "{colors.azul}"
    rounded: "{rounded.pilula}"
  ficha:
    backgroundColor: "{colors.prancha}"
    rounded: "{rounded.ficha}"
    padding: "8px (com foto) · 16–20px"
  faixa:
    backgroundColor: "{colors.prancha}"
    rounded: "{rounded.faixa}"
---

# Design System: Associação Tocantinense de Startups

## Overview

**Tocantins luminoso.** O site é um portal institucional claro e acolhedor: fundo papel frio quase branco, cartões brancos de cantos generosos, azul de interface nos ícones e links, e o **laranja do pôr do sol de Palmas** nos CTAs. O gesto de marca é o **campo amarelo-ipê**, uma forma arredondada que entra pela borda esquerda das aberturas, e a **foto de Palmas** recortada em paralelogramo com um filete laranja.

A referência visual é `design/design.png` e os assets de exemplo ficam em `design/assets/` (pasta local, não versionada); as versões otimizadas usadas pelo site estão em `web/public/imagens/`. Quando houver dúvida, chegue o mais perto possível do template.

## Colors

- **Azul `#0B5BD3`**: interface (links, ícones de seção, item ativo do menu, botão secundário, carimbo de data). **Azul-marca `#0C4D9F`** é o azul do logo e do cartão "Associado". **Azul-noite `#0E1E42`** é a cor de todos os títulos e do rodapé.
- **Laranja `#F7870F`**: só para CTA (Associe-se, Quero me associar) e filetes decorativos. O texto sobre o laranja é **azul-noite**: branco sobre laranja não passa AA (2,5:1). Para texto laranja sobre fundo claro use **laranja-tinta `#8A4A00`**.
- **Ipê `#FEC446`**: campo decorativo da borda, rótulos de grupo no rodapé (sobre azul-noite) e o selo "Fundador" (ipê-claro com texto ipê-tinta).
- **Categorias** (selo cheio sobre a foto, sempre com texto): Notícia **roxo `#6D28D9`**, Edital **azul**, Benefício **verde `#15803D`**.
- **Neutros**: papel `#F5F8FD` (fundo), prancha `#FFFFFF` (cartões), linha `#E3E9F2`, tinta `#1B2740` (texto corrido), tinta-suave `#475569` (apoio), tinta-fraca `#64748B` (só rótulos).
- **Erro** `#B3261E` sobre erro-claro `#FDE8E6`.

### Named Rules

- **Um sol por tela**: um único CTA laranja dominante por dobra. O resto é contorno ou link.
- **Estado nunca só por cor**: selos e status sempre com texto.

## Typography

**Ubuntu** em tudo (400 texto, 500 interface, 700 títulos), servida por `next/font`. Sem itálico de estilo e sem pesos acima de 700.

- **Display** (título do hero): 2–2.4rem, 700, entrelinha 1.1, três linhas no desktop.
- **Título de página** (cabeçalho das internas): 2.2–3.5rem, 700.
- **Título de seção**: 1.5–1.625rem, 700, com ícone azul de traço à esquerda.
- **Título de cartão**: 1–1.25rem, 700.
- **Texto** (`.leitura`): 1.0625rem / 1.7, medida máx. 70ch.
- **Rótulo**: 0.75rem, 700, caixa-alta, tracking 0.04em, em pílula azul-clara acima do título de página (ex.: "ECOSSISTEMA DE INOVAÇÃO DO TOCANTINS").

## Layout

- Container de 80rem com gutter 16/24/32px; o cabeçalho usa 90rem.
- Seções com 56–80px de respiro, alternando papel e faixas brancas com régua fina.
- **Home** (ordem do template): hero (texto à esquerda, foto de Palmas sangrando à direita) → faixa Missão/Visão/Valores sobreposta ao fim do hero → Próximos eventos (carrossel) e Últimas notícias (3 cartões) lado a lado → Vitrine de Startups (4 cartões) → Nossos Mantenedores (título + faixa de logos) → Faça parte (modalidades).
- **Páginas internas**: cabeçalho com rótulo em pílula, título grande, introdução e o campo ipê na borda esquerda; conteúdo em cartões brancos.
- Mobile-first: no celular a foto do hero entra em fluxo abaixo do texto (com sombra laranja deslocada), a faixa Missão/Visão/Valores empilha e os cartões viram coluna única.

## Elevation & Depth

Cartões brancos flutuando sobre o papel com sombra fria e difusa.

- `ficha`: `0 1px 2px rgb(14 30 66 / .04), 0 10px 28px -14px rgb(14 30 66 / .14)` — repouso.
- `ficha-alta`: `0 2px 6px rgb(14 30 66 / .06), 0 22px 44px -18px rgb(14 30 66 / .24)` — hover e menus suspensos.
- `botao`: `0 6px 16px -6px rgb(233 122 5 / .55)` — brilho do CTA laranja.

## Shapes

- 10px em botões e campos; 16px em cartões; 28px em faixas (Missão/Visão/Valores, Mantenedores, cartões grandes); pílula em rótulos, selos e filtros.
- Fotos dentro de cartões com 12px de raio e 8px de respiro até a borda do cartão.
- Ornamentos permitidos: campo ipê arredondado na borda, filete laranja na foto do hero, contorno laranja arredondado no canto e a fileira de pontos dos estados vazios.

## Components

### Buttons

Retângulo de 10px de raio, Ubuntu 500, seta `→` à direita nas ações que levam adiante. **Primário** laranja com texto azul-noite e brilho laranja; **contorno** branco com borda azul-tinta (hover azul-claro); **secundário** azul com texto branco; **fantasma** só texto azul; **perigo** vermelho com texto branco, só para ações destrutivas. Alturas 36/44/52px. Foco: anel laranja de 3px com 3px de afastamento.

### Cabeçalho

Branco, fixo, logo à esquerda e links de texto na ordem do template: Home, Quem somos, Diretoria, Manifesto, Notícias, Eventos, Vitrine, Mantenedores e **Documentos ▾** (Estatuto e Regimento, Política de Privacidade). Item ativo em azul com barra azul de 3px embaixo. À direita: "Entrar" (ou o avatar da conta) e o botão primário "Associe-se →". Abaixo de 1280px, menu em folha cheia com itens de 52px.

### Cartões

- **Notícia**: foto 16:9 com selo da categoria no canto inferior esquerdo, título 700, data com ícone de calendário. Sem foto, usa a capa genérica da categoria (`/imagens/noticia-*.webp`).
- **Evento**: foto, carimbo de data (dia grande + mês) em azul-claro com borda azul-tinta, título, linha de período e linha de local com ícones, chevron à direita. Na Home vem num carrossel com pontos.
- **Startup (Vitrine)**: símbolo/logo 56px, nome, setor e cidade com ícones, selo "Fundador" em ipê.
- **Mantenedores**: logos numa faixa branca de 28px com botão "Ver todos".
- **Diretoria**: retrato 4:5 (sem foto, iniciais laranja sobre azul-marca com pontos), nome, cargo em azul, bio recolhida em "Ler bio". Todos do mesmo tamanho.

### Formulários e avisos

Campo branco, borda linha-forte, 48px, raio 10px; foco com borda azul e halo azul a 20%. Rótulo sempre visível em Ubuntu 500. Avisos com raio 12px no fundo claro do tom (info azul-claro, sucesso verde-claro, erro erro-claro, atenção laranja-claro).

### Estado vazio

Moldura tracejada branca com fileira de pontos, título 700 e convite com ação. Nunca conteúdo de exemplo.

### Ícones

Traço único arredondado em `currentColor` (azul nos títulos de seção). Os ícones de seção vêm de `design/assets/icons/` e estão em `web/src/components/ui` (`IconeFoguete`, `IconeOlho`, `IconeDiamante`, `IconeAgenda`, `IconeNoticias`, `IconeCamadas`, `IconeParceria`).

### E-mails

Mesmo mundo: cabeçalho branco com logo, filete laranja, Ubuntu (com fallback de sistema), botão laranja com texto azul-noite e raio 10px.

## Do's and Don'ts

### Do

- Mantenha o nome oficial completo no logo e no rodapé.
- Use a foto de Palmas no hero e capas reais quando a Diretoria publicar; as capas genéricas do template são só fallback.
- Use estados vazios honestos com convite.

### Don't

- Não use texto branco ou laranja sobre laranja/fundo claro (contraste).
- Não invente números, depoimentos, logos de mantenedores ou startups; os símbolos de startups do template (`design/assets/startup-*.svg`) são ilustrativos e não vão para o site.
- Não use gradientes roxos, glassmorphism, ilustrações 3D ou emojis como ícones.
- Não destaque um membro da Diretoria com cartão maior.
- Não use o botão de perigo fora de ações destrutivas.
