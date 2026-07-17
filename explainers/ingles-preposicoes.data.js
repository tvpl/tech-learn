/* ============================================================================
 * ingles-preposicoes.data.js — Explicador: Preposições de Tempo e Lugar
 * In / On / At — a regra e os chunks fixos que fogem dela.
 * ==========================================================================*/
(function () {
  const W = 1280, H = 1200;

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
    // cena 1 — gancho: erro comum
    ...compareRow("prep_hook", 130, "var(--hot)", "Errado (tradução literal)", "“I'm in the bus.”",
      "var(--good)", "Certo", "“I'm on the bus.”"),

    // cena 2 — tempo: IN
    ...compare3("prep_in", 260, [
      { color: "var(--accent)", title: "Mês", text: "“in July”" },
      { color: "var(--good)", title: "Ano", text: "“in 2024”" },
      { color: "var(--accent-2)", title: "Período do dia", text: "“in the morning”" },
    ]),

    // cena 3 — tempo: ON
    ...compare3("prep_on", 420, [
      { color: "var(--warn)", title: "Dia da semana", text: "“on Monday”" },
      { color: "var(--hot)", title: "Data pessoal", text: "“on my birthday”" },
      { color: "var(--accent)", title: "Data específica", text: "“on July 4th”" },
    ]),

    // cena 4 — tempo: AT
    ...compare3("prep_at", 580, [
      { color: "var(--good)", title: "Hora exata", text: "“at 6pm”" },
      { color: "var(--accent-2)", title: "Ponto do dia", text: "“at noon”" },
      { color: "var(--hot)", title: "Exceção!", text: "“at night”" },
    ]),

    // cena 5 — lugar: IN/ON/AT
    ...compare3("prep_place", 740, [
      { color: "var(--accent)", title: "Espaço fechado", text: "“in the car”" },
      { color: "var(--good)", title: "Superfície/veículo grande", text: "“on the bus”" },
      { color: "var(--warn)", title: "Ponto específico", text: "“at the bus stop”" },
    ]),

    // cena 6 — cidade/país sempre IN
    ...chunkCard("prep_city1", 100, 900, 520, 100, "in São Paulo", "cidade — sempre “in”", "var(--accent)"),
    ...chunkCard("prep_city2", 660, 900, 520, 100, "in Brazil", "país — sempre “in” (tamanho não muda a regra)", "var(--good)"),

    // cena 7 — chunks fixos que fogem à regra
    ...compare3("prep_fixed", 1030, [
      { color: "var(--accent)", title: "Período do dia (regra)", text: "“in the morning”" },
      { color: "var(--hot)", title: "Exceção: night", text: "“at night”" },
      { color: "var(--warn)", title: "Pontos abstratos (sempre AT)", text: "“at home / at work / at school”" },
    ]),
  ];

  const steps = [
    {
      title: "Tradução literal não funciona sempre",
      show: ["prep_hook_lbox", "prep_hook_lt", "prep_hook_lx", "prep_hook_rbox", "prep_hook_rt", "prep_hook_rx"],
      balloon: { anchor: "prep_hook_rbox", placement: "top",
        text: "\"No ônibus\" não vira \"in the bus\" — o certo é <strong>\"on the bus\"</strong>. Você não está dentro de um espaço fechado pequeno, está \"sobre\" um veículo grande.",
        why: "Preposição de lugar em inglês segue uma lógica própria de tamanho/tipo de espaço — traduzir \"em\" direto quebra bastante." },
    },
    {
      title: "Tempo: IN (períodos maiores)",
      show: ["prep_in0_box", "prep_in0_t", "prep_in0_x", "prep_in1_box", "prep_in1_t", "prep_in1_x", "prep_in2_box", "prep_in2_t", "prep_in2_x"],
      balloon: { anchor: "prep_in2_box", placement: "top",
        text: "<strong>IN</strong> serve pra períodos maiores de tempo: meses (\"in July\"), anos (\"in 2024\") e períodos do dia (\"in the morning\").",
        why: "Pense em IN como \"dentro de um período largo\" — quanto mais amplo o intervalo de tempo, mais chance de ser IN.",
        deep: `<p>Mais exemplos com IN:</p>
<div class="xp-example"><strong>"in the evening"</strong>à noite/no fim de tarde</div>
<div class="xp-example"><strong>"in spring/summer/fall/winter"</strong>nas estações do ano</div>` },
      enter: (ctx) => ctx.reveal(["prep_in0_box", "prep_in1_box", "prep_in2_box"], 130),
    },
    {
      title: "Tempo: ON (dias e datas)",
      show: ["prep_on0_box", "prep_on0_t", "prep_on0_x", "prep_on1_box", "prep_on1_t", "prep_on1_x", "prep_on2_box", "prep_on2_t", "prep_on2_x"],
      balloon: { anchor: "prep_on2_box", placement: "top",
        text: "<strong>ON</strong> serve pra dias da semana (\"on Monday\") e datas específicas (\"on my birthday\", \"on July 4th\").",
        why: "ON marca um dia específico no calendário — mais preciso que IN, menos preciso que AT.",
        deep: `<p>Mais exemplos com ON:</p>
<div class="xp-example"><strong>"on weekdays"</strong>nos dias úteis</div>
<div class="xp-example"><strong>"on Christmas Day"</strong>no dia de Natal</div>` },
      enter: (ctx) => ctx.reveal(["prep_on0_box", "prep_on1_box", "prep_on2_box"], 130),
    },
    {
      title: "Tempo: AT (hora exata... e uma exceção)",
      show: ["prep_at0_box", "prep_at0_t", "prep_at0_x", "prep_at1_box", "prep_at1_t", "prep_at1_x", "prep_at2_box", "prep_at2_t", "prep_at2_x"],
      balloon: { anchor: "prep_at2_box", placement: "top",
        text: "<strong>AT</strong> serve pra horas exatas (\"at 6pm\") e pontos do dia (\"at noon\"). Mas repare: <strong>\"at night\"</strong> é uma exceção — período do dia que usa AT em vez de IN.",
        why: "Essa exceção é bem conhecida e usada o tempo todo — decore \"at night\" como chunk, não tente encaixar na regra de IN.",
        deep: `<p>Compare os dois períodos do dia:</p>
<div class="xp-good"><strong>"in the morning" / "in the afternoon" / "in the evening"</strong>seguem a regra de IN</div>
<div class="xp-bad"><strong>"in the night" soa estranho</strong>o natural é sempre "at night"</div>` },
      enter: (ctx) => ctx.reveal(["prep_at0_box", "prep_at1_box", "prep_at2_box"], 130),
    },
    {
      title: "Lugar: IN / ON / AT",
      show: ["prep_place0_box", "prep_place0_t", "prep_place0_x", "prep_place1_box", "prep_place1_t", "prep_place1_x", "prep_place2_box", "prep_place2_t", "prep_place2_x"],
      balloon: { anchor: "prep_place1_box", placement: "top",
        text: "<strong>IN</strong> pra espaço fechado pequeno (\"in the car\"), <strong>ON</strong> pra veículo grande onde você \"sobe\" (\"on the bus\"), <strong>AT</strong> pra ponto específico (\"at the bus stop\").",
        why: "Repare que \"get IN a car\" (você se dobra pra entrar) é diferente de \"get ON a bus/plane/train\" (você sobe em algo grande) — a lógica física ajuda a lembrar.",
        deep: `<p>Mais exemplos do mesmo padrão:</p>
<div class="xp-example"><strong>"She got in the taxi."</strong>Ela entrou no táxi.</div>
<div class="xp-example"><strong>"We got on the plane."</strong>Nós embarcamos no avião.</div>` },
      enter: (ctx) => ctx.reveal(["prep_place0_box", "prep_place1_box", "prep_place2_box"], 130),
    },
    {
      title: "Cidade e país: sempre IN",
      show: ["prep_city1_box", "prep_city1_ph", "prep_city1_mn", "prep_city2_box", "prep_city2_ph", "prep_city2_mn"],
      balloon: { anchor: "prep_city2_box", placement: "bottom",
        text: "Cidade (\"in São Paulo\") e país (\"in Brazil\") sempre usam <strong>IN</strong> — o tamanho do lugar não muda a regra.",
        why: "É uma boa notícia: pra lugares geográficos grandes (bairro, cidade, estado, país), IN funciona sempre, sem exceção." },
    },
    {
      title: "Chunks fixos que fogem à regra",
      show: ["prep_fixed0_box", "prep_fixed0_t", "prep_fixed0_x", "prep_fixed1_box", "prep_fixed1_t", "prep_fixed1_x", "prep_fixed2_box", "prep_fixed2_t", "prep_fixed2_x"],
      balloon: { anchor: "prep_fixed2_box", placement: "top",
        text: "Pontos abstratos como <strong>home/work/school</strong> sempre usam AT (\"at home\", \"at work\", \"at school\") — não são \"lugares físicos\" na lógica da regra, são chunks fixos.",
        why: "Assim como \"at night\", essas combinações vale mais decorar como bloco pronto do que tentar encaixar na regra de IN/ON/AT." },
      enter: (ctx) => ctx.reveal(["prep_fixed0_box", "prep_fixed1_box", "prep_fixed2_box"], 130),
    },
    {
      title: "Prática: complete a preposição",
      dim: ["prep_city1_box", "prep_city2_box"],
      highlight: ["prep_place1_box", "prep_at2_box"],
      balloon: { anchor: "prep_place1_box", placement: "top",
        text: `Antes do quiz, complete mentalmente (recall ativo): "I'll see you ___ Friday." (on), "The meeting is ___ 3pm." (at), "I was born ___ 1998." (in).`,
        why: "Misturar tempo e lugar de propósito (interleaving) treina você a escolher a preposição certa em tempo real, não só em exercício isolado." },
    },
    {
      title: "Teste rápido",
      balloon: { anchor: "prep_place1_box", placement: "top", text: "Você vai contar que embarcou no avião. Qual frase soa certa? 👇" },
      quiz: {
        question: "Você quer dizer que está no avião agora. Qual frase soa certa?",
        options: ["I'm in the plane.", "I'm on the plane.", "I'm at the plane.", "I'm at plane."],
        answer: 1,
        explain: "Veículos grandes onde você \"sobe\" (ônibus, avião, trem) usam \"on\": \"I'm on the plane.\"",
      },
    },
  ];

  window.INGLES_PREPOSICOES_DIAGRAM = {
    title: "Preposições de Tempo e Lugar: In / On / At",
    subtitle: "A regra — e os chunks fixos que fogem dela",
    width: W, height: H, autoplayMs: 9000, elements, steps,
  };
})();
