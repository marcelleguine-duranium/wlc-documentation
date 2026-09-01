# 3. Métricas

Como o Score é construído: de onde vem cada número do painel. O objetivo é que você
consiga ler qualquer valor e saber também **o que ele não afirma**.

## O que o Score responde — e o que não responde

O Score de Engenharia é um resumo da saúde do **processo** de engenharia de um
repositório em um período, numa escala de 0 a 10.

Ele responde a uma pergunta operacional: *este repositório entrega com
previsibilidade, revisão e conhecimento distribuído?*

Ele **não** responde se o produto é bom, se o time é bom ou se o prazo será
cumprido. É um resumo de processo, não uma nota de pessoas nem de produto.

## A cascata

```
contexto → repositório → 1 Score → 4 dimensões → 17 indicadores
```

O Score existe por repositório. O contexto agrega o Score dos seus repositórios;
nenhum indicador é recalculado no agrupamento.

## As quatro dimensões e seus pesos

| Dimensão | Peso | O que observa | Indicadores |
| --- | --- | --- | --- |
| **Fluxo de Entrega** | 30% | ritmo e previsibilidade da entrega: lead time, taxa de entrega, trabalho em andamento, tempo até a primeira revisão | 5 |
| **Qualidade da Engenharia** | 30% | disciplina técnica: testes, tamanho das entregas, Profundidade de Revisão, retrabalho | 7 |
| **Eficiência do Time** | 20% | distribuição do trabalho: quanto do código e das revisões se concentra em uma pessoa | 2 |
| **Riscos Organizacionais** | 20% | dependência de pessoas e trabalho travado: Bus Factor, Concentração de Conhecimento, Entregas de Longa Duração | 3 |

Entrega e qualidade valem 60% somadas; distribuição do time e risco
organizacional completam os 40% restantes.

![Cards das dimensões na Visão Geral](../assets/screenshots/visao-geral.png)

## Como o cálculo funciona

Antes dos detalhes, o caminho completo de um número. Seguindo o **tempo de
ciclo** do repositório `django`, do valor medido até o Score:

```
2h21m                    valor medido no período
  ↓  comparado com os limiares do Lead Time de Entrega (até 24h / 24h–168h / acima de 168h)
SAUDÁVEL                 a faixa em que o valor caiu
  ↓  cada faixa vale um número fixo de pontos
1 ponto                  saudável = 1 · atenção = 0,5 · crítico = 0
  ↓  multiplicado pelo peso do indicador dentro da dimensão (Lead Time de Entrega pesa 3)
3                        contribuição deste indicador
  ↓  somado aos outros 4 indicadores de Fluxo e dividido pela soma dos pesos
6,4                      nota da dimensão Fluxo de Entrega
  ↓  multiplicado pelo peso da dimensão no Score (Fluxo vale 30%)
6,5                      Score de Engenharia do repositório
```

Cada seta é um dos passos abaixo.

### Passo 1 — o valor medido vira uma faixa

Cada indicador tem **limiares próprios**, que definem três faixas. O valor
medido é comparado com esses limiares e cai em exatamente uma delas. É só isso
que define se um indicador está saudável: **o valor medido estar dentro do
limiar daquele indicador.**

| Faixa | Quando o indicador recebe | Significado |
| --- | --- | --- |
| **Saudável** | o valor está dentro do limiar esperado | fluxo sustentável nesse aspecto |
| **Atenção** | o valor passou do limiar saudável, mas não do crítico | fora do ideal, sem impedir a entrega |
| **Crítico** | o valor passou do segundo limiar | sinal que costuma explicar atrasos e incidentes |

Os limiares mudam de indicador para indicador, e a direção também. Alguns são
"menor é melhor", outros "maior é melhor", e um é faixa fechada, onde exceder
também é sinal:

| Indicador | Saudável | Atenção | Crítico |
| --- | --- | --- | --- |
| Lead Time de Entrega (menor é melhor) | até 24h | 24h – 168h | acima de 168h |
| Disciplina de Testes (maior é melhor) | 60% ou mais | 30% – 60% | abaixo de 30% |
| Profundidade de Revisão (faixa fechada) | 2 a 10 comentários | 1 a 2 | menos de 1 |

