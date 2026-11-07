import {configuracoesSite} from './documents/configuracoesSite'
import {
  documentoPublico,
  evento,
  mantenedor,
  membroDiretoria,
  paginaInstitucional,
  post,
  valor,
} from './documents/conteudo'
import {cidade, estagio, setor} from './documents/listas'
import {blockContent} from './objects/blockContent'
import {seo} from './objects/seo'

export const SINGLETONS = ['configuracoesSite']

export const schemaTypes = [
  configuracoesSite,
  paginaInstitucional,
  valor,
  membroDiretoria,
  post,
  evento,
  mantenedor,
  documentoPublico,
  setor,
  estagio,
  cidade,
  blockContent,
  seo,
]
