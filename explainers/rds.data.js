(function () {
  const W = 1280, H = 720;

  /* ── Layout: two AZ columns ── */
  const AZ1_X = 80,  AZ_Y = 60,  AZ_W = 480, AZ_H = 540;
  const AZ2_X = 720, AZ2_Y = 60;

  // Primary instance
  const PRI_X = AZ1_X + 80, PRI_Y = AZ_Y + 80, PRI_W = 320, PRI_H = 120;
  // Standby instance
  const STB_X = AZ2_X + 80, STB_Y = AZ_Y + 80, STB_W = 320, STB_H = 120;
  // Read Replica (under Primary AZ)
  const RR_X = AZ1_X + 80, RR_Y = AZ_Y + 300, RR_W = 320, RR_H = 100;
  // Read Replica 2 (under Standby AZ)
  const RR2_X = AZ2_X + 80, RR2_Y = AZ_Y + 300, RR2_W = 320, RR2_H = 100;

  const elements = [
    // ── Title ──
    { id: "title_main", type: "label", x: W / 2, y: 32, label: "Amazon RDS", style: "font-size:22px;font-weight:700;fill:var(--ink)" },

    // ── AZ boxes ──
    { id: "az1_border", type: "box", x: AZ1_X, y: AZ_Y, w: AZ_W, h: AZ_H, rx: 10, style: "fill:var(--accent);opacity:0.07;stroke:var(--accent);stroke-width:1.5;stroke-dasharray:6,4" },
    { id: "az1_lbl",   type: "label", x: AZ1_X + AZ_W / 2, y: AZ_Y + 18, label: "Availability Zone 1 (Primary)", style: "font-size:13px;font-weight:700;fill:var(--accent)" },
    { id: "az2_border", type: "box", x: AZ2_X, y: AZ2_Y, w: AZ_W, h: AZ_H, rx: 10, style: "fill:var(--good);opacity:0.07;stroke:var(--good);stroke-width:1.5;stroke-dasharray:6,4" },
    { id: "az2_lbl",   type: "label", x: AZ2_X + AZ_W / 2, y: AZ2_Y + 18, label: "Availability Zone 2 (Multi-AZ)", style: "font-size:13px;font-weight:700;fill:var(--good)" },

    // ── Primary DB ──
    { id: "pri_box",  type: "box", x: PRI_X, y: PRI_Y, w: PRI_W, h: PRI_H, rx: 10, style: "fill:var(--accent);opacity:0.85" },
    { id: "pri_lbl",  type: "label", x: PRI_X + PRI_W / 2, y: PRI_Y + 34, label: "Primary Instance", style: "font-size:14px;font-weight:700;fill:#fff" },
    { id: "pri_eng",  type: "label", x: PRI_X + PRI_W / 2, y: PRI_Y + 56, label: "PostgreSQL / MySQL / Aurora", style: "font-size:11px;fill:#eee" },
    { id: "pri_rw",   type: "label", x: PRI_X + PRI_W / 2, y: PRI_Y + 80, label: "Read + Write", style: "font-size:12px;font-weight:600;fill:#fff" },
    { id: "pri_ep",   type: "label", x: PRI_X + PRI_W / 2, y: PRI_Y + 100, label: "mydb.cluster-xxxx.us-east-1.rds.amazonaws.com", style: "font-size:9px;font-family:monospace;fill:#cce" },

    // ── Standby DB ──
    { id: "stb_box",  type: "box", x: STB_X, y: STB_Y, w: STB_W, h: STB_H, rx: 10, style: "fill:var(--good);opacity:0.8" },
    { id: "stb_lbl",  type: "label", x: STB_X + STB_W / 2, y: STB_Y + 34, label: "Standby Instance", style: "font-size:14px;font-weight:700;fill:#fff" },
    { id: "stb_eng",  type: "label", x: STB_X + STB_W / 2, y: STB_Y + 56, label: "Replicação Síncrona", style: "font-size:11px;fill:#eee" },
    { id: "stb_rw",   type: "label", x: STB_X + STB_W / 2, y: STB_Y + 80, label: "Não aceita conexões (espera)", style: "font-size:11px;fill:#dfd" },
    { id: "stb_ep",   type: "label", x: STB_X + STB_W / 2, y: STB_Y + 100, label: "Usado apenas em failover", style: "font-size:10px;fill:#dfd" },

    // ── Sync replication arrow ──
    { id: "arr_sync1", type: "arrow", x1: PRI_X + PRI_W, y1: PRI_Y + 60, x2: STB_X, y2: STB_Y + 60, style: "stroke:var(--accent-2);stroke-width:2.5" },
    { id: "arr_sync_lbl", type: "label", x: (PRI_X + PRI_W + STB_X) / 2, y: PRI_Y + 50, label: "Síncrono", style: "font-size:11px;font-weight:600;fill:var(--accent-2)" },
    { id: "arr_sync_lbl2", type: "label", x: (PRI_X + PRI_W + STB_X) / 2, y: PRI_Y + 68, label: "Commit confirmado em ambos", style: "font-size:10px;fill:var(--ink-soft)" },

    // ── Read Replicas ──
    { id: "rr1_box",  type: "box", x: RR_X, y: RR_Y, w: RR_W, h: RR_H, rx: 10, style: "fill:var(--warn);opacity:0.8" },
    { id: "rr1_lbl",  type: "label", x: RR_X + RR_W / 2, y: RR_Y + 28, label: "Read Replica 1", style: "font-size:13px;font-weight:700;fill:#fff" },
    { id: "rr1_async", type: "label", x: RR_X + RR_W / 2, y: RR_Y + 52, label: "Replicação Assíncrona", style: "font-size:11px;fill:#ffe" },
    { id: "rr1_ro",   type: "label", x: RR_X + RR_W / 2, y: RR_Y + 74, label: "Read Only • Lag: ms-s", style: "font-size:11px;fill:#fff" },

    { id: "rr2_box",  type: "box", x: RR2_X, y: RR2_Y, w: RR2_W, h: RR2_H, rx: 10, style: "fill:var(--warn);opacity:0.8" },
    { id: "rr2_lbl",  type: "label", x: RR2_X + RR2_W / 2, y: RR2_Y + 28, label: "Read Replica 2", style: "font-size:13px;font-weight:700;fill:#fff" },
    { id: "rr2_async", type: "label", x: RR2_X + RR2_W / 2, y: RR2_Y + 52, label: "Pode ser cross-region", style: "font-size:11px;fill:#ffe" },
    { id: "rr2_ro",   type: "label", x: RR2_X + RR2_W / 2, y: RR2_Y + 74, label: "Read Only • Analytics / Reporting", style: "font-size:11px;fill:#fff" },

    // ── Async replication arrows ──
    { id: "arr_rr1",  type: "arrow", x1: PRI_X + PRI_W / 2, y1: PRI_Y + PRI_H, x2: RR_X + RR_W / 2, y2: RR_Y, style: "stroke:var(--warn);stroke-width:2;stroke-dasharray:5,4" },
    { id: "arr_rr2",  type: "arrow", x1: PRI_X + PRI_W, y1: PRI_Y + 80, x2: RR2_X, y2: RR2_Y + 50, style: "stroke:var(--warn);stroke-width:2;stroke-dasharray:5,4" },
    { id: "arr_rr_lbl", type: "label", x: AZ1_X + AZ_W / 2, y: AZ_Y + 255, label: "Assíncrono", style: "font-size:11px;fill:var(--warn);font-weight:600" },

    // ── Application ──
    { id: "app_box", type: "box", x: 520, y: 30, w: 240, h: 50, rx: 8, style: "fill:var(--surface);stroke:var(--line);stroke-width:1.5" },
    { id: "app_lbl", type: "label", x: 640, y: 55, label: "Application", style: "font-size:13px;font-weight:600;fill:var(--ink)" },
    { id: "arr_app_pri", type: "arrow", x1: 560, y1: 80, x2: PRI_X + 160, y2: PRI_Y, style: "stroke:var(--accent);stroke-width:2" },
    { id: "arr_app_pri_lbl", type: "label", x: 440, y: 110, label: "Writes + Reads", style: "font-size:11px;fill:var(--accent)" },
    { id: "arr_app_rr", type: "arrow", x1: 640, y1: 80, x2: RR_X + 160, y2: RR_Y, style: "stroke:var(--warn);stroke-width:1.5;stroke-dasharray:4,3" },
    { id: "arr_app_rr_lbl", type: "label", x: 500, y: 220, label: "Reads only → Read Replica", style: "font-size:10px;fill:var(--warn)" },

    // ── Detail panels ──
    // Backup panel
    { id: "bkp_panel", type: "box", x: 80, y: AZ_Y + AZ_H + 20, w: 540, h: 110, rx: 10, style: "fill:var(--surface);stroke:var(--line);stroke-width:1.5" },
    { id: "bkp_t", type: "label", x: 350, y: AZ_Y + AZ_H + 40, label: "Backups Automatizados", style: "font-size:13px;font-weight:700;fill:var(--accent)" },
    { id: "bkp_d1", type: "label", x: 350, y: AZ_Y + AZ_H + 64, label: "Retention: 1–35 dias configurável", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "bkp_d2", type: "label", x: 350, y: AZ_Y + AZ_H + 84, label: "Point-in-Time Recovery (PITR): restaura a qualquer segundo", style: "font-size:11px;fill:var(--good)" },
    { id: "bkp_d3", type: "label", x: 350, y: AZ_Y + AZ_H + 104, label: "Snapshots manuais: retidos até exclusão manual", style: "font-size:11px;fill:var(--ink-soft)" },

    // Security panel
    { id: "sec_panel", type: "box", x: 660, y: AZ_Y + AZ_H + 20, w: 540, h: 110, rx: 10, style: "fill:var(--surface);stroke:var(--line);stroke-width:1.5" },
    { id: "sec_t", type: "label", x: 930, y: AZ_Y + AZ_H + 40, label: "Segurança", style: "font-size:13px;font-weight:700;fill:var(--hot)" },
    { id: "sec_d1", type: "label", x: 930, y: AZ_Y + AZ_H + 64, label: "VPC + Subnet privada (sem acesso público)", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sec_d2", type: "label", x: 930, y: AZ_Y + AZ_H + 84, label: "Security Groups: controle de acesso por IP/port", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sec_d3", type: "label", x: 930, y: AZ_Y + AZ_H + 104, label: "Encryption at rest (KMS) + in transit (TLS)", style: "font-size:11px;fill:var(--hot)" },

    // Failover overlay
    { id: "failover_overlay", type: "box", x: 50, y: 50, w: 1180, h: 560, rx: 12, style: "fill:var(--hot);opacity:0.06;stroke:var(--hot);stroke-width:2;stroke-dasharray:8,5" },
    { id: "failover_lbl", type: "label", x: 640, y: 660, label: "FAILOVER em < 2 minutos: CNAME do endpoint aponta para standby", style: "font-size:12px;font-weight:600;fill:var(--hot)" },
    { id: "arr_failover", type: "arrow", x1: STB_X + STB_W / 2, y1: STB_Y + STB_H, x2: STB_X + STB_W / 2, y2: AZ_Y + 240, style: "stroke:var(--hot);stroke-width:2.5;stroke-dasharray:5,4" },
    { id: "arr_failover_lbl", type: "label", x: STB_X + STB_W / 2 + 10, y: STB_Y + STB_H + 40, label: "Promovido a Primary", style: "font-size:12px;font-weight:600;fill:var(--hot);text-anchor:start" },

    // Performance Insights
    { id: "pi_panel", type: "box", x: 80, y: AZ_Y + AZ_H + 20, w: 1120, h: 100, rx: 10, style: "fill:var(--surface);stroke:var(--accent-2);stroke-width:1.5" },
    { id: "pi_t", type: "label", x: 640, y: AZ_Y + AZ_H + 40, label: "Performance Insights", style: "font-size:13px;font-weight:700;fill:var(--accent-2)" },
    { id: "pi_d1", type: "label", x: 640, y: AZ_Y + AZ_H + 64, label: "Visualiza DBLoad (sessions aguardando) por SQL, wait event e user", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "pi_d2", type: "label", x: 640, y: AZ_Y + AZ_H + 84, label: "Identifica gargalos: lock waits, I/O, CPU, network → tuning de queries e índices", style: "font-size:11px;fill:var(--accent-2)" },

    // Quiz
    { id: "quiz_panel", type: "box", x: 100, y: 50, w: 1080, h: 620, rx: 12, style: "fill:var(--surface);stroke:var(--accent);stroke-width:2" },
    { id: "quiz_title", type: "label", x: 640, y: 80, label: "Quiz — Amazon RDS", style: "font-size:18px;font-weight:700;fill:var(--ink)" },
    { id: "q1", type: "label", x: 640, y: 130, label: "Q: O que é Multi-AZ no RDS?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q1a", type: "label", x: 640, y: 155, label: "A: Replicação síncrona para standby em outra AZ; failover automático em < 2min", style: "font-size:12px;fill:var(--good)" },
    { id: "q2", type: "label", x: 640, y: 205, label: "Q: Diferença Multi-AZ vs Read Replica?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q2a", type: "label", x: 640, y: 230, label: "A: Multi-AZ = HA (sinc, failover). Read Replica = escalabilidade de leitura (assínc)", style: "font-size:12px;fill:var(--good)" },
    { id: "q3", type: "label", x: 640, y: 280, label: "Q: O que é PITR no RDS?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q3a", type: "label", x: 640, y: 305, label: "A: Point-in-Time Recovery: restaura o banco a qualquer segundo dentro do período de retenção", style: "font-size:12px;fill:var(--good)" },
    { id: "q4", type: "label", x: 640, y: 355, label: "Q: Por que não colocar RDS em subnet pública?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q4a", type: "label", x: 640, y: 380, label: "A: Segurança: banco deve ser acessível apenas pela aplicação, nunca pela internet", style: "font-size:12px;fill:var(--good)" },
    { id: "q5", type: "label", x: 640, y: 430, label: "Q: O que são Parameter Groups?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q5a", type: "label", x: 640, y: 455, label: "A: Configurações do engine de banco (max_connections, innodb_buffer_pool_size, etc.)", style: "font-size:12px;fill:var(--good)" },
    { id: "q6", type: "label", x: 640, y: 505, label: "Q: Quando usar Read Replica em vez de cache?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q6a", type: "label", x: 640, y: 530, label: "A: Queries SQL complexas que não cabem em cache, reports analíticos, dashboards", style: "font-size:12px;fill:var(--good)" },

    // Summary
    { id: "sum_panel", type: "box", x: 80, y: 40, w: 1120, h: 640, rx: 12, style: "fill:var(--surface);stroke:var(--line);stroke-width:1.5" },
    { id: "sum_title", type: "label", x: 640, y: 70, label: "Amazon RDS — Resumo", style: "font-size:20px;font-weight:700;fill:var(--ink)" },
    { id: "sum_ha", type: "box", x: 120, y: 100, w: 460, h: 200, rx: 8, style: "fill:var(--accent);opacity:0.1" },
    { id: "sum_ha_t", type: "label", x: 350, y: 122, label: "Alta Disponibilidade", style: "font-size:13px;font-weight:700;fill:var(--accent)" },
    { id: "sum_ha1", type: "label", x: 350, y: 148, label: "Multi-AZ: replicação síncrona", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_ha2", type: "label", x: 350, y: 168, label: "Failover automático < 2 minutos", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_ha3", type: "label", x: 350, y: 188, label: "Endpoint CNAME não muda", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_ha4", type: "label", x: 350, y: 208, label: "Standby não aceita leituras", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_ha5", type: "label", x: 350, y: 228, label: "Managed: patches, backups automáticos", style: "font-size:11px;fill:var(--accent)" },
    { id: "sum_scale", type: "box", x: 700, y: 100, w: 440, h: 200, rx: 8, style: "fill:var(--good);opacity:0.1" },
    { id: "sum_scale_t", type: "label", x: 920, y: 122, label: "Escalabilidade de Leitura", style: "font-size:13px;font-weight:700;fill:var(--good)" },
    { id: "sum_scale1", type: "label", x: 920, y: 148, label: "Read Replicas: replicação assíncrona", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_scale2", type: "label", x: 920, y: 168, label: "Até 15 réplicas (Aurora)", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_scale3", type: "label", x: 920, y: 188, label: "Podem ser cross-region", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_scale4", type: "label", x: 920, y: 208, label: "Lag aceitável para analytics", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_scale5", type: "label", x: 920, y: 228, label: "Promovível a primary em emergência", style: "font-size:11px;fill:var(--good)" },
    { id: "sum_mgd", type: "box", x: 120, y: 330, w: 1020, h: 200, rx: 8, style: "fill:var(--surface);stroke:var(--line);stroke-width:1" },
    { id: "sum_mgd_t", type: "label", x: 630, y: 352, label: "RDS Managed = O que você NÃO precisa gerenciar", style: "font-size:13px;font-weight:700;fill:var(--ink)" },
    { id: "sm1", type: "label", x: 300, y: 378, label: "Instalação e patches do OS/engine", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sm2", type: "label", x: 300, y: 398, label: "Backups automáticos (S3)", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sm3", type: "label", x: 300, y: 418, label: "Monitoramento básico (CloudWatch)", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sm4", type: "label", x: 300, y: 438, label: "Replicação Multi-AZ", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sm5", type: "label", x: 750, y: 378, label: "Failover automático", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sm6", type: "label", x: 750, y: 398, label: "Storage auto-scaling (Aurora)", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sm7", type: "label", x: 750, y: 418, label: "Multi-AZ com storage compartilhado (Aurora)", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sm8", type: "label", x: 750, y: 438, label: "Encryption at rest com KMS", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_note", type: "label", x: 630, y: 500, label: "Aurora = RDS otimizado: 5x MySQL, 3x PostgreSQL, storage compartilhado multi-AZ", style: "font-size:12px;font-weight:600;fill:var(--accent)" },
  ];

  const ALL_IDS = elements.map(e => e.id);

  function showBase(ctx) {
    ALL_IDS.forEach(id => ctx.hide(id));
    ctx.show("title_main");
    ctx.show("az1_border"); ctx.show("az1_lbl");
    ctx.show("az2_border"); ctx.show("az2_lbl");
    ctx.show("pri_box"); ctx.show("pri_lbl"); ctx.show("pri_eng"); ctx.show("pri_rw"); ctx.show("pri_ep");
    ctx.show("stb_box"); ctx.show("stb_lbl"); ctx.show("stb_eng"); ctx.show("stb_rw"); ctx.show("stb_ep");
    ctx.show("arr_sync1"); ctx.show("arr_sync_lbl"); ctx.show("arr_sync_lbl2");
    ctx.show("app_box"); ctx.show("app_lbl"); ctx.show("arr_app_pri"); ctx.show("arr_app_pri_lbl");
  }

  const steps = [
    {
      title: "O que é Amazon RDS?",
      balloon: { anchor: { x: 640, y: 680 }, placement: "top",
        text: "RDS (Relational Database Service) é um serviço gerenciado de banco de dados relacional na AWS. Suporta MySQL, PostgreSQL, MariaDB, Oracle, SQL Server e Aurora.",
        why: "Managed significa: sem gerenciar OS, patches, backups, replicação — foque só na sua aplicação." },
      enter(ctx) {
        showBase(ctx);
      }
    },
    {
      title: "Instância Primária",
      balloon: { anchor: "pri_box", placement: "right",
        text: "A instância Primary aceita todas as escritas e leituras. É o endpoint principal que sua aplicação conecta. Roda dentro de uma VPC em subnet privada.",
        why: "RDS gerencia o engine, storage (SSD gp3/io1), patches e monitoramento automático.",
        deep: `<p>O endpoint da Primary é um CNAME estável (ex: <code>mydb.cluster-xxxx.us-east-1.rds.amazonaws.com</code>), não um IP fixo — isso é o que permite trocar qual instância física está "atrás" do endpoint (num failover, por exemplo) sem a aplicação precisar mudar a connection string.</p>
<div class="xp-example"><strong>Escolhendo storage</strong>gp3: SSD de propósito geral, IOPS/throughput configuráveis independente do tamanho
io1/io2: SSD provisionado, para cargas com IOPS altíssimo e previsível (ex: OLTP crítico)</div>
<p>O tipo de instância (ex: <code>db.r6g.xlarge</code>) e o engine (PostgreSQL, MySQL, Aurora) são escolhidos na criação, mas storage e classe de instância podem ser alterados depois, geralmente com uma janela de manutenção.</p>` },
      enter(ctx) {
        showBase(ctx);
      }
    },
    {
      title: "Multi-AZ: Replicação Síncrona",
      balloon: { anchor: "arr_sync1", placement: "bottom",
        text: "Com Multi-AZ, cada write na Primary é replicado de forma síncrona para uma Standby em outra AZ antes de confirmar o commit. Garante RPO=0.",
        why: "Commit só é confirmado para a aplicação depois que ambas as instâncias gravaram. Zero perda de dados.",
        deep: `<p>"Síncrono" aqui significa que o commit da transação só retorna sucesso para a aplicação depois que o WAL (write-ahead log, ou binlog no MySQL) foi persistido tanto na Primary quanto na Standby. Isso tem um custo: a latência de commit inclui o round-trip de rede entre as duas AZs.</p>
<div class="xp-good"><strong>RPO = 0</strong>Se a Primary falhar exatamente após um commit confirmado, esse dado já está garantidamente na Standby — nenhuma transação confirmada é perdida.</div>
<div class="xp-bad"><strong>Confundir com Read Replica</strong>Read Replicas usam replicação assíncrona — um commit não espera a réplica confirmar, então há risco de perda de dados recentes se a Primary cair antes de replicar.</div>` },
      enter(ctx) {
        showBase(ctx);
      }
    },
    {
      title: "Failover Automático (< 2 min)",
      balloon: { anchor: "arr_failover_lbl", placement: "left",
        text: "Se a Primary falha, o RDS promove a Standby a Primary e atualiza o CNAME do endpoint. A aplicação reconecta no mesmo hostname — sem mudança de config.",
        why: "O failover é transparente para a aplicação se ela tiver retry logic. Downtime típico: 60-120 segundos.",
        deep: `<p>O RDS dispara failover automaticamente em cenários como falha da instância, falha da AZ inteira, ou mudança de tipo de instância que exige reboot — mas a aplicação só se beneficia da transparência se implementar retry com backoff, já que a resolução DNS do endpoint pode levar alguns segundos para propagar após a mudança do CNAME.</p>
<div class="xp-bad"><strong>Sem retry logic</strong>Aplicação trata erro de conexão como falha definitiva e derruba a request — usuário vê erro mesmo com failover funcionando corretamente.</div>
<div class="xp-good"><strong>Com retry logic</strong>Connection pool detecta erro, aguarda alguns segundos e tenta reconectar no mesmo endpoint — a nova Primary já está pronta para aceitar conexões.</div>` },
      enter(ctx) {
        showBase(ctx);
        ctx.show("failover_overlay"); ctx.show("failover_lbl");
        ctx.show("arr_failover"); ctx.show("arr_failover_lbl");
      }
    },
    {
      title: "Read Replicas: Escalando Leituras",
      balloon: { anchor: "rr1_box", placement: "right",
        text: "Read Replicas recebem dados da Primary via replicação assíncrona. São read-only e podem ter lag de milissegundos a segundos. Use para queries analíticas pesadas.",
        why: "Alivia a Primary de queries de leitura — essencial quando leituras superam escritas 10:1 ou mais.",
        deep: `<p>Como a replicação é assíncrona, a aplicação precisa tolerar "replication lag" — uma leitura na réplica pode não refletir um write que acabou de acontecer na Primary. Esse padrão é conhecido como eventual consistency para leituras, e exige decidir conscientemente quais queries podem tolerar dado ligeiramente desatualizado.</p>
<div class="xp-example"><strong>Roteamento típico numa aplicação</strong>Write (INSERT/UPDATE/DELETE) → sempre Primary
Read crítica (saldo, checkout) → Primary
Read tolerante a lag (dashboard, listagem) → Read Replica</div>
<p>Read Replicas também podem ser promovidas a instância standalone (independente) em caso de necessidade — útil para migrar carga de analytics para um cluster totalmente separado sem downtime na Primary.</p>` },
      enter(ctx) {
        showBase(ctx);
        ctx.show("rr1_box"); ctx.show("rr1_lbl"); ctx.show("rr1_async"); ctx.show("rr1_ro");
        ctx.show("rr2_box"); ctx.show("rr2_lbl"); ctx.show("rr2_async"); ctx.show("rr2_ro");
        ctx.show("arr_rr1"); ctx.show("arr_rr2"); ctx.show("arr_rr_lbl");
        ctx.show("arr_app_rr"); ctx.show("arr_app_rr_lbl");
      }
    },
    {
      title: "Backups Automatizados + Snapshots",
      balloon: { anchor: { x: 350, y: AZ_Y + AZ_H + 80 }, placement: "top",
        text: "RDS faz backup diário automático para S3 e mantém transaction logs. Isso permite PITR — restaurar o banco para qualquer segundo dentro do período de retenção.",
        why: "PITR é essencial para recovery de erros humanos: DELETE sem WHERE, ou corrupção de dados.",
        deep: `<p>O backup diário é só a "base" — o RDS também captura os transaction logs continuamente (a cada 5 minutos, tipicamente) e os envia para o S3. É a combinação snapshot diário + logs incrementais que permite restaurar para qualquer segundo, não só para o horário do snapshot.</p>
<div class="xp-example"><strong>Snapshot automático vs manual</strong>Automated backup: apagado quando a instância é deletada (a menos que "retain" seja marcado)
Manual snapshot: persiste indefinidamente até exclusão explícita, independente da instância existir</div>
<p>O período de retenção configurável (1–35 dias) define até onde no passado o PITR alcança — snapshots manuais são a forma de guardar um ponto específico (ex: antes de uma migração) por mais tempo que isso.</p>` },
      enter(ctx) {
        showBase(ctx);
        ctx.show("bkp_panel"); ctx.show("bkp_t"); ctx.show("bkp_d1"); ctx.show("bkp_d2"); ctx.show("bkp_d3");
      }
    },
    {
      title: "Restore Point-in-Time",
      balloon: { anchor: { x: 350, y: AZ_Y + AZ_H + 80 }, placement: "top",
        text: "PITR permite restaurar o banco a qualquer momento dentro do período de retenção (1-35 dias). O restore cria uma nova instância RDS — não substitui a atual.",
        why: "Sempre restaure para uma nova instância para poder comparar e fazer validação antes de cutover.",
        deep: `<p>O restore é sempre para uma <strong>nova instância</strong> com um novo endpoint — nunca sobrescreve a instância existente. Isso é proposital: dá tempo de validar os dados restaurados antes de decidir migrar a aplicação para o novo endpoint (cutover), evitando destruir a instância problemática antes de confirmar que o restore realmente resolveu o incidente.</p>
<div class="xp-example"><strong>Fluxo típico de um restore</strong>1. aws rds restore-db-instance-to-point-in-time --target-db-instance-identifier mydb-restored --restore-time 2026-07-10T14:32:00Z
2. Validar dados na instância restaurada
3. Trocar a connection string da aplicação (cutover)
4. Descomissionar a instância antiga com problema</div>
<p>O tempo de restore não é instantâneo — depende do tamanho do banco, já que envolve recriar o storage a partir do snapshot base e reaplicar os transaction logs até o segundo escolhido.</p>` },
      enter(ctx) {
        showBase(ctx);
        ctx.show("bkp_panel"); ctx.show("bkp_t"); ctx.show("bkp_d1"); ctx.show("bkp_d2"); ctx.show("bkp_d3");
      }
    },
    {
      title: "Segurança: VPC, SGs, Encryption",
      balloon: { anchor: { x: 930, y: AZ_Y + AZ_H + 80 }, placement: "top",
        text: "RDS deve sempre ficar em subnet privada. Security Groups controlam quais IPs/instâncias podem conectar. Dados em repouso criptografados com AWS KMS.",
        why: "Nunca exponha um banco de dados diretamente na internet — sempre use Bastion Host ou VPN para acesso direto.",
        deep: `<p>Security Groups no RDS funcionam como um firewall stateful na porta do banco (5432 no PostgreSQL, 3306 no MySQL): em vez de liberar por IP fixo, a prática recomendada é liberar por <strong>Security Group de origem</strong> — por exemplo, o SG dos Pods/instâncias da aplicação — assim o acesso segue automaticamente quando a aplicação escala.</p>
<div class="xp-example"><strong>Regra de SG recomendada</strong>Inbound: porta 5432, origem = sg-app-servers (não 0.0.0.0/0)</div>
<p>Encryption at rest com KMS é definido na criação da instância e não pode ser ativado depois em uma instância já existente sem migração (snapshot + restore com criptografia habilitada) — por isso vale habilitar desde o dia 1, mesmo em ambientes de desenvolvimento.</p>` },
      enter(ctx) {
        showBase(ctx);
        ctx.show("sec_panel"); ctx.show("sec_t"); ctx.show("sec_d1"); ctx.show("sec_d2"); ctx.show("sec_d3");
      }
    },
    {
      title: "Performance Insights",
      balloon: { anchor: { x: 640, y: AZ_Y + AZ_H + 80 }, placement: "top",
        text: "Performance Insights mostra o DB Load: quantas sessions estão ativas e em qual estado (CPU, I/O, lock waits). Filtre por SQL, user, ou wait event.",
        why: "Identifica exatamente qual query está causando gargalo — economiza horas de investigação.",
        deep: `<p>O DB Load é medido em "Average Active Sessions" (AAS) — quantas sessões estavam, em média, ativamente executando ou esperando por um recurso num intervalo de tempo. Comparar o AAS contra o número de vCPUs da instância mostra rapidamente se o gargalo é CPU (AAS acima do número de vCPUs indica fila) ou outro tipo de espera.</p>
<div class="xp-example"><strong>Lendo o gráfico de DB Load</strong>AAS = 8, instância com 4 vCPUs, maior parte em "CPU" → CPU-bound, considere instância maior
AAS = 8, maior parte em "Lock:tuple" → contenção de lock, revisar transações longas</div>
<p>Diferente de logs de slow query, o Performance Insights amostra continuamente e correlaciona automaticamente picos de carga com o SQL exato responsável — sem precisar habilitar logging verboso que impacta performance.</p>` },
      enter(ctx) {
        showBase(ctx);
        ctx.show("pi_panel"); ctx.show("pi_t"); ctx.show("pi_d1"); ctx.show("pi_d2");
      }
    },
    {
      title: "Quiz",
      balloon: { anchor: { x: 640, y: 360 }, placement: "bottom", text: "Teste seu conhecimento sobre Amazon RDS:" },
      quiz: {
        question: "O que acontece no failover Multi-AZ do RDS?",
        options: [
          "O banco fica indisponível por ~30 minutos enquanto o standby sobe",
          "O DNS do endpoint aponta automaticamente para o standby em menos de 2 minutos",
          "Você precisa atualizar manualmente a string de conexão da aplicação",
          "Os dados são copiados do primário para o standby somente após o failover"
        ],
        answer: 1,
        explain: "Multi-AZ mantém replicação síncrona em outra AZ. Em falha, o RDS atualiza o CNAME do endpoint para o standby em < 2 min — sem alterar a connection string da aplicação."
      }
    },
    {
      title: "Resumo",
      balloon: {
        anchor: { x: 640, y: 680 }, placement: "top",
        text: "RDS = banco relacional gerenciado com Multi-AZ para HA, Read Replicas para escala, PITR para recovery, e segurança na VPC.",
      },
      enter(ctx) {
        ALL_IDS.forEach(id => ctx.hide(id));
        ctx.show("sum_panel"); ctx.show("sum_title");
        ["sum_ha","sum_ha_t","sum_ha1","sum_ha2","sum_ha3","sum_ha4","sum_ha5",
         "sum_scale","sum_scale_t","sum_scale1","sum_scale2","sum_scale3","sum_scale4","sum_scale5",
         "sum_mgd","sum_mgd_t","sm1","sm2","sm3","sm4","sm5","sm6","sm7","sm8","sum_note"].forEach(id => ctx.show(id));
      }
    }
  ];

  window.RDS_DIAGRAM = { title: "Amazon RDS", subtitle: "Multi-AZ · Read Replicas · PITR · Managed Database", width: W, height: H, autoplayMs: 8000, elements, steps };
})();
