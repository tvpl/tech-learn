(function () {
  const W = 1280, H = 720;

  /* ── Layout: nested AWS boxes ── */
  // AWS Cloud
  const AWS_X = 40, AWS_Y = 40, AWS_W = 1200, AWS_H = 640;
  // VPC inside AWS
  const VPC_X = 80, VPC_Y = 80, VPC_W = 1120, VPC_H = 580;
  // EKS Cluster inside VPC
  const EKS_X = 120, EKS_Y = 130, EKS_W = 1040, EKS_H = 500;

  // Control Plane (managed by AWS, 3 AZs)
  const CP_X = 150, CP_Y = 170, CP_W = 300, CP_H = 100;

  // Node Groups
  const NG1_X = 520, NG1_Y = 170, NG1_W = 280, NG1_H = 150;
  const NG2_X = 830, NG2_Y = 170, NG2_W = 280, NG2_H = 150;

  // Fargate
  const FG_X = 150, FG_Y = 340, FG_W = 270, FG_H = 100;

  // Pods inside node groups
  const POD_Y = NG1_Y + 70;

  // Add-ons row
  const ADD_Y = 460;

  const elements = [
    // ── Title ──
    { id: "title_main", type: "label", x: W / 2, y: 26, label: "Amazon EKS", style: "font-size:22px;font-weight:700;fill:var(--ink)" },

    // ── AWS Cloud border ──
    { id: "aws_border", type: "box", x: AWS_X, y: AWS_Y, w: AWS_W, h: AWS_H, rx: 12, style: "fill:var(--warn);opacity:0.05;stroke:var(--warn);stroke-width:1.5;stroke-dasharray:8,5" },
    { id: "aws_lbl", type: "label", x: AWS_X + 60, y: AWS_Y + 20, label: "AWS Cloud", style: "font-size:12px;font-weight:700;fill:var(--warn);text-anchor:start" },

    // ── VPC border ──
    { id: "vpc_border", type: "box", x: VPC_X, y: VPC_Y, w: VPC_W, h: VPC_H, rx: 10, style: "fill:var(--good);opacity:0.05;stroke:var(--good);stroke-width:1.5;stroke-dasharray:5,4" },
    { id: "vpc_lbl", type: "label", x: VPC_X + 30, y: VPC_Y + 16, label: "VPC", style: "font-size:11px;font-weight:700;fill:var(--good);text-anchor:start" },

    // ── EKS Cluster border ──
    { id: "eks_border", type: "box", x: EKS_X, y: EKS_Y, w: EKS_W, h: EKS_H, rx: 10, style: "fill:var(--accent);opacity:0.07;stroke:var(--accent);stroke-width:2" },
    { id: "eks_lbl", type: "label", x: EKS_X + EKS_W / 2, y: EKS_Y + 20, label: "EKS Cluster", style: "font-size:13px;font-weight:700;fill:var(--accent)" },

    // ── Control Plane (managed) ──
    { id: "cp_box", type: "box", x: CP_X, y: CP_Y, w: CP_W, h: CP_H, rx: 8, style: "fill:var(--accent);opacity:0.8" },
    { id: "cp_lbl", type: "label", x: CP_X + CP_W / 2, y: CP_Y + 28, label: "Control Plane", style: "font-size:13px;font-weight:700;fill:#fff" },
    { id: "cp_sub", type: "label", x: CP_X + CP_W / 2, y: CP_Y + 52, label: "Gerenciado pela AWS", style: "font-size:11px;fill:#eee" },
    { id: "cp_azs", type: "label", x: CP_X + CP_W / 2, y: CP_Y + 74, label: "3 AZs • HA garantido", style: "font-size:10px;fill:#cce" },

    // ── Node Group 1 (EC2 Managed) ──
    { id: "ng1_box", type: "box", x: NG1_X, y: NG1_Y, w: NG1_W, h: NG1_H, rx: 8, style: "fill:var(--good);opacity:0.15;stroke:var(--good);stroke-width:1.5" },
    { id: "ng1_lbl", type: "label", x: NG1_X + NG1_W / 2, y: NG1_Y + 20, label: "Node Group (EC2)", style: "font-size:12px;font-weight:700;fill:var(--good)" },
    // EC2 instances inside
    { id: "ec2_a", type: "box", x: NG1_X + 20, y: POD_Y, w: 100, h: 80, rx: 6, style: "fill:var(--good);opacity:0.7" },
    { id: "ec2_a_lbl", type: "label", x: NG1_X + 70, y: POD_Y + 26, label: "EC2", style: "font-size:11px;font-weight:700;fill:#fff" },
    { id: "ec2_a_pod", type: "box", x: NG1_X + 30, y: POD_Y + 38, w: 80, h: 28, rx: 4, style: "fill:rgba(255,255,255,0.3)" },
    { id: "ec2_a_pod_lbl", type: "label", x: NG1_X + 70, y: POD_Y + 52, label: "Pod", style: "font-size:10px;fill:#fff" },
    { id: "ec2_b", type: "box", x: NG1_X + 160, y: POD_Y, w: 100, h: 80, rx: 6, style: "fill:var(--good);opacity:0.7" },
    { id: "ec2_b_lbl", type: "label", x: NG1_X + 210, y: POD_Y + 26, label: "EC2", style: "font-size:11px;font-weight:700;fill:#fff" },
    { id: "ec2_b_pod", type: "box", x: NG1_X + 170, y: POD_Y + 38, w: 80, h: 28, rx: 4, style: "fill:rgba(255,255,255,0.3)" },
    { id: "ec2_b_pod_lbl", type: "label", x: NG1_X + 210, y: POD_Y + 52, label: "Pod", style: "font-size:10px;fill:#fff" },

    // ── Node Group 2 (Spot / dedicated) ──
    { id: "ng2_box", type: "box", x: NG2_X, y: NG2_Y, w: NG2_W, h: NG2_H, rx: 8, style: "fill:var(--accent-2);opacity:0.15;stroke:var(--accent-2);stroke-width:1.5" },
    { id: "ng2_lbl", type: "label", x: NG2_X + NG2_W / 2, y: NG2_Y + 20, label: "Node Group (Spot EC2)", style: "font-size:12px;font-weight:700;fill:var(--accent-2)" },
    { id: "ec2_c", type: "box", x: NG2_X + 20, y: POD_Y, w: 100, h: 80, rx: 6, style: "fill:var(--accent-2);opacity:0.7" },
    { id: "ec2_c_lbl", type: "label", x: NG2_X + 70, y: POD_Y + 26, label: "Spot EC2", style: "font-size:10px;font-weight:700;fill:#fff" },
    { id: "ec2_c_pod", type: "box", x: NG2_X + 30, y: POD_Y + 38, w: 80, h: 28, rx: 4, style: "fill:rgba(255,255,255,0.3)" },
    { id: "ec2_c_pod_lbl", type: "label", x: NG2_X + 70, y: POD_Y + 52, label: "Pod", style: "font-size:10px;fill:#fff" },
    { id: "ec2_d", type: "box", x: NG2_X + 160, y: POD_Y, w: 100, h: 80, rx: 6, style: "fill:var(--accent-2);opacity:0.7" },
    { id: "ec2_d_lbl", type: "label", x: NG2_X + 210, y: POD_Y + 26, label: "Spot EC2", style: "font-size:10px;font-weight:700;fill:#fff" },
    { id: "ec2_d_pod", type: "box", x: NG2_X + 170, y: POD_Y + 38, w: 80, h: 28, rx: 4, style: "fill:rgba(255,255,255,0.3)" },
    { id: "ec2_d_pod_lbl", type: "label", x: NG2_X + 210, y: POD_Y + 52, label: "Pod", style: "font-size:10px;fill:#fff" },

    // ── Fargate profile ──
    { id: "fg_box", type: "box", x: FG_X, y: FG_Y, w: FG_W, h: FG_H, rx: 8, style: "fill:var(--hot);opacity:0.2;stroke:var(--hot);stroke-width:1.5" },
    { id: "fg_lbl", type: "label", x: FG_X + FG_W / 2, y: FG_Y + 22, label: "Fargate Profile", style: "font-size:12px;font-weight:700;fill:var(--hot)" },
    { id: "fg_sub", type: "label", x: FG_X + FG_W / 2, y: FG_Y + 46, label: "Serverless Nodes", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "fg_sub2", type: "label", x: FG_X + FG_W / 2, y: FG_Y + 66, label: "Pod = 1 microVM (Firecracker)", style: "font-size:10px;fill:var(--hot)" },
    { id: "fg_sub3", type: "label", x: FG_X + FG_W / 2, y: FG_Y + 84, label: "Sem gerenciar nodes", style: "font-size:10px;fill:var(--ink-soft)" },

    // ── Arrows CP → Node Groups ──
    { id: "arr_cp_ng1", type: "arrow", x1: CP_X + CP_W, y1: CP_Y + 50, x2: NG1_X, y2: NG1_Y + 75, style: "stroke:var(--accent);stroke-width:2;stroke-dasharray:4,3" },
    { id: "arr_cp_ng2", type: "arrow", x1: CP_X + CP_W, y1: CP_Y + 50, x2: NG2_X, y2: NG2_Y + 75, style: "stroke:var(--accent);stroke-width:2;stroke-dasharray:4,3" },
    { id: "arr_cp_fg", type: "arrow", x1: CP_X + CP_W / 2, y1: CP_Y + CP_H, x2: FG_X + FG_W / 2, y2: FG_Y, style: "stroke:var(--hot);stroke-width:1.5;stroke-dasharray:4,3" },

    // ── Add-ons row ──
    { id: "add_border", type: "box", x: EKS_X + 20, y: ADD_Y, w: EKS_W - 40, h: 80, rx: 8, style: "fill:var(--surface);stroke:var(--line);stroke-width:1" },
    { id: "add_title", type: "label", x: EKS_X + EKS_W / 2, y: ADD_Y + 18, label: "EKS Add-ons", style: "font-size:11px;font-weight:700;fill:var(--ink-soft)" },
    ...["coredns", "vpc-cni", "kube-proxy", "aws-ebs-csi", "metrics-server"].map((a, i) => ({
      id: `addon_${i}`, type: "box", x: EKS_X + 30 + i * 200, y: ADD_Y + 32, w: 170, h: 36, rx: 6,
      style: "fill:var(--accent);opacity:0.6"
    })),
    ...["coredns", "vpc-cni", "kube-proxy", "aws-ebs-csi", "metrics-server"].map((a, i) => ({
      id: `addon_${i}_lbl`, type: "label", x: EKS_X + 115 + i * 200, y: ADD_Y + 50, label: a,
      style: "font-size:10px;fill:#fff;font-weight:600"
    })),

    // ── External services ──
    // ECR
    { id: "ecr_box", type: "box", x: AWS_X + AWS_W - 180, y: AWS_Y + 60, w: 140, h: 60, rx: 8, style: "fill:var(--accent-2);opacity:0.8" },
    { id: "ecr_lbl", type: "label", x: AWS_X + AWS_W - 110, y: AWS_Y + 85, label: "ECR", style: "font-size:12px;font-weight:700;fill:#fff" },
    { id: "ecr_sub", type: "label", x: AWS_X + AWS_W - 110, y: AWS_Y + 103, label: "Container Registry", style: "font-size:9px;fill:#eee" },
    { id: "arr_ecr_ng", type: "arrow", x1: AWS_X + AWS_W - 180, y1: AWS_Y + 90, x2: NG2_X + NG2_W, y2: NG2_Y + 50, style: "stroke:var(--accent-2);stroke-width:1.5;stroke-dasharray:4,3" },

    // IAM / IRSA detail
    { id: "irsa_panel", type: "box", x: 80, y: 560, w: 600, h: 100, rx: 10, style: "fill:var(--surface);stroke:var(--warn);stroke-width:1.5" },
    { id: "irsa_t", type: "label", x: 380, y: 578, label: "IRSA — IAM Roles for Service Accounts", style: "font-size:13px;font-weight:700;fill:var(--warn)" },
    { id: "irsa_d1", type: "label", x: 380, y: 604, label: "Pod assume IAM Role via Service Account annotation", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "irsa_d2", type: "label", x: 380, y: 624, label: "Sem credenciais no código — usa OIDC token federado com STS", style: "font-size:11px;fill:var(--warn)" },
    { id: "irsa_d3", type: "label", x: 380, y: 644, label: "Princípio do menor privilégio por Pod", style: "font-size:11px;fill:var(--good)" },

    // ALB Ingress Controller
    { id: "alb_panel", type: "box", x: 700, y: 560, w: 480, h: 100, rx: 10, style: "fill:var(--surface);stroke:var(--accent);stroke-width:1.5" },
    { id: "alb_t", type: "label", x: 940, y: 578, label: "AWS Load Balancer Controller", style: "font-size:13px;font-weight:700;fill:var(--accent)" },
    { id: "alb_d1", type: "label", x: 940, y: 604, label: "Cria ALB/NLB AWS automaticamente a partir de Ingress/Service", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "alb_d2", type: "label", x: 940, y: 624, label: "Target Groups = Pods direto (IP mode)", style: "font-size:11px;fill:var(--accent)" },
    { id: "alb_d3", type: "label", x: 940, y: 644, label: "WAF, ACM, Security Groups integrados", style: "font-size:11px;fill:var(--good)" },

    // Comparison panel
    { id: "cmp_panel", type: "box", x: 80, y: 150, w: 1120, h: 520, rx: 12, style: "fill:var(--surface);stroke:var(--line);stroke-width:1.5" },
    { id: "cmp_title", type: "label", x: 640, y: 176, label: "EKS vs Self-managed K8s vs ECS", style: "font-size:16px;font-weight:700;fill:var(--ink)" },
    { id: "cmp_h1", type: "label", x: 280, y: 218, label: "EKS (K8s gerenciado)", style: "font-size:13px;font-weight:700;fill:var(--accent)" },
    { id: "cmp_h2", type: "label", x: 640, y: 218, label: "Self-managed K8s", style: "font-size:13px;font-weight:700;fill:var(--ink-soft)" },
    { id: "cmp_h3", type: "label", x: 980, y: 218, label: "Amazon ECS", style: "font-size:13px;font-weight:700;fill:var(--good)" },
    ...["Control Plane", "Patches", "Ecosystem", "Portabilidade", "Complexidade", "Custo"].map((row, i) => ({
      id: `cmp_row_${i}`, type: "label", x: 80, y: 260 + i * 46, label: row,
      style: "font-size:11px;fill:var(--ink-soft);text-anchor:start"
    })),
    { id: "cmp_a1", type: "label", x: 280, y: 260, label: "Gerenciado pela AWS", style: "font-size:11px;fill:var(--good)" },
    { id: "cmp_a2", type: "label", x: 280, y: 306, label: "Automático", style: "font-size:11px;fill:var(--good)" },
    { id: "cmp_a3", type: "label", x: 280, y: 352, label: "Helm, Operators, CNCF", style: "font-size:11px;fill:var(--good)" },
    { id: "cmp_a4", type: "label", x: 280, y: 398, label: "Multi-cloud, híbrido", style: "font-size:11px;fill:var(--good)" },
    { id: "cmp_a5", type: "label", x: 280, y: 444, label: "Alta (K8s é complexo)", style: "font-size:11px;fill:var(--warn)" },
    { id: "cmp_a6", type: "label", x: 280, y: 490, label: "$0.10/hr por cluster", style: "font-size:11px;fill:var(--warn)" },
    { id: "cmp_b1", type: "label", x: 640, y: 260, label: "Você mesmo", style: "font-size:11px;fill:var(--warn)" },
    { id: "cmp_b2", type: "label", x: 640, y: 306, label: "Manual", style: "font-size:11px;fill:var(--hot)" },
    { id: "cmp_b3", type: "label", x: 640, y: 352, label: "Total (máxima liberdade)", style: "font-size:11px;fill:var(--good)" },
    { id: "cmp_b4", type: "label", x: 640, y: 398, label: "Multi-cloud, on-prem", style: "font-size:11px;fill:var(--good)" },
    { id: "cmp_b5", type: "label", x: 640, y: 444, label: "Muito alta", style: "font-size:11px;fill:var(--hot)" },
    { id: "cmp_b6", type: "label", x: 640, y: 490, label: "Só EC2 (sem taxa K8s)", style: "font-size:11px;fill:var(--good)" },
    { id: "cmp_c1", type: "label", x: 980, y: 260, label: "Gerenciado pela AWS", style: "font-size:11px;fill:var(--good)" },
    { id: "cmp_c2", type: "label", x: 980, y: 306, label: "Automático", style: "font-size:11px;fill:var(--good)" },
    { id: "cmp_c3", type: "label", x: 980, y: 352, label: "AWS-only (ECR, ALB, IAM)", style: "font-size:11px;fill:var(--warn)" },
    { id: "cmp_c4", type: "label", x: 980, y: 398, label: "AWS apenas", style: "font-size:11px;fill:var(--hot)" },
    { id: "cmp_c5", type: "label", x: 980, y: 444, label: "Baixa (mais simples)", style: "font-size:11px;fill:var(--good)" },
    { id: "cmp_c6", type: "label", x: 980, y: 490, label: "Sem taxa K8s", style: "font-size:11px;fill:var(--good)" },

    // Quiz
    { id: "quiz_panel", type: "box", x: 100, y: 50, w: 1080, h: 620, rx: 12, style: "fill:var(--surface);stroke:var(--accent);stroke-width:2" },
    { id: "quiz_title", type: "label", x: 640, y: 80, label: "Quiz — Amazon EKS", style: "font-size:18px;font-weight:700;fill:var(--ink)" },
    { id: "q1", type: "label", x: 640, y: 140, label: "Q: O que a AWS gerencia no EKS?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q1a", type: "label", x: 640, y: 165, label: "A: O Control Plane (API Server, etcd) com HA em 3 AZs. Você gerencia os Worker Nodes.", style: "font-size:12px;fill:var(--good)" },
    { id: "q2", type: "label", x: 640, y: 215, label: "Q: Diferença Node Group EC2 vs Fargate?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q2a", type: "label", x: 640, y: 240, label: "A: EC2: você paga/gerencia os nodes. Fargate: serverless, AWS cria microVM por Pod.", style: "font-size:12px;fill:var(--good)" },
    { id: "q3", type: "label", x: 640, y: 290, label: "Q: O que é IRSA?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q3a", type: "label", x: 640, y: 315, label: "A: IAM Roles para Service Accounts. Permite Pod assumir IAM Role sem credenciais no código.", style: "font-size:12px;fill:var(--good)" },
    { id: "q4", type: "label", x: 640, y: 365, label: "Q: O que faz o AWS Load Balancer Controller?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q4a", type: "label", x: 640, y: 390, label: "A: Cria ALB/NLB AWS automaticamente a partir de Ingress/Service resources no K8s.", style: "font-size:12px;fill:var(--good)" },
    { id: "q5", type: "label", x: 640, y: 440, label: "Q: Quando escolher ECS em vez de EKS?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q5a", type: "label", x: 640, y: 465, label: "A: Quando você quer simplicidade, não precisa de portabilidade e fica 100% na AWS.", style: "font-size:12px;fill:var(--good)" },
    { id: "q6", type: "label", x: 640, y: 515, label: "Q: O que são EKS Add-ons?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q6a", type: "label", x: 640, y: 540, label: "A: Components gerenciados pela AWS: coredns, vpc-cni, kube-proxy, ebs-csi — atualizações automáticas.", style: "font-size:12px;fill:var(--good)" },

    // Summary
    { id: "sum_panel", type: "box", x: 80, y: 40, w: 1120, h: 640, rx: 12, style: "fill:var(--surface);stroke:var(--line);stroke-width:1.5" },
    { id: "sum_title", type: "label", x: 640, y: 68, label: "Amazon EKS — Resumo", style: "font-size:20px;font-weight:700;fill:var(--ink)" },
    { id: "sum1", type: "box", x: 120, y: 96, w: 470, h: 220, rx: 8, style: "fill:var(--accent);opacity:0.1" },
    { id: "sum1t", type: "label", x: 355, y: 116, label: "EKS = K8s Gerenciado", style: "font-size:13px;font-weight:700;fill:var(--accent)" },
    { id: "sum1a", type: "label", x: 355, y: 140, label: "Control Plane: AWS cuida de tudo", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum1b", type: "label", x: 355, y: 160, label: "Worker Nodes: EC2 Managed ou Fargate", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum1c", type: "label", x: 355, y: 180, label: "Add-ons: coredns, vpc-cni, kube-proxy", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum1d", type: "label", x: 355, y: 200, label: "IRSA: IAM sem credenciais em código", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum1e", type: "label", x: 355, y: 220, label: "ECR: registry integrado", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum1f", type: "label", x: 355, y: 240, label: "ALB Controller: Ingress → ALB AWS", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum1g", type: "label", x: 355, y: 265, label: "Standard K8s API — portabilidade multi-cloud", style: "font-size:11px;fill:var(--accent)" },
    { id: "sum2", type: "box", x: 690, y: 96, w: 450, h: 220, rx: 8, style: "fill:var(--good);opacity:0.1" },
    { id: "sum2t", type: "label", x: 915, y: 116, label: "Integrações AWS Nativas", style: "font-size:13px;font-weight:700;fill:var(--good)" },
    { id: "sum2a", type: "label", x: 915, y: 140, label: "IAM: RBAC + IRSA", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum2b", type: "label", x: 915, y: 160, label: "VPC: cada Pod tem IP próprio (vpc-cni)", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum2c", type: "label", x: 915, y: 180, label: "CloudWatch: logs e métricas", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum2d", type: "label", x: 915, y: 200, label: "ALB/NLB: load balancing nativo", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum2e", type: "label", x: 915, y: 220, label: "EBS/EFS: persistent volumes", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum2f", type: "label", x: 915, y: 240, label: "ACM: TLS automático", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum2g", type: "label", x: 915, y: 265, label: "Karpenter: node autoscaling next-gen", style: "font-size:11px;fill:var(--good)" },
    { id: "sum3", type: "box", x: 120, y: 340, w: 1020, h: 260, rx: 8, style: "fill:var(--surface);stroke:var(--line);stroke-width:1" },
    { id: "sum3t", type: "label", x: 630, y: 362, label: "Arquitetura típica EKS em produção", style: "font-size:13px;font-weight:700;fill:var(--ink)" },
    { id: "sum3a", type: "label", x: 630, y: 390, label: "Internet → Route53 → ACM → ALB → EKS (Ingress) → Services → Pods", style: "font-size:12px;fill:var(--ink)" },
    { id: "sum3b", type: "label", x: 630, y: 416, label: "Pods → IRSA → S3 / RDS / SQS / DynamoDB (sem credentials no código)", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "sum3c", type: "label", x: 630, y: 442, label: "Node Groups: On-Demand para stateful, Spot para stateless (economia 70-90%)", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "sum3d", type: "label", x: 630, y: 468, label: "Karpenter (novo) ou Cluster Autoscaler (legado) para node scaling", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "sum3e", type: "label", x: 630, y: 496, label: "GitOps: ArgoCD ou Flux aplica manifests K8s automaticamente do Git", style: "font-size:12px;fill:var(--accent)" },
    { id: "sum3f", type: "label", x: 630, y: 548, label: "EKS = padrão de mercado para K8s na AWS com menos ops overhead", style: "font-size:13px;font-weight:600;fill:var(--accent)" },
  ];

  const ALL_IDS = elements.map(e => e.id);
  const BASE_IDS = [
    "aws_border","aws_lbl","vpc_border","vpc_lbl","eks_border","eks_lbl",
    "cp_box","cp_lbl","cp_sub","cp_azs",
    "ng1_box","ng1_lbl","ec2_a","ec2_a_lbl","ec2_a_pod","ec2_a_pod_lbl","ec2_b","ec2_b_lbl","ec2_b_pod","ec2_b_pod_lbl",
    "ng2_box","ng2_lbl","ec2_c","ec2_c_lbl","ec2_c_pod","ec2_c_pod_lbl","ec2_d","ec2_d_lbl","ec2_d_pod","ec2_d_pod_lbl",
    "arr_cp_ng1","arr_cp_ng2",
  ];
  const ADDON_IDS = [0,1,2,3,4].flatMap(i => [`addon_${i}`,`addon_${i}_lbl`]);

  function showBase(ctx) {
    ALL_IDS.forEach(id => ctx.hide(id));
    ctx.show("title_main");
    BASE_IDS.forEach(id => ctx.show(id));
  }

  const steps = [
    {
      title: "EKS: Kubernetes Gerenciado na AWS",
      balloon: { anchor: { x: 640, y: 680 }, placement: "top",
        text: "Amazon EKS (Elastic Kubernetes Service) executa Kubernetes na AWS com o Control Plane totalmente gerenciado — você não precisa instalar, operar ou fazer patch do etcd ou API Server.",
        why: "K8s auto-gerenciado exige expertise profunda. EKS remove essa carga operacional mantendo a API padrão K8s." },
      enter(ctx) { showBase(ctx); }
    },
    {
      title: "Control Plane Gerenciado pela AWS",
      balloon: { anchor: "cp_box", placement: "right",
        text: "A AWS roda o Control Plane em 3 AZs, garantindo HA. API Server, etcd, Scheduler e Controller Manager são opacos para você — zero gerenciamento.",
        why: "Falha de uma AZ? O Control Plane continua funcionando. EKS tem SLA de 99.95%.",
        deep: `<p>Diferente de um cluster self-managed, você nunca acessa diretamente o etcd ou os nós do Control Plane no EKS — a AWS expõe apenas o endpoint da API. Isso remove uma classe inteira de tarefas operacionais: upgrade de versão do etcd, backup/restore, tuning de performance do Raft.</p>
<div class="xp-example"><strong>O que você configura vs. o que a AWS gerencia</strong>Você define: versão do K8s do cluster (eksctl create cluster --version 1.29)
AWS cuida de: HA do etcd/API Server nas 3 AZs, patches de segurança, upgrades do Control Plane</div>
<p>O upgrade de versão do Control Plane é iniciado por você (não é automático), mas a execução — incluindo failover das réplicas do etcd — é toda gerenciada pela AWS, sem downtime perceptível para a API.</p>` },
      enter(ctx) { showBase(ctx); }
    },
    {
      title: "Node Groups: EC2 Managed",
      balloon: { anchor: "ng1_box", placement: "bottom",
        text: "Worker Nodes são EC2 instances em Node Groups. A AWS gerencia o provisionamento e atualização dos nodes — você escolhe o tipo de instância e o AMI K8s.",
        why: "Node Groups permitem múltiplos pools com tipos diferentes: on-demand para stateful, spot para stateless.",
        deep: `<p>Um Managed Node Group é, por baixo, um Auto Scaling Group da AWS com um launch template usando uma AMI otimizada para EKS. O kubelet já vem configurado para registrar o nó automaticamente no cluster ao subir — sem passos manuais de <code>kubeadm join</code>.</p>
<div class="xp-example"><strong>Criando um node group com eksctl</strong>eksctl create nodegroup \\
  --cluster meu-cluster \\
  --node-type m5.large \\
  --nodes-min 2 --nodes-max 6 \\
  --spot</div>
<p>Node Groups distintos permitem misturar perfis de capacidade: um pool On-Demand para workloads stateful sensíveis a interrupção, e outro Spot para workloads stateless tolerantes a preempção, ambos registrados no mesmo cluster.</p>` },
      enter(ctx) { showBase(ctx); }
    },
    {
      title: "Fargate Profiles: Serverless Nodes",
      balloon: { anchor: "fg_box", placement: "right",
        text: "Com Fargate, cada Pod roda em uma microVM isolada (Firecracker). Sem gerenciar nodes — você paga só pelo que o Pod usa.",
        why: "Ideal para workloads variáveis. Sem over-provisioning de nodes. Isolamento de segurança por Pod.",
        deep: `<p>Um Fargate Profile seleciona quais Pods rodam em Fargate via namespace + labels — não é "tudo ou nada" no cluster. Pods que casam com o profile ganham automaticamente um nó Fargate dedicado, sem passar pelo Scheduler tradicional de bin-packing em EC2.</p>
<div class="xp-example"><strong>Selecionando Pods para Fargate</strong>eksctl create fargateprofile \\
  --cluster meu-cluster \\
  --name fp-batch \\
  --namespace batch-jobs</div>
<p>Trade-off: sem DaemonSets (não há nó compartilhado para eles rodarem) e cobrança por vCPU/memória do Pod, arredondada para cima — mais caro por unidade de compute que EC2 Spot, mas sem o trabalho de dimensionar nodes.</p>` },
      enter(ctx) {
        showBase(ctx);
        ctx.show("fg_box"); ctx.show("fg_lbl"); ctx.show("fg_sub"); ctx.show("fg_sub2"); ctx.show("fg_sub3");
        ctx.show("arr_cp_fg");
      }
    },
    {
      title: "VPC e Subnets (vpc-cni)",
      balloon: { anchor: "vpc_lbl", placement: "right",
        text: "O add-on vpc-cni dá a cada Pod um IP real da VPC (não overlay). Pods em subnets privadas, nodes em subnets privadas, ALB em subnet pública.",
        why: "IP real simplifica security groups por Pod, rastreamento de tráfego e integração com outros serviços AWS.",
        deep: `<p>Diferente de CNIs overlay (como Flannel/Calico em modo overlay), o vpc-cni aloca ENIs (Elastic Network Interfaces) da própria VPC e atribui IPs secundários dessas ENIs diretamente aos Pods. Isso significa que o IP do Pod é roteável nativamente na VPC, sem NAT ou encapsulamento extra.</p>
<div class="xp-example"><strong>Consequência prática</strong>Security Group aplicado por Pod:
apiVersion: v1
kind: Pod
metadata:
  annotations:
    vpc.amazonaws.com/pod-eni: "arn:aws:ec2:..."</div>
<p>O limite de Pods por nó no EKS não é arbitrário — depende de quantos IPs secundários o tipo de instância EC2 suporta (ex: m5.large suporta bem menos Pods que m5.4xlarge), algo que não existe em CNIs overlay.</p>` },
      enter(ctx) { showBase(ctx); ctx.show("vpc_border"); ctx.show("vpc_lbl"); }
    },
    {
      title: "IRSA: IAM Roles para Service Accounts",
      balloon: { anchor: { x: 380, y: 620 }, placement: "top",
        text: "IRSA permite que um Pod assuma um IAM Role via Service Account annotation, sem credenciais no código. Usa OIDC federation com AWS STS.",
        why: "Princípio do menor privilégio por Pod: um Pod que lê S3 não tem acesso ao DynamoDB. Sem rotação manual de secrets.",
        deep: `<p>O EKS expõe um provedor OIDC único por cluster. Quando um Pod usa um Service Account anotado com um IAM Role, o kubelet injeta um token JWT temporário no Pod; a aplicação (via AWS SDK) troca esse token por credenciais IAM temporárias chamando <code>sts:AssumeRoleWithWebIdentity</code> — tudo isso sem nenhuma chave de acesso estática.</p>
<div class="xp-example"><strong>Service Account anotado</strong>apiVersion: v1
kind: ServiceAccount
metadata:
  name: app-sa
  annotations:
    eks.amazonaws.com/role-arn: arn:aws:iam::123456789012:role/app-s3-reader</div>
<p>A Trust Policy do IAM Role restringe <em>qual</em> Service Account pode assumi-lo (via <code>sub</code> claim do OIDC), então mesmo que dois Pods rodem no mesmo nó, cada um só acessa os recursos AWS que sua própria Service Account autoriza.</p>` },
      enter(ctx) {
        showBase(ctx);
        ctx.show("irsa_panel"); ctx.show("irsa_t"); ctx.show("irsa_d1"); ctx.show("irsa_d2"); ctx.show("irsa_d3");
      }
    },
    {
      title: "EKS Add-ons (Gerenciados)",
      balloon: { anchor: "add_title", placement: "bottom",
        text: "EKS Add-ons são components essenciais gerenciados pela AWS: coredns (DNS), vpc-cni (rede), kube-proxy (services), ebs-csi (storage), metrics-server.",
        why: "Add-ons recebem updates automáticos de segurança — sem gerenciar versões manualmente.",
        deep: `<p>Antes dos EKS Add-ons existirem como recurso gerenciado, esses components eram instalados como manifests comuns — e ficava por sua conta acompanhar releases e aplicar upgrades manualmente. Como Add-on gerenciado, a AWS versiona, testa compatibilidade com a versão do cluster e permite upgrade com um comando.</p>
<div class="xp-example"><strong>Atualizando um add-on</strong>aws eks update-addon \\
  --cluster-name meu-cluster \\
  --addon-name vpc-cni \\
  --addon-version v1.18.1-eksbuild.1</div>
<p>Nem todo componente do cluster é um EKS Add-on — ferramentas de terceiros (ArgoCD, cert-manager, ingress-nginx) continuam sendo instaladas via Helm/manifests normais, gerenciadas por você.</p>` },
      enter(ctx) {
        showBase(ctx);
        ctx.show("add_border"); ctx.show("add_title");
        ADDON_IDS.forEach(id => ctx.show(id));
      }
    },
    {
      title: "ECR: Container Registry Integrado",
      balloon: { anchor: "ecr_box", placement: "left",
        text: "ECR (Elastic Container Registry) é o registry privado da AWS. Integra com IAM, escaneia vulnerabilidades e replica imagens entre regiões.",
        why: "Node Groups puxam imagens do ECR sem credenciais — IAM role do node tem permissão implícita.",
        deep: `<p>O node role do EC2 (ou a execution role do Fargate) inclui a policy <code>AmazonEC2ContainerRegistryReadOnly</code>, que autoriza <code>ecr:GetAuthorizationToken</code> e <code>ecr:BatchGetImage</code> — por isso o kubelet consegue puxar imagens do ECR sem nenhum <code>imagePullSecret</code> configurado manualmente no Pod.</p>
<div class="xp-example"><strong>Referenciando uma imagem do ECR</strong>containers:
- name: myapp
  image: 123456789012.dkr.ecr.us-east-1.amazonaws.com/myapp:v2</div>
<p>O scan de vulnerabilidades do ECR (baseado em Clair ou Amazon Inspector, dependendo da configuração) roda automaticamente a cada push de imagem, sinalizando CVEs conhecidas antes da imagem chegar a produção.</p>` },
      enter(ctx) {
        showBase(ctx);
        ctx.show("ecr_box"); ctx.show("ecr_lbl"); ctx.show("ecr_sub"); ctx.show("arr_ecr_ng");
      }
    },
    {
      title: "AWS Load Balancer Controller",
      balloon: { anchor: { x: 940, y: 620 }, placement: "top",
        text: "O ALB Controller cria ALBs e NLBs AWS automaticamente a partir de Ingress e Service resources. Suporta WAF, ACM (TLS), e IP target mode (Pods diretamente).",
        why: "IP mode elimina o hop extra do kube-proxy — tráfego vai direto do ALB para o Pod, reduzindo latência.",
        deep: `<p>O controller roda como um Deployment dentro do próprio cluster e observa (watch) objetos <code>Ingress</code>/<code>Service</code> via API Server, chamando a API da AWS para provisionar o ALB real. Em <strong>IP target mode</strong>, os Target Groups do ALB apontam direto para os IPs dos Pods (via vpc-cni) — em <strong>instance mode</strong>, apontam para as portas NodePort nos EC2, exigindo o hop extra do kube-proxy.</p>
<div class="xp-example"><strong>Ingress anotado para IP mode</strong>metadata:
  annotations:
    alb.ingress.kubernetes.io/target-type: ip
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/certificate-arn: arn:aws:acm:...</div>
<p>Como o ALB fala HTTP/HTTPS nativamente, ele também faz o papel de terminação TLS (via ACM) e integra com WAF sem precisar de um proxy adicional dentro do cluster.</p>` },
      enter(ctx) {
        showBase(ctx);
        ctx.show("alb_panel"); ctx.show("alb_t"); ctx.show("alb_d1"); ctx.show("alb_d2"); ctx.show("alb_d3");
      }
    },
    {
      title: "EKS vs Self-managed K8s vs ECS",
      balloon: { anchor: { x: 640, y: 660 }, placement: "top",
        text: "EKS: K8s padrão gerenciado, portável. Self-managed: máxima liberdade, máximo trabalho. ECS: simples, AWS-only, sem K8s.",
        why: "Para nova workload na AWS: EKS se precisar de K8s/portabilidade, ECS se quiser simplicidade máxima.",
        deep: `<p>A decisão raramente é só técnica — costuma refletir o quanto o time já sabe de K8s e o quanto a portabilidade multi-cloud importa para o negócio. ECS usa conceitos próprios da AWS (Task Definition, Service, Cluster) que não têm equivalente fora da AWS; EKS usa a API padrão do Kubernetes, portável para qualquer provedor ou on-prem.</p>
<div class="xp-good"><strong>Escolha EKS quando</strong>o time já opera K8s, precisa de portabilidade/multi-cloud, ou quer usar o ecossistema CNCF (Helm charts, Operators, service mesh).</div>
<div class="xp-bad"><strong>Evite EKS quando</strong>o time nunca operou K8s e a workload é simples — nesse caso, o overhead de aprender K8s pode superar o ganho, e ECS resolve com uma curva de aprendizado bem menor.</div>` },
      enter(ctx) {
        ALL_IDS.forEach(id => ctx.hide(id));
        ctx.show("title_main");
        ctx.show("cmp_panel"); ctx.show("cmp_title");
        [0,1,2,3,4,5].forEach(i => ctx.show(`cmp_row_${i}`));
        ["cmp_h1","cmp_h2","cmp_h3","cmp_a1","cmp_a2","cmp_a3","cmp_a4","cmp_a5","cmp_a6",
         "cmp_b1","cmp_b2","cmp_b3","cmp_b4","cmp_b5","cmp_b6",
         "cmp_c1","cmp_c2","cmp_c3","cmp_c4","cmp_c5","cmp_c6"].forEach(id => ctx.show(id));
      }
    },
    {
      title: "Quiz",
      balloon: { anchor: { x: 640, y: 360 }, placement: "bottom", text: "Teste seu conhecimento sobre Amazon EKS:" },
      quiz: {
        question: "O que é IRSA (IAM Roles for Service Accounts) no EKS?",
        options: [
          "Um serviço de monitoramento de roles do IAM",
          "Um mecanismo que permite Pods assumirem permissões IAM via OIDC sem credenciais hardcoded",
          "Uma forma de criar usuários IAM automaticamente para cada Pod",
          "Um add-on que gerencia secrets do AWS Secrets Manager"
        ],
        answer: 1,
        explain: "IRSA vincula IAM roles a Kubernetes ServiceAccounts via OIDC. Os Pods recebem tokens JWT temporários que o AWS STS troca por credenciais IAM — zero chaves hardcoded ou IAM users."
      }
    },
    {
      title: "Resumo",
      balloon: { anchor: { x: 640, y: 680 }, placement: "top",
        text: "EKS = K8s gerenciado na AWS com integrações nativas (IAM, VPC, ALB, ECR). Control Plane é responsabilidade da AWS." },
      enter(ctx) {
        ALL_IDS.forEach(id => ctx.hide(id));
        ctx.show("sum_panel"); ctx.show("sum_title");
        ["sum1","sum1t","sum1a","sum1b","sum1c","sum1d","sum1e","sum1f","sum1g",
         "sum2","sum2t","sum2a","sum2b","sum2c","sum2d","sum2e","sum2f","sum2g",
         "sum3","sum3t","sum3a","sum3b","sum3c","sum3d","sum3e","sum3f"].forEach(id => ctx.show(id));
      }
    }
  ];

  window.EKS_DIAGRAM = { title: "Amazon EKS", subtitle: "K8s Gerenciado · Fargate · IRSA · Node Groups · Add-ons", width: W, height: H, autoplayMs: 8000, elements, steps };
})();
