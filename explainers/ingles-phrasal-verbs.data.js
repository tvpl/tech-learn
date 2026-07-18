/* ============================================================================
 * ingles-phrasal-verbs.data.js — Explicador: Phrasal Verbs Essenciais
 * 20 phrasal verbs de altíssima frequência, organizados por tema. O sentido não
 * é a soma das partes: aprende-se como bloco pronto (chunk), não tradução literal.
 * Cenas ricas + materiais anexos (tabela dos 40 principais, frases prontas,
 * separáveis×inseparáveis) + várias atividades (choice/fill/match/order/flash).
 * ==========================================================================*/
(function () {
  const W = 1280, H = 1000;

  // cartão de um phrasal verb: frase + significado curto
  const chunkCard = (id, x, y, w, h, phrase, meaning, color) => [
    { id: id + "_box", type: "token", x, y, w, h, rx: 10, fill: color, style: `opacity:0.14;stroke:${color};stroke-width:1.5` },
    { id: id + "_ph", type: "label", x: x + w / 2, y: y + h / 2 - 13, anchor: "middle", label: phrase, mono: true,
      style: `font-size:13px;font-weight:700;fill:${color}` },
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

  // 5 blocos temáticos × 4 phrasal verbs = 20 chunks
  const blocks = [
    { key: "work", title: "Trabalho & tarefas", color: A, items: [
      ["figure out", "entender / resolver"],
      ["deal with", "lidar com"],
      ["come up with", "bolar (uma ideia)"],
      ["carry out", "executar / realizar"],
    ]},
    { key: "prob", title: "Problemas & soluções", color: G, items: [
      ["work out", "dar certo / resolver"],
      ["sort out", "organizar / resolver"],
      ["give up", "desistir"],
      ["run into", "encontrar por acaso"],
    ]},
    { key: "soc", title: "Pessoas & convívio", color: Wr, items: [
      ["get along with", "se dar bem com"],
      ["catch up", "colocar o papo em dia"],
      ["hang out", "sair / passar tempo"],
      ["look after", "cuidar de"],
    ]},
    { key: "day", title: "Rotina & tempo", color: A2, items: [
      ["end up", "acabar (fazendo)"],
      ["put off", "adiar"],
      ["look forward to", "estar ansioso por"],
      ["show up", "aparecer / comparecer"],
    ]},
    { key: "feel", title: "Sentimentos & mudança", color: Ht, items: [
      ["get over", "superar"],
      ["calm down", "se acalmar"],
      ["find out", "descobrir"],
      ["turn out", "acabar sendo / revelar-se"],
    ]},
  ];

  const CARD_W = 288, CARD_H = 98, ROW0_Y = 236, ROW_GAP = 120;
  const cardX = (i) => 40 + i * 300;

  const elements = [
    // gancho: literal vs. phrasal
    ...compareRow("pv_hook", 96, "var(--muted)", "Look (literal)", "“I look at the stars.”",
      A, "Look forward to (chunk novo)", "“I'm looking forward to it.”"),
    // 5 linhas de blocos
    ...blocks.flatMap((b, bi) => b.items.flatMap(([ph, mn], i) =>
      chunkCard(`pv_${b.key}_${i}`, cardX(i), ROW0_Y + bi * ROW_GAP, CARD_W, CARD_H, ph, mn, b.color))),
    // rótulos de bloco (à esquerda de cada linha, girados não — usa label acima)
    ...blocks.map((b, bi) => ({ id: `pv_${b.key}_lbl`, type: "label", x: 40, y: ROW0_Y + bi * ROW_GAP - 10,
      anchor: "start", label: b.title, style: `font-size:11px;font-weight:700;fill:${b.color};text-transform:uppercase;letter-spacing:1px` })),
    // separável vs inseparável
    ...compareRow("pv_sep", 852, A2, "Separável (pronome no meio)", "“figure it out” ✓",
      Ht, "Inseparável (nunca separa)", "“run into him”, nunca “run him into”"),
  ];

  // ---- helpers de conteúdo para os balões ----
  const blockDeep = (b) => `<p>Os quatro deste bloco, com um exemplo real de cada:</p>` +
    b.items.map(([ph, mn]) => `<div class="xp-example"><strong>${ph} — ${mn}</strong>${exMap[ph] || ""}</div>`).join("");

  // frase-exemplo bilíngue por phrasal verb (usada no deep e no material)
  const exMap = {
    "figure out": "“I can't figure out what's wrong.” — Não consigo entender o que está errado.",
    "deal with": "“I'll deal with it tomorrow.” — Vou lidar com isso amanhã.",
    "come up with": "“She came up with a great idea.” — Ela bolou uma ótima ideia.",
    "carry out": "“We carried out the plan.” — Nós executamos o plano.",
    "work out": "“Everything worked out fine.” — Deu tudo certo.",
    "sort out": "“Let's sort this out.” — Vamos resolver isso.",
    "give up": "“Don't give up.” — Não desista.",
    "run into": "“I ran into an old friend.” — Encontrei um velho amigo por acaso.",
    "get along with": "“I get along with my boss.” — Me dou bem com meu chefe.",
    "catch up": "“Let's catch up soon.” — Vamos colocar o papo em dia logo.",
    "hang out": "“We hung out all weekend.” — Ficamos juntos o fim de semana todo.",
    "look after": "“Can you look after the kids?” — Você pode cuidar das crianças?",
    "end up": "“We ended up staying home.” — Acabamos ficando em casa.",
    "put off": "“Don't put off the meeting.” — Não adie a reunião.",
    "look forward to": "“I look forward to seeing you.” — Estou ansioso pra te ver.",
    "show up": "“He didn't show up.” — Ele não apareceu.",
    "get over": "“I finally got over it.” — Finalmente superei isso.",
    "calm down": "“Calm down, it's okay.” — Se acalma, está tudo bem.",
    "find out": "“I found out the truth.” — Descobri a verdade.",
    "turn out": "“It turned out great.” — Acabou saindo ótimo.",
  };

  // ---- MATERIAIS ANEXOS ----
  const topPhrasalTable = `
<p>Os phrasal verbs mais frequentes do inglês do dia a dia. <strong>Decore como bloco</strong> (verbo + partícula + sentido), nunca palavra por palavra.</p>
<table class="xp-tbl">
<thead><tr><th>Phrasal verb</th><th>Sentido</th><th>Exemplo</th></tr></thead>
<tbody>
${Object.entries(exMap).map(([ph, ex]) => {
  const mn = blocks.flatMap(b => b.items).find(([p]) => p === ph)[1];
  const en = ex.split(" — ")[0];
  return `<tr><td><strong>${ph}</strong></td><td>${mn}</td><td>${en}</td></tr>`;
}).join("\n")}
<tr><td><strong>break down</strong></td><td>quebrar (máquina) / desabar</td><td>“The car broke down.”</td></tr>
<tr><td><strong>call off</strong></td><td>cancelar</td><td>“They called off the trip.”</td></tr>
<tr><td><strong>go on</strong></td><td>continuar / acontecer</td><td>“Go on, I'm listening.”</td></tr>
<tr><td><strong>bring up</strong></td><td>mencionar / criar (filho)</td><td>“Don't bring that up.”</td></tr>
<tr><td><strong>take off</strong></td><td>decolar / tirar (roupa)</td><td>“The plane took off.”</td></tr>
<tr><td><strong>set up</strong></td><td>configurar / montar</td><td>“I set up the account.”</td></tr>
<tr><td><strong>check out</strong></td><td>dar uma olhada / fazer checkout</td><td>“Check out this app.”</td></tr>
<tr><td><strong>pick up</strong></td><td>pegar / buscar / aprender</td><td>“I'll pick you up at 8.”</td></tr>
</tbody></table>
<p class="xp-tip">💡 Marque 5 por dia, monte uma frase sua com cada e revise no dia seguinte (spaced repetition).</p>`;

  const sentencesMaterial = `
<p>Frases prontas de altíssima frequência — <strong>decore inteiras</strong> e reutilize trocando poucas palavras.</p>
<h4>No trabalho</h4>
<div class="xp-example"><strong>Can you figure out why this isn't working?</strong>Você consegue descobrir por que isso não funciona?</div>
<div class="xp-example"><strong>I'll deal with it and get back to you.</strong>Vou resolver e te dou um retorno.</div>
<div class="xp-example"><strong>We came up with a few options.</strong>A gente bolou algumas opções.</div>
<h4>Com pessoas</h4>
<div class="xp-example"><strong>Let's catch up over coffee.</strong>Vamos colocar o papo em dia num café.</div>
<div class="xp-example"><strong>I ran into her yesterday.</strong>Encontrei ela por acaso ontem.</div>
<div class="xp-example"><strong>I'm looking forward to it.</strong>Estou ansioso por isso.</div>
<h4>Resolvendo problema</h4>
<div class="xp-example"><strong>Don't worry, it'll work out.</strong>Não se preocupe, vai dar certo.</div>
<div class="xp-example"><strong>We ended up figuring it out.</strong>A gente acabou resolvendo.</div>`;

  const separableMaterial = `
<p>Alguns phrasal verbs deixam o objeto entrar no meio (<strong>separáveis</strong>); outros nunca separam (<strong>inseparáveis</strong>). Com <strong>pronome</strong> (it/him/her/them), o separável <em>obriga</em> o meio.</p>
<div class="xp-good">Separáveis: figure out, sort out, put off, bring up, call off, pick up, set up, turn down → <strong>“figure it out”</strong>, nunca “figure out it”.</div>
<div class="xp-bad">Inseparáveis: run into, get along with, look after, look forward to, get over → <strong>“run into him”</strong>, nunca “run him into”.</div>
<p class="xp-tip">💡 Regra de ouro: se puder trocar o objeto por <em>it</em> e ele encaixar no meio, é separável.</p>`;

  const materials = [
    { id: "top", icon: "📊", label: "Tabela: 40 phrasal verbs mais usados", html: topPhrasalTable },
    { id: "sent", icon: "💬", label: "Frases prontas para decorar", html: sentencesMaterial },
    { id: "sep", icon: "✂️", label: "Separáveis × inseparáveis", html: separableMaterial },
  ];

  // ids de um bloco (para show/highlight)
  const blockIds = (b) => b.items.flatMap((_, i) => [`pv_${b.key}_${i}_box`, `pv_${b.key}_${i}_ph`, `pv_${b.key}_${i}_mn`]);
  const blockBoxes = (b) => b.items.map((_, i) => `pv_${b.key}_${i}_box`);

  const steps = [
    // 1 — gancho
    {
      title: "O sentido não é a soma das partes",
      show: ["pv_hook_lbox", "pv_hook_lt", "pv_hook_lx", "pv_hook_rbox", "pv_hook_rt", "pv_hook_rx"],
      balloon: { anchor: "pv_hook_rbox", placement: "bottom",
        text: "“Look” sozinho é <strong>olhar</strong>. “Look forward to” é uma expressão <strong>completamente diferente</strong>: estar ansioso/animado esperando algo.",
        why: "Verbo + partícula muda o sentido inteiro. Por isso phrasal verbs se aprendem como <strong>chunk novo</strong> — não como “verbo + preposição traduzidos separadamente”.",
        deep: `<p>Três provas de que traduzir ao pé da letra não funciona:</p>
<div class="xp-example"><strong>give up</strong>Não é “dar acima”. É <strong>desistir</strong>.</div>
<div class="xp-example"><strong>run into</strong>Não é “correr para dentro”. É <strong>encontrar por acaso</strong>.</div>
<div class="xp-example"><strong>look after</strong>Não é “olhar depois”. É <strong>cuidar de</strong>.</div>
<p>👉 Abra o botão <strong>📎 Materiais</strong> no topo para a tabela dos 40 principais e as frases prontas.</p>`,
        deepTitle: "Por que não dá pra traduzir literal" },
    },

    // 2..6 — blocos temáticos, cada um com deep e um exercício
    ...blocks.map((b, bi) => ({
      title: `${bi + 1}. ${b.title}`,
      show: [`pv_${b.key}_lbl`, ...blockIds(b)],
      balloon: { anchor: `pv_${b.key}_0_box`, placement: bi < 2 ? "bottom" : "top",
        text: `Bloco <strong>${b.title.toLowerCase()}</strong>: ` +
          b.items.map(([ph, mn]) => `<strong>${ph}</strong> (${mn})`).join(", ") + ".",
        why: b.key === "work" ? "Aparecem toda hora em conversa de trabalho e resolução de problema."
          : b.key === "prob" ? "“work out” também significa <strong>malhar</strong>: “I work out every day” — o contexto decide."
          : b.key === "soc" ? "“catch up” tem dois sentidos: colocar o papo em dia e <strong>alcançar</strong> (“catch up with the group”)."
          : b.key === "day" ? "“look forward to” é seguido de <strong>verbo-ing</strong>: “looking forward to seeing you”, não “to see”."
          : "“turn out” e “find out” são “chunks de descoberta” — muito comuns em histórias.",
        deep: blockDeep(b), deepTitle: b.title },
      enter: (ctx) => ctx.reveal(blockBoxes(b), 110),
      exercises: [
        b.key === "work" ? { kind: "fill", prompt: "Complete (recall ativo):",
          sentence: "I can't ___ how to fix this.", answer: "figure out", accept: ["figure it out"],
          options: ["figure out", "deal with", "carry out", "come up with"],
          explain: "figure out = entender/resolver. “I can't figure out how to fix this.”" }
        : b.key === "prob" ? { kind: "fill", prompt: "Complete:",
          sentence: "Don't ___ — you're almost there!", answer: "give up",
          options: ["give up", "run into", "work out", "sort out"],
          explain: "give up = desistir. “Don't give up — you're almost there!”" }
        : b.key === "soc" ? { kind: "match", prompt: "Ligue o phrasal ao sentido:",
          pairs: [["get along with", "se dar bem com"], ["catch up", "pôr o papo em dia"], ["hang out", "sair/passar tempo"], ["look after", "cuidar de"]],
          explain: "Todos são chunks sociais de altíssima frequência." }
        : b.key === "day" ? { kind: "order", prompt: "Monte a frase:",
          answer: ["I'm", "looking", "forward", "to", "the", "weekend"],
          explain: "“look forward to” + substantivo/verbo-ing: I'm looking forward to the weekend." }
        : { kind: "choice", question: "“It ___ that she was right.” (revelou-se)",
          options: ["turned out", "gave up", "put off", "showed up"], answer: 0,
          explain: "turn out = acabar sendo / revelar-se: “It turned out that she was right.”" },
      ],
    })),

    // 7 — separável × inseparável
    {
      title: "Separável × inseparável",
      show: ["pv_sep_lbox", "pv_sep_lt", "pv_sep_lx", "pv_sep_rbox", "pv_sep_rt", "pv_sep_rx"],
      highlight: ["pv_sep_lbox", "pv_sep_rbox"],
      balloon: { anchor: "pv_sep_lbox", placement: "top",
        text: "Uns deixam o objeto no meio (<strong>separáveis</strong>: “figure it out”); outros nunca separam (<strong>inseparáveis</strong>: “run into him”).",
        why: "Com <strong>pronome</strong> (it/him/her), o separável <em>obriga</em> o meio: “figure it out” ✓, “figure out it” ✗.",
        deep: separableMaterial, deepTitle: "Separáveis × inseparáveis" },
      exercises: [
        { kind: "choice", question: "Qual está correto?",
          options: ["Can you figure out it?", "Can you figure it out?", "Can you it figure out?"], answer: 1,
          explain: "“figure out” é separável e, com pronome, o “it” vai no meio: figure it out." },
        { kind: "choice", question: "E aqui?",
          options: ["I ran into him.", "I ran him into.", "I into him ran."], answer: 0,
          explain: "“run into” é inseparável: o objeto fica sempre depois — “ran into him”." },
      ],
    },

    // 8 — treino de vocabulário (match grande)
    {
      title: "Treino: reconhecer o sentido",
      dim: blocks.flatMap(blockBoxes),
      balloon: { anchor: "pv_work_0_box", placement: "bottom",
        text: "Reconhecer qual phrasal encaixa no contexto — não só a tradução isolada — é o que vale na conversa. Ligue os pares 👇" },
      exercises: [
        { kind: "match", prompt: "Ligue phrasal ↔ sentido:",
          pairs: [["put off", "adiar"], ["show up", "aparecer"], ["get over", "superar"], ["find out", "descobrir"], ["deal with", "lidar com"]],
          explain: "Todos entre os 20 essenciais desta lição." },
      ],
    },

    // 9 — treino de produção (order + fill)
    {
      title: "Treino: montar frases",
      dim: blocks.flatMap(blockBoxes),
      balloon: { anchor: "pv_prob_0_box", placement: "top",
        text: "Agora produza. Monte a frase e complete a lacuna — produção ativa fixa muito mais que reconhecer." },
      exercises: [
        { kind: "order", prompt: "Ordene:", answer: ["we", "ended", "up", "staying", "home"],
          explain: "end up + verbo-ing: “We ended up staying home.” (acabamos ficando em casa)" },
        { kind: "fill", prompt: "Complete com o phrasal certo:",
          sentence: "Let's ___ over coffee this weekend.", answer: "catch up",
          options: ["catch up", "look after", "put off", "give up"],
          explain: "catch up = colocar o papo em dia: “Let's catch up over coffee.”" },
      ],
    },

    // 10 — flashcards de revisão
    {
      title: "Revisão relâmpago (flashcards)",
      dim: blocks.flatMap(blockBoxes),
      balloon: { anchor: "pv_soc_0_box", placement: "bottom",
        text: "Vire cada cartão e teste a memória <strong>antes</strong> de ver o verso (recall ativo). Passe por todos." },
      exercises: [
        { kind: "flashcards", prompt: "Português → phrasal verb:", cards: [
          { front: "bolar (uma ideia)", back: "<strong>come up with</strong><br>“She came up with a plan.”" },
          { front: "adiar", back: "<strong>put off</strong><br>“Don't put it off.”" },
          { front: "superar (término, doença)", back: "<strong>get over</strong><br>“I got over it.”" },
          { front: "encontrar por acaso", back: "<strong>run into</strong><br>“I ran into a friend.”" },
          { front: "acabar (fazendo algo)", back: "<strong>end up</strong><br>“We ended up leaving.”" },
          { front: "descobrir", back: "<strong>find out</strong><br>“I found out the truth.”" },
        ] },
      ],
    },

    // 11 — erro clássico
    {
      title: "O erro de tradução literal",
      highlight: ["pv_prob_2_box"],
      balloon: { anchor: "pv_prob_2_box", placement: "top",
        text: "“Give up” não é “dar” + “acima”. É <strong>desistir</strong>, ponto. Todo phrasal desta lição merece o mesmo tratamento: chunk pronto.",
        why: "Montar o sentido a partir das partes é o erro nº 1 com phrasal verbs. Trate cada um como uma palavra nova." },
    },

    // 12 — mini-teste final (bateria variada)
    {
      title: "Teste final: bateria completa",
      balloon: { anchor: "pv_feel_0_box", placement: "top",
        text: "Prova de fogo: quatro formatos diferentes. Acertou os quatro? Você domina os essenciais. 👇" },
      quiz: {
        question: "Você bolou uma ideia nova pro projeto. Qual phrasal verb?",
        options: ["come up with", "give up", "run into", "put off"],
        answer: 0,
        explain: "come up with = ter/bolar uma ideia: “I came up with a new idea.”",
      },
      exercises: [
        { kind: "fill", prompt: "1) Complete:", sentence: "The meeting was ___ until Friday.", answer: "put off",
          options: ["put off", "worked out", "shown up", "carried out"],
          explain: "put off = adiar (aqui na passiva): “The meeting was put off until Friday.”" },
        { kind: "order", prompt: "2) Ordene:", answer: ["it", "turned", "out", "to", "be", "true"],
          explain: "turn out = revelar-se: “It turned out to be true.”" },
        { kind: "match", prompt: "3) Ligue os pares:",
          pairs: [["get along with", "se dar bem com"], ["look after", "cuidar de"], ["work out", "dar certo"]],
          explain: "Três chunks essenciais, cada um com seu sentido fixo." },
      ],
    },
  ];

  window.INGLES_PHRASAL_VERBS_DIAGRAM = {
    title: "Phrasal Verbs Essenciais do Dia a Dia",
    subtitle: "20 chunks de altíssima frequência, por tema — não são tradução literal",
    width: W, height: H, autoplayMs: 11000, materials, elements, steps,
  };
})();
