# Configuração e administração

## Por onde começar em um workspace novo?

Na ordem que funciona: **Repositórios** (conectar o GitHub e escolher o que será
analisado), **Contextos** (agrupar e escrever o briefing), **Usuários**
(convidar e definir perfis), **Grupos** (se nem todo mundo deve ver tudo), **API
Keys** (se as análises devem rodar a cada push) e **Monitoramento** (se o padrão
de coleta não servir). Ver [Painel Admin](m2-00-visao-admin.md).

## Conectei o GitHub e nada foi analisado.

Nenhum repositório é analisado antes de ser adicionado em
[Repositórios](m2-02-repositorios.md). Vale checar também o bloco de conexão no
topo da tela: se faltar alguma permissão obrigatória, o produto avisa ali quais
são — e sem elas as análises não rodam. **Atualizar conexão** refaz a
autorização.

## Atingi a cota de repositórios do plano.

A tela de adicionar repositórios informa quantos já estão em uso e quantas vagas
restam. Repositórios arquivados vêm marcados, para não ocuparem vaga por engano.
Com todas as vagas ocupadas, o produto bloqueia a inclusão: o caminho é remover
um repositório já conectado antes de adicionar outro.

## Atingi o limite de usuários do plano.

O botão **Convidar usuários** fica desativado quando todas as vagas estão
ocupadas, e o produto explica o motivo ao passar o cursor sobre ele. Desativar
alguém que não usa mais o produto libera uma vaga na hora; para aumentar o teto,
é preciso abrir um chamado com o time de suporte. Convites pendentes não ocupam
vaga enquanto não são aceitos.

## Como adiciono muitos repositórios de uma vez?

Pelo caminho da planilha: **Baixar template** gera o CSV no formato esperado,
você preenche e usa **Importar CSV**. **Exportar** faz o inverso, útil para
auditoria ou para replicar a configuração em outro workspace.

## Pausar um repositório apaga o histórico?

Não. Pausar interrompe novas análises sem remover o repositório nem descartar o
histórico já coletado — é o caminho para um projeto que entrou em espera.

## O que é o nó "Sem Contexto"?

São os repositórios ainda não classificados. É o item a observar depois de
conectar repositórios novos: enquanto estiverem ali, não entram em nenhuma visão
por contexto.

## Remover um repositório de um contexto exclui ele do workspace?

Não. **Remover** desfaz apenas o vínculo, e o repositório volta para "Sem
Contexto".

## O briefing do contexto é mesmo necessário?

É o que mais muda o resultado das análises de IA daquele contexto. O mesmo código
analisado com e sem briefing produz leituras diferentes, porque o modelo passa a
saber o que o sistema faz, que restrições existem e o que está em andamento. O
botão **Usar template** dá a estrutura de quatro partes; a seção *Contexto
relevante para análise* — migrações em curso, dívida conhecida, restrições
regulatórias — costuma ser a mais valiosa. Limite de 3000 caracteres.

## Qual a diferença entre perfil e grupo?

O **perfil** define o que a pessoa **pode fazer** (Administrador, Gestor, Analista
de Segurança, Desenvolvedor, Visualizador). Os **grupos** definem o que a pessoa
**enxerga** — quais contextos e, portanto, quais repositórios. Quem não está em
nenhum grupo pode não ver repositório algum, **e isso inclui o perfil de
Gestor**. Administrador é a única exceção: enxerga tudo, independentemente de
grupos.

## Um Gestor precisa mesmo estar em um grupo?

Precisa. Fora o administrador, nenhum perfil enxerga nada sem grupo, e o de
gestor não abre exceção. Ao criar um workspace ou ao promover alguém a gestor,
vincule a pessoa aos grupos da área pela qual ela responde — senão ela entra e
não encontra repositório, contexto nem Score.

O gestor entra no grupo como membro comum: não existe a figura de dono ou
responsável pelo grupo. Ver [Grupos de Usuários](m2-06-grupos.md).

## Por que o Gestor não vê a seção Grupos de Usuários?

Porque essa seção é exclusiva do administrador. Quem pudesse editar o próprio
grupo poderia ampliar o próprio alcance, e a restrição deixaria de restringir.
Pela mesma razão, a lista de Usuários do Painel Admin mostra, para um gestor,
apenas as pessoas dos grupos de que ele participa.

## Criei um grupo e nada mudou.

Um grupo sem contextos não concede visibilidade alguma, e um grupo sem membros
não afeta ninguém. Os dois passos são opcionais na criação e podem ser
preenchidos depois, pelo menu de ações na linha do grupo.

## Como troco o perfil de uma pessoa?

Pelo seletor na própria linha da pessoa, em [Usuários](m2-05-usuarios.md). A
troca é imediata.

## Para que serve uma API Key?

Para disparar análises a partir da esteira de CI/CD, de modo que a documentação
gerada acompanhe o código sem intervenção manual. O botão **Exemplos** traz
configurações prontas para GitHub Actions, GitLab CI, Azure DevOps, CircleCI,
Bitbucket, Jenkins e cURL.

## A análise trava meu pipeline?

Não. A API responde **202 Accepted** e a análise roda em segundo plano: o build
não espera, e o resultado aparece na documentação do repositório quando o
processamento termina.

## Perdi a chave. Consigo ver o valor de novo?

Não. O valor completo é exibido **uma única vez, no momento da criação**; depois
disso a listagem mostra apenas o prefixo. Se perder, revogue e gere outra.
Guarde a chave no cofre de segredos da esteira — chaves de API são credenciais e
não devem ser compartilhadas em conversas, tickets ou documentos.

## A que horas a coleta roda?

No horário configurado em **Executar às (UTC)** — e é **UTC**, não o fuso local:
uma coleta às 04:51 UTC acontece por volta das 01:51 no horário de Brasília.

## Qual a diferença entre frequência e janela de dados?

A **frequência** diz de quanto em quanto tempo a coleta roda; a **janela** diz
quanto tempo para trás cada coleta enxerga. Uma coleta diária com janela de 90
dias recalcula, todo dia, uma fotografia dos últimos 90 dias.

## Desligar a coleta automática apaga o que já foi coletado?

Não. Apenas interrompe a atualização — o painel passa a mostrar dados cada vez
mais antigos.

## Devemos desligar a anonimização de autores?

É uma escolha do workspace, e vale que seja explícita. Manter a anonimização
ativa é a opção mais conservadora do ponto de vista de dados pessoais e é
coerente com o desenho do produto, que não produz score individual. Desativar
transforma um indicador de risco organizacional em algo que pode ser lido como
avaliação individual.

## Como ativo o SSO SAML?

Pelo botão **Configurar** em [SSO SAML](m2-10-sso.md), que abre o assistente onde
se informam os dados do provedor de identidade. A tela mostra o estado atual —
Não configurado, Pendente, Ativo, Desabilitado ou Falhou.

## O que são as telas de Empresas, Feature flags e Termos de uso?

São seções de **Super Admin**, restritas à equipe Duranium, que administram a
plataforma como um todo em vez de um workspace específico. É por ali que
funcionalidades são ligadas e desligadas workspace a workspace.
