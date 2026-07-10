(function () {
  const W = 1280, H = 720;

  /* ── Layout ── */
  // 5 horizontal layers stacked vertically
  const LW = 1160, LX = 60;
  const layers = [
    { id: "lay_inet",   y: 60,  h: 70,  label: "Internet",            color: "var(--muted)",    textColor: "var(--ink-soft)" },
    { id: "lay_lb",     y: 160, h: 70,  label: "Load Balancer (L4)",  color: "var(--accent)",   textColor: "#fff" },
    { id: "lay_ic",     y: 260, h: 70,  label: "Ingress Controller",  color: "var(--accent-2)", textColor: "#fff" },
    { id: "lay_svc",    y: 360, h: 70,  label: "Services (ClusterIP)",color: "var(--good)",     textColor: "#fff" },
    { id: "lay_pods",   y: 460, h: 70,  label: "Pods",                color: "var(--warn)",     textColor: "#fff" },
  ];

  // Service + pod boxes
  const SVC = [
    { id: "svc_a", x: 200, label: "svc-frontend", port: ":80"  },
    { id: "svc_b", x: 500, label: "svc-api",      port: ":8080" },
    { id: "svc_c", x: 800, label: "svc-admin",    port: ":3000" },
  ];
  const PODS = [
    { id: "pod_a1", x: 150 }, { id: "pod_a2", x: 280 },
    { id: "pod_b1", x: 450 }, { id: "pod_b2", x: 580 },
    { id: "pod_c1", x: 750 }, { id: "pod_c2", x: 880 },
  ];

  const elements = [
    // ── Title ──
    { id: "title_main", type: "label", x: W / 2, y: 36, label: "Kubernetes Ingress", style: "font-size:22px;font-weight:700;fill:var(--ink)" },

    // ── Layers ──
    ...layers.map(l => ({
      id: l.id, type: "box", x: LX, y: l.y, w: LW, h: l.h, rx: 8,
      style: `fill:${l.color};opacity:0.18`
    })),
    ...layers.map(l => ({
      id: l.id + "_lbl", type: "label", x: LX + 90, y: l.y + l.h / 2 + 5, label: l.label,
      style: `font-size:13px;font-weight:600;fill:${l.textColor};text-anchor:start`
    })),

    // ── Internet user ──
    { id: "user_box", type: "box", x: 560, y: 68, w: 160, h: 54, rx: 28, style: "fill:var(--muted);opacity:0.3" },
    { id: "user_lbl", type: "label", x: 640, y: 95 + 5, label: "User / Browser", style: "font-size:12px;fill:var(--ink-soft)" },

    // ── LB ──
    { id: "lb_box", type: "box", x: 560, y: 166, w: 160, h: 58, rx: 8, style: "fill:var(--accent);opacity:0.8" },
    { id: "lb_lbl", type: "label", x: 640, y: 195 + 5, label: "AWS ALB / GCP LB", style: "font-size:12px;fill:#fff;font-weight:600" },

    // ── Ingress Controller ──
    { id: "ic_box", type: "box", x: 500, y: 266, w: 280, h: 58, rx: 8, style: "fill:var(--accent-2);opacity:0.85" },
    { id: "ic_lbl", type: "label", x: 640, y: 295 + 5, label: "nginx / traefik / HAProxy", style: "font-size:12px;fill:#fff;font-weight:600" },
    { id: "ic_pod_lbl", type: "label", x: 640, y: 335, label: "Roda como Pod no cluster", style: "font-size:11px;fill:var(--ink-soft)" },

    // ── Services ──
    ...SVC.map(s => ({ id: s.id, type: "box", x: s.x, y: 366, w: 180, h: 58, rx: 8, style: "fill:var(--good);opacity:0.8" })),
    ...SVC.map(s => ({ id: s.id + "_lbl", type: "label", x: s.x + 90, y: 390 + 5, label: s.label + "\n" + s.port, style: "font-size:11px;fill:#fff;font-weight:600" })),
    ...SVC.map(s => ({ id: s.id + "_port", type: "label", x: s.x + 90, y: 406, label: s.port, style: "font-size:10px;fill:#eee" })),

    // ── Pods ──
    ...PODS.map(p => ({ id: p.id, type: "box", x: p.x, y: 466, w: 100, h: 54, rx: 24, style: "fill:var(--warn);opacity:0.7" })),
    ...PODS.map(p => ({ id: p.id + "_lbl", type: "label", x: p.x + 50, y: 493 + 5, label: "Pod", style: "font-size:11px;fill:#fff;font-weight:600" })),

    // ── Arrows user → lb → ic → svc ──
    { id: "arr_u_lb",  type: "arrow", x1: 640, y1: 122, x2: 640, y2: 166, style: "stroke:var(--accent);stroke-width:2" },
    { id: "arr_lb_ic", type: "arrow", x1: 640, y1: 224, x2: 640, y2: 266, style: "stroke:var(--accent-2);stroke-width:2" },
    { id: "arr_ic_a",  type: "arrow", x1: 580, y1: 324, x2: 290, y2: 366, style: "stroke:var(--good);stroke-width:1.5" },
    { id: "arr_ic_b",  type: "arrow", x1: 640, y1: 324, x2: 590, y2: 366, style: "stroke:var(--good);stroke-width:1.5" },
    { id: "arr_ic_c",  type: "arrow", x1: 700, y1: 324, x2: 890, y2: 366, style: "stroke:var(--good);stroke-width:1.5" },

    // ── Service → Pod arrows ──
    { id: "arr_a_p1", type: "arrow", x1: 250, y1: 424, x2: 200, y2: 466, style: "stroke:var(--warn);stroke-width:1.5" },
    { id: "arr_a_p2", type: "arrow", x1: 310, y1: 424, x2: 330, y2: 466, style: "stroke:var(--warn);stroke-width:1.5" },
    { id: "arr_b_p1", type: "arrow", x1: 540, y1: 424, x2: 500, y2: 466, style: "stroke:var(--warn);stroke-width:1.5" },
    { id: "arr_b_p2", type: "arrow", x1: 610, y1: 424, x2: 630, y2: 466, style: "stroke:var(--warn);stroke-width:1.5" },
    { id: "arr_c_p1", type: "arrow", x1: 840, y1: 424, x2: 800, y2: 466, style: "stroke:var(--warn);stroke-width:1.5" },
    { id: "arr_c_p2", type: "arrow", x1: 920, y1: 424, x2: 930, y2: 466, style: "stroke:var(--warn);stroke-width:1.5" },

    // ── Ingress Resource panel (right side) ──
    { id: "ing_res_panel", type: "box", x: 1020, y: 60, w: 230, h: 480, rx: 10, style: "fill:var(--surface);stroke:var(--accent-2);stroke-width:1.5" },
    { id: "ing_res_title", type: "label", x: 1135, y: 80, label: "Ingress Resource (YAML)", style: "font-size:11px;font-weight:700;fill:var(--accent-2)" },
    { id: "ing_yaml1", type: "label", x: 1040, y: 104, label: "apiVersion: networking.k8s.io/v1", style: "font-size:9px;font-family:monospace;fill:var(--ink-soft);text-anchor:start" },
    { id: "ing_yaml2", type: "label", x: 1040, y: 120, label: "kind: Ingress", style: "font-size:9px;font-family:monospace;fill:var(--ink-soft);text-anchor:start" },
    { id: "ing_yaml3", type: "label", x: 1040, y: 136, label: "metadata:", style: "font-size:9px;font-family:monospace;fill:var(--ink-soft);text-anchor:start" },
    { id: "ing_yaml4", type: "label", x: 1040, y: 152, label: "  name: my-ingress", style: "font-size:9px;font-family:monospace;fill:var(--ink);text-anchor:start" },
    { id: "ing_yaml5", type: "label", x: 1040, y: 168, label: "spec:", style: "font-size:9px;font-family:monospace;fill:var(--ink-soft);text-anchor:start" },
    { id: "ing_yaml6", type: "label", x: 1040, y: 184, label: "  rules:", style: "font-size:9px;font-family:monospace;fill:var(--ink-soft);text-anchor:start" },
    { id: "ing_yaml7", type: "label", x: 1040, y: 200, label: "  - host: app.com", style: "font-size:9px;font-family:monospace;fill:var(--accent);text-anchor:start" },
    { id: "ing_yaml8", type: "label", x: 1040, y: 216, label: "    http:", style: "font-size:9px;font-family:monospace;fill:var(--ink-soft);text-anchor:start" },
    { id: "ing_yaml9", type: "label", x: 1040, y: 232, label: "      paths:", style: "font-size:9px;font-family:monospace;fill:var(--ink-soft);text-anchor:start" },
    { id: "ing_yaml10", type: "label", x: 1040, y: 248, label: "      - path: /api", style: "font-size:9px;font-family:monospace;fill:var(--good);text-anchor:start" },
    { id: "ing_yaml11", type: "label", x: 1040, y: 264, label: "        backend:", style: "font-size:9px;font-family:monospace;fill:var(--ink-soft);text-anchor:start" },
    { id: "ing_yaml12", type: "label", x: 1040, y: 280, label: "          service:", style: "font-size:9px;font-family:monospace;fill:var(--ink-soft);text-anchor:start" },
    { id: "ing_yaml13", type: "label", x: 1040, y: 296, label: "            name: svc-api", style: "font-size:9px;font-family:monospace;fill:var(--good);text-anchor:start" },
    { id: "ing_yaml14", type: "label", x: 1040, y: 312, label: "            port: 8080", style: "font-size:9px;font-family:monospace;fill:var(--good);text-anchor:start" },
    { id: "ing_tls_yaml", type: "label", x: 1040, y: 340, label: "  tls:", style: "font-size:9px;font-family:monospace;fill:var(--ink-soft);text-anchor:start" },
    { id: "ing_tls_yaml2", type: "label", x: 1040, y: 356, label: "  - hosts: [app.com]", style: "font-size:9px;font-family:monospace;fill:var(--accent-2);text-anchor:start" },
    { id: "ing_tls_yaml3", type: "label", x: 1040, y: 372, label: "    secretName: tls-cert", style: "font-size:9px;font-family:monospace;fill:var(--accent-2);text-anchor:start" },

    // annotations
    { id: "ing_ann_title", type: "label", x: 1040, y: 400, label: "Annotations:", style: "font-size:9px;font-family:monospace;fill:var(--ink-soft);text-anchor:start" },
    { id: "ing_ann1", type: "label", x: 1040, y: 416, label: "nginx.ingress.k8s.io/", style: "font-size:9px;font-family:monospace;fill:var(--hot);text-anchor:start" },
    { id: "ing_ann2", type: "label", x: 1040, y: 432, label: "  rewrite-target: /", style: "font-size:9px;font-family:monospace;fill:var(--hot);text-anchor:start" },
    { id: "ing_ann3", type: "label", x: 1040, y: 448, label: "  rate-limit: 100rps", style: "font-size:9px;font-family:monospace;fill:var(--hot);text-anchor:start" },
    { id: "ing_ann4", type: "label", x: 1040, y: 464, label: "  auth-url: /auth", style: "font-size:9px;font-family:monospace;fill:var(--hot);text-anchor:start" },

    // ── Routing highlight overlays ──
    { id: "route_host", type: "box", x: 130, y: 258, w: 200, h: 80, rx: 6, style: "fill:none;stroke:var(--accent);stroke-width:2;stroke-dasharray:5,4" },
    { id: "route_host_lbl", type: "label", x: 230, y: 282, label: "Host-based", style: "font-size:12px;font-weight:700;fill:var(--accent)" },
    { id: "route_host_lbl2", type: "label", x: 230, y: 302, label: "app.com → svc-frontend", style: "font-size:10px;fill:var(--accent)" },
    { id: "route_host_lbl3", type: "label", x: 230, y: 322, label: "api.com → svc-api", style: "font-size:10px;fill:var(--accent)" },

    { id: "route_path", type: "box", x: 130, y: 258, w: 200, h: 80, rx: 6, style: "fill:none;stroke:var(--good);stroke-width:2;stroke-dasharray:5,4" },
    { id: "route_path_lbl", type: "label", x: 230, y: 282, label: "Path-based", style: "font-size:12px;font-weight:700;fill:var(--good)" },
    { id: "route_path_lbl2", type: "label", x: 230, y: 302, label: "app.com/ → svc-frontend", style: "font-size:10px;fill:var(--good)" },
    { id: "route_path_lbl3", type: "label", x: 230, y: 322, label: "app.com/api → svc-api", style: "font-size:10px;fill:var(--good)" },

    // ── TLS panel ──
    { id: "tls_panel", type: "box", x: 130, y: 258, w: 340, h: 80, rx: 6, style: "fill:var(--accent-2);opacity:0.15;stroke:var(--accent-2);stroke-width:2" },
    { id: "tls_lbl", type: "label", x: 300, y: 282, label: "TLS Termination no Ingress", style: "font-size:12px;font-weight:700;fill:var(--accent-2)" },
    { id: "tls_lbl2", type: "label", x: 300, y: 302, label: "HTTPS → HTTP interno", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "tls_lbl3", type: "label", x: 300, y: 322, label: "cert-manager renova TLS automático", style: "font-size:11px;fill:var(--accent-2)" },

    // ── Gateway API comparison ──
    { id: "gwa_panel", type: "box", x: 130, y: 540, w: 860, h: 110, rx: 10, style: "fill:var(--surface);stroke:var(--line);stroke-width:1.5" },
    { id: "gwa_title", type: "label", x: 560, y: 560, label: "Ingress vs Gateway API (futuro)", style: "font-size:13px;font-weight:700;fill:var(--ink)" },
    { id: "gwa_l1", type: "label", x: 300, y: 585, label: "Ingress: simples, annotations para configuração", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "gwa_l2", type: "label", x: 300, y: 604, label: "Gateway API: tipado, extensível, mais expressivo", style: "font-size:11px;fill:var(--accent)" },
    { id: "gwa_l3", type: "label", x: 300, y: 622, label: "Ingress está sendo substituído gradualmente pelo Gateway API (sig-network)", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "gwa_r1", type: "label", x: 820, y: 585, label: "Ingress → annotations", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "gwa_r2", type: "label", x: 820, y: 604, label: "Gateway → HTTPRoute CRD", style: "font-size:11px;fill:var(--accent)" },
    { id: "gwa_r3", type: "label", x: 820, y: 622, label: "GRPCRoute, TCPRoute, etc.", style: "font-size:11px;fill:var(--ink-soft)" },

    // ── Quiz ──
    { id: "quiz_panel", type: "box", x: 160, y: 80, w: 960, h: 540, rx: 12, style: "fill:var(--surface);stroke:var(--accent-2);stroke-width:2" },
    { id: "quiz_title", type: "label", x: 640, y: 110, label: "Quiz — Kubernetes Ingress", style: "font-size:18px;font-weight:700;fill:var(--ink)" },
    { id: "q1", type: "label", x: 640, y: 165, label: "Q: Qual a diferença entre NodePort e Ingress?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q1a", type: "label", x: 640, y: 195, label: "A: NodePort expõe porta no nó; Ingress é roteamento HTTP L7 com 1 IP", style: "font-size:12px;fill:var(--good)" },
    { id: "q2", type: "label", x: 640, y: 245, label: "Q: Quem implementa as regras do Ingress Resource?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q2a", type: "label", x: 640, y: 275, label: "A: O Ingress Controller (nginx, traefik...) que roda como pod no cluster", style: "font-size:12px;fill:var(--good)" },
    { id: "q3", type: "label", x: 640, y: 325, label: "Q: Como fazer TLS com Ingress?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q3a", type: "label", x: 640, y: 355, label: "A: Seção tls: no YAML + Secret com cert; cert-manager automatiza renovação", style: "font-size:12px;fill:var(--good)" },
    { id: "q4", type: "label", x: 640, y: 405, label: "Q: O que é path-based routing?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q4a", type: "label", x: 640, y: 435, label: "A: Roteamento baseado no path da URL — /api → svc-api, / → svc-frontend", style: "font-size:12px;fill:var(--good)" },
    { id: "q5", type: "label", x: 640, y: 485, label: "Q: Por que Ingress é preferível a vários LoadBalancers?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q5a", type: "label", x: 640, y: 515, label: "A: 1 IP/LB externo para N services = custo menor, gestão centralizada de TLS", style: "font-size:12px;fill:var(--good)" },

    // ── Summary ──
    { id: "sum_panel", type: "box", x: 130, y: 70, w: 1020, h: 560, rx: 12, style: "fill:var(--surface);stroke:var(--line);stroke-width:1.5" },
    { id: "sum_title", type: "label", x: 640, y: 100, label: "Kubernetes Ingress — Resumo", style: "font-size:20px;font-weight:700;fill:var(--ink)" },
    { id: "sum1t", type: "label", x: 340, y: 140, label: "O que faz", style: "font-size:13px;font-weight:700;fill:var(--accent)" },
    { id: "sum1d", type: "label", x: 340, y: 160, label: "Expõe services HTTP/HTTPS externamente", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "sum1d2", type: "label", x: 340, y: 178, label: "Um único IP para múltiplos services", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "sum1d3", type: "label", x: 340, y: 196, label: "Host-based + path-based routing", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "sum1d4", type: "label", x: 340, y: 214, label: "TLS termination centralizado", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "sum2t", type: "label", x: 840, y: 140, label: "Componentes", style: "font-size:13px;font-weight:700;fill:var(--accent-2)" },
    { id: "sum2d", type: "label", x: 840, y: 160, label: "Ingress Resource: declaração das regras", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "sum2d2", type: "label", x: 840, y: 178, label: "Ingress Controller: executa as regras", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "sum2d3", type: "label", x: 840, y: 196, label: "IngressClass: qual controller usar", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "sum2d4", type: "label", x: 840, y: 214, label: "Annotations: configuração específica do controller", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "sum_div", type: "box", x: 200, y: 238, w: 840, h: 1, rx: 0, style: "fill:var(--line)" },
    { id: "sum3t", type: "label", x: 640, y: 262, label: "Fluxo de uma requisição HTTP", style: "font-size:13px;font-weight:700;fill:var(--good)" },
    { id: "sum_flow", type: "label", x: 640, y: 286, label: "Internet → LB → Ingress Controller → Service → Pod", style: "font-size:13px;fill:var(--ink)" },
    { id: "sum_flow2", type: "label", x: 640, y: 308, label: "O controller lê o Ingress Resource e configura o proxy (nginx/traefik) automaticamente", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "sum_flow3", type: "label", x: 640, y: 342, label: "Futuro: Gateway API substitui Ingress com mais expressividade e tipos CRD", style: "font-size:12px;fill:var(--accent)" },
  ];

  const ALL_IDS = elements.map(e => e.id);

  const LAYER_IDS = ["lay_inet", "lay_lb", "lay_ic", "lay_svc", "lay_pods",
    "lay_inet_lbl", "lay_lb_lbl", "lay_ic_lbl", "lay_svc_lbl", "lay_pods_lbl"];
  const SVC_IDS = SVC.flatMap(s => [s.id, s.id + "_lbl", s.id + "_port"]);
  const POD_IDS = PODS.flatMap(p => [p.id, p.id + "_lbl"]);
  const ARR_SVC = ["arr_ic_a", "arr_ic_b", "arr_ic_c"];
  const ARR_POD = ["arr_a_p1", "arr_a_p2", "arr_b_p1", "arr_b_p2", "arr_c_p1", "arr_c_p2"];

  function showBase(ctx) {
    ALL_IDS.forEach(id => ctx.hide(id));
    ctx.show("title_main");
    LAYER_IDS.forEach(id => ctx.show(id));
    ctx.show("user_box"); ctx.show("user_lbl");
    ctx.show("lb_box"); ctx.show("lb_lbl");
    ctx.show("ic_box"); ctx.show("ic_lbl"); ctx.show("ic_pod_lbl");
    SVC_IDS.forEach(id => ctx.show(id));
    POD_IDS.forEach(id => ctx.show(id));
    ctx.show("arr_u_lb"); ctx.show("arr_lb_ic");
    ARR_SVC.forEach(id => ctx.show(id));
    ARR_POD.forEach(id => ctx.show(id));
  }

  const steps = [
    {
      title: "O Problema: Expor Services no K8s",
      text: "Um Service ClusterIP só é acessível dentro do cluster. NodePort abre uma porta em cada nó. LoadBalancer cria um LB externo por service — caro e ingerenciável em escala.",
      why: "Precisamos de uma camada L7 que centraliza o acesso externo com roteamento inteligente.",
      balloonAnchor: { x: 640, y: 680 },
      placement: "top",
      enter(ctx) {
        showBase(ctx);
      }
    },
    {
      title: "ClusterIP vs NodePort vs LoadBalancer",
      text: "ClusterIP: interno apenas. NodePort: porta fixa em cada nó (30000-32767). LoadBalancer: 1 LB externo por service (caro!). Ingress: 1 LB para todos.",
      why: "Em um cluster com 20 services, 20 LoadBalancers = custo elevado. Ingress resolve com 1.",
      balloonAnchor: "ic_box",
      placement: "bottom",
      enter(ctx) {
        showBase(ctx);
        ctx.show("gwa_panel"); ctx.show("gwa_title");
        ctx.show("gwa_l1"); ctx.show("gwa_l2"); ctx.show("gwa_l3");
        ctx.show("gwa_r1"); ctx.show("gwa_r2"); ctx.show("gwa_r3");
      }
    },
    {
      title: "Ingress Resource: Regras Declarativas",
      text: "O Ingress Resource é um objeto YAML que declara regras de roteamento. Ele não faz o roteamento — apenas descreve o que deve acontecer.",
      why: "Separação de concerns: devs definem regras, o controller as executa.",
      balloonAnchor: { x: 1135, y: 280 },
      placement: "left",
      enter(ctx) {
        showBase(ctx);
        ctx.show("ing_res_panel"); ctx.show("ing_res_title");
        ["ing_yaml1","ing_yaml2","ing_yaml3","ing_yaml4","ing_yaml5","ing_yaml6","ing_yaml7","ing_yaml8","ing_yaml9","ing_yaml10","ing_yaml11","ing_yaml12","ing_yaml13","ing_yaml14"].forEach(id => ctx.show(id));
      }
    },
    {
      title: "Ingress Controller (nginx / traefik)",
      text: "O Ingress Controller é um pod dentro do cluster que monitora os Ingress Resources e configura o proxy (nginx, traefik, HAProxy) automaticamente.",
      why: "O controller traduz a declaração YAML em configuração de proxy real. Sem controller, o Ingress Resource não faz nada.",
      balloonAnchor: "ic_box",
      placement: "right",
      enter(ctx) {
        showBase(ctx);
        ctx.show("ing_res_panel"); ctx.show("ing_res_title");
        ["ing_yaml1","ing_yaml2","ing_yaml3","ing_yaml4","ing_yaml5"].forEach(id => ctx.show(id));
      }
    },
    {
      title: "Host-based Routing",
      text: "Diferentes domínios são roteados para diferentes services: app.com → svc-frontend, api.app.com → svc-api. Tudo pelo mesmo IP externo.",
      why: "Permite hospedar múltiplas aplicações com domínios separados sem múltiplos LBs.",
      balloonAnchor: "route_host",
      placement: "right",
      enter(ctx) {
        showBase(ctx);
        ctx.show("route_host"); ctx.show("route_host_lbl"); ctx.show("route_host_lbl2"); ctx.show("route_host_lbl3");
      }
    },
    {
      title: "Path-based Routing",
      text: "Um único domínio com paths diferentes: app.com/ → svc-frontend, app.com/api → svc-api, app.com/admin → svc-admin.",
      why: "Micro-frontends e micro-serviços expostos sob um único domínio. BFF pattern.",
      balloonAnchor: "route_path",
      placement: "right",
      enter(ctx) {
        showBase(ctx);
        ctx.show("route_path"); ctx.show("route_path_lbl"); ctx.show("route_path_lbl2"); ctx.show("route_path_lbl3");
      }
    },
    {
      title: "TLS Termination",
      text: "O Ingress termina TLS: recebe HTTPS do usuário e repassa HTTP internamente. O certificado fica num Secret do K8s. cert-manager automatiza renovação.",
      why: "Centraliza TLS em um ponto — os services internos não precisam gerenciar certificados.",
      balloonAnchor: "tls_panel",
      placement: "right",
      enter(ctx) {
        showBase(ctx);
        ctx.show("tls_panel"); ctx.show("tls_lbl"); ctx.show("tls_lbl2"); ctx.show("tls_lbl3");
        ctx.show("ing_res_panel"); ctx.show("ing_res_title");
        ["ing_tls_yaml","ing_tls_yaml2","ing_tls_yaml3"].forEach(id => ctx.show(id));
      }
    },
    {
      title: "Annotations: Configuração Avançada",
      text: "Annotations permitem configurar comportamentos específicos do controller: rewrite, rate limiting, autenticação, timeouts e muito mais.",
      why: "A flexibilidade das annotations é grande — mas tornam o YAML acoplado ao controller específico.",
      balloonAnchor: { x: 1135, y: 440 },
      placement: "left",
      enter(ctx) {
        showBase(ctx);
        ctx.show("ing_res_panel"); ctx.show("ing_res_title");
        ctx.show("ing_ann_title"); ctx.show("ing_ann1"); ctx.show("ing_ann2"); ctx.show("ing_ann3"); ctx.show("ing_ann4");
      }
    },
    {
      title: "Um IP para Múltiplos Services",
      text: "O grande benefício: todos os services (frontend, API, admin) ficam atrás de um único endpoint externo, com TLS centralizado e roteamento inteligente.",
      why: "Reduz custo de cloud (menos LBs), simplifica DNS e gestão de certificados.",
      balloonAnchor: "lb_box",
      placement: "right",
      enter(ctx) {
        showBase(ctx);
      }
    },
    {
      title: "Ingress vs Gateway API",
      text: "O Ingress está sendo gradualmente substituído pelo Gateway API (sig-network), que usa CRDs tipados (HTTPRoute, GRPCRoute) em vez de annotations genéricas.",
      why: "Gateway API é mais expressivo, extensível e permite separar concerns entre infra-ops e devs.",
      balloonAnchor: { x: 560, y: 600 },
      placement: "top",
      enter(ctx) {
        showBase(ctx);
        ctx.show("gwa_panel"); ctx.show("gwa_title");
        ctx.show("gwa_l1"); ctx.show("gwa_l2"); ctx.show("gwa_l3");
        ctx.show("gwa_r1"); ctx.show("gwa_r2"); ctx.show("gwa_r3");
      }
    },
    {
      title: "Quiz",
      balloon: { anchor: { x: 640, y: 360 }, placement: "bottom", text: "Teste seu conhecimento sobre Ingress:" },
      quiz: {
        question: "Qual a principal vantagem do Ingress sobre um LoadBalancer Service no Kubernetes?",
        options: [
          "O Ingress só funciona com HTTPS, o que é mais seguro",
          "Ingress roteia L7 (host/path) com um único IP externo para vários services",
          "LoadBalancer cria muitos IPs (um por service), enquanto o Ingress concentra tudo em um único endpoint",
          "B e C estão corretas"
        ],
        answer: 3,
        explain: "Ingress opera em L7: roteia por hostname e path, termina TLS e usa um único IP externo para múltiplos services. LoadBalancer é L4 e cria um cloud load balancer (e custo) por service."
      }
    },
    {
      title: "Resumo",
      text: "Ingress = roteamento L7 centralizado para serviços K8s. Controller executa, Resource declara.",
      why: "",
      balloonAnchor: { x: 640, y: 660 },
      placement: "top",
      enter(ctx) {
        ALL_IDS.forEach(id => ctx.hide(id));
        ctx.show("sum_panel"); ctx.show("sum_title");
        ["sum1t","sum1d","sum1d2","sum1d3","sum1d4","sum2t","sum2d","sum2d2","sum2d3","sum2d4","sum_div","sum3t","sum_flow","sum_flow2","sum_flow3"].forEach(id => ctx.show(id));
      }
    }
  ];

  window.INGRESS_DIAGRAM = { title: "Kubernetes Ingress", subtitle: "Host-based · Path-based · TLS · Ingress Controller", width: W, height: H, autoplayMs: 8000, elements, steps };
})();
