---
name: Associação Tocantinense de Startups
description: Guia de campo do cerrado tocantinense — o ecossistema de startups como ecossistema vivo
colors:
  azul-tocantins: "#0C4D9F"
  azul-fundo: "#0A3F84"
  azul-noite: "#08264D"
  azul-claro: "#E6EEF8"
  laranja-sol: "#FB9A17"
  laranja-claro: "#FFF1DC"
  laranja-tinta: "#8A4A00"
  buriti: "#1F6B4A"
  buriti-claro: "#E3F0E8"
  papel: "#F3F6FA"
  prancha: "#FFFFFF"
  linha: "#D9DDE4"
  linha-forte: "#B7BFCC"
  tinta: "#14213A"
  tinta-suave: "#44516A"
  tinta-fraca: "#6A7489"
  erro: "#B3261E"
typography:
  display:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 6.4vw, 5.25rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 3.8vw, 3rem)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "Alegreya, ui-serif, Georgia, serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    letterSpacing: "0.08em"
rounded:
  etiqueta: "4px"
  ficha: "6px"
  botao: "999px"
spacing:
  prancha-mobile: "64px"
  prancha-desktop: "96px"
  gutter: "16px"
components:
  button-primary:
    backgroundColor: "{colors.laranja-sol}"
    textColor: "{colors.azul-noite}"
    rounded: "{rounded.botao}"
    padding: "0 20px"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.azul-tocantins}"
    textColor: "{colors.prancha}"
    rounded: "{rounded.botao}"
    padding: "0 20px"
    height: "44px"
  input:
    backgroundColor: "{colors.prancha}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.etiqueta}"
    padding: "10px 14px"
    height: "48px"
  ficha:
    backgroundColor: "{colors.prancha}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.ficha}"
    padding: "16px"
  aba-indice:
    backgroundColor: "{colors.azul-tocantins}"
    textColor: "{colors.prancha}"
    padding: "0 16px 8px"
    height: "48px"
---

# Design System: Associação Tocantinense de Startups

## Overview

**Guia de campo do cerrado tocantinense.** O ecossistema de startups lido como o ecossistema do cerrado: o site é um guia de campo, com pranchas (seções) numeradas na margem, abas de índice coloridas pendendo do topo, fichas de herbário com etiqueta tabular (Localidade, Setor, Estágio) e legendas em itálico, à maneira de nome científico.

A assinatura é o **mapa de coleta**: os 139 municípios do Tocantins, um ponto por cidade, nas coordenadas reais (centroides IBGE). É o mesmo mapa em pontos do logo, agora com cada ponto sendo uma cidade. Na Home ele abre o site em laranja e azul-claro sobre o azul; na Vitrine, as cidades com startups associadas acendem em laranja e o clique filtra.

Vibrante e regional, nunca template de startup: campos inteiros de cor (azul do tecido da capa, laranja do ipê, verde-buriti) se alternam com o papel e a prancha branca. A energia fica na Home, no Manifesto e nos destaques; Diretoria, Documentos, formulários, área do associado e admin são calmos e legíveis.

## Colors

Estratégia **comprometida**: o azul ocupa campos inteiros (abertura, missão, rodapé, ficha do Associado); o laranja é o segundo campo (Faça parte, Manifesto) e o CTA.

### Primary

- **Azul Tocantins `#0C4D9F`** — cor do logo: links, botão secundário, abas. **Azul-fundo `#0A3F84`** é o campo de abertura; **azul-noite `#08264D`** é o "quase preto" de títulos e o rodapé.

### Secondary

- **Laranja-sol `#FB9A17`** — ipê, CTA principal, pontos em destaque no mapa, marcadores de lista. Sempre com texto azul-noite por cima. **Nunca como cor de texto sobre fundo claro** (não passa AA); para texto laranja use **laranja-tinta `#8A4A00`**.

### Tertiary

- **Verde-buriti `#1F6B4A`** — eventos (carimbo de data, cabeçalho do evento), benefícios, estados de sucesso.

### Neutral

- **Papel `#F3F6FA`** (fundo do site, quase-branco frio puxado do azul; nunca creme), **prancha `#FFFFFF`** (fichas e seções alternadas), **linha `#D9DDE4`** / **linha-forte `#B7BFCC`** (réguas e bordas). Texto: **tinta `#14213A`**, **tinta-suave `#44516A`**, **tinta-fraca `#6A7489`** (rótulos de etiqueta, nunca texto corrido).

### Named Rules

- **Regra do Sol**: no máximo um campo laranja dominante por tela.
- **Cada aba, uma tinta**: Quem somos e Vitrine em azul, Diretoria em azul-noite, Notícias em laranja, Eventos em buriti. A tinta da aba reaparece na página (carimbo de evento, selo de categoria).
- **Estado nunca só por cor**: selos e status sempre com texto.

