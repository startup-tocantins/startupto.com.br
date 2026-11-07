import type {NextConfig} from 'next'
import {sanity} from 'next-sanity/live/cache-life'

const supabaseHost = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : null
  } catch {
    return null
  }
})()

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Conteúdo do Sanity fica em cache até o <SanityLive /> invalidar
  cacheLife: {default: sanity},
  images: {
    remotePatterns: [
      {protocol: 'https', hostname: 'cdn.sanity.io'},
      {protocol: 'https', hostname: '*.supabase.co'},
      ...(supabaseHost ? [{protocol: 'https' as const, hostname: supabaseHost}] : []),
    ],
  },
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
}

export default nextConfig
