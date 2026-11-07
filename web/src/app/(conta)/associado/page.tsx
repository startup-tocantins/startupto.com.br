import type {Metadata} from 'next'
import Link from 'next/link'
import {Aviso, BotaoLink, Container, Etiqueta, Ficha, IconeDocumento, IconeDownload, Selo} from '@/components/ui'
import {VitrineFicha} from '@/components/site/VitrineFicha'
import {getListas, tituloDe} from '@/lib/associados/listas'
import {exigirSessao} from '@/lib/associados/sessao'
import {DESCRICAO_STATUS, ROTULO_STATUS, formatarData} from '@/lib/associados/status'
import {logoPublicUrl} from '@/lib/supabase/vitrine'
import {createClient} from '@/lib/supabase/server'
import type {StatusAssociado} from '@/lib/supabase/types'
import {formatarDocumento, formatarWhatsapp} from '@/lib/validacao/documento'
import {sair} from '../acoes-auth'
import {CabecaConta} from '../_componentes/Cabeca'
import {FormExclusao} from '../_componentes/FormsArea'

export const metadata: Metadata = {title: 'Minha área', robots: {index: false}}

const TOM: Record<StatusAssociado, 'azul' | 'laranja' | 'buriti' | 'neutro' | 'erro'> = {
  comunidade: 'azul',
  pendente_aprovacao: 'laranja',
  aguardando_pagamento: 'laranja',
  ativo: 'buriti',
  inadimplente: 'erro',
  recusado: 'neutro',
  cancelado: 'neutro',
}

/** Página por usuário (sessão/banco): fora da validação de navegação instantânea. */
export const instant = false

