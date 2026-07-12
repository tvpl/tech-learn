/* ============================================================================
 * mcp.data.js — Explicador: Model Context Protocol (MCP)
 * Como LLMs se conectam a ferramentas e dados via MCP
 * ==========================================================================*/
(function () {
  const W = 1280, H = 720;

  // Colunas: Host/LLM (esq), Protocolo (meio), Servidores MCP (dir)
  const HX = 180, MX = 640, SX = 980;

  const msg = (id, x1, x2, y, label, color) => ([
    { id, type: "arrow", x1, y1: y, x2, y2: y, color: color || "var(--accent)" },
    { id: id + "_l", type: "label", x: (x1+x2)/2, y: y-13, sub: true, mono: true, anchor: "middle", label },
  ]);

  const elements = [
    /* ── HOST (esquerda) ──────────────────────────────── */
    { id: "h_host",   type: "box", x: HX-140, y: 30, w: 280, h: 280, fill: "#0e1730", rx: 14 },
    { id: "h_lbl",    type: "label", x: HX, y: 54, anchor: "middle", sub: true, label: "HOST (app, IDE, Claude Desktop)" },
    { id: "h_llm",    type: "box", x: HX-110, y: 70, w: 220, h: 70, fill: "#2a1d3d", stroke: "var(--accent)", label: "🧠 LLM" },
    { id: "h_client", type: "box", x: HX-110, y: 170, w: 220, h: 56, fill: "#22315d", label: "MCP Client" },
    { id: "a_lc",     type: "arrow", x1: HX, y1: 142, x2: HX, y2: 168, color: "var(--accent)" },

    /* ── PROTOCOLO (meio) ─────────────────────────────── */
    { id: "p_line",   type: "arrow", noHead: true, dashed: true, color: "var(--muted)",
      path: `M${MX},50 L${MX},680` },
    { id: "p_lbl",    type: "label", x: MX, y: 38, anchor: "middle", sub: true, label: "JSON-RPC 2.0 (stdio / HTTP+SSE)" },

    /* ── SERVIDORES MCP (direita) ─────────────────────── */
    { id: "s_fs",  type: "box", x: SX-130, y: 60,  w: 260, h: 80, fill: "#1b2747", stroke: "var(--good)",
      label: ["🗂️ MCP Server: Filesystem", "Tools · Resources · Prompts"] },
    { id: "s_gh",  type: "box", x: SX-130, y: 180, w: 260, h: 80, fill: "#1b2747", stroke: "var(--accent-2)",
      label: ["🐙 MCP Server: GitHub", "Tools · Resources · Prompts"] },
    { id: "s_db",  type: "box", x: SX-130, y: 300, w: 260, h: 80, fill: "#1b2747", stroke: "var(--warn)",
      label: ["🗄️ MCP Server: Database", "Tools · Resources · Prompts"] },
    { id: "s_api", type: "box", x: SX-130, y: 420, w: 260, h: 80, fill: "#1b2747", stroke: "var(--hot)",
      label: ["🌐 MCP Server: APIs externas", "Tools · Resources · Prompts"] },

    /* ── MENSAGENS DO PROTOCOLO ───────────────────────── */
    ...msg("m_init", HX+140, MX-10, 120, "initialize →", "var(--accent)"),
    ...msg("m_init_r", MX+10, HX+140, 160, "← capabilities", "var(--good)"),
    ...msg("m_tools", HX+140, MX-10, 220, "tools/list →", "var(--accent)"),
    ...msg("m_tools_r", MX+10, HX+140, 260, "← [tool_1, tool_2…]", "var(--good)"),
    ...msg("m_call", HX+140, MX-10, 340, "tools/call { name, args } →", "var(--warn)"),
    ...msg("m_call_r", MX+10, HX+140, 380, "← { result }", "var(--good)"),

    /* ── DETALHES INTERNOS DO SERVIDOR (revelados depois) ── */
    { id: "d_srv_inner", type: "box", x: SX-130, y: 60, w: 260, h: 300, fill: "#0e1730", rx: 14 },
    { id: "d_srv_lbl",   type: "label", x: SX, y: 82, anchor: "middle", label: "MCP Server expõe:" },
    { id: "d_tools",     type: "token", x: SX-110, y: 100, w: 220, h: 52, fill: "#22315d", stroke: "var(--accent)", label: ["🔧 Tools", "funções chamáveis pelo LLM"] },
    { id: "d_res",       type: "token", x: SX-110, y: 168, w: 220, h: 52, fill: "#1b2747", stroke: "var(--good)", label: ["📄 Resources", "dados/arquivos (URI)"] },
    { id: "d_prm",       type: "token", x: SX-110, y: 236, w: 220, h: 52, fill: "#1b2747", stroke: "var(--accent-2)", label: ["💬 Prompts", "templates reutilizáveis"] },
    { id: "d_srv_cap_lbl", type: "label", x: SX, y: 308, anchor: "middle", sub: true, label: "Servidor anuncia tudo via capabilities" },

    /* ── FLUXO COMPLETO ────────────────────────────────── */
    { id: "fl_lbl", type: "label", x: 640, y: 460, anchor: "middle", label: "Fluxo de uma chamada de ferramenta" },
    { id: "fl_1",   type: "token", x: 30,  y: 490, w: 170, h: 44, fill: "#2a1d3d", stroke: "var(--accent)", label: "① LLM decide usar tool" },
    { id: "fl_2",   type: "token", x: 230, y: 490, w: 170, h: 44, fill: "#22315d", label: "② Client envia call" },
    { id: "fl_3",   type: "token", x: 430, y: 490, w: 170, h: 44, fill: "#1b2747", label: "③ Server executa" },
    { id: "fl_4",   type: "token", x: 630, y: 490, w: 170, h: 44, fill: "#11351f", stroke: "var(--good)", label: "④ Resultado retorna" },
    { id: "fl_5",   type: "token", x: 830, y: 490, w: 170, h: 44, fill: "#2a1d3d", stroke: "var(--accent)", label: "⑤ LLM usa resultado" },
    { id: "a_fl12", type: "arrow", x1: 202, y1: 512, x2: 228, y2: 512, color: "var(--accent)" },
    { id: "a_fl23", type: "arrow", x1: 402, y1: 512, x2: 428, y2: 512, color: "var(--accent)" },
    { id: "a_fl34", type: "arrow", x1: 602, y1: 512, x2: 628, y2: 512, color: "var(--good)" },
    { id: "a_fl45", type: "arrow", x1: 802, y1: 512, x2: 828, y2: 512, color: "var(--good)" },

    /* ── SAMPLING ──────────────────────────────────────── */
    { id: "smp_lbl", type: "label", x: 640, y: 570, anchor: "middle", label: "Sampling: servidor pede completions ao LLM" },
    { id: "smp_box", type: "box",   x: 380, y: 590, w: 520, h: 70, fill: "#1b1224", stroke: "var(--accent-2)",
      label: ["Server → sampling/createMessage → Host → LLM → resposta → Server", "(fluxo inverso: servidor chama o modelo via host)"] },

    /* ── SEGURANÇA ─────────────────────────────────────── */
    { id: "sec_box", type: "box", x: 100, y: 560, w: 1080, h: 80, fill: "#1a1208", stroke: "var(--warn)",
      label: ["🔒 Segurança: Host controla o que cada servidor pode fazer · Usuário aprova ações sensíveis",
              "Cada servidor MCP roda em processo separado · Permissões declaradas nas capabilities"] },
  ];

  const steps = [
    {
      title: "O problema: LLMs isolados do mundo",
      show: ["h_host", "h_lbl", "h_llm"],
      highlight: ["h_llm"],
      balloon: { anchor: "h_llm", placement: "right",
        text: "LLMs são poderosos, mas vivem dentro de uma bolha: só enxergam o que está no prompt. Para ler arquivos, chamar APIs, consultar bancos de dados ou acessar dados em tempo real, precisam de uma ponte.",
        why: "Cada integração ad-hoc é única: um plugin de IDE não funciona numa CLI, um tool de um modelo não transfere para outro. O MCP padroniza isso.",
        deep: `<p>Antes de padrões como o MCP, cada integração era construída do zero e de forma proprietária: o plugin de ferramentas de um produto de IA não funcionava em outro, mesmo que ambos usassem LLMs parecidos — era N integrações para M ferramentas.</p>
<div class="xp-bad"><strong>Sem padrão (N×M integrações)</strong>IDE A precisa de conectores próprios para GitHub, Postgres e Slack.
IDE B precisa reimplementar os mesmos três conectores do zero.</div>
<div class="xp-good"><strong>Com MCP (N+M)</strong>Um servidor MCP de GitHub funciona em qualquer host que fale o protocolo — IDE A, IDE B, CLI, o que for.</div>
<p>É o mesmo problema que USB resolveu para hardware: antes, cada periférico tinha seu próprio conector; depois de um protocolo comum, qualquer dispositivo funciona em qualquer porta compatível.</p>` },
    },
    {
      title: "MCP: Host, Client e Server",
      show: ["h_client", "a_lc", "p_line", "p_lbl", "s_fs"],
      highlight: ["h_client", "p_line"],
      balloon: { anchor: "p_lbl", placement: "bottom",
        text: "O <strong>Model Context Protocol</strong> define três papéis: <strong>Host</strong> (a aplicação que hospeda o LLM), <strong>Client</strong> (gerencia conexões MCP dentro do host) e <strong>Server</strong> (processo externo que expõe capacidades).",
        why: "A separação é intencional: o servidor MCP pode ser escrito em qualquer linguagem e rodar em qualquer lugar — local ou remoto. O protocolo é JSON-RPC 2.0.",
        deep: `<p>A separação em três papéis existe para isolar responsabilidades: o <strong>Host</strong> é a aplicação que o usuário vê (VS Code, Claude Desktop); o <strong>Client</strong> vive dentro do host e fala o protocolo MCP com um servidor específico (tipicamente um client por servidor conectado); o <strong>Server</strong> é um processo independente que não sabe nada sobre qual LLM está do outro lado.</p>
<div class="xp-example"><strong>Handshake JSON-RPC simplificado</strong>{"jsonrpc": "2.0", "method": "initialize", "params": {"protocolVersion": "2024-11-05"}, "id": 1}</div>
<p>Como o transporte é JSON-RPC sobre stdio (processo local) ou HTTP+SSE (remoto), um servidor MCP pode rodar tanto como um subprocesso na mesma máquina quanto como um serviço remoto — o protocolo não muda.</p>` },
    },
    {
      title: "O que um servidor MCP expõe",
      show: ["d_srv_inner", "d_srv_lbl", "d_tools", "d_res", "d_prm", "d_srv_cap_lbl"],
      highlight: ["d_tools", "d_res", "d_prm"],
      balloon: { anchor: "d_tools", placement: "left",
        text: "Cada servidor MCP pode expor até três primitivas: <strong>Tools</strong> (funções chamáveis pelo LLM, ex.: ler_arquivo, buscar_commits), <strong>Resources</strong> (dados acessíveis via URI, ex.: file:///logs.txt) e <strong>Prompts</strong> (templates de prompt reutilizáveis).",
        why: "Tools são controladas pelo LLM (model-controlled); Resources são controladas pela aplicação (app-controlled); Prompts são expostas ao usuário para seleção.",
        deep: `<p>A distinção entre as três primitivas está em <strong>quem decide usá-las</strong>: Tools são chamadas pelo LLM de forma autônoma (o modelo decide, no meio do raciocínio, invocar uma); Resources são oferecidas para a aplicação anexar (ex.: o usuário escolhe "anexar este arquivo" na interface); Prompts são templates que o usuário seleciona explicitamente de um menu.</p>
<div class="xp-example"><strong>Exemplo de definição de tool</strong>{"name": "read_file", "description": "Lê o conteúdo de um arquivo do projeto", "inputSchema": {"path": "string"}}</div>
<p>Essa distinção evita um erro comum: tratar tudo como "tool" e deixar o LLM decidir quando, na verdade, o usuário deveria ter controle explícito (por exemplo, anexar um documento específico via Resources em vez do modelo escolher sozinho).</p>` },
      enter: (ctx) => {
        ctx.show("d_srv_inner");
        setTimeout(() => ctx.show("d_tools"), 80);
        setTimeout(() => ctx.show("d_res"), 200);
        setTimeout(() => ctx.show("d_prm"), 320);
      },
    },
    {
      title: "Inicialização: handshake de capabilities",
      show: ["m_init", "m_init_l", "m_init_r", "m_init_r_l"],
      highlight: ["h_client", "s_fs"],
      balloon: { anchor: "m_init_l", placement: "bottom",
        text: "A conexão começa com um <strong>handshake</strong>: o client envia <code>initialize</code> com sua versão do protocolo, e o servidor responde com suas <strong>capabilities</strong> (quais primitivas suporta: tools, resources, prompts, sampling).",
        why: "O handshake permite que cliente e servidor negociem compatibilidade de versão antes de qualquer chamada real. Conexões incompatíveis são rejeitadas cedo.",
        deep: `<p>O handshake troca <strong>capabilities</strong>, não apenas versões — o servidor declara explicitamente o que suporta (tools? resources? sampling?), e o client ajusta o que vai tentar usar. Um servidor que só implementa tools simplesmente não anuncia suporte a sampling, e o client não tenta usá-lo.</p>
<div class="xp-example"><strong>Resposta de initialize</strong>{"protocolVersion": "2024-11-05", "capabilities": {"tools": {}, "resources": {"subscribe": true}}, "serverInfo": {"name": "filesystem-server", "version": "1.2.0"}}</div>
<p>Negociar isso no início evita erros confusos no meio da execução — o client já sabe, antes de qualquer chamada real, exatamente quais recursos aquele servidor específico oferece.</p>` },
      enter: (ctx) => { ctx.drawArrow("m_init"); setTimeout(() => ctx.drawArrow("m_init_r"), 500); },
    },
    {
      title: "Listagem de ferramentas disponíveis",
      show: ["m_tools", "m_tools_l", "m_tools_r", "m_tools_r_l"],
      highlight: ["d_tools"],
      balloon: { anchor: "m_tools_l", placement: "bottom",
        text: "O client pede <code>tools/list</code> e recebe a lista de tools disponíveis, cada uma com <strong>nome</strong>, <strong>descrição</strong> (texto que o LLM lê para decidir quando usar) e <strong>schema de parâmetros</strong> (JSON Schema).",
        why: "O LLM usa as descrições para raciocinar sobre qual tool escolher e como preencher os argumentos. Boas descrições são críticas para a qualidade da integração.",
        deep: `<p>O que o LLM realmente "lê" para decidir qual tool usar é a <code>description</code> — não o nome da função. Uma tool chamada <code>search</code> com descrição vaga é escolhida com menos precisão do que uma descrição específica sobre quando usá-la.</p>
<div class="xp-bad"><strong>Descrição vaga</strong>"search: busca coisas"</div>
<div class="xp-good"><strong>Descrição específica</strong>"search: busca no repositório de documentação interna da empresa. Use quando o usuário perguntar sobre políticas, processos ou FAQ internos — não use para busca geral na web."</div>
<p>O <code>inputSchema</code> (JSON Schema) é igualmente importante: define tipos, campos obrigatórios e formatos esperados, permitindo que o client valide os argumentos que o LLM gerou antes de repassá-los ao servidor.</p>` },
      enter: (ctx) => { ctx.drawArrow("m_tools"); setTimeout(() => ctx.drawArrow("m_tools_r"), 500); },
    },
    {
      title: "Chamada de ferramenta: fluxo completo",
      show: ["m_call", "m_call_l", "m_call_r", "m_call_r_l", "fl_lbl",
             "fl_1", "fl_2", "fl_3", "fl_4", "fl_5",
             "a_fl12", "a_fl23", "a_fl34", "a_fl45"],
      highlight: ["fl_1", "fl_3", "fl_5"],
      balloon: { anchor: "fl_lbl", placement: "top",
        text: "O LLM emite um <code>tool_use</code> → o Client serializa como <code>tools/call</code> com nome e args → o Server executa a ação real → retorna o resultado → o Client injeta no próximo turno do LLM como <code>tool_result</code>.",
        why: "O LLM nunca executa código diretamente — ele apenas declara a intenção. O Host/Client é quem executa e decide se deve ou não prosseguir (pode pedir aprovação do usuário).",
        deep: `<p>Um ponto sutil do fluxo: o LLM nunca "chama" a função diretamente — ele apenas emite um bloco estruturado dizendo "quero chamar tool X com esses argumentos" (<code>tool_use</code>). Quem efetivamente executa é o Client/Host, que pode inspecionar, aprovar ou negar antes de repassar ao servidor.</p>
<div class="xp-example"><strong>Ciclo de uma chamada</strong>LLM emite: tool_use { name: "delete_file", args: { path: "/tmp/x" } }
Host intercepta e pede aprovação do usuário (ação destrutiva)
Usuário aprova → Client envia tools/call ao Server
Server executa e retorna → Client injeta tool_result no próximo turno</div>
<p>Essa indireção é o que permite guardrails: como o LLM só "propõe", o Host pode bloquear ações perigosas antes que aconteçam, sem depender de o modelo se autocensurar.</p>` },
      enter: (ctx) => {
        ctx.drawArrow("m_call");
        setTimeout(() => ctx.drawArrow("m_call_r"), 600);
        const flows = ["a_fl12","a_fl23","a_fl34","a_fl45"];
        flows.forEach((id, i) => setTimeout(() => ctx.drawArrow(id), 200 + i * 120));
      },
    },
    {
      title: "Múltiplos servidores simultâneos",
      show: ["s_gh", "s_db", "s_api"],
      highlight: ["s_fs", "s_gh", "s_db", "s_api"],
      balloon: { anchor: "s_gh", placement: "left",
        text: "Um único Host pode conectar-se a <strong>vários servidores MCP ao mesmo tempo</strong>: filesystem, GitHub, banco de dados, APIs externas. O LLM enxerga todas as tools como um pool unificado e decide qual usar.",
        why: "Isso é a vantagem chave do padrão: um ecossistema de servidores MCP reutilizáveis. A comunidade já tem servidores para Slack, PostgreSQL, Brave Search, Git, Notion e dezenas de outros.",
        deep: `<p>Do ponto de vista do LLM, não existe distinção entre tools de servidores diferentes — todas aparecem juntas na lista que ele recebe de <code>tools/list</code>, agregada pelo Host. O modelo escolhe pela descrição, não por saber "de qual servidor" a tool vem.</p>
<div class="xp-example"><strong>Pool de tools agregado</strong>[read_file (filesystem), search_issues (GitHub), run_query (Postgres), post_message (Slack)]
→ LLM recebe as 4 numa lista só e escolhe conforme a tarefa</div>
<p>Isso cria um ecossistema: em vez de cada aplicação reimplementar conectores, existe hoje um catálogo crescente de servidores MCP mantidos pela comunidade e por empresas, prontos para conectar em qualquer host compatível.</p>` },
      enter: (ctx) => {
        ["s_gh","s_db","s_api"].forEach((id, i) => setTimeout(() => ctx.show(id), i * 150));
      },
    },
    {
      title: "Sampling: servidor pede ao LLM",
      show: ["smp_lbl", "smp_box"],
      highlight: ["smp_box"],
      balloon: { anchor: "smp_box", placement: "top",
        text: "O MCP também suporta o fluxo <strong>inverso</strong>: o servidor pode pedir ao Host que chame o LLM para gerar um texto (<code>sampling/createMessage</code>). Isso permite agents compostos onde o servidor orquestra sub-tarefas.",
        why: "Sampling é uma primitiva poderosa: permite que servidores criem loops de agentic behavior sem expor as credenciais do LLM. O Host mantém o controle e pode aplicar guardrails antes de cada chamada.",
        deep: `<p>Sampling inverte o fluxo normal: em vez do LLM chamar o servidor, é o <strong>servidor</strong> que pede ao Host para rodar uma completion no LLM — útil quando o servidor precisa de "inteligência" no meio da sua própria lógica, sem ter acesso direto à API do modelo (nem suas credenciais).</p>
<div class="xp-example"><strong>Caso de uso de sampling</strong>Um servidor MCP de "resumo de PRs" recebe uma lista de commits, mas precisa de um LLM para gerar o resumo em linguagem natural — ele pede ao Host via sampling/createMessage em vez de chamar a API do modelo diretamente.</div>
<p>Como o pedido passa pelo Host, este mantém o controle: pode aplicar rate limiting, revisar o prompt antes de enviar, ou negar a chamada — o servidor nunca tem acesso direto às chaves de API do LLM.</p>` },
    },
    {
      title: "Segurança e permissões",
      show: ["sec_box"],
      highlight: ["sec_box"],
      balloon: { anchor: "sec_box", placement: "top",
        text: "O Host é o <strong>ponto de controle</strong>: ele decide quais servidores MCP podem se conectar, quais tools o LLM pode chamar e quando solicitar aprovação do usuário. Cada servidor roda em processo separado, limitando a superfície de ataque.",
        why: "MCP segue o princípio de menor privilégio: o servidor declara o que precisa; o Host aprova ou nega. O usuário sempre pode auditar e revogar acessos.",
        deep: `<p>O modelo de segurança do MCP segue o princípio de menor privilégio: cada servidor roda isolado (processo separado, sem acesso automático aos dados de outros servidores) e declara explicitamente o que oferece via capabilities — nada é implícito.</p>
<div class="xp-good"><strong>Boa prática de host</strong>Pedir aprovação explícita do usuário antes da primeira chamada a uma tool "destrutiva" (deletar, escrever, enviar mensagem) e lembrar a decisão só para aquela sessão.</div>
<div class="xp-bad"><strong>Configuração arriscada</strong>Conectar um servidor MCP de terceiros não auditado com acesso de escrita ao filesystem inteiro, sem revisão do que as tools realmente fazem.</div>
<p>Como servidores MCP costumam ser processos externos (às vezes de terceiros), auditar o código do servidor — não só confiar na descrição das tools — é uma prática recomendada antes de conceder acesso amplo.</p>` },
    },
    {
      title: "Quiz rápido",
      balloon: { anchor: { x: 640, y: 360 }, placement: "bottom",
        text: "Verifique seu entendimento do MCP 👇" },
      quiz: {
        question: "Qual primitiva do MCP é controlada pelo LLM para executar ações?",
        options: [
          "Resources — dados acessíveis via URI",
          "Prompts — templates reutilizáveis de prompt",
          "Tools — funções que o LLM decide chamar com argumentos",
          "Sampling — completions solicitados pelo servidor",
        ],
        answer: 2,
        explain: "Tools são model-controlled: o LLM decide quando e com quais argumentos chamá-las. Resources são app-controlled (a aplicação decide o que expor) e Prompts são user-controlled (o usuário seleciona).",
      },
    },
    {
      title: "Resumo do MCP",
      highlight: ["h_llm", "h_client", "p_line", "s_fs", "s_gh", "s_db"],
      balloon: { anchor: { x: 640, y: 360 }, placement: "bottom",
        text: "O MCP padroniza como LLMs se conectam ao mundo: <strong>Host</strong> hospeda o LLM, <strong>Client</strong> gerencia protocolo, <strong>Server</strong> expõe Tools/Resources/Prompts via JSON-RPC. Um ecossistema de servidores reutilizáveis e seguros.",
        why: "MCP é para LLMs o que USB é para hardware: uma interface universal que elimina integrações one-off e constrói um ecossistema compartilhado." },
      enter: (ctx) => {
        ["h_llm","h_client","s_fs","s_gh","s_db","s_api"].forEach((id, k) => setTimeout(() => ctx.pulse(id, true), k * 80));
      },
    },
  ];

  window.MCP_DIAGRAM = {
    title: "Model Context Protocol (MCP)",
    subtitle: "Como LLMs se conectam a ferramentas e dados externos",
    width: W, height: H, autoplayMs: 9000, elements, steps,
  };
})();
