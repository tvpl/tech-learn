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
    return { id, type: 'box', x, y, w, h, text, color };
  }
  function lbl(id, x, y, text, color) {
    return { id, type: 'label', x, y, text, color: color || 'var(--muted)', fontSize: 12 };
  }
  function arr(id, x1, y1, x2, y2, text, color) {
    return [
      { id, type: 'arrow', x1, y1, x2, y2, color: color || 'var(--accent)' },
      { id: id + '_l', type: 'label', x: (x1 + x2) / 2, y: (y1 + y2) / 2 - 10, text, color: color || 'var(--accent)', fontSize: 11 },
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
      },
    },
    {
      title: 'SSO: 1 login, acesso múltiplo',
      show: ['user', 'sp1', 'sp2', 'sp3', 'idp', 'idp_sub', 'leg_title'],
      balloon: {
        anchor: 'idp', placement: 'left',
        text: 'Com SSO, o usuário autentica UMA vez no IdP e acessa todas as apps sem re-login.',
        why: 'O IdP emite "assertions" de identidade confiadas pelos Service Providers.',
      },
    },
    {
      title: 'Os Atores: User, SP, IdP',
      show: ['user', 'sp1', 'sp2', 'sp3', 'idp', 'idp_sub', 'leg_title',
             'proto_bg', 'proto_title', 'proto_saml_h', 'proto_oidc_h',
             'ps1', 'po1', 'ps2', 'po2', 'ps3', 'po3', 'ps4', 'po4', 'ps5', 'po5', 'ps6', 'po6'],
      balloon: {
        anchor: 'idp', placement: 'left',
        text: '**User** = quem autentica. **SP** (Service Provider) = a app. **IdP** = servidor de identidade central.',
      },
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
      },
    },
    {
      title: '② SP redireciona para IdP com AuthnRequest',
      show: ['user', 'sp1', 'sp2', 'sp3', 'idp', 'idp_sub', 'leg_title',
             'a_u_sp1', 'a_u_sp1_l', 'a_sp1_idp', 'a_sp1_idp_l'],
      highlight: ['sp1', 'idp'],
      balloon: {
        anchor: 'a_sp1_idp_l', placement: 'top',
        text: 'SP1 gera um `AuthnRequest` e redireciona o browser para o IdP com parâmetros como `entityID`, `RelayState` e `redirect_uri`.',
      },
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
      },
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
        text: 'IdP grava SSO session cookie no **seu próprio domínio** (ex: `sso.empresa.com`). Depois envia Assertion (SAML) ou `id_token` (OIDC) ao SP1.',
      },
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
      },
    },
    {
      title: '⑧ IdP emite Assertion ao SP2 direto',
      show: ['user', 'sp1', 'sp2', 'sp3', 'idp', 'idp_sub', 'sso_cookie', 'leg_title',
             'a_u_sp2', 'a_u_sp2_l', 'a_sp2_idp', 'a_sp2_idp_l',
             'a_idp_sp2', 'a_idp_sp2_l'],
      highlight: ['idp', 'sp2'],
      balloon: {
        anchor: 'a_idp_sp2_l', placement: 'right',
        text: 'IdP emite nova assertion para SP2. Usuário obtém acesso sem digitar senha — **esse é o valor do SSO**.',
      },
    },
    {
      title: 'SAML 2.0 vs OIDC SSO',
      show: ['user', 'sp1', 'sp2', 'sp3', 'idp', 'idp_sub', 'leg_title',
             'proto_bg', 'proto_title', 'proto_saml_h', 'proto_oidc_h',
             'ps1', 'po1', 'ps2', 'po2', 'ps3', 'po3', 'ps4', 'po4', 'ps5', 'po5', 'ps6', 'po6'],
      balloon: {
        anchor: 'proto_bg', placement: 'left',
        text: '**SAML 2.0**: padrão enterprise, XML verboso, muito usado com apps legadas. **OIDC**: baseado em OAuth 2.0, JSON/JWT, cloud-native — tendência moderna.',
        why: 'Novos sistemas quase sempre preferem OIDC pela simplicidade e tooling moderno.',
      },
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
      },
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
        explain: 'O SSO session cookie fica no domínio do **IdP** (ex: sso.empresa.com). Isso permite que o IdP reconheça sessões ativas quando qualquer SP redireciona o usuário para autenticação — os SPs nunca leem esse cookie diretamente.',
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
        text: '**SSO** centraliza autenticação num IdP. Uma sessão → acesso a N apps. SAML (enterprise) ou OIDC (moderno). SLO encerra sessões em todos os SPs.',
      },
    },
  ];

  window.SSO_DIAGRAM = { title: 'SSO — Single Sign-On', W, H, elements, steps };
})();
