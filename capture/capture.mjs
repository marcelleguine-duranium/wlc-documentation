/**
 * Captura de telas do WLC para a documentação.
 *
 *   WLC_ORG='Duranium Demo' WLC_EMAIL=... WLC_PASSWORD=... node capture/capture.mjs
 *
 * Nunca deixe as credenciais no código nem no histórico do shell:
 *   read -rs "WLC_PASSWORD?senha: " && export WLC_PASSWORD
 *
 * Flags:
 *   --only=<secao>     captura apenas uma seção (ex.: --only=admin)
 *   --slug=<slug>      captura apenas uma tela
 *   --headed           abre o navegador visível
 *   --relogin          ignora a sessão salva e refaz o login
 *   --organizacoes     apenas lista as organizações disponíveis e sai
 */

import { chromium } from 'playwright'
import { medirVazio } from './analisar.mjs'
import { mkdir, writeFile, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ROTAS, ROTAS_EXCLUIDAS, SECOES } from './routes.mjs'

const AQUI = path.dirname(fileURLToPath(import.meta.url))
const RAIZ = path.resolve(AQUI, '..')
const DESTINO = path.join(RAIZ, 'assets', 'screenshots')
const SESSAO = path.join(AQUI, '.auth', 'state.json')

const BASE_URL = process.env.WLC_BASE_URL ?? 'https://app.weluvcode.ai'
const EMAIL = process.env.WLC_EMAIL
const SENHA = process.env.WLC_PASSWORD
/**
 * Organização que deve estar ativa durante a captura.
 * Trava de segurança: nenhum print autenticado é gravado se a organização
 * exibida na interface não for exatamente esta. Evita publicar telas com o
 * nome de uma organização cliente.
 */
const ORG = process.env.WLC_ORG
const VIEWPORT = { width: 1440, height: 900 }
/**
 * Densidade da captura. Com 2, cada print sai com o dobro de pixels no mesmo
 * enquadramento — o que a documentação precisa para imprimir nítida: na largura
 * de coluna do PDF, 1440 px rendem 210 dpi e 2880 px rendem 420 dpi.
 * As coordenadas dos recortes continuam sendo declaradas na escala 1x.
 */
const ESCALA = Number(process.env.WLC_ESCALA ?? 2)
const ESPERA_RENDER = Number(process.env.WLC_ESPERA_MS ?? 1500)
const TIMEOUT_CONTEUDO = Number(process.env.WLC_TIMEOUT_CONTEUDO_MS ?? 20_000)

const args = process.argv.slice(2)
const flag = (nome) => args.find((a) => a.startsWith(`--${nome}=`))?.split('=')[1]
const temFlag = (nome) => args.includes(`--${nome}`)
/** Aceitam lista separada por vírgula: --only=admin,workspace */
const lista = (valor) => valor?.split(',').map((v) => v.trim()).filter(Boolean) ?? null
const filtroSecao = lista(flag('only'))
const filtroSlug = lista(flag('slug'))

const SELETORES_OCULTOS = (process.env.WLC_OCULTAR ?? '')
  .split(',').map((s) => s.trim()).filter(Boolean)
/** Seletores adicionais a borrar nas telas marcadas com `redact`. */
const SELETORES_BORRAR = (process.env.WLC_BORRAR ?? '')
  .split(',').map((s) => s.trim()).filter(Boolean)

/** Marcadores de carregamento usados pela interface (Tailwind/shadcn). */
const SELETOR_ESQUELETO = '.animate-pulse, [data-loading="true"], [aria-busy="true"]'

const log = (...m) => console.log(...m)

/**
 * Espera a tela sair do estado de carregamento.
 * Sem isso os prints saem com blocos cinzas no lugar do conteúdo.
 */
