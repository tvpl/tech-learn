/* ============================================================================
 * ingles-present-perfect.data.js — Explicador: Present Perfect
 * A ponte sem tradução direta: experiência de vida, resultado presente e
 * ação que começou no passado e continua. Maior lacuna de quem fala PT-BR.
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

  const elements = [
    // cena 1 — gancho: Simple Past vs Present Perfect
    ...compareRow("pp_hook", 130, "var(--muted)", "Simple Past (já visto)", "“I went to Paris.”",
      "var(--accent)", "Present Perfect (novo)", "“I've been to Paris.”"),

    // cena 2 — formação: have/has + particípio
    ...chunkCard("pp_form1", 100, 260, 520, 100, "I have finished.", "have + particípio (verbo regular)", "var(--accent)"),
    ...chunkCard("pp_form2", 660, 260, 520, 100, "She has left.", "has (3ª pessoa) + particípio", "var(--good)"),

    // cena 3 — experiência de vida
    ...chunkCard("pp_exp1", 100, 390, 520, 100, "Have you ever been to Japan?", "Você já foi ao Japão alguma vez?", "var(--accent-2)"),
    ...chunkCard("pp_exp2", 660, 390, 520, 100, "I've never tried sushi.", "Nunca experimentei sushi.", "var(--warn)"),

    // cena 4 — for vs. since
    ...compareRow("pp_forsince", 520, "var(--accent)", "For (duração)", "“I've lived here for 5 years.”",
      "var(--good)", "Since (ponto de partida)", "“I've worked here since 2019.”"),

    // cena 5 — resultado presente de ação passada
    ...chunkCard("pp_result", 100, 650, 1080, 100, "I've lost my keys.",
      "= não tenho as chaves AGORA — o foco é no resultado, não só no evento passado", "var(--hot)"),

    // cena 6 — o contraste crucial: marcador de tempo específico quebra o Present Perfect
    ...compareRow("pp_crucial", 780, "var(--hot)", "Errado", "“I have seen him yesterday.”",
      "var(--good)", "Certo", "“I saw him yesterday.”"),

    // cena 7 — contração falada + Present Perfect Continuous
    ...chunkCard("pp_cont1", 100, 910, 520, 100, "I've been working out.", "Tenho treinado (ênfase na continuidade recente)", "var(--accent)"),
    ...chunkCard("pp_cont2", 660, 910, 520, 100, "I've been meaning to call you.", "Tenho pensado em te ligar (chunk fixo)", "var(--accent-2)"),
  ];

  const steps = [
    {
      title: "A ponte sem tradução direta",
      show: ["pp_hook_lbox", "pp_hook_lt", "pp_hook_lx", "pp_hook_rbox", "pp_hook_rt", "pp_hook_rx"],
      balloon: { anchor: "pp_hook_rbox", placement: "top",
        text: "“I went to Paris.” e “I've been to Paris.” não são a mesma coisa em inglês — mas em português, “Já fui a Paris” mistura os dois conceitos numa frase só.",
        why: "O Present Perfect não tem equivalente direto em português. Nesta lição você separa duas ideias que seu cérebro está acostumado a tratar como uma só." },
    },
    {
      title: "Formação: have/has + particípio",
      show: ["pp_form1_box", "pp_form1_ph", "pp_form1_mn", "pp_form2_box", "pp_form2_ph", "pp_form2_mn"],
      highlight: ["pp_form1_box"],
      balloon: { anchor: "pp_form1_box", placement: "bottom",
        text: "Present Perfect = <strong>have/has + particípio</strong> (3ª forma do verbo). Verbos regulares usam a mesma forma do passado (+ed); irregulares têm forma própria.",
        why: "É a estrutura que carrega todos os usos que você vai ver nesta lição — decore a formação antes de entrar nas nuances de uso.",
        deep: `<p>Particípios irregulares de altíssima frequência:</p>
<div class="xp-example"><strong>go → gone / be → been / do → done</strong>"I haven't gone yet." / "I've been there." / "I've done it already."</div>
<div class="xp-example"><strong>see → seen / make → made</strong>"Have you seen this?" / "She's made a decision."</div>` },
    },
    {
      title: "Uso 1: experiência de vida",
      show: ["pp_exp1_box", "pp_exp1_ph", "pp_exp1_mn", "pp_exp2_box", "pp_exp2_ph", "pp_exp2_mn"],
      balloon: { anchor: "pp_exp1_box", placement: "bottom",
        text: `“Have you ever been to Japan?” pergunta sobre <strong>experiência de vida</strong>, sem momento específico. "<span class="xp-term" tabindex="0" data-tip="Advérbios usados com Present Perfect pra falar de experiência, sem apontar quando exatamente aconteceu.">Ever</span>"/"never" são os parceiros clássicos desse uso.`,
        why: "Você está perguntando \"isso já aconteceu na sua vida, alguma vez?\" — não \"quando isso aconteceu\", que seria Simple Past.",
        deep: `<p>"Ever" e "never" ficam entre o auxiliar e o particípio:</p>
<div class="xp-example"><strong>"Has she ever tried Brazilian food?"</strong>Ela já experimentou comida brasileira alguma vez?</div>` },
    },
    {
      title: "Uso 2: começou no passado, continua agora",
      show: ["pp_forsince_lbox", "pp_forsince_lt", "pp_forsince_lx", "pp_forsince_rbox", "pp_forsince_rt", "pp_forsince_rx"],
      balloon: { anchor: "pp_forsince_rbox", placement: "top",
        text: "<strong>For</strong> marca <strong>duração</strong> (\"for 5 years\"); <strong>since</strong> marca o <strong>ponto de partida</strong> no tempo (\"since 2019\"). Ambos descrevem algo que começou no passado e continua até agora.",
        why: "Essa é a diferença que mais confunde: nenhum dos dois é sobre um evento pontual — é sobre algo que ainda está acontecendo.",
        deep: `<p>Mais exemplos do mesmo padrão:</p>
<div class="xp-example"><strong>"I've known her for ten years."</strong>Conheço ela há dez anos (e ainda conheço).</div>
<div class="xp-example"><strong>"We've been together since college."</strong>Estamos juntos desde a faculdade.</div>` },
    },
    {
      title: "Uso 3: resultado presente de ação passada",
      show: ["pp_result_box", "pp_result_ph", "pp_result_mn"],
      highlight: ["pp_result_box"],
      balloon: { anchor: "pp_result_box", placement: "bottom",
        text: "“I've lost my keys.” não é só \"perdi as chaves\" — é <strong>\"não tenho as chaves agora\"</strong>. O Present Perfect aqui destaca o <strong>resultado presente</strong>, não o momento em que perdeu.",
        why: "É o uso mais sutil: a ação já terminou, mas a consequência dela ainda importa agora — por isso não usa Simple Past.",
        deep: `<p>Compare com o Simple Past, que só relata o evento:</p>
<div class="xp-example"><strong>"I lost my keys yesterday."</strong>Só conta o que aconteceu ontem — pode já ter encontrado as chaves depois.</div>
<div class="xp-example"><strong>"I've lost my keys."</strong>Ainda estou sem as chaves agora — é por isso que estou falando disso.</div>` },
    },
    {
      title: "O contraste crucial: tempo específico quebra o Present Perfect",
      show: ["pp_crucial_lbox", "pp_crucial_lt", "pp_crucial_lx", "pp_crucial_rbox", "pp_crucial_rt", "pp_crucial_rx"],
      balloon: { anchor: "pp_crucial_rbox", placement: "top",
        text: "Present Perfect <strong>não aceita</strong> marcador de tempo específico (yesterday, last year, in 2020...). Se tem hora marcada, é <strong>Simple Past</strong>: “I saw him yesterday.”, não “*I have seen him yesterday*”.",
        why: "É a regra mais prática pra decidir qual tempo usar: tem \"quando exatamente\" na frase? Simple Past. Não tem? Present Perfect é uma opção.",
        deep: `<p>Mais pares errado/certo:</p>
<div class="xp-bad"><strong>Errado</strong> "I have finished it last night."</div>
<div class="xp-good"><strong>Certo</strong> "I finished it last night." (tempo específico → Simple Past)</div>` },
    },
    {
      title: "Contração falada e Present Perfect Continuous",
      show: ["pp_cont1_box", "pp_cont1_ph", "pp_cont1_mn", "pp_cont2_box", "pp_cont2_ph", "pp_cont2_mn"],
      balloon: { anchor: "pp_cont2_box", placement: "top",
        text: "Na fala, “have” quase sempre contrai: <strong>I've, She's, We've</strong>. E “have/has been + verbo-ing” (Present Perfect Continuous) enfatiza a <strong>duração/repetição recente</strong> de uma atividade.",
        why: "“I've been meaning to call you” é um chunk fixo super comum — decore como bloco pronto, não tente montar palavra por palavra.",
        deep: `<p>Cuidado: “She's” pode ser “she is” OU “she has” — o contexto (o que vem depois) desambigua:</p>
<div class="xp-example"><strong>"She's tired." (is)</strong>vs. <strong>"She's finished." (has)</strong></div>` },
    },
    {
      title: "Prática: identifique o uso",
      dim: ["pp_form1_box", "pp_form2_box"],
      highlight: ["pp_result_box", "pp_crucial_rbox"],
      balloon: { anchor: "pp_result_box", placement: "bottom",
        text: `Antes do quiz, identifique o uso (recall ativo): <em>"Have you ever eaten insects?"</em> (experiência), <em>"I've broken my phone."</em> (resultado presente), <em>"I've been studying since 8am."</em> (começou e continua).`,
        why: "Reconhecer qual dos três usos está em jogo é o que te ajuda a escolher Present Perfect (em vez de Simple Past) na hora de falar." },
    },
    {
      title: "Teste rápido",
      balloon: { anchor: "pp_crucial_rbox", placement: "top",
        text: "Você conheceu seu chefe atual há 3 anos e ainda trabalha com ele. Qual frase soa natural? 👇" },
      quiz: {
        question: "Você conheceu seu chefe atual há 3 anos e ainda trabalha com ele hoje. Qual frase é natural?",
        options: ["I knew him 3 years ago.", "I've known him for 3 years.", "I know him since 3 years.", "I have known him 3 years ago."],
        answer: 1,
        explain: "A relação começou no passado e continua até agora — Present Perfect com \"for\" (duração): \"I've known him for 3 years.\"",
      },
    },
  ];

  window.INGLES_PRESENT_PERFECT_DIAGRAM = {
    title: "Present Perfect: Have/Has + Particípio",
    subtitle: "A ponte sem tradução direta: experiência de vida, resultado presente e ação que continua",
    width: W, height: H, autoplayMs: 9000, elements, steps,
  };
})();
