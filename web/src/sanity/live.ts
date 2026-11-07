import {defineLive, type StrictDefinedFetchType} from 'next-sanity/live'
import {client} from './client'

const token = process.env.SANITY_API_READ_TOKEN

export const {sanityFetch, SanityLive} = defineLive({
  client,
  serverToken: token,
  browserToken: token,
  strict: true,
})

/** Fronteira única de cache: o conteúdo publicado é atualizado em tempo real pelo <SanityLive />. */
export const cachedSanity: StrictDefinedFetchType = async (options) => {
  'use cache'
  return sanityFetch(options)
}

/** Busca conteúdo publicado (sem stega). */
export async function buscar<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  const {data} = await cachedSanity({query, params, perspective: 'published', stega: false})
  return data as T
}
