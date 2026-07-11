(function () {
  const W = 1280, H = 720;

  function box(id, x, y, w, h, text, color) {
    return { id, type: 'box', x, y, w, h, label: text, stroke: color };
  }
  function lbl(id, x, y, text, color) {
    return { id, type: 'label', x, y, label: text, style: `fill:${color || 'var(--muted)'}`, size: 12 };
  }
  function arr(id, x1, y1, x2, y2, color) {
    return { id, type: 'arrow', x1, y1, x2, y2, color: color || 'var(--accent)' };
  }

  /* ── Main flow: top horizontal pipeline ── */
  const stages = [
    { id: 'st_gen',   x: 60,  y: 80, label: '① Gerar',       color: 'var(--accent)' },
    { id: 'st_store', x: 280, y: 80, label: '② Armazenar',    color: 'var(--accent-2)' },
    { id: 'st_use',   x: 500, y: 80, label: '③ Usar',         color: 'var(--good)' },
    { id: 'st_rl',    x: 720, y: 80, label: '④ Rate Limit',   color: 'var(--warn)' },
    { id: 'st_rot',   x: 940, y: 80, label: '⑤ Rotacionar',   color: 'var(--hot)' },
  ];
  const SW = 160, SH = 50;
  const pipeArrows = [
    arr('pa1', stages[0].x + SW, stages[0].y + SH / 2, stages[1].x, stages[1].y + SH / 2, 'var(--line)'),
    arr('pa2', stages[1].x + SW, stages[1].y + SH / 2, stages[2].x, stages[2].y + SH / 2, 'var(--line)'),
    arr('pa3', stages[2].x + SW, stages[2].y + SH / 2, stages[3].x, stages[3].y + SH / 2, 'var(--line)'),
    arr('pa4', stages[3].x + SW, stages[3].y + SH / 2, stages[4].x, stages[4].y + SH / 2, 'var(--line)'),
  ];

  /* ── Generation panel ── */
  const genX = 30, genY = 170;
  /* ── Storage / hashing panel ── */
  const hashX = 260, hashY = 170;
  /* ── Usage panel ── */
  const useX = 490, useY = 170;
  /* ── Rate limit panel ── */
  const rlX = 30, rlY = 430;
  /* ── Scope / permissions panel ── */
  const scopeX = 490, scopeY = 430;
  /* ── Revocation panel ── */
  const revX = 800, revY = 170;

  const elements = [
    /* pipeline stages */
    ...stages.map(s => box(s.id, s.x, s.y, SW, SH, s.label, s.color)),
    ...pipeArrows,

    /* Generation panel */
    box('gen_bg', genX, genY, 220, 230, '', 'var(--panel)'),
    lbl('gen_title', genX + 110, genY + 18, '🔑 Geração', 'var(--accent)'),
    lbl('gen1', genX + 10, genY + 46, 'crypto.randomBytes(32)', 'var(--ink)'),
    lbl('gen2', genX + 10, genY + 68, '→ 256 bits aleatórios', 'var(--ink-soft)'),
    lbl('gen3', genX + 10, genY + 90, '→ encode base62/base64url', 'var(--ink-soft)'),
    box('gen_ex', genX + 10, genY + 108, 200, 34, 'sk_live_Xk9mB2qR4n...', 'var(--panel-2)'),
    lbl('gen4', genX + 10, genY + 158, 'Prefixo legível:', 'var(--muted)'),
    lbl('gen5', genX + 10, genY + 176, '`sk_live_` → Secret Key (prod)', 'var(--good)'),
    lbl('gen6', genX + 10, genY + 196, '`sk_test_` → Test environment', 'var(--warn)'),
    lbl('gen7', genX + 10, genY + 216, '`ghp_`  → GitHub Personal Token', 'var(--muted)'),

    /* Hash / storage panel */
    box('hash_bg', hashX, hashY, 220, 230, '', 'var(--panel)'),
    lbl('hash_title', hashX + 110, hashY + 18, '🔒 Armazenamento', 'var(--accent-2)'),
    lbl('hash1', hashX + 10, hashY + 44, 'NUNCA guardar em plain text', 'var(--hot)'),
    lbl('hash2', hashX + 10, hashY + 64, '→ guarde SHA-256(key)', 'var(--good)'),
    box('hash_flow', hashX + 10, hashY + 82, 200, 70, '', 'var(--panel-2)'),
    lbl('hf1', hashX + 20, hashY + 96, 'User recebe: sk_live_Xk9m...', 'var(--ink-soft)'),
    lbl('hf2', hashX + 20, hashY + 116, 'DB guarda: a3f8c2e1b7...', 'var(--accent-2)'),
    lbl('hf3', hashX + 20, hashY + 136, '          (hash SHA-256)', 'var(--muted)'),
    lbl('hash3', hashX + 10, hashY + 164, 'Por quê?', 'var(--muted)'),
    lbl('hash4', hashX + 10, hashY + 182, '→ vazamento de DB não expõe', 'var(--ink-soft)'),
    lbl('hash5', hashX + 10, hashY + 200, '  as chaves reais', 'var(--ink-soft)'),
    lbl('hash6', hashX + 10, hashY + 218, '→ Hash é one-way (irreversível)', 'var(--ink-soft)'),

    /* Usage panel */
    box('use_bg', useX, useY, 280, 230, '', 'var(--panel)'),
    lbl('use_title', useX + 140, useY + 18, '📡 Uso & Verificação', 'var(--good)'),
    lbl('use1', useX + 10, useY + 44, 'Envio pelo cliente:', 'var(--muted)'),
    box('use_hdr', useX + 10, useY + 58, 260, 26, 'Authorization: Bearer sk_live_Xk9m...', 'var(--panel-2)'),
    box('use_hdr2', useX + 10, useY + 88, 260, 26, 'X-API-Key: sk_live_Xk9m...', 'var(--panel-2)'),
    lbl('use2', useX + 10, useY + 126, 'Verificação no servidor:', 'var(--muted)'),
    lbl('use3', useX + 10, useY + 146, '1. Extrair prefixo → achar candidatos no DB', 'var(--ink-soft)'),
    lbl('use4', useX + 10, useY + 166, '2. SHA-256(recebida) == hash_no_DB?', 'var(--ink-soft)'),
    lbl('use5', useX + 10, useY + 186, '3. Verificar expiração e escopos', 'var(--ink-soft)'),
    lbl('use6', useX + 10, useY + 206, '4. Registrar uso (rate limit, logs)', 'var(--ink-soft)'),

    /* Rate Limit panel */
    box('rl_bg', rlX, rlY, 440, 200, '', 'var(--panel)'),
    lbl('rl_title', rlX + 220, rlY + 18, '⏱️ Rate Limiting por API Key', 'var(--warn)'),
    lbl('rl1', rlX + 10, rlY + 44, 'Redis counter por chave:', 'var(--muted)'),
    box('rl_cmd', rlX + 10, rlY + 58, 420, 26, 'INCR ratelimit:sk_live_Xk9m  → count', 'var(--panel-2)'),
    box('rl_ttl', rlX + 10, rlY + 88, 420, 26, 'EXPIRE ratelimit:sk_live_Xk9m 60  ← janela', 'var(--panel-2)'),
    lbl('rl2', rlX + 10, rlY + 126, 'count > limit → 429 Too Many Requests', 'var(--hot)'),
    lbl('rl3', rlX + 10, rlY + 148, 'Headers de resposta:', 'var(--muted)'),
    lbl('rl4', rlX + 10, rlY + 166, 'X-RateLimit-Limit: 1000  X-RateLimit-Remaining: 42', 'var(--ink-soft)'),
    lbl('rl5', rlX + 10, rlY + 186, 'Retry-After: 34  (segundos até reset)', 'var(--ink-soft)'),

    /* Scope panel */
    box('scope_bg', scopeX, scopeY, 460, 200, '', 'var(--panel)'),
    lbl('scope_title', scopeX + 230, scopeY + 18, '🎯 Escopos & Permissões', 'var(--accent)'),
    lbl('sc1', scopeX + 10, scopeY + 44, 'Definidos na criação da chave:', 'var(--muted)'),
    lbl('sc2', scopeX + 10, scopeY + 64, '`read:repos`  `write:issues`  `admin:org`', 'var(--ink)'),
    lbl('sc3', scopeX + 10, scopeY + 86, 'Granularidade → principle of least privilege', 'var(--good)'),
    lbl('sc4', scopeX + 10, scopeY + 108, 'Expiração:', 'var(--muted)'),
    lbl('sc5', scopeX + 10, scopeY + 128, '`expires_at: 2025-12-31`  +  notificação prévia', 'var(--ink-soft)'),
    lbl('sc6', scopeX + 10, scopeY + 150, 'Revogação imediata:', 'var(--muted)'),
    lbl('sc7', scopeX + 10, scopeY + 170, 'DELETE hash do banco → próxima req falha com 401', 'var(--hot)'),

    /* Revocation / rotation panel */
    box('rev_bg', revX, revY, 420, 230, '', 'var(--panel)'),
    lbl('rev_title', revX + 210, revY + 18, '🔄 Rotação de Chaves', 'var(--hot)'),
    lbl('rv1', revX + 10, revY + 44, 'Por que rotacionar?', 'var(--muted)'),
    lbl('rv2', revX + 10, revY + 64, '→ chave comprometida → dano limitado', 'var(--ink-soft)'),
    lbl('rv3', revX + 10, revY + 84, '→ conformidade (SOC 2, PCI DSS)', 'var(--ink-soft)'),
    lbl('rv4', revX + 10, revY + 106, 'Processo sem downtime:', 'var(--muted)'),
    lbl('rv5', revX + 10, revY + 126, '1. Criar nova chave (v2)', 'var(--good)'),
    lbl('rv6', revX + 10, revY + 146, '2. Aceitar v1 e v2 em paralelo', 'var(--good)'),
    lbl('rv7', revX + 10, revY + 166, '3. Cliente migra para v2', 'var(--good)'),
    lbl('rv8', revX + 10, revY + 186, '4. Revogar v1 após período de gracia', 'var(--warn)'),
    lbl('rv9', revX + 10, revY + 206, '→ zero downtime para o integrador', 'var(--muted)'),

    /* vs other auth methods */
    box('cmp_bg', revX, revY + 250, 420, 110, '', 'var(--panel)'),
    lbl('cmp_title', revX + 210, revY + 268, '🔐 API Keys vs Outros', 'var(--muted)'),
    lbl('cm1', revX + 10, revY + 290, 'vs Session: sem estado server-side', 'var(--ink-soft)'),
    lbl('cm2', revX + 10, revY + 310, 'vs JWT: mais simples, sem claims embutidas', 'var(--ink-soft)'),
    lbl('cm3', revX + 10, revY + 330, 'vs OAuth: ideal M2M, sem user agent', 'var(--ink-soft)'),
    lbl('cm4', revX + 10, revY + 350, 'Uso típico: CLI tools, webhooks, integração B2B', 'var(--muted)'),
  ];

  const steps = [
    {
      title: 'O que são API Keys e quando usar',
      show: ['st_gen', 'st_store', 'st_use', 'st_rl', 'st_rot', 'pa1', 'pa2', 'pa3', 'pa4',
             'cmp_bg', 'cmp_title', 'cm1', 'cm2', 'cm3', 'cm4'],
      balloon: {
        anchor: 'cmp_bg', placement: 'left',
        text: 'API Keys são tokens opacos que identificam/autenticam um **cliente programático** (M2M). Ideais para CLIs, webhooks e integração B2B onde não há usuário interativo.',
      },
    },
    {
      title: '① Geração: token criptograficamente aleatório',
      show: ['st_gen', 'st_store', 'st_use', 'st_rl', 'st_rot', 'pa1', 'pa2', 'pa3', 'pa4',
             'gen_bg', 'gen_title', 'gen1', 'gen2', 'gen3', 'gen_ex', 'gen4', 'gen5', 'gen6', 'gen7'],
      highlight: ['st_gen', 'gen_bg'],
      balloon: {
        anchor: 'gen_bg', placement: 'right',
        text: '`crypto.randomBytes(32)` gera 256 bits de entropia. O **prefixo legível** (`sk_live_`, `ghp_`) facilita identificar o tipo e ambiente da chave — essencial para buscar em logs sem expor o valor real.',
        why: 'Nunca use UUIDs sequenciais ou hashes de dados previsíveis como API Keys.',
      },
    },
    {
      title: '② Armazenamento: guardar o hash, nunca a chave',
      show: ['st_gen', 'st_store', 'st_use', 'st_rl', 'st_rot', 'pa1', 'pa2', 'pa3', 'pa4',
             'hash_bg', 'hash_title', 'hash1', 'hash2', 'hash_flow', 'hf1', 'hf2', 'hf3',
             'hash3', 'hash4', 'hash5', 'hash6'],
      highlight: ['st_store', 'hash_bg'],
      balloon: {
        anchor: 'hash_bg', placement: 'right',
        text: 'O banco guarda apenas `SHA-256(key)`. Um vazamento de banco não expõe as chaves reais. Na verificação, o servidor recalcula `SHA-256(recebida)` e compara com o hash armazenado.',
        why: 'SHA-256 é one-way — mesmo com o hash, não dá para reconstruir a chave original.',
      },
    },
    {
      title: '③ Uso e verificação no servidor',
      show: ['st_gen', 'st_store', 'st_use', 'st_rl', 'st_rot', 'pa1', 'pa2', 'pa3', 'pa4',
             'use_bg', 'use_title', 'use1', 'use_hdr', 'use_hdr2', 'use2', 'use3', 'use4', 'use5', 'use6'],
      highlight: ['st_use', 'use_bg'],
      balloon: {
        anchor: 'use_bg', placement: 'left',
        text: 'Cliente envia via `Authorization: Bearer` ou `X-API-Key`. Servidor usa o prefixo para filtrar candidatos no DB (evitar full-table-scan), depois compara `SHA-256(recebida) == hash_armazenado`.',
      },
    },
    {
      title: '④ Rate Limiting por API Key no Redis',
      show: ['st_gen', 'st_store', 'st_use', 'st_rl', 'st_rot', 'pa1', 'pa2', 'pa3', 'pa4',
             'rl_bg', 'rl_title', 'rl1', 'rl_cmd', 'rl_ttl', 'rl2', 'rl3', 'rl4', 'rl5'],
      highlight: ['st_rl', 'rl_bg'],
      balloon: {
        anchor: 'rl_bg', placement: 'right',
        text: 'Contador Redis por chave: `INCR ratelimit:sk_live_Xk9m` — se `count > limit`, retorna **429**. `EXPIRE` define a janela de tempo (60s, 1h...). Headers informam o cliente quanto falta.',
        why: 'Rate limit por chave evita que um abusador impacte outros clientes da API.',
      },
    },
    {
      title: 'Escopos, Permissões e Expiração',
      show: ['st_gen', 'st_store', 'st_use', 'st_rl', 'st_rot', 'pa1', 'pa2', 'pa3', 'pa4',
             'scope_bg', 'scope_title', 'sc1', 'sc2', 'sc3', 'sc4', 'sc5', 'sc6', 'sc7'],
      highlight: ['scope_bg'],
      balloon: {
        anchor: 'scope_bg', placement: 'left',
        text: 'Escopos definem o que a chave pode fazer (`read:repos`, `write:issues`). Principle of least privilege — chaves com menos permissões limitam o dano de uma chave comprometida. Expiração + revogação imediata completam o ciclo.',
      },
    },
    {
      title: '⑤ Rotação de chaves sem downtime',
      show: ['st_gen', 'st_store', 'st_use', 'st_rl', 'st_rot', 'pa1', 'pa2', 'pa3', 'pa4',
             'rev_bg', 'rev_title', 'rv1', 'rv2', 'rv3', 'rv4', 'rv5', 'rv6', 'rv7', 'rv8', 'rv9'],
      highlight: ['st_rot', 'rev_bg'],
      balloon: {
        anchor: 'rev_bg', placement: 'left',
        text: 'Crie a nova chave → aceite v1 e v2 em paralelo → cliente migra → revogue v1. Esse overlap evita downtime durante a troca. Para revogação de emergência: deletar do DB imediatamente.',
      },
    },
    {
      title: 'API Keys vs JWT vs Sessions vs OAuth',
      show: ['st_gen', 'st_store', 'st_use', 'st_rl', 'st_rot', 'pa1', 'pa2', 'pa3', 'pa4',
             'cmp_bg', 'cmp_title', 'cm1', 'cm2', 'cm3', 'cm4',
             'rev_bg', 'rev_title', 'rv1', 'rv2'],
      balloon: {
        anchor: 'cmp_bg', placement: 'top',
        text: '**API Keys**: simples, M2M, sem claims. **JWT**: stateless com claims embutidas. **Sessions**: estado server-side, revogação fácil. **OAuth**: delegação de acesso com user flow. Use API Keys quando o cliente é confiável e controlado.',
      },
    },
    {
      title: 'Quiz',
      show: ['st_gen', 'st_store', 'st_use', 'st_rl', 'st_rot', 'pa1', 'pa2', 'pa3', 'pa4'],
      quiz: {
        question: 'Por que o servidor deve guardar apenas o SHA-256 da API Key, e não a chave em plain text?',
        options: [
          'Para economizar espaço no banco — hashes são menores que a chave original',
          'Para dificultar que um atacante que vaze o banco possa usar as chaves roubadas',
          'Porque a API Key é derivada matematicamente do hash armazenado',
          'Para que o servidor possa regenerar a chave original a partir do hash quando necessário',
        ],
        answer: 1,
        explain: 'SHA-256 é one-way: não é possível reconstruir a chave original a partir do hash. Se o banco vazar, o atacante tem apenas hashes inúteis — para usá-los, precisaria fazer brute-force de 256 bits de entropia, o que é computacionalmente inviável.',
      },
    },
    {
      title: 'Resumo: API Keys',
      show: ['st_gen', 'st_store', 'st_use', 'st_rl', 'st_rot', 'pa1', 'pa2', 'pa3', 'pa4',
             'gen_bg', 'gen_title', 'gen1', 'gen3', 'gen_ex',
             'hash_bg', 'hash_title', 'hash1', 'hash2', 'hash_flow', 'hf1', 'hf2', 'hf3',
             'use_bg', 'use_title', 'use_hdr',
             'rl_bg', 'rl_title', 'rl_cmd',
             'scope_bg', 'scope_title', 'sc2', 'sc6', 'sc7',
             'rev_bg', 'rev_title', 'rv5', 'rv6', 'rv7', 'rv8'],
      balloon: {
        anchor: 'hash_bg', placement: 'right',
        text: 'API Keys: 256 bits aleatórios com prefixo legível. Guardar apenas SHA-256. Rate limit por key no Redis. Escopos mínimos. Rotação com overlap. Revogação imediata deletando o hash.',
      },
    },
  ];

  window.API_KEYS_DIAGRAM = { title: 'API Keys', W, H, elements, steps };
})();
