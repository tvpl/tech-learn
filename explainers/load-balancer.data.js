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

  /* ── Left: visual flow diagram ── */
  /* Clients */
  const clients = [
    { id: 'cli1', x: 20, y: 100 },
    { id: 'cli2', x: 20, y: 200 },
    { id: 'cli3', x: 20, y: 300 },
  ];
  const CLI_W = 90, CLI_H = 44;

  /* Load Balancer */
  const LBX = 200, LBY = 170, LBW = 130, LBH = 80;

  /* Servers */
  const servers = [
    { id: 'srv1', x: 420, y: 80,  label: '⚙️ Server 1', color: 'var(--good)' },
    { id: 'srv2', x: 420, y: 180, label: '⚙️ Server 2', color: 'var(--good)' },
    { id: 'srv3', x: 420, y: 280, label: '⚙️ Server 3', color: 'var(--accent-2)' },
    { id: 'srv4', x: 420, y: 380, label: '⚙️ Server 4\n(unhealthy)', color: 'var(--hot)' },
  ];
  const SRV_W = 130, SRV_H = 50;

  /* arrows: clients → LB */
  const cliArrows = clients.map(c =>
    arr(`a_c${c.id}`, c.x + CLI_W, c.y + CLI_H / 2, LBX, LBY + LBH / 2, 'var(--accent)')
  );
  /* arrows: LB → servers */
  const srvArrows = servers.map(s =>
    arr(`a_s${s.id}`, LBX + LBW, LBY + LBH / 2, s.x, s.y + SRV_H / 2, 'var(--good)')
  );

  /* ── Right panels ── */
  const PX = 600, PW = 650;

  /* Algorithm panels (stacked) */
  const algY = [30, 150, 270, 390];  // Y positions for 4 algo panels

  /* Health check / SSL / L4-L7 / Global panels */
  const hcY = 30, sslY = 200, l4Y = 370, glbY = 540;

  const elements = [
    /* client boxes */
    ...clients.map(c => box(c.id, c.x, c.y, CLI_W, CLI_H, '👤 Client', 'var(--accent)')),
    /* client arrows */
    ...cliArrows,
    /* LB box */
    box('lb', LBX, LBY, LBW, LBH, '⚖️ Load\nBalancer', 'var(--warn)'),
    lbl('lb_vip', LBX + LBW / 2, LBY + LBH + 14, 'VIP: 203.0.113.10', 'var(--muted)'),
    /* server arrows */
    ...srvArrows,
    /* server boxes */
    ...servers.map(s => box(s.id, s.x, s.y, SRV_W, SRV_H, s.label, s.color)),

    /* health icon on srv4 */
    lbl('srv4_x', servers[3].x + SRV_W + 6, servers[3].y + 16, '❌ 503', 'var(--hot)'),

    /* ── L4 vs L7 panel ── */
    box('l4_bg', PX, l4Y, PW, 160, '', 'var(--panel)'),
    lbl('l4_title', PX + PW / 2, l4Y + 18, '🔌 L4 vs L7 Load Balancing', 'var(--ink)'),
    lbl('l4h1', PX + 10, l4Y + 44, 'L4 — Transport Layer', 'var(--accent-2)'),
    lbl('l4h2', PX + PW / 2 + 10, l4Y + 44, 'L7 — Application Layer', 'var(--good)'),
    lbl('l4v1', PX + 10, l4Y + 66, 'Decisão por IP:port (TCP/UDP)', 'var(--ink-soft)'),
    lbl('l4v2', PX + PW / 2 + 10, l4Y + 66, 'Decisão por HTTP headers/URL/cookie', 'var(--ink-soft)'),
    lbl('l4v3', PX + 10, l4Y + 86, 'Não abre o payload — mais rápido', 'var(--ink-soft)'),
    lbl('l4v4', PX + PW / 2 + 10, l4Y + 86, 'Content-based routing', 'var(--ink-soft)'),
    lbl('l4v5', PX + 10, l4Y + 106, 'NAT ou TCP proxy', 'var(--ink-soft)'),
    lbl('l4v6', PX + PW / 2 + 10, l4Y + 106, 'SSL termination, sticky sessions', 'var(--ink-soft)'),
    lbl('l4v7', PX + 10, l4Y + 126, 'Ex: AWS NLB, HAProxy TCP mode', 'var(--muted)'),
    lbl('l4v8', PX + PW / 2 + 10, l4Y + 126, 'Ex: AWS ALB, NGINX, Envoy', 'var(--muted)'),
    lbl('l4v9', PX + 10, l4Y + 146, 'Menor latência, sem TLS overhead', 'var(--muted)'),
    lbl('l4v10', PX + PW / 2 + 10, l4Y + 146, 'Maior funcionalidade, maior custo CPU', 'var(--muted)'),

    /* ── Algorithms panel ── */
    box('alg_bg', PX, hcY, PW, 340, '', 'var(--panel)'),
    lbl('alg_title', PX + PW / 2, hcY + 18, '🔄 Algoritmos de Balanceamento', 'var(--ink)'),

    lbl('alg_rr_h',  PX + 10,          hcY + 44, 'Round Robin', 'var(--accent)'),
    lbl('alg_rr1',   PX + 10,          hcY + 64, '1→2→3→1→2→3... sequência circular', 'var(--ink-soft)'),
    lbl('alg_rr2',   PX + 10,          hcY + 80, 'Simples; assume servidores com capacidade igual', 'var(--muted)'),

    lbl('alg_wt_h',  PX + PW/2 + 10,   hcY + 44, 'Weighted Round Robin', 'var(--accent-2)'),
    lbl('alg_wt1',   PX + PW/2 + 10,   hcY + 64, 'A(w=3):B(w=1) → A recebe 3× mais requests', 'var(--ink-soft)'),
    lbl('alg_wt2',   PX + PW/2 + 10,   hcY + 80, 'Usa pesos para servidores heterogêneos', 'var(--muted)'),

    lbl('alg_lc_h',  PX + 10,          hcY + 110, 'Least Connections', 'var(--good)'),
    lbl('alg_lc1',   PX + 10,          hcY + 130, 'Rotear para servidor com menos conexões ativas', 'var(--ink-soft)'),
    lbl('alg_lc2',   PX + 10,          hcY + 146, 'Ideal para requests de duração variável (long-poll)', 'var(--muted)'),

    lbl('alg_ih_h',  PX + PW/2 + 10,   hcY + 110, 'IP Hash', 'var(--warn)'),
    lbl('alg_ih1',   PX + PW/2 + 10,   hcY + 130, 'hash(client_IP) % N → mesmo server sempre', 'var(--ink-soft)'),
    lbl('alg_ih2',   PX + PW/2 + 10,   hcY + 146, 'Pseudo-sticky (sem cookie); falha se server cair', 'var(--muted)'),

    lbl('alg_rl_h',  PX + 10,          hcY + 176, 'Random', 'var(--accent-2)'),
    lbl('alg_rl1',   PX + 10,          hcY + 196, 'Servidor escolhido aleatoriamente', 'var(--ink-soft)'),
    lbl('alg_rl2',   PX + 10,          hcY + 212, 'Simples; performance similar ao Round Robin', 'var(--muted)'),

    lbl('alg_ch_h',  PX + PW/2 + 10,   hcY + 176, 'Consistent Hash', 'var(--good)'),
    lbl('alg_ch1',   PX + PW/2 + 10,   hcY + 196, 'hash(key) no ring → mesmo servidor por chave', 'var(--ink-soft)'),
    lbl('alg_ch2',   PX + PW/2 + 10,   hcY + 212, 'Ideal para cache (cache affinity)', 'var(--muted)'),

    lbl('alg_hc_h',  PX + 10,          hcY + 240, '🏥 Health Checks', 'var(--hot)'),
    lbl('alg_hc1',   PX + 10,          hcY + 260, 'Active: GET /health a cada 5s → 2 falhas = unhealthy', 'var(--ink-soft)'),
    lbl('alg_hc2',   PX + 10,          hcY + 278, 'Passive: erro na req real → penaliza servidor', 'var(--ink-soft)'),
    lbl('alg_hc3',   PX + 10,          hcY + 296, 'Graceful drain: stop new requests antes de deploy', 'var(--muted)'),
    lbl('alg_hc4',   PX + 10,          hcY + 316, 'Connection draining: aguarda requests in-flight', 'var(--muted)'),

    /* ── SSL Termination panel ── */
    box('ssl_bg', PX, sslY, PW, 160, '', 'var(--panel)'),
    lbl('ssl_title', PX + PW / 2, sslY + 18, '🔒 SSL Termination', 'var(--accent)'),
    lbl('ssl1', PX + 10, sslY + 44, 'LB decifra TLS → backend recebe HTTP (sem TLS)', 'var(--ink-soft)'),
    lbl('ssl2', PX + 10, sslY + 64, 'Vantagens:', 'var(--muted)'),
    lbl('ssl3', PX + 10, sslY + 82, '→ Certificados gerenciados num único lugar', 'var(--good)'),
    lbl('ssl4', PX + 10, sslY + 100, '→ Offload CPU de TLS (handshake é caro)', 'var(--good)'),
    lbl('ssl5', PX + 10, sslY + 118, '→ LB pode inspecionar/rotear por conteúdo HTTP', 'var(--good)'),
    lbl('ssl6', PX + 10, sslY + 136, 'SSL Passthrough: LB não decifra → backend cuida do TLS', 'var(--ink-soft)'),
    lbl('ssl7', PX + 10, sslY + 156, 'mTLS end-to-end: re-cifra no LB → backend (re-encryption)', 'var(--muted)'),

    /* ── Global LB panel ── */
    box('glb_bg', PX, glbY, PW, 150, '', 'var(--panel)'),
    lbl('glb_title', PX + PW / 2, glbY + 18, '🌍 Global Load Balancing', 'var(--accent-2)'),
    lbl('g1', PX + 10, glbY + 44, 'GeoDNS: resolve domínio para IP do servidor mais próximo', 'var(--ink-soft)'),
    lbl('g2', PX + 10, glbY + 64, 'Anycast IP: mesmo IP anunciado em múltiplos PoPs — roteamento BGP decide', 'var(--ink-soft)'),
    lbl('g3', PX + 10, glbY + 84, 'CDN: edge servers com cache → reduz latência global', 'var(--ink-soft)'),
    lbl('g4', PX + 10, glbY + 104, 'Failover geográfico: região primária cai → secundária assume', 'var(--ink-soft)'),
    lbl('g5', PX + 10, glbY + 124, 'Ex: Cloudflare, AWS Route 53 (latency routing), GCP GLB', 'var(--muted)'),
    lbl('g6', PX + 10, glbY + 144, 'Health check global: remover região inteira se unhealthy', 'var(--muted)'),

    /* L7 features label */
    box('l7f_bg', 20, 430, 560, 110, '', 'var(--panel)'),
    lbl('l7f_title', 300, 448, '🧠 L7 Features', 'var(--good)'),
    lbl('l7f1', 30, 468, 'Host routing: api.app.com → backend_api    www.app.com → backend_web', 'var(--ink-soft)'),
    lbl('l7f2', 30, 488, 'Path routing: /images/ → storage-service    /api/ → api-service', 'var(--ink-soft)'),
    lbl('l7f3', 30, 508, 'Sticky sessions: Set-Cookie: SERVERID=srv2 → sempre srv2', 'var(--ink-soft)'),
    lbl('l7f4', 30, 528, 'Rate limiting, WAF, header rewrite, A/B testing, canary', 'var(--muted)'),
  ];

  const steps = [
    {
      title: 'O Problema: single server',
      show: ['cli1', 'cli2', 'cli3', 'srv1',
             'a_ccli1', 'a_ccli2', 'a_ccli3'],
      balloon: {
        anchor: 'srv1', placement: 'right',
        text: 'Um único servidor: <strong>gargalo</strong> de capacidade, <strong>SPOF</strong> (falha = downtime total), sem escala horizontal. Adicionar mais servidores sem coordenação → qual servidor o cliente acessa?',
        deep: `<p>Escalar verticalmente (servidor maior) tem um teto físico e um custo que cresce mais rápido que linear. Escalar horizontalmente (mais servidores) resolve isso, mas cria um novo problema: o cliente só conhece um endereço — sem um ponto central, ele precisaria saber de todos os servidores e decidir sozinho qual usar.</p>
<div class="xp-bad"><strong>Sem LB: DNS round-robin ingênuo</strong>app.com → [IP1, IP2, IP3] (cliente escolhe, geralmente o primeiro)
Servidor do IP1 cai → parte dos clientes continua tentando IP1 até o TTL do DNS expirar</div>
<p>Sem um componente ativo entre cliente e servidores — que saiba quais estão saudáveis e distribua a carga — cada mudança na topologia (deploy, falha, scale) exige reconfigurar todo cliente.</p>` },
    },
    {
      title: 'Load Balancer: 1 IP, N servidores',
      show: ['cli1', 'cli2', 'cli3', 'lb', 'lb_vip',
             'a_ccli1', 'a_ccli2', 'a_ccli3',
             'srv1', 'srv2', 'srv3', 'srv4',
             'a_ssrv1', 'a_ssrv2', 'a_ssrv3', 'a_ssrv4'],
      highlight: ['lb'],
      balloon: {
        anchor: 'lb', placement: 'right',
        text: 'O LB recebe todas as requests no <strong>VIP</strong> (Virtual IP), decide qual backend atender, e encaminha. Clientes sempre falam com o mesmo IP — o LB é o ponto de entrada único.',
        deep: `<p>O VIP não pertence fisicamente a nenhuma máquina só — é um endereço IP que o LB anuncia (via ARP/gratuitous ARP ou BGP, dependendo da implementação), e que pode "migrar" para outra instância do LB em caso de failover, sem o cliente perceber.</p>
<div class="xp-example"><strong>Configuração conceitual</strong>VIP: 203.0.113.10 → pool: [10.0.1.5, 10.0.1.6, 10.0.1.7]
Cliente sempre resolve app.com → 203.0.113.10, nunca vê os IPs internos</div>
<p>Isso também é o que permite trocar, adicionar ou remover servidores do pool sem qualquer mudança de DNS ou reconfiguração do lado do cliente — a indireção do VIP é o que dá liberdade operacional ao backend.</p>` },
    },
    {
      title: 'L4 vs L7: onde a decisão acontece',
      show: ['cli1', 'lb', 'srv1', 'srv2', 'a_ccli1', 'a_ssrv1', 'a_ssrv2',
             'l4_bg', 'l4_title', 'l4h1', 'l4h2',
             'l4v1', 'l4v2', 'l4v3', 'l4v4', 'l4v5', 'l4v6',
             'l4v7', 'l4v8', 'l4v9', 'l4v10'],
      highlight: ['l4_bg', 'lb'],
      balloon: {
        anchor: 'l4_bg', placement: 'left',
        text: '<strong>L4</strong>: decisão por IP:port — sem abrir o payload TCP/UDP. Mais rápido, menor latência. <strong>L7</strong>: abre o HTTP e decide por header/URL/cookie. Mais funcional, permite SSL termination e roteamento semântico.',
        deep: `<p>A diferença de desempenho vem de quanto trabalho o LB faz por pacote: L4 só olha o cabeçalho IP/TCP e encaminha (por vezes nem termina a conexão TCP, só faz NAT) — é essencialmente roteamento de rede. L7 precisa remontar o stream TCP, parsear HTTP, decidir a rota e então abrir uma nova conexão com o backend escolhido.</p>
<div class="xp-good"><strong>Use L4 quando</strong>Protocolo não-HTTP (TCP puro, gRPC de baixo nível), latência é crítica, ou o roteamento não depende do conteúdo</div>
<div class="xp-good"><strong>Use L7 quando</strong>Precisa rotear por host/path, quer terminar TLS centralmente, ou quer recursos como sticky sessions e WAF</div>
<p>Muitas arquiteturas usam os dois em camadas: um L4 (AWS NLB) na borda por resiliência e baixa latência, e um L7 (Envoy, nginx) atrás dele para roteamento inteligente.</p>` },
    },
    {
      title: 'Round Robin e Weighted Round Robin',
      show: ['cli1', 'cli2', 'cli3', 'lb', 'srv1', 'srv2', 'srv3',
             'a_ccli1', 'a_ccli2', 'a_ccli3', 'a_ssrv1', 'a_ssrv2', 'a_ssrv3',
             'alg_bg', 'alg_title', 'alg_rr_h', 'alg_rr1', 'alg_rr2',
             'alg_wt_h', 'alg_wt1', 'alg_wt2'],
      highlight: ['lb', 'srv1', 'srv2', 'srv3'],
      balloon: {
        anchor: 'alg_bg', placement: 'left',
        text: '<strong>Round Robin</strong>: distribui requests em sequência circular 1→2→3→1→... Simples e justo quando os servidores têm a mesma capacidade.\n<strong>Weighted</strong>: se Server 1 tem 4 vCPUs e Server 2 tem 2 vCPUs, usar weights 2:1.',
        deep: `<p>Round Robin assume implicitamente que toda requisição custa o mesmo — o que raramente é verdade na prática (um upload demora mais que um GET simples), mas funciona bem como default por ser previsível e não exigir nenhum estado compartilhado entre os LBs.</p>
<div class="xp-example"><strong>nginx: weighted round robin</strong>upstream backend {
  server 10.0.1.5 weight=2;
  server 10.0.1.6 weight=1;
}
# server 1 recebe ~2x mais requests que server 2</div>
<p>Weighted Round Robin é a ferramenta certa quando os servidores têm capacidades diferentes por design (ex.: durante uma migração gradual para instâncias maiores) — sem isso, o servidor mais fraco recebe a mesma carga que os outros e vira gargalo.</p>` },
    },
    {
      title: 'Least Connections e IP Hash',
      show: ['cli1', 'cli2', 'cli3', 'lb', 'srv1', 'srv2', 'srv3',
             'a_ccli1', 'a_ccli2', 'a_ccli3', 'a_ssrv1', 'a_ssrv2', 'a_ssrv3',
             'alg_bg', 'alg_title', 'alg_lc_h', 'alg_lc1', 'alg_lc2',
             'alg_ih_h', 'alg_ih1', 'alg_ih2'],
      highlight: ['lb'],
      balloon: {
        anchor: 'alg_bg', placement: 'left',
        text: '<strong>Least Connections</strong>: envia para o servidor com menos conexões ativas — ideal quando requests têm durações muito diferentes (ex: upload vs query simples).\n<strong>IP Hash</strong>: `hash(IP) % N` → mesmo cliente sempre vai para o mesmo servidor. Útil para cache com affinity.',
        why: 'IP Hash tem um problema: se um servidor cai, há redistribuição desigual — o Consistent Hash é mais robusto para isso.',
        deep: `<p>Least Connections exige que o LB mantenha estado (contador de conexões abertas por backend), diferente de Round Robin que é totalmente stateless. Esse estado é o que permite reagir em tempo real a servidores lentos, sem precisar saber a priori a duração de cada request.</p>
<div class="xp-bad"><strong>IP Hash com pool instável</strong>hash(IP) % 3 → muda de resultado sempre que N muda (add/remove server)
Servidor cai: praticamente todos os clientes são remapeados para outro servidor, não só os do servidor perdido</div>
<p>Esse remapeamento em massa do IP Hash tradicional é justamente o problema que o Consistent Hash resolve — ele redistribui só a fração de chaves que pertenciam ao nó removido, mantendo o resto estável.</p>` },
    },
    {
      title: 'Health Checks: detectar servidores falhos',
      show: ['cli1', 'cli2', 'cli3', 'lb', 'srv1', 'srv2', 'srv3', 'srv4', 'srv4_x',
             'a_ccli1', 'a_ccli2', 'a_ccli3', 'a_ssrv1', 'a_ssrv2', 'a_ssrv3',
             'alg_bg', 'alg_title', 'alg_hc_h', 'alg_hc1', 'alg_hc2', 'alg_hc3', 'alg_hc4'],
      highlight: ['srv4', 'srv4_x', 'alg_hc_h'],
      balloon: {
        anchor: 'srv4', placement: 'right',
        text: '<strong>Active health check</strong>: LB envia `GET /health` a cada 5s → 2 falhas consecutivas → servidor marcado como unhealthy → removido do pool. <strong>Passive</strong>: monitorar erros nas requisições reais.',
        why: '`/health` deve verificar dependências (banco, cache) — responder 200 só se o servidor consegue processar requests com sucesso.',
        deep: `<p>Existe uma armadilha comum: um <code>/health</code> "raso" que só responde 200 se o processo está de pé, mesmo que a conexão com o banco esteja quebrada. Isso faz o LB continuar enviando tráfego para um servidor que não consegue de fato processar nada.</p>
<div class="xp-bad"><strong>Health check raso</strong>app.get('/health', (req, res) => res.sendStatus(200)); // sempre 200!</div>
<div class="xp-good"><strong>Health check profundo</strong>app.get('/health', async (req, res) => {
  await db.ping();
  await cache.ping();
  res.sendStatus(200);
});</div>
<p>O contrapeso é não exagerar: um health check que verifica dependências demais pode marcar o servidor como unhealthy por um problema temporário e transitório em uma dependência não-crítica, tirando capacidade do pool desnecessariamente.</p>` },
    },
    {
      title: 'SSL Termination: centralizando TLS no LB',
      show: ['cli1', 'lb', 'srv1', 'srv2', 'a_ccli1', 'a_ssrv1', 'a_ssrv2',
             'ssl_bg', 'ssl_title', 'ssl1', 'ssl2', 'ssl3', 'ssl4', 'ssl5', 'ssl6', 'ssl7'],
      highlight: ['lb', 'ssl_bg'],
      balloon: {
        anchor: 'ssl_bg', placement: 'left',
        text: 'LB decifra TLS e encaminha HTTP para o backend. Vantagens: <strong>1 único certificado</strong> gerenciado no LB, <strong>offload de CPU</strong> (handshake TLS é computacionalmente caro), e permite ao L7 inspecionar o conteúdo HTTP.',
        deep: `<p>Terminar TLS no LB significa que o tráfego entre LB e backend trafega como HTTP puro — o que é aceitável dentro de uma rede privada confiável (VPC), mas é considerado inseguro em ambientes que exigem criptografia ponta a ponta (compliance, zero-trust).</p>
<div class="xp-good"><strong>SSL Termination</strong>Cliente --TLS--> LB --HTTP--> Backend
1 certificado, renovação centralizada (ex: cert-manager, ACM)</div>
<div class="xp-good"><strong>Re-encryption / mTLS end-to-end</strong>Cliente --TLS--> LB --TLS interno (mTLS)--> Backend
Mais seguro, exige gerenciar certificados internos também</div>
<p>SSL Passthrough é o meio-termo oposto: o LB nem decifra, só encaminha os bytes TCP — o backend é quem termina o TLS. Usado quando o LB não deve (ou não pode) ver o conteúdo, mas perde a capacidade de rotear por conteúdo HTTP.</p>` },
    },
    {
      title: 'Layer 7: roteamento por conteúdo HTTP',
      show: ['cli1', 'cli2', 'cli3', 'lb', 'srv1', 'srv2', 'srv3',
             'a_ccli1', 'a_ccli2', 'a_ccli3', 'a_ssrv1', 'a_ssrv2', 'a_ssrv3',
             'l7f_bg', 'l7f_title', 'l7f1', 'l7f2', 'l7f3', 'l7f4'],
      highlight: ['lb', 'l7f_bg'],
      balloon: {
        anchor: 'l7f_bg', placement: 'top',
        text: 'L7 LB permite <strong>host-based routing</strong> (`api.empresa.com` → cluster API, `www.empresa.com` → frontend), <strong>path routing</strong> (`/images/` → CDN origin), <strong>sticky sessions</strong> via cookie, e até WAF, rate limiting e canary deploys.',
        deep: `<p>Sticky sessions merecem atenção especial: elas resolvem o problema de estado em memória (sessão de login, carrinho local) mas criam um acoplamento entre cliente e servidor específico — se esse servidor cair, a sessão daquele cliente se perde junto.</p>
<div class="xp-example"><strong>Cookie de afinidade</strong>Set-Cookie: SERVERID=srv2; Path=/; HttpOnly
# próximas requests do cliente sempre vão para srv2, enquanto o cookie existir</div>
<p>A alternativa mais robusta é tornar os backends <strong>stateless</strong> (sessão em Redis/banco compartilhado) e evitar sticky sessions por completo — isso permite ao LB balancear livremente e simplifica deploys, já que qualquer instância pode atender qualquer requisição.</p>` },
    },
    {
      title: 'Consistent Hash e algoritmos avançados',
      show: ['cli1', 'cli2', 'cli3', 'lb', 'srv1', 'srv2', 'srv3',
             'a_ccli1', 'a_ccli2', 'a_ccli3', 'a_ssrv1', 'a_ssrv2', 'a_ssrv3',
             'alg_bg', 'alg_title', 'alg_ch_h', 'alg_ch1', 'alg_ch2',
             'alg_rl_h', 'alg_rl1', 'alg_rl2'],
      balloon: {
        anchor: 'alg_bg', placement: 'left',
        text: '<strong>Consistent Hash</strong> é superior ao IP Hash para cache affinity — quando um servidor cai, apenas ~1/N chaves precisam ser remapeadas (vs todos com `hash % N`). Perfeito para serviços stateful como cache.',
        deep: `<p>A ideia central do Consistent Hashing é dispor os servidores (e as chaves) em um anel de hash — cada chave pertence ao primeiro servidor encontrado ao andar no sentido horário a partir da sua posição no anel. Adicionar ou remover um servidor só afeta a fatia do anel adjacente a ele.</p>
<div class="xp-example"><strong>Anel conceitual</strong>hash(Server1) = 10, hash(Server2) = 40, hash(Server3) = 80
hash(chaveX) = 25 → cai entre Server1(10) e Server2(40) → vai para Server2</div>
<p>Na prática, cada servidor físico é representado por múltiplos pontos "virtuais" no anel (virtual nodes) para distribuir a carga de forma mais uniforme — sem isso, um servidor poderia acabar responsável por uma fatia desproporcional do anel só por sorte no hash.</p>` },
    },
    {
      title: 'Global Load Balancing',
      show: ['cli1', 'lb', 'srv1', 'srv2', 'srv3',
             'a_ccli1', 'a_ssrv1', 'a_ssrv2', 'a_ssrv3',
             'glb_bg', 'glb_title', 'g1', 'g2', 'g3', 'g4', 'g5', 'g6'],
      highlight: ['glb_bg'],
      balloon: {
        anchor: 'glb_bg', placement: 'left',
        text: '<strong>GeoDNS</strong>: DNS resolve para o servidor mais próximo geograficamente. <strong>Anycast</strong>: mesmo IP anunciado em múltiplos data centers — BGP roteia para o mais próximo. Ambos reduzem latência global e permitem failover de região.',
        deep: `<p>GeoDNS opera na camada de resolução de nomes: o servidor DNS responde com um IP diferente dependendo de onde a consulta se origina. É simples de implementar, mas está sujeito ao cache de DNS — clientes com TTL alto continuam batendo na região antiga por um tempo após um failover.</p>
<div class="xp-good"><strong>Anycast</strong>Mesmo IP anunciado via BGP em vários PoPs; roteadores da internet escolhem a rota mais curta automaticamente — failover quase instantâneo (segundos), sem depender de TTL de DNS</div>
<div class="xp-bad"><strong>GeoDNS ingênuo em failover</strong>Região cai → DNS passa a apontar para outra região → clientes com cache de DNS ainda batem na região morta até o TTL expirar</div>
<p>Serviços como Cloudflare e grandes CDNs combinam os dois: Anycast para chegar rápido ao PoP mais próximo, e roteamento inteligente por dentro da rede deles para lidar com falhas locais.</p>` },
    },
    {
      title: 'Quiz',
      show: ['cli1', 'cli2', 'cli3', 'lb', 'srv1', 'srv2', 'srv3', 'srv4', 'srv4_x',
             'a_ccli1', 'a_ccli2', 'a_ccli3', 'a_ssrv1', 'a_ssrv2', 'a_ssrv3'],
      quiz: {
        question: 'Qual algoritmo de balanceamento é mais adequado para requests com durações muito variadas (ex: uploads longos misturados com queries rápidas)?',
        options: [
          'Round Robin — distribui uniformemente em sequência circular',
          'Least Connections — envia para o servidor com menos conexões ativas',
          'IP Hash — garante que o mesmo cliente vai sempre para o mesmo servidor',
          'Random — escolha aleatória tem distribuição estatisticamente uniforme',
        ],
        answer: 1,
        explain: '<strong>Least Connections</strong> é o melhor para workloads com durações variadas: um servidor que está processando um upload de 5 minutos recebe menos requests novas do que um servidor que só faz queries de 10ms. Round Robin seria injusto — enviaria a mesma quantidade de requests para ambos, sobrecarregando o servidor com o upload longo.',
      },
    },
    {
      title: 'Resumo: Load Balancer',
      show: ['cli1', 'cli2', 'cli3', 'lb', 'lb_vip', 'srv1', 'srv2', 'srv3', 'srv4', 'srv4_x',
             'a_ccli1', 'a_ccli2', 'a_ccli3', 'a_ssrv1', 'a_ssrv2', 'a_ssrv3',
             'l4_bg', 'l4_title', 'l4h1', 'l4h2', 'l4v1', 'l4v2',
             'alg_bg', 'alg_title', 'alg_rr_h', 'alg_lc_h', 'alg_ih_h',
             'alg_hc_h', 'alg_hc1',
             'ssl_bg', 'ssl_title', 'ssl1', 'ssl3',
             'glb_bg', 'glb_title', 'g1', 'g2'],
      balloon: {
        anchor: 'lb', placement: 'right',
        text: 'LB distribui tráfego entre N servidores via VIP único. L4 (IP:port, rápido) vs L7 (HTTP content, funcional). Algoritmos: Round Robin, Least Conn, IP Hash, Consistent Hash. Health checks removem unhealthy servers. SSL termination centraliza TLS. Global LB via GeoDNS/Anycast.',
      },
    },
  ];

  window.LOAD_BALANCER_DIAGRAM = { title: 'Load Balancer — L4, L7 e Algoritmos', W, H, elements, steps };
})();
