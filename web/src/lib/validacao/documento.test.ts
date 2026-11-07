import {describe, expect, it} from 'vitest'
import {formatarDocumento, validarCNPJ, validarCPF, validarDocumento} from './documento'

describe('validarCPF', () => {
  it('aceita CPFs válidos com e sem máscara', () => {
    expect(validarCPF('529.982.247-25')).toBe(true)
    expect(validarCPF('52998224725')).toBe(true)
  })
  it('recusa dígitos errados, sequências repetidas e tamanhos inválidos', () => {
    expect(validarCPF('529.982.247-24')).toBe(false)
    expect(validarCPF('111.111.111-11')).toBe(false)
    expect(validarCPF('1234567890')).toBe(false)
  })
})

describe('validarCNPJ', () => {
  it('aceita o CNPJ da Associação', () => {
    expect(validarCNPJ('57.921.002/0001-30')).toBe(true)
  })
  it('recusa CNPJs inválidos', () => {
    expect(validarCNPJ('57.921.002/0001-31')).toBe(false)
    expect(validarCNPJ('00.000.000/0000-00')).toBe(false)
    expect(validarCNPJ('123')).toBe(false)
  })
})

describe('validarDocumento', () => {
  it('detecta o tipo pelo tamanho', () => {
    expect(validarDocumento('529.982.247-25')).toEqual({tipo: 'cpf', numero: '52998224725'})
    expect(validarDocumento('57921002000130')).toEqual({tipo: 'cnpj', numero: '57921002000130'})
    expect(validarDocumento('12345')).toBeNull()
  })
  it('formata', () => {
    expect(formatarDocumento('57921002000130')).toBe('57.921.002/0001-30')
    expect(formatarDocumento('52998224725')).toBe('529.982.247-25')
  })
})
