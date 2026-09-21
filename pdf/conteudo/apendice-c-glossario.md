# Glossário

Termos da interface na acepção que o produto lhes dá. O capítulo indicado ao
final de cada verbete trata do assunto em detalhe.

## Estrutura

**Workspace** — o nível da empresa, o mais alto da hierarquia. O seletor da barra
lateral rotula esse mesmo nível como *Organização*; esta documentação usa
Workspace, termo predominante na interface. (Capítulo 1)

**Contexto** — agrupamento lógico de repositórios por produto, domínio ou squad.
É a peça central da estruturação: o Score é agregado por contexto, o Navigate
pode ser restrito a um contexto e o acesso das pessoas é concedido por contexto.
Contextos podem ter contexto pai, formando hierarquia. (Capítulos 5 e 13)

**Sem Contexto** — nó que reúne os repositórios ainda não classificados. Enquanto
estiverem ali, não entram em nenhuma visão por contexto. (Capítulo 13)

**Repositório** — o nível do código, o mais baixo da hierarquia. (Capítulo 6)

## Medição

**Score de Engenharia** — indicador único de 0 a 10, média ponderada de quatro
dimensões. Existe nos três níveis da hierarquia. (Capítulos 1 e 2)

**Dimensão** — cada uma das quatro frentes que compõem o Score: Fluxo de Entrega,
Qualidade da Engenharia, Eficiência do Time e Riscos Organizacionais. Não pesam
igual. (Capítulo 2)

**Indicador** — medida individual dentro de uma dimensão. Seu valor medido é
classificado em uma faixa, que vira pontos. (Apêndice A)

**Blocker** — indicador grave o suficiente para tornar a dimensão crítica
sozinho, mesmo com média ponderada boa. É a explicação para uma dimensão crítica
sem média crítica. (Capítulo 2 e Apêndice A)

**Suficiência de dados** — regra que impede a publicação de número frágil. O
repositório precisa de nota em três das quatro dimensões para receber Score, e
cada dimensão precisa de dado em pelo menos metade de seus indicadores. Campo
vazio indica ausência de base, não defeito. (Apêndice A)

**Faixas de status** — os rótulos Saudável, Atenção e Crítico. Aplicados à nota,
usam dois cortes fixos: 4,0 e 7,0. Aplicados a um indicador, usam os limiares
próprios daquele indicador. (Apêndice A)

**DORA e SPACE** — referenciais públicos de medição de engenharia com os quais o
Score mantém correspondência. (Apêndice A)

## Recursos

**Insights IA** — diagnóstico escrito por IA. No contexto, é a leitura
estratégica de quem responde pela área; no repositório, a leitura do código.
Nada é gerado sozinho: a análise é disparada explicitamente. (Capítulos 5 e 6)

**Navigate** — assistente que responde perguntas usando a documentação gerada
pelas análises semânticas e as métricas de processo. Tem escopo de workspace ou
de contexto. (Capítulo 7)

**Panorama de Saúde** — relatório pronto do Navigate, construído sobre contextos,
com visão consolidada de score, evolução no período e ações sugeridas.
(Capítulo 7)

**Dependências** — inventário das bibliotecas de terceiros usadas pelo código,
com o quanto cada uma está atrasada em relação à versão publicada. Tem escopo de
workspace, contexto ou repositório. (Capítulo 7)

**Plano de Atualização de Dependências** — relatório que responde em que ordem
atualizar, do que menos quebra ao que mais quebra. (Capítulo 7)

**Onboarding Dev** — plano de integração para desenvolvedores que chegam ao time,
construído a partir do que a plataforma já sabe sobre os repositórios.
(Capítulo 8)

**Job Description** — descrição de vaga gerada com base nas tecnologias e
características reais dos repositórios do workspace. (Capítulo 8)

## Administração

**Perfil** — o papel da pessoa; define o que ela pode fazer. (Capítulo 14 e
Apêndice B)

**Grupo de usuários** — mecanismo de visibilidade; reúne pessoas e contextos, e
define quais repositórios esses membros enxergam. Vale para todos os perfis,
inclusive o de Gestor; só o Administrador não depende de grupo. (Capítulo 15 e
Apêndice B)

**API Key** — chave de acesso à API, destinada a disparar análises a partir da
esteira de CI/CD, para que a documentação gerada acompanhe o código sem
intervenção manual. (Capítulo 17)

**Coleta Automática de Métricas** — rotina periódica que alimenta o Score e as
métricas do painel; sua frequência é configurável. (Capítulo 18)

**SSO SAML** — autenticação corporativa. (Capítulo 19)
