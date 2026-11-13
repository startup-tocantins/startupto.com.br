import type {Metadata, Viewport} from 'next'
import {Ubuntu} from 'next/font/google'
import {Analytics} from '@vercel/analytics/next'
import {SanityLive} from '@/sanity/live'
import {SITE_URL} from '@/lib/site'
import './globals.css'

const ubuntu = Ubuntu({
  variable: '--font-ubuntu',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const NOME = 'Associação Tocantinense de Startups'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {default: NOME, template: `%s · ${NOME}`},
  description:
    'Organização sem fins lucrativos que representa, conecta e fortalece as startups do Tocantins. Associe-se.',
  applicationName: NOME,
  openGraph: {type: 'website', locale: 'pt_BR', siteName: NOME},
  twitter: {card: 'summary_large_image'},
  formatDetection: {telephone: false},
}

export const viewport: Viewport = {
  themeColor: '#f5f8fd',
}

export default function RootLayout({children}: LayoutProps<'/'>) {
  return (
    <html lang="pt-BR" className={`${ubuntu.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {children}
        <SanityLive includeDrafts={false} />
        <Analytics />
      </body>
    </html>
  )
}
