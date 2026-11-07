import {PinIcon} from '@sanity/icons/Pin'
import {TagIcon} from '@sanity/icons/Tag'
import {TrendUpwardIcon} from '@sanity/icons/TrendUpward'
import {defineField, defineType} from 'sanity'

const camposLista = [
  defineField({
    name: 'titulo',
    title: 'Nome',
    type: 'string',
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: 'slug',
    title: 'Identificador',
    type: 'slug',
    description: 'Não altere depois de criado: os cadastros de associados usam este valor.',
    options: {source: 'titulo'},
    validation: (rule) => rule.required(),
  }),
  defineField({name: 'ordem', title: 'Ordem', type: 'number'}),
]

export const setor = defineType({
  name: 'setor',
  title: 'Setor',
  type: 'document',
  icon: TagIcon,
  fields: camposLista,
  orderings: [{title: 'Ordem', name: 'ordem', by: [{field: 'ordem', direction: 'asc'}]}],
})

export const estagio = defineType({
  name: 'estagio',
  title: 'Estágio',
  type: 'document',
  icon: TrendUpwardIcon,
  fields: camposLista,
  orderings: [{title: 'Ordem', name: 'ordem', by: [{field: 'ordem', direction: 'asc'}]}],
})

export const cidade = defineType({
  name: 'cidade',
  title: 'Cidade',
  type: 'document',
  icon: PinIcon,
  fields: [
    ...camposLista.filter((f) => f.name !== 'ordem'),
    defineField({name: 'codigoIbge', title: 'Código IBGE', type: 'number', readOnly: true}),
  ],
  orderings: [{title: 'Nome', name: 'titulo', by: [{field: 'titulo', direction: 'asc'}]}],
})
