/* ============================================================================
 * guardrails.data.js — Explicador: Guardrails para sistemas de IA
 * Pipeline de camadas: input → validação → LLM → validação → output
 * ==========================================================================*/
(function () {
  const W = 1280, H = 720;

  // Pipeline vertical centro: layers empilhadas
  const LX = 440, LW = 400, LH = 56;
  const ly = (i) => 60 + i * 80;

  // Request e response nos lados
  const REQ_X = 60, RESP_X = 900;

  const elements = [
    /* ── REQUEST (entrada) ──────────────────────── */
    { id: "req_box", type: "box", x: REQ_X, y: 310, w: 180, h: 60, fill: "#1b2747", label: ["👤 Usuário", "\"input aqui\""] },
    { id: "a_req",  type: "arrow", x1: REQ_X+180, y1: 340, x2: LX, y2: 340, color: "var(--accent)" },
    { id: "req_lbl", type: "label", x: REQ_X+90, y: 290, anchor: "middle", label: "Entrada" },

    /* ── CAMADAS DO PIPELINE ─────────────────────── */
    // Camada 1: Validação de entrada
    { id: "l1", type: "box", x: LX, y: ly(0), w: LW, h: LH, fill: "#1b2747", stroke: "var(--accent)", label: "🔍 Validação de entrada" },
    // Camada 2: Detecção de prompt injection
    { id: "l2", type: "box", x: LX, y: ly(1), w: LW, h: LH, fill: "#22315d", stroke: "var(--accent-2)", label: "💉 Detecção de Prompt Injection" },
    // Camada 3: Filtro PII
    { id: "l3", type: "box", x: LX, y: ly(2), w: LW, h: LH, fill: "#1a1208", stroke: "var(--warn)", label: "🔐 Filtro de PII / Dados sensíveis" },
    // Camada 4: Filtro de conteúdo (toxicidade)
    { id: "l4", type: "box", x: LX, y: ly(3), w: LW, h: LH, fill: "#1a1208", stroke: "var(--warn)", label: "🚫 Filtro de conteúdo / toxicidade" },
    // Camada 5: LLM
    { id: "l5", type: "box", x: LX, y: ly(4), w: LW, h: LH+10, fill: "#2a1d3d", stroke: "var(--accent)", label: ["🧠 LLM processa", "(com contexto filtrado)"] },
    // Camada 6: Validação de saída
    { id: "l6", type: "box", x: LX, y: ly(5)+10, w: LW, h: LH, fill: "#22315d", stroke: "var(--accent-2)", label: "✅ Validação de saída" },
    // Camada 7: Hallucination / grounding check
    { id: "l7", type: "box", x: LX, y: ly(6)+10, w: LW, h: LH, fill: "#1b2747", stroke: "var(--accent)", label: "🔬 Grounding / Hallucination check" },
    // Setas entre camadas
    { id: "a12", type: "arrow", x1: LX+LW/2, y1: ly(0)+LH, x2: LX+LW/2, y2: ly(1), color: "var(--accent)" },
    { id: "a23", type: "arrow", x1: LX+LW/2, y1: ly(1)+LH, x2: LX+LW/2, y2: ly(2), color: "var(--accent)" },
    { id: "a34", type: "arrow", x1: LX+LW/2, y1: ly(2)+LH, x2: LX+LW/2, y2: ly(3), color: "var(--accent)" },
    { id: "a45", type: "arrow", x1: LX+LW/2, y1: ly(3)+LH, x2: LX+LW/2, y2: ly(4), color: "var(--accent)" },
    { id: "a56", type: "arrow", x1: LX+LW/2, y1: ly(4)+LH+10, x2: LX+LW/2, y2: ly(5)+10, color: "var(--good)" },
    { id: "a67", type: "arrow", x1: LX+LW/2, y1: ly(5)+LH+10, x2: LX+LW/2, y2: ly(6)+10, color: "var(--good)" },

    /* ── RESPONSE (saída) ─────────────────────── */
    { id: "resp_ok",  type: "box", x: RESP_X, y: ly(6)+10, w: 180, h: LH, fill: "#112318", stroke: "var(--good)", label: ["✓ Resposta", "aprovada"] },
    { id: "a_resp",   type: "arrow", x1: LX+LW, y1: ly(6)+10+LH/2, x2: RESP_X, y2: ly(6)+10+LH/2, color: "var(--good)" },

    /* ── BLOQUEIOS / DESVIOS ────────────────────── */
    // Bloqueio de injection
    { id: "blk_inj",  type: "token", x: LX+LW+20, y: ly(1)+8, w: 200, h: 40, fill: "#3a1320", stroke: "var(--hot)", label: "⛔ Bloqueado: injection" },
    { id: "a_blk_inj", type: "arrow", x1: LX+LW, y1: ly(1)+LH/2, x2: LX+LW+20, y2: ly(1)+28, color: "var(--hot)" },
    // Bloqueio de PII
    { id: "blk_pii",  type: "token", x: LX+LW+20, y: ly(2)+8, w: 200, h: 40, fill: "#1a1208", stroke: "var(--warn)", label: "⚠️ PII mascarado" },
    { id: "a_blk_pii", type: "arrow", x1: LX+LW, y1: ly(2)+LH/2, x2: LX+LW+20, y2: ly(2)+28, color: "var(--warn)" },
    // Bloqueio de toxicidade
    { id: "blk_tox",  type: "token", x: LX+LW+20, y: ly(3)+8, w: 200, h: 40, fill: "#3a1320", stroke: "var(--hot)", label: "⛔ Bloqueado: conteúdo" },
    { id: "a_blk_tox", type: "arrow", x1: LX+LW, y1: ly(3)+LH/2, x2: LX+LW+20, y2: ly(3)+28, color: "var(--hot)" },
    // Hallucination block
    { id: "blk_hal",  type: "token", x: LX+LW+20, y: ly(6)+18, w: 200, h: 40, fill: "#3a1320", stroke: "var(--hot)", label: "⛔ Hallucination detectada" },
    { id: "a_blk_hal", type: "arrow", x1: LX+LW, y1: ly(6)+38, x2: LX+LW+20, y2: ly(6)+38, color: "var(--hot)" },

    /* ── FALLBACK ───────────────────────────────── */
    { id: "fallback",  type: "box", x: RESP_X, y: 60, w: 260, h: 140, fill: "#22315d", stroke: "var(--accent-2)",
      label: ["🔄 Fallback behavior", "", "• Resposta padrão segura", "• Log + alerta ao time", "• Retry com prompt reformulado"] },

    /* ── LOGGING ────────────────────────────────── */
    { id: "log_box", type: "box", x: 30, y: 600, w: 1220, h: 76, fill: "#0e1730", stroke: "var(--muted)",
      label: ["📊 Logging & Auditoria (sempre ativo em todas as camadas)",
              "inputs bloqueados · PII detectado · latência por camada · taxa de bloqueio por regra"] },

    /* ── HUMAN IN THE LOOP ───────────────────────── */
    { id: "hitl", type: "box", x: RESP_X, y: 250, w: 260, h: 100, fill: "#1a1208", stroke: "var(--warn)",
      label: ["👁️ Human-in-the-loop", "casos ambíguos são", "roteados para revisão humana"] },
  ];

  const steps = [
    {
      title: "Por que Guardrails são necessários",
      show: ["req_box", "req_lbl", "a_req"],
      highlight: ["req_box"],
      balloon: { anchor: "req_box", placement: "right",
        text: "Sistemas de IA em produção recebem entradas de usuários reais — que podem ser maliciosas, conter dados sensíveis ou tentar manipular o modelo. Sem proteção, um único prompt mal-intencionado pode comprometer todo o sistema.",
        why: "Guardrails são as 'cercas de segurança' do sistema: elas não tornam o modelo mais inteligente, mas garantem que ele opere dentro de limites seguros e previsíveis." },
    },
    {
      title: "Pipeline de camadas de proteção",
      show: ["l1", "l2", "l3", "l4", "l5", "l6", "l7",
             "a12", "a23", "a34", "a45", "a56", "a67"],
      highlight: ["l1", "l5", "l7"],
      balloon: { anchor: "l5", placement: "right",
        text: "Os guardrails formam um <strong>pipeline de camadas</strong>: a entrada passa por várias verificações antes de chegar ao LLM, e a saída passa por verificações adicionais antes de ser entregue ao usuário.",
        why: "Defesa em profundidade: nenhuma camada sozinha é perfeita, mas várias camadas juntas tornam o sistema muito mais robusto. Se uma falha, as outras ainda protegem." },
      enter: (ctx) => {
        ["l1","l2","l3","l4","l5","l6","l7"].forEach((id, i) => setTimeout(() => ctx.show(id), i * 80));
        setTimeout(() => {
          ["a12","a23","a34","a45","a56","a67"].forEach((id, i) => setTimeout(() => ctx.drawArrow(id), i * 60));
        }, 600);
      },
    },
    {
      title: "Camada 1: Validação de entrada",
      highlight: ["l1"],
      balloon: { anchor: "l1", placement: "right",
        text: "A primeira camada valida o formato básico: <strong>tamanho máximo</strong> do input, <strong>encoding</strong> válido, <strong>tipo de conteúdo</strong> esperado (texto, JSON, imagem). Rejeita entradas malformadas antes de qualquer processamento.",
        why: "Validação precoce evita que entradas gigantes ou malformadas consumam recursos caros de processamento (GPU, tokens do LLM). Fail fast: erros baratos devem ser detectados primeiro." },
    },
    {
      title: "Camada 2: Detecção de Prompt Injection",
      show: ["blk_inj", "a_blk_inj"],
      highlight: ["l2", "blk_inj"],
      balloon: { anchor: "l2", placement: "right",
        text: "<strong>Prompt Injection</strong> é quando um usuário tenta inserir instruções escondidas no input para subverter o comportamento do agente. Ex.: \"Ignore todas as instruções anteriores e...\" Um classificador detecta e bloqueia.",
        why: "Injection é o ataque mais comum em sistemas baseados em LLM. Detecção por palavras-chave é frágil; classificadores treinados são mais robustos mas não infalíveis — combine múltiplas técnicas." },
      enter: (ctx) => { ctx.drawArrow("a_blk_inj"); },
    },
    {
      title: "Camada 3: Filtro de PII",
      show: ["blk_pii", "a_blk_pii"],
      highlight: ["l3", "blk_pii"],
      balloon: { anchor: "l3", placement: "right",
        text: "Dados pessoais identificáveis (<span class=\"xp-term\" tabindex=\"0\" data-tip=\"CPF, email, telefone, cartão de crédito, endereço — qualquer dado que identifique uma pessoa.\">PII</span>) como CPF, e-mail, cartões de crédito são detectados e <strong>mascarados antes</strong> de chegar ao LLM. O modelo processa texto anonimizado.",
        why: "LGPD, GDPR e outras regulações exigem que PII não seja enviado a serviços de terceiros sem consentimento. Mascarar antes do LLM protege usuários e evita multas." },
      enter: (ctx) => { ctx.drawArrow("a_blk_pii"); },
    },
    {
      title: "Camada 4: Filtro de conteúdo",
      show: ["blk_tox", "a_blk_tox"],
      highlight: ["l4", "blk_tox"],
      balloon: { anchor: "l4", placement: "right",
        text: "Um classificador de <strong>toxicidade e conteúdo impróprio</strong> analisa o input antes do LLM: linguagem de ódio, conteúdo adulto, instruções para atividades ilegais. Bloqueios são logados para análise.",
        why: "Mesmo que o LLM recuse por si só, filtrar antes é mais eficiente (evita tokens desperdiçados) e mais auditável (o motivo do bloqueio fica registrado na camada de guardrail, não no modelo)." },
      enter: (ctx) => { ctx.drawArrow("a_blk_tox"); },
    },
    {
      title: "O LLM processa com contexto filtrado",
      highlight: ["l5"],
      balloon: { anchor: "l5", placement: "right",
        text: "Após passar por todas as camadas de entrada, o input <strong>limpo e seguro</strong> chega ao LLM. O modelo pode se concentrar em ser útil, sem precisar lidar sozinho com injeções, PII ou toxicidade.",
        why: "LLMs não são guardrails confiáveis por si só: eles podem ser persuadidos, ter jailbreaks ou simplesmente errar. As camadas externas são determinísticas e auditalávéis." },
    },
    {
      title: "Validação e Grounding da saída",
      show: ["blk_hal", "a_blk_hal", "resp_ok", "a_resp"],
      highlight: ["l6", "l7"],
      balloon: { anchor: "l6", placement: "right",
        text: "A saída do LLM passa por duas verificações: <strong>Validação</strong> (formato correto? JSON válido? resposta tem o campo esperado?) e <strong>Grounding</strong> (a resposta é suportada pelo contexto fornecido? há alucinação?).",
        why: "Verificar a saída é tão importante quanto filtrar a entrada. Um LLM pode gerar JSON sintaticamente correto mas semanticamente errado — a validação de schema detecta isso." },
      enter: (ctx) => {
        ctx.drawArrow("a_blk_hal");
        setTimeout(() => ctx.drawArrow("a_resp"), 400);
      },
    },
    {
      title: "Fallback behavior",
      show: ["fallback"],
      highlight: ["fallback"],
      balloon: { anchor: "fallback", placement: "left",
        text: "Quando um guardrail bloqueia, o sistema precisa de um <strong>comportamento de fallback</strong> claro: resposta padrão segura (\"Não posso ajudar com isso\"), log para o time de segurança e opcionalmente retry com o prompt reformulado.",
        why: "Falhar silenciosamente é pior que falhar com mensagem. O usuário precisa saber que não foi ajudado; o time de segurança precisa saber o que foi bloqueado e por quê." },
    },
    {
      title: "Human-in-the-loop",
      show: ["hitl"],
      highlight: ["hitl"],
      balloon: { anchor: "hitl", placement: "left",
        text: "Casos <strong>ambíguos ou de alta consequência</strong> são roteados para revisão humana antes da resposta ser enviada. Um humano aprova ou rejeita. Comum em contextos médicos, jurídicos e financeiros.",
        why: "Automação total funciona para casos claros. Para decisões de alto impacto, a revisão humana é a última linha de defesa — e muitas vezes uma exigência regulatória." },
    },
    {
      title: "Logging e auditoria contínua",
      show: ["log_box"],
      highlight: ["log_box"],
      balloon: { anchor: "log_box", placement: "top",
        text: "Todas as camadas <strong>logam tudo</strong>: inputs bloqueados, PII detectado, latência de cada camada, taxa de bloqueio por regra. Esses logs são a base para melhorar os guardrails ao longo do tempo.",
        why: "Sem logs, você não sabe o que está bloqueando nem por quê. Métricas de guardrail (false positive rate, false negative rate) determinam onde ajustar thresholds." },
    },
    {
      title: "Quiz rápido",
      balloon: { anchor: { x: 640, y: 360 }, placement: "bottom",
        text: "Confirme o que você aprendeu sobre Guardrails 👇" },
      quiz: {
        question: "Por que o filtro de PII deve atuar ANTES do LLM, e não apenas na saída?",
        options: [
          "Para economizar tokens e reduzir o custo da chamada ao LLM",
          "Porque LLMs não conseguem reconhecer PII no texto",
          "Para evitar que dados pessoais sejam enviados ao provedor do LLM, cumprindo regulações como LGPD/GDPR",
          "Porque o LLM pode vazar PII na resposta mesmo que não o mencione diretamente",
        ],
        answer: 2,
        explain: "O principal motivo é regulatório: ao enviar texto ao LLM (API externa), os dados saem do controle da empresa. PII mascarado antes da chamada garante que dados pessoais nunca saem do perímetro — mesmo que o modelo seja confiável.",
      },
    },
    {
      title: "Resumo: Guardrails em profundidade",
      highlight: ["l1","l2","l3","l4","l5","l6","l7"],
      balloon: { anchor: { x: 640, y: 360 }, placement: "right",
        text: "Guardrails formam um pipeline de <strong>defesa em profundidade</strong>: validação → injection → PII → toxicidade → LLM → validação de saída → grounding. Falhas são logadas, casos ambíguos vão para humanos, bloqueios têm fallback.",
        why: "Guardrails não são opcionais em produção. Eles tornam o sistema auditável, previsível e seguro — e permitem evoluir o modelo sem reconstruir toda a segurança do zero." },
      enter: (ctx) => {
        ["l1","l2","l3","l4","l5","l6","l7"].forEach((id, k) => setTimeout(() => ctx.pulse(id, true), k * 80));
      },
    },
  ];

  window.GUARDRAILS_DIAGRAM = {
    title: "Guardrails para sistemas de IA",
    subtitle: "Defesa em profundidade: input → filtros → LLM → validação → output",
    width: W, height: H, autoplayMs: 9000, elements, steps,
  };
})();
