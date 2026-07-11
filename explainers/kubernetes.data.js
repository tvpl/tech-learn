(function () {
  const W = 1280, H = 720;

  /* ── Layout constants ── */
  const CP_X = 60, CP_Y = 60, CP_W = 1160, CP_H = 240;   // Control Plane box
  const WN_Y = 380, WN_H = 240;                            // Worker Nodes area

  // Control Plane components (5 boxes spread horizontally)
  const CP_COMP = [
    { id: "cp_api",    x: 100,  label: "API Server",         color: "var(--accent)",   sub: "single entry point" },
    { id: "cp_etcd",   x: 310,  label: "etcd",               color: "var(--accent-2)", sub: "cluster state store" },
    { id: "cp_sched",  x: 520,  label: "Scheduler",          color: "var(--good)",     sub: "decides node placement" },
    { id: "cp_cm",     x: 730,  label: "Controller Mgr",     color: "var(--warn)",     sub: "reconciliation loops" },
    { id: "cp_ccm",    x: 940,  label: "Cloud Controller",   color: "var(--hot)",      sub: "cloud provider bridge" },
  ];

  // Worker Nodes (3 nodes)
  const NODES = [
    { id: "wn0", x: 80  },
    { id: "wn1", x: 460 },
    { id: "wn2", x: 840 },
  ];
  const NODE_W = 340, NODE_H = 200;

  // Pods per node (2 per node)
  const PODS = [
    { id: "pod_a0", nx: 0, px: 30  }, { id: "pod_a1", nx: 0, px: 190 },
    { id: "pod_b0", nx: 1, px: 30  }, { id: "pod_b1", nx: 1, px: 190 },
    { id: "pod_c0", nx: 2, px: 30  }, { id: "pod_c1", nx: 2, px: 190 },
  ];

  function podX(pod) { return NODES[pod.nx].x + pod.px; }
  function podY() { return WN_Y + 100; }

  const elements = [
    // ── Title ──
    { id: "title_main", type: "label", x: W / 2, y: 32, label: "Kubernetes", style: "font-size:22px;font-weight:700;fill:var(--ink)" },

    // ── Control Plane border ──
    { id: "cp_border", type: "box", x: CP_X, y: CP_Y, w: CP_W, h: CP_H, rx: 10, style: "fill:var(--accent);opacity:0.07;stroke:var(--accent);stroke-width:1.5;stroke-dasharray:6,4" },
    { id: "cp_title", type: "label", x: CP_X + CP_W / 2, y: CP_Y + 22, label: "Control Plane (gerenciado / master)", style: "font-size:13px;font-weight:700;fill:var(--accent)" },

    // ── CP components ──
    ...CP_COMP.map(c => ({ id: c.id, type: "box", x: c.x, y: CP_Y + 40, w: 170, h: 80, rx: 8, style: `fill:${c.color};opacity:0.85` })),
    ...CP_COMP.map(c => ({ id: c.id + "_lbl", type: "label", x: c.x + 85, y: CP_Y + 78, label: c.label, style: "font-size:12px;font-weight:700;fill:#fff" })),
    ...CP_COMP.map(c => ({ id: c.id + "_sub", type: "label", x: c.x + 85, y: CP_Y + 98, label: c.sub, style: "font-size:10px;fill:#eee" })),

    // ── etcd ↔ API Server arrow ──
    { id: "arr_api_etcd", type: "arrow", x1: 270, y1: CP_Y + 80, x2: 310, y2: CP_Y + 80, style: "stroke:var(--accent-2);stroke-width:2" },
    { id: "arr_etcd_api", type: "arrow", x1: 310, y1: CP_Y + 100, x2: 270, y2: CP_Y + 100, style: "stroke:var(--accent-2);stroke-width:2" },

    // ── API arrows to Scheduler, CM ──
    { id: "arr_api_sch", type: "arrow", x1: 270, y1: CP_Y + 70, x2: 520, y2: CP_Y + 70, style: "stroke:var(--good);stroke-width:1.5;stroke-dasharray:4,3" },
    { id: "arr_api_cm", type: "arrow", x1: 270, y1: CP_Y + 90, x2: 730, y2: CP_Y + 90, style: "stroke:var(--warn);stroke-width:1.5;stroke-dasharray:4,3" },

    // ── Worker Nodes border ──
    { id: "wn_border", type: "box", x: CP_X, y: WN_Y - 20, w: CP_W, h: WN_H + 40, rx: 10, style: "fill:var(--good);opacity:0.05;stroke:var(--good);stroke-width:1.5;stroke-dasharray:6,4" },
    { id: "wn_title", type: "label", x: CP_X + CP_W / 2, y: WN_Y - 4, label: "Worker Nodes", style: "font-size:13px;font-weight:700;fill:var(--good)" },

    // ── Individual nodes ──
    ...NODES.map(n => ({ id: n.id, type: "box", x: n.x, y: WN_Y + 10, w: NODE_W, h: NODE_H, rx: 8, style: "fill:var(--surface);stroke:var(--line);stroke-width:1.5" })),
    ...NODES.map((n, i) => ({ id: n.id + "_lbl", type: "label", x: n.x + NODE_W / 2, y: WN_Y + 28, label: `node-${i + 1}`, style: "font-size:11px;font-weight:600;fill:var(--ink-soft)" })),
    // kubelet + kube-proxy
    ...NODES.map(n => ({ id: n.id + "_kbl", type: "box", x: n.x + 10, y: WN_Y + 36, w: 90, h: 28, rx: 6, style: "fill:var(--accent);opacity:0.7" })),
    ...NODES.map(n => ({ id: n.id + "_kbl_lbl", type: "label", x: n.x + 55, y: WN_Y + 50, label: "kubelet", style: "font-size:10px;fill:#fff" })),
    ...NODES.map(n => ({ id: n.id + "_kpr", type: "box", x: n.x + 110, y: WN_Y + 36, w: 100, h: 28, rx: 6, style: "fill:var(--accent-2);opacity:0.7" })),
    ...NODES.map(n => ({ id: n.id + "_kpr_lbl", type: "label", x: n.x + 160, y: WN_Y + 50, label: "kube-proxy", style: "font-size:10px;fill:#fff" })),

    // ── Pods ──
    ...PODS.map(p => ({ id: p.id, type: "box", x: podX(p), y: podY(), w: 120, h: 80, rx: 8, style: "fill:var(--warn);opacity:0.75" })),
    ...PODS.map(p => ({ id: p.id + "_lbl", type: "label", x: podX(p) + 60, y: podY() + 28, label: "Pod", style: "font-size:11px;font-weight:700;fill:#fff" })),
    ...PODS.map(p => ({ id: p.id + "_cnt", type: "box", x: podX(p) + 10, y: podY() + 40, w: 100, h: 28, rx: 4, style: "fill:rgba(255,255,255,0.25)" })),
    ...PODS.map(p => ({ id: p.id + "_cnt_lbl", type: "label", x: podX(p) + 60, y: podY() + 54, label: "container", style: "font-size:9px;fill:#fff" })),

    // ── API → Node arrow ──
    { id: "arr_cp_wn", type: "arrow", x1: 185, y1: CP_Y + CP_H, x2: 230, y2: WN_Y - 20, style: "stroke:var(--accent);stroke-width:2;stroke-dasharray:5,4" },
    { id: "arr_cp_wn_lbl", type: "label", x: 160, y: (CP_Y + CP_H + WN_Y) / 2 + 5, label: "kubectl / scheduler", style: "font-size:10px;fill:var(--accent)" },

    // ── Detail panels (right overlay zone) ──
    // Deployment + ReplicaSet
    { id: "dep_panel", type: "box", x: NODES[2].x + NODE_W + 20, y: WN_Y - 20, w: 280, h: 260, rx: 10, style: "fill:var(--surface);stroke:var(--line);stroke-width:1.5" },
    { id: "dep_title", type: "label", x: NODES[2].x + NODE_W + 20 + 140, y: WN_Y, label: "Deployment", style: "font-size:13px;font-weight:700;fill:var(--accent)" },
    { id: "dep_d1", type: "label", x: NODES[2].x + NODE_W + 30, y: WN_Y + 24, label: "replicas: 3", style: "font-size:11px;font-family:monospace;fill:var(--ink-soft);text-anchor:start" },
    { id: "dep_d2", type: "label", x: NODES[2].x + NODE_W + 30, y: WN_Y + 46, label: "selector: app=myapp", style: "font-size:11px;font-family:monospace;fill:var(--ink-soft);text-anchor:start" },
    { id: "dep_d3", type: "label", x: NODES[2].x + NODE_W + 30, y: WN_Y + 68, label: "strategy: RollingUpdate", style: "font-size:11px;font-family:monospace;fill:var(--accent);text-anchor:start" },
    { id: "rs_title", type: "label", x: NODES[2].x + NODE_W + 20 + 140, y: WN_Y + 100, label: "ReplicaSet", style: "font-size:13px;font-weight:700;fill:var(--good)" },
    { id: "dep_d4", type: "label", x: NODES[2].x + NODE_W + 30, y: WN_Y + 122, label: "desired:  3", style: "font-size:11px;font-family:monospace;fill:var(--ink-soft);text-anchor:start" },
    { id: "dep_d5", type: "label", x: NODES[2].x + NODE_W + 30, y: WN_Y + 142, label: "ready:    3", style: "font-size:11px;font-family:monospace;fill:var(--good);text-anchor:start" },
    { id: "dep_d6", type: "label", x: NODES[2].x + NODE_W + 30, y: WN_Y + 162, label: "available:3", style: "font-size:11px;font-family:monospace;fill:var(--good);text-anchor:start" },
    { id: "dep_heal", type: "label", x: NODES[2].x + NODE_W + 20 + 140, y: WN_Y + 200, label: "Self-healing: Pod morre → RS cria outro", style: "font-size:10px;fill:var(--hot)" },
    { id: "dep_zero", type: "label", x: NODES[2].x + NODE_W + 20 + 140, y: WN_Y + 220, label: "RollingUpdate: zero downtime deploy", style: "font-size:10px;fill:var(--good)" },

    // Service panel (shown in step 9)
    { id: "svc_detail", type: "box", x: NODES[2].x + NODE_W + 20, y: WN_Y - 20, w: 280, h: 200, rx: 10, style: "fill:var(--surface);stroke:var(--line);stroke-width:1.5" },
    { id: "svc_detail_t", type: "label", x: NODES[2].x + NODE_W + 20 + 140, y: WN_Y, label: "Service", style: "font-size:13px;font-weight:700;fill:var(--accent-2)" },
    { id: "svc_detail_d1", type: "label", x: NODES[2].x + NODE_W + 30, y: WN_Y + 24, label: "type: ClusterIP", style: "font-size:11px;font-family:monospace;fill:var(--ink-soft);text-anchor:start" },
    { id: "svc_detail_d2", type: "label", x: NODES[2].x + NODE_W + 30, y: WN_Y + 46, label: "selector: app=myapp", style: "font-size:11px;font-family:monospace;fill:var(--ink-soft);text-anchor:start" },
    { id: "svc_detail_d3", type: "label", x: NODES[2].x + NODE_W + 30, y: WN_Y + 68, label: "port: 80 → 8080", style: "font-size:11px;font-family:monospace;fill:var(--good);text-anchor:start" },
    { id: "svc_detail_d4", type: "label", x: NODES[2].x + NODE_W + 140, y: WN_Y + 100, label: "DNS: myapp.default.svc.cluster.local", style: "font-size:10px;fill:var(--accent)" },
    { id: "svc_detail_d5", type: "label", x: NODES[2].x + NODE_W + 140, y: WN_Y + 120, label: "Stable endpoint, Pods podem mudar", style: "font-size:10px;fill:var(--ink-soft)" },
    { id: "svc_detail_d6", type: "label", x: NODES[2].x + NODE_W + 140, y: WN_Y + 148, label: "kube-proxy mantém iptables/IPVS", style: "font-size:10px;fill:var(--accent-2)" },

    // HPA panel
    { id: "hpa_panel", type: "box", x: 80, y: CP_Y + CP_H + 20, w: 320, h: 80, rx: 8, style: "fill:var(--surface);stroke:var(--good);stroke-width:1.5" },
    { id: "hpa_t", type: "label", x: 240, y: CP_Y + CP_H + 38, label: "HPA — Horizontal Pod Autoscaler", style: "font-size:12px;font-weight:700;fill:var(--good)" },
    { id: "hpa_d1", type: "label", x: 240, y: CP_Y + CP_H + 60, label: "CPU > 70% → scale up Pods", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "hpa_d2", type: "label", x: 240, y: CP_Y + CP_H + 78, label: "CPU < 30% → scale down Pods", style: "font-size:11px;fill:var(--ink-soft)" },

    // ConfigMap / Secret panel
    { id: "cfg_panel", type: "box", x: 420, y: CP_Y + CP_H + 20, w: 340, h: 80, rx: 8, style: "fill:var(--surface);stroke:var(--warn);stroke-width:1.5" },
    { id: "cfg_t", type: "label", x: 590, y: CP_Y + CP_H + 38, label: "ConfigMap & Secret", style: "font-size:12px;font-weight:700;fill:var(--warn)" },
    { id: "cfg_d1", type: "label", x: 590, y: CP_Y + CP_H + 60, label: "ConfigMap: config não-sensível (env, files)", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "cfg_d2", type: "label", x: 590, y: CP_Y + CP_H + 78, label: "Secret: dados sensíveis (base64, criptografado)", style: "font-size:11px;fill:var(--ink-soft)" },

    // Rolling deploy panel
    { id: "roll_panel", type: "box", x: 80, y: CP_Y + CP_H + 20, w: 800, h: 100, rx: 8, style: "fill:var(--surface);stroke:var(--accent);stroke-width:1.5" },
    { id: "roll_t", type: "label", x: 480, y: CP_Y + CP_H + 38, label: "Rolling Update (Zero Downtime)", style: "font-size:12px;font-weight:700;fill:var(--accent)" },
    { id: "roll_d1", type: "label", x: 480, y: CP_Y + CP_H + 60, label: "1. Cria novo Pod v2 → 2. Espera healthy → 3. Remove Pod v1 → repete", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "roll_d2", type: "label", x: 480, y: CP_Y + CP_H + 80, label: "maxUnavailable: 1 | maxSurge: 1", style: "font-size:11px;font-family:monospace;fill:var(--accent)" },
    { id: "roll_d3", type: "label", x: 480, y: CP_Y + CP_H + 100, label: "Rollback: kubectl rollout undo deployment/myapp", style: "font-size:11px;font-family:monospace;fill:var(--good)" },

    // Quiz
    { id: "quiz_panel", type: "box", x: 100, y: 60, w: 1080, h: 600, rx: 12, style: "fill:var(--surface);stroke:var(--accent);stroke-width:2" },
    { id: "quiz_title", type: "label", x: 640, y: 90, label: "Quiz — Kubernetes", style: "font-size:18px;font-weight:700;fill:var(--ink)" },
    { id: "q1", type: "label", x: 640, y: 140, label: "Q: O que é o etcd no Kubernetes?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q1a", type: "label", x: 640, y: 165, label: "A: Banco de dados distribuído que armazena todo o estado do cluster", style: "font-size:12px;fill:var(--good)" },
    { id: "q2", type: "label", x: 640, y: 210, label: "Q: Qual a diferença entre Pod e Container?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q2a", type: "label", x: 640, y: 235, label: "A: Pod é a menor unidade K8s; pode ter 1+ containers que compartilham rede e volume", style: "font-size:12px;fill:var(--good)" },
    { id: "q3", type: "label", x: 640, y: 280, label: "Q: Por que usar Deployment em vez de criar Pods diretamente?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q3a", type: "label", x: 640, y: 305, label: "A: Deployment + ReplicaSet garante self-healing, rolling updates e rollback", style: "font-size:12px;fill:var(--good)" },
    { id: "q4", type: "label", x: 640, y: 350, label: "Q: O que o Scheduler faz?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q4a", type: "label", x: 640, y: 375, label: "A: Decide em qual Worker Node cada Pod vai rodar baseado em resources e affinity", style: "font-size:12px;fill:var(--good)" },
    { id: "q5", type: "label", x: 640, y: 420, label: "Q: O que é HPA?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q5a", type: "label", x: 640, y: 445, label: "A: Horizontal Pod Autoscaler: escala réplicas baseado em métricas (CPU, memória, custom)", style: "font-size:12px;fill:var(--good)" },
    { id: "q6", type: "label", x: 640, y: 490, label: "Q: Qual a função do kubelet?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q6a", type: "label", x: 640, y: 515, label: "A: Agente no Worker Node que garante que os containers estejam rodando conforme o spec", style: "font-size:12px;fill:var(--good)" },
    { id: "q7", type: "label", x: 640, y: 558, label: "Q: Diferença ConfigMap vs Secret?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q7a", type: "label", x: 640, y: 580, label: "A: ConfigMap = configuração não-sensível; Secret = dados sensíveis (base64 + encryption at rest)", style: "font-size:12px;fill:var(--good)" },

    // Summary
    { id: "sum_panel", type: "box", x: 80, y: 40, w: 1120, h: 640, rx: 12, style: "fill:var(--surface);stroke:var(--line);stroke-width:1.5" },
    { id: "sum_title", type: "label", x: 640, y: 70, label: "Kubernetes — Resumo", style: "font-size:20px;font-weight:700;fill:var(--ink)" },
    { id: "sum_cp", type: "box", x: 120, y: 100, w: 480, h: 220, rx: 8, style: "fill:var(--accent);opacity:0.1" },
    { id: "sum_cp_t", type: "label", x: 360, y: 122, label: "Control Plane", style: "font-size:13px;font-weight:700;fill:var(--accent)" },
    { id: "sum_cp1", type: "label", x: 360, y: 148, label: "API Server: único ponto de entrada para kubectl e components", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_cp2", type: "label", x: 360, y: 168, label: "etcd: estado desejado e real do cluster", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_cp3", type: "label", x: 360, y: 188, label: "Scheduler: decide nó para cada Pod", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_cp4", type: "label", x: 360, y: 208, label: "Controller Manager: reconcilia estado atual → desejado", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_cp5", type: "label", x: 360, y: 228, label: "Cloud Controller: integra com AWS/GCP/Azure", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_wn", type: "box", x: 680, y: 100, w: 440, h: 220, rx: 8, style: "fill:var(--good);opacity:0.1" },
    { id: "sum_wn_t", type: "label", x: 900, y: 122, label: "Worker Node", style: "font-size:13px;font-weight:700;fill:var(--good)" },
    { id: "sum_wn1", type: "label", x: 900, y: 148, label: "kubelet: garante containers rodando", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_wn2", type: "label", x: 900, y: 168, label: "kube-proxy: iptables/IPVS para Services", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_wn3", type: "label", x: 900, y: 188, label: "Container runtime: containerd / CRI-O", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_wn4", type: "label", x: 900, y: 208, label: "Pods: unidade mínima com 1+ containers", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_objs", type: "box", x: 120, y: 350, w: 1000, h: 220, rx: 8, style: "fill:var(--surface);stroke:var(--line);stroke-width:1" },
    { id: "sum_objs_t", type: "label", x: 620, y: 372, label: "Objetos Essenciais", style: "font-size:13px;font-weight:700;fill:var(--ink)" },
    { id: "sum_o1", type: "label", x: 270, y: 398, label: "Deployment → réplicas + rolling update", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_o2", type: "label", x: 270, y: 418, label: "Service → DNS + load balance entre Pods", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_o3", type: "label", x: 270, y: 438, label: "Ingress → acesso externo HTTP/HTTPS", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_o4", type: "label", x: 270, y: 458, label: "ConfigMap/Secret → config e segredos", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_o5", type: "label", x: 270, y: 478, label: "HPA → auto-scaling por métricas", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_o6", type: "label", x: 750, y: 398, label: "PersistentVolume → armazenamento", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_o7", type: "label", x: 750, y: 418, label: "Namespace → isolamento lógico", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_o8", type: "label", x: 750, y: 438, label: "StatefulSet → workloads com estado", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_o9", type: "label", x: 750, y: 458, label: "DaemonSet → 1 Pod por nó", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_o10", type: "label", x: 750, y: 478, label: "Job/CronJob → tarefas batch", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_motto", type: "label", x: 620, y: 540, label: "Kubernetes = orquestrador declarativo: você diz o que quer, ele garante que aconteça", style: "font-size:13px;font-weight:600;fill:var(--accent)" },
  ];

  const ALL_IDS = elements.map(e => e.id);
  const CP_IDS = CP_COMP.flatMap(c => [c.id, c.id + "_lbl", c.id + "_sub"]);
  const NODE_IDS = NODES.flatMap(n => [n.id, n.id + "_lbl", n.id + "_kbl", n.id + "_kbl_lbl", n.id + "_kpr", n.id + "_kpr_lbl"]);
  const POD_IDS = PODS.flatMap(p => [p.id, p.id + "_lbl", p.id + "_cnt", p.id + "_cnt_lbl"]);

  function showBase(ctx) {
    ALL_IDS.forEach(id => ctx.hide(id));
    ctx.show("title_main");
    ctx.show("cp_border"); ctx.show("cp_title");
    CP_IDS.forEach(id => ctx.show(id));
    ctx.show("wn_border"); ctx.show("wn_title");
    NODE_IDS.forEach(id => ctx.show(id));
    POD_IDS.forEach(id => ctx.show(id));
  }

  const steps = [
    {
      title: "O que é Kubernetes?",
      text: "Kubernetes (K8s) é um orquestrador de containers open-source que automatiza deployment, escalonamento e gerenciamento de aplicações containerizadas.",
      why: "Sem K8s, você precisaria reiniciar containers manualmente, balancear carga, e gerenciar onde cada container roda em dezenas de servidores.",
      balloonAnchor: { x: 640, y: 680 },
      placement: "top",
      enter(ctx) {
        showBase(ctx);
      }
    },
    {
      title: "API Server: Único Ponto de Entrada",
      text: "Todo acesso ao cluster passa pelo API Server. kubectl, controllers, kubelets — todos falam com o API Server via REST.",
      why: "Centraliza autenticação, autorização (RBAC) e validação. É o cérebro do cluster.",
      balloonAnchor: "cp_api",
      placement: "bottom",
      enter(ctx) {
        showBase(ctx);
        ctx.show("arr_api_etcd"); ctx.show("arr_etcd_api");
        ctx.show("arr_api_sch"); ctx.show("arr_api_cm");
      }
    },
    {
      title: "etcd: Estado do Cluster",
      text: "O etcd é um banco de dados chave-valor distribuído que armazena todo o estado do cluster: quais Pods devem rodar, configurações, secrets.",
      why: "É a fonte de verdade. Se o etcd morrer, o Control Plane perde estado. Sempre faça backup do etcd!",
      balloonAnchor: "cp_etcd",
      placement: "bottom",
      enter(ctx) {
        showBase(ctx);
        ctx.show("arr_api_etcd"); ctx.show("arr_etcd_api");
      }
    },
    {
      title: "Scheduler: Escolhe o Nó",
      text: "Quando um Pod é criado, o Scheduler decide em qual Worker Node ele vai rodar. Considera recursos disponíveis, affinity rules e taints/tolerations.",
      why: "Você nunca escolhe o nó manualmente em produção — o Scheduler otimiza a distribuição automaticamente.",
      balloonAnchor: "cp_sched",
      placement: "bottom",
      enter(ctx) {
        showBase(ctx);
        ctx.show("arr_api_sch");
        ctx.show("arr_cp_wn"); ctx.show("arr_cp_wn_lbl");
      }
    },
    {
      title: "Controller Manager: Reconciliação",
      text: "O Controller Manager executa loops de reconciliação: compara o estado desejado (spec) com o estado real, e toma ações para convergir os dois.",
      why: "É o coração do self-healing: se um Pod morre, o ReplicaSet Controller cria um novo automaticamente.",
      balloonAnchor: "cp_cm",
      placement: "bottom",
      enter(ctx) {
        showBase(ctx);
        ctx.show("arr_api_cm");
      }
    },
    {
      title: "Worker Node: kubelet + kube-proxy",
      text: "Cada Worker Node roda: kubelet (garante que os Pods especificados estejam rodando) e kube-proxy (mantém regras de rede para Services).",
      why: "O kubelet é o agente local: recebe o PodSpec do API Server e instrui o container runtime (containerd).",
      balloonAnchor: "wn_title",
      placement: "bottom",
      enter(ctx) {
        showBase(ctx);
      }
    },
    {
      title: "Pod: Menor Unidade Deployável",
      text: "Um Pod contém 1+ containers que compartilham o mesmo namespace de rede e volumes. Containers no mesmo Pod comunicam via localhost.",
      why: "Nunca crie Pods diretamente em produção — use Deployment para ter self-healing e rolling updates.",
      balloonAnchor: "pod_a0",
      placement: "top",
      enter(ctx) {
        showBase(ctx);
      }
    },
    {
      title: "Deployment + ReplicaSet: Self-Healing",
      text: "Um Deployment gerencia um ReplicaSet que mantém N réplicas de um Pod. Se um Pod morre, o ReplicaSet cria um substituto automaticamente.",
      why: "O estado desejado (3 réplicas) é sempre reconciliado. K8s nunca 'esquece' de restart um Pod morto.",
      balloonAnchor: { x: NODES[2].x + NODE_W + 20 + 140, y: WN_Y + 240 },
      placement: "left",
      enter(ctx) {
        showBase(ctx);
        ctx.show("dep_panel"); ctx.show("dep_title");
        ctx.show("dep_d1"); ctx.show("dep_d2"); ctx.show("dep_d3");
        ctx.show("rs_title"); ctx.show("dep_d4"); ctx.show("dep_d5"); ctx.show("dep_d6");
        ctx.show("dep_heal"); ctx.show("dep_zero");
      }
    },
    {
      title: "Service: DNS Estável para Pods",
      text: "Um Service cria um endpoint estável (IP virtual + DNS) que aponta para um conjunto de Pods definido por selector. kube-proxy mantém as regras.",
      why: "Pods têm IPs efêmeros. O Service provê um endpoint permanente mesmo quando Pods mudam.",
      balloonAnchor: { x: NODES[2].x + NODE_W + 20 + 140, y: WN_Y + 150 },
      placement: "left",
      enter(ctx) {
        showBase(ctx);
        ctx.show("svc_detail"); ctx.show("svc_detail_t");
        ctx.show("svc_detail_d1"); ctx.show("svc_detail_d2"); ctx.show("svc_detail_d3");
        ctx.show("svc_detail_d4"); ctx.show("svc_detail_d5"); ctx.show("svc_detail_d6");
      }
    },
    {
      title: "ConfigMap e Secret",
      text: "ConfigMap guarda configurações não-sensíveis (URLs, feature flags). Secret guarda dados sensíveis (tokens, senhas) codificados em base64 e criptografados em repouso.",
      why: "Separa configuração do código — a mesma imagem Docker roda em dev, staging e prod com ConfigMaps diferentes.",
      balloonAnchor: { x: 590, y: CP_Y + CP_H + 80 },
      placement: "top",
      enter(ctx) {
        showBase(ctx);
        ctx.show("cfg_panel"); ctx.show("cfg_t"); ctx.show("cfg_d1"); ctx.show("cfg_d2");
      }
    },
    {
      title: "HPA: Horizontal Pod Autoscaler",
      text: "O HPA monitora métricas (CPU, memória, custom via Prometheus) e escala automaticamente o número de réplicas entre min e max.",
      why: "Scale horizontal é mais seguro e rápido que vertical. HPA reage em 15-30 segundos a picos de carga.",
      balloonAnchor: { x: 240, y: CP_Y + CP_H + 80 },
      placement: "top",
      enter(ctx) {
        showBase(ctx);
        ctx.show("hpa_panel"); ctx.show("hpa_t"); ctx.show("hpa_d1"); ctx.show("hpa_d2");
      }
    },
    {
      title: "Rolling Deploy: Zero Downtime",
      text: "RollingUpdate cria novos Pods v2 gradualmente enquanto remove os v1. maxUnavailable e maxSurge controlam a velocidade. Rollback em segundos.",
      why: "Usuários nunca vêem downtime. Se a v2 estiver unhealthy, o deploy para e você faz rollback.",
      balloonAnchor: { x: 480, y: CP_Y + CP_H + 100 },
      placement: "top",
      enter(ctx) {
        showBase(ctx);
        ctx.show("roll_panel"); ctx.show("roll_t"); ctx.show("roll_d1"); ctx.show("roll_d2"); ctx.show("roll_d3");
      }
    },
    {
      title: "Quiz",
      balloon: { anchor: { x: 640, y: 360 }, placement: "bottom", text: "Teste seu conhecimento sobre Kubernetes:" },
      quiz: {
        question: "Qual componente do Control Plane armazena o estado completo do cluster?",
        options: [
          "API Server — processa todas as requisições",
          "Scheduler — decide onde rodar os Pods",
          "etcd — banco key-value distribuído e consistente",
          "Controller Manager — reconcilia o estado desejado"
        ],
        answer: 2,
        explain: "etcd é a fonte de verdade do cluster. Todo estado (configurações, secrets, status de Pods) vive no etcd. O API Server é o único componente que acessa o etcd diretamente."
      }
    },
    {
      title: "Resumo",
      text: "K8s = Control Plane (API, etcd, Scheduler, CM) + Worker Nodes (kubelet, kube-proxy, Pods). Tudo declarativo e auto-reconciliado.",
      why: "",
      balloonAnchor: { x: 640, y: 680 },
      placement: "top",
      enter(ctx) {
        ALL_IDS.forEach(id => ctx.hide(id));
        ctx.show("sum_panel"); ctx.show("sum_title");
        ["sum_cp","sum_cp_t","sum_cp1","sum_cp2","sum_cp3","sum_cp4","sum_cp5",
         "sum_wn","sum_wn_t","sum_wn1","sum_wn2","sum_wn3","sum_wn4",
         "sum_objs","sum_objs_t","sum_o1","sum_o2","sum_o3","sum_o4","sum_o5",
         "sum_o6","sum_o7","sum_o8","sum_o9","sum_o10","sum_motto"].forEach(id => ctx.show(id));
      }
    }
  ];

  window.KUBERNETES_DIAGRAM = { title: "Kubernetes", subtitle: "Control Plane · Worker Nodes · Pods · Services · Deployments", width: W, height: H, autoplayMs: 8000, elements, steps };
})();
