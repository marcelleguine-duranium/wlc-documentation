# Usuários

As pessoas com acesso ao workspace.

![Administração — Usuários](../assets/screenshots/admin-usuarios.png)

## A tabela

| Coluna | Conteúdo |
| --- | --- |
| **Usuário** | nome e e-mail |
| **Perfil** | o papel da pessoa, editável no próprio seletor da linha |
| **Grupos** | os grupos a que pertence, que determinam o que ela enxerga |
| **Status** | Ativo, Inativo, Pendente ou Expirado |

A busca filtra por nome ou e-mail, e **Filtros** permite recortar por status e
por situação do convite.

## Os perfis

O produto trabalha com cinco perfis: **Administrador**, **Gestor**, **Analista de
Segurança**, **Desenvolvedor** e **Visualizador**. O que cada um pode fazer está
em [Permissões](m2-08-permissoes.md).

Trocar o perfil de alguém é imediato: basta usar o seletor na linha da pessoa.

## Convidar pessoas

**Convidar usuários** envia convite por e-mail. Até a pessoa aceitar, ela aparece
na lista com status **Pendente**; convites não aceitos dentro do prazo passam a
**Expirado**, e o filtro de convites ajuda a encontrá-los para reenvio.

## Perfil e visibilidade são coisas diferentes

Vale separar os dois conceitos, porque eles se confundem com frequência:

- O **perfil** define *o que a pessoa pode fazer* — administrar, apenas
  visualizar, e assim por diante
- Os **grupos** definem *o que a pessoa enxerga* — quais contextos, e portanto
  quais repositórios

Uma pessoa com perfil de Desenvolvedor e sem grupo algum pode não ver nenhum
repositório. Administradores são exceção: enxergam tudo, independentemente de
grupos.

> No print, nomes e e-mails estão borrados por serem dados pessoais.
