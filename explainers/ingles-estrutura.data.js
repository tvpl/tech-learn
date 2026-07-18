/* ============================================================================
 * ingles-estrutura.data.js — Explicador: A Espinha Dorsal da Frase (SVO)
 * Ordem fixa Sujeito-Verbo-Objeto, sujeito sempre presente ("ghost subjects"
 * it/there) e a ordem lugar-antes-de-tempo no fim da frase.
 * ==========================================================================*/
(function () {
  const W = 1280, H = 820;

  const chunkBlock = (id, x, y, w, h, role, text, color) => [
    { id: id + "_box", type: "box", x, y, w, h, rx: 8, fill: color, style: "opacity:0.85" },
    { id: id + "_role", type: "label", x: x + w / 2, y: y - 10, anchor: "middle", label: role,
      style: `font-size:10px;font-weight:700;fill:${color};text-transform:uppercase;letter-spacing:1px` },
    { id: id + "_txt", type: "label", x: x + w / 2, y: y + h / 2 + 6, anchor: "middle", label: text, mono: true,
      style: "font-size:15px;font-weight:600;fill:#fff" },
  ];

  const chunkCard = (id, x, y, w, h, phrase, meaning, color) => [
    { id: id + "_box", type: "token", x, y, w, h, rx: 10, fill: color, style: `opacity:0.14;stroke:${color};stroke-width:1.5` },
    { id: id + "_ph", type: "label", x: x + w / 2, y: y + h / 2 - 12, anchor: "middle", label: phrase, mono: true,
      style: `font-size:15px;font-weight:700;fill:${color}` },
    { id: id + "_mn", type: "label", x: x + w / 2, y: y + h / 2 + 16, anchor: "middle", label: meaning,
      style: "font-size:11px;fill:var(--ink-soft)" },
  ];

  const CMP_LEFT_X = 100, CMP_RIGHT_X = 660, CMP_H = 90;
  const compareRow = (id, y, leftColor, leftTitle, leftText, rightColor, rightTitle, rightText, w = 520) => [
    { id: id + "_lbox", type: "box", x: CMP_LEFT_X, y, w, h: CMP_H, rx: 10, fill: leftColor, style: "opacity:0.12" },
    { id: id + "_lt", type: "label", x: CMP_LEFT_X + w / 2, y: y + 24, anchor: "middle", label: leftTitle,
      style: `font-size:11px;font-weight:700;fill:${leftColor};text-transform:uppercase;letter-spacing:1px` },
    { id: id + "_lx", type: "label", x: CMP_LEFT_X + w / 2, y: y + 54, anchor: "middle", label: leftText, mono: true,
      style: "font-size:13px;fill:var(--ink)" },
    { id: id + "_rbox", type: "box", x: CMP_RIGHT_X, y, w, h: CMP_H, rx: 10, fill: rightColor, style: "opacity:0.12" },
    { id: id + "_rt", type: "label", x: CMP_RIGHT_X + w / 2, y: y + 24, anchor: "middle", label: rightTitle,
      style: `font-size:11px;font-weight:700;fill:${rightColor};text-transform:uppercase;letter-spacing:1px` },
    { id: id + "_rx", type: "label", x: CMP_RIGHT_X + w / 2, y: y + 54, anchor: "middle", label: rightText, mono: true,
      style: "font-size:13px;fill:var(--ink)" },
  ];

  const elements = [
    // cena 1 — SVO básico: "I love pizza"
    ...chunkBlock("est_s1_subj", 160, 140, 160, 90, "Subject", "I", "var(--accent)"),
    ...chunkBlock("est_s1_verb", 380, 140, 160, 90, "Verb", "love", "var(--good)"),
    ...chunkBlock("est_s1_obj", 600, 140, 160, 90, "Object", "pizza", "var(--warn)"),
    { id: "est_s1_arrow1", type: "arrow", x1: 320, y1: 185, x2: 380, y2: 185, color: "var(--muted)" },
    { id: "est_s1_arrow2", type: "arrow", x1: 540, y1: 185, x2: 600, y2: 185, color: "var(--muted)" },

    // cena 2 — sujeito "fantasma" (it/there)
    ...chunkCard("est_ghost1", 100, 300, 500, 100, "“It's raining.”", "Chove. (\"it\" não tem significado, só preenche a posição)", "var(--accent)"),
    ...chunkCard("est_ghost2", 660, 300, 500, 100, "“There's a problem.”", "Há um problema. (\"there\" introduz algo que existe)", "var(--accent-2)"),

    // cena 3 — ordem livre em PT vs. fixa em EN
    ...compareRow("est_break", 430, "var(--hot)", "Ordem livre em PT", "“Pizza eu amo” — soa natural com ênfase",
      "var(--accent)", "Ordem fixa em EN", "“Pizza I love” soa estranho — diga “I love pizza”"),

    // cena 4 — lugar antes de tempo
    ...chunkBlock("est_s2_subj", 100, 560, 140, 90, "Subject", "I", "var(--accent)"),
    ...chunkBlock("est_s2_verb", 260, 560, 140, 90, "Verb", "go", "var(--good)"),
    ...chunkBlock("est_s2_place", 420, 560, 260, 90, "Place", "to the gym", "var(--accent-2)"),
    ...chunkBlock("est_s2_time", 700, 560, 260, 90, "Time", "on Mondays", "var(--hot)"),
    { id: "est_s2_a1", type: "arrow", x1: 240, y1: 605, x2: 260, y2: 605, color: "var(--muted)" },
    { id: "est_s2_a2", type: "arrow", x1: 400, y1: 605, x2: 420, y2: 605, color: "var(--muted)" },
    { id: "est_s2_a3", type: "arrow", x1: 680, y1: 605, x2: 700, y2: 605, color: "var(--muted)" },

    // cena 5 — galeria de frases naturais (mesmo padrão, vocabulário diferente)
    ...chunkCard("est_g1", 100, 700, 260, 80, "She plays guitar.", "Ela toca violão.", "var(--accent)"),
    ...chunkCard("est_g2", 380, 700, 260, 80, "We watch movies.", "Nós assistimos filmes.", "var(--good)"),
    ...chunkCard("est_g3", 660, 700, 260, 80, "He drives a taxi.", "Ele dirige um táxi.", "var(--warn)"),
    ...chunkCard("est_g4", 940, 700, 260, 80, "They sell flowers.", "Eles vendem flores.", "var(--accent-2)"),
  ];

  const steps = [
    {
      title: "“I love pizza.” — a ordem SVO",
      show: ["est_s1_subj_box", "est_s1_subj_role", "est_s1_subj_txt", "est_s1_verb_box", "est_s1_verb_role",
        "est_s1_verb_txt", "est_s1_obj_box", "est_s1_obj_role", "est_s1_obj_txt", "est_s1_arrow1", "est_s1_arrow2"],
      balloon: { anchor: "est_s1_verb_box", placement: "bottom",
        text: "“I love pizza.” segue a ordem fixa <strong>Sujeito → Verbo → Objeto</strong> (SVO). “Eu amo pizza” tem a mesma ordem básica em português, mas o português aceita variações que o inglês não aceita.",
        why: "A ordem em inglês é praticamente fixa. Internalizar SVO evita a maioria dos erros de quem monta a frase traduzindo palavra por palavra do português.",
        deep: `<p>O padrão se repete trocando só o vocabulário:</p>
<div class="xp-example"><strong>She (S) + eats (V) + sushi (O)</strong>Ela come sushi.</div>
<div class="xp-example"><strong>We (S) + need (V) + help (O)</strong>Precisamos de ajuda.</div>
<div class="xp-bad"><strong>Evite</strong> "Pizza I love" (traduzir "Pizza eu amo" ao pé da letra)</div>` },
      enter: (ctx) => { ctx.drawArrow("est_s1_arrow1"); ctx.drawArrow("est_s1_arrow2"); },
    },
    {
      title: "O sujeito nunca desaparece",
      show: ["est_ghost1_box", "est_ghost1_ph", "est_ghost1_mn", "est_ghost2_box", "est_ghost2_ph", "est_ghost2_mn"],
      balloon: { anchor: "est_ghost1_box", placement: "top",
        text: "Erro clássico: “*Is raining*” — falta o sujeito. O certo é <strong>“It's raining.”</strong> Em inglês, todo verbo conjugado exige um sujeito, mesmo que ele não signifique nada.",
        why: "Em português o sujeito pode ficar oculto (“Chove”, “Há um problema”). Em inglês isso é agramatical: sempre aparece um sujeito \"fantasma\" (it/there).",
        deep: `<p>Mais exemplos de sujeito fantasma:</p>
<div class="xp-example"><strong>It's 6pm already.</strong>Já são 6 da tarde.</div>
<div class="xp-example"><strong>There are three options.</strong>Existem três opções.</div>
<div class="xp-good"><strong>Sempre</strong> comece a frase com it/there quando não há um sujeito real</div>
<div class="xp-bad"><strong>Evite</strong> "Is a problem" ou "Has three options" sem sujeito</div>` },
    },
    {
      title: "Ordem livre em PT, fixa em EN",
      show: ["est_break_lbox", "est_break_lt", "est_break_lx", "est_break_rbox", "est_break_rt", "est_break_rx"],
      balloon: { anchor: "est_break_rbox", placement: "top",
        text: "Em português a ordem muda por ênfase sem soar estranho. Em inglês, mudar a ordem quase sempre soa esquisito ou poético — melhor manter Sujeito-Verbo-Objeto.",
        why: "Se você traduzir a ordem do português ao pé da letra, a frase em inglês pode soar quebrada mesmo com o vocabulário certo.",
        deep: `<p>Outro exemplo comum:</p>
<div class="xp-good"><strong>Certo</strong> "I really like this song." (Eu realmente gosto dessa música.)</div>
<div class="xp-bad"><strong>Evite</strong> "This song I really like" (ordem de destaque do português)</div>` },
    },
    {
      title: "Lugar antes de tempo",
      show: ["est_s2_subj_box", "est_s2_subj_role", "est_s2_subj_txt", "est_s2_verb_box", "est_s2_verb_role",
        "est_s2_verb_txt", "est_s2_place_box", "est_s2_place_role", "est_s2_place_txt",
        "est_s2_time_box", "est_s2_time_role", "est_s2_time_txt", "est_s2_a1", "est_s2_a2", "est_s2_a3"],
      balloon: { anchor: "est_s2_time_box", placement: "top",
        text: "“I go to the gym on Mondays.” — depois do verbo, a ordem normal é <strong>lugar antes de tempo</strong> (Place before Time).",
        why: "Inverter (“*on Mondays to the gym I go*”) soa quebrado. Internalizar essa ordem ajuda a montar frases mais longas sem travar.",
        deep: `<p>Mais exemplos com o mesmo padrão S-V-Place-Time:</p>
<div class="xp-example"><strong>I work at home in the mornings.</strong>Trabalho em casa pela manhã.</div>
<div class="xp-example"><strong>She lived in Miami for two years.</strong>Ela morou em Miami por dois anos.</div>` },
      enter: (ctx) => ["est_s2_a1", "est_s2_a2", "est_s2_a3"].forEach((a, k) => setTimeout(() => ctx.drawArrow(a), k * 120)),
    },
    {
      title: "Galeria: mesmo padrão, vocabulário novo",
      show: ["est_g1_box", "est_g1_ph", "est_g1_mn", "est_g2_box", "est_g2_ph", "est_g2_mn",
        "est_g3_box", "est_g3_ph", "est_g3_mn", "est_g4_box", "est_g4_ph", "est_g4_mn"],
      balloon: { anchor: { x: 640, y: 680 }, placement: "top",
        text: "Mesma estrutura SVO, sujeitos e verbos diferentes. Pratique reconhecendo o padrão em frases novas — isso fixa a estrutura de verdade, não só um exemplo decorado.",
        why: "Variar o vocabulário sobre a mesma estrutura (interleaving) é o que transforma uma regra em reflexo automático.",
        deep: `<p>Tente montar suas próprias frases com o mesmo padrão, sobre sua própria rotina:</p>
<div class="xp-example"><strong>Seu exemplo</strong>I ___ (verbo) ___ (objeto) — ex.: "I drink coffee every morning."</div>` },
      enter: (ctx) => ctx.reveal(["est_g1_box", "est_g2_box", "est_g3_box", "est_g4_box"], 130),
    },
    {
      title: "Erros comuns",
      dim: ["est_break_lbox", "est_break_rbox", "est_g1_box", "est_g2_box", "est_g3_box", "est_g4_box"],
      highlight: ["est_s1_subj_box", "est_ghost1_box"],
      balloon: { anchor: "est_s1_subj_box", placement: "right",
        text: "Os erros estruturais mais comuns de quem traduz do português: <strong>omitir o sujeito</strong>, <strong>inverter tempo e lugar</strong> e <strong>copiar uma ordem de ênfase do português</strong>.",
        why: "Os três vêm da mesma causa: montar a frase em inglês pensando na ordem do português em vez da ordem fixa SVO + Place + Time." },
    },
    {
      title: "Teste rápido",
      balloon: { anchor: "est_s1_verb_box", placement: "bottom", text: "Qual frase segue a ordem correta? 👇" },
      quiz: {
        question: "Qual frase segue a ordem correta em inglês?",
        options: ["Pizza I love very much.", "I love pizza very much.", "I very much love pizza.", "Love I pizza very much."],
        answer: 1,
        explain: "Ordem fixa Sujeito-Verbo-Objeto: I (S) love (V) pizza (O), com o advérbio \"very much\" no fim da frase.",
      },
    },
  ];

  window.INGLES_ESTRUTURA_DIAGRAM = {
    title: "A Espinha Dorsal da Frase em Inglês (SVO)",
    subtitle: "Sujeito sempre presente, ordem fixa Sujeito-Verbo-Objeto, e tempo/lugar no fim",
    width: W, height: H, autoplayMs: 9000, elements, steps,
  };
})();
