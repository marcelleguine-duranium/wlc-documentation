/**
 * Experimento: a mesma tela em várias larguras de janela.
 *
 *   node capture/experimento-largura.mjs [--slug=a,b] [--larguras=1120,980,860]
 *
 * Existe para decidir o valor de `largura` de uma rota antes de gravar capturas
 * no repositório: o produto reflui em pontos que não dá para adivinhar, e uma
 * janela estreita demais troca a coluna de texto por um layout de tablet.
 *
 * Grava em /tmp, nunca em assets/, e não toca no manifesto.
 */

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { ROTAS } from './routes.mjs'

const AQUI = path.dirname(fileURLToPath(import.meta.url))
const SESSAO = path.join(AQUI, '.auth', 'state.json')
const BASE_URL = process.env.WLC_BASE_URL ?? 'https://app.weluvcode.ai'
const ESCALA = Number(process.env.WLC_ESCALA ?? 2)

const arg = (n, padrao) => process.argv.find((a) => a.startsWith(`--${n}=`))?.split('=')[1] ?? padrao
const slugs = arg('slug', 'contexto-insights').split(',')
const larguras = arg('larguras', '1120,980,860').split(',').map(Number)

const rotas = slugs.map((s) => {
  const r = ROTAS.find((x) => x.slug === s)
  if (!r) throw new Error(`Rota desconhecida: ${s}`)
  return r
})

const ids = JSON.parse(await readFile(path.join(AQUI, 'manifest.json'), 'utf8'))
  .capturas.map((c) => c.caminho).find((c) => c?.includes('/contexts/'))
const contexto = ids?.match(/contexts\/([A-Za-z0-9]+)/)?.[1] ?? process.env.WLC_CONTEXT_ID
const repo = ids?.match(/repo\/([A-Za-z0-9]+)/)?.[1] ?? process.env.WLC_REPO_ID
const navegador = await chromium.launch()
for (const rota of rotas) {
  const caminho = rota.path.replace('{contextId}', contexto ?? '').replace('{repoId}', repo ?? '')
  if (caminho.includes('{') || caminho.includes('//')) {
    throw new Error(`Não descobri os ids para "${caminho}". Informe WLC_CONTEXT_ID e WLC_REPO_ID.`)
  }
  for (const largura of larguras) {
    const ctx = await navegador.newContext({
      viewport: { width: largura, height: rota.altura ?? 900 },
      deviceScaleFactor: ESCALA, locale: 'pt-BR', storageState: SESSAO,
    })
    const pagina = await ctx.newPage()
    await pagina.goto(`${BASE_URL}${caminho}`, { waitUntil: 'domcontentloaded', timeout: 30_000 })
    await pagina.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => {})
    await pagina.waitForTimeout(2500)
    const destino = `/tmp/largura-${rota.slug}-${largura}.png`
    await pagina.screenshot({ path: destino })
    console.log(`${destino}  janela ${largura}px`)
    await ctx.close()
  }
}
await navegador.close()
