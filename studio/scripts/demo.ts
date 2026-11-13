/**
 * Conteúdo de DEMONSTRAÇÃO (notícias, editais, benefícios e eventos) para
 * pré-visualizar o site. Todos os documentos têm _id com prefixo "demo-".
 *
 * Uso (na pasta studio/):
 *   npm run demo            cria/atualiza os documentos de demonstração
 *   npm run demo:remover    apaga todos os posts/eventos "demo-*"
 *
 * Lê SANITY_TOKEN do .env da raiz do monorepo.
 */
import {createClient, type SanityClient} from '@sanity/client'
import {readFileSync, existsSync, createReadStream} from 'node:fs'
import {resolve, basename} from 'node:path'
import {randomUUID} from 'node:crypto'

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

const IMAGENS = 'design/assets/images'
const key = () => randomUUID().replace(/-/g, '').slice(0, 12)

/** Parágrafos simples → Portable Text. */
const blocos = (...paragrafos: string[]) =>
  paragrafos.map((text) => ({
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: [{_type: 'span', _key: key(), text, marks: []}],
  }))

const assetCache = new Map<string, string>()
async function capa(arquivo: string, alt: string) {
  let id = assetCache.get(arquivo)
  if (!id) {
    const asset = await client.assets.upload(
      'image',
      createReadStream(resolve(ROOT, IMAGENS, arquivo)),
      {filename: basename(arquivo)},
    )
    id = asset._id
    assetCache.set(arquivo, id)
  }
  return {_type: 'image', asset: {_type: 'reference', _ref: id}, alt}
}

/** Data/hora local de Araguaína (UTC-3, sem horário de verão) → ISO UTC. */
const to = (data: string, hora = '09:00') => new Date(`${data}T${hora}:00-03:00`).toISOString()

const NOME = 'Associação Tocantinense de Startups'

