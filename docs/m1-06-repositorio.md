# 6. Repositório

O repositório é o nível mais profundo da navegação, e é onde o Score de fato é
calculado — os níveis acima agregam. A trilha do topo mostra o caminho completo
(*Workspace › Contexto › Repositório*).

A barra lateral, neste nível, traz **Visão Geral** e **Documentação**.

## Visão Geral do repositório

![Visão geral do repositório](../assets/screenshots/repo-home.png)

Score do repositório, variação e trajetória. A composição, aqui, lista as quatro
dimensões em vez de repositórios — é o nível em que se vê qual dimensão está
puxando o Score.

O botão **Ver métricas detalhadas** abre a aba **Métricas**, onde cada indicador
aparece com o valor medido e a faixa em que caiu. Essa tela está explicada em
[Métricas](m1-03-metricas.md).

## Documentação gerada

É onde o WLC entrega a leitura semântica do código. A plataforma analisa o
repositório em **sete frentes**, cada uma com estado próprio, indicando a branch
analisada.

![Documentação do repositório](../assets/screenshots/repo-documentacao.png)

| Frente | O que cobre |
| --- | --- |
| Visão Geral | fotografia consolidada da saúde do projeto |
| Arquitetura | padrões de design, camadas, acoplamento e coesão |
| Regras de Negócio | regras implícitas no código |
| Gestão de Dependências | versões, depreciação, dívida técnica e licenças |
| Design de APIs | qualidade arquitetural das APIs |
| Qualidade de Código | complexidade, manutenibilidade e cobertura de testes |
| Conformidade CNPJ 2026 | adaptação ao novo formato alfanumérico |

Cada frente fica em um de dois estados:

- **Atualizada** — a análise foi concluída, com a data da última atualização, e o
  botão **Abrir** mostra o documento
- **Fora de escopo** — a frente não se aplica àquele repositório, e o produto diz
  por quê (por exemplo, nenhum endpoint de API detectado). O botão **Reavaliar
  escopo** força uma nova verificação

Esse segundo estado é deliberado: em vez de entregar um documento vazio, o
produto explica a ausência.

### O que define "fora de escopo"

A decisão é automática e acontece **antes** da análise rodar. O motor inspeciona
o repositório e produz artefatos de detecção — inventário de arquivos,
tecnologias, dependências declaradas, registro de APIs — e cada frente tem um
critério objetivo sobre esses artefatos.

Vale registrar como a decisão **não** é tomada: ela não depende de julgamento do
modelo de IA. Os critérios usam apenas sinais calculados a partir do código, o
que evita que uma leitura equivocada do modelo tire uma análise de escopo.

Primeiro há uma regra geral. **Repositório pequeno** — menos de 100 linhas de
código *e* menos de 5 arquivos — coloca todas as frentes fora de escopo, exceto a
Visão Geral. As duas condições precisam ser verdadeiras ao mesmo tempo.

Depois, cada frente tem seu próprio critério:

| Frente | Entra em escopo quando | Mensagem quando não entra |
| --- | --- | --- |
| **Visão Geral** | sempre; é a única frente que a regra de repositório pequeno não afeta | — |
| **Arquitetura** | o repositório tem mais de 5 arquivos e contém arquivos de código-fonte | "Repositório não possui estrutura suficiente para análise de arquitetura" |
| **Regras de Negócio** | o repositório tem mais de 100 linhas e contém arquivos de código-fonte | "Repositório possui código insuficiente para análise de negócios" |
| **Qualidade de Código** | há pelo menos alguma linha de código e arquivos de código-fonte | "Nenhum arquivo de código-fonte encontrado" |
| **Gestão de Dependências** | há dependências declaradas em algum gerenciador de pacotes | "Nenhuma dependência detectada" |
| **Design de APIs** | há endpoints detectados, ou arquivos de especificação de API (OpenAPI, WSDL, GraphQL, gRPC) | "Nenhum endpoint de API detectado" |
| **Conformidade CNPJ 2026** | o repositório declara alguma biblioteca conhecida de validação de CPF/CNPJ | "Nenhum padrão de validação CNPJ/CPF encontrado" |

Dois detalhes que evitam falso negativo:

- **"Arquivo de código-fonte" exclui markdown, formatos de configuração e
  arquivos de dados.** Um repositório só com YAML e README não passa nos
  critérios que exigem código, e é por isso que a mensagem de Qualidade de Código
  menciona repositórios que contêm apenas configurações ou scripts simples.
- **Design de APIs não exige endpoints implementados.** Um repositório que só
  publica contratos — arquivos `.wsdl`, `.proto` ou especificações OpenAPI — entra
  em escopo mesmo sem código de API.

Quando os artefatos de detecção não estão disponíveis, o motor assume que a
análise **se aplica** em vez de descartá-la. O comportamento é conservador na
direção de analisar demais, não de menos.

É por isso que **Reavaliar escopo** existe: o critério é avaliado sobre o estado
do repositório naquele momento. Um repositório que ganhou seu primeiro endpoint,
ou passou a declarar dependências, muda de situação — e a reavaliação é o que
detecta isso.

### Como a documentação é atualizada

As análises não são geradas uma única vez: elas acompanham a evolução do código.
Há dois caminhos.

**Automaticamente, pela esteira de CI/CD.** Quando o repositório tem a integração
configurada, cada execução do pipeline dispara uma nova análise, e a documentação
reflete o estado atual do código sem intervenção. A conexão é feita com uma chave
de API, criada em [Administração › API Keys](m2-00-visao-admin.md) — é para isso
que aquelas chaves existem.

**Manualmente, por esta tela.** O menu de ações de cada frente, no fim da linha,
oferece **Gerar novamente**, que reprocessa apenas aquela análise. Para
reprocessar tudo de uma vez, o menu no topo direito da tela traz **Gerar todas
novamente**, que pede confirmação antes de disparar — a análise de todas as
frentes leva alguns minutos e consome recursos do motor.

Os mesmos menus permitem exportar o resultado: **Baixar PDF** e **Baixar
Markdown** por frente, ou **Baixar tudo em PDF** e **Baixar tudo em Markdown**
para o conjunto.

Frentes marcadas como *Fora de escopo* não têm a opção de gerar novamente, e sim
**Reavaliar escopo**: em vez de reprocessar uma análise que não se aplica, o
produto verifica de novo se ela passou a se aplicar — por exemplo, se o
repositório ganhou endpoints de API desde a última verificação.

> **Esta frente está em evolução.** A análise semântica que produz esses
> documentos está passando por uma reformulação ampla, que abrange desde a coleta
> dos dados até o processamento e a forma de apresentá-los. Por isso, neste
> momento, algumas análises aparecem com layout e nível de detalhe diferentes das
> demais. A diferença é temporária e será uniformizada conforme as frentes forem
> migradas para o novo formato.
