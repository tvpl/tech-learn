/* ============================================================================
 * ingles-negativas.data.js — Explicador: Negativas e Contrações Faladas
 * don't/doesn't/didn't/won't/can't/isn't na fala real, a diferença fonética
 * can/can't, e o "ain't" informal (com nota de registro).
 * ==========================================================================*/
(function () {
  const W = 1280, H = 920;

  const chunkCard = (id, x, y, w, h, phrase, meaning, color) => [
    { id: id + "_box", type: "token", x, y, w, h, rx: 10, fill: color, style: `opacity:0.14;stroke:${color};stroke-width:1.5` },
    { id: id + "_ph", type: "label", x: x + w / 2, y: y + h / 2 - 12, anchor: "middle", label: phrase, mono: true,
      style: `font-size:14px;font-weight:700;fill:${color}` },
    { id: id + "_mn", type: "label", x: x + w / 2, y: y + h / 2 + 16, anchor: "middle", label: meaning,
      style: "font-size:10px;fill:var(--ink-soft)" },
  ];

  const chunkBlock = (id, x, y, w, h, role, text, color) => [
    { id: id + "_box", type: "box", x, y, w, h, rx: 8, fill: color, style: "opacity:0.85" },
    { id: id + "_role", type: "label", x: x + w / 2, y: y - 10, anchor: "middle", label: role,
      style: `font-size:10px;font-weight:700;fill:${color};text-transform:uppercase;letter-spacing:1px` },
    { id: id + "_txt", type: "label", x: x + w / 2, y: y + h / 2 + 6, anchor: "middle", label: text, mono: true,
      style: "font-size:15px;font-weight:600;fill:#fff" },
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

  const beModalNeg = [
    ["isn't", "is not", "var(--accent)"], ["aren't", "are not", "var(--good)"], ["wasn't", "was not", "var(--warn)"],
    ["won't", "will not (irregular!)", "var(--accent-2)"], ["can't", "cannot (uma palavra só!)", "var(--hot)"],
    ["shouldn't", "should not", "var(--accent)"],
  ];

  const elements = [
    // cena 1 — aquecimento
    ...chunkBlock("neg_warm_a", 260, 130, 300, 80, "Lição anterior", "do / does / did", "var(--accent)"),
    ...chunkBlock("neg_warm_b", 720, 130, 300, 80, "Agora", "don't / doesn't / didn't", "var(--good)"),
    { id: "neg_warm_arrow", type: "arrow", x1: 560, y1: 170, x2: 720, y2: 170, color: "var(--muted)" },

    // cena 2 — do-support: completo vs. contraído
    ...compareRow("neg_ds", 250, "var(--muted)", "Completo (raro na fala)", "“I do not like it.”",
      "var(--accent)", "Contraído (normal)", "“I don't like it.”"),

    // cena 3 — be/modais
    ...beModalNeg.flatMap(([ph, mn, color], i) => chunkCard(`neg_bm${i}`, 100 + i * 186, 380, 170, 100, ph, mn, color)),

    // cena 4 — realidade fonética can/can't
    ...compareRow("neg_can", 510, "var(--good)", "can /kən/ (átono)", "“I can go.” — vogal curta, quase “kn”",
      "var(--hot)", "can't /kænt/ (tônico)", "“I can't go.” — vogal mais longa; o “t” final quase some"),

    // cena 5 — "ain't"
    ...chunkCard("neg_aint", 100, 640, 1080, 100, "“I ain't got no time.”",
      "Informal: = I don't have time. Evite em contexto formal/profissional.", "var(--hot)"),

    // cena 6 — dupla negativa (registro)
    ...compareRow("neg_double", 770, "var(--warn)", "Informal (rua/música)", "“I don't want no trouble.”",
      "var(--accent)", "Padrão", "“I don't want any trouble.”"),
  ];

  const steps = [
    {
      title: "Aquecimento: de do/does/did pra negativa",
      show: ["neg_warm_a_box", "neg_warm_a_role", "neg_warm_a_txt", "neg_warm_b_box", "neg_warm_b_role",
        "neg_warm_b_txt", "neg_warm_arrow"],
      balloon: { anchor: "neg_warm_b_box", placement: "bottom",
        text: "Você já usa do/does/did pra perguntar. Agora: os mesmos auxiliares, com <strong>+ not</strong>, formam a negativa — quase sempre <strong>contraída</strong> na fala.",
        why: "Ninguém fala \"I do not like it\" no dia a dia — o normal é \"I don't like it\". Reconhecer e usar a forma contraída é essencial pra soar natural." },
      enter: (ctx) => ctx.drawArrow("neg_warm_arrow"),
    },
    {
      title: "Negação com do-support",
      show: ["neg_ds_lbox", "neg_ds_lt", "neg_ds_lx", "neg_ds_rbox", "neg_ds_rt", "neg_ds_rx"],
      balloon: { anchor: "neg_ds_rbox", placement: "top",
        text: "Estrutura completa: <strong>Subject + do/does/did + not + verbo (base)</strong>. Na prática, quase todo mundo usa a forma contraída: <strong>don't/doesn't/didn't</strong>.",
        why: "A forma completa (\"do not\") soa formal ou enfática (\"I do NOT like it!\") — no dia a dia, contraia sempre.",
        deep: `<p>Lembre: o verbo principal volta para a forma base com \"did\":</p>
<div class="xp-good"><strong>Certo</strong> "She doesn't work here." (não "doesn't works")</div>
<div class="xp-example"><strong>Ênfase proposital</strong>"I do NOT want to go." — separar e dar stress em "do not" é usado só pra enfatizar bastante</div>` },
    },
    {
      title: "Negação com be e modais",
      show: beModalNeg.flatMap((_, i) => [`neg_bm${i}_box`, `neg_bm${i}_ph`, `neg_bm${i}_mn`]),
      balloon: { anchor: "neg_bm4_box", placement: "top",
        text: "Com <strong>be</strong> e <strong>modais</strong>, só acrescenta \"not\" e contrai. Repare em duas irregularidades: <strong>won't</strong> (não \"willn't\") e <strong>can't</strong> (vira uma palavra só, não \"can not\" separado).",
        why: "Essas contrações são tão usadas que soam mais naturais do que a forma completa — decore como chunk, junto com o verbo que elas acompanham.",
        deep: `<p>Mais contrações do dia a dia:</p>
<div class="xp-example"><strong>"I haven't seen it."</strong>Eu não vi.</div>
<div class="xp-example"><strong>"They weren't home."</strong>Eles não estavam em casa.</div>` },
      enter: (ctx) => ctx.reveal(beModalNeg.map((_, i) => `neg_bm${i}_box`), 90),
    },
    {
      title: "can vs. can't: a diferença é o som, não só o \"t\"",
      show: ["neg_can_lbox", "neg_can_lt", "neg_can_lx", "neg_can_rbox", "neg_can_rt", "neg_can_rx"],
      balloon: { anchor: "neg_can_rbox", placement: "top",
        text: "Na fala rápida, o \"t\" final de <strong>can't</strong> quase some. A diferença real que os nativos ouvem é o <strong>som da vogal</strong>: \"can\" é curto e átono, \"can't\" é mais longo e tônico.",
        why: "Se você só prestar atenção no \"t\" pra distinguir can/can't, vai se confundir na fala real — treine o ouvido pra duração/força da vogal.",
        deep: `<p>Dica de shadowing (lição 1): repita em voz alta \"I can go\" e \"I can't go\" seguidas, exagerando a diferença de duração da vogal, até o contraste ficar automático no seu ouvido.</p>` },
    },
    {
      title: "\"ain't\": o chunk informal",
      show: ["neg_aint_box", "neg_aint_ph", "neg_aint_mn"],
      balloon: { anchor: "neg_aint_box", placement: "bottom",
        text: `<span class="xp-term" tabindex="0" data-tip="Contração informal usada no lugar de am not / isn't / aren't / haven't / hasn't.">Ain't</span> substitui am not/isn't/aren't/haven't em fala bem informal, música e alguns dialetos: “I ain't got no time” (não tenho tempo).`,
        why: "É importante <strong>reconhecer</strong> \"ain't\" (você vai ouvir bastante em música e conversa informal), mas evite usá-lo em e-mail profissional, entrevista de emprego ou redação formal.",
        deep: `<p>Mais exemplos de \"ain't\" (informal, comum em música e conversa casual):</p>
<div class="xp-example"><strong>"That ain't right."</strong>Isso não tá certo.</div>
<div class="xp-example"><strong>"You ain't seen nothing yet."</strong>Você ainda não viu nada.</div>
<div class="xp-good"><strong>Em contexto formal, prefira</strong> "I don't have time." / "That isn't right."</div>` },
    },
    {
      title: "Dupla negativa: questão de registro",
      show: ["neg_double_lbox", "neg_double_lt", "neg_double_lx", "neg_double_rbox", "neg_double_rt", "neg_double_rx"],
      balloon: { anchor: "neg_double_rbox", placement: "top",
        text: "“I don't want no trouble” (dupla negativa) é super comum em música e fala informal. No inglês padrão (trabalho, redação), use <strong>uma negativa só</strong>: “I don't want any trouble”.",
        why: "Não é \"errado\" no sentido de incompreensível — é uma questão de <strong>registro</strong>: informal/regional vs. padrão. Saiba reconhecer os dois.",
        deep: `<p>Troca padrão: depois de uma negativa, use <code>any</code> em vez de <code>no</code>:</p>
<div class="xp-example"><strong>"I don't have any money."</strong>não "I don't have no money" (em contexto formal)</div>` },
    },
    {
      title: "Prática: transforme em negativa",
      dim: ["neg_bm0_box", "neg_bm1_box", "neg_bm2_box"],
      highlight: ["neg_ds_rbox", "neg_aint_box"],
      balloon: { anchor: "neg_ds_rbox", placement: "top",
        text: `Antes do quiz, transforme mentalmente (recall ativo): "She likes coffee" → <em>"She doesn't like coffee."</em> "I have finished" → <em>"I haven't finished."</em> "You should go" → <em>"You shouldn't go."</em>`,
        why: "Praticar a transformação afirmativa → negativa em várias estruturas ao mesmo tempo (interleaving) é o que fixa o padrão de verdade." },
    },
    {
      title: "Teste rápido",
      balloon: { anchor: "neg_ds_rbox", placement: "top", text: "Qual frase soa mais natural no dia a dia? 👇" },
      quiz: {
        question: "Qual frase soa mais natural em uma conversa comum (registro padrão)?",
        options: ["I do not like it.", "I don't like it.", "I not like it.", "I no like it."],
        answer: 1,
        explain: "Na fala do dia a dia, a forma contraída \"don't\" é o padrão — \"do not\" soa formal/enfático, e as outras duas não existem em inglês padrão.",
      },
    },
  ];

  window.INGLES_NEGATIVAS_DIAGRAM = {
    title: "Negativas e Contrações Faladas",
    subtitle: "don't/doesn't/didn't/won't/can't/isn't na fala real, e o \"ain't\" informal",
    width: W, height: H, autoplayMs: 9000, elements, steps,
  };
})();
