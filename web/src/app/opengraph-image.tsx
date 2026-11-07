import {ImageResponse} from 'next/og'
import {readFile} from 'node:fs/promises'
import {join} from 'node:path'
import mapa from '@/data/tocantins.json'

export const alt = 'Associação Tocantinense de Startups'
export const size = {width: 1200, height: 630}
export const contentType = 'image/png'

export default async function Imagem() {
  const logo = await readFile(join(process.cwd(), 'public/logo-branco.png'))
  const src = `data:image/png;base64,${logo.toString('base64')}`
  const escala = 560 / mapa.altura
  return new ImageResponse(
    (
      <div style={{width: '100%', height: '100%', display: 'flex', background: '#0a3f84', position: 'relative'}}>
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 0 0 72px', width: 760}}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} width={600} height={206} alt="" />
          <div style={{marginTop: 40, fontSize: 34, color: 'rgba(255,255,255,0.88)', lineHeight: 1.3, display: 'flex'}}>
            Representamos startups, conectamos oportunidades e fortalecemos a inovação no Tocantins.
          </div>
        </div>
        <svg
          width={mapa.largura * escala}
          height={560}
          viewBox={`0 0 ${mapa.largura} ${mapa.altura}`}
          style={{position: 'absolute', right: 80, top: 35}}
        >
          {mapa.municipios.map((m) => (
            <circle key={m.codigo} cx={m.x} cy={m.y} r={3.2} fill="#fb9a17" />
          ))}
        </svg>
      </div>
    ),
    size,
  )
}
