# Documentação do WeLuvCode (WLC)

Documentação de uso do produto, com capturas de tela geradas automaticamente a
partir do ambiente real.

**A documentação em si está em [`docs/`](docs/README.md).** Para navegá-la como
uma central de ajuda, abra `site/index.html` no navegador; para entregá-la a um
cliente, gere o manual em PDF com `npm run pdf`. Este README trata de como as
capturas, o site e o manual são gerados e mantidos.

## Estrutura

```
docs/                    texto da documentação, uma seção por arquivo (comece pelo README.md)
assets/screenshots/      prints gerados pela captura automatizada
assets/screenshots/recortes/  recortes das telas longas (gerados)
capture/recortes.mjs     catálogo dos recortes, em coordenadas da captura
capture/recortar.mjs     gerador dos recortes
capture/verificar.mjs    procura capturas que saíram vazias
capture/analisar.mjs     medição usada pelo verificador e pela captura
assets/marca/            logo do produto, nas versões para fundo claro e escuro
capture/routes.mjs       catálogo das telas a capturar
capture/capture.mjs      script de captura (Playwright)
capture/manifest.json    resultado da última captura (gerado)
site/build.mjs           gerador da central de ajuda
site/index.html          central de ajuda navegável (gerado)
pdf/estrutura.mjs        ordem, numeração e recorte por perfil do manual em PDF
pdf/conteudo/            páginas de apoio do manual (orientação de leitura, apêndices)
pdf/build.mjs            gerador do manual em PDF
```

## Central de ajuda

`site/index.html` reúne toda a documentação em uma página navegável, com menu
lateral, busca e navegação entre seções. É um arquivo único: abre com duplo
clique, sem servidor.

Depois de editar qualquer arquivo em `docs/`, regenere:

```bash
npm run site
```

O conteúdo vem inteiramente de `docs/`, então o site nunca diverge dos arquivos
markdown — não edite `site/index.html` à mão, as alterações se perdem na próxima
geração. As imagens são referenciadas por caminho relativo a `assets/`, então o
arquivo precisa continuar dentro do repositório para os prints aparecerem.

## Recortes das telas longas

Telas que rolam muito não cabem em uma figura legível: reduzidas à altura de uma
página, ficam estreitas demais para se ler. Essas capturas entram na documentação
como vários recortes, cada um com a largura completa e posicionado junto do
trecho que o explica.

```bash
node capture/recortar.mjs
```

O catálogo está em `capture/recortes.mjs`, em coordenadas da captura original. O
`x` inicial padrão corta a barra lateral, que se repete em todas as telas; use
`x: 0` quando ela for o assunto. O script informa a altura e a densidade que cada recorte terá no PDF, e avisa
quando algum passa de 100 mm de altura ou fica abaixo de 200 dpi.

Duas coisas a observar ao definir um recorte novo:

- **Corte nas faixas de separação entre blocos**, não no meio de um cartão. O
  botão flutuante de conversa fica fixo no canto inferior direito e aparece no pé
  de cada captura: recortes que alcançam a base da imagem devem parar antes dele.
- **Não recorte áreas estreitas.** O recorte é esticado até os 174 mm da coluna,
  então um pedaço de 250 px de largura chega ao PDF com cerca de 36 dpi. Os
  recortes de largura cheia ficam em torno de 174 dpi.

Depois de refazer as capturas com `npm run capture`, rode o recortador de novo:
um recorte com coordenadas antigas mostra a parte errada da tela sem que nada
acuse erro.

## Manual em PDF

Para entregar a documentação a quem não tem acesso à central de ajuda, há um
manual em PDF montado a partir dos mesmos arquivos de `docs/`:

```bash
npm run pdf
```

A saída fica em `pdf/WeLuvCode-Manual-do-Usuario.pdf`, junto do `pdf/manual.html`
intermediário — útil para conferir o resultado no navegador antes de imprimir.
Ambos são gerados e estão no `.gitignore`.

