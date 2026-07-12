(function () {
  const W = 1280, H = 720;

  /* ── layout: 3-column sequence diagram ── */
  const BX = 120;   // Browser column X
  const AX = 560;   // API Server column X
  const RX = 980;   // Redis (Session Store) column X
  const COL_W = 140, COL_H = 60;
  const LY1 = 80, LY2 = H - 40;   // lifeline Y range

  function box(id, x, y, w, h, text, color) {
    return { id, type: 'box', x, y, w, h, label: text, stroke: color };
  }
  function lbl(id, x, y, text, color) {
    return { id, type: 'label', x, y, label: text, style: `fill:${color || 'var(--muted)'}`, size: 12 };
  }
  function lifeline(id, x) {
    return { id, type: 'arrow', x1: x, y1: LY1 + COL_H, x2: x, y2: LY2, noHead: true, dashed: true, color: 'var(--line)' };
  }
  function seq(id, x1, x2, y, text, color) {
    const mid = (x1 + x2) / 2;
    return [
      { id, type: 'arrow', x1, y1: y, x2, y2: y, color: color || 'var(--accent)' },
      { id: id + '_l', type: 'label', x: mid, y: y - 12, label: text, style: `fill:${color || 'var(--accent)'}`, size: 11 },
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
        deep: `<p>Isso é uma decisão de design do próprio protocolo, não um bug: HTTP foi desenhado para ser simples e sem memória entre requests, o que facilita cache, proxies e escalabilidade horizontal. O preço é que qualquer noção de "usuário logado" precisa ser reconstruída manualmente pela aplicação a cada request.</p>
<div class="xp-example"><strong>Duas requests, zero relação</strong>Request 1: POST /login {user, pass} → 200 OK
Request 2: GET /dashboard → servidor não tem ideia de quem fez a request 1</div>
<p>As duas soluções clássicas para "lembrar" o usuário são cookies de sessão (server-side state) e tokens auto-contidos como JWT (client-side state) — este explicador foca na primeira.</p>` },
    },
    {
      title: '① Login: servidor cria session no store',
      show: ['col_b', 'col_a', 'col_r', 'll_b', 'll_a', 'll_r', 'lbl_login',
             'msg_login', 'msg_login_l', 'msg_store', 'msg_store_l'],
      highlight: ['col_a', 'col_r'],
      balloon: {
        anchor: 'msg_store_l', placement: 'top',
        text: 'Após validar as credenciais, o servidor gera um <strong>session_id</strong> aleatório (ex: UUID v4) e armazena `{userId, role, ...}` no Redis com `SET session:abc123 ...`.',
        why: 'O session_id deve ser criptograficamente aleatório — não sequencial ou previsível.',
        deep: `<p>A aleatoriedade do session_id é a única coisa que protege a sessão — se fosse previsível (ex: um contador incremental), um atacante poderia simplesmente adivinhar IDs de outros usuários e sequestrar sessões sem nunca roubar um cookie. Por isso o gerador precisa ser criptograficamente seguro (não <code>Math.random()</code>).</p>
<div class="xp-bad"><strong>Session ID previsível</strong>session_id = ++counter; // "session:1001", "session:1002"...</div>
<div class="xp-good"><strong>Session ID seguro</strong>session_id = crypto.randomUUID(); // "550e8400-e29b-41d4-a716-446655440000" — 122 bits de entropia</div>` },
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
        deep: `<p>O cabeçalho <code>Set-Cookie</code> é a única forma padrão de o servidor instruir o browser a guardar e reenviar um valor automaticamente — nenhum JavaScript no cliente precisa gerenciar isso manualmente (e, com <code>HttpOnly</code>, nenhum JavaScript sequer consegue acessar o valor).</p>
<div class="xp-example"><strong>Resposta do servidor</strong>HTTP/1.1 200 OK
Set-Cookie: sid=abc123; HttpOnly; Secure; SameSite=Strict; Max-Age=3600; Path=/

Toda request subsequente ao mesmo domínio:
Cookie: sid=abc123</div>` },
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
        text: '<strong>HttpOnly</strong>: protege contra XSS (JS não acessa o cookie).\n<strong>Secure</strong>: só trafega em HTTPS.\n<strong>SameSite=Strict</strong>: bloqueia envio cross-site → principal defesa contra CSRF.',
        why: 'Sem HttpOnly, um script malicioso pode roubar o session_id via `document.cookie`.',
        deep: `<p>Cada atributo neutraliza uma classe de ataque diferente, e combiná-los é o que torna um cookie de sessão razoavelmente seguro por padrão nos browsers modernos.</p>
<div class="xp-bad"><strong>Cookie sem atributos</strong>Set-Cookie: sid=abc123
Legível por qualquer script (XSS), enviado por HTTP puro (interceptável), enviado em requests cross-site (CSRF).</div>
<div class="xp-good"><strong>Cookie endurecido</strong>Set-Cookie: sid=abc123; HttpOnly; Secure; SameSite=Strict
Inacessível a JS, só via HTTPS, não enviado em navegação cross-site.</div>
<p><code>SameSite=Lax</code> é o meio-termo mais comum: bloqueia a maioria dos vetores de CSRF mas ainda envia o cookie em navegação de topo (clicar num link de outro site), o que <code>Strict</code> bloquearia também.</p>` },
    },
    {
      title: '③ Request subsequente: browser envia cookie automaticamente',
      show: ['col_b', 'col_a', 'col_r', 'll_b', 'll_a', 'll_r', 'lbl_req',
             'msg_req2', 'msg_req2_l'],
      highlight: ['col_b'],
      balloon: {
        anchor: 'msg_req2_l', placement: 'top',
        text: 'O browser anexa automaticamente o cookie a toda request no mesmo domínio: `Cookie: sid=abc123`. O usuário não precisa fazer nada.',
        deep: `<p>Esse comportamento automático do browser é conveniente, mas é justamente ele que abre a porta para CSRF: se o cookie é enviado automaticamente em <em>qualquer</em> request para o domínio (inclusive originada de outro site), um site malicioso pode fazer o browser da vítima disparar requests autenticadas sem que ela perceba — daí a importância do <code>SameSite</code>.</p>
<div class="xp-example"><strong>Anexação automática</strong>&lt;img src="https://banco.com/api/transferir?para=atacante&valor=1000"&gt;
Se o usuário está logado no banco.com, o browser anexa o cookie de sessão automaticamente a essa request, mesmo vindo de outro site.</div>` },
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
        deep: `<p>Esse lookup no store acontece em <em>toda</em> request autenticada — é o custo estrutural do modelo de sessions: cada request paga uma consulta extra (idealmente O(1) num cache como Redis) em troca de poder revogar o acesso instantaneamente a qualquer momento.</p>
<div class="xp-example"><strong>Resposta quando a sessão não existe</strong>GET session:xyz999
(nil)
→ 401 Unauthorized {"error": "session expired or invalid"}</div>
<p>Comparado a JWT, que verifica localmente sem essa consulta, sessions trocam performance bruta por controle — na prática, com Redis, a diferença de latência costuma ser irrelevante (sub-milissegundo).</p>` },
    },
    {
      title: 'Session Store: onde guardar?',
      show: ['col_b', 'col_a', 'col_r', 'll_b', 'll_a', 'll_r',
             'store_bg', 'store_title', 'ss1', 'ss2', 'ss3', 'ss4', 'ss5'],
      highlight: ['col_r', 'store_bg'],
      balloon: {
        anchor: 'store_bg', placement: 'left',
        text: '<strong>Redis</strong> é o padrão para session stores distribuídos: O(1) GET/SET, TTL nativo (auto-expire), suporte a cluster. Evite sticky sessions — acoplam usuários a servidores específicos.',
        why: 'In-memory funciona apenas com uma instância — morre junto com o processo.',
        deep: `<p>A escolha do store determina se a aplicação escala horizontalmente sem dor. In-memory funciona apenas enquanto existir uma única instância do servidor — assim que um load balancer distribui requests entre múltiplas instâncias, cada uma teria sua própria cópia da sessão, e o usuário "perderia" a sessão ao cair numa instância diferente.</p>
<div class="xp-bad"><strong>Sticky sessions</strong>Load balancer força o mesmo usuário sempre no mesmo servidor — funciona, mas acopla escalabilidade e complica deploys (reiniciar aquele servidor derruba as sessões dele).</div>
<div class="xp-good"><strong>Store compartilhado (Redis)</strong>Qualquer instância do servidor consegue ler/escrever a mesma sessão — load balancer distribui requests livremente, e o TTL nativo do Redis expira sessões automaticamente sem job de limpeza manual.</div>` },
    },
    {
      title: 'CSRF e Session Attacks',
      show: ['col_b', 'col_a', 'col_r', 'll_b', 'll_a', 'll_r',
             'csrf_bg', 'csrf_title', 'crf1', 'crf2', 'crf3', 'crf4'],
      highlight: ['csrf_bg'],
      balloon: {
        anchor: 'csrf_bg', placement: 'right',
        text: '<strong>CSRF</strong>: site malicioso faz request em nome do usuário usando seu cookie. <strong>Session fixation</strong>: atacante força um session_id — regenerar ID após login. <strong>Hijacking</strong>: detectar mudanças de IP/User-Agent.',
        deep: `<p>Os três ataques listados exploram propriedades diferentes do modelo de cookies: CSRF abusa do envio automático, session fixation abusa de reaproveitar um ID já conhecido pelo atacante, e hijacking abusa de um cookie efetivamente roubado (via rede insegura, malware, ou XSS).</p>
<div class="xp-example"><strong>Session fixation</strong>1. Atacante define session_id=FIXO em um link enviado à vítima
2. Vítima faz login usando esse session_id sem o servidor gerar um novo
3. Atacante já conhecia FIXO → agora tem acesso à sessão autenticada da vítima</div>
<div class="xp-good"><strong>Defesa</strong>Sempre regenerar o session_id no momento do login bem-sucedido, mesmo que já existisse um cookie anterior.</div>` },
    },
    {
      title: '⑤ Logout: deletar session + limpar cookie',
      show: ['col_b', 'col_a', 'col_r', 'll_b', 'll_a', 'll_r', 'lbl_out',
             'msg_logout', 'msg_logout_l',
             'msg_sdel', 'msg_sdel_l', 'msg_clear', 'msg_clear_l'],
      highlight: ['col_r'],
      balloon: {
        anchor: 'msg_sdel_l', placement: 'top',
        text: 'Logout <strong>deve</strong> deletar a session do store (`DEL session:abc123`) E expirar o cookie (`Max-Age=0`). Só limpar o cookie é insuficiente — token ainda seria válido no store.',
        why: 'Se apenas o cookie for removido, alguém com o session_id ainda teria acesso.',
        deep: `<p>Esse é um erro comum de implementação: times que só limpam o cookie no logout (client-side) mas esquecem de deletar a sessão correspondente no store — a sessão continua "viva" no Redis, e qualquer pessoa que já tivesse capturado aquele session_id (via XSS, log, ou man-in-the-middle antes do logout) continuaria com acesso válido indefinidamente até o TTL expirar.</p>
<div class="xp-bad"><strong>Logout incompleto</strong>res.clearCookie('sid'); // só isso — sessão continua no Redis</div>
<div class="xp-good"><strong>Logout completo</strong>await redis.del('session:' + sid);
res.clearCookie('sid');</div>` },
    },
    {
      title: 'Sessions vs JWT — quando usar cada?',
      show: ['col_b', 'col_a', 'col_r', 'll_b', 'll_a', 'll_r',
             'store_bg', 'store_title', 'ss1', 'ss2', 'ss3', 'ss4', 'ss5',
             'cookie_bg', 'cookie_title', 'ca1', 'ca2', 'ca3', 'ca4', 'ca5'],
      balloon: {
        anchor: 'store_bg', placement: 'top',
        text: '<strong>Sessions</strong>: revogação imediata, dados server-side (menores cookies). Requer session store.\n<strong>JWT</strong>: stateless, sem store, escala horizontal — mas revogação complexa. Sessions são preferíveis para web apps tradicionais.',
        deep: `<p>Uma forma prática de decidir: se a resposta para "preciso conseguir derrubar o acesso de um usuário AGORA, sem esperar expiração" é sim (banco, admin, conta comprometida), sessions ganham. Se a prioridade é escalar sem coordenação entre serviços (múltiplos microserviços verificando o mesmo token independentemente), JWT ganha.</p>
<div class="xp-good"><strong>Sessions</strong>revogação instantânea, cookie pequeno (só o ID), requer store compartilhado — ideal para monolitos web tradicionais.</div>
<div class="xp-good"><strong>JWT</strong>verificação local sem consulta, token maior (carrega claims), revogação difícil antes do exp — ideal para APIs distribuídas e microserviços.</div>
<p>Nada impede um sistema híbrido: session cookie para o app web principal, JWT de vida curta para chamadas entre serviços internos.</p>` },
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