Por isso um valor sozinho não diz nada: 2 comentários por entrega é saudável em
Profundidade de Revisão, enquanto 2 pessoas em Bus Factor é atenção. Os limiares
de todos os indicadores estão em [Os indicadores, um a um](#os-indicadores-um-a-um).

### Passo 2 — a faixa vira pontos

A faixa vale um número fixo de pontos, e é **para isso que os pontos servem**:
eles são a moeda comum que permite somar indicadores de naturezas diferentes —
horas, percentuais, contagens de pessoas — dentro de uma mesma dimensão.

| Faixa | Pontos |
| --- | --- |
| Saudável | **1** |
| Atenção | **0,5** |
| Crítico | **0** |

**Só existem esses três valores.** Um indicador nunca vale 0,8 nem 0,3, e não há
gradação dentro da faixa: estar por pouco ou por muito dentro dela dá o mesmo
resultado: um lead time de 2h e outro de 23h valem 1 ponto igualmente.

### Passo 3 — os pontos viram a nota da dimensão

Aqui aparece a escala contínua. Cada ponto é multiplicado pelo peso do seu
indicador, e a média ponderada vira uma nota de 0 a 10:

> nota da dimensão = (soma de pontos × peso ÷ soma dos pesos) × 10

Nem todo indicador pesa igual dentro da sua dimensão: Lead Time de Entrega e Taxa
de Entrega pesam 3, enquanto Arquivos Mais Alterados pesa 1.

**Indicador sem dado sai da conta.** A ausência nunca é tratada como zero — o
indicador é retirado do numerador e do denominador.

#### Exemplo real

Fluxo de Entrega do repositório `django`, com os valores da aba Métricas:

| Indicador | Valor medido | Faixa | Pontos | Peso | Pontos × peso |
| --- | --- | --- | --- | --- | --- |
| Lead Time de Entrega | 2h21m | saudável | 1 | 3 | 3 |
| Taxa de Entrega | 15,30 PRs/semana | saudável | 1 | 3 | 3 |
| Tempo até 1ª Revisão | 19h28m | atenção | 0,5 | 2 | 1 |
| Trabalho em Andamento (WIP) | 7,10 PR/pessoa | crítico | 0 | 2 | 0 |
| Novo vs. Manutenção | 1,49% | crítico | 0 | 1 | 0 |

Soma da última coluna: **7**. Soma dos pesos: **11**.

> 7 ÷ 11 = 0,636 → × 10 = **6,4**

É exatamente a nota exibida no painel. Repare que a nota é contínua — 6,4 —
embora nenhum indicador tenha valido 0,64.

### Passo 4 — as notas viram o Score

O Score é a média das notas das dimensões, ponderada pelos pesos de cada uma:

> Score = soma (nota da dimensão × peso) ÷ soma dos pesos

Seguindo o mesmo repositório, com as quatro notas do painel:

| Dimensão | Nota | Peso | Nota × peso |
| --- | --- | --- | --- |
| Fluxo de Entrega | 6,4 | 0,30 | 1,92 |
| Qualidade da Engenharia | 7,1 | 0,30 | 2,13 |
| Eficiência do Time | 10,0 | 0,20 | 2,00 |
| Riscos Organizacionais | 2,1 | 0,20 | 0,42 |

> soma 6,47 ÷ 1,00 = **6,5**

É o Score que aparece na home do repositório.

**Quando uma dimensão fica sem nota, os pesos são renormalizados.** A divisão é
pela soma dos pesos das dimensões que têm nota, não por 100%. Se Eficiência do
Time (20%) ficar sem dado, as outras três — que somam 80% — são divididas por
0,80 e passam a representar o Score inteiro. Uma dimensão ausente não puxa o
Score para baixo; ela simplesmente sai da conta.

### Passo 5 — blockers

Alguns indicadores são graves o suficiente para reprovar a dimensão inteira,
mesmo com média ponderada boa. É o que evita que um problema estrutural seja
diluído por indicadores confortáveis.

| Dimensão | Regra |
| --- | --- |
| **Fluxo de Entrega** | Lead Time de Entrega **ou** Taxa de Entrega em crítico torna a dimensão crítica |
| **Riscos Organizacionais** | Bus Factor em crítico torna a dimensão crítica |
| **Eficiência do Time** | só bloqueia quando **os dois** indicadores estão críticos ao mesmo tempo |

É a resposta para a pergunta que aparece em reunião: *por que a dimensão está
crítica se a média não está?* Porque um blocker foi acionado.

### Passo 6 — suficiência de dados

Quando falta base, a plataforma deixa o campo vazio em vez de publicar um número
frágil:

- **3 de 4 dimensões** precisam ter nota para o repositório receber Score no período
- **pelo menos metade** dos indicadores de uma dimensão precisa ter dado para ela ser calculada
- **Eficiência do Time exige os 2** indicadores, por ter apenas dois

O painel também explica a ausência: coleta em andamento, primeira coleta
pendente, ou atividade Git insuficiente no período. Campo vazio é honestidade,
não defeito.

### Faixas de status da nota

Atenção para não confundir: os rótulos *Saudável*, *Atenção* e *Crítico*
aparecem em **dois lugares diferentes**, com regras diferentes.

- **No indicador** — definido pelos limiares próprios daquele indicador (24h,
  60%, 3 pessoas…), e o resultado são pontos discretos: 1, 0,5 ou 0.
- **Na nota** — definido por dois cortes fixos, 4,0 e 7,0, aplicados à nota
  contínua de 0 a 10. Vale tanto para a nota de cada dimensão quanto para o
  Score final.

São os cortes da nota:

| Faixa | Intervalo | Leitura |
| --- | --- | --- |
| **Crítico** | 0 – 4,0 | entra na fila de prioridades e no ranking de risco |
| **Atenção** | 4,0 – 7,0 | funciona, com um ou dois indicadores puxando para baixo |
| **Saudável** | 7,0 – 10 | fluxo sustentável; a discussão passa a ser de evolução |

## Onde ler os indicadores no produto

Toda a mecânica descrita acima fica visível na aba **Métricas** da home do
repositório, alcançada pelo botão **Ver métricas detalhadas**.

![Métricas detalhadas do repositório](../assets/screenshots/repo-metricas.png)

O cabeçalho informa a janela considerada — últimos 90 dias, com o intervalo de
datas explícito — e a faixa **Pipeline** resume o volume do período: pull
requests criadas, em aberto, integradas e descartadas.

Cada dimensão vem em um cartão com a nota, uma pergunta-guia que resume o que ela
observa, e os seus indicadores. Cada indicador mostra:

- o **valor medido**, com a base entre parênteses (por exemplo, "133 commits")
- as **três faixas** do indicador, com a faixa em que ele caiu destacada

É assim que se vê, sem cálculo mental, por que um indicador está em atenção ou em
crítico. Indicadores sem dado aparecem com `--` e, como explicado acima, saem da
conta em vez de contar como zero.

Alguns blocos trazem detalhamento adicional: a composição entre nova capacidade,
correção e outros; a distribuição de contribuições por autor; e a lista dos
Arquivos Mais Alterados no período.

> A distribuição de contribuições aparece com os autores identificados como #1,
> #2, #3… Isso é a permissão **Anonimizar autores nas contribuições**, descrita
> em [Administração](m2-00-visao-admin.md), agindo. Desligá-la troca os
> identificadores pelos nomes.

## Os indicadores, um a um

O número após o nome é o peso do indicador dentro da sua dimensão.

### Fluxo de Entrega — 30%

| Indicador | O que mede | Sinal saudável | Peso |
| --- | --- | --- | --- |
| Lead Time de Entrega | mediana do tempo entre abrir uma entrega e integrá-la | menos de 24h | 3 |
| Taxa de Entrega | entregas integradas por semana | 1 ou mais por semana | 3 |
| Trabalho em Andamento (WIP) | entregas abertas por pessoa ativa no período | menos de 2 | 2 |
| Tempo até 1ª Revisão | quanto uma entrega espera pelo primeiro olhar | menos de 4h | 2 |
| Novo vs. Manutenção | fatia das entregas que cria capacidade nova | 60% ou mais | 1 |

Os dois primeiros são blockers.

### Qualidade da Engenharia — 30%

| Indicador | O que mede | Sinal saudável | Peso |
| --- | --- | --- | --- |
| Disciplina de Testes | fatia das entregas acompanhadas de teste | 60% ou mais | 3 |
| Tamanho das Entregas | fatia de entregas pequenas e médias, revisáveis | 70% ou mais | 2 |
| Profundidade de Revisão | comentários de revisão por entrega | entre 2 e 10 | 2 |
| Taxa de Correções | fatia das entregas que corrigem algo já entregue | menos de 15% | 2 |
| PRs Sem Revisão | fatia integrada sem nenhuma revisão registrada | zero | 2 |
| Taxa de Retrabalho | código reescrito pouco depois de escrito | menos de 5% | 1 |
| Arquivos Mais Alterados | concentração das mudanças nos cinco arquivos mais tocados | menos de 30% | 1 |

Nenhum blocker nesta dimensão.

### Eficiência do Time — 20%

| Indicador | O que mede | Saudável | Crítico | Peso |
| --- | --- | --- | --- | --- |
| Distribuição de Contribuições | quanto das entregas vem do maior contribuidor | abaixo de 40% | a partir de 60% | 3 |
| Distribuição de Revisões | quanto das revisões vem do maior revisor | abaixo de 40% | a partir de 60% | 3 |

Os dois indicadores são sempre agregados: **nenhum nome de pessoa aparece**.

Um terceiro indicador, *Mudança de Contexto*, existe na configuração mas fica fora
do cálculo enquanto não houver fonte de dados para ele.

### Riscos Organizacionais — 20%

| Indicador | O que mede | Saudável | Crítico | Peso |
| --- | --- | --- | --- | --- |
| Bus Factor | quantas pessoas sustentam de fato o repositório | 3 ou mais | menos de 2 | 3 |
| Concentração de Conhecimento | quanto do código só uma pessoa conhece | abaixo de 30% | a partir de 50% | 2 |
| Entregas de Longa Duração | quantas entregas ficam abertas muito além do normal | nenhuma | 4 ou mais | 2 |

Bus Factor é blocker. Entregas de Longa Duração costumam ser o sinal mais barato de agir.

## Salvaguardas contra leitura errada

**Mais revisão não é sempre melhor.** Profundidade de Revisão é uma faixa, não
uma escada: acima de 10 comentários por entrega o indicador para em atenção,
porque normalmente indica entrega grande demais ou desalinhamento, não rigor.

**Zero entregas não vira zero por cento.** Indicadores calculados sobre entregas
são pulados quando o repositório não teve entrega no período. Um repositório
parado não é premiado nem punido por indicadores sem base.

**Indicador sem fonte fica de fora.** Mudança de Contexto está desenhada mas não é
coletada, então é excluída do cálculo em vez de entrar com valor estimado.

## Exemplo: por que três dimensões boas não salvam o Score

Números fictícios, para ilustrar a mecânica:

| Dimensão | Peso | Nota |
| --- | --- | --- |
| Fluxo de Entrega | 30% | 7,7 |
| Qualidade da Engenharia | 30% | 7,3 |
| Eficiência do Time | 20% | 2,5 |
| Riscos Organizacionais | 20% | 8,6 |

**Score: 6,7 — Atenção.**

A Eficiência caiu para 2,5 porque a revisão estava concentrada em uma pessoa
acima de 60%. Três dimensões saudáveis não compensam uma dimensão crítica, e é
exatamente essa assimetria que o Score deve tornar visível.

## O estágio muda a conclusão, não o cálculo

O [ciclo de vida do repositório](m1-04-workspace.md) não altera o Score. Ele altera
a conclusão que se tira do mesmo número:

- **5,2 em um legado estável** — esperado. O repositório não recebe investimento;
  o que interessa ali é Bus Factor e documentação, não Taxa de Entrega.
- **5,2 em um produto em evolução** — sinal de fricção onde há investimento
  ativo. É este caso que entra na fila de prioridades da semana.

Por isso: filtre por estágio antes de comparar repositórios.

## DORA e SPACE

A plataforma se apoia nos dois frameworks de mercado, com fronteira explícita
entre o que é medido e o que é aproximação.

### As quatro métricas DORA

| Métrica | Situação | Como é obtida |
| --- | --- | --- |
| Lead time de mudança | **Medida** | mediana do Lead Time de Entrega dos repositórios do escopo — mediana, e não média, para que um repositório atípico não distorça a leitura |
| Frequência de entrega | **Medida** | média da Taxa de Entrega semanal do escopo, a partir das integrações |
| Taxa de falha de mudança | **Proxy declarada** | usa retrabalho como aproximação. **Não é falha em produção**: é a fatia de entregas que precisou de correção depois. O relatório sempre carrega esse aviso |
| Tempo de restauração | **Não apresentada** | não há fonte de incidentes conectada; em vez de estimar, a plataforma omite |

Quem precisa de MTTR real precisa conectar uma fonte de incidentes.

### Os cinco eixos SPACE

| Eixo | Como é aproximado |
| --- | --- |
| Atividade | média de contribuidores ativos: quantas pessoas efetivamente entregaram no período |
| Comunicação | fatia de entregas integradas sem revisão — quanto menor, mais o time conversa sobre o código |
| Desempenho | Taxa de Entrega normalizada pelo Lead Time de Entrega: entregar rápido e com frequência ao mesmo tempo |
| Eficiência | tempo médio até a primeira revisão, como medida de espera no fluxo |
| Satisfação | **sem fonte.** Exige pesquisa com o time e não é inferida a partir de dados de repositório |

## O que a plataforma não mede

Três fronteiras que são de construção, não de configuração:

**Nenhum score por desenvolvedor.** Não existe nota individual no modelo de
dados. As métricas de distribuição aparecem como percentual do maior
contribuidor, sem nome associado.

**Nenhum dado de produção.** Incidentes, disponibilidade e desempenho em produção
ficam fora do escopo. O recorte vai do requisito ao merge.

**Nenhum valor fabricado.** Quando falta dado, a seção é omitida. É preferível um
relatório mais curto a um relatório com número inventado.

## Como usar o painel na rotina

1. **Filtre por estágio de ciclo de vida** antes de comparar repositórios
2. **Abra a dimensão** que puxou o Score para baixo, não o Score em si
3. **Cheque se há blocker** antes de discutir a média ponderada
4. **Acompanhe a variação entre períodos**, que diz mais do que o valor absoluto
