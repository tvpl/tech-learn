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
    { id: "title_main", type: "label", x: W / 2, y: 36, label: "Rate Limiting", style: "font-size:22px;font-weight:700;fill:var(--ink)" },

    // ── Bucket outline ──
    { id: "bucket_outline", type: "box", x: BKX, y: BKY, w: BKW, h: BKH, rx: 8, style: "fill:none;stroke:var(--ink-soft);stroke-width:2;stroke-dasharray:6,4" },
    { id: "bucket_label", type: "label", x: BKX + BKW / 2, y: BKY - 18, label: "Token Bucket", style: "font-size:13px;font-weight:600;fill:var(--ink-soft)" },

    // ── Token fill (vector / bar that grows) ──
    { id: "bucket_fill", type: "box", x: FILL_X, y: fillY(1), w: FILL_W, h: fillH(1), rx: 4, style: "fill:var(--accent);opacity:0.25" },
    { id: "bucket_fill_bar", type: "vector", x: FILL_X, y: BKY + 20, w: FILL_W, h: BKH - 40, values: [1], style: "fill:var(--accent);opacity:0.5", vertical: true },

    // ── Token count label ──
    { id: "token_count", type: "label", x: BKX + BKW / 2, y: BKY + BKH / 2, label: "10 / 10 tokens", style: "font-size:16px;font-weight:600;fill:var(--accent)" },

    // ── Refill rate note ──
    { id: "refill_note", type: "label", x: BKX + BKW / 2, y: BKY + BKH + 24, label: "+ 2 tokens / second", style: "font-size:12px;fill:var(--ink-soft)" },

    // ── Request arrows (3 requests) ──
    { id: "req1_box", type: "box", x: REQ_X, y: 180, w: 160, h: 42, rx: 8, style: "fill:var(--accent-2);opacity:0.85" },
    { id: "req1_lbl", type: "label", x: REQ_X + 80, y: 201 + 10, label: "GET /api/data", style: "font-size:12px;fill:#fff;font-weight:600" },
    { id: "req2_box", type: "box", x: REQ_X, y: 260, w: 160, h: 42, rx: 8, style: "fill:var(--accent-2);opacity:0.85" },
    { id: "req2_lbl", type: "label", x: REQ_X + 80, y: 281 + 10, label: "POST /api/order", style: "font-size:12px;fill:#fff;font-weight:600" },
    { id: "req3_box", type: "box", x: REQ_X, y: 340, w: 160, h: 42, rx: 8, style: "fill:var(--hot);opacity:0.9" },
    { id: "req3_lbl", type: "label", x: REQ_X + 80, y: 361 + 10, label: "GET /api/data", style: "font-size:12px;fill:#fff;font-weight:600" },

    // ── Arrows req → bucket ──
    { id: "arr_req1", type: "arrow", x1: REQ_X + 160, y1: 201, x2: BKX, y2: BKY + 100, style: "stroke:var(--accent-2);stroke-width:2" },
    { id: "arr_req2", type: "arrow", x1: REQ_X + 160, y1: 281, x2: BKX, y2: BKY + 180, style: "stroke:var(--accent-2);stroke-width:2" },
    { id: "arr_req3", type: "arrow", x1: REQ_X + 160, y1: 361, x2: BKX, y2: BKY + 260, style: "stroke:var(--hot);stroke-width:2" },

    // ── Responses ──
    { id: "resp_ok1", type: "box", x: RESP_X, y: 180, w: 130, h: 42, rx: 8, style: "fill:var(--good);opacity:0.85" },
    { id: "resp_ok1_lbl", type: "label", x: RESP_X + 65, y: 201 + 10, label: "200 OK ✓", style: "font-size:12px;fill:#fff;font-weight:600" },
    { id: "resp_ok2", type: "box", x: RESP_X, y: 260, w: 130, h: 42, rx: 8, style: "fill:var(--good);opacity:0.85" },
    { id: "resp_ok2_lbl", type: "label", x: RESP_X + 65, y: 281 + 10, label: "200 OK ✓", style: "font-size:12px;fill:#fff;font-weight:600" },
    { id: "resp_429", type: "box", x: RESP_X, y: 340, w: 130, h: 42, rx: 8, style: "fill:var(--hot);opacity:0.9" },
    { id: "resp_429_lbl", type: "label", x: RESP_X + 65, y: 361 + 10, label: "429 Too Many ✗", style: "font-size:11px;fill:#fff;font-weight:600" },

    // ── Arrows bucket → resp ──
    { id: "arr_resp1", type: "arrow", x1: BKX + BKW, y1: BKY + 100, x2: RESP_X, y2: 201, style: "stroke:var(--good);stroke-width:2" },
    { id: "arr_resp2", type: "arrow", x1: BKX + BKW, y1: BKY + 180, x2: RESP_X, y2: 281, style: "stroke:var(--good);stroke-width:2" },
    { id: "arr_resp3", type: "arrow", x1: BKX + BKW, y1: BKY + 260, x2: RESP_X, y2: 361, style: "stroke:var(--hot);stroke-width:2" },

    // ── Detail panels (right side, revealed per step) ──
    // Leaky bucket
    { id: "leaky_panel", type: "box", x: DETAIL_X, y: 120, w: 420, h: 220, rx: 10, style: "fill:var(--surface);stroke:var(--line);stroke-width:1.5" },
    { id: "leaky_title", type: "label", x: DETAIL_X + 210, y: 138, label: "Leaky Bucket", style: "font-size:14px;font-weight:700;fill:var(--ink)" },
    { id: "leaky_desc", type: "label", x: DETAIL_X + 210, y: 165, label: "Requests enter at any rate", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "leaky_desc2", type: "label", x: DETAIL_X + 210, y: 185, label: "but drain at constant rate.", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "leaky_desc3", type: "label", x: DETAIL_X + 210, y: 218, label: "Smooths out bursts.", style: "font-size:12px;fill:var(--accent)" },
    { id: "leaky_vs", type: "label", x: DETAIL_X + 210, y: 248, label: "vs Token Bucket: burst allowed", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "leaky_vs2", type: "label", x: DETAIL_X + 210, y: 268, label: "in token bucket up to capacity", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "leaky_vs3", type: "label", x: DETAIL_X + 210, y: 295, label: "but leaky enforces steady rate", style: "font-size:12px;fill:var(--hot)" },

    // Sliding window
    { id: "sliding_panel", type: "box", x: DETAIL_X, y: 360, w: 420, h: 200, rx: 10, style: "fill:var(--surface);stroke:var(--line);stroke-width:1.5" },
    { id: "sliding_title", type: "label", x: DETAIL_X + 210, y: 378, label: "Sliding Window Counter", style: "font-size:14px;font-weight:700;fill:var(--ink)" },
    { id: "sliding_desc", type: "label", x: DETAIL_X + 210, y: 405, label: "Count requests in rolling time window", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "sliding_desc2", type: "label", x: DETAIL_X + 210, y: 428, label: "e.g. 100 req per 60 seconds", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "sliding_bar", type: "vector", x: DETAIL_X + 20, y: 450, w: 380, h: 40, values: [0.3, 0.7, 0.5, 0.9, 0.6], style: "fill:var(--accent-2);rx:4" },
    { id: "sliding_now", type: "label", x: DETAIL_X + 210, y: 520, label: "← 60s window → now", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sliding_more_accurate", type: "label", x: DETAIL_X + 210, y: 545, label: "More accurate than fixed window", style: "font-size:12px;fill:var(--good)" },

    // Headers panel
    { id: "headers_panel", type: "box", x: DETAIL_X, y: 580, w: 420, h: 120, rx: 10, style: "fill:var(--surface);stroke:var(--line);stroke-width:1.5" },
    { id: "headers_title", type: "label", x: DETAIL_X + 210, y: 598, label: "Rate Limit Headers", style: "font-size:13px;font-weight:700;fill:var(--ink)" },
    { id: "hdr1", type: "label", x: DETAIL_X + 30, y: 622, label: "X-RateLimit-Limit: 100", style: "font-size:11px;font-family:monospace;fill:var(--accent)" },
    { id: "hdr2", type: "label", x: DETAIL_X + 30, y: 642, label: "X-RateLimit-Remaining: 43", style: "font-size:11px;font-family:monospace;fill:var(--good)" },
    { id: "hdr3", type: "label", x: DETAIL_X + 30, y: 662, label: "X-RateLimit-Reset: 1719489600", style: "font-size:11px;font-family:monospace;fill:var(--warn)" },
    { id: "hdr4", type: "label", x: DETAIL_X + 30, y: 682, label: "Retry-After: 15", style: "font-size:11px;font-family:monospace;fill:var(--hot)" },

    // Burst capacity highlight
    { id: "burst_box", type: "box", x: BKX - 10, y: BKY - 10, w: BKW + 20, h: 50, rx: 6, style: "fill:none;stroke:var(--warn);stroke-width:2.5;stroke-dasharray:5,4" },
    { id: "burst_lbl", type: "label", x: BKX + BKW / 2, y: BKY + 20, label: "Burst capacity = full bucket", style: "font-size:12px;fill:var(--warn);font-weight:600" },

    // Empty bucket warning
    { id: "empty_warn", type: "box", x: BKX, y: BKY + BKH - 60, w: BKW, h: 50, rx: 6, style: "fill:var(--hot);opacity:0.15" },
    { id: "empty_warn_lbl", type: "label", x: BKX + BKW / 2, y: BKY + BKH - 28, label: "Bucket empty → 429!", style: "font-size:13px;font-weight:700;fill:var(--hot)" },

    // Quiz
    { id: "quiz_panel", type: "box", x: 200, y: 140, w: 880, h: 440, rx: 12, style: "fill:var(--surface);stroke:var(--accent);stroke-width:2" },
    { id: "quiz_title", type: "label", x: 640, y: 168, label: "Quiz — Rate Limiting", style: "font-size:18px;font-weight:700;fill:var(--ink)" },
    { id: "q1", type: "label", x: 640, y: 220, label: "Q: O que acontece quando o bucket está vazio?", style: "font-size:14px;fill:var(--ink)" },
    { id: "q1a", type: "label", x: 640, y: 255, label: "A: A requisição recebe 429 Too Many Requests", style: "font-size:13px;fill:var(--good)" },
    { id: "q2", type: "label", x: 640, y: 305, label: "Q: Qual a diferença Token Bucket vs Leaky Bucket?", style: "font-size:14px;fill:var(--ink)" },
    { id: "q2a", type: "label", x: 640, y: 340, label: "A: Token permite burst; Leaky drena em taxa constante", style: "font-size:13px;fill:var(--good)" },
    { id: "q3", type: "label", x: 640, y: 390, label: "Q: O que o header X-RateLimit-Reset indica?", style: "font-size:14px;fill:var(--ink)" },
    { id: "q3a", type: "label", x: 640, y: 425, label: "A: Timestamp Unix quando o limite é resetado", style: "font-size:13px;fill:var(--good)" },
    { id: "q4", type: "label", x: 640, y: 475, label: "Q: Por que Sliding Window é mais preciso que Fixed Window?", style: "font-size:14px;fill:var(--ink)" },
    { id: "q4a", type: "label", x: 640, y: 510, label: "A: Evita spike na virada do janela fixa", style: "font-size:13px;fill:var(--good)" },

    // Summary
    { id: "sum_panel", type: "box", x: 160, y: 100, w: 960, h: 520, rx: 12, style: "fill:var(--surface);stroke:var(--line);stroke-width:1.5" },
    { id: "sum_title", type: "label", x: 640, y: 130, label: "Rate Limiting — Resumo", style: "font-size:20px;font-weight:700;fill:var(--ink)" },
    { id: "s1", type: "box", x: 200, y: 160, w: 380, h: 150, rx: 8, style: "fill:var(--accent);opacity:0.12" },
    { id: "s1t", type: "label", x: 390, y: 180, label: "Token Bucket", style: "font-size:13px;font-weight:700;fill:var(--accent)" },
    { id: "s1d", type: "label", x: 390, y: 200, label: "Tokens acumulam até capacity", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "s1d2", type: "label", x: 390, y: 220, label: "Burst permitido", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "s1d3", type: "label", x: 390, y: 240, label: "Reposição a taxa fixa", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "s1d4", type: "label", x: 390, y: 268, label: "Mais comum em APIs públicas", style: "font-size:12px;fill:var(--accent)" },
    { id: "s2", type: "box", x: 700, y: 160, w: 380, h: 150, rx: 8, style: "fill:var(--accent-2);opacity:0.12" },
    { id: "s2t", type: "label", x: 890, y: 180, label: "Sliding Window", style: "font-size:13px;font-weight:700;fill:var(--accent-2)" },
    { id: "s2d", type: "label", x: 890, y: 200, label: "Janela deslizante no tempo", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "s2d2", type: "label", x: 890, y: 220, label: "Sem spike na virada", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "s2d3", type: "label", x: 890, y: 240, label: "Mais preciso, mais memória", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "s2d4", type: "label", x: 890, y: 268, label: "Implementado no Redis tipicamente", style: "font-size:12px;fill:var(--accent-2)" },
    { id: "s3", type: "box", x: 200, y: 340, w: 880, h: 100, rx: 8, style: "fill:var(--good);opacity:0.1" },
    { id: "s3t", type: "label", x: 640, y: 360, label: "Por que Rate Limiting?", style: "font-size:13px;font-weight:700;fill:var(--good)" },
    { id: "s3d", type: "label", x: 640, y: 382, label: "Protege contra abuso, DoS, e esgotamento de recursos downstream", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "s3d2", type: "label", x: 640, y: 402, label: "Garante SLA para todos os clientes mesmo sob carga elevada", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "s3d3", type: "label", x: 640, y: 422, label: "Implementação: API Gateway, middleware, Redis (INCR + EXPIRE)", style: "font-size:12px;fill:var(--good)" },
    { id: "sum_note", type: "label", x: 640, y: 495, label: "Sempre retorne Retry-After para clientes saberem quando tentar novamente", style: "font-size:13px;font-weight:600;fill:var(--accent)" },
  ];

  const ALL_IDS = elements.map(e => e.id);
  const INIT_VISIBLE = new Set(["title_main", "bucket_outline", "bucket_label", "bucket_fill_bar", "token_count", "refill_note"]);

  const steps = [
    {
      title: "O Problema",
      balloon: { anchor: { x: 640, y: 680 }, placement: "top",
        text: "Sem controle, um único cliente pode fazer milhares de requisições por segundo, esgotando recursos e prejudicando todos os outros usuários.",
        why: "Rate limiting é a primeira linha de defesa contra abuso, DoS acidental e thundering herd.",
        deep: `<p>O problema não é só um cliente mal-intencionado — bugs de retry sem backoff, loops infinitos em integrações, ou simplesmente um cliente popular demais podem gerar o mesmo efeito de sobrecarga que um ataque deliberado. Rate limiting protege contra ambos os casos igualmente.</p>
<div class="xp-bad"><strong>Sem rate limiting</strong>Um cliente com bug de retry envia 10.000 req/s para /api/checkout
Banco de dados satura, latência sobe para todos os outros clientes também</div>
<div class="xp-good"><strong>Com rate limiting</strong>Cliente excede 100 req/s → recebe 429 imediatamente
Resto do sistema continua respondendo normalmente para todos os outros</div>
<p>É por isso que rate limiting costuma ficar na borda (API Gateway, proxy) — rejeitar cedo, antes que a requisição consuma qualquer recurso caro como conexão de banco ou processamento.</p>` },
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
      balloon: { anchor: "bucket_label", placement: "bottom",
        text: "O Token Bucket mantém um balde com N tokens. Cada requisição consome 1 token. Tokens são repostos a uma taxa fixa. Sem tokens = requisição bloqueada.",
        why: "É o algoritmo mais usado em APIs públicas por permitir bursts controlados.",
        deep: `<p>A elegância do Token Bucket é que ele não precisa gravar o timestamp de cada requisição individual — só o número de tokens atual e o timestamp da última reposição. Isso torna a implementação extremamente barata em memória, mesmo com milhões de clientes distintos.</p>
<div class="xp-example"><strong>Implementação com Redis</strong>tokens = GET bucket:{userId}:tokens
IF tokens > 0: DECR bucket:{userId}:tokens; ALLOW
ELSE: DENY (429)</div>
<p>Muitas implementações fazem o cálculo de reposição "preguiçosamente": em vez de um job rodando a cada segundo para todo cliente, elas calculam quantos tokens deveriam existir agora com base no tempo decorrido desde a última chamada — só quando alguém de fato faz uma requisição.</p>` },
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
      balloon: { anchor: "refill_note", placement: "bottom",
        text: "A cada segundo (ou fração), novos tokens são adicionados ao balde até o limite máximo (capacity). O balde nunca transborda.",
        why: "A taxa de refill define o throughput sustentável; a capacidade define o burst máximo.",
        deep: `<p>Capacity e refill rate são dois parâmetros independentes que controlam comportamentos diferentes: capacity limita o pico instantâneo (quantas requisições passam de uma vez), enquanto refill rate limita a taxa sustentada ao longo do tempo — os dois juntos moldam o "formato" do tráfego permitido.</p>
<div class="xp-example"><strong>Dois buckets, mesmo throughput médio</strong>Bucket A: capacity=10, refill=2/s  → permite rajadas curtas de até 10
Bucket B: capacity=100, refill=2/s → permite rajadas muito maiores, mesma taxa sustentada</div>
<p>Um erro comum é configurar capacity muito baixa para uma API onde clientes legítimos naturalmente fazem chamadas em lote (ex.: carregar uma página que dispara 8 requisições paralelas) — isso gera 429 para tráfego normal, não abuso.</p>` },
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
      balloon: { anchor: "req1_box", placement: "right",
        text: "Cada requisição aceita remove 1 token do balde. O balde vai esvaziando conforme as requisições chegam.",
        why: "O consumo é instantâneo — o rate limiter decide em microsegundos se aceita ou rejeita.",
        deep: `<p>Nem toda requisição precisa custar exatamente 1 token — muitas APIs cobram um "peso" diferente por endpoint, refletindo o custo real de processá-lo. Uma busca complexa pode custar 5 tokens, enquanto um GET simples custa 1.</p>
<div class="xp-example"><strong>Custo variável por endpoint</strong>GET /users/{id}        → custa 1 token
POST /reports/generate → custa 20 tokens (processamento pesado)
GET /search?q=...      → custa 5 tokens</div>
<p>Isso é comum em APIs de dados e IA (ex.: contagem por tokens de LLM em vez de por requisição) — o rate limiter reflete o custo computacional real, não apenas a contagem bruta de chamadas HTTP.</p>` },
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
      balloon: { anchor: "resp_ok1", placement: "right",
        text: "Enquanto houver tokens, a requisição passa e recebe resposta 200 OK.",
        why: "O custo de verificação é mínimo: uma operação atômica DECR no Redis ou um check em memória.",
        deep: `<p>A palavra-chave é <strong>atômica</strong>: em um sistema distribuído com múltiplas instâncias da API checando o mesmo bucket simultaneamente, um simples "ler, decidir, escrever" tem race condition — dois requests podem ler o mesmo valor de tokens antes de qualquer um decrementar, permitindo passar mais requisições do que deveria.</p>
<div class="xp-example"><strong>Lua script atômico no Redis</strong>-- EVAL executa tudo em uma única operação atômica
local tokens = redis.call('GET', KEYS[1])
if tonumber(tokens) > 0 then
  redis.call('DECR', KEYS[1])
  return 1
end
return 0</div>
<p>Bibliotecas de rate limiting (ex.: <code>rate-limiter-flexible</code>, <code>redis-cell</code>) já encapsulam essa atomicidade — raramente vale a pena implementar do zero em produção.</p>` },
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
      balloon: { anchor: "resp_429", placement: "right",
        text: "Quando o balde está vazio, a requisição é rejeitada imediatamente com HTTP 429. Nenhum processamento caro é feito.",
        why: "Rejeitar cedo é eficiente: protege todos os serviços downstream sem custo computacional.",
        deep: `<p>429 é o código HTTP correto (RFC 6585) especificamente para esse caso — diferente de um 503 (serviço indisponível) ou 403 (proibido), ele comunica claramente "você está indo rápido demais, tente de novo mais tarde", o que permite ao cliente implementar retry inteligente.</p>
<div class="xp-example"><strong>Resposta 429 completa</strong>HTTP/1.1 429 Too Many Requests
Retry-After: 15
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0

{"error": "rate_limit_exceeded", "retry_after_seconds": 15}</div>
<p>Sem o header <code>Retry-After</code>, clientes bem-comportados não sabem quanto esperar e tendem a tentar de novo imediatamente — o que pode piorar a sobrecarga em vez de aliviá-la.</p>` },
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
      balloon: { anchor: "bucket_label", placement: "bottom",
        text: "A capacidade máxima do bucket define o burst: quantas requisições simultâneas são aceitas antes de começar a rejeitar.",
        why: "Burst é essencial para tráfego real que nunca é perfeitamente uniforme. Ex: 1000 req/min com burst de 200.",
        deep: `<p>Tráfego real de usuários raramente é uniforme: uma página que carrega e dispara vários requests paralelos, um usuário que atualiza a página várias vezes seguidas, ou uma sincronização em lote — tudo isso gera picos legítimos e curtos que um limite estritamente uniforme rejeitaria.</p>
<div class="xp-good"><strong>Burst generoso, taxa sustentada moderada</strong>capacity: 50, refill: 10/s
→ permite absorver picos de até 50 requests instantâneas, mas sustenta só 10/s no longo prazo</div>
<div class="xp-bad"><strong>Sem burst</strong>capacity: 1 (equivalente a um rate limiter "estrito" sem tolerância)
→ qualquer 2 requisições quase simultâneas de um usuário legítimo já disparam 429</div>` },
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
      balloon: { anchor: { x: 1010, y: 240 }, placement: "left",
        text: "No Leaky Bucket, as requisições entram em qualquer taxa mas saem (drain) em taxa constante. Bursts são suavizados — não existe resposta imediata.",
        why: "Preferido quando você quer tráfego uniforme para serviços frágeis, mas aumenta latência em bursts.",
        deep: `<p>A diferença fundamental entre os dois algoritmos: Token Bucket controla <strong>quantas</strong> requisições passam (rejeitando o excesso), enquanto Leaky Bucket controla a <strong>taxa</strong> na qual elas passam (enfileirando o excesso e liberando aos poucos). Um rejeita, o outro atrasa.</p>
<div class="xp-good"><strong>Leaky Bucket: bom para</strong>Proteger um serviço downstream frágil que não tolera picos, mesmo curtos — ex: um banco de dados legado sem connection pooling robusto</div>
<div class="xp-bad"><strong>Leaky Bucket: ruim para</strong>APIs interativas onde o usuário espera resposta rápida — a fila introduz latência mesmo para requisições dentro do limite</div>
<p>Token Bucket é a escolha mais comum para APIs públicas justamente por não introduzir essa latência artificial: requisições dentro do limite são atendidas instantaneamente.</p>` },
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