## Typography

**Bricolage Grotesque** (display e interface, peso 600–800, tracking negativo nos títulos) conversa com o nome encorpado do logo. **Alegreya** (texto corrido, legendas e cargos em itálico) dá a voz de guia de campo. Ambas servidas pelo próprio site via `next/font`.

### Hierarchy

- **Display** (abertura, Manifesto): 2.6–5.25rem, 800, entrelinha 0.98.
- **Headline** (título de prancha): 1.9–3rem, 800.
- **Title** (fichas, itens): 1.125–1.5rem, 700.
- **Body** (`.leitura`): Alegreya 1.1875rem / 1.65, medida máx. 68ch.
- **Label** (rótulos de etiqueta, cabeçalhos de rodapé): 0.6875rem, 600, caixa-alta, tracking 0.08em.

### Named Rules

- **Cargo em itálico**: cargos, legendas e localidades vão em Alegreya itálica, como nome científico numa prancha.
- **Primeiro parágrafo em display**: textos institucionais abrem com o primeiro parágrafo em Bricolage bold.

## Layout

- Container de 76rem com gutter de 16/24/32px; o cabeçalho usa 86rem para as abas.
- Pranchas com 64px (celular) a 96px (desktop) de respiro vertical, alternando papel, prancha branca e campos de cor.
- O número da prancha corre na margem direita, girado 90°, só a partir de 1280px — nunca acima do título.
- Mobile-first: abertura em coluna única (mapa abaixo do texto, até 15rem de largura), menu em folha cheia com as abas como blocos coloridos.
- Vitrine: filtros e mapa em coluna lateral fixa (18rem) no desktop; grade de fichas densa (até 3 colunas).

## Elevation & Depth

Profundidade de papel sobre mesa: sombras com deslocamento e desfoque suaves, tingidas de azul-noite.

### Shadow Vocabulary

- `ficha`: `0 1px 2px rgb(8 38 77 / 0.06), 0 6px 18px -8px rgb(8 38 77 / 0.18)` — repouso.
- `ficha-alta`: `0 2px 4px rgb(8 38 77 / 0.08), 0 18px 36px -14px rgb(8 38 77 / 0.28)` — hover e destaque.

## Shapes

- Cantos discretos: 4px em etiquetas, campos e carimbos; 6px em fichas e abas; botões em pílula.
- Réguas finas (1px) dividem etiquetas e listas; régua de 2px azul-noite marca o topo de passos e blocos de regra.
- Pontos (círculos de raios variados) são o único ornamento: mapa, placeholder de retrato, estados vazios.

## Components

### Buttons

Pílula, mínimo 44px de altura. **Primário** laranja com texto azul-noite; **secundário** azul com texto branco; **contorno** com anel azul; **claro** branco sobre campos azuis. Foco: anel laranja de 3px com 3px de afastamento.

### Cards / Containers

**Ficha**: prancha branca, anel de 1px `linha`, sombra `ficha`, raio 6px; interativa sobe 2px no hover. **Etiqueta**: lista de definição com rótulo em label caixa-alta e valor em Alegreya, réguas entre linhas.

### Inputs / Fields

Campo branco, borda `linha-forte`, 48px de altura, raio 4px; foco com borda azul e halo azul a 20%; erro com borda e mensagem em `erro`, ícone de alerta e `role="alert"`. Rótulo sempre visível em Bricolage 600.

### Navigation

**Abas de índice** pendendo do topo do cabeçalho, cada uma na tinta da sua seção; a ativa desce mais e ganha sombra. No celular, folha cheia com as abas como blocos de 56px.

### Mapa de coleta (assinatura)

SVG com o contorno do estado e 139 pontos. Pontos acendem de norte a sul na entrada (700ms, ease-out exponencial, desligado em `prefers-reduced-motion`). Destaques em laranja, foco/hover mostra o nome da cidade.

### Retrato da Diretoria

Foto 4:5; sem foto, placeholder azul-fundo com pontos sutis e iniciais em laranja. Bio recolhida em `<details>` ("Ler bio").

### Estado vazio

Moldura tracejada com fileira de pontos, título em display e um convite com ação. Nunca conteúdo de exemplo.

## Do's and Don'ts

### Do:

- Use campos inteiros de cor; alterne papel, prancha e campos.
- Mantenha o nome oficial completo no cabeçalho (logo) e no rodapé de toda página.
- Use estados vazios honestos com convite.
- Use fotos reais do Tocantins e de eventos quando existirem.

### Don't:

- Não use texto laranja-sol sobre fundo claro.
- Não ponha rótulo (kicker) acima de títulos; o número da prancha vive na margem.
- Não invente números, depoimentos, logos ou startups de exemplo.
- Não use gradientes roxos, glassmorphism, ilustrações 3D, emojis como ícones.
