/**
 * Gera o site de ajuda do WLC a partir dos arquivos em docs/.
 *
 *   node site/build.mjs
 *
 * A saída é um único site/index.html autocontido: abre com duplo clique, sem
 * servidor. As imagens são referenciadas por caminho relativo a assets/, então
 * o arquivo precisa continuar dentro do repositório para os prints aparecerem.
 */

import { readFile, writeFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { marked } from 'marked'

const AQUI = path.dirname(fileURLToPath(import.meta.url))
const RAIZ = path.resolve(AQUI, '..')
const DOCS = path.join(RAIZ, 'docs')

const escapar = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;')

/** Slug de heading, no mesmo formato usado nos links do markdown. */
const slug = (texto) => texto
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/<[^>]+>/g, '')
  .replace(/[^a-z0-9\s-]/g, '')
  .trim()
  .replace(/\s+/g, '-')

/** Lê docs/, ignorando o índice, que vira a navegação do site. */
async function carregarSecoes() {
  const arquivos = (await readdir(DOCS))
    .filter((f) => f.endsWith('.md') && f !== 'README.md')
    .sort()

  return Promise.all(arquivos.map(async (arquivo) => {
    const bruto = await readFile(path.join(DOCS, arquivo), 'utf8')
    const titulo = bruto.match(/^#\s+(.+)$/m)?.[1].trim() ?? arquivo
    const id = arquivo.replace(/\.md$/, '')

    // Sem o H1: o título já aparece no cabeçalho da seção.
    const corpo = bruto.replace(/^#\s+.+$/m, '')

    let html = marked.parse(corpo)
      // Caminhos de imagem sobem um nível a menos: o site fica em site/.
      .replace(/src="\.\.\/assets\//g, 'src="../assets/')

    // Headings ganham id para as âncoras internas funcionarem.
    html = html.replace(/<(h[23])>(.*?)<\/\1>/g,
      (_, tag, texto) => `<${tag} id="${slug(texto)}">${texto}</${tag}>`)

    // Links entre documentos viram âncoras da navegação do site:
    //   m1-04-workspace.md        -> #m1-04-workspace
    //   m2-00-visao-admin.md#x    -> #x  (o alvo é o heading, não a seção)
    html = html
      .replace(/href="(m\d-\d{2}-[a-z0-9-]+)\.md#([^"]+)"/g, 'href="#$2"')
      .replace(/href="(m\d-\d{2}-[a-z0-9-]+)\.md"/g, 'href="#$1"')

    // Subtítulos viram os saltos internos da navegação.
    const subtitulos = [...corpo.matchAll(/^##\s+(.+)$/gm)]
      .map((m) => m[1].replace(/<a id="[^"]*"><\/a>/g, '').trim())

    const texto = corpo.replace(/[#*`>|\-]/g, ' ').replace(/\s+/g, ' ').trim()
    const modulo = Number(arquivo.match(/^m(\d)-/)?.[1] ?? 1)
    return { id, titulo, html, subtitulos, texto, modulo }
  }))
}

function montarPagina(secoes) {
  const MODULOS = [
    { n: 1, titulo: 'Módulo 1', subtitulo: 'Painel Principal' },
    { n: 2, titulo: 'Módulo 2', subtitulo: 'Painel Admin' },
    { n: 3, titulo: 'Módulo 3', subtitulo: 'Perguntas frequentes' },
  ]

  const navegacao = MODULOS.map((m) => {
    const doModulo = secoes.filter((s) => s.modulo === m.n)
    if (!doModulo.length) return ''
    const itens = doModulo.map((s, i) => `
            <li>
              <a class="secao-link${s.modulo === 1 && i === 0 ? ' ativo' : ''}" href="#${s.id}" data-alvo="${s.id}">
                <span class="numero">${String(i + 1).padStart(2, '0')}</span>
                <span>${escapar(s.titulo.replace(/^\d+\.\s*/, ''))}</span>
              </a>
            </li>`).join('')
    return `
      <section class="modulo aberto" data-modulo="${m.n}">
        <button class="modulo-cabecalho" aria-expanded="true" aria-controls="modulo-${m.n}">
          <span class="modulo-seta" aria-hidden="true">▸</span>
          <span class="modulo-nome">${m.titulo}<em>${m.subtitulo}</em></span>
          <span class="modulo-contagem">${doModulo.length}</span>
        </button>
        <ul id="modulo-${m.n}">${itens}
        </ul>
      </section>`
  }).join('')

  const artigos = secoes.map((s, i) => `
      <article class="secao${i === 0 ? ' visivel' : ''}" id="${s.id}" data-modulo="${s.modulo}">
        <h1>${escapar(s.titulo.replace(/^\d+\.\s*/, ''))}</h1>
        ${s.html}
      </article>`).join('')

  const indice = JSON.stringify(secoes.map((s) => ({
    id: s.id,
    modulo: s.modulo,
    titulo: s.titulo.replace(/^\d+\.\s*/, ''),
    subtitulos: s.subtitulos,
    texto: s.texto.slice(0, 12000),
  })))

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Central de Ajuda · WeLuvCode</title>
<style>
  :root {
    --fundo: #ffffff;
    --fundo-alt: #f6f8f9;
    --borda: #e2e8e9;
    --texto: #16202b;
    --texto-suave: #5b6b76;
    --destaque: #0f9b96;
    --destaque-fraco: #e6f5f4;
    --aviso-fundo: #fff8e6;
    --aviso-borda: #e8c96a;
    --largura-lateral: 300px;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --fundo: #10171d;
      --fundo-alt: #161f27;
      --borda: #263039;
      --texto: #e7edf1;
      --texto-suave: #93a3ae;
      --destaque: #46c8c0;
      --destaque-fraco: #12312f;
      --aviso-fundo: #2b2410;
      --aviso-borda: #6d5a22;
    }
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font: 16px/1.65 -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, system-ui, sans-serif;
    color: var(--texto);
    background: var(--fundo);
  }
  a { color: var(--destaque); }

  .topo {
    position: sticky; top: 0; z-index: 20;
    display: flex; align-items: center; gap: 20px;
    padding: 14px 24px;
    background: var(--fundo);
    border-bottom: 1px solid var(--borda);
  }
  .marca { font-weight: 700; font-size: 17px; white-space: nowrap; }
  .marca span { color: var(--destaque); }
  .busca-caixa { position: relative; flex: 1; max-width: 520px; }
  #busca {
    width: 100%; padding: 9px 14px;
    border: 1px solid var(--borda); border-radius: 9px;
    background: var(--fundo-alt); color: var(--texto); font-size: 15px;
  }
  #busca:focus { outline: 2px solid var(--destaque); outline-offset: -1px; }
  #resultados {
    position: absolute; top: calc(100% + 6px); left: 0; right: 0;
    background: var(--fundo); border: 1px solid var(--borda);
    border-radius: 10px; box-shadow: 0 12px 32px rgba(0,0,0,.14);
    max-height: 60vh; overflow-y: auto; display: none;
  }
  #resultados.aberto { display: block; }
  .resultado { display: block; padding: 11px 14px; border-bottom: 1px solid var(--borda); text-decoration: none; color: inherit; }
  .resultado:last-child { border-bottom: 0; }
  .resultado:hover, .resultado.focado { background: var(--destaque-fraco); }
  .resultado strong { display: block; font-size: 14px; }
  .resultado span { font-size: 13px; color: var(--texto-suave); }
  .vazio { padding: 16px; color: var(--texto-suave); font-size: 14px; }
  .menu-botao {
    display: none; padding: 8px 12px; border: 1px solid var(--borda);
    border-radius: 8px; background: var(--fundo-alt); color: var(--texto); cursor: pointer;
  }

  .corpo { display: flex; align-items: flex-start; }
  .lateral {
    position: sticky; top: 61px;
    width: var(--largura-lateral); flex: none;
    height: calc(100vh - 61px); overflow-y: auto;
    padding: 22px 14px; border-right: 1px solid var(--borda);
    background: var(--fundo-alt);
  }
  .lateral ul { list-style: none; margin: 0 0 4px; padding: 0; }
  .modulo { margin-bottom: 10px; }
  .modulo-cabecalho {
    display: flex; align-items: center; gap: 9px; width: 100%;
    padding: 9px 10px; margin-bottom: 4px;
    background: none; border: 0; border-radius: 8px;
    color: var(--texto); cursor: pointer; text-align: left; font: inherit;
  }
  .modulo-cabecalho:hover { background: var(--destaque-fraco); }
  .modulo-seta {
    font-size: 11px; color: var(--texto-suave);
    transition: transform .16s ease; transform: rotate(90deg);
  }
  .modulo:not(.aberto) .modulo-seta { transform: none; }
  .modulo-nome { flex: 1; font-size: 13.5px; font-weight: 600; line-height: 1.25; }
  .modulo-nome em {
    display: block; font-style: normal; font-weight: 400;
    font-size: 11px; letter-spacing: .07em; text-transform: uppercase;
    color: var(--texto-suave); margin-top: 1px;
  }
  .modulo-contagem {
    font-size: 11px; color: var(--texto-suave);
    background: var(--fundo); border: 1px solid var(--borda);
    border-radius: 20px; padding: 1px 7px; font-variant-numeric: tabular-nums;
  }
  .modulo:not(.aberto) ul { display: none; }
  .modulo ul { padding-left: 6px; }
  .secao-link {
    display: flex; gap: 10px; align-items: baseline;
    padding: 8px 10px; border-radius: 8px;
    text-decoration: none; color: var(--texto); font-size: 14.5px;
  }
  .secao-link:hover { background: var(--destaque-fraco); }
  .secao-link.ativo { background: var(--destaque-fraco); color: var(--destaque); font-weight: 600; }
  .numero { font-variant-numeric: tabular-nums; font-size: 12px; color: var(--texto-suave); }
  .secao-link.ativo .numero { color: var(--destaque); }

  main { flex: 1; min-width: 0; padding: 34px 40px 90px; max-width: 900px; }
  .secao { display: none; }
  .secao.visivel { display: block; animation: entrar .18s ease-out; }
  @keyframes entrar { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }

  main h1 { font-size: 30px; line-height: 1.25; margin: 0 0 26px; }
  main h2 { font-size: 21px; margin: 40px 0 12px; padding-top: 14px; border-top: 1px solid var(--borda); }
  main h3 { font-size: 17px; margin: 26px 0 8px; }
  main img {
    max-width: 100%; height: auto; display: block;
    margin: 18px 0; border: 1px solid var(--borda); border-radius: 10px;
  }
  main table { width: 100%; border-collapse: collapse; margin: 18px 0; font-size: 14.5px; display: block; overflow-x: auto; }
  main th, main td { border: 1px solid var(--borda); padding: 9px 12px; text-align: left; vertical-align: top; }
  main th { background: var(--fundo-alt); font-weight: 600; }
  main code {
    background: var(--fundo-alt); border: 1px solid var(--borda);
    padding: 1px 5px; border-radius: 5px; font-size: 13.5px;
  }
  main pre { background: var(--fundo-alt); border: 1px solid var(--borda); border-radius: 9px; padding: 14px; overflow-x: auto; }
  main pre code { border: 0; background: none; padding: 0; }
  main blockquote {
    margin: 18px 0; padding: 12px 16px;
    background: var(--aviso-fundo); border-left: 3px solid var(--aviso-borda); border-radius: 0 8px 8px 0;
  }
  main blockquote p { margin: 0; }

  .rodape-nav { display: flex; justify-content: space-between; gap: 14px; margin-top: 54px; padding-top: 22px; border-top: 1px solid var(--borda); }
  .rodape-nav a { text-decoration: none; font-size: 14.5px; padding: 10px 14px; border: 1px solid var(--borda); border-radius: 9px; }
  .rodape-nav a:hover { background: var(--destaque-fraco); }

  @media (max-width: 900px) {
    .menu-botao { display: block; }
    .lateral {
      position: fixed; top: 61px; left: 0; z-index: 15;
      height: calc(100vh - 61px); transform: translateX(-100%);
      transition: transform .2s ease;
    }
    .lateral.aberta { transform: none; }
    main { padding: 24px 18px 70px; }
    .marca { font-size: 15px; }
  }
</style>
</head>
<body>
  <header class="topo">
    <button class="menu-botao" id="menu" aria-label="Abrir menu">☰</button>
    <div class="marca">Central de Ajuda · <span>weLuvCode</span></div>
    <div class="busca-caixa">
      <input id="busca" type="search" placeholder="Buscar na documentação…" autocomplete="off" aria-label="Buscar">
      <div id="resultados" role="listbox"></div>
    </div>
  </header>

  <div class="corpo">
    <nav class="lateral" id="lateral">${navegacao}
    </nav>
    <main id="conteudo">${artigos}
      <div class="rodape-nav">
        <a href="#" id="anterior">← Anterior</a>
        <a href="#" id="proximo">Próxima →</a>
      </div>
    </main>
  </div>

<script>
const INDICE = ${indice};
const ordem = INDICE.map(s => s.id);
const artigos = [...document.querySelectorAll('.secao')];
const links = [...document.querySelectorAll('.secao-link')];
const busca = document.getElementById('busca');
const resultados = document.getElementById('resultados');
const lateral = document.getElementById('lateral');

function mostrar(id, comAncora) {
  let alvo = ordem.includes(id) ? id : null;
  let elemento = null;
  // Hash de heading (âncora interna): descobre a seção que o contém.
  if (!alvo && id) {
    const el = document.getElementById(id);
    const secao = el && el.closest('.secao');
    if (secao) { alvo = secao.id; elemento = el; }
  }
  if (!alvo) alvo = ordem[0];
  artigos.forEach(a => a.classList.toggle('visivel', a.id === alvo));
  links.forEach(l => l.classList.toggle('ativo', l.dataset.alvo === alvo));
  abrirModuloDe(alvo);
  lateral.classList.remove('aberta');
  atualizarRodape(alvo);
  if (elemento) {
    elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  if (comAncora) {
    const el = [...document.querySelectorAll('#' + CSS.escape(alvo) + ' h2')]
      .find(h => h.textContent.trim() === comAncora);
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
  }
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function atualizarRodape(id) {
  const i = ordem.indexOf(id);
  const ant = document.getElementById('anterior');
  const prox = document.getElementById('proximo');
  ant.style.visibility = i > 0 ? 'visible' : 'hidden';
  prox.style.visibility = i < ordem.length - 1 ? 'visible' : 'hidden';
  if (i > 0) { ant.href = '#' + ordem[i-1]; ant.textContent = '← ' + INDICE[i-1].titulo; }
  if (i < ordem.length - 1) { prox.href = '#' + ordem[i+1]; prox.textContent = INDICE[i+1].titulo + ' →'; }
}

/** Expandir e retrair cada módulo. O estado fica salvo entre visitas. */
const modulos = [...document.querySelectorAll('.modulo')];
for (const m of modulos) {
  const botao = m.querySelector('.modulo-cabecalho');
  botao.addEventListener('click', () => {
    const aberto = m.classList.toggle('aberto');
    botao.setAttribute('aria-expanded', String(aberto));
    try { localStorage.setItem('wlc-modulo-' + m.dataset.modulo, aberto ? '1' : '0'); } catch {}
  });
  try {
    if (localStorage.getItem('wlc-modulo-' + m.dataset.modulo) === '0') {
      m.classList.remove('aberto');
      botao.setAttribute('aria-expanded', 'false');
    }
  } catch {}
}

/** Um módulo retraído não pode esconder a seção que está sendo exibida. */
function abrirModuloDe(id) {
  const secao = document.getElementById(id);
  const modulo = secao && modulos.find(m => m.dataset.modulo === secao.dataset.modulo);
  if (modulo && !modulo.classList.contains('aberto')) {
    modulo.classList.add('aberto');
    modulo.querySelector('.modulo-cabecalho').setAttribute('aria-expanded', 'true');
  }
}

addEventListener('hashchange', () => mostrar(location.hash.slice(1)));
document.getElementById('menu').onclick = () => lateral.classList.toggle('aberta');

/** Busca: casa no título, nos subtítulos e no corpo, nessa ordem de prioridade. */
function procurar(termo) {
  const t = termo.trim().toLowerCase();
  if (t.length < 2) return [];
  const achados = [];
  for (const s of INDICE) {
    if (s.titulo.toLowerCase().includes(t)) {
      achados.push({ id: s.id, titulo: s.titulo, contexto: 'Seção', peso: 0 });
    }
    for (const sub of s.subtitulos) {
      if (sub.toLowerCase().includes(t)) {
        achados.push({ id: s.id, titulo: sub, contexto: s.titulo, ancora: sub, peso: 1 });
      }
    }
    const pos = s.texto.toLowerCase().indexOf(t);
    if (pos > -1 && !achados.some(a => a.id === s.id && a.peso < 2)) {
      const trecho = s.texto.slice(Math.max(0, pos - 55), pos + 85).trim();
      achados.push({ id: s.id, titulo: s.titulo, contexto: '…' + trecho + '…', peso: 2 });
    }
  }
  return achados.sort((a, b) => a.peso - b.peso).slice(0, 8);
}

function pintar(lista) {
  if (!busca.value.trim()) { resultados.classList.remove('aberto'); return; }
  if (!lista.length) {
    resultados.innerHTML = '<div class="vazio">Nada encontrado para este termo.</div>';
  } else {
    resultados.innerHTML = lista.map(r =>
      '<a class="resultado" href="#' + r.id + '" data-ancora="' + (r.ancora || '') + '">' +
      '<strong>' + r.titulo + '</strong><span>' + r.contexto + '</span></a>').join('');
  }
  resultados.classList.add('aberto');
}

busca.addEventListener('input', () => pintar(procurar(busca.value)));
busca.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { busca.value = ''; resultados.classList.remove('aberto'); busca.blur(); }
  if (e.key === 'Enter') { const p = resultados.querySelector('.resultado'); if (p) p.click(); }
});
resultados.addEventListener('click', (e) => {
  const alvo = e.target.closest('.resultado');
  if (!alvo) return;
  e.preventDefault();
  resultados.classList.remove('aberto');
  busca.value = '';
  const id = alvo.getAttribute('href').slice(1);
  if (location.hash.slice(1) === id) mostrar(id, alvo.dataset.ancora);
  else { location.hash = id; setTimeout(() => mostrar(id, alvo.dataset.ancora), 0); }
});
document.addEventListener('click', (e) => {
  if (!e.target.closest('.busca-caixa')) resultados.classList.remove('aberto');
});
addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); busca.focus(); busca.select(); }
});

mostrar(location.hash.slice(1));
</script>
</body>
</html>`
}

const secoes = await carregarSecoes()
await writeFile(path.join(AQUI, 'index.html'), montarPagina(secoes))
console.log(`site/index.html gerado com ${secoes.length} seções`)
