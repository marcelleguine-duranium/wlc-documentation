# Perfis, grupos e permissões

Referência rápida dos três mecanismos que, juntos, determinam o que uma pessoa
faz e o que ela vê. Cada um é tratado em detalhe nos capítulos 14, 15 e 16.

## Os três mecanismos

| Mecanismo | Responde a | Onde se configura |
| --- | --- | --- |
| **Perfil** | o que a pessoa pode fazer | Admin › Usuários, no seletor da linha |
| **Grupo** | o que a pessoa enxerga | Admin › Grupos de Usuários |
| **Permissões** | quais funcionalidades ficam habilitadas por perfil | Admin › Permissões |

Perfil e visibilidade se confundem com frequência. O perfil define a capacidade
de agir; os grupos definem o recorte de repositórios visível. Quem não está em
nenhum grupo pode não ver repositório algum, **inclusive quem tem perfil de
Gestor**: cargo amplia o que se faz, não o que se enxerga. Administrador é a
única exceção — enxerga tudo, independentemente de grupos.

## Os cinco perfis

O produto trabalha com cinco perfis:

- **Administrador**
- **Gestor**
- **Analista de Segurança**
- **Desenvolvedor**
- **Visualizador**

O que cada um pode fazer não é fixo: é definido na matriz de Permissões, cujas
linhas são funcionalidades e cujas colunas são esses cinco perfis. O acesso às
seções do Painel Admin também depende de permissão — quem não a tem não vê o
item no menu e é redirecionado ao tentar acessar a rota diretamente.

**Grupos de Usuários é exclusiva do Administrador.** Um Gestor não administra o
mecanismo que o restringe, e a lista de Usuários que ele vê traz apenas as
pessoas dos seus grupos.

## Funcionalidades configuráveis na matriz

| Funcionalidade | Efeito quando ativa |
| --- | --- |
| **Compartilhar conversas** | o perfil pode criar e abrir links de compartilhamento de conversas do Navigate |
| **Anonimizar autores nas contribuições** | a Distribuição de Contribuições exibe os autores como #1, #2, #3; desativar mostra os nomes |

> **Atenção.** A anonimização controla se nomes de pessoas aparecem associados a
> métricas de contribuição. Mantê-la ativa é a opção mais conservadora do ponto
> de vista de dados pessoais e é coerente com o desenho do produto, que não
> produz score individual por desenvolvedor. As métricas de distribuição existem
> para revelar concentração de conhecimento, não para avaliar pessoas.

## Estados do usuário

| Status | Significado |
| --- | --- |
| **Ativo** | acesso liberado |
| **Inativo** | sem acesso |
| **Pendente** | convite enviado, ainda não aceito |
| **Expirado** | convite não aceito dentro do prazo; precisa ser reenviado |
