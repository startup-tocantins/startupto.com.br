import type {Metadata} from 'next'
import Link from 'next/link'
import {Modalidades} from '@/components/site/Modalidades'
import {Container, Prancha} from '@/components/ui'
import {ROTAS_CONTA} from '@/components/site/navegacao'

export const metadata: Metadata = {
  title: 'Associe-se',
  description:
    'Entre na Comunidade gratuita ou associe-se à Associação Tocantinense de Startups para ter voz e voto e aparecer na Vitrine.',
  alternates: {canonical: '/associe-se'},
}

const PASSOS = [
  {t: 'Faça o cadastro', d: 'Conte quem você é e qual é a sua startup. Pessoa física ou jurídica, com CPF ou CNPJ.'},
  {t: 'Pague a anuidade', d: 'Logo em seguida, no cartão de crédito, em ambiente seguro do Stripe.'},
  {t: 'Associação ativa', d: 'Voto nas Assembleias, grupo de Associados, benefícios e sua startup na Vitrine.'},
]

export default function AssocieSe() {
  return (
    <>
      <Prancha
        nivel={1}
      rotulo="Faça parte"
        titulo="Associe-se"
        introducao="Duas formas de fazer parte. A Comunidade é gratuita e imediata; a associação dá voz, voto e visibilidade."
        fundo="laranja"
       
      >
        <Modalidades tituloNivel={2} />
        <p className="mt-6 text-base text-azul-noite">
          Já tem cadastro?{' '}
          <Link href={ROTAS_CONTA.entrar} className="font-medium underline">
            Entre na sua área
          </Link>{' '}
          para fazer o upgrade de Comunidade para Associado.
        </p>
      </Prancha>

      <Prancha id="como-funciona" titulo="Como funciona a associação" fundo="branco">
        <ol className="grid gap-6 md:grid-cols-4">
          {PASSOS.map((p, i) => (
            <li key={p.t} className="relative border-t-2 border-azul pt-5">
              <span className="font-display text-sm font-bold text-azul">Passo {i + 1}</span>
              <h3 className="mt-1 font-display text-xl font-bold text-azul-noite">{p.t}</h3>
              <p className="mt-2 text-base leading-relaxed text-tinta-suave">{p.d}</p>
            </li>
          ))}
        </ol>
      </Prancha>

      <section className="border-t border-linha bg-papel py-14">
        <Container className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="font-display text-xl font-bold text-azul-noite">Quem pode se associar</h2>
            <p className="mt-2 text-base leading-relaxed text-tinta-suave">
              Pessoas físicas maiores de 18 anos e pessoas jurídicas que atuem ou tenham interesse no ecossistema de
              inovação, empreendedorismo e tecnologia (Estatuto, art. 11).
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-azul-noite">Regras e privacidade</h2>
            <p className="mt-2 text-base leading-relaxed text-tinta-suave">
              Leia o <Link href="/documentos" className="font-medium text-azul underline">Estatuto e o Regimento</Link> e a{' '}
              <Link href="/privacidade" className="font-medium text-azul underline">Política de Privacidade</Link>. Seus dados
              são usados só para a gestão da associação.
            </p>
          </div>
        </Container>
      </section>
    </>
  )
}
