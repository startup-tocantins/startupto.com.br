import {CogIcon} from '@sanity/icons/Cog'
import {defineField, defineType} from 'sanity'

export const configuracoesSite = defineType({
  name: 'configuracoesSite',
  title: 'Configurações do site',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'home', title: 'Página inicial', default: true},
    {name: 'institucional', title: 'Missão e visão'},
    {name: 'contato', title: 'Contato e redes'},
  ],
  fields: [
    defineField({
      name: 'nomeOficial',
      title: 'Nome oficial',
      type: 'string',
      group: 'contato',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'cnpj', title: 'CNPJ', type: 'string', group: 'contato'}),
    defineField({name: 'cidade', title: 'Cidade', type: 'string', group: 'contato'}),
    defineField({name: 'email', title: 'E-mail', type: 'string', group: 'contato'}),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp',
      type: 'string',
      description: 'Somente números com DDI e DDD. Ex.: 5563992353262',
      group: 'contato',
      validation: (rule) => rule.regex(/^\d{12,13}$/, {name: 'número'}),
    }),
    defineField({name: 'instagram', title: 'Instagram (link)', type: 'url', group: 'contato'}),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn institucional (link)',
      type: 'url',
      description: 'Opcional. Só aparece no site se preenchido.',
      group: 'contato',
    }),
    defineField({
      name: 'heroTitulo',
      title: 'Título principal da página inicial',
      type: 'string',
      group: 'home',
    }),
    defineField({
      name: 'introducao',
      title: 'Introdução da página inicial',
      type: 'array',
      of: [{type: 'block', styles: [{title: 'Parágrafo', value: 'normal'}], lists: []}],
      group: 'home',
    }),
    defineField({
      name: 'missaoCurta',
      title: 'Missão (frase de destaque)',
      type: 'text',
      rows: 3,
      group: 'institucional',
    }),
    defineField({
      name: 'missaoLonga',
      title: 'Missão (texto completo)',
      type: 'text',
      rows: 6,
      group: 'institucional',
    }),
    defineField({name: 'visao', title: 'Visão', type: 'text', rows: 4, group: 'institucional'}),
  ],
  preview: {prepare: () => ({title: 'Configurações do site'})},
})
