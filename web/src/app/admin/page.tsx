import Link from 'next/link'
import {BotaoLink, Botao, Campo, Entrada, Selecao, Selo, EstadoVazio, IconeDownload} from '@/components/ui'
import {POR_PAGINA, buscarAssociados, filtrosDe} from '@/lib/associados/consulta'
import {getListas, tituloDe} from '@/lib/associados/listas'
import {ROTULO_STATUS, formatarData} from '@/lib/associados/status'
import {createAdminClient} from '@/lib/supabase/server'
import type {StatusAssociado} from '@/lib/supabase/types'

export const metadata = {title: 'Associados'}

const TOM: Record<StatusAssociado, 'azul' | 'laranja' | 'buriti' | 'neutro' | 'erro'> = {
  comunidade: 'azul', pendente_aprovacao: 'laranja', aguardando_pagamento: 'laranja', ativo: 'buriti',
  inadimplente: 'erro', recusado: 'neutro', cancelado: 'neutro',
}

async function contagens() {
  const db = createAdminClient()
  const status: StatusAssociado[] = ['pendente_aprovacao', 'aguardando_pagamento', 'ativo', 'inadimplente', 'comunidade']
  const res = await Promise.all(status.map((s) => db.from('perfis').select('id', {count: 'exact', head: true}).eq('status', s)))
  return status.map((s, i) => ({status: s, total: res[i].count ?? 0}))
}

/** Página por usuário (sessão/banco): fora da validação de navegação instantânea. */
export const instant = false

