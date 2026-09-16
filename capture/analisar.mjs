/**
 * Mede quanto de uma captura é cor sólida.
 *
 * Serve para achar telas gravadas no estado errado — repositório inexistente,
 * contexto sem insights, página que não terminou de renderizar. Para o script
 * de captura essas telas são um sucesso: a rota respondeu, o print saiu. Só
 * olhando os pixels dá para dizer que não há nada ali.
 */

import { readFile } from 'node:fs/promises'

/**
 * Fração da altura que uma única faixa de cor sólida pode ocupar sem suspeita.
 * Calibrado contra os dois conjuntos conhecidos: telas legítimas de lista curta
 * chegam a 67% e as capturas comprovadamente vazias começam em 71%. Entre 60% e
 * 70% há zona cinzenta — o aviso erra para o lado de não incomodar.
 */
export const LIMITE = 0.7

/**
 * @param {import('playwright').Page} pagina  página qualquer, usada só como canvas
 * @param {string} arquivo  caminho do PNG
 * @returns {Promise<{altura: number, pct: number, maiorFaixa: number, suspeita: boolean}>}
 */
export async function medirVazio(pagina, arquivo) {
  const src = 'data:image/png;base64,' + (await readFile(arquivo)).toString('base64')
  const r = await pagina.evaluate(async (src) => {
    const img = new Image()
    img.src = src
    await img.decode()
    const c = document.createElement('canvas')
    c.width = img.naturalWidth
    c.height = img.naturalHeight
    const ctx = c.getContext('2d', { willReadFrequently: true })
    ctx.drawImage(img, 0, 0)
    // A barra lateral é igual em todas as telas e não diz nada sobre o conteúdo.
    // O corte tem de cair depois da borda dela — em cima da borda, toda linha
    // deixa de ser uniforme e a medição zera.
    const x0 = Math.round(c.width * 0.2)
    const w = c.width - x0
    const d = ctx.getImageData(x0, 0, w, c.height).data
    let uniformes = 0
    let maiorFaixa = 0
    let seq = 0
    for (let y = 0; y < c.height; y++) {
      let uniforme = true
      const base = y * w * 4
      const [r0, g0, b0] = [d[base], d[base + 1], d[base + 2]]
      for (let x = 1; x < w; x += 3) {
        const i = base + x * 4
        if (Math.abs(d[i] - r0) > 6 || Math.abs(d[i + 1] - g0) > 6 || Math.abs(d[i + 2] - b0) > 6) {
          uniforme = false
          break
        }
      }
      if (uniforme) {
        uniformes += 1
        seq += 1
        maiorFaixa = Math.max(maiorFaixa, seq)
      } else seq = 0
    }
    return { altura: c.height, pct: Math.round((100 * uniformes) / c.height), maiorFaixa }
  }, src)
  return { ...r, suspeita: r.maiorFaixa > r.altura * LIMITE }
}
