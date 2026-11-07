import {Cabecalho} from '@/components/site/Cabecalho'
import {Rodape} from '@/components/site/Rodape'

export default function SiteLayout({children}: LayoutProps<'/'>) {
  return (
    <>
      <Cabecalho />
      <main id="conteudo" className="flex-1">
        {children}
      </main>
      <Rodape />
    </>
  )
}
