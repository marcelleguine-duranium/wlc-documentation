# 7. Ferramentas

## Navigate

Assistente que responde perguntas usando o conhecimento que o WLC acumulou sobre
os repositórios — tanto a documentação gerada pelas análises semânticas quanto as
métricas de processo.

![Navigate](../assets/screenshots/navigate.png)

### Onde acessar

Há dois caminhos, e eles compartilham o mesmo histórico de conversas:

- **Pelo menu lateral**, em Ferramentas › Navigate, que abre a tela cheia
- **Pelo botão flutuante**, o ícone de conversa no canto inferior direito, que
  está presente em **todas as telas do produto** e abre um painel lateral sem
  tirar você de onde está

![Painel do Navigate sobre a lista de repositórios](../assets/screenshots/navigate-painel.png)

O painel é a versão compacta: serve para uma pergunta rápida sobre a tela que
você está vendo. Ele traz **Ir para o Navigate**, que transfere a conversa para a
tela cheia quando o assunto se aprofunda.

### Escopo da conversa

O seletor no canto superior esquerdo define sobre o que o Navigate responde:

- **Workspace** — o workspace inteiro, com todos os seus repositórios
- **Um contexto específico** — apenas os repositórios daquele agrupamento

Ao abrir o painel flutuante, o escopo vem da tela em que você está. O escopo não
pode ser trocado no meio de uma resposta: é preciso esperar a resposta corrente
terminar.

> O que cada pessoa enxerga depende das permissões. Com a filtragem por usuário
> ativa, perfis de desenvolvedor e visualizador só recebem respostas sobre os
> repositórios aos quais têm acesso pelos seus
> [grupos](m2-00-visao-admin.md).

### Os três botões

**Nova conversa** — descarta o contexto acumulado e começa do zero. Útil quando o
assunto muda: sem isso, o Navigate segue considerando as perguntas anteriores.

**Compartilhar** — gera um link para a conversa. O acesso é restrito: apenas
pessoas **do mesmo workspace** e **com permissão sobre os repositórios tratados
na conversa** conseguem abrir. Links de outro workspace são recusados, e quem
não tem acesso aos repositórios recebe orientação para pedir liberação ao
administrador. Quem abre um link compartilhado vê a conversa marcada como
*Compartilhada por* quem a gerou.

**Histórico** — lista as conversas anteriores, com a data relativa de cada uma
("Há 3 dias") e o escopo em que foi feita, para retomar de onde parou.

### Panorama de Saúde

É o único relatório pronto disponível hoje, oferecido em **Comece com um
relatório pronto**. Ele monta uma visão consolidada de saúde da engenharia —
score, evolução no período e ações sugeridas — com formatação própria, em vez de
uma resposta em texto corrido.

O Panorama é sempre construído **sobre contextos**. Ao acioná-lo, o produto
pergunta duas coisas:

![Seleção de contextos e período do Panorama](../assets/screenshots/navigate-panorama.png)

1. **Quais contextos entram** — um, vários, ou "Todos os contextos (workspace)".
   Quando muitos contextos são selecionados, todos entram no score consolidado,
   mas a tabela detalha os principais e agrupa o restante em "Demais".
2. **Qual o período base** — Últimos 30 dias, Esse mês ou Mês anterior.

O período escolhido ancora o relatório inteiro: o score, a tendência de 90 dias e
as métricas de fluxo. Nas comparações, "Atual" é o período escolhido e "Anterior"
é o período imediatamente anterior a ele.

No painel flutuante o Panorama aparece como **Disponível no Navigate**: clicar
leva à tela cheia, onde a seleção de contextos e período acontece.

### O que perguntar

O produto oferece três atalhos abaixo do campo de pergunta:

- Quais são as principais regras de negócio?
- Quem domina o conhecimento aqui?
- Quais repositórios fazem parte?

São pontos de partida, não um cardápio fechado. Como o Navigate se apoia na
documentação gerada pelas análises e nas métricas de processo, as perguntas que
mais rendem são as que aproveitam esse cruzamento:

**Para entrar em um código desconhecido**

- O que este repositório faz e como está organizado?
- Quais são as regras de negócio implícitas neste módulo?
- Que decisões de arquitetura explicam a estrutura atual?
- Por onde começar para mexer nesta parte do sistema com segurança?

**Para entender um número do painel**

- Por que a Qualidade da Engenharia caiu no último período?
- O que está puxando o Bus Factor para baixo neste repositório?
- Quais repositórios têm o maior risco de continuidade hoje?
- O que mudou nas últimas semanas que explica a variação do Score?

**Para decidir onde agir**

- Quais repositórios deveriam receber atenção nesta semana?
- Onde a revisão de código está concentrada em poucas pessoas?
- Que dependências estão desatualizadas ou representam risco?
- Quais repositórios estão em estágio de legado mas ainda são críticos?

**Para preparar uma conversa ou um documento**

- Resuma a saúde desta área para uma reunião de gestão.
- Quem procurar sobre este módulo?
- Que pontos de conformidade merecem atenção neste repositório?
