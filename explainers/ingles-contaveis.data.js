/* ============================================================================
 * ingles-contaveis.data.js — Explicador: Contáveis e Incontáveis
 * Much/many/some/any/a lot of/a few/a little — e a armadilha de advice,
 * information e money serem incontáveis em inglês.
 * ==========================================================================*/
(function () {
  const W = 1280, H = 1080;

  const chunkCard = (id, x, y, w, h, phrase, meaning, color) => [
    { id: id + "_box", type: "token", x, y, w, h, rx: 10, fill: color, style: `opacity:0.14;stroke:${color};stroke-width:1.5` },
    { id: id + "_ph", type: "label", x: x + w / 2, y: y + h / 2 - 14, anchor: "middle", label: phrase, mono: true,
      style: `font-size:15px;font-weight:700;fill:${color}` },
    { id: id + "_mn", type: "label", x: x + w / 2, y: y + h / 2 + 18, anchor: "middle", label: meaning,
      style: "font-size:11px;fill:var(--ink-soft)" },
  ];

  const CMP_LEFT_X = 100, CMP_RIGHT_X = 660, CMP_H = 90;
  const compareRow = (id, y, leftColor, leftTitle, leftText, rightColor, rightTitle, rightText, w = 520) => [
    { id: id + "_lbox", type: "box", x: CMP_LEFT_X, y, w, h: CMP_H, rx: 10, fill: leftColor, style: "opacity:0.12" },
    { id: id + "_lt", type: "label", x: CMP_LEFT_X + w / 2, y: y + 24, anchor: "middle", label: leftTitle,
      style: `font-size:11px;font-weight:700;fill:${leftColor};text-transform:uppercase;letter-spacing:1px` },
    { id: id + "_lx", type: "label", x: CMP_LEFT_X + w / 2, y: y + 54, anchor: "middle", label: leftText, mono: true,
      style: "font-size:13px;fill:var(--ink)" },
    { id: id + "_rbox", type: "box", x: CMP_RIGHT_X, y, w, h: CMP_H, rx: 10, fill: rightColor, style: "opacity:0.12" },
    { id: id + "_rt", type: "label", x: CMP_RIGHT_X + w / 2, y: y + 24, anchor: "middle", label: rightTitle,
      style: `font-size:11px;font-weight:700;fill:${rightColor};text-transform:uppercase;letter-spacing:1px` },
    { id: id + "_rx", type: "label", x: CMP_RIGHT_X + w / 2, y: y + 54, anchor: "middle", label: rightText, mono: true,
      style: "font-size:13px;fill:var(--ink)" },
  ];

  const compare3 = (id, y, cols, w = 340, h = 130) => cols.flatMap(({ color, title, text }, i) => {
    const x = 80 + i * (w + 40);
    return [
      { id: `${id}${i}_box`, type: "box", x, y, w, h, rx: 10, fill: color, style: "opacity:0.12" },
      { id: `${id}${i}_t`, type: "label", x: x + w / 2, y: y + 24, anchor: "middle", label: title,
        style: `font-size:11px;font-weight:700;fill:${color};text-transform:uppercase;letter-spacing:1px` },
      { id: `${id}${i}_x`, type: "label", x: x + w / 2, y: y + 68, anchor: "middle", label: text, mono: true,
        style: "font-size:13px;fill:var(--ink)" },
    ];
  });

  const elements = [
    // cena 1 — gancho: contável vs. incontável
    ...chunkCard("cnt_hook1", 100, 130, 520, 100, "apples", "contável: tem plural — “three apples”", "var(--accent)"),
    ...chunkCard("cnt_hook2", 660, 130, 520, 100, "money", "incontável: sem plural — nunca “moneys”", "var(--good)"),

    // cena 2 — a armadilha do brasileiro
    ...compare3("cnt_trap", 260, [
      { color: "var(--accent-2)", title: "Incontável em EN", text: "“advice”" },
      { color: "var(--hot)", title: "Incontável em EN", text: "“information”" },
      { color: "var(--warn)", title: "Incontável em EN", text: "“furniture”" },
    ]),

    // cena 3 — many vs. much
    ...compareRow("cnt_manymuch", 420, "var(--accent)", "Many (contável)", "“How many friends do you have?”",
      "var(--good)", "Much (incontável)", "“How much money do you have?”"),

    // cena 4 — a few vs. a little
    ...compareRow("cnt_fewlittle", 550, "var(--accent-2)", "A few + contável", "“I have a few friends here.”",
      "var(--warn)", "A little + incontável", "“I have a little money saved.”"),

    // cena 5 — a lot of / lots of
    ...chunkCard("cnt_alot1", 100, 680, 520, 100, "I have a lot of friends.", "o mais usado na fala cotidiana afirmativa", "var(--hot)"),
    ...chunkCard("cnt_alot2", 660, 680, 520, 100, "I have lots of work to do.", "“lots of” = mesma coisa, ainda mais informal", "var(--accent)"),

    // cena 6 — some vs. any
    ...compareRow("cnt_someany", 810, "var(--good)", "Some (afirmativa)", "“I have some money.”",
      "var(--hot)", "Any (negativa/pergunta)", "“I don't have any money.”"),

    // cena 7 — oferecimento educado usa "some"
    ...chunkCard("cnt_offer", 100, 940, 1080, 100, "Would you like some coffee?",
      "Oferecimento educado usa “some” mesmo em pergunta (não “any”)", "var(--accent-2)"),
  ];

  const steps = [
    {
      title: "Contável vs. incontável",
      show: ["cnt_hook1_box", "cnt_hook1_ph", "cnt_hook1_mn", "cnt_hook2_box", "cnt_hook2_ph", "cnt_hook2_mn"],
      balloon: { anchor: "cnt_hook2_box", placement: "bottom",
        text: "“Apples” é contável (tem plural: \"three apples\"). “Money” é incontável (nunca existe \"moneys\").",
        why: "Essa distinção decide qual palavra de quantidade usar (many/much, a few/a little) — é a base de toda a lição." },
    },
    {
      title: "A armadilha do brasileiro",
      show: ["cnt_trap0_box", "cnt_trap0_t", "cnt_trap0_x", "cnt_trap1_box", "cnt_trap1_t", "cnt_trap1_x", "cnt_trap2_box", "cnt_trap2_t", "cnt_trap2_x"],
      balloon: { anchor: "cnt_trap1_box", placement: "top",
        text: "<strong>Advice, information e furniture são incontáveis em inglês</strong> — mesmo que em português você diga \"um conselho\", \"uma informação\", \"um móvel\".",
        why: "Por serem incontáveis, essas palavras nunca vão pro plural (\"advices\"/\"informations\" não existem) e usam much/a little, não many/a few.",
        deep: `<p>Pra "contar" um incontável, use "a piece of":</p>
<div class="xp-bad"><strong>Errado</strong> "She gave me an advice." / "I have some informations."</div>
<div class="xp-good"><strong>Certo</strong> "She gave me a piece of advice." / "I have some information." (sem plural)</div>` },
      enter: (ctx) => ctx.reveal(["cnt_trap0_box", "cnt_trap1_box", "cnt_trap2_box"], 130),
    },
    {
      title: "Many (contável) vs. Much (incontável)",
      show: ["cnt_manymuch_lbox", "cnt_manymuch_lt", "cnt_manymuch_lx", "cnt_manymuch_rbox", "cnt_manymuch_rt", "cnt_manymuch_rx"],
      balloon: { anchor: "cnt_manymuch_rbox", placement: "top",
        text: "<strong>Many</strong> pergunta quantidade de contável (\"How many friends...\"), <strong>much</strong> pergunta quantidade de incontável (\"How much money...\").",
        why: "Em afirmativas, many/much soam um pouco formais — na fala do dia a dia, o mais comum é \"a lot of\" (próxima cena).",
        deep: `<p>Em afirmativas formais/escritas, many/much aparecem normalmente:</p>
<div class="xp-example"><strong>"There isn't much time left."</strong>Não sobra muito tempo.</div>` },
    },
    {
      title: "A few vs. A little — e a armadilha do \"a\"",
      show: ["cnt_fewlittle_lbox", "cnt_fewlittle_lt", "cnt_fewlittle_lx", "cnt_fewlittle_rbox", "cnt_fewlittle_rt", "cnt_fewlittle_rx"],
      balloon: { anchor: "cnt_fewlittle_rbox", placement: "top",
        text: "<strong>A few</strong> (contável) e <strong>a little</strong> (incontável) = \"alguns/um pouco\", com tom <strong>positivo</strong> — você tem o suficiente.",
        why: "Cuidado: tirar o \"a\" muda o sentido quase pro oposto — vale a pena ver o contraste completo no aprofundamento.",
        deep: `<p>Com "a": tom positivo (tem o suficiente). Sem "a": tom negativo (quase nada, decepção):</p>
<div class="xp-good"><strong>"I have a few friends here."</strong>Tenho alguns amigos aqui (tom positivo, tudo bem).</div>
<div class="xp-bad"><strong>"I have few friends here."</strong>Tenho poucos amigos aqui (tom negativo, sinto falta de mais).</div>` },
    },
    {
      title: "A lot of / lots of: o mais usado na fala",
      show: ["cnt_alot1_box", "cnt_alot1_ph", "cnt_alot1_mn", "cnt_alot2_box", "cnt_alot2_ph", "cnt_alot2_mn"],
      balloon: { anchor: "cnt_alot1_box", placement: "bottom",
        text: "<strong>A lot of</strong> (e sua versão mais informal <strong>lots of</strong>) funciona pros dois tipos — contável e incontável — e é muito mais comum na fala afirmativa do dia a dia do que many/much.",
        why: "Se você não tiver certeza se a palavra é contável ou incontável, \"a lot of\" resolve os dois casos sem erro." },
    },
    {
      title: "Some (afirmativa) vs. Any (negativa/pergunta)",
      show: ["cnt_someany_lbox", "cnt_someany_lt", "cnt_someany_lx", "cnt_someany_rbox", "cnt_someany_rt", "cnt_someany_rx"],
      balloon: { anchor: "cnt_someany_rbox", placement: "top",
        text: "<strong>Some</strong> aparece em frases afirmativas (\"I have some money.\"). <strong>Any</strong> aparece em negativas e perguntas neutras (\"I don't have any money.\", \"Do you have any siblings?\").",
        why: "É uma regra simples de posição: afirmativa → some; negativa/pergunta → any (com uma exceção importante na próxima cena)." },
    },
    {
      title: "Exceção: oferecimento educado usa \"some\"",
      show: ["cnt_offer_box", "cnt_offer_ph", "cnt_offer_mn"],
      highlight: ["cnt_offer_box"],
      balloon: { anchor: "cnt_offer_box", placement: "bottom",
        text: "“Would you like <strong>some</strong> coffee?” é uma pergunta, mas usa \"some\" — porque é um <strong>oferecimento educado</strong>, não uma pergunta neutra sobre existência.",
        why: "Compare: \"Do you have any siblings?\" (pergunta neutra de fato, usa any) vs \"Would you like some cookies?\" (oferecimento, já espera \"sim\", usa some)." },
    },
    {
      title: "Teste rápido",
      balloon: { anchor: "cnt_manymuch_rbox", placement: "top", text: "Complete: \"How ___ time do you need?\" 👇" },
      quiz: {
        question: "Complete: \"How ___ time do you need?\"",
        options: ["many", "much", "a few", "a lot"],
        answer: 1,
        explain: "\"Time\" é incontável — a pergunta de quantidade usa \"much\": \"How much time do you need?\"",
      },
    },
  ];

  window.INGLES_CONTAVEIS_DIAGRAM = {
    title: "Contáveis e Incontáveis",
    subtitle: "Much/many/some/any/a lot of/a few/a little — e a armadilha de advice/information/money",
    width: W, height: H, autoplayMs: 9000, elements, steps,
  };
})();
