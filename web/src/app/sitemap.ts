import type {MetadataRoute} from 'next'
import {getEventos, getPosts} from '@/sanity/queries'
import {SITE_URL} from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, eventos] = await Promise.all([getPosts(), getEventos()])
  const fixas = [
    '',
    '/quem-somos',
    '/manifesto',
    '/diretoria',
    '/noticias',
    '/eventos',
    '/vitrine',
    '/mantenedores',
    '/documentos',
    '/associe-se',
    '/privacidade',
  ].map((p) => ({url: `${SITE_URL}${p}`, changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.7}))
  return [
    ...fixas,
    ...posts.map((p) => ({url: `${SITE_URL}/noticias/${p.slug}`, lastModified: p.dataPublicacao, priority: 0.6})),
    ...eventos.map((e) => ({url: `${SITE_URL}/eventos/${e.slug}`, priority: 0.6})),
  ]
}
