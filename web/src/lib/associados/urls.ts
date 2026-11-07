import 'server-only'
import {env} from '@/lib/env'

export const urls = {
  areaAssociado: () => `${env.siteUrl()}/associado`,
  pagamento: () => `${env.siteUrl()}/associado/pagamento`,
  portal: () => `${env.siteUrl()}/associado/portal`,
  associeSe: () => `${env.siteUrl()}/associe-se`,
  adminAssociado: (id: string) => `${env.siteUrl()}/admin/associados/${id}`,
  adminExclusoes: () => `${env.siteUrl()}/admin/exclusoes`,
}
