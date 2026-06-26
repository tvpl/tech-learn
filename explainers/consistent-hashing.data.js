(function () {
  const W = 1280, H = 720;

  function box(id, x, y, w, h, text, color) {
    return { id, type: 'box', x, y, w, h, text, color };
  }
  function lbl(id, x, y, text, color) {
    return { id, type: 'label', x, y, text, color: color || 'var(--muted)', fontSize: 12 };
  }
  function arr(id, x1, y1, x2, y2, text, color) {
    return [
      { id, type: 'arrow', x1, y1, x2, y2, color: color || 'var(--accent)' },
      { id: id + '_l', type: 'label', x: (x1 + x2) / 2, y: (y1 + y2) / 2 - 12, text, color: color || 'var(--accent)', fontSize: 11 },
    ];
  }

  /* ── Hash Ring (left side) using boxes as arc segments ── */
  /* We approximate the ring with a large circle box + node boxes positioned around it */
  const CX = 340, CY = 360, CR = 210; // ring center

  /* ring approximation: large square with rounded corners */
  /* nodes at angles around the ring */
  const NODES = [
    { id: 'n_a', angle: 30,  label: 'Node A', color: 'var(--accent)' },
    { id: 'n_b', angle: 150, label: 'Node B', color: 'var(--good)' },
    { id: 'n_c', angle: 270, label: 'Node C', color: 'var(--accent-2)' },
  ];

  function ringPos(angleDeg, radius) {
    const rad = (angleDeg - 90) * Math.PI / 180;
    return { x: CX + radius * Math.cos(rad), y: CY + radius * Math.sin(rad) };
  }

  /* Ring circle visual (just a large box acting as background ring indicator) */
  const ringCircle = box('ring', CX - CR, CY - CR, CR * 2, CR * 2, '', 'var(--panel)');

  /* Node boxes positioned around the ring */
  const NW = 90, NH = 40;
  const nodeBoxes = NODES.map(n => {
    const p = ringPos(n.angle, CR);
    return box(n.id, p.x - NW / 2, p.y - NH / 2, NW, NH, n.label, n.color);
  });

  /* Key dots around the ring */
  const KEYS = [
    { id: 'k1', angle: 60,  label: 'user:42', color: 'var(--warn)' },
    { id: 'k2', angle: 110, label: 'sess:99', color: 'var(--warn)' },
    { id: 'k3', angle: 200, label: 'img:7',   color: 'var(--hot)' },
    { id: 'k4', angle: 320, label: 'cart:12', color: 'var(--hot)' },
  ];
  const KW = 74, KH = 28;
  const keyBoxes = KEYS.map(k => {
    const p = ringPos(k.angle, CR - 40);
    return box(k.id, p.x - KW / 2, p.y - KH / 2, KW, KH, k.label, k.color);
  });

  /* Arrows from key to owning node (clockwise) */
  function keyToNode(keyId, nodeId) {
    return { id: `kn_${keyId}`, type: 'arrow', x1: 0, y1: 0, x2: 0, y2: 0, color: 'transparent' };
  }

  /* ── Right side panels ── */
  const PX = 720;

  /* naive hash panel */
  const naiveY = 30;
  /* consistent hash panel */
  const conY = 200;
  /* vnode panel */
  const vnY = 400;
  /* replication panel */
  const repY = 570;

  const elements = [
    /* ring */
    ringCircle,
    ...nodeBoxes,
    ...keyBoxes,

    /* ring label */
    lbl('ring_lbl', CX, CY - 10, 'Hash Ring', 'var(--muted)'),
    lbl('ring_sub', CX, CY + 14, 'espaço: 0 .. 2³²', 'var(--muted)'),
    lbl('ring_arrow_cw', CX + CR - 20, CY - CR - 28, '↻ clockwise', 'var(--muted)'),

    /* key ownership arrows (simulated with labels for now) */
    lbl('own1', ringPos(90, CR - 80).x, ringPos(90, CR - 80).y, '→ Node B', 'var(--accent)'),
    lbl('own2', ringPos(125, CR - 80).x, ringPos(125, CR - 80).y, '→ Node B', 'var(--accent)'),
    lbl('own3', ringPos(225, CR - 80).x, ringPos(225, CR - 80).y, '→ Node C', 'var(--accent-2)'),
    lbl('own4', ringPos(345, CR - 80).x, ringPos(345, CR - 80).y, '→ Node A', 'var(--accent)'),

    /* naive hash panel */
    box('naive_bg', PX, naiveY, 530, 150, '', 'var(--panel)'),
    lbl('naive_title', PX + 265, naiveY + 18, '❌ Naive: hash(key) % N', 'var(--hot)'),
    lbl('naive1', PX + 10, naiveY + 44, 'Com 3 nós: hash("user:42") % 3 = 1 → Nó 1', 'var(--ink-soft)'),
    lbl('naive2', PX + 10, naiveY + 64, 'Adicionamos 4º nó → divisor muda para 4', 'var(--warn)'),
    lbl('naive3', PX + 10, naiveY + 84, 'Resultado: ~75% das chaves mudam de nó!', 'var(--hot)'),
    lbl('naive4', PX + 10, naiveY + 104, 'Ex: 1.000.000 chaves → 750.000 remapeadas', 'var(--hot)'),
    lbl('naive5', PX + 10, naiveY + 124, 'Cache thrash, sobrecarga nos nós, downtime', 'var(--hot)'),
    lbl('naive6', PX + 10, naiveY + 144, '→ Inviável para sistemas que escalam dinamicamente', 'var(--muted)'),

    /* consistent hash panel */
    box('con_bg', PX, conY, 530, 180, '', 'var(--panel)'),
    lbl('con_title', PX + 265, conY + 18, '✅ Consistent Hashing', 'var(--good)'),
    lbl('c1', PX + 10, conY + 44, '1. Mapear nós no ring: hash(node_id) → posição', 'var(--ink-soft)'),
    lbl('c2', PX + 10, conY + 64, '2. Mapear chave: hash(key) → posição no ring', 'var(--ink-soft)'),
    lbl('c3', PX + 10, conY + 84, '3. Lookup: avançar ↻ até o próximo nó', 'var(--ink-soft)'),
    lbl('c4', PX + 10, conY + 104, '→ Adicionar nó: só rouba chaves do vizinho direito', 'var(--good)'),
    lbl('c5', PX + 10, conY + 124, '→ Remover nó: chaves migram apenas para o próximo nó', 'var(--good)'),
    lbl('c6', PX + 10, conY + 144, '→ ~1/N das chaves são remapeadas (vs ~(N-1)/N naive)', 'var(--good)'),
    lbl('c7', PX + 10, conY + 164, 'Lookup com binary search: O(log N)', 'var(--accent)'),
    lbl('c8', PX + 10, conY + 178, 'Usado em: Cassandra, DynamoDB, Redis Cluster, CDNs', 'var(--muted)'),

    /* vnode panel */
    box('vn_bg', PX, vnY, 530, 150, '', 'var(--panel)'),
    lbl('vn_title', PX + 265, vnY + 18, '⚖️ Virtual Nodes (vnodes)', 'var(--accent-2)'),
    lbl('vn1', PX + 10, vnY + 44, 'Problema com 3 nós: distribuição irregular!', 'var(--warn)'),
    lbl('vn2', PX + 10, vnY + 64, 'Solução: cada nó físico tem K posições no ring', 'var(--good)'),
    lbl('vn3', PX + 10, vnY + 84, 'Ex: Node A → A_1, A_2, ..., A_150 no ring', 'var(--ink-soft)'),
    lbl('vn4', PX + 10, vnY + 104, '→ distribuição estatisticamente uniforme', 'var(--good)'),
    lbl('vn5', PX + 10, vnY + 124, 'Cassandra usa 256 vnodes por default', 'var(--muted)'),
    lbl('vn6', PX + 10, vnY + 144, 'K ajustável por nó → nós com mais RAM/CPU recebem mais vnodes', 'var(--muted)'),

    /* replication panel */
    box('rep_bg', PX, repY, 530, 110, '', 'var(--panel)'),
    lbl('rep_title', PX + 265, repY + 18, '🔁 Replicação com Hash Ring', 'var(--accent)'),
    lbl('r1', PX + 10, repY + 44, 'Para replicação fator 3: avançar ↻ por 3 nós', 'var(--ink-soft)'),
    lbl('r2', PX + 10, repY + 64, 'key → Nó A (primary), Nó B (replica 1), Nó C (replica 2)', 'var(--ink-soft)'),
    lbl('r3', PX + 10, repY + 84, 'Nó falha → replicas continuam servindo a key', 'var(--good)'),
    lbl('r4', PX + 10, repY + 104, 'Quorum read/write: evita split-brain', 'var(--muted)'),

    /* new node arrow illustration */
    box('nd_bg', 30, 590, 200, 90, '', 'var(--panel)'),
    lbl('nd_title', 130, 608, '➕ Novo Nó (D) no ring', 'var(--good)'),
    lbl('nd1', 40, 630, 'D inserido entre C e A', 'var(--ink-soft)'),
    lbl('nd2', 40, 650, 'Apenas chaves de C→D migram', 'var(--ink-soft)'),
    lbl('nd3', 40, 670, 'A, B, C: sem alteração', 'var(--good)'),
  ];

  const steps = [
    {
      title: 'O Problema: hash(key) % N',
      show: ['naive_bg', 'naive_title', 'naive1', 'naive2', 'naive3', 'naive4', 'naive5', 'naive6',
             'ring', 'ring_lbl', 'ring_sub'],
      balloon: {
        anchor: 'naive_bg', placement: 'left',
        text: 'Com `hash(key) % N`, adicionar ou remover um servidor muda o denominador N — quase todas as chaves precisam ser remapeadas. Para um cache distribuído, isso é catastrófico.',
      },
    },
    {
      title: 'Exemplo concreto: 3 → 4 nós, 75% remapeado',
      show: ['naive_bg', 'naive_title', 'naive1', 'naive2', 'naive3', 'naive4', 'naive5', 'naive6'],
      highlight: ['naive_bg'],
      balloon: {
        anchor: 'naive_bg', placement: 'left',
        text: 'Com 3 nós: chave `user:42` → hash mod 3 = 1 → Nó 1. Adicionamos Nó 4: agora hash mod 4 = 2 → Nó 2. A chave mudou de nó! 75% das chaves mudam de destino — cache miss em massa.',
      },
    },
    {
      title: 'Hash Ring: espaço circular 0..2³²',
      show: ['ring', 'ring_lbl', 'ring_sub', 'ring_arrow_cw',
             'n_a', 'n_b', 'n_c',
             'con_bg', 'con_title', 'c1', 'c2', 'c3'],
      highlight: ['ring'],
      balloon: {
        anchor: 'ring', placement: 'right',
        text: 'O espaço de hash (0 a 2³²) é disposto em um anel circular. Nós são posicionados no anel com `hash(node_id)`. As chaves também são mapeadas no anel com `hash(key)`.',
      },
    },
    {
      title: 'Lookup: avançar clockwise até o próximo nó',
      show: ['ring', 'ring_lbl', 'ring_sub', 'ring_arrow_cw',
             'n_a', 'n_b', 'n_c', 'k1', 'k2', 'k3', 'k4',
             'own1', 'own2', 'own3', 'own4'],
      highlight: ['ring', 'k1', 'k2'],
      balloon: {
        anchor: 'ring', placement: 'right',
        text: 'Para encontrar o nó dono de uma chave: avança-se no sentido horário até o primeiro nó encontrado. `user:42` (60°) → avança até Node B (150°). Lookup em O(log N) com busca binária.',
        why: 'Cada nó é responsável pelo arco de ring entre o nó anterior e ele mesmo.',
      },
    },
    {
      title: 'Adicionar nó: só rouba do vizinho',
      show: ['ring', 'ring_lbl', 'ring_sub', 'ring_arrow_cw',
             'n_a', 'n_b', 'n_c', 'k1', 'k2', 'k3', 'k4',
             'nd_bg', 'nd_title', 'nd1', 'nd2', 'nd3',
             'con_bg', 'con_title', 'c4', 'c5', 'c6'],
      highlight: ['n_a', 'nd_bg'],
      balloon: {
        anchor: 'nd_bg', placement: 'top',
        text: 'Ao inserir Node D entre C e A: apenas as chaves que estavam no arco C→D migram para D. Todos os outros arcos (A→B, B→C) ficam inalterados. Isso é ~1/N chaves remapeadas.',
      },
    },
    {
      title: 'Remover nó: migração localizada',
      show: ['ring', 'ring_lbl', 'ring_sub', 'ring_arrow_cw',
             'n_a', 'n_b', 'n_c', 'k1', 'k2', 'k3', 'k4',
             'con_bg', 'con_title', 'c4', 'c5', 'c6', 'c7'],
      highlight: ['n_b'],
      balloon: {
        anchor: 'ring', placement: 'right',
        text: 'Se Node B é removido (falha ou scale-down): suas chaves (`user:42`, `sess:99`) migram apenas para o próximo nó clockwise (Node C). Nodes A e C não são afetados entre si.',
      },
    },
    {
      title: 'Problema sem vnodes: distribuição irregular',
      show: ['ring', 'ring_lbl', 'ring_sub', 'ring_arrow_cw',
             'n_a', 'n_b', 'n_c',
             'vn_bg', 'vn_title', 'vn1', 'vn2', 'vn3', 'vn4', 'vn5', 'vn6'],
      highlight: ['vn_bg'],
      balloon: {
        anchor: 'vn_bg', placement: 'left',
        text: 'Com apenas 3 nós no ring, o espaço pode ficar desbalanceado — um nó pode ter o dobro de chaves dos outros. Virtual nodes resolvem isso.',
      },
    },
    {
      title: 'Virtual Nodes: K posições por nó físico',
      show: ['ring', 'ring_lbl', 'ring_sub',
             'n_a', 'n_b', 'n_c',
             'vn_bg', 'vn_title', 'vn1', 'vn2', 'vn3', 'vn4', 'vn5', 'vn6'],
      highlight: ['n_a', 'n_b', 'n_c', 'vn_bg'],
      balloon: {
        anchor: 'vn_bg', placement: 'left',
        text: 'Cada nó físico é mapeado K vezes no ring: `hash("A_1")`, `hash("A_2")`, ..., `hash("A_150")`. Com muitas posições, a distribuição se torna estatisticamente uniforme. Cassandra usa 256 vnodes por padrão.',
        why: 'Nós mais poderosos podem receber mais vnodes — balanceamento heterogêneo.',
      },
    },
    {
      title: 'Replicação com o Hash Ring',
      show: ['ring', 'ring_lbl', 'ring_sub', 'ring_arrow_cw',
             'n_a', 'n_b', 'n_c', 'k1', 'k2', 'k3', 'k4',
             'rep_bg', 'rep_title', 'r1', 'r2', 'r3', 'r4'],
      highlight: ['rep_bg'],
      balloon: {
        anchor: 'rep_bg', placement: 'left',
        text: 'Para replicação com fator 3: a chave é copiada para os **próximos 3 nós** no ring. Se o nó primário falhar, as réplicas assumem sem reconfiguração. Quorum R+W > N garante consistência.',
      },
    },
    {
      title: 'Onde é usado na prática',
      show: ['ring', 'ring_lbl', 'ring_sub', 'ring_arrow_cw',
             'n_a', 'n_b', 'n_c',
             'con_bg', 'con_title', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8',
             'vn_bg', 'vn_title', 'vn4', 'vn5',
             'rep_bg', 'rep_title', 'r1', 'r3'],
      balloon: {
        anchor: 'con_bg', placement: 'left',
        text: '**Cassandra & DynamoDB**: particionamento + replicação. **Redis Cluster**: 16384 hash slots distribuídos. **CDNs (Akamai, Fastly)**: roteamento de requisições para edge servers. **Memcached**: balanceamento de cache.',
      },
    },
    {
      title: 'Quiz',
      show: ['ring', 'ring_lbl', 'ring_sub', 'n_a', 'n_b', 'n_c', 'k1', 'k2'],
      quiz: {
        question: 'Ao adicionar um novo nó no hash ring, quantas chaves aproximadamente precisam ser remapeadas (com N nós existentes)?',
        options: [
          'Todas as chaves — equivalente ao hash(key) % N',
          'Aproximadamente metade das chaves do vizinho mais próximo',
          'Apenas ~1/N das chaves — somente do arco do vizinho direto',
          'Nenhuma — consistent hashing não remapeia chaves ao adicionar nós',
        ],
        answer: 2,
        explain: 'No consistent hashing, ao adicionar o nó D entre C e A, apenas as chaves do arco que pertencia a A (especificamente o sub-arco C→D) precisam migrar para D. Isso representa ~1/N das chaves totais. Com 100 nós, adicionar 1 nó remapeia ~1% das chaves — muito melhor que o ~99% do método naive.',
      },
    },
    {
      title: 'Resumo: Consistent Hashing',
      show: ['ring', 'ring_lbl', 'ring_sub', 'ring_arrow_cw',
             'n_a', 'n_b', 'n_c', 'k1', 'k2', 'k3', 'k4',
             'own1', 'own2', 'own3', 'own4',
             'con_bg', 'con_title', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8',
             'vn_bg', 'vn_title', 'vn2', 'vn4', 'vn5',
             'rep_bg', 'rep_title', 'r1', 'r2', 'r3',
             'nd_bg', 'nd_title', 'nd2', 'nd3'],
      balloon: {
        anchor: 'ring', placement: 'right',
        text: 'Ring 0..2³². Nós + chaves mapeados por hash. Lookup: avançar clockwise → O(log N). Add/remove nó: ~1/N remapeado. Vnodes: distribuição uniforme. Replicação: K próximos nós. Base de Cassandra, DynamoDB, Redis Cluster.',
      },
    },
  ];

  window.CONSISTENT_HASHING_DIAGRAM = { title: 'Consistent Hashing', W, H, elements, steps };
})();
