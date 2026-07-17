/* ============================================================================
 * ingles-tecnicas.data.js — Explicador: Como Aprender Inglês Rápido (de Verdade)
 * Introdução da trilha "Inglês": chunking, active recall, spaced repetition,
 * shadowing, minimal pairs e comprehensible input — o método usado nas
 * próximas 8 lições. Mesmo motor genérico.
 * ==========================================================================*/
(function () {
  const W = 1280, H = 760;

  // bloco gramatical / bloco de lição — caixa colorida com rótulo em cima e texto dentro
  const chunkBlock = (id, x, y, w, h, role, text, color) => [
    { id: id + "_box", type: "box", x, y, w, h, rx: 8, fill: color, style: "opacity:0.85" },
    { id: id + "_role", type: "label", x: x + w / 2, y: y - 10, anchor: "middle", label: role,
      style: `font-size:10px;font-weight:700;fill:${color};text-transform:uppercase;letter-spacing:1px` },
    { id: id + "_txt", type: "label", x: x + w / 2, y: y + h / 2 + 6, anchor: "middle", label: text, mono: true,
      style: "font-size:14px;font-weight:600;fill:#fff" },
  ];

  // "flashcard" de chunk pronto — frase real em inglês + explicação em PT
  const chunkCard = (id, x, y, w, h, phrase, meaning, color) => [
    { id: id + "_box", type: "token", x, y, w, h, rx: 10, fill: color, style: `opacity:0.14;stroke:${color};stroke-width:1.5` },
    { id: id + "_ph", type: "label", x: x + w / 2, y: y + h / 2 - 12, anchor: "middle", label: phrase, mono: true,
      style: `font-size:16px;font-weight:700;fill:${color}` },
    { id: id + "_mn", type: "label", x: x + w / 2, y: y + h / 2 + 18, anchor: "middle", label: meaning,
      style: "font-size:11px;fill:var(--ink-soft)" },
  ];

  // comparação lado a lado (2 colunas fixas)
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

  const dayLabels = ["Hoje", "+1 dia", "+3 dias", "+7 dias"];
  const dayX = [150, 400, 650, 900];
  const lessons = [
    ["Estrutura", "var(--accent)"], ["Presente", "var(--good)"], ["Passado", "var(--warn)"],
    ["Futuro", "var(--accent-2)"], ["Perguntas", "var(--hot)"], ["Negativas", "var(--accent)"],
    ["Modais", "var(--good)"], ["Fala Real", "var(--hot)"],
  ];

  const elements = [
    // cena 1 — escolinha vs. método desta trilha (ocupa a mesma área das cenas 2-3, é escondida depois)
    ...compareRow("tec_method", 140, "var(--hot)", "Jeito tradicional",
      "Decorar regra → traduzir devagar → ler baixinho", "var(--accent)", "Jeito desta trilha",
      "Chunk pronto → ouvir/repetir → testar antes de checar"),

    // cena 2/3 — chunking + active recall (mesma linha, colunas fixas)
    ...chunkCard("tec_chunk", 100, 140, 520, 110, "“I gotta run.”", "Chunking: decore o bloco pronto, não a gramática solta", "var(--accent)"),
    ...chunkCard("tec_recall", 660, 140, 520, 110, "Tente lembrar antes de olhar 👀", "Active Recall: testar > reler", "var(--good)"),

    // cena 4 — spaced repetition (linha do tempo)
    { id: "tec_line", type: "arrow", x1: 100, y1: 345, x2: 1180, y2: 345, color: "var(--muted)", noHead: true },
    ...dayX.flatMap((x, i) => [
      { id: `tec_m${i}`, type: "box", x: x - 45, y: 316, w: 90, h: 54, rx: 8, fill: "var(--accent-2)", style: "opacity:0.85" },
      { id: `tec_m${i}_l`, type: "label", x, y: 348, anchor: "middle", mono: true, label: dayLabels[i],
        style: "font-size:12px;font-weight:700;fill:#fff" },
      { id: `tec_tick${i}`, type: "arrow", x1: x, y1: 345, x2: x, y2: 372, color: "var(--warn)", noHead: true },
    ]),

    // cena 5 — shadowing (ritmo)
    { id: "tec_rhy", type: "vector", x: 100, y: 460, w: 480, h: 100, values: [0.3, 0.9, 0.3, 0.3, 0.9, 0.4, 0.3, 0.85], color: "var(--hot)" },
    { id: "tec_rhy_l", type: "label", x: 340, y: 585, anchor: "middle", label: "Shadowing: ouça um nativo e repita junto, imitando o ritmo",
      style: "font-size:12px;fill:var(--ink-soft)" },

    // cena 6 — minimal pairs (ship x sheep)
    ...compareRow("tec_min", 460, "var(--warn)", "ship /ɪ/", "“I need a ship.” (navio)", "var(--accent)", "sheep /iː/", "“I need a sheep.” (ovelha)"),

    // cena 7 — recap: 8 blocos das próximas lições
    ...lessons.flatMap(([name, color], i) => chunkBlock(`tec_L${i}`, 100 + i * 135, 640, 120, 56, `Lição ${i + 1}`, name, color)),
  ];

  const steps = [
    {
      title: "Escolinha vs. ciência do aprendizado",
      show: ["tec_method_lbox", "tec_method_lt", "tec_method_lx", "tec_method_rbox", "tec_method_rt", "tec_method_rx"],
      balloon: { anchor: "tec_method_rbox", placement: "top",
        text: "Curso tradicional (tipo CCAA/Wizard): decorar regra, traduzir devagar, repetir baixinho. Esta trilha usa outra lógica: <strong>chunks prontos</strong>, <strong>testar sua memória antes de checar</strong> e <strong>falar alto</strong>.",
        why: "O objetivo não é passar numa prova de gramática — é <strong>abrir a boca e ser entendido</strong>. As técnicas aqui vêm de pesquisa real sobre aquisição de linguagem, não de apostila.",
        deep: `<p>Nenhuma das 9 lições desta trilha vai pedir para você decorar uma tabela de conjugação. Em vez disso, cada uma ensina um <strong>padrão</strong> através de frases reais, e fecha com um quiz de recall ativo.</p>
<div class="xp-good"><strong>Prefira</strong> aprender "I gotta run" como um bloco só, do jeito que um nativo usa</div>
<div class="xp-bad"><strong>Evite</strong> montar a frase palavra por palavra toda vez ("eu tenho que" → "I have to" → "correr" → "run")</div>` },
    },
    {
      title: "Chunking (Lexical Approach)",
      show: ["tec_chunk_box", "tec_chunk_ph", "tec_chunk_mn"],
      hide: ["tec_method_lbox", "tec_method_lt", "tec_method_lx", "tec_method_rbox", "tec_method_rt", "tec_method_rx"],
      highlight: ["tec_chunk_box"],
      balloon: { anchor: "tec_chunk_box", placement: "bottom",
        text: `Em vez de aprender palavra por palavra, decore <span class="xp-term" tabindex="0" data-tip="Bloco de palavras que o nativo usa pronto, sem montar peça por peça.">chunks</span>: blocos prontos como "I gotta run" (tenho que ir correndo) ou "What are you up to?" (o que você anda fazendo?).`,
        why: "O cérebro guarda expressões inteiras muito mais rápido do que regra + vocabulário separados — e é assim que um nativo realmente fala, sem pensar em gramática.",
        deep: `<p>Chunks prontos que valem decorar já na primeira semana:</p>
<div class="xp-example"><strong>I'm about to...</strong>estou prestes a... ("I'm about to leave")</div>
<div class="xp-example"><strong>I can't wait to...</strong>mal posso esperar para... ("I can't wait to see you")</div>
<div class="xp-example"><strong>It's up to you</strong>a decisão é sua</div>` },
    },
    {
      title: "Active Recall",
      show: ["tec_recall_box", "tec_recall_ph", "tec_recall_mn"],
      highlight: ["tec_recall_box"],
      balloon: { anchor: "tec_recall_box", placement: "bottom",
        text: "Antes de olhar a resposta, <strong>tente lembrar sozinho</strong>. Esse esforço de puxar da memória fixa muito mais do que reler o mesmo texto várias vezes.",
        why: "Reler dá uma falsa sensação de que você já sabe. Testar a si mesmo mostra exatamente o que ainda falta — por isso todo explicador desta trilha termina com um quiz.",
        deep: `<p>Na prática: antes de cada quiz desta trilha, pare e responda mentalmente <em>antes</em> de ver as opções. Se errar, você aprende mais do que se tivesse acertado de primeira relendo o balão.</p>
<div class="xp-good"><strong>Faça</strong> cobrir a tradução e tentar lembrar o chunk em inglês primeiro</div>
<div class="xp-bad"><strong>Evite</strong> só passar os olhos e achar que "já sei"</div>` },
    },
    {
      title: "Spaced Repetition",
      show: ["tec_line", "tec_m0", "tec_m0_l", "tec_tick0", "tec_m1", "tec_m1_l", "tec_tick1",
        "tec_m2", "tec_m2_l", "tec_tick2", "tec_m3", "tec_m3_l", "tec_tick3"],
      balloon: { anchor: "tec_m3", placement: "top",
        text: "Revise o mesmo chunk <strong>hoje, em 1 dia, em 3 dias e em 7 dias</strong>. Cada revisão espaçada consolida mais a memória de longo prazo do que reler tudo de uma vez.",
        why: "Isso é <strong>spaced repetition</strong>: gasta menos tempo total de estudo e o conteúdo gruda muito mais do que \"maratonar\" (cramming) na véspera.",
        deep: `<p>Não precisa de um app especial: um caderno com a data de hoje + 1, +3 e +7 dias já funciona. O importante é o <strong>espaçamento crescente</strong>, não a ferramenta.</p>
<div class="xp-example"><strong>Ciclo de 1 chunk novo</strong>Dia 0: aprende "I gotta run"
Dia 1: revisa (tenta lembrar antes de checar)
Dia 3: revisa de novo
Dia 7: se lembrou fácil, o chunk "virou seu"</div>` },
      enter: (ctx) => { ctx.drawArrow("tec_line"); ctx.reveal(["tec_m0", "tec_m1", "tec_m2", "tec_m3"], 140); },
    },
    {
      title: "Shadowing",
      show: ["tec_rhy", "tec_rhy_l"],
      balloon: { anchor: "tec_rhy", placement: "top",
        text: "Ouça um nativo falando (podcast, série, YouTube) e <strong>repita junto, ao mesmo tempo</strong>, imitando o ritmo e a entonação — sem olhar o texto.",
        why: "Isso treina boca e ouvido simultaneamente e fixa o \"jeito\" de falar, não só o significado das palavras — é o que mais aproxima seu sotaque do natural.",
        deep: `<p>Como praticar: escolha um trecho de 20-30 segundos, ouça uma vez prestando atenção no ritmo, depois repita junto (ou logo depois) o máximo de vezes que aguentar, sem se preocupar em entender 100% cada palavra.</p>
<div class="xp-good"><strong>Bom material</strong> trechos curtos e naturais: trailers, entrevistas, podcasts de conversa</div>
<div class="xp-bad"><strong>Evite</strong> só ler em voz alta um texto escrito formal — isso não treina o ritmo real da fala</div>` },
      enter: (ctx) => ctx.setBars("tec_rhy", [0.3, 0.9, 0.3, 0.3, 0.9, 0.4, 0.3, 0.85]),
    },
    {
      title: "Minimal Pairs & Comprehensible Input",
      show: ["tec_min_lbox", "tec_min_lt", "tec_min_lx", "tec_min_rbox", "tec_min_rt", "tec_min_rx"],
      balloon: { anchor: "tec_min_rbox", placement: "top",
        text: `<span class="xp-term" tabindex="0" data-tip="Duas palavras que só diferem em um som — treinar o ouvido para diferenciá-las.">Minimal pairs</span> (ship/sheep, live/leave) treinam seu ouvido pra sons parecidos. <span class="xp-term" tabindex="0" data-tip="Se expor a inglês um pouco acima do seu nível atual — dá pra entender pelo contexto, mesmo sem saber cada palavra.">Comprehensible input</span> é se expor a inglês que você entende quase tudo, mas não tudo.`,
        why: "Sem treinar o ouvido, você pode \"ouvir\" a palavra errada mesmo sabendo a gramática perfeitamente. E input fácil demais (ou difícil demais) ensina pouco.",
        deep: `<p>Outros pares mínimos comuns para brasileiros treinarem:</p>
<div class="xp-example"><strong>live /lɪv/ vs leave /liːv/</strong>"I live here" (moro aqui) vs "I have to leave" (tenho que ir)</div>
<div class="xp-example"><strong>bit /bɪt/ vs beat /biːt/</strong>"a little bit" vs "my heart beats fast"</div>` },
    },
    {
      title: "Como esta trilha usa tudo isso",
      show: lessons.flatMap((_, i) => [`tec_L${i}_box`, `tec_L${i}_role`, `tec_L${i}_txt`]),
      balloon: { anchor: { x: 640, y: 610 }, placement: "top",
        text: "As próximas 8 lições repetem esse método: <strong>chunks reais</strong> em vez de regra decorada, <strong>quiz de recall ativo</strong> no final de cada uma, e a técnica anterior sempre volta como aquecimento — isso é <strong>interleaving</strong>.",
        why: "Fale as frases de exemplo em voz alta enquanto estuda — não pule o quiz. É isso que transforma teoria de gramática em fluência de verdade." },
      enter: (ctx) => lessons.forEach((_, i) => setTimeout(() => ctx.pulse(`tec_L${i}_box`, true), i * 90)),
    },
    {
      title: "Teste rápido",
      balloon: { anchor: { x: 640, y: 610 }, placement: "top",
        text: "Confirme o que você acabou de aprender 👇" },
      quiz: {
        question: "Qual técnica consiste em revisar o mesmo chunk em intervalos de tempo crescentes (hoje, 1 dia, 3 dias, 7 dias)?",
        options: ["Shadowing", "Spaced Repetition (repetição espaçada)", "Chunking", "Comprehensible Input"],
        answer: 1,
        explain: "Spaced Repetition espaça as revisões pra consolidar a memória de longo prazo, gastando menos tempo total do que reler tudo de uma vez (cramming).",
      },
    },
  ];

  window.INGLES_TECNICAS_DIAGRAM = {
    title: "Como Aprender Inglês Rápido (de Verdade)",
    subtitle: "Chunking, active recall, spaced repetition e shadowing — o método por trás de toda a trilha",
    width: W, height: H, autoplayMs: 9000, elements, steps,
  };
})();
