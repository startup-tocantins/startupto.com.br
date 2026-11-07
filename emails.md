# Textos dos e-mails

Todos os e-mails saem de `Associação Tocantinense de Startups <contato@startupto.com.br>`. Rodapé padrão em todos, depois do corpo:

> Associação Tocantinense de Startups · CNPJ 57.921.002/0001-30 · Palmas – TO
> Dúvidas? Responda este e-mail ou fale com a gente no WhatsApp {{whatsapp_contato}}.
> [Política de Privacidade]({{url_privacidade}})

Variáveis entre `{{ }}`. Botões indicados como **[Texto do botão]** → destino.

---

## A. Autenticação (templates do Supabase Auth)

### A1. Link de acesso (login)

- **Gatilho:** pessoa pede para entrar ou se cadastra.
- **Assunto:** Seu link de acesso
- **Pré-visualização:** Clique para entrar na sua conta. O link vale por 1 hora.

Olá!

Recebemos um pedido para entrar na sua conta da Associação Tocantinense de Startups.

**[Entrar na minha conta]** → `{{ .ConfirmationURL }}`

O link vale por 1 hora e só pode ser usado uma vez. Se não foi você que pediu, pode ignorar este e-mail: nada muda na sua conta.

### A2. Confirmação de troca de e-mail

- **Gatilho:** pessoa altera o e-mail no perfil.
- **Assunto:** Confirme seu novo e-mail
- **Pré-visualização:** Falta só um clique para atualizar seu e-mail.

Olá!

Você pediu para trocar o e-mail da sua conta para **{{ .NewEmail }}**. Confirme no botão abaixo:

**[Confirmar novo e-mail]** → `{{ .ConfirmationURL }}`

Se não foi você, ignore este e-mail e seu endereço atual continuará valendo.

---

## B. Para quem se cadastra ou se associa

### B1. Boas-vindas à Comunidade

- **Gatilho:** cadastro na Comunidade concluído.
- **Assunto:** Bem-vindo(a) à Comunidade Startup Tocantins
- **Pré-visualização:** Aqui está o link para entrar no nosso grupo.

Olá, {{nome}}!

Que bom ter você com a gente. Seu cadastro na Comunidade da Associação Tocantinense de Startups está confirmado.

O primeiro passo é entrar no grupo **Startup Tocantins** no WhatsApp, onde compartilhamos eventos, editais e oportunidades do ecossistema:

**[Entrar no grupo do WhatsApp]** → `{{link_grupo_whatsapp}}`

Como membro da Comunidade, você participa dos eventos gratuitos organizados pela Associação.

Quer ir além? Associados têm direito a voto nas Assembleias, benefícios exclusivos e a startup exibida na nossa Vitrine.

**[Conhecer a associação]** → `{{url_associe_se}}`

Até logo!
Associação Tocantinense de Startups

### B2. Pedido de associação recebido

- **Gatilho:** formulário de Associado enviado (status `pendente_aprovacao`).
- **Assunto:** Recebemos seu pedido de associação
- **Pré-visualização:** A Diretoria vai analisar e você recebe a resposta por e-mail.

Olá, {{nome}}!

Recebemos o pedido de associação de **{{nome_startup}}**. Obrigado pelo interesse em fortalecer o ecossistema de startups do Tocantins.

**Próximos passos:**

1. A Diretoria analisa seu pedido, conforme o Estatuto e o Regimento Interno.
2. Se aprovado, você recebe um e-mail com o link para pagar a anuidade.
3. Com o pagamento confirmado, sua associação fica ativa.

Enquanto isso, você pode revisar seus dados na área do associado:

**[Ver meu cadastro]** → `{{url_area_associado}}`

Associação Tocantinense de Startups

### B3. Pedido aprovado — pagamento

- **Gatilho:** admin aprova o pedido (status `aguardando_pagamento`).
- **Assunto:** Seu pedido foi aprovado! Falta só a anuidade
- **Pré-visualização:** Conclua o pagamento para ativar sua associação.

Olá, {{nome}}!

Boa notícia: a Diretoria aprovou o pedido de associação de **{{nome_startup}}**.

