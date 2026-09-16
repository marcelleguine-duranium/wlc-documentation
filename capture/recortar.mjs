/**
 * Gera os recortes declarados em capture/recortes.mjs.
 *
 *   node capture/recortar.mjs [--nome=slug,slug]
 *
 * A saída vai para assets/screenshots/recortes/. Rode sempre que as capturas
 * forem refeitas: um recorte com coordenadas antigas mostra a parte errada da
 * tela sem que nada acuse erro.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { RECORTES, X_PADRAO, LARGURA_BASE } from './recortes.mjs'

const AQUI = path.dirname(fileURLToPath(import.meta.url))
const RAIZ = path.resolve(AQUI, '..')
const ORIGEM = path.join(RAIZ, 'assets', 'screenshots')
const DESTINO = path.join(ORIGEM, 'recortes')

const filtro = process.argv.find((a) => a.startsWith('--nome='))?.split('=')[1]?.split(',')

/**
 * Densidade de impressão alvo. A coluna do PDF tem 174 mm, então 420 dpi são
 * 2880 px — exatamente a largura de uma captura em 2x. O teto é esse, e não os
 * 300 dpi que o papel exigiria, porque reduzir 2880 para 2055 é uma reamostragem
 * em fator quebrado, e é ela que borra o texto da interface. Vale mais gastar
 * arquivo do que reamostrar: o recorte chega ao PDF com os pixels originais.
 */
const DPI_ALVO = 420
const LARGURA_MAX = Math.round((174 / 25.4) * DPI_ALVO)

async function main() {
  await mkdir(DESTINO, { recursive: true })
  const navegador = await chromium.launch()
  const pagina = await navegador.newPage()
  const cache = new Map()
  const feitos = []

  for (const r of RECORTES) {
    if (filtro && !filtro.includes(r.nome)) continue

    if (!cache.has(r.origem)) {
      const bytes = await readFile(path.join(ORIGEM, r.origem))
      cache.set(r.origem, 'data:image/png;base64,' + bytes.toString('base64'))
    }

    const x = r.x ?? X_PADRAO
    const base = r.base ?? LARGURA_BASE
    const base64 = await pagina.evaluate(async ({ src, x, y, w, h, larguraBase, larguraMax }) => {
      const img = new Image()
      img.src = src
      await img.decode()
      // A captura pode ter sido feita em densidade maior (WLC_ESCALA): as
      // coordenadas do manifesto são sempre da escala 1x e sobem junto.
      const k = img.naturalWidth / larguraBase
      const [X, Y, H] = [x * k, y * k, h * k]
      const largura = w ? w * k : img.naturalWidth - X
      if (X + largura > img.naturalWidth || Y + H > img.naturalHeight) {
        return { erro: `recorte fora da imagem (${img.naturalWidth}x${img.naturalHeight}, escala ${k})` }
      }
      const escala = Math.min(1, larguraMax / largura)
      const c = document.createElement('canvas')
      c.width = Math.round(largura * escala)
      c.height = Math.round(H * escala)
      const ctx = c.getContext('2d')
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, X, Y, largura, H, 0, 0, c.width, c.height)
      return { dados: c.toDataURL('image/png').split(',')[1], largura: c.width, altura: c.height, k }
    }, { src: cache.get(r.origem), x, y: r.y, w: r.w, h: r.h,
         larguraBase: base, larguraMax: LARGURA_MAX })

    if (base64.erro) throw new Error(`${r.nome}: ${base64.erro}`)

    const destino = path.join(DESTINO, `${r.nome}.png`)
    await writeFile(destino, Buffer.from(base64.dados, 'base64'))
    // Altura e densidade que o recorte terá no PDF, onde a coluna tem 174 mm.
    const mm = Math.round((174 * base64.altura) / base64.largura)
    const dpi = Math.round(base64.largura / (174 / 25.4))
    feitos.push({ nome: r.nome, px: `${base64.largura}x${base64.altura}`, mm, dpi })
  }

  await navegador.close()

  const largos = feitos.filter((f) => f.mm > 100)
  const rasos = feitos.filter((f) => f.dpi < 200)
  for (const f of feitos) {
    console.log(`  ${f.nome.padEnd(34)} ${f.px.padEnd(12)} ${String(f.mm).padStart(3)}mm  ${f.dpi} dpi`)
  }
  console.log(`\n${feitos.length} recortes em assets/screenshots/recortes/`)
  if (largos.length) {
    console.log(`Acima de 100 mm de altura, revise: ${largos.map((f) => f.nome).join(', ')}`)
  }
  if (rasos.length) {
    console.log(`Abaixo de 200 dpi — recapture com WLC_ESCALA=2: ${rasos.length} de ${feitos.length}`)
  }
}

await main()