async function esperarConteudo(page) {
  await page.waitForLoadState('networkidle', { timeout: TIMEOUT_CONTEUDO }).catch(() => {})
  await page
    .waitForFunction(
      (sel) => document.querySelectorAll(sel).length === 0,
      SELETOR_ESQUELETO,
      { timeout: TIMEOUT_CONTEUDO },
    )
    .catch(() => {})
  await page.waitForTimeout(ESPERA_RENDER)
}

/** Nome da organização exibido no seletor da barra lateral. */
async function organizacaoAtual(page) {
  return page.evaluate(() => {
    const botao = [...document.querySelectorAll('button')]
      .find((b) => /organiza[çc][ãa]o/i.test(b.textContent ?? ''))
    if (!botao) return null
    return (botao.textContent ?? '').replace(/organiza[çc][ãa]o/i, '').replace(/\s+/g, ' ').trim()
  })
}

/**
 * Garante que a organização ativa é a esperada, trocando se necessário.
 * Lança erro em vez de capturar a organização errada.
 */
async function garantirOrganizacao(page) {
  let atual = await organizacaoAtual(page)
  if (atual === ORG) return atual

  const seletor = page.locator('button').filter({ hasText: /organiza[çc][ãa]o/i }).first()
  if (await seletor.count()) {
    await seletor.click().catch(() => {})
    await page.waitForTimeout(800)
    const opcao = page.locator('[role="menuitemradio"], [role="menuitem"], [role="option"]')
      .filter({ hasText: ORG }).first()
    if (await opcao.count()) {
      await opcao.click().catch(() => {})
      await esperarConteudo(page)
      atual = await organizacaoAtual(page)
    } else {
      await page.keyboard.press('Escape').catch(() => {})
    }
  }

  if (atual !== ORG) {
    throw new Error(
      `Organização ativa é "${atual ?? 'desconhecida'}", mas WLC_ORG exige "${ORG}". ` +
      'Nenhum print foi gravado. Troque a organização na interface e rode de novo com --relogin, ' +
      'ou ajuste WLC_ORG se a organização correta for outra.',
    )
  }
  return atual
}

/**
 * Borra identificação pessoal nas telas marcadas com `redact`.
 *
 * Não basta borrar o e-mail: nas listas de pessoas o nome fica na mesma célula,
 * logo acima do endereço. Por isso o blur sobe até a célula que contém o e-mail,
 * cobrindo nome e endereço juntos. `WLC_BORRAR` acrescenta seletores extras.
 */
async function borrarIdentificacao(page, seletoresExtras) {
  await page.evaluate((extras) => {
    const padrao = /[\w.+-]+@[\w-]+\.[\w.]+/
    for (const el of document.querySelectorAll('td, span, div, p, a, li')) {
      if (el.children.length === 0 && padrao.test(el.textContent ?? '')) {
        const alvo = el.closest('td') ?? el.parentElement ?? el
        alvo.style.filter = 'blur(5px)'
      }
    }
    for (const sel of extras) {
      for (const el of document.querySelectorAll(sel)) el.style.filter = 'blur(5px)'
    }
  }, seletoresExtras)
}

async function ocultarRuido(page) {
  if (!SELETORES_OCULTOS.length) return
  await page.addStyleTag({
    content: SELETORES_OCULTOS.map((s) => `${s} { visibility: hidden !important; }`).join('\n'),
  })
}

async function fazerLogin(context) {
  if (!EMAIL || !SENHA) {
    throw new Error('Defina WLC_EMAIL e WLC_PASSWORD no ambiente antes de rodar.')
  }
  const page = await context.newPage()
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded' })
  await page.fill('#email', EMAIL)
  await page.fill('#password', SENHA)
  await page.click('form button[type="submit"]')
  try {
    await page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 30_000 })
  } catch {
    // Continuar em /login depois do envio não é lentidão: o motivo está escrito
    // na tela — credencial recusada, desafio de senha nova, MFA. Sem trazer esse
    // texto, o erro que chega ao terminal é um timeout sem diagnóstico.
    const motivo = await page.evaluate(() => {
      const limpar = (el) => (el?.textContent ?? '').replace(/\s+/g, ' ').trim()
      const alerta = document.querySelector('[role="alert"], [data-sonner-toast], [data-radix-toast-root]')
      return limpar(alerta) || null
    })
    throw new Error(
      'O login não saiu de /login em 30s. ' +
      (motivo
        ? `A tela informa: "${motivo}".`
        : 'Nenhuma mensagem de erro visível na tela.') +
      '\nConfira WLC_EMAIL e WLC_PASSWORD, e rode com --headed para acompanhar o navegador.',
    )
  }
  await mkdir(path.dirname(SESSAO), { recursive: true })
  await context.storageState({ path: SESSAO })
  log('  sessão autenticada e salva')
  await page.close()
}

