/* ============================================================================
 * transformer.data.js — CONTEÚDO do explicador da rede Transformer
 * ----------------------------------------------------------------------------
 * Este arquivo NÃO contém lógica de motor: só dados (elementos + cenas).
 * É o modelo a copiar para criar um novo explicador (ver README.md).
 *
 *  - elements[]: tudo que pode aparecer no palco SVG (com um id único)
 *  - steps[]:    a sequência de cenas; cada cena tem um balão e diz o que
 *                mostrar/realçar; cenas avançadas usam enter(ctx) p/ animar.
 *
 * Convenção de visibilidade usada aqui:
 *  - Pipeline à ESQUERDA e bloco do encoder à DIREITA: controlados por
 *    show/hide (acumulam → o diagrama "cresce").
 *  - Detalhes de zoom à direita (chips, vetores, matriz...): NÃO entram em
 *    show/hide; são revelados dentro de enter(ctx) e somem sozinhos ao trocar
 *    de cena (o motor reseta o que não está no conjunto acumulado).
 * ==========================================================================*/

(function () {
  const W = 1280, H = 760;

  // valores "bonitinhos" e determinísticos p/ as barras dos vetores
  const seedRnd = (seed) => () => {
    seed = (seed * 9301 + 49297) % 233280;
    return 0.25 + (seed / 233280) * 0.7;
  };
  const vec = (seed, n = 7) => { const r = seedRnd(seed); return Array.from({ length: n }, r); };

  // --- frase de exemplo e seus tokens -------------------------------------
  const TOKENS = ["O", "gato", "sentou", "no", "tap", "ete"];
  const IDS    = ["41", "920", "1503", "17", "2087", "308"];
  const CX = [580, 690, 800, 910, 1020, 1130];  // centros x dos 6 chips
  const CHIP_Y = 250, CHIP_W = 96, CHIP_H = 54;
  const VEC_Y = 340, VEC_W = 66, VEC_H = 120;

  // helper p/ revelar vários elementos em sequência (efeito cascata)
  const reveal = (ctx, ids, stagger = 70) =>
    ids.forEach((id, i) => setTimeout(() => ctx.show(id), i * stagger));

  // gera o caminho de uma onda senoidal (positional encoding)
  const wavePath = (x0, x1, y, amp, freq) => {
    let d = `M${x0},${y}`;
    for (let x = x0; x <= x1; x += 6) d += ` L${x},${(y - Math.sin((x - x0) / freq) * amp).toFixed(1)}`;
    return d;
  };

  /* ===========================  ELEMENTOS  ============================== */
  const elements = [
    /* ---- PIPELINE VERTICAL (esquerda): o "mapa" do Transformer -------- */
    { id: "li_input", type: "box", x: 70, y: 40, w: 250, h: 46, mono: true,
      label: "“O gato sentou no tapete”" },
    { id: "a1", type: "arrow", x1: 195, y1: 88, x2: 195, y2: 116 },
    { id: "li_token", type: "box", x: 70, y: 118, w: 250, h: 46, label: "1 · Tokenização" },
    { id: "a2", type: "arrow", x1: 195, y1: 166, x2: 195, y2: 194 },
    { id: "li_embed", type: "box", x: 70, y: 196, w: 250, h: 46, label: "2 · Embeddings" },
    { id: "a3", type: "arrow", x1: 195, y1: 244, x2: 195, y2: 272 },
    { id: "li_pos", type: "box", x: 70, y: 274, w: 250, h: 46, label: "3 · + Positional Encoding" },
    { id: "a4", type: "arrow", x1: 195, y1: 322, x2: 195, y2: 350 },

    // bloco do encoder (container + 4 sub-blocos)
    { id: "li_enc", type: "box", x: 60, y: 352, w: 270, h: 210, fill: "#0e1730" },
    { id: "li_cap", type: "label", x: 195, y: 548, sub: true, anchor: "middle",
      label: "4 · Bloco do Encoder  × N" },
    { id: "le_mha", type: "box", x: 80, y: 366, w: 230, h: 40, fill: "#22315d",
      label: "Multi-Head Self-Attention" },
    { id: "le_an1", type: "box", x: 80, y: 414, w: 230, h: 28, fill: "#1b2747", label: "Add & Norm" },
    { id: "le_ffn", type: "box", x: 80, y: 450, w: 230, h: 40, fill: "#22315d", label: "Feed-Forward" },
    { id: "le_an2", type: "box", x: 80, y: 498, w: 230, h: 28, fill: "#1b2747", label: "Add & Norm" },

    { id: "a5", type: "arrow", x1: 195, y1: 562, x2: 195, y2: 590 },
    { id: "li_head", type: "box", x: 60, y: 592, w: 270, h: 50,
      label: ["5 · Cabeça de saída", "Linear → Softmax"] },
    { id: "a6", type: "arrow", x1: 195, y1: 642, x2: 195, y2: 670 },
    { id: "li_out", type: "box", x: 70, y: 672, w: 250, h: 46, fill: "#2a1d3d",
      label: "→ próxima palavra: “tapete”" },

    /* ---- ZONA DE ZOOM (direita) -------------------------------------- */
    // cena 1: frase crua
    { id: "r1_text", type: "label", x: 850, y: 360, size: 40, mono: true, anchor: "middle",
      label: "“O gato sentou no tapete”" },
    { id: "r1_sub", type: "label", x: 850, y: 410, sub: true, anchor: "middle",
      label: "uma simples string de caracteres — o modelo não entende texto, só números" },

    // cena 2/3: chips de token + ids
    ...TOKENS.map((t, i) => ({
      id: "tk_" + i, type: "token", x: CX[i] - CHIP_W / 2, y: CHIP_Y, w: CHIP_W, h: CHIP_H,
      label: t, className: i >= 4 ? "tk-sub" : "", group: "toks",
    })),
    { id: "tk_brace", type: "label", x: 1075, y: 230, sub: true, anchor: "middle",
      label: "“tapete” → sub-palavras" },
    ...IDS.map((d, i) => ({
      id: "id_" + i, type: "label", x: CX[i], y: CHIP_Y + 84, mono: true, anchor: "middle", label: "#" + d,
    })),

    // cena 4/5: vetores de embedding (um por token)
    ...TOKENS.map((t, i) => ({
      id: "ve_" + i, type: "vector", x: CX[i] - VEC_W / 2, y: VEC_Y, w: VEC_W, h: VEC_H,
      values: vec(7 + i * 13), color: "var(--good)", group: "vecs",
    })),
    { id: "r5_wave", type: "arrow", noHead: true, dashed: true, color: "var(--warn)",
      path: wavePath(540, 1170, 530, 26, 26) },
    { id: "r5_lab", type: "label", x: 855, y: 580, sub: true, anchor: "middle",
      label: "padrão senoidal somado a cada posição (0,1,2,3…)" },

    // cena 6..11: réplica ampliada do bloco do encoder (à esquerda da zona)
    { id: "r6_box", type: "box", x: 470, y: 150, w: 300, h: 470, fill: "#0e1730" },
    { id: "r6_cap", type: "label", x: 620, y: 140, sub: true, anchor: "middle", label: "Bloco do Encoder" },
    { id: "r6_mha", type: "box", x: 492, y: 196, w: 256, h: 56, fill: "#22315d",
      label: ["Multi-Head", "Self-Attention"] },
    { id: "r6_an1", type: "box", x: 492, y: 272, w: 256, h: 34, fill: "#1b2747", label: "Add & Norm" },
    { id: "r6_ffn", type: "box", x: 492, y: 340, w: 256, h: 48, fill: "#22315d", label: "Feed-Forward" },
    { id: "r6_an2", type: "box", x: 492, y: 408, w: 256, h: 34, fill: "#1b2747", label: "Add & Norm" },
    { id: "r6_in", type: "arrow", x1: 620, y1: 600, x2: 620, y2: 558 },
    { id: "r6_inlab", type: "label", x: 620, y: 588, sub: true, anchor: "middle",
      label: "embeddings + posição entram aqui ↑" },
    // arcos residuais (à direita do bloco)
    { id: "r6_res1", type: "arrow", color: "var(--warn)",
      path: "M770,289 C815,289 815,224 770,224" },
    { id: "r6_res2", type: "arrow", color: "var(--warn)",
      path: "M770,425 C815,425 815,364 770,364" },

    // cena 7: Q / K / V
    { id: "q_src", type: "vector", x: 850, y: 330, w: 56, h: 110, values: vec(99), color: "var(--accent)" },
    { id: "q_srclab", type: "label", x: 878, y: 470, sub: true, anchor: "middle", label: "“sentou”" },
    { id: "q_q", type: "vector", x: 1080, y: 180, w: 56, h: 90, values: vec(31), color: "var(--accent)" },
    { id: "q_k", type: "vector", x: 1080, y: 320, w: 56, h: 90, values: vec(52), color: "var(--warn)" },
    { id: "q_v", type: "vector", x: 1080, y: 460, w: 56, h: 90, values: vec(73), color: "var(--good)" },
    { id: "q_ql", type: "label", x: 1108, y: 168, sub: true, anchor: "middle", label: "Q · consulta (Wq)" },
    { id: "q_kl", type: "label", x: 1108, y: 308, sub: true, anchor: "middle", label: "K · chave (Wk)" },
    { id: "q_vl", type: "label", x: 1108, y: 448, sub: true, anchor: "middle", label: "V · valor (Wv)" },
    { id: "q_aq", type: "arrow", x1: 912, y1: 360, x2: 1074, y2: 225 },
    { id: "q_ak", type: "arrow", x1: 912, y1: 385, x2: 1074, y2: 365 },
    { id: "q_av", type: "arrow", x1: 912, y1: 410, x2: 1074, y2: 505 },

    // cena 8: matriz de atenção 6×6
    { id: "m_box", type: "matrix", x: 900, y: 210, rows: 6, cols: 6, cell: 46, color: "var(--accent-2)" },
    { id: "m_formula", type: "label", x: 1038, y: 175, mono: true, anchor: "middle",
      label: "softmax( Q·Kᵀ / √dₖ )" },
    { id: "m_qy", type: "label", x: 858, y: 300, sub: true, anchor: "middle", label: "consulta" },
    { id: "m_kx", type: "label", x: 1038, y: 520, sub: true, anchor: "middle", label: "chave (quem olho?)" },
    { id: "m_note", type: "label", x: 1038, y: 560, sub: true, anchor: "middle",
      label: "linha “sentou” pesa forte em “gato” (sujeito da ação)" },

    // cena 9: multi-head (várias cabeças)
    ...[0, 1, 2, 3].map((h) => ({
      id: "h_" + h, type: "matrix", x: 850 + (h % 2) * 230, y: 200 + Math.floor(h / 2) * 200,
      rows: 5, cols: 5, cell: 26,
      color: ["var(--accent)", "var(--warn)", "var(--good)", "var(--hot)"][h],
    })),
    { id: "h_lab", type: "label", x: 1080, y: 600, sub: true, anchor: "middle",
      label: "cada cabeça aprende um tipo de relação diferente (sintaxe, correferência…)" },

    // cena 11: feed-forward (expansão d → 4d → d)
    { id: "f_in", type: "vector", x: 860, y: 320, w: 60, h: 130, values: vec(5, 6), color: "var(--accent)" },
    { id: "f_mid", type: "vector", x: 1000, y: 250, w: 130, h: 200, values: vec(11, 16), color: "var(--accent-2)" },
    { id: "f_out", type: "vector", x: 1180, y: 320, w: 60, h: 130, values: vec(17, 6), color: "var(--good)" },
    { id: "f_a1", type: "arrow", x1: 924, y1: 385, x2: 996, y2: 350 },
    { id: "f_a2", type: "arrow", x1: 1134, y1: 350, x2: 1176, y2: 385 },
    { id: "f_l1", type: "label", x: 890, y: 470, sub: true, anchor: "middle", label: "d (ex.: 512)" },
    { id: "f_l2", type: "label", x: 1065, y: 470, sub: true, anchor: "middle", label: "4d + GELU" },
    { id: "f_l3", type: "label", x: 1210, y: 470, sub: true, anchor: "middle", label: "d" },

    // cena 12: pilha de N blocos
    ...[0, 1, 2].map((k) => ({
      id: "st_" + k, type: "box", x: 760 - k * 30, y: 200 + k * 70, w: 320, h: 120, fill: "#162b4a",
      label: k === 0 ? "Bloco 1" : k === 1 ? "Bloco 2" : "Bloco N",
    })),
    { id: "st_arr", type: "arrow", x1: 920, y1: 470, x2: 920, y2: 360 },
    { id: "st_lab", type: "label", x: 905, y: 560, sub: true, anchor: "middle",
      label: "12, 24, 96+ blocos idênticos empilhados — cada um refina a representação" },

    // cena 13: cabeça de saída (distribuição sobre o vocabulário)
    ...[["tapete", 0.62], ["chão", 0.18], ["sofá", 0.12], ["carpete", 0.08]].map((c, i) => ({
      id: "o_" + i, type: "vector", x: 720 + i * 130, y: 250, w: 80, h: 260,
      values: [c[1] / 0.62], color: i === 0 ? "var(--hot)" : "var(--ink-soft)",
    })),
    ...[["tapete", 0.62], ["chão", 0.18], ["sofá", 0.12], ["carpete", 0.08]].map((c, i) => ({
      id: "ol_" + i, type: "label", x: 760 + i * 130, y: 540, anchor: "middle",
      label: c[0] + "  " + Math.round(c[1] * 100) + "%",
    })),
    { id: "o_title", type: "label", x: 980, y: 210, anchor: "middle",
      label: "P( próxima palavra | contexto )" },

    // cena 14: rótulo de resumo
    { id: "sum_lab", type: "label", x: 850, y: 380, size: 22, anchor: "middle",
      label: "texto → números → vetores → atenção → contexto → próxima palavra" },
    { id: "sum_sub", type: "label", x: 850, y: 420, sub: true, anchor: "middle",
      label: "…e repete, palavra após palavra (geração autoregressiva)" },

    // decoder: máscara causal + loop de geração
    { id: "cm_box", type: "matrix", x: 840, y: 220, rows: 5, cols: 5, cell: 52, color: "var(--accent-2)" },
    { id: "cm_t", type: "label", x: 970, y: 195, anchor: "middle", label: "máscara causal (triangular)" },
    { id: "cm_n", type: "label", x: 970, y: 520, sub: true, anchor: "middle",
      label: "cada token só enxerga os anteriores — nunca o “futuro”" },
    { id: "gen_box", type: "box", x: 560, y: 300, w: 540, h: 96, fill: "#0e1730",
      label: ["O gato sentou no  →  “tapete”", "↺ “tapete” vira entrada e prevê a próxima palavra"] },
    { id: "gen_loop", type: "arrow", color: "var(--hot)", path: "M64,694 C14,694 14,62 64,62" },
  ];

  /* =============================  CENAS  =============================== */
  const steps = [
    { // 1
      title: "Texto de entrada",
      show: ["li_input"],
      highlight: ["li_input"],
      balloon: {
        anchor: "r1_text", placement: "bottom",
        text: "Tudo começa com texto cru: <strong>“O gato sentou no tapete”</strong>. Para o computador, isso é apenas uma sequência de caracteres.",
        why: "Uma rede neural só faz contas com números. Então o primeiro trabalho é transformar texto em números.",
        deep: `<p>Do ponto de vista do modelo, a string é só uma sequência de bytes — sem "entendimento" nenhum embutido nela. Todo o "conhecimento" do Transformer vem de pesos numéricos aprendidos durante o treino, não de regras de linguagem escritas à mão.</p>
<div class="xp-example"><strong>O que o modelo recebe de fato</strong>Texto: "O gato sentou no tapete"
Depois de todo o pipeline (tokenizar → IDs → embeddings → atenção): uma sequência de vetores de números — nenhum caractere sobrevive além da primeira etapa</div>
<p>Esse é o motivo do pipeline inteiro existir: cada etapa (tokenização, embedding, positional encoding) converte uma representação mais "humana" numa mais "matemática", até sobrar só álgebra linear que a rede consegue processar.</p>` },
      enter: (ctx) => reveal(ctx, ["r1_text", "r1_sub"], 120),
    },
    { // 2
      title: "Tokenização (subword)",
      show: ["a1", "li_token"],
      highlight: ["li_token"],
      balloon: {
        anchor: "tk_4", placement: "bottom",
        text: "O texto é quebrado em <strong>tokens</strong>. Palavras comuns viram 1 token; palavras raras se dividem em sub-palavras — aqui <strong>“tapete” → “tap” + “ete”</strong>.",
        why: "Um vocabulário fixo (~50 mil pedaços) cobre qualquer texto, inclusive palavras novas ou com erros, sem ficar gigante.",
        deep: `<p>O algoritmo mais comum para construir esse vocabulário é <strong>BPE</strong> (Byte-Pair Encoding): parte de caracteres individuais e vai mesclando os pares mais frequentes no corpus de treino, repetidamente, até atingir o tamanho de vocabulário desejado. Palavras frequentes acabam virando 1 token inteiro; palavras raras ficam fragmentadas.</p>
<div class="xp-example"><strong>Tokenização de palavras diferentes</strong>"gato" → 1 token (palavra comum)
"tapete" → 2 tokens: "tap" + "ete" (menos frequente)
"antidisconstitucionalissimamente" → vários tokens pequenos</div>
<p>Essa estratégia resolve um problema real: um vocabulário de palavras inteiras nunca cobriria neologismos, erros de digitação ou nomes próprios raros. Com sub-palavras, qualquer string pode ser reconstruída — no pior caso, caractere por caractere.</p>` },
      enter: (ctx) => {
        reveal(ctx, ["tk_0", "tk_1", "tk_2", "tk_3"], 90);
        setTimeout(() => reveal(ctx, ["tk_4", "tk_5", "tk_brace"], 110), 420);
      },
    },
    { // 3
      title: "Token IDs",
      balloon: {
        anchor: "id_2", placement: "bottom",
        text: "Cada token vira um <strong>número inteiro</strong>: o índice dele na tabela de vocabulário. A frase agora é uma lista de IDs.",
        why: "IDs são apenas endereços — o significado ainda não está aí. É o próximo passo que dá sentido a eles.",
        deep: `<p>O ID é arbitrário — só um índice numa lista fixa de dezenas de milhares de tokens possíveis, decidida uma vez durante o treino do tokenizador e nunca mudada depois. Dois tokens com IDs próximos (ex.: 41 e 42) não são necessariamente parecidos em significado.</p>
<div class="xp-example"><strong>Frase virando IDs</strong>["O", "gato", "sentou", "no", "tap", "ete"]
→ [41, 920, 1503, 17, 2087, 308]</div>
<p>É por isso que o ID sozinho não serve de entrada útil para a rede: 1503 não "parece" mais com 1504 do que com 41 — não há noção de distância ou semelhança num simples índice. O próximo passo (embeddings) é o que resolve isso, mapeando cada ID a um vetor onde distância <em>importa</em>.</p>` },
      enter: (ctx) => {
        reveal(ctx, ["tk_0", "tk_1", "tk_2", "tk_3", "tk_4", "tk_5"], 40);
        setTimeout(() => reveal(ctx, ["id_0", "id_1", "id_2", "id_3", "id_4", "id_5"], 80), 250);
      },
    },
    { // 4
      title: "Embeddings",
      show: ["a2", "li_embed"],
      highlight: ["li_embed"],
      balloon: {
        anchor: "ve_2", placement: "bottom",
        text: "Cada ID consulta uma <strong>tabela de embeddings</strong> e vira um vetor denso de números (ex.: 512 ou 768 dimensões), mostrado aqui como barras.",
        why: "No espaço vetorial, palavras de sentido parecido ficam próximas — é assim que o modelo guarda significado, aprendido no treino.",
        deep: `<p>A tabela de embeddings é literalmente uma matriz gigante (vocabulário × dimensões), uma linha por token possível. Consultar o embedding de um ID é só indexar essa matriz — mas os <em>valores</em> de cada linha foram ajustados durante o treino para capturar significado.</p>
<div class="xp-example"><strong>Ilustração simplificada (3 dimensões, na prática são centenas)</strong>embed("gato")  = [0.81, 0.42, 0.05]
embed("cão")   = [0.79, 0.39, 0.11]   ← próximo de "gato" (ambos são animais domésticos)
embed("tapete") = [0.10, 0.88, 0.60]   ← distante de "gato" (contexto diferente)</div>
<p>Essa proximidade não é programada manualmente — emerge do treino, porque palavras que aparecem em contextos parecidos (ex.: "gato" e "cão" costumam aparecer perto de "adotar", "raça", "veterinário") acabam recebendo vetores parecidos.</p>` },
      // demonstra os GRUPOS: revela todos os ids do grupo de uma vez
      enter: (ctx) => {
        ctx.reveal("toks", 30);
        setTimeout(() => ctx.reveal("vecs", 90), 200);
      },
    },
    { // 5
      title: "Positional Encoding",
      show: ["a3", "li_pos"],
      highlight: ["li_pos"],
      balloon: {
        anchor: { x: 855, y: 530 }, placement: "top",
        text: "Soma-se a cada embedding um <strong>padrão de posição</strong> (ondas de seno/cosseno), codificando se o token é o 1º, 2º, 3º…",
        why: "A atenção olha todos os tokens ao mesmo tempo e não tem noção de ordem. Sem isso, “gato mordeu cão” = “cão mordeu gato”.",
        deep: `<p>A fórmula original usa senos e cossenos de frequências diferentes para cada posição — cada posição ganha uma "assinatura" única de ondas, e posições próximas geram assinaturas parecidas (mudança suave, não abrupta).</p>
<div class="xp-example"><strong>Vetor de posição somado ao embedding</strong>embed("gato") original = [0.81, 0.42, 0.05, ...]
pos_encoding(posição 1) = [0.84, 0.54, 0.00, ...]
entrada final           = soma dos dois, elemento a elemento</div>
<p>Alternativas mais recentes (como <strong>RoPE</strong>, usada em vários modelos atuais) codificam a posição rotacionando os vetores Q e K dentro da própria atenção, em vez de somar algo ao embedding de entrada — mas o objetivo é o mesmo: dar à rede, que processa tudo em paralelo, uma noção de ordem que ela não teria de outra forma.</p>` },
      enter: (ctx) => {
        reveal(ctx, ["ve_0", "ve_1", "ve_2", "ve_3", "ve_4", "ve_5"], 20);
        setTimeout(() => reveal(ctx, ["r5_wave", "r5_lab"], 150), 150);
      },
    },
    { // 6
      title: "Bloco do Encoder",
      show: ["a4", "li_enc", "li_cap", "le_mha", "le_an1", "le_ffn", "le_an2",
             "r6_box", "r6_cap", "r6_mha", "r6_an1", "r6_ffn", "r6_an2", "r6_in", "r6_inlab", "r6_res1", "r6_res2"],
      highlight: ["li_enc"],
      balloon: {
        anchor: "r6_box", placement: "left",
        text: "Os vetores entram no <strong>bloco do encoder</strong>. Ele tem duas sub-camadas: <strong>Self-Attention</strong> e <strong>Feed-Forward</strong>, cada uma embrulhada por <strong>Add &amp; Norm</strong> (setas amarelas = atalhos residuais).",
        why: "Esse mesmo bloco é repetido N vezes. Vamos abrir cada parte dele a seguir.",
        deep: `<p>Cada uma das duas sub-camadas tem um papel diferente e complementar: a atenção <strong>mistura informação entre tokens</strong> (o que "gato" aprende sobre "sentou"); o feed-forward <strong>processa cada token individualmente</strong>, em maior profundidade.</p>
<div class="xp-example"><strong>Fluxo de dados dentro do bloco</strong>entrada (embeddings + posição)
  → Self-Attention (mistura entre tokens) → Add & Norm
  → Feed-Forward (processa cada token) → Add & Norm
  → saída (mesma forma da entrada, pronta para o próximo bloco)</div>
<p>A saída tem exatamente o mesmo formato da entrada (mesmo número de tokens, mesma dimensão de vetor) — por isso o bloco pode ser empilhado N vezes sem nenhuma mudança de "encanamento": a saída de um bloco encaixa direto na entrada do próximo.</p>` },
    },
    { // 7
      title: "Self-Attention: Q, K, V",
      highlight: ["le_mha", "r6_mha"],
      balloon: {
        anchor: "q_v", placement: "right",
        text: "Dentro da atenção, cada token gera 3 vetores via matrizes aprendidas: <strong>Q</strong> (o que eu procuro), <strong>K</strong> (o que eu ofereço) e <strong>V</strong> (a informação que entrego).",
        why: "Separar “procura” (Q), “rótulo” (K) e “conteúdo” (V) permite que cada palavra busque dinamicamente as outras relevantes.",
        deep: `<p>Q, K e V vêm todos do <em>mesmo</em> vetor de entrada de "sentou" — só passam por três matrizes de pesos diferentes (Wq, Wk, Wv), aprendidas no treino. É uma simples multiplicação de matriz: <code>Q = entrada · Wq</code>, e igual para K e V.</p>
<div class="xp-example"><strong>Uma analogia de busca</strong>Q("sentou") = "estou procurando: quem é o sujeito desta ação?"
K("gato")   = "eu ofereço: sou um substantivo, sujeito em potencial"
K("no")     = "eu ofereço: sou uma preposição"
→ Q("sentou") combina muito mais com K("gato") do que com K("no")</div>
<p>V é o que de fato é somado na saída depois que os pesos de atenção são calculados — Q e K só servem para decidir <em>quanto</em> de cada V entra na mistura final.</p>` },
      enter: (ctx) => {
        reveal(ctx, ["q_src", "q_srclab"], 60);
        setTimeout(() => {
          ["q_aq", "q_ak", "q_av"].forEach((a) => { ctx.show(a); ctx.drawArrow(a); });
          reveal(ctx, ["q_q", "q_k", "q_v", "q_ql", "q_kl", "q_vl"], 90);
        }, 350);
      },
    },
    { // 8
      title: "Scores de atenção",
      highlight: ["le_mha", "r6_mha"],
      balloon: {
        anchor: "m_box", placement: "left",
        text: "Multiplica-se cada <strong>Q</strong> por todos os <strong>K</strong> (Q·Kᵀ), escala por √dₖ e aplica <span class=\"xp-term\" tabindex=\"0\" data-tip=\"Transforma números quaisquer em probabilidades positivas que somam 1.\">softmax</span>. Resulta numa matriz de <strong>pesos</strong>: quanto cada token atende aos demais (cada linha soma 1).",
        why: "Assim “sentou” pode pesar forte em “gato” (o sujeito) e fraco em “no”. O resultado é a soma dos V ponderada por esses pesos.",
        deep: `<p>O produto Q·K é um <strong>produto escalar</strong> — quanto mais alinhados dois vetores, maior o número. Dividir por √dₖ evita que esses números fiquem grandes demais (o que "achataria" o softmax, fazendo-o virar quase um one-hot). O softmax então transforma os números crus em pesos que somam exatamente 1 por linha.</p>
<div class="xp-example"><strong>Scores brutos → pesos de atenção para a linha "sentou"</strong>Q(sentou)·K(gato) = 4.1   Q(sentou)·K(sentou) = 3.0
Q(sentou)·K(no)   = 0.8   Q(sentou)·K(tapete) = 1.2
↓ softmax
peso(gato) = 0.55   peso(sentou) = 0.24   peso(no) = 0.05   peso(tapete) = 0.16</div>
<p>A saída daquela linha é a soma ponderada: <code>0.55·V(gato) + 0.24·V(sentou) + 0.05·V(no) + 0.16·V(tapete)</code> — o vetor de "sentou" sai da atenção "carregado" de informação sobre "gato", proporcional ao peso.</p>` },
      enter: (ctx) => {
        reveal(ctx, ["m_box", "m_formula", "m_qy", "m_kx", "m_note"], 80);
        setTimeout(() => ctx.lightCells("m_box", [
          [0, 0, .9], [1, 1, .85], [2, 1, .95], [2, 2, .4], [2, 0, .55],
          [3, 3, .8], [4, 4, .7], [5, 5, .7], [1, 0, .35], [4, 1, .3],
        ]), 500);
      },
    },
    { // 9
      title: "Multi-Head Attention",
      highlight: ["le_mha", "r6_mha"],
      balloon: {
        anchor: { x: 1080, y: 400 }, placement: "left",
        text: "Não há uma atenção só, mas <strong>várias cabeças em paralelo</strong>. Cada uma tem seus próprios Q/K/V e olha um aspecto diferente das relações.",
        why: "Uma cabeça pode seguir sintaxe; outra, correferência; outra, proximidade. As saídas são concatenadas e projetadas de volta.",
        deep: `<p>Se a dimensão do modelo é 512 e há 8 cabeças, cada cabeça trabalha com vetores de 512/8 = 64 dimensões — a dimensão total é dividida entre as cabeças, não multiplicada. Cada uma tem seu próprio conjunto de matrizes Wq/Wk/Wv, aprendidas de forma independente.</p>
<div class="xp-example"><strong>4 cabeças, 4 focos diferentes (ilustrativo)</strong>Cabeça 1: "sentou" → peso alto em "gato" (relação sujeito-verbo)
Cabeça 2: "no" → peso alto em "tapete" (preposição-objeto)
Cabeça 3: "sentou" → peso alto em posições próximas (localidade)
Cabeça 4: padrão mais difuso, sem foco claro</div>
<p>No fim, as saídas das cabeças são concatenadas lado a lado e passam por uma última matriz de projeção, que volta ao tamanho original — é assim que "8 visões parciais de 64 dimensões" viram de novo "1 visão combinada de 512 dimensões".</p>` },
      enter: (ctx) => {
        reveal(ctx, ["h_0", "h_1", "h_2", "h_3", "h_lab"], 110);
        ["h_0", "h_1", "h_2", "h_3"].forEach((id, k) =>
          setTimeout(() => ctx.lightCells(id, [[0, 1, .8], [1, 3, .7], [2, 2, .9], [3, 0, .6], [4, 4, .7]]), 300 + k * 150));
      },
    },
    { // 10
      title: "Add & Norm (residual)",
      highlight: ["le_an1", "r6_an1", "r6_res1"],
      balloon: {
        anchor: "r6_res1", placement: "left",
        text: "A saída da atenção é <strong>somada à própria entrada</strong> (conexão residual, seta amarela) e passa por <strong>LayerNorm</strong>.",
        why: "O atalho residual deixa o gradiente fluir e preserva a informação original; o LayerNorm estabiliza os valores. Sem eles, redes profundas não treinam bem.",
        deep: `<p>A conexão residual é literalmente <code>saída = entrada + atenção(entrada)</code> — a camada de atenção só precisa aprender a <em>diferença</em> (o "ajuste") em relação à entrada, em vez de reconstruir tudo do zero. Isso facilita muito o treino de redes com dezenas de blocos empilhados.</p>
<div class="xp-example"><strong>Por que isso importa em redes profundas</strong>Sem atalho: sinal de erro precisa atravessar N blocos "puros" durante o treino → tende a desaparecer (vanishing gradient)
Com atalho: existe um caminho direto entrada→saída em cada bloco → o sinal de erro sempre tem uma rota curta</div>
<p>O LayerNorm, aplicado logo depois, reescala os valores de cada vetor para média e variância estáveis — evita que os números cresçam ou encolham descontroladamente à medida que atravessam blocos sucessivos.</p>` },
    },
    { // 11
      title: "Feed-Forward (MLP)",
      highlight: ["le_ffn", "r6_ffn"],
      balloon: {
        anchor: "f_mid", placement: "bottom",
        text: "Cada posição passa, de forma independente, por um <strong>MLP</strong>: expande para ~4× a dimensão, aplica uma não-linearidade (GELU) e volta ao tamanho original.",
        why: "A atenção mistura informação entre tokens; o feed-forward transforma cada token em profundidade, dando capacidade de representação não-linear.",
        deep: `<p>"Independente" aqui é a palavra-chave: ao contrário da atenção, o feed-forward processa cada posição sozinha, sem olhar para as vizinhas — é a mesma rede (os mesmos pesos) aplicada token a token.</p>
<div class="xp-example"><strong>Dimensões de um bloco típico</strong>entrada: vetor de 512 dimensões
expansão: 512 → 2048 (4×) via primeira camada linear
não-linearidade: GELU (deixa passar valores positivos, amortece os negativos)
projeção de volta: 2048 → 512 via segunda camada linear</div>
<p>Sem a não-linearidade, empilhar camadas lineares equivaleria matematicamente a uma única camada linear — é o GELU que dá à rede a capacidade de aproximar funções complexas, não apenas combinações lineares dos embeddings de entrada.</p>` },
      enter: (ctx) => {
        reveal(ctx, ["f_in", "f_l1"], 60);
        setTimeout(() => { ctx.show("f_a1"); ctx.drawArrow("f_a1"); reveal(ctx, ["f_mid", "f_l2"], 60); }, 350);
        setTimeout(() => { ctx.show("f_a2"); ctx.drawArrow("f_a2"); reveal(ctx, ["f_out", "f_l3"], 60); }, 750);
      },
    },
    { // 12
      title: "Empilhar N camadas",
      hide: ["r6_box", "r6_cap", "r6_mha", "r6_an1", "r6_ffn", "r6_an2", "r6_in", "r6_inlab", "r6_res1", "r6_res2"],
      highlight: ["li_enc"],
      balloon: {
        anchor: "st_1", placement: "left",
        text: "O bloco inteiro é <strong>repetido N vezes</strong> (12, 24, 96+ camadas). A saída de um vira a entrada do próximo.",
        why: "Camadas iniciais captam padrões locais (sintaxe); as profundas, sentido abstrato e contexto global. Empilhar é o que dá ‘profundidade de raciocínio’.",
        deep: `<p>Cada bloco tem seu próprio conjunto de pesos (Wq/Wk/Wv, matrizes do feed-forward) — não é o mesmo bloco reaplicado N vezes, são N blocos diferentes, cada um aprendendo a refinar um pouco mais a representação recebida do anterior.</p>
<div class="xp-example"><strong>Progressão intuitiva pelas camadas (simplificado)</strong>Bloco 1: relações sintáticas próximas (sujeito ↔ verbo)
Bloco ~metade: relações semânticas de médio alcance (referências, concordância)
Bloco final: representação abstrata, pronta para prever a próxima palavra</div>
<p>Não existe um limite fixo de "quantas camadas bastam" — mais camadas em geral aumentam a capacidade do modelo, mas também o custo computacional e a dificuldade de treinar. É um dos principais botões de escala usados para tornar um modelo maior ou menor.</p>` },
      enter: (ctx) => {
        reveal(ctx, ["st_2", "st_1", "st_0", "st_lab"], 130);
        setTimeout(() => { ctx.show("st_arr"); ctx.drawArrow("st_arr"); }, 500);
      },
    },
    { // 13
      title: "Cabeça de saída",
      show: ["a5", "li_head", "a6", "li_out"],
      highlight: ["li_head", "li_out"],
      balloon: {
        anchor: "o_0", placement: "left",
        text: "O vetor final passa por uma <strong>camada Linear</strong> até o tamanho do vocabulário e por <strong>softmax</strong>, virando uma <strong>probabilidade para cada próxima palavra</strong>. Aqui vence <strong>“tapete”</strong>.",
        why: "Para gerar texto, escolhe-se uma palavra, ela é acrescentada à entrada e tudo recomeça — token a token. É a geração autoregressiva.",
        deep: `<p>A camada linear final projeta o vetor de saída (ex.: 512 dimensões) para um vetor do tamanho do vocabulário inteiro (ex.: 50 mil), um número por token possível. O softmax transforma esses números crus (chamados <em>logits</em>) em probabilidades que somam 1.</p>
<div class="xp-example"><strong>Distribuição de probabilidade sobre o vocabulário</strong>P("tapete")  = 0.62
P("chão")    = 0.18
P("sofá")    = 0.12
P("carpete") = 0.08
(e uma fatia minúscula espalhada entre os outros ~50 mil tokens)</div>
<p>Escolher sempre o token de maior probabilidade (greedy) tende a gerar texto repetitivo; por isso, na prática, geradores costumam amostrar dessa distribuição com técnicas como <em>temperature</em> ou <em>top-p</em>, introduzindo alguma variação controlada.</p>` },
      enter: (ctx) => {
        reveal(ctx, ["o_title", "o_0", "o_1", "o_2", "o_3"], 80);
        setTimeout(() => reveal(ctx, ["ol_0", "ol_1", "ol_2", "ol_3"], 70), 250);
        setTimeout(() => ctx.pulse("o_0", true), 700);
      },
    },
    { // 14
      title: "Atenção causal (no decoder)",
      balloon: { anchor: "cm_box", placement: "left",
        text: "Em modelos geradores (decoder, estilo GPT), a self-attention é <span class=\"xp-term\" tabindex=\"0\" data-tip=\"As posições futuras recebem -infinito antes do softmax, então seu peso vira zero.\">mascarada</span>: cada posição só atende às <strong>anteriores</strong> e a si mesma (triângulo inferior).",
        why: "Durante a geração, o modelo não pode “espiar” a palavra que ainda vai prever. A máscara triangular garante isso.",
        deep: `<p>Na prática, a máscara soma <code>-infinito</code> aos scores Q·K das posições futuras <em>antes</em> do softmax — e como <code>e^(-infinito) = 0</code>, essas posições recebem peso exatamente zero depois do softmax, sem precisar de nenhuma lógica condicional especial.</p>
<div class="xp-example"><strong>Matriz de atenção causal (linha = quem atende, coluna = quem é atendido)</strong>token 1 ("O")      → só pode ver: token 1
token 2 ("gato")   → pode ver: tokens 1, 2
token 3 ("sentou") → pode ver: tokens 1, 2, 3
...cada linha "acende" um pouco mais que a anterior — forma um triângulo</div>
<p>Esse mesmo mecanismo é o que permite treinar em paralelo: o modelo prevê todas as posições da sequência de uma vez durante o treino, mas cada previsão só "enxergou" o passado — exatamente como aconteceria gerando token a token.</p>` },
      enter: (ctx) => {
        ctx.reveal(["cm_box", "cm_t", "cm_n"], 90);
        const cells = [];
        for (let r = 0; r < 5; r++) for (let c = 0; c <= r; c++) cells.push([r, c, c === r ? 0.9 : 0.5]);
        setTimeout(() => ctx.lightCells("cm_box", cells), 350);
      },
    },
    { // 15
      title: "Geração autoregressiva",
      show: ["gen_loop"], highlight: ["li_input", "li_out"],
      balloon: { anchor: "gen_box", placement: "bottom",
        text: "A palavra escolhida é <strong>anexada à entrada</strong> e todo o fluxo recomeça para prever a próxima — e assim sucessivamente.",
        why: "Por isso o texto sai palavra a palavra. O mesmo passo se repete até sair um token de parada (fim de texto).",
        deep: `<p>"Autoregressivo" significa que cada previsão depende das previsões anteriores — o modelo nunca gera a frase inteira de uma vez, mas sim um token, olha para trás (incluindo o que acabou de gerar) e prevê o próximo.</p>
<div class="xp-example"><strong>Três passos do loop</strong>Entrada: "O gato sentou no" → gera "tapete"
Entrada: "O gato sentou no tapete" → gera "."
Entrada: "O gato sentou no tapete." → gera token especial de fim de texto (para)</div>
<p>Esse loop custa uma passada completa pela rede por token gerado — é o motivo de gerar textos longos ser mais lento que gerar textos curtos, e por que técnicas de cache (guardar os K/V já calculados dos tokens anteriores) são essenciais para tornar isso rápido o suficiente para uso interativo.</p>` },
      enter: (ctx) => { ctx.show("gen_box"); ctx.drawArrow("gen_loop"); ctx.pulse("gen_loop", true); },
    },
    { // 16
      title: "Teste rápido",
      balloon: { anchor: { x: 380, y: 360 }, placement: "right",
        text: "Antes do resumo, fixe o conceito mais importante 👇" },
      quiz: {
        question: "Por que o Transformer precisa do positional encoding?",
        options: [
          "Para comprimir os embeddings e economizar memória",
          "Porque a self-attention, sozinha, não tem noção da ordem das palavras",
          "Para acelerar o cálculo do softmax",
          "Para evitar overfitting durante o treino",
        ],
        answer: 1,
        explain: "A atenção processa todos os tokens em paralelo; sem um sinal de posição, “gato mordeu cão” e “cão mordeu gato” ficariam idênticos.",
      },
    },
    { // 17
      title: "Resumo do fluxo",
      highlight: ["li_input", "li_token", "li_embed", "li_pos", "li_enc", "li_head", "li_out"],
      balloon: {
        anchor: { x: 850, y: 400 }, placement: "top",
        text: "Esse é o caminho completo: <strong>texto → tokens → embeddings (+posição) → blocos de atenção → cabeça de saída → próxima palavra</strong>.",
        why: "A peça-chave é a self-attention: deixa cada palavra ‘olhar’ todas as outras e construir contexto. Empilhada muitas vezes, é o que torna os Transformers tão poderosos.",
        deep: `<p>Vale destacar o que muda entre treino e uso (inferência): durante o treino, o modelo vê o texto inteiro de uma vez e aprende a prever cada posição em paralelo (com a máscara causal garantindo que não "veja o futuro"); durante a geração, ele de fato roda o loop token a token descrito nas últimas cenas.</p>
<div class="xp-example"><strong>O pipeline completo, de ponta a ponta</strong>"O gato sentou no tapete"
→ tokens: [O, gato, sentou, no, tap, ete]
→ embeddings + posição: vetores densos por token
→ N blocos de atenção + feed-forward: contexto se acumula
→ cabeça de saída: distribuição de probabilidade sobre o vocabulário
→ próxima palavra escolhida, e o ciclo recomeça</div>
<p>Essa mesma arquitetura, com pequenas variações (encoder-only, decoder-only, encoder-decoder), é a base de praticamente todos os LLMs modernos de texto — o que muda entre modelos é sobretudo escala (número de blocos, dimensões) e dados de treino, não o mecanismo central.</p>` },
      enter: (ctx) => {
        reveal(ctx, ["sum_lab", "sum_sub"], 150);
        ["a1", "a2", "a3", "a4", "a5", "a6"].forEach((a, k) => setTimeout(() => ctx.pulse(a, true), k * 120));
      },
    },
  ];

  /** @type {import("../engine/explainer.types.js").Diagram} */
  window.TRANSFORMER_DIAGRAM = {
    title: "Como funciona uma rede Transformer",
    subtitle: "Do texto cru à próxima palavra — passo a passo",
    width: W, height: H,
    autoplayMs: 8000,
    elements, steps,
  };
})();
