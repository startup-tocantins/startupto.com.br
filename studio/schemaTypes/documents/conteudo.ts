import {CalendarIcon} from '@sanity/icons/Calendar'
import {DocumentPdfIcon} from '@sanity/icons/DocumentPdf'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {HeartIcon} from '@sanity/icons/Heart'
import {StarIcon} from '@sanity/icons/Star'
import {UserIcon} from '@sanity/icons/User'
import {ComposeIcon} from '@sanity/icons/Compose'
import {defineField, defineType} from 'sanity'

export const CATEGORIAS_POST = [
  {title: 'Notícia', value: 'noticia'},
  {title: 'Edital', value: 'edital'},
  {title: 'Benefício', value: 'beneficio'},
]

export const paginaInstitucional = defineType({
  name: 'paginaInstitucional',
  title: 'Página institucional',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Endereço',
      type: 'slug',
      description: 'Endereços usados pelo site: quem-somos, manifesto, privacidade.',
      options: {source: 'titulo'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'dataAtualizacao',
      title: 'Data da última atualização',
      type: 'date',
      description: 'Exibida no topo da Política de Privacidade.',
    }),
    defineField({name: 'corpo', title: 'Texto', type: 'blockContent'}),
    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
  preview: {select: {title: 'titulo', subtitle: 'slug.current'}},
})

export const valor = defineType({
  name: 'valor',
  title: 'Valor',
  type: 'document',
  icon: HeartIcon,
  fields: [
    defineField({
      name: 'titulo',
      title: 'Valor',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'descricao', title: 'Descrição', type: 'text', rows: 3}),
    defineField({name: 'ordem', title: 'Ordem', type: 'number'}),
  ],
  orderings: [{title: 'Ordem', name: 'ordem', by: [{field: 'ordem', direction: 'asc'}]}],
  preview: {select: {title: 'titulo', subtitle: 'descricao'}},
})

export const membroDiretoria = defineType({
  name: 'membroDiretoria',
  title: 'Membro da Diretoria',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'nome',
      title: 'Nome completo',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'cargo',
      title: 'Cargo',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'foto',
      title: 'Foto',
      type: 'image',
      description: 'Opcional. Sem foto, o site mostra as iniciais do nome.',
      options: {hotspot: true},
    }),
    defineField({name: 'bio', title: 'Mini bio', type: 'text', rows: 8}),
    defineField({name: 'linkedin', title: 'LinkedIn (link)', type: 'url'}),
    defineField({
      name: 'ordem',
      title: 'Ordem de exibição',
      type: 'number',
      description: 'Menor número aparece primeiro. A Presidência deve ser 1.',
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [{title: 'Ordem', name: 'ordem', by: [{field: 'ordem', direction: 'asc'}]}],
  preview: {select: {title: 'nome', subtitle: 'cargo', media: 'foto'}},
})

