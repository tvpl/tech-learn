/* ============================================================================
 * sync-async.data.js — Explicador: processamento síncrono SOBRE assíncrono
 * Stack retratada: Java 25 + Micronaut (Netty) + Project Reactor + broker.
 * Padrão "sync over async" (request-reply): o cliente faz UMA chamada síncrona,
 * mas por baixo o trabalho roda assíncrono num worker; a API segura a conexão
 * (sem prender thread) e responde quando a resposta volta, casada por correlationId.
 * Formato: diagrama de sequência (4 lifelines: Cliente, API, Broker, Worker).
 * Mesmo motor do HTTP; só muda o CONTEÚDO (elements + steps).
 * ==========================================================================*/
(function () {
  const W = 1320, H = 820;
  const C = 190, A = 560, B = 900, K = 1180;        // colunas (lifelines)

  // uma mensagem = seta horizontal + rótulo acima
  const msg = (id, x1, x2, y, label, color) => ([
    { id, type: "arrow", x1, y1: y, x2, y2: y, color },
    { id: id + "_l", type: "label", x: (x1 + x2) / 2, y: y - 12, sub: true, anchor: "middle", mono: true, label },
  ]);
  // dot que percorre uma mensagem
  const dot = (id, x, y, color) => ({ id, type: "box", x: x - 9, y: y - 9, w: 18, h: 18, rx: 9, fill: color || "var(--accent)" });
  // anima um dot ao longo de uma mensagem e desenha a seta (idempotente)
  const fly = (ctx, dotId, msgId, dx) => {
    ctx.moveTo(dotId, 0, 0); ctx.show(dotId); ctx.drawArrow(msgId);
    setTimeout(() => ctx.moveTo(dotId, dx, 0), 60);
  };

  const elements = [
    // cabeçalhos das quatro colunas
    { id: "cli", type: "box", x: C - 90, y: 38, w: 180, h: 46, label: "🧑 Cliente" },
    { id: "api", type: "box", x: A - 115, y: 38, w: 230, h: 46, label: "⚙️ API Micronaut · Netty" },
    { id: "brk", type: "box", x: B - 90, y: 38, w: 180, h: 46, label: "📨 Broker" },
    { id: "wrk", type: "box", x: K - 115, y: 38, w: 230, h: 46, label: "🏦 Worker · Autorizador" },
    // lifelines (tracejadas)
    { id: "ll_c", type: "arrow", noHead: true, dashed: true, color: "var(--muted)", path: `M${C},86 L${C},795` },
    { id: "ll_a", type: "arrow", noHead: true, dashed: true, color: "var(--muted)", path: `M${A},86 L${A},795` },
    { id: "ll_b", type: "arrow", noHead: true, dashed: true, color: "var(--muted)", path: `M${B},86 L${B},795` },
    { id: "ll_k", type: "arrow", noHead: true, dashed: true, color: "var(--muted)", path: `M${K},86 L${K},795` },

    // conexão HTTP segurada (persiste do cenário 3 em diante)
    { id: "held", type: "token", x: 205, y: 104, w: 210, h: 30, mono: true, label: "conexão HTTP aberta ⏳" },

    // 1 · request síncrono
    ...msg("m_req", C, A, 158, "1 · POST /pagamentos", "var(--accent)"),
    dot("d_req", C, 158, "var(--accent)"),

    // anti-padrão (cenário 2 — exclusivo da cena, revelado em enter)
    { id: "ap_block", type: "box", group: "ap", x: A - 120, y: 210, w: 240, h: 44, fill: "#3a1d2a", label: "Thread.block() ⛔" },
    { id: "ap_pool", type: "box", group: "ap", x: A - 130, y: 268, w: 260, h: 84, fill: "#2a1d2a",
      label: ["pool de threads", "🧵🧵🧵 → esgota", "sob alta volumetria"] },

    // solução reativa (cenário 3 — exclusivo da cena)
    { id: "sol_mono", type: "token", group: "sol", x: A - 115, y: 104, w: 230, h: 30, mono: true, label: "return Mono<HttpResponse>" },
    { id: "sol_free", type: "label", group: "sol", x: A, y: 196, sub: true, anchor: "middle", label: "event loop livre ♻️ (sem thread parada)" },

    // registro de pendências + a promessa da resposta
    { id: "pend", type: "box", x: A - 115, y: 214, w: 230, h: 46, fill: "#1b2747", label: "Pendências  id → Sinks.One" },
    { id: "sink", type: "token", x: A - 72, y: 276, w: 144, h: 34, mono: true, label: "Sinks.One ⏳" },
    { id: "corr", type: "label", x: A, y: 332, sub: true, mono: true, anchor: "middle", label: "correlationId = a1b2c3" },

    // 2 · publica o comando
    ...msg("m_cmd", A, B, 400, "2 · comando + correlationId", "var(--warn)"),
    dot("d_cmd", A, 400, "var(--warn)"),

    // worker processa
    { id: "proc", type: "box", x: K - 105, y: 446, w: 210, h: 42, fill: "#22315d", label: "autoriza (regras · antifraude)" },

    // 3 · worker responde
    ...msg("m_resp", K, B, 522, "3 · resultado + correlationId", "var(--good)"),
    dot("d_resp", K, 522, "var(--good)"),

    // 4 · listener entrega à API
    ...msg("m_listen", B, A, 592, "4 · listener entrega", "var(--accent-2)"),
    dot("d_listen", B, 592, "var(--accent-2)"),
    { id: "match", type: "label", x: A, y: 562, sub: true, mono: true, anchor: "middle", label: "lookup(id) → sink.tryEmitValue()" },

    // 5 · resposta HTTP na conexão segurada
    ...msg("m_http", A, C, 700, "5 · 200 aprovado ✓", "var(--hot)"),
    dot("d_http", A, 700, "var(--hot)"),
    { id: "status", type: "token", x: C - 85, y: 730, w: 170, h: 38, label: "200 aprovado ✓" },

    // robustez (cenário — exclusivo da cena, banda esquerda)
    { id: "rb_to", type: "box", group: "rb", x: 150, y: 250, w: 290, h: 46, fill: "#1b2747", label: "⏱ .timeout(2s) → 504 + limpa o mapa" },
    { id: "rb_idem", type: "box", group: "rb", x: 150, y: 312, w: 290, h: 46, fill: "#1b2747", label: "🔁 dedup por correlationId (at-least-once)" },
    { id: "rb_back", type: "box", group: "rb", x: 150, y: 374, w: 290, h: 46, fill: "#1b2747", label: "🛟 backpressure · DLQ · retry" },

    // volumetria & roteamento (cenário — exclusivo da cena, banda esquerda)
    { id: "vl_i1", type: "box", group: "vl", x: 150, y: 250, w: 90, h: 56, label: "API #1" },
    { id: "vl_i2", type: "box", group: "vl", x: 252, y: 250, w: 90, h: 56, fill: "#22315d", label: "API #2" },
    { id: "vl_i3", type: "box", group: "vl", x: 354, y: 250, w: 90, h: 56, label: "API #3" },
    { id: "vl_note", type: "box", group: "vl", x: 150, y: 322, w: 294, h: 88, fill: "#1b2747",
      label: ["resposta → instância dona", "do Sinks.One", "canal: reply.{instanceId}"] },

    // Kafka vs Redis (cenário — exclusivo da cena, dois painéis)
    { id: "kk_p", type: "box", group: "kk", x: 230, y: 150, w: 380, h: 244, fill: "#161f3a" },
    { id: "kk_t", type: "label", group: "kk", x: 420, y: 188, anchor: "middle", label: "📨 Apache Kafka" },
    { id: "kk_1", type: "label", group: "kk", x: 420, y: 226, sub: true, anchor: "middle", label: "tópico de resposta + correlationId" },
    { id: "kk_2", type: "label", group: "kk", x: 420, y: 259, sub: true, anchor: "middle", label: "partições → throughput massivo" },
    { id: "kk_3", type: "label", group: "kk", x: 420, y: 292, sub: true, anchor: "middle", label: "durável · replay · DLQ" },
    { id: "kk_4", type: "label", group: "kk", x: 420, y: 325, sub: true, anchor: "middle", label: "reply.{instanceId} p/ rotear" },
    { id: "kk_5", type: "label", group: "kk", x: 420, y: 366, anchor: "middle", label: "✓ volumetria + garantias" },

    { id: "rd_p", type: "box", group: "rd", x: 710, y: 150, w: 380, h: 244, fill: "#161f3a" },
    { id: "rd_t", type: "label", group: "rd", x: 900, y: 188, anchor: "middle", label: "⚡ Redis" },
    { id: "rd_1", type: "label", group: "rd", x: 900, y: 226, sub: true, anchor: "middle", label: "Pub/Sub: broadcast a todas instâncias" },
    { id: "rd_2", type: "label", group: "rd", x: 900, y: 259, sub: true, anchor: "middle", label: "cada instância checa seu mapa local" },
    { id: "rd_3", type: "label", group: "rd", x: 900, y: 292, sub: true, anchor: "middle", label: "latência mínima · simples" },
    { id: "rd_4", type: "label", group: "rd", x: 900, y: 325, sub: true, anchor: "middle", label: "Streams se quiser durabilidade" },
    { id: "rd_5", type: "label", group: "rd", x: 900, y: 366, anchor: "middle", label: "✓ baixa latência, sem rotear" },
  ];

  // ids do fluxo (sequência) — escondidos na cena de comparação, re-exibidos no resumo
  const SEQ = [
    "held", "m_req", "m_req_l", "pend", "sink", "corr",
    "m_cmd", "m_cmd_l", "proc", "m_resp", "m_resp_l",
    "m_listen", "m_listen_l", "match", "m_http", "m_http_l", "status",
  ];

  const steps = [
    {
      title: "O problema: síncrono por fora, assíncrono por dentro",
      show: ["cli", "api", "brk", "wrk", "ll_c", "ll_a", "ll_b", "ll_k", "m_req", "m_req_l"],
      highlight: ["m_req_l"],
      balloon: { anchor: "m_req_l", placement: "bottom",
        text: "O cliente faz <strong>uma</strong> chamada síncrona — <code>POST /pagamentos</code> — e espera <strong>aprovado/negado</strong> nessa mesma resposta. Mas a autorização é <strong>assíncrona e desacoplada</strong>: roda num <strong>worker</strong> atrás de um <strong>broker</strong>.",
        why: "O desafio é entregar UMA resposta síncrona ao cliente enquanto, por baixo, o trabalho viaja por mensageria. Como segurar a conexão até a resposta chegar?" },
      enter: (ctx) => fly(ctx, "d_req", "m_req", A - C),
    },
    {
      title: "Anti-padrão: bloquear a thread esperando",
      show: ["m_req", "m_req_l"], highlight: ["api"],
      balloon: { anchor: "ap_pool", placement: "right",
        text: "O caminho ingênuo: a thread que atendeu o request fica <strong>parada</strong> (<code>future.get()</code> / <code>block()</code>) até a resposta voltar.",
        why: "Cada chamada em voo <strong>prende uma thread</strong>. Com muita volumetria, o pool esgota e a API <strong>trava</strong> — não escala. Precisamos segurar a conexão <em>sem</em> prender thread." },
      enter: (ctx) => ctx.reveal("ap", 110),
    },
    {
      title: "Solução: Micronaut sobre Netty (não-bloqueante)",
      show: ["m_req", "m_req_l", "held"], highlight: ["api", "held"],
      balloon: { anchor: "sol_mono", placement: "right",
        text: "O controller devolve um <strong>tipo reativo</strong> — <code>Mono&lt;HttpResponse&gt;</code> — em vez de bloquear. O Micronaut roda sobre o <span class=\"xp-term\" tabindex=\"0\" data-tip=\"Loop de eventos não-bloqueante do Netty: poucas threads atendem milhares de conexões.\">event loop do Netty</span>.",
        why: "A conexão TCP fica <strong>aberta</strong>, mas <strong>nenhuma thread</strong> fica parada: ela volta ao loop e atende outras conexões. É isso que sustenta <strong>muita volumetria</strong>." },
      enter: (ctx) => ctx.reveal("sol", 120),
    },
    {
      title: "correlationId + Sinks.One = a promessa da resposta",
      show: ["m_req", "m_req_l", "held", "pend", "sink", "corr"], highlight: ["pend", "sink"],
      balloon: { anchor: "pend", placement: "right",
        text: "A API gera um <strong>correlationId</strong>, cria um <strong><code>Sinks.One</code></strong> (Project Reactor) e o guarda num <code>ConcurrentHashMap&lt;id, Sinks.One&gt;</code>. O <code>Mono</code> devolvido é <code>sink.asMono()</code>.",
        why: "O <code>Sinks.One</code> é a “promessa” que será <strong>completada depois</strong>, quando a resposta chegar. O mapa liga cada resposta futura à conexão certa." },
    },
    {
      title: "Publica o comando no broker (assíncrono)",
      show: ["m_req", "m_req_l", "held", "pend", "sink", "corr", "m_cmd", "m_cmd_l"],
      highlight: ["m_cmd_l", "brk"],
      balloon: { anchor: "m_cmd_l", placement: "bottom",
        text: "A API <strong>publica</strong> o comando de autorização no broker (fire-and-forget), carregando o <strong>correlationId</strong> e um <em>reply-to</em>. Aí ela já “solta” a thread.",
        why: "Publicar é barato e não-bloqueante. O acoplamento é só com o broker — o worker pode escalar, cair e voltar sem afetar a API." },
      enter: (ctx) => fly(ctx, "d_cmd", "m_cmd", B - A),
    },
    {
      title: "Worker processa de forma independente",
      show: ["m_req", "m_req_l", "held", "pend", "sink", "corr", "m_cmd", "m_cmd_l", "proc"],
      highlight: ["proc", "wrk"],
      balloon: { anchor: "proc", placement: "top",
        text: "O <strong>worker</strong> consome o comando e executa a autorização: regras de negócio, antifraude, chamada ao adquirente… no seu próprio ritmo.",
        why: "Desacoplado, ele pode ter <strong>seu próprio pool</strong>, escalar por partição/consumer group e aplicar backpressure — sem nunca segurar a conexão do cliente." },
    },
    {
      title: "Worker responde (mesmo correlationId)",
      show: ["m_req", "m_req_l", "held", "pend", "sink", "corr", "m_cmd", "m_cmd_l", "proc", "m_resp", "m_resp_l"],
      highlight: ["m_resp_l"],
      balloon: { anchor: "m_resp_l", placement: "bottom",
        text: "Pronto o resultado, o worker o <strong>publica de volta</strong> no canal/tópico de <strong>resposta</strong>, repetindo o <strong>mesmo correlationId</strong>.",
        why: "O correlationId é o fio que costura ida e volta: é por ele que a API saberá <em>qual</em> conexão pendente essa resposta completa." },
      enter: (ctx) => fly(ctx, "d_resp", "m_resp", -(B - K)),
    },
    {
      title: "A API escuta, casa o id e responde",
      show: ["m_req", "m_req_l", "held", "pend", "sink", "corr", "m_cmd", "m_cmd_l", "proc",
             "m_resp", "m_resp_l", "m_listen", "m_listen_l", "match", "m_http", "m_http_l", "status"],
      highlight: ["match", "status"],
      balloon: { anchor: "match", placement: "left",
        text: "Um <strong>listener</strong> (<code>@KafkaListener</code> / subscriber Redis) recebe a resposta, faz <code>lookup(correlationId)</code> no mapa e chama <code>sink.tryEmitValue(...)</code> — isso <strong>completa o Mono</strong>, e o Micronaut escreve a resposta HTTP na <strong>conexão que estava aberta</strong>.",
        why: "Aqui se fecha o ciclo: o assíncrono virou síncrono <em>para o cliente</em>, que recebe o <strong>200 aprovado</strong> na chamada original — sem nunca ter prendido uma thread." },
      enter: (ctx) => {
        fly(ctx, "d_listen", "m_listen", -(B - A));
        setTimeout(() => fly(ctx, "d_http", "m_http", -(A - C)), 520);
      },
    },
    {
      title: "Robustez: o que dá errado (e como segurar)",
      show: SEQ.concat(["cli", "api", "brk", "wrk", "ll_c", "ll_a", "ll_b", "ll_k"]),
      dim: ["m_cmd", "m_cmd_l", "m_resp", "m_resp_l", "m_listen", "m_listen_l", "proc"],
      highlight: ["sink"],
      balloon: { anchor: "rb_to", placement: "right",
        text: "Toda conexão segurada precisa de saída garantida: <strong><code>.timeout(Duration)</code></strong> responde 504 e <strong>remove a entrada do mapa</strong> (senão vaza memória); <strong>idempotência</strong> via dedup por correlationId (entrega é at-least-once); <strong>backpressure</strong> e <strong>DLQ/retry</strong> quando a resposta não vem.",
        why: "Sem timeout, uma resposta perdida deixaria a conexão (e o <code>Sinks.One</code>) presa para sempre. Robustez aqui é o que separa demo de produção." },
      enter: (ctx) => ctx.reveal("rb", 110),
    },
    {
      title: "Volumetria: roteando a resposta de volta",
      show: SEQ.concat(["cli", "api", "brk", "wrk", "ll_c", "ll_a", "ll_b", "ll_k"]),
      dim: ["m_cmd", "m_cmd_l", "m_resp", "m_resp_l", "proc"],
      highlight: ["pend", "sink"],
      balloon: { anchor: "vl_note", placement: "right",
        text: "Em produção há <strong>N instâncias</strong> da API, sem estado compartilhado. Mas o <code>Sinks.One</code> vive na <strong>memória da instância</strong> que recebeu o request — então a resposta precisa voltar <strong>para ela</strong>.",
        why: "Soluções de mercado: um <strong>canal/tópico de resposta por instância</strong> (<code>reply.{instanceId}</code>), ou um transporte que faz <strong>broadcast</strong> e deixa cada instância checar seu mapa local. Escolher errado = respostas que nunca casam." },
      enter: (ctx) => ctx.reveal("vl", 100),
    },
    {
      title: "As duas opções de transporte: Kafka vs Redis",
      show: ["cli", "api", "brk", "wrk", "ll_c", "ll_a", "ll_b", "ll_k"],
      hide: SEQ,
      balloon: { anchor: "kk_p", placement: "bottom",
        text: "Para o canal de resposta, duas escolhas de mercado: <strong>Kafka</strong> (durável, particionado, com replay — ideal para <strong>volumetria + garantias</strong>; roteie com <code>reply.{instanceId}</code>) e <strong>Redis</strong> (Pub/Sub de <strong>baixíssima latência</strong> que faz broadcast — cada instância casa no seu mapa; Streams se quiser durabilidade).",
        why: "Trade-off clássico: Kafka entrega <strong>durabilidade e throughput</strong> ao custo de mais peças; Redis entrega <strong>latência e simplicidade</strong>, com menos garantias. A escolha segue o SLA do seu pagamento." },
      enter: (ctx) => { ctx.reveal("kk", 90); setTimeout(() => ctx.reveal("rd", 90), 200); },
    },
    {
      title: "Teste rápido",
      show: ["cli", "api", "brk", "wrk", "ll_c", "ll_a", "ll_b", "ll_k"],
      balloon: { anchor: "api", placement: "bottom",
        text: "Antes do resumo, fixe o ponto central 👇" },
      quiz: {
        question: "Por que a API consegue segurar milhares de conexões esperando a resposta assíncrona sem travar?",
        options: [
          "Porque abre uma thread dedicada por conexão e aumenta o pool",
          "Porque devolve um Mono (reativo) e o event loop libera a thread enquanto a conexão fica aberta",
          "Porque o cliente faz polling e refaz a chamada várias vezes",
          "Porque o broker responde direto ao cliente, sem passar pela API",
        ],
        answer: 1,
        explain: "Sobre o Netty, o controller devolve um Mono e nenhuma thread fica parada: a conexão segue aberta, e o Sinks.One é completado quando a resposta chega pelo correlationId. Bloquear thread (opção 1) é justamente o anti-padrão.",
      },
    },
    {
      title: "Resumo do fluxo",
      show: SEQ.concat(["cli", "api", "brk", "wrk", "ll_c", "ll_a", "ll_b", "ll_k"]),
      highlight: ["m_req_l", "status"],
      balloon: { anchor: { x: 660, y: 120 }, placement: "bottom",
        text: "O caminho: <strong>request → Mono+Sinks.One (correlationId) → publica no broker → worker processa → publica resposta (mesmo id) → listener completa o Mono → resposta HTTP</strong> na conexão segurada.",
        why: "Síncrono <em>para o cliente</em>, assíncrono <em>por dentro</em>: não-bloqueante (Netty), desacoplado (broker), casado por correlationId e blindado com timeout/idempotência. É assim que se aguenta volumetria de verdade." },
      enter: (ctx) => ["m_req", "m_cmd", "m_resp", "m_listen", "m_http"].forEach((a, k) => setTimeout(() => ctx.pulse(a, true), k * 130)),
    },
  ];

  window.SYNC_ASYNC_DIAGRAM = {
    title: "Síncrono sobre assíncrono",
    subtitle: "Segurar a conexão e escutar a resposta · Java + Micronaut",
    width: W, height: H, autoplayMs: 9000, elements, steps,
  };
})();
