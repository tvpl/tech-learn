/* ============================================================================
 * skills.data.js — Explicador: Skills de Agentes de IA
 * Registry, anatomia, trigger, execução, composição e tipos
 * ==========================================================================*/
(function () {
  const W = 1280, H = 720;

  // Skill card registry à esquerda
  const RX = 40, RY = 60, RW = 380, RH = 560;
  // Execution flow à direita
  const FX = 520;

  const skillCard = (id, y, icon, name, trigger, color) => [
    { id, type: "box", x: RX+10, y, w: RW-20, h: 90, fill: "#1b2747", stroke: color, rx: 10,
      label: [`${icon} ${name}`, `Trigger: "${trigger}"`] },
  ];

  const elements = [
    /* ── REGISTRY ────────────────────────────────── */
    { id: "reg_box", type: "box", x: RX, y: RY, w: RW, h: RH, fill: "#0e1730", rx: 14 },
    { id: "reg_lbl", type: "label", x: RX+RW/2, y: RY+22, anchor: "middle", label: "📚 Skill Registry" },
    { id: "reg_sub", type: "label", x: RX+RW/2, y: RY+40, anchor: "middle", sub: true, label: "capacidades registradas do agente" },

    ...skillCard("sk_code",  RY+60,  "💻", "run-code",      "execute / run / test",   "var(--accent)"),
    ...skillCard("sk_web",   RY+164, "🌐", "web-search",    "search / find / look up", "var(--good)"),
    ...skillCard("sk_file",  RY+268, "📁", "read-write-file","open / save / edit file","var(--warn)"),
    ...skillCard("sk_review",RY+372, "🔍", "code-review",   "review / check / lint",  "var(--accent-2)"),
    ...skillCard("sk_notify",RY+466, "🔔", "notify",        "alert / notify / send",  "var(--hot)"),

    /* ── LLM ─────────────────────────────────────── */
    { id: "llm_box",  type: "box", x: FX, y: 260, w: 200, h: 120, fill: "#2a1d3d", stroke: "var(--accent)", label: ["🧠 LLM", "(agente)"] },

    /* ── EXECUTION FLOW ──────────────────────────── */
    // Step 1: Usuário / trigger
    { id: "usr_box",  type: "token", x: FX, y: 60, w: 200, h: 50, fill: "#1b2747", label: "👤 \"Execute os testes do projeto\"" },
    { id: "a_usr_llm", type: "arrow", x1: FX+100, y1: 112, x2: FX+100, y2: 258, color: "var(--accent)" },

    // Step 2: LLM decide qual skill
    { id: "decide_lbl", type: "label", x: FX+100, y: 200, anchor: "middle", sub: true, label: "match: 'execute / run'" },
    { id: "a_llm_sk",   type: "arrow", x1: FX+100, y1: 382, x2: FX+100, y2: 430, color: "var(--accent)" },

    // Step 3: Invocação da skill
    { id: "inv_box",  type: "box", x: FX, y: 432, w: 200, h: 60, fill: "#22315d", stroke: "var(--accent)", label: ["Invocação:", "run-code(cmd='pytest')"] },
    { id: "a_inv_ex", type: "arrow", x1: FX+100, y1: 494, x2: FX+100, y2: 534, color: "var(--warn)" },

    // Step 4: Execução
    { id: "exec_box", type: "box", x: FX, y: 536, w: 200, h: 60, fill: "#1a1208", stroke: "var(--warn)", label: ["⚙️ Handler executa", "$ pytest ./tests"] },
    { id: "a_ex_res", type: "arrow", x1: FX+100, y1: 598, x2: FX+100, y2: 638, color: "var(--good)" },

    // Step 5: Resultado
    { id: "res_box",  type: "box", x: FX, y: 640, w: 200, h: 60, fill: "#112318", stroke: "var(--good)", label: ["✓ 12 passed, 0 failed", "(retorna ao LLM)"] },

    /* ── ANATOMIA DE UMA SKILL ───────────────────── */
    { id: "anat_box", type: "box", x: 780, y: 60, w: 460, h: 320, fill: "#0e1730", rx: 12 },
    { id: "anat_lbl", type: "label", x: 1010, y: 82, anchor: "middle", label: "Anatomia de uma Skill" },
    { id: "anat_name",   type: "token", x: 800, y: 100, w: 420, h: 44, fill: "#22315d", stroke: "var(--accent)", label: "name: \"run-code\"" },
    { id: "anat_desc",   type: "token", x: 800, y: 154, w: 420, h: 44, fill: "#1b2747", label: "description: \"Executa código e retorna output\"" },
    { id: "anat_trig",   type: "token", x: 800, y: 208, w: 420, h: 44, fill: "#1a1208", stroke: "var(--warn)", label: "trigger: [\"execute\", \"run\", \"test\"]" },
    { id: "anat_input",  type: "token", x: 800, y: 262, w: 420, h: 44, fill: "#1b2747", label: "input: { cmd: string, timeout?: number }" },
    { id: "anat_output", type: "token", x: 800, y: 316, w: 420, h: 44, fill: "#112318", stroke: "var(--good)", label: "output: { stdout, stderr, exit_code }" },

    /* ── COMPOSIÇÃO ──────────────────────────────── */
    { id: "comp_box",  type: "box", x: 780, y: 420, w: 460, h: 260, fill: "#0e1730", rx: 12 },
    { id: "comp_lbl",  type: "label", x: 1010, y: 442, anchor: "middle", label: "Composição: Skills chamam outras Skills" },
    { id: "comp_sk1",  type: "token", x: 800, y: 458, w: 180, h: 44, fill: "#22315d", stroke: "var(--accent)", label: "code-review" },
    { id: "a_comp1",   type: "arrow", x1: 800+90, y1: 504, x2: 800+90, y2: 530 },
    { id: "comp_sk2",  type: "token", x: 800, y: 532, w: 180, h: 44, fill: "#1b2747", label: "→ read-write-file" },
    { id: "a_comp2",   type: "arrow", x1: 800+90, y1: 578, x2: 800+90, y2: 604 },
    { id: "comp_sk3",  type: "token", x: 800, y: 606, w: 180, h: 44, fill: "#1a1208", stroke: "var(--warn)", label: "→ run-code (lint)" },
    { id: "comp_note", type: "label", x: 800+240, y: 480, anchor: "start", sub: true, label: "Skills compostas" },
    { id: "comp_note2",type: "label", x: 800+240, y: 500, anchor: "start", sub: true, label: "orquestram sub-skills" },
    { id: "comp_note3",type: "label", x: 800+240, y: 520, anchor: "start", sub: true, label: "sem o LLM precisar" },
    { id: "comp_note4",type: "label", x: 800+240, y: 540, anchor: "start", sub: true, label: "gerenciar cada passo" },
  ];

  const steps = [
    {
      title: "O que são Skills de agentes",
      show: ["reg_box", "reg_lbl", "reg_sub"],
      highlight: ["reg_box"],
      balloon: { anchor: "reg_box", placement: "right",
        text: "Uma <strong>Skill</strong> é uma capacidade nomeada e descrita que o agente pode invocar. Ela encapsula uma ação (executar código, buscar na web, ler arquivo) com um contrato claro de input/output.",
        why: "Skills são a ponte entre o raciocínio do LLM e a execução de ações no mundo real. Elas são mais ricas que tools MCP porque incluem lógica de trigger e podem ser compostas.",
        deep: `<p>A diferença prática entre uma "skill" e uma tool MCP costuma estar na camada de abstração: uma skill pode encapsular lógica de decisão (quando usar, como validar o resultado) além da execução em si, enquanto uma tool MCP tende a ser uma função mais direta — ainda que os conceitos se sobreponham bastante entre frameworks diferentes.</p>
<div class="xp-example"><strong>Contrato de uma skill</strong>input: { cmd: "pytest ./tests" }
output: { stdout: "...", stderr: "", exit_code: 0 }</div>
<p>O contrato de input/output é o que permite ao LLM usar a skill sem conhecer a implementação — ele só precisa saber o que mandar e o que esperar de volta, como uma interface bem definida em qualquer API.</p>` },
    },
    {
      title: "O Registry de Skills",
      show: ["sk_code", "sk_web", "sk_file", "sk_review", "sk_notify"],
      highlight: ["sk_code", "sk_web"],
      balloon: { anchor: "sk_web", placement: "right",
        text: "O <strong>Skill Registry</strong> é o catálogo de capacidades do agente. Cada skill tem nome, descrição (para o LLM entender quando usar) e triggers (palavras-chave que ativam a escolha).",
        why: "O registry é dinâmico: skills podem ser adicionadas, removidas ou desabilitadas sem mudar o modelo. Isso torna o agente extensível e configurável por domínio.",
        deep: `<p>Manter o registry dinâmico (skills carregadas em runtime, não compiladas no código do agente) é o que permite habilitar/desabilitar capacidades por ambiente sem tocar no "cérebro" do agente — por exemplo, desabilitar a skill de envio de e-mail num ambiente de testes.</p>
<div class="xp-example"><strong>Registry como configuração</strong>agent.skills = ["run-code", "web-search"]  // ambiente de dev
agent.skills = ["run-code", "web-search", "notify", "code-review"]  // ambiente de produção</div>
<p>Isso também é uma camada de segurança: um agente só pode fazer o que está no seu registry — se "delete_database" nunca foi registrada como skill, o LLM não tem como invocá-la, independente do que o prompt do usuário peça.</p>` },
      enter: (ctx) => {
        ["sk_code","sk_web","sk_file","sk_review","sk_notify"].forEach((id, i) => setTimeout(() => ctx.show(id), i * 100));
      },
    },
    {
      title: "Anatomia de uma Skill",
      show: ["anat_box","anat_lbl","anat_name","anat_desc","anat_trig","anat_input","anat_output"],
      highlight: ["anat_trig", "anat_input", "anat_output"],
      balloon: { anchor: "anat_box", placement: "left",
        text: "Cada Skill tem 5 componentes: <strong>name</strong> (identificador único), <strong>description</strong> (texto que o LLM lê), <strong>trigger</strong> (palavras que ativam), <strong>input schema</strong> e <strong>output schema</strong>.",
        why: "A description é o componente mais crítico: o LLM decide qual skill invocar lendo as descriptions e comparando com a tarefa. Uma boa description é concisa, específica e com exemplos de uso.",
        deep: `<p>Vale notar o paralelo direto com <em>function calling</em>/tool use de APIs de LLM: name, description e schemas são exatamente o que a maioria das APIs de modelos exige para declarar uma ferramenta — "skill" é um conceito de mais alto nível construído sobre essa mesma base.</p>
<div class="xp-good"><strong>Description bem escrita</strong>"Executa um comando de teste no diretório do projeto e retorna stdout/stderr/exit_code. Use quando o usuário pedir para rodar, testar ou verificar se o código passa nos testes."</div>
<div class="xp-bad"><strong>Description ruim</strong>"Roda comandos" — não diz quando usar, nem o que esperar de volta, forçando o LLM a adivinhar.</div>
<p>O input schema, tipicamente em JSON Schema, também documenta quais campos são opcionais (<code>timeout?</code>) — isso evita que o LLM precise inventar valores para parâmetros que nem são obrigatórios.</p>` },
      enter: (ctx) => {
        ["anat_name","anat_desc","anat_trig","anat_input","anat_output"].forEach((id, i) => setTimeout(() => ctx.show(id), i * 100));
      },
    },
    {
      title: "Trigger: o LLM decide qual skill usar",
      show: ["llm_box", "usr_box", "a_usr_llm", "decide_lbl"],
      highlight: ["llm_box", "sk_code"],
      balloon: { anchor: "llm_box", placement: "right",
        text: "Quando o usuário pede algo, o LLM analisa a mensagem e <strong>compara com os triggers</strong> de cada skill no registry. Ao detectar 'execute os testes', faz match com run-code (trigger: 'execute', 'run', 'test').",
        why: "O trigger não é só pattern matching — o LLM faz match semântico usando as descriptions. Isso permite que 'rode os unit tests' acione run-code mesmo sem a palavra exata 'execute'.",
        deep: `<p>O termo "trigger" nesse diagrama é didático — na prática, a maioria dos frameworks de agente não faz correspondência literal de palavras-chave. O LLM lê todas as descriptions disponíveis e escolhe pela mesma capacidade de compreensão que usa para qualquer outra tarefa: entender a intenção por trás do pedido.</p>
<div class="xp-example"><strong>Match semântico, não literal</strong>Trigger declarado: "execute / run / test"
Pedido do usuário: "confirma que o build não quebrou?" → o LLM ainda escolhe run-code, mesmo sem nenhuma palavra do trigger aparecer literalmente.</div>
<p>Isso significa que descriptions ambíguas entre skills diferentes são o principal risco: se duas skills têm descriptions parecidas, o LLM pode escolher a errada — testar o agente com pedidos variados (não só os "óbvios") ajuda a pegar essa ambiguidade cedo.</p>` },
      enter: (ctx) => { ctx.drawArrow("a_usr_llm"); },
    },
    {
      title: "Invocação da Skill",
      show: ["a_llm_sk", "inv_box"],
      highlight: ["inv_box", "sk_code"],
      balloon: { anchor: "inv_box", placement: "right",
        text: "O LLM emite uma chamada de skill com o <strong>nome da skill e os argumentos</strong> preenchidos conforme o input schema: <code>run-code(cmd='pytest')</code>. O framework valida os args antes de executar.",
        why: "Validar o input schema antes de executar evita que o LLM passe argumentos inválidos ao handler — o que causaria erros difíceis de diagnosticar no runtime.",
        deep: `<p>Validar contra o schema antes de executar é o que separa um erro "barato" (rejeitado na borda, com mensagem clara) de um erro "caro" (o handler recebe um argumento inesperado, quebra no meio da execução e talvez deixe efeitos colaterais parciais).</p>
<div class="xp-bad"><strong>Sem validação</strong>run-code(cmd=null) chega direto ao handler → exceção não tratada, possivelmente um processo travado.</div>
<div class="xp-good"><strong>Com validação de schema</strong>run-code(cmd=null) é rejeitado antes de chamar o handler: "erro: campo 'cmd' é obrigatório e deve ser string" — o LLM recebe esse erro e pode tentar de novo com o argumento correto.</div>
<p>Esse ciclo de "erro claro → LLM corrige → tenta de novo" é o que torna agentes resilientes a pequenos erros de geração de argumentos, sem precisar de intervenção humana.</p>` },
      enter: (ctx) => { ctx.drawArrow("a_llm_sk"); },
    },
    {
      title: "Execução do Handler",
      show: ["a_inv_ex", "exec_box"],
      highlight: ["exec_box"],
      balloon: { anchor: "exec_box", placement: "right",
        text: "O <strong>handler</strong> é a implementação real da skill: código que roda pytest, faz uma chamada de API, lê um arquivo. O handler é isolado do LLM e pode ser escrito em qualquer linguagem.",
        why: "Separar handler da descrição é fundamental: o LLM não precisa saber como a skill é implementada — só o contrato (input/output). Isso permite trocar a implementação sem mudar o agente.",
        deep: `<p>Isolar o handler do LLM tem um benefício de segurança importante: o handler pode aplicar suas próprias regras de negócio (permissões, rate limiting, sandboxing) <em>independente</em> do que o LLM "decidiu" — o LLM propõe, mas o handler ainda pode recusar.</p>
<div class="xp-example"><strong>Handler com regra própria</strong>run-code recebe cmd="rm -rf /" do LLM
Handler tem uma allowlist de comandos permitidos → rejeita antes de executar, mesmo que o LLM tenha "decidido" chamar isso.</div>
<p>Essa camada de execução isolada (muitas vezes um processo separado ou sandbox) é uma das defesas mais eficazes contra um LLM comprometido por prompt injection tentando executar uma ação perigosa através de uma skill legítima.</p>` },
      enter: (ctx) => { ctx.drawArrow("a_inv_ex"); },
    },
    {
      title: "Resultado retorna ao LLM",
      show: ["a_ex_res", "res_box"],
      highlight: ["res_box"],
      balloon: { anchor: "res_box", placement: "right",
        text: "O handler executa e retorna o resultado conforme o <strong>output schema</strong>: stdout, stderr, exit_code. O framework serializa e injeta como <code>tool_result</code> no próximo turno do LLM.",
        why: "O LLM recebe o resultado e decide o próximo passo: responder ao usuário, invocar outra skill, ou pedir mais informações. O loop continua até a tarefa ser concluída.",
        deep: `<p>O formato do resultado importa tanto quanto o conteúdo: <code>exit_code: 0</code> é um sinal estruturado que o LLM pode usar para decidir automaticamente "os testes passaram, prossiga" sem precisar interpretar texto livre de log — reduz ambiguidade no próximo passo do agente.</p>
<div class="xp-example"><strong>Resultado estruturado</strong>{ "stdout": "12 passed, 0 failed", "stderr": "", "exit_code": 0 }
LLM: "Os testes passaram. Vou prosseguir com o commit."</div>
<p>Esse padrão de "resultado estruturado → decisão do LLM → possível nova invocação" é o mesmo loop de ReAct/tool-use: o agente não tenta prever tudo de antemão, ele reage ao resultado real de cada ação antes de decidir a próxima.</p>` },
      enter: (ctx) => { ctx.drawArrow("a_ex_res"); },
    },
    {
      title: "Composição: Skills chamam outras Skills",
      show: ["comp_box","comp_lbl","comp_sk1","a_comp1","comp_sk2","a_comp2","comp_sk3",
             "comp_note","comp_note2","comp_note3","comp_note4"],
      highlight: ["comp_sk1", "comp_sk2", "comp_sk3"],
      balloon: { anchor: "comp_box", placement: "left",
        text: "<strong>Skills compostas</strong> orquestram sub-skills internamente. Ex.: code-review primeiro lê o arquivo (read-write-file) e depois faz lint (run-code). O LLM invoca só a skill de alto nível.",
        why: "Composição cria uma hierarquia de abstração: o LLM raciocina em alto nível (review my PR) e a skill cuida dos detalhes (ler arquivos, rodar lint, formatar resultado). Reduz a carga cognitiva do LLM.",
        deep: `<p>Composição reduz a carga cognitiva do LLM orquestrador: em vez de ter que decidir "primeiro leio o arquivo, depois rodo o lint, depois formato o resultado" a cada chamada, ele invoca uma única skill de alto nível (code-review) que já sabe orquestrar essa sequência internamente.</p>
<div class="xp-example"><strong>Skill composta em pseudo-código</strong>function code-review(path) {
  const content = read-write-file.read(path)
  const lint = run-code.lint(content)
  return format_review(content, lint)
}</div>
<p>O trade-off é flexibilidade: uma skill composta é mais fácil de usar mas menos ajustável — se o LLM precisar de um passo intermediário diferente, pode precisar cair para as sub-skills individuais em vez da composta.</p>` },
      enter: (ctx) => {
        ["comp_sk1"].forEach(id => ctx.show(id));
        setTimeout(() => { ctx.drawArrow("a_comp1"); ctx.show("comp_sk2"); }, 200);
        setTimeout(() => { ctx.drawArrow("a_comp2"); ctx.show("comp_sk3"); }, 450);
      },
    },
    {
      title: "Skills built-in vs customizadas",
      highlight: ["sk_code", "sk_web", "sk_notify"],
      balloon: { anchor: "sk_notify", placement: "right",
        text: "<strong>Built-in</strong>: skills que vêm com o framework (web-search, run-code, read-file). <strong>Customizadas</strong>: skills específicas do seu domínio (consultar-CRM, gerar-relatorio, aprovar-pedido). O registry é extensível.",
        why: "Skills customizadas são onde o valor de negócio mora. Elas encapsulam processos internos da empresa e permitem que o agente execute tarefas específicas do domínio sem o LLM precisar conhecer detalhes de implementação.",
        deep: `<p>A fronteira entre built-in e customizada normalmente reflete o quão genérica é a capacidade: ler um arquivo é útil para qualquer agente (built-in); consultar o CRM interno da empresa só faz sentido para aquele agente específico (customizada).</p>
<div class="xp-example"><strong>Skill customizada de domínio</strong>{ name: "consultar-crm", description: "Busca dados de um cliente pelo CPF ou email no CRM interno. Retorna nome, plano contratado e histórico de tickets." }</div>
<p>Skills customizadas costumam ser onde vazamentos de segurança acontecem, porque conectam o agente a sistemas internos sensíveis — vale aplicar o mesmo cuidado de guardrails e permissões que se aplicaria a qualquer integração com dados de produção.</p>` },
    },
    {
      title: "Quiz rápido",
      balloon: { anchor: { x: 640, y: 360 }, placement: "bottom",
        text: "Confirme o que você aprendeu sobre Skills 👇" },
      quiz: {
        question: "Por que a description de uma Skill é o componente mais crítico para o LLM?",
        options: [
          "Porque o LLM usa a description para gerar o código do handler",
          "Porque o LLM lê as descriptions para decidir semanticamente qual skill invocar — uma description ruim causa escolhas erradas",
          "Porque o framework valida o input schema usando a description como documentação",
          "Porque descriptions são exibidas ao usuário final para explicar o que o agente fez",
        ],
        answer: 1,
        explain: "O LLM não vê o código do handler — só as descriptions. Ele compara a tarefa do usuário com as descriptions de todas as skills disponíveis e escolhe a mais adequada. Uma description vaga ou imprecisa resulta em escolhas incorretas ou na skill errada sendo acionada.",
      },
    },
    {
      title: "Resumo: Skills de Agentes",
      highlight: ["sk_code","sk_web","sk_file","anat_box","comp_box"],
      balloon: { anchor: { x: 640, y: 360 }, placement: "right",
        text: "<strong>Skills</strong> = capacidades nomeadas com description, trigger, input/output schema e handler. O LLM lê descriptions para decidir qual invocar. Skills compostas orquestram sub-skills. Registry é extensível por domínio.",
        why: "Skills são o que transforma um LLM genérico num agente especializado: elas definem o que o agente CAN DO, e as descriptions definem como o agente SABE que pode fazer." },
      enter: (ctx) => {
        ["sk_code","sk_web","sk_file","sk_review","sk_notify"].forEach((id, k) => setTimeout(() => ctx.pulse(id, true), k * 80));
      },
    },
  ];

  window.SKILLS_DIAGRAM = {
    title: "Skills — Capacidades de Agentes de IA",
    subtitle: "Registry, anatomia, trigger, execução e composição",
    width: W, height: H, autoplayMs: 9000, elements, steps,
  };
})();