/**
 * Descobre um contextId e um repoId reais navegando pela interface.
 * Prefere um repositório que já tenha Score calculado: repositórios ainda em
 * processamento exibem estado vazio, que não ilustra a funcionalidade.
 * WLC_CONTEXT_ID e WLC_REPO_ID permitem fixar a escolha.
 */
/**
 * Um id só pode conter os caracteres que aparecem em um segmento de URL. Quem
 * copia o comando do README junto com o `<id>` de exemplo cairia numa rota
 * `/contexts/%3Cid%3E/home`, que responde uma tela vazia — print legítimo para
 * o script e inútil para a documentação.
 */
function validarId(nome, valor) {
  if (!valor) return null
  if (!/^[A-Za-z0-9_-]+$/.test(valor)) {
    throw new Error(
      `${nome} inválido: "${valor}". Informe o id que aparece na URL do produto`
      + ' ao abrir um contexto ou repositório, sem os sinais de menor e maior.'
      + ` Se o valor veio de um exemplo copiado, limpe com: unset ${nome}`,
    )
  }
  return valor
}

async function descobrirIds(page) {
  const idContexto = validarId('WLC_CONTEXT_ID', process.env.WLC_CONTEXT_ID)
  const idRepo = validarId('WLC_REPO_ID', process.env.WLC_REPO_ID)
  if (idContexto && idRepo) {
    return { contextId: idContexto, repoId: idRepo }
  }

  let contextId = idContexto ?? null

  if (!contextId) {
    await page.goto(`${BASE_URL}/contexts`, { waitUntil: 'domcontentloaded' })
    await esperarConteudo(page)
    const href = await page.evaluate(() =>
      [...document.querySelectorAll('a[href^="/contexts/"]')]
        .map((a) => a.getAttribute('href'))
        .find((h) => /^\/contexts\/[^/]+\/./.test(h ?? '')) ?? null,
    )
    if (href) contextId = href.split('/')[2]
  }

  if (idRepo) return { contextId, repoId: idRepo }

  // O repositório precisa pertencer ao contexto escolhido, senão a rota
  // /contexts/<ctx>/repo/<repo>/ não resolve. Com o contexto em mãos, a busca
  // começa pela lista dele; sem contexto, pela lista geral.
  const urlLista = contextId ? `${BASE_URL}/contexts/${contextId}/repos` : `${BASE_URL}/repositories`
  await page.goto(urlLista, { waitUntil: 'domcontentloaded' })
  await esperarConteudo(page)

  // Os cards de repositório não são âncoras: é preciso clicar para chegar à rota.
  // Um card com Score exibe uma nota do tipo "6.5"; sem Score exibe travessão.
  const comScore = page.locator('[class*="cursor-pointer"], [role="button"]')
    .filter({ hasText: /\b\d[.,]\d\b/ })
  const card = (await comScore.count())
    ? comScore.first()
    : page.locator('[class*="cursor-pointer"], [role="button"]').first()

  if (await card.count()) {
    await card.click().catch(() => {})
    await esperarConteudo(page)
    const m = new URL(page.url()).pathname.match(/\/contexts\/([^/]+)\/repo\/([^/]+)\//)
    if (m) {
      // Repositório ainda sem Score rende telas vazias, que não ilustram nada.
      const semScore = await page.locator('text=/Ainda estamos calculando o Score/i').count()
      if (semScore) {
        log('  aviso: o repositório escolhido ainda não tem Score calculado.')
        log('         Fixe outro com WLC_REPO_ID para telas com dados.')
      }
      return { contextId: contextId ?? m[1], repoId: m[2] }
    }
  }
  return { contextId, repoId: null }
}

/**
 * Executa a sequência de interações declarada em `rota.passos` antes do print.
 *
 * Existe para telas que não têm rota própria — assistentes, painéis e diálogos
 * que são estado interno da mesma URL. Cada passo é uma ação declarativa:
 *
 *   { clicar: 'Novo Plano' }                       clica pelo texto visível
 *   { clicarAria: 'Perguntar ao Navigate' }        clica pelo aria-label
 *   { preencher: ['Ex: Ana Silva', 'Ana Silva'] }  preenche pelo placeholder
 *   { escolher: [0, 'Pleno (3-5 anos)'] }          abre o n-ésimo select e escolhe
 *   { esperar: 800 }                               pausa explícita, em ms
 *
 * Nenhuma ação de submissão é usada aqui: as sequências param antes dos botões
 * que geram registros ou disparam processamento.
 */
async function executarPassos(page, passos) {
  for (const passo of passos) {
    if (passo.esperar) {
      await page.waitForTimeout(passo.esperar)
      continue
    }
    if (passo.clicar) {
      await page.getByText(passo.clicar, { exact: false }).first().click({ timeout: 15_000 })
    } else if (passo.clicarAria) {
      await page.locator(`[aria-label="${passo.clicarAria}"]`).first().click({ timeout: 15_000 })
    } else if (passo.preencher) {
      const [placeholder, valor] = passo.preencher
      await page.getByPlaceholder(placeholder).first().fill(valor, { timeout: 15_000 })
    } else if (passo.escolher) {
      const [indice, opcao] = passo.escolher
      // Só botões: o campo de busca da barra lateral também tem role=combobox
      // e, sendo o primeiro do DOM, roubaria o índice 0.
      await page.locator('button[role="combobox"]').nth(indice).click({ timeout: 15_000 })
      await page.waitForTimeout(400)
      await page.getByRole('option', { name: opcao }).first().click({ timeout: 15_000 })
    }
    await page.waitForTimeout(passo.pausa ?? 600)
  }
}

async function capturar(page, rota, ids) {
  const caminho = rota.path
    .replace('{contextId}', ids.contextId ?? '')
    .replace('{repoId}', ids.repoId ?? '')

  // Um id ausente vira segmento vazio ("/contexts//home") e a rota cai em 404.
  // Melhor pular explicitamente do que gravar um print de "página não encontrada".
  if (caminho.includes('{') || caminho.includes('//')) {
    return { ...rota, status: 'pulada', motivo: 'id de contexto ou repositório não descoberto' }
  }

  const arquivo = path.join(DESTINO, `${rota.slug}.png`)
  try {
    // Telas com rolagem interna não são cobertas por fullPage: o scroll fica em
    // um container, não no body. Para essas, `altura` amplia a janela.
    if (rota.altura) await page.setViewportSize({ width: VIEWPORT.width, height: rota.altura })
    else await page.setViewportSize(VIEWPORT)
    await page.goto(`${BASE_URL}${caminho}`, { waitUntil: 'domcontentloaded', timeout: 30_000 })
    await esperarConteudo(page)

    if (rota.passos) {
      await executarPassos(page, rota.passos)
      await esperarConteudo(page)
    }

    const org = await organizacaoAtual(page)
    if (ORG && org && org !== ORG) {
      return { ...rota, caminho, status: 'pulada', motivo: `organização mudou para "${org}"` }
    }

    await ocultarRuido(page)
    if (rota.redact) await borrarIdentificacao(page, SELETORES_BORRAR)
    await page.screenshot({ path: arquivo, fullPage: true })

    const u = new URL(page.url())
    const urlFinal = u.pathname + u.search
    return {
      ...rota,
      caminho,
      status: 'ok',
      arquivo: path.relative(RAIZ, arquivo),
      urlFinal,
      redirecionou: urlFinal !== caminho && !rota.passos,
    }
  } catch (erro) {
    return { ...rota, caminho, status: 'erro', motivo: erro.message.split('\n')[0] }
  }
}

/**
 * Modo diagnóstico: mostra o usuário logado, a organização ativa e as
 * organizações que o seletor oferece. Não grava nenhum print.
 */
async function listarOrganizacoes(browser) {
  if (!existsSync(SESSAO)) {
    throw new Error('Nenhuma sessão salva. Rode uma captura primeiro, ou use --relogin.')
  }
  const contexto = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: ESCALA, locale: 'pt-BR', storageState: SESSAO })
  const page = await contexto.newPage()
  await page.goto(`${BASE_URL}/overview`, { waitUntil: 'domcontentloaded' })
  await esperarConteudo(page)

  const atual = await organizacaoAtual(page)
  const seletor = page.locator('button').filter({ hasText: /organiza[çc][ãa]o/i }).first()
  await seletor.click().catch(() => {})
  await page.waitForTimeout(1200)
  const opcoes = await page.evaluate(() =>
    [...document.querySelectorAll('[role="menuitemradio"], [role="menuitem"], [role="option"]')]
      .map((i) => (i.textContent ?? '').replace(/\s+/g, ' ').trim())
      .filter(Boolean))

  log(`\nOrganização ativa: ${atual ?? 'não identificada'}`)
  log(`Organizações no seletor (${opcoes.length}):`)
  for (const o of opcoes) log(`  - ${o}`)
  if (opcoes.length <= 1) {
    log('\nO seletor não oferece outra organização: esta conta enxerga apenas a atual.')
  }
  await contexto.close()
}

