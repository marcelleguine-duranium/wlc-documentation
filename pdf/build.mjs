/**
 * Gera o manual do WLC em PDF a partir dos arquivos em docs/.
 *
 *   node pdf/build.mjs
 *
 * A saída são dois arquivos em pdf/: manual.html (intermediário, útil para
 * conferir antes de imprimir) e WeLuvCode-Manual-do-Usuario.pdf. O texto vem
 * inteiramente de docs/ e de pdf/conteudo/ — não edite o HTML à mão.
 */

import { readFile, writeFile } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { marked } from 'marked'
import { chromium } from 'playwright'
import { PARTES, APENDICES, PERFIS, EXCLUIDOS } from './estrutura.mjs'

const execArquivo = promisify(execFile)
const AQUI = path.dirname(fileURLToPath(import.meta.url))
const RAIZ = path.resolve(AQUI, '..')
const DOCS = path.join(RAIZ, 'docs')
const CONTEUDO = path.join(AQUI, 'conteudo')

const TITULO = 'WeLuvCode — Manual do Usuário'
const SAIDA_HTML = path.join(AQUI, 'manual.html')
const SAIDA_PDF = path.join(AQUI, 'WeLuvCode-Manual-do-Usuario.pdf')

const escapar = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Slug no mesmo formato usado pelos links do markdown e pelo site. */
const slug = (texto) => texto
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase()
  .replace(/<[^>]+>/g, '')
  .replace(/[^a-z0-9\s-]/g, '')
  .trim()
  .replace(/\s+/g, '-')

/** Divide o markdown em preâmbulo e blocos de H2, ignorando blocos de código. */
function blocosPorSecao(md) {
  const blocos = [{ titulo: null, linhas: [] }]
  let emFence = false
  for (const linha of md.split('\n')) {
    if (/^\s*```/.test(linha)) emFence = !emFence
    const cabecalho = emFence ? null : linha.match(/^##\s+(.+)$/)
    if (cabecalho) blocos.push({ titulo: cabecalho[1].trim(), linhas: [linha] })
    else blocos.at(-1).linhas.push(linha)
  }
  return blocos
}

/** Aplica o recorte de seções declarado no manifesto. */
function recortar(md, secoes) {
  if (!secoes) return md
  const desejadas = new Set(secoes.map(slug))
  const usadas = new Set()
  const escolhidos = blocosPorSecao(md).filter((b) => {
    if (b.titulo === null) return true
    const s = slug(b.titulo)
    if (!desejadas.has(s)) return false
    usadas.add(s)
    return true
  })
  for (const s of desejadas) {
    if (!usadas.has(s)) throw new Error(`Seção declarada no manifesto não existe no markdown: ${s}`)
  }
  return escolhidos.map((b) => b.linhas.join('\n')).join('\n')
}

/** Remove do markdown as referências aos arquivos que não entram no manual. */
function removerExcluidos(md) {
  let saida = md
  for (const arquivo of Object.keys(EXCLUIDOS)) {
    saida = saida
      .split('\n')
      .filter((l) => !(l.trimStart().startsWith('|') && l.includes(arquivo)))
      .join('\n')
    const link = new RegExp(`\\[([^\\]]+)\\]\\(${arquivo.replace('.', '\\.')}[^)]*\\)`, 'g')
    saida = saida.replace(link, '$1')
  }
  return saida
}

/**
 * Converte o markdown de uma unidade (capítulo ou apêndice) em HTML,
 * numerando seções e figuras e registrando as âncoras para os links internos.
 */
function renderizar(md, unidade, indice) {
  const corpo = removerExcluidos(recortar(md, unidade.secoes)).replace(/^#\s+.+$/m, '')
  let html = marked.parse(corpo)

  // O capítulo é destino de link mesmo que o arquivo não tenha subtítulos.
  if (unidade.fonte && !indice.arquivos.has(unidade.fonte)) {
    indice.arquivos.set(unidade.fonte, { ancora: unidade.id, unidade })
  }

  let n2 = 0
  let n3 = 0
  let figura = 0

  // Numeração em uma única passada, para que os H3 sigam o H2 que os antecede.
  html = html.replace(/<h([23])[^>]*>([\s\S]*?)<\/h\1>/g, (_, nivel, texto) => {
    let numero
    if (nivel === '2') {
      n2 += 1
      n3 = 0
      numero = `${unidade.prefixo}.${n2}`
    } else {
      n3 += 1
      numero = `${unidade.prefixo}.${n2}.${n3}`
    }
    const id = `${unidade.id}--${slug(texto)}`
    registrar(indice, unidade, slug(texto), id)
    return `<h${nivel} id="${id}"><span class="num">${numero}</span> ${texto}</h${nivel}>`
  })

  html = html.replace(/<p><img([^>]*)><\/p>/g, (_, atributos) => {
    figura += 1
    const legenda = atributos.match(/alt="([^"]*)"/)?.[1] ?? ''
    const numero = `Figura ${unidade.prefixo}.${figura}`
    return `<figure><img${atributos}>`
      + `<figcaption><span class="fig-num">${numero}</span>`
      + `${legenda ? ` — ${escapar(legenda)}` : ''}</figcaption></figure>`
  })

  html = html.replace(/<blockquote>([\s\S]*?)<\/blockquote>/g, (_, interno) => {
    const atencao = /^\s*<p>\s*(<strong>)?\s*Atenção/.test(interno)
    const rotulo = atencao ? 'Atenção' : 'Nota'
    return `<aside class="destaque ${atencao ? 'atencao' : 'nota'}">`
      + `<span class="destaque-rotulo">${rotulo}</span>${interno}</aside>`
  })

  // Links entre documentos viram marcadores, resolvidos depois de tudo indexado.
  html = html.replace(/href="([a-z0-9-]+\.md)(#[^"]*)?"/g, (_, arquivo, hash) =>
    `href="@@${arquivo}${hash ?? ''}@@"`)

  if (unidade.remissao) {
    html += `<aside class="destaque nota"><span class="destaque-rotulo">Nota</span>`
      + `<p>${escapar(unidade.remissao)}</p></aside>`
  }

  return html
}

function registrar(indice, unidade, slugOrigem, ancora) {
  if (!unidade.fonte) return
  const chave = `${unidade.fonte}#${slugOrigem}`
  if (!indice.slugs.has(chave)) indice.slugs.set(chave, { ancora, unidade })
  if (!indice.arquivos.has(unidade.fonte)) {
    indice.arquivos.set(unidade.fonte, { ancora: unidade.id, unidade })
  }
}

