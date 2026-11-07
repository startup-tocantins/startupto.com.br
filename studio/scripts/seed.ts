/**
 * Seed idempotente do conteúdo inicial.
 * Uso (na pasta studio/):  npm run seed
 * Lê SANITY_TOKEN do .env da raiz do monorepo.
 */
import {createClient, type SanityClient} from '@sanity/client'
import {readFileSync, existsSync, createReadStream} from 'node:fs'
import {resolve, basename} from 'node:path'
import {markdownToPortableText, paragraphs} from './lib/markdown'

const ROOT = resolve(__dirname, '../..')

function loadEnv() {
  const envPath = resolve(ROOT, '.env')
  if (!existsSync(envPath)) return
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}
loadEnv()

const token = process.env.SANITY_TOKEN || process.env.SANITY_API_WRITE_TOKEN
if (!token) throw new Error('SANITY_TOKEN não encontrado no .env da raiz.')

const client: SanityClient = createClient({
  projectId: 'megra9kk',
  dataset: 'production',
  apiVersion: '2026-02-01',
  token,
  useCdn: false,
})

const read = (p: string) => readFileSync(resolve(ROOT, p), 'utf8')
const slugify = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/** Cria o documento se não existir um com a mesma chave; senão atualiza os campos. */
async function upsert(type: string, keyField: string, keyValue: string, data: Record<string, unknown>) {
  const filter =
    keyField === 'slug'
      ? `*[_type == $type && slug.current == $v && !(_id in path("drafts.**"))][0]._id`
      : `*[_type == $type && ${keyField} == $v && !(_id in path("drafts.**"))][0]._id`
  const id: string | null = await client.fetch(filter, {type, v: keyValue})
  if (id) {
    await client.patch(id).set(data).commit()
    return id
  }
  const created = await client.create({_type: type, ...data})
  return created._id
}

const assetCache = new Map<string, string>()
async function uploadImage(path: string) {
  if (assetCache.has(path)) return assetCache.get(path)!
  const asset = await client.assets.upload('image', createReadStream(resolve(ROOT, path)), {
    filename: basename(path),
  })
  assetCache.set(path, asset._id)
  return asset._id
}
async function uploadFile(path: string) {
  const asset = await client.assets.upload('file', createReadStream(resolve(ROOT, path)), {
    filename: basename(path),
    contentType: 'application/pdf',
  })
  return asset._id
}

// ---------- sobre.md ----------
function parseSobre() {
  const s = read('sobre.md').replace(/\r/g, '')
  const visao = /Visão\n([\s\S]*?)\nMissão/.exec(s)![1].trim()
  const missaoBloco = /Missão\n([\s\S]*?)\n\s*\nValores/.exec(s)![1]
  const missaoCurta = /"([^"]+)"/.exec(missaoBloco)![1].trim()
  const missaoLonga = missaoBloco.split('\n')[0].trim()
  const valoresBloco = /Valores\n([\s\S]*?)\n---/.exec(s)![1]
  const valores = valoresBloco
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const i = l.indexOf(':')
      return {titulo: l.slice(0, i).trim(), descricao: l.slice(i + 1).trim()}
    })
  const partes = s.split(/\n---\n/)
  const introducao = partes[1].trim()
  const quemSomos = partes[2].replace(/^\s*Quem Somos\s*/, '').trim()
  const diretoria = partes[3]
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.includes('\t'))
    .map((l) => {
      const [nome, cargo] = l.split('\t').map((x) => x.trim())
      return {nome, cargo}
    })
  return {visao, missaoCurta, missaoLonga, valores, introducao, quemSomos, diretoria}
}

