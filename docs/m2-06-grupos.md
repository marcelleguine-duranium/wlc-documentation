# Grupos de Usuários

Grupos são o mecanismo de **visibilidade** do produto: eles respondem quem
enxerga o quê.

![Administração — Grupos](../assets/screenshots/admin-grupos.png)

## O que um grupo reúne

Um grupo junta duas coisas:

- **pessoas** — os membros do grupo
- **contextos** — os contextos cujos repositórios esses membros poderão ver

As pessoas de um grupo passam a enxergar os repositórios dos contextos vinculados
a ele, e não os demais. As colunas da lista refletem isso: nome, descrição,
número de membros e número de contextos.

> **Administradores são exceção.** Quem tem perfil de administrador visualiza
> todos os repositórios da organização, esteja ou não em algum grupo. Grupos
> restringem a visão dos demais perfis.

## Criar um grupo

**Novo Grupo** abre um assistente de três passos:

**Passo 1 — Identificação.** Nome do grupo e descrição.

**Passo 2 — Membros** (opcional). Lista das pessoas da organização, com busca,
para marcar quem entra.

**Passo 3 — Contextos** (opcional). Lista dos contextos existentes, para marcar
quais o grupo poderá ver.

Os dois últimos passos são opcionais: dá para criar o grupo e preencher depois,
pelo menu de ações na linha. Mas um grupo sem contextos não concede visibilidade
alguma, e um grupo sem membros não afeta ninguém.

## Efeito no Navigate

A visibilidade por grupo também vale para o assistente: com a filtragem por
usuário ativa, perfis de desenvolvedor e visualizador recebem respostas apenas
sobre os repositórios a que têm acesso. O Navigate não contorna a restrição de
visibilidade.