export default async function AdminAssociadosPage({searchParams}: PageProps<'/admin'>) {
  const sp = await searchParams
  const f = filtrosDe(sp)
  const [{associados, total}, listas, resumo] = await Promise.all([buscarAssociados(f), getListas(), contagens()])
  const paginas = Math.max(1, Math.ceil(total / POR_PAGINA))
  const qs = (extra: Record<string, string | number | undefined>) => {
    const p = new URLSearchParams()
    Object.entries({...f, ...extra}).forEach(([k, v]) => v !== undefined && v !== '' && k !== 'pagina' && p.set(k, String(v)))
    if (extra.pagina && extra.pagina !== 1) p.set('pagina', String(extra.pagina))
    return p.toString()
  }
  const filtrosAtivos = Boolean(f.q || f.status || f.modalidade || f.setor || f.cidade)

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-azul-noite">Associados</h1>
          <p className="mt-1 font-texto text-[1.0625rem] text-tinta-suave">
            {total} {total === 1 ? 'cadastro encontrado' : 'cadastros encontrados'}
            {filtrosAtivos ? ' com os filtros aplicados' : ''}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <BotaoLink href={`/admin/exportar?${qs({formato: 'xlsx'})}`} variante="contorno" tamanho="sm">
            <IconeDownload /> Exportar XLSX
          </BotaoLink>
          <BotaoLink href={`/admin/exportar?${qs({formato: 'csv'})}`} variante="contorno" tamanho="sm">
            <IconeDownload /> Exportar CSV
          </BotaoLink>
        </div>
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {resumo.map((r) => (
          <li key={r.status}>
            <Link
              href={`/admin?status=${r.status}`}
              aria-current={f.status === r.status ? 'true' : undefined}
              className="flex h-full flex-col rounded-ficha bg-prancha p-4 ring-1 ring-linha hover:ring-azul aria-[current=true]:ring-2 aria-[current=true]:ring-azul"
            >
              <span className="font-display text-3xl font-extrabold text-azul-noite">{r.total}</span>
              <span className="text-sm font-semibold text-tinta-suave">{ROTULO_STATUS[r.status]}</span>
            </Link>
          </li>
        ))}
      </ul>

      <form method="get" className="grid gap-4 rounded-ficha bg-prancha p-5 ring-1 ring-linha md:grid-cols-[2fr_repeat(4,1fr)_auto] md:items-end">
        <Campo id="q" rotulo="Buscar">
          <Entrada id="q" name="q" type="search" placeholder="Nome, e-mail, startup ou documento" defaultValue={f.q} />
        </Campo>
        <Campo id="status" rotulo="Situação">
          <Selecao id="status" name="status" defaultValue={f.status ?? ''}>
            <option value="">Todas</option>
            {(Object.keys(ROTULO_STATUS) as StatusAssociado[]).map((s) => (
              <option key={s} value={s}>
                {ROTULO_STATUS[s]}
              </option>
            ))}
          </Selecao>
        </Campo>
        <Campo id="modalidade" rotulo="Modalidade">
          <Selecao id="modalidade" name="modalidade" defaultValue={f.modalidade ?? ''}>
            <option value="">Todas</option>
            <option value="comunidade">Comunidade</option>
            <option value="associado">Associado</option>
          </Selecao>
        </Campo>
        <Campo id="setor" rotulo="Setor">
          <Selecao id="setor" name="setor" defaultValue={f.setor ?? ''}>
            <option value="">Todos</option>
            {listas.setores.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.titulo}
              </option>
            ))}
          </Selecao>
        </Campo>
        <Campo id="cidade" rotulo="Cidade">
          <Selecao id="cidade" name="cidade" defaultValue={f.cidade ?? ''}>
            <option value="">Todas</option>
            {listas.cidades.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.titulo}
              </option>
            ))}
          </Selecao>
        </Campo>
        <div className="flex gap-2">
          <Botao type="submit" variante="secundario">
            Filtrar
          </Botao>
          {filtrosAtivos && (
            <BotaoLink href="/admin" variante="fantasma">
              Limpar
            </BotaoLink>
          )}
        </div>
      </form>

      {associados.length === 0 ? (
        <EstadoVazio titulo={filtrosAtivos ? 'Nenhum cadastro com esses filtros' : 'Nenhum cadastro ainda'}>
          {filtrosAtivos ? 'Tente remover algum filtro.' : 'Os cadastros feitos pelo site aparecem aqui.'}
        </EstadoVazio>
      ) : (
        <div className="overflow-x-auto rounded-ficha bg-prancha ring-1 ring-linha">
          <table className="w-full min-w-[52rem] text-left text-sm">
            <thead className="border-b border-linha bg-papel text-xs uppercase tracking-[0.06em] text-tinta-fraca">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Nome / startup</th>
                <th scope="col" className="px-4 py-3 font-semibold">Situação</th>
                <th scope="col" className="px-4 py-3 font-semibold">Setor</th>
                <th scope="col" className="px-4 py-3 font-semibold">Cidade</th>
                <th scope="col" className="px-4 py-3 font-semibold">Vencimento</th>
                <th scope="col" className="px-4 py-3 font-semibold">Cadastro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-linha">
              {associados.map((p) => (
                <tr key={p.id} className="hover:bg-azul-claro/40">
                  <td className="px-4 py-3">
                    <Link href={`/admin/associados/${p.id}`} className="font-semibold text-azul-noite underline-offset-4 hover:underline">
                      {p.nome}
                    </Link>
                    <span className="block text-tinta-suave">{p.startup_nome ?? p.email}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex flex-wrap gap-1">
                      <Selo tom={TOM[p.status]}>{ROTULO_STATUS[p.status]}</Selo>
                      {p.isento && <Selo tom="neutro">Isento</Selo>}
                      {p.categoria === 'fundador' && <Selo tom="laranja">Fundador</Selo>}
                    </span>
                  </td>
                  <td className="px-4 py-3">{p.setor ? tituloDe(listas.setores, p.setor) : '—'}</td>
                  <td className="px-4 py-3">{tituloDe(listas.cidades, p.cidade)}</td>
                  <td className="px-4 py-3">{p.isento ? 'Isento' : formatarData(p.vencimento)}</td>
                  <td className="px-4 py-3">{formatarData(p.criado_em)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {paginas > 1 && (
        <nav aria-label="Paginação" className="flex items-center justify-between gap-4">
          {f.pagina! > 1 ? (
            <BotaoLink href={`/admin?${qs({pagina: f.pagina! - 1})}`} variante="contorno" tamanho="sm">
              ← Anterior
            </BotaoLink>
          ) : (
            <span />
          )}
          <span className="text-sm text-tinta-suave">
            Página {f.pagina} de {paginas}
          </span>
          {f.pagina! < paginas ? (
            <BotaoLink href={`/admin?${qs({pagina: f.pagina! + 1})}`} variante="contorno" tamanho="sm">
              Próxima →
            </BotaoLink>
          ) : (
            <span />
          )}
        </nav>
      )}
    </div>
  )
}
