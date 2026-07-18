/* ============================================================================
 * ingles-verbos-irregulares.data.js — Referência: Verbos Irregulares
 * Os verbos irregulares mais usados, organizados por PADRÃO de mudança
 * (1 forma / 2 formas / 3 formas) para memorizar mais rápido — com tabela
 * completa anexa e vários treinos.
 * ==========================================================================*/
(function () {
  const W = 1200, H = 860;

  const A = "var(--accent)", G = "var(--good)", Ht = "var(--hot)", A2 = "var(--accent-2)", Wr = "var(--warn)";

  // três colunas por padrão de mudança
  const COLS = [
    { key: "one", x: 40, color: G, title: "1 forma (não muda)",
      verbs: [["cut", "cut", "cut"], ["put", "put", "put"], ["let", "let", "let"], ["hit", "hit", "hit"], ["read", "read", "read"], ["cost", "cost", "cost"]] },
    { key: "two", x: 420, color: A, title: "2 formas (passado = particípio)",
      verbs: [["buy", "bought", "bought"], ["bring", "brought", "brought"], ["think", "thought", "thought"], ["find", "found", "found"], ["make", "made", "made"], ["say", "said", "said"], ["sell", "sold", "sold"], ["tell", "told", "told"]] },
    { key: "three", x: 800, color: Ht, title: "3 formas (todas diferentes)",
      verbs: [["go", "went", "gone"], ["do", "did", "done"], ["see", "saw", "seen"], ["eat", "ate", "eaten"], ["give", "gave", "given"], ["take", "took", "taken"], ["write", "wrote", "written"], ["speak", "spoke", "spoken"]] },
  ];
  const COL_W = 360, HEAD_Y = 100, ROW_Y = 150, ROW_H = 44;

  const colElements = COLS.flatMap((c) => {
    const head = [
      { id: `col_${c.key}`, type: "box", x: c.x, y: HEAD_Y, w: COL_W, h: 40, rx: 8, fill: c.color, style: "opacity:0.9", base: true },
      { id: `col_${c.key}_t`, type: "label", x: c.x + COL_W / 2, y: HEAD_Y + 20, anchor: "middle", label: c.title,
        style: "font-size:12.5px;font-weight:700;fill:#fff", base: true },
    ];
    const rows = c.verbs.flatMap((v, i) => {
      const y = ROW_Y + i * ROW_H;
      return [
        { id: `${c.key}_${i}`, type: "token", x: c.x, y, w: COL_W, h: ROW_H - 8, rx: 7, fill: c.color, style: `opacity:0.10;stroke:${c.color};stroke-width:1` },
        { id: `${c.key}_${i}_t`, type: "label", x: c.x + COL_W / 2, y: y + (ROW_H - 8) / 2 + 4, anchor: "middle",
          label: `${v[0]} · ${v[1]} · ${v[2]}`, mono: true, style: `font-size:12.5px;font-weight:600;fill:${c.color}` },
      ];
    });
    return [...head, ...rows];
  });

  const hook = [
    { id: "hk", type: "box", x: 40, y: 36, w: 1120, h: 46, rx: 10, fill: A, style: "opacity:0.08", base: true },
    { id: "hk_t", type: "label", x: 600, y: 64, anchor: "middle",
      label: "Truque: decore por PADRÃO de mudança, não em ordem alfabética.",
      style: "font-size:14px;font-weight:700;fill:var(--accent)", base: true },
  ];

  const elements = [...hook, ...colElements];

  const colIds = (c) => c.verbs.flatMap((_, i) => [`${c.key}_${i}`, `${c.key}_${i}_t`]);

  // ---- MATERIAL: tabela completa ----
  const fullTable = (verbs) => `
<table class="xp-tbl">
<thead><tr><th>Base</th><th>Passado</th><th>Particípio</th><th>Tradução</th></tr></thead>
<tbody>${verbs.map(([b, p, pp, tr]) => `<tr><td>${b}</td><td>${p}</td><td><strong>${pp}</strong></td><td>${tr}</td></tr>`).join("")}</tbody></table>`;

  const fullMaterial = `
<p>Os verbos irregulares mais frequentes do inglês. Estude uma coluna por vez.</p>
<h4>Não mudam (1 forma)</h4>
${fullTable([["cut","cut","cut","cortar"],["put","put","put","colocar"],["let","let","let","deixar"],["hit","hit","hit","bater"],["read","read","read","ler"],["cost","cost","cost","custar"],["set","set","set","definir"],["shut","shut","shut","fechar"]])}
<h4>Passado = particípio (2 formas)</h4>
${fullTable([["buy","bought","bought","comprar"],["bring","brought","brought","trazer"],["think","thought","thought","pensar"],["catch","caught","caught","pegar"],["teach","taught","taught","ensinar"],["find","found","found","achar"],["make","made","made","fazer"],["say","said","said","dizer"],["pay","paid","paid","pagar"],["sell","sold","sold","vender"],["tell","told","told","contar"],["sit","sat","sat","sentar"],["win","won","won","ganhar"],["get","got","got/gotten","conseguir"],["have","had","had","ter"],["hear","heard","heard","ouvir"],["hold","held","held","segurar"],["keep","kept","kept","manter"],["leave","left","left","sair/deixar"],["lose","lost","lost","perder"],["meet","met","met","encontrar"],["stand","stood","stood","ficar de pé"]])}
<h4>Três formas diferentes</h4>
${fullTable([["go","went","gone","ir"],["do","did","done","fazer"],["see","saw","seen","ver"],["eat","ate","eaten","comer"],["give","gave","given","dar"],["take","took","taken","pegar/levar"],["write","wrote","written","escrever"],["speak","spoke","spoken","falar"],["break","broke","broken","quebrar"],["drive","drove","driven","dirigir"],["know","knew","known","saber"],["fly","flew","flown","voar"],["begin","began","begun","começar"],["swim","swam","swum","nadar"],["ring","rang","rung","tocar"],["sing","sang","sung","cantar"],["drink","drank","drunk","beber"],["choose","chose","chosen","escolher"],["fall","fell","fallen","cair"],["grow","grew","grown","crescer"],["wear","wore","worn","vestir"],["throw","threw","thrown","jogar"]])}`;

  const patternsMaterial = `
<p>Padrões que aceleram a memorização (agrupe verbos parecidos):</p>
<div class="xp-example"><strong>-ought / -aught → "-ót"</strong>buy/bought, think/thought, catch/caught, teach/taught</div>
<div class="xp-example"><strong>i → a → u</strong>begin/began/begun, swim/swam/swum, ring/rang/rung, sing/sang/sung</div>
<div class="xp-example"><strong>-ew → -own</strong>fly/flew/flown, grow/grew/grown, throw/threw/thrown, know/knew/known</div>
<div class="xp-example"><strong>-o(ke) → -o(ken)</strong>speak/spoke/spoken, break/broke/broken, choose/chose/chosen</div>
<p class="xp-tip">💡 Agrupar por som/padrão é muito mais rápido que decorar em ordem alfabética.</p>`;

  const materials = [
    { id: "full", icon: "📚", label: "Tabela completa (60+ verbos)", html: fullMaterial },
    { id: "pat", icon: "🎯", label: "Padrões de memorização", html: patternsMaterial },
  ];

  const steps = [
    {
      title: "Decore por padrão, não por A-Z",
      show: ["hk", "hk_t"],
      balloon: { anchor: "hk", placement: "bottom",
        text: "Verbos irregulares assustam pela quantidade — mas eles caem em <strong>três grupos</strong> por padrão de mudança. Estude grupo por grupo, não em ordem alfabética.",
        why: "Agrupar por semelhança (chunking) reduz dezenas de itens soltos a poucos padrões reconhecíveis.",
        deep: patternsMaterial, deepTitle: "Padrões de memorização" },
    },
    {
      title: "Grupo 1: não mudam (1 forma)",
      show: ["col_one", "col_one_t", ...colIds(COLS[0])],
      highlight: ["col_one"],
      balloon: { anchor: "col_one", placement: "right",
        text: "Os <strong>mais fáceis</strong>: base, passado e particípio são <strong>idênticos</strong>. cut/cut/cut, put/put/put, read/read/read.",
        why: "Cuidado só com “read”: a escrita não muda, mas a pronúncia do passado vira “red” (/rɛd/).",
        deep: `<div class="xp-example"><strong>read /riːd/ → read /rɛd/</strong>“I read every day.” (presente) × “I read it yesterday.” (passado, soa “red”)</div>` },
      enter: (ctx) => ctx.reveal(colIds(COLS[0]).filter(id => !id.endsWith("_t")), 90),
      exercises: [
        { kind: "fill", prompt: "Passado de “put”:", sentence: "I ___ the keys on the table yesterday.", answer: "put",
          explain: "“put” não muda: put/put/put." },
      ],
    },
    {
      title: "Grupo 2: passado = particípio (2 formas)",
      show: ["col_two", "col_two_t", ...colIds(COLS[1])],
      highlight: ["col_two"],
      balloon: { anchor: "col_two", placement: "bottom",
        text: "O maior grupo: o <strong>passado e o particípio são iguais</strong> entre si (mas diferentes da base). buy/<strong>bought</strong>/<strong>bought</strong>, make/<strong>made</strong>/<strong>made</strong>.",
        why: "Muitos terminam em “-ought/-aught” (bought, thought, caught, taught) — decore esse som como um lote só.",
        deep: `<div class="xp-example"><strong>-ought/-aught</strong>buy→bought, think→thought, bring→brought, catch→caught, teach→taught</div>
<div class="xp-example"><strong>-old</strong>sell→sold, tell→told</div>` },
      enter: (ctx) => ctx.reveal(colIds(COLS[1]).filter(id => !id.endsWith("_t")), 80),
      exercises: [
        { kind: "fill", prompt: "Particípio de “buy”:", sentence: "I have ___ a new phone.", answer: "bought",
          explain: "buy/bought/bought — passado e particípio iguais." },
        { kind: "match", prompt: "Ligue base ↔ passado:", pairs: [["think", "thought"], ["catch", "caught"], ["sell", "sold"], ["find", "found"]],
          explain: "Grupo de 2 formas — passado igual ao particípio." },
      ],
    },
    {
      title: "Grupo 3: três formas diferentes",
      show: ["col_three", "col_three_t", ...colIds(COLS[2])],
      highlight: ["col_three"],
      balloon: { anchor: "col_three", placement: "left",
        text: "Os que exigem mais memória: <strong>base, passado e particípio são todos diferentes</strong>. go/<strong>went</strong>/<strong>gone</strong>, see/<strong>saw</strong>/<strong>seen</strong>.",
        why: "São os que mais aparecem no Present Perfect (need do particípio): “I've seen”, “I've eaten”, “I've written”.",
        deep: `<div class="xp-example"><strong>i → a → u</strong>begin/began/begun, swim/swam/swum, ring/rang/rung, drink/drank/drunk</div>
<div class="xp-example"><strong>-ew → -own</strong>fly/flew/flown, grow/grew/grown, know/knew/known</div>` },
      enter: (ctx) => ctx.reveal(colIds(COLS[2]).filter(id => !id.endsWith("_t")), 80),
      exercises: [
        { kind: "order", prompt: "Base · passado · particípio de “go”:", answer: ["go", "went", "gone"],
          explain: "go/went/gone — três formas diferentes." },
        { kind: "fill", prompt: "Particípio de “eat”:", sentence: "Have you ___ yet?", answer: "eaten",
          explain: "eat/ate/eaten. Present Perfect usa o particípio “eaten”." },
      ],
    },
    {
      title: "Treino: flashcards de particípio",
      dim: COLS.flatMap((c) => c.verbs.map((_, i) => `${c.key}_${i}`)),
      balloon: { anchor: "col_two", placement: "bottom",
        text: "Vire o cartão e diga o particípio antes de olhar. Abra 📎 <strong>Materiais</strong> para a tabela completa de 60+ verbos." },
      exercises: [
        { kind: "flashcards", prompt: "Base → particípio:", cards: [
          { front: "go", back: "<strong>gone</strong> (went / gone)" },
          { front: "write", back: "<strong>written</strong> (wrote / written)" },
          { front: "speak", back: "<strong>spoken</strong> (spoke / spoken)" },
          { front: "take", back: "<strong>taken</strong> (took / taken)" },
          { front: "break", back: "<strong>broken</strong> (broke / broken)" },
          { front: "drink", back: "<strong>drunk</strong> (drank / drunk)" },
          { front: "know", back: "<strong>known</strong> (knew / known)" },
          { front: "buy", back: "<strong>bought</strong> (bought / bought)" },
        ] },
      ],
    },
    {
      title: "Teste final: as três formas",
      balloon: { anchor: "hk", placement: "bottom",
        text: "Prova de fogo misturando os três grupos. Manda ver 👇" },
      quiz: {
        question: "Qual é o particípio de “write”?",
        options: ["wrote", "written", "writed", "write"],
        answer: 1,
        explain: "write/wrote/written. O particípio (usado no Present Perfect) é “written”." },
      exercises: [
        { kind: "fill", prompt: "1) Passado de “think”:", sentence: "I ___ about it all night.", answer: "thought",
          explain: "think/thought/thought." },
        { kind: "match", prompt: "2) Ligue base ↔ particípio:", pairs: [["see", "seen"], ["give", "given"], ["take", "taken"], ["do", "done"]],
          explain: "Grupo de três formas — o particípio é a 3ª." },
        { kind: "order", prompt: "3) Frase no Present Perfect:", answer: ["I", "have", "never", "seen", "it"],
          explain: "Particípio “seen”: I have never seen it." },
        { kind: "choice", question: "4) “She has ___ to Paris twice.”", options: ["went", "gone", "goed"], answer: 1,
          explain: "Present Perfect usa o particípio: has gone. (go/went/gone)" },
      ],
    },
  ];

  window.INGLES_VERBOS_IRREGULARES_DIAGRAM = {
    title: "Verbos Irregulares (por padrão)",
    subtitle: "Os mais usados, agrupados por tipo de mudança — com tabela completa anexa",
    width: W, height: H, autoplayMs: 12000, materials, elements, steps,
  };
})();
