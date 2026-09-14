# Análises e Insights IA

## A aba de Insights está vazia. É erro?

Não. **Nada é gerado sozinho**: a aba começa com "Nenhum insight gerado ainda" e
espera o botão **Gerar Insights**. Vale tanto para o
[contexto](m1-05-contexto.md) quanto para o [repositório](m1-06-repositorio.md).

## Quanto tempo leva para gerar um insight?

Cerca de um minuto. A tela mostra "Gerando insights…" enquanto isso, e você pode
sair da tela e voltar depois.

## Duas pessoas clicaram em Gerar ao mesmo tempo. Vai gerar duas vezes?

Não. Enquanto uma geração está em curso, quem abrir a aba vê o mesmo estado de
processamento, e um segundo pedido não dispara uma segunda geração.

## Regerar devolve o texto anterior do cache?

Não. **Regerar sempre chama o modelo de novo.** O diagnóstico anterior continua
na tela até o novo ficar pronto, e o cabeçalho passa a exibir **Última execução**
com data e hora.

## Quando vale a pena regerar?

O diagnóstico é a leitura de um instante, com a data no cabeçalho. Depois de uma
mudança relevante — repositório novo no contexto, análise recém-concluída,
briefing atualizado — vale regerar antes de levar o texto para uma reunião.

## As notas dos Insights IA não batem com o Score. Qual vale?

O Score. As três dimensões do Insight de repositório — Saúde & Qualidade,
Produtividade & Velocidade, Estratégia & Pessoas — **não são** as quatro
dimensões do Score: são uma leitura do modelo sobre os mesmos dados, em outro
recorte. Quando as duas divergirem, o número que vale para acompanhamento é o do
Score.

## Como melhoro a qualidade dos insights?

Preenchendo o que alimenta o modelo além das métricas:

- o **briefing do contexto**, em [Contextos](m2-03-contextos.md) — sem ele o
  diagnóstico sai tecnicamente correto e cego quanto ao negócio;
- o cadastro do workspace em [Geral](m2-01-geral.md) — nome, segmento e descrição
  mudam o tom da recomendação para o setor em que a organização opera.

## Por que uma frente da documentação está "Fora de escopo"?

Porque ela não se aplica àquele repositório, e o produto prefere dizer isso a
entregar um documento vazio. A decisão é **automática e anterior à análise**,
baseada em sinais calculados a partir do código — inventário de arquivos,
tecnologias, dependências declaradas, registro de APIs — e não em julgamento do
modelo de IA. Os critérios de cada frente estão em
[Repositório](m1-06-repositorio.md).

## Meu repositório é pequeno e quase tudo está fora de escopo.

É a regra geral: menos de 100 linhas de código **e** menos de 5 arquivos coloca
todas as frentes fora de escopo, exceto a Visão Geral. As duas condições precisam
ser verdadeiras ao mesmo tempo.

## O repositório ganhou endpoints de API. Como faço a análise voltar ao escopo?

Use **Reavaliar escopo**, no menu de ações da frente. O critério é avaliado sobre
o estado do repositório naquele momento, então um repositório que ganhou seu
primeiro endpoint, ou que passou a declarar dependências, muda de situação na
reavaliação.

## Só temos contratos de API, sem código. Design de APIs fica de fora?

Não. Design de APIs não exige endpoints implementados: arquivos `.wsdl`, `.proto`
ou especificações OpenAPI já colocam a frente em escopo.

## A documentação gerada fica desatualizada conforme o código muda?

Não precisa. Há dois caminhos de atualização: **automático**, pela esteira de
CI/CD — cada execução do pipeline dispara uma nova análise, usando uma chave
criada em [API Keys](m2-04-api-keys.md) — e **manual**, pelo menu da tela, com
**Gerar novamente** por frente ou **Gerar todas novamente** para o conjunto.

## Quanto tempo leva reprocessar todas as frentes?

Alguns minutos, e consome recursos do motor — por isso **Gerar todas novamente**
pede confirmação antes de disparar.

## Dá para exportar a documentação gerada?

Sim: **Baixar PDF** e **Baixar Markdown** por frente, ou **Baixar tudo em PDF** e
**Baixar tudo em Markdown** para o conjunto.

## Por que algumas análises têm layout e profundidade diferentes das outras?

Porque a frente de análise semântica está passando por uma reformulação ampla,
da coleta ao processamento e à apresentação. A diferença é temporária e será
uniformizada conforme as frentes migrarem para o novo formato.

## O que é a frente "Conformidade CNPJ 2026"?

É a análise da adaptação do código ao novo formato alfanumérico do CNPJ. Ela
entra em escopo quando o repositório declara alguma biblioteca conhecida de
validação de CPF/CNPJ; caso contrário, aparece como fora de escopo com a
mensagem correspondente.

## O que a plataforma nunca faz quando falta dado?

Inventar. Quando falta base, a seção é omitida, o campo fica vazio com o motivo
explicado, e o relatório sai mais curto — nunca com número estimado.
