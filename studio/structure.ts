import {CogIcon} from '@sanity/icons/Cog'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {ListIcon} from '@sanity/icons/List'
import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Conteúdo do site')
    .items([
      S.listItem()
        .title('Configurações do site')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('configuracoesSite')
            .documentId('configuracoesSite')
            .title('Configurações do site'),
        ),
      S.divider(),
      S.documentTypeListItem('post').title('Notícias, editais e benefícios'),
      S.documentTypeListItem('evento').title('Eventos'),
      S.divider(),
      S.documentTypeListItem('paginaInstitucional')
        .title('Páginas (Quem somos, Manifesto, Privacidade)')
        .icon(DocumentTextIcon),
      S.documentTypeListItem('valor').title('Valores'),
      S.documentTypeListItem('membroDiretoria').title('Diretoria'),
      S.documentTypeListItem('mantenedor').title('Mantenedores'),
      S.documentTypeListItem('documentoPublico').title('Documentos públicos'),
      S.divider(),
      S.listItem()
        .title('Listas do cadastro')
        .icon(ListIcon)
        .child(
          S.list()
            .title('Listas do cadastro')
            .items([
              S.documentTypeListItem('setor').title('Setores'),
              S.documentTypeListItem('estagio').title('Estágios'),
              S.documentTypeListItem('cidade').title('Cidades'),
            ]),
        ),
    ])
