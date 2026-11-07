import {defineField, defineType} from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO e compartilhamento',
  type: 'object',
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título para buscadores',
      type: 'string',
      description: 'Se vazio, usa o título da página.',
      validation: (rule) => rule.max(70).warning('Títulos longos são cortados no Google.'),
    }),
    defineField({
      name: 'descricao',
      title: 'Descrição para buscadores',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(160).warning('Use até 160 caracteres.'),
    }),
    defineField({
      name: 'imagem',
      title: 'Imagem de compartilhamento',
      type: 'image',
      description: 'Aparece quando o link é compartilhado no WhatsApp e redes sociais.',
    }),
  ],
})
