# 8. People

Duas funcionalidades que aplicam o conhecimento do WLC sobre a base de código a
decisões sobre pessoas. As duas seguem o mesmo desenho: uma lista do que já foi
produzido, e um assistente de três passos para produzir um item novo.

## Onboarding Dev

Planos de integração para desenvolvedores que chegam ao time, construídos a
partir do que a plataforma já sabe sobre os repositórios.

![Onboarding Dev](../assets/screenshots/onboarding-plano.png)

Cada plano aparece com o nome da pessoa, o cargo e a senioridade, os repositórios
vinculados, quem criou e a data. O selo à direita do nome indica o estado — no
exemplo, **Pronto**. A busca filtra por nome e **Novo Plano** inicia a criação.

O número de repositórios é um link: é por ele que se vê sobre qual parte da base
de código aquele plano foi construído.

### Criar um plano

**Novo Plano** abre um assistente de três passos.

**Passo 1 — Desenvolvedor.** Os dados de quem está chegando:

![Novo plano, passo 1](../assets/screenshots/novo-plano-1-desenvolvedor.png)

- **Nome completo**
- **Cargo / Função**
- **Nível de senioridade** — Junior (0–2 anos), Pleno (3–5 anos) ou Senior (5+ anos)

**Passo 2 — Assessment.** O perfil técnico, que orienta a profundidade do plano:

![Novo plano, passo 2](../assets/screenshots/novo-plano-2-assessment.png)

- **Principais tecnologias que domina** — campo livre
- **Experiência no domínio do projeto** — Nenhuma, Baixa, Média ou Alta
- **Experiência com ferramentas de IA para código** — Nenhuma, Básica (Copilot),
  Intermediária ou Avançada (Claude Code, Cursor)
- **Foco principal nos primeiros 90 dias** — Desenvolvimento de funcionalidades,
  Correção de bugs e estabilidade, Testes e qualidade, ou Infraestrutura e
  operações
- **Estilo de aprendizado preferido** — Programação em par, Documentação e
  leitura, Prático (mergulhar no código) ou Misto

**Passo 3 — Repositórios.** A seleção dos repositórios em que a pessoa vai
trabalhar nos primeiros 90 dias, com filtro por nome. São eles que definem qual
conhecimento acumulado entra no plano.

![Novo plano, passo 3](../assets/screenshots/novo-plano-3-repositorios.png)

O botão final é **Gerar Plano de 90 Dias**. A geração leva algum tempo: o plano
aparece na lista com o estado *Gerando* e passa a *Pronto* quando conclui.

## Job Description

Descrições de vaga geradas com base nas tecnologias e características reais dos
repositórios da organização.

![Job Description](../assets/screenshots/vaga.png)

Cada vaga traz o título, o estado (**Rascunho** ou publicada), a senioridade, o
regime de trabalho, os repositórios usados como base, o autor e a data. Uma vaga
em rascunho pode ser retomada e editada antes de ser finalizada.

### Criar uma vaga

**Nova Vaga** abre um assistente de três passos, no mesmo formato do Onboarding.

**Passo 1 — Vaga.** As informações da posição:

![Nova vaga, passo 1](../assets/screenshots/nova-vaga-1.png)

- **Título da vaga**
- **Nível de senioridade**
- **Modelo de trabalho** — presencial, híbrido ou remoto

**Passo 2 — Assessment.** O perfil desejado para a pessoa a contratar.

**Passo 3 — Repositórios.** Os repositórios que servem de base: é deles que saem
as tecnologias, as práticas e o contexto técnico que aparecem no texto final.

### A vaga gerada

Abrir uma vaga mostra a **Descrição da Vaga** pronta para uso, com botões de
exportação em **PDF** e **DOCX**.

![Descrição da vaga gerada](../assets/screenshots/vaga-gerada.png)

O documento começa por uma linha de resumo — senioridade, modelo de trabalho,
área e tamanho do time — seguida da apresentação da posição em prosa e das
seções de **Responsabilidades** e **Requisitos**.

O conteúdo não é genérico: as responsabilidades e os requisitos citam as
tecnologias efetivamente usadas nos repositórios selecionados e as práticas que a
análise identificou neles, como testes automatizados, revisão de código e
pipeline de CI/CD.
