import 'server-only'
import * as T from '@/emails/templates'
import {enviarEmail} from '@/lib/email/enviar'
import {formatarBRL, getPrecoAssociado} from '@/lib/stripe/preco'
import type {Perfil} from '@/lib/supabase/types'
import {getListas, tituloDe} from './listas'
import {emailsDosAdmins} from './sessao'
import {formatarData} from './status'
import {urls} from './urls'

const startup = (p: Perfil) => p.startup_nome ?? p.nome

async function valorAnuidade() {
  return (await getPrecoAssociado())?.formatado ?? 'R$ 250,00'
}

export const notificar = {
  async boasVindasComunidade(p: Perfil, linkGrupoWhatsapp: string | null) {
    await enviarEmail(p.email, T.boasVindasComunidade({nome: p.nome, linkGrupoWhatsapp, urlAssocieSe: urls.associeSe()}))
  },
  async pedidoRecebido(p: Perfil) {
    await enviarEmail(p.email, T.pedidoRecebido({nome: p.nome, nomeStartup: startup(p), urlAreaAssociado: urls.areaAssociado()}))
    const listas = await getListas()
    await enviarEmail(
      await emailsDosAdmins(),
      T.alertaNovoPedido({
        nome: p.nome,
        nomeStartup: startup(p),
        setor: tituloDe(listas.setores, p.setor),
        estagio: tituloDe(listas.estagios, p.estagio),
        cidade: tituloDe(listas.cidades, p.cidade),
        tipoDocumento: p.tipo_documento === 'cnpj' ? 'CNPJ' : 'CPF',
        urlAdminAssociado: urls.adminAssociado(p.id),
      }),
    )
  },
  async aprovado(p: Perfil) {
    await enviarEmail(
      p.email,
      T.pedidoAprovado({nome: p.nome, nomeStartup: startup(p), valorAnuidade: await valorAnuidade(), urlPagamento: urls.pagamento()}),
    )
  },
  async recusado(p: Perfil, motivo: string | null) {
    await enviarEmail(p.email, T.pedidoRecusado({nome: p.nome, nomeStartup: startup(p), motivo}))
  },
  async ativa(p: Perfil, vencimento: Date) {
    await enviarEmail(
      p.email,
      T.associacaoAtiva({nome: p.nome, nomeStartup: startup(p), dataVencimento: formatarData(vencimento), urlAreaAssociado: urls.areaAssociado()}),
    )
  },
  async renovacao(p: Perfil, i: {vencimento: Date; valorCentavos: number; cartaoFinal: string}) {
    await enviarEmail(
      p.email,
      T.lembreteRenovacao({
        nome: p.nome,
        nomeStartup: startup(p),
        dataVencimento: formatarData(i.vencimento),
        valorAnuidade: formatarBRL(i.valorCentavos),
        cartaoFinal: i.cartaoFinal,
        urlPortalStripe: urls.portal(),
      }),
    )
  },
  async falha(p: Perfil, i: {cartaoFinal: string; data: Date}) {
    await enviarEmail(p.email, T.pagamentoRecusado({nome: p.nome, nomeStartup: startup(p), cartaoFinal: i.cartaoFinal, urlPortalStripe: urls.portal()}))
    await enviarEmail(
      await emailsDosAdmins(),
      T.alertaInadimplente({nome: p.nome, nomeStartup: startup(p), data: formatarData(i.data), urlAdminAssociado: urls.adminAssociado(p.id)}),
    )
  },
  async cancelada(p: Perfil, data: Date) {
    await enviarEmail(p.email, T.associacaoCancelada({nome: p.nome, nomeStartup: startup(p), urlAreaAssociado: urls.areaAssociado()}))
    await enviarEmail(
      await emailsDosAdmins(),
      T.alertaCancelamento({nome: p.nome, nomeStartup: startup(p), data: formatarData(data), urlAdminAssociado: urls.adminAssociado(p.id)}),
    )
  },
  async isencaoConcedida(p: Perfil, motivo: string) {
    await enviarEmail(p.email, T.isencaoConcedida({nome: p.nome, motivoIsencao: motivo, urlAreaAssociado: urls.areaAssociado()}))
  },
  async isencaoEncerrada(p: Perfil, motivo: string | null) {
    await enviarEmail(p.email, T.isencaoEncerrada({nome: p.nome, motivo, valorAnuidade: await valorAnuidade(), urlPagamento: urls.pagamento()}))
  },
  async exclusaoSolicitada(p: {nome: string; email: string}, pedido: Date, prazo: Date) {
    await enviarEmail(p.email, T.exclusaoRecebida({nome: p.nome, dataPedido: formatarData(pedido)}))
    await enviarEmail(
      await emailsDosAdmins(),
      T.alertaExclusao({
        nome: p.nome,
        email: p.email,
        dataPedido: formatarData(pedido),
        dataLimite: formatarData(prazo),
        urlAdmin: urls.adminExclusoes(),
      }),
    )
  },
}
