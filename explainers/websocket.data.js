(function () {
  const W = 1280, H = 720;

  // ── Layout ────────────────────────────────────────────────────────────────
  // Left panel: sequence diagram (Client | Server lifelines)
  // Right panel: frame anatomy zoom

  const CX = 200, SX = 680;          // lifeline X centres
  const LY = 60;                      // lifeline header Y
  const LH = 620;                     // lifeline height
  const FX = 820, FW = 420, FY = 80; // frame detail zone

  // helper: horizontal arrow message between lifelines
  const msg = (id, fromX, toX, y, label, color) => [
    { id, type: "arrow", x1: fromX + 16, y1: y, x2: toX - 16, y2: y,
      color: color || "var(--accent)" },
    { id: id + "_l", type: "label", x: (fromX + toX) / 2, y: y - 13,
      anchor: "middle", sub: true, mono: true, label },
  ];

  const elements = [
    // ── Lifelines ──
    { id: "lbl_c", type: "box", x: CX - 60, y: LY, w: 120, h: 44, rx: 8,
      fill: "var(--panel-2)", stroke: "var(--accent)", label: "🖥️  Client" },
    { id: "lbl_s", type: "box", x: SX - 60, y: LY, w: 120, h: 44, rx: 8,
      fill: "var(--panel-2)", stroke: "var(--good)", label: "☁️  Server" },
    { id: "life_c", type: "arrow", x1: CX, y1: LY + 44, x2: CX, y2: LY + LH,
      noHead: true, dashed: true, color: "var(--accent)" },
    { id: "life_s", type: "arrow", x1: SX, y1: LY + 44, x2: SX, y2: LY + LH,
      noHead: true, dashed: true, color: "var(--good)" },

    // ── HTTP Polling (step 2 — long polling) ──
    { id: "poll1",  type: "label", x: CX - 80, y: 180, anchor: "end", sub: true, label: "GET /updates" },
    { id: "poll1a", type: "arrow", x1: CX + 16, y1: 175, x2: SX - 16, y2: 175, color: "var(--muted)" },
    { id: "poll1b", type: "label", x: (CX+SX)/2, y: 162, anchor: "middle", sub: true, mono: true, label: "GET /updates (long-polling)" },
    { id: "poll2",  type: "arrow", x1: SX - 16, y1: 230, x2: CX + 16, y2: 230, color: "var(--muted)" },
    { id: "poll2b", type: "label", x: (CX+SX)/2, y: 217, anchor: "middle", sub: true, mono: true, label: "⏱  wait 30s → 200 OK (maybe)" },
    { id: "poll3",  type: "arrow", x1: CX + 16, y1: 280, x2: SX - 16, y2: 280, color: "var(--muted)" },
    { id: "poll3b", type: "label", x: (CX+SX)/2, y: 267, anchor: "middle", sub: true, mono: true, label: "GET /updates again…" },
    { id: "poll_lbl", type: "token", x: CX - 80, y: 295, w: 180, h: 36,
      fill: "#3a1010", stroke: "var(--hot)", label: "🔁  Polling loop — overhead!" },

    // ── Handshake (step 4) ──
    ...msg("hs1", CX, SX, 175, "GET /chat HTTP/1.1↵Upgrade: websocket↵Sec-WS-Key: …", "var(--warn)"),
    ...msg("hs2", SX, CX, 250, "101 Switching Protocols↵Sec-WS-Accept: …", "var(--good)"),
    { id: "hs_badge", type: "token", x: (CX+SX)/2 - 100, y: 268, w: 200, h: 32,
      fill: "#102212", stroke: "var(--good)", label: "✓ Upgraded — TCP reused" },

    // ── Full-duplex messages (steps 5-8) ──
    ...msg("m_cs1", CX, SX, 330, "\"Hello from client\"  [text frame]", "var(--accent)"),
    ...msg("m_sc1", SX, CX, 390, "\"Hello from server\"  [text frame]", "var(--good)"),
    ...msg("m_cs2", CX, SX, 450, "\"binary data…\"  [binary frame]", "var(--accent-2)"),
    { id: "bc1",  type: "arrow", x1: SX + 16, y1: 450, x2: SX + 90, y2: 450, color: "var(--good)" },
    { id: "bc1l", type: "label", x: SX + 55, y: 437, anchor: "middle", sub: true, mono: true, label: "client2" },
    { id: "bc2",  type: "arrow", x1: SX + 16, y1: 475, x2: SX + 90, y2: 475, color: "var(--good)" },
    { id: "bc2l", type: "label", x: SX + 55, y: 462, anchor: "middle", sub: true, mono: true, label: "client3" },

    // ── Ping/pong (step 10) ──
    ...msg("ping1", CX, SX, 510, "PING (0x9)", "var(--warn)"),
    ...msg("pong1", SX, CX, 555, "PONG (0xA)", "var(--warn)"),

    // ── Close (step 11) ──
    ...msg("cls1", CX, SX, 590, "CLOSE (0x8) code=1000 Normal", "var(--hot)"),
    ...msg("cls2", SX, CX, 630, "CLOSE (0x8) echo", "var(--hot)"),

    // ── Frame anatomy zone (right panel) ──
    { id: "fr_bg",  type: "box", x: FX - 10, y: FY, w: FW + 20, h: 500, rx: 12,
      fill: "var(--panel)", stroke: "var(--line)" },
    { id: "fr_ttl", type: "label", x: FX + FW/2, y: FY + 22, anchor: "middle",
      label: "WebSocket Frame Anatomy" },

    // FIN + RSV + Opcode byte
    { id: "fr_r1",  type: "box", x: FX, y: FY + 50, w: 50, h: 40, rx: 4,
      fill: "#102212", stroke: "var(--good)", label: "FIN" },
    { id: "fr_r2",  type: "box", x: FX + 55, y: FY + 50, w: 90, h: 40, rx: 4,
      fill: "var(--panel-2)", stroke: "var(--line)", label: "RSV 1-3" },
    { id: "fr_r3",  type: "box", x: FX + 150, y: FY + 50, w: 140, h: 40, rx: 4,
      fill: "#1a1033", stroke: "var(--accent-2)", label: "Opcode (4b)" },
    { id: "fr_r3l", type: "label", x: FX + 150, y: FY + 108, sub: true,
      label: "0x1=text 0x2=bin 0x8=close 0x9=ping" },
    { id: "fr_r4",  type: "box", x: FX + 300, y: FY + 50, w: 110, h: 40, rx: 4,
      fill: "#1a1010", stroke: "var(--warn)", label: "MASK bit" },
    { id: "fr_r4l", type: "label", x: FX + 300, y: FY + 108, sub: true,
      label: "1 = client→server" },

    // Payload length
    { id: "fr_r5",  type: "box", x: FX, y: FY + 130, w: 200, h: 40, rx: 4,
      fill: "var(--panel-2)", stroke: "var(--accent)", label: "Payload Len (7b)" },
    { id: "fr_r5l", type: "label", x: FX, y: FY + 188, sub: true,
      label: "≤125 → inline  126 → next 2B  127 → next 8B" },

    // Masking key
    { id: "fr_r6",  type: "box", x: FX + 210, y: FY + 130, w: 200, h: 40, rx: 4,
      fill: "#1a1010", stroke: "var(--warn)", label: "Masking Key (32b)" },
    { id: "fr_r6l", type: "label", x: FX + 210, y: FY + 188, sub: true,
      label: "XOR applied when MASK=1" },

    // Payload
    { id: "fr_r7",  type: "box", x: FX, y: FY + 210, w: FW, h: 60, rx: 4,
      fill: "#112318", stroke: "var(--good)", label: ["Payload Data", "(0 to 2⁶³ bytes)"] },

    // Comparison table
    { id: "cmp_bg",  type: "box", x: FX - 10, y: FY + 290, w: FW + 20, h: 195, rx: 8,
      fill: "var(--panel-2)", stroke: "var(--line)" },
    { id: "cmp_ttl", type: "label", x: FX + FW/2, y: FY + 312, anchor: "middle",
      label: "WS vs SSE vs HTTP/2 Push" },
    ...[
      ["Protocol",   "WebSocket",  "SSE",     "HTTP/2 Push"],
      ["Direction",  "Full-duplex","S→C only","S→C only"],
      ["Protocol",   "ws:// wss://","HTTP/1.1+","HTTP/2"],
      ["Binary",     "✓ native",   "text only","✓ frames"],
      ["Best for",   "chat, games","live feed","page assets"],
    ].flatMap(([k, a, b, c], i) => [
      { id: `cmp_${i}k`, type: "label", x: FX,        y: FY + 340 + i * 26, sub: true, mono: false, label: k },
      { id: `cmp_${i}a`, type: "label", x: FX + 150,  y: FY + 340 + i * 26, sub: true, anchor: "middle", label: a },
      { id: `cmp_${i}b`, type: "label", x: FX + 270,  y: FY + 340 + i * 26, sub: true, anchor: "middle", label: b },
      { id: `cmp_${i}c`, type: "label", x: FX + 370,  y: FY + 340 + i * 26, sub: true, anchor: "middle", label: c },
    ]),
  ];

  const ALL_IDS = elements.map(e => e.id);

  const steps = [
    {
      title: "O Problema: HTTP não serve para Real-time",
      show: ["lbl_c", "lbl_s", "life_c", "life_s"],
      highlight: [],
      balloon: {
        anchor: { x: 440, y: 200 }, placement: "right",
        text: "HTTP é <strong>request-response</strong>: o servidor só responde quando o cliente pergunta. Para chat, jogos ou dashboards ao vivo, precisamos que o servidor envie dados <em>a qualquer momento</em>.",
        why: "Cada requisição HTTP cria nova conexão TCP (ou reutiliza via keep-alive), mas o servidor nunca inicia a comunicação — o cliente sempre puxa."
      }
    },
    {
      title: "Long-Polling: A Gambiarra",
      show: ["lbl_c", "lbl_s", "life_c", "life_s",
             "poll1", "poll1a", "poll1b", "poll2", "poll2b", "poll3", "poll3b", "poll_lbl"],
      balloon: {
        anchor: { x: 440, y: 230 }, placement: "right",
        text: "Long-polling: o cliente faz GET e o servidor <strong>segura a conexão aberta</strong> até ter algo para responder. Quando responde, o cliente abre outra conexão imediatamente.",
        why: "Funciona, mas desperdiça threads no servidor, tem latência de reconexão e explode em escala. Não é uma solução, é uma adaptação."
      }
    },
    {
      title: "WebSocket: Full-Duplex Persistente",
      show: ["lbl_c", "lbl_s", "life_c", "life_s"],
      highlight: ["lbl_c", "lbl_s"],
      balloon: {
        anchor: { x: 440, y: 200 }, placement: "right",
        text: "WebSocket estabelece um <strong>canal TCP persistente e bidirecional</strong>. Depois do handshake inicial, tanto cliente quanto servidor podem enviar mensagens a qualquer momento, sem overhead de headers HTTP.",
        why: "TCP já é bidirecional — WebSocket apenas expõe isso na camada de aplicação com um protocolo de framing leve."
      }
    },
    {
      title: "HTTP Upgrade Handshake (101)",
      show: ["lbl_c", "lbl_s", "life_c", "life_s", "hs1", "hs1_l", "hs2", "hs2_l", "hs_badge"],
      balloon: {
        anchor: { x: 440, y: 210 }, placement: "right",
        text: "<strong>O handshake começa como HTTP/1.1 GET</strong> com headers especiais:<br><code>Upgrade: websocket</code><br><code>Connection: Upgrade</code><br><code>Sec-WebSocket-Key: &lt;base64 random&gt;</code><br>Servidor responde <strong>101 Switching Protocols</strong>.",
        why: "Usar HTTP para negociar o upgrade permite atravessar proxies e firewalls que já entendem HTTP. A partir daí o protocolo muda para WebSocket frames."
      },
      enter(ctx) { ctx.drawArrow("hs1"); ctx.drawArrow("hs2"); }
    },
    {
      title: "Conexão Estabelecida — Canal Reutilizado",
      show: ["lbl_c", "lbl_s", "life_c", "life_s", "hs1", "hs1_l", "hs2", "hs2_l", "hs_badge"],
      balloon: {
        anchor: "hs_badge", placement: "right",
        text: "Após o 101, a <strong>mesma conexão TCP</strong> é reutilizada para o protocolo WebSocket. Não há mais overhead de cabeçalhos HTTP nem nova conexão a cada mensagem.",
        why: "O TCP three-way handshake (e TLS se wss://) foi feito uma única vez. Economiza ~100ms por mensagem em redes típicas."
      }
    },
    {
      title: "Anatomia do Frame WebSocket",
      show: ["lbl_c", "lbl_s", "life_c", "life_s", "hs_badge",
             "fr_bg", "fr_ttl", "fr_r1", "fr_r2", "fr_r3", "fr_r3l",
             "fr_r4", "fr_r4l", "fr_r5", "fr_r5l", "fr_r6", "fr_r6l", "fr_r7"],
      balloon: {
        anchor: { x: FX + FW/2, y: FY + 50 }, placement: "bottom",
        text: "<strong>FIN</strong>: último fragmento do msg. <strong>Opcode</strong>: tipo (text/binary/close/ping/pong). <strong>MASK</strong>: clientes mascariam payload (segurança contra proxies). <strong>Payload Len</strong>: tamanho variável.",
        why: "Frames são leves: header mínimo de 2 bytes (vs ~400 bytes em headers HTTP típicos). Ideal para mensagens frequentes e pequenas."
      },
      enter(ctx) {
        ["fr_r1","fr_r2","fr_r3","fr_r4","fr_r5","fr_r6","fr_r7"].forEach((id, k) =>
          setTimeout(() => ctx.show(id), k * 120));
      }
    },
    {
      title: "Cliente → Servidor: Mensagem de Texto",
      show: ["lbl_c", "lbl_s", "life_c", "life_s", "hs_badge",
             "fr_bg", "fr_ttl", "fr_r1","fr_r2","fr_r3","fr_r3l","fr_r4","fr_r4l","fr_r5","fr_r5l","fr_r6","fr_r6l","fr_r7",
             "m_cs1", "m_cs1_l"],
      balloon: {
        anchor: { x: (CX+SX)/2, y: 330 }, placement: "bottom",
        text: "<strong>Opcode 0x1</strong> (text frame). Payload é UTF-8. O bit MASK está ativado — cliente <em>deve</em> mascarar todos os frames enviados ao servidor (RFC 6455).",
        why: "A máscara (XOR com 32-bit key aleatória) evita que proxies transparentes cacheiem ou modifiquem dados WebSocket incorretamente."
      },
      enter(ctx) { ctx.drawArrow("m_cs1"); }
    },
    {
      title: "Servidor → Múltiplos Clientes (Broadcast)",
      show: ["lbl_c", "lbl_s", "life_c", "life_s", "hs_badge",
             "m_cs1", "m_cs1_l", "m_sc1", "m_sc1_l", "bc1", "bc1l", "bc2", "bc2l"],
      balloon: {
        anchor: { x: SX, y: 450 }, placement: "right",
        text: "O servidor pode fazer <strong>broadcast</strong>: enviar a mesma mensagem para múltiplas conexões WebSocket simultâneas. Frames do servidor para o cliente <em>não</em> são mascarados.",
        why: "Típico em chat: quando um usuário envia, o servidor redistribui para todos na mesma sala. O servidor mantém um registry de conexões ativas."
      },
      enter(ctx) {
        ctx.drawArrow("m_sc1");
        setTimeout(() => { ctx.drawArrow("bc1"); ctx.drawArrow("bc2"); }, 300);
      }
    },
    {
      title: "Opcodes: Tipos de Frame",
      show: ["lbl_c", "lbl_s", "life_c", "life_s",
             "fr_bg", "fr_ttl", "fr_r3", "fr_r3l"],
      highlight: ["fr_r3"],
      balloon: {
        anchor: { x: FX + 220, y: FY + 70 }, placement: "bottom",
        text: "<strong>0x1</strong> Text (UTF-8) · <strong>0x2</strong> Binary (bytes livres) · <strong>0x8</strong> Close · <strong>0x9</strong> Ping · <strong>0xA</strong> Pong<br>Opcodes 0x3–0x7 e 0xB–0xF reservados para extensões futuras.",
        why: "Separar text de binary permite que implementações validem UTF-8 só quando necessário. Ping/pong são controle de conexão em nível de protocolo, não de aplicação."
      }
    },
    {
      title: "Heartbeat: Ping / Pong",
      show: ["lbl_c", "lbl_s", "life_c", "life_s",
             "ping1", "ping1_l", "pong1", "pong1_l"],
      balloon: {
        anchor: { x: (CX+SX)/2, y: 530 }, placement: "bottom",
        text: "Cliente (ou servidor) envia <strong>PING</strong> periodicamente. O receptor <em>deve</em> responder com <strong>PONG</strong> imediatamente. Ausência de pong → conexão morta → fechar e reconectar.",
        why: "Conexões TCP podem ficar 'silenciosamente quebradas' por NATs e firewalls que expiram entradas idle. O heartbeat mantém o estado ativo."
      },
      enter(ctx) { ctx.drawArrow("ping1"); setTimeout(() => ctx.drawArrow("pong1"), 400); }
    },
    {
      title: "Close Handshake (Encerramento Gracioso)",
      show: ["lbl_c", "lbl_s", "life_c", "life_s",
             "ping1", "ping1_l", "pong1", "pong1_l",
             "cls1", "cls1_l", "cls2", "cls2_l"],
      balloon: {
        anchor: { x: (CX+SX)/2, y: 610 }, placement: "top",
        text: "Quem quer fechar envia <strong>close frame</strong> (opcode 0x8) com código de status. O receptor ecoa o close frame e então o TCP é finalizado. Códigos: 1000=normal, 1001=going away, 1002=protocol error.",
        why: "Diferente de TCP RST, o close handshake garante que ambos lados concordaram em encerrar e que todos os frames anteriores foram processados."
      },
      enter(ctx) { ctx.drawArrow("cls1"); setTimeout(() => ctx.drawArrow("cls2"), 400); }
    },
    {
      title: "WS vs SSE vs HTTP/2 Push",
      show: ["lbl_c", "lbl_s", "life_c", "life_s",
             "fr_bg", "fr_ttl",
             "cmp_bg", "cmp_ttl",
             ...Array.from({length:5}, (_,i) => [`cmp_${i}k`,`cmp_${i}a`,`cmp_${i}b`,`cmp_${i}c`]).flat()],
      balloon: {
        anchor: { x: FX + FW/2, y: FY + 310 }, placement: "top",
        text: "Use <strong>WebSocket</strong> para comunicação bidirecional (chat, games, colaboração). Use <strong>SSE</strong> para push simples server→client (dashboards, notificações). <strong>HTTP/2 Push</strong> é para recursos de página.",
        why: "SSE é mais simples de implementar e atravessa proxies HTTP com mais facilidade. WebSocket exige suporte explícito em load balancers e reverse proxies."
      }
    },
    {
      title: "Quiz",
      balloon: { anchor: { x: 640, y: 360 }, placement: "bottom", text: "Teste seu conhecimento sobre WebSockets:" },
      quiz: {
        question: "Por que o cliente WebSocket DEVE mascarar todos os frames enviados ao servidor?",
        options: [
          "Para criptografar o conteúdo e garantir confidencialidade",
          "Para evitar que proxies transparentes cacheiem ou modifiquem dados WebSocket",
          "Porque o servidor não consegue processar frames não mascarados",
          "Para reduzir o tamanho do payload com uma forma de compressão"
        ],
        answer: 1,
        explain: "A máscara XOR (RFC 6455) protege contra proxies que, ao não reconhecer WebSocket, podem interpretar frames como requests HTTP e causar cache poisoning. Não provê confidencialidade — use wss:// (TLS) para isso."
      }
    },
    {
      title: "Resumo",
      show: ["lbl_c", "lbl_s", "life_c", "life_s",
             "hs1","hs1_l","hs2","hs2_l","hs_badge",
             "m_cs1","m_cs1_l","m_sc1","m_sc1_l",
             "ping1","ping1_l","pong1","pong1_l",
             "fr_bg","fr_ttl","fr_r3","fr_r3l"],
      highlight: ["lbl_c", "lbl_s"],
      balloon: {
        anchor: { x: 440, y: 400 }, placement: "right",
        text: "<strong>WebSocket</strong> = HTTP Upgrade 101 → canal TCP full-duplex. Frames leves com opcode, mask e payload. Heartbeat via ping/pong. Close gracioso com código de status.",
        why: "Escolha WebSocket quando o servidor precisa iniciar mensagens ao cliente com baixa latência. Caso contrário, SSE é mais simples e suficiente."
      }
    }
  ];

  window.WEBSOCKET_DIAGRAM = {
    title: "WebSockets",
    subtitle: "Full-duplex · Frames · Opcodes · Heartbeat · RFC 6455",
    width: W, height: H, autoplayMs: 9000, elements, steps,
  };
})();
