import type {StatusAssociado} from '@/lib/supabase/types'

/** Rótulos de status sempre em texto (nunca só cor). */
export const ROTULO_STATUS: Record<StatusAssociado, string> = {
  comunidade: 'Comunidade',
  pendente_aprovacao: 'Aguardando aprovação',
  aguardando_pagamento: 'Aguardando pagamento',
  ativo: 'Ativo',
  inadimplente: 'Pagamento pendente',
  recusado: 'Pedido não aprovado',
  cancelado: 'Cancelado',
}

export const DESCRICAO_STATUS: Record<StatusAssociado, string> = {
  comunidade: 'Você faz parte da Comunidade (gratuita).',
  pendente_aprovacao: 'Seu pedido de associação está com a Diretoria para análise.',
  aguardando_pagamento: 'Seu pedido foi aprovado. Falta pagar a anuidade para ativar a associação.',
  ativo: 'Sua associação está ativa.',
  inadimplente: 'Não conseguimos cobrar a anuidade. Atualize o cartão para reativar a associação.',
  recusado: 'Seu pedido de associação não foi aprovado. Você continua na Comunidade.',
  cancelado: 'Sua associação foi cancelada. Você continua na Comunidade.',
}

export const formatarData = (iso: string | Date | null | undefined) =>
  iso
    ? new Intl.DateTimeFormat('pt-BR', {timeZone: 'America/Araguaina'}).format(
        typeof iso === 'string' ? new Date(iso.length === 10 ? `${iso}T12:00:00` : iso) : iso,
      )
    : '—'
