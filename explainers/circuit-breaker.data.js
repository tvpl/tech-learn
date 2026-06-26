/* ============================================================================
 * circuit-breaker.data.js — Explicador: Circuit Breaker
 * Máquina de estados: CLOSED → OPEN → HALF-OPEN → CLOSED
 * ==========================================================================*/
(function () {
  const W = 1280, H = 720;

  // Estados como círculos grandes no lado esquerdo
  const ST = {
    closed:   { x: 130, y: 160, r: 90 },
    open:     { x: 130, y: 400, r: 90 },
    halfopen: { x: 130, y: 610, r: 70 },
  };

  // Serviço cliente e serviço dependente à direita
  const CLX = 600, SRX = 1000;

  const circle = (id, s, fill, stroke, label) => ({
    id, type: "box",
    x: s.x - s.r, y: s.y - s.r, w: s.r*2, h: s.r*2,
    rx: s.r, fill, stroke, label,
  });

  const elements = [
    /* ── ESTADOS ─────────────────────────────────── */
    { ...circle("st_closed", ST.closed, "#112318", "var(--good)",
        ["✓ CLOSED", "(fechado)", "requisições", "passam"]) },
    { ...circle("st_open", ST.open, "#3a1320", "var(--hot)",
        ["✗ OPEN", "(aberto)", "requisições", "BLOQUEADAS"]) },
    { ...circle("st_halfopen", ST.halfopen, "#1a1208", "var(--warn)",
        ["? HALF", "OPEN"]) },

    // Rótulo de estado
    { id: "st_lbl", type: "label", x: 130, y: 26, anchor: "middle", label: "Estado do Circuit Breaker" },

    /* ── TRANSIÇÕES ──────────────────────────────── */
    { id: "a_co", type: "arrow", x1: 130, y1: ST.closed.y+ST.closed.r,
      x2: 130, y2: ST.open.y-ST.open.r, color: "var(--hot)" },
    { id: "lbl_co", type: "label", x: 180, y: (ST.closed.y+ST.open.y)/2, sub: true, label: "threshold atingido" },

    { id: "a_oh", type: "arrow", x1: 130, y1: ST.open.y+ST.open.r,
      x2: 130, y2: ST.halfopen.y-ST.halfopen.r, color: "var(--warn)" },
    { id: "lbl_oh", type: "label", x: 180, y: (ST.open.y+ST.halfopen.y)/2, sub: true, label: "timer expira" },

    { id: "a_hc", type: "arrow",
      path: `M${ST.halfopen.x-ST.halfopen.r},${ST.halfopen.y} C${-60},${ST.halfopen.y} ${-60},${ST.closed.y} ${ST.closed.x-ST.closed.r},${ST.closed.y}`,
      color: "var(--good)" },
    { id: "lbl_hc", type: "label", x: -30, y: (ST.halfopen.y+ST.closed.y)/2, sub: true, anchor: "middle", label: "probe ok" },

    { id: "a_ho", type: "arrow",
      path: `M${ST.halfopen.x+ST.halfopen.r},${ST.halfopen.y} C${320},${ST.halfopen.y} ${320},${ST.open.y} ${ST.open.x+ST.open.r},${ST.open.y}`,
      color: "var(--hot)" },
    { id: "lbl_ho", type: "label", x: 350, y: (ST.halfopen.y+ST.open.y)/2, sub: true, anchor: "middle", label: "probe falhou" },

    /* ── CLIENTE e SERVIÇO ──────────────────────── */
    { id: "cl_box", type: "box", x: CLX-100, y: 220, w: 200, h: 80, fill: "#1b2747", stroke: "var(--accent)", label: ["📱 Serviço A", "(cliente)"] },
    { id: "sv_box", type: "box", x: SRX-100, y: 220, w: 200, h: 80, fill: "#22315d", stroke: "var(--accent-2)", label: ["⚙️ Serviço B", "(dependência)"] },

    // Seta normal (CLOSED)
    { id: "req_ok",  type: "arrow", x1: CLX+100, y1: 260, x2: SRX-100, y2: 260, color: "var(--good)" },
    { id: "req_ok_l", type: "label", x: (CLX+SRX)/2, y: 243, anchor: "middle", sub: true, mono: true, label: "request → OK (200)" },
    { id: "resp_ok2", type: "arrow", x1: SRX-100, y1: 290, x2: CLX+100, y2: 290, color: "var(--good)" },
    { id: "resp_ok2_l", type: "label", x: (CLX+SRX)/2, y: 308, anchor: "middle", sub: true, mono: true, label: "response ← 200 ms" },

    // Contador de falhas
    { id: "fail_ctr", type: "box", x: CLX+140, y: 340, w: 240, h: 80, fill: "#1a1208", stroke: "var(--warn)",
      label: ["Contador de falhas", "████░░░░ 4/5"] },
    { id: "fail_bar", type: "vector", x: CLX+150, y: 350, w: 28, h: 60, values: [0.8], color: "var(--warn)" },
    { id: "fail_lbl", type: "label", x: CLX+240, y: 432, anchor: "middle", sub: true, label: "threshold: 5 falhas em 10s" },

    // Seta bloqueada (OPEN)
    { id: "req_blk",  type: "arrow", x1: CLX+100, y1: 480, x2: CLX+200, y2: 480, color: "var(--hot)" },
    { id: "req_blk_l", type: "label", x: CLX+150, y: 463, anchor: "middle", sub: true, mono: true, label: "request" },
    { id: "blk_box",   type: "box", x: CLX+210, y: 460, w: 160, h: 44, fill: "#3a1320", stroke: "var(--hot)", label: "⛔ OPEN: bloqueado" },
    { id: "fast_fail", type: "arrow", x1: CLX+210, y1: 500, x2: CLX+100, y2: 500, color: "var(--hot)" },
    { id: "fast_lbl",  type: "label", x: CLX+155, y: 518, anchor: "middle", sub: true, mono: true, label: "← 503 imediato" },

    // Timer OPEN
    { id: "timer_box", type: "box", x: SRX-100, y: 440, w: 200, h: 80, fill: "#22315d",
      label: ["⏱️ Timer OPEN", "aguardando 30s..."] },

    // Probe request (HALF-OPEN)
    { id: "probe_req",  type: "arrow", x1: CLX+100, y1: 620, x2: SRX-100, y2: 620, color: "var(--warn)" },
    { id: "probe_req_l", type: "label", x: (CLX+SRX)/2, y: 603, anchor: "middle", sub: true, mono: true, label: "probe request" },
    { id: "probe_ok",   type: "token", x: SRX-90, y: 636, w: 180, h: 36, fill: "#112318", stroke: "var(--good)", label: "✓ 200 OK → CLOSED" },
    { id: "probe_fail", type: "token", x: SRX-90, y: 680, w: 180, h: 36, fill: "#3a1320", stroke: "var(--hot)", label: "✗ falhou → OPEN" },

    /* ── CASCADE FAILURE SCENARIO ────────────────── */
    { id: "cascade_box", type: "box", x: 460, y: 56, w: 780, h: 140, fill: "#1a1208", stroke: "var(--hot)", rx: 10 },
    { id: "cascade_lbl", type: "label", x: 850, y: 76, anchor: "middle", label: "Sem Circuit Breaker: Falha em cascata" },
    { id: "casc1", type: "token", x: 480, y: 96,  w: 170, h: 36, fill: "#3a1320", stroke: "var(--hot)", label: "DB lento" },
    { id: "casc2", type: "token", x: 680, y: 96,  w: 170, h: 36, fill: "#3a1320", stroke: "var(--hot)", label: "Auth timeout" },
    { id: "casc3", type: "token", x: 880, y: 96,  w: 170, h: 36, fill: "#3a1320", stroke: "var(--hot)", label: "API esgotada" },
    { id: "casc4", type: "token", x: 1080,y: 96,  w: 170, h: 36, fill: "#3a1320", stroke: "var(--hot)", label: "Site fora!" },
    { id: "a_c12", type: "arrow", x1: 652, y1: 114, x2: 678, y2: 114, color: "var(--hot)" },
    { id: "a_c23", type: "arrow", x1: 852, y1: 114, x2: 878, y2: 114, color: "var(--hot)" },
    { id: "a_c34", type: "arrow", x1: 1052, y1: 114, x2: 1078, y2: 114, color: "var(--hot)" },
    { id: "cascade_desc", type: "label", x: 850, y: 156, anchor: "middle", sub: true,
      label: "Uma falha derruba todo o sistema por filas bloqueadas e threads esgotadas" },
  ];

  const steps = [
    {
      title: "O problema: falhas em cascata",
      show: ["cascade_box","cascade_lbl","casc1","casc2","casc3","casc4",
             "a_c12","a_c23","a_c34","cascade_desc"],
      highlight: ["casc4"],
      balloon: { anchor: "cascade_box", placement: "bottom",
        text: "Em sistemas distribuídos, uma falha num serviço lento faz com que outros serviços fiquem bloqueados esperando resposta. As threads se esgotam, as filas enchem e a falha se propaga em <strong>cascata</strong> — derrubando tudo.",
        why: "O Circuit Breaker foi criado especificamente para cortar essa cascata: ao detectar que um serviço está falhando, ele para de chamar o serviço imediatamente, evitando que o problema se alastre." },
      enter: (ctx) => {
        ["casc1","casc2","casc3","casc4"].forEach((id, i) => setTimeout(() => ctx.show(id), i * 150));
        setTimeout(() => { ["a_c12","a_c23","a_c34"].forEach((id, i) => setTimeout(() => ctx.drawArrow(id), i * 100)); }, 600);
      },
    },
    {
      title: "O padrão Circuit Breaker",
      show: ["st_lbl", "st_closed", "st_open", "st_halfopen"],
      highlight: ["st_closed"],
      balloon: { anchor: "st_closed", placement: "right",
        text: "O Circuit Breaker é uma <strong>máquina de estados</strong> com três estados: <strong>CLOSED</strong> (circuito fechado, tráfego normal), <strong>OPEN</strong> (circuito aberto, tráfego bloqueado) e <strong>HALF-OPEN</strong> (testando se o serviço recuperou).",
        why: "O nome vem dos disjuntores elétricos: quando detecta sobrecarga, abre o circuito para proteger o sistema. Quando a tensão normaliza, pode ser testado novamente." },
    },
    {
      title: "Estado CLOSED: operação normal",
      show: ["cl_box", "sv_box", "req_ok", "req_ok_l", "resp_ok2", "resp_ok2_l"],
      highlight: ["st_closed", "req_ok"],
      balloon: { anchor: "st_closed", placement: "right",
        text: "No estado <strong>CLOSED</strong>, todas as requisições passam normalmente para o serviço dependente. O Circuit Breaker monitora cada chamada: tempo de resposta, códigos de erro e timeouts.",
        why: "Em CLOSED, o CB é quase transparente — apenas um interceptador que observa. O overhead é mínimo (uma comparação de contador por chamada)." },
      enter: (ctx) => {
        ctx.drawArrow("req_ok");
        setTimeout(() => ctx.drawArrow("resp_ok2"), 500);
      },
    },
    {
      title: "Falhas acumulam no contador",
      show: ["fail_ctr", "fail_bar", "fail_lbl"],
      highlight: ["fail_ctr", "st_closed"],
      balloon: { anchor: "fail_ctr", placement: "top",
        text: "A cada falha (timeout, 5xx, exception), o <strong>contador de falhas</strong> incrementa. Quando atinge o <strong>threshold</strong> (ex.: 5 falhas em 10 segundos), o CB transita para OPEN.",
        why: "O threshold evita que uma falha isolada abra o circuito. Configurar threshold muito baixo causa falsos positivos; muito alto demora a proteger. Ajuste baseado no SLA do serviço." },
      enter: (ctx) => {
        ctx.setBars("fail_bar", [0.4]);
        setTimeout(() => ctx.setBars("fail_bar", [0.6]), 300);
        setTimeout(() => ctx.setBars("fail_bar", [0.8]), 600);
      },
    },
    {
      title: "Threshold atingido → OPEN",
      show: ["a_co", "lbl_co"],
      highlight: ["st_open", "a_co"],
      balloon: { anchor: "st_open", placement: "right",
        text: "Com o threshold atingido, o CB transita para <strong>OPEN</strong>. A partir daqui, ele rejeita <em>todas</em> as chamadas imediatamente, sem tentar contactar o serviço dependente.",
        why: "Fail fast em OPEN é intencional: melhor retornar um erro instantâneo do que bloquear threads por segundos esperando um serviço que sabemos estar falhando." },
      enter: (ctx) => { ctx.drawArrow("a_co"); },
    },
    {
      title: "Estado OPEN: fast-fail sem chamar o serviço",
      show: ["req_blk", "req_blk_l", "blk_box", "fast_fail", "fast_lbl", "timer_box"],
      highlight: ["st_open", "blk_box"],
      balloon: { anchor: "blk_box", placement: "top",
        text: "Em <strong>OPEN</strong>, o CB intercepta a chamada e responde com <strong>503 imediato</strong> — sem nem tentar contactar o Serviço B. Um timer conta o tempo de espera (ex.: 30 segundos).",
        why: "O cliente recebe um erro rápido e pode tomar uma ação alternativa: retornar dados do cache, mostrar mensagem de manutenção ou redirecionar para backup." },
      enter: (ctx) => {
        ctx.drawArrow("req_blk");
        setTimeout(() => ctx.drawArrow("fast_fail"), 400);
      },
    },
    {
      title: "Timer expira → HALF-OPEN",
      show: ["a_oh", "lbl_oh"],
      highlight: ["st_halfopen", "a_oh"],
      balloon: { anchor: "st_halfopen", placement: "right",
        text: "Após o timer de espera expirar, o CB transita para <strong>HALF-OPEN</strong>: ele permite que <em>uma única</em> requisição de teste (probe) passe para o serviço dependente.",
        why: "HALF-OPEN é o mecanismo de auto-recuperação: o CB verifica periodicamente se o serviço voltou a funcionar, sem precisar de intervenção humana para reativar." },
      enter: (ctx) => { ctx.drawArrow("a_oh"); },
    },
    {
      title: "Probe: testando se o serviço recuperou",
      show: ["probe_req", "probe_req_l", "probe_ok", "probe_fail"],
      highlight: ["st_halfopen", "probe_req"],
      balloon: { anchor: "probe_req", placement: "top",
        text: "O <strong>probe request</strong> vai ao Serviço B. Se retornar sucesso (2xx dentro do timeout), o CB transita para CLOSED — tráfego normal é retomado. Se falhar, volta para OPEN e o timer recomeça.",
        why: "Uma probe é suficiente — não é necessário aquecer com múltiplas chamadas. Isso minimiza a carga no serviço que está se recuperando." },
      enter: (ctx) => { ctx.drawArrow("probe_req"); },
    },
    {
      title: "Sucesso → volta a CLOSED",
      show: ["a_hc", "lbl_hc"],
      highlight: ["st_closed", "a_hc"],
      balloon: { anchor: "st_closed", placement: "right",
        text: "Probe bem-sucedido → CB transita de HALF-OPEN para <strong>CLOSED</strong>. O tráfego normal é retomado gradualmente. O contador de falhas é zerado.",
        why: "A recuperação é automática: o sistema se auto-cura sem intervenção humana. Isso é fundamental para alta disponibilidade em microservices." },
      enter: (ctx) => { ctx.drawArrow("a_hc"); },
    },
    {
      title: "Falha na probe → volta a OPEN",
      show: ["a_ho", "lbl_ho"],
      highlight: ["st_open", "a_ho"],
      balloon: { anchor: "st_open", placement: "left",
        text: "Se a probe falhar, o CB volta para <strong>OPEN</strong> e o timer recomeça. O serviço ainda não recuperou — o sistema aguarda mais um ciclo antes de tentar novamente.",
        why: "Back-off exponencial pode ser implementado: primeiro espera 30s, depois 60s, depois 120s. Isso evita sobrecarregar um serviço que está tentando se recuperar." },
      enter: (ctx) => { ctx.drawArrow("a_ho"); },
    },
    {
      title: "Quiz rápido",
      balloon: { anchor: { x: 640, y: 360 }, placement: "right",
        text: "Confirme o que você aprendeu sobre Circuit Breaker 👇" },
      quiz: {
        question: "Por que o estado HALF-OPEN envia apenas UMA requisição de probe (e não várias)?",
        options: [
          "Para economizar bandwidth — múltiplas probes consumiriam muitos recursos de rede",
          "Para minimizar a carga em um serviço que está se recuperando; uma probe é suficiente para verificar",
          "Porque o protocolo HTTP não suporta requisições paralelas em HALF-OPEN",
          "Para garantir que o serviço cliente não espere mais de uma resposta simultânea",
        ],
        answer: 1,
        explain: "Um serviço em recuperação pode estar frágil — sobrecarregá-lo com múltiplas probes pode derrubá-lo novamente. Uma única probe é suficiente: se passar, o serviço está estável; se falhar, volta a OPEN.",
      },
    },
    {
      title: "Resumo: Circuit Breaker",
      highlight: ["st_closed", "st_open", "st_halfopen"],
      balloon: { anchor: { x: 130, y: 400 }, placement: "right",
        text: "<strong>CLOSED</strong>: tráfego normal, monitora falhas. <strong>OPEN</strong>: bloqueia tudo, fast-fail, aguarda timer. <strong>HALF-OPEN</strong>: probe única — sucesso → CLOSED, falha → OPEN. Evita cascata e permite auto-recuperação.",
        why: "Circuit Breaker é essencial em microservices: cada serviço depende de outros, e sem CB, uma falha isolada derruba o sistema inteiro. Com CB, cada serviço falha de forma controlada e se recupera automaticamente." },
      enter: (ctx) => {
        ["st_closed","st_open","st_halfopen"].forEach((id, k) => setTimeout(() => ctx.pulse(id, true), k * 120));
      },
    },
  ];

  window.CIRCUIT_BREAKER_DIAGRAM = {
    title: "Circuit Breaker — Resiliência de serviços",
    subtitle: "CLOSED → OPEN → HALF-OPEN: evitar falhas em cascata",
    width: W, height: H, autoplayMs: 9000, elements, steps,
  };
})();
