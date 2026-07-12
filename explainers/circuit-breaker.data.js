/* ============================================================================
 * circuit-breaker.data.js — Explicador: Circuit Breaker
 * Máquina de estados: CLOSED → OPEN → HALF-OPEN → CLOSED
 * ==========================================================================*/
(function () {
  const W = 1280, H = 720;

  // Estados como círculos grandes no lado esquerdo
  const ST = {
    closed:   { x: 130, y: 160, r: 90 },
    open:     { x: 130, y: 400, r: 90 },
    halfopen: { x: 130, y: 610, r: 70 },
  };

  // Serviço cliente e serviço dependente à direita
  const CLX = 600, SRX = 1000;

  const circle = (id, s, fill, stroke, label) => ({
    id, type: "box",
    x: s.x - s.r, y: s.y - s.r, w: s.r*2, h: s.r*2,
    rx: s.r, fill, stroke, label,
  });

  const elements = [
    /* ── ESTADOS ─────────────────────────────────── */
    { ...circle("st_closed", ST.closed, "#112318", "var(--good)",
        ["✓ CLOSED", "(fechado)", "requisições", "passam"]) },
    { ...circle("st_open", ST.open, "#3a1320", "var(--hot)",
        ["✗ OPEN", "(aberto)", "requisições", "BLOQUEADAS"]) },
    { ...circle("st_halfopen", ST.halfopen, "#1a1208", "var(--warn)",
        ["? HALF", "OPEN"]) },

    // Rótulo de estado
    { id: "st_lbl", type: "label", x: 130, y: 26, anchor: "middle", label: "Estado do Circuit Breaker" },

    /* ── TRANSIÇÕES ──────────────────────────────── */
    { id: "a_co", type: "arrow", x1: 130, y1: ST.closed.y+ST.closed.r,
      x2: 130, y2: ST.open.y-ST.open.r, color: "var(--hot)" },
    { id: "lbl_co", type: "label", x: 180, y: (ST.closed.y+ST.open.y)/2, sub: true, label: "threshold atingido" },

    { id: "a_oh", type: "arrow", x1: 130, y1: ST.open.y+ST.open.r,
      x2: 130, y2: ST.halfopen.y-ST.halfopen.r, color: "var(--warn)" },
    { id: "lbl_oh", type: "label", x: 180, y: (ST.open.y+ST.halfopen.y)/2, sub: true, label: "timer expira" },

    { id: "a_hc", type: "arrow",
      path: `M${ST.halfopen.x-ST.halfopen.r},${ST.halfopen.y} C${-60},${ST.halfopen.y} ${-60},${ST.closed.y} ${ST.closed.x-ST.closed.r},${ST.closed.y}`,
      color: "var(--good)" },
    { id: "lbl_hc", type: "label", x: -30, y: (ST.halfopen.y+ST.closed.y)/2, sub: true, anchor: "middle", label: "probe ok" },

    { id: "a_ho", type: "arrow",
      path: `M${ST.halfopen.x+ST.halfopen.r},${ST.halfopen.y} C${320},${ST.halfopen.y} ${320},${ST.open.y} ${ST.open.x+ST.open.r},${ST.open.y}`,
      color: "var(--hot)" },
    { id: "lbl_ho", type: "label", x: 350, y: (ST.halfopen.y+ST.open.y)/2, sub: true, anchor: "middle", label: "probe falhou" },

    /* ── CLIENTE e SERVIÇO ──────────────────────── */
    { id: "cl_box", type: "box", x: CLX-100, y: 220, w: 200, h: 80, fill: "#1b2747", stroke: "var(--accent)", label: ["📱 Serviço A", "(cliente)"] },
    { id: "sv_box", type: "box", x: SRX-100, y: 220, w: 200, h: 80, fill: "#22315d", stroke: "var(--accent-2)", label: ["⚙️ Serviço B", "(dependência)"] },

    // Seta normal (CLOSED)
    { id: "req_ok",  type: "arrow", x1: CLX+100, y1: 260, x2: SRX-100, y2: 260, color: "var(--good)" },
    { id: "req_ok_l", type: "label", x: (CLX+SRX)/2, y: 243, anchor: "middle", sub: true, mono: true, label: "request → OK (200)" },
    { id: "resp_ok2", type: "arrow", x1: SRX-100, y1: 290, x2: CLX+100, y2: 290, color: "var(--good)" },
    { id: "resp_ok2_l", type: "label", x: (CLX+SRX)/2, y: 308, anchor: "middle", sub: true, mono: true, label: "response ← 200 ms" },

    // Contador de falhas
    { id: "fail_ctr", type: "box", x: CLX+140, y: 340, w: 240, h: 80, fill: "#1a1208", stroke: "var(--warn)",
      label: ["Contador de falhas", "████░░░░ 4/5"] },
    { id: "fail_bar", type: "vector", x: CLX+150, y: 350, w: 28, h: 60, values: [0.8], color: "var(--warn)" },
    { id: "fail_lbl", type: "label", x: CLX+240, y: 432, anchor: "middle", sub: true, label: "threshold: 5 falhas em 10s" },

    // Seta bloqueada (OPEN)
    { id: "req_blk",  type: "arrow", x1: CLX+100, y1: 480, x2: CLX+200, y2: 480, color: "var(--hot)" },
    { id: "req_blk_l", type: "label", x: CLX+150, y: 463, anchor: "middle", sub: true, mono: true, label: "request" },
    { id: "blk_box",   type: "box", x: CLX+210, y: 460, w: 160, h: 44, fill: "#3a1320", stroke: "var(--hot)", label: "⛔ OPEN: bloqueado" },
    { id: "fast_fail", type: "arrow", x1: CLX+210, y1: 500, x2: CLX+100, y2: 500, color: "var(--hot)" },
    { id: "fast_lbl",  type: "label", x: CLX+155, y: 518, anchor: "middle", sub: true, mono: true, label: "← 503 imediato" },

    // Timer OPEN
    { id: "timer_box", type: "box", x: SRX-100, y: 440, w: 200, h: 80, fill: "#22315d",
      label: ["⏱️ Timer OPEN", "aguardando 30s..."] },

    // Probe request (HALF-OPEN)
    { id: "probe_req",  type: "arrow", x1: CLX+100, y1: 620, x2: SRX-100, y2: 620, color: "var(--warn)" },
    { id: "probe_req_l", type: "label", x: (CLX+SRX)/2, y: 603, anchor: "middle", sub: true, mono: true, label: "probe request" },
    { id: "probe_ok",   type: "token", x: SRX-90, y: 636, w: 180, h: 36, fill: "#112318", stroke: "var(--good)", label: "✓ 200 OK → CLOSED" },
    { id: "probe_fail", type: "token", x: SRX-90, y: 680, w: 180, h: 36, fill: "#3a1320", stroke: "var(--hot)", label: "✗ falhou → OPEN" },

    /* ── CASCADE FAILURE SCENARIO ────────────────── */
    { id: "cascade_box", type: "box", x: 460, y: 56, w: 780, h: 140, fill: "#1a1208", stroke: "var(--hot)", rx: 10 },
    { id: "cascade_lbl", type: "label", x: 850, y: 76, anchor: "middle", label: "Sem Circuit Breaker: Falha em cascata" },
    { id: "casc1", type: "token", x: 480, y: 96,  w: 170, h: 36, fill: "#3a1320", stroke: "var(--hot)", label: "DB lento" },
    { id: "casc2", type: "token", x: 680, y: 96,  w: 170, h: 36, fill: "#3a1320", stroke: "var(--hot)", label: "Auth timeout" },
    { id: "casc3", type: "token", x: 880, y: 96,  w: 170, h: 36, fill: "#3a1320", stroke: "var(--hot)", label: "API esgotada" },
    { id: "casc4", type: "token", x: 1080,y: 96,  w: 170, h: 36, fill: "#3a1320", stroke: "var(--hot)", label: "Site fora!" },
    { id: "a_c12", type: "arrow", x1: 652, y1: 114, x2: 678, y2: 114, color: "var(--hot)" },
    { id: "a_c23", type: "arrow", x1: 852, y1: 114, x2: 878, y2: 114, color: "var(--hot)" },
    { id: "a_c34", type: "arrow", x1: 1052, y1: 114, x2: 1078, y2: 114, color: "var(--hot)" },
    { id: "cascade_desc", type: "label", x: 850, y: 156, anchor: "middle", sub: true,
      label: "Uma falha derruba todo o sistema por filas bloqueadas e threads esgotadas" },
  ];

  const steps = [
    {
      title: "O problema: falhas em cascata",
      show: ["cascade_box","cascade_lbl","casc1","casc2","casc3","casc4",
             "a_c12","a_c23","a_c34","cascade_desc"],
      highlight: ["casc4"],
      balloon: { anchor: "cascade_box", placement: "bottom",
        text: "Em sistemas distribuídos, uma falha num serviço lento faz com que outros serviços fiquem bloqueados esperando resposta. As threads se esgotam, as filas enchem e a falha se propaga em <strong>cascata</strong> — derrubando tudo.",
        why: "O Circuit Breaker foi criado especificamente para cortar essa cascata: ao detectar que um serviço está falhando, ele para de chamar o serviço imediatamente, evitando que o problema se alastre.",
        deep: `<p>O mecanismo clássico é simples de entender em números: um pool de 200 threads, cada uma bloqueada por 30s esperando um serviço lento responder — em menos de 7 segundos o pool inteiro está ocupado, e toda requisição nova (mesmo para endpoints saudáveis) fica na fila.</p>
<div class="xp-bad"><strong>Sem proteção</strong>Serviço A → chama Serviço B (lento) → thread de A bloqueada
Serviço C → chama Serviço A → thread de C também bloqueada
Resultado: C também fica indisponível, mesmo nunca tendo falado com B</div>
<p>Esse é o efeito "thundering" da falha em cascata: um problema local em B se propaga para A, depois para C, e assim por diante — um serviço lento é, na prática, pior que um serviço fora do ar, porque continua consumindo recursos até o timeout.</p>` },
      enter: (ctx) => {
        ["casc1","casc2","casc3","casc4"].forEach((id, i) => setTimeout(() => ctx.show(id), i * 150));
        setTimeout(() => { ["a_c12","a_c23","a_c34"].forEach((id, i) => setTimeout(() => ctx.drawArrow(id), i * 100)); }, 600);
      },
    },
    {
      title: "O padrão Circuit Breaker",
      show: ["st_lbl", "st_closed", "st_open", "st_halfopen"],
      highlight: ["st_closed"],
      balloon: { anchor: "st_closed", placement: "right",
        text: "O Circuit Breaker é uma <strong>máquina de estados</strong> com três estados: <strong>CLOSED</strong> (circuito fechado, tráfego normal), <strong>OPEN</strong> (circuito aberto, tráfego bloqueado) e <strong>HALF-OPEN</strong> (testando se o serviço recuperou).",
        why: "O nome vem dos disjuntores elétricos: quando detecta sobrecarga, abre o circuito para proteger o sistema. Quando a tensão normaliza, pode ser testado novamente.",
        deep: `<p>O padrão foi popularizado pela Netflix com a biblioteca Hystrix (hoje descontinuada em favor de <code>resilience4j</code> no ecossistema Java, ou implementações equivalentes em outras linguagens). A ideia central é sempre a mesma: envolver toda chamada a um serviço externo com um objeto que decide, antes de chamar, se vale a pena tentar.</p>
<h4>As três transições possíveis</h4>
<ul>
<li><strong>CLOSED → OPEN</strong> — quando a taxa de falhas cruza um threshold configurado</li>
<li><strong>OPEN → HALF-OPEN</strong> — automaticamente, após um timer de espera</li>
<li><strong>HALF-OPEN → CLOSED ou OPEN</strong> — depende do resultado da requisição de teste (probe)</li>
</ul>
<p>Diferente de um <code>try/catch</code> simples, o Circuit Breaker tem memória: ele lembra o histórico recente de falhas para decidir se ainda vale tentar.</p>` },
    },
    {
      title: "Estado CLOSED: operação normal",
      show: ["cl_box", "sv_box", "req_ok", "req_ok_l", "resp_ok2", "resp_ok2_l"],
      highlight: ["st_closed", "req_ok"],
      balloon: { anchor: "st_closed", placement: "right",
        text: "No estado <strong>CLOSED</strong>, todas as requisições passam normalmente para o serviço dependente. O Circuit Breaker monitora cada chamada: tempo de resposta, códigos de erro e timeouts.",
        why: "Em CLOSED, o CB é quase transparente — apenas um interceptador que observa. O overhead é mínimo (uma comparação de contador por chamada).",
        deep: `<p>Implementações reais como resilience4j calculam a taxa de falha sobre uma janela deslizante (por número de chamadas ou por tempo), não sobre o total desde o início — assim uma falha isolada há uma hora não conta contra o serviço hoje.</p>
<div class="xp-example"><strong>Config típica (resilience4j)</strong>failureRateThreshold: 50%
slidingWindowSize: 10 (últimas 10 chamadas)
minimumNumberOfCalls: 5 (não avalia antes disso)</div>
<p>O <code>minimumNumberOfCalls</code> evita abrir o circuito com base em amostra pequena: 1 falha em 1 chamada seria 100%, mas estatisticamente irrelevante. Só depois de um volume mínimo de chamadas o CB começa a confiar na taxa calculada.</p>` },
      enter: (ctx) => {
        ctx.drawArrow("req_ok");
        setTimeout(() => ctx.drawArrow("resp_ok2"), 500);
      },
    },
    {
      title: "Falhas acumulam no contador",
      show: ["fail_ctr", "fail_bar", "fail_lbl"],
      highlight: ["fail_ctr", "st_closed"],
      balloon: { anchor: "fail_ctr", placement: "top",
        text: "A cada falha (timeout, 5xx, exception), o <strong>contador de falhas</strong> incrementa. Quando atinge o <strong>threshold</strong> (ex.: 5 falhas em 10 segundos), o CB transita para OPEN.",
        why: "O threshold evita que uma falha isolada abra o circuito. Configurar threshold muito baixo causa falsos positivos; muito alto demora a proteger. Ajuste baseado no SLA do serviço.",
        deep: `<p>Nem todo erro deveria contar igual. Um 404 de "recurso não encontrado" é uma resposta válida do serviço — não indica que ele está com problema. Já um timeout, 503 ou connection refused são sinais reais de degradação e devem contar para o contador.</p>
<div class="xp-good"><strong>Conte como falha</strong>Timeout, 5xx, connection refused, circuit já aberto de uma dependência</div>
<div class="xp-bad"><strong>Não conte como falha</strong>404 (recurso não existe), 400 (request inválido do próprio cliente) — são respostas corretas do serviço, não indícios de indisponibilidade</div>
<p>Classificar mal os erros é uma causa comum de circuit breaker "nervoso" — abrindo com muita frequência mesmo com o serviço saudável.</p>` },
      enter: (ctx) => {
        ctx.setBars("fail_bar", [0.4]);
        setTimeout(() => ctx.setBars("fail_bar", [0.6]), 300);
        setTimeout(() => ctx.setBars("fail_bar", [0.8]), 600);
      },
    },
    {
      title: "Threshold atingido → OPEN",
      show: ["a_co", "lbl_co"],
      highlight: ["st_open", "a_co"],
      balloon: { anchor: "st_open", placement: "right",
        text: "Com o threshold atingido, o CB transita para <strong>OPEN</strong>. A partir daqui, ele rejeita <em>todas</em> as chamadas imediatamente, sem tentar contactar o serviço dependente.",
        why: "Fail fast em OPEN é intencional: melhor retornar um erro instantâneo do que bloquear threads por segundos esperando um serviço que sabemos estar falhando.",
        deep: `<p>A transição em si é barata — é só uma mudança de estado em memória — mas o efeito é imediato em todo o sistema: a partir do próximo milissegundo, nenhuma chamada nova consome uma thread ou uma conexão esperando o serviço problemático.</p>
<div class="xp-example"><strong>Evento de transição (log típico)</strong>[CircuitBreaker "pagamentos-api"] state transition: CLOSED -> OPEN
failureRate: 62% (threshold: 50%), lastFailure: TimeoutException</div>
<p>É comum emitir uma métrica ou alerta nesse momento exato — a abertura do circuito é um sinal valioso de que uma dependência está degradada, e times de observabilidade costumam monitorar transições de estado do CB como um indicador de saúde do sistema.</p>` },
      enter: (ctx) => { ctx.drawArrow("a_co"); },
    },
    {
      title: "Estado OPEN: fast-fail sem chamar o serviço",
      show: ["req_blk", "req_blk_l", "blk_box", "fast_fail", "fast_lbl", "timer_box"],
      highlight: ["st_open", "blk_box"],
      balloon: { anchor: "blk_box", placement: "top",
        text: "Em <strong>OPEN</strong>, o CB intercepta a chamada e responde com <strong>503 imediato</strong> — sem nem tentar contactar o Serviço B. Um timer conta o tempo de espera (ex.: 30 segundos).",
        why: "O cliente recebe um erro rápido e pode tomar uma ação alternativa: retornar dados do cache, mostrar mensagem de manutenção ou redirecionar para backup.",
        deep: `<p>O erro rápido não precisa ser o fim da história para o usuário — o padrão fica bem mais forte combinado com um <strong>fallback</strong>: uma função alternativa que o CB chama automaticamente quando rejeita a requisição.</p>
<div class="xp-example"><strong>Fallback comum</strong>catch (CallNotPermittedException e) {
  return cache.getLastKnownGoodValue(); // ou um valor default
}</div>
<h4>Fallbacks típicos por caso</h4>
<ul>
<li>Recomendações de produto → lista genérica em cache em vez de personalizada</li>
<li>Preço em tempo real → último preço conhecido, com aviso de "pode estar desatualizado"</li>
<li>Feature não-crítica → simplesmente omitir da tela em vez de quebrar a página inteira</li>
</ul>` },
      enter: (ctx) => {
        ctx.drawArrow("req_blk");
        setTimeout(() => ctx.drawArrow("fast_fail"), 400);
      },
    },
    {
      title: "Timer expira → HALF-OPEN",
      show: ["a_oh", "lbl_oh"],
      highlight: ["st_halfopen", "a_oh"],
      balloon: { anchor: "st_halfopen", placement: "right",
        text: "Após o timer de espera expirar, o CB transita para <strong>HALF-OPEN</strong>: ele permite que <em>uma única</em> requisição de teste (probe) passe para o serviço dependente.",
        why: "HALF-OPEN é o mecanismo de auto-recuperação: o CB verifica periodicamente se o serviço voltou a funcionar, sem precisar de intervenção humana para reativar.",
        deep: `<p>O tempo de espera fixo (ex.: sempre 30s) funciona, mas muitas implementações preferem <strong>back-off exponencial</strong>: se a primeira probe falhar, o próximo timer é maior (30s, depois 60s, depois 120s...), evitando bombardear repetidamente um serviço que está demorando para se recuperar.</p>
<div class="xp-example"><strong>Back-off exponencial com jitter</strong>tentativa 1: espera 30s
tentativa 2: espera 60s ± jitter aleatório
tentativa 3: espera 120s ± jitter aleatório</div>
<p>O <em>jitter</em> (variação aleatória) evita que múltiplas instâncias do mesmo cliente, todas com CB aberto ao mesmo tempo, façam a probe exatamente no mesmo segundo — o que criaria um mini pico de carga sincronizado no serviço que está se recuperando.</p>` },
      enter: (ctx) => { ctx.drawArrow("a_oh"); },
    },
    {
      title: "Probe: testando se o serviço recuperou",
      show: ["probe_req", "probe_req_l", "probe_ok", "probe_fail"],
      highlight: ["st_halfopen", "probe_req"],
      balloon: { anchor: "probe_req", placement: "top",
        text: "O <strong>probe request</strong> vai ao Serviço B. Se retornar sucesso (2xx dentro do timeout), o CB transita para CLOSED — tráfego normal é retomado. Se falhar, volta para OPEN e o timer recomeça.",
        why: "Uma probe é suficiente — não é necessário aquecer com múltiplas chamadas. Isso minimiza a carga no serviço que está se recuperando.",
        deep: `<p>Algumas implementações (resilience4j incluso) permitem configurar um pequeno número de chamadas permitidas em HALF-OPEN em vez de exatamente uma — por exemplo, 3 a 5 — para ter uma amostra um pouco mais confiável antes de decidir, sem chegar a reabrir totalmente o tráfego.</p>
<div class="xp-example"><strong>Config com múltiplas probes</strong>permittedNumberOfCallsInHalfOpenState: 3
# das 3, se >= 50% falharem → volta pra OPEN; senão → CLOSED</div>
<p>O trade-off é direto: mais probes dão mais confiança na decisão, mas colocam mais carga num serviço que ainda pode estar frágil. Para dependências críticas ou sensíveis a carga, uma única probe costuma ser a escolha mais conservadora.</p>` },
      enter: (ctx) => { ctx.drawArrow("probe_req"); },
    },
    {
      title: "Sucesso → volta a CLOSED",
      show: ["a_hc", "lbl_hc"],
      highlight: ["st_closed", "a_hc"],
      balloon: { anchor: "st_closed", placement: "right",
        text: "Probe bem-sucedido → CB transita de HALF-OPEN para <strong>CLOSED</strong>. O tráfego normal é retomado gradualmente. O contador de falhas é zerado.",
        why: "A recuperação é automática: o sistema se auto-cura sem intervenção humana. Isso é fundamental para alta disponibilidade em microservices.",
        deep: `<p>"Gradualmente" é a palavra-chave: alguns sistemas fazem toda a fila de requisições retomar de uma vez ao fechar o circuito, o que pode sobrecarregar de novo um serviço que só acabou de voltar. Um padrão mais cuidadoso é combinar o CB com um <strong>rate limiter</strong> logo após o fechamento, para "aquecer" o tráfego de volta gradualmente.</p>
<div class="xp-example"><strong>Log de recuperação</strong>[CircuitBreaker "pagamentos-api"] state transition: HALF_OPEN -> CLOSED
probe succeeded in 84ms, resuming normal traffic</div>
<p>Zerar o contador de falhas ao fechar é importante para não carregar "cicatrizes" do incidente anterior — o CB deve julgar o serviço pelo comportamento atual, não pelo histórico de uma falha já resolvida.</p>` },
      enter: (ctx) => { ctx.drawArrow("a_hc"); },
    },
    {
      title: "Falha na probe → volta a OPEN",
      show: ["a_ho", "lbl_ho"],
      highlight: ["st_open", "a_ho"],
      balloon: { anchor: "st_open", placement: "left",
        text: "Se a probe falhar, o CB volta para <strong>OPEN</strong> e o timer recomeça. O serviço ainda não recuperou — o sistema aguarda mais um ciclo antes de tentar novamente.",
        why: "Back-off exponencial pode ser implementado: primeiro espera 30s, depois 60s, depois 120s. Isso evita sobrecarregar um serviço que está tentando se recuperar.",
        deep: `<p>Esse ciclo HALF-OPEN → OPEN pode se repetir várias vezes durante um incidente prolongado — e cada repetição é informação valiosa. Times costumam registrar quantas vezes o circuito "tentou e falhou" como parte do runbook de incidente, para saber se o serviço está piorando, estável ou já dando sinais de melhora.</p>
<div class="xp-bad"><strong>Anti-padrão</strong>Resetar o CB manualmente para CLOSED durante o incidente "para ver se já melhorou" — sobrescreve a proteção e pode gerar nova cascata</div>
<div class="xp-good"><strong>Prática recomendada</strong>Deixar o CB seguir seu ciclo automático de probes; investigar a causa raiz da falha em paralelo, sem forçar o estado</div>` },
      enter: (ctx) => { ctx.drawArrow("a_ho"); },
    },
    {
      title: "Quiz rápido",
      balloon: { anchor: { x: 640, y: 360 }, placement: "right",
        text: "Confirme o que você aprendeu sobre Circuit Breaker 👇" },
      quiz: {
        question: "Por que o estado HALF-OPEN envia apenas UMA requisição de probe (e não várias)?",
        options: [
          "Para economizar bandwidth — múltiplas probes consumiriam muitos recursos de rede",
          "Para minimizar a carga em um serviço que está se recuperando; uma probe é suficiente para verificar",
          "Porque o protocolo HTTP não suporta requisições paralelas em HALF-OPEN",
          "Para garantir que o serviço cliente não espere mais de uma resposta simultânea",
        ],
        answer: 1,
        explain: "Um serviço em recuperação pode estar frágil — sobrecarregá-lo com múltiplas probes pode derrubá-lo novamente. Uma única probe é suficiente: se passar, o serviço está estável; se falhar, volta a OPEN.",
      },
    },
    {
      title: "Resumo: Circuit Breaker",
      highlight: ["st_closed", "st_open", "st_halfopen"],
      balloon: { anchor: { x: 130, y: 400 }, placement: "right",
        text: "<strong>CLOSED</strong>: tráfego normal, monitora falhas. <strong>OPEN</strong>: bloqueia tudo, fast-fail, aguarda timer. <strong>HALF-OPEN</strong>: probe única — sucesso → CLOSED, falha → OPEN. Evita cascata e permite auto-recuperação.",
        why: "Circuit Breaker é essencial em microservices: cada serviço depende de outros, e sem CB, uma falha isolada derruba o sistema inteiro. Com CB, cada serviço falha de forma controlada e se recupera automaticamente." },
      enter: (ctx) => {
        ["st_closed","st_open","st_halfopen"].forEach((id, k) => setTimeout(() => ctx.pulse(id, true), k * 120));
      },
    },
  ];

  window.CIRCUIT_BREAKER_DIAGRAM = {
    title: "Circuit Breaker — Resiliência de serviços",
    subtitle: "CLOSED → OPEN → HALF-OPEN: evitar falhas em cascata",
    width: W, height: H, autoplayMs: 9000, elements, steps,
  };
})();
