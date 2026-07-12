(function () {
  const W = 1280, H = 720;

  /* ── layout constants ── */
  const IY = 340;         // IdP Y center
  const IX = 560;         // IdP X center
  const IW = 200, IH = 80;

  // 3 Service Providers arranged around IdP
  const SP = [
    { id: 'sp1', label: 'App 1\n(SP1)', x: 80,  y: 120 },
    { id: 'sp2', label: 'App 2\n(SP2)', x: 80,  y: 480 },
    { id: 'sp3', label: 'App 3\n(SP3)', x: 980, y: 300 },
  ];
  const UX = 80, UY = 300, UW = 130, UH = 60;

  function box(id, x, y, w, h, text, color) {
    return { id, type: 'box', x, y, w, h, label: text, stroke: color };
  }
  function lbl(id, x, y, text, color) {
    return { id, type: 'label', x, y, label: text, style: `fill:${color || 'var(--muted)'}`, size: 12 };
  }
  function arr(id, x1, y1, x2, y2, text, color) {
    return [
      { id, type: 'arrow', x1, y1, x2, y2, color: color || 'var(--accent)' },
      { id: id + '_l', type: 'label', x: (x1 + x2) / 2, y: (y1 + y2) / 2 - 10, label: text, style: `fill:${color || 'var(--accent)'}`, size: 11 },
    ];
  }

  const elements = [
    // User
    box('user', UX - UW / 2, UY - UH / 2, UW, UH, '👤 Usuário', 'var(--accent)'),
    // IdP
    box('idp', IX - IW / 2, IY - IH / 2, IW, IH, '🏛️ Identity Provider\n(IdP)', 'var(--good)'),
    lbl('idp_sub', IX, IY + IH / 2 + 18, 'ex: Okta, Keycloak, Azure AD', 'var(--muted)'),
    // SP boxes
    ...SP.map(s => box(s.id, s.x, s.y, 150, 60, s.label, 'var(--accent-2)')),

    // ── arrows: user ↔ SP1 (initial access attempt) ──
    ...arr('a_u_sp1', UX + UW / 2, UY - 20, SP[0].x, SP[0].y + 30, '① Acessa App1', 'var(--warn)'),
    ...arr('a_sp1_idp', SP[0].x + 150, SP[0].y + 30, IX - IW / 2, IY - 20, '② AuthnRequest\n(redirect)', 'var(--hot)'),
    ...arr('a_idp_user_login', IX - IW / 2, IY, UX + UW / 2, UY + 10, '③ Tela de login', 'var(--muted)'),
    ...arr('a_user_creds', UX + UW / 2, UY + 10, IX - IW / 2, IY + 10, '④ Credenciais', 'var(--good)'),

    // IdP → SP1 (assertion)
    ...arr('a_idp_sp1', IX - IW / 2, IY - 30, SP[0].x + 150, SP[0].y + 20, '⑤ Assertion/Token', 'var(--good)'),

    // SSO session cookie badge
    box('sso_cookie', IX - IW / 2 - 140, IY + IH / 2 + 20, 130, 50, '🍪 SSO Session\nCookie (IdP)', 'var(--warn)'),

    // User → SP2
    ...arr('a_u_sp2', UX + UW / 2, UY + 20, SP[1].x, SP[1].y + 20, '⑥ Acessa App2', 'var(--warn)'),
    ...arr('a_sp2_idp', SP[1].x + 150, SP[1].y + 20, IX - IW / 2, IY + 20, '⑦ AuthnRequest', 'var(--hot)'),
    ...arr('a_idp_sp2', IX - IW / 2, IY + 30, SP[1].x + 150, SP[1].y + 30, '⑧ Assertion\n(sem re-login!)', 'var(--good)'),

    // SP3 on right
    ...arr('a_u_sp3', UX + UW / 2, UY - 5, SP[2].x, SP[2].y + 30, '', 'transparent'),
    ...arr('a_idp_sp3', IX + IW / 2, IY, SP[2].x, SP[2].y + 30, '⑤b Token', 'var(--good)'),

    // Protocol comparison panel
    box('proto_bg', 780, 80, 460, 200, '', 'var(--panel)'),
    lbl('proto_title', 1010, 100, '📋 SAML 2.0 vs OIDC SSO', 'var(--ink)'),
    lbl('proto_saml_h', 830, 128, 'SAML 2.0', 'var(--hot)'),
    lbl('proto_oidc_h', 1060, 128, 'OIDC SSO', 'var(--good)'),
    lbl('ps1', 830, 152, 'XML assertions', 'var(--ink-soft)'),
    lbl('po1', 1060, 152, 'JWT / JSON', 'var(--ink-soft)'),
    lbl('ps2', 830, 172, 'HTTP-POST binding', 'var(--ink-soft)'),
    lbl('po2', 1060, 172, 'Authorization Code Flow', 'var(--ink-soft)'),
    lbl('ps3', 830, 192, 'Metadados XML', 'var(--ink-soft)'),
    lbl('po3', 1060, 192, 'Discovery doc (.well-known)', 'var(--ink-soft)'),
    lbl('ps4', 830, 212, 'Enterprise / legacy', 'var(--ink-soft)'),
    lbl('po4', 1060, 212, 'Cloud-native / moderno', 'var(--ink-soft)'),
    lbl('ps5', 830, 232, 'Verboso / complexo', 'var(--muted)'),
    lbl('po5', 1060, 232, 'Simples e leve ✓', 'var(--muted)'),
    lbl('ps6', 830, 252, 'SP-initiated / IdP-initiated', 'var(--ink-soft)'),
    lbl('po6', 1060, 252, 'SP-initiated padrão', 'var(--ink-soft)'),

    // SLO panel
    box('slo_bg', 780, 300, 460, 120, '', 'var(--panel)'),
    lbl('slo_title', 1010, 320, '🚪 Single Logout (SLO)', 'var(--hot)'),
    lbl('slo1', 830, 348, '1. User faz logout no SP ou IdP', 'var(--ink-soft)'),
    lbl('slo2', 830, 368, '2. IdP invalida SSO session cookie', 'var(--ink-soft)'),
    lbl('slo3', 830, 388, '3. IdP notifica todos os SPs ativos', 'var(--ink-soft)'),
    lbl('slo4', 830, 408, '4. SPs invalidam sessões locais', 'var(--ink-soft)'),

    // SP3 credential-fatigue panel (hidden initially)
    box('fatigue_bg', 780, 440, 460, 120, '', 'var(--panel)'),
    lbl('fatigue_title', 1010, 460, '😓 Credential Fatigue', 'var(--warn)'),
    lbl('fat1', 830, 488, 'Sem SSO: senha para cada app', 'var(--ink-soft)'),
    lbl('fat2', 830, 508, '→ reutilização de senhas', 'var(--hot)'),
    lbl('fat3', 830, 528, '→ superfície de ataque enorme', 'var(--hot)'),
    lbl('fat4', 830, 548, '→ fadiga e erros de usuário', 'var(--warn)'),

    // Legend
    lbl('leg_title', 200, 640, 'SP = Service Provider   IdP = Identity Provider', 'var(--muted)'),
  ];

  const steps = [
    {
      title: 'O Problema: N apps, N senhas',
      show: ['user', 'sp1', 'sp2', 'sp3', 'fatigue_bg', 'fatigue_title', 'fat1', 'fat2', 'fat3', 'fat4', 'leg_title'],
      balloon: {
        anchor: 'user', placement: 'right',
        text: 'Cada app tem login próprio. Usuário precisa lembrar N senhas → reutilização → risco.',
        deep: `<p>Esse problema tem nome: "credential fatigue". Quanto mais senhas um usuário precisa gerenciar, maior a chance de reutilizar a mesma senha em vários serviços — e isso transforma o vazamento de <em>um único</em> app fraco em risco para todos os outros que compartilham aquela senha.</p>
<div class="xp-bad"><strong>Sem SSO</strong>Usuário usa "Senha123!" em 12 apps diferentes. Um deles vaza o banco em texto puro → credential stuffing tenta a mesma senha nos outros 11.</div>
<div class="xp-good"><strong>Com SSO</strong>Usuário autentica uma vez no IdP, protegido com MFA. Nenhum dos SPs (apps) nunca vê ou guarda a senha.</div>` },
    },
    {
      title: 'SSO: 1 login, acesso múltiplo',
      show: ['user', 'sp1', 'sp2', 'sp3', 'idp', 'idp_sub', 'leg_title'],
      balloon: {
        anchor: 'idp', placement: 'left',
        text: 'Com SSO, o usuário autentica UMA vez no IdP e acessa todas as apps sem re-login.',
        why: 'O IdP emite "assertions" de identidade confiadas pelos Service Providers.',
        deep: `<p>O que torna isso possível não é mágica — é uma sessão de autenticação centralizada no IdP, mais um protocolo padronizado (SAML ou OIDC) que os Service Providers usam para pedir "confirme quem é esse usuário" e receber uma resposta assinada de volta.</p>
<div class="xp-example"><strong>Assertion simplificada</strong>{
  "iss": "https://sso.empresa.com",
  "sub": "alice@empresa.com",
  "aud": "app1.empresa.com",
  "authTime": "2026-07-12T10:00:00Z",
  "exp": "2026-07-12T10:15:00Z"
}</div>
<p>O SP nunca autentica o usuário diretamente — ele apenas confia na assinatura do IdP sobre essa assertion.</p>` },
    },
    {
      title: 'Os Atores: User, SP, IdP',
      show: ['user', 'sp1', 'sp2', 'sp3', 'idp', 'idp_sub', 'leg_title',
             'proto_bg', 'proto_title', 'proto_saml_h', 'proto_oidc_h',
             'ps1', 'po1', 'ps2', 'po2', 'ps3', 'po3', 'ps4', 'po4', 'ps5', 'po5', 'ps6', 'po6'],
      balloon: {
        anchor: 'idp', placement: 'left',
        text: '<strong>User</strong> = quem autentica. <strong>SP</strong> (Service Provider) = a app. <strong>IdP</strong> = servidor de identidade central.',
        deep: `<p>Vale notar a diferença entre a sessão do <strong>SP</strong> (local, específica daquele app) e a sessão do <strong>IdP</strong> (global, é ela que sustenta o SSO). Um logout no SP não necessariamente derruba a sessão do IdP — por isso existe o Single Logout como mecanismo separado.</p>
<div class="xp-example"><strong>Analogia</strong>IdP = balcão único de identidade de um condomínio (a portaria).
SP = cada apartamento — confia que quem a portaria deixou passar é quem diz ser, sem verificar documento de novo na porta.</div>` },
    },
    {
      title: '① SP-initiated: User acessa App1 sem sessão',
      show: ['user', 'sp1', 'sp2', 'sp3', 'idp', 'idp_sub', 'leg_title',
             'a_u_sp1', 'a_u_sp1_l'],
      highlight: ['sp1'],
      balloon: {
        anchor: 'sp1', placement: 'right',
        text: 'O usuário tenta acessar App1. SP1 verifica: não há sessão ativa.',
        why: 'SP checa um cookie de sessão local — se não existir, inicia o SP-initiated flow.',
        deep: `<p>SP-initiated é o fluxo mais comum na prática: o usuário começa navegando direto para a URL do app (não para o IdP), e é o próprio app que detecta a ausência de sessão e inicia o redirecionamento. O oposto, IdP-initiated, existe (o usuário começa num portal do IdP e clica num app), mas é menos usado e tem mais riscos de segurança sem um <code>RelayState</code> bem implementado.</p>
<div class="xp-example"><strong>Checagem local do SP</strong>if (!req.cookies['sp1_session']) {
  redirect(idpAuthUrl);
}</div>` },
    },
    {
      title: '② SP redireciona para IdP com AuthnRequest',
      show: ['user', 'sp1', 'sp2', 'sp3', 'idp', 'idp_sub', 'leg_title',
             'a_u_sp1', 'a_u_sp1_l', 'a_sp1_idp', 'a_sp1_idp_l'],
      highlight: ['sp1', 'idp'],
      balloon: {
        anchor: 'a_sp1_idp_l', placement: 'top',
        text: 'SP1 gera um `AuthnRequest` e redireciona o browser para o IdP com parâmetros como `entityID`, `RelayState` e `redirect_uri`.',
        deep: `<p>O <code>RelayState</code> merece atenção: é um valor opaco (geralmente a URL original que o usuário tentou acessar) que o SP anexa ao AuthnRequest e recebe de volta junto com a assertion — sem ele, depois do login o usuário cairia sempre na home, perdendo o destino original.</p>
<div class="xp-example"><strong>AuthnRequest (SAML, simplificado)</strong>GET https://sso.empresa.com/saml/login?
  SAMLRequest=<XML comprimido e base64>&
  RelayState=https://app1.empresa.com/relatorios/42</div>
<p>No mundo OIDC, o equivalente é o parâmetro <code>state</code> do Authorization Code Flow — mesma ideia, nomenclatura diferente.</p>` },
    },
    {
      title: '③-④ IdP apresenta tela de login e autentica',
      show: ['user', 'sp1', 'sp2', 'sp3', 'idp', 'idp_sub', 'leg_title',
             'a_u_sp1', 'a_u_sp1_l', 'a_sp1_idp', 'a_sp1_idp_l',
             'a_idp_user_login', 'a_idp_user_login_l', 'a_user_creds', 'a_user_creds_l'],
      highlight: ['idp', 'user'],
      balloon: {
        anchor: 'idp', placement: 'left',
        text: 'IdP mostra formulário de login (pode incluir MFA). Usuário submete credenciais diretamente ao IdP — o SP nunca vê a senha.',
        why: 'Principal vantagem de SSO: credenciais só trafegam com o IdP confiável.',
        deep: `<p>Esse é o único ponto de todo o fluxo em que a senha (ou fator de MFA) do usuário trafega — e ela vai direto para o domínio do IdP, nunca para o domínio do SP. É essa centralização que torna o SSO mais seguro que N logins independentes: só um domínio precisa implementar (corretamente) rate limiting, MFA e detecção de força bruta.</p>
<div class="xp-good"><strong>Boa prática</strong>IdP exige MFA obrigatório no login central — automaticamente todos os SPs conectados herdam essa proteção sem precisar implementar nada.</div>` },
    },
    {
      title: '⑤ IdP cria SSO Session e emite Assertion ao SP1',
      show: ['user', 'sp1', 'sp2', 'sp3', 'idp', 'idp_sub', 'sso_cookie', 'leg_title',
             'a_u_sp1', 'a_u_sp1_l', 'a_sp1_idp', 'a_sp1_idp_l',
             'a_idp_user_login', 'a_idp_user_login_l', 'a_user_creds', 'a_user_creds_l',
             'a_idp_sp1', 'a_idp_sp1_l'],
      highlight: ['idp', 'sso_cookie', 'sp1'],
      balloon: {
        anchor: 'sso_cookie', placement: 'bottom',
        text: 'IdP grava SSO session cookie no <strong>seu próprio domínio</strong> (ex: `sso.empresa.com`). Depois envia Assertion (SAML) ou `id_token` (OIDC) ao SP1.',
        deep: `<p>O cookie de sessão do IdP normalmente é <code>HttpOnly</code>, <code>Secure</code> e escopado ao domínio do próprio IdP — nenhum SP consegue lê-lo diretamente, o que é intencional: o SP só recebe a <em>assertion assinada</em>, nunca acesso à sessão do IdP em si.</p>
<div class="xp-example"><strong>Set-Cookie do IdP</strong>Set-Cookie: idp_session=xyz789; Domain=sso.empresa.com; HttpOnly; Secure; SameSite=Lax</div>
<p>É por causa desse cookie, e não de mágica, que a próxima vez que qualquer SP redirecionar o usuário ao IdP, ele já estará "logado" sem digitar nada.</p>` },
    },
    {
      title: '⑥-⑦ User acessa App2 — sem re-login!',
      show: ['user', 'sp1', 'sp2', 'sp3', 'idp', 'idp_sub', 'sso_cookie', 'leg_title',
             'a_u_sp1', 'a_u_sp1_l', 'a_idp_sp1', 'a_idp_sp1_l',
             'a_u_sp2', 'a_u_sp2_l', 'a_sp2_idp', 'a_sp2_idp_l'],
      highlight: ['sp2', 'idp'],
      balloon: {
        anchor: 'sp2', placement: 'right',
        text: 'SP2 redireciona ao IdP. O IdP encontra o SSO session cookie ativo — não exige nova autenticação.',
        deep: `<p>Do ponto de vista do usuário parece instantâneo, mas por baixo dos panos o mesmo fluxo de redirecionamento do SP-initiated roda de novo — a diferença é que, ao chegar no IdP, ele encontra o cookie de sessão já válido e pula direto para emitir a assertion, sem mostrar formulário de login.</p>
<div class="xp-example"><strong>Sequência silenciosa</strong>App2 → redirect IdP → IdP vê idp_session válido → gera assertion → redirect de volta para App2 (tudo em milissegundos, sem interação do usuário)</div>` },
    },
    {
      title: '⑧ IdP emite Assertion ao SP2 direto',
      show: ['user', 'sp1', 'sp2', 'sp3', 'idp', 'idp_sub', 'sso_cookie', 'leg_title',
             'a_u_sp2', 'a_u_sp2_l', 'a_sp2_idp', 'a_sp2_idp_l',
             'a_idp_sp2', 'a_idp_sp2_l'],
      highlight: ['idp', 'sp2'],
      balloon: {
        anchor: 'a_idp_sp2_l', placement: 'right',
        text: 'IdP emite nova assertion para SP2. Usuário obtém acesso sem digitar senha — <strong>esse é o valor do SSO</strong>.',
        deep: `<p>Cada SP recebe sua própria assertion, com <code>aud</code> (audience) específico daquele SP — uma assertion emitida para App1 não pode ser reaproveitada em App2, mesmo que ambos confiem no mesmo IdP. Isso evita que uma assertion vazada de um app comprometa outro.</p>
<div class="xp-bad"><strong>Sem audience restriction</strong>Um SP malicioso poderia capturar a assertion destinada a outro SP e reapresentá-la como se fosse dele.</div>
<div class="xp-good"><strong>Com aud checado</strong>Cada SP valida que a assertion foi emitida especificamente para ele antes de aceitar.</div>` },
    },
    {
      title: 'SAML 2.0 vs OIDC SSO',
      show: ['user', 'sp1', 'sp2', 'sp3', 'idp', 'idp_sub', 'leg_title',
             'proto_bg', 'proto_title', 'proto_saml_h', 'proto_oidc_h',
             'ps1', 'po1', 'ps2', 'po2', 'ps3', 'po3', 'ps4', 'po4', 'ps5', 'po5', 'ps6', 'po6'],
      balloon: {
        anchor: 'proto_bg', placement: 'left',
        text: '<strong>SAML 2.0</strong>: padrão enterprise, XML verboso, muito usado com apps legadas. <strong>OIDC</strong>: baseado em OAuth 2.0, JSON/JWT, cloud-native — tendência moderna.',
        why: 'Novos sistemas quase sempre preferem OIDC pela simplicidade e tooling moderno.',
        deep: `<p>SAML nasceu nos anos 2000 para SSO corporativo entre grandes empresas e ainda domina em integrações enterprise legadas (ex: Active Directory Federation Services). OIDC é mais recente, construído sobre OAuth 2.0, e se tornou o padrão de fato para SSO cloud-native e aplicações modernas.</p>
<div class="xp-example"><strong>SAML — trecho de assertion XML</strong>&lt;saml:Assertion&gt;
  &lt;saml:Subject&gt;alice@empresa.com&lt;/saml:Subject&gt;
  &lt;saml:AudienceRestriction&gt;app1.empresa.com&lt;/saml:AudienceRestriction&gt;
&lt;/saml:Assertion&gt;</div>
<div class="xp-example"><strong>OIDC — id_token (JWT)</strong>{ "iss": "https://sso.empresa.com", "sub": "alice@empresa.com", "aud": "app1-client-id", "exp": 1720003600 }</div>
<p>Para um projeto novo sem restrição legada, OIDC costuma ser a escolha mais simples de implementar e depurar.</p>` },
    },
    {
      title: 'Single Logout (SLO)',
      show: ['user', 'sp1', 'sp2', 'sp3', 'idp', 'idp_sub', 'sso_cookie', 'leg_title',
             'slo_bg', 'slo_title', 'slo1', 'slo2', 'slo3', 'slo4'],
      highlight: ['sso_cookie'],
      balloon: {
        anchor: 'slo_bg', placement: 'left',
        text: 'Quando o usuário faz logout, o IdP invalida o SSO session cookie e notifica todos os SPs para encerrar sessões locais — desafio em sistemas legados.',
        why: 'SLO é difícil: nem todos os SPs implementam corretamente o endpoint de logout.',
        deep: `<p>SLO é notoriamente frágil na prática: depende de o IdP conseguir notificar <em>todos</em> os SPs ativos (geralmente via requests em background ou iframes ocultos), e se um deles estiver offline, com bug, ou atrás de firewall restritivo, sua sessão local simplesmente não é encerrada — o usuário "saiu" do IdP mas continua logado nesse SP específico até a sessão local expirar sozinha.</p>
<div class="xp-bad"><strong>SLO parcial</strong>Usuário clica "sair" no IdP, mas o SP3 (que estava com problema de rede) mantém a sessão local ativa por mais 2 horas.</div>
<div class="xp-good"><strong>Mitigação comum</strong>Sessões locais dos SPs com TTL curto, mesmo com SSO ativo — reduz a janela de exposição quando o SLO falha silenciosamente.</div>` },
    },
    {
      title: 'Quiz',
      show: ['user', 'sp1', 'sp2', 'sp3', 'idp', 'idp_sub', 'leg_title'],
      quiz: {
        question: 'No SSO SP-initiated, onde o SSO Session Cookie é armazenado?',
        options: [
          'No browser, com domínio do Service Provider (SP)',
          'No banco de dados do SP',
          'No browser, com domínio do Identity Provider (IdP)',
          'No localStorage do browser, acessível por qualquer SP',
        ],
        answer: 2,
        explain: 'O SSO session cookie fica no domínio do <strong>IdP</strong> (ex: sso.empresa.com). Isso permite que o IdP reconheça sessões ativas quando qualquer SP redireciona o usuário para autenticação — os SPs nunca leem esse cookie diretamente.',
      },
    },
    {
      title: 'Resumo: SSO',
      show: ['user', 'sp1', 'sp2', 'sp3', 'idp', 'idp_sub', 'sso_cookie', 'leg_title',
             'a_u_sp1', 'a_u_sp1_l', 'a_sp1_idp', 'a_sp1_idp_l', 'a_idp_sp1', 'a_idp_sp1_l',
             'a_u_sp2', 'a_u_sp2_l', 'a_idp_sp2', 'a_idp_sp2_l',
             'a_idp_sp3', 'a_idp_sp3_l',
             'proto_bg', 'proto_title', 'proto_saml_h', 'proto_oidc_h',
             'ps1', 'po1', 'ps2', 'po2', 'ps4', 'po4',
             'slo_bg', 'slo_title', 'slo1', 'slo2', 'slo3', 'slo4'],
      balloon: {
        anchor: 'idp', placement: 'left',
        text: '<strong>SSO</strong> centraliza autenticação num IdP. Uma sessão → acesso a N apps. SAML (enterprise) ou OIDC (moderno). SLO encerra sessões em todos os SPs.',
      },
    },
  ];

  window.SSO_DIAGRAM = { title: 'SSO — Single Sign-On', W, H, elements, steps };
})();
