import {getConfiguracoes} from '@/sanity/queries'
import {SITE_URL} from '@/lib/site'

export async function JsonLdOrganizacao() {
  const c = await getConfiguracoes()
  const dados = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: c.nomeOficial,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    taxID: c.cnpj,
    email: c.email,
    telephone: c.whatsapp ? `+${c.whatsapp}` : undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Palmas',
      addressRegion: 'TO',
      addressCountry: 'BR',
    },
    sameAs: [c.instagram, c.linkedin].filter(Boolean),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{__html: JSON.stringify(dados).replace(/</g, '\\u003c')}}
    />
  )
}
