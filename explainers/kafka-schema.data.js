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
  function seq(id, x1, x2, y, text, color) {
    const mid = (x1 + x2) / 2;
    return [
      { id, type: 'arrow', x1, y1: y, x2, y2: y, color: color || 'var(--accent)' },
      { id: id + '_l', type: 'label', x: mid, y: y - 12, label: text, style: `fill:${color || 'var(--accent)'}`, size: 11 },
    ];
  }

  /* ── Top half: 3-column format comparison ── */
  const FY = 20, FH = 280;
  const JX = 20,  JW = 360;   // JSON column
  const AX = 400, AW = 360;   // Avro column
  const PX = 780, PW = 480;   // Protobuf column

  /* ── Bottom half: Schema Registry flow ── */
  /* Actors */
  const PRX = 80,  PRY = 370, PRW = 110, PRH = 50;  // Producer
  const SRX = 350, SRY = 370, SRW = 130, SRH = 50;  // Schema Registry
  const KAX = 620, KAY = 370, KAW = 110, KAH = 50;  // Kafka
  const COX = 840, COY = 370, COW = 110, COH = 50;  // Consumer

  /* Lifelines */
  const LL_Y1 = SRY + SRH, LL_Y2 = 700;

  /* Message Y positions */
  const mY = {
    reg:    450, reg_r:  480,
    prod:   510,
    pub:    540,
    read:   570, read_sr: 600, read_r: 630,
    proc:   660,
  };

  /* ── Compatibility panel ── */
  const CPX = 1050, CPY = 370, CPW = 210;

  const elements = [
    /* ── Format comparison: JSON ── */
    box('json_bg', JX, FY, JW, FH, '', 'var(--panel)'),
    lbl('json_title', JX + JW / 2, FY + 18, '📄 JSON', 'var(--warn)'),
    lbl('j1', JX + 10, FY + 42, 'Human-readable, sem schema', 'var(--ink-soft)'),
    lbl('j2', JX + 10, FY + 60, 'Flexível: adicionar/remover campos livremente', 'var(--ink-soft)'),
    lbl('j3', JX + 10, FY + 80, 'Grande: nomes de campo repetidos em cada msg', 'var(--hot)'),
    box('json_ex', JX + 10, FY + 96, JW - 20, 80, '', 'var(--panel-2)'),
    lbl('je1', JX + 18, FY + 112, '{ "userId": 42,', 'var(--ink)'),
    lbl('je2', JX + 18, FY + 128, '  "event": "checkout",', 'var(--ink)'),
    lbl('je3', JX + 18, FY + 144, '  "amount": 99.90,', 'var(--ink)'),
    lbl('je4', JX + 18, FY + 158, '  "currency": "BRL" }', 'var(--ink)'),
    lbl('j4', JX + 10, FY + 190, 'Payload: ~120 bytes', 'var(--hot)'),
    lbl('j5', JX + 10, FY + 210, 'Sem schema enforcement: producer pode', 'var(--hot)'),
    lbl('j6', JX + 10, FY + 228, 'remover "amount" → consumer crasha', 'var(--hot)'),
    lbl('j7', JX + 10, FY + 248, 'Sem compressão nativa de schema', 'var(--warn)'),
    lbl('j8', JX + 10, FY + 264, 'Serialização lenta (parse texto)', 'var(--warn)'),

    /* ── Format comparison: Avro ── */
    box('avro_bg', AX, FY, AW, FH, '', 'var(--panel)'),
    lbl('avro_title', AX + AW / 2, FY + 18, '🔷 Apache Avro', 'var(--accent-2)'),
    lbl('av1', AX + 10, FY + 42, 'Schema em JSON, encoding binário', 'var(--ink-soft)'),
    lbl('av2', AX + 10, FY + 60, 'Schema resolvido via Schema Registry', 'var(--good)'),
    lbl('av3', AX + 10, FY + 80, 'Campos sem nome no wire (só posição)', 'var(--ink-soft)'),
    box('avro_schema', AX + 10, FY + 96, AW - 20, 80, '', 'var(--panel-2)'),
    lbl('avs1', AX + 18, FY + 112, '{ "type": "record",', 'var(--accent-2)'),
    lbl('avs2', AX + 18, FY + 128, '  "name": "OrderEvent",', 'var(--accent-2)'),
    lbl('avs3', AX + 18, FY + 144, '  "fields": [', 'var(--accent-2)'),
    lbl('avs4', AX + 18, FY + 160, '    {"name":"userId","type":"int"} ]}', 'var(--accent-2)'),
    lbl('av4', AX + 10, FY + 190, 'Payload: ~25 bytes (schema separado)', 'var(--good)'),
    lbl('av5', AX + 10, FY + 210, 'Schema evolution nativa: default values', 'var(--good)'),
    lbl('av6', AX + 10, FY + 228, 'Schema enviado com a mensagem (standalone)', 'var(--ink-soft)'),
    lbl('av7', AX + 10, FY + 248, 'Ou resolvido via Registry (ID no header)', 'var(--good)'),
    lbl('av8', AX + 10, FY + 264, 'Popular no ecossistema Confluent Kafka', 'var(--muted)'),

    /* ── Format comparison: Protobuf ── */
    box('proto_bg', PX, FY, PW, FH, '', 'var(--panel)'),
    lbl('proto_title', PX + PW / 2, FY + 18, '⚡ Protocol Buffers (Protobuf)', 'var(--good)'),
    lbl('p1', PX + 10, FY + 42, 'Schema em arquivo .proto, compilado', 'var(--ink-soft)'),
    lbl('p2', PX + 10, FY + 60, 'Binary com field numbers — muito compacto', 'var(--good)'),
    lbl('p3', PX + 10, FY + 80, 'Type-safe: protoc gera código tipado', 'var(--good)'),
    box('proto_schema', PX + 10, FY + 96, PW - 20, 80, '', 'var(--panel-2)'),
    lbl('ps1', PX + 18, FY + 112, 'syntax = "proto3";', 'var(--good)'),
    lbl('ps2', PX + 18, FY + 128, 'message OrderEvent {', 'var(--good)'),
    lbl('ps3', PX + 18, FY + 144, '  int32 user_id = 1;', 'var(--good)'),
    lbl('ps4', PX + 18, FY + 160, '  string currency = 3; }', 'var(--good)'),
    lbl('p4', PX + 10, FY + 190, 'Payload: ~10 bytes (menor que Avro)', 'var(--good)'),
    lbl('p5', PX + 10, FY + 210, 'Campo removido: adicionar `reserved` para', 'var(--ink-soft)'),
    lbl('p6', PX + 10, FY + 228, 'evitar reuso de field number → breaking', 'var(--ink-soft)'),
    lbl('p7', PX + 10, FY + 248, 'Backward compat: manter field numbers!', 'var(--warn)'),
    lbl('p8', PX + 10, FY + 264, 'Schema Registry: Confluent suporta proto', 'var(--muted)'),

    /* ── Schema Registry flow ── */
    box('pr_box', PRX - PRW / 2, PRY, PRW, PRH, '📤 Producer', 'var(--accent)'),
    box('sr_box', SRX - SRW / 2, SRY, SRW, SRH, '📋 Schema\nRegistry', 'var(--accent-2)'),
    box('ka_box', KAX - KAW / 2, KAY, KAW, KAH, '📨 Kafka\nBroker', 'var(--warn)'),
    box('co_box', COX - COW / 2, COY, COW, COH, '📥 Consumer', 'var(--good)'),

    /* lifelines */
    { id: 'll_pr', type: 'arrow', x1: PRX, y1: PRY + PRH, x2: PRX, y2: LL_Y2, noHead: true, dashed: true, color: 'var(--line)' },
    { id: 'll_sr', type: 'arrow', x1: SRX, y1: SRY + SRH, x2: SRX, y2: LL_Y2, noHead: true, dashed: true, color: 'var(--line)' },
    { id: 'll_ka', type: 'arrow', x1: KAX, y1: KAY + KAH, x2: KAX, y2: LL_Y2, noHead: true, dashed: true, color: 'var(--line)' },
    { id: 'll_co', type: 'arrow', x1: COX, y1: COY + COH, x2: COX, y2: LL_Y2, noHead: true, dashed: true, color: 'var(--line)' },

    /* Producer → Schema Registry: register */
    ...seq('s_reg', PRX, SRX, mY.reg,
      'POST /subjects/orders-value/versions {schema}', 'var(--accent-2)'),
    ...seq('s_reg_r', SRX, PRX, mY.reg_r,
      '{"id": 7}  ← schema_id atribuído', 'var(--accent-2)'),

    /* Producer → Kafka: publish with schema_id prefix */
    ...seq('s_prod', PRX, KAX, mY.prod,
      'Produce: [0x00][schema_id=7][avro/proto bytes]', 'var(--accent)'),

    /* Consumer reads from Kafka */
    ...seq('s_pub', KAX, COX, mY.pub,
      'Poll: mensagem com magic byte + schema_id', 'var(--warn)'),

    /* Consumer → Schema Registry: fetch schema */
    ...seq('s_read', COX, SRX, mY.read,
      'GET /schemas/ids/7  (cache miss)', 'var(--good)'),
    ...seq('s_read_r', SRX, COX, mY.read_r,
      '{schema: "OrderEvent" ...}  ← cached', 'var(--good)'),

    /* Consumer processes */
    ...seq('s_proc', COX, COX + 40, mY.proc,
      'deserialize → process', 'var(--good)'),

    /* wire format annotation */
    box('wire_bg', 170, 495, 160, 28, '', 'var(--panel)'),
    lbl('wire_lbl', 250, 513, '[0x00][4-byte schema_id][payload]', 'var(--accent)'),
    lbl('wire_sub', 250, 528, 'magic byte sempre 0x00', 'var(--muted)'),

    /* ── Compatibility modes panel ── */
    box('compat_bg', CPX, CPY, CPW, 310, '', 'var(--panel)'),
    lbl('compat_title', CPX + CPW / 2, CPY + 18, '⚙️ Compatibility', 'var(--ink)'),

    lbl('cm_bk_h', CPX + 10, CPY + 44, 'BACKWARD', 'var(--good)'),
    lbl('cm_bk1', CPX + 10, CPY + 62, 'Novos consumers leem', 'var(--ink-soft)'),
    lbl('cm_bk2', CPX + 10, CPY + 78, 'mensagens antigas', 'var(--ink-soft)'),
    lbl('cm_bk3', CPX + 10, CPY + 94, '→ add campo c/ default ✓', 'var(--good)'),
    lbl('cm_bk4', CPX + 10, CPY + 110, '→ remover campo ✓', 'var(--good)'),

    lbl('cm_fw_h', CPX + 10, CPY + 138, 'FORWARD', 'var(--accent-2)'),
    lbl('cm_fw1', CPX + 10, CPY + 156, 'Antigos consumers leem', 'var(--ink-soft)'),
    lbl('cm_fw2', CPX + 10, CPY + 172, 'mensagens novas', 'var(--ink-soft)'),
    lbl('cm_fw3', CPX + 10, CPY + 188, '→ remover c/ default ✓', 'var(--accent-2)'),
    lbl('cm_fw4', CPX + 10, CPY + 204, '→ add campo ✓', 'var(--accent-2)'),

    lbl('cm_fl_h', CPX + 10, CPY + 230, 'FULL', 'var(--warn)'),
    lbl('cm_fl1', CPX + 10, CPY + 248, 'Ambas: back + forward', 'var(--ink-soft)'),
    lbl('cm_fl2', CPX + 10, CPY + 264, 'Mais restritivo', 'var(--ink-soft)'),

    lbl('cm_no_h', CPX + 10, CPY + 286, 'NONE', 'var(--hot)'),
    lbl('cm_no1', CPX + 10, CPY + 302, 'Sem verificação (perigoso)', 'var(--hot)'),

    /* Evolution rules label */
    box('evol_bg', CPX, CPY + 318, CPW, 60, '', 'var(--panel)'),
    lbl('evol_t', CPX + CPW / 2, CPY + 334, 'Schema Evolution', 'var(--warn)'),
    lbl('ev1', CPX + 10, CPY + 352, 'add campo c/ default → OK (BACKWARD)', 'var(--good)'),
    lbl('ev2', CPX + 10, CPY + 368, 'mudar tipo (int→str) → BREAKING', 'var(--hot)'),
  ];

  const steps = [
    {
      title: 'O Problema: Schema Drift',
      show: ['json_bg', 'json_title', 'j1', 'j2', 'j3', 'json_ex', 'je1', 'je2', 'je3', 'je4',
             'j5', 'j6'],
      balloon: {
        anchor: 'json_bg', placement: 'right',
        text: 'Producer A publica mensagens JSON com campo `amount`. Um dia remove o campo para refatorar. Consumer B crasha com `KeyError: amount`. Sem schema enforcement, o contrato entre producer e consumer é invisível.',
        why: 'Schema drift é a principal causa de falhas silenciosas em pipelines de dados — difícil de detectar até a produção.',
        deep: `<p>O problema fica pior em escala: um tópico Kafka pode ter dezenas de consumers de times diferentes, cada um assumindo implicitamente uma estrutura de mensagem. Sem um contrato explícito e verificado, uma mudança no producer só quebra o consumer em runtime — geralmente em produção, geralmente de madrugada.</p>
<div class="xp-bad"><strong>Deploy do producer sem aviso</strong>// antes: { userId, event, amount, currency }
// depois de um refactor:
{ userId, event, currency } // "amount" removido silenciosamente</div>
<p>Um Schema Registry resolve isso tornando o contrato explícito e versionado: o producer só consegue publicar uma mensagem se o schema dela for compatível com as regras configuradas — a quebra é detectada no deploy, não em produção.</p>` },
    },
    {
      title: 'JSON: flexível mas sem garantias',
      show: ['json_bg', 'json_title', 'j1', 'j2', 'j3', 'json_ex', 'je1', 'je2', 'je3', 'je4',
             'j4', 'j5', 'j6', 'j7', 'j8'],
      highlight: ['json_bg'],
      balloon: {
        anchor: 'json_bg', placement: 'right',
        text: 'JSON: human-readable, zero setup. Problemas: <strong>payloads grandes</strong> (nomes de campo repetidos em cada mensagem), <strong>sem schema enforcement</strong> e <strong>parse lento</strong> (texto → objeto). Bom para desenvolvimento; problemático em alta escala.',
        deep: `<p>O custo de "nomes de campo repetidos" parece pequeno numa mensagem isolada, mas em um tópico com bilhões de eventos por dia, os bytes gastos só com as strings <code>"userId"</code>, <code>"event"</code>, <code>"amount"</code> repetidas em cada mensagem somam terabytes de armazenamento e banda desperdiçados.</p>
<div class="xp-example"><strong>Mesma mensagem, dois formatos</strong>JSON: { "userId": 42, "event": "checkout", "amount": 99.90, "currency": "BRL" }  → ~65 bytes de nomes de campo
Avro: apenas os valores, na ordem do schema → nomes ficam só no schema, não em cada mensagem</div>
<p>Isso não significa que JSON seja uma escolha ruim — para volumes baixos/médios e times pequenos, a legibilidade e a ausência de setup (sem Registry, sem geração de código) frequentemente compensam o overhead de espaço.</p>` },
    },
    {
      title: 'Protocol Buffers: schema compilado, binário compacto',
      show: ['proto_bg', 'proto_title', 'p1', 'p2', 'p3', 'proto_schema',
             'ps1', 'ps2', 'ps3', 'ps4', 'p4', 'p5', 'p6', 'p7', 'p8'],
      highlight: ['proto_bg'],
      balloon: {
        anchor: 'proto_bg', placement: 'left',
        text: 'Protobuf usa <strong>field numbers</strong> em vez de nomes — o wire format é muito menor (~10 bytes vs ~120 JSON). O `.proto` file é a fonte de verdade. `protoc` gera código tipado. Campo removido: usar `reserved` para não reutilizar o number.',
        why: 'Field numbers são a chave da backward compatibility: adicionar campo com number novo → safe. Reutilizar number de campo removido → BREAKING.',
        deep: `<p>No wire, uma mensagem Protobuf não carrega nomes de campo — só pares (field number, valor) codificados em varint. Isso é o que torna o payload tão compacto, mas também o motivo pelo qual reutilizar um number de campo removido é perigoso: um consumer antigo pode interpretar o valor errado como se fosse o campo antigo.</p>
<div class="xp-example"><strong>.proto com reserved</strong>message OrderEvent {
  int32 user_id = 1;
  reserved 2;          // campo antigo "legacy_field" removido
  reserved "legacy_field";
  string currency = 3;
}</div>
<p><code>reserved</code> impede o compilador de deixar alguém reusar acidentalmente aquele number ou nome no futuro — é uma proteção em tempo de compilação contra um erro que só apareceria em runtime.</p>` },
    },
    {
      title: 'Apache Avro: schema JSON, encoding binário',
      show: ['avro_bg', 'avro_title', 'av1', 'av2', 'av3', 'avro_schema',
             'avs1', 'avs2', 'avs3', 'avs4', 'av4', 'av5', 'av6', 'av7', 'av8'],
      highlight: ['avro_bg'],
      balloon: {
        anchor: 'avro_bg', placement: 'right',
        text: 'Avro define o schema em JSON mas serializa em binário. Campos são identificados por <strong>posição</strong> no schema (não por nome no wire). Schema evolution via `default` values. Muito integrado ao ecossistema Confluent Kafka.',
        deep: `<p>Como o wire format do Avro não carrega nenhum metadado — nem nomes, nem tipos, nem field numbers — o consumer precisa necessariamente ter o schema exato usado na escrita para conseguir decodificar os bytes corretamente. É por isso que Avro depende tão fortemente do Schema Registry: sem ele, não há como saber qual schema usar para ler.</p>
<div class="xp-example"><strong>Schema Avro com default</strong>{ "name": "coupon_code", "type": ["null", "string"], "default": null }
# campo novo e opcional — mensagens antigas sem ele recebem null ao ler</div>
<p>Diferente do Protobuf, que gera código a partir do <code>.proto</code> em build time, o Avro é tipicamente resolvido em runtime — o que dá mais flexibilidade dinâmica, ao custo de checagem de tipos acontecer mais tarde no ciclo de desenvolvimento.</p>` },
    },
    {
      title: 'Comparativo: JSON vs Avro vs Protobuf',
      show: ['json_bg', 'json_title', 'j3', 'j4', 'j5',
             'avro_bg', 'avro_title', 'av4', 'av5', 'av7',
             'proto_bg', 'proto_title', 'p2', 'p3', 'p4', 'p7'],
      balloon: {
        anchor: 'avro_bg', placement: 'bottom',
        text: '| | JSON | Avro | Protobuf |\n|Payload|~120B|~25B|~10B|\n|Schema|nenhum|JSON def|.proto file|\n|Tipagem|none|runtime|compilada|\n|Evolution|manual|default values|field numbers|\n\nProtobuf é menor; Avro integra melhor ao Kafka ecosystem com Registry.',
        deep: `<p>Na prática, a escolha raramente é só sobre tamanho de payload — o ecossistema em volta pesa mais. Confluent Schema Registry nasceu com Avro como formato "nativo", então times já no mundo Confluent tendem a usar Avro por menor atrito. Times vindos de gRPC/microserviços já têm os <code>.proto</code> prontos e preferem reaproveitá-los no Kafka.</p>
<h4>Guia rápido de escolha</h4>
<ul>
<li><strong>JSON</strong> — prototipagem, volumes baixos, times pequenos, debug fácil (dá pra ler no console)</li>
<li><strong>Avro</strong> — ecossistema Kafka/Confluent maduro, schema evolution flexível com defaults</li>
<li><strong>Protobuf</strong> — já usa gRPC, quer o menor payload possível, prioriza tipagem forte em compile-time</li>
</ul>` },
    },
    {
      title: 'Schema Registry: o contrato centralizado',
      show: ['pr_box', 'sr_box', 'ka_box', 'co_box',
             'll_pr', 'll_sr', 'll_ka', 'll_co'],
      highlight: ['sr_box'],
      balloon: {
        anchor: 'sr_box', placement: 'right',
        text: 'O Schema Registry é um serviço HTTP que armazena e versiona schemas. Cada schema recebe um <strong>schema_id</strong> único. Producer registra antes de publicar. Consumer busca o schema pelo ID para deserializar.',
        why: 'O Registry garante que producer e consumer sempre usam schemas compatíveis — sem coordenação manual entre times.',
        deep: `<p>O Registry funciona como uma fonte única de verdade separada do próprio Kafka — ele não guarda mensagens, só schemas e suas regras de compatibilidade. Isso permite que times evoluam schemas de forma coordenada sem precisar reprocessar ou tocar nos tópicos existentes.</p>
<div class="xp-example"><strong>Registrar um schema</strong>curl -X POST http://registry:8081/subjects/orders-value/versions \\
  -H "Content-Type: application/vnd.schemaregistry.v1+json" \\
  -d '{"schema": "{\\"type\\":\\"record\\",...}"}'
# resposta: {"id": 7}</div>
<p>Se o schema enviado já existe (mesmo conteúdo), o Registry retorna o <code>id</code> já existente em vez de criar um duplicado — schema_ids são determinísticos por conteúdo dentro de um mesmo subject.</p>` },
    },
    {
      title: 'Producer: registrar schema e serializar',
      show: ['pr_box', 'sr_box', 'ka_box', 'll_pr', 'll_sr', 'll_ka',
             's_reg', 's_reg_l', 's_reg_r', 's_reg_r_l',
             's_prod', 's_prod_l',
             'wire_bg', 'wire_lbl', 'wire_sub'],
      highlight: ['pr_box', 'sr_box'],
      balloon: {
        anchor: 's_reg_l', placement: 'top',
        text: 'Producer envia o schema ao Registry. Se já existe e é compatível, recebe o <strong>schema_id</strong> existente. Serializa a mensagem prefixada com `[0x00][schema_id de 4 bytes]` — apenas 5 bytes de overhead para todo o contexto de schema.',
        deep: `<p>Na prática, esse fluxo acontece dentro do serializer Avro/Protobuf do cliente Kafka (<code>KafkaAvroSerializer</code>, por exemplo) — o código da aplicação não faz a chamada HTTP diretamente, apenas configura a URL do Registry e chama <code>producer.send()</code> normalmente.</p>
<div class="xp-example"><strong>Wire format da mensagem</strong>[0x00] [0x00 0x00 0x00 0x07] [bytes Avro/Protobuf do payload]
  magic byte    schema_id = 7 (4 bytes, big-endian)   payload serializado</div>
<p>O serializer mantém um cache local de schemas já registrados nessa run do producer — ele só bate no Registry via HTTP na primeira vez que vê aquele schema; publicações seguintes reusam o schema_id em memória, sem round-trip de rede.</p>` },
    },
    {
      title: 'Consumer: ler schema_id e deserializar',
      show: ['pr_box', 'sr_box', 'ka_box', 'co_box',
             'll_pr', 'll_sr', 'll_ka', 'll_co',
             's_prod', 's_prod_l',
             's_pub', 's_pub_l',
             's_read', 's_read_l', 's_read_r', 's_read_r_l',
             's_proc', 's_proc_l',
             'wire_bg', 'wire_lbl', 'wire_sub'],
      highlight: ['co_box', 'sr_box'],
      balloon: {
        anchor: 's_read_l', placement: 'top',
        text: 'Consumer lê os primeiros 5 bytes: magic byte `0x00` + `schema_id`. Faz GET ao Registry para obter o schema (cache local após o primeiro fetch). Usa o schema para deserializar os bytes restantes.',
        why: 'O cache local do consumer evita latência do Registry em cada mensagem — schemas raramente mudam.',
        deep: `<p>Um detalhe importante: o consumer usa o schema com o qual a mensagem foi <em>escrita</em> (identificado pelo schema_id) combinado com o schema que ele mesmo espera (a versão mais recente que conhece) para resolver a leitura — é essa combinação de "writer schema" + "reader schema" que faz a resolução de compatibilidade funcionar campo a campo.</p>
<div class="xp-example"><strong>GET ao Registry (cache miss)</strong>GET /schemas/ids/7
{"schema": "{\\"type\\":\\"record\\",\\"name\\":\\"OrderEvent\\",...}"}
# resultado fica em cache local do consumer indefinidamente (schema_id nunca muda de conteúdo)</div>
<p>Como um schema_id é imutável por definição, o cache do consumer nunca precisa de invalidação — só cresce conforme novos schema_ids aparecem no tráfego, o que é raro em regime estável.</p>` },
    },
    {
      title: 'Compatibility Modes: BACKWARD e FORWARD',
      show: ['sr_box', 'll_sr',
             'compat_bg', 'compat_title',
             'cm_bk_h', 'cm_bk1', 'cm_bk2', 'cm_bk3', 'cm_bk4',
             'cm_fw_h', 'cm_fw1', 'cm_fw2', 'cm_fw3', 'cm_fw4'],
      highlight: ['compat_bg', 'sr_box'],
      balloon: {
        anchor: 'compat_bg', placement: 'left',
        text: '<strong>BACKWARD</strong>: novo consumer pode ler mensagens antigas. Permite adicionar campo com default e remover campo.\n<strong>FORWARD</strong>: consumer antigo pode ler mensagens novas. Permite adicionar campo e remover campo com default.',
        why: 'BACKWARD é o default e o mais comum: permite fazer deploy do consumer antes do producer (safe rollout).',
        deep: `<p>O nome da regra descreve a direção em que a compatibilidade é garantida, não quem faz deploy primeiro — o que confunde muita gente. BACKWARD significa "o schema novo consegue ler dados escritos com o schema velho" (o consumer olha para trás, para o passado).</p>
<div class="xp-good"><strong>Ordem de rollout com BACKWARD</strong>1. Deploy do consumer com o novo schema primeiro
2. Deploy do producer depois
(o consumer novo já sabe lidar com mensagens antigas e novas)</div>
<div class="xp-good"><strong>Ordem de rollout com FORWARD</strong>1. Deploy do producer com o novo schema primeiro
2. Deploy do consumer depois
(consumers antigos ainda conseguem ler as mensagens novas)</div>` },
    },
    {
      title: 'FULL e Schema Evolution Rules',
      show: ['sr_box', 'll_sr',
             'compat_bg', 'compat_title',
             'cm_fl_h', 'cm_fl1', 'cm_fl2',
             'cm_no_h', 'cm_no1',
             'evol_bg', 'evol_t', 'ev1', 'ev2'],
      highlight: ['evol_bg'],
      balloon: {
        anchor: 'evol_bg', placement: 'left',
        text: '<strong>FULL</strong> = BACKWARD + FORWARD: mais seguro mas mais restritivo. <strong>NONE</strong>: sem verificação — perigoso, apenas para desenvolvimento. Regra de ouro de evolution: sempre adicionar campos com `default`, nunca reutilizar field numbers (Protobuf) ou alterar tipos.',
        deep: `<p>FULL é a escolha certa quando producer e consumer fazem deploy de forma independente e você não pode garantir a ordem — é o modo mais seguro para ambientes com múltiplos times publicando/consumindo o mesmo tópico sem coordenação estreita.</p>
<div class="xp-bad"><strong>Mudança BREAKING comum</strong>Mudar "amount" de int para string — nenhum modo de compatibilidade permite isso; qualquer consumer (antigo ou novo) vai falhar ao tentar interpretar o tipo errado</div>
<div class="xp-good"><strong>Evolução segura</strong>Adicionar campo novo com default, nunca reaproveitar nome/number de campo removido, nunca mudar o tipo de um campo existente</div>
<p>NONE existe principalmente para ambientes de desenvolvimento local ou testes onde iterar rápido no schema é mais importante que segurança — nunca deveria ser o modo configurado em produção.</p>` },
    },
    {
      title: 'Subject naming e Registry na prática',
      show: ['pr_box', 'sr_box', 'ka_box', 'co_box',
             'll_pr', 'll_sr', 'll_ka', 'll_co',
             's_reg', 's_reg_l', 's_reg_r', 's_reg_r_l',
             'compat_bg', 'compat_title', 'cm_bk_h', 'cm_bk3'],
      balloon: {
        anchor: 'sr_box', placement: 'right',
        text: '<strong>Subject naming</strong>: `{topic}-value` (ex: `orders-value`), `{topic}-key`, ou `{record-name}`. Confluent Schema Registry: REST API na porta 8081, suporta Avro/JSON Schema/Protobuf. Cache no cliente evita overhead. Schema IDs são imutáveis (nunca mudam de schema).',
        deep: `<p>A estratégia de naming <code>{topic}-value</code> (TopicNameStrategy) é o default e liga o schema diretamente ao tópico Kafka — simples, mas significa que um tópico só pode ter um schema por vez (versionado). Já <code>{record-name}</code> (RecordNameStrategy) liga o schema ao nome lógico do evento, permitindo múltiplos tipos de evento no mesmo tópico.</p>
<div class="xp-example"><strong>Listar versões de um subject</strong>curl http://registry:8081/subjects/orders-value/versions
[1, 2, 3]
curl http://registry:8081/subjects/orders-value/versions/3
{"id": 7, "version": 3, "schema": "..."}</div>
<p>Vale lembrar: a compatibilidade é verificada por <em>subject</em>, não pelo tópico inteiro — se um tópico usa RecordNameStrategy com vários tipos de evento, cada tipo tem sua própria linha de evolução e regras de compatibilidade independentes.</p>` },
    },
    {
      title: 'Quiz',
      show: ['sr_box', 'compat_bg', 'compat_title',
             'cm_bk_h', 'cm_bk1', 'cm_bk2', 'cm_bk3', 'cm_bk4',
             'cm_fw_h', 'cm_fw1', 'cm_fw2', 'cm_fw3', 'cm_fw4'],
      quiz: {
        question: 'Você quer adicionar um novo campo opcional `coupon_code` a um schema Avro existente sem quebrar consumers antigos que não conhecem esse campo. Qual ação garante isso com BACKWARD compatibility?',
        options: [
          'Remover um campo existente para abrir espaço e renomear para coupon_code',
          'Adicionar o campo coupon_code com um valor default (ex: null ou "")',
          'Criar um novo schema com nome diferente e migrar todos os consumers manualmente',
          'Alterar o tipo do campo amount de int para string para acomodar o coupon_code',
        ],
        answer: 1,
        explain: 'BACKWARD compatibility requer que novos schemas possam ser lidos por consumers que usam o schema mais recente para ler mensagens produzidas com schemas mais antigos. Adicionar um campo com <strong>default value</strong> é a operação segura: mensagens antigas (sem o campo) serão preenchidas com o default ao serem deserializadas pelo novo consumer. Remover campos (sem default), renomear ou mudar tipos são operações BREAKING.',
      },
    },
    {
      title: 'Resumo: Kafka Serialization + Schema Registry',
      show: ['json_bg', 'json_title', 'j3', 'j4',
             'avro_bg', 'avro_title', 'av2', 'av4', 'av5',
             'proto_bg', 'proto_title', 'p2', 'p4',
             'pr_box', 'sr_box', 'ka_box', 'co_box',
             'll_pr', 'll_sr', 'll_ka', 'll_co',
             's_reg', 's_reg_l', 's_reg_r', 's_reg_r_l',
             's_prod', 's_prod_l', 's_pub', 's_pub_l',
             's_read', 's_read_l', 's_read_r', 's_read_r_l',
             'wire_bg', 'wire_lbl',
             'compat_bg', 'compat_title', 'cm_bk_h', 'cm_bk3', 'cm_fw_h', 'cm_fw3'],
      balloon: {
        anchor: 'sr_box', placement: 'right',
        text: 'JSON: legível, sem schema, grande. Avro/Protobuf: binary, compacto, schema enforcement. Schema Registry: versiona schemas, atribui IDs, verifica compatibility. Wire format: [0x00][schema_id][payload]. BACKWARD: default values ao adicionar campos. FULL: mais seguro.',
      },
    },
  ];

  window.KAFKA_SCHEMA_DIAGRAM = { title: 'Kafka Serialization + Schema Registry', W, H, elements, steps };
})();
