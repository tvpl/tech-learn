/* ============================================================================
 * ingles-condicionais.data.js — Explicador: Condicionais (If Clauses)
 * Real, futuro provável, hipotético e arrependimento — sem decorar
 * nomenclatura acadêmica. Conecta com shoulda/coulda/woulda (Modais).
 * ==========================================================================*/
(function () {
  const W = 1280, H = 1050;

  const chunkCard = (id, x, y, w, h, phrase, meaning, color) => [
    { id: id + "_box", type: "token", x, y, w, h, rx: 10, fill: color, style: `opacity:0.14;stroke:${color};stroke-width:1.5` },
    { id: id + "_ph", type: "label", x: x + w / 2, y: y + h / 2 - 14, anchor: "middle", label: phrase, mono: true,
      style: `font-size:15px;font-weight:700;fill:${color}` },
    { id: id + "_mn", type: "label", x: x + w / 2, y: y + h / 2 + 18, anchor: "middle", label: meaning,
      style: "font-size:11px;fill:var(--ink-soft)" },
  ];

  // variante de 2 linhas — separa a oração "if" do resultado, pra clareza gramatical
  const chunkCard2 = (id, x, y, w, h, phraseLine1, phraseLine2, meaning, color) => [
    { id: id + "_box", type: "token", x, y, w, h, rx: 10, fill: color, style: `opacity:0.14;stroke:${color};stroke-width:1.5` },
    { id: id + "_ph1", type: "label", x: x + w / 2, y: y + h / 2 - 22, anchor: "middle", label: phraseLine1, mono: true,
      style: `font-size:14px;font-weight:700;fill:${color}` },
    { id: id + "_ph2", type: "label", x: x + w / 2, y: y + h / 2 - 4, anchor: "middle", label: phraseLine2, mono: true,
      style: `font-size:14px;font-weight:700;fill:${color}` },
    { id: id + "_mn", type: "label", x: x + w / 2, y: y + h / 2 + 20, anchor: "middle", label: meaning,
      style: "font-size:10.5px;fill:var(--ink-soft)" },
  ];

  const CMP_LEFT_X = 100, CMP_RIGHT_X = 660, CMP_H = 90;
  const compareRow = (id, y, leftColor, leftTitle, leftText, rightColor, rightTitle, rightText, w = 520) => [
    { id: id + "_lbox", type: "box", x: CMP_LEFT_X, y, w, h: CMP_H, rx: 10, fill: leftColor, style: "opacity:0.12" },
    { id: id + "_lt", type: "label", x: CMP_LEFT_X + w / 2, y: y + 24, anchor: "middle", label: leftTitle,
      style: `font-size:11px;font-weight:700;fill:${leftColor};text-transform:uppercase;letter-spacing:1px` },
    { id: id + "_lx", type: "label", x: CMP_LEFT_X + w / 2, y: y + 54, anchor: "middle", label: leftText, mono: true,
      style: "font-size:12.5px;fill:var(--ink)" },
    { id: id + "_rbox", type: "box", x: CMP_RIGHT_X, y, w, h: CMP_H, rx: 10, fill: rightColor, style: "opacity:0.12" },
    { id: id + "_rt", type: "label", x: CMP_RIGHT_X + w / 2, y: y + 24, anchor: "middle", label: rightTitle,
      style: `font-size:11px;font-weight:700;fill:${rightColor};text-transform:uppercase;letter-spacing:1px` },
    { id: id + "_rx", type: "label", x: CMP_RIGHT_X + w / 2, y: y + 54, anchor: "middle", label: rightText, mono: true,
      style: "font-size:12.5px;fill:var(--ink)" },
  ];

  const elements = [
    // cena 1 — gancho: conecta com Modais
    ...compareRow("cond_hook", 130, "var(--muted)", "Já visto (Modais)", "“I shoulda called you.”",
      "var(--accent)", "Agora (Condicionais)", "“If I had called, this wouldn't have happened.”"),

    // cena 2 — condicional real (sempre verdade)
    ...chunkCard("cond_real", 100, 260, 1080, 100, "If you heat ice, it melts.", "sempre verdade — if + presente, presente", "var(--accent)"),

    // cena 3 — futuro provável
    ...chunkCard("cond_future", 100, 390, 1080, 100, "If it rains, I'll stay home.", "futuro provável — if + presente, will", "var(--good)"),

    // cena 4 — hipotético/improvável
    ...chunkCard2("cond_hyp", 100, 520, 1080, 110, "If I were you,", "I would talk to her.",
      "hipotético/improvável — if + passado, would (“were” pra todos os pronomes)", "var(--accent-2)"),

    // cena 5 — passado/arrependimento
    ...chunkCard2("cond_regret", 100, 650, 1080, 110, "If I had known,", "I would have called.",
      "arrependimento — if + past perfect, would have (conecta com Present Perfect)", "var(--hot)"),

    // cena 6 — contração ambígua "I'd"
    ...compareRow("cond_apostrophe", 780, "var(--accent)", "'d = would", "“I'd go if I could.”",
      "var(--warn)", "'d = had", "“I'd already left when she called.”"),

    // cena 7 — reforço com shoulda/coulda/woulda
    ...chunkCard("cond_reinforce", 100, 910, 1080, 100, "I woulda helped you if you'd asked.",
      "fecha o ciclo com a lição de Modais (shoulda/coulda/woulda)", "var(--warn)"),
  ];

  // ---- MATERIAIS ANEXOS ----
  const patternsTable = `
<p>Os 4 condicionais como <strong>fórmulas fixas</strong>. Decore o padrão, não o nome acadêmico.</p>
<table class="xp-tbl">
<thead><tr><th>Tipo</th><th>Fórmula</th><th>Exemplo</th></tr></thead>
<tbody>
<tr><td><strong>Real (zero)</strong></td><td>if + presente, <b>presente</b></td><td>If you heat ice, it melts.</td></tr>
<tr><td><strong>Futuro (1º)</strong></td><td>if + presente, <b>will</b></td><td>If it rains, I'll stay home.</td></tr>
<tr><td><strong>Hipotético (2º)</strong></td><td>if + passado, <b>would</b></td><td>If I were you, I would call her.</td></tr>
<tr><td><strong>Arrependimento (3º)</strong></td><td>if + past perfect, <b>would have</b></td><td>If I had known, I would have called.</td></tr>
</tbody></table>
<p class="xp-tip">💡 Quanto mais “irreal” a condição, mais “pra trás” vai o tempo do verbo: presente → passado → past perfect.</p>`;

  const errorsMaterial = `
<h4>Erros clássicos de brasileiro (evite/prefira)</h4>
<div class="xp-bad"><strong>If I will have time, I'll call.</strong> — não use “will” depois de if.</div>
<div class="xp-good"><strong>If I have time, I'll call.</strong> — if leva o presente; o “will” fica no resultado.</div>
<div class="xp-bad"><strong>If I was you…</strong> — em conselho hipotético soa errado.</div>
<div class="xp-good"><strong>If I were you…</strong> — “were” pra todos os pronomes.</div>
<div class="xp-bad"><strong>If I would have known…</strong> — não use “would” na oração if.</div>
<div class="xp-good"><strong>If I had known…</strong> — a oração if usa had + particípio.</div>`;

  const spokenMaterial = `
<p>Na fala real, os condicionais aparecem contraídos e reduzidos.</p>
<div class="xp-example"><strong>I'd help if I could.</strong>'d = would (vem infinitivo depois).</div>
<div class="xp-example"><strong>I'd already left.</strong>'d = had (vem particípio depois).</div>
<div class="xp-example"><strong>I woulda helped if you'd asked.</strong>would have → “woulda” (fala casual).</div>
<div class="xp-example"><strong>If you'd told me…</strong>you'd = you had (told = particípio).</div>`;

  const materials = [
    { id: "pat", icon: "📐", label: "As 4 fórmulas dos condicionais", html: patternsTable },
    { id: "err", icon: "⚠️", label: "Erros clássicos (evite/prefira)", html: errorsMaterial },
    { id: "spk", icon: "🗣️", label: "Condicionais na fala real", html: spokenMaterial },
  ];

  const steps = [
    {
      title: "Conectando com o que você já sabe",
      show: ["cond_hook_lbox", "cond_hook_lt", "cond_hook_lx", "cond_hook_rbox", "cond_hook_rt", "cond_hook_rx"],
      balloon: { anchor: "cond_hook_rbox", placement: "top",
        text: "Você já viu “shoulda/coulda/woulda” na lição de Modais. Hoje você aprende o <strong>if clause</strong> completo por trás desses chunks — “would”, “had” e as suas combinações.",
        why: "Condicionais usam muito would/had, que você já praticou — esta lição conecta as peças que já existiam soltas." },
    },
    {
      title: "Condicional real: sempre verdade",
      show: ["cond_real_box", "cond_real_ph", "cond_real_mn"],
      balloon: { anchor: "cond_real_box", placement: "bottom",
        text: "“If you heat ice, it melts.” — <strong>if + presente, presente</strong>. Não é hipótese: é uma relação de causa e efeito sempre verdadeira.",
        why: "Esse tipo de condicional descreve fatos gerais e leis da natureza — não tem nada de \"talvez\" aqui.",
        deep: `<p>Mais exemplos do mesmo padrão:</p>
<div class="xp-example"><strong>"If you mix blue and yellow, you get green."</strong>Se você mistura azul e amarelo, fica verde.</div>` },
    },
    {
      title: "Condicional futuro provável",
      show: ["cond_future_box", "cond_future_ph", "cond_future_mn"],
      balloon: { anchor: "cond_future_box", placement: "bottom",
        text: "“If it rains, I'll stay home.” — <strong>if + presente, will</strong>. Descreve algo que provavelmente vai acontecer, dependendo de uma condição futura real.",
        why: "Diferente da anterior (sempre verdade), aqui é uma situação específica e futura — pode ou não acontecer.",
        deep: `<p>Mais um exemplo:</p>
<div class="xp-example"><strong>"If you finish early, we'll grab lunch."</strong>Se você terminar cedo, vamos almoçar.</div>` },
      exercises: [
        { kind: "choice", question: "Qual está correto?",
          options: ["If it will rain, I'll stay home.", "If it rains, I'll stay home.", "If it rains, I stay home."], answer: 1,
          explain: "Depois de if vai o presente; o “will” fica no resultado: If it rains, I'll stay home." },
      ],
    },
    {
      title: "Condicional hipotético/improvável",
      show: ["cond_hyp_box", "cond_hyp_ph1", "cond_hyp_ph2", "cond_hyp_mn"],
      highlight: ["cond_hyp_box"],
      balloon: { anchor: "cond_hyp_box", placement: "bottom",
        text: "“If I <strong>were</strong> you, I would talk to her.” — <strong>if + passado, would</strong>, pra situação hipotética ou pouco provável. Repare: usa-se \"<strong>were</strong>\" pra TODOS os pronomes, mesmo \"I\"/\"he\"/\"she\".",
        why: "É um erro comum usar \"was\" aqui — em condicional hipotético, \"were\" é a forma padrão, não uma regra de plural.",
        deep: `<p>Mais exemplos hipotéticos:</p>
<div class="xp-example"><strong>"If she were rich, she would travel more."</strong>Se ela fosse rica, viajaria mais.</div>
<div class="xp-bad"><strong>Erro comum</strong> "If I was you, I would..." (soa informal/errado em contexto de conselho hipotético)</div>` },
      exercises: [
        { kind: "fill", prompt: "Complete (hipotético):", sentence: "If I ___ you, I would take the job.",
          answer: "were", options: ["was", "were", "am"],
          explain: "Condicional hipotético usa “were” para todos os pronomes: If I were you…" },
        { kind: "order", prompt: "Monte a frase:", answer: ["if", "she", "were", "rich", "she", "would", "travel"],
          explain: "if + passado (were), would no resultado: If she were rich, she would travel." },
      ],
    },
    {
      title: "Condicional de arrependimento",
      show: ["cond_regret_box", "cond_regret_ph1", "cond_regret_ph2", "cond_regret_mn"],
      highlight: ["cond_regret_box"],
      balloon: { anchor: "cond_regret_box", placement: "bottom",
        text: "“If I <strong>had known</strong>, I would have called.” — <strong>if + past perfect (had + particípio), would have + particípio</strong>. Fala de algo que NÃO aconteceu no passado.",
        why: "Conecta direto com o Present Perfect: \"had\" é o mesmo \"have/has\" só que no passado — a estrutura toda fica sobre algo que já passou e não pode mudar.",
        deep: `<p>Mais um exemplo de arrependimento:</p>
<div class="xp-example"><strong>"If I had studied more, I would have passed."</strong>Se eu tivesse estudado mais, teria passado.</div>` },
      exercises: [
        { kind: "choice", question: "Arrependimento — qual está correto?",
          options: ["If I would have known, I would have called.", "If I had known, I would have called.", "If I knew, I would called."], answer: 1,
          explain: "A oração if usa had + particípio (não “would”): If I had known, I would have called." },
      ],
    },
    {
      title: "A contração ambígua: “I'd”",
      show: ["cond_apostrophe_lbox", "cond_apostrophe_lt", "cond_apostrophe_lx", "cond_apostrophe_rbox", "cond_apostrophe_rt", "cond_apostrophe_rx"],
      balloon: { anchor: "cond_apostrophe_rbox", placement: "top",
        text: "“I'd” pode ser <strong>I would</strong> (\"I'd go if I could.\") ou <strong>I had</strong> (\"I'd already left when she called.\") — o verbo que vem depois desambigua.",
        why: "Se depois do 'd vem um verbo no infinitivo puro (go, help, call), é \"would\". Se vem um particípio (left, called, done), é \"had\".",
        deep: `<p>Truque rápido: “I'd go” = would (infinitivo). “I'd gone” = had (particípio) — a forma do verbo já entrega a resposta.</p>` },
    },
    {
      title: "Reforço: shoulda/coulda/woulda",
      show: ["cond_reinforce_box", "cond_reinforce_ph", "cond_reinforce_mn"],
      balloon: { anchor: "cond_reinforce_box", placement: "bottom",
        text: "“I woulda helped you if you'd asked.” — a mesma redução falada de Modais (would have → woulda) aparece dentro de um condicional de arrependimento completo.",
        why: "Fecha o ciclo: agora você entende tanto a versão \"correta\" quanto a versão falada/reduzida da mesma ideia." },
    },
    {
      title: "Treino: reconheça o tipo",
      dim: ["cond_apostrophe_lbox", "cond_apostrophe_rbox"],
      highlight: ["cond_hyp_box", "cond_regret_box"],
      balloon: { anchor: "cond_hyp_box", placement: "top",
        text: "Misturar os 4 tipos de propósito (interleaving) treina você a escolher a estrutura certa. Ligue cada frase ao seu tipo 👇" },
      exercises: [
        { kind: "match", prompt: "Ligue frase ↔ tipo:", pairs: [
          ["If you heat ice, it melts.", "real (sempre verdade)"],
          ["If it rains, I'll stay home.", "futuro provável"],
          ["If I were rich, I'd travel.", "hipotético"],
          ["If I had known, I'd have called.", "arrependimento"],
        ], explain: "Quanto mais irreal a condição, mais “pra trás” vai o tempo do verbo." },
      ],
    },
    {
      title: "Treino: 'd = would ou had? (flashcards)",
      dim: ["cond_real_box", "cond_future_box"],
      balloon: { anchor: "cond_apostrophe_rbox", placement: "top",
        text: "Vire o cartão e decida: o 'd é <strong>would</strong> (vem infinitivo) ou <strong>had</strong> (vem particípio)? Confira no verso." },
      exercises: [
        { kind: "flashcards", prompt: "'d = would ou had?", cards: [
          { front: "I'd <u>go</u> if I could.", back: "<strong>would</strong> — “go” é infinitivo." },
          { front: "I'd already <u>left</u>.", back: "<strong>had</strong> — “left” é particípio." },
          { front: "She'd <u>call</u> you back.", back: "<strong>would</strong> — “call” é infinitivo." },
          { front: "If you'd <u>told</u> me…", back: "<strong>had</strong> — “told” é particípio." },
        ] },
      ],
    },
    {
      title: "Teste final: bateria completa",
      dim: ["cond_apostrophe_lbox", "cond_apostrophe_rbox"],
      balloon: { anchor: "cond_hyp_box", placement: "bottom",
        text: "Prova de fogo em vários formatos. Comece pelo conselho hipotético a um amigo 👇" },
      quiz: {
        question: "Você está dando um conselho hipotético a um amigo. Qual frase é natural?",
        options: ["If I am you, I would talk to her.", "If I were you, I would talk to her.", "If I was you, I will talk to her.", "If I be you, I would talk to her."],
        answer: 1,
        explain: "Condicional hipotético usa \"were\" para todos os pronomes: \"If I were you, I would talk to her.\"",
      },
      exercises: [
        { kind: "fill", prompt: "1) Complete (futuro provável):", sentence: "If you ___ me, I'll help. (call)",
          answer: "call", explain: "Depois de if vai o presente simples: If you call me, I'll help." },
        { kind: "order", prompt: "2) Ordene (arrependimento):",
          answer: ["if", "I", "had", "known", "I", "would", "have", "called"],
          explain: "if + past perfect, would have + particípio: If I had known, I would have called." },
        { kind: "choice", question: "3) “I ___ helped you if you'd asked.” (fala casual de would have)",
          options: ["would", "woulda", "will"], answer: 1,
          explain: "would have → “woulda” na fala: I woulda helped you if you'd asked." },
      ],
    },
  ];

  window.INGLES_CONDICIONAIS_DIAGRAM = {
    title: "Condicionais: If Clauses no Dia a Dia",
    subtitle: "Real, futuro provável, hipotético e arrependimento — sem decorar nomenclatura acadêmica",
    width: W, height: H, autoplayMs: 9000, materials, elements, steps,
  };
})();
