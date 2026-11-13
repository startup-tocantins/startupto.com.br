import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type {ReactNode} from 'react'

import {SITE_URL} from '../lib/site'

/** Paleta do DESIGN.md (Tocantins luminoso). */
export const cores = {
  azul: '#0B5BD3',
  laranja: '#F7870F',
  ipe: '#FEC446',
  tinta: '#0E1E42',
  papel: '#FFFFFF',
  fundo: '#F5F8FD',
  suave: '#475569',
  linha: '#E3E9F2',
}

const fonte = "Ubuntu, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

export type Rodape = {whatsappContato: string; urlPrivacidade: string}

export function Layout({
  preview,
  children,
  rodape,
}: {
  preview: string
  children: ReactNode
  rodape: Rodape
}) {
  return (
    <Html lang="pt-BR">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{backgroundColor: cores.fundo, margin: 0, padding: '24px 0', fontFamily: fonte}}>
        <Container
          style={{
            maxWidth: 560,
            margin: '0 auto',
            backgroundColor: cores.papel,
            borderRadius: 16,
            border: `1px solid ${cores.linha}`,
            overflow: 'hidden',
          }}
        >
          <Section style={{padding: '24px 32px 0'}}>
            <Img
              src={`${SITE_URL}/logo.png`}
              alt="Associação Tocantinense de Startups"
              width={174}
              height={60}
              style={{display: 'block', height: 60, width: 'auto'}}
            />
            <div style={{height: 4, width: 56, backgroundColor: cores.laranja, borderRadius: 4, marginTop: 16}} />
          </Section>
          <Section style={{padding: '28px 32px 8px', color: cores.tinta, fontSize: 16, lineHeight: '26px'}}>
            {children}
          </Section>
          <Hr style={{borderColor: cores.linha, margin: '24px 32px 0'}} />
          <Section style={{padding: '16px 32px 28px'}}>
            <Text style={{margin: 0, color: cores.suave, fontSize: 13, lineHeight: '20px'}}>
              Associação Tocantinense de Startups · CNPJ 57.921.002/0001-30 · Palmas – TO
              <br />
              Dúvidas? Responda este e-mail ou fale com a gente no WhatsApp {rodape.whatsappContato}.
              <br />
              <Link href={rodape.urlPrivacidade} style={{color: cores.azul}}>
                Política de Privacidade
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export function P({children}: {children: ReactNode}) {
  return <Text style={{margin: '0 0 16px', fontSize: 16, lineHeight: '26px', color: cores.tinta}}>{children}</Text>
}

export function Botao({href, children}: {href: string; children: ReactNode}) {
  return (
    <Section style={{margin: '8px 0 24px'}}>
      <Button
        href={href}
        style={{
          backgroundColor: cores.laranja,
          color: cores.tinta,
          fontWeight: 700,
          fontSize: 16,
          padding: '14px 24px',
          borderRadius: 10,
          textDecoration: 'none',
          display: 'inline-block',
        }}
      >
        {children}
      </Button>
    </Section>
  )
}

export function Lista({itens}: {itens: ReactNode[]}) {
  return (
    <ul style={{margin: '0 0 16px', paddingLeft: 20, color: cores.tinta, fontSize: 16, lineHeight: '26px'}}>
      {itens.map((item, i) => (
        <li key={i} style={{marginBottom: 4}}>
          {item}
        </li>
      ))}
    </ul>
  )
}

export function ListaNumerada({itens}: {itens: ReactNode[]}) {
  return (
    <ol style={{margin: '0 0 16px', paddingLeft: 20, color: cores.tinta, fontSize: 16, lineHeight: '26px'}}>
      {itens.map((item, i) => (
        <li key={i} style={{marginBottom: 4}}>
          {item}
        </li>
      ))}
    </ol>
  )
}

export function Assinatura() {
  return <P>Associação Tocantinense de Startups</P>
}
