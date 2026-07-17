/* ============================================================================
 * ingles-phrasal-verbs.data.js — Explicador: Phrasal Verbs Essenciais
 * 10 chunks de altíssima frequência do dia a dia — o sentido não é a soma
 * das partes, então se aprende como bloco pronto, não tradução literal.
 * ==========================================================================*/
(function () {
  const W = 1280, H = 920;

  const chunkCard = (id, x, y, w, h, phrase, meaning, color) => [
    { id: id + "_box", type: "token", x, y, w, h, rx: 10, fill: color, style: `opacity:0.14;stroke:${color};stroke-width:1.5` },
    { id: id + "_ph", type: "label", x: x + w / 2, y: y + h / 2 - 14, anchor: "middle", label: phrase, mono: true,
      style: `font-size:13.5px;font-weight:700;fill:${color}` },
    { id: id + "_mn", type: "label", x: x + w / 2, y: y + h / 2 + 18, anchor: "middle", label: meaning,
      style: "font-size:10.5px;fill:var(--ink-soft)" },
  ];

  const CMP_LEFT_X = 100, CMP_RIGHT_X = 660, CMP_H = 90;
  const compareRow = (id, y, leftColor, leftTitle, leftText, rightColor, rightTitle, rightText, w = 520) => [
    { id: id + "_lbox", type: "box", x: CMP_LEFT_X, y, w, h: CMP_H, rx: 10, fill: leftColor, style: "opacity:0.12" },
    { id: id + "_lt", type: "label", x: CMP_LEFT_X + w / 2, y: y + 24, anchor: "middle", label: leftTitle,
      style: `font-size:11px;font-weight:700;fill:${leftColor};text-transform:uppercase;letter-spacing:1px` },
    { id: id + "_lx", type: "label", x: CMP_LEFT_X + w / 2, y: y + 54, anchor: "middle", label: leftText, mono: true,
      style: "font-size:12px;fill:var(--ink)" },
    { id: id + "_rbox", type: "box", x: CMP_RIGHT_X, y, w, h: CMP_H, rx: 10, fill: rightColor, style: "opacity:0.12" },
    { id: id + "_rt", type: "label", x: CMP_RIGHT_X + w / 2, y: y + 24, anchor: "middle", label: rightTitle,
      style: `font-size:11px;font-weight:700;fill:${rightColor};text-transform:uppercase;letter-spacing:1px` },
    { id: id + "_rx", type: "label", x: CMP_RIGHT_X + w / 2, y: y + 54, anchor: "middle", label: rightText, mono: true,
      style: "font-size:12px;fill:var(--ink)" },
  ];

  const block1 = [
    ["I can't figure it out.", "figure out = entender/resolver algo", "var(--accent)"],
    ["She came up with a great idea.", "come up with = ter/bolar uma ideia", "var(--good)"],
    ["I get along with my roommate.", "get along with = se dar bem com alguém", "var(--warn)"],
  ];
  const block2 = [
    ["I ran into an old friend.", "run into = encontrar (alguém) por acaso", "var(--accent-2)"],
    ["Don't give up on your dream.", "give up = desistir", "var(--hot)"],
    ["I'm looking forward to it.", "look forward to = estar ansioso esperando algo", "var(--accent)"],
  ];
  const block3 = [
    ["I'll deal with it later.", "deal with = lidar com algo", "var(--accent)"],
    ["It worked out fine.", "work out = dar certo", "var(--good)"],
    ["We ended up staying home.", "end up = acabar (fazendo algo)", "var(--warn)"],
    ["I finally got over it.", "get over = superar (término, doença)", "var(--hot)"],
  ];

  const elements = [
    // cena 1 — gancho: sentido novo, não literal
    ...compareRow("pv_hook", 130, "var(--muted)", "Look (literal)", "“I look at the stars.”",
      "var(--accent)", "Look forward to (sentido novo)", "“I'm looking forward to the weekend.”"),

    // cena 2 — bloco 1
    ...block1.flatMap(([ph, mn, color], i) => chunkCard(`pv_b1_${i}`, 80 + i * 380, 260, 360, 110, ph, mn, color)),

    // cena 3 — bloco 2
    ...block2.flatMap(([ph, mn, color], i) => chunkCard(`pv_b2_${i}`, 80 + i * 380, 390, 360, 110, ph, mn, color)),

    // cena 4 — bloco 3
    ...block3.flatMap(([ph, mn, color], i) => chunkCard(`pv_b3_${i}`, 10 + i * 320, 520, 300, 110, ph, mn, color)),

    // cena 5 — separável vs. inseparável
    ...compareRow("pv_sep", 650, "var(--accent-2)", "Separável (pronome no meio)", "“figure it out” / “figure out the problem”",
      "var(--hot)", "Inseparável (nunca separa)", "“run into someone” (não “run someone into”)"),

    // cena 6 — erro de tradução literal
    ...chunkCard("pv_literal", 100, 780, 1080, 100, "I won't give up on this.",
      "“Give up” tem que ser aprendido como chunk — nunca é a tradução literal de “dar” + “acima”", "var(--accent-2)"),
  ];

  const steps = [
    {
      title: "O sentido não é a soma das partes",
      show: ["pv_hook_lbox", "pv_hook_lt", "pv_hook_lx", "pv_hook_rbox", "pv_hook_rt", "pv_hook_rx"],
      balloon: { anchor: "pv_hook_rbox", placement: "top",
        text: "“Look” sozinho é \"olhar\". “Look forward to” é uma expressão <strong>completamente diferente</strong>: estar ansioso/animado esperando algo.",
        why: "Verbo + partícula muda o sentido inteiro — por isso phrasal verbs se aprendem como <strong>chunk novo</strong>, não como \"verbo + preposição traduzidos separadamente\"." },
    },
    {
      title: "Bloco 1: figure out, come up with, get along with",
      show: block1.flatMap((_, i) => [`pv_b1_${i}_box`, `pv_b1_${i}_ph`, `pv_b1_${i}_mn`]),
      balloon: { anchor: "pv_b1_0_box", placement: "top",
        text: "<strong>figure out</strong> (entender/resolver), <strong>come up with</strong> (ter/bolar uma ideia) e <strong>get along with</strong> (se dar bem com alguém) — três dos phrasal verbs mais usados no dia a dia.",
        why: "Esses três aparecem toda hora em conversa sobre trabalho, relacionamento e resolução de problemas.",
        deep: `<p>Mais um uso de cada:</p>
<div class="xp-example"><strong>"Can you figure out what's wrong?"</strong>Você consegue descobrir o que está errado?</div>
<div class="xp-example"><strong>"We need to come up with a plan."</strong>Precisamos bolar um plano.</div>` },
      enter: (ctx) => ctx.reveal(["pv_b1_0_box", "pv_b1_1_box", "pv_b1_2_box"], 120),
    },
    {
      title: "Bloco 2: run into, give up, look forward to",
      show: block2.flatMap((_, i) => [`pv_b2_${i}_box`, `pv_b2_${i}_ph`, `pv_b2_${i}_mn`]),
      balloon: { anchor: "pv_b2_1_box", placement: "top",
        text: "<strong>run into</strong> (encontrar por acaso), <strong>give up</strong> (desistir) e <strong>look forward to</strong> (estar ansioso esperando) — chunks de conversa cotidiana.",
        why: "Repare que \"look forward to\" termina com \"to\" seguido de verbo-ing, não infinitivo: \"looking forward to seeing you\", não \"to see you\".",
        deep: `<p>Mais exemplos:</p>
<div class="xp-example"><strong>"I ran into my old boss at the mall."</strong>Encontrei meu ex-chefe por acaso no shopping.</div>
<div class="xp-example"><strong>"I'm looking forward to seeing you."</strong>Estou ansioso pra te ver.</div>` },
      enter: (ctx) => ctx.reveal(["pv_b2_0_box", "pv_b2_1_box", "pv_b2_2_box"], 120),
    },
    {
      title: "Bloco 3: deal with, work out, end up, get over",
      show: block3.flatMap((_, i) => [`pv_b3_${i}_box`, `pv_b3_${i}_ph`, `pv_b3_${i}_mn`]),
      balloon: { anchor: "pv_b3_1_box", placement: "top",
        text: "<strong>deal with</strong> (lidar com), <strong>work out</strong> (dar certo/também \"malhar\"), <strong>end up</strong> (acabar fazendo algo) e <strong>get over</strong> (superar) — completam os 10 chunks essenciais desta lição.",
        why: "\"Work out\" tem dois sentidos super comuns: \"dar certo\" (\"it worked out\") e \"malhar/exercitar\" (\"I work out every morning\") — o contexto decide qual.",
        deep: `<p>Mais um exemplo de cada:</p>
<div class="xp-example"><strong>"I'll deal with this tomorrow."</strong>Vou lidar com isso amanhã.</div>
<div class="xp-example"><strong>"We ended up watching a movie instead."</strong>Acabamos assistindo um filme no lugar disso.</div>` },
      enter: (ctx) => ctx.reveal(["pv_b3_0_box", "pv_b3_1_box", "pv_b3_2_box", "pv_b3_3_box"], 100),
    },
    {
      title: "Separável vs. inseparável",
      show: ["pv_sep_lbox", "pv_sep_lt", "pv_sep_lx", "pv_sep_rbox", "pv_sep_rt", "pv_sep_rx"],
      balloon: { anchor: "pv_sep_rbox", placement: "top",
        text: "Alguns phrasal verbs são <strong>separáveis</strong> (o pronome pode ir no meio: \"figure it out\") e outros são <strong>inseparáveis</strong> (nunca separam: \"run into someone\", nunca \"run someone into\").",
        why: "Não tem como adivinhar visualmente qual é qual — isso também se decora como parte do chunk, junto com o próprio phrasal verb.",
        deep: `<p>Regra prática pros separáveis: com pronome (it, him, her), o pronome <strong>tem</strong> que ir no meio — \"figure it out\", nunca \"figure out it\".</p>` },
    },
    {
      title: "O erro de tradução literal",
      show: ["pv_literal_box", "pv_literal_ph", "pv_literal_mn"],
      highlight: ["pv_literal_box"],
      balloon: { anchor: "pv_literal_box", placement: "bottom",
        text: "“Give up” não tem nada a ver com \"dar\" + \"acima\" traduzido palavra por palavra — significa <strong>desistir</strong>, ponto. Todo phrasal verb desta lição merece o mesmo tratamento.",
        why: "Tentar montar o sentido a partir das partes separadas é o erro mais comum com phrasal verbs — trate cada um como uma palavra nova." },
    },
    {
      title: "Prática: complete com o phrasal certo",
      dim: ["pv_b3_0_box", "pv_b3_1_box", "pv_b3_2_box", "pv_b3_3_box"],
      highlight: ["pv_b1_1_box", "pv_b2_1_box"],
      balloon: { anchor: "pv_b1_1_box", placement: "top",
        text: `Antes do quiz, complete mentalmente (recall ativo): "I can't ___ why this isn't working." (figure out), "She never ___ on her goals." (gives up), "We ___ an old friend at the airport." (ran into)`,
        why: "Reconhecer qual phrasal verb encaixa no contexto — não só saber a tradução isolada — é o que realmente conta na conversa." },
    },
    {
      title: "Teste rápido",
      balloon: { anchor: "pv_b1_1_box", placement: "top", text: "Você quer dizer que teve uma ideia nova pro projeto. Qual phrasal verb? 👇" },
      quiz: {
        question: "Você quer dizer que teve/bolou uma ideia nova para o projeto. Qual phrasal verb?",
        options: ["come up with", "give up", "run into", "deal with"],
        answer: 0,
        explain: "\"Come up with\" = ter/bolar uma ideia: \"I came up with a new idea for the project.\"",
      },
    },
  ];

  window.INGLES_PHRASAL_VERBS_DIAGRAM = {
    title: "Phrasal Verbs Essenciais do Dia a Dia",
    subtitle: "10 chunks de altíssima frequência — não são tradução literal",
    width: W, height: H, autoplayMs: 9000, elements, steps,
  };
})();
