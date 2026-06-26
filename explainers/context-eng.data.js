/* ============================================================================
 * context-eng.data.js — Explicador: Engenharia de Contexto
 * Janela de contexto, hierarquia, compressão, caching e estratégias
 * ==========================================================================*/
(function () {
  const W = 1280, H = 720;

  // Janela de contexto: barra horizontal grande no centro
  const CWX = 60, CWY = 140, CWW = 1160, CWH = 220;

  // Larguras dos segmentos (proporcional a tokens)
  const SEG = {
    sys:  { x: CWX,        w: 220, fill: "#2a1d3d", stroke: "var(--accent-2)", label: "System Prompt" },
    hist: { x: CWX+220,    w: 350, fill: "#1b2747",  stroke: "var(--accent)",  label: "Histórico" },
    tool: { x: CWX+570,    w: 200, fill: "#22315d",  stroke: "var(--warn)",    label: "Tool Results" },
    rag:  { x: CWX+770,    w: 200, fill: "#11351f",  stroke: "var(--good)",    label: "Docs (RAG)" },
    usr:  { x: CWX+970,    w: 180, fill: "#1b1224",  stroke: "var(--hot)",     label: "User" },
    free: { x: CWX+1150,   w: 70,  fill: "#0a0e1a",  stroke: "var(--muted)",   label: "livre" },
  };

  const seg = (id, s, yOff, hOff) => ({
    id, type: "box",
    x: s.x, y: CWY + (yOff||0), w: s.w, h: CWH + (hOff||0),
    fill: s.fill, stroke: s.stroke, rx: 4,
    label: s.label,
  });

  const elements = [
    /* ── JANELA DE CONTEXTO (estrutura base) ──────── */
    { id: "cw_border", type: "box", x: CWX-4, y: CWY-4, w: CWW+8, h: CWH+8,
      fill: "#0a0e1a", stroke: "var(--muted)", rx: 10 },
    { id: "cw_lbl", type: "label", x: CWX+CWW/2, y: CWY-24, anchor: "middle",
      label: "Janela de Contexto do LLM (ex.: 200k tokens)" },
    { id: "cw_tok", type: "label", x: CWX+CWW/2, y: CWY+CWH+24, anchor: "middle", sub: true,
      label: "← cada pixel representa ≈ 10 tokens →" },

    // Segmentos
    seg("s_sys",  SEG.sys,  0, 0),
    seg("s_hist", SEG.hist, 0, 0),
    seg("s_tool", SEG.tool, 0, 0),
    seg("s_rag",  SEG.rag,  0, 0),
    seg("s_usr",  SEG.usr,  0, 0),
    seg("s_free", SEG.free, 0, 0),

    // Rótulos dos segmentos (dentro da janela, no centro vertical)
    { id: "lbl_sys",  type: "label", x: SEG.sys.x  + SEG.sys.w/2,  y: CWY+CWH/2-8, anchor: "middle", sub: true, label: "System" },
    { id: "lbl_hist", type: "label", x: SEG.hist.x + SEG.hist.w/2, y: CWY+CWH/2-8, anchor: "middle", sub: true, label: "Histórico" },
    { id: "lbl_tool", type: "label", x: SEG.tool.x + SEG.tool.w/2, y: CWY+CWH/2-8, anchor: "middle", sub: true, label: "Tools" },
    { id: "lbl_rag",  type: "label", x: SEG.rag.x  + SEG.rag.w/2,  y: CWY+CWH/2-8, anchor: "middle", sub: true, label: "RAG" },
    { id: "lbl_usr",  type: "label", x: SEG.usr.x  + SEG.usr.w/2,  y: CWY+CWH/2-8, anchor: "middle", sub: true, label: "User" },
    { id: "lbl_free", type: "label", x: SEG.free.x + SEG.free.w/2, y: CWY+CWH/2-8, anchor: "middle", sub: true, label: "livre" },

    // Contadores de tokens (embaixo de cada segmento)
    { id: "tok_sys",  type: "label", x: SEG.sys.x  + SEG.sys.w/2,  y: CWY+CWH+50, anchor: "middle", mono: true, sub: true, label: "~4k" },
    { id: "tok_hist", type: "label", x: SEG.hist.x + SEG.hist.w/2, y: CWY+CWH+50, anchor: "middle", mono: true, sub: true, label: "~40k" },
    { id: "tok_tool", type: "label", x: SEG.tool.x + SEG.tool.w/2, y: CWY+CWH+50, anchor: "middle", mono: true, sub: true, label: "~8k" },
    { id: "tok_rag",  type: "label", x: SEG.rag.x  + SEG.rag.w/2,  y: CWY+CWH+50, anchor: "middle", mono: true, sub: true, label: "~10k" },
    { id: "tok_usr",  type: "label", x: SEG.usr.x  + SEG.usr.w/2,  y: CWY+CWH+50, anchor: "middle", mono: true, sub: true, label: "~1.5k" },
    { id: "tok_free", type: "label", x: SEG.free.x + SEG.free.w/2, y: CWY+CWH+50, anchor: "middle", mono: true, sub: true, label: "~6k" },

    /* ── HIERARQUIA DE MENSAGENS ──────────────────── */
    { id: "hier_box",  type: "box", x: 60, y: 430, w: 340, h: 180, fill: "#0e1730", rx: 10 },
    { id: "hier_lbl",  type: "label", x: 230, y: 452, anchor: "middle", label: "Hierarquia de mensagens" },
    { id: "hier_sys2", type: "token", x: 80, y: 468, w: 300, h: 38, fill: "#2a1d3d", stroke: "var(--accent-2)", label: "system (maior autoridade)" },
    { id: "hier_ast",  type: "token", x: 80, y: 516, w: 300, h: 38, fill: "#22315d", label: "assistant" },
    { id: "hier_usr2", type: "token", x: 80, y: 564, w: 300, h: 38, fill: "#1b1224", stroke: "var(--hot)", label: "user" },
    { id: "a_hier1",   type: "arrow", x1: 230, y1: 508, x2: 230, y2: 514, color: "var(--muted)" },
    { id: "a_hier2",   type: "arrow", x1: 230, y1: 556, x2: 230, y2: 562, color: "var(--muted)" },

    /* ── ESTRATÉGIAS ──────────────────────────────── */
    { id: "strat_lbl", type: "label", x: 640, y: 432, anchor: "middle", label: "Estratégias quando o contexto enche" },
    { id: "st1", type: "token", x: 440, y: 452, w: 380, h: 48, fill: "#1b2747", label: "Compressão: resumir histórico antigo" },
    { id: "st2", type: "token", x: 440, y: 512, w: 380, h: 48, fill: "#1b2747", label: "Sliding window: manter só as N últimas trocas" },
    { id: "st3", type: "token", x: 440, y: 572, w: 380, h: 48, fill: "#1b2747", label: "Memória externa: salvar e recuperar por RAG" },
    { id: "st4", type: "token", x: 440, y: 632, w: 380, h: 48, fill: "#1b2747", label: "Arquivamento: descartar tool results antigos" },

    /* ── PROMPT CACHE ─────────────────────────────── */
    { id: "cache_box", type: "box", x: 860, y: 432, w: 380, h: 240, fill: "#112318", stroke: "var(--good)", rx: 10 },
    { id: "cache_lbl", type: "label", x: 1050, y: 452, anchor: "middle", label: "Prompt Cache (caching de prefixo)" },
    { id: "cache_1", type: "token", x: 880, y: 468, w: 340, h: 44, fill: "#11351f", stroke: "var(--good)", label: "System Prompt → cacheado ✓" },
    { id: "cache_2", type: "token", x: 880, y: 522, w: 340, h: 44, fill: "#11351f", stroke: "var(--good)", label: "Docs/RAG longos → cacheados ✓" },
    { id: "cache_3", type: "token", x: 880, y: 576, w: 340, h: 44, fill: "#0e1730", stroke: "var(--muted)", label: "User/Assistant → não cacheados" },
    { id: "cache_cost", type: "label", x: 1050, y: 634, anchor: "middle", sub: true,
      label: "Cache = 90% menos custo em prefixos repetidos" },

    /* ── AVISO DE LIMITE ──────────────────────────── */
    { id: "limit_box", type: "token", x: CWX-4, y: CWY+CWH/2-20, w: CWW+8, h: 40,
      fill: "#3a1320", stroke: "var(--hot)", label: "⚠️ Limite atingido — contexto precisará ser truncado ou comprimido" },
  ];

  const steps = [
    {
      title: "O que é a janela de contexto",
      show: ["cw_border", "cw_lbl", "cw_tok"],
      highlight: ["cw_border"],
      balloon: { anchor: "cw_lbl", placement: "bottom",
        text: "Todo LLM tem uma <strong>janela de contexto</strong>: o máximo de tokens que ele pode processar de uma vez. Tokens são fragmentos de texto (palavras, sílabas, pontuação). Modelos modernos têm de 8k a 1M tokens.",
        why: "O que cabe na janela determina o que o LLM 'sabe' naquele momento. Tudo fora dela é invisível — por isso gerenciar o contexto é tão crítico." },
    },
    {
      title: "System Prompt: a base fixa",
      show: ["s_sys", "lbl_sys", "tok_sys"],
      highlight: ["s_sys"],
      balloon: { anchor: "s_sys", placement: "bottom",
        text: "O <strong>System Prompt</strong> é a primeira e mais importante seção: define a identidade, restrições e capacidades do agente. Ele está presente em todas as requisições e tem a maior autoridade.",
        why: "Coloque no system: persona, regras de negócio, formato de resposta e capacidades disponíveis. Instruções no system têm peso maior que no user para a maioria dos modelos." },
    },
    {
      title: "Histórico de conversa cresce",
      show: ["s_hist", "lbl_hist", "tok_hist"],
      highlight: ["s_hist"],
      balloon: { anchor: "s_hist", placement: "bottom",
        text: "O <strong>histórico</strong> de mensagens (alternando user/assistant) ocupa a maior parte da janela em conversas longas. Cada resposta do modelo adiciona tokens que ficam para sempre — o contexto só cresce.",
        why: "É o maior consumidor de tokens em aplicações de chat. Gerenciar o histórico (comprimir, truncar, resumir) é fundamental para conversas longas serem viáveis." },
    },
    {
      title: "Tool Results: resultados de ferramentas",
      show: ["s_tool", "lbl_tool", "tok_tool"],
      highlight: ["s_tool"],
      balloon: { anchor: "s_tool", placement: "bottom",
        text: "Quando o LLM usa uma ferramenta (MCP, function calling), o <strong>resultado</strong> é injetado no contexto como uma mensagem <code>tool_result</code>. Outputs de ferramentas podem ser enormes: logs, JSONs, conteúdo de arquivos.",
        why: "Comprima ou filtre resultados de tools antes de injetá-los. Passar um JSON de 50k tokens quando só 500 são relevantes desperdiça espaço e aumenta custo." },
    },
    {
      title: "Documentos RAG no contexto",
      show: ["s_rag", "lbl_rag", "tok_rag"],
      highlight: ["s_rag"],
      balloon: { anchor: "s_rag", placement: "bottom",
        text: "Chunks recuperados pelo RAG são inseridos no contexto como referência. Mesmo sendo úteis, <strong>ocupam espaço valioso</strong> e competem com o histórico e as respostas do modelo.",
        why: "Seja seletivo: recupere apenas os K chunks mais relevantes e considere comprimi-los. Um bom retriever recupera menos e melhor; um mau retriever inunda o contexto com ruído." },
    },
    {
      title: "A mensagem do usuário: a menor parte",
      show: ["s_usr", "lbl_usr", "tok_usr", "s_free", "lbl_free", "tok_free"],
      highlight: ["s_usr", "s_free"],
      balloon: { anchor: "s_usr", placement: "bottom",
        text: "A pergunta do usuário geralmente tem <strong>poucos tokens</strong>, mas ocupa a posição mais recente e por isso mais influente para o modelo. O espaço 'livre' é o que sobra para a resposta do LLM.",
        why: "Se o contexto encher antes da resposta começar, o modelo pode ser forçado a truncar sua própria resposta ou o sistema pode jogar fora contexto antigo de forma abrupta." },
    },
    {
      title: "⚠️ Quando o limite é atingido",
      show: ["limit_box"],
      highlight: ["limit_box"],
      balloon: { anchor: "limit_box", placement: "top",
        text: "Ao atingir o limite da janela, o sistema precisa <strong>descartar, comprimir ou resumir</strong> parte do contexto. Se não gerenciado, o modelo começa a 'esquecer' partes cruciais da conversa.",
        why: "Truncar pela metade do histórico (estratégia ingênua) pode fazer o agente perder instruções críticas ou o início de uma tarefa. A estratégia de compressão importa muito." },
    },
    {
      title: "Hierarquia de mensagens",
      show: ["hier_box", "hier_lbl", "hier_sys2", "a_hier1", "hier_ast", "a_hier2", "hier_usr2"],
      highlight: ["hier_sys2"],
      balloon: { anchor: "hier_sys2", placement: "right",
        text: "As mensagens têm uma <strong>hierarquia de autoridade</strong>: <code>system</code> define regras invioláveis; <code>assistant</code> são as próprias respostas do modelo; <code>user</code> são as instruções do usuário final.",
        why: "Um system prompt bem escrito impede que o usuário subverta o comportamento do agente. Guardrails e instruções de segurança devem sempre estar no system, não no user." },
    },
    {
      title: "Estratégias de compressão",
      show: ["strat_lbl", "st1", "st2", "st3", "st4"],
      highlight: ["st1", "st2"],
      balloon: { anchor: "strat_lbl", placement: "bottom",
        text: "Quando o contexto enche, há várias estratégias: <strong>Compressão</strong> (resumir histórico com outro LLM), <strong>Sliding window</strong> (manter só as N últimas trocas), <strong>Memória externa</strong> (RAG do histórico) ou <strong>Arquivamento</strong> (descartar tool results já processados).",
        why: "Nenhuma estratégia é universalmente ótima. Sliding window é simples mas perde contexto inicial. Compressão preserva mais mas adiciona latência e custo." },
      enter: (ctx) => {
        ["st1","st2","st3","st4"].forEach((id, i) => setTimeout(() => ctx.show(id), i * 120));
      },
    },
    {
      title: "Prompt Cache: economizar com prefixos",
      show: ["cache_box", "cache_lbl", "cache_1", "cache_2", "cache_3", "cache_cost"],
      highlight: ["cache_1", "cache_2"],
      balloon: { anchor: "cache_box", placement: "left",
        text: "<strong>Prompt Caching</strong> armazena prefixos do contexto (system prompt, docs longos) e os reutiliza sem reprocessar. Uma requisição com cache pode custar <strong>90% menos</strong> para a parte cacheada.",
        why: "Use caching para system prompts estáticos e documentos grandes que se repetem entre requisições. O cache tem TTL (ex.: 5 min na Anthropic) — refaça a requisição antes de expirar." },
      enter: (ctx) => {
        ["cache_1","cache_2","cache_3"].forEach((id, i) => setTimeout(() => ctx.show(id), i * 150));
      },
    },
    {
      title: "Quiz rápido",
      balloon: { anchor: { x: 640, y: 400 }, placement: "bottom",
        text: "Teste seus conhecimentos de Context Engineering 👇" },
      quiz: {
        question: "Por que o System Prompt tem mais autoridade que o User na janela de contexto?",
        options: [
          "Porque vem primeiro na janela e o modelo dá mais peso ao início",
          "É uma convenção de papel: system define as regras do jogo que user não pode sobrescrever",
          "O modelo ignora automaticamente instruções do user que contradizem o system",
          "Ambas as opções A e B são igualmente verdadeiras",
        ],
        answer: 3,
        explain: "System tem maior autoridade por dois motivos complementares: a posição (início da janela tem peso maior para atenção) e o papel semântico (a arquitetura treina o modelo a tratar system como regras prioritárias).",
      },
    },
    {
      title: "Resumo: Context Engineering",
      highlight: ["s_sys", "s_hist", "s_tool", "s_rag", "s_usr"],
      balloon: { anchor: { x: 640, y: 360 }, placement: "bottom",
        text: "<strong>Engenharia de Contexto</strong>: gerenciar o que cabe e onde na janela. System define regras, histórico cresce e precisa ser comprimido, tool results devem ser filtrados, RAG deve ser seletivo, e prompt cache economiza custo em prefixos repetidos.",
        why: "Um sistema de IA bom é 50% arquitetura de modelo e 50% engenharia de contexto. Saber o que colocar, onde e quanto é o que separa demos de produção." },
      enter: (ctx) => {
        ["s_sys","s_hist","s_tool","s_rag","s_usr","s_free"].forEach((id, k) => setTimeout(() => ctx.pulse(id, true), k * 80));
      },
    },
  ];

  window.CONTEXT_ENG_DIAGRAM = {
    title: "Engenharia de Contexto",
    subtitle: "Gerenciar o que o LLM vê: tokens, hierarquia e estratégias",
    width: W, height: H, autoplayMs: 9000, elements, steps,
  };
})();
