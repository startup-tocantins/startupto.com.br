---
name: Associação Tocantinense de Startups
description: Site institucional e plataforma de associação das startups do Tocantins
colors:
  azul-tocantins: "#0C4D9F"
  laranja-sol: "#FB9A17"
---

# Design System: Associação Tocantinense de Startups

> Projeto greenfield. Este arquivo fixa as **restrições de marca já decididas** e a **direção**. Tipografia, escala, demais cores, espaçamento e componentes são definidos na etapa de design (impeccable `new-work`) e depois registrados aqui (impeccable `document`), mantendo as cores da marca abaixo.

## Overview

**Vibrante e regional.** O sol do cerrado, o laranja e o azul do logo como protagonistas. Deve parecer do Tocantins — calor, horizonte largo, céu aberto, terra — e não um template genérico de startup (nada de gradiente roxo-azul, glassmorphism, blobs, mockups de notebook flutuando, ilustrações 3D de bonequinhos).

Ao mesmo tempo é uma **entidade representativa**: precisa transmitir seriedade para governo, universidades e investidores. Energia na Home e nos destaques; calma e legibilidade em Diretoria, Documentos, formulários, área do associado e admin.

**Elemento gráfico de assinatura**: o mapa do Tocantins formado por pontos/quadrados do logo. Pode virar padrão de fundo, textura, marcador de cidade na Vitrine, estado de carregamento, ou ilustração do hero — sempre com moderação.

## Colors

### Primary

- **Azul Tocantins `#0C4D9F`** — cor institucional. Títulos, links, botões primários, cabeçalho/rodapé em superfícies escuras. Passa contraste AA sobre branco para texto.

### Secondary

- **Laranja Sol `#FB9A17`** — energia, destaque, CTA "Associe-se", selos, detalhes do mapa. **Não passa contraste AA como texto sobre branco**: use como preenchimento (com texto em azul-escuro/quase preto), elementos grandes, ícones decorativos e acentos. Nunca texto pequeno laranja sobre fundo claro.

### Neutral

A definir na etapa de design: neutros levemente aquecidos (tom de terra/areia do cerrado), não cinza frio puro. Um azul muito escuro derivado do primário serve como "quase preto" para texto e superfícies escuras.

### Named Rules

- **Regra do Sol**: o laranja é escasso e significativo — no máximo um bloco de laranja dominante por tela.
- **Estado nunca só por cor**: status de associado (ativo, pendente, inadimplente…) sempre com rótulo de texto além da cor.

## Typography

A definir na etapa de design. Restrições:

- Deve conversar com o logo: o nome usa uma sans geométrica/arredondada em peso forte; "DE STARTUPS" usa caixa-alta espaçada, de traço técnico.
- Excelente renderização de português (acentos, cedilha), boa leitura em textos longos (bios, notícias, regimento).
- Fontes servidas pelo próprio site (`next/font`), no máximo duas famílias.

## Layout

- Mobile-first: boa parte do tráfego vem de links no WhatsApp/Instagram.
- Páginas institucionais com coluna de leitura confortável; Home e Vitrine com composições mais largas e assimétricas.
- Diretoria: grade de cards com foto (ou placeholder) + nome + cargo, bio recolhida abaixo. Cards com e sem foto devem ter a mesma altura e peso visual.

## Shapes

Os pontos/quadrados do mapa sugerem um vocabulário de formas: cantos levemente arredondados, módulos quadrados, grade de pontos. A definir na etapa de design.

## Components

### Placeholder de foto (Diretoria)

Iniciais do nome sobre fundo da marca (azul ou textura do mapa em pontos), mesma proporção e recorte das fotos reais. Não usar silhueta genérica de avatar.

### Card da Vitrine

Logo da startup (com fallback de iniciais), nome, setor, estágio, cidade e link do site. Logos de proporções diversas devem caber sem distorção.

### Comparativo de modalidades

Comunidade (grátis) × Associado (preço vindo do Stripe). Benefícios listados conforme o Regimento, art. 7º. CTA principal em laranja para Associado.

## Do's and Don'ts

### Do:

- Use fotos reais do Tocantins e de eventos quando existirem; até lá, use o mapa em pontos e tipografia forte, não fotos de banco genéricas.
- Mantenha o nome oficial completo visível no cabeçalho ou rodapé de toda página.
- Estados vazios honestos ("Em breve, as startups associadas aparecerão aqui") em vez de conteúdo falso.

### Don't:

- Não use texto laranja pequeno sobre fundo claro.
- Não invente números, depoimentos, logos de parceiros ou startups de exemplo em produção.
- Não use estética "startup genérica": gradientes roxos, glassmorphism, ilustrações 3D, emojis como ícones.