export const post = defineType({
  name: 'post',
  title: 'Notícia, edital ou benefício',
  type: 'document',
  icon: ComposeIcon,
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Endereço',
      type: 'slug',
      options: {source: 'titulo', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'categoria',
      title: 'Categoria',
      type: 'string',
      options: {list: CATEGORIAS_POST, layout: 'radio', direction: 'horizontal'},
      initialValue: 'noticia',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'dataPublicacao',
      title: 'Data de publicação',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'capa',
      title: 'Imagem de capa',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Descrição da imagem', type: 'string'})],
    }),
    defineField({
      name: 'resumo',
      title: 'Resumo',
      type: 'text',
      rows: 3,
      description: 'Aparece nas listagens. Até 200 caracteres.',
      validation: (rule) => rule.max(200),
    }),
    defineField({name: 'corpo', title: 'Texto', type: 'blockContent'}),
    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
  orderings: [
    {
      title: 'Mais recentes',
      name: 'dataDesc',
      by: [{field: 'dataPublicacao', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'titulo', categoria: 'categoria', media: 'capa', data: 'dataPublicacao'},
    prepare({title, categoria, media, data}) {
      const cat = CATEGORIAS_POST.find((c) => c.value === categoria)?.title ?? ''
      const d = data ? new Date(data).toLocaleDateString('pt-BR') : ''
      return {title, subtitle: [cat, d].filter(Boolean).join(' · '), media}
    },
  },
})

export const evento = defineType({
  name: 'evento',
  title: 'Evento',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Endereço',
      type: 'slug',
      options: {source: 'titulo', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'inicio',
      title: 'Início',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'fim',
      title: 'Término',
      type: 'datetime',
      validation: (rule) =>
        rule.custom((fim, ctx) => {
          const inicio = (ctx.document as {inicio?: string})?.inicio
          if (fim && inicio && new Date(fim) < new Date(inicio)) {
            return 'O término deve ser depois do início.'
          }
          return true
        }),
    }),
    defineField({
      name: 'formato',
      title: 'Formato',
      type: 'string',
      options: {
        list: [
          {title: 'Presencial', value: 'presencial'},
          {title: 'Online', value: 'online'},
          {title: 'Híbrido', value: 'hibrido'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'presencial',
    }),
    defineField({
      name: 'local',
      title: 'Local',
      type: 'string',
      description: 'Ex.: Espaço GDX, Palmas – TO',
      hidden: ({document}) => document?.formato === 'online',
    }),
    defineField({
      name: 'cidade',
      title: 'Cidade',
      type: 'reference',
      to: [{type: 'cidade'}],
      hidden: ({document}) => document?.formato === 'online',
    }),
    defineField({name: 'linkInscricao', title: 'Link de inscrição', type: 'url'}),
    defineField({
      name: 'capa',
      title: 'Imagem de capa',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Descrição da imagem', type: 'string'})],
    }),
    defineField({
      name: 'resumo',
      title: 'Resumo',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(200),
    }),
    defineField({name: 'descricao', title: 'Descrição', type: 'blockContent'}),
    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
  orderings: [{title: 'Data', name: 'inicioDesc', by: [{field: 'inicio', direction: 'desc'}]}],
  preview: {
    select: {title: 'titulo', inicio: 'inicio', media: 'capa', local: 'local'},
    prepare({title, inicio, media, local}) {
      const d = inicio ? new Date(inicio).toLocaleDateString('pt-BR') : 'Sem data'
      return {title, subtitle: [d, local].filter(Boolean).join(' · '), media}
    },
  },
})

export const mantenedor = defineType({
  name: 'mantenedor',
  title: 'Mantenedor',
  type: 'document',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'nome',
      title: 'Nome',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'De preferência SVG ou PNG com fundo transparente.',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'link', title: 'Site', type: 'url'}),
    defineField({name: 'ordem', title: 'Ordem', type: 'number'}),
    defineField({
      name: 'ativo',
      title: 'Exibir no site',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  orderings: [{title: 'Ordem', name: 'ordem', by: [{field: 'ordem', direction: 'asc'}]}],
  preview: {
    select: {title: 'nome', media: 'logo', ativo: 'ativo'},
    prepare: ({title, media, ativo}) => ({
      title,
      media,
      subtitle: ativo === false ? 'Oculto' : 'Exibido',
    }),
  },
})

export const documentoPublico = defineType({
  name: 'documentoPublico',
  title: 'Documento público',
  type: 'document',
  icon: DocumentPdfIcon,
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'descricao', title: 'Descrição', type: 'text', rows: 2}),
    defineField({
      name: 'arquivo',
      title: 'Arquivo (PDF)',
      type: 'file',
      options: {accept: 'application/pdf'},
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'ordem', title: 'Ordem', type: 'number'}),
  ],
  orderings: [{title: 'Ordem', name: 'ordem', by: [{field: 'ordem', direction: 'asc'}]}],
  preview: {select: {title: 'titulo', subtitle: 'descricao'}},
})
