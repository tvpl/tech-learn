(function () {
  const W = 1280, H = 720;

  // ── Layout ─────────────────────────────────────────────────────────────────
  // Left col: Client + Stub (x~160), Middle col: Proto/Codec (x~640), Right col: Server + Skeleton (x~1080)
  // Top strip (y 0-100): REST vs gRPC comparison header
  // Main area (y 100-600): flow diagram

  const CX = 160, MX = 640, SX = 1090;
  const LY = 110;

  const box = (id, x, y, w, h, label, fill, stroke) =>
    ({ id, type: "box", x, y, w, h, rx: 10, fill: fill||"var(--panel-2)", stroke: stroke||"var(--line)", label });

  const lbl = (id, x, y, text, opts={}) =>
    ({ id, type: "label", x, y, label: text, anchor: opts.anchor||"middle", sub: opts.sub, mono: opts.mono });

  const arr = (id, x1, y1, x2, y2, color) =>
    ({ id, type: "arrow", x1, y1, x2, y2, color: color||"var(--accent)" });

  // horizontal message helper
  const msg = (id, fromX, toX, y, label, color) => [
    { id, type: "arrow", x1: fromX + 16, y1: y, x2: toX - 16, y2: y,
      color: color || "var(--accent)" },
    { id: id + "_l", type: "label", x: (fromX + toX) / 2, y: y - 13,
      anchor: "middle", sub: true, mono: true, label },
  ];

  const elements = [
    // ── Comparison header (step 1) ─────────────────────────────────────────
    box("rest_box", 20, 10, 580, 80, ["REST / JSON", "HTTP 1.1 · Text · No schema"], "#1a1010", "var(--muted)"),
    box("grpc_box", 660, 10, 600, 80, ["gRPC / Protobuf", "HTTP/2 · Binary · Schema-first"], "#102212", "var(--good)"),
    lbl("vs_lbl", 640, 50, "vs", { anchor:"middle" }),

    // REST vs gRPC table rows
    ...[
      ["Transport",   "HTTP/1.1",          "HTTP/2"],
      ["Format",      "JSON (text)",        "Protobuf (binary)"],
      ["Schema",      "Optional (OpenAPI)", "Required (.proto)"],
      ["Streaming",   "Workarounds",        "Native 4 types"],
      ["Code gen",    "Manual clients",     "protoc generates stubs"],
      ["Perf",        "Higher overhead",    "~10x smaller payload"],
    ].flatMap(([k,a,b], i) => [
      lbl(`cmp_k${i}`, 70,  108 + i*36, k, {sub:true, anchor:"start"}),
      lbl(`cmp_a${i}`, 320, 108 + i*36, a, {sub:true, anchor:"middle"}),
      lbl(`cmp_b${i}`, 840, 108 + i*36, b, {sub:true, anchor:"middle"}),
    ]),

    // ── Proto file (step 3) ──
    box("proto_bg", MX-180, 110, 360, 360, null, "var(--panel)", "var(--accent-2)"),
    lbl("proto_ttl", MX, 134, "user.proto", { mono:true }),
    ...([
      'syntax = "proto3";',
      '',
      'message User {',
      '  uint64 id    = 1;',
      '  string name  = 2;',
      '  string email = 3;',
      '}',
      '',
      'service UserService {',
      '  rpc GetUser(UserReq)',
      '    returns (User);',
      '  rpc ListUsers(ListReq)',
      '    returns (stream User);',
      '}',
    ].map((line, i) => lbl(`proto_l${i}`, MX-165, 158 + i*19, line, {sub:true, mono:true, anchor:"start"}))),

    // ── protoc arrows (step 4) ──
    arr("gen_cl", MX-180, 300, CX+160, 300, "var(--accent)"),
    lbl("gen_cl_l", (MX-180+CX+160)/2, 287, "client stub", {sub:true, mono:true, anchor:"middle"}),
    arr("gen_sv", MX+180, 300, SX-160, 300, "var(--good)"),
    lbl("gen_sv_l", (MX+180+SX-160)/2, 287, "server interface", {sub:true, mono:true, anchor:"middle"}),
    box("protoc_btn", MX-50, 270, 100, 36, "protoc", "#102212", "var(--good)"),

    // ── Client + Stub box ──
    box("client_bg", 20, 330, 280, 260, null, "var(--panel)", "var(--accent)"),
    lbl("client_ttl", 160, 352, "Client App"),
    box("stub_box", 40, 370, 240, 44, "Generated Stub", "var(--panel-2)", "var(--accent)"),
    lbl("stub_detail", 160, 438, "stub.GetUser(req)", {sub:true, mono:true}),
    lbl("stub_detail2", 160, 458, "→ marshals to protobuf", {sub:true, mono:true}),
    lbl("stub_detail3", 160, 478, "→ sends via HTTP/2", {sub:true, mono:true}),

    // ── Server + Skeleton box ──
    box("server_bg", SX-150, 330, 280, 260, null, "var(--panel)", "var(--good)"),
    lbl("server_ttl", SX+10, 352, "Server"),
    box("skel_box", SX-130, 370, 240, 44, "Generated Interface", "var(--panel-2)", "var(--good)"),
    lbl("skel_detail", SX+10, 438, "impl GetUser(ctx, req)", {sub:true, mono:true}),
    lbl("skel_detail2", SX+10, 458, "→ business logic", {sub:true, mono:true}),
    lbl("skel_detail3", SX+10, 478, "→ returns User object", {sub:true, mono:true}),

    // ── HTTP/2 transport layer ──
    box("h2_bg", MX-120, 330, 240, 90, ["HTTP/2 Transport", "Binary · Multiplexed · Streams"], "#112318", "var(--warn)"),
    lbl("h2_sub1", MX, 445, "HPACK header compression", {sub:true, mono:true}),
    lbl("h2_sub2", MX, 463, "Multiple streams per connection", {sub:true, mono:true}),

    // ── RPC flow arrows ──
    ...msg("rpc_req", CX+160, MX-120, 380, "Unary Request (bytes)", "var(--accent)"),
    ...msg("rpc_res", MX+120, SX-150, 380, "Response (bytes)", "var(--good)"),
    ...msg("rpc_ss1", MX+120, SX-150, 490, "stream req →", "var(--accent-2)"),
    ...msg("rpc_ss2", SX-150, MX-120, 535, "← User 1", "var(--good)"),
    ...msg("rpc_ss3", SX-150, MX-120, 565, "← User 2", "var(--good)"),
    ...msg("rpc_ss4", SX-150, MX-120, 595, "← User 3  END_STREAM", "var(--good)"),

    // ── 4 RPC types diagram ──
    box("types_bg", 30, 490, 590, 210, null, "var(--panel)", "var(--line)"),
    lbl("types_ttl", 325, 510, "4 RPC Types"),
    ...[
      ["Unary",           "req → res",          "var(--accent)"],
      ["Server Stream",   "req → res res res…",  "var(--good)"],
      ["Client Stream",   "req req req… → res",  "var(--accent-2)"],
      ["Bidirectional",   "req↔res (async)",     "var(--warn)"],
    ].flatMap(([name, flow, color], i) => [
      lbl(`type_n${i}`, 60,  540 + i*40, name, {sub:false, anchor:"start"}),
      lbl(`type_f${i}`, 330, 540 + i*40, flow, {sub:true, mono:true, anchor:"middle"}),
    ]),

    // ── Interceptors (step 11) ──
    box("icp_bg", MX-160, 490, 320, 130, null, "var(--panel-2)", "var(--accent-2)"),
    lbl("icp_ttl", MX, 510, "Interceptors (Middleware)"),
    lbl("icp_1", MX, 540, "• Auth (verify token)", {sub:true, anchor:"middle"}),
    lbl("icp_2", MX, 562, "• Logging + Tracing", {sub:true, anchor:"middle"}),
    lbl("icp_3", MX, 584, "• Retry + Deadline", {sub:true, anchor:"middle"}),
    lbl("icp_4", MX, 606, "• Metrics (latency, errors)", {sub:true, anchor:"middle"}),

    // ── When to use (step 12) ──
    box("use_bg", 20, 530, 590, 170, null, "var(--panel-2)", "var(--line)"),
    lbl("use_ttl", 305, 552, "gRPC vs REST vs GraphQL"),
    ...[
      ["gRPC",    "Internal microservices, streaming, performance-critical"],
      ["REST",    "Public APIs, browser clients, CRUD, simple tooling"],
      ["GraphQL", "Client-driven queries, aggregating multiple sources"],
    ].flatMap(([name, desc], i) => [
      lbl(`use_n${i}`, 40,  582 + i*36, name, {anchor:"start"}),
      lbl(`use_d${i}`, 130, 582 + i*36, desc, {sub:true, anchor:"start"}),
    ]),
  ];

  const ALL_IDS = elements.map(e => e.id);

  const steps = [
    {
      title: "REST: O Status Quo",
      show: ["rest_box","grpc_box","vs_lbl",
             ...Array.from({length:6}, (_,i) => [`cmp_k${i}`,`cmp_a${i}`]).flat()],
      balloon: {
        anchor: "rest_box", placement: "bottom",
        text: "REST sobre HTTP/1.1 com JSON é a escolha default para APIs. Flexível e ubíquo — mas <strong>verboso</strong> (headers repetidos, JSON text parsing) e sem tipagem forte em runtime.",
        why: "Um payload JSON típico de 1KB pode se tornar 100 bytes em Protobuf. Em alta frequência (telemetria, IoT, microserviços internos) isso importa.",
        deep: `<p>REST não define um formato de payload obrigatório, mas na prática quase sempre significa JSON sobre HTTP/1.1: texto legível por humanos, fácil de debugar no navegador, mas caro de fazer parse e volumoso na rede — cada chave do objeto se repete em toda resposta.</p>
<div class="xp-example"><strong>Payload JSON típico</strong>{
  "id": 42,
  "name": "Alice Silva",
  "email": "alice@exemplo.com"
}
// ~70 bytes, sem contar headers HTTP</div>
<p>Sem um schema obrigatório, o contrato entre cliente e servidor normalmente vive em documentação separada (OpenAPI/Swagger) que pode ficar desatualizada — nada impede o servidor de mudar um campo sem avisar o cliente em tempo de compilação.</p>`
      }
    },
    {
      title: "gRPC: Schema-first com Protocol Buffers",
      show: ["rest_box","grpc_box","vs_lbl",
             ...Array.from({length:6}, (_,i) => [`cmp_k${i}`,`cmp_a${i}`,`cmp_b${i}`]).flat()],
      highlight: ["grpc_box"],
      balloon: {
        anchor: "grpc_box", placement: "bottom",
        text: "gRPC usa <strong>Protocol Buffers</strong> (.proto) como IDL (Interface Definition Language). Dados são serializados em binário — menor payload e mais rápido que JSON text parsing.",
        why: "Protobuf numera cada campo — isso permite evoluir a API sem quebrar compatibilidade. Adicionar campo novo com número novo é backward-compatible.",
        deep: `<p>Protobuf serializa cada campo como um par (número do campo + tipo + valor) em binário, sem repetir nomes de chave como o JSON faz. Isso reduz drasticamente o tamanho do payload e a CPU gasta fazendo parsing.</p>
<div class="xp-example"><strong>Mesmo dado em Protobuf (bytes, simplificado)</strong>campo 1 (id):    varint  42
campo 2 (name):   string  "Alice Silva"
campo 3 (email):  string  "alice@exemplo.com"
// binário compacto, sem nomes de chave repetidos</div>
<h4>Trade-off</h4>
<ul>
<li><strong>Protobuf</strong> — menor, mais rápido, tipado; mas não é legível a olho nu (precisa do .proto para decodificar)</li>
<li><strong>JSON</strong> — legível, sem ferramenta extra; mas maior e sem tipagem forte</li>
</ul>`
      }
    },
    {
      title: "O arquivo .proto: Contrato da API",
      show: ["proto_bg","proto_ttl",
             ...Array.from({length:14}, (_,i) => `proto_l${i}`)],
      balloon: {
        anchor: { x: MX, y: 480 }, placement: "bottom",
        text: "O <code>.proto</code> define <strong>Messages</strong> (estruturas de dados) e <strong>Services</strong> (RPCs). Cada campo tem um <em>número</em> único (não o nome) — isso garante compatibilidade binária entre versões.",
        why: "O contrato fica no repositório e é a fonte de verdade. Qualquer alteração incompatível quebra o build — não surpresas em runtime.",
        deep: `<p>O número do campo (não o nome) é o que realmente viaja no binário — por isso renomear um campo no .proto não quebra compatibilidade, mas reutilizar um número já usado antes quebra silenciosamente clientes antigos.</p>
<div class="xp-good"><strong>Evolução compatível</strong>Adicionar <code>string phone = 4;</code> — clientes antigos ignoram o campo novo; clientes novos leem normal.</div>
<div class="xp-bad"><strong>Quebra compatibilidade</strong>Reaproveitar o número <code>2</code> para um campo diferente — clientes antigos decodificam o valor errado sem erro nenhum, silenciosamente.</div>
<p>Por isso times sérios com Protobuf costumam marcar campos removidos como <code>reserved</code> em vez de simplesmente apagar a linha, evitando que alguém reuse o número por engano no futuro.</p>`
      }
    },
    {
      title: "protoc: Gerando Código Automaticamente",
      show: ["proto_bg","proto_ttl", ...Array.from({length:14}, (_,i) => `proto_l${i}`),
             "protoc_btn","gen_cl","gen_cl_l","gen_sv","gen_sv_l",
             "client_bg","client_ttl","stub_box","skel_box","server_bg","server_ttl"],
      balloon: {
        anchor: "protoc_btn", placement: "bottom",
        text: "<code>protoc --go_out=. user.proto</code> gera: <strong>client stub</strong> (faz chamada como função local) e <strong>server interface</strong> (que o dev implementa). Suporta 10+ linguagens.",
        why: "Zero código de serialização manual. A camada de transporte é gerada — o dev foca 100% na lógica de negócio.",
        deep: `<p>O protoc não gera só a serialização — ele gera classes completas de request/response, um cliente com métodos que parecem chamadas de função local, e a interface que o servidor precisa implementar (o "esqueleto"). Suporta dezenas de linguagens via plugins.</p>
<div class="xp-example"><strong>Comando típico</strong>protoc --go_out=. --go-grpc_out=. user.proto

# gera:
#   user.pb.go       (structs + serialização)
#   user_grpc.pb.go  (client stub + server interface)</div>
<p>Esse código gerado normalmente entra no controle de versão (ou é gerado no CI) — assim, mudar o .proto e recompilar já avisa em tempo de build sobre qualquer lugar que dependa de um campo removido, em vez de falhar só em runtime.</p>`
      },
      enter(ctx) {
        ctx.drawArrow("gen_cl");
        setTimeout(() => ctx.drawArrow("gen_sv"), 300);
      }
    },
    {
      title: "HTTP/2: O Transporte",
      show: ["client_bg","client_ttl","stub_box","stub_detail","stub_detail2","stub_detail3",
             "h2_bg","h2_sub1","h2_sub2",
             "server_bg","server_ttl","skel_box","skel_detail","skel_detail2","skel_detail3"],
      highlight: ["h2_bg"],
      balloon: {
        anchor: "h2_bg", placement: "bottom",
        text: "<strong>HTTP/2</strong> sob o gRPC: <br>• <em>Multiplexing</em>: múltiplas RPCs na mesma conexão TCP <br>• <em>HPACK</em>: compressão de headers (economiza ~80% em headers repetidos) <br>• <em>Binary frames</em>: mais eficiente que HTTP/1.1 text",
        why: "HTTP/1.1 exige uma conexão TCP por request simultânea (ou pipelining limitado). HTTP/2 resolve isso com streams numerados numa única conexão.",
        deep: `<p>HTTP/1.1 permite só uma requisição pendente por conexão sem pipelining real — por isso browsers e clientes abrem várias conexões TCP em paralelo. HTTP/2 resolve isso multiplexando várias "streams" lógicas dentro de uma única conexão TCP.</p>
<div class="xp-example"><strong>Multiplexing (simplificado)</strong>1 conexão TCP:
  stream 1 → GetUser(42)     [em andamento]
  stream 3 → ListUsers()     [em andamento]
  stream 5 → CreateUser(...) [em andamento]
  (tudo intercalado nos mesmos bytes TCP)</div>
<p>O HPACK comprime headers reaproveitando um dicionário compartilhado entre requisições da mesma conexão — depois da primeira chamada, headers repetidos (como <code>authorization</code>) custam poucos bytes nas próximas.</p>`
      }
    },
    {
      title: "Unary RPC: Request → Response",
      show: ["client_bg","client_ttl","stub_box",
             "h2_bg",
             "server_bg","server_ttl","skel_box",
             "rpc_req","rpc_req_l","rpc_res","rpc_res_l"],
      balloon: {
        anchor: { x: MX, y: 395 }, placement: "bottom",
        text: "<strong>Unary RPC</strong>: 1 request, 1 response — o equivalente de uma chamada REST. Ex: <code>GetUser(id: 42)</code> → <code>User{id:42, name:\"Alice\"}</code>.",
        why: "Mesmo sendo 'igual ao REST' funcionalmente, a Unary RPC já ganha em payload (protobuf binário) e headers (HTTP/2 HPACK).",
        deep: `<p>Do ponto de vista do código do cliente, uma Unary RPC parece uma chamada de função comum — o stub gerado esconde toda a serialização e a rede por trás de uma assinatura tipada.</p>
<div class="xp-example"><strong>Cliente (pseudocódigo Go)</strong>resp, err := client.GetUser(ctx, &UserReq{Id: 42})
if err != nil { ... }
fmt.Println(resp.Name)  // "Alice Silva"</div>
<p>Por trás dessa chamada: o stub serializa <code>UserReq</code> em Protobuf, abre um stream HTTP/2, envia os bytes, espera a resposta, desserializa em <code>User</code> e devolve — tudo isso é código gerado, não escrito à mão.</p>`
      },
      enter(ctx) { ctx.drawArrow("rpc_req"); setTimeout(() => ctx.drawArrow("rpc_res"), 400); }
    },
    {
      title: "Server Streaming: 1 Request → N Responses",
      show: ["client_bg","client_ttl","stub_box",
             "h2_bg",
             "server_bg","server_ttl","skel_box",
             "rpc_ss1","rpc_ss1_l","rpc_ss2","rpc_ss2_l","rpc_ss3","rpc_ss3_l","rpc_ss4","rpc_ss4_l"],
      balloon: {
        anchor: { x: MX, y: 560 }, placement: "top",
        text: "<strong>Server Streaming</strong>: cliente envia 1 request, servidor responde com <em>N mensagens</em> no mesmo stream HTTP/2. Útil para: paginação de resultados grandes, feed de eventos, progresso de processamento.",
        why: "Sem server streaming, o cliente precisaria fazer múltiplas requisições ou receber tudo de uma vez (payload gigante). Com streaming, começa a processar na primeira mensagem.",
        deep: `<p>Server streaming reaproveita o mesmo stream HTTP/2 para várias mensagens: o servidor escreve um <code>User</code> por vez assim que fica pronto, sem esperar montar a lista inteira em memória antes de responder.</p>
<div class="xp-example"><strong>Cliente consumindo o stream (pseudocódigo)</strong>stream, _ := client.ListUsers(ctx, &ListReq{})
for {
  user, err := stream.Recv()
  if err == io.EOF { break }  // END_STREAM
  fmt.Println(user.Name)
}</div>
<p>O frame <code>END_STREAM</code> do HTTP/2 marca o fim do streaming — não existe um "tamanho total" anunciado de antemão como em REST paginado; o cliente processa mensagem a mensagem até a stream fechar.</p>`
      },
      enter(ctx) {
        ctx.drawArrow("rpc_ss1");
        [300,600,900].forEach((d, i) => setTimeout(() => ctx.drawArrow(["rpc_ss2","rpc_ss3","rpc_ss4"][i]), d));
      }
    },
    {
      title: "Client Streaming e Bidirectional",
      show: ["types_bg","types_ttl",
             ...Array.from({length:4}, (_,i) => [`type_n${i}`,`type_f${i}`]).flat()],
      balloon: {
        anchor: { x: 325, y: 510 }, placement: "bottom",
        text: "<strong>Client Streaming</strong>: cliente envia múltiplas mensagens, servidor responde ao final (ex: upload, aggregation). <strong>Bidirectional</strong>: ambos enviam quando quiserem — full-duplex como WebSocket, mas com RPC semantics.",
        why: "Bidirectional streaming é raro mas poderoso: telemetria em tempo real, chat de microserviços, jogos multiplayer."
      }
    },
    {
      title: "Status Codes, Metadata e Deadlines",
      show: ["h2_bg","h2_sub1","h2_sub2",
             "client_bg","client_ttl","stub_box",
             "server_bg","server_ttl","skel_box"],
      balloon: {
        anchor: "h2_bg", placement: "bottom",
        text: "<strong>Status</strong>: 16 códigos padrão (OK, NOT_FOUND, UNAVAILABLE, DEADLINE_EXCEEDED…). <strong>Metadata</strong>: key-value headers (auth token, trace-id). <strong>Deadlines</strong>: timeout propagado para toda a cadeia de chamadas.",
        why: "Deadlines são melhores que timeouts locais: se o cliente desiste, o servidor downstream também sabe desistir, economizando recursos no sistema inteiro."
      }
    },
    {
      title: "Interceptors: Middleware no gRPC",
      show: ["icp_bg","icp_ttl","icp_1","icp_2","icp_3","icp_4",
             "client_bg","client_ttl","server_bg","server_ttl"],
      balloon: {
        anchor: "icp_bg", placement: "top",
        text: "<strong>Interceptors</strong> são executados antes/depois de cada RPC: autenticação (verificar Bearer token), logging estruturado, distributed tracing, retry com backoff exponencial.",
        why: "Separa concerns de infraestrutura da lógica de negócio. Um interceptor de auth centralizado elimina verificações duplicadas em cada método."
      }
    },
    {
      title: "Quando usar gRPC vs REST vs GraphQL",
      show: ["use_bg","use_ttl",
             ...Array.from({length:3}, (_,i) => [`use_n${i}`,`use_d${i}`]).flat()],
      balloon: {
        anchor: { x: 305, y: 640 }, placement: "top",
        text: "<strong>gRPC</strong>: microserviços internos, alta performance, streaming. <strong>REST</strong>: APIs públicas, browser direto, simplicidade. <strong>GraphQL</strong>: clientes com necessidades diferentes de dados.",
        why: "gRPC exige que o cliente entenda Protobuf e HTTP/2 — browsers não suportam nativamente. grpc-web é uma proxy workaround. Para APIs públicas, REST ainda vence em adoção."
      }
    },
    {
      title: "Quiz",
      balloon: { anchor: { x: 640, y: 360 }, placement: "bottom", text: "Teste seu conhecimento sobre gRPC:" },
      quiz: {
        question: "Por que gRPC usa HTTP/2 como transporte e qual o benefício principal?",
        options: [
          "HTTP/2 é obrigatório pela especificação Protobuf para garantir a ordem dos bytes",
          "HTTP/2 permite multiplexing — múltiplas RPCs simultâneas numa única conexão TCP",
          "HTTP/2 criptografa automaticamente o payload Protobuf com TLS",
          "HTTP/2 converte binário Protobuf para JSON para compatibilidade com browsers"
        ],
        answer: 1,
        explain: "HTTP/2 streams permitem que várias RPCs rodem em paralelo na mesma conexão TCP sem head-of-line blocking. Isso reduz latência e overhead de handshake. gRPC sobre HTTP/1.1 não suporta streaming bidirectional."
      }
    },
    {
      title: "Resumo",
      show: ["rest_box","grpc_box","vs_lbl",
             "proto_bg","proto_ttl","proto_l0","proto_l1",
             "client_bg","client_ttl","stub_box",
             "h2_bg",
             "server_bg","server_ttl","skel_box",
             "types_bg","types_ttl",
             ...Array.from({length:4}, (_,i) => [`type_n${i}`,`type_f${i}`]).flat()],
      balloon: {
        anchor: { x: MX, y: 400 }, placement: "right",
        text: "<strong>gRPC</strong> = Protobuf (.proto schema) + HTTP/2 (streaming, multiplexing) + code generation (stubs). 4 tipos de RPC: Unary, Server Stream, Client Stream, Bidirectional. Interceptors para cross-cutting concerns.",
        why: "Use gRPC em microsserviços internos onde performance e contratos fortes importam. Expose REST ou GraphQL para clientes externos."
      }
    }
  ];

  window.GRPC_DIAGRAM = {
    title: "gRPC",
    subtitle: "Protocol Buffers · HTTP/2 · 4 RPC Types · Code Generation",
    width: W, height: H, autoplayMs: 9000, elements, steps,
  };
})();
