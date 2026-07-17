/* ============================================================================
 * ingles-passado.data.js — Explicador: Simple Past vs Past Continuous
 * Regulares (+ed), irregulares mais comuns como chunk, "did" como auxiliar
 * universal, Past Continuous (ação interrompida) e o chunk "used to".
 * ==========================================================================*/
(function () {
  const W = 1280, H = 920;

  const chunkBlock = (id, x, y, w, h, role, text, color) => [
    { id: id + "_box", type: "box", x, y, w, h, rx: 8, fill: color, style: "opacity:0.85" },
    { id: id + "_role", type: "label", x: x + w / 2, y: y - 10, anchor: "middle", label: role,
      style: `font-size:10px;font-weight:700;fill:${color};text-transform:uppercase;letter-spacing:1px` },
    { id: id + "_txt", type: "label", x: x + w / 2, y: y + h / 2 + 6, anchor: "middle", label: text, mono: true,
      style: "font-size:15px;font-weight:600;fill:#fff" },
  ];

  const chunkCard = (id, x, y, w, h, phrase, meaning, color) => [
    { id: id + "_box", type: "token", x, y, w, h, rx: 10, fill: color, style: `opacity:0.14;stroke:${color};stroke-width:1.5` },
    { id: id + "_ph", type: "label", x: x + w / 2, y: y + h / 2 - 14, anchor: "middle", label: phrase, mono: true,
      style: `font-size:15px;font-weight:700;fill:${color}` },
    { id: id + "_mn", type: "label", x: x + w / 2, y: y + h / 2 + 18, anchor: "middle", label: meaning,
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

  const irregulars = [
    ["go → went", "\"I went home.\"", "var(--accent)"],
    ["have → had", "\"I had a dream.\"", "var(--good)"],
    ["see → saw", "\"I saw her.\"", "var(--warn)"],
    ["get → got", "\"I got a call.\"", "var(--accent-2)"],
    ["say → said", "\"She said yes.\"", "var(--hot)"],
  ];

  const elements = [
    // cena 1 — aquecimento (do/does → did)
    ...chunkBlock("pas_warm_pd", 220, 130, 260, 80, "Presente", "do / does", "var(--accent)"),
    ...chunkBlock("pas_warm_pa", 700, 130, 260, 80, "Passado", "did (todo mundo!)", "var(--good)"),
    { id: "pas_warm_arrow", type: "arrow", x1: 480, y1: 170, x2: 700, y2: 170, color: "var(--muted)" },

    // cena 2 — regular +ed
    ...chunkCard("pas_simple", 100, 250, 1080, 100, "I worked late yesterday.", "Regular: verbo + “-ed”", "var(--accent)"),

    // cena 3 — irregulares mais comuns (chunk, não regra)
    ...irregulars.flatMap(([ph, mn, color], i) => chunkCard(`pas_irr${i}`, 100 + i * 216, 380, 200, 100, ph, mn, color)),

    // cena 4 — "did" como auxiliar (prévia de pergunta/negativa)
    ...compareRow("pas_did", 510, "var(--accent)", "Pergunta", "“Did you see that?”", "var(--hot)", "Negativa", "“I didn't go.”"),

    // cena 5 — Past Continuous: ação contínua cortada por evento pontual
    { id: "pas_cont_bar", type: "box", x: 100, y: 660, w: 700, h: 60, rx: 12, fill: "var(--accent-2)", style: "opacity:0.28" },
    { id: "pas_cont_l1", type: "label", x: 300, y: 695, anchor: "middle", mono: true, label: "I was watching TV",
      style: "font-size:15px;font-weight:700;fill:var(--ink)" },
    { id: "pas_cont_cut", type: "arrow", x1: 560, y1: 635, x2: 560, y2: 745, color: "var(--hot)" },
    { id: "pas_cont_l2", type: "label", x: 560, y: 775, anchor: "middle", mono: true, label: "when you called",
      style: "font-size:14px;font-weight:700;fill:var(--hot)" },

    // cena 6 — "used to"
    ...chunkCard("pas_used", 100, 800, 1080, 100, "I used to play soccer every weekend.",
      "Hábito no passado que não existe mais (hoje eu não jogo)", "var(--warn)"),
  ];

  const steps = [
    {
      title: "Aquecimento: do/does vira “did”",
      show: ["pas_warm_pd_box", "pas_warm_pd_role", "pas_warm_pd_txt", "pas_warm_pa_box", "pas_warm_pa_role",
        "pas_warm_pa_txt", "pas_warm_arrow"],
      balloon: { anchor: "pas_warm_pa_box", placement: "bottom",
        text: "No presente você usa <strong>do</strong> ou <strong>does</strong> dependendo da pessoa. No passado, é sempre <strong>did</strong> — para I, you, he, she, we, they, sem exceção.",
        why: "É uma boa notícia: o passado simplifica a escolha do auxiliar. \"Did\" funciona igual para todo mundo." },
      enter: (ctx) => ctx.drawArrow("pas_warm_arrow"),
    },
    {
      title: "Simple Past regular: verbo + -ed",
      show: ["pas_simple_box", "pas_simple_ph", "pas_simple_mn"],
      highlight: ["pas_simple_box"],
      balloon: { anchor: "pas_simple_box", placement: "bottom",
        text: "“I worked late yesterday.” Verbos regulares recebem <strong>-ed</strong> no passado, igual para todas as pessoas (I worked, she worked, they worked).",
        why: "Sem -s, sem auxiliar na afirmativa — o passado regular é a forma mais simples de conjugar em inglês.",
        deep: `<p>Regras de ortografia do -ed:</p>
<div class="xp-example"><strong>stop → stopped</strong>dobra a consoante final (sílaba tônica curta)</div>
<div class="xp-example"><strong>study → studied</strong>consoante + y vira "ied"</div>
<div class="xp-example"><strong>live → lived</strong>termina em "e": só acrescenta "d"</div>
<p>O som do "-ed" varia: <code>/t/</code> depois de som surdo (worked), <code>/d/</code> depois de som sonoro (played), <code>/ɪd/</code> depois de "t"/"d" (wanted, needed).</p>` },
    },
    {
      title: "Irregulares mais comuns: decore como chunk",
      show: irregulars.flatMap((_, i) => [`pas_irr${i}_box`, `pas_irr${i}_ph`, `pas_irr${i}_mn`]),
      balloon: { anchor: "pas_irr0_box", placement: "top",
        text: "Verbos irregulares não seguem regra — <strong>decore a frase inteira como chunk</strong> (técnica da lição 1), não tente deduzir.",
        why: "São os verbos mais usados do idioma (go, have, see, get, say...). Vale mais a pena memorizar esses 10-15 primeiro do que estudar a lista completa de uma vez.",
        deep: `<p>Mais irregulares de altíssima frequência:</p>
<div class="xp-example"><strong>eat → ate / take → took / make → made</strong>"I ate breakfast." / "She took a photo." / "We made a mistake."</div>` },
      enter: (ctx) => ctx.reveal(irregulars.map((_, i) => `pas_irr${i}_box`), 110),
    },
    {
      title: "“did” também faz pergunta e negativa",
      show: ["pas_did_lbox", "pas_did_lt", "pas_did_lx", "pas_did_rbox", "pas_did_rt", "pas_did_rx"],
      balloon: { anchor: "pas_did_lbox", placement: "top",
        text: "Prévia rápida: <strong>did</strong> também monta perguntas (“Did you see that?”) e negativas (“I didn't go”) no passado — cobrimos isso a fundo nas próximas lições.",
        why: "Ver o padrão desde já ajuda a reconhecer \"did\" em qualquer contexto: afirmativa usa -ed/irregular, pergunta e negativa usam \"did\" + verbo no infinitivo (sem -ed)." },
    },
    {
      title: "Past Continuous: ação interrompida",
      show: ["pas_cont_bar", "pas_cont_l1", "pas_cont_cut", "pas_cont_l2"],
      balloon: { anchor: "pas_cont_cut", placement: "right",
        text: "“I <strong>was watching</strong> TV <strong>when</strong> you called.” — Past Continuous (was/were + verbo-ing) descreve uma ação em andamento, interrompida por um evento pontual no Simple Past.",
        why: "É o padrão clássico para contar uma história: uma ação de fundo (contínua) cortada por algo que aconteceu de repente.",
        deep: `<p>Mais exemplos do mesmo padrão:</p>
<div class="xp-example"><strong>"I was sleeping when the alarm went off."</strong>Eu estava dormindo quando o alarme tocou.</div>
<div class="xp-example"><strong>"While she was cooking, the phone rang."</strong>Enquanto ela cozinhava, o telefone tocou.</div>
<p>Repare: a ação de fundo usa <strong>while/was -ing</strong>, e a interrupção pontual usa <strong>when + Simple Past</strong>.</p>` },
      enter: (ctx) => ctx.drawArrow("pas_cont_cut"),
    },
    {
      title: "“used to”: hábito que acabou",
      show: ["pas_used_box", "pas_used_ph", "pas_used_mn"],
      balloon: { anchor: "pas_used_box", placement: "bottom",
        text: "“I used to play soccer every weekend.” — o chunk <strong>used to + verbo</strong> descreve um hábito do passado que <strong>não existe mais hoje</strong>.",
        why: "É diferente de um evento único no Simple Past: “I played soccer yesterday” fala de UMA vez; “I used to play” fala de um hábito que parou.",
        deep: `<p>Compare os dois:</p>
<div class="xp-example"><strong>"I used to live in Miami."</strong>Eu morava em Miami (não moro mais).</div>
<div class="xp-example"><strong>"I lived in Miami for two years."</strong>Eu morei em Miami por dois anos (fala da duração, não necessariamente contrasta com hoje).</div>` },
    },
    {
      title: "Erros comuns",
      dim: ["pas_irr0_box", "pas_irr1_box", "pas_irr2_box", "pas_irr3_box", "pas_irr4_box"],
      highlight: ["pas_simple_box", "pas_used_box"],
      balloon: { anchor: "pas_simple_box", placement: "bottom",
        text: "Erros clássicos: <strong>regularizar um irregular</strong> (“*I goed*” em vez de “went”), <strong>duplicar o passado</strong> com “did” (“*I didn't went*” em vez de “I didn't go”) e <strong>escrever “use to”</strong> sem o -d (“*I use to play*”).",
        why: "Com \"did\" (negativa/pergunta), o verbo principal volta para a forma base — nunca leva -ed nem é irregular ao mesmo tempo que o \"did\"." },
    },
    {
      title: "Teste rápido",
      balloon: { anchor: "pas_irr0_box", placement: "top", text: "Qual frase está correta? 👇" },
      quiz: {
        question: "Qual frase usa o passado corretamente?",
        options: ["I goed to the store.", "I went to the store.", "I gone to the store.", "I go to the store yesterday."],
        answer: 1,
        explain: "\"Go\" é irregular: o passado é \"went\" (não existe \"goed\"). \"Gone\" é o particípio, usado com \"have\" (present perfect).",
      },
    },
  ];

  window.INGLES_PASSADO_DIAGRAM = {
    title: "Simple Past vs Past Continuous",
    subtitle: "Regulares, irregulares mais comuns, “did” e o chunk “used to”",
    width: W, height: H, autoplayMs: 9000, elements, steps,
  };
})();
