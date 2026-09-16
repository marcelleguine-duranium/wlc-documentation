# Prompt: diagramar um PDF a partir de arquivos Markdown

Para execução autônoma, sem revisão humana entre o pedido e o PDF. Copie o bloco
abaixo e troque `{{pasta}}` pelo caminho dos arquivos de origem. O prompt trata
apenas de formatação: o conteúdo vem pronto do Markdown. A paleta vem fixa; troque
o bloco se o documento for de outra marca.

---

```
Diagrame um PDF a partir dos arquivos Markdown em {{pasta}}. O texto já está
escrito: não crie, resuma, reescreva nem reordene conteúdo. Seu trabalho é
estrutura visual, paginação e identidade. Trabalhe sem me consultar: onde houver
ambiguidade, decida pela opção mais conservadora.

FONTE E SAÍDA
Os Markdown são a fonte única, nada é reescrito à mão no HTML. Gere estrutura.mjs
(manifesto: ordem e agrupamento), estilo.css, build.mjs (monta um HTML linear e
imprime com o Chromium do Playwright) e um script npm. HTML e PDF vão para o
.gitignore.

ORDEM E AGRUPAMENTO
Se a pasta tiver um índice — README ou equivalente —, siga a ordem e os títulos
dele. Sem índice, ordem alfabética do nome do arquivo. Se os nomes trouxerem
prefixo de agrupamento (m1-, 01-, parte-a-), agrupe em partes por esse prefixo.
Não invente agrupamento que a origem não tenha.

PÁGINAS QUE VOCÊ GERA
Apenas estas, todas derivadas do próprio material: capa, com o título vindo do
índice ou do nome da pasta; ficha técnica com a data da edição e a revisão do git
quando a origem estiver versionada; sumário com links. Abertura de parte só
quando houver agrupamento e mais de dez capítulos — abaixo disso ela ocupa mais
página do que informa. Se a origem declarar confidencialidade ou classificação,
reproduza na capa e na ficha. Nenhum outro texto autoral.

DIAGRAMAÇÃO
A4, margens de 16 mm em cima e embaixo e 18 mm nas laterais, corpo de 10,5 pt com
entrelinha 1,55. Cada capítulo começa em página nova. Numeração hierárquica
automática: 4, 4.2, 4.2.1. Figuras e listagens numeradas por capítulo, legenda
vinda do texto alternativo. Blockquote vira bloco "Nota", ou "Atenção" quando
começar por essa palavra. Links entre os arquivos de origem viram âncora interna
com a referência textual ao lado — "(capítulo 7)". Tabelas com cabeçalho repetido
na quebra de página.

Quando a origem tiver código: blocos em monoespaçada de 9 pt, com a linha longa
quebrada preservando a indentação e nunca cortada na largura da coluna, porque o
leitor copia do PDF; identificadores no meio da frase em monoespaçada; comando de
terminal separado da saída, sem o "$" na frente.

PALETA
Acentos: teal #469CA1 e coral #E85C50. Em fundo claro, use as variantes de
contraste: teal escuro #286B6F e coral escuro #C03E32. Em fundo escuro, teal
claro #6BBCC1 e texto suave #CBD6E4, ou #8A95A0 quando o contraste baixo for
intencional. Fundos: off-white #F5F7FA primário, #ECF4F5 em seções alternadas,
#EAF5F5 em callouts, branco #FFFFFE em cards. Texto: #2D3B45 em títulos, #3D4F5F
no corpo, #5C6977 em legenda e metadado. Estruturais: navy #111B22 nas seções
escuras, #DDE1E6 em bordas, #B0B8C1 em divisores.
Navy na capa e nas aberturas de parte, teal na estrutura — numeração, filetes,
cabeçalho de tabela, callouts — e coral em ênfase pontual: número do capítulo e
avisos de atenção. O fundo da página fica branco; os tons de fundo ficam nas
superfícies. Declare os tokens em :root e não repita hexadecimal no corpo do CSS.

MECÂNICA DE IMPRESSÃO
- Numere os headings em uma única passada, na ordem do documento. Numerar H2 e H3
  em passagens separadas faz o H3 herdar o contador final do H2.
- As margens vêm do CSS, não da chamada de impressão:
  @page { size: A4; margin: 16mm 18mm } para o miolo e
  @page cheia { size: A4; margin: 0 } com `page: cheia` na capa e nas aberturas de
  parte, que ficam com 210 mm x 296 mm e recebem o respiro por padding interno.
  No page.pdf(): preferCSSPageSize true e margem zerada nos quatro lados. É o que
  permite às páginas escuras ocuparem a folha inteira sem moldura branca.
- page.pdf() com printBackground, tagged e outline ativos. Rodapé por
  displayHeaderFooter, em cor que funcione sobre fundo claro e escuro.
- Sem quebra de página dentro de figura, linha de tabela, bloco de destaque e
  bloco de código de até 40 linhas. Headings nunca órfãos no pé da página.
- Pré-renderize diagramas Mermaid em SVG: o PDF não executa script.

TRAVAS
O build precisa falhar, não avisar, quando: alguma <img> ficar com naturalWidth 0
depois do load; um arquivo declarado no manifesto não existir; um link entre
documentos não resolver. Ao final, imprima contagem de páginas, capítulos e
figuras. Não commite nada.

CONFERÊNCIA
Meça antes de afirmar que está certo. Confira a contagem de páginas e, se não
houver rasterizador de PDF disponível, leia os content streams do arquivo
(descomprima com zlib) para verificar que as páginas escuras cobrem 100% da folha
e que as demais mantêm o recuo das margens. Renderize em PNG, pelo próprio
Playwright, a capa, um capítulo com figura e tabela e a página com o bloco de
código mais largo da origem, e olhe cada uma.

O QUE NÃO ENTRA NO PDF
O arquivo vai para o leitor final sem passar por revisão. Nada de nota de
processo dentro dele: sem seção de decisões, pendências, limitações, TODO ou
comentário para o autor. O documento contém o texto da origem e nada além.
```

---

## Notas

Só o caminho da pasta muda entre documentos, e a paleta quando a marca for outra.
O prompt não manda escrever nada: as únicas páginas que ele gera — capa, ficha
técnica e sumário — saem do próprio material. Páginas de apoio, como orientação de
leitura ou glossário, são autoria: se o documento precisar delas, escreva-as como
arquivos da origem, onde passam por revisão humana antes de virar PDF.

O prompt carrega três erros que a geração comete sozinha e que ninguém vai pegar
sem revisão: a numeração de headings em duas passagens, as margens na chamada de
impressão em vez do `@page` — que impede capa sangrada e miolo com recuo no mesmo
documento — e a imagem quebrada, que desaparece do PDF sem erro nenhum.

Para um projeto novo, copiar `build.mjs` e `estilo.css` deste repositório e mandar
adaptar sai mais barato do que pedir tudo do zero: o que muda entre documentos é o
manifesto e as páginas autorais.

Antes de enviar a alguém de fora, revise as capturas de tela quanto a dados
pessoais e nomes de cliente. O PDF sai do seu controle depois de enviado.
