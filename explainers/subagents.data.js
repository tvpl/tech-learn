/* ============================================================================
 * subagents.data.js — Explicador: SubAgentes (arquitetura multi-agente)
 * Orquestrador → subagentes especializados → execução paralela → agregação
 * ==========================================================================*/
(function () {
  const W = 1280, H = 720;

  // Orquestrador no topo centro
  const OX = 640, OY = 60, OW = 280, OH = 70;
  // Subagentes em linha (3): x dos centros
  const SA = [220, 640, 1060];
  const SAY = 260;   // topo dos boxes
  const SAH = 130;

  // Helpers de setas
  const downArrow = (id, x, y1, y2, color) =>
    ({ id, type: "arrow", x1: x, y1, x2: x, y2, color: color || "var(--accent)" });

  const elements = [
    /* ── ORQUESTRADOR ──────────────────────────────────── */
    { id: "orch",      type: "box",   x: OX-OW/2, y: OY, w: OW, h: OH, fill: "#2a1d3d", stroke: "var(--accent)", label: ["🎯 Agente Orquestrador", "planeja e delega tarefas"] },
    { id: "orch_ctx",  type: "token", x: OX-OW/2, y: OY+OH+10, w: OW, h: 36, fill: "#22315d", label: "Contexto + Objetivo global" },

    /* ── SETAS DE SPAWN ────────────────────────────────── */
    { id: "sp0", type: "arrow", x1: OX, y1: OY+OH, x2: SA[0], y2: SAY, color: "var(--accent)" },
    { id: "sp1", type: "arrow", x1: OX, y1: OY+OH, x2: SA[1], y2: SAY, color: "var(--accent)" },
    { id: "sp2", type: "arrow", x1: OX, y1: OY+OH, x2: SA[2], y2: SAY, color: "var(--accent)" },
    { id: "sp_lbl", type: "label", x: OX, y: SAY-14, anchor: "middle", sub: true, label: "spawn (prompt + contexto isolado)" },

    /* ── SUBAGENTE A: Pesquisador ──────────────────────── */
    { id: "sa0",       type: "box", x: SA[0]-150, y: SAY, w: 300, h: SAH, fill: "#1b2747", stroke: "var(--good)",
      label: ["🔍 Subagente: Pesquisador", "busca docs, web, bancos"] },
    { id: "sa0_t1",    type: "token", x: SA[0]-130, y: SAY+SAH+10, w: 120, h: 34, fill: "#11351f", stroke: "var(--good)", label: "tool: search" },
    { id: "sa0_t2",    type: "token", x: SA[0]+14,  y: SAY+SAH+10, w: 120, h: 34, fill: "#11351f", stroke: "var(--good)", label: "tool: read_url" },

    /* ── SUBAGENTE B: Coder ────────────────────────────── */
    { id: "sa1",       type: "box", x: SA[1]-150, y: SAY, w: 300, h: SAH, fill: "#1b2747", stroke: "var(--accent-2)",
      label: ["💻 Subagente: Coder", "implementa e refatora código"] },
    { id: "sa1_t1",    type: "token", x: SA[1]-130, y: SAY+SAH+10, w: 120, h: 34, fill: "#1b1224", stroke: "var(--accent-2)", label: "tool: edit_file" },
    { id: "sa1_t2",    type: "token", x: SA[1]+14,  y: SAY+SAH+10, w: 120, h: 34, fill: "#1b1224", stroke: "var(--accent-2)", label: "tool: run_tests" },

    /* ── SUBAGENTE C: Revisor ──────────────────────────── */
    { id: "sa2",       type: "box", x: SA[2]-150, y: SAY, w: 300, h: SAH, fill: "#1b2747", stroke: "var(--warn)",
      label: ["🔎 Subagente: Revisor", "valida, critica e sugere melhorias"] },
    { id: "sa2_t1",    type: "token", x: SA[2]-130, y: SAY+SAH+10, w: 120, h: 34, fill: "#1a1208", stroke: "var(--warn)", label: "tool: lint" },
    { id: "sa2_t2",    type: "token", x: SA[2]+14,  y: SAY+SAH+10, w: 120, h: 34, fill: "#1a1208", stroke: "var(--warn)", label: "tool: sec_scan" },

    /* ── PARALELO ──────────────────────────────────────── */
    { id: "par_lbl",  type: "label", x: OX, y: SAY+SAH+64, anchor: "middle", sub: true,
      label: "⇒ execução paralela e independente ⇐" },
    { id: "par_line", type: "arrow", noHead: true, dashed: true, color: "var(--muted)",
      path: `M60,${SAY+SAH+70} L1220,${SAY+SAH+70}` },

    /* ── CONTEXTO ISOLADO ──────────────────────────────── */
    { id: "iso_lbl",  type: "label", x: OX, y: SAY+SAH+100, anchor: "middle", sub: true,
      label: "Cada subagente tem janela de contexto própria (isolamento)" },

    /* ── RESULTADOS SUBINDO ────────────────────────────── */
    { id: "res0_lbl", type: "token", x: SA[0]-130, y: 510, w: 260, h: 54, fill: "#112318", stroke: "var(--good)",  label: ["📑 Resultado A", "links + resumo da pesquisa"] },
    { id: "res1_lbl", type: "token", x: SA[1]-130, y: 510, w: 260, h: 54, fill: "#101023", stroke: "var(--accent-2)", label: ["📑 Resultado B", "diff do código gerado"] },
    { id: "res2_lbl", type: "token", x: SA[2]-130, y: 510, w: 260, h: 54, fill: "#1a1208", stroke: "var(--warn)",  label: ["📑 Resultado C", "issues encontradas"] },
    { id: "rt0", type: "arrow", x1: SA[0], y1: 508, x2: OX-30,  y2: OY+OH, color: "var(--good)" },
    { id: "rt1", type: "arrow", x1: SA[1], y1: 508, x2: OX,      y2: OY+OH, color: "var(--accent-2)" },
    { id: "rt2", type: "arrow", x1: SA[2], y1: 508, x2: OX+30,  y2: OY+OH, color: "var(--warn)" },

    /* ── AGREGAÇÃO ─────────────────────────────────────── */
    { id: "agg_box", type: "box", x: OX-280, y: 590, w: 560, h: 80, fill: "#2a1d3d", stroke: "var(--accent)",
      label: ["🎯 Orquestrador agrega resultados", "sintetiza, decide próximo passo ou entrega resposta final"] },

    /* ── FALHA / RETRY ─────────────────────────────────── */
    { id: "fail_box",  type: "box", x: 30, y: 610, w: 200, h: 60, fill: "#1a1208", stroke: "var(--hot)", label: ["⚠️ Subagente falha", "timeout / erro"] },
    { id: "retry_box", type: "token", x: 30, y: 686, w: 200, h: 34, fill: "#22315d", stroke: "var(--accent)", label: "↩ retry ou fallback" },
    downArrow("a_fail_r", 130, 672, 684, "var(--accent)"),

    /* ── SINGLE AGENT LIMIT ────────────────────────────── */
    { id: "lim_box", type: "box", x: 900, y: 590, w: 350, h: 100, fill: "#101023",
      label: ["Agente único seria lento e limitado:", "• contexto único (sem paralelismo)", "• sem especialização por domínio", "• tarefas longas esgotam janela"] },
  ];

  const steps = [
    {
      title: "Limitação do agente único",
      show: ["lim_box"],
      highlight: ["lim_box"],
      balloon: { anchor: "lim_box", placement: "left",
        text: "Um único agente tem uma <strong>janela de contexto finita</strong>, não pode fazer múltiplas coisas em paralelo e acumula erros em tarefas longas. Para problemas complexos, isso se torna um gargalo.",
        why: "Assim como times de pessoas são mais produtivos que indivíduos isolados em tarefas complexas, múltiplos agentes especializados superam um único agente genérico." },
    },
    {
      title: "O Agente Orquestrador",
      show: ["orch", "orch_ctx"],
      highlight: ["orch"],
      balloon: { anchor: "orch", placement: "right",
        text: "O <strong>Orquestrador</strong> recebe o objetivo de alto nível e faz o planejamento: quebra a tarefa em subtarefas, decide quais agentes usar, em que ordem e com qual contexto.",
        why: "O orquestrador não executa as tarefas — ele coordena. Isso preserva sua janela de contexto para raciocínio e tomada de decisão, não para execução." },
    },
    {
      title: "Spawn de subagentes",
      show: ["sp0", "sp1", "sp2", "sp_lbl", "sa0", "sa1", "sa2"],
      highlight: ["sa0", "sa1", "sa2"],
      balloon: { anchor: "sp_lbl", placement: "bottom",
        text: "O orquestrador <strong>spawna subagentes</strong> — novos processos de LLM com prompts e contextos próprios e isolados. Cada subagente recebe uma tarefa específica: pesquisar, codar ou revisar.",
        why: "O isolamento de contexto é essencial: cada subagente começa limpo, sem o histórico dos outros. Isso evita contaminação cruzada e permite escalar." },
      enter: (ctx) => {
        ["sp0","sp1","sp2"].forEach((id, i) => setTimeout(() => ctx.drawArrow(id), i * 150));
        setTimeout(() => {
          ["sa0","sa1","sa2"].forEach((id, i) => setTimeout(() => ctx.show(id), i * 100));
        }, 500);
      },
    },
    {
      title: "Especialização: cada agente tem seu domínio",
      show: ["sa0_t1","sa0_t2","sa1_t1","sa1_t2","sa2_t1","sa2_t2"],
      highlight: ["sa0","sa1","sa2"],
      balloon: { anchor: "sa1", placement: "right",
        text: "Cada subagente tem acesso apenas às <strong>ferramentas do seu domínio</strong>: o Pesquisador acessa busca e leitura de URLs; o Coder edita arquivos e roda testes; o Revisor faz lint e scan de segurança.",
        why: "Especialização reduz o espaço de decisão de cada agente, melhora a qualidade e simplifica o controle de permissões: o Revisor não precisa de acesso a edição de arquivos." },
      enter: (ctx) => {
        const all = ["sa0_t1","sa0_t2","sa1_t1","sa1_t2","sa2_t1","sa2_t2"];
        all.forEach((id, i) => setTimeout(() => ctx.show(id), i * 80));
      },
    },
    {
      title: "Execução paralela e independente",
      show: ["par_lbl", "par_line", "iso_lbl"],
      highlight: ["sa0", "sa1", "sa2"],
      balloon: { anchor: "par_lbl", placement: "bottom",
        text: "Os três subagentes <strong>executam em paralelo</strong>: o Pesquisador já busca enquanto o Coder implementa e o Revisor prepara seus critérios. Não há dependência entre eles nessa fase.",
        why: "Paralelismo reduz drasticamente o tempo total de tarefas complexas — de sequencial (n × tempo) para paralelo (≈ max tempo). Em tarefas longas, a diferença pode ser de horas." },
      enter: (ctx) => { ["sa0","sa1","sa2"].forEach(id => ctx.pulse(id, true)); },
    },
    {
      title: "Contexto isolado por subagente",
      highlight: ["sa0", "sa1", "sa2"],
      balloon: { anchor: "iso_lbl", placement: "bottom",
        text: "Cada subagente tem sua própria janela de contexto <strong>independente</strong>. O Subagente A não vê os pensamentos do B. Isso evita distrações e permite que cada um aprofunde no seu domínio sem interferência.",
        why: "Isolamento também é segurança: um subagente comprometido por injeção de prompt não contamina os outros. O orquestrador valida os resultados antes de usá-los." },
    },
    {
      title: "Resultados retornam ao orquestrador",
      show: ["res0_lbl", "res1_lbl", "res2_lbl", "rt0", "rt1", "rt2"],
      highlight: ["orch"],
      balloon: { anchor: "orch", placement: "right",
        text: "Cada subagente termina e envia seu <strong>resultado estruturado</strong> ao orquestrador: o Pesquisador devolve links e resumos, o Coder o diff do código, o Revisor a lista de issues.",
        why: "O formato do resultado é combinado no prompt de spawn — resultados estruturados (JSON, markdown) são mais fáceis de processar pelo orquestrador do que texto livre." },
      enter: (ctx) => {
        ["res0_lbl","res1_lbl","res2_lbl"].forEach((id, i) => setTimeout(() => ctx.show(id), i * 100));
        setTimeout(() => {
          ["rt0","rt1","rt2"].forEach((id, i) => setTimeout(() => ctx.drawArrow(id), i * 120));
        }, 400);
      },
    },
    {
      title: "Agregação e síntese",
      show: ["agg_box"],
      highlight: ["agg_box", "orch"],
      balloon: { anchor: "agg_box", placement: "top",
        text: "O orquestrador recebe todos os resultados e faz a <strong>síntese final</strong>: usa a pesquisa para contextualizar o código gerado, aplica as correções do revisor e entrega uma resposta coerente e completa.",
        why: "Essa é a vantagem central do padrão: o orquestrador tem visibilidade holística enquanto cada subagente tem profundidade. Separar delegação de execução é o que torna isso escalável." },
    },
    {
      title: "Tratamento de falhas e retry",
      show: ["fail_box", "a_fail_r", "retry_box"],
      highlight: ["fail_box"],
      balloon: { anchor: "fail_box", placement: "right",
        text: "Quando um subagente falha (timeout, erro, resposta inválida), o orquestrador pode <strong>tentar novamente</strong> com um prompt mais específico, substituir por outro agente ou usar um fallback — sem impactar os outros subagentes.",
        why: "Resiliência é uma vantagem do multi-agente: a falha de um componente não derruba todo o sistema. O orquestrador mantém o estado e decide como recuperar." },
    },
    {
      title: "Quiz rápido",
      balloon: { anchor: { x: 640, y: 360 }, placement: "bottom",
        text: "Teste seu entendimento de SubAgentes 👇" },
      quiz: {
        question: "Por que subagentes têm contextos isolados entre si?",
        options: [
          "Para economizar tokens e reduzir o custo de API",
          "Porque o protocolo MCP não permite compartilhar contexto",
          "Para evitar contaminação cruzada, permitir especialização e aumentar a segurança",
          "Porque LLMs não conseguem processar múltiplos contextos ao mesmo tempo",
        ],
        answer: 2,
        explain: "Contextos isolados evitam que o estado de um subagente interfira nos outros (contaminação), permitem que cada um aprofunde no seu domínio e isolam o impacto de falhas como injeção de prompt.",
      },
    },
    {
      title: "Resumo: o padrão orquestrador-subagente",
      highlight: ["orch", "sa0", "sa1", "sa2", "agg_box"],
      balloon: { anchor: { x: 640, y: 360 }, placement: "bottom",
        text: "O padrão multi-agente em 5 etapas: <strong>Orquestrador planeja → Spawna subagentes especializados → Execução paralela e isolada → Resultados retornam → Orquestrador sintetiza</strong>. Escalável, resiliente e eficiente.",
        why: "Use multi-agente quando a tarefa é grande demais para uma janela, beneficia de paralelismo ou requer especialização por domínio. Para tarefas simples, um agente único é mais eficiente." },
      enter: (ctx) => {
        ["orch","sa0","sa1","sa2","agg_box"].forEach((id, k) => setTimeout(() => ctx.pulse(id, true), k * 100));
      },
    },
  ];

  window.SUBAGENTS_DIAGRAM = {
    title: "SubAgentes — Arquitetura multi-agente",
    subtitle: "Orquestrador, especialização, paralelismo e agregação de resultados",
    width: W, height: H, autoplayMs: 9000, elements, steps,
  };
})();
