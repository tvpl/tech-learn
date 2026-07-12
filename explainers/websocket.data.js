(function () {
  const W = 1280, H = 720;

  // ── Layout ────────────────────────────────────────────────────────────────
  // Left panel: sequence diagram (Client | Server lifelines)
  // Right panel: frame anatomy zoom

  const CX = 200, SX = 680;          // lifeline X centres
  const LY = 60;                      // lifeline header Y
  const LH = 620;                     // lifeline height
  const FX = 820, FW = 420, FY = 80; // frame detail zone

  // helper: horizontal arrow message between lifelines
  const msg = (id, fromX, toX, y, label, color) => [
    { id, type: "arrow", x1: fromX + 16, y1: y, x2: toX - 16, y2: y,
      color: color || "var(--accent)" },
    { id: id + "_l", type: "label", x: (fromX + toX) / 2, y: y - 13,
      anchor: "middle", sub: true, mono: true, label },
  ];

  const elements = [
    // ── Lifelines ──
    { id: "lbl_c", type: "box", x: CX - 60, y: LY, w: 120, h: 44, rx: 8,
      fill: "var(--panel-2)", stroke: "var(--accent)", label: "🖥️  Client" },
    { id: "lbl_s", type: "box", x: SX - 60, y: LY, w: 120, h: 44, rx: 8,
      fill: "var(--panel-2)", stroke: "var(--good)", label: "☁️  Server" },
    { id: "life_c", type: "arrow", x1: CX, y1: LY + 44, x2: CX, y2: LY + LH,
      noHead: true, dashed: true, color: "var(--accent)" },
    { id: "life_s", type: "arrow", x1: SX, y1: LY + 44, x2: SX, y2: LY + LH,
      noHead: true, dashed: true, color: "var(--good)" },

    // ── HTTP Polling (step 2 — long polling) ──
    { id: "poll1",  type: "label", x: CX - 80, y: 180, anchor: "end", sub: true, label: "GET /updates" },
    { id: "poll1a", type: "arrow", x1: CX + 16, y1: 175, x2: SX - 16, y2: 175, color: "var(--muted)" },
    { id: "poll1b", type: "label", x: (CX+SX)/2, y: 162, anchor: "middle", sub: true, mono: true, label: "GET /updates (long-polling)" },
    { id: "poll2",  type: "arrow", x1: SX - 16, y1: 230, x2: CX + 16, y2: 230, color: "var(--muted)" },
    { id: "poll2b", type: "label", x: (CX+SX)/2, y: 217, anchor: "middle", sub: true, mono: true, label: "⏱  wait 30s → 200 OK (maybe)" },
    { id: "poll3",  type: "arrow", x1: CX + 16, y1: 280, x2: SX - 16, y2: 280, color: "var(--muted)" },
    { id: "poll3b", type: "label", x: (CX+SX)/2, y: 267, anchor: "middle", sub: true, mono: true, label: "GET /updates again…" },
    { id: "poll_lbl", type: "token", x: CX - 80, y: 295, w: 180, h: 36,
      fill: "#3a1010", stroke: "var(--hot)", label: "🔁  Polling loop — overhead!" },

    // ── Handshake (step 4) ──
    ...msg("hs1", CX, SX, 175, "GET /chat HTTP/1.1↵Upgrade: websocket↵Sec-WS-Key: …", "var(--warn)"),
    ...msg("hs2", SX, CX, 250, "101 Switching Protocols↵Sec-WS-Accept: …", "var(--good)"),
    { id: "hs_badge", type: "token", x: (CX+SX)/2 - 100, y: 268, w: 200, h: 32,
      fill: "#102212", stroke: "var(--good)", label: "✓ Upgraded — TCP reused" },

    // ── Full-duplex messages (steps 5-8) ──
    ...msg("m_cs1", CX, SX, 330, "\"Hello from client\"  [text frame]", "var(--accent)"),
    ...msg("m_sc1", SX, CX, 390, "\"Hello from server\"  [text frame]", "var(--good)"),
    ...msg("m_cs2", CX, SX, 450, "\"binary data…\"  [binary frame]", "var(--accent-2)"),
    { id: "bc1",  type: "arrow", x1: SX + 16, y1: 450, x2: SX + 90, y2: 450, color: "var(--good)" },
    { id: "bc1l", type: "label", x: SX + 55, y: 437, anchor: "middle", sub: true, mono: true, label: "client2" },
    { id: "bc2",  type: "arrow", x1: SX + 16, y1: 475, x2: SX + 90, y2: 475, color: "var(--good)" },
    { id: "bc2l", type: "label", x: SX + 55, y: 462, anchor: "middle", sub: true, mono: true, label: "client3" },

    // ── Ping/pong (step 10) ──
    ...msg("ping1", CX, SX, 510, "PING (0x9)", "var(--warn)"),
    ...msg("pong1", SX, CX, 555, "PONG (0xA)", "var(--warn)"),

    // ── Close (step 11) ──
    ...msg("cls1", CX, SX, 590, "CLOSE (0x8) code=1000 Normal", "var(--hot)"),
    ...msg("cls2", SX, CX, 630, "CLOSE (0x8) echo", "var(--hot)"),

    // ── Frame anatomy zone (right panel) ──
    { id: "fr_bg",  type: "box", x: FX - 10, y: FY, w: FW + 20, h: 500, rx: 12,
      fill: "var(--panel)", stroke: "var(--line)" },
    { id: "fr_ttl", type: "label", x: FX + FW/2, y: FY + 22, anchor: "middle",
      label: "WebSocket Frame Anatomy" },

    // FIN + RSV + Opcode byte
    { id: "fr_r1",  type: "box", x: FX, y: FY + 50, w: 50, h: 40, rx: 4,
      fill: "#102212", stroke: "var(--good)", label: "FIN" },
    { id: "fr_r2",  type: "box", x: FX + 55, y: FY + 50, w: 90, h: 40, rx: 4,
      fill: "var(--panel-2)", stroke: "var(--line)", label: "RSV 1-3" },
    { id: "fr_r3",  type: "box", x: FX + 150, y: FY + 50, w: 140, h: 40, rx: 4,
      fill: "#1a1033", stroke: "var(--accent-2)", label: "Opcode (4b)" },
    { id: "fr_r3l", type: "label", x: FX + 150, y: FY + 108, sub: true,
      label: "0x1=text 0x2=bin 0x8=close 0x9=ping" },
    { id: "fr_r4",  type: "box", x: FX + 300, y: FY + 50, w: 110, h: 40, rx: 4,
      fill: "#1a1010", stroke: "var(--warn)", label: "MASK bit" },
    { id: "fr_r4l", type: "label", x: FX + 300, y: FY + 108, sub: true,
      label: "1 = client→server" },

    // Payload length
    { id: "fr_r5",  type: "box", x: FX, y: FY + 130, w: 200, h: 40, rx: 4,
      fill: "var(--panel-2)", stroke: "var(--accent)", label: "Payload Len (7b)" },
    { id: "fr_r5l", type: "label", x: FX, y: FY + 188, sub: true,
      label: "≤125 → inline  126 → next 2B  127 → next 8B" },

    // Masking key
    { id: "fr_r6",  type: "box", x: FX + 210, y: FY + 130, w: 200, h: 40, rx: 4,
      fill: "#1a1010", stroke: "var(--warn)", label: "Masking Key (32b)" },
    { id: "fr_r6l", type: "label", x: FX + 210, y: FY + 188, sub: true,
      label: "XOR applied when MASK=1" },

    // Payload
    { id: "fr_r7",  type: "box", x: FX, y: FY + 210, w: FW, h: 60, rx: 4,
      fill: "#112318", stroke: "var(--good)", label: ["Payload Data", "(0 to 2⁶³ bytes)"] },

    // Comparison table
    { id: "cmp_bg",  type: "box", x: FX - 10, y: FY + 290, w: FW + 20, h: 195, rx: 8,
      fill: "var(--panel-2)", stroke: "var(--line)" },
    { id: "cmp_ttl", type: "label", x: FX + FW/2, y: FY + 312, anchor: "middle",
      label: "WS vs SSE vs HTTP/2 Push" },
    ...[
      ["Protocol",   "WebSocket",  "SSE",     "HTTP/2 Push"],
      ["Direction",  "Full-duplex","S→C only","S→C only"],
      ["Protocol",   "ws:// wss://","HTTP/1.1+","HTTP/2"],
      ["Binary",     "✓ native",   "text only","✓ frames"],
      ["Best for",   "chat, games","live feed","page assets"],
    ].flatMap(([k, a, b, c], i) => [
      { id: `cmp_${i}k`, type: "label", x: FX,        y: FY + 340 + i * 26, sub: true, mono: false, label: k },
      { id: `cmp_${i}a`, type: "label", x: FX + 150,  y: FY + 340 + i * 26, sub: true, anchor: "middle", label: a },
      { id: `cmp_${i}b`, type: "label", x: FX + 270,  y: FY + 340 + i * 26, sub: true, anchor: "middle", label: b },
      { id: `cmp_${i}c`, type: "label", x: FX + 370,  y: FY + 340 + i * 26, sub: true, anchor: "middle", label: c },
    ]),
  ];

  const ALL_IDS = elements.map(e => e.id);

  const steps = [
    {
      title: "O Problema: HTTP não serve para Real-time",
      show: ["lbl_c", "lbl_s", "life_c", "life_s"],
      highlight: [],
      balloon: {
        anchor: { x: 440, y: 200 }, placement: "right",
        text: "HTTP é <strong>request-response</strong>: o servidor só responde quando o cliente pergunta. Para chat, jogos ou dashboards ao vivo, precisamos que o servidor envie dados <em>a qualquer momento</em>.",
        why: "Cada requisição HTTP cria nova conexão TCP (ou reutiliza via keep-alive), mas o servidor nunca inicia a comunicação — o cliente sempre puxa.",
        deep: `<p>Numa API REST tradicional, toda troca de dados nasce de uma pergunta do cliente: o servidor nunca fala primeiro. Isso funciona bem para páginas estáticas, mas fica caro quando o servidor precisa avisar o cliente de algo que aconteceu — uma nova mensagem, um preço que mudou, a jogada de outro jogador.</p>
<div class="xp-example"><strong>Sem canal persistente</strong>Cliente: "Tem mensagem nova?" → Servidor: "Não"
Cliente: "Tem mensagem nova?" → Servidor: "Não"
Cliente: "Tem mensagem nova?" → Servidor: "Sim! ..."</div>
<p>Cada pergunta é uma requisição HTTP nova, com seus próprios headers e (se TLS) potencial overhead de handshake — desperdício quando a resposta é "não" na maior parte do tempo.</p>`
      }
    },
    {
      title: "Long-Polling: A Gambiarra",
      show: ["lbl_c", "lbl_s", "life_c", "life_s",
             "poll1", "poll1a", "poll1b", "poll2", "poll2b", "poll3", "poll3b", "poll_lbl"],
      balloon: {
        anchor: { x: 440, y: 230 }, placement: "right",
        text: "Long-polling: o cliente faz GET e o servidor <strong>segura a conexão aberta</strong> até ter algo para responder. Quando responde, o cliente abre outra conexão imediatamente.",
        why: "Funciona, mas desperdiça threads no servidor, tem latência de reconexão e explode em escala. Não é uma solução, é uma adaptação.",
        deep: `<p>Long-polling melhora o polling comum (perguntar a cada N segundos) ao segurar a conexão aberta até haver algo para responder — reduz requisições vazias, mas ainda reabre uma conexão HTTP inteira a cada ciclo, com os mesmos headers repetidos.</p>
<div class="xp-example"><strong>Ciclo de long-polling</strong>GET /updates HTTP/1.1
Host: chat.exemplo.com
Cookie: sessionid=abc123
(conexão fica aberta até 30s...)
→ 200 OK { "msg": "oi" }
(cliente reabre imediatamente)</div>
<div class="xp-bad"><strong>Custo</strong>Cada ciclo consome uma thread/worker no servidor esperando, mesmo sem dado novo — não escala bem com muitos clientes simultâneos.</div>`
      }
    },
    {
      title: "WebSocket: Full-Duplex Persistente",
      show: ["lbl_c", "lbl_s", "life_c", "life_s"],
      highlight: ["lbl_c", "lbl_s"],
      balloon: {
        anchor: { x: 440, y: 200 }, placement: "right",
        text: "WebSocket estabelece um <strong>canal TCP persistente e bidirecional</strong>. Depois do handshake inicial, tanto cliente quanto servidor podem enviar mensagens a qualquer momento, sem overhead de headers HTTP.",
        why: "TCP já é bidirecional — WebSocket apenas expõe isso na camada de aplicação com um protocolo de framing leve.",
        deep: `<p>WebSocket não inventa um transporte novo — ele reaproveita a mesma conexão TCP, que já é full-duplex, mas expõe isso à aplicação com um protocolo de enquadramento simples em vez de reabrir HTTP a cada mensagem.</p>
<div class="xp-good"><strong>WebSocket</strong>1 conexão TCP, aberta uma vez → mensagens nos dois sentidos a qualquer momento, com poucos bytes de overhead por frame</div>
<div class="xp-bad"><strong>Polling/long-polling</strong>1 conexão HTTP por ciclo → headers repetidos, latência de reconexão, mais carga no servidor</div>
<p>O protocolo é padronizado na RFC 6455 e usa os esquemas <code>ws://</code> (texto claro) e <code>wss://</code> (sobre TLS) — o equivalente do <code>http://</code>/<code>https://</code>.</p>`
      }
    },
    {
      title: "HTTP Upgrade Handshake (101)",
      show: ["lbl_c", "lbl_s", "life_c", "life_s", "hs1", "hs1_l", "hs2", "hs2_l", "hs_badge"],
      balloon: {
        anchor: { x: 440, y: 210 }, placement: "right",
        text: "<strong>O handshake começa como HTTP/1.1 GET</strong> com headers especiais:<br><code>Upgrade: websocket</code><br><code>Connection: Upgrade</code><br><code>Sec-WebSocket-Key: &lt;base64 random&gt;</code><br>Servidor responde <strong>101 Switching Protocols</strong>.",
        why: "Usar HTTP para negociar o upgrade permite atravessar proxies e firewalls que já entendem HTTP. A partir daí o protocolo muda para WebSocket frames.",
        deep: `<p>O truque do handshake é começar como uma requisição HTTP/1.1 GET perfeitamente normal — isso deixa o pedido atravessar proxies e firewalls corporativos que só entendem HTTP. Só depois da resposta 101 é que o significado dos bytes na conexão muda.</p>
<div class="xp-example"><strong>Requisição de upgrade</strong>GET /chat HTTP/1.1
Host: chat.exemplo.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13

HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=</div>
<p>O <code>Sec-WebSocket-Accept</code> é calculado a partir da <code>Sec-WebSocket-Key</code> concatenada com um GUID fixo da RFC e um hash SHA-1 — prova que o servidor de fato entendeu o pedido de upgrade.</p>`
      },
      enter(ctx) { ctx.drawArrow("hs1"); ctx.drawArrow("hs2"); }
    },
    {
      title: "Conexão Estabelecida — Canal Reutilizado",
      show: ["lbl_c", "lbl_s", "life_c", "life_s", "hs1", "hs1_l", "hs2", "hs2_l", "hs_badge"],
      balloon: {
        anchor: "hs_badge", placement: "right",
        text: "Após o 101, a <strong>mesma conexão TCP</strong> é reutilizada para o protocolo WebSocket. Não há mais overhead de cabeçalhos HTTP nem nova conexão a cada mensagem.",
        why: "O TCP three-way handshake (e TLS se wss://) foi feito uma única vez. Economiza ~100ms por mensagem em redes típicas.",
        deep: `<p>Nada na camada de transporte muda depois do 101 — é a mesma conexão TCP (e o mesmo canal TLS, se wss://), só que agora os bytes trocados seguem o formato de frame do WebSocket em vez de requisições/respostas HTTP.</p>
<div class="xp-example"><strong>O que já não se repete a cada mensagem</strong>❌ novo three-way handshake TCP
❌ novo TLS handshake
❌ headers HTTP completos (Host, Cookie, User-Agent...)</div>
<p>Isso é o que torna o WebSocket tão mais leve que HTTP polling para tráfego frequente: o custo de abrir a conexão é pago uma única vez, não a cada troca de dados.</p>`
      }
    },
    {
      title: "Anatomia do Frame WebSocket",
      show: ["lbl_c", "lbl_s", "life_c", "life_s", "hs_badge",
             "fr_bg", "fr_ttl", "fr_r1", "fr_r2", "fr_r3", "fr_r3l",
             "fr_r4", "fr_r4l", "fr_r5", "fr_r5l", "fr_r6", "fr_r6l", "fr_r7"],
      balloon: {
        anchor: { x: FX + FW/2, y: FY + 50 }, placement: "bottom",
        text: "<strong>FIN</strong>: último fragmento do msg. <strong>Opcode</strong>: tipo (text/binary/close/ping/pong). <strong>MASK</strong>: clientes mascariam payload (segurança contra proxies). <strong>Payload Len</strong>: tamanho variável.",
        why: "Frames são leves: header mínimo de 2 bytes (vs ~400 bytes em headers HTTP típicos). Ideal para mensagens frequentes e pequenas.",
        deep: `<p>O header de um frame WebSocket é minúsculo comparado a um request HTTP — é essa economia que faz o protocolo brilhar em troca de mensagens pequenas e frequentes (chat, jogos, telemetria).</p>
<div class="xp-example"><strong>Frame de texto simples ("oi", 2 bytes)</strong>Byte 1: FIN=1, RSV=000, Opcode=0001 (text)
Byte 2: MASK=1, Payload len=2
+ 4 bytes de masking key (se MASK=1)
+ 2 bytes de payload ("oi")
Total: 8 bytes de frame para 2 bytes de dado</div>
<p><strong>FIN=0</strong> indica que a mensagem continua num frame seguinte — permite enviar mensagens grandes fragmentadas sem esperar o payload inteiro estar pronto.</p>`
      },
      enter(ctx) {
        ["fr_r1","fr_r2","fr_r3","fr_r4","fr_r5","fr_r6","fr_r7"].forEach((id, k) =>
          setTimeout(() => ctx.show(id), k * 120));
      }
    },
    {
      title: "Cliente → Servidor: Mensagem de Texto",
      show: ["lbl_c", "lbl_s", "life_c", "life_s", "hs_badge",
             "fr_bg", "fr_ttl", "fr_r1","fr_r2","fr_r3","fr_r3l","fr_r4","fr_r4l","fr_r5","fr_r5l","fr_r6","fr_r6l","fr_r7",
             "m_cs1", "m_cs1_l"],
      balloon: {
        anchor: { x: (CX+SX)/2, y: 330 }, placement: "bottom",
        text: "<strong>Opcode 0x1</strong> (text frame). Payload é UTF-8. O bit MASK está ativado — cliente <em>deve</em> mascarar todos os frames enviados ao servidor (RFC 6455).",
        why: "A máscara (XOR com 32-bit key aleatória) evita que proxies transparentes cacheiem ou modifiquem dados WebSocket incorretamente.",
        deep: `<p>A máscara não é opcional para o cliente — é obrigatória pela RFC 6455. O servidor, ao contrário, nunca mascara seus frames. A assimetria existe porque o risco (proxy mal-intencionado interpretando bytes como uma requisição HTTP) só existe no sentido cliente→servidor.</p>
<div class="xp-example"><strong>Aplicando a máscara (XOR)</strong>payload original: 'A' = 0x41
masking key:      0x37, 0xFA, 0x21, 0x3D
byte mascarado:   0x41 XOR 0x37 = 0x76</div>
<p>O servidor faz o XOR inverso com a mesma chave (enviada no frame) para recuperar o payload original — é ofuscação contra proxies, não criptografia; a confidencialidade real vem do TLS (<code>wss://</code>).</p>`
      },
      enter(ctx) { ctx.drawArrow("m_cs1"); }
    },
    {
      title: "Servidor → Múltiplos Clientes (Broadcast)",
      show: ["lbl_c", "lbl_s", "life_c", "life_s", "hs_badge",
             "m_cs1", "m_cs1_l", "m_sc1", "m_sc1_l", "bc1", "bc1l", "bc2", "bc2l"],
      balloon: {
        anchor: { x: SX, y: 450 }, placement: "right",
        text: "O servidor pode fazer <strong>broadcast</strong>: enviar a mesma mensagem para múltiplas conexões WebSocket simultâneas. Frames do servidor para o cliente <em>não</em> são mascarados.",
        why: "Típico em chat: quando um usuário envia, o servidor redistribui para todos na mesma sala. O servidor mantém um registry de conexões ativas.",
        deep: `<p>WebSocket em si não tem noção de "salas" ou "broadcast" — é só uma conexão 1-para-1 entre cliente e servidor. Sistemas de chat implementam o broadcast na aplicação: o servidor mantém um mapa de conexões ativas e escreve a mesma mensagem em cada socket relevante.</p>
<div class="xp-example"><strong>Pseudocódigo de broadcast</strong>on_message(from_conn, msg):
  room = rooms[from_conn.room_id]
  for conn in room.connections:
    conn.send(msg)  # 1 frame por conexão</div>
<p>Em produção, esse registry de conexões geralmente vive num serviço compartilhado (Redis Pub/Sub, por exemplo) quando há múltiplas instâncias do servidor — cada instância só conhece os sockets que ela mesma aceitou.</p>`
      },
      enter(ctx) {
        ctx.drawArrow("m_sc1");
        setTimeout(() => { ctx.drawArrow("bc1"); ctx.drawArrow("bc2"); }, 300);
      }
    },
    {
      title: "Opcodes: Tipos de Frame",
      show: ["lbl_c", "lbl_s", "life_c", "life_s",
             "fr_bg", "fr_ttl", "fr_r3", "fr_r3l"],
      highlight: ["fr_r3"],
      balloon: {
        anchor: { x: FX + 220, y: FY + 70 }, placement: "bottom",
        text: "<strong>0x1</strong> Text (UTF-8) · <strong>0x2</strong> Binary (bytes livres) · <strong>0x8</strong> Close · <strong>0x9</strong> Ping · <strong>0xA</strong> Pong<br>Opcodes 0x3–0x7 e 0xB–0xF reservados para extensões futuras.",
        why: "Separar text de binary permite que implementações validem UTF-8 só quando necessário. Ping/pong são controle de conexão em nível de protocolo, não de aplicação.",
        deep: `<p>Opcodes de controle (0x8 close, 0x9 ping, 0xA pong) podem ser injetados <em>no meio</em> de uma mensagem fragmentada (text/binary com FIN=0) — a implementação precisa tratar frames de controle a qualquer momento, mesmo esperando o próximo fragmento de dados.</p>
<div class="xp-example"><strong>Opcode no primeiro byte do frame</strong>0x0  continuação de frame fragmentado
0x1  text  (payload deve ser UTF-8 válido)
0x2  binary (bytes livres, sem validação de charset)
0x8  close
0x9  ping
0xA  pong</div>
<p>Um payload <code>text</code> com UTF-8 inválido é motivo suficiente para o receptor fechar a conexão com código de erro — diferente de <code>binary</code>, que aceita qualquer sequência de bytes.</p>`
      }
    },
    {
      title: "Heartbeat: Ping / Pong",
      show: ["lbl_c", "lbl_s", "life_c", "life_s",
             "ping1", "ping1_l", "pong1", "pong1_l"],
      balloon: {
        anchor: { x: (CX+SX)/2, y: 530 }, placement: "bottom",
        text: "Cliente (ou servidor) envia <strong>PING</strong> periodicamente. O receptor <em>deve</em> responder com <strong>PONG</strong> imediatamente. Ausência de pong → conexão morta → fechar e reconectar.",
        why: "Conexões TCP podem ficar 'silenciosamente quebradas' por NATs e firewalls que expiram entradas idle. O heartbeat mantém o estado ativo.",
        deep: `<p>Sem heartbeat, uma conexão "morta" (cabo desconectado, celular perdeu sinal) pode continuar parecendo aberta para os dois lados por muito tempo — o TCP só percebe a queda quando tenta enviar dados e não recebe ACK, o que pode nunca acontecer se ninguém está enviando nada.</p>
<div class="xp-example"><strong>Ciclo típico de heartbeat</strong>a cada 30s: Cliente envia PING (0x9)
              Servidor responde PONG (0xA) na hora
se 2 PINGs seguidos sem PONG:
  considera a conexão morta → fecha e reconecta</div>
<p>Muitas bibliotecas de WebSocket (ws, socket.io) já implementam esse heartbeat automaticamente — mas em conexões atrás de load balancers com timeout de idle agressivo, é comum precisar configurar o intervalo manualmente.</p>`
      },
      enter(ctx) { ctx.drawArrow("ping1"); setTimeout(() => ctx.drawArrow("pong1"), 400); }
    },
    {
      title: "Close Handshake (Encerramento Gracioso)",
      show: ["lbl_c", "lbl_s", "life_c", "life_s",
             "ping1", "ping1_l", "pong1", "pong1_l",
             "cls1", "cls1_l", "cls2", "cls2_l"],
      balloon: {
        anchor: { x: (CX+SX)/2, y: 610 }, placement: "top",
        text: "Quem quer fechar envia <strong>close frame</strong> (opcode 0x8) com código de status. O receptor ecoa o close frame e então o TCP é finalizado. Códigos: 1000=normal, 1001=going away, 1002=protocol error.",
        why: "Diferente de TCP RST, o close handshake garante que ambos lados concordaram em encerrar e que todos os frames anteriores foram processados.",
        deep: `<p>Um close frame carrega, opcionalmente, um código de status de 2 bytes e uma razão em texto — isso permite diagnosticar por que a conexão terminou (o cliente pediu, houve erro de protocolo, o servidor está reiniciando).</p>
<div class="xp-example"><strong>Códigos de close comuns</strong>1000  Normal Closure     — encerramento esperado
1001  Going Away          — página fechando/servidor reiniciando
1002  Protocol Error      — frame malformado
1006  Abnormal Closure    — conexão caiu sem close frame (ex.: rede)
1008  Policy Violation    — ex.: mensagem viola regra da aplicação</div>
<p><strong>1006</strong> nunca aparece "na rede" — é um código sintético que a implementação cliente usa para indicar que a conexão caiu sem um close handshake apropriado, útil para acionar lógica de reconexão.</p>`
      },
      enter(ctx) { ctx.drawArrow("cls1"); setTimeout(() => ctx.drawArrow("cls2"), 400); }
    },
    {
      title: "WS vs SSE vs HTTP/2 Push",
      show: ["lbl_c", "lbl_s", "life_c", "life_s",
             "fr_bg", "fr_ttl",
             "cmp_bg", "cmp_ttl",
             ...Array.from({length:5}, (_,i) => [`cmp_${i}k`,`cmp_${i}a`,`cmp_${i}b`,`cmp_${i}c`]).flat()],
      balloon: {
        anchor: { x: FX + FW/2, y: FY + 310 }, placement: "top",
        text: "Use <strong>WebSocket</strong> para comunicação bidirecional (chat, games, colaboração). Use <strong>SSE</strong> para push simples server→client (dashboards, notificações). <strong>HTTP/2 Push</strong> é para recursos de página.",
        why: "SSE é mais simples de implementar e atravessa proxies HTTP com mais facilidade. WebSocket exige suporte explícito em load balancers e reverse proxies.",
        deep: `<p>A escolha entre os três normalmente se resolve por uma pergunta: quem precisa falar primeiro? Se só o servidor inicia envios, SSE é mais simples de operar (é HTTP puro, funciona com qualquer proxy). Se ambos os lados precisam iniciar mensagens livremente, WebSocket é a opção nativa para isso.</p>
<div class="xp-example"><strong>SSE (Server-Sent Events) — exemplo de resposta</strong>Content-Type: text/event-stream

data: {"preco": 105.20}

data: {"preco": 105.35}
</div>
<div class="xp-bad"><strong>HTTP/2 Server Push</strong> — pensado para empurrar recursos estáticos (CSS/JS) antes do pedido, não para eventos de aplicação; a maioria dos browsers descontinuou o suporte.</div>
<p>Regra prática: chat/colaboração/jogos → WebSocket; dashboards e notificações simples → SSE; recursos de página → deixe para HTTP/2 puro (sem Push).</p>`
      }
    },
    {
      title: "Quiz",
      balloon: { anchor: { x: 640, y: 360 }, placement: "bottom", text: "Teste seu conhecimento sobre WebSockets:" },
      quiz: {
        question: "Por que o cliente WebSocket DEVE mascarar todos os frames enviados ao servidor?",
        options: [
          "Para criptografar o conteúdo e garantir confidencialidade",
          "Para evitar que proxies transparentes cacheiem ou modifiquem dados WebSocket",
          "Porque o servidor não consegue processar frames não mascarados",
          "Para reduzir o tamanho do payload com uma forma de compressão"
        ],
        answer: 1,
        explain: "A máscara XOR (RFC 6455) protege contra proxies que, ao não reconhecer WebSocket, podem interpretar frames como requests HTTP e causar cache poisoning. Não provê confidencialidade — use wss:// (TLS) para isso."
      }
    },
    {
      title: "Resumo",
      show: ["lbl_c", "lbl_s", "life_c", "life_s",
             "hs1","hs1_l","hs2","hs2_l","hs_badge",
             "m_cs1","m_cs1_l","m_sc1","m_sc1_l",
             "ping1","ping1_l","pong1","pong1_l",
             "fr_bg","fr_ttl","fr_r3","fr_r3l"],
      highlight: ["lbl_c", "lbl_s"],
      balloon: {
        anchor: { x: 440, y: 400 }, placement: "right",
        text: "<strong>WebSocket</strong> = HTTP Upgrade 101 → canal TCP full-duplex. Frames leves com opcode, mask e payload. Heartbeat via ping/pong. Close gracioso com código de status.",
        why: "Escolha WebSocket quando o servidor precisa iniciar mensagens ao cliente com baixa latência. Caso contrário, SSE é mais simples e suficiente."
      }
    }
  ];

  window.WEBSOCKET_DIAGRAM = {
    title: "WebSockets",
    subtitle: "Full-duplex · Frames · Opcodes · Heartbeat · RFC 6455",
    width: W, height: H, autoplayMs: 9000, elements, steps,
  };
})();
