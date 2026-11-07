import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {ptBRLocale} from '@sanity/locale-pt-br'
import {schemaTypes, SINGLETONS} from './schemaTypes'
import {structure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'Associação Tocantinense de Startups',

  projectId: 'megra9kk',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool(), ptBRLocale()],

  schema: {
    types: schemaTypes,
    // Singletons não aparecem em "Criar novo"
    templates: (templates) => templates.filter(({schemaType}) => !SINGLETONS.includes(schemaType)),
  },

  document: {
    actions: (input, context) =>
      SINGLETONS.includes(context.schemaType)
        ? input.filter(({action}) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : input,
  },
})
