/**
 * Catálogo de telas do WLC a capturar.
 *
 * Extraído das rotas declaradas em wlc-portal/frontend/src/App.tsx.
 *
 * Campos:
 *   slug     nome do arquivo PNG gerado (sem extensão)
 *   path     caminho a navegar; {contextId} e {repoId} são resolvidos em runtime
 *   titulo   nome da tela na documentação
 *   secao    agrupamento no documento final
 *   auth     'publica' captura sem sessão; 'privada' exige login
 *   redact   true aplica blur em textos que pareçam e-mail antes do print
 *   altura   amplia a janela do navegador; use em telas com rolagem interna
 *   passos   interações a executar antes do print (telas sem rota própria)
 *   nota     observação levada para a documentação
 */

export const SECOES = {
  autenticacao: 'Acesso e autenticação',
  onboarding: 'Onboarding',
  workspace: 'Workspace',
  contexto: 'Contexto',
  repositorio: 'Repositório',
  perfil: 'Perfil do usuário',
  admin: 'Administração',
}

export const ROTAS = [
  // --- Acesso e autenticação (capturáveis sem sessão) ---
  { slug: 'login', path: '/login', titulo: 'Login', secao: 'autenticacao', auth: 'publica' },
  { slug: 'esqueci-senha', path: '/forgot-password', titulo: 'Esqueci minha senha', secao: 'autenticacao', auth: 'publica' },
  { slug: 'link-expirado', path: '/reset-password', titulo: 'Link de redefinição inválido ou expirado', secao: 'autenticacao', auth: 'publica',
    nota: 'A tela de redefinição em si exige token válido, recebido por e-mail. Sem token o produto exibe este estado de erro, que também vale documentar.' },

  // --- Onboarding ---
  { slug: 'onboarding-plano', path: '/onboarding-plan', titulo: 'Plano de onboarding de dev', secao: 'onboarding', auth: 'privada',
    nota: 'Exige a permissão workspace.onboarding-dev.' },

  // --- Workspace ---
  { slug: 'repositorios', path: '/repositories', titulo: 'Repositórios', secao: 'workspace', auth: 'privada',
    nota: 'Exige a permissão workspace.overview.' },
  { slug: 'visao-geral', path: '/overview', titulo: 'Visão geral', secao: 'workspace', auth: 'privada', altura: 1250,
    nota: 'É a tela inicial: a raiz do produto (/) redireciona para cá. Capturada com janela alta porque a rolagem é interna ao conteúdo.' },
  { slug: 'contextos', path: '/contexts', titulo: 'Lista de contextos', secao: 'workspace', auth: 'privada' },
  { slug: 'navigate', path: '/navigate', titulo: 'Navigate', secao: 'workspace', auth: 'privada',
    nota: 'Exige a feature flag navigate ativa.' },
  { slug: 'analise-em-progresso', path: '/analysis-progress', titulo: 'Análise em andamento', secao: 'workspace', auth: 'privada' },
  { slug: 'vaga', path: '/job-opening', titulo: 'Descrição de vaga', secao: 'workspace', auth: 'privada',
    nota: 'Exige a permissão workspace.job-description.' },

  // --- Contexto (parametrizadas) ---
  { slug: 'contexto-home', path: '/contexts/{contextId}/home', titulo: 'Home do contexto', secao: 'contexto', auth: 'privada',
    nota: 'Exige a feature flag new_home ativa.' },
  { slug: 'contexto-repositorios', path: '/contexts/{contextId}/repos', titulo: 'Repositórios do contexto', secao: 'contexto', auth: 'privada' },
  { slug: 'contexto-navigate', path: '/contexts/{contextId}/navigate', titulo: 'Navigate no contexto', secao: 'contexto', auth: 'privada',
    nota: 'Exige a feature flag navigate ativa.' },

  // --- Repositório (parametrizadas) ---
  { slug: 'repo-home', path: '/contexts/{contextId}/repo/{repoId}/home', titulo: 'Home do repositório', secao: 'repositorio', auth: 'privada',
    nota: 'Exige a feature flag new_home ativa.' },
  { slug: 'repo-metricas', path: '/contexts/{contextId}/repo/{repoId}/home?tab=metricas', titulo: 'Métricas detalhadas do repositório', secao: 'repositorio', auth: 'privada', altura: 1500,
    nota: 'Aba da home do repositório, alcançada pelo botão "Ver métricas detalhadas".' },
  { slug: 'repo-documentacao', path: '/contexts/{contextId}/repo/{repoId}/documentation', titulo: 'Documentação gerada do repositório', secao: 'repositorio', auth: 'privada' },

  // --- People: telas sem rota própria, alcançadas por interação ---
  { slug: 'novo-plano-1-desenvolvedor', path: '/onboarding-plan', titulo: 'Novo plano — passo 1, Desenvolvedor', secao: 'people', auth: 'privada',
    passos: [{ clicar: 'Novo Plano' }] },
  { slug: 'novo-plano-2-assessment', path: '/onboarding-plan', titulo: 'Novo plano — passo 2, Assessment', secao: 'people', auth: 'privada',
    passos: [
      { clicar: 'Novo Plano' },
      { preencher: ['Ex: Ana Silva', 'Ana Silva'] },
      { preencher: ['Ex: Engenheiro Backend', 'Engenheira Backend'] },
      { escolher: [0, 'Pleno (3-5 anos)'] },
      { clicar: 'Próximo' },
    ] },
  { slug: 'novo-plano-3-repositorios', path: '/onboarding-plan', titulo: 'Novo plano — passo 3, Repositórios', secao: 'people', auth: 'privada',
    passos: [
      { clicar: 'Novo Plano' },
      { preencher: ['Ex: Ana Silva', 'Ana Silva'] },
      { preencher: ['Ex: Engenheiro Backend', 'Engenheira Backend'] },
      { escolher: [0, 'Pleno (3-5 anos)'] },
      { clicar: 'Próximo' },
      { preencher: ['Ex: Python, TypeScript, React, FastAPI', 'Python, FastAPI'] },
      { escolher: [0, 'Baixa'] },
      { escolher: [1, 'Básica (Copilot)'] },
      { escolher: [2, 'Desenvolvimento de funcionalidades'] },
      { escolher: [3, 'Misto'] },
      { clicar: 'Próximo' },
    ] },
  { slug: 'nova-vaga-1', path: '/job-opening', titulo: 'Nova vaga — passo 1', secao: 'people', auth: 'privada',
    passos: [{ clicar: 'Nova Vaga' }] },
  { slug: 'vaga-gerada', path: '/job-opening', titulo: 'Descrição da vaga gerada', secao: 'people', auth: 'privada', altura: 1800,
    passos: [{ clicar: 'Engenheiro' }] },

  // --- Navigate: painel flutuante e diálogo do Panorama ---
  { slug: 'navigate-painel', path: '/repositories', titulo: 'Painel do Navigate', secao: 'workspace', auth: 'privada',
    passos: [{ clicarAria: 'Perguntar ao Navigate' }],
    nota: 'O painel abre sobre qualquer tela; aqui, sobre a lista de repositórios.' },
  { slug: 'navigate-panorama', path: '/navigate', titulo: 'Panorama de Saúde — seleção', secao: 'workspace', auth: 'privada',
    passos: [{ clicar: 'Panorama de Saúde' }],
    nota: 'Diálogo de escolha de contextos e período; não gera o relatório.' },

  // --- Perfil ---
  { slug: 'perfil', path: '/user-profile', titulo: 'Perfil do usuário', secao: 'perfil', auth: 'privada', redact: true },

  // --- Administração ---
  { slug: 'admin-geral', path: '/admin/general', titulo: 'Administração — Geral', secao: 'admin', auth: 'privada' },
  { slug: 'admin-usuarios', path: '/admin/users', titulo: 'Administração — Usuários', secao: 'admin', auth: 'privada', redact: true },
  { slug: 'admin-grupos', path: '/admin/user-groups', titulo: 'Administração — Grupos de usuários', secao: 'admin', auth: 'privada', redact: true },
  { slug: 'admin-repositorios', path: '/admin/repositories', titulo: 'Administração — Repositórios', secao: 'admin', auth: 'privada' },
  { slug: 'admin-contextos', path: '/admin/contexts', titulo: 'Administração — Contextos', secao: 'admin', auth: 'privada' },
  { slug: 'admin-api-keys', path: '/admin/api-keys', titulo: 'Administração — Chaves de API', secao: 'admin', auth: 'privada', redact: true,
    nota: 'Conferir se algum valor de chave fica visível no print antes de versionar.' },
  { slug: 'admin-empresas', path: '/admin/companies', titulo: 'Administração — Empresas', secao: 'admin', auth: 'privada', redact: true,
    nota: 'Exibe nomes de organizações clientes; revisar antes de publicar.' },
  { slug: 'admin-notificacoes', path: '/admin/notifications', titulo: 'Administração — Notificações', secao: 'admin', auth: 'privada',
    nota: 'Rota presente em produção e ausente do código local clonado em julho de 2026.' },
  { slug: 'admin-permissoes', path: '/admin/permissions', titulo: 'Administração — Permissões', secao: 'admin', auth: 'privada',
    nota: 'Rota presente em produção e ausente do código local clonado em julho de 2026.' },
  { slug: 'admin-monitoramento', path: '/admin/monitoring', titulo: 'Administração — Monitoramento', secao: 'admin', auth: 'privada' },
  { slug: 'admin-sso', path: '/admin/sso', titulo: 'Administração — SSO', secao: 'admin', auth: 'privada', redact: true },

]

