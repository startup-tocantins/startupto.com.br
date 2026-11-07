import type {Metadata} from 'next'
import Link from 'next/link'
import {Container} from '@/components/ui'
import {getListas} from '@/lib/associados/listas'
import {exigirSessao} from '@/lib/associados/sessao'
import {logoPublicUrl} from '@/lib/supabase/vitrine'
import {CabecaConta} from '../../_componentes/Cabeca'
import {FormPerfil} from '../../_componentes/FormsArea'

export const metadata: Metadata = {title: 'Editar dados', robots: {index: false}}

export default async function PerfilPage() {
  const {perfil} = await exigirSessao('/associado/perfil')
  const listas = await getListas()
  return (
    <>
      <CabecaConta rotulo="Minha área" titulo="Editar dados" />
      <Container className="py-12 sm:py-14">
        <Link href="/associado" className="font-semibold text-azul underline underline-offset-4">
          ← Voltar para minha área
        </Link>
        <div className="mt-8 max-w-2xl">
          <FormPerfil perfil={perfil} listas={listas} logoUrl={logoPublicUrl(perfil.logo_path)} />
        </div>
      </Container>
    </>
  )
}
