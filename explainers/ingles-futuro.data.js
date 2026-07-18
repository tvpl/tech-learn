/* ============================================================================
 * ingles-futuro.data.js — Explicador: Will vs Going to vs Present Continuous
 * Como nativos escolhem entre decisão espontânea, plano já feito e
 * compromisso marcado — e a redução falada "gonna".
 * ==========================================================================*/
(function () {
  const W = 1280, H = 930;

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

  // comparação em 3 colunas (mesma situação, 3 formas de futuro)
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
    // cena 1 — aquecimento (used to → futuro)
    ...chunkBlock("fut_warm_past", 260, 130, 300, 80, "Passado (lição anterior)", "used to play", "var(--warn)"),
    ...chunkBlock("fut_warm_fut", 720, 130, 300, 80, "Futuro (hoje)", "will / going to / -ing", "var(--accent)"),
    { id: "fut_warm_arrow", type: "arrow", x1: 560, y1: 170, x2: 720, y2: 170, color: "var(--muted)" },

    // cena 2 — will
    ...chunkCard("fut_will", 100, 250, 1080, 100, "I'll help you with that.", "Will: decisão espontânea/promessa, decidida na hora", "var(--accent)"),

    // cena 3 — going to
    ...chunkCard("fut_goingto", 100, 380, 1080, 100, "I'm going to study abroad next year.", "Going to: plano já decidido antes de falar", "var(--good)"),

    // cena 4 — present continuous pra futuro
    ...chunkCard("fut_pc", 100, 510, 1080, 100, "I'm meeting her at 6.", "Present Continuous: compromisso marcado, com hora/data combinada", "var(--accent-2)"),

    // cena 5 — comparação 3 colunas, mesma situação
    ...compare3("fut_cmp", 640, [
      { color: "var(--accent)", title: "Will (decisão agora)", text: "“I'll call the doctor.”" },
      { color: "var(--good)", title: "Going to (plano)", text: "“I'm going to call the doctor tomorrow.”" },
      { color: "var(--accent-2)", title: "Present Continuous (marcado)", text: "“I'm calling the doctor at 3pm.”" },
    ]),

    // cena 6 — "gonna"
    ...chunkCard("fut_gonna", 100, 800, 1080, 100, "I'm gonna call her.", "“Gonna” = redução falada de “going to” na fala rápida", "var(--hot)"),
  ];

  const steps = [
    {
      title: "Aquecimento: do passado pro futuro",
      show: ["fut_warm_past_box", "fut_warm_past_role", "fut_warm_past_txt", "fut_warm_fut_box", "fut_warm_fut_role",
        "fut_warm_fut_txt", "fut_warm_arrow"],
      balloon: { anchor: "fut_warm_fut_box", placement: "bottom",
        text: "Você já viu \"used to\" para hábitos do passado. Para o <strong>futuro</strong>, o inglês tem <strong>três</strong> formas comuns — e a escolha entre elas muda o sentido da frase.",
        why: "Diferente do português (onde \"vou fazer\" resolve quase tudo), em inglês will/going to/present continuous carregam nuances diferentes de certeza e planejamento." },
      enter: (ctx) => ctx.drawArrow("fut_warm_arrow"),
    },
    {
      title: "Will: decisão espontânea",
      show: ["fut_will_box", "fut_will_ph", "fut_will_mn"],
      highlight: ["fut_will_box"],
      balloon: { anchor: "fut_will_box", placement: "bottom",
        text: "“I'll help you with that.” — <strong>will</strong> serve para decisões tomadas <strong>na hora</strong>, promessas e previsões/opiniões sobre o futuro.",
        why: "Se você está decidindo algo agora mesmo, enquanto fala, \"will\" é a forma natural — não \"going to\", que soa como um plano já pensado antes.",
        deep: `<p>Outros usos de "will":</p>
<div class="xp-example"><strong>Promessa</strong>"I'll call you tomorrow, I promise."</div>
<div class="xp-example"><strong>Previsão/opinião</strong>"I think she'll like the gift."</div>
<p>Contrações faladas: I'll, you'll, she'll, it'll, we'll, they'll — quase sempre reduzidas na fala.</p>` },
    },
    {
      title: "Going to: plano já feito",
      show: ["fut_goingto_box", "fut_goingto_ph", "fut_goingto_mn"],
      highlight: ["fut_goingto_box"],
      balloon: { anchor: "fut_goingto_box", placement: "bottom",
        text: "“I'm going to study abroad next year.” — <strong>going to</strong> descreve um plano <strong>decidido antes</strong> do momento da fala, ou uma previsão baseada em evidência visível agora.",
        why: "Diferente do \"will\" espontâneo, \"going to\" mostra que a decisão (ou a evidência) já existia antes dessa frase.",
        deep: `<p>Evidência visível também usa "going to":</p>
<div class="xp-example"><strong>"Look at those clouds — it's going to rain."</strong>Olha aquelas nuvens — vai chover. (você vê evidência agora)</div>` },
    },
    {
      title: "Present Continuous: compromisso marcado",
      show: ["fut_pc_box", "fut_pc_ph", "fut_pc_mn"],
      highlight: ["fut_pc_box"],
      balloon: { anchor: "fut_pc_box", placement: "bottom",
        text: "“I'm meeting her at 6.” — o mesmo Present Continuous da lição de presente também descreve o futuro quando há <strong>hora, data ou combinado marcado</strong>.",
        why: "É o jeito mais natural de falar da sua agenda: reuniões, viagens marcadas, compromissos já confirmados.",
        deep: `<p>Mais exemplos de compromisso marcado:</p>
<div class="xp-example"><strong>"We're flying to Miami on Friday."</strong>Vamos voar para Miami na sexta (passagem já comprada).</div>` },
    },
    {
      title: "As três lado a lado: a mesma ligação",
      show: ["fut_cmp0_box", "fut_cmp0_t", "fut_cmp0_x", "fut_cmp1_box", "fut_cmp1_t", "fut_cmp1_x",
        "fut_cmp2_box", "fut_cmp2_t", "fut_cmp2_x"],
      balloon: { anchor: "fut_cmp1_box", placement: "top",
        text: "Mesma ação (ligar pro médico), três graus de \"planejamento\": <strong>will</strong> = decidi agora mesmo, <strong>going to</strong> = já tinha decidido, <strong>present continuous</strong> = já está marcado/confirmado.",
        why: "Pense numa escala: quanto mais a decisão já existia antes da frase, mais você se afasta do \"will\" e se aproxima do \"present continuous\".",
        deep: `<p>Dica prática pra escolher na hora de falar:</p>
<div class="xp-good"><strong>Pergunte-se</strong> "Acabei de decidir agora?" → will. "Já tinha decidido?" → going to. "Já está marcado numa agenda?" → present continuous.</div>` },
      enter: (ctx) => ctx.reveal(["fut_cmp0_box", "fut_cmp1_box", "fut_cmp2_box"], 140),
    },
    {
      title: "“Gonna”: a redução falada",
      show: ["fut_gonna_box", "fut_gonna_ph", "fut_gonna_mn"],
      balloon: { anchor: "fut_gonna_box", placement: "top",
        text: "Na fala rápida, “going to” (indicando futuro) vira <strong>“gonna”</strong>: “I'm gonna call her.” Extremamente comum em conversa — nada informal demais para o dia a dia.",
        why: "Reconhecer \"gonna\" no ouvido é essencial — quase ninguém pronuncia \"going to\" por completo numa conversa natural.",
        deep: `<p>Cuidado: “gonna” só reduz o “going to” de <strong>futuro</strong>, não o verbo “go to” (ir para um lugar).</p>
<div class="xp-good"><strong>Reduz</strong> "I'm gonna eat." (= I'm going to eat, futuro)</div>
<div class="xp-bad"><strong>Não reduz assim</strong> "I'm going to the store" não vira "I'm gonna the store" — aqui "going to" é o verbo "ir para", não o auxiliar de futuro</div>` },
    },
    {
      title: "Erros comuns",
      dim: ["fut_will_box", "fut_pc_box"],
      highlight: ["fut_goingto_box"],
      balloon: { anchor: "fut_goingto_box", placement: "bottom",
        text: "Erros comuns: usar <strong>will</strong> quando há evidência visível (\"*it will rain*\" olhando pra nuvem escura — o natural é \"it's going to rain\"), e usar <strong>going to</strong> pra decisões espontâneas (soa como se você já tivesse planejado).",
        why: "A escolha errada não quebra a gramática, mas muda a nuance — soa como se você tivesse mais (ou menos) certeza/planejamento do que realmente tem." },
    },
    {
      title: "Teste rápido",
      balloon: { anchor: "fut_goingto_box", placement: "bottom",
        text: "Você olha pra fora e vê nuvens bem escuras. O que soa mais natural? 👇" },
      quiz: {
        question: "Você vê nuvens escuras agora. Qual frase soa mais natural?",
        options: ["It will rain.", "It's going to rain.", "It's raining tomorrow.", "It rains soon."],
        answer: 1,
        explain: "Evidência visível agora pede \"going to\": “It's going to rain” — \"will\" soa mais como opinião/previsão sem evidência concreta na sua frente.",
      },
    },
  ];

  window.INGLES_FUTURO_DIAGRAM = {
    title: "Will vs Going to vs Present Continuous",
    subtitle: "Como nativos escolhem entre decisão espontânea, plano já feito e compromisso marcado",
    width: W, height: H, autoplayMs: 9000, elements, steps,
  };
})();
