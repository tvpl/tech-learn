/* related.js — barra de "próximos explicadores" injetada em todas as páginas */
(function () {
  const MAP = {
    "transformer.html":       [["rag.html","RAG"],["context-eng.html","Engenharia de Contexto"],["prompt-eng.html","Engenharia de Prompt"],["mcp.html","Model Context Protocol"]],
    "rag.html":               [["transformer.html","Transformer"],["mcp.html","MCP"],["context-eng.html","Contexto"],["subagents.html","SubAgentes"]],
    "mcp.html":               [["subagents.html","SubAgentes"],["skills.html","Skills"],["guardrails.html","Guardrails"],["specs.html","Specs"]],
    "subagents.html":         [["mcp.html","MCP"],["skills.html","Skills"],["sdd.html","SDD"],["specs.html","Specs"]],
    "context-eng.html":       [["transformer.html","Transformer"],["rag.html","RAG"],["prompt-eng.html","Prompt Eng"],["specs.html","Specs"]],
    "prompt-eng.html":        [["context-eng.html","Contexto"],["transformer.html","Transformer"],["rag.html","RAG"],["guardrails.html","Guardrails"]],
    "guardrails.html":        [["mcp.html","MCP"],["skills.html","Skills"],["specs.html","Specs"],["prompt-eng.html","Prompt Eng"]],
    "skills.html":            [["mcp.html","MCP"],["subagents.html","SubAgentes"],["sdd.html","SDD"],["guardrails.html","Guardrails"]],
    "sdd.html":               [["skills.html","Skills"],["specs.html","Specs"],["subagents.html","SubAgentes"],["guardrails.html","Guardrails"]],
    "specs.html":             [["sdd.html","SDD"],["skills.html","Skills"],["mcp.html","MCP"],["guardrails.html","Guardrails"]],
    "http.html":              [["tcp.html","TCP/IP"],["websocket.html","WebSocket"],["ingress.html","Ingress"],["rate-limit.html","Rate Limit"]],
    "tcp.html":               [["http.html","HTTP"],["websocket.html","WebSocket"],["kubernetes.html","Kubernetes"],["circuit-breaker.html","Circuit Breaker"]],
    "iso8583.html":           [["http.html","HTTP"],["async-redis-kafka.html","Async Redis/Kafka"],["rds.html","RDS"],["rate-limit.html","Rate Limit"]],
    "websocket.html":         [["http.html","HTTP"],["tcp.html","TCP/IP"],["grpc.html","gRPC"],["async-redis-kafka.html","Async Redis/Kafka"]],
    "grpc.html":              [["websocket.html","WebSockets"],["http.html","HTTP"],["kubernetes.html","Kubernetes"],["rate-limit.html","Rate Limit"]],
    "oauth.html":             [["jwt.html","JWT"],["sso.html","SSO"],["sessions.html","Sessions"],["mfa.html","MFA/2FA"]],
    "jwt.html":               [["oauth.html","OAuth 2.0"],["sso.html","SSO"],["sessions.html","Sessions"],["api-keys.html","API Keys"]],
    "sso.html":               [["oauth.html","OAuth 2.0"],["jwt.html","JWT"],["mfa.html","MFA/2FA"],["sessions.html","Sessions"]],
    "sessions.html":          [["jwt.html","JWT"],["api-keys.html","API Keys"],["http.html","HTTP"],["oauth.html","OAuth 2.0"]],
    "api-keys.html":          [["sessions.html","Sessions"],["jwt.html","JWT"],["rate-limit.html","Rate Limit"],["oauth.html","OAuth 2.0"]],
    "mfa.html":               [["sso.html","SSO"],["oauth.html","OAuth 2.0"],["jwt.html","JWT"],["sessions.html","Sessions"]],
    "consistent-hashing.html":[["hashmap.html","Hash Map"],["blockchain.html","Blockchain"],["kubernetes.html","Kubernetes"],["rds.html","RDS"]],
    "blockchain.html":        [["consistent-hashing.html","Consistent Hashing"],["tcp.html","TCP/IP"],["circuit-breaker.html","Circuit Breaker"],["hashmap.html","Hash Map"]],
    "kubernetes.html":        [["eks.html","Amazon EKS"],["ingress.html","Ingress"],["circuit-breaker.html","Circuit Breaker"],["rate-limit.html","Rate Limit"]],
    "eks.html":               [["kubernetes.html","Kubernetes"],["rds.html","RDS"],["ingress.html","Ingress"],["circuit-breaker.html","Circuit Breaker"]],
    "rds.html":               [["eks.html","EKS"],["kubernetes.html","Kubernetes"],["async-redis-kafka.html","Async Redis/Kafka"],["circuit-breaker.html","Circuit Breaker"]],
    "ingress.html":           [["kubernetes.html","Kubernetes"],["eks.html","EKS"],["circuit-breaker.html","Circuit Breaker"],["rate-limit.html","Rate Limit"]],
    "circuit-breaker.html":   [["rate-limit.html","Rate Limit"],["ingress.html","Ingress"],["kubernetes.html","Kubernetes"],["async-redis-kafka.html","Async Redis/Kafka"]],
    "rate-limit.html":        [["circuit-breaker.html","Circuit Breaker"],["ingress.html","Ingress"],["http.html","HTTP"],["kubernetes.html","Kubernetes"]],
    "async-redis-kafka.html": [["circuit-breaker.html","Circuit Breaker"],["rate-limit.html","Rate Limit"],["virtual-threads.html","Virtual Threads"],["rds.html","RDS"]],
    "virtual-threads.html":   [["async-redis-kafka.html","Async Redis/Kafka"],["http.html","HTTP"],["kubernetes.html","Kubernetes"],["circuit-breaker.html","Circuit Breaker"]],
    "hashmap.html":           [["busca-binaria.html","Busca Binária"],["recursao.html","Recursão"],["transformer.html","Transformer"],["rag.html","RAG"]],
    "busca-binaria.html":     [["hashmap.html","Hash Map"],["recursao.html","Recursão"],["transformer.html","Transformer"],["rag.html","RAG"]],
    "recursao.html":          [["busca-binaria.html","Busca Binária"],["hashmap.html","Hash Map"],["virtual-threads.html","Virtual Threads"],["async-redis-kafka.html","Async Redis/Kafka"]],
    "git.html":               [["sdd.html","SDD"],["specs.html","Specs"],["http.html","HTTP"],["kubernetes.html","Kubernetes"]],
  };

  const page = location.pathname.split('/').pop();
  const links = MAP[page];
  if (!links) return;

  const style = document.createElement('style');
  style.textContent = `
    .xp-related {
      position: fixed; bottom: 0; left: 290px; right: 0; z-index: 20;
      background: linear-gradient(0deg, var(--bg) 60%, transparent);
      padding: 12px 24px 14px;
      display: flex; align-items: center; gap: 12px;
      pointer-events: none;
      transform: translateY(100%);
      transition: transform .4s cubic-bezier(.22,1,.36,1);
    }
    .xp-related.is-visible { transform: translateY(0); pointer-events: auto; }
    .xp-related-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.2px; color: var(--muted); white-space: nowrap; }
    .xp-related a {
      font-size: 13px; font-weight: 500;
      color: var(--ink-soft); text-decoration: none;
      background: var(--panel); border: 1px solid var(--line);
      padding: 6px 14px; border-radius: 999px;
      transition: all .22s cubic-bezier(.22,1,.36,1);
      white-space: nowrap;
    }
    .xp-related a:hover { color: var(--ink); border-color: var(--accent); background: var(--panel-2); transform: translateY(-2px); }
    @media (max-width: 880px) { .xp-related { left: 0; } }
  `;
  document.head.appendChild(style);

  const bar = document.createElement('div');
  bar.className = 'xp-related';
  bar.innerHTML = `<span class="xp-related-label">Próximos →</span>` +
    links.map(([href, label]) => `<a href="${href}">${label} →</a>`).join('');
  document.body.appendChild(bar);

  // show bar when user reaches the last step (progress bar fills) or after 20s
  let shown = false;
  function showBar() {
    if (shown) return;
    shown = true;
    bar.classList.add('is-visible');
  }

  // observe progress bar width
  const observer = new MutationObserver(() => {
    const prog = document.querySelector('.xp-progress > span');
    if (prog && parseFloat(prog.style.width) >= 90) showBar();
  });
  setTimeout(() => {
    const prog = document.querySelector('.xp-progress');
    if (prog) observer.observe(prog.firstElementChild || prog, { attributes: true, attributeFilter: ['style'] });
  }, 1000);

  // fallback: show after 30s
  setTimeout(showBar, 30000);
})();