A marca aparece na capa, na ficha técnica e no pé de cada abertura de parte. Os
arquivos em `assets/marca/` vieram de `wlc-portal/frontend/src/assets/`: a versão
para fundo escuro é a original, e a de fundo claro foi reduzida para 900 px de
largura, suficiente para impressão no tamanho em que é usada. Se a marca do
produto mudar, substitua os dois arquivos e regere.

O manual é destinado aos perfis **Administrador** e **Gestor**. A ordem de
leitura, a numeração dos capítulos e o recorte por perfil estão declarados em
`pdf/estrutura.mjs`; o texto continua vindo de `docs/`, então editar um arquivo
lá e regerar basta. As únicas páginas autorais do manual — orientação de leitura,
apêndice de perfis e glossário — ficam em `pdf/conteudo/`.

Duas decisões registradas ali, que valem revisitar antes de cada entrega:

- `EXCLUIDOS` lista os arquivos que **não** vão para o cliente. Hoje contém
  `m2-11-super-admin.md`, por ser seção restrita à equipe Duranium. O gerador
  remove também as linhas de tabela e os links que apontam para esses arquivos.
- `docs/m1-03-metricas.md` é dividido em dois lugares: a leitura do Score fica no
  capítulo 2 e a mecânica detalhada vai para o Apêndice A. O recorte é por título
  de seção, e o build falha se um título declarado no manifesto deixar de existir
  no markdown.

As margens da página são definidas no `@page` de `pdf/estilo.css`, e não na
chamada de impressão — que roda com margens zeradas e `preferCSSPageSize`. É o
que permite à capa e às aberturas de parte usarem a página nomeada `cheia`, com
margem zero, e ocuparem a folha inteira em navy. Mexer nas margens do build
sem mexer no `@page` faz o miolo perder o recuo.

Para reaproveitar esta diagramação em outro conjunto de arquivos Markdown, há um
prompt pronto em [`pdf/prompt-diagramacao-pdf.md`](pdf/prompt-diagramacao-pdf.md).
Na prática, copiar `build.mjs` e `estilo.css` daqui e adaptar o manifesto sai mais
barato do que pedir tudo do zero.

O build também aborta se alguma captura não carregar, para que nenhum PDF saia
com figura faltando, e avisa quando uma figura passa de 120 mm de altura — sinal
de que a captura pede recorte. Como o arquivo circula fora do nosso controle depois de
enviado, revise as capturas antes de gerar — veja a seção sobre dados pessoais
mais abaixo.

## Gerar as capturas

Pré-requisito: Node.js instalado. Na primeira vez, instale as dependências e o
navegador usado pelo Playwright:

```bash
npm install
```

Informe as credenciais de acesso ao WLC **por variável de ambiente**. Nunca
comite credenciais nem as cole em conversas ou tickets. Para não deixar a senha
no histórico do shell, leia-a de forma interativa:

```bash
export WLC_ORG='Duranium Demo' && export WLC_EMAIL='seu.email@duranium.io' && read -rs "WLC_PASSWORD?Senha do WLC: " && export WLC_PASSWORD
```

`WLC_ORG` é obrigatória para a captura autenticada e funciona como trava de
segurança: se a organização exibida na interface não for exatamente essa, o
script troca de organização e, não conseguindo, aborta sem gravar nenhum print.
Isso evita publicar telas com o nome de uma organização cliente.

Rode a captura:

```bash
npm run capture
```

Ao final o script informa quantas telas foram capturadas, quais rotas
redirecionaram e quais falharam, e grava `capture/manifest.json` com o
resultado detalhado.

### Telas que dependem de contexto e repositório

Dez telas são parametrizadas por um contexto e um repositório: as de
`contexto-*` e `repo-*`. O script tenta descobrir os ids sozinho e, se não
conseguir, pula essas telas em vez de gravar prints de "página não encontrada".
Para fixá-los:

```bash
export WLC_CONTEXT_ID='<id>' && export WLC_REPO_ID='<id>'
```

Os ids estão na URL do produto ao abrir um contexto (`/contexts/<id>/home`) ou um
repositório — substitua `<id>` pelo valor, sem os sinais de menor e maior. O
script recusa qualquer coisa fora de letras, números, hífen e sublinhado, para
que o exemplo colado por engano falhe de imediato em vez de gerar prints de uma
rota inexistente.

