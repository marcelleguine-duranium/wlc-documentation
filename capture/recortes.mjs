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

  // --- Insights IA do contexto (1440x3400) ---
  { origem: 'contexto-insights.png', nome: 'contexto-insights-resumo', y: 160, h: 540 },
  { origem: 'contexto-insights.png', nome: 'contexto-insights-riscos', y: 700, h: 489 },
  { origem: 'contexto-insights.png', nome: 'contexto-insights-acoes', y: 1875, h: 433 },

  // --- Digest do contexto (1440x1900) ---
  { origem: 'contexto-digest.png', nome: 'contexto-digest-semana', y: 120, h: 120 },
  { origem: 'contexto-digest.png', nome: 'contexto-digest-sintese', y: 238, h: 385 },
  { origem: 'contexto-digest.png', nome: 'contexto-digest-tipos', y: 623, h: 205 },
  { origem: 'contexto-digest.png', nome: 'contexto-digest-linha', y: 828, h: 624 },

  // --- Insights IA do repositório (1440x2300) ---
  { origem: 'repo-insights.png', nome: 'repo-insights-resumo', y: 160, h: 340 },
  { origem: 'repo-insights.png', nome: 'repo-insights-prioridades', y: 495, h: 175 },
  { origem: 'repo-insights.png', nome: 'repo-insights-dimensao', y: 684, h: 461 },

  // --- Dependências (1440x2300) ---
  { origem: 'contexto-dependencias.png', nome: 'dependencias-nota', y: 130, h: 250 },
  { origem: 'contexto-dependencias.png', nome: 'dependencias-composicao', y: 500, h: 430 },
  { origem: 'contexto-dependencias.png', nome: 'dependencias-frameworks', y: 930, h: 180 },
  { origem: 'contexto-dependencias.png', nome: 'dependencias-tabela', y: 1119, h: 548 },

  // --- Métricas do repositório (1440x1500) ---
  { origem: 'repo-metricas.png', nome: 'metricas-cabecalho', y: 160, h: 140 },
  { origem: 'repo-metricas.png', nome: 'metricas-fluxo-qualidade', y: 300, h: 565 },
  { origem: 'repo-metricas.png', nome: 'metricas-eficiencia-riscos', y: 865, h: 555 },

  // --- Job Description (1440x1800) ---
  { origem: 'vaga-gerada.png', nome: 'vaga-gerada-topo', y: 110, h: 410 },
  { origem: 'vaga-gerada.png', nome: 'vaga-gerada-stack', y: 1140, h: 120 },
]

/** Sem `x`/`w` declarados, o recorte começa depois da barra lateral. */
export const X_PADRAO = 250

/**
 * Largura da captura na escala em que estas coordenadas foram medidas. Capturas
 * feitas com densidade maior têm as coordenadas multiplicadas automaticamente,
 * então o catálogo não muda quando a captura é refeita em 2x.
 */
export const LARGURA_BASE = 1440
