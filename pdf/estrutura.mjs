/**
 * Estrutura do manual em PDF.
 *
 * A fonte do texto continua sendo docs/. Aqui se define apenas a ordem de
 * leitura, a numeração e o recorte por perfil — nada de conteúdo novo, exceto
 * as páginas de apoio em pdf/conteudo/.
 */

/** Seções de docs/m1-03-metricas.md que ficam no capítulo de leitura do Score. */
const METRICAS_LEITURA = [
  'O que o Score responde — e o que não responde',
  'A cascata',
  'As quatro dimensões e seus pesos',
  'Salvaguardas contra leitura errada',
  'Por que uma dimensão crítica derruba o Score',
  'O estágio muda a conclusão, não o cálculo',
  'O que a plataforma não mede',
  'Como usar o painel na rotina',
]

/** Seções do mesmo arquivo que formam o apêndice de referência. */
const METRICAS_REFERENCIA = [
  'Como o cálculo funciona',
  'Onde ler os indicadores no produto',
  'Os indicadores, um a um',
  'DORA e SPACE',
]

export const PERFIS = {
  ambos: 'Gestor e Admin',
  gestor: 'Gestor',
  admin: 'Admin',
}

/** Arquivos de docs/ deliberadamente fora do manual do cliente. */
export const EXCLUIDOS = {
  'm2-11-super-admin.md': 'seção restrita à equipe Duranium',
}

export const PARTES = [
  {
    id: 'parte-1',
    rotulo: 'Parte I',
    titulo: 'Conceitos',
    resumo:
      'O que a plataforma faz, como o Score é lido e como se entra no produto. '
      + 'Leitura comum aos dois perfis.',
    capitulos: [
      { fonte: 'm1-01-visao-geral.md', titulo: 'Visão geral do WeLuvCode', perfil: 'ambos' },
      {
        fonte: 'm1-03-metricas.md',
        titulo: 'Como ler o Score de Engenharia',
        perfil: 'ambos',
        secoes: METRICAS_LEITURA,
        remissao:
          'O cálculo passo a passo, as faixas de status da nota, os indicadores um a um '
          + 'e a correspondência com DORA e SPACE estão no Apêndice A.',
      },
      { fonte: 'm1-02-acesso.md', titulo: 'Acesso ao produto', perfil: 'ambos' },
    ],
  },
  {
    id: 'parte-2',
    rotulo: 'Parte II',
    titulo: 'Uso no dia a dia',
    resumo:
      'As telas que respondem "como está a engenharia agora" e as ferramentas de '
      + 'apoio. Escrita para quem acompanha o resultado, não para quem configura.',
    capitulos: [
      { fonte: 'm1-04-workspace.md', titulo: 'Workspace', perfil: 'gestor' },
      { fonte: 'm1-05-contexto.md', titulo: 'Contexto', perfil: 'gestor' },
      { fonte: 'm1-06-repositorio.md', titulo: 'Repositório', perfil: 'gestor' },
      { fonte: 'm1-07-ferramentas.md', titulo: 'Ferramentas: Navigate e Dependências', perfil: 'gestor' },
      { fonte: 'm1-08-people.md', titulo: 'People: Onboarding Dev e Job Description', perfil: 'gestor' },
      { fonte: 'm1-09-perfil.md', titulo: 'Perfil e conta', perfil: 'ambos' },
    ],
  },
  {
    id: 'parte-3',
    rotulo: 'Parte III',
    titulo: 'Administração',
    resumo:
      'A configuração que alimenta tudo que a Parte II exibe. Na ordem em que '
      + 'um workspace novo costuma ser montado.',
    capitulos: [
      { fonte: 'm2-00-visao-admin.md', titulo: 'Painel Admin e roteiro de implantação', perfil: 'admin' },
      { fonte: 'm2-01-geral.md', titulo: 'Dados do workspace', perfil: 'admin' },
      { fonte: 'm2-02-repositorios.md', titulo: 'Repositórios e conexão com o GitHub', perfil: 'admin' },
      { fonte: 'm2-03-contextos.md', titulo: 'Contextos e briefing', perfil: 'admin' },
      { fonte: 'm2-05-usuarios.md', titulo: 'Usuários', perfil: 'admin' },
      { fonte: 'm2-06-grupos.md', titulo: 'Grupos de usuários', perfil: 'admin' },
      { fonte: 'm2-08-permissoes.md', titulo: 'Permissões', perfil: 'admin' },
      { fonte: 'm2-07-notificacoes.md', titulo: 'Notificações e digest semanal', perfil: 'admin' },
      { fonte: 'm2-04-api-keys.md', titulo: 'API Keys e integração com CI/CD', perfil: 'admin' },
      { fonte: 'm2-09-monitoramento.md', titulo: 'Monitoramento da coleta', perfil: 'admin' },
      { fonte: 'm2-10-sso.md', titulo: 'SSO SAML', perfil: 'admin' },
    ],
  },
  {
    id: 'parte-4',
    rotulo: 'Parte IV',
    titulo: 'Perguntas frequentes',
    resumo:
      'Respostas curtas para as dúvidas mais comuns, cada uma apontando para o '
      + 'capítulo que trata do assunto em detalhe.',
    capitulos: [
      { fonte: 'm3-01-faq-acesso.md', titulo: 'Perguntas frequentes: acesso e navegação', perfil: 'ambos' },
      { fonte: 'm3-02-faq-score.md', titulo: 'Perguntas frequentes: Score e métricas', perfil: 'ambos' },
      { fonte: 'm3-03-faq-analises.md', titulo: 'Perguntas frequentes: análises e Insights IA', perfil: 'ambos' },
      { fonte: 'm3-04-faq-ferramentas.md', titulo: 'Perguntas frequentes: ferramentas e People', perfil: 'ambos' },
      { fonte: 'm3-05-faq-admin.md', titulo: 'Perguntas frequentes: configuração e administração', perfil: 'admin' },
    ],
  },
]

export const APENDICES = [
  {
    letra: 'A',
    fonte: 'm1-03-metricas.md',
    titulo: 'Referência de métricas',
    perfil: 'ambos',
    secoes: METRICAS_REFERENCIA,
  },
  {
    letra: 'B',
    conteudo: 'apendice-b-perfis.md',
    titulo: 'Perfis, grupos e permissões',
    perfil: 'admin',
  },
  {
    letra: 'C',
    conteudo: 'apendice-c-glossario.md',
    titulo: 'Glossário',
    perfil: 'ambos',
  },
]
