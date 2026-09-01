# Documentação do WeLuvCode (WLC)

Documentação de uso do produto, com capturas de tela geradas automaticamente a
partir do ambiente real.

**A documentação em si está em [`docs/`](docs/README.md).** Para navegá-la como
uma central de ajuda, abra `site/index.html` no navegador. Este README trata de
como as capturas e o site são gerados e mantidos.

## Estrutura

```
docs/                    texto da documentação, uma seção por arquivo (comece pelo README.md)
assets/screenshots/      prints gerados pela captura automatizada
capture/routes.mjs       catálogo das telas a capturar
capture/capture.mjs      script de captura (Playwright)
capture/manifest.json    resultado da última captura (gerado)
site/build.mjs           gerador da central de ajuda
site/index.html          central de ajuda navegável (gerado)
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
