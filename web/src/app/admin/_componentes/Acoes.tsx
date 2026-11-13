'use client'

import {useActionState} from 'react'
import {useFormStatus} from 'react-dom'
import {AreaTexto, Aviso, Botao, Campo, Entrada, Selecao, descricaoCampo} from '@/components/ui'
import type {EstadoForm} from '@/lib/associados/esquemas'
import {
  concluirExclusao,
  definirCategoria,
  enviarAta,
  marcarIsento,
  revogarIsencao,
  salvarGrupoWhatsapp,
} from '../acoes'

type Acao = (s: EstadoForm, fd: FormData) => Promise<EstadoForm>

function Enviar({children, variante, pendente = 'Salvando…'}: {children: React.ReactNode; variante?: 'primario' | 'secundario' | 'contorno' | 'perigo'; pendente?: string}) {
  const {pending} = useFormStatus()
  return (
    <Botao type="submit" variante={variante} carregando={pending}>
      {pending ? pendente : children}
    </Botao>
  )
}

function Resultado({estado}: {estado: EstadoForm}) {
  if (!estado.mensagem) return null
  return <Aviso tom={estado.ok ? 'sucesso' : 'erro'}>{estado.mensagem}</Aviso>
}

function useAcao(acao: Acao) {
  return useActionState<EstadoForm, FormData>(acao, {})
}

export function FormCategoria({id, atual}: {id: string; atual: 'fundador' | 'titular'}) {
  const [estado, acao] = useAcao(definirCategoria)
  return (
    <form action={acao} className="flex flex-col gap-3">
      <input type="hidden" name="id" value={id} />
      <Campo id="categoria" rotulo="Categoria (Estatuto, art. 12)" ajuda="Fundadores assinaram a ata de fundação de 24/08/2024. Ganham selo na Vitrine.">
        <Selecao id="categoria" name="categoria" defaultValue={atual} aria-describedby="categoria-ajuda">
          <option value="titular">Titular</option>
          <option value="fundador">Fundador</option>
        </Selecao>
      </Campo>
      <div>
        <Enviar variante="contorno">Salvar categoria</Enviar>
      </div>
      <Resultado estado={estado} />
    </form>
  )
}

export function FormIsencao({id, isento, motivoAtual}: {id: string; isento: boolean; motivoAtual: string | null}) {
  const [estadoM, acaoM] = useAcao(marcarIsento)
  const [estadoR, acaoR] = useAcao(revogarIsencao)
  if (isento) {
    return (
      <form action={acaoR} className="flex flex-col gap-3">
        <input type="hidden" name="id" value={id} />
        <p className="text-base">
          Isento da anuidade: <strong>{motivoAtual}</strong>
        </p>
        <Campo id="motivo-revogacao" rotulo="Motivo do encerramento (opcional)" ajuda="Ex.: fim do mandato na Diretoria. A pessoa recebe o link de pagamento por e-mail.">
          <Entrada id="motivo-revogacao" name="motivo" aria-describedby="motivo-revogacao-ajuda" />
        </Campo>
        <div>
          <Enviar variante="contorno" pendente="Encerrando…">
            Encerrar isenção
          </Enviar>
        </div>
        <Resultado estado={estadoR} />
      </form>
    )
  }
  const erro = estadoM.erros?.motivo
  return (
    <form action={acaoM} className="flex flex-col gap-3">
      <input type="hidden" name="id" value={id} />
      <Campo id="motivo-isencao" rotulo="Motivo da isenção" erro={erro} ajuda="Membros da Diretoria são isentos (Estatuto, art. 26). A associação fica ativa sem cobrança.">
        <Entrada
          id="motivo-isencao"
          name="motivo"
          defaultValue="Diretoria — Estatuto, art. 26"
          aria-invalid={erro ? true : undefined}
          aria-describedby={descricaoCampo('motivo-isencao', Boolean(erro), true)}
        />
      </Campo>
      <div>
        <Enviar variante="contorno" pendente="Registrando…">
          Marcar como isento
        </Enviar>
      </div>
      <Resultado estado={estadoM} />
    </form>
  )
}

export function FormGrupoWhatsapp({atual}: {atual: string}) {
  const [estado, acao] = useAcao(salvarGrupoWhatsapp)
  const erro = estado.erros?.link
  return (
    <form action={acao} className="flex max-w-2xl flex-col gap-4">
      <Campo id="link" rotulo="Link de convite do grupo Startup Tocantins" erro={erro} ajuda="Enviado por e-mail a quem se cadastra na Comunidade. Fica guardado só no banco de dados, nunca no site público.">
        <Entrada
          id="link"
          name="link"
          type="url"
          placeholder="https://chat.whatsapp.com/…"
          defaultValue={estado.valores?.link ?? atual}
          aria-invalid={erro ? true : undefined}
          aria-describedby={descricaoCampo('link', Boolean(erro), true)}
        />
      </Campo>
      <div>
        <Enviar>Salvar link</Enviar>
      </div>
      <Resultado estado={estado} />
    </form>
  )
}

export function FormAta() {
  const [estado, acao] = useAcao(enviarAta)
  const e = estado.erros ?? {}
  return (
    <form action={acao} className="flex max-w-2xl flex-col gap-4">
      <Campo id="titulo" rotulo="Título" erro={e.titulo} obrigatorio>
        <Entrada id="titulo" name="titulo" placeholder="Ata da Assembleia Geral Ordinária" defaultValue={estado.ok ? '' : estado.valores?.titulo} aria-invalid={e.titulo ? true : undefined} />
      </Campo>
      <Campo id="data_assembleia" rotulo="Data da Assembleia" erro={e.data_assembleia} obrigatorio>
        <Entrada id="data_assembleia" name="data_assembleia" type="date" defaultValue={estado.ok ? '' : estado.valores?.data_assembleia} aria-invalid={e.data_assembleia ? true : undefined} />
      </Campo>
      <Campo id="arquivo" rotulo="Arquivo PDF" erro={e.arquivo} obrigatorio ajuda="Até 20 MB. Só associados ativos e a Diretoria conseguem baixar.">
        <Entrada id="arquivo" name="arquivo" type="file" accept="application/pdf" aria-invalid={e.arquivo ? true : undefined} className="py-2" />
      </Campo>
      <div>
        <Enviar pendente="Enviando…">Publicar ata</Enviar>
      </div>
      <Resultado estado={estado} />
    </form>
  )
}

export function FormConcluirExclusao({id}: {id: string}) {
  const [estado, acao] = useAcao(concluirExclusao)
  if (estado.ok) return <Resultado estado={estado} />
  return (
    <form action={acao} className="flex flex-col gap-3">
      <input type="hidden" name="id" value={id} />
      <Campo id={`obs-${id}`} rotulo="Observação (o que foi excluído e o que precisou ser mantido)">
        <AreaTexto id={`obs-${id}`} name="observacao" rows={2} />
      </Campo>
      <div>
        <Enviar variante="contorno" pendente="Concluindo…">
          Marcar como concluído
        </Enviar>
      </div>
      <Resultado estado={estado} />
    </form>
  )
}
