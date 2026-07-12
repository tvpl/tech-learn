/* ============================================================================
 * git.data.js — Explicador: Git, do `add` ao `push`
 * Quatro áreas (Working / Staging / Repositório local / Remoto). Mesmo motor.
 * ==========================================================================*/
(function () {
  const W = 1280, H = 700;
  const WD = 180, ST = 470, LO = 770, RM = 1090;     // centros das colunas
  const commit = (id, x, y, label, color) => ([
    { id, type: "box", x: x - 32, y: y - 32, w: 64, h: 64, rx: 32, fill: color || "#22315d", mono: true, label },
  ]);

  const elements = [
    // colunas / áreas
    { id: "c_wd", type: "box", x: WD - 130, y: 110, w: 260, h: 540, fill: "#0e1730" },
    { id: "c_st", type: "box", x: ST - 130, y: 110, w: 260, h: 540, fill: "#0e1730" },
    { id: "c_lo", type: "box", x: LO - 140, y: 110, w: 280, h: 540, fill: "#0e1730" },
    { id: "c_rm", type: "box", x: RM - 140, y: 110, w: 280, h: 540, fill: "#0e1730" },
    { id: "h_wd", type: "label", x: WD, y: 90, anchor: "middle", label: "Working Directory" },
    { id: "h_st", type: "label", x: ST, y: 90, anchor: "middle", label: "Staging (Index)" },
    { id: "h_lo", type: "label", x: LO, y: 90, anchor: "middle", label: "Repositório local (.git)" },
    { id: "h_rm", type: "label", x: RM, y: 90, anchor: "middle", label: "Remoto (origin)" },

    // arquivo que viaja
    { id: "f1", type: "token", x: WD - 70, y: 170, w: 140, h: 46, label: "app.js  ✏️" },

    // setas de comando
    { id: "cmd_add", type: "arrow", x1: WD + 75, y1: 193, x2: ST - 75, y2: 193, color: "var(--warn)" },
    { id: "cmd_add_l", type: "label", x: (WD + ST) / 2, y: 178, sub: true, mono: true, anchor: "middle", label: "git add" },
    { id: "cmd_commit", type: "arrow", x1: ST + 75, y1: 193, x2: LO - 110, y2: 480, color: "var(--good)" },
    { id: "cmd_commit_l", type: "label", x: (ST + LO) / 2, y: 300, sub: true, mono: true, anchor: "middle", label: "git commit" },
    { id: "cmd_push", type: "arrow", x1: LO + 120, y1: 320, x2: RM - 110, y2: 320, color: "var(--accent-2)" },
    { id: "cmd_push_l", type: "label", x: (LO + RM) / 2, y: 305, sub: true, mono: true, anchor: "middle", label: "git push" },
    { id: "cmd_pull", type: "arrow", x1: RM - 110, y1: 250, x2: LO + 120, y2: 250, color: "var(--hot)" },
    { id: "cmd_pull_l", type: "label", x: (LO + RM) / 2, y: 235, sub: true, mono: true, anchor: "middle", label: "git pull" },

    // commits no repo local (mais novo em cima)
    ...commit("c1", LO, 540, "c1"),
    ...commit("c2", LO, 440, "c2"),
    ...commit("c3", LO, 340, "c3", "#2a1d3d"),
    { id: "lnk12", type: "arrow", x1: LO, y1: 472, x2: LO, y2: 508 },
    { id: "lnk23", type: "arrow", x1: LO, y1: 372, x2: LO, y2: 408 },
    { id: "head", type: "token", x: LO + 60, y: 322, w: 130, h: 36, label: "HEAD → main" },

    // commits no remoto
    ...commit("rc1", RM, 540, "c1"),
    ...commit("rc2", RM, 440, "c2"),
    { id: "rlnk12", type: "arrow", x1: RM, y1: 472, x2: RM, y2: 508 },
  ];

  const steps = [
    {
      title: "As quatro áreas do Git",
      show: ["c_wd", "c_st", "c_lo", "c_rm", "h_wd", "h_st", "h_lo", "h_rm"],
      balloon: { anchor: "h_st", placement: "bottom",
        text: "O Git separa seu trabalho em áreas: <strong>Working Directory</strong> (seus arquivos), <strong>Staging</strong> (o que vai no próximo commit), <strong>Repositório local</strong> (.git, o histórico) e o <strong>Remoto</strong> (origin, no servidor).",
        why: "Essa separação é o que permite montar um commit com cuidado, ter histórico offline e sincronizar com a equipe quando quiser.",
        deep: `<p>Cada área corresponde a um estado diferente do arquivo dentro do Git. O comando <code>git status</code> é a forma mais rápida de ver em qual área cada mudança está — untracked (nunca foi adicionado), modified (mudou mas não está staged) ou staged (pronto para o commit).</p>
<div class="xp-example"><strong>git status</strong>On branch main
Changes not staged for commit:
  modified:   app.js

Untracked files:
  novo-arquivo.txt</div>
<h4>Por trás das áreas</h4>
<ul>
<li><strong>Working Directory</strong> — arquivos reais no disco</li>
<li><strong>Staging (Index)</strong> — arquivo binário <code>.git/index</code> com o "rascunho" do próximo commit</li>
<li><strong>Repositório local</strong> — banco de objetos imutável (blobs, trees, commits) dentro de <code>.git/objects</code></li>
</ul>` },
    },
    {
      title: "Você edita um arquivo",
      show: ["f1"], highlight: ["f1", "c_wd"],
      balloon: { anchor: "f1", placement: "right",
        text: "Você altera <strong>app.js</strong>. A mudança existe só no <strong>Working Directory</strong>; o Git a vê como “modificada”, mas ainda não a está rastreando para o próximo commit.",
        why: "Nada é registrado automaticamente — você decide o que entra em cada commit.",
        deep: `<p>Enquanto o arquivo está só "modificado", o Git guarda apenas a versão anterior (a que já foi commitada) para comparação — nada muda no histórico até você decidir agir. <code>git diff</code> mostra exatamente essa comparação, linha a linha.</p>
<div class="xp-example"><strong>git diff app.js</strong>-console.log("old");
+console.log("new");</div>
<p>Se o arquivo nunca foi adicionado antes (é novo), ele aparece como <em>untracked</em> em vez de <em>modified</em> — o Git ainda não tem nenhuma versão dele para comparar.</p>` },
      enter: (ctx) => ctx.moveTo("f1", 0, 0),
    },
    {
      title: "git add → Staging",
      show: ["cmd_add", "cmd_add_l"], highlight: ["c_st"],
      balloon: { anchor: "cmd_add_l", placement: "top",
        text: "<code>git add app.js</code> move uma <strong>fotografia</strong> do arquivo para o <strong>Staging</strong>: a área que monta o próximo commit.",
        why: "Você pode adicionar só parte das mudanças, revisando o que vai (ou não) no commit. Staging = rascunho do commit.",
        deep: `<p><code>git add</code> não move o arquivo — copia o conteúdo atual dele para o índice. É possível dar stage em só parte das mudanças de um arquivo, o que ajuda a montar commits pequenos e focados mesmo tendo editado várias coisas ao mesmo tempo.</p>
<div class="xp-example"><strong>Stage parcial</strong>git add -p app.js
# Git mostra cada trecho (hunk) e pergunta: stage this hunk [y,n,q,a,d,s,e,?]?</div>
<div class="xp-good"><strong>Bom hábito</strong>git add -p antes de commits grandes, para revisar cada trecho</div>
<div class="xp-bad"><strong>Evite</strong>git add . sem revisar — pode incluir arquivos de debug, .env ou mudanças não relacionadas</div>` },
      enter: (ctx) => { ctx.drawArrow("cmd_add"); setTimeout(() => ctx.moveTo("f1", ST - WD, 0), 120); },
    },
    {
      title: "git commit → histórico local",
      show: ["cmd_commit", "cmd_commit_l", "c1"], hide: ["f1"], highlight: ["c1"],
      balloon: { anchor: "c1", placement: "right",
        text: "<code>git commit</code> grava o que está no Staging como um <strong>commit</strong> permanente no .git — com hash, autor, data e mensagem. O Staging esvazia.",
        why: "Cada commit é um ponto de retorno imutável. Tudo isso é <strong>local</strong>: nada saiu da sua máquina ainda.",
        deep: `<p>Um commit é um objeto imutável identificado por um hash SHA-1 (ou SHA-256 em repositórios mais novos), calculado a partir do conteúdo staged, do autor, da data, da mensagem e do(s) commit(s) pai. Mudar qualquer um desses campos gera um hash — e portanto um commit — completamente diferente.</p>
<div class="xp-example"><strong>git commit</strong>git commit -m "Corrige validação de e-mail no cadastro"
[main a1b2c3d] Corrige validação de e-mail no cadastro
 1 file changed, 3 insertions(+), 1 deletion(-)</div>
<p><code>git commit --amend</code> reescreve o último commit (novo hash) — útil para corrigir a mensagem ou esquecer um arquivo, mas evite depois de dar push num branch compartilhado.</p>` },
      enter: (ctx) => ctx.drawArrow("cmd_commit"),
    },
    {
      title: "O histórico cresce",
      show: ["c2", "lnk12", "head"], highlight: ["c2", "head"],
      balloon: { anchor: "c2", placement: "left",
        text: "Mais commits formam uma <strong>corrente</strong>: cada commit aponta para o seu <strong>pai</strong>. O ponteiro <span class=\"xp-term\" tabindex=\"0\" data-tip=\"Aponta para o commit/branch atual — é onde você está no histórico.\">HEAD</span> diz em qual commit/branch você está (aqui, <strong>main</strong>).",
        why: "Um branch é só um ponteiro móvel para um commit. Criar branches é barato porque nada é copiado — só um novo ponteiro.",
        deep: `<p>Um branch como <code>main</code> não é uma cópia do código — é literalmente um arquivo de 41 bytes contendo o hash do commit mais recente. Criar um branch é instantâneo porque o Git só cria um novo ponteiro; nenhum arquivo é duplicado.</p>
<div class="xp-example"><strong>git log --oneline --graph</strong>* a1b2c3d (HEAD -> main) Corrige validação
* 9f8e7d6 Adiciona testes
* 1234abc Commit inicial</div>
<p>Se você fizer <code>git checkout &lt;hash&gt;</code> diretamente (sem branch), entra em <em>detached HEAD</em>: HEAD aponta para um commit específico, não para um branch — novos commits ali ficam "soltos" e podem ser perdidos pelo garbage collector se nenhum branch os referenciar.</p>` },
      enter: (ctx) => { ctx.drawArrow("lnk12"); },
    },
    {
      title: "git push → Remoto",
      show: ["cmd_push", "cmd_push_l", "rc1", "rc2", "rlnk12"], highlight: ["c_rm"],
      balloon: { anchor: "cmd_push_l", placement: "top",
        text: "<code>git push</code> envia os commits locais que faltam para o <strong>remoto</strong> (origin), atualizando o branch lá.",
        why: "Só agora seu trabalho fica disponível para o time. Antes do push, tudo vivia apenas no seu .git local.",
        deep: `<p><code>git push</code> só funciona se o branch remoto for um "descendente" do que você tem local — ou seja, se você já trouxe (pull/fetch) tudo que os outros publicaram. Se não, o Git rejeita o push para evitar sobrescrever trabalho alheio.</p>
<div class="xp-example"><strong>Primeiro push de um branch novo</strong>git push -u origin feature/login
# -u cria o "tracking" entre local e remoto; depois basta "git push"</div>
<div class="xp-bad"><strong>Perigoso</strong>git push --force — sobrescreve o histórico remoto sem checar se alguém publicou algo novo entretanto</div>
<div class="xp-good"><strong>Mais seguro</strong>git push --force-with-lease — só força se o remoto não mudou desde o seu último fetch</div>` },
      enter: (ctx) => { ctx.drawArrow("cmd_push"); ctx.drawArrow("rlnk12"); },
    },
    {
      title: "git pull → traz e integra",
      show: ["cmd_pull", "cmd_pull_l", "c3", "lnk23"], highlight: ["c3"],
      balloon: { anchor: "c3", placement: "left",
        text: "Quando alguém publica commits novos, <code>git pull</code> faz <strong>fetch</strong> (baixa) + <strong>merge</strong> (integra) no seu histórico local — aqui chega o commit <strong>c3</strong>.",
        why: "Assim os históricos convergem. Se as mudanças tocarem as mesmas linhas, o Git pede uma resolução de <strong>conflito</strong>.",
        deep: `<p><code>git pull</code> é, por padrão, <code>git fetch</code> (baixa os commits novos do remoto, sem tocar no seu branch) seguido de <code>git merge</code> (integra esses commits no seu histórico local, criando um commit de merge se as duas pontas divergiram).</p>
<div class="xp-example"><strong>Alternativa: rebase</strong>git pull --rebase
# em vez de merge commit, "reaplica" seus commits locais em cima dos novos commits remotos</div>
<p>Se o mesmo trecho de um arquivo foi alterado nos dois lados, o Git marca um <strong>conflito</strong> com marcadores <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code> / <code>=======</code> / <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code> no arquivo, e espera você escolher manualmente qual versão (ou combinação) fica antes de finalizar o merge.</p>` },
      enter: (ctx) => { ctx.drawArrow("cmd_pull"); setTimeout(() => ctx.drawArrow("lnk23"), 200); },
    },
    {
      title: "Teste rápido",
      balloon: { anchor: "c1", placement: "right",
        text: "Confirme o que cada comando faz 👇" },
      quiz: {
        question: "O que o comando git commit faz?",
        options: [
          "Envia as mudanças para o servidor remoto",
          "Grava o conteúdo do Staging como um ponto permanente no repositório local",
          "Descarta as mudanças do Working Directory",
          "Cria automaticamente um novo branch",
        ],
        answer: 1,
        explain: "commit registra o que está no Staging no histórico local (.git). Enviar ao remoto é tarefa do git push.",
      },
    },
    {
      title: "Resumo do fluxo",
      highlight: ["f1", "c1", "c2", "c3"],
      balloon: { anchor: { x: 640, y: 360 }, placement: "top",
        text: "O caminho de uma mudança: <strong>editar (working) → git add (staging) → git commit (local) → git push (remoto)</strong>, e <strong>git pull</strong> para trazer o que os outros fizeram.",
        why: "Entender as quatro áreas e que “branch é um ponteiro” explica quase tudo no Git: add, commit, merge, rebase, reset…" },
      enter: (ctx) => ["cmd_add", "cmd_commit", "cmd_push"].forEach((a, k) => setTimeout(() => ctx.pulse(a, true), k * 130)),
    },
  ];

  window.GIT_DIAGRAM = {
    title: "Git: do `add` ao `push`",
    subtitle: "As quatro áreas e o caminho de uma mudança",
    width: W, height: H, autoplayMs: 8000, elements, steps,
  };
})();
