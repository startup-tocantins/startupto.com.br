import {EstadoVazio, Ficha, Selo} from '@/components/ui'
import {formatarData} from '@/lib/associados/status'
import {createAdminClient} from '@/lib/supabase/server'
import {FormConcluirExclusao} from '../_componentes/Acoes'
import {exigirAdmin} from '@/lib/associados/sessao'

export const metadata = {title: 'Pedidos de exclusão (LGPD)'}

/** Página por usuário (sessão/banco): fora da validação de navegação instantânea. */
export const instant = false

export default async function AdminExclusoesPage() {
  // A checagem do layout não protege a página (renderizam em paralelo): cada página verifica.
  await exigirAdmin()
  const {data: pedidos} = await createAdminClient()
    .from('solicitacoes_exclusao')
    .select('*')
    .order('concluida_em', {ascending: true, nullsFirst: true})
    .order('criado_em', {ascending: false})
  const hoje = new Date().toISOString().slice(0, 10)
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-azul-noite">Pedidos de exclusão de dados</h1>
        <p className="mt-1 max-w-[62ch] text-base text-tinta-suave">
          Prazo de resposta: 15 dias (LGPD, art. 18). Antes de excluir, verifique o que precisa ser mantido por
          obrigação legal (registros contábeis e fiscais) e cancele a assinatura no Stripe, se houver. A exclusão da
          conta é feita no painel do Supabase (Authentication → Users).
        </p>
      </div>
      {!pedidos?.length ? (
        <EstadoVazio titulo="Nenhum pedido de exclusão" />
      ) : (
        <ul className="flex flex-col gap-4">
          {pedidos.map((p) => (
            <li key={p.id}>
              <Ficha className="p-5" como="div">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-azul-noite">
                    {p.nome} <span className="font-normal text-tinta-suave">· {p.email}</span>
                  </p>
                  {p.concluida_em ? (
                    <Selo tom="buriti">Concluído em {formatarData(p.concluida_em)}</Selo>
                  ) : (
                    <Selo tom={p.prazo < hoje ? 'erro' : 'laranja'}>
                      {p.prazo < hoje ? 'Prazo vencido' : 'Prazo'}: {formatarData(p.prazo)}
                    </Selo>
                  )}
                </div>
                <p className="mt-1 text-sm text-tinta-suave">Pedido em {formatarData(p.criado_em)}</p>
                {p.concluida_em ? (
                  p.observacao && <p className="mt-2 ">{p.observacao}</p>
                ) : (
                  <div className="mt-4">
                    <FormConcluirExclusao id={p.id} />
                  </div>
                )}
              </Ficha>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
