/* ============================================================================
 * ingles-perguntas.data.js — Explicador: Perguntas Naturais
 * Do/does/did, inversão com be/modais, wh-questions, reduções faladas e
 * tag questions que soam naturais.
 * ==========================================================================*/
(function () {
  const W = 1280, H = 1060;

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
      style: `font-size:14px;font-weight:700;fill:${color}` },
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

  const whExamples = [
    ["What are you doing?", "O que você está fazendo?", "var(--accent)"],
    ["Where did you go?", "Onde você foi?", "var(--good)"],
    ["Why does he always do that?", "Por que ele sempre faz isso?", "var(--warn)"],
  ];
  const beModalExamples = [
    ["Are you okay?", "Você está bem?", "var(--accent-2)"],
    ["Can you help me?", "Você pode me ajudar?", "var(--hot)"],
    ["Have you eaten?", "Você já comeu?", "var(--accent)"],
  ];
  const reducedExamples = [
    ["Whatcha doing?", "= What are you doing?", "var(--hot)"],
    ["Wanna come?", "= Do you want to come?", "var(--accent)"],
    ["Didja see that?", "= Did you see that?", "var(--good)"],
  ];

  const elements = [
    // cena 1 — aquecimento
    ...chunkBlock("prg_warm_a", 260, 130, 300, 80, "Lição anterior", "will / going to / -ing", "var(--accent)"),
    ...chunkBlock("prg_warm_b", 720, 130, 300, 80, "Agora", "como perguntar tudo isso?", "var(--good)"),
    { id: "prg_warm_arrow", type: "arrow", x1: 560, y1: 170, x2: 720, y2: 170, color: "var(--muted)" },

    // cena 2 — do-support (estrutura + exemplo)
    ...chunkBlock("prg_ds_aux", 100, 250, 200, 90, "Aux", "Do", "var(--accent)"),
    ...chunkBlock("prg_ds_subj", 340, 250, 200, 90, "Subject", "you", "var(--good)"),
    ...chunkBlock("prg_ds_verb", 580, 250, 500, 90, "Verb + …", "like coffee?", "var(--warn)"),
    { id: "prg_ds_a1", type: "arrow", x1: 300, y1: 295, x2: 340, y2: 295, color: "var(--muted)" },
    { id: "prg_ds_a2", type: "arrow", x1: 540, y1: 295, x2: 580, y2: 295, color: "var(--muted)" },
    ...chunkCard("prg_ds_ex1", 100, 380, 340, 90, "“Do you like coffee?”", "presente, sujeito comum", "var(--accent)"),
    ...chunkCard("prg_ds_ex2", 460, 380, 340, 90, "“Does she work here?”", "presente, 3ª pessoa", "var(--good)"),
    ...chunkCard("prg_ds_ex3", 820, 380, 340, 90, "“Did you see that?”", "passado, todo mundo", "var(--warn)"),

    // cena 3 — wh-questions
    ...whExamples.flatMap(([ph, mn, color], i) => chunkCard(`prg_wh${i}`, 100 + i * 360, 510, 340, 100, ph, mn, color)),

    // cena 4 — be/modais (sem do-support)
    ...beModalExamples.flatMap(([ph, mn, color], i) => chunkCard(`prg_bm${i}`, 100 + i * 360, 640, 340, 100, ph, mn, color)),

    // cena 5 — reduções faladas
    ...reducedExamples.flatMap(([ph, mn, color], i) => chunkCard(`prg_red${i}`, 100 + i * 360, 770, 340, 100, ph, mn, color)),

    // cena 6 — tag questions
    ...compareRow("prg_tag", 900, "var(--accent)", "Afirmativa + tag negativa", "“You're coming, aren't you?”",
      "var(--hot)", "Negativa + tag positiva", "“She doesn't like it, does she?”"),
  ];

  const steps = [
    {
      title: "Aquecimento: hora de perguntar",
      show: ["prg_warm_a_box", "prg_warm_a_role", "prg_warm_a_txt", "prg_warm_b_box", "prg_warm_b_role",
        "prg_warm_b_txt", "prg_warm_arrow"],
      balloon: { anchor: "prg_warm_b_box", placement: "bottom",
        text: "Você já sabe afirmar no presente, passado e futuro. Agora: como transformar essas frases em <strong>perguntas</strong> naturais?",
        why: "Diferente do português (que muda só a entonação: \"Você gosta de café?\"), o inglês quase sempre precisa de um <strong>auxiliar</strong> no início da pergunta." },
      enter: (ctx) => ctx.drawArrow("prg_warm_arrow"),
    },
    {
      title: "Yes/No com do-support",
      show: ["prg_ds_aux_box", "prg_ds_aux_role", "prg_ds_aux_txt", "prg_ds_subj_box", "prg_ds_subj_role",
        "prg_ds_subj_txt", "prg_ds_verb_box", "prg_ds_verb_role", "prg_ds_verb_txt", "prg_ds_a1", "prg_ds_a2",
        "prg_ds_ex1_box", "prg_ds_ex1_ph", "prg_ds_ex1_mn", "prg_ds_ex2_box", "prg_ds_ex2_ph", "prg_ds_ex2_mn",
        "prg_ds_ex3_box", "prg_ds_ex3_ph", "prg_ds_ex3_mn"],
      balloon: { anchor: "prg_ds_verb_box", placement: "bottom",
        text: "Com verbos comuns, a pergunta é <strong>Aux + Subject + Verbo (base)</strong>: <code>Do</code>/<code>Does</code> no presente, <code>Did</code> no passado — sempre com o verbo principal na forma base.",
        why: "É o padrão mais comum de pergunta em inglês — dominar \"do-support\" resolve a maioria das perguntas do dia a dia.",
        deep: `<p>Repare que o verbo principal <strong>nunca</strong> muda quando há auxiliar:</p>
<div class="xp-good"><strong>Certo</strong> "Does she work here?" (não "Does she works")</div>
<div class="xp-bad"><strong>Erro comum</strong> "Does she works here?" (verbo duplicado no tempo)</div>` },
      enter: (ctx) => { ctx.drawArrow("prg_ds_a1"); ctx.drawArrow("prg_ds_a2"); },
    },
    {
      title: "Wh-questions",
      show: whExamples.flatMap((_, i) => [`prg_wh${i}_box`, `prg_wh${i}_ph`, `prg_wh${i}_mn`]),
      balloon: { anchor: "prg_wh0_box", placement: "top",
        text: "Para perguntar <strong>o quê, onde, por quê, quando, como</strong>: coloque a palavra Wh- antes do auxiliar. <strong>Wh + Aux + Subject + Verbo</strong>.",
        why: "A estrutura é a mesma do do-support, só com a palavra interrogativa na frente — não precisa aprender uma regra nova.",
        deep: `<p>O mesmo padrão vale com qualquer tempo verbal:</p>
<div class="xp-example"><strong>"When will you arrive?"</strong>Quando você vai chegar?</div>
<div class="xp-example"><strong>"How do you make this?"</strong>Como você faz isso?</div>` },
      enter: (ctx) => ctx.reveal(["prg_wh0_box", "prg_wh1_box", "prg_wh2_box"], 130),
    },
    {
      title: "Perguntas sem do-support",
      show: beModalExamples.flatMap((_, i) => [`prg_bm${i}_box`, `prg_bm${i}_ph`, `prg_bm${i}_mn`]),
      balloon: { anchor: "prg_bm0_box", placement: "top",
        text: "Com <strong>be</strong> (am/is/are/was/were) e <strong>modais</strong> (can, could, should, will, have), não existe do-support — o próprio verbo/modal vai para o início.",
        why: "Esses verbos já funcionam como auxiliares sozinhos, então adicionar \"do\" seria redundante (e soa muito estranho: \"*Do you are okay?*\").",
        deep: `<p>Mais exemplos sem do-support:</p>
<div class="xp-example"><strong>"Is she coming?"</strong>Ela vem?</div>
<div class="xp-example"><strong>"Should I call him?"</strong>Eu deveria ligar pra ele?</div>` },
      enter: (ctx) => ctx.reveal(["prg_bm0_box", "prg_bm1_box", "prg_bm2_box"], 130),
    },
    {
      title: "Reduções faladas em perguntas",
      show: reducedExamples.flatMap((_, i) => [`prg_red${i}_box`, `prg_red${i}_ph`, `prg_red${i}_mn`]),
      balloon: { anchor: "prg_red0_box", placement: "top",
        text: "Na fala rápida, “What are you” vira <strong>“Whatcha”</strong>, “Do you want to” vira <strong>“Wanna”</strong>, e “Did you” vira <strong>“Didja”</strong>.",
        why: "São reduções normais em conversa informal — reconhecer no ouvido evita ficar perdido quando um nativo fala rápido.",
        deep: `<p>Mais uma bem comum:</p>
<div class="xp-example"><strong>"Watcha gonna do?"</strong>= What are you going to do?</div>` },
      enter: (ctx) => ctx.reveal(["prg_red0_box", "prg_red1_box", "prg_red2_box"], 130),
    },
    {
      title: "Tag questions",
      show: ["prg_tag_lbox", "prg_tag_lt", "prg_tag_lx", "prg_tag_rbox", "prg_tag_rt", "prg_tag_rx"],
      balloon: { anchor: "prg_tag_rbox", placement: "top",
        text: "Tag question = uma \"mini pergunta\" no fim pra confirmar algo: <strong>afirmativa pede tag negativa</strong> (“aren't you?”) e <strong>negativa pede tag positiva</strong> (“does she?”).",
        why: "É um recurso de conversa muito natural em inglês falado — usado o tempo todo para checar informação ou puxar concordância.",
        deep: `<p>Mais exemplos de tag question:</p>
<div class="xp-example"><strong>"It's cold today, isn't it?"</strong>Está frio hoje, não está?</div>
<div class="xp-example"><strong>"You haven't seen it, have you?"</strong>Você não viu, viu?</div>` },
    },
    {
      title: "Prática: misture os padrões",
      dim: ["prg_ds_ex1_box", "prg_ds_ex2_box", "prg_ds_ex3_box"],
      highlight: ["prg_wh0_box", "prg_bm0_box", "prg_tag_rbox"],
      balloon: { anchor: "prg_wh0_box", placement: "top",
        text: `Antes do quiz, tente classificar mentalmente (recall ativo): “<em>Have you finished?</em>” (sem do-support), “<em>Why don't you call her?</em>” (wh + do-support) e “<em>You like it, don't you?</em>” (tag question).`,
        why: "Misturar os padrões de propósito (interleaving) é o que treina você a reconhecer qual regra usar em tempo real, na conversa — não só em exercício isolado." },
    },
    {
      title: "Teste rápido",
      balloon: { anchor: "prg_ds_verb_box", placement: "bottom", text: "Qual pergunta está correta? 👇" },
      quiz: {
        question: "Qual pergunta está correta?",
        options: ["What you are doing?", "What are you doing?", "What do you are doing?", "You are doing what?"],
        answer: 1,
        explain: "Com \"be\", não há do-support: o próprio \"are\" se move para antes do sujeito — \"What are you doing?\".",
      },
    },
  ];

  window.INGLES_PERGUNTAS_DIAGRAM = {
    title: "Perguntas Naturais",
    subtitle: "Do/does/did, inversão com be/modais, wh-questions e tag questions",
    width: W, height: H, autoplayMs: 9000, elements, steps,
  };
})();
