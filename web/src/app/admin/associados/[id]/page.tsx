import Link from 'next/link'
import {notFound} from 'next/navigation'
import Image from 'next/image'
import {Etiqueta, Ficha, Selo} from '@/components/ui'
import {getListas, tituloDe} from '@/lib/associados/listas'
import {ROTULO_STATUS, formatarData} from '@/lib/associados/status'
import {createAdminClient} from '@/lib/supabase/server'
import type {Historico, Perfil} from '@/lib/supabase/types'
import {logoPublicUrl} from '@/lib/supabase/vitrine'
import {formatarDocumento, formatarWhatsapp} from '@/lib/validacao/documento'
import {DecisaoPedido, FormCategoria, FormIsencao} from '../../_componentes/Acoes'

const ACOES: Record<string, string> = {
  cadastro_comunidade: 'Cadastro na Comunidade',
  pedido_associacao: 'Pedido de associação',
  aprovado: 'Pedido aprovado',
  recusado: 'Pedido recusado',
  pagamento_confirmado: 'Pagamento confirmado',
  pagamento_recusado: 'Pagamento não aprovado',
  assinatura_cancelada: 'Assinatura cancelada',
  isencao_concedida: 'Isenção concedida',
  isencao_revogada: 'Isenção encerrada',
  categoria: 'Categoria alterada',
}

