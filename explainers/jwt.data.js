(function () {
  const W = 1280, H = 720;

  // ── Layout ─────────────────────────────────────────────────────────────────
  // Left panel (x 10-540): JWT token anatomy — 3 colored bands
  // Right panel (x 560-1270): verification flow + comparison table

  const box = (id, x, y, w, h, label, fill, stroke) =>
    ({ id, type: "box", x, y, w, h, rx: 10, fill: fill||"var(--panel-2)", stroke: stroke||"var(--line)", label });

  const lbl = (id, x, y, text, opts) =>
    ({ id, type: "label", x, y, label: text,
       anchor: (opts||{}).anchor||"middle",
       sub: (opts||{}).sub, mono: (opts||{}).mono });

  const arr = (id, x1, y1, x2, y2, color) =>
    ({ id, type: "arrow", x1, y1, x2, y2, color: color||"var(--accent)" });

  // ── Token anatomy ──────────────────────────────────────────────────────────
  // The 3 parts as horizontal colored bands
  const BX = 20, BY = 50, BW = 510;

  // Full token string
  const elements = [
    // Header band
    box("band_h", BX, BY, BW, 64, null, "#0e1e30", "var(--accent)"),
    lbl("band_h_t",   BX + 14, BY + 14, "HEADER", {anchor:"start"}),
    lbl("band_h_v",   BX + 14, BY + 38, "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9", {sub:true, mono:true, anchor:"start"}),

    // Payload band
    box("band_p", BX, BY + 70, BW, 64, null, "#17200e", "var(--good)"),
    lbl("band_p_t",   BX + 14, BY + 84, "PAYLOAD", {anchor:"start"}),
    lbl("band_p_v",   BX + 14, BY + 108,"eyJzdWIiOiJ1c2VyXzQyIiwiZXhwIjoxNzIw…", {sub:true, mono:true, anchor:"start"}),

    // Signature band
    box("band_s", BX, BY + 140, BW, 64, null, "#2a1010", "var(--hot)"),
    lbl("band_s_t",   BX + 14, BY + 154, "SIGNATURE", {anchor:"start"}),
    lbl("band_s_v",   BX + 14, BY + 178, "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_…", {sub:true, mono:true, anchor:"start"}),

    lbl("sep1", BX + BW/3,   BY + 68, ".", {anchor:"middle"}),
    lbl("sep2", BX + BW*2/3, BY + 68, ".", {anchor:"middle"}),

    // ── Header decoded ─────────────────────────────────────────────────────────
    box("hdr_bg", BX, BY + 222, BW, 96, null, "#0e1e30", "var(--accent)"),
    lbl("hdr_ttl", BX + BW/2, BY + 240, "Header (decoded)"),
    lbl("hdr_1", BX + 14, BY + 264, "{", {sub:true, mono:true, anchor:"start"}),
    lbl("hdr_2", BX + 14, BY + 282, "  \"alg\": \"RS256\",   // signing algorithm", {sub:true, mono:true, anchor:"start"}),
    lbl("hdr_3", BX + 14, BY + 300, "  \"typ\": \"JWT\"", {sub:true, mono:true, anchor:"start"}),
    lbl("hdr_4", BX + 14, BY + 318, "}", {sub:true, mono:true, anchor:"start"}),

    // ── Payload decoded ────────────────────────────────────────────────────────
    box("pay_bg", BX, BY + 326, BW, 200, null, "#17200e", "var(--good)"),
    lbl("pay_ttl", BX + BW/2, BY + 346, "Payload — Standard Claims"),
    lbl("pay_1",  BX + 14, BY + 370, "{ \"iss\": \"auth.example.com\",", {sub:true, mono:true, anchor:"start"}),
    lbl("pay_2",  BX + 14, BY + 390, "  \"sub\": \"user_42\",", {sub:true, mono:true, anchor:"start"}),
    lbl("pay_3",  BX + 14, BY + 410, "  \"aud\": \"api.example.com\",", {sub:true, mono:true, anchor:"start"}),
    lbl("pay_4",  BX + 14, BY + 430, "  \"exp\": 1720000900,  // expires (Unix)", {sub:true, mono:true, anchor:"start"}),
    lbl("pay_5",  BX + 14, BY + 450, "  \"iat\": 1720000000,  // issued at", {sub:true, mono:true, anchor:"start"}),
    lbl("pay_6",  BX + 14, BY + 470, "  \"jti\": \"abc-123\",   // unique token ID", {sub:true, mono:true, anchor:"start"}),
    lbl("pay_7",  BX + 14, BY + 490, "  \"role\": \"admin\" }  // custom claim", {sub:true, mono:true, anchor:"start"}),
    lbl("pay_warn",BX + BW/2, BY + 516, "⚠️  Payload is base64 encoded, not encrypted — visible to anyone", {sub:true}),

    // ── Signature formula ──────────────────────────────────────────────────────
    box("sig_bg", BX, BY + 534, BW, 100, null, "#2a1010", "var(--hot)"),
    lbl("sig_ttl", BX + BW/2, BY + 552, "Signature (RS256)"),
    lbl("sig_1",  BX + 14, BY + 576, "Sign(", {sub:true, mono:true, anchor:"start"}),
    lbl("sig_2",  BX + 14, BY + 596, "  base64url(header) + \".\" + base64url(payload),", {sub:true, mono:true, anchor:"start"}),
    lbl("sig_3",  BX + 14, BY + 616, "  privateKey  // RS256 = RSA with SHA-256", {sub:true, mono:true, anchor:"start"}),
    lbl("sig_4",  BX + 14, BY + 636, ")", {sub:true, mono:true, anchor:"start"}),

    // ── Right panel: Verification flow ────────────────────────────────────────
    box("ver_bg",  560, 40, 700, 320, null, "var(--panel)", "var(--line)"),
    lbl("ver_ttl", 910, 62, "Verification Flow (RS256)"),

    // Client
    box("ver_cli", 580, 80, 130, 46, "Client", "var(--panel-2)", "var(--accent)"),
    // Server
    box("ver_srv", 580, 280, 130, 46, "Server", "var(--panel-2)", "var(--good)"),
    // Public Key Store
    box("ver_pk",  1000, 140, 240, 160, ["🔑 Public Key", "(JWKS endpoint)", "RS256 verify only"], "var(--panel-2)", "var(--warn)"),

    arr("ver_a1", 710, 103, 980, 103, "var(--accent)"),
    lbl("ver_a1l", 845, 90, "Bearer <JWT>", {sub:true, mono:true, anchor:"middle"}),
    arr("ver_a2", 710, 293, 980, 293, "var(--accent-2)"),
    lbl("ver_a2l", 845, 280, "hash(hdr+pay) compare sig?", {sub:true, mono:true, anchor:"middle"}),
    arr("ver_a3", 980, 220, 710, 303, "var(--good)"),
    lbl("ver_a3l", 845, 246, "✓ valid / ✗ invalid", {sub:true, mono:true, anchor:"middle"}),

    lbl("ver_note1", 740, 170, "1. Split JWT into 3 parts", {sub:true, anchor:"start"}),
    lbl("ver_note2", 740, 190, "2. Fetch public key (JWKS / cached)", {sub:true, anchor:"start"}),
    lbl("ver_note3", 740, 210, "3. Verify signature with public key", {sub:true, anchor:"start"}),
    lbl("ver_note4", 740, 230, "4. Check exp, iss, aud claims", {sub:true, anchor:"start"}),
    lbl("ver_note5", 740, 250, "5. No DB query needed — stateless", {sub:true, anchor:"start"}),

    // ── HS256 vs RS256 ──────────────────────────────────────────────────────────
    box("alg_bg",  560, 370, 700, 160, null, "var(--panel-2)", "var(--accent-2)"),
    lbl("alg_ttl", 910, 392, "HS256 vs RS256"),
    lbl("alg_h1",  570, 420, "HS256 (HMAC-SHA256)", {anchor:"start"}),
    lbl("alg_h2",  570, 444, "Shared secret — any party can verify AND sign", {sub:true, anchor:"start"}),
    lbl("alg_h3",  570, 464, "Simple, fast. Risk: secret leak = full compromise.", {sub:true, anchor:"start"}),
    lbl("alg_r1",  570, 496, "RS256 (RSA-SHA256)", {anchor:"start"}),
    lbl("alg_r2",  570, 520, "Private key signs (Auth Server only)", {sub:true, anchor:"start"}),
    lbl("alg_r3",  570, 540, "Public key verifies (anyone — JWKS endpoint)", {sub:true, anchor:"start"}),

    // ── Revocation & Refresh pattern ───────────────────────────────────────────
    box("rev_bg",  560, 540, 700, 164, null, "var(--panel)", "var(--line)"),
    lbl("rev_ttl", 910, 562, "Revocation Problem + Pattern"),
    lbl("rev_1",  570, 590, "Problem: JWT is valid until exp — can't invalidate mid-life", {sub:true, anchor:"start"}),
    lbl("rev_2",  570, 610, "Solution: short-lived access tokens (15min)", {sub:true, anchor:"start"}),
    lbl("rev_3",  570, 630, "  + long-lived refresh token (stored server-side)", {sub:true, anchor:"start"}),
    lbl("rev_4",  570, 650, "  + revocation = delete refresh from DB", {sub:true, anchor:"start"}),
    lbl("rev_5",  570, 670, "  + optional: blocklist of revoked JTIs", {sub:true, anchor:"start"}),
    lbl("rev_note",910, 692, "access = stateless (fast). refresh = stateful (revocable).", {sub:true}),
  ];

  const ALL_IDS = elements.map(e => e.id);

  const steps = [
    {
      title: "O Problema: Autenticação Stateless",
      show: ["band_h","band_h_t","band_h_v","band_p","band_p_t","band_p_v","band_s","band_s_t","band_s_v"],
      balloon: {
        anchor: { x: BX + BW/2, y: BY + 145 }, placement: "right",
        text: "HTTP é stateless. Sem state, como o servidor sabe quem fez a request? Opção 1: session cookie (banco consulta a cada request). Opção 2: <strong>JWT</strong> — o token carrega as informações e prova que são autênticas.",
        why: "JWT transfere o estado para o cliente de forma segura. O servidor verifica a assinatura criptográfica — sem consultar banco para cada request."
      }
    },
    {
      title: "JWT = 3 Partes Separadas por Ponto",
      show: ["band_h","band_h_t","band_h_v","band_p","band_p_t","band_p_v","band_s","band_s_t","band_s_v","sep1","sep2"],
      balloon: {
        anchor: { x: BX + BW/2, y: BY + 145 }, placement: "right",
        text: "Um JWT é: <strong>base64url(header)</strong> + <strong>.</strong> + <strong>base64url(payload)</strong> + <strong>.</strong> + <strong>signature</strong>. Tudo numa única string compacta — pode ir em headers, cookies, URL.",
        why: "Base64url (sem +, / e =) é safe para URL e headers HTTP. O ponto como separador é simples de parsear — nenhuma biblioteca especial necessária."
      }
    },
    {
      title: "Header: Algoritmo e Tipo",
      show: ["band_h","band_h_t","band_h_v","band_p","band_p_t","band_p_v","band_s","band_s_t","band_s_v",
             "hdr_bg","hdr_ttl","hdr_1","hdr_2","hdr_3","hdr_4"],
      highlight: ["band_h","hdr_bg"],
      balloon: {
        anchor: { x: BX + BW/2, y: BY + 250 }, placement: "right",
        text: "<code>alg</code>: o algoritmo de assinatura (<code>HS256</code>, <code>RS256</code>, <code>ES256</code>). <code>typ</code>: sempre <code>JWT</code>. Verifique o <code>alg</code> ao validar — nunca aceite <code>alg:none</code>.",
        why: "Ataques 'alg:none' tentam forjar tokens sem assinatura. Implmentações devem exigir explicitamente o algoritmo esperado, nunca aceitar o que o token declara às cegas."
      }
    },
    {
      title: "Payload: Claims do Token",
      show: ["band_h","band_h_t","band_h_v","band_p","band_p_t","band_p_v","band_s","band_s_t","band_s_v",
             "hdr_bg","hdr_ttl","hdr_2",
             "pay_bg","pay_ttl","pay_1","pay_2","pay_3","pay_4","pay_5","pay_6","pay_7","pay_warn"],
      highlight: ["band_p","pay_bg"],
      balloon: {
        anchor: { x: BX + BW/2, y: BY + 440 }, placement: "right",
        text: "<strong>iss</strong>: quem emitiu. <strong>sub</strong>: sujeito (user_id). <strong>aud</strong>: audiência (para qual API). <strong>exp</strong>: expiração Unix timestamp. <strong>iat</strong>: issued at. <strong>jti</strong>: ID único do token.",
        why: "⚠️ O payload é apenas base64 — não criptografado. Qualquer um pode decodificar e ler. Nunca coloque dados sensíveis (senha, CPF) no payload. Use JWE se precisar criptografar."
      },
      enter(ctx) {
        ["pay_1","pay_2","pay_3","pay_4","pay_5","pay_6","pay_7","pay_warn"].forEach((id,k) =>
          setTimeout(() => ctx.show(id), k * 120));
      }
    },
    {
      title: "Signature: Garantindo Integridade",
      show: ["band_h","band_h_t","band_h_v","band_p","band_p_t","band_p_v","band_s","band_s_t","band_s_v",
             "pay_bg","pay_ttl","pay_4",
             "sig_bg","sig_ttl","sig_1","sig_2","sig_3","sig_4"],
      highlight: ["band_s","sig_bg"],
      balloon: {
        anchor: { x: BX + BW/2, y: BY + 600 }, placement: "right",
        text: "A signature é <code>Sign(header + \".\" + payload, privateKey)</code>. Qualquer alteração no header ou payload invalida a signature — proteção contra tampering.",
        why: "A signature NÃO criptografa o conteúdo — apenas prova que o token não foi alterado desde que foi emitido pelo Auth Server que tem a privateKey."
      }
    },
    {
      title: "Verificação: Sem Consultar o Banco",
      show: ["ver_bg","ver_ttl","ver_cli","ver_srv","ver_pk",
             "ver_a1","ver_a1l","ver_a2","ver_a2l","ver_a3","ver_a3l",
             "ver_note1","ver_note2","ver_note3","ver_note4","ver_note5"],
      balloon: {
        anchor: { x: 910, y: 220 }, placement: "bottom",
        text: "O servidor verifica o JWT <strong>sem consultar banco</strong>: 1) Split nas 3 partes, 2) busca public key no JWKS endpoint (cached), 3) verifica signature, 4) checa <code>exp</code>, <code>iss</code>, <code>aud</code>.",
        why: "Stateless verification = horizontal scaling fácil. Cada instância verifica independentemente sem coordenação. Desvantagem: não dá para revogar um token antes do exp."
      },
      enter(ctx) {
        ctx.drawArrow("ver_a1");
        setTimeout(() => ctx.drawArrow("ver_a2"), 400);
        setTimeout(() => ctx.drawArrow("ver_a3"), 800);
      }
    },
    {
      title: "HS256: Chave Simétrica",
      show: ["ver_bg","ver_ttl","ver_cli","ver_srv","ver_pk",
             "ver_a1","ver_a1l","ver_a2","ver_a2l","ver_a3","ver_a3l",
             "alg_bg","alg_ttl","alg_h1","alg_h2","alg_h3"],
      highlight: ["alg_bg"],
      balloon: {
        anchor: "alg_bg", placement: "right",
        text: "<strong>HS256</strong>: usa uma <em>chave simétrica compartilhada</em>. Todos que podem verificar também podem criar novos tokens. Simples e rápido.",
        why: "Use HS256 quando só um sistema (ex: o próprio backend) precisa verificar — nunca compartilhe a secret entre múltiplos serviços. Vazamento da secret = comprometimento total."
      }
    },
    {
      title: "RS256: Par de Chaves Assimétricas",
      show: ["ver_bg","ver_ttl","ver_cli","ver_srv","ver_pk",
             "ver_a1","ver_a1l","ver_a2","ver_a2l","ver_a3","ver_a3l",
             "alg_bg","alg_ttl","alg_r1","alg_r2","alg_r3"],
      highlight: ["ver_pk"],
      balloon: {
        anchor: "ver_pk", placement: "left",
        text: "<strong>RS256</strong>: Auth Server assina com <em>private key</em>. Qualquer serviço verifica com a <em>public key</em> (disponível no JWKS endpoint). Assimétrico: verificador não pode forjar tokens.",
        why: "RS256 é o padrão para sistemas distribuídos. Auth Server centraliza assinatura. Cada microserviço verifica independentemente com public key — sem compartilhar secrets."
      }
    },
    {
      title: "JWT Stateless: Vantagens e Limitações",
      show: ["ver_bg","ver_ttl","ver_cli","ver_srv",
             "ver_note1","ver_note2","ver_note3","ver_note4","ver_note5"],
      balloon: {
        anchor: { x: 740, y: 210 }, placement: "right",
        text: "<strong>✓ Vantagens</strong>: sem session store, horizontal scaling, microserviços verificam independentemente, informações no token. <strong>✗ Limitações</strong>: não pode revogar antes do <code>exp</code>.",
        why: "Para logout ou revogação de emergência (conta comprometida), o token continuaria válido até expirar. Tokens curtos (15min) minimizam a janela."
      }
    },
    {
      title: "Problema de Revogação + Padrão Recomendado",
      show: ["rev_bg","rev_ttl","rev_1","rev_2","rev_3","rev_4","rev_5","rev_note"],
      highlight: ["rev_bg"],
      balloon: {
        anchor: "rev_bg", placement: "left",
        text: "Padrão: <strong>access_token curto</strong> (15min, stateless JWT) + <strong>refresh_token longo</strong> (7d, stateful no banco). Revogação = deletar refresh token. Blocklist de JTI para casos urgentes.",
        why: "Refresh token rotation: cada uso gera novo refresh e invalida o anterior. Se um refresh vazar, o sistema detecta uso duplicado e revoga a sessão inteira."
      }
    },
    {
      title: "JWT vs Session Cookie",
      show: ["rev_bg","rev_ttl","rev_1","rev_2","rev_3","rev_4","rev_5",
             "alg_bg","alg_ttl","alg_h1","alg_h2","alg_r1","alg_r2"],
      balloon: {
        anchor: { x: 910, y: 460 }, placement: "top",
        text: "<strong>JWT</strong>: stateless, maior payload, revogação difícil, ideal para microserviços e APIs. <strong>Session cookie</strong>: stateful (DB lookup), menor payload, revogação imediata, ideal para monolitos.",
        why: "Para aplicações tradicionais com um banco centralizado, session cookies são mais simples e revocáveis. JWT brilha em sistemas distribuídos com múltiplos services."
      }
    },
    {
      title: "Quiz",
      balloon: { anchor: { x: 640, y: 360 }, placement: "bottom", text: "Teste seu conhecimento sobre JWT:" },
      quiz: {
        question: "Por que o payload de um JWT NÃO deve conter dados sensíveis como senhas ou CPF?",
        options: [
          "Porque o payload excede o limite de 256 bytes do header HTTP",
          "Porque o payload é apenas base64-encoded — qualquer um pode decodificar e ler o conteúdo",
          "Porque o algoritmo RS256 não consegue assinar payloads com caracteres especiais",
          "Porque o servidor não processa o payload durante a verificação da assinatura"
        ],
        answer: 1,
        explain: "Base64url não é criptografia — é apenas codificação. Qualquer pessoa com o token pode decodificar e ler o payload. Use JWE (JSON Web Encryption) se precisar de confidencialidade, ou não coloque dados sensíveis no token."
      }
    },
    {
      title: "Resumo",
      show: ["band_h","band_h_t","band_h_v","band_p","band_p_t","band_p_v","band_s","band_s_t","band_s_v",
             "sep1","sep2",
             "pay_bg","pay_ttl","pay_1","pay_2","pay_3","pay_4",
             "ver_bg","ver_ttl","ver_cli","ver_srv","ver_a1","ver_a1l","ver_a3","ver_a3l",
             "rev_bg","rev_ttl","rev_2","rev_3","rev_4"],
      balloon: {
        anchor: { x: BX + BW/2, y: 400 }, placement: "right",
        text: "<strong>JWT</strong> = header.payload.signature. Payload: claims (sub, exp, iss). Signature: RS256 assimetrico (private/public key). Stateless verify. Padrão: access token curto (15min) + refresh longo (7d).",
        why: "Nunca exponha dado sensível no payload. Use RS256 em sistemas distribuídos. Access token curto = janela de exposição pequena. Refresh token = revogável no banco."
      }
    }
  ];

  window.JWT_DIAGRAM = {
    title: "JWT — JSON Web Tokens",
    subtitle: "Header · Payload · Signature · RS256 · Stateless Verification · Refresh Pattern",
    width: W, height: H, autoplayMs: 9000, elements, steps,
  };
})();