/** Monta a lista linear de unidades numeradas. */
function montarUnidades() {
  const unidades = []
  let capitulo = 0
  for (const parte of PARTES) {
    for (const cap of parte.capitulos) {
      capitulo += 1
      unidades.push({
        ...cap,
        tipo: 'capitulo',
        parte,
        id: `cap-${capitulo}`,
        prefixo: String(capitulo),
        rotulo: `Capítulo ${capitulo}`,
      })
    }
  }
  for (const ap of APENDICES) {
    unidades.push({
      ...ap,
      tipo: 'apendice',
      id: `ap-${ap.letra.toLowerCase()}`,
      prefixo: ap.letra,
      rotulo: `Apêndice ${ap.letra}`,
    })
  }
  return unidades
}

async function carregarMarkdown(unidade) {
  const arquivo = unidade.fonte
    ? path.join(DOCS, unidade.fonte)
    : path.join(CONTEUDO, unidade.conteudo)
  return readFile(arquivo, 'utf8')
}

async function revisao() {
  try {
    const { stdout } = await execArquivo('git', ['rev-parse', '--short', 'HEAD'], { cwd: RAIZ })
    return stdout.trim()
  } catch {
    return null
  }
}

function dataPorExtenso() {
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Sao_Paulo',
  }).format(new Date())
}

function sumario(unidades) {
  const linhas = []
  let parteAtual = null
  for (const u of unidades) {
    if (u.tipo === 'capitulo' && u.parte !== parteAtual) {
      parteAtual = u.parte
      linhas.push(`<li class="sumario-parte">${parteAtual.rotulo} — ${escapar(parteAtual.titulo)}</li>`)
    }
    if (u.tipo === 'apendice' && parteAtual !== 'apendices') {
      parteAtual = 'apendices'
      linhas.push('<li class="sumario-parte">Apêndices</li>')
    }
    linhas.push(
      `<li class="sumario-item"><a href="#${u.id}">`
      + `<span class="sumario-num">${u.prefixo}</span>`
      + `<span class="sumario-titulo">${escapar(u.titulo)}</span>`
      + `<span class="sumario-perfil">${PERFIS[u.perfil]}</span></a></li>`,
    )
  }
  return `<ol class="sumario">${linhas.join('\n')}</ol>`
}

