/* ============================================================================
 * prompt-eng.data.js — Explicador: Engenharia de Prompt
 * Técnicas: zero-shot, few-shot, CoT, role, output format, ReAct, XML tags
 * ==========================================================================*/
(function () {
  const W = 1280, H = 720;

  // Layout: 3 colunas — Prompt (esq), LLM (centro), Output (dir)
  const PX = 60, LX = 590, OX = 900;
  const LLM_Y = 280, LLM_W = 200, LLM_H = 160;

  // helper para bloco de prompt
  const pblock = (id, y, lines, fill, stroke) => ({
    id, type: "box",
    x: PX, y, w: 480, h: Math.max(50, lines.length * 26 + 16),
    fill: fill || "#1b2747", stroke, rx: 8, label: lines,
  });

  // helper para bloco de output
  const oblock = (id, y, lines, fill, stroke) => ({
    id, type: "box",
    x: OX, y, w: 340, h: Math.max(50, lines.length * 26 + 16),
    fill: fill || "#112318", stroke: stroke || "var(--good)", rx: 8, label: lines,
  });

  const elements = [
    /* ── LLM (centro, sempre visível) ──────────────── */
    { id: "llm_box", type: "box", x: LX, y: LLM_Y, w: LLM_W, h: LLM_H,
      fill: "#2a1d3d", stroke: "var(--accent)", rx: 14,
      label: ["🧠", "LLM"] },
    { id: "llm_lbl", type: "label", x: LX+LLM_W/2, y: LLM_Y-18, anchor: "middle", sub: true, label: "modelo de linguagem" },
    { id: "a_p_llm",  type: "arrow", x1: PX+480, y1: LLM_Y+LLM_H/2, x2: LX, y2: LLM_Y+LLM_H/2, color: "var(--accent)" },
    { id: "a_llm_o",  type: "arrow", x1: LX+LLM_W, y1: LLM_Y+LLM_H/2, x2: OX, y2: LLM_Y+LLM_H/2, color: "var(--good)" },
    { id: "p_lbl",  type: "label", x: PX+240, y: LLM_Y-50, anchor: "middle", label: "Prompt (entrada)" },
    { id: "o_lbl",  type: "label", x: OX+170, y: LLM_Y-50, anchor: "middle", label: "Output (saída)" },

    /* ── CENA 2: Zero-shot ───────────────────────── */
    pblock("p_zero", 220, ["Traduza para inglês:", "\"O céu é azul.\""], "#1b2747"),
    oblock("o_zero", 240, ["\"The sky is blue.\""], "#112318"),
    { id: "zero_lbl", type: "token", x: PX, y: 170, w: 200, h: 36, fill: "#22315d", stroke: "var(--accent)", label: "Zero-shot" },

    /* ── CENA 3: Few-shot ────────────────────────── */
    pblock("p_few", 160,
      ["Classifique o sentimento:", "Ex: 'Amo este produto!' → positivo",
       "Ex: 'Horrível experiência.' → negativo",
       "", "Classifique: 'Entrega rápida!'"],
      "#1b2747"),
    oblock("o_few", 280, ["→ positivo"], "#112318"),
    { id: "few_lbl",  type: "token", x: PX, y: 110, w: 200, h: 36, fill: "#22315d", stroke: "var(--accent-2)", label: "Few-shot" },
    { id: "few_ex",   type: "label", x: PX+240, y: 460, anchor: "middle", sub: true, label: "Exemplos guiam o formato e o raciocínio" },

    /* ── CENA 4: Chain-of-thought ────────────────── */
    pblock("p_cot", 120,
      ["Pense passo a passo:", "Roger tem 5 bolas. Ganha 2 mais.", "Cada nova caixa tem 3 bolas.", "Recebeu 2 caixas novas. Quantas bolas?"],
      "#22315d"),
    oblock("o_cot", 120,
      ["Raciocínio:", "• Começa: 5 bolas", "• +2 bolas = 7", "• 2 caixas × 3 = 6", "• Total: 7+6 = 13 bolas"],
      "#11351f"),
    { id: "cot_lbl",  type: "token", x: PX, y: 60, w: 220, h: 36, fill: "#22315d", stroke: "var(--warn)", label: "Chain-of-Thought (CoT)" },
    { id: "cot_note", type: "label", x: PX+240, y: 530, anchor: "middle", sub: true, label: "\"Pense passo a passo\" aumenta acurácia em tarefas lógicas" },

    /* ── CENA 5: Role prompting ──────────────────── */
    pblock("p_role", 160,
      ["Você é um sênior de segurança.", "Revise este código Python e liste", "vulnerabilidades de SQL injection:"],
      "#1b1224"),
    oblock("o_role", 220,
      ["1. Linha 14: f-string em query", "2. Sem sanitização de entrada", "3. Recomendação: use parameterized queries"],
      "#11351f"),
    { id: "role_lbl",  type: "token", x: PX, y: 110, w: 220, h: 36, fill: "#1b1224", stroke: "var(--accent-2)", label: "Role / Persona" },

    /* ── CENA 6: Formato de saída ────────────────── */
    pblock("p_fmt", 120,
      ["Extraia os dados e retorne JSON:", "Nome, email e cidade.", "\"João Silva, joao@example.com, SP\""],
      "#1b2747"),
    oblock("o_fmt", 100,
      ["{", "  \"nome\": \"João Silva\",", "  \"email\": \"joao@...\",", "  \"cidade\": \"SP\"", "}"],
      "#11351f"),
    { id: "fmt_lbl",  type: "token", x: PX, y: 60, w: 260, h: 36, fill: "#22315d", stroke: "var(--good)", label: "Especificar formato de saída" },
    { id: "fmt_note", type: "label", x: PX+240, y: 530, anchor: "middle", sub: true, label: "JSON Schema ou exemplos concretos evitam outputs inesperados" },

    /* ── CENA 7: ReAct ───────────────────────────── */
    pblock("p_react", 60,
      ["Responda usando ferramentas.", "Raciocine antes de cada ação."],
      "#22315d"),
    oblock("o_react", 50,
      ["Thought: preciso do preço atual.",
       "Action: search('preço iPhone 15')",
       "Observation: R$ 4.799",
       "Thought: já tenho a resposta.",
       "Answer: iPhone 15 custa R$ 4.799"],
      "#112318"),
    { id: "react_lbl",  type: "token", x: PX, y: 10, w: 200, h: 36, fill: "#22315d", stroke: "var(--hot)", label: "ReAct (Reason + Act)" },
    { id: "react_note", type: "label", x: OX+170, y: 560, anchor: "middle", sub: true, label: "Thought → Action → Observation → Answer" },

    /* ── CENA 8: XML Tags ────────────────────────── */
    pblock("p_xml", 100,
      ["<task>Resuma o texto abaixo.</task>",
       "<context>",
       "  {texto do artigo aqui}",
       "</context>",
       "<format>3 bullet points</format>"],
      "#1b2747"),
    oblock("o_xml", 180,
      ["• Ponto 1: …", "• Ponto 2: …", "• Ponto 3: …"],
      "#112318"),
    { id: "xml_lbl",  type: "token", x: PX, y: 50, w: 220, h: 36, fill: "#22315d", stroke: "var(--accent)", label: "XML Tags para estrutura" },
    { id: "xml_note", type: "label", x: PX+240, y: 520, anchor: "middle", sub: true, label: "Tags delimitam contextos — evitam confusão entre instrução e dado" },

    /* ── CENA 9: Anti-padrões ────────────────────── */
    { id: "anti_box", type: "box", x: PX, y: 60, w: 1160, h: 560, fill: "#0a0e1a", rx: 10 },
    { id: "anti_lbl", type: "label", x: 640, y: 82, anchor: "middle", label: "Anti-padrões: o que NÃO fazer" },
    { id: "a1_b", type: "box", x: 80,  y: 100, w: 330, h: 100, fill: "#1a1208", stroke: "var(--hot)", label: ["❌ Ambiguidade", "\"Escreva algo legal sobre IA\""] },
    { id: "a2_b", type: "box", x: 450, y: 100, w: 330, h: 100, fill: "#1a1208", stroke: "var(--hot)", label: ["❌ Excesso de restrições", "\"Não faça X, não diga Y, evite Z, nunca W…\""] },
    { id: "a3_b", type: "box", x: 820, y: 100, w: 330, h: 100, fill: "#1a1208", stroke: "var(--hot)", label: ["❌ Prompt monolítico", "Instruções, contexto e dados misturados sem estrutura"] },
    { id: "a1_g", type: "box", x: 80,  y: 240, w: 330, h: 100, fill: "#112318", stroke: "var(--good)", label: ["✓ Seja específico", "\"Escreva 3 vantagens do RAG para empresas de e-commerce\""] },
    { id: "a2_g", type: "box", x: 450, y: 240, w: 330, h: 100, fill: "#112318", stroke: "var(--good)", label: ["✓ Diga o que quer", "\"Responda em tom formal, 2 parágrafos, em português\""] },
    { id: "a3_g", type: "box", x: 820, y: 240, w: 330, h: 100, fill: "#112318", stroke: "var(--good)", label: ["✓ Use estrutura clara", "<task> <context> <format> separam responsabilidades"] },
    { id: "a1_a", type: "arrow", x1: 245, y1: 202, x2: 245, y2: 238, color: "var(--good)" },
    { id: "a2_a", type: "arrow", x1: 615, y1: 202, x2: 615, y2: 238, color: "var(--good)" },
    { id: "a3_a", type: "arrow", x1: 985, y1: 202, x2: 985, y2: 238, color: "var(--good)" },
  ];

  const steps = [
    {
      title: "Por que o prompt importa tanto",
      show: ["llm_box", "llm_lbl", "a_p_llm", "a_llm_o", "p_lbl", "o_lbl"],
      highlight: ["llm_box"],
      balloon: { anchor: "llm_box", placement: "bottom",
        text: "O mesmo modelo pode dar respostas radicalmente diferentes dependendo de como o prompt é escrito. <strong>Engenharia de Prompt</strong> é a disciplina de estruturar instruções para extrair o máximo de um LLM.",
        why: "Um prompt bem escrito não muda o modelo — muda o que o modelo <em>ativa</em>. É como dar contexto e instrução a um especialista: quanto mais claro, melhor o resultado." },
    },
    {
      title: "Zero-shot: sem exemplos",
      show: ["zero_lbl", "p_zero", "o_zero"],
      highlight: ["p_zero"],
      balloon: { anchor: "p_zero", placement: "right",
        text: "<strong>Zero-shot</strong>: você instrui o modelo sem dar exemplos. Funciona bem para tarefas simples que o modelo já conhece do treinamento (tradução, resumo, classificação básica).",
        why: "Use zero-shot como ponto de partida. Se a qualidade não for suficiente, adicione exemplos (few-shot). Não complique o que já funciona simples." },
    },
    {
      title: "Few-shot: exemplos guiam o modelo",
      show: ["few_lbl", "p_few", "o_few", "few_ex"],
      highlight: ["p_few"],
      balloon: { anchor: "p_few", placement: "right",
        text: "<strong>Few-shot</strong>: você inclui 2-5 exemplos de input→output antes da sua tarefa real. O modelo aprende o padrão desejado pelo contexto, sem treinar nada.",
        why: "Few-shot é especialmente eficaz para: formatos específicos, classificações com categorias incomuns e tarefas onde o modelo precisa imitar um estilo particular." },
    },
    {
      title: "Chain-of-Thought: pensar passo a passo",
      show: ["cot_lbl", "p_cot", "o_cot", "cot_note"],
      highlight: ["p_cot", "o_cot"],
      balloon: { anchor: "p_cot", placement: "right",
        text: "<strong>Chain-of-Thought (CoT)</strong>: instruir o modelo a mostrar o raciocínio antes da resposta. Simples como adicionar \"Pense passo a passo\" ou mostrar um exemplo com etapas de raciocínio.",
        why: "CoT melhora dramaticamente a acurácia em matemática, lógica e multi-step reasoning. O modelo que 'pensa em voz alta' comete menos erros que o que pula direto à conclusão." },
    },
    {
      title: "Role prompting: definir um papel",
      show: ["role_lbl", "p_role", "o_role"],
      highlight: ["p_role"],
      balloon: { anchor: "p_role", placement: "right",
        text: "<strong>Role Prompting</strong>: atribuir uma persona ou papel ao modelo. \"Você é um sênior de segurança\" ativa conhecimento e estilo de raciocínio específico do domínio.",
        why: "Personas eficazes são específicas: 'sênior de segurança Python com foco em OWASP' é melhor que 'especialista'. A especificidade afunila o espaço de respostas." },
    },
    {
      title: "Especificar o formato de saída",
      show: ["fmt_lbl", "p_fmt", "o_fmt", "fmt_note"],
      highlight: ["p_fmt", "o_fmt"],
      balloon: { anchor: "p_fmt", placement: "right",
        text: "Dizer exatamente <strong>qual formato você quer</strong> (JSON, markdown, lista numerada, XML) evita pós-processamento. Use JSON Schema ou mostre um exemplo do formato esperado no próprio prompt.",
        why: "LLMs são otimizados para ser úteis, mas 'útil' é vago. Especificar o formato fecha o espaço de respostas válidas e torna a saída programaticamente processável." },
    },
    {
      title: "ReAct: Raciocinar + Agir",
      show: ["react_lbl", "p_react", "o_react", "react_note"],
      highlight: ["o_react"],
      balloon: { anchor: "o_react", placement: "left",
        text: "<strong>ReAct (Reason + Act)</strong>: o modelo alterna entre <em>Thought</em> (raciocínio), <em>Action</em> (chamada de ferramenta) e <em>Observation</em> (resultado). É a base dos agentes que usam tools.",
        why: "ReAct é mais confiável que agentes que agem sem raciocinar: o Thought explica a lógica da Action, permitindo detectar erros antes de executar e auditar o processo depois." },
    },
    {
      title: "XML tags para estrutura e delimitação",
      show: ["xml_lbl", "p_xml", "o_xml", "xml_note"],
      highlight: ["p_xml"],
      balloon: { anchor: "p_xml", placement: "right",
        text: "<strong>XML Tags</strong> como <code>&lt;task&gt;</code>, <code>&lt;context&gt;</code>, <code>&lt;format&gt;</code> delimitam cada parte do prompt, evitando que o modelo confunda instrução com dado de entrada.",
        why: "Claude e outros modelos são treinados para entender e respeitar XML tags. Elas tornam o prompt modular: é fácil trocar só o contexto sem reescrever as instruções." },
    },
    {
      title: "Anti-padrões: o que evitar",
      show: ["anti_box", "anti_lbl",
             "a1_b", "a2_b", "a3_b",
             "a1_a", "a2_a", "a3_a",
             "a1_g", "a2_g", "a3_g"],
      highlight: ["a1_g", "a2_g", "a3_g"],
      balloon: { anchor: "anti_lbl", placement: "bottom",
        text: "Os três anti-padrões mais comuns: <strong>ambiguidade</strong> (tarefa vaga), <strong>excesso de restrições negativas</strong> (dizer o que não quer em vez do que quer) e <strong>prompt monolítico</strong> sem estrutura.",
        why: "Prompts negativos (\"não faça X\") são menos eficazes que positivos (\"faça Y\"). O modelo precisa imaginar X para evitá-lo — e às vezes acaba fazendo mesmo." },
      enter: (ctx) => {
        ["a1_b","a2_b","a3_b"].forEach((id, i) => setTimeout(() => ctx.show(id), i * 100));
        setTimeout(() => {
          ["a1_a","a2_a","a3_a"].forEach((id, i) => setTimeout(() => ctx.drawArrow(id), i * 100));
        }, 400);
        setTimeout(() => {
          ["a1_g","a2_g","a3_g"].forEach((id, i) => setTimeout(() => ctx.show(id), i * 100));
        }, 700);
      },
    },
    {
      title: "Quiz rápido",
      balloon: { anchor: { x: 640, y: 360 }, placement: "bottom",
        text: "Confirme o que você aprendeu sobre Prompt Engineering 👇" },
      quiz: {
        question: "Por que Chain-of-Thought (CoT) melhora a acurácia em tarefas de raciocínio?",
        options: [
          "Porque usa mais tokens, o que faz o modelo 'pensar mais'",
          "Porque o raciocínio explícito reduz atalhos e força o modelo a validar cada passo antes de concluir",
          "Porque instrui o modelo a usar ferramentas externas para calcular",
          "Porque permite ao modelo ignorar exemplos incorretos no few-shot",
        ],
        answer: 1,
        explain: "CoT funciona porque o raciocínio explícito cria uma 'cadeia de verificação': cada etapa se apoia na anterior. Erros são detectados antes de se propagar à conclusão, o que não acontece quando o modelo pula direto à resposta.",
      },
    },
    {
      title: "Resumo: técnicas de Prompt Engineering",
      highlight: ["llm_box"],
      balloon: { anchor: "llm_box", placement: "right",
        text: "Técnicas em ordem crescente de complexidade: <strong>Zero-shot → Few-shot → CoT → Role → Formato → ReAct → XML</strong>. Comece simples e adicione complexidade só se necessário. Itere, avalie e meça.",
        why: "A melhor técnica depende da tarefa: CoT para raciocínio, few-shot para formatos específicos, ReAct para agentes com tools. Combine-as — não são exclusivas." },
      enter: (ctx) => ctx.pulse("llm_box", true),
    },
  ];

  window.PROMPT_ENG_DIAGRAM = {
    title: "Engenharia de Prompt",
    subtitle: "Zero-shot, Few-shot, CoT, ReAct e boas práticas",
    width: W, height: H, autoplayMs: 9000, elements, steps,
  };
})();
