/**
 * E-mails transacionais — textos de emails.md (seções B e C).
 * A seção A (link de acesso e troca de e-mail) fica nos templates do Supabase Auth:
 * ver supabase/templates/.
 */
import type {ReactElement} from 'react'
import {Assinatura, Botao, Layout, Lista, P, type Rodape} from './Layout'

export type Email = {assunto: string; preview: string; corpo: (r: Rodape) => ReactElement}

const b = (t: string) => <strong>{t}</strong>

// ---------------------------------------------------------------- B. Associados

export function boasVindasComunidade(v: {nome: string; linkGrupoWhatsapp: string | null; urlAssocieSe: string}): Email {
  const preview = 'Aqui está o link para entrar no nosso grupo.'
  return {
    assunto: 'Bem-vindo(a) à Comunidade Startup Tocantins',
    preview,
    corpo: (r) => (
      <Layout preview={preview} rodape={r}>
        <P>Olá, {v.nome}!</P>
        <P>
          Que bom ter você com a gente. Seu cadastro na Comunidade da Associação Tocantinense de Startups está
          confirmado.
        </P>
        {v.linkGrupoWhatsapp ? (
          <>
            <P>
              O primeiro passo é entrar no grupo {b('Startup Tocantins')} no WhatsApp, onde compartilhamos eventos,
              editais e oportunidades do ecossistema:
            </P>
            <Botao href={v.linkGrupoWhatsapp}>Entrar no grupo do WhatsApp</Botao>
          </>
        ) : (
          <P>
            O link para entrar no grupo {b('Startup Tocantins')} no WhatsApp, onde compartilhamos eventos, editais e
            oportunidades do ecossistema, será enviado pela nossa equipe em breve.
          </P>
        )}
        <P>Como membro da Comunidade, você participa dos eventos gratuitos organizados pela Associação.</P>
        <P>
          Quer ir além? Associados têm direito a voto nas Assembleias, benefícios exclusivos e a startup exibida na
          nossa Vitrine.
        </P>
        <Botao href={v.urlAssocieSe}>Conhecer a associação</Botao>
        <P>Até logo!</P>
        <Assinatura />
      </Layout>
    ),
  }
}

export function pedidoRecebido(v: {nome: string; nomeStartup: string; valorAnuidade: string; urlPagamento: string}): Email {
  const preview = 'Falta só a anuidade para ativar sua associação.'
  return {
    assunto: 'Recebemos seu cadastro de associação',
    preview,
    corpo: (r) => (
      <Layout preview={preview} rodape={r}>
        <P>Olá, {v.nome}!</P>
        <P>
          Recebemos o cadastro de associação de {b(v.nomeStartup)}. Obrigado pelo interesse em fortalecer o
          ecossistema de startups do Tocantins.
        </P>
        <P>
          Para ativar sua associação, falta só a anuidade de {b(v.valorAnuidade)} no cartão de crédito. Se você já
          concluiu o pagamento, pode ignorar este passo:
        </P>
        <Botao href={v.urlPagamento}>Pagar anuidade</Botao>
        <P>
          O pagamento é feito em ambiente seguro do Stripe. A anuidade é renovada automaticamente a cada ano, e você
          pode cancelar quando quiser pela sua área do associado.
        </P>
        <Assinatura />
      </Layout>
    ),
  }
}

export function associacaoAtiva(v: {nome: string; nomeStartup: string; dataVencimento: string; urlAreaAssociado: string}): Email {
  const preview = 'Agora você faz parte da Associação Tocantinense de Startups.'
  return {
    assunto: 'Sua associação está ativa',
    preview,
    corpo: (r) => (
      <Layout preview={preview} rodape={r}>
        <P>Olá, {v.nome}!</P>
        <P>
          Pagamento confirmado: {b(v.nomeStartup)} agora é associada à Associação Tocantinense de Startups.
        </P>
        <P>{b('Como Associado, você:')}</P>
        <Lista
          itens={[
            'participa das Assembleias, com direito a voto;',
            'entra no grupo de Associados;',
            'acessa os benefícios exclusivos;',
            'aparece na Vitrine de startups do Tocantins (se você autorizou).',
          ]}
        />
        <P>
          Sua associação vale até {b(v.dataVencimento)} e será renovada automaticamente.
        </P>
        <Botao href={v.urlAreaAssociado}>Acessar minha área</Botao>
        <P>Seja bem-vindo(a)!</P>
        <Assinatura />
      </Layout>
    ),
  }
}

