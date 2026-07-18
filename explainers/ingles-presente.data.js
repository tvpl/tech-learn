/* ============================================================================
 * ingles-presente.data.js — Explicador: Simple Present vs Present Continuous
 * Hábitos/verdades gerais vs. o que está rolando agora — como um nativo
 * escolhe de verdade, incluindo verbos de estado e contrações faladas.
 * ==========================================================================*/
(function () {
  const W = 1280, H = 900;

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
      style: `font-size:16px;font-weight:700;fill:${color}` },
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

  const elements = [
    // cena 1 — aquecimento (recall SVO)
    ...chunkBlock("pre_warm_subj", 260, 130, 150, 80, "Subject", "She", "var(--accent)"),
    ...chunkBlock("pre_warm_verb", 460, 130, 150, 80, "Verb", "works", "var(--good)"),
    ...chunkBlock("pre_warm_place", 660, 130, 200, 80, "Place", "here", "var(--accent-2)"),

    // cena 2 — Simple Present
    ...chunkCard("pre_simple", 100, 250, 1080, 100, "She works at a hospital.",
      "Simple Present: hábito/verdade geral — repare no “-s” da 3ª pessoa (works)", "var(--accent)"),

    // cena 3 — Present Continuous
    ...chunkCard("pre_cont", 100, 380, 1080, 100, "I'm working on it right now.",
      "Present Continuous: am/is/are + verbo-ing — ação acontecendo agora", "var(--good)"),

    // cena 4 — hábito vs. agora
    ...compareRow("pre_cmp", 510, "var(--accent)", "Hábito (Simple Present)", "“I work in marketing.” — permanente",
      "var(--good)", "Agora (Present Continuous)", "“I'm working from home this week.” — temporário"),

    // cena 5 — verbos de estado (não vão para contínuo)
    ...chunkCard("pre_stative1", 100, 630, 520, 90, "“I love this song.”",
      "Verbo de estado: não “I'm loving” (exceto slogans de propaganda)", "var(--warn)"),
    ...chunkCard("pre_stative2", 660, 630, 520, 90, "“I know the answer.”",
      "Verbo de estado: não existe “I'm knowing”", "var(--accent-2)"),

    // cena 6 — contrações faladas
    ...chunkCard("pre_contr1", 100, 750, 520, 90, "“I dunno.”", "= I don't know (bem falado/informal)", "var(--hot)"),
    ...chunkCard("pre_contr2", 660, 750, 520, 90, "“Whatcha doing?”", "= What are you doing? (fala rápida)", "var(--accent)"),
  ];

  const steps = [
    {
      title: "Aquecimento: lembra da ordem SVO?",
      show: ["pre_warm_subj_box", "pre_warm_subj_role", "pre_warm_subj_txt", "pre_warm_verb_box", "pre_warm_verb_role",
        "pre_warm_verb_txt", "pre_warm_place_box", "pre_warm_place_role", "pre_warm_place_txt"],
      balloon: { anchor: "pre_warm_verb_box", placement: "bottom",
        text: "“She works here.” — Subject → Verb → Place, igual você viu na lição anterior. Agora vamos decidir <strong>qual forma do verbo</strong> usar: hábito ou algo acontecendo agora.",
        why: "Antes de aprender tempos verbais novos, é essencial já ter a ordem da frase automática — é nela que o verbo vai encaixar." },
    },
    {
      title: "Simple Present: hábitos e verdades gerais",
      show: ["pre_simple_box", "pre_simple_ph", "pre_simple_mn"],
      highlight: ["pre_simple_box"],
      balloon: { anchor: "pre_simple_box", placement: "bottom",
        text: `“She <strong>works</strong> at a hospital.” Simple Present descreve <span class="xp-term" tabindex="0" data-tip="Algo que se repete/é sempre verdade, não algo pontual acontecendo agora.">hábitos e verdades gerais</span>. Com he/she/it, o verbo ganha <strong>-s</strong>.`,
        why: "É o tempo verbal mais usado para falar de rotina, profissão e fatos — a base de qualquer apresentação pessoal.",
        deep: `<p>A regra do -s na 3ª pessoa tem algumas variações:</p>
<div class="xp-example"><strong>go → goes / do → does / have → has</strong>She goes to work by bus. / He does the dishes. / It has four legs.</div>
<div class="xp-example"><strong>study → studies</strong>consoante + y vira "ies": He studies English.</div>
<div class="xp-bad"><strong>Erro comum</strong> "She work here" (esqueceu o -s)</div>` },
    },
    {
      title: "Present Continuous: agora mesmo",
      show: ["pre_cont_box", "pre_cont_ph", "pre_cont_mn"],
      highlight: ["pre_cont_box"],
      balloon: { anchor: "pre_cont_box", placement: "bottom",
        text: "“I'm working on it right now.” Present Continuous = <strong>am/is/are + verbo-ing</strong>, para algo em andamento neste exato momento (ou período temporário).",
        why: "É o tempo que você usa pra descrever o que está rolando agora — muito comum em conversa do dia a dia (\"What are you doing?\").",
        deep: `<p>Regras de ortografia do -ing:</p>
<div class="xp-example"><strong>run → running</strong>dobra a consoante final (sílaba tônica curta)</div>
<div class="xp-example"><strong>write → writing</strong>tira o "e" mudo antes de -ing</div>
<div class="xp-example"><strong>Contrações faladas</strong>I'm working / She's coming / We're leaving</div>` },
    },
    {
      title: "Hábito vs. agora: como escolher",
      show: ["pre_cmp_lbox", "pre_cmp_lt", "pre_cmp_lx", "pre_cmp_rbox", "pre_cmp_rt", "pre_cmp_rx"],
      balloon: { anchor: "pre_cmp_rbox", placement: "top",
        text: "Mesmo verbo, tempos diferentes: <strong>“I work in marketing”</strong> descreve sua profissão (permanente). <strong>“I'm working from home this week”</strong> descreve algo temporário, só essa semana.",
        why: "A pergunta certa é: isso é uma característica/rotina (Simple Present) ou algo pontual/temporário (Present Continuous)?",
        deep: `<p>Mais um par de contraste:</p>
<div class="xp-example"><strong>"He plays soccer."</strong>Ele joga futebol (hobby/rotina).</div>
<div class="xp-example"><strong>"He's playing soccer right now."</strong>Ele está jogando futebol neste instante.</div>` },
    },
    {
      title: "Verbos de estado não vão para o contínuo",
      show: ["pre_stative1_box", "pre_stative1_ph", "pre_stative1_mn", "pre_stative2_box", "pre_stative2_ph", "pre_stative2_mn"],
      balloon: { anchor: "pre_stative1_box", placement: "top",
        text: "Verbos que descrevem <strong>estado</strong> (love, know, want, need, believe, hate) quase nunca usam -ing, mesmo falando do presente: “I love this song”, não “*I'm loving this song*”.",
        why: "Eles descrevem uma condição contínua por natureza, não uma ação que \"está acontecendo\" — por isso não combinam com o -ing.",
        deep: `<p>Outros verbos de estado comuns: <code>know, believe, want, need, prefer, understand, seem, own</code>.</p>
<div class="xp-example"><strong>Exceção conhecida</strong>"I'm loving it" (slogan do McDonald's) é proposital e informal — não use assim numa conversa normal.</div>` },
    },
    {
      title: "Contrações faladas do dia a dia",
      show: ["pre_contr1_box", "pre_contr1_ph", "pre_contr1_mn", "pre_contr2_box", "pre_contr2_ph", "pre_contr2_mn"],
      balloon: { anchor: "pre_contr2_box", placement: "top",
        text: "Na fala rápida, “I don't know” vira <strong>“I dunno”</strong> e “What are you doing?” vira <strong>“Whatcha doing?”</strong> — reduções normais, não erro.",
        why: "Reconhecer essas reduções no ouvido é tão importante quanto saber escrever a forma completa — é assim que nativos realmente falam.",
        deep: `<p>Mais reduções comuns no presente:</p>
<div class="xp-example"><strong>"Whaddya want?"</strong>= What do you want?</div>
<div class="xp-example"><strong>"D'ya like it?"</strong>= Do you like it?</div>` },
    },
    {
      title: "Erros comuns",
      dim: ["pre_stative1_box", "pre_stative2_box", "pre_contr1_box", "pre_contr2_box"],
      highlight: ["pre_simple_box", "pre_cont_box"],
      balloon: { anchor: "pre_simple_box", placement: "bottom",
        text: "Os três erros mais comuns: <strong>esquecer o -s</strong> na 3ª pessoa (“*she work*”), <strong>usar -ing com verbo de estado</strong> (“*I'm knowing*”) e <strong>esquecer o verbo auxiliar</strong> em perguntas/negativas (vem na próxima lição).",
        why: "Os dois primeiros vêm de misturar as duas formas — lembre: hábito usa -s, ação agora usa -ing, e verbo de estado não usa -ing." },
    },
    {
      title: "Teste rápido",
      balloon: { anchor: "pre_simple_box", placement: "bottom", text: "Qual frase está correta? 👇" },
      quiz: {
        question: "Qual frase está correta no Simple Present?",
        options: ["She work at a hospital.", "She works at a hospital.", "She working at a hospital.", "She is works at a hospital."],
        answer: 1,
        explain: "Na 3ª pessoa do singular (he/she/it), o Simple Present sempre leva -s: \"She works...\".",
      },
    },
  ];

  window.INGLES_PRESENTE_DIAGRAM = {
    title: "Simple Present vs Present Continuous",
    subtitle: "Hábitos e verdades gerais vs. o que está rolando agora",
    width: W, height: H, autoplayMs: 9000, elements, steps,
  };
})();
