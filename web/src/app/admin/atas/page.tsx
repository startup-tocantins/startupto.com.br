import {Botao, EstadoVazio, Ficha, IconeDocumento} from '@/components/ui'
import {formatarData} from '@/lib/associados/status'
import {createAdminClient} from '@/lib/supabase/server'
import {excluirAta} from '../acoes'
import {FormAta} from '../_componentes/Acoes'
import {exigirAdmin} from '@/lib/associados/sessao'

export const metadata = {title: 'Atas'}

/** Página por usuário (sessão/banco): fora da validação de navegação instantânea. */
export const instant = false

export default async function AdminAtasPage() {
  // A checagem do layout não protege a página (renderizam em paralelo): cada página verifica.
  await exigirAdmin()
  const {data: atas} = await createAdminClient().from('atas').select('*').order('data_assembleia', {ascending: false})
  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="font-display text-3xl font-bold text-azul-noite">Atas de Assembleia</h1>
        <p className="mt-1 max-w-[62ch] text-base text-tinta-suave">
          As atas ficam num armazenamento privado. Só associados ativos e a Diretoria conseguem baixar, por um link
          temporário.
        </p>
      </div>
      <Ficha className="p-6" como="section">
        <h2 className="mb-4 font-display text-xl font-bold text-azul-noite">Publicar nova ata</h2>
        <FormAta />
      </Ficha>
      <section aria-labelledby="publicadas">
        <h2 id="publicadas" className="font-display text-xl font-bold text-azul-noite">
          Publicadas
        </h2>
        {!atas?.length ? (
          <EstadoVazio className="mt-4" titulo="Nenhuma ata publicada" />
        ) : (
          <ul className="mt-4 divide-y divide-linha rounded-ficha bg-prancha ring-1 ring-linha">
            {atas.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center gap-3 px-5 py-3">
                <IconeDocumento className="size-5 text-azul" />
                <a href={`/associado/atas/${a.id}`} className="flex-1 font-medium text-azul-noite underline-offset-4 hover:underline">
                  {a.titulo} <span className="font-normal text-tinta-suave">· {formatarData(a.data_assembleia)}</span>
                </a>
                <form action={excluirAta}>
                  <input type="hidden" name="id" value={a.id} />
                  <Botao type="submit" variante="fantasma" tamanho="sm">
                    Excluir
                  </Botao>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
