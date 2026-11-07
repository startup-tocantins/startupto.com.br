import ExcelJS from 'exceljs'
import {NextResponse, type NextRequest} from 'next/server'
import {buscarAssociados, filtrosDe} from '@/lib/associados/consulta'
import {getListas, tituloDe} from '@/lib/associados/listas'
import {getSessao} from '@/lib/associados/sessao'
import {ROTULO_STATUS, formatarData} from '@/lib/associados/status'
import {formatarDocumento, formatarWhatsapp} from '@/lib/validacao/documento'

const COLUNAS = [
  'Nome', 'E-mail', 'WhatsApp', 'Cidade', 'Documento', 'Startup', 'Setor', 'Estágio', 'Site',
  'Modalidade', 'Situação', 'Categoria', 'Isento', 'Motivo da isenção', 'Vitrine', 'Vencimento', 'Cadastro',
]

function csvCelula(v: string) {
  return /[";\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v
}

export async function GET(req: NextRequest) {
  const sessao = await getSessao()
  if (sessao?.perfil?.papel !== 'admin') return NextResponse.json({erro: 'Sem permissão'}, {status: 403})

  const sp = Object.fromEntries(req.nextUrl.searchParams)
  const formato = sp.formato === 'xlsx' ? 'xlsx' : 'csv'
  const [{associados}, listas] = await Promise.all([buscarAssociados(filtrosDe(sp), {todos: true}), getListas()])

  const linhas = associados.map((p) => [
    p.nome,
    p.email,
    formatarWhatsapp(p.whatsapp),
    tituloDe(listas.cidades, p.cidade),
    p.documento ? formatarDocumento(p.documento) : '',
    p.startup_nome ?? '',
    p.setor ? tituloDe(listas.setores, p.setor) : '',
    p.estagio ? tituloDe(listas.estagios, p.estagio) : '',
    p.site ?? '',
    p.modalidade === 'associado' ? 'Associado' : 'Comunidade',
    ROTULO_STATUS[p.status],
    p.categoria === 'fundador' ? 'Fundador' : 'Titular',
    p.isento ? 'Sim' : 'Não',
    p.motivo_isencao ?? '',
    p.vitrine_opt_in ? 'Autorizou' : 'Não autorizou',
    p.vencimento ? formatarData(p.vencimento) : '',
    formatarData(p.criado_em),
  ])

  const data = new Date().toISOString().slice(0, 10)
  if (formato === 'csv') {
    const corpo = [COLUNAS, ...linhas].map((l) => l.map((c) => csvCelula(String(c))).join(';')).join('\r\n')
    return new NextResponse(`﻿${corpo}`, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="associados-${data}.csv"`,
        'Cache-Control': 'no-store',
      },
    })
  }

  const wb = new ExcelJS.Workbook()
  wb.creator = 'Associação Tocantinense de Startups'
  const ws = wb.addWorksheet('Associados', {views: [{state: 'frozen', ySplit: 1}]})
  ws.addRow(COLUNAS)
  ws.getRow(1).font = {bold: true, color: {argb: 'FFFFFFFF'}}
  ws.getRow(1).fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'FF0C4D9F'}}
  linhas.forEach((l) => ws.addRow(l))
  ws.columns.forEach((c, i) => {
    c.width = Math.min(40, Math.max(COLUNAS[i].length + 2, ...linhas.map((l) => String(l[i]).length + 2)))
  })
  ws.autoFilter = {from: {row: 1, column: 1}, to: {row: 1, column: COLUNAS.length}}
  const buffer = await wb.xlsx.writeBuffer()
  return new NextResponse(new Uint8Array(buffer as ArrayBuffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="associados-${data}.xlsx"`,
      'Cache-Control': 'no-store',
    },
  })
}
