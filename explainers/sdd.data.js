/* ============================================================================
 * sdd.data.js — Explicador: Spec-Driven Development (SDD)
 * O ciclo: Spec → IA gera → Testes validam → Feedback → Spec evolui
 * ==========================================================================*/
(function () {
  const W = 1280, H = 720;

  // Ciclo em forma de loop no centro
  const CX = 560, CY = 340;

  // 4 nós do ciclo posicionados em quadrantes
  const nodes = {
    spec:  { x: CX-200, y: CY-140, w: 190, h: 80 },
    gen:   { x: CX+10,  y: CY-140, w: 190, h: 80 },
    test:  { x: CX+10,  y: CY+60,  w: 190, h: 80 },
    feed:  { x: CX-200, y: CY+60,  w: 190, h: 80 },
  };

  const elements = [
    /* ── CICLO (4 nós) ───────────────────────────── */
    { id: "n_spec", type: "box", x: nodes.spec.x, y: nodes.spec.y, w: nodes.spec.w, h: nodes.spec.h,
      fill: "#2a1d3d", stroke: "var(--accent-2)", rx: 14, label: ["📝 Spec", "(comportamento esperado)"] },
    { id: "n_gen",  type: "box", x: nodes.gen.x,  y: nodes.gen.y,  w: nodes.gen.w,  h: nodes.gen.h,
      fill: "#22315d", stroke: "var(--accent)", rx: 14, label: ["🤖 IA Gera", "(código / implementação)"] },
    { id: "n_test", type: "box", x: nodes.test.x, y: nodes.test.y, w: nodes.test.w, h: nodes.test.h,
      fill: "#1b2747", stroke: "var(--good)", rx: 14, label: ["🧪 Testes Validam", "(automatizados)"] },
    { id: "n_feed", type: "box", x: nodes.feed.x, y: nodes.feed.y, w: nodes.feed.w, h: nodes.feed.h,
      fill: "#1a1208", stroke: "var(--warn)", rx: 14, label: ["🔄 Feedback", "(o que falhou e por quê)"] },

    // Setas do ciclo
    { id: "a_sg", type: "arrow", x1: nodes.spec.x+nodes.spec.w, y1: nodes.spec.y+nodes.spec.h/2,
      x2: nodes.gen.x, y2: nodes.gen.y+nodes.gen.h/2, color: "var(--accent)" },
    { id: "a_gt", type: "arrow", x1: nodes.gen.x+nodes.gen.w/2, y1: nodes.gen.y+nodes.gen.h,
      x2: nodes.test.x+nodes.test.w/2, y2: nodes.test.y, color: "var(--good)" },
    { id: "a_tf", type: "arrow", x1: nodes.test.x, y1: nodes.test.y+nodes.test.h/2,
      x2: nodes.feed.x+nodes.feed.w, y2: nodes.feed.y+nodes.feed.h/2, color: "var(--warn)" },
    { id: "a_fs", type: "arrow", x1: nodes.feed.x+nodes.feed.w/2, y1: nodes.feed.y,
      x2: nodes.spec.x+nodes.spec.w/2, y2: nodes.spec.y+nodes.spec.h, color: "var(--accent-2)" },

    // Rótulos das setas
    { id: "lbl_sg", type: "label", x: CX-5, y: CY-155, anchor: "middle", sub: true, label: "IA lê a spec" },
    { id: "lbl_gt", type: "label", x: CX+110, y: CY-15, anchor: "middle", sub: true, label: "roda testes" },
    { id: "lbl_tf", type: "label", x: CX-5, y: CY+155, anchor: "middle", sub: true, label: "erros → feedback" },
    { id: "lbl_fs", type: "label", x: CX-210, y: CY-15, anchor: "middle", sub: true, label: "spec atualizada" },

    // Saída de sucesso
    { id: "success", type: "token", x: CX+220, y: CY-20, w: 180, h: 50,
      fill: "#112318", stroke: "var(--good)", label: "✅ Todos passam\n→ entrega!" },
    { id: "a_success", type: "arrow", x1: nodes.test.x+nodes.test.w, y1: nodes.test.y+nodes.test.h/2,
      x2: CX+220, y2: CY+5, color: "var(--good)" },

    /* ── SPEC DETALHADA (direita) ────────────────── */
    { id: "spec_box",  type: "box", x: 840, y: 40, w: 400, h: 340, fill: "#0e1730", rx: 12 },
    { id: "spec_ttl",  type: "label", x: 1040, y: 62, anchor: "middle", label: "Exemplo de Spec" },
    { id: "spec_l1",   type: "token", x: 856, y: 80,  w: 368, h: 40, fill: "#2a1d3d", stroke: "var(--accent-2)", label: "Feature: Autenticação de usuário" },
    { id: "spec_l2",   type: "token", x: 856, y: 130, w: 368, h: 40, fill: "#1b2747", label: "GIVEN: usuário com email válido" },
    { id: "spec_l3",   type: "token", x: 856, y: 178, w: 368, h: 40, fill: "#1b2747", label: "WHEN: envia senha correta" },
    { id: "spec_l4",   type: "token", x: 856, y: 226, w: 368, h: 40, fill: "#112318", stroke: "var(--good)", label: "THEN: retorna JWT + status 200" },
    { id: "spec_l5",   type: "token", x: 856, y: 274, w: 368, h: 40, fill: "#1a1208", stroke: "var(--hot)", label: "WHEN: senha errada → 401 Unauthorized" },
    { id: "spec_note", type: "label", x: 1040, y: 336, anchor: "middle", sub: true, label: "Spec descreve COMPORTAMENTO, não implementação" },

    /* ── CÓDIGO GERADO ───────────────────────────── */
    { id: "gen_box",  type: "box", x: 840, y: 400, w: 400, h: 180, fill: "#0e1730", rx: 12 },
    { id: "gen_ttl",  type: "label", x: 1040, y: 422, anchor: "middle", label: "Código gerado pela IA" },
    { id: "gen_l1",   type: "token", x: 856, y: 440, w: 368, h: 40, fill: "#22315d", mono: true, label: "def login(email, password):" },
    { id: "gen_l2",   type: "token", x: 856, y: 488, w: 368, h: 40, fill: "#1b2747", mono: true, label: "  user = User.find(email)" },
    { id: "gen_l3",   type: "token", x: 856, y: 536, w: 368, h: 40, fill: "#112318", mono: true, label: "  return jwt.encode(user) if valid" },

    /* ── COMPARATIVO SDD vs TDD vs BDD ──────────── */
    { id: "cmp_box",  type: "box", x: 40, y: 500, w: 440, h: 190, fill: "#0e1730", rx: 12 },
    { id: "cmp_ttl",  type: "label", x: 260, y: 520, anchor: "middle", label: "SDD vs TDD vs BDD" },
    { id: "cmp_tdd",  type: "token", x: 56, y: 536, w: 408, h: 40, fill: "#22315d", stroke: "var(--accent)", label: "TDD: escreva o teste, depois o código" },
    { id: "cmp_bdd",  type: "token", x: 56, y: 584, w: 408, h: 40, fill: "#1b2747", stroke: "var(--accent-2)", label: "BDD: especifique em Gherkin (Given/When/Then)" },
    { id: "cmp_sdd",  type: "token", x: 56, y: 632, w: 408, h: 40, fill: "#11351f", stroke: "var(--good)", label: "SDD: spec → IA gera tudo → humano valida" },

    /* ── RASTREABILIDADE ─────────────────────────── */
    { id: "trace_box", type: "box", x: 40, y: 40, w: 370, h: 200, fill: "#0e1730", rx: 12 },
    { id: "trace_ttl", type: "label", x: 225, y: 60, anchor: "middle", label: "Rastreabilidade Spec ↔ Código ↔ Test" },
    { id: "trace_1",   type: "token", x: 56, y: 76,  w: 338, h: 40, fill: "#2a1d3d", stroke: "var(--accent-2)", label: "spec: autenticação #AUTH-01" },
    { id: "a_t1",     type: "arrow", x1: 225, y1: 118, x2: 225, y2: 130 },
    { id: "trace_2",   type: "token", x: 56, y: 132, w: 338, h: 40, fill: "#22315d", stroke: "var(--accent)", label: "código: auth.py (gerado de #AUTH-01)" },
    { id: "a_t2",     type: "arrow", x1: 225, y1: 174, x2: 225, y2: 186 },
    { id: "trace_3",   type: "token", x: 56, y: 188, w: 338, h: 40, fill: "#112318", stroke: "var(--good)", label: "test: test_auth.py (valida #AUTH-01)" },
  ];

  const steps = [
    {
      title: "O que é Spec-Driven Development",
      show: ["n_spec", "n_gen", "n_test", "n_feed",
             "a_sg", "a_gt", "a_tf", "a_fs",
             "lbl_sg", "lbl_gt", "lbl_tf", "lbl_fs"],
      highlight: ["n_spec"],
      balloon: { anchor: "n_spec", placement: "left",
        text: "<strong>SDD</strong> é uma metodologia onde a <strong>Spec</strong> (especificação de comportamento) é a única fonte de verdade. A IA gera o código a partir da spec, testes automatizados validam, e o feedback refina a spec — iterativamente.",
        why: "SDD inverte o processo tradicional: em vez de escrever código e depois documentar, você descreve o comportamento primeiro e deixa a IA implementar. O humano se concentra no 'o quê', não no 'como'.",
        deep: `<p>O ciclo se parece com programação em par, só que o "par" é um agente de código: você escreve a intenção, ele produz uma implementação candidata, e um verificador objetivo (os testes) decide se ela está certa — sem depender de você reler cada linha gerada.</p>
<div class="xp-example"><strong>Um giro do ciclo</strong>1. Spec: "usuário com senha errada recebe 401"
2. IA gera: função login() sem checar a senha corretamente
3. Teste roda: espera 401, recebeu 200 → falha
4. Feedback: "cenário SENHA_ERRADA falhou: esperado 401, obteve 200"
5. IA corrige a implementação, teste passa</div>
<p>O que torna isso viável em escala é justamente a precisão do passo 4 — sem um teste automatizado, "não funcionou" vira um vaivém manual e lento entre humano e IA.</p>` },
      enter: (ctx) => {
        ["a_sg","a_gt","a_tf","a_fs"].forEach((id, i) => setTimeout(() => ctx.drawArrow(id), i * 200));
      },
    },
    {
      title: "A Spec: comportamento, não implementação",
      show: ["spec_box","spec_ttl","spec_l1","spec_l2","spec_l3","spec_l4","spec_l5","spec_note"],
      highlight: ["n_spec", "spec_l4", "spec_l5"],
      balloon: { anchor: "spec_box", placement: "left",
        text: "A spec descreve <strong>o que o sistema deve fazer</strong>, não como implementar. Usa linguagem Given/When/Then (BDD) para ser legível por humanos e processável pela IA.",
        why: "Uma spec de comportamento é agnóstica à tecnologia: você pode mudar de Python para Go sem reescrever a spec. Ela também serve como documentação viva — sempre sincronizada com o código gerado.",
        deep: `<p>O truque de escrever comportamento em vez de implementação é perguntar "o que um observador externo veria?" em vez de "como o código faz isso por dentro". Isso mantém a spec estável mesmo quando a implementação muda completamente.</p>
<div class="xp-bad"><strong>Spec vazando implementação</strong>"WHEN a função valida a senha usando bcrypt.compare()..." — acopla a spec a uma biblioteca específica.</div>
<div class="xp-good"><strong>Spec de comportamento</strong>"WHEN envia senha correta THEN retorna JWT + status 200" — não importa como a senha é verificada por dentro.</div>
<p>Cada linha GIVEN/WHEN/THEN vira, quase diretamente, um caso de teste: GIVEN monta o estado inicial, WHEN dispara a ação, THEN é a asserção. É por isso que specs bem escritas geram suítes de teste quase automaticamente.</p>` },
      enter: (ctx) => {
        ["spec_l1","spec_l2","spec_l3","spec_l4","spec_l5"].forEach((id, i) => setTimeout(() => ctx.show(id), i * 120));
      },
    },
    {
      title: "IA gera o código a partir da spec",
      show: ["gen_box","gen_ttl","gen_l1","gen_l2","gen_l3"],
      highlight: ["n_gen", "gen_l1"],
      balloon: { anchor: "n_gen", placement: "right",
        text: "A IA (Claude, GPT, etc.) lê a spec e gera o código de implementação. O agente de código sabe: (1) o comportamento esperado, (2) o stack tecnológico, (3) os padrões do projeto — e entrega uma implementação inicial.",
        why: "A IA gera rapidamente, mas pode errar. Por isso os testes automatizados são a verificação objetiva. A IA não decide se está certa — os testes decidem.",
        deep: `<p>Quanto mais contexto a spec fornece além do "o quê" — convenções do projeto, bibliotecas já usadas, padrões de nomenclatura — menos retrabalho o ciclo de feedback vai precisar. A primeira geração raramente é perfeita, e não precisa ser.</p>
<div class="xp-example"><strong>Spec com contexto suficiente</strong>Comportamento: "login retorna JWT em caso de sucesso"
Stack: Python + FastAPI + biblioteca PyJWT já usada no projeto
Padrão: seguir a estrutura de routers/auth.py existente</div>
<p>Sem esse contexto, a IA pode gerar uma implementação funcionalmente correta mas estilisticamente inconsistente — outra lib de JWT, outro padrão de erro. A spec não precisa prescrever a implementação, mas ancorar as decisões técnicas relevantes acelera bastante a convergência.</p>` },
      enter: (ctx) => {
        ["gen_l1","gen_l2","gen_l3"].forEach((id, i) => setTimeout(() => ctx.show(id), i * 120));
      },
    },
    {
      title: "Testes automatizados validam",
      highlight: ["n_test"],
      balloon: { anchor: "n_test", placement: "right",
        text: "Os testes (que a IA também pode gerar a partir da spec) são executados contra o código gerado. Cada teste verifica um cenário da spec: <strong>se passou, o comportamento está correto</strong>. Se falhou, sabe-se exatamente qual cenário quebrou.",
        why: "Testes como fonte de verdade: não é o julgamento humano que diz se o código está certo, são os testes. Isso torna a avaliação objetiva e reproduzível.",
        deep: `<p>Um detalhe importante: os testes devem nascer da spec, não do código gerado. Se a IA escreve a implementação e também escreve os testes olhando para ela, o teste corre o risco de só confirmar o que o código já faz — mesmo que esteja errado.</p>
<div class="xp-bad"><strong>Teste que só confirma o bug</strong>Código sempre retorna 200; teste gerado depois do código também espera 200 mesmo no caso de senha errada.</div>
<div class="xp-good"><strong>Teste derivado da spec</strong>A spec diz "WHEN senha errada THEN 401" — o teste é escrito a partir dessa linha, independente do que o código faz hoje.</div>
<p>Por isso muitas equipes que praticam SDD geram spec → testes primeiro, e só depois pedem a implementação: o teste vira o "juiz" imparcial que a IA (e o humano) não pode reescrever para forçar um verde.</p>` },
    },
    {
      title: "Feedback: o que falhou e por quê",
      highlight: ["n_feed"],
      balloon: { anchor: "n_feed", placement: "left",
        text: "Quando testes falham, o <strong>feedback</strong> é preciso: qual teste, qual asserção, qual valor esperado vs. recebido. Esse feedback é passado de volta à IA (ou ao humano) para refinar a implementação ou a spec.",
        why: "Feedback estruturado é o que torna o ciclo SDD eficiente: a IA recebe 'o teste LOGIN_WRONG_PASSWORD falhou esperando 401 mas recebeu 200' — não 'algo está errado'. Precisão acelera a correção.",
        deep: `<p>Existem dois destinos possíveis para uma falha de teste: às vezes o código está errado e precisa de correção; outras vezes é a <strong>spec</strong> que estava incompleta e o teste revelou um caso de borda que ninguém tinha pensado.</p>
<div class="xp-example"><strong>Feedback estruturado</strong>Teste: LOGIN_SENHA_ERRADA
Esperado: status 401, body {"error": "unauthorized"}
Recebido: status 200, body {"token": "..."}
Hipótese: validação de senha não está sendo chamada antes de gerar o token</div>
<h4>Dois caminhos a partir da falha</h4>
<ul>
<li><strong>Bug de implementação</strong> — a spec estava certa, o código não seguiu; corrige o código</li>
<li><strong>Gap de spec</strong> — o teste revelou um cenário não especificado (ex.: "e se a conta estiver bloqueada?"); a spec cresce</li>
</ul>` },
    },
    {
      title: "Iteração: spec evolui com o aprendizado",
      show: ["success", "a_success"],
      highlight: ["n_spec", "success"],
      balloon: { anchor: "success", placement: "left",
        text: "Cada ciclo refina o sistema: testes que falharam revelam casos de borda não especificados → a spec cresce → a IA reimplementa → mais testes passam. Quando <strong>todos os testes passam</strong>, o ciclo termina com uma entrega.",
        why: "Specs incompletas são normais no início. O ciclo SDD torna as lacunas visíveis rapidamente através dos testes, ao invés de descobrir em produção.",
        deep: `<p>Uma spec quase nunca sai completa da primeira vez — e tentar antecipar todo caso de borda antes de começar costuma ser tempo perdido. O ciclo SDD assume isso: a spec cresce <em>orientada por falhas reais</em>, não por adivinhação.</p>
<div class="xp-example"><strong>Spec crescendo por iteração</strong>v1: "WHEN senha correta THEN 200 + JWT"
Teste de borda revela: e se a conta estiver desativada?
v2: adiciona "WHEN conta desativada THEN 403, mesmo com senha correta"</div>
<p>O ponto de parada natural não é "a spec está perfeita", mas "todos os testes que representam os requisitos conhecidos passam". Novos requisitos, quando aparecem, simplesmente iniciam um novo giro do ciclo.</p>` },
      enter: (ctx) => { ctx.drawArrow("a_success"); },
    },
    {
      title: "Spec como fonte de verdade",
      highlight: ["n_spec", "spec_box"],
      balloon: { anchor: "n_spec", placement: "right",
        text: "A <strong>Spec é a fonte de verdade única</strong>: código e testes são derivados dela. Se o produto muda, você atualiza a spec → a IA re-gera → os testes confirmam. Nenhuma documentação fica desatualizada.",
        why: "Em projetos tradicionais, o código é o que 'manda' e a documentação fica obsoleta. Em SDD, a spec manda — e o código é apenas sua expressão em linguagem de máquina.",
        deep: `<p>Ter uma única fonte de verdade resolve um problema clássico: em muitos times, o README diz uma coisa, o código faz outra e ninguém sabe qual está certo. Em SDD, essa pergunta tem resposta única — sempre a spec.</p>
<div class="xp-bad"><strong>Sem fonte única</strong>Documentação: "reembolso em até 5 dias úteis". Código: implementa 7 dias. Ninguém sabe qual mudou por último.</div>
<div class="xp-good"><strong>Com spec como fonte única</strong>Regra de negócio muda → a spec é editada primeiro → a IA regenera o código e os testes → discrepância nunca existe, porque código é sempre derivado.</div>
<p>Isso não elimina revisão humana — alguém ainda decide o que a spec deve dizer — mas elimina a categoria de bug "documentação desatualizada", porque não existe mais documentação separada do artefato que gera o comportamento.</p>` },
    },
    {
      title: "Rastreabilidade: spec ↔ código ↔ test",
      show: ["trace_box","trace_ttl","trace_1","a_t1","trace_2","a_t2","trace_3"],
      highlight: ["trace_1","trace_2","trace_3"],
      balloon: { anchor: "trace_box", placement: "right",
        text: "Cada item da spec tem um ID (ex.: #AUTH-01) que aparece no código (comentários gerados) e nos testes. Isso permite rastrear: 'qual código implementa esta spec?' e 'quais testes cobrem este requisito?'",
        why: "Rastreabilidade é essencial para compliance, auditorias e debugging. Saber que test_auth.py testa o requisito #AUTH-01 da spec torna a revisão de conformidade trivial.",
        deep: `<p>O ID funciona como uma chave estrangeira entre três artefatos que, de outra forma, ficariam soltos: a intenção (spec), a implementação (código) e a verificação (teste). Sem ele, essa ligação existe só na cabeça de quem escreveu o código.</p>
<div class="xp-example"><strong>Rastro completo de um requisito</strong>spec.md: "#AUTH-01 — senha errada deve retornar 401"
auth.py: "# implementa #AUTH-01" acima da função login()
test_auth.py: "def test_AUTH_01_senha_errada(): ..."</div>
<p>Numa auditoria, a pergunta "onde está implementado o requisito de segurança X?" vira uma busca por texto em vez de uma investigação manual. E ao remover uma spec, o mesmo ID aponta exatamente o código e os testes que podem ser removidos junto — sem deixar órfãos no repositório.</p>` },
      enter: (ctx) => {
        ["trace_1"].forEach(id => ctx.show(id));
        setTimeout(() => { ctx.drawArrow("a_t1"); ctx.show("trace_2"); }, 200);
        setTimeout(() => { ctx.drawArrow("a_t2"); ctx.show("trace_3"); }, 450);
      },
    },
    {
      title: "SDD vs TDD vs BDD",
      show: ["cmp_box","cmp_ttl","cmp_tdd","cmp_bdd","cmp_sdd"],
      highlight: ["cmp_sdd"],
      balloon: { anchor: "cmp_sdd", placement: "right",
        text: "<strong>TDD</strong>: humano escreve teste → humano escreve código. <strong>BDD</strong>: spec em Gherkin → humano implementa. <strong>SDD</strong>: spec em linguagem natural → IA gera código E testes → humano valida e refina.",
        why: "SDD não substitui TDD ou BDD — ele os amplifica com IA. O humano ainda define o comportamento (spec) e valida o resultado, mas a IA faz o trabalho de implementação e teste inicial.",
        deep: `<p>As três metodologias compartilham a mesma ideia central — definir o comportamento antes (ou junto) da implementação — e diferem principalmente em <strong>quem</strong> faz cada etapa e em que formato.</p>
<div class="xp-example"><strong>Mesma regra, três fluxos</strong>TDD: dev escreve test_login_falha() manualmente, depois escreve login() até passar
BDD: analista escreve "GIVEN senha errada WHEN login THEN 401" em Gherkin; dev implementa
SDD: alguém descreve "senha errada deve dar 401" em linguagem natural; a IA gera login() e o teste, o humano revisa o diff</div>
<p>Na prática, boa parte dos times de SDD ainda usa Gherkin (BDD) como o formato da spec — a diferença central é que quem transforma a spec em código funcional deixa de ser exclusivamente humano.</p>` },
      enter: (ctx) => {
        ["cmp_tdd","cmp_bdd","cmp_sdd"].forEach((id, i) => setTimeout(() => ctx.show(id), i * 150));
      },
    },
    {
      title: "Quiz rápido",
      balloon: { anchor: { x: 560, y: 340 }, placement: "right",
        text: "Confirme o que você aprendeu sobre SDD 👇" },
      quiz: {
        question: "Na metodologia SDD, qual é a fonte de verdade do sistema?",
        options: [
          "O código gerado pela IA, pois é a implementação real",
          "Os testes automatizados, pois verificam o comportamento objetivamente",
          "A Spec de comportamento, da qual código e testes são derivados",
          "O feedback de erros, pois revela o que a spec não cobriu",
        ],
        answer: 2,
        explain: "A Spec é a fonte de verdade no SDD. Código e testes são derivados dela e podem ser regenerados. Quando o produto muda, a spec muda primeiro — código e testes seguem. Isso mantém tudo sincronizado.",
      },
    },
    {
      title: "Resumo: Spec-Driven Development",
      highlight: ["n_spec", "n_gen", "n_test", "n_feed"],
      balloon: { anchor: { x: 560, y: 340 }, placement: "right",
        text: "SDD em 4 passos: <strong>Spec → IA gera código → Testes validam → Feedback refina spec</strong>. A spec é a única fonte de verdade. Humano define comportamento; IA implementa; testes verificam.",
        why: "SDD é especialmente poderoso quando combinado com agentes de código (como Claude Code): o humano escreve a spec em linguagem natural e o agente executa o ciclo inteiro autonomamente." },
      enter: (ctx) => {
        ["n_spec","n_gen","n_test","n_feed"].forEach((id, k) => setTimeout(() => ctx.pulse(id, true), k * 100));
      },
    },
  ];

  window.SDD_DIAGRAM = {
    title: "Spec-Driven Development (SDD)",
    subtitle: "Spec → IA gera → Testes validam → Feedback → Spec evolui",
    width: W, height: H, autoplayMs: 9000, elements, steps,
  };
})();