export function lembreteRenovacao(v: {
  nome: string
  nomeStartup: string
  dataVencimento: string
  valorAnuidade: string
  cartaoFinal: string
  urlPortalStripe: string
}): Email {
  const preview = 'Confira se o seu cartão está em dia.'
  return {
    assunto: `Sua anuidade será renovada em ${v.dataVencimento}`,
    preview,
    corpo: (r) => (
      <Layout preview={preview} rodape={r}>
        <P>Olá, {v.nome}!</P>
        <P>
          Passando para lembrar que a anuidade de {b(v.nomeStartup)} será renovada automaticamente em{' '}
          {b(v.dataVencimento)}, no valor de {b(v.valorAnuidade)}, no cartão final {b(v.cartaoFinal)}.
        </P>
        <P>Se precisar trocar o cartão, faça isso antes da data:</P>
        <Botao href={v.urlPortalStripe}>Gerenciar pagamento</Botao>
        <P>Obrigado por continuar fortalecendo o ecossistema com a gente!</P>
        <Assinatura />
      </Layout>
    ),
  }
}

export function pagamentoRecusado(v: {nome: string; nomeStartup: string; cartaoFinal: string; urlPortalStripe: string}): Email {
  const preview = 'Atualize seu cartão para manter sua associação ativa.'
  return {
    assunto: 'Não conseguimos cobrar sua anuidade',
    preview,
    corpo: (r) => (
      <Layout preview={preview} rodape={r}>
        <P>Olá, {v.nome},</P>
        <P>
          Tentamos cobrar a anuidade de {b(v.nomeStartup)}, mas o pagamento no cartão final {b(v.cartaoFinal)} não foi
          aprovado.
        </P>
        <P>
          Isso costuma acontecer por cartão vencido, limite ou bloqueio do banco. Para resolver, atualize sua forma de
          pagamento:
        </P>
        <Botao href={v.urlPortalStripe}>Atualizar cartão</Botao>
        <P>
          Enquanto a anuidade estiver pendente, sua startup sai da Vitrine e o acesso aos benefícios de Associado fica
          suspenso. Se tiver qualquer dificuldade, responda este e-mail que a gente ajuda.
        </P>
        <Assinatura />
      </Layout>
    ),
  }
}

export function associacaoCancelada(v: {nome: string; nomeStartup: string; urlAreaAssociado: string}): Email {
  const preview = 'Você continua na nossa Comunidade.'
  return {
    assunto: 'Sua associação foi cancelada',
    preview,
    corpo: (r) => (
      <Layout preview={preview} rodape={r}>
        <P>Olá, {v.nome},</P>
        <P>
          Confirmamos o cancelamento da associação de {b(v.nomeStartup)}. A renovação automática foi encerrada e não
          haverá novas cobranças.
        </P>
        <P>
          Você continua fazendo parte da Comunidade e é sempre bem-vindo(a) nos nossos eventos gratuitos. Se quiser
          voltar a ser Associado, é só pedir pela sua área:
        </P>
        <Botao href={v.urlAreaAssociado}>Acessar minha área</Botao>
        <P>Obrigado por ter caminhado com a gente.</P>
        <Assinatura />
      </Layout>
    ),
  }
}

export function isencaoConcedida(v: {nome: string; motivoIsencao: string; urlAreaAssociado: string}): Email {
  const preview = 'Você está isento da anuidade.'
  return {
    assunto: 'Sua associação está ativa (isenção de anuidade)',
    preview,
    corpo: (r) => (
      <Layout preview={preview} rodape={r}>
        <P>Olá, {v.nome}!</P>
        <P>Sua associação foi ativada com {b('isenção da anuidade')}.</P>
        <P>
          {b('Motivo:')} {v.motivoIsencao}
        </P>
        <P>
          Você tem todos os direitos de Associado, incluindo voto nas Assembleias, sem cobrança enquanto a isenção
          estiver vigente.
        </P>
        <Botao href={v.urlAreaAssociado}>Acessar minha área</Botao>
        <Assinatura />
      </Layout>
    ),
  }
}

export function isencaoEncerrada(v: {nome: string; motivo?: string | null; valorAnuidade: string; urlPagamento: string}): Email {
  const preview = 'Para continuar como Associado, ative o pagamento.'
  return {
    assunto: 'Sua isenção de anuidade foi encerrada',
    preview,
    corpo: (r) => (
      <Layout preview={preview} rodape={r}>
        <P>Olá, {v.nome},</P>
        <P>
          A isenção de anuidade da sua associação foi encerrada{v.motivo ? ` (${v.motivo})` : ''}. Obrigado pela
          dedicação à Associação.
        </P>
        <P>
          Para continuar como Associado, com direito a voto e benefícios, ative o pagamento da anuidade de{' '}
          {b(v.valorAnuidade)}:
        </P>
        <Botao href={v.urlPagamento}>Pagar anuidade</Botao>
        <Assinatura />
      </Layout>
    ),
  }
}

