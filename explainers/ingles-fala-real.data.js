/* ============================================================================
 * ingles-fala-real.data.js — Explicador: Como os Americanos Falam de Verdade
 * Grand finale da trilha: gonna/wanna/gotta/kinda/sorta, linking de sons,
 * redução vocálica (schwa) e o ritmo stress-timed do inglês falado.
 * ==========================================================================*/
(function () {
  const W = 1280, H = 1080;

  const chunkCard = (id, x, y, w, h, phrase, meaning, color) => [
    { id: id + "_box", type: "token", x, y, w, h, rx: 10, fill: color, style: `opacity:0.14;stroke:${color};stroke-width:1.5` },
    { id: id + "_ph", type: "label", x: x + w / 2, y: y + h / 2 - 12, anchor: "middle", label: phrase, mono: true,
      style: `font-size:13px;font-weight:700;fill:${color}` },
    { id: id + "_mn", type: "label", x: x + w / 2, y: y + h / 2 + 16, anchor: "middle", label: meaning,
      style: "font-size:10px;fill:var(--ink-soft)" },
  ];

  const CMP_LEFT_X = 100, CMP_RIGHT_X = 660, CMP_H = 90;
  const compareRow = (id, y, leftColor, leftTitle, leftText, rightColor, rightTitle, rightText, w = 520) => [
    { id: id + "_lbox", type: "box", x: CMP_LEFT_X, y, w, h: CMP_H, rx: 10, fill: leftColor, style: "opacity:0.12" },
    { id: id + "_lt", type: "label", x: CMP_LEFT_X + w / 2, y: y + 24, anchor: "middle", label: leftTitle,
      style: `font-size:11px;font-weight:700;fill:${leftColor};text-transform:uppercase;letter-spacing:1px` },
    { id: id + "_lx", type: "label", x: CMP_LEFT_X + w / 2, y: y + 54, anchor: "middle", label: leftText, mono: true,
      style: "font-size:12.5px;fill:var(--ink)" },
    { id: id + "_rbox", type: "box", x: CMP_RIGHT_X, y, w, h: CMP_H, rx: 10, fill: rightColor, style: "opacity:0.12" },
    { id: id + "_rt", type: "label", x: CMP_RIGHT_X + w / 2, y: y + 24, anchor: "middle", label: rightTitle,
      style: `font-size:11px;font-weight:700;fill:${rightColor};text-transform:uppercase;letter-spacing:1px` },
    { id: id + "_rx", type: "label", x: CMP_RIGHT_X + w / 2, y: y + 54, anchor: "middle", label: rightText, mono: true,
      style: "font-size:12.5px;fill:var(--ink)" },
  ];

  const recap = [
    ["Estrutura", "\"I love pizza.\"", "var(--accent)"],
    ["Presente", "\"I'm working on it.\"", "var(--good)"],
    ["Passado", "\"I went home.\"", "var(--warn)"],
    ["Futuro", "\"I'm gonna call her.\"", "var(--accent-2)"],
    ["Perguntas", "\"Whatcha doing?\"", "var(--hot)"],
    ["Negativas", "\"I dunno.\"", "var(--accent)"],
    ["Modais", "\"I gotta go.\"", "var(--good)"],
    ["Técnicas", "Fale sempre em voz alta!", "var(--warn)"],
  ];
  const reductions = [
    ["going to → gonna", "\"I'm gonna call her.\"", "var(--accent)"],
    ["want to → wanna", "\"I wanna come.\"", "var(--good)"],
    ["got to → gotta", "\"I gotta run.\"", "var(--warn)"],
    ["kind of → kinda", "\"It's kinda cold.\"", "var(--accent-2)"],
    ["sort of → sorta", "\"I sorta agree.\"", "var(--hot)"],
  ];

  const elements = [
    // cena 1 — revisão relâmpago
    ...recap.flatMap(([ph, mn, color], i) => chunkCard(`fala_rec${i}`, 100 + i * 140, 130, 130, 90, ph, mn, color)),

    // cena 2 — gonna/wanna/gotta/kinda/sorta
    ...reductions.flatMap(([ph, mn, color], i) => chunkCard(`fala_red${i}`, 100 + i * 236, 260, 220, 100, ph, mn, color)),

    // cena 3 — linking de sons
    { id: "fala_link_w1", type: "label", x: 250, y: 420, anchor: "middle", mono: true, label: "an",
      style: "font-size:22px;font-weight:700;fill:var(--warn)" },
    { id: "fala_link_w2", type: "label", x: 420, y: 420, anchor: "middle", mono: true, label: "apple",
      style: "font-size:22px;font-weight:700;fill:var(--warn)" },
    { id: "fala_link_arc", type: "arrow", path: "M270,432 Q335,472 400,432", color: "var(--warn)", noHead: true },
    { id: "fala_link_cap", type: "label", x: 335, y: 500, anchor: "middle", label: "soa como: “a-napple”",
      style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "fala_link_w3", type: "label", x: 640, y: 420, anchor: "middle", mono: true, label: "not",
      style: "font-size:22px;font-weight:700;fill:var(--accent)" },
    { id: "fala_link_w4", type: "label", x: 790, y: 420, anchor: "middle", mono: true, label: "at",
      style: "font-size:22px;font-weight:700;fill:var(--accent)" },
    { id: "fala_link_w5", type: "label", x: 930, y: 420, anchor: "middle", mono: true, label: "all",
      style: "font-size:22px;font-weight:700;fill:var(--accent)" },
    { id: "fala_link_arc2", type: "arrow", path: "M660,432 Q715,472 770,432", color: "var(--accent)", noHead: true },
    { id: "fala_link_arc3", type: "arrow", path: "M810,432 Q860,472 910,432", color: "var(--accent)", noHead: true },
    { id: "fala_link_cap2", type: "label", x: 785, y: 500, anchor: "middle", label: "soa como: “no-ta-tall”",
      style: "font-size:12px;fill:var(--ink-soft)" },

    // cena 4 — schwa / redução vocálica
    ...compareRow("fala_schwa", 560, "var(--muted)", "Cuidadoso (devagar)", "“I want to go to the store for you.”",
      "var(--good)", "Natural (rápido)", "“I wanna go tuh the store fer you.”"),

    // cena 5 — ritmo stress-timed
    { id: "fala_rhy1", type: "vector", x: 100, y: 700, w: 480, h: 80, values: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5], color: "var(--muted)" },
    { id: "fala_rhy1_l", type: "label", x: 340, y: 800, anchor: "middle", label: "“I want to go to the store.” (parelho, palavra por palavra)",
      style: "font-size:11.5px;fill:var(--ink-soft)" },
    { id: "fala_rhy2", type: "vector", x: 660, y: 700, w: 480, h: 80, values: [0.85, 0.2, 0.3, 0.15, 0.8, 0.2, 0.75], color: "var(--hot)" },
    { id: "fala_rhy2_l", type: "label", x: 900, y: 800, anchor: "middle", label: "“I wanna go to the store.” (stress nas palavras de conteúdo)",
      style: "font-size:11.5px;fill:var(--ink-soft)" },

    // cena 6 — shadowing na prática
    ...chunkCard("fala_shadow", 100, 830, 1080, 90, "Ouça 20-30s, repita junto, imitando o ritmo",
      "sem olhar o texto — a técnica da lição 1, agora aplicada ao que você aprendeu aqui", "var(--accent)"),

    // cena 7 — robótico vs nativo
    ...compareRow("fala_final", 950, "var(--muted)", "Robótico", "“I. Want. To. Go. To. The. Store.”",
      "var(--good)", "Nativo", "“Ai-wanna-go-tuh-the-store.”"),
  ];

  const steps = [
    {
      title: "Revisão relâmpago da trilha",
      show: recap.flatMap((_, i) => [`fala_rec${i}_box`, `fala_rec${i}_ph`, `fala_rec${i}_mn`]),
      balloon: { anchor: "fala_rec3_box", placement: "top",
        text: "Um chunk de cada lição anterior, tudo junto — sua última revisão espaçada antes do \"tempero final\" da fluência: como tudo isso soa numa boca americana de verdade.",
        why: "Repetir tudo espaçado, uma última vez, antes do assunto novo (interleaving + spaced repetition) é o que fixa a trilha inteira na memória." },
      enter: (ctx) => ctx.reveal(recap.map((_, i) => `fala_rec${i}_box`), 70),
    },
    {
      title: "Gonna, wanna, gotta, kinda, sorta",
      show: reductions.flatMap((_, i) => [`fala_red${i}_box`, `fala_red${i}_ph`, `fala_red${i}_mn`]),
      balloon: { anchor: "fala_red0_box", placement: "top",
        text: "As reduções mais usadas do inglês americano falado: <strong>going to→gonna</strong>, <strong>want to→wanna</strong>, <strong>got to→gotta</strong>, <strong>kind of→kinda</strong>, <strong>sort of→sorta</strong>.",
        why: "Quase ninguém fala a forma completa numa conversa relaxada — reconhecer (e usar) essas reduções é o que separa \"inglês de livro\" de inglês real.",
        deep: `<p>\"Kinda\" e \"sorta\" também funcionam como \"atenuadores\" (hedging), suavizando uma opinião:</p>
<div class="xp-example"><strong>"It's kinda expensive."</strong>Meio que caro / tipo caro.</div>
<div class="xp-example"><strong>"I sorta agree with you."</strong>Eu meio que concordo com você.</div>` },
      enter: (ctx) => ctx.reveal(reductions.map((_, i) => `fala_red${i}_box`), 110),
    },
    {
      title: "Linking: as palavras se \"grudam\"",
      show: ["fala_link_w1", "fala_link_w2", "fala_link_arc", "fala_link_cap",
        "fala_link_w3", "fala_link_w4", "fala_link_w5", "fala_link_arc2", "fala_link_arc3", "fala_link_cap2"],
      balloon: { anchor: "fala_link_arc", placement: "bottom",
        text: "Quando uma palavra termina em consoante e a próxima começa em vogal, elas se <strong>grudam</strong> na fala: “an apple” soa “a-napple”, “not at all” soa “no-ta-tall”.",
        why: "É o linking que faz o inglês falado soar \"corrido\", sem pausa entre as palavras — sem entender isso, você \"perde\" pedaços de frases que na verdade conhece.",
        deep: `<p>Mais um exemplo bem comum:</p>
<div class="xp-example"><strong>"turn it off"</strong>soa como “tur-ni-doff”</div>` },
      enter: (ctx) => { ctx.drawArrow("fala_link_arc"); ctx.drawArrow("fala_link_arc2"); ctx.drawArrow("fala_link_arc3"); },
    },
    {
      title: "Schwa: a vogal que \"some\"",
      show: ["fala_schwa_lbox", "fala_schwa_lt", "fala_schwa_lx", "fala_schwa_rbox", "fala_schwa_rt", "fala_schwa_rx"],
      balloon: { anchor: "fala_schwa_rbox", placement: "top",
        text: `Palavras "de função" (to, for, of, and) reduzem pro som neutro <span class="xp-term" tabindex="0" data-tip="Som vocálico neutro /ə/, o mais comum do inglês — como o 'a' fraco de 'sofá' bem rápido.">schwa</span> /ə/ na fala natural: "to"→"tuh", "for"→"fer".`,
        why: "Pronunciar cada palavra função por completo (\"tu\", \"foh\") soa \"robótico\" mesmo com gramática perfeita — reduzi-las é parte de soar nativo.",
        deep: `<p>Mais reduções com schwa:</p>
<div class="xp-example"><strong>"and" → "'n"</strong>"fish 'n chips"</div>
<div class="xp-example"><strong>"a" → /ə/</strong>"I want a coffee" soa "I want uh coffee"</div>` },
    },
    {
      title: "Ritmo stress-timed",
      show: ["fala_rhy1", "fala_rhy1_l", "fala_rhy2", "fala_rhy2_l"],
      balloon: { anchor: "fala_rhy2", placement: "top",
        text: "O inglês é <strong>stress-timed</strong>: palavras de conteúdo (verbos, substantivos) recebem força e as palavras de função são compactadas — ao contrário do português, mais \"parelho\" sílaba a sílaba.",
        why: "Imitar esse ritmo (não só pronunciar as palavras certas) é o que mais aproxima sua fala da de um nativo — é o que o shadowing (lição 1) treina.",
        deep: `<p>Se você falar inglês no ritmo do português (cada sílaba com duração parecida), vai soar compreensível mas visivelmente \"sotacado\" — o ouvido nativo espera esse contraste forte/fraco.</p>` },
      enter: (ctx) => { ctx.setBars("fala_rhy1", [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]); ctx.setBars("fala_rhy2", [0.85, 0.2, 0.3, 0.15, 0.8, 0.2, 0.75]); },
    },
    {
      title: "Shadowing, agora com tudo isso",
      show: ["fala_shadow_box", "fala_shadow_ph", "fala_shadow_mn"],
      balloon: { anchor: "fala_shadow_box", placement: "bottom",
        text: "Pegue um trecho curto (série, podcast, entrevista) e pratique <strong>shadowing</strong> de novo — mas agora prestando atenção nas reduções e no ritmo que você acabou de aprender aqui.",
        why: "Fecha o ciclo da trilha: a técnica da lição 1 aplicada ao conteúdo mais avançado da última lição." },
    },
    {
      title: "Robótico vs. nativo",
      show: ["fala_final_lbox", "fala_final_lt", "fala_final_lx", "fala_final_rbox", "fala_final_rt", "fala_final_rx"],
      balloon: { anchor: "fala_final_rbox", placement: "top",
        text: "Mesma frase, duas \"personalidades\": pronunciar cada palavra separadamente soa robótico; conectar (linking), reduzir (schwa/gonna-wanna) e variar o ritmo (stress-timed) soa nativo.",
        why: "O objetivo não é decorar mais uma regra — é reconhecer (e depois produzir) a versão conectada quando você ouvir e quando você falar." },
    },
    {
      title: "Desafio final intercalado",
      dim: ["fala_red0_box", "fala_red1_box"],
      highlight: ["fala_link_arc", "fala_schwa_rbox"],
      balloon: { anchor: "fala_final_rbox", placement: "top",
        text: `Antes do quiz, "traduza" mentalmente (recall ativo, misturando tudo que você viu na trilha): <em>"Whatcha up to?"</em>, <em>"I dunno."</em>, <em>"I gotta run."</em>, <em>"I shoulda called you."</em>`,
        why: "Reconhecer rápido essas reduções é o que separa entender uma série/filme em inglês sem legenda de ficar perdido a cada frase." },
    },
    {
      title: "Teste final + conclusão da trilha",
      balloon: { anchor: "fala_red1_box", placement: "top",
        text: "Você completou os 9 explicadores da trilha de Inglês! Continue com spaced repetition: revise um chunk por dia, sempre em voz alta. 👇" },
      quiz: {
        question: "Qual é a forma reduzida e falada de \"want to\"?",
        options: ["gonna", "wanna", "gotta", "hafta"],
        answer: 1,
        explain: "\"Want to\" reduz para \"wanna\" na fala rápida — \"gonna\" é de \"going to\", \"gotta\" é de \"got to\", e \"hafta\" é de \"have to\".",
      },
    },
  ];

  window.INGLES_FALA_REAL_DIAGRAM = {
    title: "Como os Americanos Falam de Verdade",
    subtitle: "Gonna/wanna/gotta/kinda/sorta, linking, schwa e o ritmo stress-timed",
    width: W, height: H, autoplayMs: 9000, elements, steps,
  };
})();
