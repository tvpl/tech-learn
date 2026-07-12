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
        why: "É a ordenação que permite, ao olhar um único elemento do meio, descartar <strong>metade</strong> dos candidatos de uma vez.",
        deep: `<p>A ordenação é o que dá "informação de sobra" a cada comparação: ao olhar um único valor do meio, você já sabe automaticamente para que lado está tudo que é maior e tudo que é menor, sem precisar checar cada um.</p>
<div class="xp-bad"><strong>Array não ordenado</strong>[27, 3, 89, 15, 41, 8, ...] — ver que o valor do meio é 89 não diz nada sobre onde 41 pode estar; teria que olhar item por item.</div>
<div class="xp-good"><strong>Array ordenado</strong>[3, 8, 12, 15, 21, 27, 33, 41, 50, 64, 72, 89] — ver que o meio é 27 e o alvo é 41 já garante: 41 só pode estar na metade direita.</div>
<p>Por isso, se o array muda o tempo todo (muitas inserções) e você também busca com frequência, pode valer mais a pena usar uma estrutura como uma hash map — o custo de manter tudo ordenado pode superar o ganho da busca binária.</p>` },
    },
    {
      title: "O que queremos achar",
      show: ["alvo"], highlight: ["alvo"],
      balloon: { anchor: "alvo", placement: "bottom",
        text: "Queremos o índice do valor <strong>" + ALVO + "</strong>. Uma busca linear olharia posição por posição — até <strong>12</strong> comparações aqui.",
        why: "A busca binária faz muito menos: ela <strong>divide para conquistar</strong>.",
        deep: `<p>"Dividir para conquistar" é uma estratégia que aparece em muitos algoritmos (merge sort, quick sort): resolver um problema grande resolvendo repetidamente uma versão bem menor dele, descartando a parte que não interessa.</p>
<div class="xp-example"><strong>Comparação de esforço, 12 elementos</strong>Busca linear (pior caso): olha 1, 2, 3... até achar → até 12 comparações
Busca binária (pior caso): 12 → 6 → 3 → 1 elementos restantes → 4 comparações</div>
<p>A diferença cresce muito com o tamanho do array: dobrar o array custa +1 comparação na busca binária, mas até +1 elemento inteiro a mais na busca linear no pior caso. É essa diferença de crescimento — logarítmico vs. linear — que faz a busca binária escalar tão bem.</p>` },
    },
    {
      title: "Marque os limites: lo e hi",
      show: ["p_lo", "p_hi"], highlight: inRange(0, 11),
      balloon: { anchor: "p_lo", placement: "bottom",
        text: "Dois ponteiros delimitam a janela de busca: <strong>lo</strong> no início (0) e <strong>hi</strong> no fim (11). O alvo, se existir, está entre eles.",
        why: "A cada passo a janela [lo, hi] encolhe. Quando lo passa de hi sem achar, o valor não está no array.",
        deep: `<p>Pense em <code>lo</code> e <code>hi</code> como as bordas de uma "zona de possibilidade": tudo que está fora de [lo, hi] já foi descartado, e tudo que está dentro ainda pode conter o alvo. No começo, essa zona é o array inteiro.</p>
<div class="xp-example"><strong>Estado inicial</strong>lo = 0   (índice do primeiro elemento, valor 3)
hi = 11  (índice do último elemento, valor 89)
Zona de busca: todos os 12 elementos, de 0 a 11</div>
<p>Manter só dois números (<code>lo</code> e <code>hi</code>) para representar toda a janela é o que torna o algoritmo tão leve: não precisa copiar sub-arrays nem criar novas listas a cada passo, só mover dois índices.</p>` },
      enter: (ctx) => place(ctx, 0, 11, null, 0),
    },
    {
      title: "Sonda 1: olhe o meio",
      show: ["p_mid"], highlight: inRange(0, 11), pulse: ["a5"],
      balloon: { anchor: "a5", placement: "top",
        text: "<span class=\"xp-term\" tabindex=\"0\" data-tip=\"mid = (lo + hi) / 2, arredondado para baixo.\">mid</span> = (0 + 11) / 2 = <strong>5</strong> → valor <strong>27</strong>. Como <strong>27 &lt; " + ALVO + "</strong>, o alvo está à <strong>direita</strong>.",
        why: "Toda a metade esquerda (índices 0–5) pode ser descartada: lá os valores só diminuem.",
        deep: `<p>A conta de <code>mid</code> é sempre a mesma: soma dos limites, dividido por 2, arredondado para baixo. Depois disso, basta uma comparação para saber para qual lado ir — é essa única comparação que corta a janela pela metade.</p>
<div class="xp-example"><strong>A regra de decisão</strong>Se array[mid] == alvo    → achou, retorna mid
Se array[mid] < alvo     → alvo está à direita, lo = mid + 1
Se array[mid] > alvo     → alvo está à esquerda, hi = mid - 1</div>
<p>Como o array está ordenado, saber que <code>array[5] = 27</code> é menor que o alvo (41) já garante que os índices 0 a 5 inteiros — não só o 5 — podem ser descartados, porque todos eles são ≤ 27.</p>` },
      enter: (ctx) => place(ctx, 0, 11, 5, 1),
    },
    {
      title: "Descarte a esquerda: lo = 6",
      highlight: inRange(6, 11), dim: outRange(6, 11), pulse: ["a8"],
      balloon: { anchor: "a8", placement: "top",
        text: "Movemos <strong>lo = mid + 1 = 6</strong>. Nova janela: 6–11. mid = (6 + 11) / 2 = <strong>8</strong> → valor <strong>50</strong>. Agora <strong>50 &gt; " + ALVO + "</strong>: o alvo está à <strong>esquerda</strong>.",
        why: "Em duas sondas já restam só 6 dos 12 elementos — e logo bem menos.",
        deep: `<p>Repare que <code>lo</code> pula para <code>mid + 1</code>, não para <code>mid</code> — o elemento do meio já foi comparado e descartado (sabemos que não é o alvo), então não faz sentido incluí-lo de novo na próxima janela.</p>
<div class="xp-example"><strong>(6 + 11) / 2, arredondado para baixo</strong>6 + 11 = 17
17 / 2 = 8.5 → arredonda para baixo → mid = 8
array[8] = 50</div>
<p>O mesmo raciocínio da sonda anterior se repete, só que numa janela menor: como 50 é maior que o alvo (41), toda a sub-janela de 8 a 11 (onde os valores são ≥ 50) pode ser descartada de uma vez.</p>` },
      enter: (ctx) => place(ctx, 6, 11, 8, 2),
    },
    {
      title: "Descarte a direita: hi = 7",
      highlight: inRange(6, 7), dim: outRange(6, 7), pulse: ["a6"],
      balloon: { anchor: "a6", placement: "top",
        text: "Movemos <strong>hi = mid − 1 = 7</strong>. Janela: 6–7. mid = (6 + 7) / 2 = <strong>6</strong> → valor <strong>33</strong>. Como <strong>33 &lt; " + ALVO + "</strong>, vá para a direita: <strong>lo = 7</strong>.",
        why: "A janela tem só dois elementos. Mais uma sonda decide.",
        deep: `<p>Com uma janela de só dois elementos (índices 6 e 7), <code>(6+7)/2 = 6.5</code>, arredondado para baixo dá 6 — a divisão inteira sempre "puxa" o mid para o elemento mais à esquerda quando a janela tem número par de elementos.</p>
<div class="xp-example"><strong>Janela de 2 elementos</strong>índice 6: valor 33
índice 7: valor 41 (o alvo!)
mid = 6 → compara 33 com 41 → 33 é menor → lo = 7</div>
<p>Note que a janela nunca fica vazia enquanto ainda houver candidato: mesmo com 2 elementos, uma única comparação já reduz para 1 elemento — que será verificado na próxima sonda.</p>` },
      enter: (ctx) => place(ctx, 6, 7, 6, 3),
    },
    {
      title: "Achou! índice 7",
      highlight: ["a7"], dim: outRange(7, 7),
      balloon: { anchor: "a7", placement: "top",
        text: "Janela: 7–7. mid = <strong>7</strong> → valor <strong>" + ALVO + "</strong>. <strong>" + ALVO + " == " + ALVO + "</strong> ✅ — encontrado no índice <strong>7</strong> em apenas <strong>4</strong> comparações.",
        why: "A linear poderia gastar 8 comparações para chegar aqui; a binária garantiu 4 no pior caso.",
        deep: `<p>Quando <code>lo == hi</code>, a janela tem exatamente 1 elemento — não há mais divisão possível, essa é a última comparação que o algoritmo pode fazer antes de decidir "achou" ou "não existe".</p>
<div class="xp-example"><strong>Trajeto completo das janelas</strong>[0,11] (12 elementos) → mid=5 (27) → direita
[6,11] (6 elementos)  → mid=8 (50) → esquerda
[6,7]  (2 elementos)  → mid=6 (33) → direita
[7,7]  (1 elemento)   → mid=7 (41) → achou!</div>
<p>Cada sonda aproximadamente divide a janela ao meio, então o número de sondas necessário é o número de vezes que dá para dividir 12 por 2 até sobrar 1 — que é justamente log₂(12) ≈ 3.6, arredondado para 4 no pior caso.</p>` },
      enter: (ctx) => { place(ctx, 7, 7, 7, 4); setTimeout(() => ctx.pulse("a7", true), 120); },
    },
    {
      title: "E se o valor não existir?",
      dim: inRange(0, 11),
      balloon: { anchor: { x: 640, y: 250 }, placement: "bottom",
        text: "Procurando <strong>42</strong> (que não está aqui): a janela encolhe até <strong>lo (8) ultrapassar hi (7)</strong> — repare nos ponteiros <strong>cruzados</strong> abaixo. Janela vazia ⇒ <strong>não encontrado</strong>.",
        why: "O critério de parada é <strong>lo &gt; hi</strong>. É ele que garante o término: ou o valor aparece, ou a janela esvazia provando que ele não existe.",
        deep: `<p>Todo laço precisa de uma condição de parada garantida — na busca binária, é <code>lo &lt;= hi</code>: enquanto for verdade, ainda há elementos a examinar; quando vira falso (<code>lo &gt; hi</code>), a janela ficou vazia e não sobrou nada para checar.</p>
<div class="xp-example"><strong>Buscando 42 (não existe no array)</strong>...janela encolhe normalmente até restar só o índice 7 (valor 41)
41 < 42 → lo = mid + 1 = 8
agora lo (8) > hi (7) → laço para → retorna "não encontrado"</div>
<p>Um erro comum ao implementar isso é usar <code>lo &lt; hi</code> em vez de <code>lo &lt;= hi</code> — isso faz o algoritmo parar cedo demais e nunca checar o último elemento possível da janela, um bug sutil e fácil de deixar passar em testes.</p>` },
      enter: (ctx) => place(ctx, 8, 7, 7, 4),
    },
    {
      title: "Por que é O(log n)",
      highlight: ["a7"], dim: outRange(7, 7),
      balloon: { anchor: { x: 640, y: 250 }, placement: "bottom",
        text: "Cada sonda corta o espaço de busca <strong>pela metade</strong>: 12 → 6 → 3 → 1. O número de passos é <strong>log₂(n)</strong>.",
        why: "Por isso a escala impressiona: 1.000 itens ≈ 10 passos; 1.000.000 ≈ 20 passos. Dobrar os dados custa <strong>uma</strong> comparação a mais.",
        deep: `<p>log₂(n) responde à pergunta "quantas vezes dá para dividir n por 2 até chegar em 1?" — é essa pergunta, não uma fórmula misteriosa, que explica por que o crescimento é tão lento comparado ao tamanho do array.</p>
<div class="xp-example"><strong>Como log₂(n) cresce devagar</strong>n = 12          → ~4 passos
n = 100         → ~7 passos
n = 1.000       → ~10 passos
n = 1.000.000   → ~20 passos</div>
<p>Comparado com uma busca linear, onde o número de passos no pior caso é proporcional a <code>n</code> (o array inteiro), essa é a diferença entre O(log n) e O(n) — a mesma diferença que faz consultas em bancos de dados indexados serem praticamente instantâneas mesmo com bilhões de registros.</p>` },
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
