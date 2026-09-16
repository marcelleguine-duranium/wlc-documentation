/**
 * Recortes das capturas longas.
 *
 * O botão flutuante de conversa fica fixo no canto inferior direito e aparece no
 * pé de cada captura: recortes que alcançam a base da imagem param antes dele.
 *
 * Telas que rolam muito não cabem em uma figura legível: reduzidas à altura de
 * uma página, ficam estreitas demais para se ler. Em vez disso, a captura
 * inteira vira origem de vários recortes, cada um com a largura completa e
 * colocado junto do trecho do texto que o explica.
 *
 * `x` inicial 250 corta a barra lateral, que se repete em todas as telas e só
 * rouba largura útil; use 0 quando a própria barra lateral for o assunto.
 * Coordenadas em pixels da captura original.
 */

export const RECORTES = [
  // --- Visão Geral do workspace (1440x1250) ---
  { origem: 'visao-geral.png', nome: 'visao-geral-navegacao', x: 0, y: 0, w: 1440, h: 560 },
  { origem: 'visao-geral.png', nome: 'visao-geral-score', y: 105, h: 443 },
  { origem: 'visao-geral.png', nome: 'visao-geral-trajetoria', y: 548, h: 487 },
  { origem: 'visao-geral.png', nome: 'visao-geral-dimensoes', y: 1030, h: 150 },

  // --- Insights IA do contexto (660x6200; janela estreita, texto reflui) ---
  // Cada recorte mostra o cabeçalho da seção e o primeiro item dela: a lista
  // inteira, neste tamanho de letra, ocuparia páginas.
  { origem: 'contexto-insights.png', nome: 'contexto-insights-resumo', base: 660, x: 0, w: 660, y: 160, h: 450 },
  { origem: 'contexto-insights.png', nome: 'contexto-insights-riscos', base: 660, x: 0, w: 660, y: 935, h: 370 },
  { origem: 'contexto-insights.png', nome: 'contexto-insights-acoes', base: 660, x: 0, w: 660, y: 2590, h: 340 },

  // --- Digest do contexto (660x3800) ---
  { origem: 'contexto-digest.png', nome: 'contexto-digest-semana', base: 660, x: 0, w: 660, y: 205, h: 67 },
  { origem: 'contexto-digest.png', nome: 'contexto-digest-sintese', base: 660, x: 0, w: 660, y: 420, h: 380 },
  { origem: 'contexto-digest.png', nome: 'contexto-digest-tipos', base: 660, x: 0, w: 660, y: 790, h: 345 },
  { origem: 'contexto-digest.png', nome: 'contexto-digest-linha', base: 660, x: 0, w: 660, y: 1130, h: 440 },

  // --- Insights IA do repositório (660x4400) ---
  { origem: 'repo-insights.png', nome: 'repo-insights-resumo', base: 660, x: 0, w: 660, y: 266, h: 309 },
  { origem: 'repo-insights.png', nome: 'repo-insights-prioridades', base: 660, x: 0, w: 660, y: 585, h: 175 },
  { origem: 'repo-insights.png', nome: 'repo-insights-dimensao', base: 660, x: 0, w: 660, y: 765, h: 415 },

  // --- Dependências (1440x2300) ---
  { origem: 'contexto-dependencias.png', nome: 'dependencias-nota', y: 130, h: 250 },
  { origem: 'contexto-dependencias.png', nome: 'dependencias-composicao', y: 500, h: 430 },
  { origem: 'contexto-dependencias.png', nome: 'dependencias-frameworks', y: 930, h: 180 },
  { origem: 'contexto-dependencias.png', nome: 'dependencias-tabela', y: 1119, h: 548 },

  // --- Métricas do repositório (660x3600) ---
  // Na janela estreita os quatro painéis de dimensão empilham, um por bloco:
  // cada recorte pega o cabeçalho do painel e os primeiros indicadores.
  { origem: 'repo-metricas.png', nome: 'metricas-cabecalho', base: 660, x: 0, w: 660, y: 170, h: 145 },
  { origem: 'repo-metricas.png', nome: 'metricas-fluxo', base: 660, x: 0, w: 660, y: 320, h: 235 },
  { origem: 'repo-metricas.png', nome: 'metricas-qualidade', base: 660, x: 0, w: 660, y: 896, h: 235 },
  { origem: 'repo-metricas.png', nome: 'metricas-eficiencia', base: 660, x: 0, w: 660, y: 1463, h: 235 },
  { origem: 'repo-metricas.png', nome: 'metricas-riscos', base: 660, x: 0, w: 660, y: 1913, h: 235 },

  // --- Adicionar repositório (1440x900, capturada em 4x) ---
  // Só o diálogo, não a tela inteira; inteiro ele daria 187 mm de altura, então
  // vai em duas partes, cada uma junto do trecho que a explica.
  { origem: 'admin-adicionar-repositorio.png', nome: 'admin-cota-topo', x: 464, y: 175, w: 512, h: 212 },
  { origem: 'admin-adicionar-repositorio.png', nome: 'admin-cota-lista', x: 464, y: 387, w: 512, h: 265 },

  // --- Job Description (660x3600) ---
  { origem: 'vaga-gerada.png', nome: 'vaga-gerada-topo', base: 660, x: 0, w: 660, y: 180, h: 380 },
  { origem: 'vaga-gerada.png', nome: 'vaga-gerada-stack', base: 660, x: 0, w: 660, y: 1765, h: 90 },
]

/** Sem `x`/`w` declarados, o recorte começa depois da barra lateral. */
export const X_PADRAO = 250

/**
 * Largura da captura na escala em que estas coordenadas foram medidas. Capturas
 * feitas com densidade maior têm as coordenadas multiplicadas automaticamente,
 * então o catálogo não muda quando a captura é refeita em 2x.
 *
 * Telas capturadas com `largura` própria em capture/routes.mjs são a exceção:
 * seus recortes declaram `base` com aquele valor, senão as coordenadas são
 * escaladas pelo fator errado e o recorte mostra a parte errada da tela.
 */
export const LARGURA_BASE = 1440
