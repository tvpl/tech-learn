/* ============================================================================
 * ingles-nivel-b1.data.js — Teste de Nível B1 (Intermediário / CEFR)
 * Avaliação de gramática e vocabulário do nível B1: passado, present perfect,
 * futuro, comparativos, 1º condicional, modais e phrasal verbs comuns.
 * Serve de TEMPLATE para os testes B2/C1/C2. Cada cena é uma bateria de
 * exercícios variados com feedback imediato.
 * ==========================================================================*/
(function () {
  const W = 1200, H = 760;

  const A = "var(--accent)", G = "var(--good)", Wr = "var(--warn)", A2 = "var(--accent-2)", Ht = "var(--hot)", M = "var(--muted)";

  // escada CEFR: A1 A2 B1 B2 C1 C2 (B1 destacado)
  const LEVELS = [["A1", M], ["A2", M], ["B1", A], ["B2", M], ["C1", M], ["C2", M]];
  const LAD_Y = 96, CELL_W = 176, CELL_H = 74, LAD_X = 40, GAP = 16;
  const ladder = LEVELS.flatMap(([lvl, color], i) => {
    const x = LAD_X + i * (CELL_W + GAP);
    const active = lvl === "B1";
    return [
      { id: `lv_${lvl}`, type: "box", x, y: LAD_Y, w: CELL_W, h: CELL_H, rx: 10, fill: color,
        style: active ? `opacity:0.9` : "opacity:0.12", base: true },
      { id: `lv_${lvl}_t`, type: "label", x: x + CELL_W / 2, y: LAD_Y + CELL_H / 2 - 6, anchor: "middle", label: lvl,
        style: `font-size:20px;font-weight:800;fill:${active ? "#fff" : color}`, base: true },
      { id: `lv_${lvl}_s`, type: "label", x: x + CELL_W / 2, y: LAD_Y + CELL_H / 2 + 16, anchor: "middle",
        label: active ? "você está aqui" : "", style: "font-size:10px;fill:#fff", base: true },
    ];
  });

  // trilho de tópicos (chips) — destacados por cena
  const TOPICS = [
    ["Passado", A], ["Present Perfect", G], ["Futuro", Wr], ["Comparativos", A2],
    ["Condicional 1º", Ht], ["Modais", A], ["Phrasal Verbs", G], ["Vocabulário", A2],
  ];
  const TOP_Y = 232, TCHIP_W = 176, TGAP = 16, TCOLS = 4;
  const topicChips = TOPICS.flatMap(([name, color], i) => {
    const col = i % TCOLS, row = Math.floor(i / TCOLS);
    const x = LAD_X + col * (TCHIP_W + TGAP), y = TOP_Y + row * 60;
    return [
      { id: `tp_${i}`, type: "token", x, y, w: TCHIP_W, h: 44, rx: 22, fill: color, style: `opacity:0.14;stroke:${color};stroke-width:1.5` },
      { id: `tp_${i}_t`, type: "label", x: x + TCHIP_W / 2, y: y + 26, anchor: "middle", label: name,
        style: `font-size:12px;font-weight:600;fill:${color}` },
    ];
  });

  const banner = [
    { id: "bn", type: "box", x: 40, y: 372, w: 1120, h: 92, rx: 12, fill: A, style: "opacity:0.08", base: true },
    { id: "bn_t", type: "label", x: 600, y: 404, anchor: "middle", label: "Teste de Nível B1 — Intermediário",
      style: "font-size:18px;font-weight:800;fill:var(--accent)", base: true },
    { id: "bn_s", type: "label", x: 600, y: 434, anchor: "middle",
      label: "Responda cada bateria. Feedback na hora. Acertou a maioria? Você está sólido no B1.",
      style: "font-size:12.5px;fill:var(--ink-soft)", base: true },
  ];

  const elements = [...ladder, ...topicChips, ...banner];

  const topic = (i) => [`tp_${i}`, `tp_${i}_t`];

  // ---- MATERIAIS ANEXOS ----
  const cefrMaterial = `
<p>O <strong>CEFR</strong> é a escala europeia de proficiência, de A1 (iniciante) a C2 (quase nativo).</p>
<table class="xp-tbl">
<thead><tr><th>Nível</th><th>O que você consegue fazer</th></tr></thead>
<tbody>
<tr><td><strong>A1</strong></td><td>Frases básicas, se apresentar, pedir o essencial.</td></tr>
<tr><td><strong>A2</strong></td><td>Rotina, compras, passado simples, descrições curtas.</td></tr>
<tr><td><strong>B1</strong></td><td>Lidar com viagens, dar opinião, contar histórias, present perfect, condicionais reais.</td></tr>
<tr><td><strong>B2</strong></td><td>Conversar com fluidez, argumentar, entender textos complexos.</td></tr>
<tr><td><strong>C1</strong></td><td>Uso flexível e eficaz, nuances, linguagem acadêmica/profissional.</td></tr>
<tr><td><strong>C2</strong></td><td>Domínio quase nativo, ironia e sutilezas.</td></tr>
</tbody></table>
<p class="xp-tip">💡 B1 é o ponto em que você “se vira” em inglês no dia a dia. Este teste cobre exatamente esse limiar.</p>`;

  const b1Material = `
<p>Checklist de gramática que um <strong>B1</strong> domina — revise antes/depois do teste.</p>
<div class="xp-example"><strong>Passado</strong>Simple Past (regular + irregular), Past Continuous, used to.</div>
<div class="xp-example"><strong>Present Perfect</strong>ever/never, already/yet/just, for/since.</div>
<div class="xp-example"><strong>Futuro</strong>will (decisão/previsão) × going to (plano) × present continuous (agenda).</div>
<div class="xp-example"><strong>Comparativos</strong>-er / more, as…as, the most.</div>
<div class="xp-example"><strong>Condicional 1º</strong>if + presente, will.</div>
<div class="xp-example"><strong>Modais</strong>should, have to, must, can/could.</div>`;

  const materials = [
    { id: "cefr", icon: "🪜", label: "O que é o CEFR (A1→C2)", html: cefrMaterial },
    { id: "b1", icon: "✅", label: "Checklist de gramática B1", html: b1Material },
  ];

  const steps = [
    {
      title: "Teste de Nível B1",
      balloon: { anchor: "lv_B1", placement: "bottom",
        text: "Bem-vindo ao <strong>teste de nível B1</strong> (intermediário na escala CEFR). São baterias de exercícios variados com correção imediata.",
        why: "B1 é o nível em que você já “se vira” no dia a dia: viagem, opinião, histórias no passado e planos. Este teste mede exatamente esse limiar.",
        deep: cefrMaterial, deepTitle: "A escala CEFR" },
    },
    {
      title: "Bateria 1 — Passado",
      highlight: topic(0),
      balloon: { anchor: "tp_0", placement: "bottom", text: "Passado simples e contínuo. 👇" },
      exercises: [
        { kind: "fill", prompt: "Passado de “go”:", sentence: "Yesterday I ___ to the beach.", answer: "went",
          explain: "“go” é irregular: went. Yesterday força o passado simples." },
        { kind: "choice", question: "Escolha:", options: ["While I slept, the phone rang.", "While I was sleeping, the phone rang.", "While I sleeping, the phone rang."], answer: 1,
          explain: "Ação em andamento no passado = Past Continuous: “While I was sleeping…”." },
        { kind: "order", prompt: "Ordene:", answer: ["they", "didn't", "watch", "the", "movie"],
          explain: "Negativa no passado: didn't + verbo base. “They didn't watch the movie.”" },
      ],
    },
    {
      title: "Bateria 2 — Present Perfect",
      highlight: topic(1),
      balloon: { anchor: "tp_1", placement: "bottom", text: "Experiência, for/since e already/yet. 👇" },
      exercises: [
        { kind: "fill", prompt: "for ou since?", sentence: "I've studied English ___ 2019.", answer: "since",
          options: ["for", "since"], explain: "2019 é ponto de partida → since." },
        { kind: "choice", question: "Escolha:", options: ["Have you ever been to London?", "Did you ever been to London?", "Have you ever go to London?"], answer: 0,
          explain: "Experiência de vida: Have + sujeito + particípio. “Have you ever been to London?”" },
        { kind: "match", prompt: "Ligue:", pairs: [["already", "já (afirmativa)"], ["yet", "ainda (pergunta/negativa)"], ["just", "acabou de"]],
          explain: "Advérbios clássicos do Present Perfect." },
      ],
    },
    {
      title: "Bateria 3 — Futuro",
      highlight: topic(2),
      balloon: { anchor: "tp_2", placement: "bottom", text: "will × going to × present continuous. 👇" },
      exercises: [
        { kind: "choice", question: "Decisão espontânea (agora):", options: ["I'll help you.", "I'm going to help you.", "I help you."], answer: 0,
          explain: "Decisão na hora = will: “I'll help you.”" },
        { kind: "choice", question: "Plano já decidido:", options: ["I'll travel next month.", "I'm going to travel next month.", "I travel next month."], answer: 1,
          explain: "Plano/intenção = going to: “I'm going to travel next month.”" },
        { kind: "fill", prompt: "Complete (previsão):", sentence: "I think it ___ rain tomorrow.", answer: "will",
          options: ["will", "is going", "goes"], explain: "Previsão/opinião com “I think” → will." },
      ],
    },
    {
      title: "Bateria 4 — Comparativos & Modais",
      highlight: [...topic(3), ...topic(5)],
      balloon: { anchor: "tp_3", placement: "bottom", text: "Comparar e aconselhar/obrigar. 👇" },
      exercises: [
        { kind: "fill", prompt: "Comparativo:", sentence: "This book is ___ than the other one. (good)", answer: "better",
          explain: "Comparativo irregular: good → better." },
        { kind: "order", prompt: "Ordene:", answer: ["you", "should", "see", "a", "doctor"],
          explain: "Conselho com should + verbo base: “You should see a doctor.”" },
        { kind: "choice", question: "Obrigação:", options: ["I must to go now.", "I have to go now.", "I have go now."], answer: 1,
          explain: "“have to + verbo base” (sem “to” extra em “must”). “I have to go now.”" },
      ],
    },
    {
      title: "Bateria 5 — Condicional & Phrasal Verbs",
      highlight: [...topic(4), ...topic(6)],
      balloon: { anchor: "tp_4", placement: "top", text: "1º condicional e phrasal verbs de B1. 👇" },
      exercises: [
        { kind: "fill", prompt: "1º condicional:", sentence: "If it rains, we ___ stay home.", answer: "will",
          options: ["will", "would", "are"], explain: "if + presente, will: “If it rains, we will stay home.”" },
        { kind: "match", prompt: "Ligue phrasal ↔ sentido:", pairs: [["give up", "desistir"], ["find out", "descobrir"], ["look for", "procurar"], ["turn on", "ligar (aparelho)"]],
          explain: "Phrasal verbs de altíssima frequência no B1." },
        { kind: "choice", question: "“Please ___ the light, it's dark.”", options: ["turn on", "turn off", "give up"], answer: 0,
          explain: "turn on = ligar (luz/aparelho)." },
      ],
    },
    {
      title: "Bateria 6 — Vocabulário em contexto",
      highlight: topic(7),
      balloon: { anchor: "tp_7", placement: "top", text: "Palavra certa no contexto certo. 👇" },
      exercises: [
        { kind: "choice", question: "“I'd like to ___ a reservation.”", options: ["do", "make", "take"], answer: 1,
          explain: "Collocation fixa: make a reservation (não “do”)." },
        { kind: "fill", prompt: "Complete:", sentence: "Can you ___ me a favor?", answer: "do",
          options: ["do", "make", "give"], explain: "Collocation fixa: do someone a favor." },
        { kind: "flashcards", prompt: "Collocations comuns:", cards: [
          { front: "___ a decision", back: "<strong>make</strong> a decision" },
          { front: "___ a mistake", back: "<strong>make</strong> a mistake" },
          { front: "___ homework", back: "<strong>do</strong> homework" },
          { front: "___ a shower", back: "<strong>take / have</strong> a shower" },
        ] },
      ],
    },
    {
      title: "Resultado & próximo passo",
      balloon: { anchor: "lv_B2", placement: "bottom",
        text: "Acertou a maioria das baterias? Você está <strong>sólido no B1</strong> e pronto para atacar o <strong>B2</strong>. Errou várias de um tópico? Volte no explicador correspondente.",
        why: "Aprendizado por avaliação (testing effect): errar e corrigir aqui fixa mais do que reler. Refaça o teste em alguns dias (spaced repetition).",
        deep: b1Material, deepTitle: "Checklist B1 para revisar" },
      quiz: {
        question: "Autoavaliação: qual é o foco do nível B1?",
        options: ["Só se apresentar e cumprimentar", "Se virar no dia a dia: opinião, passado, planos, condicionais reais", "Escrever artigos acadêmicos com nuances"],
        answer: 1,
        explain: "B1 é o intermediário: você se vira em situações cotidianas. Nuances acadêmicas são C1/C2." },
    },
  ];

  window.INGLES_NIVEL_B1_DIAGRAM = {
    title: "Teste de Nível B1 (Intermediário)",
    subtitle: "Avaliação CEFR: passado, present perfect, futuro, comparativos, condicional e modais",
    width: W, height: H, autoplayMs: 12000, materials, elements, steps,
  };
})();
