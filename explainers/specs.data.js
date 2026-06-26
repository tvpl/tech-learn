/* ============================================================================
 * specs.data.js — Explicador: Specs para Agentes de IA
 * O que são specs, seções, tools, contratos, exemplos e diferenças
 * ==========================================================================*/
(function () {
  const W = 1280, H = 720;

  // Documento (esquerda) + Agente lendo (direita)
  const DX = 40, DW = 520;
  const AX = 640;

  const sec = (id, y, h, icon, title, fill, stroke) => ({
    id, type: "box", x: DX, y, w: DW, h,
    fill: fill || "#1b2747", stroke: stroke, rx: 8,
    label: [`${icon} ${title}`],
  });

  const elements = [
    /* ── DOCUMENTO DE SPEC ──────────────────────── */
    { id: "doc_border", type: "box", x: DX-8, y: 30, w: DW+16, h: 660, fill: "#0a0e1a", rx: 14, stroke: "var(--muted)" },
    { id: "doc_title",  type: "label", x: DX+DW/2, y: 54, anchor: "middle", label: "📄 Spec do Agente" },
    { id: "doc_ver",    type: "label", x: DX+DW/2, y: 72, anchor: "middle", sub: true, label: "v2.3 · revisado em 2025-06-26" },

    sec("s_ctx",  88,  60, "🌍", "Contexto e objetivo",     "#22315d", "var(--accent-2)"),
    sec("s_res",  158, 60, "⛔", "Restrições e limites",     "#1a1208", "var(--warn)"),
    sec("s_tools",228, 60, "🔧", "Tools disponíveis",        "#1b2747", "var(--accent)"),
    sec("s_io",   298, 60, "📤", "Contratos de I/O",         "#1b2747", "var(--good)"),
    sec("s_ex",   368, 100,"💡", "Exemplos (few-shot)",      "#22315d", "var(--accent-2)"),
    sec("s_gr",   478, 60, "🛡️", "Guardrails",               "#1a1208", "var(--hot)"),
    sec("s_ver",  548, 60, "🔖", "Versionamento",            "#1b2747", "var(--muted)"),
    sec("s_val",  618, 60, "✅", "Validação da spec",        "#112318", "var(--good)"),

    /* ── DETALHES DAS SEÇÕES (revelados ao navegar) ── */
    // Contexto
    { id: "d_ctx", type: "box", x: AX, y: 60, w: 590, h: 180, fill: "#0e1730", rx: 12 },
    { id: "d_ctx_ttl", type: "label", x: AX+295, y: 80, anchor: "middle", label: "Contexto: o QUÊ e o PORQUÊ" },
    { id: "d_ctx_1", type: "token", x: AX+10, y: 96,  w: 570, h: 40, fill: "#22315d", stroke: "var(--accent-2)", label: "Nome: agente-suporte-vendas" },
    { id: "d_ctx_2", type: "token", x: AX+10, y: 144, w: 570, h: 40, fill: "#1b2747", label: "Objetivo: responder clientes sobre produtos e pedidos" },
    { id: "d_ctx_3", type: "token", x: AX+10, y: 192, w: 570, h: 40, fill: "#1b2747", label: "Usuário: cliente final · Canal: chat do site" },

    // Restrições
    { id: "d_res", type: "box", x: AX, y: 60, w: 590, h: 200, fill: "#0e1730", rx: 12 },
    { id: "d_res_ttl", type: "label", x: AX+295, y: 80, anchor: "middle", label: "Restrições: o que o agente NÃO pode fazer" },
    { id: "d_res_1", type: "token", x: AX+10, y: 96,  w: 570, h: 40, fill: "#3a1320", stroke: "var(--hot)", label: "❌ Nunca prometer prazos sem consultar o sistema" },
    { id: "d_res_2", type: "token", x: AX+10, y: 144, w: 570, h: 40, fill: "#3a1320", stroke: "var(--hot)", label: "❌ Não discutir preços de concorrentes" },
    { id: "d_res_3", type: "token", x: AX+10, y: 192, w: 570, h: 40, fill: "#1a1208", stroke: "var(--warn)", label: "⚠️ Escalar para humano em casos de cancelamento" },

    // Tools
    { id: "d_tools", type: "box", x: AX, y: 60, w: 590, h: 220, fill: "#0e1730", rx: 12 },
    { id: "d_tools_ttl", type: "label", x: AX+295, y: 80, anchor: "middle", label: "Tools: capacidades do agente" },
    { id: "d_t1", type: "token", x: AX+10, y: 96,  w: 570, h: 40, fill: "#22315d", stroke: "var(--accent)", label: "buscar_pedido(order_id) → { status, items, eta }" },
    { id: "d_t2", type: "token", x: AX+10, y: 144, w: 570, h: 40, fill: "#1b2747", label: "listar_produtos(categoria?) → [{ id, nome, preco }]" },
    { id: "d_t3", type: "token", x: AX+10, y: 192, w: 570, h: 40, fill: "#112318", stroke: "var(--good)", label: "criar_ticket(motivo, prioridade) → ticket_id" },
    { id: "d_tools_note", type: "label", x: AX+295, y: 248, anchor: "middle", sub: true, label: "Cada tool com nome, assinatura e schema de retorno" },

    // Contratos I/O
    { id: "d_io", type: "box", x: AX, y: 60, w: 590, h: 220, fill: "#0e1730", rx: 12 },
    { id: "d_io_ttl", type: "label", x: AX+295, y: 80, anchor: "middle", label: "Contratos de I/O" },
    { id: "d_io_in",  type: "token", x: AX+10, y: 96,  w: 570, h: 60, fill: "#1b2747", stroke: "var(--accent)", label: ["Input: { message: string, session_id: string,", "  customer_id?: string }"] },
    { id: "d_io_out", type: "token", x: AX+10, y: 164, w: 570, h: 60, fill: "#112318", stroke: "var(--good)", label: ["Output: { reply: string, actions_taken: string[],", "  escalate?: boolean }"] },
    { id: "d_io_note", type: "label", x: AX+295, y: 244, anchor: "middle", sub: true, label: "Contratos permitem validar e testar o agente programaticamente" },

    // Exemplos
    { id: "d_ex", type: "box", x: AX, y: 60, w: 590, h: 280, fill: "#0e1730", rx: 12 },
    { id: "d_ex_ttl", type: "label", x: AX+295, y: 80, anchor: "middle", label: "Exemplos few-shot na spec" },
    { id: "d_ex_1u", type: "token", x: AX+10, y: 96,  w: 570, h: 40, fill: "#1b1224", stroke: "var(--hot)", label: "User: Onde está meu pedido #12345?" },
    { id: "d_ex_1a", type: "token", x: AX+10, y: 144, w: 570, h: 60, fill: "#112318", stroke: "var(--good)", label: ["Agente: Consultei o pedido #12345. Status: em trânsito,", "chegada prevista amanhã. Posso ajudar com mais algo?"] },
    { id: "d_ex_2u", type: "token", x: AX+10, y: 212, w: 570, h: 40, fill: "#1b1224", stroke: "var(--hot)", label: "User: Quero cancelar." },
    { id: "d_ex_2a", type: "token", x: AX+10, y: 258, w: 570, h: 60, fill: "#22315d", stroke: "var(--accent-2)", label: ["Agente: [escalate: true] Vou transferir para nossa equipe", "especializada que pode processar o cancelamento."] },

    // Comparativo specs vs system prompt
    { id: "cmp_box", type: "box", x: AX, y: 60, w: 590, h: 340, fill: "#0e1730", rx: 12 },
    { id: "cmp_ttl", type: "label", x: AX+295, y: 80, anchor: "middle", label: "Spec vs System Prompt vs CLAUDE.md" },
    { id: "cmp_sp",  type: "box", x: AX+10, y: 96, w: 570, h: 70, fill: "#2a1d3d", stroke: "var(--accent-2)", label: ["System Prompt: instruções em tempo de execução", "(enviado ao LLM a cada chamada, limita-se a texto)"] },
    { id: "cmp_cl",  type: "box", x: AX+10, y: 174, w: 570, h: 70, fill: "#22315d", stroke: "var(--accent)", label: ["CLAUDE.md: contexto do projeto para o agente de código", "(estrutura do repositório, comandos, convenções)"] },
    { id: "cmp_sp2", type: "box", x: AX+10, y: 252, w: 570, h: 90, fill: "#112318", stroke: "var(--good)", label: ["Spec: documento versionado de comportamento,", "contrato de I/O, tools e exemplos. É a fonte de verdade.", "Sistema Prompt é derivado da Spec."] },

    /* ── AGENTE LENDO A SPEC ─────────────────────── */
    { id: "agent_box", type: "box", x: AX, y: 440, w: 220, h: 70, fill: "#2a1d3d", stroke: "var(--accent)", label: ["🤖 Agente", "\"leu a spec, ready\""] },
    { id: "a_doc_agent", type: "arrow", x1: DX+DW, y1: 350, x2: AX, y2: 460, color: "var(--accent)" },
  ];

  const steps = [
    {
      title: "O que são Specs para agentes de IA",
      show: ["doc_border", "doc_title", "doc_ver",
             "s_ctx","s_res","s_tools","s_io","s_ex","s_gr","s_ver","s_val"],
      highlight: ["doc_border"],
      balloon: { anchor: "doc_title", placement: "right",
        text: "Uma <strong>Spec de agente</strong> é um documento estruturado que define completamente como o agente deve se comportar: objetivo, restrições, tools disponíveis, contratos de I/O e exemplos. É mais rica e durável que um system prompt.",
        why: "Specs vivem no repositório, são versionadas com o código e se tornam a fonte de verdade para gerar system prompts, testes e até o agente em si. São documentação que não fica obsoleta." },
      enter: (ctx) => {
        ["s_ctx","s_res","s_tools","s_io","s_ex","s_gr","s_ver","s_val"].forEach((id, i) => setTimeout(() => ctx.show(id), i * 80));
      },
    },
    {
      title: "Seção 1: Contexto e objetivo",
      show: ["d_ctx","d_ctx_ttl","d_ctx_1","d_ctx_2","d_ctx_3"],
      highlight: ["s_ctx"],
      balloon: { anchor: "s_ctx", placement: "right",
        text: "O <strong>Contexto</strong> responde três perguntas: <em>Quem é o agente?</em> (nome, domínio), <em>O que ele faz?</em> (objetivo principal) e <em>Para quem?</em> (usuário-alvo e canal de comunicação).",
        why: "Contexto mal definido leva a um agente que tenta fazer tudo e não faz nada bem. Quanto mais específico o contexto, melhor o modelo entende os limites e o tom adequado." },
      enter: (ctx) => {
        ["d_ctx_1","d_ctx_2","d_ctx_3"].forEach((id, i) => setTimeout(() => ctx.show(id), i * 120));
      },
    },
    {
      title: "Seção 2: Restrições — o que não pode fazer",
      show: ["d_res","d_res_ttl","d_res_1","d_res_2","d_res_3"],
      highlight: ["s_res"],
      balloon: { anchor: "s_res", placement: "right",
        text: "Restrições definem os <strong>limites de atuação</strong> do agente: o que nunca pode fazer (❌), o que requer cautela (⚠️) e quando escalar para humanos. Devem ser explícitas, não implícitas.",
        why: "LLMs sem restrições tentam ser úteis de formas inesperadas. Restrições claras na spec tornam-se parte do system prompt e são muito mais confiáveis do que esperar que o modelo inferira os limites." },
      enter: (ctx) => {
        ["d_res_1","d_res_2","d_res_3"].forEach((id, i) => setTimeout(() => ctx.show(id), i * 120));
      },
    },
    {
      title: "Seção 3: Tools disponíveis",
      show: ["d_tools","d_tools_ttl","d_t1","d_t2","d_t3","d_tools_note"],
      highlight: ["s_tools"],
      balloon: { anchor: "s_tools", placement: "right",
        text: "A seção de <strong>Tools</strong> lista todas as capacidades do agente com assinaturas completas: nome da tool, parâmetros (com tipos) e formato de retorno. O LLM usa isso para decidir qual tool chamar.",
        why: "Documentar tools na spec cria um contrato: o desenvolvedor sabe o que o agente pode fazer, o LLM sabe como usar cada tool, e os testes validam que cada tool funciona conforme o esperado." },
      enter: (ctx) => {
        ["d_t1","d_t2","d_t3"].forEach((id, i) => setTimeout(() => ctx.show(id), i * 120));
      },
    },
    {
      title: "Seção 4: Contratos de I/O",
      show: ["d_io","d_io_ttl","d_io_in","d_io_out","d_io_note"],
      highlight: ["s_io"],
      balloon: { anchor: "s_io", placement: "right",
        text: "Os <strong>Contratos de I/O</strong> definem o formato exato das entradas e saídas do agente, com tipos e campos opcionais. Isso permite criar <strong>testes automatizados</strong> e validar o comportamento do agente programaticamente.",
        why: "Contratos transformam o agente em um componente de software com interface bem definida — como uma API. Isso permite integrá-lo, testá-lo e monitorá-lo como qualquer outro serviço." },
    },
    {
      title: "Seção 5: Exemplos (few-shot na spec)",
      show: ["d_ex","d_ex_ttl","d_ex_1u","d_ex_1a","d_ex_2u","d_ex_2a"],
      highlight: ["s_ex"],
      balloon: { anchor: "s_ex", placement: "right",
        text: "Exemplos concretos de interação mostram o comportamento esperado em situações reais. São usados como <strong>few-shot</strong> no system prompt gerado, calibrando o tom, formato e tomada de decisão do agente.",
        why: "Exemplos são mais eficazes que regras abstratas: 'responda de forma empática' é vago; um exemplo de resposta empática é preciso. O modelo aprende o padrão pelo exemplo." },
      enter: (ctx) => {
        ["d_ex_1u"].forEach(id => ctx.show(id));
        setTimeout(() => ctx.show("d_ex_1a"), 200);
        setTimeout(() => ctx.show("d_ex_2u"), 500);
        setTimeout(() => ctx.show("d_ex_2a"), 700);
      },
    },
    {
      title: "O agente lê a spec e fica pronto",
      show: ["agent_box", "a_doc_agent"],
      highlight: ["agent_box"],
      balloon: { anchor: "agent_box", placement: "right",
        text: "O agente instanciado <strong>recebe a spec</strong> (ou o system prompt derivado dela) e está pronto para operar dentro dos limites definidos: sabe o que pode fazer, o que não pode, quais tools tem e como responder.",
        why: "A spec é a 'carta de trabalho' do agente. Mudou a spec → rebuild do system prompt → comportamento atualizado. Sem a spec, qualquer mudança exige edição manual do system prompt." },
      enter: (ctx) => { ctx.drawArrow("a_doc_agent"); },
    },
    {
      title: "Spec vs System Prompt vs CLAUDE.md",
      show: ["cmp_box","cmp_ttl","cmp_sp","cmp_cl","cmp_sp2"],
      highlight: ["cmp_sp2"],
      balloon: { anchor: "cmp_sp2", placement: "left",
        text: "<strong>System Prompt</strong>: texto enviado a cada chamada — gerado a partir da spec. <strong>CLAUDE.md</strong>: contexto do repositório para agentes de código. <strong>Spec</strong>: documento versionado completo, fonte de verdade de onde tudo é derivado.",
        why: "Confundir os três leva a duplicação: equipes gerenciam system prompts manualmente, perdem track de quem mudou o quê. A Spec no repositório resolve isso — é o único lugar para editar o comportamento." },
      enter: (ctx) => {
        ["cmp_sp","cmp_cl","cmp_sp2"].forEach((id, i) => setTimeout(() => ctx.show(id), i * 150));
      },
    },
    {
      title: "Versionamento e validação da spec",
      highlight: ["s_ver", "s_val"],
      balloon: { anchor: "s_val", placement: "right",
        text: "Specs são arquivos de texto (YAML, Markdown) no repositório — <strong>versionadas com Git</strong> como qualquer código. Validação automatizada verifica se a spec tem todos os campos obrigatórios e se os contratos de I/O são consistentes.",
        why: "Versionamento permite: comparar duas versões do agente, fazer rollback, criar branches de spec para A/B testing de comportamento. A spec é código, não documentação separada." },
    },
    {
      title: "Quiz rápido",
      balloon: { anchor: { x: 640, y: 360 }, placement: "right",
        text: "Confirme seu entendimento sobre Specs 👇" },
      quiz: {
        question: "Qual a diferença principal entre uma Spec e um System Prompt?",
        options: [
          "Specs usam linguagem natural; System Prompts usam JSON",
          "Specs são mais longas e detalhadas que System Prompts",
          "A Spec é a fonte de verdade versionada; o System Prompt é gerado a partir dela para cada chamada",
          "System Prompts incluem tools e contratos; Specs são apenas texto descritivo",
        ],
        answer: 2,
        explain: "A Spec é o documento de referência versionado no repositório. O System Prompt é a 'compilação' da Spec para o formato que o LLM recebe a cada chamada. Editar a Spec regenera o System Prompt — não o contrário.",
      },
    },
    {
      title: "Resumo: Specs para Agentes",
      highlight: ["s_ctx","s_res","s_tools","s_io","s_ex","s_gr","s_ver","s_val"],
      balloon: { anchor: { x: 280, y: 360 }, placement: "right",
        text: "Uma Spec completa tem: <strong>Contexto → Restrições → Tools → Contratos I/O → Exemplos → Guardrails → Versionamento → Validação</strong>. É a fonte de verdade versionada da qual system prompt, testes e docs são derivados.",
        why: "Adotar Specs transforma agentes de 'caixas pretas com system prompt hardcoded' em componentes de software gerenciáveis, testáveis e auditáveis — como qualquer outro serviço no stack." },
      enter: (ctx) => {
        ["s_ctx","s_res","s_tools","s_io","s_ex","s_gr","s_ver","s_val"].forEach((id, k) => setTimeout(() => ctx.pulse(id, true), k * 80));
      },
    },
  ];

  window.SPECS_DIAGRAM = {
    title: "Specs para Agentes de IA",
    subtitle: "O documento que define comportamento, tools, contratos e exemplos",
    width: W, height: H, autoplayMs: 9000, elements, steps,
  };
})();