export default async function AdminAssociadoPage({params}: PageProps<'/admin/associados/[id]'>) {
  const {id} = await params
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound()
  const db = createAdminClient()
  const [{data: perfil}, {data: historico}, listas] = await Promise.all([
    db.from('perfis').select('*').eq('id', id).maybeSingle(),
    db.from('historico_associado').select('*').eq('perfil_id', id).order('criado_em', {ascending: false}),
    getListas(),
  ])
  if (!perfil) notFound()
  const p = perfil as Perfil
  const logo = logoPublicUrl(p.logo_path)
  const stripeModo = process.env.STRIPE_SECRET_KEY?.startsWith('sk_live') ? '' : 'test/'

  return (
    <div className="flex flex-col gap-8">
      <Link href="/admin" className="font-semibold text-azul underline underline-offset-4">
        ← Todos os associados
      </Link>
      <div className="flex flex-wrap items-start gap-5">
        {logo && (
          <Image src={logo} alt="" width={72} height={72} className="size-18 rounded-[4px] bg-white object-contain p-1.5 ring-1 ring-linha" />
        )}
        <div>
          <h1 className="font-display text-3xl font-extrabold text-azul-noite">{p.nome}</h1>
          {p.startup_nome && <p className="font-texto text-xl text-tinta-suave">{p.startup_nome}</p>}
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Selo tom={p.status === 'ativo' ? 'buriti' : p.status === 'inadimplente' ? 'erro' : 'laranja'}>{ROTULO_STATUS[p.status]}</Selo>
            <Selo tom="azul">{p.modalidade === 'associado' ? 'Associado' : 'Comunidade'}</Selo>
            {p.categoria === 'fundador' && <Selo tom="laranja">Fundador</Selo>}
            {p.isento && <Selo tom="neutro">Isento</Selo>}
            {p.papel === 'admin' && <Selo tom="neutro">Admin</Selo>}
          </div>
        </div>
      </div>

      {p.status === 'pendente_aprovacao' && (
        <Ficha className="border-l-4 border-laranja p-6" como="section">
          <h2 className="font-display text-xl font-extrabold text-azul-noite">Pedido aguardando análise</h2>
          <p className="mb-4 mt-1 font-texto text-[1.0625rem] text-tinta-suave">
            Ao aprovar, a pessoa recebe por e-mail o link para pagar a anuidade. Ao recusar, ela continua na Comunidade.
          </p>
          <DecisaoPedido id={p.id} />
        </Ficha>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Ficha className="p-6" como="section">
          <h2 className="font-display text-xl font-extrabold text-azul-noite">Cadastro</h2>
          <Etiqueta
            className="mt-4"
            linhas={[
              {rotulo: 'E-mail', valor: <a className="text-azul underline" href={`mailto:${p.email}`}>{p.email}</a>},
              {rotulo: 'WhatsApp', valor: <a className="text-azul underline" href={`https://wa.me/55${p.whatsapp}`} target="_blank" rel="noreferrer">{formatarWhatsapp(p.whatsapp)}</a>},
              {rotulo: 'Cidade', valor: tituloDe(listas.cidades, p.cidade)},
              p.documento && {rotulo: p.tipo_documento === 'cnpj' ? 'CNPJ' : 'CPF', valor: formatarDocumento(p.documento)},
              p.setor && {rotulo: 'Setor', valor: tituloDe(listas.setores, p.setor)},
              p.estagio && {rotulo: 'Estágio', valor: tituloDe(listas.estagios, p.estagio)},
              p.site && {rotulo: 'Site', valor: <a className="text-azul underline" href={p.site} target="_blank" rel="noreferrer">{p.site}</a>},
              {rotulo: 'Vitrine', valor: p.vitrine_opt_in ? 'Autorizou exibição' : 'Não autorizou'},
              {rotulo: 'Privacidade', valor: `Aceita em ${formatarData(p.aceite_privacidade_em)}`},
              p.aceite_estatuto_em && {rotulo: 'Adesão', valor: `Estatuto e Regimento aceitos em ${formatarData(p.aceite_estatuto_em)}`},
              {rotulo: 'Cadastro', valor: formatarData(p.criado_em)},
            ]}
          />
        </Ficha>

        <Ficha className="p-6" como="section">
          <h2 className="font-display text-xl font-extrabold text-azul-noite">Anuidade</h2>
          <Etiqueta
            className="mt-4"
            linhas={[
              {rotulo: 'Situação', valor: ROTULO_STATUS[p.status]},
              {rotulo: 'Vencimento', valor: p.isento ? 'Isento' : formatarData(p.vencimento)},
              p.stripe_customer_id && {
                rotulo: 'Stripe',
                valor: (
                  <a className="text-azul underline" href={`https://dashboard.stripe.com/${stripeModo}customers/${p.stripe_customer_id}`} target="_blank" rel="noreferrer">
                    Ver cliente no Stripe
                  </a>
                ),
              },
            ]}
          />
          {p.modalidade === 'associado' && (
            <div className="mt-6 flex flex-col gap-6 border-t border-linha pt-6">
              <FormCategoria id={p.id} atual={p.categoria} />
              <div className="border-t border-linha pt-6">
                <FormIsencao id={p.id} isento={p.isento} motivoAtual={p.motivo_isencao} />
              </div>
            </div>
          )}
        </Ficha>
      </div>

      <section aria-labelledby="historico">
        <h2 id="historico" className="font-display text-xl font-extrabold text-azul-noite">
          Histórico
        </h2>
        {!historico?.length ? (
          <p className="mt-2 font-texto text-tinta-suave">Sem registros.</p>
        ) : (
          <ol className="mt-4 flex flex-col gap-0 border-l-2 border-linha pl-5">
            {(historico as Historico[]).map((h) => (
              <li key={h.id} className="relative pb-5 last:pb-0">
                <span className="absolute -left-[1.6rem] top-1.5 size-2.5 rounded-full bg-azul" aria-hidden="true" />
                <p className="font-semibold text-azul-noite">
                  {ACOES[h.acao] ?? h.acao}
                  {h.status_novo && <span className="font-normal text-tinta-suave"> → {ROTULO_STATUS[h.status_novo]}</span>}
                </p>
                <p className="text-sm text-tinta-suave">{new Date(h.criado_em).toLocaleString('pt-BR', {timeZone: 'America/Araguaina'})}</p>
                {h.observacao && <p className="mt-1 font-texto text-[1.0625rem]">{h.observacao}</p>}
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  )
}
