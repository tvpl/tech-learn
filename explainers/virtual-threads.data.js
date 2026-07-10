(function () {
  const W = 1280, H = 720;

  /* ── Two-column layout ── */
  const LEFT_X = 60, LEFT_W = 520;    // Platform Threads (left)
  const RIGHT_X = 700, RIGHT_W = 520; // Virtual Threads (right)
  const DIV_X = 640;                   // divider

  const COL_Y = 60, COL_H = 500;

  /* Thread box helper */
  function ptBox(i, label, sub, color = "var(--hot)") {
    const x = LEFT_X + 10;
    const y = COL_Y + 60 + i * 90;
    return [
      { id: `pt${i}_box`, type: "box", x, y, w: LEFT_W - 20, h: 72, rx: 8, style: `fill:${color};opacity:0.75` },
      { id: `pt${i}_lbl`, type: "label", x: x + (LEFT_W - 20) / 2, y: y + 26, label: label, style: "font-size:12px;font-weight:700;fill:#fff" },
      { id: `pt${i}_sub`, type: "label", x: x + (LEFT_W - 20) / 2, y: y + 48, label: sub,   style: "font-size:10px;fill:#eee" },
    ];
  }

  function vtBox(i, label, sub, color = "var(--accent)", h = 36) {
    const x = RIGHT_X + 10;
    const y = COL_Y + 60 + i * (h + 8);
    return [
      { id: `vt${i}_box`, type: "box", x, y, w: RIGHT_W - 20, h, rx: 6, style: `fill:${color};opacity:0.75` },
      { id: `vt${i}_lbl`, type: "label", x: x + (RIGHT_W - 20) / 2, y: y + h / 2 + 5, label: label, style: "font-size:11px;font-weight:600;fill:#fff" },
      { id: `vt${i}_sub`, type: "label", x: x + (RIGHT_W - 20) / 2, y: y + h / 2 + 20, label: sub, style: "font-size:9px;fill:#dde" },
    ];
  }

  // JVM carrier threads visual (bottom of right column)
  const CARRIER_Y = COL_Y + 380;
  const OS_Y = COL_Y + 460;

  const PT_BOXES = [0,1,2,3,4].flatMap(i => ptBox(i,
    i < 4 ? `Platform Thread ${i + 1}` : "Thread 5 (WAITING)",
    i < 3 ? "Blocked on I/O 🛑" : i === 3 ? "Blocked on DB 🛑" : "No Thread (pool exhausted!)",
    i < 4 ? "var(--hot)" : "var(--warn)"
  ));

  const VT_BOXES = [0,1,2,3,4,5,6,7,8].flatMap(i => vtBox(i,
    `VThread ${i + 1}`,
    i < 6 ? "mounted" : "parked (I/O wait)",
    i < 6 ? "var(--accent)" : "var(--muted)"
  ));

  const elements = [
    // ── Title ──
    { id: "title_main", type: "label", x: W / 2, y: 32, label: "Virtual Threads — Java 21 / Project Loom", style: "font-size:22px;font-weight:700;fill:var(--ink)" },

    // ── Column headers ──
    { id: "left_hdr", type: "box", x: LEFT_X, y: COL_Y, w: LEFT_W, h: 44, rx: 8, style: "fill:var(--hot);opacity:0.8" },
    { id: "left_hdr_lbl", type: "label", x: LEFT_X + LEFT_W / 2, y: COL_Y + 22, label: "Platform Threads (antes)", style: "font-size:14px;font-weight:700;fill:#fff" },
    { id: "right_hdr", type: "box", x: RIGHT_X, y: COL_Y, w: RIGHT_W, h: 44, rx: 8, style: "fill:var(--accent);opacity:0.8" },
    { id: "right_hdr_lbl", type: "label", x: RIGHT_X + RIGHT_W / 2, y: COL_Y + 22, label: "Virtual Threads (Java 21+)", style: "font-size:14px;font-weight:700;fill:#fff" },

    // ── Divider ──
    { id: "divider", type: "box", x: DIV_X, y: COL_Y, w: 2, h: COL_H + 60, rx: 0, style: "fill:var(--line)" },

    // ── Platform Threads (5 boxes) ──
    ...PT_BOXES,

    // ── OS Thread note for left ──
    { id: "os_left", type: "box", x: LEFT_X, y: COL_Y + 480, w: LEFT_W, h: 56, rx: 8, style: "fill:var(--hot);opacity:0.15;stroke:var(--hot);stroke-width:1" },
    { id: "os_left_t", type: "label", x: LEFT_X + LEFT_W / 2, y: COL_Y + 498, label: "5 OS Threads = ~5 MB Stack RAM", style: "font-size:11px;font-weight:700;fill:var(--hot)" },
    { id: "os_left_t2", type: "label", x: LEFT_X + LEFT_W / 2, y: COL_Y + 518, label: "Thread pool exhausted? → 503 Service Unavailable", style: "font-size:10px;fill:var(--hot)" },

    // ── Virtual Threads (9 small boxes) ──
    ...VT_BOXES,

    // ── Carrier threads ──
    { id: "carrier_lbl", type: "label", x: RIGHT_X + RIGHT_W / 2, y: CARRIER_Y - 8, label: "Carrier (Platform) Threads", style: "font-size:11px;font-weight:600;fill:var(--ink-soft)" },
    ...[0,1].map(i => ({
      id: `carrier${i}`, type: "box", x: RIGHT_X + 10 + i * 265, y: CARRIER_Y, w: 240, h: 44, rx: 6,
      style: "fill:var(--good);opacity:0.8"
    })),
    ...[0,1].map(i => ({
      id: `carrier${i}_lbl`, type: "label", x: RIGHT_X + 10 + i * 265 + 120, y: CARRIER_Y + 22,
      label: `Carrier Thread ${i + 1}`,
      style: "font-size:11px;font-weight:600;fill:#fff"
    })),

    // Arrows: VT → Carrier
    { id: "arr_vt_c0", type: "arrow", x1: RIGHT_X + 150, y1: COL_Y + 60 + 5 * 44 + 10, x2: RIGHT_X + 130, y2: CARRIER_Y, style: "stroke:var(--accent);stroke-width:1.5;stroke-dasharray:4,3" },
    { id: "arr_vt_c1", type: "arrow", x1: RIGHT_X + 350, y1: COL_Y + 60 + 5 * 44 + 10, x2: RIGHT_X + 385, y2: CARRIER_Y, style: "stroke:var(--accent);stroke-width:1.5;stroke-dasharray:4,3" },
    { id: "arr_vt_c_lbl", type: "label", x: RIGHT_X + RIGHT_W / 2, y: CARRIER_Y - 26, label: "VThreads montadas nos Carriers", style: "font-size:10px;fill:var(--ink-soft)" },

    // OS box
    { id: "os_box", type: "box", x: RIGHT_X, y: OS_Y, w: RIGHT_W, h: 44, rx: 6, style: "fill:var(--muted);opacity:0.3" },
    { id: "os_box_lbl", type: "label", x: RIGHT_X + RIGHT_W / 2, y: OS_Y + 22, label: "OS Threads (apenas 2!) = ~2MB Stack RAM", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "arr_carrier_os0", type: "arrow", x1: RIGHT_X + 130, y1: CARRIER_Y + 44, x2: RIGHT_X + 130, y2: OS_Y, style: "stroke:var(--good);stroke-width:1.5" },
    { id: "arr_carrier_os1", type: "arrow", x1: RIGHT_X + 385, y1: CARRIER_Y + 44, x2: RIGHT_X + 385, y2: OS_Y, style: "stroke:var(--good);stroke-width:1.5" },

    // ── Detail panels (full-screen overlays per step) ──
    // I/O unmount animation visual
    { id: "io_anim", type: "box", x: RIGHT_X, y: COL_Y + 60, w: RIGHT_W, h: 420, rx: 10, style: "fill:var(--surface);stroke:var(--accent);stroke-width:2" },
    { id: "io_t1", type: "label", x: RIGHT_X + RIGHT_W / 2, y: COL_Y + 86, label: "VThread bloqueia em I/O", style: "font-size:14px;font-weight:700;fill:var(--accent)" },
    { id: "io_a1", type: "label", x: RIGHT_X + RIGHT_W / 2, y: COL_Y + 116, label: "1. VThread executa no Carrier Thread", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "io_a2", type: "label", x: RIGHT_X + RIGHT_W / 2, y: COL_Y + 140, label: "2. Chama Socket.read() — seria bloqueante", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "io_a3", type: "label", x: RIGHT_X + RIGHT_W / 2, y: COL_Y + 164, label: "3. JVM detecta: desmonta VThread do Carrier", style: "font-size:12px;fill:var(--accent)" },
    { id: "io_a4", type: "label", x: RIGHT_X + RIGHT_W / 2, y: COL_Y + 188, label: "4. Carrier fica livre → monta outra VThread", style: "font-size:12px;fill:var(--good)" },
    { id: "io_a5", type: "label", x: RIGHT_X + RIGHT_W / 2, y: COL_Y + 212, label: "5. I/O completa → VThread remontada", style: "font-size:12px;fill:var(--accent)" },
    { id: "io_a6", type: "label", x: RIGHT_X + RIGHT_W / 2, y: COL_Y + 236, label: "6. Continua de onde parou (stack preservada)", style: "font-size:12px;fill:var(--good)" },
    { id: "io_impact", type: "box", x: RIGHT_X + 20, y: COL_Y + 270, w: RIGHT_W - 40, h: 100, rx: 8, style: "fill:var(--good);opacity:0.15" },
    { id: "io_imp_t", type: "label", x: RIGHT_X + RIGHT_W / 2, y: COL_Y + 292, label: "Resultado", style: "font-size:13px;font-weight:700;fill:var(--good)" },
    { id: "io_imp1", type: "label", x: RIGHT_X + RIGHT_W / 2, y: COL_Y + 316, label: "2 Carriers servem 1 milhão de VThreads", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "io_imp2", type: "label", x: RIGHT_X + RIGHT_W / 2, y: COL_Y + 340, label: "Sem context switch de OS thread", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "io_imp3", type: "label", x: RIGHT_X + RIGHT_W / 2, y: COL_Y + 360, label: "Stack: ~KB por VThread (vs ~1MB platform)", style: "font-size:12px;fill:var(--good)" },

    // Structured Concurrency panel
    { id: "sc_panel", type: "box", x: 80, y: 80, w: W - 160, h: 520, rx: 12, style: "fill:var(--surface);stroke:var(--accent-2);stroke-width:2" },
    { id: "sc_title", type: "label", x: W / 2, y: 110, label: "Structured Concurrency (Java 21)", style: "font-size:18px;font-weight:700;fill:var(--accent-2)" },
    { id: "sc_d1", type: "label", x: W / 2, y: 150, label: "StructuredTaskScope: agrupa VThreads com lifecycle controlado", style: "font-size:13px;fill:var(--ink-soft)" },
    { id: "sc_code1", type: "box", x: 160, y: 174, w: W - 320, h: 200, rx: 8, style: "fill:var(--muted);opacity:0.3" },
    { id: "sc_c1", type: "label", x: 180, y: 196, label: "try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {", style: "font-size:10px;font-family:monospace;fill:var(--ink);text-anchor:start" },
    { id: "sc_c2", type: "label", x: 200, y: 218, label: "var f1 = scope.fork(() -> fetchUser(id));", style: "font-size:10px;font-family:monospace;fill:var(--accent);text-anchor:start" },
    { id: "sc_c3", type: "label", x: 200, y: 238, label: "var f2 = scope.fork(() -> fetchOrders(id));", style: "font-size:10px;font-family:monospace;fill:var(--accent);text-anchor:start" },
    { id: "sc_c4", type: "label", x: 200, y: 258, label: "var f3 = scope.fork(() -> fetchInventory(id));", style: "font-size:10px;font-family:monospace;fill:var(--accent);text-anchor:start" },
    { id: "sc_c5", type: "label", x: 200, y: 278, label: "scope.join().throwIfFailed();   // espera todas", style: "font-size:10px;font-family:monospace;fill:var(--good);text-anchor:start" },
    { id: "sc_c6", type: "label", x: 200, y: 298, label: "return new Response(f1.get(), f2.get(), f3.get());", style: "font-size:10px;font-family:monospace;fill:var(--ink);text-anchor:start" },
    { id: "sc_c7", type: "label", x: 180, y: 318, label: "}", style: "font-size:10px;font-family:monospace;fill:var(--ink);text-anchor:start" },
    { id: "sc_d2", type: "label", x: W / 2, y: 396, label: "ShutdownOnFailure: se uma falha, cancela todas. ShutdownOnSuccess: assim que uma conclui.", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "sc_d3", type: "label", x: W / 2, y: 424, label: "Stack trace é inteligível — hierarquia de tarefas visível no debugger", style: "font-size:12px;fill:var(--good)" },
    { id: "sc_d4", type: "label", x: W / 2, y: 452, label: "Sem callback hell, sem CompletableFuture chains aninhadas", style: "font-size:12px;fill:var(--accent-2)" },

    // CPU-bound warning
    { id: "cpu_panel", type: "box", x: 80, y: 80, w: W - 160, h: 400, rx: 12, style: "fill:var(--surface);stroke:var(--warn);stroke-width:2" },
    { id: "cpu_title", type: "label", x: W / 2, y: 110, label: "Quando NÃO usar Virtual Threads", style: "font-size:18px;font-weight:700;fill:var(--warn)" },
    { id: "cpu_d1", type: "label", x: W / 2, y: 160, label: "Virtual Threads são M:N sobre Carrier Threads. O número de Carriers = nCPUs.", style: "font-size:13px;fill:var(--ink-soft)" },
    { id: "cpu_d2", type: "label", x: W / 2, y: 186, label: "Para workloads CPU-BOUND, VThreads não ajudam:", style: "font-size:13px;fill:var(--warn)" },
    { id: "cpu_bad", type: "box", x: 160, y: 210, w: W - 320, h: 140, rx: 8, style: "fill:var(--hot);opacity:0.1" },
    { id: "cpu_b1", type: "label", x: W / 2, y: 236, label: "Criptografia pesada, compressão, rendering de imagens", style: "font-size:12px;fill:var(--hot)" },
    { id: "cpu_b2", type: "label", x: W / 2, y: 260, label: "Machine learning inference em CPU", style: "font-size:12px;fill:var(--hot)" },
    { id: "cpu_b3", type: "label", x: W / 2, y: 284, label: "Algoritmos numéricos intensivos", style: "font-size:12px;fill:var(--hot)" },
    { id: "cpu_b4", type: "label", x: W / 2, y: 308, label: "Se CPU está a 100%, mais VThreads = mais context switch no mesmo CPU", style: "font-size:12px;fill:var(--hot);font-weight:600" },
    { id: "cpu_good", type: "box", x: 160, y: 370, w: W - 320, h: 80, rx: 8, style: "fill:var(--good);opacity:0.1" },
    { id: "cpu_g1", type: "label", x: W / 2, y: 396, label: "VThreads brilham em I/O-bound: APIs REST, queries DB, chamadas HTTP externas", style: "font-size:12px;fill:var(--good)" },
    { id: "cpu_g2", type: "label", x: W / 2, y: 420, label: "Throughput aumenta proporcionalmente ao I/O wait time — ótimo para microserviços", style: "font-size:12px;fill:var(--good)" },

    // Quiz
    { id: "quiz_panel", type: "box", x: 100, y: 50, w: 1080, h: 620, rx: 12, style: "fill:var(--surface);stroke:var(--accent);stroke-width:2" },
    { id: "quiz_title", type: "label", x: 640, y: 80, label: "Quiz — Virtual Threads Java", style: "font-size:18px;font-weight:700;fill:var(--ink)" },
    { id: "q1", type: "label", x: 640, y: 140, label: "Q: O que é um Carrier Thread?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q1a", type: "label", x: 640, y: 165, label: "A: Platform Thread do OS que 'monta' Virtual Threads para execução. N Carriers servem M VThreads.", style: "font-size:12px;fill:var(--good)" },
    { id: "q2", type: "label", x: 640, y: 215, label: "Q: O que acontece quando uma VThread bloqueia em I/O?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q2a", type: "label", x: 640, y: 240, label: "A: A JVM desmonta a VThread do Carrier. O Carrier fica livre para outra VThread. Sem bloqueio de OS thread.", style: "font-size:12px;fill:var(--good)" },
    { id: "q3", type: "label", x: 640, y: 290, label: "Q: Por que VThreads são leves em memória?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q3a", type: "label", x: 640, y: 315, label: "A: Stack é gerenciada pelo GC da JVM, começa pequena (~KB) e cresce conforme necessário (vs 1MB fixo de platform thread).", style: "font-size:12px;fill:var(--good)" },
    { id: "q4", type: "label", x: 640, y: 365, label: "Q: Em qual caso VThreads NÃO ajudam?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q4a", type: "label", x: 640, y: 390, label: "A: Workloads CPU-bound (criptografia, ML). VThread sem I/O = Carrier ocupado o tempo todo.", style: "font-size:12px;fill:var(--good)" },
    { id: "q5", type: "label", x: 640, y: 440, label: "Q: O que é Structured Concurrency?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q5a", type: "label", x: 640, y: 465, label: "A: API para gerenciar grupos de VThreads com lifecycle estruturado. Cancela todos se um falha.", style: "font-size:12px;fill:var(--good)" },
    { id: "q6", type: "label", x: 640, y: 515, label: "Q: Como criar uma Virtual Thread em Java?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q6a", type: "label", x: 640, y: 540, label: "A: Thread.ofVirtual().start(runnable) ou Executors.newVirtualThreadPerTaskExecutor()", style: "font-size:12px;fill:var(--good)" },

    // Summary
    { id: "sum_panel", type: "box", x: 60, y: 40, w: 1160, h: 640, rx: 12, style: "fill:var(--surface);stroke:var(--line);stroke-width:1.5" },
    { id: "sum_title", type: "label", x: 640, y: 70, label: "Virtual Threads Java 21 — Resumo", style: "font-size:20px;font-weight:700;fill:var(--ink)" },
    { id: "sum_lbl1", type: "box", x: 100, y: 100, w: 480, h: 220, rx: 8, style: "fill:var(--hot);opacity:0.08" },
    { id: "sum_lbl1t", type: "label", x: 340, y: 122, label: "Platform Threads (antes)", style: "font-size:13px;font-weight:700;fill:var(--hot)" },
    { id: "sum_l1a", type: "label", x: 340, y: 148, label: "1:1 com OS Thread", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_l1b", type: "label", x: 340, y: 168, label: "~1 MB de stack cada", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_l1c", type: "label", x: 340, y: 188, label: "Context switch caro (kernel trap)", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_l1d", type: "label", x: 340, y: 208, label: "Pool limitado (ex: 200 threads)", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_l1e", type: "label", x: 340, y: 228, label: "I/O bloqueia o thread inteiro", style: "font-size:11px;fill:var(--hot)" },
    { id: "sum_l1f", type: "label", x: 340, y: 253, label: "Solução: reactive programming (difícil)", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_lbl2", type: "box", x: 660, y: 100, w: 460, h: 220, rx: 8, style: "fill:var(--accent);opacity:0.08" },
    { id: "sum_lbl2t", type: "label", x: 890, y: 122, label: "Virtual Threads (Java 21)", style: "font-size:13px;font-weight:700;fill:var(--accent)" },
    { id: "sum_l2a", type: "label", x: 890, y: 148, label: "M:N com Carrier (Platform) Threads", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_l2b", type: "label", x: 890, y: 168, label: "Stack começa em ~KB, cresce com GC", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_l2c", type: "label", x: 890, y: 188, label: "Context switch: JVM-level (mais leve)", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_l2d", type: "label", x: 890, y: 208, label: "Milhões de VThreads possíveis", style: "font-size:11px;fill:var(--good)" },
    { id: "sum_l2e", type: "label", x: 890, y: 228, label: "I/O desmonta VThread do Carrier", style: "font-size:11px;fill:var(--accent)" },
    { id: "sum_l2f", type: "label", x: 890, y: 253, label: "Código blocking = mais legível que reactive", style: "font-size:11px;fill:var(--good)" },
    { id: "sum_lbl3", type: "box", x: 100, y: 350, w: 1020, h: 220, rx: 8, style: "fill:var(--surface);stroke:var(--line);stroke-width:1" },
    { id: "sum_lbl3t", type: "label", x: 610, y: 372, label: "Quando usar Virtual Threads?", style: "font-size:13px;font-weight:700;fill:var(--ink)" },
    { id: "sum_l3a", type: "label", x: 350, y: 400, label: "✓ APIs REST com muitas conexões simultâneas", style: "font-size:11px;fill:var(--good)" },
    { id: "sum_l3b", type: "label", x: 350, y: 420, label: "✓ Microserviços que fazem muitas chamadas DB/HTTP", style: "font-size:11px;fill:var(--good)" },
    { id: "sum_l3c", type: "label", x: 350, y: 440, label: "✓ Substituir ExecutorService de thread fixo", style: "font-size:11px;fill:var(--good)" },
    { id: "sum_l3d", type: "label", x: 350, y: 460, label: "✓ Simplificar código async (sem CompletableFuture)", style: "font-size:11px;fill:var(--good)" },
    { id: "sum_l3e", type: "label", x: 870, y: 400, label: "✗ Algoritmos CPU-bound", style: "font-size:11px;fill:var(--hot)" },
    { id: "sum_l3f", type: "label", x: 870, y: 420, label: "✗ synchronized blocks (pin o carrier!)", style: "font-size:11px;fill:var(--hot)" },
    { id: "sum_l3g", type: "label", x: 870, y: 440, label: "✗ Bibliotecas nativas com thread-local", style: "font-size:11px;fill:var(--hot)" },
    { id: "sum_l3h", type: "label", x: 870, y: 460, label: "✗ Bibliotecas não reentrantes", style: "font-size:11px;fill:var(--hot)" },
    { id: "sum_motto", type: "label", x: 610, y: 530, label: "Executors.newVirtualThreadPerTaskExecutor() — 1 task, 1 VThread, máxima concorrência I/O", style: "font-size:12px;font-weight:600;fill:var(--accent)" },
  ];

  const ALL_IDS = elements.map(e => e.id);

  function showBase(ctx) {
    ALL_IDS.forEach(id => ctx.hide(id));
    ctx.show("title_main");
    ctx.show("left_hdr"); ctx.show("left_hdr_lbl");
    ctx.show("right_hdr"); ctx.show("right_hdr_lbl");
    ctx.show("divider");
  }

  const steps = [
    {
      title: "Platform Threads: 1:1 com OS Threads",
      text: "Cada Thread Java tradicional mapeia 1:1 para um OS thread. Criar uma thread cria um OS thread com ~1 MB de stack alocada fixamente.",
      why: "Criação cara, memória cara, context switch cara. Em aplicações I/O-bound, a maioria dos threads fica bloqueada esperando.",
      balloonAnchor: { x: LEFT_X + LEFT_W / 2, y: COL_Y + 480 },
      placement: "right",
      enter(ctx) {
        showBase(ctx);
        PT_BOXES.forEach(e => ctx.show(e.id));
        ctx.show("os_left"); ctx.show("os_left_t"); ctx.show("os_left_t2");
      }
    },
    {
      title: "OS Thread é Pesado: ~1MB Stack + Context Switch",
      text: "Uma OS thread ocupa ~1 MB de stack. Context switch requer syscall (ring 0), save/restore de registradores. Com 1000 threads = 1 GB só de stack.",
      why: "Servidores com milhares de conexões simultâneas precisam de thread pool muito grande — ineficiente.",
      balloonAnchor: "os_left",
      placement: "right",
      enter(ctx) {
        showBase(ctx);
        PT_BOXES.forEach(e => ctx.show(e.id));
        ctx.show("os_left"); ctx.show("os_left_t"); ctx.show("os_left_t2");
      }
    },
    {
      title: "Thread Pool Esgota sob Carga I/O",
      text: "Com thread pool de 200 e 1000 requests simultâneos, 800 ficam na fila esperando. Se cada request faz query de banco (50ms), throughput máximo ≈ 200/0.05 = 4000 req/s.",
      why: "A solução tradicional: reactive programming (WebFlux) — mas código difícil de ler, debugar e manter.",
      balloonAnchor: `pt4_box`,
      placement: "right",
      enter(ctx) {
        showBase(ctx);
        PT_BOXES.forEach(e => ctx.show(e.id));
        ctx.show("os_left"); ctx.show("os_left_t"); ctx.show("os_left_t2");
      }
    },
    {
      title: "Virtual Threads (Java 21 / Project Loom)",
      text: "Virtual Threads são threads gerenciadas pela JVM, não pelo OS. São leves: stack começa em KB e cresce sob demanda via GC. Você pode ter milhões delas.",
      why: "Código blocking simples (JDBC, HTTP client) com throughput de reactive. Melhor de dois mundos.",
      balloonAnchor: { x: RIGHT_X + RIGHT_W / 2, y: COL_Y + 380 },
      placement: "left",
      enter(ctx) {
        showBase(ctx);
        VT_BOXES.forEach(e => ctx.show(e.id));
        ctx.show("carrier_lbl");
        [0,1].forEach(i => { ctx.show(`carrier${i}`); ctx.show(`carrier${i}_lbl`); });
        ctx.show("arr_vt_c0"); ctx.show("arr_vt_c1"); ctx.show("arr_vt_c_lbl");
        ctx.show("os_box"); ctx.show("os_box_lbl");
        ctx.show("arr_carrier_os0"); ctx.show("arr_carrier_os1");
      }
    },
    {
      title: "Virtual Thread ≠ OS Thread",
      text: "Uma Virtual Thread é um objeto Java. A JVM mantém sua stack heap (não stack OS). Criar uma VThread = alocar um objeto leve, não syscall.",
      why: "Thread.ofVirtual().start(() → ...) cria uma VThread em microssegundos, sem syscall. Crie milhões sem problema.",
      balloonAnchor: { x: RIGHT_X + RIGHT_W / 2, y: COL_Y + 380 },
      placement: "left",
      enter(ctx) {
        showBase(ctx);
        VT_BOXES.forEach(e => ctx.show(e.id));
        ctx.show("carrier_lbl");
        [0,1].forEach(i => { ctx.show(`carrier${i}`); ctx.show(`carrier${i}_lbl`); });
        ctx.show("arr_vt_c_lbl");
        ctx.show("os_box"); ctx.show("os_box_lbl");
        ctx.show("arr_carrier_os0"); ctx.show("arr_carrier_os1");
      }
    },
    {
      title: "Carrier Threads: OS Threads que Montam VThreads",
      text: "Carrier Threads são Platform Threads que executam Virtual Threads. O número de Carriers = nCPUs (por padrão). Uma VThread é 'montada' num Carrier para rodar.",
      why: "Apenas 2 Carriers podem servir 1 milhão de VThreads. O segredo: unmounting em I/O.",
      balloonAnchor: { x: RIGHT_X + RIGHT_W / 2, y: CARRIER_Y + 22 },
      placement: "left",
      enter(ctx) {
        showBase(ctx);
        VT_BOXES.forEach(e => ctx.show(e.id));
        ctx.show("carrier_lbl");
        [0,1].forEach(i => { ctx.show(`carrier${i}`); ctx.show(`carrier${i}_lbl`); });
        ctx.show("arr_vt_c0"); ctx.show("arr_vt_c1"); ctx.show("arr_vt_c_lbl");
        ctx.show("os_box"); ctx.show("os_box_lbl");
        ctx.show("arr_carrier_os0"); ctx.show("arr_carrier_os1");
      }
    },
    {
      title: "I/O Bloqueia: VThread Desmontada do Carrier",
      text: "Quando uma VThread chama Socket.read() (ou JDBC, HttpClient), a JVM detecta o bloqueio e desmonta a VThread do Carrier. O Carrier fica livre imediatamente.",
      why: "É como cooperative multitasking: VThread 'pausa', stack fica na heap, Carrier monta outra VThread.",
      balloonAnchor: { x: RIGHT_X + RIGHT_W / 2, y: COL_Y + 340 },
      placement: "left",
      enter(ctx) {
        showBase(ctx);
        ctx.show("io_anim"); ctx.show("io_t1");
        ctx.show("io_a1"); ctx.show("io_a2"); ctx.show("io_a3"); ctx.show("io_a4"); ctx.show("io_a5"); ctx.show("io_a6");
        ctx.show("io_impact"); ctx.show("io_imp_t"); ctx.show("io_imp1"); ctx.show("io_imp2"); ctx.show("io_imp3");
      }
    },
    {
      title: "Carrier Fica Livre para Outra VThread",
      text: "O Carrier Thread não fica bloqueado esperando o I/O completar. Ele imediatamente monta e executa outra VThread. Quando o I/O completa, a VThread original é remontada.",
      why: "Isso é o que permite 2 carriers servirem 1 milhão de VThreads em I/O-bound workloads.",
      balloonAnchor: { x: RIGHT_X + RIGHT_W / 2, y: COL_Y + 340 },
      placement: "left",
      enter(ctx) {
        showBase(ctx);
        ctx.show("io_anim"); ctx.show("io_t1");
        ctx.show("io_a1"); ctx.show("io_a2"); ctx.show("io_a3"); ctx.show("io_a4"); ctx.show("io_a5"); ctx.show("io_a6");
        ctx.show("io_impact"); ctx.show("io_imp_t"); ctx.show("io_imp1"); ctx.show("io_imp2"); ctx.show("io_imp3");
      }
    },
    {
      title: "Milhões de Virtual Threads Possíveis",
      text: "Com VThreads, o servidor web pode criar 1 VThread por request HTTP, sem limitar a 200-500 como com thread pools. Throughput sobe com o I/O wait time.",
      why: "Em benchmark: 10k requests simultâneos com 50ms DB query → Platform Threads: ~4000 req/s. VThreads: ~50.000+ req/s.",
      balloonAnchor: { x: RIGHT_X + RIGHT_W / 2, y: 400 },
      placement: "left",
      enter(ctx) {
        showBase(ctx);
        VT_BOXES.forEach(e => ctx.show(e.id));
        ctx.show("carrier_lbl");
        [0,1].forEach(i => { ctx.show(`carrier${i}`); ctx.show(`carrier${i}_lbl`); });
        ctx.show("arr_vt_c0"); ctx.show("arr_vt_c1"); ctx.show("arr_vt_c_lbl");
        ctx.show("os_box"); ctx.show("os_box_lbl");
        ctx.show("arr_carrier_os0"); ctx.show("arr_carrier_os1");
      }
    },
    {
      title: "Structured Concurrency",
      text: "StructuredTaskScope agrupa VThreads em um escopo com lifecycle controlado. ShutdownOnFailure cancela todas se uma falha. Stack traces são inteligíveis.",
      why: "Resolve o problema de CompletableFuture: quando um subtask falha, os outros são cancelados automaticamente. Sem resource leaks.",
      balloonAnchor: { x: W / 2, y: 510 },
      placement: "top",
      enter(ctx) {
        ALL_IDS.forEach(id => ctx.hide(id));
        ctx.show("title_main");
        ctx.show("sc_panel"); ctx.show("sc_title"); ctx.show("sc_d1");
        ctx.show("sc_code1");
        ["sc_c1","sc_c2","sc_c3","sc_c4","sc_c5","sc_c6","sc_c7"].forEach(id => ctx.show(id));
        ctx.show("sc_d2"); ctx.show("sc_d3"); ctx.show("sc_d4");
      }
    },
    {
      title: "Quando NÃO usar Virtual Threads",
      text: "VThreads não ajudam workloads CPU-bound. Criptografia pesada, ML inference, rendering — o Carrier fica ocupado 100% sem I/O para desmontagem.",
      why: "Cuidado com synchronized blocks: eles 'pinnam' a VThread ao Carrier, perdendo o benefício. Use ReentrantLock.",
      balloonAnchor: { x: W / 2, y: 480 },
      placement: "top",
      enter(ctx) {
        ALL_IDS.forEach(id => ctx.hide(id));
        ctx.show("title_main");
        ctx.show("cpu_panel"); ctx.show("cpu_title"); ctx.show("cpu_d1"); ctx.show("cpu_d2");
        ctx.show("cpu_bad"); ctx.show("cpu_b1"); ctx.show("cpu_b2"); ctx.show("cpu_b3"); ctx.show("cpu_b4");
        ctx.show("cpu_good"); ctx.show("cpu_g1"); ctx.show("cpu_g2");
      }
    },
    {
      title: "Quiz",
      balloon: { anchor: { x: 640, y: 360 }, placement: "bottom", text: "Teste seu conhecimento sobre Virtual Threads Java:" },
      quiz: {
        question: "O que acontece quando uma Virtual Thread executa uma operação de I/O bloqueante?",
        options: [
          "A JVM inteira para de executar até o I/O terminar",
          "A Virtual Thread é desmontada do Carrier Thread, que fica livre para outra tarefa",
          "Um novo OS Thread é criado para continuar o processamento",
          "A operação é convertida automaticamente em I/O não-bloqueante via NIO"
        ],
        answer: 1,
        explain: "O Project Loom intercepta chamadas bloqueantes. A VThread suspende e o Carrier Thread fica imediatamente disponível para montar outra VThread. Quando o I/O termina, a VThread é reagendada — transparente para o código."
      }
    },
    {
      title: "Resumo",
      text: "VThreads = concorrência I/O-bound sem reactive hell. Carrier threads desacoplam VThreads de OS threads. Código blocking + throughput alto.",
      why: "",
      balloonAnchor: { x: 640, y: 680 },
      placement: "top",
      enter(ctx) {
        ALL_IDS.forEach(id => ctx.hide(id));
        ctx.show("sum_panel"); ctx.show("sum_title");
        ["sum_lbl1","sum_lbl1t","sum_l1a","sum_l1b","sum_l1c","sum_l1d","sum_l1e","sum_l1f",
         "sum_lbl2","sum_lbl2t","sum_l2a","sum_l2b","sum_l2c","sum_l2d","sum_l2e","sum_l2f",
         "sum_lbl3","sum_lbl3t","sum_l3a","sum_l3b","sum_l3c","sum_l3d","sum_l3e","sum_l3f","sum_l3g","sum_l3h","sum_motto"].forEach(id => ctx.show(id));
      }
    }
  ];

  window.VIRTUAL_THREADS_DIAGRAM = { title: "Virtual Threads Java", subtitle: "Project Loom · Carrier Threads · Structured Concurrency · Java 21", width: W, height: H, autoplayMs: 8000, elements, steps };
})();
