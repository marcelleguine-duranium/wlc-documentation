/**
 * Procura capturas que saíram vazias.
 *
 *   node capture/verificar.mjs [arquivo...]     (padrão: todas)
 *
 * A medição está em capture/analisar.mjs, e roda também ao final de cada
 * captura. Este comando serve para revisar o conjunto inteiro a qualquer
 * momento — depois de restaurar arquivos, por exemplo.
 */

import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { medirVazio } from './analisar.mjs'

const AQUI = path.dirname(fileURLToPath(import.meta.url))
const ORIGEM = path.resolve(AQUI, '..', 'assets', 'screenshots')

const alvos = process.argv.slice(2).length
  ? process.argv.slice(2)
  : (await readdir(ORIGEM)).filter((f) => f.endsWith('.png')).sort().map((f) => path.join(ORIGEM, f))

const navegador = await chromium.launch()
const pagina = await navegador.newPage()
const suspeitas = []

for (const arq of alvos) {
  const r = await medirVazio(pagina, arq)
  if (r.suspeita) suspeitas.push(path.basename(arq))
  console.log(`${path.basename(arq).padEnd(28)} altura ${String(r.altura).padStart(5)}`
    + `  cor sólida ${String(r.pct).padStart(3)}%  maior faixa ${String(r.maiorFaixa).padStart(5)}`
    + (r.suspeita ? '  <-- provável captura vazia' : ''))
}
await navegador.close()

if (suspeitas.length) {
  console.log(`\n${suspeitas.length} captura(s) suspeita(s): ${suspeitas.join(', ')}`)
  console.log('Confira o estado da tela no produto antes de aceitar estes prints.')
  process.exitCode = 1
} else {
  console.log(`\n${alvos.length} capturas verificadas, nenhuma suspeita.`)
}