// ---------- minibios ----------
const NOME_OFICIAL = 'Associação Tocantinense de Startups'
function normalizarBio(bio: string, nome: string, cargo: string) {
  let b = bio.trim()
  // Nome em caixa-alta no início → nome oficial (sobre.md)
  b = b.replace(/^[A-ZÀ-Ý][A-ZÀ-Ý\s]+?(?=,| é | -)/, nome)
  b = b
    .replace(/Associação Startup Tocantins/g, NOME_OFICIAL)
    .replace(/Associação de Startups do Tocantins/g, NOME_OFICIAL)
  // Cargos citados nas bios seguem o sobre.md
  const trocas: [RegExp, string][] = [
    [/É Diretor de Tecnologia e Inovação/g, `É ${cargo}`],
    [/É diretora contábil/g, `É ${cargo}`],
    [/, Diretor da Associação Tocantinense/g, `, ${cargo} da Associação Tocantinense`],
    [/vice-presidente da Associação/g, 'Vice-presidente da Associação'],
  ]
  for (const [re, rep] of trocas) b = b.replace(re, rep)
  return b
}

function parseBios(diretoria: {nome: string; cargo: string}[]) {
  const texto = read('diretoria/minibios.md').replace(/\r/g, '')
  const bios = texto
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean)
  const primeiro = (n: string) => slugify(n.split(/\s+/)[0]).replace(/l+a$/, 'la')
  return diretoria.map((m) => {
    const alvo = primeiro(m.nome)
    const bio = bios.find((b) => primeiro(b.split(/[\s,]/)[0]) === alvo)
    if (!bio) console.warn(`  ! bio não encontrada para ${m.nome}`)
    return bio ? normalizarBio(bio, m.nome, m.cargo) : undefined
  })
}

const FOTOS: Record<string, string> = {
  rai: 'diretoria/rai.jpeg',
  lecticia: 'diretoria/lecticia.jpeg',
  thatyana: 'diretoria/thatyana.PNG',
  kamylla: 'diretoria/kamylla.PNG',
  gleyciane: 'diretoria/gleyciane.jpeg',
  luiz: 'diretoria/luiz.jpg',
}

const SETORES = [
  'Agro / AgTech',
  'FoodTech',
  'Fintech',
  'InsurTech',
  'HealthTech',
  'EdTech',
  'GovTech',
  'LegalTech',
  'Construtech',
  'PropTech',
  'CleanTech / Energia',
  'ClimateTech / Ambiental',
  'Mineração',
  'Logística / Mobilidade',
  'Varejo / E-commerce',
  'Turismo / Hospitalidade',
  'MarTech / Comunicação',
  'HR Tech',
  'SaaS / B2B',
  'IA / Dados',
  'Cibersegurança',
  'IoT / Hardware',
  'Indústria 4.0',
  'Economia Criativa / Games',
  'Impacto Social',
  'Serviços Profissionais',
  'Outro',
]
const ESTAGIOS = ['Ideação', 'Validação', 'Operação', 'Tração', 'Escala']