async function main() {
  const unidades = montarUnidades()
  const indice = { slugs: new Map(), arquivos: new Map() }

  for (const u of unidades) {
    u.html = renderizar(await carregarMarkdown(u), u, indice)
  }

  const comoUsar = marked.parse((await readFile(path.join(CONTEUDO, 'como-usar.md'), 'utf8'))
    .replace(/^#\s+.+$/m, ''))

  const sha = await revisao()
  const data = dataPorExtenso()

  const corpo = []
  let parteAtual = null
  let emApendices = false

  for (const u of unidades) {
    if (u.tipo === 'capitulo' && u.parte !== parteAtual) {
      parteAtual = u.parte
      corpo.push(`
        <section class="folha-parte">
          <p class="folha-rotulo">${parteAtual.rotulo}</p>
          <h1 class="folha-titulo">${escapar(parteAtual.titulo)}</h1>
          <p class="folha-resumo">${escapar(parteAtual.resumo)}</p>
          <ol class="folha-lista">
            ${parteAtual.capitulos.map((c) => `<li>${escapar(c.titulo)}</li>`).join('')}
          </ol>
          <img class="folha-marca" src="../assets/marca/weluvcode-logo-fundo-escuro.png" alt="WeLuvCode">
        </section>`)
    }
    if (u.tipo === 'apendice' && !emApendices) {
      emApendices = true
      corpo.push(`
        <section class="folha-parte">
          <p class="folha-rotulo">Apêndices</p>
          <h1 class="folha-titulo">Referência</h1>
          <p class="folha-resumo">Material de consulta: a mecânica completa do Score,
          a referência de perfis e permissões e o glossário dos termos da interface.</p>
          <ol class="folha-lista">
            ${APENDICES.map((a) => `<li>Apêndice ${a.letra} — ${escapar(a.titulo)}</li>`).join('')}
          </ol>
          <img class="folha-marca" src="../assets/marca/weluvcode-logo-fundo-escuro.png" alt="WeLuvCode">
        </section>`)
    }
    corpo.push(`
      <section class="capitulo" id="${u.id}">
        <header class="capitulo-cabecalho">
          <p class="capitulo-rotulo">${u.rotulo}<span class="capitulo-perfil">${PERFIS[u.perfil]}</span></p>
          <h1><span class="num">${u.prefixo}</span> ${escapar(u.titulo)}</h1>
        </header>
        ${u.html}
      </section>`)
  }

  let html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>${TITULO}</title>
<style>${await readFile(path.join(AQUI, 'estilo.css'), 'utf8')}</style>
</head>
<body>

<section class="capa">
  <div class="capa-topo">
    <img class="capa-logo" src="../assets/marca/weluvcode-logo-fundo-escuro.png" alt="WeLuvCode">
    <p class="capa-linha"></p>
  </div>
  <div class="capa-centro">
    <h1>Manual do Usuário</h1>
    <p class="capa-sub">Plataforma de produtividade e insights de engenharia</p>
  </div>
  <div class="capa-rodape">
    <p>Edição de ${data}${sha ? ` · revisão ${sha}` : ''}</p>
    <p class="capa-confidencial">Documento confidencial. Distribuição restrita ao cliente destinatário.</p>
  </div>
</section>

<section class="controle">
  <img class="marca-pagina" src="../assets/marca/weluvcode-logo-fundo-claro.png" alt="WeLuvCode">
  <h1>Sobre este documento</h1>
  <table class="controle-tabela">
    <tbody>
      <tr><th>Documento</th><td>${TITULO}</td></tr>
      <tr><th>Edição</th><td>${data}</td></tr>
      ${sha ? `<tr><th>Revisão</th><td>${sha}</td></tr>` : ''}
      <tr><th>Público</th><td>Administradores e gestores do workspace</td></tr>
      <tr><th>Escopo</th><td>Uso do produto e configuração do workspace</td></tr>
      <tr><th>Classificação</th><td>Confidencial</td></tr>
    </tbody>
  </table>
  <h2>Capturas de tela</h2>
  <p>As telas reproduzidas foram capturadas em um workspace de demonstração, cujos
  repositórios são projetos de código aberto. Números, nomes de repositório e valores
  de indicador ilustram a interface e não representam dado de nenhum cliente. Onde
  aparecem endereços de e-mail, a área correspondente foi borrada na captura.</p>
  <h2>Atualização</h2>
  <p>O produto evolui, e as telas mudam. Confirme a edição deste manual antes de
  usá-lo como referência para uma configuração nova.</p>
</section>

<section class="sumario-pagina">
  <h1>Sumário</h1>
  ${sumario(unidades)}
</section>

<section class="como-usar">
  <h1>Como usar este manual</h1>
  ${comoUsar}
</section>

${corpo.join('\n')}

</body>
</html>`

  // Resolve os links entre documentos, agora que todas as âncoras existem.
  const naoResolvidos = new Set()
  html = html.replace(/href="@@([a-z0-9-]+\.md)(#[^"@]*)?@@"/g, (_, arquivo, hash) => {
    const porSlug = hash ? indice.slugs.get(`${arquivo}${hash}`) : null
    const destino = porSlug ?? indice.arquivos.get(arquivo)
    if (!destino) {
      naoResolvidos.add(arquivo + (hash ?? ''))
      return 'href="#" class="link-morto"'
    }
    return `href="#${destino.ancora}" data-ref="${destino.unidade.rotulo}"`
  })

  // Anexa ao link a referência textual, para quem lê o manual impresso.
  html = html.replace(/<a href="#([^"]+)" data-ref="([^"]+)">([\s\S]*?)<\/a>/g,
    (_, ancora, ref, texto) => `<a href="#${ancora}">${texto}</a> <span class="ref">(${ref})</span>`)

  await writeFile(SAIDA_HTML, html, 'utf8')

  // A redução das figuras usa canvas sobre imagens em file://; sem esta flag o
  // canvas fica marcado como de outra origem e não pode ser exportado.
  const navegador = await chromium.launch({ args: ['--allow-file-access-from-files'] })
  const pagina = await navegador.newPage()
  await pagina.goto(`file://${SAIDA_HTML}`, { waitUntil: 'load' })
  await pagina.emulateMedia({ media: 'print' })

  // Uma imagem quebrada some no PDF sem erro: melhor falhar aqui.
  const quebradas = await pagina.$$eval('img', (imgs) => imgs
    .filter((i) => !i.complete || i.naturalWidth === 0)
    .map((i) => i.getAttribute('src')))
  if (quebradas.length) {
    await navegador.close()
    throw new Error(`Imagens não carregaram: ${quebradas.join(', ')}`)
  }

  // Figura muito alta domina a página e atrapalha a leitura: a saída é recortar
  // a captura em capture/recortes.mjs, não encolher a imagem no CSS.
  // A coluna de texto tem 174 mm; a altura sai da proporção da própria imagem,
  // e não do layout da janela, que não corresponde ao da página impressa.
  // Acima de 300 dpi a imagem só engorda o arquivo: o papel não mostra a
  // diferença. A redução acontece aqui, na impressão, para que a central de
  // ajuda continue com a resolução cheia, que as telas de alta densidade usam.
  const LARGURA_MAX = Math.round((174 / 25.4) * 300)
  const reduzidas = await pagina.$$eval('figure img', async (imgs, larguraMax) => {
    let n = 0
    for (const img of imgs) {
      if (img.naturalWidth <= larguraMax * 1.07) continue
      const k = larguraMax / img.naturalWidth
      const c = document.createElement('canvas')
      c.width = larguraMax
      c.height = Math.round(img.naturalHeight * k)
      const ctx = c.getContext('2d')
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, c.width, c.height)
      img.src = c.toDataURL('image/png')
      await img.decode()
      n += 1
    }
    return n
  }, LARGURA_MAX)

  const figurasMedidas = await pagina.$$eval('figure img', (imgs) => imgs.map((i) => ({
    nome: i.getAttribute('src').split('/').pop(),
    mm: (174 * i.naturalHeight) / i.naturalWidth,
    dpi: i.naturalWidth / (174 / 25.4),
  })))
  const altas = figurasMedidas.filter((f) => f.mm > 120)
    .map((f) => `${f.nome} (${Math.round(f.mm)}mm)`)
  const rasas = [...new Set(figurasMedidas.filter((f) => f.dpi < 200).map((f) => f.nome))]

  await pagina.pdf({
    path: SAIDA_PDF,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    outline: true,
    tagged: true,
    // As margens vêm do @page, em pdf/estilo.css: é o que permite às páginas
    // escuras ocuparem a folha inteira, sem moldura branca.
    preferCSSPageSize: true,
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
    headerTemplate: '<div></div>',
    footerTemplate: `
      <div style="font-size:7.5pt;color:#8A95A0;width:100%;padding:0 18mm;
                  font-family:-apple-system,Segoe UI,sans-serif;display:flex;
                  justify-content:space-between;">
        <span>${TITULO}</span>
        <span>Confidencial &middot; <span class="pageNumber"></span>/<span class="totalPages"></span></span>
      </div>`,
  })
  await navegador.close()

  const figuras = (html.match(/<figure>/g) ?? []).length
  if (altas.length) console.log(`Figuras acima de 120mm de altura: ${altas.join(', ')}`)
  if (reduzidas) console.log(`Figuras reduzidas a 300 dpi na impressão: ${reduzidas}`)
  if (rasas.length) {
    console.log(`Figuras abaixo de 200 dpi: ${rasas.length} de ${figurasMedidas.length}`
      + ' — recapture com WLC_ESCALA=2 e regere os recortes')
  }
  console.log(`Capítulos: ${PARTES.reduce((n, p) => n + p.capitulos.length, 0)}`)
  console.log(`Apêndices: ${APENDICES.length}`)
  console.log(`Figuras: ${figuras}`)
  console.log(`Fora do manual: ${Object.entries(EXCLUIDOS).map(([a, m]) => `${a} (${m})`).join(', ')}`)
  if (naoResolvidos.size) {
    console.log(`Links não resolvidos: ${[...naoResolvidos].join(', ')}`)
  }
  console.log(`\nHTML: ${path.relative(RAIZ, SAIDA_HTML)}`)
  console.log(`PDF:  ${path.relative(RAIZ, SAIDA_PDF)}`)
}

await main()
