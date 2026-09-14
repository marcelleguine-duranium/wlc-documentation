# Score e métricas

## O que o Score de Engenharia mede, afinal?

É um resumo da saúde do **processo** de engenharia de um repositório em um
período, de 0 a 10. Ele responde se o repositório entrega com previsibilidade,
revisão e conhecimento distribuído. Não responde se o produto é bom, se o time é
bom ou se o prazo será cumprido. A mecânica completa está em
[Métricas](m1-03-metricas.md).

## Por que meu repositório está sem Score?

Porque ainda não há base suficiente. O cálculo exige **3 das 4 dimensões** com
nota, e cada dimensão exige pelo menos metade dos seus indicadores com dado
(Eficiência do Time exige os dois, por ter apenas dois). Nesses casos a lista de
repositórios mostra o motivo no status: *Processando*, *Aguardando primeira
coleta* ou *Sem atividade Git*. Campo vazio é honestidade, não defeito.

## Por que a dimensão está crítica se a média dela não está?

Porque um **blocker** foi acionado. Alguns indicadores reprovam a dimensão
inteira sozinhos: Lead Time de Entrega ou Taxa de Entrega em crítico derrubam
Fluxo de Entrega; Bus Factor em crítico derruba Riscos Organizacionais; em
Eficiência do Time, só quando os dois indicadores estão críticos ao mesmo tempo.
É o que impede que um problema estrutural seja diluído por indicadores
confortáveis.

## Um indicador sem dado conta como zero?

Não. O indicador é retirado do numerador e do denominador da dimensão. A ausência
de dado nunca vira nota ruim.

## E se uma dimensão inteira ficar sem nota?

Os pesos das demais são renormalizados: a divisão passa a ser pela soma dos pesos
das dimensões que têm nota. Uma dimensão ausente não puxa o Score para baixo, ela
apenas sai da conta.

## O Score dá nota para desenvolvedores?

Não. Não existe nota individual no modelo de dados. As métricas de distribuição
aparecem como percentual do maior contribuidor, sem nome associado, e existem
para revelar **concentração de conhecimento** — risco de continuidade — não para
avaliar pessoas.

## Por que os autores aparecem como #1, #2, #3 em vez dos nomes?

É a permissão **Anonimizar autores nas contribuições** agindo. Ela é configurável
por perfil em [Permissões](m2-08-permissoes.md); desligá-la troca os
identificadores pelos nomes, e é uma decisão que vale ser consciente.

## Um repositório legado com Score baixo é um problema?

Depende do estágio. O ciclo de vida não altera o cálculo, altera a conclusão:
5,2 em um legado estável é esperado, porque o repositório não recebe
investimento; 5,2 em um produto em evolução é fricção onde há investimento ativo.
Por isso, filtre por estágio antes de comparar repositórios.

## Quem classifica o estágio de ciclo de vida?

Ninguém: a classificação é **automática**, a partir da atividade no git — idade
do repositório, frequência de commits, pull requests integradas e contribuidores
ativos. Os cinco estágios e seus critérios estão em
[Workspace](m1-04-workspace.md).

## Mais comentários de revisão melhoram sempre o Score?

Não. Profundidade de Revisão é uma faixa fechada, não uma escada: acima de 10
comentários por entrega o indicador para em atenção, porque normalmente isso
indica entrega grande demais ou desalinhamento, não rigor.

## O que exatamente é o "período anterior" da variação?

É o último período fechado comparado com o imediatamente anterior, na
granularidade selecionada: semana com semana, mês com mês, quarter com quarter.
Trocar a granularidade muda a comparação.

## E os indicadores "vs mês" e "vs trimestre"?

São outra coisa: em vez de comparar com o período anterior, comparam o Score do
período atual com a **média** daquela janela mais longa. Servem para separar
oscilação pontual de tendência.

## O gráfico de trajetória só começa na data em que conectei o repositório?

Não. A série é reconstruída a partir do histórico do git, e não apenas do período
em que o repositório está conectado ao WLC.

## Resolvemos um problema e o Score não mudou. Por quê?

Duas razões, ambas de calendário. O Score só muda depois da próxima **coleta**,
cuja frequência é configurada em [Monitoramento](m2-09-monitoramento.md); e cada
coleta enxerga uma **janela de dados** para trás (90 dias, por exemplo), de modo
que uma melhoria recente entra diluída no período inteiro. Acompanhar a variação
entre períodos diz mais do que o valor absoluto.

## Onde vejo o valor medido de cada indicador?

Na aba **Métricas** da home do repositório, alcançada pelo botão **Ver métricas
detalhadas**. Cada indicador mostra o valor medido, a base entre parênteses e as
três faixas, com a faixa em que ele caiu destacada. Indicadores sem dado aparecem
com `--`.

## O WLC cobre as quatro métricas DORA?

Duas são medidas — lead time de mudança e frequência de entrega. A taxa de falha
de mudança é uma **proxy declarada**, calculada por retrabalho: não é falha em
produção, e o relatório sempre carrega esse aviso. O tempo de restauração **não é
apresentado**, porque não há fonte de incidentes conectada. Quem precisa de MTTR
real precisa conectar uma fonte de incidentes.

## O WLC mede incidentes, disponibilidade ou desempenho em produção?

Não. O recorte vai do requisito ao merge; dados de produção ficam fora do escopo.
No SPACE, pelo mesmo motivo, o eixo Satisfação não é inferido — ele exige pesquisa
com o time.

## Por que um repositório parado não é penalizado?

Indicadores calculados sobre entregas são pulados quando não houve entrega no
período. Um repositório parado não é premiado nem punido por indicadores sem
base.