async function main() {
  const sobre = parseSobre()
  console.log('→ Configurações do site')
  await client.createIfNotExists({_id: 'configuracoesSite', _type: 'configuracoesSite'})
  await client
    .patch('configuracoesSite')
    .set({
      nomeOficial: NOME_OFICIAL,
      cnpj: '57.921.002/0001-30',
      cidade: 'Palmas – TO',
      email: 'startuptocantins@gmail.com',
      whatsapp: '5563992353262',
      instagram: 'https://www.instagram.com/startuptocantins_/',
      heroTitulo: NOME_OFICIAL,
      introducao: paragraphs(sobre.introducao),
      missaoCurta: sobre.missaoCurta,
      missaoLonga: sobre.missaoLonga,
      visao: sobre.visao,
    })
    .commit()

  console.log('→ Valores')
  for (const [i, v] of sobre.valores.entries()) {
    await upsert('valor', 'titulo', v.titulo, {...v, ordem: i + 1})
  }

  console.log('→ Páginas institucionais')
  await upsert('paginaInstitucional', 'slug', 'quem-somos', {
    titulo: 'Quem somos',
    slug: {_type: 'slug', current: 'quem-somos'},
    corpo: paragraphs(sobre.quemSomos),
  })
  const manifesto = read('manifesto.md').replace(/^# .*\n/, '')
  await upsert('paginaInstitucional', 'slug', 'manifesto', {
    titulo: 'Manifesto',
    slug: {_type: 'slug', current: 'manifesto'},
    corpo: markdownToPortableText(manifesto),
  })
  const privacidade = read('privacidade.md')
    .replace(/^# .*\n/, '')
    .replace(/^Última atualização: \{\{data_publicacao\}\}\n/m, '')
  await upsert('paginaInstitucional', 'slug', 'privacidade', {
    titulo: 'Política de Privacidade',
    slug: {_type: 'slug', current: 'privacidade'},
    dataAtualizacao: new Date().toISOString().slice(0, 10),
    corpo: markdownToPortableText(privacidade),
  })

  console.log('→ Diretoria')
  const bios = parseBios(sobre.diretoria)
  for (const [i, m] of sobre.diretoria.entries()) {
    const chave = slugify(m.nome.split(' ')[0])
    const foto = FOTOS[chave]
    const data: Record<string, unknown> = {nome: m.nome, cargo: m.cargo, bio: bios[i], ordem: i + 1}
    if (foto) {
      data.foto = {_type: 'image', asset: {_type: 'reference', _ref: await uploadImage(foto)}}
    }
    await upsert('membroDiretoria', 'nome', m.nome, data)
    console.log(`  ${i + 1}. ${m.nome} — ${m.cargo}${foto ? ' (foto)' : ''}`)
  }

  console.log('→ Documentos públicos')
  const docs = [
    {
      titulo: 'Estatuto Social',
      descricao: 'Estatuto Social da Associação Tocantinense de Startups.',
      path: 'documentos/estatuto.pdf',
    },
    {
      titulo: 'Regimento Interno',
      descricao: 'Aprovado pela Assembleia Geral Ordinária e Extraordinária de 02/11/2026.',
      path: 'documentos/regimento-interno.pdf',
    },
  ]
  for (const [i, d] of docs.entries()) {
    const existe = await client.fetch(`*[_type=="documentoPublico" && titulo==$t][0]._id`, {t: d.titulo})
    const data: Record<string, unknown> = {titulo: d.titulo, descricao: d.descricao, ordem: i + 1}
    if (!existe) {
      data.arquivo = {_type: 'file', asset: {_type: 'reference', _ref: await uploadFile(d.path)}}
    }
    await upsert('documentoPublico', 'titulo', d.titulo, data)
  }

  console.log('→ Setores e estágios')
  for (const [i, t] of SETORES.entries()) {
    await upsert('setor', 'slug', slugify(t), {
      titulo: t,
      slug: {_type: 'slug', current: slugify(t)},
      ordem: i + 1,
    })
  }
  for (const [i, t] of ESTAGIOS.entries()) {
    await upsert('estagio', 'slug', slugify(t), {
      titulo: t,
      slug: {_type: 'slug', current: slugify(t)},
      ordem: i + 1,
    })
  }

  console.log('→ Cidades (IBGE)')
  const res = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados/17/municipios')
  const municipios = (await res.json()) as {id: number; nome: string}[]
  const existentes = new Set<string>(await client.fetch(`*[_type=="cidade"].slug.current`))
  let tx = client.transaction()
  let n = 0
  for (const m of municipios) {
    const slug = slugify(m.nome)
    if (existentes.has(slug)) continue
    tx = tx.create({
      _type: 'cidade',
      titulo: m.nome,
      slug: {_type: 'slug', current: slug},
      codigoIbge: m.id,
    })
    n++
  }
  if (n) await tx.commit()
  console.log(`  ${municipios.length} municípios (${n} novos)`)

  console.log('✓ Seed concluído')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
