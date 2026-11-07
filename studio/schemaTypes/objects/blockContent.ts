import {defineArrayMember, defineField, defineType} from 'sanity'

export const blockContent = defineType({
  name: 'blockContent',
  title: 'Texto',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Parágrafo', value: 'normal'},
        {title: 'Título', value: 'h2'},
        {title: 'Subtítulo', value: 'h3'},
        {title: 'Citação', value: 'blockquote'},
      ],
      lists: [
        {title: 'Lista com marcadores', value: 'bullet'},
        {title: 'Lista numerada', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Negrito', value: 'strong'},
          {title: 'Itálico', value: 'em'},
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            title: 'Link',
            type: 'object',
            fields: [
              defineField({
                name: 'href',
                title: 'Endereço',
                type: 'url',
                validation: (rule) =>
                  rule.uri({scheme: ['http', 'https', 'mailto', 'tel'], allowRelative: true}),
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      title: 'Imagem',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Descrição da imagem (acessibilidade)',
          type: 'string',
          validation: (rule) => rule.required().warning('Descreva a imagem para leitores de tela.'),
        }),
        defineField({name: 'legenda', title: 'Legenda', type: 'string'}),
      ],
    }),
    defineArrayMember({
      name: 'tabela',
      title: 'Tabela',
      type: 'object',
      fields: [
        defineField({
          name: 'linhas',
          title: 'Linhas (a primeira é o cabeçalho)',
          type: 'array',
          of: [
            defineArrayMember({
              name: 'linha',
              title: 'Linha',
              type: 'object',
              fields: [
                defineField({
                  name: 'celulas',
                  title: 'Células',
                  type: 'array',
                  of: [defineArrayMember({type: 'string'})],
                }),
              ],
              preview: {
                select: {celulas: 'celulas'},
                prepare: ({celulas}) => ({title: (celulas ?? []).join(' | ')}),
              },
            }),
          ],
        }),
      ],
      preview: {
        select: {linhas: 'linhas'},
        prepare: ({linhas}) => ({title: `Tabela (${linhas?.length ?? 0} linhas)`}),
      },
    }),
  ],
})
