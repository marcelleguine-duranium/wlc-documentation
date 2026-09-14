# Ferramentas e People

## Sobre o que o Navigate consegue responder?

Sobre o conhecimento que o WLC acumulou dos seus repositórios: a documentação
gerada pelas análises semânticas e as métricas de processo. As perguntas que mais
rendem são as que cruzam as duas coisas — entrar em um código desconhecido,
entender um número do painel, decidir onde agir. Há uma lista de exemplos em
[Ferramentas](m1-07-ferramentas.md).

## Onde fica o Navigate?

Em dois lugares, que compartilham o mesmo histórico de conversas: no menu
lateral, em Ferramentas › Navigate, em tela cheia; e no **botão flutuante** no
canto inferior direito, presente em todas as telas do produto, que abre um painel
lateral sem tirar você de onde está.

## Como limito a resposta a uma área específica?

Pelo seletor de escopo, no canto superior esquerdo: **Workspace** ou um contexto
específico. No painel flutuante, o escopo vem da tela em que você está. O escopo
não pode ser trocado no meio de uma resposta — espere a resposta corrente
terminar.

## O Navigate pode me mostrar repositórios que eu não deveria ver?

Não. Com a filtragem por usuário ativa, perfis de desenvolvedor e visualizador só
recebem respostas sobre os repositórios a que têm acesso pelos seus grupos. O
Navigate não contorna a restrição de visibilidade.

## Posso compartilhar uma conversa do Navigate?

Sim, pelo botão **Compartilhar**, que gera um link. O acesso é restrito: só
abrem pessoas do **mesmo workspace** e **com permissão sobre os repositórios
tratados na conversa**. Links de outro workspace são recusados, e quem não tem
acesso recebe orientação para pedir liberação ao administrador.

## Mudei de assunto e as respostas continuam presas ao tema anterior.

Use **Nova conversa**: sem isso, o Navigate segue considerando as perguntas
anteriores. O **Histórico** guarda as conversas antigas, com data relativa e o
escopo em que cada uma foi feita.

## O que é o Panorama de Saúde?

Um dos dois relatórios prontos do Navigate. Ele monta uma visão consolidada —
score, evolução no período e ações sugeridas — sempre **sobre contextos**: ao
acioná-lo, o produto pergunta quais contextos entram e qual o período base
(Últimos 30 dias, Esse mês ou Mês anterior). O período escolhido ancora o
relatório inteiro.

## E o Plano de Atualização de Dependências?

É o outro relatório pronto: responde em que ordem atualizar, do que menos quebra
ao que mais quebra. O botão na tela de Dependências não gera nada sozinho — ele
abre o Navigate com o escopo já selecionado e espera sua confirmação lá.

## A tela de Dependências está vazia. O que fazer?

O inventário é coletado junto com a análise de cada repositório, então tela vazia
normalmente significa que a análise ainda não passou por ali. Se depois da
próxima análise continuar vazia, é porque a coleta de dependências ainda não está
habilitada para o workspace. Quando a coleta não está habilitada, o item sequer
aparece no menu.

## Qual a diferença entre a nota e a confiança em Dependências?

A **nota**, de 0 a 10, diz o quanto está atrasado aquilo que foi possível medir.
A **confiança**, em porcentagem, diz quanto do parque essa nota representa — ela
existe porque uma nota 10 apurada sobre uma única biblioteca seria uma mentira
sem esse complemento. Abaixo de 50% de confiança, a nota aparece sem
classificação.

## "Não apurado" quer dizer que está tudo bem?

Não. É a ausência de resposta — código do próprio cliente, pacote que o registro
não conhece, ecossistema sem fonte — e por isso fica fora da escala e fora da
nota. Não medir não é estar bem.

## Por que a nota de dependências não passa de 5?

Porque há **tecnologia fora de suporte** no escopo: linguagem, servidor ou banco
cujo fabricante encerrou o ciclo. Ela segura a nota em 5 por melhor que esteja o
resto, já que nenhuma arrumação de bibliotecas compensa a base.

## Conflito de versão está zerado. Está limpo?

Não necessariamente. Só ecossistemas que empilham versões chegam a ter esse
número — o npm é o caso comum. Onde a resolução é de uma versão por projeto, zero
quer dizer "não se aplica".

## Por que a data de leitura é antiga se acabei de rodar uma análise?

Nos escopos de workspace e contexto, a data exibida é a leitura **mais antiga** do
conjunto, não a mais recente: cada repositório é lido no seu próprio momento, e é
a leitura mais velha que limita a confiança no total.

## Uma biblioteca sem release novo há anos está abandonada?

A coluna **Último release** existe justamente porque a distância não responde
isso: uma biblioteca sem versão nova pode estar pronta ou abandonada, e nos dois
casos a distância é zero. Anos sem release são normais em uma biblioteca pequena
e terminada, e são alerta em uma que ainda tem trabalho em aberto.

## Em que o plano de Onboarding Dev se baseia?

Nos repositórios que você seleciona no terceiro passo do assistente, somados ao
perfil informado — cargo, senioridade, tecnologias que domina, experiência no
domínio e com ferramentas de IA, foco dos primeiros 90 dias e estilo de
aprendizado. Ver [People](m1-08-people.md).

## O plano demora a aparecer?

A geração leva algum tempo: o plano entra na lista com o estado *Gerando* e passa
a *Pronto* quando conclui.

## A descrição de vaga gerada é genérica?

Não. As responsabilidades e os requisitos citam as tecnologias efetivamente
usadas nos repositórios selecionados e as práticas que a análise identificou
neles, como testes automatizados, revisão de código e pipeline de CI/CD. A vaga
pode ficar em **Rascunho** para edição e é exportável em **PDF** e **DOCX**.
