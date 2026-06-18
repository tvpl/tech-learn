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
        why: "Essa separação é o que permite montar um commit com cuidado, ter histórico offline e sincronizar com a equipe quando quiser." },
    },
    {
      title: "Você edita um arquivo",
      show: ["f1"], highlight: ["f1", "c_wd"],
      balloon: { anchor: "f1", placement: "right",
        text: "Você altera <strong>app.js</strong>. A mudança existe só no <strong>Working Directory</strong>; o Git a vê como “modificada”, mas ainda não a está rastreando para o próximo commit.",
        why: "Nada é registrado automaticamente — você decide o que entra em cada commit." },
      enter: (ctx) => ctx.moveTo("f1", 0, 0),
    },
    {
      title: "git add → Staging",
      show: ["cmd_add", "cmd_add_l"], highlight: ["c_st"],
      balloon: { anchor: "cmd_add_l", placement: "top",
        text: "<code>git add app.js</code> move uma <strong>fotografia</strong> do arquivo para o <strong>Staging</strong>: a área que monta o próximo commit.",
        why: "Você pode adicionar só parte das mudanças, revisando o que vai (ou não) no commit. Staging = rascunho do commit." },
      enter: (ctx) => { ctx.drawArrow("cmd_add"); setTimeout(() => ctx.moveTo("f1", ST - WD, 0), 120); },
    },
    {
      title: "git commit → histórico local",
      show: ["cmd_commit", "cmd_commit_l", "c1"], hide: ["f1"], highlight: ["c1"],
      balloon: { anchor: "c1", placement: "right",
        text: "<code>git commit</code> grava o que está no Staging como um <strong>commit</strong> permanente no .git — com hash, autor, data e mensagem. O Staging esvazia.",
        why: "Cada commit é um ponto de retorno imutável. Tudo isso é <strong>local</strong>: nada saiu da sua máquina ainda." },
      enter: (ctx) => ctx.drawArrow("cmd_commit"),
    },
    {
      title: "O histórico cresce",
      show: ["c2", "lnk12", "head"], highlight: ["c2", "head"],
      balloon: { anchor: "c2", placement: "left",
        text: "Mais commits formam uma <strong>corrente</strong>: cada commit aponta para o seu <strong>pai</strong>. O ponteiro <strong>HEAD</strong> diz em qual commit/branch você está (aqui, <strong>main</strong>).",
        why: "Um branch é só um ponteiro móvel para um commit. Criar branches é barato porque nada é copiado — só um novo ponteiro." },
      enter: (ctx) => { ctx.drawArrow("lnk12"); },
    },
    {
      title: "git push → Remoto",
      show: ["cmd_push", "cmd_push_l", "rc1", "rc2", "rlnk12"], highlight: ["c_rm"],
      balloon: { anchor: "cmd_push_l", placement: "top",
        text: "<code>git push</code> envia os commits locais que faltam para o <strong>remoto</strong> (origin), atualizando o branch lá.",
        why: "Só agora seu trabalho fica disponível para o time. Antes do push, tudo vivia apenas no seu .git local." },
      enter: (ctx) => { ctx.drawArrow("cmd_push"); ctx.drawArrow("rlnk12"); },
    },
    {
      title: "git pull → traz e integra",
      show: ["cmd_pull", "cmd_pull_l", "c3", "lnk23"], highlight: ["c3"],
      balloon: { anchor: "c3", placement: "left",
        text: "Quando alguém publica commits novos, <code>git pull</code> faz <strong>fetch</strong> (baixa) + <strong>merge</strong> (integra) no seu histórico local — aqui chega o commit <strong>c3</strong>.",
        why: "Assim os históricos convergem. Se as mudanças tocarem as mesmas linhas, o Git pede uma resolução de <strong>conflito</strong>." },
      enter: (ctx) => { ctx.drawArrow("cmd_pull"); setTimeout(() => ctx.drawArrow("lnk23"), 200); },
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
