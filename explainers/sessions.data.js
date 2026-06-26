(function () {
  const W = 1280, H = 720;

  /* ── layout: 3-column sequence diagram ── */
  const BX = 120;   // Browser column X
  const AX = 560;   // API Server column X
  const RX = 980;   // Redis (Session Store) column X
  const COL_W = 140, COL_H = 60;
  const LY1 = 80, LY2 = H - 40;   // lifeline Y range

  function box(id, x, y, w, h, text, color) {
    return { id, type: 'box', x, y, w, h, text, color };
  }
  function lbl(id, x, y, text, color) {
    return { id, type: 'label', x, y, text, color: color || 'var(--muted)', fontSize: 12 };
  }
  function lifeline(id, x) {
    return { id, type: 'arrow', x1: x, y1: LY1 + COL_H, x2: x, y2: LY2, noHead: true, dashed: true, color: 'var(--line)' };
  }
  function seq(id, x1, x2, y, text, color) {
    const mid = (x1 + x2) / 2;
    return [
      { id, type: 'arrow', x1, y1: y, x2, y2: y, color: color || 'var(--accent)' },
      { id: id + '_l', type: 'label', x: mid, y: y - 12, text, color: color || 'var(--accent)', fontSize: 11 },
    ];
  }

  /* actor boxes */
  const actors = [
    box('col_b', BX - COL_W / 2, LY1, COL_W, COL_H, '🌐 Browser', 'var(--accent)'),
    box('col_a', AX - COL_W / 2, LY1, COL_W, COL_H, '⚙️ API Server', 'var(--good)'),
    box('col_r', RX - COL_W / 2, LY1, COL_W, COL_H, '🗄️ Session\nStore (Redis)', 'var(--accent-2)'),
  ];

  /* sequence messages at various Y positions */
  const msgYs = {
    login_req:   180,
    store_write: 250,
    set_cookie:  320,
    req2:        400,
    store_read:  470,
    store_resp:  520,
    resp2:       570,
    logout_req:  630,
    store_del:   675,
    clear_cookie: 700,
  };

  const elements = [
    ...actors,
    lifeline('ll_b', BX),
    lifeline('ll_a', AX),
    lifeline('ll_r', RX),

    /* login flow */
    ...seq('msg_login', BX, AX, msgYs.login_req, 'POST /login {user,pass}', 'var(--accent)'),
    ...seq('msg_store', AX, RX, msgYs.store_write, 'SET session:abc123 {userId}', 'var(--good)'),
    ...seq('msg_cookie', AX, BX, msgYs.set_cookie, 'Set-Cookie: sid=abc123; HttpOnly; Secure', 'var(--good)'),

    /* subsequent request */
    ...seq('msg_req2', BX, AX, msgYs.req2, 'GET /dashboard  Cookie: sid=abc123', 'var(--accent)'),
    ...seq('msg_sread', AX, RX, msgYs.store_read, 'GET session:abc123', 'var(--accent-2)'),
    ...seq('msg_sresp', RX, AX, msgYs.store_resp, '{userId: 42, role: "admin"}', 'var(--accent-2)'),
    ...seq('msg_resp2', AX, BX, msgYs.resp2, '200 OK {dados do usuário}', 'var(--good)'),

    /* logout */
    ...seq('msg_logout', BX, AX, msgYs.logout_req, 'POST /logout', 'var(--hot)'),
    ...seq('msg_sdel', AX, RX, msgYs.store_del, 'DEL session:abc123', 'var(--hot)'),
    ...seq('msg_clear', AX, BX, msgYs.clear_cookie, 'Set-Cookie: sid=; Max-Age=0', 'var(--hot)'),

    /* cookie anatomy panel */
    box('cookie_bg', 280, 490, 240, 130, '', 'var(--panel)'),
    lbl('cookie_title', 400, 508, '🍪 Set-Cookie Atributos', 'var(--warn)'),
    lbl('ca1', 290, 530, 'HttpOnly  → JS não pode ler', 'var(--ink-soft)'),
    lbl('ca2', 290, 550, 'Secure    → só via HTTPS', 'var(--ink-soft)'),
    lbl('ca3', 290, 570, 'SameSite  → bloqueia CSRF', 'var(--ink-soft)'),
    lbl('ca4', 290, 590, 'Max-Age   → TTL em segundos', 'var(--ink-soft)'),
    lbl('ca5', 290, 610, 'Path      → escopo de URL', 'var(--ink-soft)'),

    /* session store comparison panel */
    box('store_bg', 540, 490, 360, 130, '', 'var(--panel)'),
    lbl('store_title', 720, 508, '🗄️ Onde Guardar Sessions?', 'var(--accent-2)'),
    lbl('ss1', 550, 530, 'In-memory  → rápido, mas não escala (1 instância)', 'var(--hot)'),
    lbl('ss2', 550, 552, 'Redis      → distribuído, TTL nativo ✓', 'var(--good)'),
    lbl('ss3', 550, 572, 'Banco SQL  → durável, mas lento para sessões', 'var(--warn)'),
    lbl('ss4', 550, 592, 'Sticky sessions → evitar! acopla cliente ao servidor', 'var(--hot)'),
    lbl('ss5', 550, 612, 'Redis Cluster → multi-nó com sharding', 'var(--muted)'),

    /* CSRF panel */
    box('csrf_bg', 280, 340, 240, 120, '', 'var(--panel)'),
    lbl('csrf_title', 400, 358, '🛡️ CSRF / Ataques', 'var(--hot)'),
    lbl('crf1', 290, 378, 'SameSite=Strict → melhor defesa', 'var(--good)'),
    lbl('crf2', 290, 398, 'CSRF Token → campo oculto no form', 'var(--ink-soft)'),
    lbl('crf3', 290, 418, 'Session fixation → regen session_id', 'var(--ink-soft)'),
    lbl('crf4', 290, 438, 'Hijacking → detectar user-agent changes', 'var(--ink-soft)'),

    /* flow section labels */
    lbl('lbl_login', 10, msgYs.login_req - 8, 'Login', 'var(--accent)'),
    lbl('lbl_req', 10, msgYs.req2 - 8, 'Request', 'var(--muted)'),
    lbl('lbl_out', 10, msgYs.logout_req - 8, 'Logout', 'var(--hot)'),
  ];

  const steps = [
    {
      title: 'O Problema: HTTP é Stateless',
      show: ['col_b', 'col_a', 'col_r', 'll_b', 'll_a', 'll_r', 'lbl_login', 'lbl_req', 'lbl_out'],
      balloon: {
        anchor: 'col_a', placement: 'top',
        text: 'HTTP não tem memória — cada request é independente. O servidor não sabe se a request vem do mesmo usuário que fez login.',
        why: 'Precisamos de um mecanismo para "lembrar" o estado do usuário entre requests.',
      },
    },
    {
      title: '① Login: servidor cria session no store',
      show: ['col_b', 'col_a', 'col_r', 'll_b', 'll_a', 'll_r', 'lbl_login',
             'msg_login', 'msg_login_l', 'msg_store', 'msg_store_l'],
      highlight: ['col_a', 'col_r'],
      balloon: {
        anchor: 'msg_store_l', placement: 'top',
        text: 'Após validar as credenciais, o servidor gera um **session_id** aleatório (ex: UUID v4) e armazena `{userId, role, ...}` no Redis com `SET session:abc123 ...`.',
        why: 'O session_id deve ser criptograficamente aleatório — não sequencial ou previsível.',
      },
    },
    {
      title: '② Set-Cookie: session_id para o browser',
      show: ['col_b', 'col_a', 'col_r', 'll_b', 'll_a', 'll_r', 'lbl_login',
             'msg_login', 'msg_login_l', 'msg_store', 'msg_store_l',
             'msg_cookie', 'msg_cookie_l'],
      highlight: ['col_b', 'msg_cookie'],
      balloon: {
        anchor: 'msg_cookie_l', placement: 'top',
        text: '`Set-Cookie: sid=abc123; HttpOnly; Secure; SameSite=Strict`\n\nO browser armazena o cookie e o enviará automaticamente em toda request futura.',
      },
    },
    {
      title: '🍪 Atributos do Cookie',
      show: ['col_b', 'col_a', 'col_r', 'll_b', 'll_a', 'll_r', 'lbl_login',
             'msg_login', 'msg_login_l', 'msg_cookie', 'msg_cookie_l',
             'cookie_bg', 'cookie_title', 'ca1', 'ca2', 'ca3', 'ca4', 'ca5',
             'csrf_bg', 'csrf_title', 'crf1', 'crf2', 'crf3', 'crf4'],
      highlight: ['cookie_bg'],
      balloon: {
        anchor: 'cookie_bg', placement: 'right',
        text: '**HttpOnly**: protege contra XSS (JS não acessa o cookie).\n**Secure**: só trafega em HTTPS.\n**SameSite=Strict**: bloqueia envio cross-site → principal defesa contra CSRF.',
        why: 'Sem HttpOnly, um script malicioso pode roubar o session_id via `document.cookie`.',
      },
    },
    {
      title: '③ Request subsequente: browser envia cookie automaticamente',
      show: ['col_b', 'col_a', 'col_r', 'll_b', 'll_a', 'll_r', 'lbl_req',
             'msg_req2', 'msg_req2_l'],
      highlight: ['col_b'],
      balloon: {
        anchor: 'msg_req2_l', placement: 'top',
        text: 'O browser anexa automaticamente o cookie a toda request no mesmo domínio: `Cookie: sid=abc123`. O usuário não precisa fazer nada.',
      },
    },
    {
      title: '④ Servidor valida session no store',
      show: ['col_b', 'col_a', 'col_r', 'll_b', 'll_a', 'll_r', 'lbl_req',
             'msg_req2', 'msg_req2_l',
             'msg_sread', 'msg_sread_l', 'msg_sresp', 'msg_sresp_l',
             'msg_resp2', 'msg_resp2_l'],
      highlight: ['col_a', 'col_r'],
      balloon: {
        anchor: 'msg_sresp_l', placement: 'left',
        text: 'Servidor faz `GET session:abc123` no Redis. Se encontrar, recupera `{userId: 42, role: "admin"}` e processa a request. Se expirado ou inexistente → 401.',
      },
    },
    {
      title: 'Session Store: onde guardar?',
      show: ['col_b', 'col_a', 'col_r', 'll_b', 'll_a', 'll_r',
             'store_bg', 'store_title', 'ss1', 'ss2', 'ss3', 'ss4', 'ss5'],
      highlight: ['col_r', 'store_bg'],
      balloon: {
        anchor: 'store_bg', placement: 'left',
        text: '**Redis** é o padrão para session stores distribuídos: O(1) GET/SET, TTL nativo (auto-expire), suporte a cluster. Evite sticky sessions — acoplam usuários a servidores específicos.',
        why: 'In-memory funciona apenas com uma instância — morre junto com o processo.',
      },
    },
    {
      title: 'CSRF e Session Attacks',
      show: ['col_b', 'col_a', 'col_r', 'll_b', 'll_a', 'll_r',
             'csrf_bg', 'csrf_title', 'crf1', 'crf2', 'crf3', 'crf4'],
      highlight: ['csrf_bg'],
      balloon: {
        anchor: 'csrf_bg', placement: 'right',
        text: '**CSRF**: site malicioso faz request em nome do usuário usando seu cookie. **Session fixation**: atacante força um session_id — regenerar ID após login. **Hijacking**: detectar mudanças de IP/User-Agent.',
      },
    },
    {
      title: '⑤ Logout: deletar session + limpar cookie',
      show: ['col_b', 'col_a', 'col_r', 'll_b', 'll_a', 'll_r', 'lbl_out',
             'msg_logout', 'msg_logout_l',
             'msg_sdel', 'msg_sdel_l', 'msg_clear', 'msg_clear_l'],
      highlight: ['col_r'],
      balloon: {
        anchor: 'msg_sdel_l', placement: 'top',
        text: 'Logout **deve** deletar a session do store (`DEL session:abc123`) E expirar o cookie (`Max-Age=0`). Só limpar o cookie é insuficiente — token ainda seria válido no store.',
        why: 'Se apenas o cookie for removido, alguém com o session_id ainda teria acesso.',
      },
    },
    {
      title: 'Sessions vs JWT — quando usar cada?',
      show: ['col_b', 'col_a', 'col_r', 'll_b', 'll_a', 'll_r',
             'store_bg', 'store_title', 'ss1', 'ss2', 'ss3', 'ss4', 'ss5',
             'cookie_bg', 'cookie_title', 'ca1', 'ca2', 'ca3', 'ca4', 'ca5'],
      balloon: {
        anchor: 'store_bg', placement: 'top',
        text: '**Sessions**: revogação imediata, dados server-side (menores cookies). Requer session store.\n**JWT**: stateless, sem store, escala horizontal — mas revogação complexa. Sessions são preferíveis para web apps tradicionais.',
      },
    },
    {
      title: 'Quiz',
      show: ['col_b', 'col_a', 'col_r', 'll_b', 'll_a', 'll_r'],
      quiz: {
        question: 'Por que o atributo `HttpOnly` num cookie de sessão é importante?',
        options: [
          'Garante que o cookie só trafega por HTTP (não HTTPS)',
          'Impede que JavaScript acesse o valor do cookie, protegendo contra XSS',
          'Faz o cookie expirar ao fechar o browser',
          'Permite que o cookie seja enviado em requests cross-origin',
        ],
        answer: 1,
        explain: '`HttpOnly` impede que scripts JavaScript acessem `document.cookie`, o que bloqueia ataques XSS de roubar o session_id. Sem esse atributo, qualquer script injetado na página pode exfiltrar o cookie e sequestrar a sessão.',
      },
    },
    {
      title: 'Resumo: Sessions & Cookies',
      show: ['col_b', 'col_a', 'col_r', 'll_b', 'll_a', 'll_r',
             'msg_login', 'msg_login_l', 'msg_store', 'msg_store_l',
             'msg_cookie', 'msg_cookie_l',
             'msg_req2', 'msg_req2_l', 'msg_sread', 'msg_sread_l',
             'msg_sresp', 'msg_sresp_l', 'msg_resp2', 'msg_resp2_l',
             'msg_logout', 'msg_logout_l', 'msg_sdel', 'msg_sdel_l',
             'msg_clear', 'msg_clear_l',
             'cookie_bg', 'cookie_title', 'ca1', 'ca2', 'ca3',
             'store_bg', 'store_title', 'ss2',
             'lbl_login', 'lbl_req', 'lbl_out'],
      balloon: {
        anchor: 'col_a', placement: 'right',
        text: 'Session-based auth: ID aleatório no cookie HttpOnly/Secure → estado no Redis. Logout deleta do store + expira cookie. SameSite bloqueia CSRF. Escala com Redis distribuído.',
      },
    },
  ];

  window.SESSIONS_DIAGRAM = { title: 'Sessions & Cookies', W, H, elements, steps };
})();
