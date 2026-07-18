/* ============================================================================
 * ingles-modais.data.js — Explicador: Verbos Modais como Chunks
 * Can/could/should/must/have to/would como blocos prontos de fluência,
 * não regras soltas — com as reduções faladas gotta/hafta/shoulda-coulda-woulda.
 * ==========================================================================*/
(function () {
  const W = 1280, H = 970;

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

  const reducedExamples = [
    ["gotta", "= (have) got to — “I gotta go.”", "var(--hot)"],
    ["hafta", "= have to — “I hafta work.”", "var(--accent)"],
    ["shoulda/coulda/woulda", "= should/could/would have — arrependimento", "var(--accent-2)"],
  ];

  const elements = [
    // cena 1 — aquecimento
    ...chunkBlock("mod_warm_a", 260, 130, 300, 80, "Lição anterior", "can't / shouldn't", "var(--accent)"),
    ...chunkBlock("mod_warm_b", 720, 130, 300, 80, "Agora", "os modais por completo", "var(--good)"),
    { id: "mod_warm_arrow", type: "arrow", x1: 560, y1: 170, x2: 720, y2: 170, color: "var(--muted)" },

    // cena 2 — can/could
    ...chunkCard("mod_can", 100, 250, 520, 100, "I can swim.", "Habilidade/possibilidade atual", "var(--accent)"),
    ...chunkCard("mod_could", 660, 250, 520, 100, "I could help you tomorrow.", "Possibilidade mais educada/hipotética", "var(--good)"),

    // cena 3 — should/must/have to (grau de obrigação)
    ...compare3("mod_oblig", 380, [
      { color: "var(--good)", title: "Should (conselho)", text: "“You should see a doctor.”" },
      { color: "var(--hot)", title: "Must (regra/obrigação forte)", text: "“You must wear a seatbelt.”" },
      { color: "var(--accent)", title: "Have to (circunstância)", text: "“I have to work tomorrow.”" },
    ]),

    // cena 4 — pedidos educados
    ...chunkCard("mod_would", 100, 560, 520, 100, "Would you mind closing the door?", "Pedido educado/formal", "var(--accent-2)"),
    ...chunkCard("mod_couldreq", 660, 560, 520, 100, "Could you pass the salt?", "Pedido educado/casual, muito comum", "var(--warn)"),

    // cena 5 — reduções faladas
    ...reducedExamples.flatMap(([ph, mn, color], i) => chunkCard(`mod_red${i}`, 100 + i * 360, 690, 340, 100, ph, mn, color)),

    // cena 6 — erro comum: modal + "to"
    ...compareRow("mod_err", 820, "var(--hot)", "Errado", "“I must to go.”", "var(--good)", "Certo", "“I must go.” (sem “to” depois de modal)"),
  ];

  const steps = [
    {
      title: "Aquecimento: os modais completos",
      show: ["mod_warm_a_box", "mod_warm_a_role", "mod_warm_a_txt", "mod_warm_b_box", "mod_warm_b_role",
        "mod_warm_b_txt", "mod_warm_arrow"],
      balloon: { anchor: "mod_warm_b_box", placement: "bottom",
        text: "Você já usou <strong>can't</strong> e <strong>shouldn't</strong> na negativa. Agora vamos ver os modais como <strong>chunks funcionais</strong>: cada um carrega uma nuance de possibilidade, obrigação ou educação.",
        why: "Modal errado não quebra a comunicação, mas muda o tom — usar \"must\" onde o natural é \"have to\" pode soar mandão ou formal demais." },
      enter: (ctx) => ctx.drawArrow("mod_warm_arrow"),
    },
    {
      title: "Can / Could: habilidade e possibilidade",
      show: ["mod_can_box", "mod_can_ph", "mod_can_mn", "mod_could_box", "mod_could_ph", "mod_could_mn"],
      balloon: { anchor: "mod_can_box", placement: "bottom",
        text: "“I can swim.” = habilidade/possibilidade <strong>agora</strong>. “I could help you tomorrow.” = possibilidade mais <strong>educada ou hipotética</strong> — poderia, se precisasse.",
        why: "\"Could\" soa mais suave e menos direto que \"can\" — ótimo para oferecer ajuda ou fazer sugestões sem parecer impositivo.",
        deep: `<p>\"Could\" também é o passado de \"can\" para habilidade:</p>
<div class="xp-example"><strong>"I could swim when I was five."</strong>Eu sabia nadar quando tinha cinco anos.</div>` },
    },
    {
      title: "Should / Must / Have to: o grau de obrigação",
      show: ["mod_oblig0_box", "mod_oblig0_t", "mod_oblig0_x", "mod_oblig1_box", "mod_oblig1_t", "mod_oblig1_x",
        "mod_oblig2_box", "mod_oblig2_t", "mod_oblig2_x"],
      balloon: { anchor: "mod_oblig2_box", placement: "top",
        text: "<strong>Should</strong> é conselho/sugestão (mais fraco). <strong>Must</strong> é regra forte ou sentimento pessoal intenso. <strong>Have to</strong> é obrigação por circunstância externa — e é <strong>muito mais comum na fala do dia a dia americano</strong> do que \"must\".",
        why: "\"Must\" soa formal ou até \"mandão\" numa conversa casual — um nativo geralmente diz \"I have to work tomorrow\", não \"I must work tomorrow\".",
        deep: `<p>\"Must\" aparece mais em placas, regras escritas e regulamentos:</p>
<div class="xp-example"><strong>"Employees must wash hands."</strong>(placa/regra escrita)</div>
<div class="xp-example"><strong>"I have to leave early today."</strong>(fala natural do dia a dia)</div>` },
      enter: (ctx) => ctx.reveal(["mod_oblig0_box", "mod_oblig1_box", "mod_oblig2_box"], 140),
    },
    {
      title: "Pedidos educados: Would / Could",
      show: ["mod_would_box", "mod_would_ph", "mod_would_mn", "mod_couldreq_box", "mod_couldreq_ph", "mod_couldreq_mn"],
      balloon: { anchor: "mod_couldreq_box", placement: "bottom",
        text: "“Would you mind closing the door?” é um pedido mais formal/educado. “Could you pass the salt?” é o pedido educado mais comum no dia a dia — casual mas gentil.",
        why: "Usar \"could\"/\"would\" em vez de imperativo (\"Close the door!\") é o que faz um pedido soar naturalmente educado em inglês.",
        deep: `<p>Note que “Would you mind + verbo-ing” tecnicamente pede uma resposta invertida:</p>
<div class="xp-example"><strong>"Would you mind closing the door?" → "Not at all!"</strong>("Not at all" = "claro, sem problema", não "sim, eu me importo")</div>` },
    },
    {
      title: "Reduções faladas: gotta, hafta, shoulda/coulda/woulda",
      show: reducedExamples.flatMap((_, i) => [`mod_red${i}_box`, `mod_red${i}_ph`, `mod_red${i}_mn`]),
      balloon: { anchor: "mod_red0_box", placement: "top",
        text: "Na fala rápida: “(have) got to” vira <strong>gotta</strong>, “have to” vira <strong>hafta</strong>, e “should/could/would have” viram <strong>shoulda/coulda/woulda</strong> (comum pra expressar arrependimento).",
        why: "\"Shoulda/coulda/woulda\" é praticamente uma expressão fixa em inglês falado: \"I shoulda called you\" (eu deveria ter ligado).",
        deep: `<p>Exemplo de arrependimento completo:</p>
<div class="xp-example"><strong>"I coulda gone, but I was tired."</strong>Eu poderia ter ido, mas estava cansado.</div>` },
      enter: (ctx) => ctx.reveal(["mod_red0_box", "mod_red1_box", "mod_red2_box"], 130),
    },
    {
      title: "Erro comum: modal nunca leva \"to\" direto",
      show: ["mod_err_lbox", "mod_err_lt", "mod_err_lx", "mod_err_rbox", "mod_err_rt", "mod_err_rx"],
      balloon: { anchor: "mod_err_rbox", placement: "top",
        text: "Modais verdadeiros (can, could, should, must, will, would) <strong>nunca</strong> levam \"to\" logo depois: “I must to go” está errado — o certo é “I must go”.",
        why: "\"Have to\" e \"ought to\" são exceções (chamados semi-modais) que sim usam \"to\" — mas os modais clássicos, não.",
        deep: `<p>Compare:</p>
<div class="xp-good"><strong>Modal puro (sem "to")</strong> "You should call her." / "I can help."</div>
<div class="xp-example"><strong>Semi-modal (com "to")</strong> "I have to go." / "You ought to apologize."</div>` },
    },
    {
      title: "Prática: escolha o modal certo",
      dim: ["mod_can_box", "mod_could_box"],
      highlight: ["mod_oblig2_box", "mod_would_box"],
      balloon: { anchor: "mod_oblig2_box", placement: "top",
        text: `Pense no contexto certo (recall ativo): pedir educadamente pra alguém abrir a janela → <em>"Could you open the window?"</em>. Falar de uma obrigação de trabalho → <em>"I have to finish this report."</em>. Dar um conselho a um amigo → <em>"You should rest more."</em>`,
        why: "Escolher o modal certo por contexto (habilidade, obrigação ou pedido) é o que faz sua fala soar natural, não só gramaticalmente correta." },
    },
    {
      title: "Teste rápido",
      balloon: { anchor: "mod_oblig2_box", placement: "top",
        text: "Você não tem carro e precisa mesmo pegar aquele voo amanhã de manhã. O que soa mais natural? 👇" },
      quiz: {
        question: "Você precisa mesmo pegar um voo amanhã de manhã (circunstância, não uma regra escrita). O que um americano diria naturalmente?",
        options: ["I must catch that flight.", "I have to catch that flight.", "I should catch that flight.", "I could catch that flight."],
        answer: 1,
        explain: "\"Have to\" é o modal do dia a dia para obrigação por circunstância. \"Must\" soaria formal/intenso demais para essa situação comum.",
      },
    },
  ];

  window.INGLES_MODAIS_DIAGRAM = {
    title: "Verbos Modais como Chunks de Fluência",
    subtitle: "Can/could/should/must/have to/would como blocos prontos, não regras soltas",
    width: W, height: H, autoplayMs: 9000, elements, steps,
  };
})();
