/** Navegação principal, na ordem do template. */
export const NAV = [
  {href: '/', rotulo: 'Home'},
  {href: '/quem-somos', rotulo: 'Quem somos'},
  {href: '/diretoria', rotulo: 'Diretoria'},
  {href: '/manifesto', rotulo: 'Manifesto'},
  {href: '/noticias', rotulo: 'Notícias'},
  {href: '/eventos', rotulo: 'Eventos'},
  {href: '/vitrine', rotulo: 'Vitrine'},
  {href: '/mantenedores', rotulo: 'Mantenedores'},
] as const

/** Submenu “Documentos”. */
export const DOCUMENTOS = [
  {href: '/documentos', rotulo: 'Estatuto e Regimento'},
  {href: '/privacidade', rotulo: 'Política de Privacidade'},
] as const

export const LINKS_RODAPE = [
  {
    titulo: 'A Associação',
    links: [
      {href: '/quem-somos', rotulo: 'Quem somos'},
      {href: '/manifesto', rotulo: 'Manifesto'},
      {href: '/diretoria', rotulo: 'Diretoria'},
      {href: '/mantenedores', rotulo: 'Mantenedores'},
      {href: '/documentos', rotulo: 'Estatuto e Regimento'},
    ],
  },
  {
    titulo: 'Ecossistema',
    links: [
      {href: '/noticias', rotulo: 'Notícias'},
      {href: '/noticias?categoria=edital', rotulo: 'Editais'},
      {href: '/noticias?categoria=beneficio', rotulo: 'Benefícios'},
      {href: '/eventos', rotulo: 'Eventos'},
      {href: '/vitrine', rotulo: 'Vitrine de startups'},
    ],
  },
  {
    titulo: 'Participe',
    links: [
      {href: '/associe-se', rotulo: 'Associe-se'},
      {href: '/entrar', rotulo: 'Entrar na área do associado'},
      {href: '/privacidade', rotulo: 'Política de Privacidade'},
    ],
  },
] as const

/** Rotas de cadastro (implementadas no grupo (conta)). */
export const ROTAS_CONTA = {
  entrar: '/entrar',
  comunidade: '/cadastro/comunidade',
  associado: '/cadastro/associado',
  area: '/associado',
}
