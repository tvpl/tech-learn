/* ============================================================================
 * busca-binaria.data.js — Explicador: Busca Binária
 * Um array ORDENADO + ponteiros lo/hi/mid que cortam o espaço pela metade.
 * Mesmo motor: aqui só há dados (elements + steps). Não edite o engine.
 * ==========================================================================*/
(function () {
  const W = 1280, H = 700;

  // geometria do array
  const startX = 140, step = 84, cw = 74, cy = 320, ch = 72;
  const cx = (i) => startX + i * step + cw / 2;        // centro x da célula i
  const VALUES = [3, 8, 12, 15, 21, 27, 33, 41, 50, 64, 72, 89];
  const ALVO = 41;                                     // valor procurado (índice 7)

  // helpers de faixa: ids das células dentro/fora do intervalo [a, b]
  const inRange = (a, b) => VALUES.map((_, i) => i).filter((i) => i >= a && i <= b).map((i) => `a${i}`);
  const outRange = (a, b) => VALUES.map((_, i) => i).filter((i) => i < a || i > b).map((i) => `a${i}`);

  const elements = [
    // alvo (revelado na cena 2)
    { id: "alvo", type: "box", x: 540, y: 150, w: 200, h: 64, rx: 12,
      stroke: "var(--accent)", mono: true, label: ["alvo = " + ALVO, "procurar este valor"] },

    // contador de comparações (atualizado via ctx.setLabel ao longo das cenas)
    { id: "cmp", type: "label", x: 210, y: 188, sub: true, mono: true, anchor: "middle",
      label: "comparações: 0", base: true },

    // ponteiros (revelados depois; movem-se com moveTo)
    { id: "p_mid", type: "token", x: cx(0) - 34, y: 268, w: 68, h: 34,
      label: "mid ▾", stroke: "var(--accent)", fill: "#1b2550" },
    { id: "p_lo", type: "token", x: cx(0) - 30, y: 452, w: 60, h: 34,
      label: "▴ lo", stroke: "var(--good)", fill: "#11351f" },
    { id: "p_hi", type: "token", x: cx(0) - 30, y: 508, w: 60, h: 34,
      label: "▴ hi", stroke: "var(--hot)", fill: "#3a1320" },
  ];

  // células do array + rótulos de índice (sempre visíveis)
  VALUES.forEach((v, i) => {
    elements.push({ id: `a${i}`, type: "box", x: startX + i * step, y: cy, w: cw, h: ch, rx: 10,
      mono: true, label: String(v), base: true });
    elements.push({ id: `i${i}`, type: "label", x: cx(i), y: cy + ch + 26, sub: true, mono: true,
      anchor: "middle", label: String(i), base: true });
  });

  // Posiciona ponteiros nos índices da cena (idempotente p/ ida e volta) e
  // atualiza o contador de comparações.
  // OBS: nunca usar `pulse` num ponteiro — a animação de pulse usa transform e
  // anularia o translate do moveTo (o ponteiro saltaria p/ o índice 0). Quem
  // "pisca" é a CÉLULA do meio (via step.pulse), não o ponteiro.
  const place = (ctx, lo, hi, mid, cmp) => {
    ctx.moveTo("p_lo", lo * step, 0);
    ctx.moveTo("p_hi", hi * step, 0);
    if (mid != null) ctx.moveTo("p_mid", mid * step, 0);
    if (cmp != null) ctx.setLabel("cmp", "comparações: " + cmp);
  };

  const steps = [
    {
      title: "Um array ordenado",
      highlight: inRange(0, 11),
      balloon: { anchor: "a5", placement: "bottom",
        text: "A busca binária precisa de um <strong>array ordenado</strong>. Cada posição tem um <strong>índice</strong> (embaixo) e um <strong>valor</strong> (dentro).",
        why: "É a ordenação que permite, ao olhar um único elemento do meio, descartar <strong>metade</strong> dos candidatos de uma vez." },
    },
    {
      title: "O que queremos achar",
      show: ["alvo"], highlight: ["alvo"],
      balloon: { anchor: "alvo", placement: "bottom",
        text: "Queremos o índice do valor <strong>" + ALVO + "</strong>. Uma busca linear olharia posição por posição — até <strong>12</strong> comparações aqui.",
        why: "A busca binária faz muito menos: ela <strong>divide para conquistar</strong>." },
    },
    {
      title: "Marque os limites: lo e hi",
      show: ["p_lo", "p_hi"], highlight: inRange(0, 11),
      balloon: { anchor: "p_lo", placement: "bottom",
        text: "Dois ponteiros delimitam a janela de busca: <strong>lo</strong> no início (0) e <strong>hi</strong> no fim (11). O alvo, se existir, está entre eles.",
        why: "A cada passo a janela [lo, hi] encolhe. Quando lo passa de hi sem achar, o valor não está no array." },
      enter: (ctx) => place(ctx, 0, 11, null, 0),
    },
    {
      title: "Sonda 1: olhe o meio",
      show: ["p_mid"], highlight: inRange(0, 11), pulse: ["a5"],
      balloon: { anchor: "a5", placement: "top",
        text: "<span class=\"xp-term\" tabindex=\"0\" data-tip=\"mid = (lo + hi) / 2, arredondado para baixo.\">mid</span> = (0 + 11) / 2 = <strong>5</strong> → valor <strong>27</strong>. Como <strong>27 &lt; " + ALVO + "</strong>, o alvo está à <strong>direita</strong>.",
        why: "Toda a metade esquerda (índices 0–5) pode ser descartada: lá os valores só diminuem." },
      enter: (ctx) => place(ctx, 0, 11, 5, 1),
    },
    {
      title: "Descarte a esquerda: lo = 6",
      highlight: inRange(6, 11), dim: outRange(6, 11), pulse: ["a8"],
      balloon: { anchor: "a8", placement: "top",
        text: "Movemos <strong>lo = mid + 1 = 6</strong>. Nova janela: 6–11. mid = (6 + 11) / 2 = <strong>8</strong> → valor <strong>50</strong>. Agora <strong>50 &gt; " + ALVO + "</strong>: o alvo está à <strong>esquerda</strong>.",
        why: "Em duas sondas já restam só 6 dos 12 elementos — e logo bem menos." },
      enter: (ctx) => place(ctx, 6, 11, 8, 2),
    },
    {
      title: "Descarte a direita: hi = 7",
      highlight: inRange(6, 7), dim: outRange(6, 7), pulse: ["a6"],
      balloon: { anchor: "a6", placement: "top",
        text: "Movemos <strong>hi = mid − 1 = 7</strong>. Janela: 6–7. mid = (6 + 7) / 2 = <strong>6</strong> → valor <strong>33</strong>. Como <strong>33 &lt; " + ALVO + "</strong>, vá para a direita: <strong>lo = 7</strong>.",
        why: "A janela tem só dois elementos. Mais uma sonda decide." },
      enter: (ctx) => place(ctx, 6, 7, 6, 3),
    },
    {
      title: "Achou! índice 7",
      highlight: ["a7"], dim: outRange(7, 7),
      balloon: { anchor: "a7", placement: "top",
        text: "Janela: 7–7. mid = <strong>7</strong> → valor <strong>" + ALVO + "</strong>. <strong>" + ALVO + " == " + ALVO + "</strong> ✅ — encontrado no índice <strong>7</strong> em apenas <strong>4</strong> comparações.",
        why: "A linear poderia gastar 8 comparações para chegar aqui; a binária garantiu 4 no pior caso." },
      enter: (ctx) => { place(ctx, 7, 7, 7, 4); setTimeout(() => ctx.pulse("a7", true), 120); },
    },
    {
      title: "E se o valor não existir?",
      dim: inRange(0, 11),
      balloon: { anchor: { x: 640, y: 250 }, placement: "bottom",
        text: "Procurando <strong>42</strong> (que não está aqui): a janela encolhe até <strong>lo (8) ultrapassar hi (7)</strong> — repare nos ponteiros <strong>cruzados</strong> abaixo. Janela vazia ⇒ <strong>não encontrado</strong>.",
        why: "O critério de parada é <strong>lo &gt; hi</strong>. É ele que garante o término: ou o valor aparece, ou a janela esvazia provando que ele não existe." },
      enter: (ctx) => place(ctx, 8, 7, 7, 4),
    },
    {
      title: "Por que é O(log n)",
      highlight: ["a7"], dim: outRange(7, 7),
      balloon: { anchor: { x: 640, y: 250 }, placement: "bottom",
        text: "Cada sonda corta o espaço de busca <strong>pela metade</strong>: 12 → 6 → 3 → 1. O número de passos é <strong>log₂(n)</strong>.",
        why: "Por isso a escala impressiona: 1.000 itens ≈ 10 passos; 1.000.000 ≈ 20 passos. Dobrar os dados custa <strong>uma</strong> comparação a mais." },
      enter: (ctx) => place(ctx, 7, 7, 7, 4),
    },
    {
      title: "Teste rápido",
      balloon: { anchor: { x: 640, y: 250 }, placement: "bottom",
        text: "Confirme a intuição de escala 👇" },
      quiz: {
        question: "Numa busca binária sobre 1.000.000 de itens ordenados, quantas comparações no pior caso (aprox.)?",
        options: [
          "Cerca de 1.000.000",
          "Cerca de 500.000",
          "Cerca de 20",
          "Cerca de 1.000",
        ],
        answer: 2,
        explain: "log₂(1.000.000) ≈ 20. Como cada passo corta o espaço pela metade, mesmo milhões de itens caem em ~20 comparações.",
      },
    },
    {
      title: "Resumo",
      highlight: ["a7"], dim: outRange(7, 7),
      balloon: { anchor: "a7", placement: "top",
        text: "Busca binária: <strong>array ordenado</strong> → comparar com o <strong>meio</strong> → descartar a metade impossível → repetir até a janela ter 1 elemento.",
        why: "Pré-requisito é a ordenação. Se os dados mudam muito e você busca o tempo todo, vale manter ordenado (ou usar uma hash map para O(1) médio)." },
      enter: (ctx) => place(ctx, 7, 7, 7, 4),
    },
  ];

  window.BUSCA_BINARIA_DIAGRAM = {
    title: "Busca Binária",
    subtitle: "Dividir para conquistar: achar um valor em O(log n)",
    width: W, height: H, autoplayMs: 8000, elements, steps,
  };
})();
