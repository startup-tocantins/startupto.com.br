import {ImageResponse} from 'next/og'
import {readFile} from 'node:fs/promises'
import {join} from 'node:path'

export const alt = 'Associação Tocantinense de Startups — conectando startups, pessoas e oportunidades no Tocantins'
export const size = {width: 1200, height: 630}
export const contentType = 'image/png'

const dataUri = async (arquivo: string, tipo: string) =>
  `data:${tipo};base64,${(await readFile(join(process.cwd(), arquivo))).toString('base64')}`

/** Ubuntu Bold em TTF (Satori não lê woff2). Sem rede, cai na fonte padrão. */
async function ubuntuBold(): Promise<ArrayBuffer | null> {
  try {
    const css = await (
      await fetch('https://fonts.googleapis.com/css2?family=Ubuntu:wght@700&display=swap', {
        headers: {'User-Agent': 'Mozilla/5.0 (compatible; og-image)'},
      })
    ).text()
    const url = /src: url\((.+?)\) format\('(?:truetype|opentype)'\)/.exec(css)?.[1]
    return url ? await (await fetch(url)).arrayBuffer() : null
  } catch {
    return null
  }
}

/** Imagem de compartilhamento no mundo do DESIGN.md: papel claro, foto de Palmas e campo ipê. */
export default async function Imagem() {
  const [logo, foto, fonte] = await Promise.all([
    dataUri('public/logo.png', 'image/png'),
    dataUri('src/app/og-palmas.jpg', 'image/jpeg'),
    ubuntuBold(),
  ])
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#f5f8fd',
          position: 'relative',
          fontFamily: fonte ? 'Ubuntu' : undefined,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: -60,
            top: 40,
            width: 130,
            height: 300,
            background: '#fec446',
            borderRadius: '0 120px 140px 0',
          }}
        />
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 0 0 110px', width: 640}}>
          <img src={logo} width={380} height={131} alt="" />
          <div
            style={{
              marginTop: 44,
              fontSize: 50,
              fontWeight: 700,
              color: '#0e1e42',
              lineHeight: 1.1,
              letterSpacing: -1,
              display: 'flex',
            }}
          >
            Conectando startups, pessoas e oportunidades no Tocantins
          </div>
        </div>
        <div style={{position: 'absolute', right: 0, top: 0, display: 'flex', height: 630, width: 560}}>
          <div style={{display: 'flex', width: 6, height: 630, background: '#f7870f'}} />
          <img src={foto} width={554} height={630} alt="" style={{objectFit: 'cover'}} />
        </div>
      </div>
    ),
    {...size, fonts: fonte ? [{name: 'Ubuntu', data: fonte, weight: 700, style: 'normal'}] : undefined},
  )
}
