/* ============================================================================
 * hashmap.data.js — Explicador: como um Hash Map funciona por dentro
 * Chave → função hash → índice → bucket; colisão, encadeamento, busca, resize.
 * Mesmo motor genérico (engine/), só conteúdo.
 * ==========================================================================*/
(function () {
  const W = 1280, H = 720;
  const N = 8;
  const BX = 850, BW = 210, BH = 52;                 // array de buckets (direita)
  const BY = (i) => 78 + i * 74;                     // topo do bucket i
  const HX = 470;                                    // função hash (meio)

  const elements = [
    // função hash + chave de entrada
    { id: "key", type: "token", x: 110, y: 308, w: 170, h: 48, label: "“Ana” 🔑" },
    { id: "hash", type: "box", x: HX - 110, y: 300, w: 220, h: 64, fill: "#22315d", mono: true,
      label: ["função hash", "h(key) % 8"] },
    { id: "a_kh", type: "arrow", x1: 285, y1: 332, x2: HX - 115, y2: 332 },
    { id: "calc", type: "label", x: HX, y: 405, sub: true, mono: true, anchor: "middle",
      label: "h('Ana') = 1899  →  1899 % 8 = 3" },
    { id: "a_hb", type: "arrow", x1: HX + 115, y1: 332, x2: BX - 12, y2: BY(3) + BH / 2, color: "var(--good)" },

    // array de buckets (índices 0..7)
    ...Array.from({ length: N }, (_, i) => ({
      id: "b" + i, type: "box", x: BX, y: BY(i), w: BW, h: BH, fill: "#101a33",
    })),
    ...Array.from({ length: N }, (_, i) => ({
      id: "bi" + i, type: "label", x: BX - 26, y: BY(i) + BH / 2, anchor: "middle", mono: true, sub: true, label: String(i),
    })),
    { id: "arr_cap", type: "label", x: BX + BW / 2, y: 48, anchor: "middle", label: "array de buckets (capacidade 8)" },

    // entradas inseridas
    { id: "e_ana", type: "token", x: BX + 14, y: BY(3) + 7, w: 130, h: 38, label: "Ana → 30" },
    { id: "e_beto", type: "token", x: BX + 14, y: BY(6) + 7, w: 130, h: 38, label: "Beto → 25" },
    // colisão: Carla cai no mesmo bucket 3 → encadeada
    { id: "e_carla", type: "token", x: BX + BW + 30, y: BY(3) + 7, w: 150, h: 38, label: "Carla → 41" },
    { id: "e_link", type: "arrow", x1: BX + 146, y1: BY(3) + 26, x2: BX + BW + 28, y2: BY(3) + 26, color: "var(--hot)" },
    { id: "calc2", type: "label", x: HX, y: 440, sub: true, mono: true, anchor: "middle",
      label: "h('Carla') % 8 = 3  →  colisão!" },

    // busca
    { id: "scan", type: "label", x: BX + BW / 2, y: BY(3) - 12, sub: true, anchor: "middle",
      label: "percorre a lista do bucket até achar a chave" },

    // resize
    { id: "resize", type: "token", x: BX + 20, y: BY(7) + 64, w: 320, h: 44, label: "fator de carga alto → dobra p/ 16 e rehash" },
  ];

  const steps = [
    {
      title: "O que é um Hash Map",
      show: ["arr_cap", ...Array.from({ length: N }, (_, i) => "b" + i), ...Array.from({ length: N }, (_, i) => "bi" + i)],
      balloon: { anchor: "b0", placement: "left",
        text: "Um <strong>hash map</strong> (dicionário) guarda pares <strong>chave → valor</strong> e promete busca, inserção e remoção em tempo <strong>O(1) médio</strong>.",
        why: "O segredo é não procurar item por item: a própria chave nos diz <em>onde</em> o valor está, num array de “gavetas” (buckets).",
        deep: `<p>Praticamente toda linguagem tem essa estrutura embutida, com outro nome: <code>dict</code> em Python, <code>Object</code>/<code>Map</code> em JavaScript, <code>HashMap</code> em Java, <code>map</code> em Go. A ideia por trás é sempre a mesma.</p>
<div class="xp-bad"><strong>Sem hash map</strong>Guardar pares num array de listas [["Ana", 30], ["Beto", 25], ...] e, para buscar "Beto", percorrer item por item até achar — O(n).</div>
<div class="xp-good"><strong>Com hash map</strong>Calcular direto o "endereço" de "Beto" a partir da própria chave e ir lá — O(1) médio, sem percorrer nada.</div>
<p>A troca é espaço por velocidade: o hash map usa mais memória (o array de buckets, muitas vezes maior que o necessário) para conseguir acesso quase instantâneo, em vez de percorrer uma lista.</p>` },
    },
    {
      title: "O array de buckets",
      highlight: ["arr_cap"],
      balloon: { anchor: "b4", placement: "left",
        text: "Por baixo existe um <strong>array</strong> de tamanho fixo (aqui 8 posições, índices 0–7). Cada posição é um <strong>bucket</strong>, capaz de guardar entradas.",
        why: "Acessar um índice de array é instantâneo. Falta só transformar uma chave qualquer num índice válido — é o papel da função hash.",
        deep: `<p>Um array puro já é extremamente rápido para acessar por índice numérico (<code>array[3]</code> é O(1)) — o problema é que nossas chaves não são números pequenos e sequenciais, são strings como "Ana" ou "Beto". O hash map existe para preencher exatamente essa lacuna.</p>
<div class="xp-example"><strong>O array por baixo dos panos</strong>índice 0: (vazio)
índice 1: (vazio)
índice 2: (vazio)
índice 3: (vazio) — vai receber "Ana" na próxima cena
...
índice 7: (vazio)</div>
<p>Todo o resto do hash map — a função hash, o tratamento de colisão, o resize — existe só para transformar uma chave qualquer nesse índice numérico de forma confiável e rápida.</p>` },
    },
    {
      title: "A função hash",
      show: ["key", "hash", "a_kh", "calc"], highlight: ["hash"],
      balloon: { anchor: "hash", placement: "bottom",
        text: "A <strong>função hash</strong> transforma a chave (“Ana”) num número grande e, com <strong>% 8</strong>, reduz ao intervalo dos índices. Aqui dá <strong>3</strong>.",
        why: "Uma boa hash espalha as chaves de forma uniforme pelos buckets — menos colisões, desempenho mais previsível.",
        deep: `<p>A função hash costuma combinar os caracteres da string numa conta que produz um número grande e "espalhado" — pequenas mudanças na entrada (mesmo trocar uma letra) tendem a produzir números bem diferentes, o que ajuda a evitar que chaves parecidas caiam sempre no mesmo bucket.</p>
<div class="xp-example"><strong>Duas etapas: hashear e depois encaixar</strong>h("Ana")  = 1899   (número grande, específico da string)
1899 % 8  = 3      (reduzido ao intervalo 0–7 de índices válidos)

h("Beto") = 4550
4550 % 8  = 6</div>
<p>Duas propriedades importam muito aqui: a mesma chave sempre produz o mesmo número (senão você nunca reencontraria o valor guardado), e o resultado precisa se espalhar bem entre os buckets — uma função hash "ruim" que sempre cai nos mesmos índices anula a vantagem de velocidade.</p>` },
      enter: (ctx) => ctx.drawArrow("a_kh"),
    },
    {
      title: "Inserir no bucket",
      show: ["a_hb", "e_ana"], highlight: ["b3", "e_ana"],
      balloon: { anchor: "e_ana", placement: "right",
        text: "O par <strong>“Ana” → 30</strong> é guardado no <strong>bucket 3</strong>. Pronto: inserção em O(1).",
        why: "Para recuperar depois, basta refazer o hash de “Ana”, chegar ao índice 3 e ler o valor. Nada de varrer o array todo.",
        deep: `<p>O par guardado no bucket costuma incluir a <strong>chave inteira</strong>, não só o valor — isso é essencial para o caso de colisão (próxima cena): quando dois itens caem no mesmo bucket, é preciso comparar as chaves para saber qual é qual.</p>
<div class="xp-example"><strong>O que fica guardado no bucket 3</strong>bucket[3] = [ ("Ana", 30) ]</div>
<p>Note que "inserção em O(1)" é uma média — depende de calcular o hash (rápido, proporcional ao tamanho da chave) e escrever numa posição do array (instantâneo). O tempo não depende de quantos outros itens já existem no map, ao contrário de uma lista onde inserir no fim depois de verificar duplicatas seria O(n).</p>` },
      enter: (ctx) => ctx.drawArrow("a_hb"),
    },
    {
      title: "Mais uma chave",
      show: ["e_beto"], highlight: ["b6", "e_beto"],
      balloon: { anchor: "e_beto", placement: "right",
        text: "Outra chave, outro índice: <strong>“Beto” → 25</strong> cai no <strong>bucket 6</strong>. Chaves diferentes costumam ir para buckets diferentes.",
        why: "Enquanto cada chave cai num bucket próprio, tudo é O(1) — leitura e escrita diretas.",
        deep: `<p>Com poucas chaves ocupando muitos buckets vazios, a chance de duas caírem no mesmo lugar é baixa — mas não zero. É essa possibilidade, mesmo sendo rara, que o hash map precisa tratar corretamente (é o assunto da próxima cena).</p>
<div class="xp-example"><strong>Estado do array após 2 inserções</strong>bucket[3] = [ ("Ana", 30) ]
bucket[6] = [ ("Beto", 25) ]
buckets 0,1,2,4,5,7 = vazios</div>
<p>Com só 8 buckets, essa sorte não dura muito — à medida que mais chaves entram, a chance de colisão cresce (é o mesmo raciocínio do "paradoxo do aniversário"). É por isso que o hash map precisa de uma estratégia de colisão desde o início, e não só como exceção rara.</p>` },
    },
    {
      title: "Colisão!",
      show: ["calc2", "e_carla", "e_link"], highlight: ["b3", "e_carla"],
      balloon: { anchor: "e_carla", placement: "bottom",
        text: "Duas chaves podem gerar o <strong>mesmo índice</strong>: “Carla” também dá 3. Isso é uma <strong>colisão</strong>. A solução clássica é <strong>encadear</strong>: o bucket vira uma lista.",
        why: "Colisões são inevitáveis (há infinitas chaves para 8 buckets). O importante é resolvê-las sem perder dados — aqui, ligando as entradas numa lista.",
        deep: `<p>"Encadeamento" (chaining) é uma entre várias estratégias possíveis para colisão. A alternativa mais comum é <strong>open addressing</strong>: em vez de uma lista no bucket, o item colidido procura o próximo slot livre no próprio array. Cada abordagem tem trade-offs diferentes de memória e desempenho.</p>
<div class="xp-example"><strong>Bucket 3 antes e depois da colisão</strong>Antes:  bucket[3] = [ ("Ana", 30) ]
Depois: bucket[3] = [ ("Ana", 30), ("Carla", 41) ]</div>
<p>Com encadeamento, o bucket nunca "enche" de verdade — sempre cabe mais um item na lista, ao custo de a busca dentro daquele bucket específico deixar de ser instantânea e virar uma varredura pequena. Enquanto essas listas continuarem curtas, o impacto no desempenho médio é mínimo.</p>` },
      enter: (ctx) => ctx.drawArrow("e_link"),
    },
    {
      title: "Buscar uma chave",
      show: ["scan"], highlight: ["b3", "e_ana", "e_carla", "scan"],
      balloon: { anchor: "scan", placement: "left",
        text: "Para <code>get(\"Carla\")</code>: refaz o hash → índice 3 → <strong>percorre a lista</strong> daquele bucket comparando as chaves até achar.",
        why: "Com poucas colisões, a lista é curtíssima (1–2 itens), então a busca continua praticamente O(1). Com muitas, degrada para O(n).",
        deep: `<p>A busca é sempre em duas etapas: primeiro o hash leva direto ao bucket certo (O(1)); só depois, dentro daquele bucket específico, é que pode haver uma pequena varredura se houver mais de um item ali.</p>
<div class="xp-example"><strong>get("Carla") passo a passo</strong>1. h("Carla") % 8 = 3 → vai direto ao bucket 3
2. bucket[3] = [("Ana", 30), ("Carla", 41)]
3. compara "Ana" ≠ "Carla" → próximo item
4. compara "Carla" == "Carla" → retorna 41</div>
<p>É por isso que a análise "O(1) médio" depende da função hash espalhar bem as chaves: se todas caíssem no mesmo bucket, a busca degradaria para O(n) — na prática, exatamente uma busca linear numa lista, perdendo toda a vantagem do hash map.</p>` },
    },
    {
      title: "Resize & rehash",
      show: ["resize"], highlight: ["resize"],
      balloon: { anchor: "resize", placement: "top",
        text: "Quando o <span class=\"xp-term\" tabindex=\"0\" data-tip=\"Razão itens ÷ buckets. Acima de ~0,75 as colisões aumentam e o desempenho cai.\">fator de carga</span> (itens ÷ buckets) passa de um limite (~0,75), o map <strong>dobra o array</strong> e <strong>recalcula o índice</strong> de tudo (rehash).",
        why: "Mais buckets = menos colisões = listas curtas. É isso que mantém o O(1) médio mesmo com o mapa crescendo.",
        deep: `<p>O rehash é necessário porque o índice de cada chave depende do <strong>número de buckets</strong> (é o "% 8" da função hash) — se o array dobra de 8 para 16, o "% 8" precisa virar "% 16", e isso muda o índice de praticamente todas as chaves já guardadas.</p>
<div class="xp-example"><strong>Mesma chave, índice diferente após crescer</strong>Com 8 buckets:  h("Ana") % 8  = 1899 % 8  = 3
Com 16 buckets: h("Ana") % 16 = 1899 % 16 = 11</div>
<p>Esse é o motivo do resize custar O(n) naquele momento específico (precisa reinserir tudo) — mas como acontece raramente (só quando o fator de carga estoura), o custo <em>amortizado</em> por inserção ao longo do tempo continua sendo O(1) em média.</p>` },
    },
    {
      title: "Teste rápido",
      balloon: { anchor: "hash", placement: "bottom",
        text: "Fixe o conceito de colisão 👇" },
      quiz: {
        question: "O que é uma “colisão” num hash map?",
        options: [
          "Quando duas chaves diferentes geram o mesmo índice",
          "Quando o array de buckets fica completamente cheio",
          "Quando uma chave procurada não existe",
          "Quando o valor armazenado é nulo",
        ],
        answer: 0,
        explain: "Há infinitas chaves para um número finito de buckets, então colisões são inevitáveis. Resolvem-se, por exemplo, encadeando as entradas numa lista.",
      },
    },
    {
      title: "Resumo",
      highlight: ["key", "hash", "b3"],
      balloon: { anchor: "hash", placement: "bottom",
        text: "Receita do hash map: <strong>chave → hash → índice → bucket</strong>. Colisões viram listas; quando enche, ele cresce e refaz o hash.",
        why: "É por isso que dicionários/objetos são tão rápidos: a chave “calcula” o endereço do valor, em vez de procurá-lo." },
      enter: (ctx) => { ctx.pulse("hash", true); ctx.pulse("b3", true); },
    },
  ];

  window.HASHMAP_DIAGRAM = {
    title: "Hash Map por dentro",
    subtitle: "Como uma chave vira um endereço — colisões, encadeamento e resize",
    width: W, height: H, autoplayMs: 8000, elements, steps,
  };
})();