export function exclusaoRecebida(v: {nome: string; dataPedido: string}): Email {
  const preview = 'Respondemos em até 15 dias.'
  return {
    assunto: 'Recebemos seu pedido de exclusão de dados',
    preview,
    corpo: (r) => (
      <Layout preview={preview} rodape={r}>
        <P>Olá, {v.nome},</P>
        <P>
          Recebemos seu pedido de exclusão dos dados pessoais, feito em {v.dataPedido}. Vamos responder em até 15
          dias.
        </P>
        <P>
          Alguns dados podem precisar ser guardados por mais tempo quando a lei nos obriga, por exemplo registros
          contábeis e fiscais. Explicaremos na resposta o que foi excluído e o que, se for o caso, precisou ser
          mantido.
        </P>
        <P>Se você tem uma assinatura ativa, ela será cancelada como parte do processo.</P>
        <Assinatura />
      </Layout>
    ),
  }
}

// ---------------------------------------------------------------- C. Diretoria

export function alertaNovoPedido(v: {
  nome: string
  nomeStartup: string
  setor: string
  estagio: string
  cidade: string
  tipoDocumento: string
  urlAdminAssociado: string
}): Email {
  const preview = 'Novo cadastro de associado, aguardando o pagamento da anuidade.'
  return {
    assunto: `Novo cadastro de associado: ${v.nomeStartup}`,
    preview,
    corpo: (r) => (
      <Layout preview={preview} rodape={r}>
        <P>Novo cadastro de associado. A associação fica ativa assim que a anuidade for paga.</P>
        <Lista
          itens={[
            <>
              {b('Nome:')} {v.nome}
            </>,
            <>
              {b('Startup:')} {v.nomeStartup}
            </>,
            <>
              {b('Setor / estágio:')} {v.setor} · {v.estagio}
            </>,
            <>
              {b('Cidade:')} {v.cidade}
            </>,
            <>
              {b('Documento:')} {v.tipoDocumento}
            </>,
          ]}
        />
        <Botao href={v.urlAdminAssociado}>Ver cadastro</Botao>
      </Layout>
    ),
  }
}

export function alertaInadimplente(v: {nome: string; nomeStartup: string; data: string; urlAdminAssociado: string}): Email {
  const preview = `Pagamento não aprovado: ${v.nomeStartup}`
  return {
    assunto: `Pagamento não aprovado: ${v.nomeStartup}`,
    preview,
    corpo: (r) => (
      <Layout preview={preview} rodape={r}>
        <P>
          O pagamento da anuidade de {b(v.nomeStartup)} ({v.nome}) não foi aprovado em {v.data}. O associado foi
          avisado por e-mail e marcado como inadimplente.
        </P>
        <P>
          Lembrete: a exclusão por inadimplência segue o art. 14 do Estatuto e o art. 9º-A do Regimento (notificação
          por escrito e 10 dias para defesa). O sistema não exclui ninguém automaticamente.
        </P>
        <Botao href={v.urlAdminAssociado}>Ver associado</Botao>
      </Layout>
    ),
  }
}

export function alertaCancelamento(v: {nome: string; nomeStartup: string; data: string; urlAdminAssociado: string}): Email {
  const preview = `Associação cancelada: ${v.nomeStartup}`
  return {
    assunto: `Associação cancelada: ${v.nomeStartup}`,
    preview,
    corpo: (r) => (
      <Layout preview={preview} rodape={r}>
        <P>
          {b(v.nomeStartup)} ({v.nome}) cancelou a associação em {v.data}.
        </P>
        <Botao href={v.urlAdminAssociado}>Ver associado</Botao>
      </Layout>
    ),
  }
}

export function alertaExclusao(v: {nome: string; email: string; dataPedido: string; dataLimite: string; urlAdmin: string}): Email {
  const preview = `Pedido de exclusão de dados (LGPD): ${v.nome}`
  return {
    assunto: `Pedido de exclusão de dados (LGPD): ${v.nome}`,
    preview,
    corpo: (r) => (
      <Layout preview={preview} rodape={r}>
        <P>
          {b(v.nome)} ({v.email}) pediu a exclusão dos dados pessoais em {v.dataPedido}.{' '}
          {b(`Prazo de resposta: ${v.dataLimite}`)} (15 dias).
        </P>
        <P>
          Antes de excluir, verifique o que precisa ser mantido por obrigação legal (registros contábeis e fiscais) e
          cancele a assinatura, se houver.
        </P>
        <Botao href={v.urlAdmin}>Ver pedido</Botao>
      </Layout>
    ),
  }
}
