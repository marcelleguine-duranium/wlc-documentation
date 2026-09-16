# Acesso e navegação

## Esqueci minha senha. Como recupero?

Na tela de login, o link **Esqueceu a senha?** ao lado do campo de senha leva ao
formulário de recuperação: você informa o e-mail e recebe um link para definir a
nova senha. Detalhes em [Acesso](m1-02-acesso.md).

## O link de redefinição não funciona. O que faço?

Os links de redefinição têm validade e valem uma única vez. Se o link já tiver
sido usado ou expirado, a própria tela explica o que aconteceu e oferece pedir um
novo, sem precisar voltar ao início.

## Posso acessar mais de um workspace com o mesmo e-mail?

Não. Cada e-mail tem acesso a um único workspace. Para trabalhar em outro, é
preciso uma conta com acesso a ele.

## Como troco de workspace dentro do produto?

Não existe troca de workspace no produto. O seletor no topo da barra lateral
**não** troca de workspace: ele navega entre os contextos e os repositórios do
workspace em que você já está — é por ele que se desce da visão geral para um
contexto e de um contexto para um repositório.

## "Workspace" e "Organização" são a mesma coisa?

Sim. O produto usa *Workspace* na maior parte das telas — no Score, no escopo do
Navigate, nos filtros — mas o seletor da barra lateral rotula esse mesmo nível
como *Organização*. A documentação usa Workspace, que é o termo predominante na
interface.

## Entrei, mas não vejo nenhum repositório. Por quê?

A visibilidade vem dos **grupos de usuários**, não do perfil. Uma pessoa que não
está em nenhum grupo — ou está em um grupo sem contextos vinculados — pode não
enxergar repositório algum. Peça ao administrador do workspace que inclua você em
um grupo com os contextos certos. Administrador é a única exceção: enxerga tudo,
esteja ou não em grupos. Ver [Grupos de Usuários](m2-06-grupos.md).

## Sou Gestor. Por que não vejo a organização inteira?

Porque o perfil não concede visibilidade: ele define o que você pode fazer, e
são os grupos que definem o que você enxerga. Um gestor vê os contextos dos
grupos de que é membro, e os repositórios desses contextos — o Score, a
composição e a trajetória da tela inicial são calculados sobre esse recorte.

Se você não está em nenhum grupo, não verá repositório algum. O caminho, nos dois
casos, é pedir ao administrador do workspace que vincule você aos grupos
correspondentes à sua área. Um endereço de contexto fora do seu escopo também não
abre, mesmo com o link em mãos.

## Por que não consigo alterar meu e-mail, meu perfil ou meus grupos?

Esses três campos aparecem em **Meu Perfil** com um cadeado, porque são definidos
pela administração do workspace. Você edita nome e cargo; o resto passa pelo
administrador. Ver [Perfil e conta](m1-09-perfil.md).

## Por que não vejo o Painel Admin, ou alguma seção dele?

O acesso a cada seção administrativa depende de permissão. Quem não tem a
permissão correspondente não vê o item no menu e é redirecionado ao tentar
acessar o endereço diretamente.

## Minha empresa usa login corporativo. Dá para entrar por ele?

Sim, quando o workspace tem SSO SAML configurado e ativo: a tela de acesso passa
a oferecer **Entrar com SSO** ao lado do login por e-mail e senha. A configuração
é feita pelo administrador em [SSO SAML](m2-10-sso.md).

## Fui convidado, mas nunca recebi o e-mail. O que houve?

Enquanto o convite não é aceito, a pessoa aparece na lista de usuários com status
**Pendente**; passado o prazo, vira **Expirado**. O administrador consegue
encontrar os dois casos pelo filtro de convites em
[Usuários](m2-05-usuarios.md) e reenviar.
