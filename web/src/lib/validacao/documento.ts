/** Validação de CPF e CNPJ (dígitos verificadores). Funciona no cliente e no servidor. */

export const somenteDigitos = (v: string) => v.replace(/\D/g, '')

export function validarCPF(valor: string): boolean {
  const cpf = somenteDigitos(valor)
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false
  const dv = (base: string, pesoInicial: number) => {
    let soma = 0
    for (let i = 0; i < base.length; i++) soma += Number(base[i]) * (pesoInicial - i)
    const resto = (soma * 10) % 11
    return resto === 10 ? 0 : resto
  }
  const d1 = dv(cpf.slice(0, 9), 10)
  const d2 = dv(cpf.slice(0, 10), 11)
  return d1 === Number(cpf[9]) && d2 === Number(cpf[10])
}

export function validarCNPJ(valor: string): boolean {
  const cnpj = somenteDigitos(valor)
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false
  const dv = (base: string) => {
    const pesos = base.length === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    const soma = base.split('').reduce((acc, d, i) => acc + Number(d) * pesos[i], 0)
    const resto = soma % 11
    return resto < 2 ? 0 : 11 - resto
  }
  const d1 = dv(cnpj.slice(0, 12))
  const d2 = dv(cnpj.slice(0, 13))
  return d1 === Number(cnpj[12]) && d2 === Number(cnpj[13])
}

/** Identifica e valida automaticamente: 11 dígitos = CPF, 14 = CNPJ. */
export function validarDocumento(valor: string): {tipo: 'cpf' | 'cnpj'; numero: string} | null {
  const n = somenteDigitos(valor)
  if (n.length === 11 && validarCPF(n)) return {tipo: 'cpf', numero: n}
  if (n.length === 14 && validarCNPJ(n)) return {tipo: 'cnpj', numero: n}
  return null
}

export function formatarDocumento(numero: string): string {
  const n = somenteDigitos(numero)
  if (n.length === 11) return n.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  if (n.length === 14) return n.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  return numero
}

export function formatarWhatsapp(numero: string): string {
  const n = somenteDigitos(numero).replace(/^55(?=\d{10,11}$)/, '')
  if (n.length === 11) return n.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  if (n.length === 10) return n.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  return numero
}
