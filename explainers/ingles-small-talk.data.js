/* ============================================================================
 * ingles-small-talk.data.js — Explicador: Small Talk / Chunks Sociais
 * Capstone da Fase 2: cumprimentar, responder no automático, preencher
 * silêncio e encerrar uma conversa com naturalidade.
 * ==========================================================================*/
(function () {
  const W = 1280, H = 920;

  const chunkCard = (id, x, y, w, h, phrase, meaning, color) => [
    { id: id + "_box", type: "token", x, y, w, h, rx: 10, fill: color, style: `opacity:0.14;stroke:${color};stroke-width:1.5` },
    { id: id + "_ph", type: "label", x: x + w / 2, y: y + h / 2 - 14, anchor: "middle", label: phrase, mono: true,
      style: `font-size:14px;font-weight:700;fill:${color}` },
    { id: id + "_mn", type: "label", x: x + w / 2, y: y + h / 2 + 18, anchor: "middle", label: meaning,
      style: "font-size:10.5px;fill:var(--ink-soft)" },
  ];

  const recap = [
    ["Pres. Perfect", "I've been there.", "var(--accent)"],
    ["Artigos", "coffee, not the coffee", "var(--good)"],
    ["Preposições", "on the bus, not in", "var(--warn)"],
    ["Contáveis", "a lot of, not many", "var(--accent-2)"],
    ["Condicionais", "If I were you...", "var(--hot)"],
    ["Phrasal Verbs", "figure it out", "var(--accent)"],
  ];
  const greetings = [
    ["What's up?", "E aí, tudo bem?", "var(--accent)"],
    ["How's it going?", "Como estão as coisas?", "var(--good)"],
    ["Long time no see!", "Quanto tempo!", "var(--warn)"],
  ];
  const autoReplies = [
    ["Good, you?", "resposta padrão, não conta a vida", "var(--accent-2)"],
    ["Not bad.", "também resposta automática", "var(--hot)"],
    ["Can't complain.", "eco social, não pergunta literal", "var(--accent)"],
  ];
  const waiting = [
    ["Nice weather today, huh?", "preenche silêncio em fila/elevador", "var(--good)"],
    ["Busy day, huh?", "comentário casual de espera", "var(--warn)"],
  ];
  const clarify = [
    ["Could you say that again?", "pedir repetição educadamente", "var(--accent-2)"],
    ["What do you mean by that?", "pedir esclarecimento", "var(--hot)"],
    ["Come again?", "forma curta e casual de pedir repetição", "var(--accent)"],
  ];
  const closing = [
    ["I should get going.", "sinaliza que vai encerrar, sem ser abrupto", "var(--good)"],
    ["It was nice talking to you!", "fecha a conversa com gentileza", "var(--warn)"],
    ["Catch you later!", "despedida casual", "var(--accent-2)"],
  ];

  const elements = [
    // cena 1 — recap relâmpago da Fase 2
    ...recap.flatMap(([ph, mn, color], i) => chunkCard(`st_rec${i}`, 60 + i * 190, 130, 180, 90, ph, mn, color)),

    // cena 2 — cumprimentos além de hi/hello
    ...greetings.flatMap(([ph, mn, color], i) => chunkCard(`st_greet${i}`, 100 + i * 360, 260, 340, 100, ph, mn, color)),

    // cena 3 — resposta automática a "How are you?"
    ...autoReplies.flatMap(([ph, mn, color], i) => chunkCard(`st_auto${i}`, 100 + i * 360, 390, 340, 100, ph, mn, color)),

    // cena 4 — small talk de espera/fila
    ...waiting.flatMap(([ph, mn, color], i) => chunkCard(`st_wait${i}`, 100 + i * 560, 520, 520, 100, ph, mn, color)),

    // cena 5 — pedir repetição/clarificação
    ...clarify.flatMap(([ph, mn, color], i) => chunkCard(`st_clar${i}`, 100 + i * 360, 650, 340, 100, ph, mn, color)),

    // cena 6 — encerrar a conversa
    ...closing.flatMap(([ph, mn, color], i) => chunkCard(`st_close${i}`, 100 + i * 360, 780, 340, 100, ph, mn, color)),
  ];

  const steps = [
    {
      title: "Revisão relâmpago da Fase 2",
      show: recap.flatMap((_, i) => [`st_rec${i}_box`, `st_rec${i}_ph`, `st_rec${i}_mn`]),
      balloon: { anchor: "st_rec3_box", placement: "top",
        text: "Um chunk de cada lição da Fase 2, tudo junto — sua última revisão espaçada antes do capstone de conversação real.",
        why: "Igual fizemos no fim da Fase 1 com \"Fala Real\": repetir espaçado antes do assunto novo (spaced repetition + interleaving) fixa a trilha inteira." },
      enter: (ctx) => ctx.reveal(recap.map((_, i) => `st_rec${i}_box`), 90),
    },
    {
      title: "Cumprimentos além de hi/hello",
      show: greetings.flatMap((_, i) => [`st_greet${i}_box`, `st_greet${i}_ph`, `st_greet${i}_mn`]),
      balloon: { anchor: "st_greet1_box", placement: "top",
        text: "“What's up?”, “How's it going?” e “Long time no see!” soam muito mais naturais no dia a dia do que repetir \"hello\" toda vez.",
        why: "Variar o cumprimento é um dos jeitos mais rápidos de soar menos \"livro didático\" logo nos primeiros segundos de uma conversa.",
        deep: `<p>Mais cumprimentos casuais comuns:</p>
<div class="xp-example"><strong>"Hey, how've you been?"</strong>E aí, como você tem passado?</div>
<div class="xp-example"><strong>"Good to see you!"</strong>Que bom te ver!</div>` },
      enter: (ctx) => ctx.reveal(["st_greet0_box", "st_greet1_box", "st_greet2_box"], 130),
    },
    {
      title: "Resposta automática a \"How are you?\"",
      show: autoReplies.flatMap((_, i) => [`st_auto${i}_box`, `st_auto${i}_ph`, `st_auto${i}_mn`]),
      balloon: { anchor: "st_auto0_box", placement: "top",
        text: "Quando alguém pergunta \"How are you?\", a resposta natural é curta e automática: <strong>\"Good, you?\"</strong>, <strong>\"Not bad.\"</strong> ou <strong>\"Can't complain.\"</strong> — raramente uma resposta literal e longa.",
        why: "É quase um \"eco social\": a pergunta não está pedindo um relatório do seu dia — é parte do ritual de cumprimento.",
        deep: `<p>Responder de forma literal e longa (\"Well, actually my week has been really stressful because...\") soa deslocado num cumprimento rápido de corredor — guarde isso pra quando alguém pergunta de verdade, com mais tempo disponível.</p>` },
      enter: (ctx) => ctx.reveal(["st_auto0_box", "st_auto1_box", "st_auto2_box"], 130),
    },
    {
      title: "Small talk de espera",
      show: waiting.flatMap((_, i) => [`st_wait${i}_box`, `st_wait${i}_ph`, `st_wait${i}_mn`]),
      balloon: { anchor: "st_wait0_box", placement: "top",
        text: "Em fila, elevador ou sala de espera, um comentário casual preenche o silêncio: “Nice weather today, huh?” ou “Busy day, huh?”",
        why: "\"Huh?\" no fim convida a outra pessoa a responder rapidamente — é o jeito mais leve de puxar um papo de poucos segundos." },
    },
    {
      title: "Pedir repetição ou clarificação",
      show: clarify.flatMap((_, i) => [`st_clar${i}_box`, `st_clar${i}_ph`, `st_clar${i}_mn`]),
      balloon: { anchor: "st_clar0_box", placement: "top",
        text: "Não entendeu? “Could you say that again?” (repetição) ou “What do you mean by that?” (esclarecimento) — e no dia a dia casual, “Come again?” funciona também.",
        why: "Pedir clarificação com naturalidade é tão importante quanto entender de primeira — ninguém entende 100% o tempo todo, nem os próprios nativos.",
        deep: `<p>Mais uma forma bem usada:</p>
<div class="xp-example"><strong>"Sorry, I didn't catch that."</strong>Desculpa, não peguei o que você disse.</div>` },
      enter: (ctx) => ctx.reveal(["st_clar0_box", "st_clar1_box", "st_clar2_box"], 130),
    },
    {
      title: "Encerrar a conversa naturalmente",
      show: closing.flatMap((_, i) => [`st_close${i}_box`, `st_close${i}_ph`, `st_close${i}_mn`]),
      balloon: { anchor: "st_close1_box", placement: "top",
        text: "Pra sair de uma conversa sem parecer abrupto: “I should get going.” (sinaliza a saída) seguido de “It was nice talking to you!” (fecha com gentileza) ou “Catch you later!” (despedida casual).",
        why: "Encerrar bem uma conversa é tão parte da fluência quanto começar — sair de repente, sem esses chunks de transição, soa estranho em qualquer idioma." },
    },
    {
      title: "Prática: reconstrua a mini-conversa",
      dim: ["st_rec0_box", "st_rec1_box", "st_rec2_box", "st_rec3_box", "st_rec4_box", "st_rec5_box"],
      highlight: ["st_greet1_box", "st_close1_box"],
      balloon: { anchor: "st_greet1_box", placement: "top",
        text: `Antes do quiz, reconstrua mentalmente uma conversa completa (recall ativo): <em>"How's it going?"</em> → <em>"Pretty good, you?"</em> → <em>"Busy day, huh?"</em> → <em>"Yeah! Well, I should get going — it was nice talking to you!"</em>`,
        why: "Juntar os chunks numa sequência real é o teste final de fluência: não decorar frases soltas, mas usá-las encadeadas como um nativo faria." },
    },
    {
      title: "Teste final + conclusão da Fase 2",
      balloon: { anchor: "st_auto0_box", placement: "top",
        text: "Você completou os 16 explicadores da trilha de Inglês! Continue com spaced repetition: revise um chunk por dia, sempre em voz alta. 👇" },
      quiz: {
        question: "Alguém te pergunta \"How's it going?\" rapidamente num elevador. O que soa mais natural?",
        options: [
          "Well, actually I've been quite stressed this week because of work and...",
          "Pretty good, you?",
          "I am going very well, thank you for asking.",
          "It goes good.",
        ],
        answer: 1,
        explain: "Num cumprimento rápido, a resposta natural é curta e automática — \"Pretty good, you?\" devolve o cumprimento sem alongar a conversa.",
      },
    },
  ];

  window.INGLES_SMALL_TALK_DIAGRAM = {
    title: "Small Talk: Chunks Sociais do Dia a Dia",
    subtitle: "Cumprimentar, responder no automático, preencher silêncio e encerrar com naturalidade",
    width: W, height: H, autoplayMs: 9000, elements, steps,
  };
})();
