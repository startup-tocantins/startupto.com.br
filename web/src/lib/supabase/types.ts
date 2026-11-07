/** Tipos do banco (espelham supabase/migrations). Regerar com `supabase gen types` se o schema mudar. */
export type Modalidade = 'comunidade' | 'associado'
export type StatusAssociado =
  | 'comunidade'
  | 'pendente_aprovacao'
  | 'aguardando_pagamento'
  | 'ativo'
  | 'inadimplente'
  | 'recusado'
  | 'cancelado'
export type Categoria = 'fundador' | 'titular'
export type Papel = 'membro' | 'admin'
export type TipoDocumento = 'cpf' | 'cnpj'

export type Perfil = {
  id: string
  nome: string
  email: string
  whatsapp: string
  cidade: string
  tipo_documento: TipoDocumento | null
  documento: string | null
  startup_nome: string | null
  setor: string | null
  estagio: string | null
  site: string | null
  logo_path: string | null
  modalidade: Modalidade
  status: StatusAssociado
  categoria: Categoria
  isento: boolean
  motivo_isencao: string | null
  vitrine_opt_in: boolean
  aceite_estatuto_em: string | null
  aceite_privacidade_em: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  vencimento: string | null
  papel: Papel
  criado_em: string
  atualizado_em: string
}

export type Historico = {
  id: number
  perfil_id: string
  acao: string
  status_anterior: StatusAssociado | null
  status_novo: StatusAssociado | null
  autor_id: string | null
  observacao: string | null
  criado_em: string
}

export type Ata = {
  id: string
  titulo: string
  data_assembleia: string
  caminho: string
  criado_em: string
  criado_por: string | null
}

export type SolicitacaoExclusao = {
  id: string
  perfil_id: string | null
  nome: string
  email: string
  criado_em: string
  prazo: string
  concluida_em: string | null
  observacao: string | null
}

export type VitrineItem = {
  id: string
  nome_startup: string
  logo_path: string | null
  setor: string | null
  estagio: string | null
  cidade: string
  site: string | null
  categoria: Categoria
}

type Tabela<Row, Insert = Partial<Row>> = {
  Row: Row
  Insert: Insert
  Update: Partial<Row>
  Relationships: []
}

export type Database = {
  public: {
    Tables: {
      perfis: Tabela<Perfil, Omit<Perfil, 'criado_em' | 'atualizado_em' | 'modalidade' | 'status' | 'categoria' | 'isento' | 'papel' | 'vitrine_opt_in'> & Partial<Perfil>>
      historico_associado: Tabela<Historico, Omit<Historico, 'id' | 'criado_em'> & Partial<Historico>>
      configuracoes_privadas: Tabela<{chave: string; valor: string; atualizado_em: string; atualizado_por: string | null}>
      atas: Tabela<Ata, Omit<Ata, 'id' | 'criado_em'> & Partial<Ata>>
      solicitacoes_exclusao: Tabela<SolicitacaoExclusao, {perfil_id: string | null; nome: string; email: string}>
      stripe_eventos: Tabela<{id: string; tipo: string; recebido_em: string}, {id: string; tipo: string}>
    }
    Views: {
      vitrine: {Row: VitrineItem; Relationships: []}
    }
    Functions: Record<string, never>
    Enums: {
      modalidade: Modalidade
      status_associado: StatusAssociado
      categoria_associado: Categoria
      papel: Papel
      tipo_documento: TipoDocumento
    }
    CompositeTypes: Record<string, never>
  }
}