Para ativar sua associação, conclua o pagamento da anuidade de **{{valor_anuidade}}** no cartão de crédito:

**[Pagar anuidade]** → `{{url_pagamento}}`

O pagamento é feito em ambiente seguro do Stripe. A anuidade é renovada automaticamente a cada ano, e você pode cancelar quando quiser pela sua área do associado.

Associação Tocantinense de Startups

### B4. Pedido não aprovado

- **Gatilho:** admin recusa o pedido (status `recusado`).
- **Assunto:** Sobre seu pedido de associação
- **Pré-visualização:** Temos uma atualização sobre o seu pedido.

Olá, {{nome}},

Agradecemos o interesse em se associar à Associação Tocantinense de Startups. Depois da análise, a Diretoria não aprovou o pedido de **{{nome_startup}}** neste momento.

{{#if motivo}}**Motivo:** {{motivo}}{{/if}}

Você continua fazendo parte da nossa Comunidade e pode participar dos eventos gratuitos. Se tiver dúvidas ou quiser enviar um novo pedido no futuro, é só responder este e-mail.

Associação Tocantinense de Startups

### B5. Associação ativa

- **Gatilho:** primeiro pagamento confirmado (`invoice.paid`, status `ativo`).
- **Assunto:** Sua associação está ativa
- **Pré-visualização:** Agora você faz parte da Associação Tocantinense de Startups.

Olá, {{nome}}!

Pagamento confirmado: **{{nome_startup}}** agora é associada à Associação Tocantinense de Startups.

**Como Associado, você:**

- participa das Assembleias, com direito a voto;
- entra no grupo de Associados;
- acessa os benefícios exclusivos;
- aparece na Vitrine de startups do Tocantins (se você autorizou).

Sua associação vale até **{{data_vencimento}}** e será renovada automaticamente.

**[Acessar minha área]** → `{{url_area_associado}}`

Seja bem-vindo(a)!
Associação Tocantinense de Startups

### B6. Lembrete de renovação

- **Gatilho:** `invoice.upcoming` (antes da renovação).
- **Assunto:** Sua anuidade será renovada em {{data_vencimento}}
- **Pré-visualização:** Confira se o seu cartão está em dia.

Olá, {{nome}}!

Passando para lembrar que a anuidade de **{{nome_startup}}** será renovada automaticamente em **{{data_vencimento}}**, no valor de **{{valor_anuidade}}**, no cartão final **{{cartao_final}}**.

Se precisar trocar o cartão, faça isso antes da data:

**[Gerenciar pagamento]** → `{{url_portal_stripe}}`

Obrigado por continuar fortalecendo o ecossistema com a gente!
Associação Tocantinense de Startups

### B7. Pagamento não aprovado

- **Gatilho:** `invoice.payment_failed` (status `inadimplente`).
- **Assunto:** Não conseguimos cobrar sua anuidade
- **Pré-visualização:** Atualize seu cartão para manter sua associação ativa.

Olá, {{nome}},

Tentamos cobrar a anuidade de **{{nome_startup}}**, mas o pagamento no cartão final **{{cartao_final}}** não foi aprovado.

Isso costuma acontecer por cartão vencido, limite ou bloqueio do banco. Para resolver, atualize sua forma de pagamento:

**[Atualizar cartão]** → `{{url_portal_stripe}}`

Enquanto a anuidade estiver pendente, sua startup sai da Vitrine e o acesso aos benefícios de Associado fica suspenso. Se tiver qualquer dificuldade, responda este e-mail que a gente ajuda.

Associação Tocantinense de Startups

### B8. Associação cancelada

- **Gatilho:** `customer.subscription.deleted` (status `cancelado`).
- **Assunto:** Sua associação foi cancelada
- **Pré-visualização:** Você continua na nossa Comunidade.

Olá, {{nome}},

Confirmamos o cancelamento da associação de **{{nome_startup}}**. A renovação automática foi encerrada e não haverá novas cobranças.

Você continua fazendo parte da Comunidade e é sempre bem-vindo(a) nos nossos eventos gratuitos. Se quiser voltar a ser Associado, é só pedir pela sua área:

**[Acessar minha área]** → `{{url_area_associado}}`

Obrigado por ter caminhado com a gente.
Associação Tocantinense de Startups

### B9. Isenção concedida

- **Gatilho:** admin marca como isento.
- **Assunto:** Sua associação está ativa (isenção de anuidade)
- **Pré-visualização:** Você está isento da anuidade.

Olá, {{nome}}!

Sua associação foi ativada com **isenção da anuidade**.

**Motivo:** {{motivo_isencao}}

Você tem todos os direitos de Associado, incluindo voto nas Assembleias, sem cobrança enquanto a isenção estiver vigente.

**[Acessar minha área]** → `{{url_area_associado}}`

Associação Tocantinense de Startups

### B10. Isenção encerrada

- **Gatilho:** admin revoga a isenção (status `aguardando_pagamento`).
- **Assunto:** Sua isenção de anuidade foi encerrada
- **Pré-visualização:** Para continuar como Associado, ative o pagamento.

Olá, {{nome}},

A isenção de anuidade da sua associação foi encerrada{{#if motivo}} ({{motivo}}){{/if}}. Obrigado pela dedicação à Associação.

Para continuar como Associado, com direito a voto e benefícios, ative o pagamento da anuidade de **{{valor_anuidade}}**:

**[Pagar anuidade]** → `{{url_pagamento}}`

Associação Tocantinense de Startups

### B11. Pedido de exclusão de dados recebido

- **Gatilho:** pessoa solicita exclusão de dados na área logada.
- **Assunto:** Recebemos seu pedido de exclusão de dados
- **Pré-visualização:** Respondemos em até 15 dias.

Olá, {{nome}},

Recebemos seu pedido de exclusão dos dados pessoais, feito em {{data_pedido}}. Vamos responder em até 15 dias.

Alguns dados podem precisar ser guardados por mais tempo quando a lei nos obriga, por exemplo registros contábeis e fiscais. Explicaremos na resposta o que foi excluído e o que, se for o caso, precisou ser mantido.

Se você tem uma assinatura ativa, ela será cancelada como parte do processo.

Associação Tocantinense de Startups

---

## C. Alertas para a Diretoria

Enviados aos usuários com papel `admin`. Texto curto e objetivo.

### C1. Novo pedido de associação

- **Assunto:** Novo pedido de associação: {{nome_startup}}

Novo pedido de associação aguardando análise.

- **Nome:** {{nome}}
- **Startup:** {{nome_startup}}
- **Setor / estágio:** {{setor}} · {{estagio}}
- **Cidade:** {{cidade}}
- **Documento:** {{tipo_documento}}

**[Analisar pedido]** → `{{url_admin_associado}}`

### C2. Associado inadimplente

- **Assunto:** Pagamento não aprovado: {{nome_startup}}

O pagamento da anuidade de **{{nome_startup}}** ({{nome}}) não foi aprovado em {{data}}. O associado foi avisado por e-mail e marcado como inadimplente.

Lembrete: a exclusão por inadimplência segue o art. 14 do Estatuto e o art. 9º-A do Regimento (notificação por escrito e 10 dias para defesa). O sistema não exclui ninguém automaticamente.

**[Ver associado]** → `{{url_admin_associado}}`

### C3. Associação cancelada

- **Assunto:** Associação cancelada: {{nome_startup}}

**{{nome_startup}}** ({{nome}}) cancelou a associação em {{data}}.

**[Ver associado]** → `{{url_admin_associado}}`

### C4. Pedido de exclusão de dados

- **Assunto:** Pedido de exclusão de dados (LGPD): {{nome}}

**{{nome}}** ({{email}}) pediu a exclusão dos dados pessoais em {{data_pedido}}. **Prazo de resposta: {{data_limite}}** (15 dias).

Antes de excluir, verifique o que precisa ser mantido por obrigação legal (registros contábeis e fiscais) e cancele a assinatura, se houver.

**[Ver pedido]** → `{{url_admin_associado}}`