/**
 * Rotas deliberadamente fora da captura automática, com o motivo.
 * Mantidas aqui para que a ausência delas na documentação seja explícita.
 */
export const ROTAS_EXCLUIDAS = [
  { path: '/sso/callback', motivo: 'callback de OAuth, sem interface própria' },
  { path: '/auth/github/callback', motivo: 'callback de OAuth, sem interface própria' },
  { path: '/github/callback', motivo: 'callback de OAuth, sem interface própria' },
  { path: '/auth/invite/:token', motivo: 'exige token de convite válido, gerado por e-mail' },
  { path: '/set-new-password', motivo: 'sem token válido redireciona para /login; capturar manualmente a partir de um link real de e-mail' },
  { path: '/activate-user', motivo: 'sem token válido renderiza tela vazia; capturar manualmente a partir de um convite real' },
  { path: '/navigate/share/:token', motivo: 'exige token de compartilhamento válido' },
  { path: '/executive', motivo: 'redireciona para /repositories' },
  { path: '/contexts/:contextId/insights', motivo: 'redireciona para a home do contexto' },
  { path: '/contexts/:contextId/repo/:repoId/ai-insights', motivo: 'redireciona para a home do repositório' },
  { path: '/contexts/:contextId/repo/:repoId/dashboard', motivo: 'com a flag new_home ativa, redireciona para a home do repositório' },
  { path: '/admin/companies/:id', motivo: 'exige id de empresa; capturar manualmente se necessário' },
  { path: '/admin/companies/:id/orgs/:orgId/sso', motivo: 'exige ids de empresa e organização' },
  { path: '/admin/companies/:companyId/orgs/:orgId/feature-flags', motivo: 'exige ids de empresa e organização' },
  { path: '/admin/feature-flags/:orgId', motivo: 'exige id de organização' },
  { path: '/', motivo: 'redireciona para /overview; documentada como Visão geral' },
  { path: '/explorer', motivo: 'funcionalidade descontinuada' },
  { path: '/reports', motivo: 'tela exibe apenas "Em breve"; fora da documentação até entrar no ar' },
  { path: '/executive-summary', motivo: 'não utilizado hoje' },
  { path: '/onboarding', motivo: 'conta já onboardada é redirecionada para /repositories; exige conta recém-criada' },
  { path: '/onboarding-incomplete', motivo: 'conta já onboardada é redirecionada para /overview' },
  { path: '/admin/feature-flags', motivo: 'exige a permissão admin.feature-flags, ausente na conta usada na captura' },
  { path: '/admin/terms', motivo: 'exige a permissão admin.terms, ausente na conta usada na captura' },
]
