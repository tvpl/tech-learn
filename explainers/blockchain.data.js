(function () {
  const W = 1280, H = 720;

  function box(id, x, y, w, h, text, color) {
    return { id, type: 'box', x, y, w, h, text, color };
  }
  function lbl(id, x, y, text, color) {
    return { id, type: 'label', x, y, text, color: color || 'var(--muted)', fontSize: 12 };
  }
  function arr(id, x1, y1, x2, y2, color) {
    return { id, type: 'arrow', x1, y1, x2, y2, color: color || 'var(--accent)' };
  }

  /* ── 4 chained blocks (left side) ── */
  const BLK_W = 140, BLK_H = 140, BLK_GAP = 20;
  const BLK_Y = 50;
  const BLOCKS = [
    { id: 'blk0', x: 20,  label: 'Bloco 0\n(Genesis)',  color: 'var(--muted)' },
    { id: 'blk1', x: 180, label: 'Bloco 1',             color: 'var(--accent)' },
    { id: 'blk2', x: 340, label: 'Bloco 2',             color: 'var(--accent-2)' },
    { id: 'blk3', x: 500, label: 'Bloco 3',             color: 'var(--good)' },
  ];

  const blockBoxes = BLOCKS.map(b => box(b.id, b.x, BLK_Y, BLK_W, BLK_H, b.label, b.color));

  /* chain arrows between blocks */
  const chainArrows = BLOCKS.slice(0, -1).map((b, i) =>
    arr(`ch${i}`, b.x + BLK_W, BLK_Y + BLK_H / 2, BLOCKS[i + 1].x, BLK_Y + BLK_H / 2, 'var(--accent)')
  );
  const chainLabels = BLOCKS.slice(0, -1).map((b, i) =>
    lbl(`chl${i}`, b.x + BLK_W + 10, BLK_Y + BLK_H / 2 - 14, 'prev_hash', 'var(--accent)')
  );

  /* ── Block anatomy (zoom panel, right side) ── */
  const ZX = 660, ZY = 30;
  const ZW = 580, ZH = 280;

  /* ── Mining / PoW panel ── */
  const MX = 660, MY = 330;

  /* ── Consensus panel ── */
  const CX = 660, CY2 = 540;

  /* ── Mempool / tx lifecycle ── */
  const TX = 30, TY = 240;

  /* ── Smart contracts panel ── */
  const SCX = 30, SCY = 530;

  const elements = [
    /* blockchain header */
    lbl('chain_title', 330, 20, '⛓️  Blockchain — cadeia de blocos encadeados por hash', 'var(--ink)'),

    /* block boxes */
    ...blockBoxes,
    ...chainArrows,
    ...chainLabels,

    /* block field labels inside each block */
    lbl('b0_idx', 20 + 10, BLK_Y + 28, 'index: 0', 'var(--muted)'),
    lbl('b0_prv', 20 + 10, BLK_Y + 48, 'prev: 0000...', 'var(--muted)'),
    lbl('b0_hsh', 20 + 10, BLK_Y + 68, 'hash: a1b2c3...', 'var(--accent)'),

    lbl('b1_idx', 180 + 10, BLK_Y + 28, 'index: 1', 'var(--muted)'),
    lbl('b1_prv', 180 + 10, BLK_Y + 48, 'prev: a1b2c3...', 'var(--accent)'),
    lbl('b1_hsh', 180 + 10, BLK_Y + 68, 'hash: d4e5f6...', 'var(--accent-2)'),

    lbl('b2_idx', 340 + 10, BLK_Y + 28, 'index: 2', 'var(--muted)'),
    lbl('b2_prv', 340 + 10, BLK_Y + 48, 'prev: d4e5f6...', 'var(--accent-2)'),
    lbl('b2_hsh', 340 + 10, BLK_Y + 68, 'hash: 00007a...', 'var(--good)'),

    lbl('b3_idx', 500 + 10, BLK_Y + 28, 'index: 3', 'var(--muted)'),
    lbl('b3_prv', 500 + 10, BLK_Y + 48, 'prev: 00007a...', 'var(--good)'),
    lbl('b3_hsh', 500 + 10, BLK_Y + 68, 'hash: 0000b2...', 'var(--good)'),

    lbl('b1_nc', 180 + 10, BLK_Y + 88, 'nonce: 83721', 'var(--warn)'),
    lbl('b2_nc', 340 + 10, BLK_Y + 88, 'nonce: 192847', 'var(--warn)'),
    lbl('b3_nc', 500 + 10, BLK_Y + 88, 'nonce: 4710293', 'var(--warn)'),

    lbl('b1_tx', 180 + 10, BLK_Y + 110, 'txs: [A→B 1BTC,...]', 'var(--muted)'),
    lbl('b2_tx', 340 + 10, BLK_Y + 110, 'txs: [C→D 0.5,...] ', 'var(--muted)'),
    lbl('b3_tx', 500 + 10, BLK_Y + 110, 'txs: [E→F 2BTC,...] ', 'var(--muted)'),

    /* immutability note */
    box('immut_bg', 20, 200, 620, 24, '', 'var(--panel)'),
    lbl('immut_lbl', 330, 216, '⚠️ Alterar bloco 2 → hash 2 muda → prev_hash 3 invalida → e assim por diante', 'var(--hot)'),

    /* block anatomy panel (right) */
    box('zoom_bg', ZX, ZY, ZW, ZH, '', 'var(--panel)'),
    lbl('zoom_title', ZX + ZW / 2, ZY + 18, '🔍 Anatomia de um Bloco', 'var(--ink)'),
    lbl('z1', ZX + 10, ZY + 42, 'index      → número sequencial do bloco na cadeia', 'var(--ink-soft)'),
    lbl('z2', ZX + 10, ZY + 62, 'timestamp  → momento em que o bloco foi minerado', 'var(--ink-soft)'),
    lbl('z3', ZX + 10, ZY + 82, 'txs[]      → lista de transações incluídas no bloco', 'var(--ink-soft)'),
    lbl('z4', ZX + 10, ZY + 102, 'nonce      → número ajustável para satisfazer PoW', 'var(--warn)'),
    lbl('z5', ZX + 10, ZY + 122, 'prev_hash  → hash do bloco anterior (cria o chain)', 'var(--accent)'),
    lbl('z6', ZX + 10, ZY + 144, 'hash       → SHA256(index + txs + nonce + prev_hash)', 'var(--good)'),
    lbl('z7', ZX + 10, ZY + 168, 'Merkle root→ hash da árvore de transações', 'var(--muted)'),
    box('hash_formula', ZX + 10, ZY + 186, ZW - 20, 28, 'hash = SHA256(index ‖ timestamp ‖ txs ‖ nonce ‖ prev_hash)', 'var(--panel-2)'),
    lbl('z8', ZX + 10, ZY + 228, 'Para alterar 1 tx no bloco 2: hash 2 muda → invalida', 'var(--hot)'),
    lbl('z9', ZX + 10, ZY + 248, '→ prev_hash 3 e todos os blocos subsequentes', 'var(--hot)'),
    lbl('z10', ZX + 10, ZY + 268, '→ Teria que re-minerar TODOS os blocos seguintes', 'var(--hot)'),

    /* Mining panel */
    box('mine_bg', MX, MY, ZW, 180, '', 'var(--panel)'),
    lbl('mine_title', MX + ZW / 2, MY + 18, '⛏️ Proof of Work (PoW)', 'var(--warn)'),
    lbl('m1', MX + 10, MY + 44, 'Objetivo: encontrar nonce tal que hash comece com N zeros', 'var(--ink-soft)'),
    box('mine_ex', MX + 10, MY + 60, ZW - 20, 26, 'while SHA256(bloco+nonce) não começa com "0000":  nonce++', 'var(--panel-2)'),
    lbl('m2', MX + 10, MY + 100, 'N=4 zeros: ~65.000 tentativas em média', 'var(--ink-soft)'),
    lbl('m3', MX + 10, MY + 120, 'N=20 zeros: ~1 trilhão de tentativas', 'var(--hot)'),
    lbl('m4', MX + 10, MY + 140, 'Bitcoin ~N=74 bits: ~10 min/bloco (4B nonces + extraNonce)', 'var(--ink-soft)'),
    lbl('m5', MX + 10, MY + 160, 'Dificuldade ajusta a cada 2016 blocos (~2 semanas)', 'var(--muted)'),

    /* Consensus panel */
    box('con_bg', CX, CY2, ZW, 160, '', 'var(--panel)'),
    lbl('con_title', CX + ZW / 2, CY2 + 18, '🗳️ Consensus: Longest Chain Wins', 'var(--accent-2)'),
    lbl('con1', CX + 10, CY2 + 44, 'Regra: a cadeia mais longa (mais trabalho) vence', 'var(--ink-soft)'),
    lbl('con2', CX + 10, CY2 + 64, 'Ataque 51%: controlar >50% do hashrate da rede', 'var(--hot)'),
    lbl('con3', CX + 10, CY2 + 84, '→ Pode re-organizar blocos recentes (double-spend)', 'var(--hot)'),
    lbl('con4', CX + 10, CY2 + 104, 'PoW vs PoS vs BFT:', 'var(--muted)'),
    lbl('con5', CX + 10, CY2 + 124, 'PoW (Bitcoin): energia, seguro, descentralizado', 'var(--warn)'),
    lbl('con6', CX + 10, CY2 + 144, 'PoS (Ethereum 2.0): eficiente, finality mais rápida', 'var(--good)'),
    lbl('con7', CX + 10, CY2 + 164, 'BFT (Hyperledger): permissioned, finality instantânea', 'var(--accent)'),

    /* Mempool / tx lifecycle */
    box('mem_bg', TX, TY, 610, 270, '', 'var(--panel)'),
    lbl('mem_title', TX + 305, TY + 18, '💳 Ciclo de Vida de uma Transação', 'var(--accent)'),
    lbl('mem1', TX + 10, TY + 44, '1. Usuário assina tx com chave privada', 'var(--ink-soft)'),
    lbl('mem2', TX + 10, TY + 64, '2. Broadcast para a rede P2P', 'var(--ink-soft)'),
    lbl('mem3', TX + 10, TY + 84, '3. Tx entra no Mempool (fila de pendentes)', 'var(--accent-2)'),
    lbl('mem4', TX + 10, TY + 104, '4. Minerador escolhe txs (geralmente por fee)', 'var(--warn)'),
    lbl('mem5', TX + 10, TY + 124, '5. Mina o bloco (encontra nonce válido)', 'var(--warn)'),
    lbl('mem6', TX + 10, TY + 144, '6. Bloco propagado para toda a rede', 'var(--ink-soft)'),
    lbl('mem7', TX + 10, TY + 164, '7. Outros nós validam e adicionam ao chain', 'var(--good)'),
    lbl('mem8', TX + 10, TY + 186, '⚠️  1 confirmação = bloco incluso na chain', 'var(--warn)'),
    lbl('mem9', TX + 10, TY + 206, '✅  6 confirmações = considerado irreversível (Bitcoin)', 'var(--good)'),
    lbl('mem10', TX + 10, TY + 226, '→ 6 blocos após = atacante precisaria re-minerar 7 blocos', 'var(--muted)'),
    lbl('mem11', TX + 10, TY + 248, '   com >50% hashrate — custo proibitivo', 'var(--muted)'),
    lbl('mem12', TX + 10, TY + 268, '→ Tempo médio: ~60 minutos (6 × 10 min)', 'var(--muted)'),

    /* Smart contracts */
    box('sc_bg', SCX, SCY, 610, 150, '', 'var(--panel)'),
    lbl('sc_title', SCX + 305, SCY + 18, '⚡ Smart Contracts', 'var(--good)'),
    lbl('sc1', SCX + 10, SCY + 44, 'Código determinístico armazenado no blockchain', 'var(--ink-soft)'),
    lbl('sc2', SCX + 10, SCY + 64, 'Executado por todos os nós durante validação (EVM)', 'var(--ink-soft)'),
    lbl('sc3', SCX + 10, SCY + 84, 'Autoexecutável: condição cumprida → execução automática', 'var(--ink-soft)'),
    lbl('sc4', SCX + 10, SCY + 104, 'Ex: escrow — liberar pagamento quando entrega confirmada', 'var(--ink-soft)'),
    lbl('sc5', SCX + 10, SCY + 124, 'Gas fee: custo computacional em ETH pago ao minerador', 'var(--warn)'),
    lbl('sc6', SCX + 10, SCY + 144, 'Solidity (Ethereum), Rust (Solana), Move (Aptos)', 'var(--muted)'),
  ];

  const steps = [
    {
      title: 'O Problema: confiança sem intermediário',
      show: ['chain_title', 'blk0', 'blk1', 'blk2', 'blk3', 'ch0', 'ch1', 'ch2', 'chl0', 'chl1', 'chl2'],
      balloon: {
        anchor: 'blk1', placement: 'bottom',
        text: 'Como garantir que uma transação é válida sem confiar em um banco central? Blockchain resolve o double-spend com um ledger distribuído e imutável.',
      },
    },
    {
      title: 'Ledger distribuído: todos os nós verificam',
      show: ['chain_title', 'blk0', 'blk1', 'blk2', 'blk3', 'ch0', 'ch1', 'ch2', 'chl0', 'chl1', 'chl2'],
      balloon: {
        anchor: 'blk2', placement: 'bottom',
        text: 'Milhares de nós ao redor do mundo têm **cópia idêntica** da cadeia. Cada um valida independentemente toda nova transação e bloco. Para fraudar, precisaria enganar a maioria dos nós.',
      },
    },
    {
      title: 'Anatomia de um bloco',
      show: ['chain_title', 'blk0', 'blk1', 'blk2', 'blk3',
             'ch0', 'ch1', 'ch2', 'chl0', 'chl1', 'chl2',
             'b1_idx', 'b1_prv', 'b1_hsh', 'b1_nc', 'b1_tx',
             'b2_idx', 'b2_prv', 'b2_hsh', 'b2_nc', 'b2_tx',
             'b3_idx', 'b3_prv', 'b3_hsh', 'b3_nc', 'b3_tx',
             'b0_idx', 'b0_prv', 'b0_hsh',
             'zoom_bg', 'zoom_title', 'z1', 'z2', 'z3', 'z4', 'z5', 'z6', 'hash_formula'],
      highlight: ['blk2', 'zoom_bg'],
      balloon: {
        anchor: 'zoom_bg', placement: 'left',
        text: 'Cada bloco contém: `index`, `timestamp`, `txs[]`, `nonce`, `prev_hash` e o próprio `hash = SHA256(todos os campos)`. O `prev_hash` é o elo que cria a "cadeia".',
      },
    },
    {
      title: 'Encadeamento: prev_hash cria imutabilidade',
      show: ['chain_title', 'blk0', 'blk1', 'blk2', 'blk3',
             'ch0', 'ch1', 'ch2', 'chl0', 'chl1', 'chl2',
             'b0_hsh', 'b1_prv', 'b1_hsh', 'b2_prv', 'b2_hsh', 'b3_prv', 'b3_hsh',
             'immut_bg', 'immut_lbl',
             'zoom_bg', 'zoom_title', 'z5', 'z6', 'z7', 'z8', 'z9', 'z10'],
      highlight: ['blk2', 'blk3', 'immut_bg'],
      balloon: {
        anchor: 'immut_lbl', placement: 'top',
        text: 'O `hash` do bloco 1 vira o `prev_hash` do bloco 2. Se qualquer campo do bloco 2 mudar, seu hash muda — e o `prev_hash` do bloco 3 fica inconsistente. A cadeia é **imutável retroativamente**.',
        why: 'Para reescrever o bloco 2, precisaria re-minerar 2, 3, 4... e superar o poder computacional de toda a rede.',
      },
    },
    {
      title: 'Proof of Work: encontrar o nonce certo',
      show: ['chain_title', 'blk0', 'blk1', 'blk2', 'blk3', 'ch0', 'ch1', 'ch2',
             'b2_hsh', 'b2_nc',
             'mine_bg', 'mine_title', 'm1', 'mine_ex', 'm2', 'm3', 'm4', 'm5'],
      highlight: ['blk2', 'mine_bg'],
      balloon: {
        anchor: 'mine_bg', placement: 'left',
        text: 'O hash precisa começar com N zeros: `0000ab2c3d...`. Para isso, o minerador testa bilhões de valores de `nonce` até encontrar um que satisfaça essa condição — puro brute-force intencional.',
        why: 'O custo computacional é a "prova de trabalho" — torna inviável reescrever a história.',
      },
    },
    {
      title: 'Mining: brute-force e dificuldade ajustável',
      show: ['mine_bg', 'mine_title', 'm1', 'mine_ex', 'm2', 'm3', 'm4', 'm5'],
      highlight: ['mine_bg'],
      balloon: {
        anchor: 'mine_bg', placement: 'right',
        text: 'A rede Bitcoin ajusta a dificuldade a cada 2016 blocos (~2 semanas) para manter ~10 min/bloco, independente de quantos mineradores entrarem na rede. Mais hashrate = dificuldade maior.',
      },
    },
    {
      title: 'Consensus: longest chain wins',
      show: ['chain_title', 'blk0', 'blk1', 'blk2', 'blk3', 'ch0', 'ch1', 'ch2',
             'con_bg', 'con_title', 'con1', 'con2', 'con3', 'con4', 'con5', 'con6', 'con7'],
      highlight: ['con_bg'],
      balloon: {
        anchor: 'con_bg', placement: 'left',
        text: 'Quando dois nós mineram simultaneamente, há um fork temporário. A rede adota a cadeia com **mais trabalho acumulado** (geralmente a mais longa). Forks curtos se resolvem em 1-2 blocos.',
        why: 'Ataque 51%: se um grupo controla >50% do hashrate, pode criar uma cadeia alternativa mais rápida e revisar transações recentes — extremamente caro em Bitcoin.',
      },
    },
    {
      title: 'Ciclo de vida de uma transação',
      show: ['mem_bg', 'mem_title', 'mem1', 'mem2', 'mem3', 'mem4', 'mem5',
             'mem6', 'mem7', 'mem8', 'mem9', 'mem10', 'mem11', 'mem12'],
      balloon: {
        anchor: 'mem_bg', placement: 'right',
        text: 'Tx assinada → broadcast P2P → Mempool → minerador seleciona (por fee) → bloco minerado → propagado → validado. 6 confirmações = ~60 min = irreversível na prática.',
      },
    },
    {
      title: 'PoW vs PoS vs BFT',
      show: ['con_bg', 'con_title', 'con4', 'con5', 'con6', 'con7'],
      balloon: {
        anchor: 'con_bg', placement: 'right',
        text: '**PoW** (Bitcoin): computacionalmente intenso, muito seguro, sem finality imediata. **PoS** (Ethereum 2.0): validators apostam ETH como garantia — 99% menos energia, finality em 2 épocas. **BFT** (Hyperledger): permissioned, finality instantânea, ideal para consortium.',
      },
    },
    {
      title: 'Smart Contracts: código autoexecutável no bloco',
      show: ['chain_title', 'blk0', 'blk1', 'blk2', 'blk3', 'ch0', 'ch1', 'ch2',
             'sc_bg', 'sc_title', 'sc1', 'sc2', 'sc3', 'sc4', 'sc5', 'sc6'],
      highlight: ['sc_bg'],
      balloon: {
        anchor: 'sc_bg', placement: 'right',
        text: 'Smart contracts são programas armazenados no blockchain, executados deterministicamente por todos os nós. Quando condições são cumpridas, executam automaticamente — sem intermediário. EVM (Ethereum), Solana, etc.',
      },
    },
    {
      title: 'Quiz',
      show: ['chain_title', 'blk0', 'blk1', 'blk2', 'blk3', 'ch0', 'ch1', 'ch2',
             'b0_hsh', 'b1_prv', 'b1_hsh', 'b2_prv', 'b2_hsh', 'b3_prv', 'b3_hsh'],
      quiz: {
        question: 'Por que alterar uma transação no bloco 2 invalida também os blocos 3, 4, 5...?',
        options: [
          'Porque todos os blocos usam o mesmo nonce, que precisa ser recalculado',
          'Porque o hash do bloco 2 muda, e o bloco 3 armazena esse hash como prev_hash',
          'Porque os mineradores re-validam todas as transações da cadeia inteira',
          'Porque a rede P2P retransmite a mudança para todos os nós simultaneamente',
        ],
        answer: 1,
        explain: 'O campo `prev_hash` do bloco 3 contém o hash do bloco 2. Se qualquer dado do bloco 2 mudar, seu `hash` muda — e agora o `prev_hash` do bloco 3 aponta para um hash que não existe mais. O bloco 3 fica inválido, e o mesmo efeito cascateia para todos os blocos seguintes. Para "corrigir" isso, o atacante precisaria re-minerar todos os blocos afetados, gastando mais poder computacional que toda a rede honesta.',
      },
    },
    {
      title: 'Resumo: Blockchain',
      show: ['chain_title', 'blk0', 'blk1', 'blk2', 'blk3',
             'ch0', 'ch1', 'ch2', 'chl0', 'chl1', 'chl2',
             'b0_hsh', 'b1_prv', 'b1_hsh', 'b2_nc', 'b2_hsh', 'b3_prv', 'b3_hsh',
             'immut_bg', 'immut_lbl',
             'zoom_bg', 'zoom_title', 'z5', 'z6', 'hash_formula',
             'mine_bg', 'mine_title', 'm1', 'm4',
             'mem_bg', 'mem_title', 'mem3', 'mem9',
             'con_bg', 'con_title', 'con1', 'con5', 'con6',
             'sc_bg', 'sc_title', 'sc1', 'sc3'],
      balloon: {
        anchor: 'blk2', placement: 'bottom',
        text: 'Blocos encadeados por prev_hash → imutabilidade. PoW: brute-force de nonce para hash com N zeros. Longest chain wins. 6 confirmações = irreversível. PoS é mais eficiente. Smart contracts: código autoexecutável no chain.',
      },
    },
  ];

  window.BLOCKCHAIN_DIAGRAM = { title: 'Blockchain', W, H, elements, steps };
})();