async function main() {
  await mkdir(DESTINO, { recursive: true })

  if (temFlag('organizacoes')) {
    const browser = await chromium.launch({ headless: !temFlag('headed') })
    await listarOrganizacoes(browser).finally(() => browser.close())
    return
  }

  let selecionadas = ROTAS
  if (filtroSecao) selecionadas = selecionadas.filter((r) => filtroSecao.includes(r.secao))
  if (filtroSlug) selecionadas = selecionadas.filter((r) => filtroSlug.includes(r.slug))
  if (!selecionadas.length) {
    console.error('Nenhuma rota corresponde ao filtro informado.')
    process.exit(1)
  }

  const privadas = selecionadas.filter((r) => r.auth === 'privada')
  if (privadas.length && !ORG) {
    console.error(
      'Defina WLC_ORG com o nome exato da organização a documentar, por exemplo:\n' +
      "  export WLC_ORG='Duranium Demo'\n" +
      'A captura autenticada é bloqueada sem essa trava, para não gravar telas de outra organização.',
    )
    process.exit(1)
  }

  const browser = await chromium.launch({ headless: !temFlag('headed') })
  const resultados = []

  const publicas = selecionadas.filter((r) => r.auth === 'publica')
  if (publicas.length) {
    log(`\nTelas públicas (${publicas.length})`)
    const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: ESCALA, locale: 'pt-BR' })
    const page = await ctx.newPage()
    for (const rota of publicas) {
      const r = await capturar(page, rota, {})
      log(`  ${r.status === 'ok' ? '✓' : '×'} ${rota.slug}${r.motivo ? ` — ${r.motivo}` : ''}`)
      resultados.push(r)
    }
    await ctx.close()
  }

  if (privadas.length) {
    if (temFlag('relogin') && existsSync(SESSAO)) await rm(SESSAO)
    const temSessao = existsSync(SESSAO)
    const contexto = await browser.newContext({
      viewport: VIEWPORT, deviceScaleFactor: ESCALA,
      locale: 'pt-BR',
      ...(temSessao ? { storageState: SESSAO } : {}),
    })
    if (temSessao) {
      log('\nReaproveitando sessão salva em capture/.auth/state.json')
    } else {
      log('\nAutenticando…')
      await fazerLogin(contexto)
    }

    const page = await contexto.newPage()
    await page.goto(`${BASE_URL}/overview`, { waitUntil: 'domcontentloaded' })
    await esperarConteudo(page)

    const org = await garantirOrganizacao(page)
    log(`Organização ativa: ${org}`)

    log('Descobrindo ids de contexto e repositório…')
    const ids = await descobrirIds(page)
    log(`  contextId=${ids.contextId ?? '—'} repoId=${ids.repoId ?? '—'}`)
    if (!ids.contextId || !ids.repoId) {
      log('  aviso: as telas de contexto e repositório serão puladas')
    }

    log(`\nTelas autenticadas (${privadas.length})`)
    for (const rota of privadas) {
      const r = await capturar(page, rota, ids)
      const marca = r.status === 'ok' ? '✓' : r.status === 'pulada' ? '–' : '×'
      const aviso = r.redirecionou ? ` (redirecionou para ${r.urlFinal})` : ''
      log(`  ${marca} ${rota.slug}${aviso}${r.motivo ? ` — ${r.motivo}` : ''}`)
      resultados.push(r)
    }
    await contexto.close()
  }

  await browser.close()

  await writeFile(
    path.join(RAIZ, 'capture', 'manifest.json'),
    JSON.stringify({
      baseUrl: BASE_URL,
      organizacao: ORG ?? null,
      viewport: VIEWPORT, deviceScaleFactor: ESCALA,
      secoes: SECOES,
      capturas: resultados,
      excluidas: ROTAS_EXCLUIDAS,
    }, null, 2),
  )

  const ok = resultados.filter((r) => r.status === 'ok')
  const puladas = resultados.filter((r) => r.status === 'pulada')
  const erros = resultados.filter((r) => r.status === 'erro')
  const redirects = ok.filter((r) => r.redirecionou)

  // Uma tela gravada no estado errado é um sucesso para o script: a rota
  // respondeu e o print saiu. Só os pixels denunciam que não há nada ali.
  const vazias = []
  if (ok.length) {
    // O navegador da captura já foi encerrado neste ponto; a medição roda em um
    // próprio, que serve apenas de canvas para ler os pixels dos arquivos.
    const leitor = await chromium.launch()
    const aux = await leitor.newPage()
    for (const r of ok) {
      const medida = await medirVazio(aux, path.join(DESTINO, `${r.slug}.png`))
      if (medida.suspeita) vazias.push({ slug: r.slug, pct: medida.pct })
    }
    await leitor.close()
  }

  log(`\n${ok.length}/${resultados.length} telas capturadas em assets/screenshots/`)
  if (redirects.length) {
    log(`${redirects.length} rota(s) redirecionaram — o print mostra a tela de destino:`)
    for (const r of redirects) log(`  ${r.slug}: ${r.caminho} -> ${r.urlFinal}`)
  }
  if (puladas.length) {
    log(`${puladas.length} pulada(s):`)
    for (const r of puladas) log(`  ${r.slug}: ${r.motivo}`)
  }
  if (erros.length) {
    log(`${erros.length} erro(s):`)
    for (const r of erros) log(`  ${r.slug}: ${r.motivo}`)
  }
  if (vazias.length) {
    log(`\nATENÇÃO — ${vazias.length} captura(s) parecem vazias:`)
    for (const v of vazias) log(`  ${v.slug}: ${v.pct}% da imagem é cor sólida`)
    log('  Confira a tela no produto. Um id inexistente ou um contexto sem dados')
    log('  grava um print legítimo para o script e inútil para a documentação.')
  }
  log('Manifesto: capture/manifest.json')
}

main().catch((e) => { console.error('\n' + e.message); process.exit(1) })
