# Super Admin

Seções restritas à equipe Duranium, que administram a plataforma como um todo em
vez de um workspace específico. A própria tela avisa dessa restrição.

![Administração — Empresas](../assets/screenshots/admin-empresas.png)

## Empresas

Lista as contas (tenants) da plataforma, com nome, slug, domínio e status, e
permite criar uma nova empresa. É a partir daqui que se chega às configurações
de cada workspace de cliente, incluindo SSO e feature flags específicas.

## Feature flags e Termos de uso

Duas outras seções pertencem a este grupo:

- **Feature flags** — liga e desliga funcionalidades por workspace. É o
  mecanismo por trás de recursos que existem no produto mas não estão ativos em
  todas as contas
- **Termos de uso** — versões dos termos, com estados de rascunho, ativa e
  arquivada

> Estas duas telas não estão documentadas com imagem: elas exigem as permissões
> `admin.feature-flags` e `admin.terms`, que a conta usada na captura não possui.
