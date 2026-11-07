import {defineQuery} from 'next-sanity'
import type {PortableTextBlock} from 'next-sanity'
import {buscar} from './live'

// ---------- Tipos ----------
export type Imagem = {
  asset?: {_ref: string}
  hotspot?: {x: number; y: number}
  crop?: unknown
  alt?: string
}

export type Configuracoes = {
  nomeOficial: string
  cnpj?: string
  cidade?: string
  email?: string
  whatsapp?: string
  instagram?: string
  linkedin?: string
  heroTitulo?: string
  introducao?: PortableTextBlock[]
  missaoCurta?: string
  missaoLonga?: string
  visao?: string
}

export type Pagina = {
  titulo: string
  dataAtualizacao?: string
  corpo?: PortableTextBlock[]
  seo?: Seo
}

export type Seo = {titulo?: string; descricao?: string; imagem?: Imagem}

export type Valor = {_id: string; titulo: string; descricao?: string}

export type Membro = {
  _id: string
  nome: string
  cargo: string
  foto?: Imagem
  bio?: string
  linkedin?: string
}

export type Categoria = 'noticia' | 'edital' | 'beneficio'

export type PostResumo = {
  _id: string
  titulo: string
  slug: string
  categoria: Categoria
  dataPublicacao: string
  resumo?: string
  capa?: Imagem
}

export type Post = PostResumo & {corpo?: PortableTextBlock[]; seo?: Seo}

export type EventoResumo = {
  _id: string
  titulo: string
  slug: string
  inicio: string
  fim?: string
  formato?: 'presencial' | 'online' | 'hibrido'
  local?: string
  cidade?: string
  linkInscricao?: string
  resumo?: string
  capa?: Imagem
}

export type Evento = EventoResumo & {descricao?: PortableTextBlock[]; seo?: Seo}

export type Mantenedor = {_id: string; nome: string; logo?: Imagem; link?: string}

export type Documento = {
  _id: string
  titulo: string
  descricao?: string
  url?: string
  tamanho?: number
}

export type ItemLista = {titulo: string; slug: string}

// ---------- Consultas ----------
const CONFIG = defineQuery(`*[_id == "configuracoesSite"][0]{
  nomeOficial, cnpj, cidade, email, whatsapp, instagram, linkedin,
  heroTitulo, introducao, missaoCurta, missaoLonga, visao
}`)

const PAGINA = defineQuery(`*[_type == "paginaInstitucional" && slug.current == $slug][0]{
  titulo, dataAtualizacao, corpo, seo
}`)

const VALORES = defineQuery(`*[_type == "valor"] | order(ordem asc){_id, titulo, descricao}`)

const DIRETORIA = defineQuery(
  `*[_type == "membroDiretoria"] | order(ordem asc){_id, nome, cargo, foto, bio, linkedin}`,
)

const POST_CAMPOS = `_id, titulo, "slug": slug.current, categoria, dataPublicacao, resumo, capa`

const POSTS = defineQuery(`*[_type == "post" && defined(slug.current)
  && dataPublicacao <= now()] | order(dataPublicacao desc){${POST_CAMPOS}}`)

const POST = defineQuery(`*[_type == "post" && slug.current == $slug][0]{
  ${POST_CAMPOS}, corpo, seo
}`)

const EVENTO_CAMPOS = `_id, titulo, "slug": slug.current, inicio, fim, formato, local,
  "cidade": cidade->titulo, linkInscricao, resumo, capa`

const EVENTOS = defineQuery(
  `*[_type == "evento" && defined(slug.current)] | order(inicio asc){${EVENTO_CAMPOS}}`,
)

const EVENTO = defineQuery(`*[_type == "evento" && slug.current == $slug][0]{
  ${EVENTO_CAMPOS}, descricao, seo
}`)

const MANTENEDORES = defineQuery(
  `*[_type == "mantenedor" && ativo != false] | order(ordem asc, nome asc){_id, nome, logo, link}`,
)

const DOCUMENTOS = defineQuery(`*[_type == "documentoPublico"] | order(ordem asc){
  _id, titulo, descricao, "url": arquivo.asset->url, "tamanho": arquivo.asset->size
}`)

const LISTAS = defineQuery(`{
  "setores": *[_type == "setor"] | order(ordem asc){titulo, "slug": slug.current},
  "estagios": *[_type == "estagio"] | order(ordem asc){titulo, "slug": slug.current},
  "cidades": *[_type == "cidade"] | order(titulo asc){titulo, "slug": slug.current}
}`)

// ---------- Funções ----------
const CONFIG_PADRAO: Configuracoes = {nomeOficial: 'Associação Tocantinense de Startups'}

export const getConfiguracoes = async () =>
  (await buscar<Configuracoes | null>(CONFIG)) ?? CONFIG_PADRAO
export const getPagina = (slug: string) => buscar<Pagina | null>(PAGINA, {slug})
export const getValores = () => buscar<Valor[]>(VALORES)
export const getDiretoria = () => buscar<Membro[]>(DIRETORIA)
export const getPosts = () => buscar<PostResumo[]>(POSTS)
export const getPost = (slug: string) => buscar<Post | null>(POST, {slug})
export const getEventos = () => buscar<EventoResumo[]>(EVENTOS)
export const getEvento = (slug: string) => buscar<Evento | null>(EVENTO, {slug})
export const getMantenedores = () => buscar<Mantenedor[]>(MANTENEDORES)
export const getDocumentos = () => buscar<Documento[]>(DOCUMENTOS)
export const getListas = () =>
  buscar<{setores: ItemLista[]; estagios: ItemLista[]; cidades: ItemLista[]}>(LISTAS)

export const CATEGORIAS: Record<Categoria, {singular: string; plural: string}> = {
  noticia: {singular: 'Notícia', plural: 'Notícias'},
  edital: {singular: 'Edital', plural: 'Editais'},
  beneficio: {singular: 'Benefício', plural: 'Benefícios'},
}
