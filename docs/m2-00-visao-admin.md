# Painel Admin

A área administrativa tem barra lateral própria, identificada por **ADMIN**, e o
link **Voltar ao sistema** no rodapé retorna à navegação normal.

![Administração — Geral](../assets/screenshots/admin-geral.png)

É onde se configura tudo que o painel principal consome: quais repositórios são
analisados, como eles são agrupados, quem tem acesso a quê, e com que frequência
os dados são coletados.

## O que fica onde

| Seção | Responde a |
| --- | --- |
| [Geral](m2-01-geral.md) | como este workspace se identifica |
| [Repositórios](m2-02-repositorios.md) | quais repositórios o WLC analisa |
| [Contextos](m2-03-contextos.md) | como esses repositórios são agrupados |
| [API Keys](m2-04-api-keys.md) | como a esteira de CI/CD dispara análises |
| [Usuários](m2-05-usuarios.md) | quem tem acesso e com qual perfil |
| [Grupos de Usuários](m2-06-grupos.md) | quem enxerga quais repositórios |
| [Permissões](m2-08-permissoes.md) | o que cada perfil pode fazer |
| [Monitoramento](m2-09-monitoramento.md) | com que frequência os dados são coletados |
| [SSO SAML](m2-10-sso.md) | autenticação corporativa |
| [Super Admin](m2-11-super-admin.md) | seções restritas à equipe Duranium |

O acesso a cada seção depende de permissão: quem não tem a permissão
correspondente não vê o item no menu e é redirecionado ao tentar acessá-lo
diretamente.

**Grupos de Usuários é exclusiva do administrador.** Um gestor que alcance o
Painel Admin não encontra essa seção no menu, porque editar o próprio grupo
ampliaria o próprio alcance. Pela mesma razão, a lista de **Usuários** que um
gestor vê traz apenas as pessoas dos grupos de que ele participa, e não o
workspace inteiro.

## Por onde começar

Num workspace novo, a ordem que funciona é esta:

1. **Repositórios** — conectar o GitHub e escolher o que será analisado
2. **Contextos** — agrupar os repositórios por domínio e escrever o briefing de
   cada um
3. **Usuários** — convidar as pessoas e definir o perfil de cada uma
4. **Grupos** — vincular cada pessoa aos contextos que ela deve enxergar. Este
   passo não é opcional: fora o administrador, quem não está em nenhum grupo não
   enxerga repositório algum, inclusive quem tem perfil de Gestor
5. **API Keys** — se as análises devem rodar a cada push, conectar a esteira
6. **Monitoramento** — ajustar a frequência da coleta, se o padrão não servir
