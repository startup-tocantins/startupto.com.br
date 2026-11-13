import Image from 'next/image'
import Link from 'next/link'
import {Container, IconeEmail, IconeInstagram, IconeLinkedin, IconeWhatsapp} from '@/components/ui'
import {getConfiguracoes} from '@/sanity/queries'
import {formatarWhatsapp} from '@/lib/formatos'
import {LINKS_RODAPE} from './navegacao'

export async function Rodape() {
  const c = await getConfiguracoes()
  return (
    <footer className="relative overflow-hidden bg-azul-noite text-white">
      <span aria-hidden="true" className="campo-ipe pointer-events-none absolute -left-16 -top-10 h-40 w-32 opacity-90" />
      <Container className="relative grid gap-12 py-16 lg:grid-cols-[1.1fr_2fr] lg:py-20">
        <div>
          <Image src="/logo-branco.webp" alt={c.nomeOficial} width={1200} height={413} className="h-14 w-auto" />
          <p className="mt-6 max-w-[40ch] text-[0.9375rem] leading-relaxed text-white/80">
            {c.missaoCurta}
          </p>
          <ul className="mt-6 flex flex-col gap-2.5 text-[0.9375rem]">
            {c.email && (
              <li>
                <a href={`mailto:${c.email}`} className="inline-flex items-center gap-2.5 text-white/90 hover:text-ipe">
                  <IconeEmail /> {c.email}
                </a>
              </li>
            )}
            {c.whatsapp && (
              <li>
                <a
                  href={`https://wa.me/${c.whatsapp}`}
                  className="inline-flex items-center gap-2.5 text-white/90 hover:text-ipe"
                  rel="noopener"
                >
                  <IconeWhatsapp /> {formatarWhatsapp(c.whatsapp)}
                </a>
              </li>
            )}
            {c.instagram && (
              <li>
                <a href={c.instagram} className="inline-flex items-center gap-2.5 text-white/90 hover:text-ipe" rel="noopener">
                  <IconeInstagram /> Instagram
                </a>
              </li>
            )}
            {c.linkedin && (
              <li>
                <a href={c.linkedin} className="inline-flex items-center gap-2.5 text-white/90 hover:text-ipe" rel="noopener">
                  <IconeLinkedin /> LinkedIn
                </a>
              </li>
            )}
          </ul>
        </div>
        <nav aria-label="Rodapé" className="grid gap-10 sm:grid-cols-3">
          {LINKS_RODAPE.map((grupo) => (
            <div key={grupo.titulo}>
              <p className="text-sm font-bold uppercase tracking-[0.08em] text-ipe">{grupo.titulo}</p>
              <ul className="mt-4 flex flex-col gap-1">
                {grupo.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="inline-flex min-h-9 items-center text-[0.9375rem] text-white/85 hover:text-white hover:underline">
                      {l.rotulo}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-6 text-sm text-white/65 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {c.nomeOficial}
            {c.cnpj && <> · CNPJ {c.cnpj}</>}
            {c.cidade && <> · {c.cidade}</>}
          </p>
          <p>Organização sem fins lucrativos</p>
        </Container>
      </div>
    </footer>
  )
}