export default async function AreaAssociadoPage({searchParams}: PageProps<'/associado'>) {
  const sp = await searchParams
  const {perfil: p} = await exigirSessao()
  const listas = await getListas()
  const supabase = await createClient()
  const {data: atas} =
    p.status === 'ativo' || p.papel === 'admin'
      ? await supabase.from('atas').select('id, titulo, data_assembleia').order('data_assembleia', {ascending: false})
      : {data: null}

  const logoUrl = logoPublicUrl(p.logo_path)
  const podeAssociar = ['comunidade', 'recusado', 'cancelado'].includes(p.status)

  return (
    <>
      <CabecaConta titulo={`Olá, ${p.nome.split(' ')[0]}`}>
        {DESCRICAO_STATUS[p.status]}
      </CabecaConta>
      <Container className="flex flex-col gap-10 py-12 sm:py-14">
        {sp.pagamento === 'confirmado' && (
          <Aviso tom="sucesso" titulo="Pagamento recebido">
            Obrigado! A confirmação chega em instantes e sua associação fica ativa. Se a situação abaixo ainda não
            mudou, atualize a página em um minuto.
          </Aviso>
        )}
        {sp.erro === 'sem-permissao' && <Aviso tom="atencao">Essa área é restrita à Diretoria.</Aviso>}
        {sp.erro === 'portal' && <Aviso tom="erro">Não conseguimos abrir o portal de pagamento agora. Tente de novo.</Aviso>}

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <Ficha className="p-6 sm:p-8" como="section">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-2xl font-extrabold text-azul-noite">Situação</h2>
              <Selo tom={TOM[p.status]}>{ROTULO_STATUS[p.status]}</Selo>
            </div>
            <Etiqueta
              className="mt-5"
              linhas={[
                {rotulo: 'Modalidade', valor: p.modalidade === 'associado' ? 'Associado' : 'Comunidade'},
                p.modalidade === 'associado' && {rotulo: 'Categoria', valor: p.categoria === 'fundador' ? 'Fundador' : 'Titular'},
                p.isento && {rotulo: 'Anuidade', valor: `Isento — ${p.motivo_isencao}`},
                !p.isento && p.vencimento && {rotulo: 'Vencimento', valor: formatarData(p.vencimento)},
              ]}
            />
            <div className="mt-6 flex flex-wrap gap-3">
              {p.status === 'aguardando_pagamento' && !p.isento && (
                <BotaoLink href="/associado/pagamento" tamanho="lg">
                  Pagar anuidade
                </BotaoLink>
              )}
              {p.status === 'inadimplente' && (
                <BotaoLink href="/associado/portal" tamanho="lg">
                  Atualizar cartão
                </BotaoLink>
              )}
              {p.stripe_customer_id && p.status !== 'inadimplente' && !p.isento && (
                <BotaoLink href="/associado/portal" variante="contorno">
                  Gerenciar pagamento
                </BotaoLink>
              )}
              {podeAssociar && (
                <BotaoLink href="/associado/associar" tamanho="lg">
                  {p.status === 'comunidade' ? 'Quero ser Associado' : 'Pedir associação novamente'}
                </BotaoLink>
              )}
              {p.papel === 'admin' && (
                <BotaoLink href="/admin" variante="secundario">
                  Painel da Diretoria
                </BotaoLink>
              )}
            </div>
          </Ficha>

          <Ficha className="p-6 sm:p-8" como="section">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-2xl font-extrabold text-azul-noite">Seus dados</h2>
              <Link href="/associado/perfil" className="font-semibold text-azul underline underline-offset-4">
                Editar
              </Link>
            </div>
            <Etiqueta
              className="mt-5"
              linhas={[
                {rotulo: 'Nome', valor: p.nome},
                {rotulo: 'E-mail', valor: p.email},
                {rotulo: 'WhatsApp', valor: formatarWhatsapp(p.whatsapp)},
                {rotulo: 'Cidade', valor: tituloDe(listas.cidades, p.cidade)},
                p.documento && {rotulo: p.tipo_documento === 'cnpj' ? 'CNPJ' : 'CPF', valor: formatarDocumento(p.documento)},
              ]}
            />
          </Ficha>
        </div>

        {p.modalidade === 'associado' && p.startup_nome && (
          <section aria-labelledby="vitrine-titulo">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 id="vitrine-titulo" className="font-display text-2xl font-extrabold text-azul-noite">
                  Seu card na Vitrine
                </h2>
                <p className="mt-1 font-texto text-[1.0625rem] text-tinta-suave">
                  {!p.vitrine_opt_in
                    ? 'Você não autorizou a exibição. O card abaixo é só uma prévia.'
                    : p.status === 'ativo'
                      ? 'É assim que sua startup aparece na Vitrine pública.'
                      : 'Prévia: o card aparece na Vitrine quando a associação estiver ativa.'}
                </p>
              </div>
              <Link href="/associado/perfil" className="font-semibold text-azul underline underline-offset-4">
                Editar card
              </Link>
            </div>
            <div className="mt-5 max-w-sm">
              <VitrineFicha
                listas={listas}
                card={{
                  id: p.id,
                  nome_startup: p.startup_nome,
                  logo_url: logoUrl,
                  setor: p.setor,
                  estagio: p.estagio,
                  cidade: p.cidade,
                  site: p.site,
                  categoria: p.categoria,
                }}
              />
            </div>
          </section>
        )}

        {atas && (
          <section aria-labelledby="atas-titulo">
            <h2 id="atas-titulo" className="font-display text-2xl font-extrabold text-azul-noite">
              Atas de Assembleia
            </h2>
            {atas.length === 0 ? (
              <p className="mt-2 font-texto text-[1.0625rem] text-tinta-suave">Nenhuma ata publicada ainda.</p>
            ) : (
              <ul className="mt-4 divide-y divide-linha rounded-ficha bg-prancha ring-1 ring-linha">
                {atas.map((a) => (
                  <li key={a.id}>
                    <a
                      href={`/associado/atas/${a.id}`}
                      className="flex min-h-14 items-center gap-3 px-5 py-3 hover:bg-azul-claro/50"
                    >
                      <IconeDocumento className="size-5 text-azul" />
                      <span className="flex-1">
                        <span className="font-semibold text-azul-noite">{a.titulo}</span>
                        <span className="ml-2 font-texto text-tinta-suave">{formatarData(a.data_assembleia)}</span>
                      </span>
                      <IconeDownload className="size-5 text-tinta-suave" />
                      <span className="sr-only">Baixar PDF</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        <section aria-labelledby="privacidade-titulo" className="border-t border-linha pt-8">
          <h2 id="privacidade-titulo" className="font-display text-xl font-extrabold text-azul-noite">
            Seus dados pessoais
          </h2>
          <p className="mt-2 max-w-[62ch] font-texto text-[1.0625rem] text-tinta-suave">
            Você pode pedir a exclusão dos seus dados a qualquer momento (LGPD, art. 18). Respondemos em até 15 dias.
            Veja a{' '}
            <Link href="/privacidade" className="text-azul underline underline-offset-2">
              Política de Privacidade
            </Link>
            .
          </p>
          <div className="mt-4 max-w-2xl">
            <FormExclusao />
          </div>
          <form action={sair} className="mt-8">
            <button type="submit" className="font-semibold text-azul underline underline-offset-4">
              Sair da conta
            </button>
          </form>
        </section>
      </Container>
    </>
  )
}
