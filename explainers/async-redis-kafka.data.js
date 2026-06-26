(function () {
  const W = 1280, H = 720;

  /* ── Sequence diagram columns ── */
  const ACTORS = [
    { id: "ac_cli",  x: 100,  label: "Client",       color: "var(--accent-2)" },
    { id: "ac_api",  x: 340,  label: "API",           color: "var(--accent)"   },
    { id: "ac_q",    x: 580,  label: "Queue",         color: "var(--warn)"     },
    { id: "ac_wrk",  x: 820,  label: "Worker",        color: "var(--good)"     },
    { id: "ac_res",  x: 1060, label: "Result Store",  color: "var(--hot)"      },
  ];
  const ACT_W = 140, ACT_H = 44, ACT_Y = 60;
  const LF_Y1 = ACT_Y + ACT_H, LF_Y2 = 560; // lifeline top/bottom

  /* helper to compute message y */
  const MSG_START_Y = LF_Y1 + 24;
  const MSG_STEP = 54;
  function my(i) { return MSG_START_Y + i * MSG_STEP; }

  /* Actor center X */
  function ax(a) { return a.x + ACT_W / 2; }

  /* Build an arrow element between two actors at row i */
  function msg(id, from, to, i, label, color = "var(--ink-soft)", dashed = false) {
    const x1 = ax(ACTORS.find(a => a.id === from));
    const x2 = ax(ACTORS.find(a => a.id === to));
    const y = my(i);
    return [
      { id: id + "_arr", type: "arrow", x1, y1: y, x2, y2: y, style: `stroke:${color};stroke-width:2${dashed ? ";stroke-dasharray:5,4" : ""}` },
      { id: id + "_lbl", type: "label", x: (x1 + x2) / 2, y: y - 9, text: label, style: `font-size:10px;fill:${color};font-weight:600` },
    ];
  }

  const elements = [
    // ── Title ──
    { id: "title_main", type: "label", x: W / 2, y: 30, text: "Async com Redis / Kafka", style: "font-size:22px;font-weight:700;fill:var(--ink)" },

    // ── Actor boxes ──
    ...ACTORS.map(a => ({ id: a.id + "_box", type: "box", x: a.x, y: ACT_Y, w: ACT_W, h: ACT_H, rx: 8, style: `fill:${a.color};opacity:0.85` })),
    ...ACTORS.map(a => ({ id: a.id + "_lbl", type: "label", x: ax(a), y: ACT_Y + ACT_H / 2 + 5, text: a.label, style: "font-size:12px;font-weight:700;fill:#fff" })),

    // ── Lifelines ──
    ...ACTORS.map(a => ({ id: a.id + "_lf", type: "arrow", x1: ax(a), y1: LF_Y1, x2: ax(a), y2: LF_Y2, style: "stroke:var(--line);stroke-width:1;stroke-dasharray:4,4" })),

    // ── Sync problem box (left margin) ──
    { id: "sync_problem", type: "box", x: 10, y: MSG_START_Y - 10, w: 80, h: 120, rx: 6, style: "fill:var(--hot);opacity:0.15;stroke:var(--hot);stroke-width:1" },
    { id: "sync_problem_lbl", type: "label", x: 50, y: MSG_START_Y + 40, text: "Sync → bloqueia", style: "font-size:9px;fill:var(--hot)" },

    // ── Messages (rows 0–8) ──
    ...msg("m0", "ac_cli", "ac_api", 0, "POST /process (payload)", "var(--accent-2)"),
    ...msg("m1", "ac_api", "ac_q",   1, "PUBLISH job:{id, data}", "var(--warn)"),
    ...msg("m2", "ac_api", "ac_cli", 2, "202 Accepted {jobId}", "var(--good)", true),
    ...msg("m3", "ac_q",   "ac_wrk", 3, "CONSUME job", "var(--good)"),
    ...msg("m4", "ac_wrk", "ac_res", 4, "SET job:{id}:result", "var(--hot)"),
    ...msg("m5", "ac_cli", "ac_api", 5, "GET /jobs/{id} (polling)", "var(--accent-2)", true),
    ...msg("m6", "ac_api", "ac_res", 6, "GET job:{id}:status", "var(--hot)", true),
    ...msg("m7", "ac_res", "ac_api", 7, "status: done, result: ...", "var(--good)", true),
    ...msg("m8", "ac_api", "ac_cli", 8, "200 OK {result}", "var(--good)"),

    // ── Activation boxes on lifelines ──
    { id: "act_api", type: "box", x: ax(ACTORS[1]) - 8, y: my(0), w: 16, h: my(2) - my(0) + 4, rx: 2, style: "fill:var(--accent);opacity:0.5" },
    { id: "act_wrk", type: "box", x: ax(ACTORS[3]) - 8, y: my(3), w: 16, h: my(4) - my(3) + 4, rx: 2, style: "fill:var(--good);opacity:0.5" },

    // ── Alt frame: webhook alternative ──
    { id: "alt_frame", type: "box", x: ax(ACTORS[0]) - 30, y: my(5) - 10, w: ax(ACTORS[1]) - ax(ACTORS[0]) + 80, h: my(8) - my(5) + 30, rx: 6, style: "fill:none;stroke:var(--ink-soft);stroke-width:1;stroke-dasharray:4,3" },
    { id: "alt_lbl", type: "label", x: ax(ACTORS[0]) - 14, y: my(5) - 14, text: "alt: poll | webhook | SSE", style: "font-size:9px;fill:var(--ink-soft);text-anchor:start" },

    // ── Queue detail panel (right) ──
    { id: "q_detail", type: "box", x: W - 270, y: 60, w: 250, h: 480, rx: 10, style: "fill:var(--surface);stroke:var(--line);stroke-width:1.5" },
    { id: "q_det_title", type: "label", x: W - 145, y: 80, text: "Queue Details", style: "font-size:13px;font-weight:700;fill:var(--ink)" },

    // Redis section
    { id: "redis_head", type: "label", x: W - 145, y: 108, text: "Redis (List / Streams)", style: "font-size:12px;font-weight:700;fill:var(--hot)" },
    { id: "redis_d1", type: "label", x: W - 250, y: 130, text: "LPUSH queue job", style: "font-size:10px;font-family:monospace;fill:var(--ink-soft);text-anchor:start" },
    { id: "redis_d2", type: "label", x: W - 250, y: 148, text: "BRPOP queue 0", style: "font-size:10px;font-family:monospace;fill:var(--ink-soft);text-anchor:start" },
    { id: "redis_d3", type: "label", x: W - 145, y: 170, text: "Simple, low latency", style: "font-size:10px;fill:var(--good)" },
    { id: "redis_d4", type: "label", x: W - 145, y: 188, text: "No persistence by default", style: "font-size:10px;fill:var(--warn)" },
    { id: "redis_d5", type: "label", x: W - 145, y: 206, text: "Pub/Sub, Sorted Sets, Streams", style: "font-size:10px;fill:var(--ink-soft)" },

    // Kafka section
    { id: "kafka_head", type: "label", x: W - 145, y: 238, text: "Kafka (Topic / Partitions)", style: "font-size:12px;font-weight:700;fill:var(--accent)" },
    { id: "kafka_d1", type: "label", x: W - 145, y: 260, text: "Log imutável + particionado", style: "font-size:10px;fill:var(--ink-soft)" },
    { id: "kafka_d2", type: "label", x: W - 145, y: 278, text: "Retenção configurável (dias/TB)", style: "font-size:10px;fill:var(--good)" },
    { id: "kafka_d3", type: "label", x: W - 145, y: 296, text: "Múltiplos consumer groups", style: "font-size:10px;fill:var(--good)" },
    { id: "kafka_d4", type: "label", x: W - 145, y: 314, text: "Replay de mensagens", style: "font-size:10px;fill:var(--good)" },
    { id: "kafka_d5", type: "label", x: W - 145, y: 332, text: "Alta throughput (milhões/s)", style: "font-size:10px;fill:var(--accent)" },

    // DLQ section
    { id: "dlq_head", type: "label", x: W - 145, y: 364, text: "Dead Letter Queue", style: "font-size:12px;font-weight:700;fill:var(--hot)" },
    { id: "dlq_d1", type: "label", x: W - 145, y: 384, text: "Falhou N vezes → DLQ", style: "font-size:10px;fill:var(--ink-soft)" },
    { id: "dlq_d2", type: "label", x: W - 145, y: 402, text: "Alertas + análise manual", style: "font-size:10px;fill:var(--ink-soft)" },
    { id: "dlq_d3", type: "label", x: W - 145, y: 420, text: "Reprocessamento seguro", style: "font-size:10px;fill:var(--good)" },
    { id: "dlq_d4", type: "label", x: W - 145, y: 440, text: "Idempotência obrigatória!", style: "font-size:10px;fill:var(--hot);font-weight:600" },

    // ── Webhook/SSE alternative box ──
    { id: "webhook_panel", type: "box", x: 60, y: 580, w: W - 120 - 270, h: 100, rx: 10, style: "fill:var(--surface);stroke:var(--accent-2);stroke-width:1.5" },
    { id: "webhook_t", type: "label", x: (60 + W - 270) / 2, y: 600, text: "Alternativas ao Polling", style: "font-size:13px;font-weight:700;fill:var(--accent-2)" },
    { id: "webhook_d1", type: "label", x: (60 + W - 270) / 2, y: 624, text: "Webhook: Worker faz POST no callback URL do cliente quando termina", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "webhook_d2", type: "label", x: (60 + W - 270) / 2, y: 644, text: "SSE (Server-Sent Events): conexão HTTP aberta, servidor notifica quando pronto", style: "font-size:11px;fill:var(--accent-2)" },
    { id: "webhook_d3", type: "label", x: (60 + W - 270) / 2, y: 664, text: "WebSocket: bidirecional; polling com backoff: simples porém ineficiente", style: "font-size:11px;fill:var(--ink-soft)" },

    // ── Redis vs Kafka comparison ──
    { id: "rvk_panel", type: "box", x: 60, y: 80, w: W - 120, h: 560, rx: 12, style: "fill:var(--surface);stroke:var(--line);stroke-width:1.5" },
    { id: "rvk_title", type: "label", x: W / 2, y: 108, text: "Redis Queue vs Kafka Stream", style: "font-size:16px;font-weight:700;fill:var(--ink)" },
    { id: "rvk_h1", type: "label", x: W / 4, y: 148, text: "Redis / BullMQ / Sidekiq", style: "font-size:14px;font-weight:700;fill:var(--hot)" },
    { id: "rvk_h2", type: "label", x: 3 * W / 4, y: 148, text: "Apache Kafka / SQS / RabbitMQ", style: "font-size:14px;font-weight:700;fill:var(--accent)" },
    ...[
      ["Modelo", "Queue: consume e remove", "Log: consome sem remover"],
      ["Replay", "Não — mensagem desaparece", "Sim — qualquer consumer group"],
      ["Retenção", "Até consumo (ou TTL)", "Dias / semanas / TB"],
      ["Throughput", "Muito alto, baixa latência", "Altíssimo, horizontal"],
      ["Consumers", "1 worker por mensagem", "N consumer groups independentes"],
      ["Complexidade", "Simples de operar", "Zookeeper/KRaft, brokers, topics"],
      ["Use case", "Jobs, tasks, queues async", "Event streaming, analytics, audit log"],
      ["Managed", "Elasticache, Upstash", "MSK, Confluent, Aiven"],
    ].flatMap(([row, left, right], i) => [
      { id: `rvk_row_${i}`, type: "label", x: 60, y: 185 + i * 44, text: row, style: "font-size:11px;fill:var(--ink-soft);text-anchor:start" },
      { id: `rvk_left_${i}`, type: "label", x: W / 4, y: 185 + i * 44, text: left, style: "font-size:11px;fill:var(--ink)" },
      { id: `rvk_right_${i}`, type: "label", x: 3 * W / 4, y: 185 + i * 44, text: right, style: "font-size:11px;fill:var(--ink)" },
    ]),
    { id: "rvk_div", type: "box", x: W / 2 - 1, y: 160, w: 2, h: 440, rx: 0, style: "fill:var(--line)" },
    { id: "rvk_note", type: "label", x: W / 2, y: 576, text: "Regra: Redis para jobs simples, Kafka para eventos que múltiplos sistemas precisam consumir", style: "font-size:12px;font-weight:600;fill:var(--accent)" },

    // ── Quiz ──
    { id: "quiz_panel", type: "box", x: 100, y: 50, w: 1080, h: 620, rx: 12, style: "fill:var(--surface);stroke:var(--accent);stroke-width:2" },
    { id: "quiz_title", type: "label", x: 640, y: 80, text: "Quiz — Async com Redis / Kafka", style: "font-size:18px;font-weight:700;fill:var(--ink)" },
    { id: "q1", type: "label", x: 640, y: 140, text: "Q: Por que retornar 202 Accepted em vez de esperar o processamento?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q1a", type: "label", x: 640, y: 165, text: "A: Evita timeout HTTP, libera o worker thread, melhora UX com feedback imediato", style: "font-size:12px;fill:var(--good)" },
    { id: "q2", type: "label", x: 640, y: 215, text: "Q: O que é uma Dead Letter Queue?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q2a", type: "label", x: 640, y: 240, text: "A: Fila onde mensagens que falharam N vezes são enviadas para análise/reprocessamento manual", style: "font-size:12px;fill:var(--good)" },
    { id: "q3", type: "label", x: 640, y: 290, text: "Q: Diferença polling vs webhook?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q3a", type: "label", x: 640, y: 315, text: "A: Polling: cliente pergunta repetidamente. Webhook: servidor notifica cliente quando pronto.", style: "font-size:12px;fill:var(--good)" },
    { id: "q4", type: "label", x: 640, y: 365, text: "Q: Por que idempotência é obrigatória em workers?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q4a", type: "label", x: 640, y: 390, text: "A: Mensagem pode ser entregue mais de uma vez (at-least-once). Worker deve ser seguro para executar N vezes.", style: "font-size:12px;fill:var(--good)" },
    { id: "q5", type: "label", x: 640, y: 440, text: "Q: Quando usar Kafka em vez de Redis para filas?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q5a", type: "label", x: 640, y: 465, text: "A: Quando múltiplos sistemas precisam consumir o mesmo evento (consumer groups) ou quando precisa de replay.", style: "font-size:12px;fill:var(--good)" },
    { id: "q6", type: "label", x: 640, y: 515, text: "Q: O que faz o Worker com o resultado do job?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q6a", type: "label", x: 640, y: 540, text: "A: Salva no Result Store (Redis, DB, S3) com o jobId como chave para o cliente consultar depois.", style: "font-size:12px;fill:var(--good)" },

    // ── Summary ──
    { id: "sum_panel", type: "box", x: 60, y: 40, w: 1160, h: 640, rx: 12, style: "fill:var(--surface);stroke:var(--line);stroke-width:1.5" },
    { id: "sum_title", type: "label", x: 640, y: 68, text: "Async Redis / Kafka — Resumo", style: "font-size:20px;font-weight:700;fill:var(--ink)" },
    { id: "sum_pat", type: "box", x: 100, y: 96, w: 1020, h: 140, rx: 8, style: "fill:var(--accent);opacity:0.1" },
    { id: "sum_pat_t", type: "label", x: 610, y: 116, text: "Padrão Fire-and-Forget Async", style: "font-size:13px;font-weight:700;fill:var(--accent)" },
    { id: "sum_pat1", type: "label", x: 610, y: 140, text: "1. API aceita request → serializa job → publica na fila → responde 202 Accepted", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_pat2", type: "label", x: 610, y: 160, text: "2. Worker consome job → processa → salva resultado no Result Store", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_pat3", type: "label", x: 610, y: 180, text: "3. Cliente faz polling / recebe webhook / abre SSE para saber quando terminou", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_pat4", type: "label", x: 610, y: 205, text: "Workers precisam ser idempotentes (at-least-once delivery). DLQ para falhas.", style: "font-size:11px;fill:var(--hot);font-weight:600" },
    { id: "sum_when", type: "box", x: 100, y: 258, w: 480, h: 200, rx: 8, style: "fill:var(--good);opacity:0.1" },
    { id: "sum_when_t", type: "label", x: 340, y: 278, text: "Quando usar Async?", style: "font-size:13px;font-weight:700;fill:var(--good)" },
    { id: "sum_w1", type: "label", x: 340, y: 302, text: "Processamento > 100ms (relatórios, IA, encoding)", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_w2", type: "label", x: 340, y: 322, text: "Não precisa de resposta imediata", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_w3", type: "label", x: 340, y: 342, text: "Picos de carga (rate smoothing)", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_w4", type: "label", x: 340, y: 362, text: "Integração com sistemas lentos", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_w5", type: "label", x: 340, y: 382, text: "Retry automático sem impacto no usuário", style: "font-size:11px;fill:var(--good)" },
    { id: "sum_tools", type: "box", x: 620, y: 258, w: 500, h: 200, rx: 8, style: "fill:var(--accent-2);opacity:0.1" },
    { id: "sum_tools_t", type: "label", x: 870, y: 278, text: "Ferramentas Populares", style: "font-size:13px;font-weight:700;fill:var(--accent-2)" },
    { id: "sum_t1", type: "label", x: 870, y: 302, text: "Redis + BullMQ (Node.js) / Celery (Python)", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_t2", type: "label", x: 870, y: 322, text: "Kafka + kafka-go / confluent-kafka", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_t3", type: "label", x: 870, y: 342, text: "AWS SQS + Lambda (serverless workers)", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_t4", type: "label", x: 870, y: 362, text: "RabbitMQ + amqplib", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_t5", type: "label", x: 870, y: 382, text: "Temporal.io (durable workflow engine)", style: "font-size:11px;fill:var(--accent-2)" },
    { id: "sum_motto", type: "label", x: 610, y: 510, text: "Async desacopla produtor de consumidor → resiliência, escalabilidade, eficiência", style: "font-size:13px;font-weight:600;fill:var(--accent)" },
  ];

  const ALL_IDS = elements.map(e => e.id);

  const ACTOR_IDS = ACTORS.flatMap(a => [a.id + "_box", a.id + "_lbl", a.id + "_lf"]);
  const MSG_IDS = ["m0","m1","m2","m3","m4","m5","m6","m7","m8"].flatMap(id => [id + "_arr", id + "_lbl"]);

  function showBase(ctx) {
    ALL_IDS.forEach(id => ctx.hide(id));
    ctx.show("title_main");
    ACTOR_IDS.forEach(id => ctx.show(id));
  }

  const steps = [
    {
      title: "O Problema: Processamento Lento Bloqueia HTTP",
      text: "Quando uma requisição HTTP inicia um processamento de vários segundos (relatório, encoding de vídeo, chamada de IA), o thread fica bloqueado esperando. Timeouts, depleted thread pools.",
      why: "HTTP tem timeout padrão de 30-60s. Workers de thread limitados. Uma operação lenta pode afetar todo o sistema.",
      balloonAnchor: { x: 640, y: 680 },
      placement: "top",
      enter(ctx) {
        showBase(ctx);
        ctx.show("sync_problem"); ctx.show("sync_problem_lbl");
        ctx.show("m0_arr"); ctx.show("m0_lbl");
        ctx.show("act_api");
      }
    },
    {
      title: "Padrão: Aceitar → Enfileirar → Processar → Notificar",
      text: "A API aceita o request, cria um job na fila e responde imediatamente com 202 Accepted. Um worker processa o job de forma independente.",
      why: "Desacopla o tempo de resposta ao cliente do tempo de processamento real. A API fica sempre rápida.",
      balloonAnchor: "ac_q_lbl",
      placement: "bottom",
      enter(ctx) {
        showBase(ctx);
        MSG_IDS.forEach(id => ctx.show(id));
        ctx.show("act_api"); ctx.show("act_wrk");
        ctx.show("alt_frame"); ctx.show("alt_lbl");
      }
    },
    {
      title: "Request Chega na API",
      text: "O cliente faz POST /process com o payload. A API valida, cria um jobId único e serializa o job.",
      why: "O jobId é o handle que o cliente usará para acompanhar o status. UUID v4 ou KSUID são boas escolhas.",
      balloonAnchor: "m0_lbl",
      placement: "bottom",
      enter(ctx) {
        showBase(ctx);
        ctx.show("m0_arr"); ctx.show("m0_lbl");
        ctx.show("act_api");
      }
    },
    {
      title: "Job Publicado na Fila (Redis / Kafka)",
      text: "A API serializa o job como JSON e publica na fila. Redis: LPUSH. Kafka: Producer.send(). O job fica persistido na fila aguardando um worker.",
      why: "A fila é o buffer entre produtor e consumidor. Se workers estiverem sobrecarregados, jobs aguardam sem perda.",
      balloonAnchor: "m1_lbl",
      placement: "bottom",
      enter(ctx) {
        showBase(ctx);
        ctx.show("m0_arr"); ctx.show("m0_lbl");
        ctx.show("m1_arr"); ctx.show("m1_lbl");
        ctx.show("q_detail"); ctx.show("q_det_title");
        ctx.show("redis_head"); ctx.show("redis_d1"); ctx.show("redis_d2"); ctx.show("redis_d3"); ctx.show("redis_d4"); ctx.show("redis_d5");
        ctx.show("act_api");
      }
    },
    {
      title: "API Responde 202 Accepted",
      text: "A API responde imediatamente com 202 Accepted e o jobId. O cliente recebe resposta em < 100ms, independente do tempo de processamento.",
      why: "202 significa 'recebi e enfileirei'. O cliente precisa acompanhar o status separadamente.",
      balloonAnchor: "m2_lbl",
      placement: "bottom",
      enter(ctx) {
        showBase(ctx);
        ctx.show("m0_arr"); ctx.show("m0_lbl");
        ctx.show("m1_arr"); ctx.show("m1_lbl");
        ctx.show("m2_arr"); ctx.show("m2_lbl");
        ctx.show("act_api");
      }
    },
    {
      title: "Worker Consome o Job",
      text: "Um worker poll a fila (Redis BRPOP / Kafka Consumer.poll()) e obtém o job. Pode haver múltiplos workers em paralelo, escalando horizontalmente.",
      why: "Workers são stateless e escaláveis — adicione mais workers para processar mais jobs em paralelo.",
      balloonAnchor: "m3_lbl",
      placement: "bottom",
      enter(ctx) {
        showBase(ctx);
        ["m0","m1","m2","m3"].forEach(m => { ctx.show(m + "_arr"); ctx.show(m + "_lbl"); });
        ctx.show("act_api"); ctx.show("act_wrk");
        ctx.show("q_detail"); ctx.show("q_det_title");
        ctx.show("kafka_head"); ctx.show("kafka_d1"); ctx.show("kafka_d2"); ctx.show("kafka_d3"); ctx.show("kafka_d4"); ctx.show("kafka_d5");
      }
    },
    {
      title: "Resultado Salvo no Result Store",
      text: "Após processar, o worker salva o resultado no Result Store: Redis (SET job:{id}:result), banco de dados, ou S3. TTL para expirar jobs antigos.",
      why: "O Result Store é o mecanismo de comunicação entre worker e cliente. Redis TTL evita acúmulo de dados.",
      balloonAnchor: "m4_lbl",
      placement: "bottom",
      enter(ctx) {
        showBase(ctx);
        ["m0","m1","m2","m3","m4"].forEach(m => { ctx.show(m + "_arr"); ctx.show(m + "_lbl"); });
        ctx.show("act_api"); ctx.show("act_wrk");
        ctx.show("q_detail"); ctx.show("q_det_title");
        ctx.show("dlq_head"); ctx.show("dlq_d1"); ctx.show("dlq_d2"); ctx.show("dlq_d3"); ctx.show("dlq_d4");
      }
    },
    {
      title: "Polling pelo Cliente",
      text: "O cliente faz GET /jobs/{id} periodicamente. A API consulta o Result Store. Quando status=done, retorna o resultado.",
      why: "Polling com backoff exponencial: 1s, 2s, 4s, 8s... Evita sobrecarregar a API com polling agressivo.",
      balloonAnchor: "m5_lbl",
      placement: "bottom",
      enter(ctx) {
        showBase(ctx);
        MSG_IDS.forEach(id => ctx.show(id));
        ctx.show("act_api"); ctx.show("act_wrk");
        ctx.show("alt_frame"); ctx.show("alt_lbl");
      }
    },
    {
      title: "Webhook / SSE: Alternativas ao Polling",
      text: "Webhook: o worker notifica um callback URL do cliente. SSE: cliente mantém conexão HTTP aberta e recebe notificação quando pronto. WebSocket para bidirecional.",
      why: "Polling é simples mas ineficiente. Webhook/SSE é push-based — notifica assim que pronto, sem espera.",
      balloonAnchor: { x: (60 + W - 270) / 2, y: 640 },
      placement: "top",
      enter(ctx) {
        showBase(ctx);
        MSG_IDS.forEach(id => ctx.show(id));
        ctx.show("act_api"); ctx.show("act_wrk");
        ctx.show("alt_frame"); ctx.show("alt_lbl");
        ctx.show("webhook_panel"); ctx.show("webhook_t"); ctx.show("webhook_d1"); ctx.show("webhook_d2"); ctx.show("webhook_d3");
      }
    },
    {
      title: "Redis Queue vs Kafka Stream",
      text: "Redis/BullMQ: simples, baixa latência, mensagem desaparece após consumo. Kafka: log imutável, replay, múltiplos consumer groups, retenção longa.",
      why: "Redis para jobs isolados, Kafka para eventos que múltiplos sistemas precisam consumir independentemente.",
      balloonAnchor: { x: W / 2, y: 640 },
      placement: "top",
      enter(ctx) {
        ALL_IDS.forEach(id => ctx.hide(id));
        ctx.show("title_main");
        ctx.show("rvk_panel"); ctx.show("rvk_title");
        ctx.show("rvk_h1"); ctx.show("rvk_h2");
        [0,1,2,3,4,5,6,7].forEach(i => {
          ctx.show(`rvk_row_${i}`);
          ctx.show(`rvk_left_${i}`);
          ctx.show(`rvk_right_${i}`);
        });
        ctx.show("rvk_div"); ctx.show("rvk_note");
      }
    },
    {
      title: "Dead Letter Queue",
      text: "Quando um job falha N vezes (timeout, exception, crash), vai para a Dead Letter Queue. Alertas disparam, equipe analisa, reprocessa manualmente se possível.",
      why: "DLQ evita que jobs problemáticos bloqueiem a fila principal e permite análise post-mortem.",
      balloonAnchor: { x: W - 145, y: 430 },
      placement: "left",
      enter(ctx) {
        showBase(ctx);
        MSG_IDS.forEach(id => ctx.show(id));
        ctx.show("act_api"); ctx.show("act_wrk");
        ctx.show("q_detail"); ctx.show("q_det_title");
        ctx.show("dlq_head"); ctx.show("dlq_d1"); ctx.show("dlq_d2"); ctx.show("dlq_d3"); ctx.show("dlq_d4");
      }
    },
    {
      title: "Quiz",
      balloon: { anchor: { x: 640, y: 360 }, placement: "bottom", text: "Teste seu conhecimento sobre Async Redis/Kafka:" },
      quiz: {
        question: "Por que a API responde 202 Accepted em vez de 200 OK ao enfileirar uma tarefa assíncrona?",
        options: [
          "200 OK é reservado exclusivamente para requisições GET",
          "202 indica que a requisição foi aceita mas o processamento ainda não foi concluído",
          "202 é obrigatório quando se usa Redis como fila",
          "Para economizar bandwidth omitindo o corpo da resposta"
        ],
        answer: 1,
        explain: "202 Accepted = 'recebi e enfileirei, mas ainda não processei'. O cliente sabe que precisa verificar o resultado depois via polling ou aguardar um webhook. 200 implicaria trabalho concluído."
      }
    },
    {
      title: "Resumo",
      text: "Async desacopla produtores de consumidores. API responde 202 em < 100ms. Workers processam em paralelo. Result Store + polling/webhook fecha o ciclo.",
      why: "",
      balloonAnchor: { x: 640, y: 680 },
      placement: "top",
      enter(ctx) {
        ALL_IDS.forEach(id => ctx.hide(id));
        ctx.show("sum_panel"); ctx.show("sum_title");
        ["sum_pat","sum_pat_t","sum_pat1","sum_pat2","sum_pat3","sum_pat4",
         "sum_when","sum_when_t","sum_w1","sum_w2","sum_w3","sum_w4","sum_w5",
         "sum_tools","sum_tools_t","sum_t1","sum_t2","sum_t3","sum_t4","sum_t5","sum_motto"].forEach(id => ctx.show(id));
      }
    }
  ];

  window.ASYNC_REDIS_KAFKA_DIAGRAM = { title: "Async com Redis / Kafka", subtitle: "Fire-and-Forget · 202 Accepted · Dead Letter Queue · Idempotência", width: W, height: H, autoplayMs: 8000, elements, steps };
})();
