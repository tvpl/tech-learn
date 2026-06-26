(function () {
  const W = 1280, H = 720;

  /* ── Layout constants ── */
  const BKX = 360, BKY = 120, BKW = 320, BKH = 380; // bucket outline
  const FILL_X = BKX + 20, FILL_W = BKW - 40;        // token fill area inside bucket
  const REQ_X = 80;                                    // request column x
  const RESP_X = 860;                                  // response column x
  const DETAIL_X = 800;                                // right panel x

  /* bucket fill helpers */
  function fillH(ratio) { return Math.round(ratio * (BKH - 40)); }
  function fillY(ratio) { return BKY + 20 + (BKH - 40) - fillH(ratio); }

  const elements = [
    // ── Title label ──
    { id: "title_main", type: "label", x: W / 2, y: 36, text: "Rate Limiting", style: "font-size:22px;font-weight:700;fill:var(--ink)" },

    // ── Bucket outline ──
    { id: "bucket_outline", type: "box", x: BKX, y: BKY, w: BKW, h: BKH, rx: 8, style: "fill:none;stroke:var(--ink-soft);stroke-width:2;stroke-dasharray:6,4" },
    { id: "bucket_label", type: "label", x: BKX + BKW / 2, y: BKY - 18, text: "Token Bucket", style: "font-size:13px;font-weight:600;fill:var(--ink-soft)" },

    // ── Token fill (vector / bar that grows) ──
    { id: "bucket_fill", type: "box", x: FILL_X, y: fillY(1), w: FILL_W, h: fillH(1), rx: 4, style: "fill:var(--accent);opacity:0.25" },
    { id: "bucket_fill_bar", type: "vector", x: FILL_X, y: BKY + 20, w: FILL_W, h: BKH - 40, values: [1], style: "fill:var(--accent);opacity:0.5", vertical: true },

    // ── Token count label ──
    { id: "token_count", type: "label", x: BKX + BKW / 2, y: BKY + BKH / 2, text: "10 / 10 tokens", style: "font-size:16px;font-weight:600;fill:var(--accent)" },

    // ── Refill rate note ──
    { id: "refill_note", type: "label", x: BKX + BKW / 2, y: BKY + BKH + 24, text: "+ 2 tokens / second", style: "font-size:12px;fill:var(--ink-soft)" },

    // ── Request arrows (3 requests) ──
    { id: "req1_box", type: "box", x: REQ_X, y: 180, w: 160, h: 42, rx: 8, style: "fill:var(--accent-2);opacity:0.85" },
    { id: "req1_lbl", type: "label", x: REQ_X + 80, y: 201 + 10, text: "GET /api/data", style: "font-size:12px;fill:#fff;font-weight:600" },
    { id: "req2_box", type: "box", x: REQ_X, y: 260, w: 160, h: 42, rx: 8, style: "fill:var(--accent-2);opacity:0.85" },
    { id: "req2_lbl", type: "label", x: REQ_X + 80, y: 281 + 10, text: "POST /api/order", style: "font-size:12px;fill:#fff;font-weight:600" },
    { id: "req3_box", type: "box", x: REQ_X, y: 340, w: 160, h: 42, rx: 8, style: "fill:var(--hot);opacity:0.9" },
    { id: "req3_lbl", type: "label", x: REQ_X + 80, y: 361 + 10, text: "GET /api/data", style: "font-size:12px;fill:#fff;font-weight:600" },

    // ── Arrows req → bucket ──
    { id: "arr_req1", type: "arrow", x1: REQ_X + 160, y1: 201, x2: BKX, y2: BKY + 100, style: "stroke:var(--accent-2);stroke-width:2" },
    { id: "arr_req2", type: "arrow", x1: REQ_X + 160, y1: 281, x2: BKX, y2: BKY + 180, style: "stroke:var(--accent-2);stroke-width:2" },
    { id: "arr_req3", type: "arrow", x1: REQ_X + 160, y1: 361, x2: BKX, y2: BKY + 260, style: "stroke:var(--hot);stroke-width:2" },

    // ── Responses ──
    { id: "resp_ok1", type: "box", x: RESP_X, y: 180, w: 130, h: 42, rx: 8, style: "fill:var(--good);opacity:0.85" },
    { id: "resp_ok1_lbl", type: "label", x: RESP_X + 65, y: 201 + 10, text: "200 OK ✓", style: "font-size:12px;fill:#fff;font-weight:600" },
    { id: "resp_ok2", type: "box", x: RESP_X, y: 260, w: 130, h: 42, rx: 8, style: "fill:var(--good);opacity:0.85" },
    { id: "resp_ok2_lbl", type: "label", x: RESP_X + 65, y: 281 + 10, text: "200 OK ✓", style: "font-size:12px;fill:#fff;font-weight:600" },
    { id: "resp_429", type: "box", x: RESP_X, y: 340, w: 130, h: 42, rx: 8, style: "fill:var(--hot);opacity:0.9" },
    { id: "resp_429_lbl", type: "label", x: RESP_X + 65, y: 361 + 10, text: "429 Too Many ✗", style: "font-size:11px;fill:#fff;font-weight:600" },

    // ── Arrows bucket → resp ──
    { id: "arr_resp1", type: "arrow", x1: BKX + BKW, y1: BKY + 100, x2: RESP_X, y2: 201, style: "stroke:var(--good);stroke-width:2" },
    { id: "arr_resp2", type: "arrow", x1: BKX + BKW, y1: BKY + 180, x2: RESP_X, y2: 281, style: "stroke:var(--good);stroke-width:2" },
    { id: "arr_resp3", type: "arrow", x1: BKX + BKW, y1: BKY + 260, x2: RESP_X, y2: 361, style: "stroke:var(--hot);stroke-width:2" },

    // ── Detail panels (right side, revealed per step) ──
    // Leaky bucket
    { id: "leaky_panel", type: "box", x: DETAIL_X, y: 120, w: 420, h: 220, rx: 10, style: "fill:var(--surface);stroke:var(--line);stroke-width:1.5" },
    { id: "leaky_title", type: "label", x: DETAIL_X + 210, y: 138, text: "Leaky Bucket", style: "font-size:14px;font-weight:700;fill:var(--ink)" },
    { id: "leaky_desc", type: "label", x: DETAIL_X + 210, y: 165, text: "Requests enter at any rate", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "leaky_desc2", type: "label", x: DETAIL_X + 210, y: 185, text: "but drain at constant rate.", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "leaky_desc3", type: "label", x: DETAIL_X + 210, y: 218, text: "Smooths out bursts.", style: "font-size:12px;fill:var(--accent)" },
    { id: "leaky_vs", type: "label", x: DETAIL_X + 210, y: 248, text: "vs Token Bucket: burst allowed", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "leaky_vs2", type: "label", x: DETAIL_X + 210, y: 268, text: "in token bucket up to capacity", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "leaky_vs3", type: "label", x: DETAIL_X + 210, y: 295, text: "but leaky enforces steady rate", style: "font-size:12px;fill:var(--hot)" },

    // Sliding window
    { id: "sliding_panel", type: "box", x: DETAIL_X, y: 360, w: 420, h: 200, rx: 10, style: "fill:var(--surface);stroke:var(--line);stroke-width:1.5" },
    { id: "sliding_title", type: "label", x: DETAIL_X + 210, y: 378, text: "Sliding Window Counter", style: "font-size:14px;font-weight:700;fill:var(--ink)" },
    { id: "sliding_desc", type: "label", x: DETAIL_X + 210, y: 405, text: "Count requests in rolling time window", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "sliding_desc2", type: "label", x: DETAIL_X + 210, y: 428, text: "e.g. 100 req per 60 seconds", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "sliding_bar", type: "vector", x: DETAIL_X + 20, y: 450, w: 380, h: 40, values: [0.3, 0.7, 0.5, 0.9, 0.6], style: "fill:var(--accent-2);rx:4" },
    { id: "sliding_now", type: "label", x: DETAIL_X + 210, y: 520, text: "← 60s window → now", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sliding_more_accurate", type: "label", x: DETAIL_X + 210, y: 545, text: "More accurate than fixed window", style: "font-size:12px;fill:var(--good)" },

    // Headers panel
    { id: "headers_panel", type: "box", x: DETAIL_X, y: 580, w: 420, h: 120, rx: 10, style: "fill:var(--surface);stroke:var(--line);stroke-width:1.5" },
    { id: "headers_title", type: "label", x: DETAIL_X + 210, y: 598, text: "Rate Limit Headers", style: "font-size:13px;font-weight:700;fill:var(--ink)" },
    { id: "hdr1", type: "label", x: DETAIL_X + 30, y: 622, text: "X-RateLimit-Limit: 100", style: "font-size:11px;font-family:monospace;fill:var(--accent)" },
    { id: "hdr2", type: "label", x: DETAIL_X + 30, y: 642, text: "X-RateLimit-Remaining: 43", style: "font-size:11px;font-family:monospace;fill:var(--good)" },
    { id: "hdr3", type: "label", x: DETAIL_X + 30, y: 662, text: "X-RateLimit-Reset: 1719489600", style: "font-size:11px;font-family:monospace;fill:var(--warn)" },
    { id: "hdr4", type: "label", x: DETAIL_X + 30, y: 682, text: "Retry-After: 15", style: "font-size:11px;font-family:monospace;fill:var(--hot)" },

    // Burst capacity highlight
    { id: "burst_box", type: "box", x: BKX - 10, y: BKY - 10, w: BKW + 20, h: 50, rx: 6, style: "fill:none;stroke:var(--warn);stroke-width:2.5;stroke-dasharray:5,4" },
    { id: "burst_lbl", type: "label", x: BKX + BKW / 2, y: BKY + 20, text: "Burst capacity = full bucket", style: "font-size:12px;fill:var(--warn);font-weight:600" },

    // Empty bucket warning
    { id: "empty_warn", type: "box", x: BKX, y: BKY + BKH - 60, w: BKW, h: 50, rx: 6, style: "fill:var(--hot);opacity:0.15" },
    { id: "empty_warn_lbl", type: "label", x: BKX + BKW / 2, y: BKY + BKH - 28, text: "Bucket empty → 429!", style: "font-size:13px;font-weight:700;fill:var(--hot)" },

    // Quiz
    { id: "quiz_panel", type: "box", x: 200, y: 140, w: 880, h: 440, rx: 12, style: "fill:var(--surface);stroke:var(--accent);stroke-width:2" },
    { id: "quiz_title", type: "label", x: 640, y: 168, text: "Quiz — Rate Limiting", style: "font-size:18px;font-weight:700;fill:var(--ink)" },
    { id: "q1", type: "label", x: 640, y: 220, text: "Q: O que acontece quando o bucket está vazio?", style: "font-size:14px;fill:var(--ink)" },
    { id: "q1a", type: "label", x: 640, y: 255, text: "A: A requisição recebe 429 Too Many Requests", style: "font-size:13px;fill:var(--good)" },
    { id: "q2", type: "label", x: 640, y: 305, text: "Q: Qual a diferença Token Bucket vs Leaky Bucket?", style: "font-size:14px;fill:var(--ink)" },
    { id: "q2a", type: "label", x: 640, y: 340, text: "A: Token permite burst; Leaky drena em taxa constante", style: "font-size:13px;fill:var(--good)" },
    { id: "q3", type: "label", x: 640, y: 390, text: "Q: O que o header X-RateLimit-Reset indica?", style: "font-size:14px;fill:var(--ink)" },
    { id: "q3a", type: "label", x: 640, y: 425, text: "A: Timestamp Unix quando o limite é resetado", style: "font-size:13px;fill:var(--good)" },
    { id: "q4", type: "label", x: 640, y: 475, text: "Q: Por que Sliding Window é mais preciso que Fixed Window?", style: "font-size:14px;fill:var(--ink)" },
    { id: "q4a", type: "label", x: 640, y: 510, text: "A: Evita spike na virada do janela fixa", style: "font-size:13px;fill:var(--good)" },

    // Summary
    { id: "sum_panel", type: "box", x: 160, y: 100, w: 960, h: 520, rx: 12, style: "fill:var(--surface);stroke:var(--line);stroke-width:1.5" },
    { id: "sum_title", type: "label", x: 640, y: 130, text: "Rate Limiting — Resumo", style: "font-size:20px;font-weight:700;fill:var(--ink)" },
    { id: "s1", type: "box", x: 200, y: 160, w: 380, h: 150, rx: 8, style: "fill:var(--accent);opacity:0.12" },
    { id: "s1t", type: "label", x: 390, y: 180, text: "Token Bucket", style: "font-size:13px;font-weight:700;fill:var(--accent)" },
    { id: "s1d", type: "label", x: 390, y: 200, text: "Tokens acumulam até capacity", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "s1d2", type: "label", x: 390, y: 220, text: "Burst permitido", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "s1d3", type: "label", x: 390, y: 240, text: "Reposição a taxa fixa", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "s1d4", type: "label", x: 390, y: 268, text: "Mais comum em APIs públicas", style: "font-size:12px;fill:var(--accent)" },
    { id: "s2", type: "box", x: 700, y: 160, w: 380, h: 150, rx: 8, style: "fill:var(--accent-2);opacity:0.12" },
    { id: "s2t", type: "label", x: 890, y: 180, text: "Sliding Window", style: "font-size:13px;font-weight:700;fill:var(--accent-2)" },
    { id: "s2d", type: "label", x: 890, y: 200, text: "Janela deslizante no tempo", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "s2d2", type: "label", x: 890, y: 220, text: "Sem spike na virada", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "s2d3", type: "label", x: 890, y: 240, text: "Mais preciso, mais memória", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "s2d4", type: "label", x: 890, y: 268, text: "Implementado no Redis tipicamente", style: "font-size:12px;fill:var(--accent-2)" },
    { id: "s3", type: "box", x: 200, y: 340, w: 880, h: 100, rx: 8, style: "fill:var(--good);opacity:0.1" },
    { id: "s3t", type: "label", x: 640, y: 360, text: "Por que Rate Limiting?", style: "font-size:13px;font-weight:700;fill:var(--good)" },
    { id: "s3d", type: "label", x: 640, y: 382, text: "Protege contra abuso, DoS, e esgotamento de recursos downstream", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "s3d2", type: "label", x: 640, y: 402, text: "Garante SLA para todos os clientes mesmo sob carga elevada", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "s3d3", type: "label", x: 640, y: 422, text: "Implementação: API Gateway, middleware, Redis (INCR + EXPIRE)", style: "font-size:12px;fill:var(--good)" },
    { id: "sum_note", type: "label", x: 640, y: 495, text: "Sempre retorne Retry-After para clientes saberem quando tentar novamente", style: "font-size:13px;font-weight:600;fill:var(--accent)" },
  ];

  const ALL_IDS = elements.map(e => e.id);
  const INIT_VISIBLE = new Set(["title_main", "bucket_outline", "bucket_label", "bucket_fill_bar", "token_count", "refill_note"]);

  const steps = [
    {
      title: "O Problema",
      text: "Sem controle, um único cliente pode fazer milhares de requisições por segundo, esgotando recursos e prejudicando todos os outros usuários.",
      why: "Rate limiting é a primeira linha de defesa contra abuso, DoS acidental e thundering herd.",
      balloonAnchor: { x: 640, y: 680 },
      placement: "top",
      enter(ctx) {
        ALL_IDS.forEach(id => ctx.hide(id));
        ctx.show("title_main");
        // Show problem: overloaded bucket
        ctx.show("bucket_outline"); ctx.show("bucket_label");
        ctx.setBars("bucket_fill_bar", [1]);
        ctx.show("bucket_fill_bar");
        ctx.show("token_count");
        ctx.show("refill_note");
        ctx.show("req1_box"); ctx.show("req1_lbl");
        ctx.show("req2_box"); ctx.show("req2_lbl");
        ctx.show("req3_box"); ctx.show("req3_lbl");
      }
    },
    {
      title: "Token Bucket — Conceito",
      text: "O Token Bucket mantém um balde com N tokens. Cada requisição consome 1 token. Tokens são repostos a uma taxa fixa. Sem tokens = requisição bloqueada.",
      why: "É o algoritmo mais usado em APIs públicas por permitir bursts controlados.",
      balloonAnchor: "bucket_label",
      placement: "bottom",
      enter(ctx) {
        ALL_IDS.forEach(id => ctx.hide(id));
        ctx.show("title_main");
        ctx.show("bucket_outline"); ctx.show("bucket_label");
        ctx.setBars("bucket_fill_bar", [0.8]);
        ctx.show("bucket_fill_bar");
        ctx.show("token_count");
        ctx.show("refill_note");
        ctx.el("token_count").textContent = "8 / 10 tokens";
      }
    },
    {
      title: "Tokens se Renovam",
      text: "A cada segundo (ou fração), novos tokens são adicionados ao balde até o limite máximo (capacity). O balde nunca transborda.",
      why: "A taxa de refill define o throughput sustentável; a capacidade define o burst máximo.",
      balloonAnchor: "refill_note",
      placement: "bottom",
      enter(ctx) {
        ALL_IDS.forEach(id => ctx.hide(id));
        ctx.show("title_main");
        ctx.show("bucket_outline"); ctx.show("bucket_label");
        ctx.setBars("bucket_fill_bar", [0.3]);
        ctx.show("bucket_fill_bar");
        ctx.show("token_count"); ctx.show("refill_note");
        ctx.el("token_count").textContent = "3 / 10 tokens";
        setTimeout(() => {
          ctx.setBars("bucket_fill_bar", [0.6]);
          ctx.el("token_count").textContent = "6 / 10 tokens";
        }, 600);
        setTimeout(() => {
          ctx.setBars("bucket_fill_bar", [1]);
          ctx.el("token_count").textContent = "10 / 10 tokens";
        }, 1200);
      }
    },
    {
      title: "Requisição Chega: Consome 1 Token",
      text: "Cada requisição aceita remove 1 token do balde. O balde vai esvaziando conforme as requisições chegam.",
      why: "O consumo é instantâneo — o rate limiter decide em microsegundos se aceita ou rejeita.",
      balloonAnchor: "req1_box",
      placement: "right",
      enter(ctx) {
        ALL_IDS.forEach(id => ctx.hide(id));
        ctx.show("title_main");
        ctx.show("bucket_outline"); ctx.show("bucket_label");
        ctx.setBars("bucket_fill_bar", [0.7]);
        ctx.show("bucket_fill_bar");
        ctx.show("token_count"); ctx.show("refill_note");
        ctx.el("token_count").textContent = "7 / 10 tokens";
        ctx.show("req1_box"); ctx.show("req1_lbl");
        ctx.show("arr_req1");
        setTimeout(() => {
          ctx.setBars("bucket_fill_bar", [0.6]);
          ctx.el("token_count").textContent = "6 / 10 tokens";
        }, 700);
      }
    },
    {
      title: "Bucket com Tokens: ALLOWED",
      text: "Enquanto houver tokens, a requisição passa e recebe resposta 200 OK.",
      why: "O custo de verificação é mínimo: uma operação atômica DECR no Redis ou um check em memória.",
      balloonAnchor: "resp_ok1",
      placement: "right",
      enter(ctx) {
        ALL_IDS.forEach(id => ctx.hide(id));
        ctx.show("title_main");
        ctx.show("bucket_outline"); ctx.show("bucket_label");
        ctx.setBars("bucket_fill_bar", [0.6]);
        ctx.show("bucket_fill_bar");
        ctx.show("token_count"); ctx.show("refill_note");
        ctx.el("token_count").textContent = "6 / 10 tokens";
        ctx.show("req1_box"); ctx.show("req1_lbl"); ctx.show("arr_req1");
        ctx.show("req2_box"); ctx.show("req2_lbl"); ctx.show("arr_req2");
        ctx.show("resp_ok1"); ctx.show("resp_ok1_lbl"); ctx.show("arr_resp1");
        ctx.show("resp_ok2"); ctx.show("resp_ok2_lbl"); ctx.show("arr_resp2");
      }
    },
    {
      title: "Bucket Vazio: 429 Too Many Requests",
      text: "Quando o balde está vazio, a requisição é rejeitada imediatamente com HTTP 429. Nenhum processamento caro é feito.",
      why: "Rejeitar cedo é eficiente: protege todos os serviços downstream sem custo computacional.",
      balloonAnchor: "resp_429",
      placement: "right",
      enter(ctx) {
        ALL_IDS.forEach(id => ctx.hide(id));
        ctx.show("title_main");
        ctx.show("bucket_outline"); ctx.show("bucket_label");
        ctx.setBars("bucket_fill_bar", [0.05]);
        ctx.show("bucket_fill_bar");
        ctx.show("token_count"); ctx.show("refill_note");
        ctx.el("token_count").textContent = "0 / 10 tokens";
        ctx.show("req3_box"); ctx.show("req3_lbl"); ctx.show("arr_req3");
        ctx.show("resp_429"); ctx.show("resp_429_lbl"); ctx.show("arr_resp3");
        ctx.show("empty_warn"); ctx.show("empty_warn_lbl");
      }
    },
    {
      title: "Burst Capacity",
      text: "A capacidade máxima do bucket define o burst: quantas requisições simultâneas são aceitas antes de começar a rejeitar.",
      why: "Burst é essencial para tráfego real que nunca é perfeitamente uniforme. Ex: 1000 req/min com burst de 200.",
      balloonAnchor: "bucket_label",
      placement: "bottom",
      enter(ctx) {
        ALL_IDS.forEach(id => ctx.hide(id));
        ctx.show("title_main");
        ctx.show("bucket_outline"); ctx.show("bucket_label");
        ctx.setBars("bucket_fill_bar", [1]);
        ctx.show("bucket_fill_bar");
        ctx.show("token_count"); ctx.show("refill_note");
        ctx.el("token_count").textContent = "10 / 10 tokens";
        ctx.show("burst_box"); ctx.show("burst_lbl");
      }
    },
    {
      title: "Leaky Bucket — Alternativa",
      text: "No Leaky Bucket, as requisições entram em qualquer taxa mas saem (drain) em taxa constante. Bursts são suavizados — não existe resposta imediata.",
      why: "Preferido quando você quer tráfego uniforme para serviços frágeis, mas aumenta latência em bursts.",
      balloonAnchor: { x: 1010, y: 240 },
      placement: "left",
      enter(ctx) {
        ALL_IDS.forEach(id => ctx.hide(id));
        ctx.show("title_main");
        ctx.show("leaky_panel"); ctx.show("leaky_title");
        ctx.show("leaky_desc"); ctx.show("leaky_desc2"); ctx.show("leaky_desc3");
        ctx.show("leaky_vs"); ctx.show("leaky_vs2"); ctx.show("leaky_vs3");
        ctx.show("bucket_outline"); ctx.show("bucket_label");
        ctx.setBars("bucket_fill_bar", [0.7]);
        ctx.show("bucket_fill_bar");
        ctx.show("token_count"); ctx.show("refill_note");
        ctx.el("token_count").textContent = "Drain constante";
      }
    },
    {
      title: "Sliding Window Counter",
      text: "Conta requisições em uma janela deslizante de tempo (ex: últimos 60 segundos). Evita o spike que ocorre na virada da janela fixa.",
      why: "No fixed window, 200 requests poderiam passar em 1 segundo na virada. Sliding window previne isso.",
      balloonAnchor: { x: 1010, y: 460 },
      placement: "left",
      enter(ctx) {
        ALL_IDS.forEach(id => ctx.hide(id));
        ctx.show("title_main");
        ctx.show("sliding_panel"); ctx.show("sliding_title");
        ctx.show("sliding_desc"); ctx.show("sliding_desc2");
        ctx.show("sliding_bar");
        ctx.show("sliding_now"); ctx.show("sliding_more_accurate");
      }
    },
    {
      title: "Headers: X-RateLimit-*",
      text: "Retorne sempre os headers padrão para que clientes possam se adaptar: Limit, Remaining, Reset e Retry-After no 429.",
      why: "Sem esses headers, clientes fazem retry agressivo (backoff exponencial cego) piorando a situação.",
      balloonAnchor: { x: 1010, y: 640 },
      placement: "left",
      enter(ctx) {
        ALL_IDS.forEach(id => ctx.hide(id));
        ctx.show("title_main");
        ctx.show("headers_panel"); ctx.show("headers_title");
        ctx.show("hdr1"); ctx.show("hdr2"); ctx.show("hdr3"); ctx.show("hdr4");
      }
    },
    {
      title: "Quiz",
      balloon: { anchor: { x: 640, y: 360 }, placement: "bottom", text: "Teste seu conhecimento sobre Rate Limiting:" },
      quiz: {
        question: "O que acontece quando o Token Bucket está completamente vazio?",
        options: [
          "A requisição aguarda na fila até um token estar disponível",
          "429 Too Many Requests é retornado imediatamente",
          "O sistema reinicia o bucket e permite a requisição",
          "A requisição é roteada para um servidor alternativo"
        ],
        answer: 1,
        explain: "Bucket vazio → rejeição imediata com 429. Nenhuma espera. O cliente deve respeitar o header X-RateLimit-Reset e tentar novamente após os tokens se renovarem."
      }
    },
    {
      title: "Resumo",
      text: "Rate Limiting protege sistemas contra abuso e garante fairness entre clientes. Token Bucket para APIs, Sliding Window para precisão.",
      why: "",
      balloonAnchor: { x: 640, y: 680 },
      placement: "top",
      enter(ctx) {
        ALL_IDS.forEach(id => ctx.hide(id));
        ctx.show("sum_panel"); ctx.show("sum_title");
        ctx.show("s1"); ctx.show("s1t"); ctx.show("s1d"); ctx.show("s1d2"); ctx.show("s1d3"); ctx.show("s1d4");
        ctx.show("s2"); ctx.show("s2t"); ctx.show("s2d"); ctx.show("s2d2"); ctx.show("s2d3"); ctx.show("s2d4");
        ctx.show("s3"); ctx.show("s3t"); ctx.show("s3d"); ctx.show("s3d2"); ctx.show("s3d3");
        ctx.show("sum_note");
      }
    }
  ];

  window.RATE_LIMIT_DIAGRAM = { title: "Rate Limiting", subtitle: "Token Bucket · Leaky Bucket · Sliding Window", width: W, height: H, autoplayMs: 8000, elements, steps };
})();
