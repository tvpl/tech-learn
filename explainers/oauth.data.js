(function () {
  const W = 1280, H = 720;

  // ── Layout: 4-actor sequence diagram ───────────────────────────────────────
  // Actor X centres
  const UX = 90, CAX = 380, ASX = 720, RSX = 1090;
  const AW = 130, LY = 40;

  const box = (id, x, y, w, h, label, fill, stroke) =>
    ({ id, type: "box", x, y, w, h, rx: 10, fill: fill||"var(--panel-2)", stroke: stroke||"var(--line)", label });

  const lbl = (id, x, y, text, opts) =>
    ({ id, type: "label", x, y, label: text,
       anchor: (opts||{}).anchor||"middle",
       sub: (opts||{}).sub, mono: (opts||{}).mono });

  const dashed = (id, x, y1, y2, color) =>
    ({ id, type: "arrow", x1: x, y1, x2: x, y2, noHead: true, dashed: true, color: color||"var(--muted)" });

  // horizontal sequence message
  const seq = (id, x1, x2, y, text, color) => [
    { id, type: "arrow", x1: x1 + AW/2 + 4, y1: y, x2: x2 - AW/2 - 4, y2: y,
      color: color||"var(--accent)" },
    { id: id+"_l", type: "label", x: (x1+x2)/2, y: y-13,
      anchor:"middle", sub:true, mono:true, label: text },
  ];

  const elements = [
    // ── Actors ──────────────────────────────────────────────────────────────
    box("a_user",   UX  - AW/2, LY, AW, 46, "👤 User",         "var(--panel-2)", "var(--accent)"),
    box("a_client", CAX - AW/2, LY, AW, 46, "📱 Client App",   "var(--panel-2)", "var(--accent-2)"),
    box("a_auth",   ASX - AW/2, LY, AW, 46, "🔐 Auth Server",  "var(--panel-2)", "var(--warn)"),
    box("a_res",    RSX - AW/2, LY, AW, 46, "📦 Resource Srv", "var(--panel-2)", "var(--good)"),
    dashed("lf_u",   UX,  LY+46, 680, "var(--accent)"),
    dashed("lf_ca",  CAX, LY+46, 680, "var(--accent-2)"),
    dashed("lf_as",  ASX, LY+46, 680, "var(--warn)"),
    dashed("lf_rs",  RSX, LY+46, 680, "var(--good)"),

    // ── Problem box ─────────────────────────────────────────────────────────
    box("prob_box", 160, 100, 960, 64, null, "#1a1010", "var(--hot)"),
    lbl("prob_t", 640, 120, "❌  Old approach: app asks for your password directly"),
    lbl("prob_s", 640, 142, "App stores your password → full access + breach risk", {sub:true}),

    // ── Step 1: User clicks → redirect ──────────────────────────────────────
    ...seq("s1_uc",  UX,  CAX, 180, "\"Connect with Google\"", "var(--accent)"),
    ...seq("s1_rdr", CAX, ASX, 218,
      "GET /authorize?response_type=code&client_id=…&scope=email&state=xyz", "var(--accent-2)"),
    { id: "s1_note", type: "token", x: (CAX+ASX)/2 - 160, y: 234, w: 320, h: 26,
      fill: "#1a1a10", stroke: "var(--warn)", label: "redirect_uri must match pre-registered" },

    // ── Step 2: Auth Server authenticates ───────────────────────────────────
    box("consent_box", ASX - 120, 268, 240, 80,
      ["🔐 Auth Server", "Login form", "Consent screen"], "#16203d", "var(--warn)"),

    // ── Step 3: Code returned ────────────────────────────────────────────────
    ...seq("s3_ac", ASX, CAX, 380,
      "302 → redirect_uri?code=AUTH_CODE&state=xyz", "var(--warn)"),
    { id: "s3_note", type: "token", x: (CAX+ASX)/2 - 140, y: 396, w: 280, h: 26,
      fill: "#1a1a10", stroke: "var(--warn)", label: "code: ephemeral (10 min) · single-use" },

    // ── Step 4: Token exchange ────────────────────────────────────────────────
    ...seq("s4_req", CAX, ASX, 440,
      "POST /token  code + client_id + client_secret", "var(--accent-2)"),
    ...seq("s4_res", ASX, CAX, 476,
      "{access_token, refresh_token, id_token, expires_in}", "var(--good)"),
    { id: "s4_note", type: "token", x: (CAX+ASX)/2 - 130, y: 492, w: 260, h: 26,
      fill: "#102212", stroke: "var(--good)", label: "server-to-server · user not in loop" },

    // ── Step 5: Access Resource Server ────────────────────────────────────────
    ...seq("s5_req", CAX, RSX, 534,
      "GET /api/profile  Authorization: Bearer <access_token>", "var(--accent)"),
    ...seq("s5_res", RSX, CAX, 566,
      "200 OK  {name:\"Alice\", email:\"alice@…\"}", "var(--good)"),

    // ── PKCE detail panel ─────────────────────────────────────────────────────
    box("pkce_bg",  740, 100, 520, 196, null, "var(--panel)", "var(--accent-2)"),
    lbl("pkce_ttl", 1000, 122, "PKCE — for Mobile / SPA (no client_secret)"),
    lbl("pkce_1", 750, 148, "1. Generate  code_verifier = random(32 bytes)", {sub:true, mono:true, anchor:"start"}),
    lbl("pkce_2", 750, 168, "2. Derive    code_challenge = BASE64(SHA256(v))", {sub:true, mono:true, anchor:"start"}),
    lbl("pkce_3", 750, 188, "3. Send      code_challenge in /authorize", {sub:true, mono:true, anchor:"start"}),
    lbl("pkce_4", 750, 208, "4. Verify    send verifier in /token exchange", {sub:true, mono:true, anchor:"start"}),
    lbl("pkce_why",1000, 278, "No secret needed — safe for public clients", {sub:true}),

    // ── Tokens panel ──────────────────────────────────────────────────────────
    box("tok_bg",  10, 480, 350, 196, null, "var(--panel)", "var(--line)"),
    lbl("tok_ttl", 185, 502, "The 3 Tokens"),
    { id:"tok_n0", type:"token", x:20,  y:522, w:155, h:28, fill:"var(--panel-2)", stroke:"var(--accent)",   label:"access_token"},
    lbl("tok_d0", 185, 536, "Short-lived (15m). Use for API calls.", {sub:true, anchor:"start"}),
    { id:"tok_n1", type:"token", x:20,  y:558, w:155, h:28, fill:"var(--panel-2)", stroke:"var(--accent-2)",label:"refresh_token"},
    lbl("tok_d1", 185, 572, "Long-lived (7d). Get new access tokens.", {sub:true, anchor:"start"}),
    { id:"tok_n2", type:"token", x:20,  y:594, w:155, h:28, fill:"var(--panel-2)", stroke:"var(--warn)",    label:"id_token"},
    lbl("tok_d2", 185, 608, "OIDC only. JWT with user identity.", {sub:true, anchor:"start"}),
    lbl("tok_note",185, 638, "access_token: Bearer header. refresh_token: HttpOnly cookie.", {sub:true, anchor:"start"}),
    lbl("tok_note2",185,658, "Never store tokens in localStorage (XSS risk).", {sub:true, anchor:"start"}),

    // ── OIDC panel ───────────────────────────────────────────────────────────
    box("oidc_bg",  10, 300, 350, 172, null, "var(--panel)", "var(--accent)"),
    lbl("oidc_ttl", 185, 322, "OIDC — Adds Identity to OAuth 2.0"),
    lbl("oidc_1", 20, 348, "OAuth 2.0 answers: can app access resource?", {sub:true, anchor:"start"}),
    lbl("oidc_2", 20, 368, "OIDC adds:      who is the user?", {sub:true, anchor:"start"}),
    lbl("oidc_3", 20, 396, "• id_token (JWT: sub, email, name, picture)", {sub:true, anchor:"start"}),
    lbl("oidc_4", 20, 416, "• /userinfo endpoint", {sub:true, anchor:"start"}),
    lbl("oidc_5", 20, 436, "• Discovery: /.well-known/openid-configuration", {sub:true, anchor:"start"}),
    lbl("oidc_note",185, 460, "OIDC ≠ OAuth. OAuth = authorization, OIDC = identity.", {sub:true}),

    // ── Other flows ────────────────────────────────────────────────────────────
    box("flows_bg",  740, 304, 520, 170, null, "var(--panel-2)", "var(--line)"),
    lbl("flows_ttl", 1000, 326, "Other Grant Types"),
    lbl("flows_cc",  750, 352, "Client Credentials: M2M — client_id+secret → token",   {sub:true, anchor:"start"}),
    lbl("flows_cc2", 750, 368, "  No user involved. Perfect for microservices.",          {sub:true, mono:true, anchor:"start"}),
    lbl("flows_dv",  750, 396, "Device Flow: TV/CLI — code on screen, confirm on phone", {sub:true, anchor:"start"}),
    lbl("flows_dv2", 750, 412, "  User polls /token until approval.",                     {sub:true, mono:true, anchor:"start"}),
    lbl("flows_imp", 750, 440, "Implicit (deprecated): token in URL — never use.",       {sub:true, anchor:"start"}),
    lbl("flows_rec", 1000, 460, "✓  Auth Code + PKCE = recommended for all new apps",    {sub:true}),
  ];

  const ALL_IDS = elements.map(e => e.id);

  const steps = [
    {
      title: "O Problema: Compartilhar a Senha",
      show: ["a_user","a_client","a_auth","a_res",
             "lf_u","lf_ca","lf_as","lf_rs","prob_box","prob_t","prob_s"],
      balloon: {
        anchor: "prob_box", placement: "bottom",
        text: "Sem OAuth, uma app precisaria da sua senha para agir em seu nome. Resultado: a app tem acesso total, armazena sua senha, e um vazamento expõe sua conta inteira.",
        why: "OAuth resolve com <strong>delegação granular</strong>: você autoriza o acesso a escopos específicos (ex: só leitura de email) sem nunca revelar a senha."
      }
    },
    {
      title: "Os 4 Atores do OAuth 2.0",
      show: ["a_user","a_client","a_auth","a_res","lf_u","lf_ca","lf_as","lf_rs"],
      highlight: ["a_user","a_client","a_auth","a_res"],
      balloon: {
        anchor: { x: 580, y: 120 }, placement: "bottom",
        text: "<strong>Resource Owner</strong>: o usuário dono dos dados. <strong>Client</strong>: o app que quer acesso. <strong>Authorization Server</strong>: autentica e emite tokens. <strong>Resource Server</strong>: guarda os dados protegidos.",
        why: "Separar Auth Server de Resource Server permite usar um IdP centralizado (Google, Okta, Auth0) para autenticar usuários de múltiplos apps e APIs."
      }
    },
    {
      title: "Visão Geral do Authorization Code Flow",
      show: ["a_user","a_client","a_auth","a_res","lf_u","lf_ca","lf_as","lf_rs",
             "s1_uc","s1_uc_l","s1_rdr","s1_rdr_l",
             "s3_ac","s3_ac_l","s4_req","s4_req_l","s4_res","s4_res_l",
             "s5_req","s5_req_l","s5_res","s5_res_l"],
      balloon: {
        anchor: { x: (CAX+ASX)/2, y: 380 }, placement: "right",
        text: "5 etapas: <strong>1</strong> redirect ao Auth Server → <strong>2</strong> user autentica → <strong>3</strong> code retorna → <strong>4</strong> troca server-to-server por tokens → <strong>5</strong> usa access token.",
        why: "O design garante que tokens nunca viajam no URL do browser e que a troca de code por token exige o client_secret — seguro mesmo com redirect interceptado."
      }
    },
    {
      title: "Step 1: Redirect para o Auth Server",
      show: ["a_user","a_client","a_auth","a_res","lf_u","lf_ca","lf_as","lf_rs",
             "s1_uc","s1_uc_l","s1_rdr","s1_rdr_l","s1_note"],
      balloon: {
        anchor: { x: (CAX+ASX)/2, y: 250 }, placement: "bottom",
        text: "Client gera URL de autorização com: <code>response_type=code</code>, <code>client_id</code>, <code>redirect_uri</code>, <code>scope</code>, <code>state</code> (anti-CSRF nonce) e opcionalmente <code>code_challenge</code> (PKCE).",
        why: "O parâmetro <code>state</code> é um nonce gerado pelo client. Na resposta, se o state não bater, o flow é abortado — proteção contra CSRF em fluxos OAuth."
      },
      enter(ctx) { ctx.drawArrow("s1_uc"); setTimeout(() => ctx.drawArrow("s1_rdr"), 400); }
    },
    {
      title: "Step 2: Autenticação e Consent Screen",
      show: ["a_user","a_client","a_auth","a_res","lf_u","lf_ca","lf_as","lf_rs",
             "s1_rdr","s1_rdr_l","consent_box"],
      highlight: ["consent_box","a_auth"],
      balloon: {
        anchor: "consent_box", placement: "right",
        text: "O Auth Server exibe <strong>login form</strong> e após autenticação, uma <strong>consent screen</strong>: 'App X quer acesso a: leitura de email, perfil.' — o usuário decide.",
        why: "Consent granular: o usuário vê exatamente o que está delegando. Pode revogar a qualquer momento sem trocar senha. Revogar = deletar o refresh token."
      }
    },
    {
      title: "Step 3: Code de Autorização",
      show: ["a_user","a_client","a_auth","a_res","lf_u","lf_ca","lf_as","lf_rs",
             "consent_box","s3_ac","s3_ac_l","s3_note"],
      balloon: {
        anchor: { x: (CAX+ASX)/2, y: 410 }, placement: "bottom",
        text: "Auth Server redireciona para <code>redirect_uri?code=ABC&state=xyz</code>. O <code>code</code> é efêmero (10 min) e de uso único — não é ainda um token de acesso.",
        why: "Code no URL é menos sensível que token: expira rápido, é inútil sem o client_secret, e o state previne replay attacks."
      },
      enter(ctx) { ctx.drawArrow("s3_ac"); }
    },
    {
      title: "Step 4: Troca de Code por Tokens",
      show: ["a_user","a_client","a_auth","a_res","lf_u","lf_ca","lf_as","lf_rs",
             "s3_ac","s3_ac_l","s4_req","s4_req_l","s4_res","s4_res_l","s4_note"],
      balloon: {
        anchor: { x: (CAX+ASX)/2, y: 490 }, placement: "bottom",
        text: "Client faz POST <strong>server-to-server</strong> com <code>code + client_id + client_secret</code>. Auth Server valida e retorna os tokens. O browser não vê nada disso.",
        why: "Server-to-server: o client_secret nunca fica exposto no frontend. Os tokens ficam no backend — o frontend pode receber apenas um session cookie de curto prazo."
      },
      enter(ctx) { ctx.drawArrow("s4_req"); setTimeout(() => ctx.drawArrow("s4_res"), 500); }
    },
    {
      title: "Step 5: Usando o Access Token",
      show: ["a_user","a_client","a_auth","a_res","lf_u","lf_ca","lf_as","lf_rs",
             "s4_res","s4_res_l","s5_req","s5_req_l","s5_res","s5_res_l"],
      balloon: {
        anchor: { x: (CAX+RSX)/2, y: 560 }, placement: "top",
        text: "Client inclui <code>Authorization: Bearer &lt;access_token&gt;</code> em cada request. Resource Server valida o token (JWT verify ou introspection) e retorna os dados.",
        why: "Bearer = quem apresenta, acessa. Por isso HTTPS é obrigatório e tokens não devem ficar em localStorage (XSS). Use HttpOnly cookie ou memory do app."
      },
      enter(ctx) { ctx.drawArrow("s5_req"); setTimeout(() => ctx.drawArrow("s5_res"), 400); }
    },
    {
      title: "PKCE: Proteção Para Apps Públicas",
      show: ["a_user","a_client","a_auth","a_res","lf_u","lf_ca","lf_as","lf_rs",
             "pkce_bg","pkce_ttl","pkce_1","pkce_2","pkce_3","pkce_4","pkce_why"],
      highlight: ["pkce_bg"],
      balloon: {
        anchor: { x: 1000, y: 306 }, placement: "bottom",
        text: "Apps públicas (SPA, mobile) não podem guardar <code>client_secret</code>. <strong>PKCE</strong>: gera verifier aleatório, envia o hash no redirect, verifica na troca de token — sem secret.",
        why: "Se o code for interceptado, o atacante não consegue trocá-lo por token sem o verifier original. O verifier ficou no app legítimo."
      }
    },
    {
      title: "Os 3 Tokens",
      show: ["a_user","a_client","a_auth","a_res","lf_u","lf_ca","lf_as","lf_rs",
             "tok_bg","tok_ttl","tok_n0","tok_d0","tok_n1","tok_d1","tok_n2","tok_d2","tok_note","tok_note2"],
      balloon: {
        anchor: "tok_bg", placement: "right",
        text: "<strong>access_token</strong>: curto (15min) — para chamadas de API. <strong>refresh_token</strong>: longo (7d) — para renovar o access sem login. <strong>id_token</strong>: OIDC JWT — identidade do usuário.",
        why: "Access token curto limita a janela de abuso em vazamento. Refresh rotation: cada uso gera um novo refresh token e invalida o anterior."
      },
      enter(ctx) {
        [["tok_n0","tok_d0"],["tok_n1","tok_d1"],["tok_n2","tok_d2"]].forEach(([a,b],k) =>
          setTimeout(() => { ctx.show(a); ctx.show(b); }, k * 200));
      }
    },
    {
      title: "OIDC: Identidade Sobre OAuth",
      show: ["a_user","a_client","a_auth","a_res","lf_u","lf_ca","lf_as","lf_rs",
             "oidc_bg","oidc_ttl","oidc_1","oidc_2","oidc_3","oidc_4","oidc_5","oidc_note"],
      highlight: ["oidc_bg"],
      balloon: {
        anchor: "oidc_bg", placement: "right",
        text: "<strong>OAuth 2.0</strong>: autorização — 'pode acessar?'. <strong>OIDC</strong>: identidade — 'quem é?'. OIDC adiciona <code>id_token</code> JWT com claims (sub, email, name) e <code>/userinfo</code> endpoint.",
        why: "Sem OIDC, cada provider inventa como expor dados do usuário. OIDC standardiza isso — permite federar logins ('Continue with Google') de forma interoperável."
      }
    },
    {
      title: "Outros Flows: Client Credentials e Device",
      show: ["a_user","a_client","a_auth","a_res","lf_u","lf_ca","lf_as","lf_rs",
             "flows_bg","flows_ttl","flows_cc","flows_cc2","flows_dv","flows_dv2","flows_imp","flows_rec"],
      balloon: {
        anchor: "flows_bg", placement: "left",
        text: "<strong>Client Credentials</strong>: M2M sem usuário (microserviços). <strong>Device Flow</strong>: TV/CLI — código no device, aprovação no celular. <strong>Implicit</strong>: obsoleto, token na URL, não use.",
        why: "Client Credentials é o padrão para background jobs e microserviços que precisam se autenticar entre si sem intervençáo humana."
      }
    },
    {
      title: "Quiz",
      balloon: { anchor: { x: 640, y: 360 }, placement: "bottom", text: "Teste seu conhecimento sobre OAuth 2.0:" },
      quiz: {
        question: "Por que o Authorization Code Flow usa uma etapa separada de troca server-to-server (ao invés de retornar tokens direto no redirect)?",
        options: [
          "Para reduzir latência e evitar uma conexão TCP extra",
          "Para que tokens nunca viajem na URL do browser, que pode ser logada em proxies e histórico",
          "Porque o Protobuf não suporta tokens em query parameters",
          "Para garantir que o usuário confirme o acesso uma segunda vez"
        ],
        answer: 1,
        explain: "URLs ficam em logs de servidores, proxies e histórico do browser. O code é efêmero e inútil sem o client_secret. Tokens só saem no canal server-to-server HTTPS POST — nunca expostos no browser."
      }
    },
    {
      title: "Resumo",
      show: ["a_user","a_client","a_auth","a_res","lf_u","lf_ca","lf_as","lf_rs",
             "s1_uc","s1_uc_l","s1_rdr","s1_rdr_l",
             "s3_ac","s3_ac_l","s4_req","s4_req_l","s4_res","s4_res_l",
             "s5_req","s5_req_l","s5_res","s5_res_l",
             "tok_bg","tok_ttl","tok_n0","tok_d0","tok_n1","tok_d1"],
      balloon: {
        anchor: { x: (CAX+ASX)/2, y: 380 }, placement: "right",
        text: "<strong>OAuth 2.0</strong> = delegação de autorização. Auth Code Flow: redirect → code → server-to-server troca → bearer token. <strong>PKCE</strong> para apps públicas. <strong>OIDC</strong> para identidade. Tokens: access (curto) + refresh (longo).",
        why: "OAuth não é autenticação — é autorização. Para login, use OIDC. Para segurança máxima: access token curto + refresh rotation + HTTPS + HttpOnly cookie."
      }
    }
  ];

  window.OAUTH_DIAGRAM = {
    title: "OAuth 2.0 / OIDC",
    subtitle: "Authorization Code Flow · PKCE · Access Token · Refresh Token · OpenID Connect",
    width: W, height: H, autoplayMs: 9000, elements, steps,
  };
})();
