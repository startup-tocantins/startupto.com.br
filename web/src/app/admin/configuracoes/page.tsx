import {Ficha} from '@/components/ui'
import {createAdminClient} from '@/lib/supabase/server'
import {FormGrupoWhatsapp} from '../_componentes/Acoes'

export const metadata = {title: 'Configurações'}

/** Página por usuário (sessão/banco): fora da validação de navegação instantânea. */
export const instant = false

export default async function AdminConfiguracoesPage() {
  const {data} = await createAdminClient().from('configuracoes_privadas').select('valor').eq('chave', 'whatsapp_grupo_comunidade').maybeSingle()
  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-display text-3xl font-extrabold text-azul-noite">Configurações</h1>
      <Ficha className="p-6" como="section">
        <h2 className="mb-4 font-display text-xl font-extrabold text-azul-noite">Grupo da Comunidade no WhatsApp</h2>
        <FormGrupoWhatsapp atual={data?.valor ?? ''} />
      </Ficha>
      <Ficha className="p-6" como="section">
        <h2 className="font-display text-xl font-extrabold text-azul-noite">Conteúdo do site</h2>
        <p className="mt-2 max-w-[62ch] font-texto text-[1.0625rem] text-tinta-suave">
          Notícias, editais, benefícios, eventos, Diretoria, Mantenedores, documentos e textos institucionais são
          editados no Sanity Studio (link “Editar conteúdo” no topo). Valores da anuidade são definidos no Stripe.
        </p>
      </Ficha>
    </div>
  )
}