**Escolha um contexto e um repositório com dados**: insights já gerados,
documentação analisada, dependências apuradas. Um id válido mas de um
repositório sem análise grava uma tela em branco — e isso o script não tem como
distinguir de uma captura legítima, só o `verificar.mjs` depois.

A captura termina medindo os próprios prints e avisa, em bloco destacado, os que
parecem vazios. Para revisar o conjunto inteiro a qualquer momento:

```bash
node capture/verificar.mjs
```

A medição olha quanto de cada imagem é uma única faixa de cor sólida. É uma
heurística: listas curtas e formulários deixam bastante espaço branco sem que
haja problema algum.

### Resolução das capturas

A captura roda com `WLC_ESCALA=2`, que dobra os pixels sem mudar o
enquadramento. Isso é o que faz a documentação imprimir nítida: na largura de
coluna do PDF, uma captura de 1440 px rende 210 dpi e uma de 2880 px rende os 300
dpi que a impressão pede. As capturas versionadas antes dessa mudança foram
feitas em escala 1 — o recortador e o build do PDF avisam quais figuras estão
abaixo de 200 dpi.

Densidade maior não muda nada no catálogo de recortes: as coordenadas continuam
declaradas na escala 1x e são multiplicadas na hora de cortar. O recortador
também reduz o que passar de 300 dpi, para o PDF não crescer sem ganho no papel.

### Opções

| Comando | Efeito |
| --- | --- |
| `node capture/capture.mjs --only=admin` | captura apenas uma seção (aceita lista: `--only=admin,workspace`) |
| `node capture/capture.mjs --slug=login` | captura apenas uma tela (aceita lista separada por vírgula) |
| `node capture/capture.mjs --headed` | abre o navegador visível, útil para depurar |
| `node capture/capture.mjs --relogin` | descarta a sessão salva e autentica de novo |

### Variáveis de ambiente

| Variável | Padrão | Uso |
| --- | --- | --- |
| `WLC_ORG` | — | organização a documentar; trava de segurança (obrigatória) |
| `WLC_EMAIL` | — | e-mail de acesso (obrigatória) |
| `WLC_PASSWORD` | — | senha de acesso (obrigatória) |
| `WLC_BASE_URL` | `https://app.weluvcode.ai` | ambiente a capturar |
| `WLC_ESCALA` | `2` | densidade da captura; 2 dobra os pixels no mesmo enquadramento |
| `WLC_ESPERA_MS` | `1500` | espera extra após a tela terminar de carregar |
| `WLC_TIMEOUT_CONTEUDO_MS` | `20000` | tempo máximo aguardando o fim do carregamento |
| `WLC_OCULTAR` | — | seletores CSS a esconder nos prints, separados por vírgula |
| `WLC_BORRAR` | — | seletores CSS extras a borrar nas telas com `redact` |
| `WLC_CONTEXT_ID` | — | fixa o contexto usado nas telas parametrizadas |
| `WLC_REPO_ID` | — | fixa o repositório usado nas telas parametrizadas |

A sessão autenticada fica em `capture/.auth/state.json`, que está no
`.gitignore` e não deve ser versionado.

## Dados pessoais e LGPD

As telas que exibem e-mails de usuários, nomes de organizações ou chaves de API
estão marcadas com `redact: true` em `capture/routes.mjs`; nelas o script borra
a célula inteira que contém um endereço de e-mail, cobrindo nome e endereço
juntos, antes de gravar o print. Isso é uma
proteção automática, não uma garantia: **revise os prints dessas telas antes de
versionar**. Em caso de dúvida sobre publicar uma tela, trate como dado de
cliente e consulte o time responsável.

## Telas fora da captura automática

Algumas rotas não são capturáveis sem estado específico (callbacks de OAuth,
links com token, redirecionamentos). Elas estão listadas em
`ROTAS_EXCLUIDAS` no `capture/routes.mjs`, cada uma com o motivo, para que a
ausência delas na documentação seja explícita e não passe por esquecimento.
