/* ============================================================================
 * ingles-trabalho.data.js — Explicador: Inglês no Trabalho
 * Chunks prontos para e-mail/Slack, reuniões, dar updates, pedir/oferecer ajuda
 * e prazos. Tom profissional e educado — decore como bloco, use no mesmo dia.
 * ==========================================================================*/
(function () {
  const W = 1280, H = 1000;

  const chunkCard = (id, x, y, w, h, phrase, meaning, color) => [
    { id: id + "_box", type: "token", x, y, w, h, rx: 10, fill: color, style: `opacity:0.14;stroke:${color};stroke-width:1.5` },
    { id: id + "_ph", type: "label", x: x + w / 2, y: y + h / 2 - 13, anchor: "middle", label: phrase, mono: true,
      style: `font-size:12.5px;font-weight:700;fill:${color}` },
    { id: id + "_mn", type: "label", x: x + w / 2, y: y + h / 2 + 16, anchor: "middle", label: meaning,
      style: "font-size:10px;fill:var(--ink-soft)" },
  ];

  const CMP_LEFT_X = 90, CMP_RIGHT_X = 670, CMP_H = 92;
  const compareRow = (id, y, leftColor, leftTitle, leftText, rightColor, rightTitle, rightText, w = 520) => [
    { id: id + "_lbox", type: "box", x: CMP_LEFT_X, y, w, h: CMP_H, rx: 10, fill: leftColor, style: "opacity:0.12" },
    { id: id + "_lt", type: "label", x: CMP_LEFT_X + w / 2, y: y + 24, anchor: "middle", label: leftTitle,
      style: `font-size:11px;font-weight:700;fill:${leftColor};text-transform:uppercase;letter-spacing:1px` },
    { id: id + "_lx", type: "label", x: CMP_LEFT_X + w / 2, y: y + 56, anchor: "middle", label: leftText, mono: true,
      style: "font-size:12px;fill:var(--ink)" },
    { id: id + "_rbox", type: "box", x: CMP_RIGHT_X, y, w, h: CMP_H, rx: 10, fill: rightColor, style: "opacity:0.12" },
    { id: id + "_rt", type: "label", x: CMP_RIGHT_X + w / 2, y: y + 24, anchor: "middle", label: rightTitle,
      style: `font-size:11px;font-weight:700;fill:${rightColor};text-transform:uppercase;letter-spacing:1px` },
    { id: id + "_rx", type: "label", x: CMP_RIGHT_X + w / 2, y: y + 56, anchor: "middle", label: rightText, mono: true,
      style: "font-size:12px;fill:var(--ink)" },
  ];

  const A = "var(--accent)", G = "var(--good)", Wr = "var(--warn)", A2 = "var(--accent-2)", Ht = "var(--hot)";

  const blocks = [
    { key: "mail", title: "E-mail & Slack", color: A, items: [
      ["Just following up", "só dando um retorno/cobrando"],
      ["Please find attached", "segue em anexo"],
      ["Let me know if…", "me avise se…"],
      ["Looking forward to…", "no aguardo de…"],
    ]},
    { key: "meet", title: "Reuniões", color: G, items: [
      ["Let's get started", "vamos começar"],
      ["Can you see my screen?", "dá pra ver minha tela?"],
      ["Let's circle back", "voltamos a isso depois"],
      ["Let's wrap up", "vamos encerrar"],
    ]},
    { key: "upd", title: "Dar updates", color: Wr, items: [
      ["I'm on it", "já estou cuidando disso"],
      ["It's in progress", "está em andamento"],
      ["I'll get back to you", "te dou um retorno"],
      ["It's blocked on…", "está travado por…"],
    ]},
    { key: "help", title: "Pedir & oferecer ajuda", color: A2, items: [
      ["Do you have a minute?", "você tem um minuto?"],
      ["Could you give me a hand?", "pode me dar uma mão?"],
      ["Happy to help", "fico feliz em ajudar"],
      ["I'll take care of it", "eu cuido disso"],
    ]},
    { key: "dead", title: "Prazos & compromissos", color: Ht, items: [
      ["by EOD", "até o fim do dia"],
      ["ASAP", "o quanto antes"],
      ["Can we push it?", "dá pra adiar?"],
      ["I'll have it by Friday", "entrego até sexta"],
    ]},
  ];

  const CARD_W = 288, CARD_H = 98, ROW0_Y = 236, ROW_GAP = 120;
  const cardX = (i) => 40 + i * 300;

  const elements = [
    ...compareRow("wk_hook", 96, "var(--muted)", "Direto demais (pode soar rude)", "“Send me the file.”",
      A, "Educado (padrão no trabalho)", "“Could you send me the file?”"),
    ...blocks.flatMap((b, bi) => b.items.flatMap(([ph, mn], i) =>
      chunkCard(`wk_${b.key}_${i}`, cardX(i), ROW0_Y + bi * ROW_GAP, CARD_W, CARD_H, ph, mn, b.color))),
    ...blocks.map((b, bi) => ({ id: `wk_${b.key}_lbl`, type: "label", x: 40, y: ROW0_Y + bi * ROW_GAP - 10,
      anchor: "start", label: b.title, style: `font-size:11px;font-weight:700;fill:${b.color};text-transform:uppercase;letter-spacing:1px` })),
    ...compareRow("wk_soft", 852, A2, "Pedido cru", "“I need this today.”",
      G, "Amaciado (softener)", "“Would it be possible to have this today?”"),
  ];

  const blockIds = (b) => b.items.flatMap((_, i) => [`wk_${b.key}_${i}_box`, `wk_${b.key}_${i}_ph`, `wk_${b.key}_${i}_mn`]);
  const blockBoxes = (b) => b.items.map((_, i) => `wk_${b.key}_${i}_box`);

  // ---- MATERIAIS ANEXOS ----
  const emailMaterial = `
<p>Estruturas prontas de e-mail profissional. <strong>Copie e adapte.</strong></p>
<h4>Abertura</h4>
<div class="xp-example"><strong>Hi [name], I hope you're doing well.</strong>Oi [nome], espero que esteja bem.</div>
<div class="xp-example"><strong>Just following up on my last email.</strong>Só retomando meu último e-mail.</div>
<h4>Corpo</h4>
<div class="xp-example"><strong>I'm reaching out to…</strong>Estou entrando em contato para…</div>
<div class="xp-example"><strong>Please find attached the report.</strong>Segue em anexo o relatório.</div>
<div class="xp-example"><strong>Could you please confirm by Friday?</strong>Poderia confirmar até sexta?</div>
<h4>Fechamento</h4>
<div class="xp-example"><strong>Let me know if you have any questions.</strong>Me avise se tiver dúvidas.</div>
<div class="xp-example"><strong>Looking forward to your reply. Best, [name]</strong>No aguardo. Abraços, [nome]</div>`;

  const meetingMaterial = `
<p>Frases de reunião (presencial ou call). <strong>Decore por função.</strong></p>
<table class="xp-tbl">
<thead><tr><th>Função</th><th>Frase</th></tr></thead>
<tbody>
<tr><td>Abrir</td><td>“Let's get started.” / “Thanks for joining.”</td></tr>
<tr><td>Checar áudio/tela</td><td>“Can everyone hear me?” / “Can you see my screen?”</td></tr>
<tr><td>Pedir a palavra</td><td>“Can I jump in here?” / “Just to add to that…”</td></tr>
<tr><td>Discordar educado</td><td>“I see your point, but…” / “I'm not sure I agree.”</td></tr>
<tr><td>Adiar um tópico</td><td>“Let's circle back to that.” / “Let's take that offline.”</td></tr>
<tr><td>Confirmar próximos passos</td><td>“So the next step is…” / “Who's owning this?”</td></tr>
<tr><td>Encerrar</td><td>“Let's wrap up.” / “I'll send the notes.”</td></tr>
</tbody></table>`;

  const politeMaterial = `
<p>Os <strong>softeners</strong>: o que transforma um pedido “cru” em profissional. Regra de ouro: quanto mais indireto, mais educado.</p>
<div class="xp-bad">Cru: “Send me the report.” / “I need this now.” / “Do it again.”</div>
<div class="xp-good">Educado: “Could you send me the report?” / “Would it be possible to…?” / “Would you mind redoing this?”</div>
<h4>Kit de amaciadores</h4>
<div class="xp-example"><strong>Could you… / Would you mind… / I was wondering if you could…</strong>pedidos</div>
<div class="xp-example"><strong>Just / a quick / whenever you get a chance</strong>reduz a pressão</div>
<div class="xp-example"><strong>I'm afraid… / Unfortunately…</strong>dar uma notícia ruim com jeito</div>
<p class="xp-tip">💡 “Would you mind + verbo-ing?” → responder “No” significa “tudo bem, eu faço”.</p>`;

  const materials = [
    { id: "mail", icon: "✉️", label: "Modelos de e-mail (abertura → fechamento)", html: emailMaterial },
    { id: "meet", icon: "📅", label: "Frases de reunião por função", html: meetingMaterial },
    { id: "polite", icon: "🎩", label: "Softeners: soar educado", html: politeMaterial },
  ];

  const blockDeep = (b, extras) => `<p>Os quatro deste bloco em contexto:</p>` +
    b.items.map(([ph, mn], i) => `<div class="xp-example"><strong>${ph} — ${mn}</strong>${extras[i] || ""}</div>`).join("");

  const steps = [
    {
      title: "No trabalho, educado é o padrão",
      show: ["wk_hook_lbox", "wk_hook_lt", "wk_hook_lx", "wk_hook_rbox", "wk_hook_rt", "wk_hook_rx"],
      balloon: { anchor: "wk_hook_rbox", placement: "bottom",
        text: "“Send me the file.” está gramaticalmente certo, mas soa <strong>ríspido</strong>. No trabalho, o padrão é amaciar: <strong>“Could you send me the file?”</strong>",
        why: "Inglês profissional é quase sempre indireto. Pedidos diretos demais soam como ordem — mesmo entre colegas.",
        deep: politeMaterial, deepTitle: "Por que amaciar os pedidos" },
    },

    ...blocks.map((b, bi) => {
      const extras = {
        mail: ["“Just following up on the proposal.”", "“Please find attached the invoice.”", "“Let me know if this works for you.”", "“Looking forward to hearing from you.”"],
        meet: ["“Alright, let's get started.”", "“Can you see my screen okay?”", "“Let's circle back to budget later.”", "“Let's wrap up — thanks everyone.”"],
        upd: ["“No worries, I'm on it.”", "“The feature is in progress.”", "“I'll get back to you by noon.”", "“It's blocked on design approval.”"],
        help: ["“Hey, do you have a minute?”", "“Could you give me a hand with this?”", "“Happy to help — send it over.”", "“Don't worry, I'll take care of it.”"],
        dead: ["“I'll send it by EOD.”", "“Can you review this ASAP?”", "“Can we push the deadline to Monday?”", "“You'll have it by Friday.”"],
      }[b.key];
      const ex = {
        mail: { kind: "fill", prompt: "Complete o e-mail:", sentence: "Please ___ attached the report.",
          answer: "find", options: ["find", "see", "look"], explain: "Chunk fixo: “Please find attached…” = segue em anexo." },
        meet: { kind: "order", prompt: "Monte a frase de reunião:", answer: ["can", "everyone", "see", "my", "screen"],
          explain: "“Can everyone see my screen?” — clássico de call." },
        upd: { kind: "match", prompt: "Ligue update ↔ sentido:", pairs: [
            ["I'm on it", "já estou cuidando"], ["It's in progress", "em andamento"], ["It's blocked on…", "travado por…"], ["I'll get back to you", "te dou retorno"],
          ], explain: "Updates curtos e prontos para o Slack." },
        help: { kind: "choice", question: "Pedido de ajuda mais educado:",
          options: ["Help me with this.", "Could you give me a hand with this?", "I need help now."], answer: 1,
          explain: "“Could you give me a hand?” amacia o pedido — padrão profissional." },
        dead: { kind: "fill", prompt: "Complete:", sentence: "I'll send it by ___ (fim do dia).",
          answer: "EOD", accept: ["eod", "end of day"], explain: "EOD = end of day (fim do expediente)." },
      }[b.key];
      return {
        title: `${bi + 1}. ${b.title}`,
        show: [`wk_${b.key}_lbl`, ...blockIds(b)],
        balloon: { anchor: `wk_${b.key}_0_box`, placement: bi < 2 ? "bottom" : "top",
          text: `<strong>${b.title}</strong>: ` + b.items.map(([ph, mn]) => `<strong>${ph}</strong> (${mn})`).join(", ") + ".",
          why: b.key === "mail" ? "“Just following up” é a forma educada de cobrar sem parecer que está cobrando."
            : b.key === "meet" ? "Em call, 90% das falas são chunks fixos — decore por função (abrir, adiar, encerrar)."
            : b.key === "upd" ? "Update bom é curto: status + prazo. “In progress, I'll have it by noon.”"
            : b.key === "help" ? "“Do you have a minute?” abre a conversa sem interromper de forma brusca."
            : "Siglas de prazo (EOD, ASAP, EOW) aparecem o tempo todo em e-mail e Slack.",
          deep: blockDeep(b, extras), deepTitle: b.title },
        enter: (ctx) => ctx.reveal(blockBoxes(b), 110),
        exercises: [ex],
      };
    }),

    {
      title: "Amaciando pedidos (softeners)",
      show: ["wk_soft_lbox", "wk_soft_lt", "wk_soft_lx", "wk_soft_rbox", "wk_soft_rt", "wk_soft_rx"],
      highlight: ["wk_soft_rbox"],
      balloon: { anchor: "wk_soft_rbox", placement: "top",
        text: "O que separa o profissional do rude são os <strong>softeners</strong>: “Could you…”, “Would you mind…”, “I was wondering if…”. Quanto mais indireto, mais educado.",
        why: "“Would you mind redoing this?” pede a mesma coisa que “Do it again” — mas mantém a relação boa.",
        deep: politeMaterial, deepTitle: "Kit de softeners" },
      exercises: [
        { kind: "choice", question: "Qual soa mais profissional?",
          options: ["I need this today.", "Would it be possible to have this today?", "Give me this today."], answer: 1,
          explain: "“Would it be possible to…?” é o jeito educado de pedir algo com prazo apertado." },
        { kind: "order", prompt: "Monte o pedido educado:", answer: ["could", "you", "send", "me", "the", "file"],
          explain: "“Could you send me the file?” — pedido padrão no trabalho." },
      ],
    },

    {
      title: "Treino: e-mail e Slack",
      dim: blocks.flatMap(blockBoxes),
      balloon: { anchor: "wk_mail_0_box", placement: "bottom",
        text: "Escrever no trabalho é montar chunks prontos. Complete e ligue 👇 (abra 📎 Materiais para os modelos completos)." },
      exercises: [
        { kind: "fill", prompt: "Cobrar educado:", sentence: "Just ___ up on my last message.",
          answer: "following", options: ["following", "coming", "looking"], explain: "“Just following up” = só retomando/cobrando com jeito." },
        { kind: "match", prompt: "Ligue função ↔ frase:", pairs: [
          ["abrir e-mail", "I hope you're doing well"], ["anexo", "Please find attached"], ["fechar", "Let me know if you have questions"],
        ], explain: "Cada parte do e-mail tem seu chunk fixo." },
      ],
    },

    {
      title: "Revisão relâmpago (flashcards)",
      dim: blocks.flatMap(blockBoxes),
      balloon: { anchor: "wk_upd_0_box", placement: "top",
        text: "Vire cada cartão: português → chunk de trabalho. Teste antes de olhar o verso." },
      exercises: [
        { kind: "flashcards", prompt: "PT → chunk de trabalho:", cards: [
          { front: "já estou cuidando disso", back: "<strong>I'm on it.</strong>" },
          { front: "te dou um retorno", back: "<strong>I'll get back to you.</strong>" },
          { front: "vamos encerrar", back: "<strong>Let's wrap up.</strong>" },
          { front: "pode me dar uma mão?", back: "<strong>Could you give me a hand?</strong>" },
          { front: "até o fim do dia", back: "<strong>by EOD (end of day)</strong>" },
          { front: "voltamos a isso depois", back: "<strong>Let's circle back.</strong>" },
        ] },
      ],
    },

    {
      title: "Teste final: um dia de trabalho",
      balloon: { anchor: "wk_help_0_box", placement: "top",
        text: "Simulação: você passa por e-mail, reunião, update e prazo. Acertou tudo? Está pronto para o expediente em inglês. 👇" },
      quiz: {
        question: "Um colega pede algo e você vai cuidar disso agora. Resposta natural no Slack?",
        options: ["I do it.", "I'm on it.", "I am make it.", "I on it now."],
        answer: 1,
        explain: "“I'm on it” = já estou cuidando disso. Curto e natural." },
      exercises: [
        { kind: "fill", prompt: "1) Fechar e-mail:", sentence: "___ me know if you have any questions.",
          answer: "Let", accept: ["let"], explain: "“Let me know if…” = me avise se…" },
        { kind: "order", prompt: "2) Encerrar reunião:", answer: ["let's", "wrap", "up", "for", "today"],
          explain: "“Let's wrap up for today.” = vamos encerrar por hoje." },
        { kind: "choice", question: "3) Pedir para adiar um prazo:",
          options: ["Push the deadline.", "Can we push the deadline to Monday?", "Deadline Monday now."], answer: 1,
          explain: "“Can we push the deadline to Monday?” — pedido educado de adiamento." },
        { kind: "match", prompt: "4) Ligue os pares:", pairs: [
          ["ASAP", "o quanto antes"], ["EOD", "fim do dia"], ["Happy to help", "fico feliz em ajudar"],
        ], explain: "Siglas e chunks do dia a dia corporativo." },
      ],
    },
  ];

  window.INGLES_TRABALHO_DIAGRAM = {
    title: "Inglês no Trabalho",
    subtitle: "Chunks prontos para e-mail, reuniões, updates e prazos — profissional e educado",
    width: W, height: H, autoplayMs: 11000, materials, elements, steps,
  };
})();