async function criar() {
  const palmas: string | null = await client.fetch(
    `*[_type == "cidade" && titulo == "Palmas" && !(_id in path("drafts.**"))][0]._id`,
  )
  if (!palmas) throw new Error('Cidade "Palmas" não encontrada no dataset.')
  const refPalmas = {_type: 'reference', _ref: palmas}

  const capaComunidade = () =>
    capa(
      'noticia-comunidade-startups.png',
      'Empreendedores reunidos em um encontro da comunidade de startups do Tocantins',
    )
  const capaEvento = (alt: string) => capa('evento-inovacao-palestra.png', alt)

  const posts = [
    {
      _id: 'demo-post-super-atos',
      titulo: 'Super Atos 2026 reúne ecossistema de inovação do Tocantins',
      slug: 'super-atos-2026-reune-ecossistema-de-inovacao-do-tocantins',
      categoria: 'noticia',
      dataPublicacao: to('2026-11-11', '10:00'),
      capa: await capaComunidade(),
      resumo:
        'Encontro em Palmas reuniu fundadores, investidores, poder público e universidades para discutir o futuro das startups tocantinenses.',
      corpo: blocos(
        `O Super Atos 2026 reuniu, em Palmas, mais de quatrocentas pessoas ligadas ao ecossistema de inovação do Tocantins. Fundadores de startups, investidores, representantes do poder público, universidades e empresas tradicionais passaram o dia em painéis, rodadas de conexão e apresentações de negócios.`,
        `A ${NOME} participou da programação com um painel sobre o papel das associações na articulação entre quem empreende e quem pode apoiar. A diretoria apresentou os resultados do último ano e os próximos passos da agenda de interiorização, que leva encontros e mentorias para outras regiões do estado.`,
        `Entre os destaques do evento esteve a apresentação de doze startups tocantinenses para uma banca de investidores e executivos. As empresas, de setores como agronegócio, saúde, educação e serviços públicos, receberam devolutivas individuais e convites para conversas de acompanhamento.`,
        `Para a associação, o encontro mostra que o ecossistema local amadureceu. Há mais negócios em operação, mais gente disposta a investir e mais instituições interessadas em contratar soluções desenvolvidas no próprio estado. O desafio agora é transformar essas conexões em contratos, investimentos e empregos.`,
        `As fotos e os materiais apresentados durante o evento serão compartilhados com os associados nas próximas semanas.`,
      ),
    },
    {
      _id: 'demo-post-edital-apoio',
      titulo: 'Aberto edital de apoio a startups tocantinenses',
      slug: 'aberto-edital-de-apoio-a-startups-tocantinenses',
      categoria: 'edital',
      dataPublicacao: to('2026-11-05', '09:00'),
      capa: await capa(
        'noticia-edital-apoio.png',
        'Documentos e computador sobre uma mesa, representando a inscrição em um edital',
      ),
      resumo:
        'Chamada vai selecionar startups em fase de validação e tração para receber recursos, mentorias e acesso a parceiros. Inscrições até 15 de dezembro.',
      corpo: blocos(
        `Está aberto o edital de apoio a startups tocantinenses, que vai selecionar empresas em fase de validação e tração para receber recursos financeiros, mentorias especializadas e acesso a uma rede de parceiros. A iniciativa conta com o apoio da ${NOME} na divulgação e na orientação das candidatas.`,
        `Podem participar startups com sede no Tocantins, constituídas como pessoa jurídica, com produto ou serviço em teste com clientes reais. Serão avaliados o potencial de mercado, a capacidade da equipe, o grau de inovação da solução e o impacto esperado no desenvolvimento do estado.`,
        `As inscrições vão até 15 de dezembro de 2026 e devem ser feitas pelo site da instituição responsável pela chamada. O resultado preliminar está previsto para fevereiro de 2027, seguido de uma etapa de apresentação para a banca avaliadora.`,
        `Associados que tiverem dúvidas sobre os requisitos ou quiserem revisar a proposta antes do envio podem procurar a associação. Vamos organizar um encontro online de orientação nas próximas semanas, com data divulgada aqui e nos canais oficiais.`,
      ),
    },
    {
      _id: 'demo-post-beneficio-tecnologia',
      titulo: 'Novo benefício para associados: condições especiais em serviços de tecnologia',
      slug: 'novo-beneficio-para-associados-condicoes-especiais-em-servicos-de-tecnologia',
      categoria: 'beneficio',
      dataPublicacao: to('2026-10-30', '14:00'),
      capa: await capa(
        'noticia-parceria-beneficios.png',
        'Aperto de mãos entre parceiros sobre uma mesa de reunião, simbolizando uma parceria',
      ),
      resumo:
        'Associados passam a contar com descontos e créditos em hospedagem, ferramentas de produtividade e serviços de nuvem por meio de novas parcerias.',
      corpo: blocos(
        `A ${NOME} firmou novas parcerias que garantem condições especiais em serviços de tecnologia para os associados. O pacote inclui descontos em hospedagem de sites e aplicações, créditos em serviços de nuvem e preços reduzidos em ferramentas de produtividade e gestão.`,
        `O objetivo é diminuir o custo de operação das startups nos estágios iniciais, quando cada real faz diferença. Muitas dessas ferramentas são indispensáveis para colocar um produto no ar, atender clientes e organizar a rotina da equipe.`,
        `Para acessar o benefício, basta estar com a associação em dia e entrar na área do associado, onde estão os códigos e as instruções de cada parceiro. Novas empresas devem ser incluídas na lista ao longo dos próximos meses.`,
        `Se a sua startup oferece um produto ou serviço que pode interessar aos demais associados, fale com a diretoria. Parcerias entre os próprios membros também são bem-vindas e fortalecem o ecossistema local.`,
      ),
    },
    {
      _id: 'demo-post-interiorizacao',
      titulo: 'Associação amplia presença no interior com encontros em Araguaína e Gurupi',
      slug: 'associacao-amplia-presenca-no-interior-com-encontros-em-araguaina-e-gurupi',
      categoria: 'noticia',
      dataPublicacao: to('2026-10-20', '11:00'),
      capa: await capaComunidade(),
      resumo:
        'Rodadas de conversa com empreendedores de Araguaína e Gurupi marcam o início da agenda de interiorização e da formação de núcleos regionais.',
      corpo: blocos(
        `A ${NOME} realizou, em outubro, os primeiros encontros da agenda de interiorização em Araguaína e Gurupi. As rodadas de conversa reuniram empreendedores, estudantes, professores e representantes de empresas locais interessados em inovação.`,
        `Nos dois encontros, a diretoria apresentou o trabalho da associação, os benefícios para associados e as oportunidades abertas no estado. A maior parte do tempo, porém, foi dedicada a ouvir quem empreende fora da capital: as dificuldades de acesso a investimento, a falta de mão de obra especializada e a distância dos principais eventos do setor.`,
        `A partir dessas conversas, a associação vai estruturar núcleos regionais, com pessoas de referência em cada cidade para organizar encontros, receber novos associados e levar as demandas locais à diretoria.`,
        `Os próximos encontros devem acontecer em Porto Nacional e Paraíso do Tocantins no primeiro semestre de 2027. Quem quiser ajudar a organizar um encontro na sua cidade pode entrar em contato pelos canais oficiais da associação.`,
      ),
    },
  ]

  const eventos = [
    {
      _id: 'demo-evento-ideia-produto-ia',
      titulo: 'Da ideia ao produto com IA',
      slug: 'da-ideia-ao-produto-com-ia',
      inicio: to('2026-12-03', '18:30'),
      fim: to('2026-12-03', '22:30'),
      formato: 'presencial',
      local: 'Hotel 10 Palmas – Auditório 04',
      cidade: refPalmas,
      capa: await capaEvento('Palestrante apresenta para uma plateia em um auditório'),
      resumo:
        'Noite prática sobre como usar inteligência artificial para tirar uma ideia do papel, validar com clientes e chegar a um primeiro produto.',
      descricao: blocos(
        `Uma noite para quem quer usar inteligência artificial de forma prática no próprio negócio. Fundadores e especialistas mostram, com exemplos reais, como sair de uma ideia e chegar a um primeiro produto em semanas, e não em meses.`,
        `A programação inclui uma palestra de abertura, demonstrações ao vivo de ferramentas e um painel com startups tocantinenses que já usam IA no dia a dia. Ao final, haverá espaço para perguntas e networking.`,
        `Evento gratuito, com vagas limitadas. Associados têm prioridade na confirmação de presença.`,
      ),
    },
    {
      _id: 'demo-evento-cafe-investimento-anjo',
      titulo: 'Café com Startups: Investimento-anjo',
      slug: 'cafe-com-startups-investimento-anjo',
      inicio: to('2026-12-10', '08:00'),
      fim: to('2026-12-10', '10:00'),
      formato: 'presencial',
      local: 'Sede da Associação',
      cidade: refPalmas,
      capa: await capaEvento('Pessoas conversam em um café da manhã de negócios'),
      resumo:
        'Café da manhã com investidores-anjo para entender o que eles avaliam antes de apostar em uma startup e como se preparar para essa conversa.',
      descricao: blocos(
        `O Café com Startups é um encontro informal, em formato de roda de conversa, que reúne fundadores e pessoas experientes do mercado em torno de um tema. Nesta edição, o assunto é investimento-anjo.`,
        `Investidores convidados contam como escolhem as startups em que investem, quais erros mais veem nas apresentações e o que esperam da relação com os fundadores depois do aporte.`,
        `Vagas limitadas para manter a conversa próxima. Café da manhã por conta da associação.`,
      ),
    },
    {
      _id: 'demo-evento-mentoria-validacao',
      titulo: 'Mentoria coletiva: validação de mercado',
      slug: 'mentoria-coletiva-validacao-de-mercado',
      inicio: to('2026-12-17', '19:00'),
      fim: to('2026-12-17', '21:00'),
      formato: 'online',
      capa: await capaEvento('Mentora conduz uma apresentação sobre validação de mercado'),
      resumo:
        'Encontro online para revisar hipóteses, montar entrevistas com clientes e decidir o que medir antes de investir no produto.',
      descricao: blocos(
        `Uma mentoria coletiva e online para startups que ainda estão testando se o problema que resolvem é real e se alguém está disposto a pagar pela solução.`,
        `Em duas horas, vamos revisar as principais hipóteses de cada negócio, montar um roteiro de entrevistas com clientes e definir indicadores simples para acompanhar a validação. Os participantes podem trazer casos da própria startup.`,
        `O link de acesso será enviado por e-mail aos inscritos no dia do encontro.`,
      ),
    },
    {
      _id: 'demo-evento-encontro-associados-outubro',
      titulo: 'Encontro de Associados: balanço do ano e próximos passos',
      slug: 'encontro-de-associados-balanco-do-ano-e-proximos-passos',
      inicio: to('2026-10-15', '19:00'),
      fim: to('2026-10-15', '21:30'),
      formato: 'presencial',
      local: 'Sede da Associação',
      cidade: refPalmas,
      capa: await capaEvento('Associados acompanham uma apresentação da diretoria'),
      resumo:
        'A diretoria apresentou o balanço das ações de 2026 e ouviu os associados sobre as prioridades para o próximo ano.',
      descricao: blocos(
        `O Encontro de Associados reuniu membros da ${NOME} para um balanço das ações realizadas em 2026: eventos, parcerias, novos benefícios e a agenda de interiorização.`,
        `Na segunda parte, os associados se dividiram em grupos para discutir prioridades para 2027. As contribuições serão consolidadas pela diretoria e apresentadas no início do próximo ano.`,
      ),
    },
  ]

  const tx = client.transaction()
  for (const {slug, ...p} of posts) {
    tx.createOrReplace({_type: 'post', ...p, slug: {_type: 'slug', current: slug}})
  }
  for (const {slug, ...e} of eventos) {
    tx.createOrReplace({_type: 'evento', ...e, slug: {_type: 'slug', current: slug}})
  }
  await tx.commit()

  for (const d of [...posts, ...eventos]) console.log(`  ✓ ${d._id}  ${d.titulo}`)
  console.log(`\n${posts.length} posts e ${eventos.length} eventos de demonstração publicados.`)
}

async function remover() {
  const ids: string[] = await client.fetch(
    `*[_type in ["post", "evento"] && (string::startsWith(_id, "demo-") || string::startsWith(_id, "drafts.demo-"))]._id`,
  )
  if (!ids.length) {
    console.log('Nenhum documento de demonstração encontrado.')
    return
  }
  const tx = client.transaction()
  for (const id of ids) tx.delete(id)
  await tx.commit()
  for (const id of ids) console.log(`  ✗ ${id}`)
  console.log(`\n${ids.length} documentos de demonstração removidos (as imagens permanecem).`)
}

;(process.argv.includes('--remover') ? remover() : criar()).catch((err) => {
  console.error(err)
  process.exit(1)
})
