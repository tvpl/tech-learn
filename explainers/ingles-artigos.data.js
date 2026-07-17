/* ============================================================================
 * ingles-artigos.data.js — Explicador: Artigos (A / An / The / artigo zero)
 * O erro mais constante de brasileiro: onde o inglês usa artigo (e onde
 * simplesmente não usa nenhum).
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

  // variante de 2 linhas de frase — pra quando o exemplo é composto de 2 frases curtas
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
    // cena 1 — gancho: erro clássico de tradução literal
    ...compareRow("art_hook", 130, "var(--hot)", "Errado (tradução literal)", "“I like the pizza.”",
      "var(--good)", "Certo (genérico)", "“I like pizza.”"),

    // cena 2 — a vs an: som, não letra
    ...chunkCard("art_an1", 100, 260, 520, 100, "a university", "consoante /j/: “a” antes de som de consoante", "var(--accent)"),
    ...chunkCard("art_an2", 660, 260, 520, 100, "an hour", "“h” mudo, soa vogal: “an” antes de som de vogal", "var(--good)"),

    // cena 3 — the: específico / já mencionado
    ...chunkCard2("art_the", 100, 390, 1080, 110, "I bought a book.", "The book was amazing.",
      "1ª menção usa “a”; depois de já citado, usa “the”", "var(--accent-2)"),

    // cena 4 — genérico/1ª menção vs. específico
    ...compareRow("art_generic", 520, "var(--accent)", "1ª menção (a/an)", "“I saw a dog in the park.”",
      "var(--good)", "Já sabemos qual (the)", "“The dog started barking.”"),

    // cena 5 — artigo zero: plural e incontável genérico
    ...compare3("art_zero", 650, [
      { color: "var(--accent)", title: "Plural genérico", text: "“I like dogs.”" },
      { color: "var(--good)", title: "Incontável genérico", text: "“I need water.”" },
      { color: "var(--warn)", title: "Específico (com “the”)", text: "“The dog next door barks a lot.”" },
    ]),

    // cena 6 — mais casos do erro clássico
    ...compareRow("art_life", 810, "var(--hot)", "Errado", "“The life is beautiful.”",
      "var(--good)", "Certo", "“Life is beautiful.”"),

    // cena 7 — chunks fixos que fogem à regra
    ...chunkCard("art_fixed1", 100, 940, 520, 100, "play the guitar", "“the” mesmo com instrumento genérico (chunk fixo)", "var(--warn)"),
    ...chunkCard("art_fixed2", 660, 940, 520, 100, "go to bed", "sem “the” — expressão fixa (não “go to the bed”)", "var(--hot)"),
  ];

  const steps = [
    {
      title: "O erro mais constante de brasileiro",
      show: ["art_hook_lbox", "art_hook_lt", "art_hook_lx", "art_hook_rbox", "art_hook_rt", "art_hook_rx"],
      balloon: { anchor: "art_hook_rbox", placement: "top",
        text: "Quando você quer dizer “eu gosto de pizza” <strong>no geral</strong>, não use “the”: “I like pizza.”, não “*I like the pizza*”.",
        why: "O português tende a usar artigo onde o inglês generaliza sem nenhum — esse é o erro estrutural mais recorrente de quem traduz direto." },
    },
    {
      title: "A vs. An: é som, não letra",
      show: ["art_an1_box", "art_an1_ph", "art_an1_mn", "art_an2_box", "art_an2_ph", "art_an2_mn"],
      balloon: { anchor: "art_an2_box", placement: "bottom",
        text: "“a university” usa <strong>a</strong> porque soa como consoante (/j/, \"yoo-\"), apesar de \"u\" ser vogal. “an hour” usa <strong>an</strong> porque o \"h\" é mudo — soa vogal.",
        why: "A regra é sobre o <strong>som</strong> da primeira sílaba, não a letra escrita — por isso existem essas exceções que confundem.",
        deep: `<p>Mais pares que seguem o som, não a letra:</p>
<div class="xp-example"><strong>"an SUV"</strong>"S" soa "ess" (vogal) → an</div>
<div class="xp-example"><strong>"a European trip"</strong>"Eu-" soa "y" (consoante) → a</div>` },
    },
    {
      title: "The: específico ou já mencionado",
      show: ["art_the_box", "art_the_ph1", "art_the_ph2", "art_the_mn"],
      highlight: ["art_the_box"],
      balloon: { anchor: "art_the_box", placement: "bottom",
        text: "“I bought <strong>a</strong> book. <strong>The</strong> book was amazing.” — a primeira menção usa a/an; depois que o ouvinte já sabe do que você fala, usa <strong>the</strong>.",
        why: "\"The\" sinaliza \"você já sabe qual é\" — é o motivo de aparecer só na segunda frase, nunca na primeira.",
        deep: `<p>O mesmo padrão em outro exemplo:</p>
<div class="xp-example"><strong>"There's a cat on the roof. The cat looks stuck."</strong>Tem um gato no telhado. O gato parece preso.</div>` },
    },
    {
      title: "Genérico (a/an) vs. específico (the)",
      show: ["art_generic_lbox", "art_generic_lt", "art_generic_lx", "art_generic_rbox", "art_generic_rt", "art_generic_rx"],
      balloon: { anchor: "art_generic_rbox", placement: "top",
        text: "“I saw a dog in the park.” (1ª menção, qualquer cachorro) → “The dog started barking.” (agora já sabemos qual cachorro).",
        why: "É o mesmo mecanismo da cena anterior, reforçado com um exemplo diferente — repare no padrão se repetindo." },
    },
    {
      title: "Artigo zero: plural e incontável genérico",
      show: ["art_zero0_box", "art_zero0_t", "art_zero0_x", "art_zero1_box", "art_zero1_t", "art_zero1_x",
        "art_zero2_box", "art_zero2_t", "art_zero2_x"],
      balloon: { anchor: "art_zero1_box", placement: "top",
        text: "Falando de forma <strong>genérica</strong>, plural (“dogs”) e incontável (“water”) <strong>não levam artigo nenhum</strong>. \"The\" só aparece quando é um caso específico.",
        why: "É o padrão por trás do erro do começo desta lição: \"the\" existe pra apontar algo específico, não pra generalizar.",
        deep: `<p>Mais exemplos de artigo zero genérico:</p>
<div class="xp-example"><strong>"Cats are independent."</strong>Gatos são independentes (gatos em geral).</div>
<div class="xp-example"><strong>"I need advice."</strong>Preciso de conselho (em geral, não um conselho específico já mencionado).</div>` },
      enter: (ctx) => ctx.reveal(["art_zero0_box", "art_zero1_box", "art_zero2_box"], 130),
    },
    {
      title: "Mais casos do erro clássico",
      show: ["art_life_lbox", "art_life_lt", "art_life_lx", "art_life_rbox", "art_life_rt", "art_life_rx"],
      balloon: { anchor: "art_life_rbox", placement: "top",
        text: "Conceitos abstratos/gerais (life, money, love, time) também não levam artigo quando falados de forma genérica: “Life is beautiful.”, não “*The life is beautiful*”.",
        why: "É a mesma regra da cena anterior aplicada a substantivos abstratos — o padrão se repete em vários contextos diferentes.",
        deep: `<p>Mais exemplos:</p>
<div class="xp-example"><strong>"Money can't buy happiness."</strong>Dinheiro não compra felicidade.</div>
<div class="xp-example"><strong>"Dogs are loyal."</strong>Cachorros são leais.</div>` },
    },
    {
      title: "Chunks fixos que fogem à regra",
      show: ["art_fixed1_box", "art_fixed1_ph", "art_fixed1_mn", "art_fixed2_box", "art_fixed2_ph", "art_fixed2_mn"],
      balloon: { anchor: "art_fixed2_box", placement: "top",
        text: "Algumas expressões são <strong>chunks fixos</strong> que não seguem a regra à risca: “play <strong>the</strong> guitar” (mesmo genérico) vs “go to bed” (sem \"the\", diferente de \"go to the store\").",
        why: "Nem tudo em artigo é regra pura — algumas combinações precisam ser decoradas como bloco (técnica de chunking da lição 1), não deduzidas." },
    },
    {
      title: "Prática: identifique o padrão",
      dim: ["art_an1_box", "art_an2_box"],
      highlight: ["art_zero1_box", "art_life_rbox"],
      balloon: { anchor: "art_zero1_box", placement: "top",
        text: `Antes do quiz, pense (recall ativo): "eu gosto de música" → <em>"I like music."</em> (sem artigo). "o livro que comprei ontem" (já mencionado) → <em>"the book I bought yesterday"</em>.`,
        why: "A pergunta certa é sempre: isso é genérico (zero artigo) ou específico/já mencionado (\"the\")?" },
    },
    {
      title: "Teste rápido",
      balloon: { anchor: "art_hook_rbox", placement: "top", text: "Qual frase está certa pra dizer que você gosta de café no geral? 👇" },
      quiz: {
        question: "Qual frase está certa para dizer que você gosta de café no geral?",
        options: ["I like the coffee.", "I like coffee.", "I like a coffee.", "I like an coffee."],
        answer: 1,
        explain: "Falando de forma genérica (café em geral, não um café específico), o inglês não usa artigo nenhum: \"I like coffee.\"",
      },
    },
  ];

  window.INGLES_ARTIGOS_DIAGRAM = {
    title: "Artigos: A / An / The / Artigo Zero",
    subtitle: "O erro mais constante de brasileiro: onde o inglês usa artigo (e onde não usa)",
    width: W, height: H, autoplayMs: 9000, elements, steps,
  };
})();
