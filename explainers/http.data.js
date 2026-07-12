/* ============================================================================
 * http.data.js — Explicador: o ciclo de uma requisição HTTP
 * Mesmo motor do Transformer; só muda o CONTEÚDO (elements + steps).
 * Formato: diagrama de sequência (3 lifelines: cliente, DNS, servidor).
 * ==========================================================================*/
(function () {
  const W = 1280, H = 720;
  const C = 250, D = 645, S = 1030;          // colunas (lifelines)
  const reveal = (ctx, ids, st = 80) => ids.forEach((id, i) => setTimeout(() => ctx.show(id), i * st));

  // helper p/ uma mensagem = seta horizontal + rótulo acima
  const msg = (id, x1, x2, y, label, color) => ([
    { id, type: "arrow", x1, y1: y, x2, y2: y, color },
    { id: id + "_l", type: "label", x: (x1 + x2) / 2, y: y - 12, sub: true, anchor: "middle", mono: true, label },
  ]);
  // dot que percorre a mensagem
  const dot = (id, x, y, color) => ({ id, type: "box", x: x - 9, y: y - 9, w: 18, h: 18, rx: 9, fill: color || "var(--accent)" });

  const elements = [
    // cabeçalhos das três colunas
    { id: "cli", type: "box", x: C - 95, y: 36, w: 190, h: 46, label: "🖥️ Navegador (cliente)" },
    { id: "dnss", type: "box", x: D - 95, y: 36, w: 190, h: 46, label: "🌐 Servidor DNS" },
    { id: "srv", type: "box", x: S - 95, y: 36, w: 190, h: 46, label: "🗄️ Servidor web" },
    // lifelines (tracejadas)
    { id: "ll_c", type: "arrow", noHead: true, dashed: true, color: "var(--muted)", path: `M${C},84 L${C},690` },
    { id: "ll_d", type: "arrow", noHead: true, dashed: true, color: "var(--muted)", path: `M${D},84 L${D},690` },
    { id: "ll_s", type: "arrow", noHead: true, dashed: true, color: "var(--muted)", path: `M${S},84 L${S},690` },

    // URL digitada
    { id: "url", type: "box", x: C - 150, y: 110, w: 300, h: 40, mono: true, fill: "#1b2747",
      label: "https://www.exemplo.com/index.html" },

    // mensagens
    ...msg("m_dnsq", C, D, 210, "1 · A? www.exemplo.com", "var(--warn)"),
    ...msg("m_dnsr", D, C, 270, "2 · 93.184.216.34", "var(--warn)"),
    ...msg("m_tcp", C, S, 350, "3 · TCP connect (SYN/SYN-ACK/ACK)", "var(--accent)"),
    ...msg("m_tls", C, S, 420, "4 · TLS handshake 🔒 (chaves)", "var(--accent-2)"),
    ...msg("m_get", C, S, 500, "5 · GET /index.html  ·  Host, Accept…", "var(--good)"),
    { id: "proc", type: "box", x: S - 90, y: 540, w: 180, h: 38, fill: "#22315d", label: "monta a resposta" },
    ...msg("m_resp", S, C, 630, "6 · 200 OK + headers + HTML", "var(--hot)"),
    { id: "status", type: "token", x: C - 70, y: 660, w: 140, h: 38, label: "200 OK ✓" },

    // dots animados
    dot("d_dnsq", C, 210, "var(--warn)"),
    dot("d_get", C, 500, "var(--good)"),
    dot("d_resp", S, 630, "var(--hot)"),
  ];

  const steps = [
    {
      title: "Você digita a URL",
      show: ["cli", "ll_c", "url"], highlight: ["url"],
      balloon: { anchor: "url", placement: "bottom",
        text: "Tudo começa quando você pede <strong>https://www.exemplo.com/index.html</strong>. A URL tem esquema (https), host (www.exemplo.com) e caminho (/index.html).",
        why: "O navegador precisa descobrir <em>onde</em> está esse host e <em>como</em> falar com ele antes de pedir a página.",
        deep: `<p>Uma URL tem mais partes do que aparenta. Além de esquema, host e caminho, ela pode carregar porta, query string e fragmento — cada um com um papel diferente na requisição.</p>
<div class="xp-example"><strong>Anatomia completa</strong>https://www.exemplo.com:443/busca?termo=gatos&pagina=2#resultados

esquema:   https
host:      www.exemplo.com
porta:     443 (implícita em https)
caminho:   /busca
query:     termo=gatos&pagina=2
fragmento: #resultados (nunca sai do navegador!)</div>
<h4>O que vai para o servidor e o que fica no navegador</h4>
<ul>
<li><strong>Esquema, host, caminho e query</strong> — vão na requisição HTTP</li>
<li><strong>Fragmento (#...)</strong> — usado só pelo navegador (ex.: rolar até uma âncora), nunca é enviado ao servidor</li>
</ul>` },
    },
    {
      title: "DNS: nome → IP",
      show: ["dnss", "ll_d", "m_dnsq", "m_dnsq_l"], highlight: ["dnss"],
      balloon: { anchor: "m_dnsq_l", placement: "bottom",
        text: "O nome <strong>www.exemplo.com</strong> não serve para rotear pacotes. O navegador pergunta ao <strong>DNS</strong> qual é o endereço IP correspondente.",
        why: "A internet entrega pacotes por <strong>endereço IP</strong>, não por nome. O DNS é a “lista telefônica”.",
        deep: `<p>Antes de perguntar a um servidor DNS externo, o navegador consulta várias camadas de cache — o pedido só sai para a rede se nenhuma delas já souber a resposta.</p>
<div class="xp-example"><strong>Ordem de consulta</strong>1. Cache do navegador
2. Cache do sistema operacional
3. Resolver DNS do provedor de internet (recursivo)
4. Servidores raiz → TLD (.com) → autoritativo de exemplo.com</div>
<p>A consulta em si é um registro do tipo <code>A</code> (IPv4) ou <code>AAAA</code> (IPv6): "qual o endereço IP de www.exemplo.com?". Em produção é comum inspecionar isso com <code>dig www.exemplo.com A</code> no terminal.</p>` },
      enter: (ctx) => { ctx.moveTo("d_dnsq", 0, 0); ctx.show("d_dnsq"); ctx.drawArrow("m_dnsq"); setTimeout(() => ctx.moveTo("d_dnsq", D - C, 0), 60); },
    },
    {
      title: "DNS responde o IP",
      show: ["m_dnsr", "m_dnsr_l"],
      balloon: { anchor: "m_dnsr_l", placement: "bottom",
        text: "O DNS devolve o <strong>IP</strong> (ex.: 93.184.216.34). O resultado fica em <strong>cache</strong> por um tempo (<span class=\"xp-term\" tabindex=\"0\" data-tip=\"Time To Live: por quantos segundos a resposta do DNS pode ser reutilizada antes de perguntar de novo.\">TTL</span>).",
        why: "Com o IP em mãos, o navegador já pode abrir uma conexão até o servidor.",
        deep: `<p>O TTL não é fixo por domínio — cada registro DNS carrega o seu, definido por quem administra a zona. Um TTL curto (ex.: 60s) facilita trocar de servidor rápido; um TTL longo economiza consultas.</p>
<div class="xp-example"><strong>Resposta de um dig</strong>$ dig www.exemplo.com A

;; ANSWER SECTION:
www.exemplo.com.  300  IN  A  93.184.216.34</div>
<p>Aqui <code>300</code> é o TTL em segundos: o navegador (e o resolver do provedor) pode reutilizar esse IP por 5 minutos antes de perguntar de novo, sem gastar outra ida e volta ao DNS.</p>` },
      enter: (ctx) => ctx.drawArrow("m_dnsr"),
    },
    {
      title: "Conexão TCP",
      show: ["srv", "ll_s", "m_tcp", "m_tcp_l"], highlight: ["srv"],
      balloon: { anchor: "m_tcp_l", placement: "bottom",
        text: "O navegador abre uma conexão <strong>TCP</strong> com o servidor por meio do <strong>three-way handshake</strong> (SYN → SYN-ACK → ACK).",
        why: "TCP garante entrega confiável e em ordem. (Veja o explicador de TCP/IP para o detalhe do handshake.)",
        deep: `<p>O handshake troca três segmentos antes de qualquer dado da aplicação viajar. Cada lado precisa provar que consegue enviar <em>e</em> receber antes de a conexão ser considerada aberta.</p>
<div class="xp-example"><strong>Three-way handshake</strong>Cliente  → Servidor:  SYN      seq=x
Servidor → Cliente:   SYN-ACK  seq=y, ack=x+1
Cliente  → Servidor:  ACK      ack=y+1</div>
<p>Esse custo (1.5 round-trips) é pago uma vez por conexão — por isso HTTP/1.1 usa <em>keep-alive</em> para reaproveitar a mesma conexão TCP em várias requisições, evitando repetir o handshake a cada recurso.</p>` },
      enter: (ctx) => ctx.drawArrow("m_tcp"),
    },
    {
      title: "TLS (o cadeado 🔒)",
      show: ["m_tls", "m_tls_l"],
      balloon: { anchor: "m_tls_l", placement: "bottom",
        text: "Como é <strong>https</strong>, cliente e servidor negociam o <strong>TLS</strong>: validam o certificado e combinam uma chave de sessão para criptografar tudo.",
        why: "Sem TLS, qualquer um no caminho leria/alteraria os dados. O cadeado do navegador = TLS ativo.",
        deep: `<p>O TLS soma outro round-trip (ou zero, com TLS 1.3 e resumption) por cima do TCP. Nele, cliente e servidor concordam num algoritmo de cifra, o servidor prova sua identidade com um certificado, e os dois derivam uma chave de sessão sem nunca transmiti-la.</p>
<div class="xp-example"><strong>Resumo do handshake TLS 1.3</strong>ClientHello   → cipher suites, random_C
ServerHello   ← cipher escolhido, Certificate
(troca de chaves efêmera — ECDHE)
Finished ↔ Finished → canal cifrado pronto</div>
<p>Depois disso, todo o tráfego — incluindo os headers HTTP — vai cifrado; um observador na rede só vê bytes opacos. Detalhe completo no explicador de TLS/mTLS.</p>` },
      enter: (ctx) => ctx.drawArrow("m_tls"),
    },
    {
      title: "Requisição HTTP",
      show: ["m_get", "m_get_l"], highlight: ["m_get_l"],
      balloon: { anchor: "m_get_l", placement: "top",
        text: "Agora sim o pedido HTTP: <strong>método</strong> (GET), <strong>caminho</strong> (/index.html) e <strong>headers</strong> (Host, Accept, Cookie, User-Agent…).",
        why: "Os headers descrevem o que o cliente quer e quem ele é; o método diz a ação (GET lê, POST envia, etc.).",
        deep: `<p>Uma requisição HTTP real tem uma linha de início (método + caminho + versão) seguida de headers, um por linha, e uma linha em branco que separa headers do corpo (vazio num GET).</p>
<div class="xp-example"><strong>Requisição bruta</strong>GET /index.html HTTP/1.1
Host: www.exemplo.com
User-Agent: Mozilla/5.0
Accept: text/html,application/xhtml+xml
Accept-Language: pt-BR
Cookie: sessionid=abc123
Connection: keep-alive
</div>
<h4>Papel de cada peça</h4>
<ul>
<li><strong>Método</strong> — a ação (GET lê, POST envia, PUT substitui, DELETE remove)</li>
<li><strong>Host</strong> — obrigatório desde HTTP/1.1; permite vários sites na mesma porta/IP (virtual hosting)</li>
<li><strong>Cookie</strong> — identifica a sessão do usuário sem exigir login em cada requisição</li>
</ul>` },
      enter: (ctx) => { ctx.moveTo("d_get", 0, 0); ctx.show("d_get"); ctx.drawArrow("m_get"); setTimeout(() => ctx.moveTo("d_get", S - C, 0), 60); },
    },
    {
      title: "Servidor processa",
      show: ["proc"], highlight: ["proc", "srv"],
      balloon: { anchor: "proc", placement: "top",
        text: "O servidor recebe a requisição, executa a lógica (roteamento, banco de dados, template…) e <strong>monta a resposta</strong>.",
        why: "É aqui que back-end, frameworks e bancos entram. Para o cliente, isso é uma caixa-preta: ele só espera a resposta.",
        deep: `<p>Para o cliente, o servidor é uma caixa-preta — mas dentro dela normalmente rola uma sequência previsível: roteamento decide qual código trata a URL, esse código consulta dados e um template ou serializador monta a resposta.</p>
<div class="xp-example"><strong>Exemplo de pipeline (simplificado)</strong>1. Router:   GET /index.html → HomeController.index()
2. Query:    SELECT * FROM posts ORDER BY data DESC LIMIT 10
3. Template: renderiza posts.html com os dados
4. Resposta: HTML pronto + headers de cache</div>
<p>Frameworks e arquiteturas diferentes implementam isso de formas muito distintas (server-side rendering, API + frontend separado, funções serverless) — mas o contrato com o cliente continua sendo o mesmo: uma resposta HTTP.</p>` },
    },
    {
      title: "Resposta HTTP",
      show: ["m_resp", "m_resp_l", "status"], highlight: ["status"],
      balloon: { anchor: "m_resp_l", placement: "top",
        text: "Volta a resposta: uma <strong>linha de status</strong> (200 OK, 404, 500…), <strong>headers</strong> (Content-Type, Cache-Control…) e o <strong>corpo</strong> (o HTML).",
        why: "O código de status resume o resultado; os headers dizem como tratar o corpo (tipo, tamanho, cache).",
        deep: `<p>O primeiro dígito do status code já diz a categoria da resposta — útil para tratar erros programaticamente sem checar cada código individualmente.</p>
<div class="xp-example"><strong>Resposta bruta</strong>HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 4821
Cache-Control: max-age=3600
Date: Mon, 01 Jul 2024 12:00:00 GMT

&lt;!DOCTYPE html&gt;...</div>
<h4>Classes de status</h4>
<ul>
<li><strong>2xx</strong> — sucesso (200 OK, 201 Created, 204 No Content)</li>
<li><strong>3xx</strong> — redirecionamento (301 permanente, 302 temporário)</li>
<li><strong>4xx</strong> — erro do cliente (404 não encontrado, 401 não autenticado)</li>
<li><strong>5xx</strong> — erro do servidor (500 erro interno, 503 indisponível)</li>
</ul>` },
      enter: (ctx) => { ctx.moveTo("d_resp", 0, 0); ctx.show("d_resp"); ctx.drawArrow("m_resp"); setTimeout(() => ctx.moveTo("d_resp", -(S - C), 0), 60); },
    },
    {
      title: "Teste rápido",
      balloon: { anchor: "dnss", placement: "bottom",
        text: "Antes de fechar, confira um ponto-chave 👇" },
      quiz: {
        question: "Para que serve a etapa de DNS numa requisição?",
        options: [
          "Criptografar a conexão com o servidor",
          "Traduzir o nome (www.exemplo.com) para um endereço IP",
          "Comprimir o HTML antes de enviar",
          "Guardar os cookies do usuário",
        ],
        answer: 1,
        explain: "A internet roteia por IP, não por nome. O DNS resolve o nome para o IP antes de qualquer conexão acontecer.",
      },
    },
    {
      title: "Renderiza e (talvez) cacheia",
      highlight: ["cli", "url", "status"],
      balloon: { anchor: { x: 250, y: 360 }, placement: "right",
        text: "O navegador <strong>interpreta o HTML</strong>, descobre CSS/JS/imagens e repete o ciclo para cada um. Recursos podem vir do <strong>cache</strong>, sem nova ida ao servidor.",
        why: "Resumo do fluxo: <strong>URL → DNS → TCP → TLS → request → resposta → render</strong>. Esse mesmo ciclo se repete o tempo todo na web.",
        deep: `<p>Depois de receber o HTML, o navegador o interpreta e descobre outros recursos (CSS, JS, imagens) referenciados nele — cada um pode disparar um novo ciclo completo (DNS → TCP → TLS → request → resposta), ou ser servido direto do cache, sem tocar a rede.</p>
<div class="xp-example"><strong>Headers que controlam cache</strong>Cache-Control: max-age=86400, public
ETag: "33a64df551"
Last-Modified: Mon, 01 Jul 2024 08:00:00 GMT</div>
<div class="xp-good"><strong>Com cache válido</strong>Recurso já em cache e dentro do max-age → navegador usa a cópia local, 0 requisições à rede.</div>
<div class="xp-bad"><strong>Sem cache</strong>Toda navegação repete o ciclo completo para CSS, JS e imagens — mais lento e mais carga no servidor.</div>` },
      enter: (ctx) => ["m_dnsq", "m_dnsr", "m_tcp", "m_tls", "m_get", "m_resp"].forEach((a, k) => setTimeout(() => ctx.pulse(a, true), k * 90)),
    },
  ];

  window.HTTP_DIAGRAM = {
    title: "O ciclo de uma requisição HTTP",
    subtitle: "Da URL digitada até a página renderizada",
    width: W, height: H, autoplayMs: 8000, elements, steps,
  };
})();
