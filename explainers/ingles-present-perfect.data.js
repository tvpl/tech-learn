/* ============================================================================
 * ingles-present-perfect.data.js — Explicador: Present Perfect
 * A ponte sem tradução direta: experiência de vida, resultado presente e
 * ação que começou no passado e continua. Maior lacuna de quem fala PT-BR.
 * ==========================================================================*/
(function () {
  const W = 1280, H = 1060;

  const chunkBlock = (id, x, y, w, h, role, text, color) => [
    { id: id + "_box", type: "box", x, y, w, h, rx: 8, fill: color, style: "opacity:0.85" },
    { id: id + "_role", type: "label", x: x + w / 2, y: y - 10, anchor: "middle", label: role,
      style: `font-size:10px;font-weight:700;fill:${color};text-transform:uppercase;letter-spacing:1px` },
    { id: id + "_txt", type: "label", x: x + w / 2, y: y + h / 2 + 6, anchor: "middle", label: text, mono: true,
      style: "font-size:15px;font-weight:600;fill:#fff" },
  ];

  const chunkCard = (id, x, y, w, h, phrase, meaning, color) => [
    { id: id + "_box", type: "token", x, y, w, h, rx: 10, fill: color, style: `opacity:0.14;stroke:${color};stroke-width:1.5` },
    { id: id + "_ph", type: "label", x: x + w / 2, y: y + h / 2 - 14, anchor: "middle", label: phrase, mono: true,
      style: `font-size:15px;font-weight:700;fill:${color}` },
    { id: id + "_mn", type: "label", x: x + w / 2, y: y + h / 2 + 18, anchor: "middle", label: meaning,
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
    // cena 1 — gancho: Simple Past vs Present Perfect
    ...compareRow("pp_hook", 130, "var(--muted)", "Simple Past (já visto)", "“I went to Paris.”",
      "var(--accent)", "Present Perfect (novo)", "“I've been to Paris.”"),

    // cena 2 — formação: have/has + particípio
    ...chunkCard("pp_form1", 100, 260, 520, 100, "I have finished.", "have + particípio (verbo regular)", "var(--accent)"),
    ...chunkCard("pp_form2", 660, 260, 520, 100, "She has left.", "has (3ª pessoa) + particípio", "var(--good)"),

    // cena 3 — experiência de vida
    ...chunkCard("pp_exp1", 100, 390, 520, 100, "Have you ever been to Japan?", "Você já foi ao Japão alguma vez?", "var(--accent-2)"),
    ...chunkCard("pp_exp2", 660, 390, 520, 100, "I've never tried sushi.", "Nunca experimentei sushi.", "var(--warn)"),

    // cena 4 — for vs. since
    ...compareRow("pp_forsince", 520, "var(--accent)", "For (duração)", "“I've lived here for 5 years.”",
      "var(--good)", "Since (ponto de partida)", "“I've worked here since 2019.”"),

    // cena 5 — resultado presente de ação passada
    ...chunkCard("pp_result", 100, 650, 1080, 100, "I've lost my keys.",
      "= não tenho as chaves AGORA — o foco é no resultado, não só no evento passado", "var(--hot)"),

    // cena 6 — o contraste crucial: marcador de tempo específico quebra o Present Perfect
    ...compareRow("pp_crucial", 780, "var(--hot)", "Errado", "“I have seen him yesterday.”",
      "var(--good)", "Certo", "“I saw him yesterday.”"),

    // cena 7 — contração falada + Present Perfect Continuous
    ...chunkCard("pp_cont1", 100, 910, 520, 100, "I've been working out.", "Tenho treinado (ênfase na continuidade recente)", "var(--accent)"),
    ...chunkCard("pp_cont2", 660, 910, 520, 100, "I've been meaning to call you.", "Tenho pensado em te ligar (chunk fixo)", "var(--accent-2)"),
  ];

  // ---- MATERIAIS ANEXOS ----
  const participlesTable = `
<p>Particípios irregulares mais usados (base → passado → <strong>particípio</strong>). No Present Perfect usa-se sempre o <strong>particípio</strong>.</p>
<table class="xp-tbl">
<thead><tr><th>Base</th><th>Passado</th><th>Particípio</th><th>Tradução</th></tr></thead>
<tbody>
<tr><td>be</td><td>was/were</td><td><strong>been</strong></td><td>ser/estar</td></tr>
<tr><td>have</td><td>had</td><td><strong>had</strong></td><td>ter</td></tr>
<tr><td>do</td><td>did</td><td><strong>done</strong></td><td>fazer</td></tr>
<tr><td>go</td><td>went</td><td><strong>gone / been</strong></td><td>ir</td></tr>
<tr><td>see</td><td>saw</td><td><strong>seen</strong></td><td>ver</td></tr>
<tr><td>make</td><td>made</td><td><strong>made</strong></td><td>fazer/criar</td></tr>
<tr><td>take</td><td>took</td><td><strong>taken</strong></td><td>pegar/levar</td></tr>
<tr><td>eat</td><td>ate</td><td><strong>eaten</strong></td><td>comer</td></tr>
<tr><td>write</td><td>wrote</td><td><strong>written</strong></td><td>escrever</td></tr>
<tr><td>speak</td><td>spoke</td><td><strong>spoken</strong></td><td>falar</td></tr>
<tr><td>break</td><td>broke</td><td><strong>broken</strong></td><td>quebrar</td></tr>
<tr><td>give</td><td>gave</td><td><strong>given</strong></td><td>dar</td></tr>
<tr><td>get</td><td>got</td><td><strong>gotten / got</strong></td><td>conseguir/ficar</td></tr>
<tr><td>know</td><td>knew</td><td><strong>known</strong></td><td>saber/conhecer</td></tr>
<tr><td>lose</td><td>lost</td><td><strong>lost</strong></td><td>perder</td></tr>
<tr><td>meet</td><td>met</td><td><strong>met</strong></td><td>encontrar</td></tr>
<tr><td>read</td><td>read</td><td><strong>read</strong></td><td>ler</td></tr>
<tr><td>come</td><td>came</td><td><strong>come</strong></td><td>vir</td></tr>
</tbody></table>
<p class="xp-tip">💡 A diferença que trava PT-BR: gone (foi e não voltou) × been (foi e voltou). “He's gone to work” (ainda lá) × “He's been to work” (já voltou).</p>`;

  const markersMaterial = `
<p>Marcadores de tempo — e qual tempo verbal cada um pede.</p>
<h4>✅ Combinam com Present Perfect</h4>
<div class="xp-good">ever, never, already, yet, just, so far, recently, for + duração, since + ponto, this week/month/year (ainda em curso)</div>
<div class="xp-example"><strong>I've just finished.</strong>Acabei de terminar.</div>
<div class="xp-example"><strong>Have you eaten yet?</strong>Você já comeu?</div>
<h4>❌ Forçam Simple Past (tempo terminado)</h4>
<div class="xp-bad">yesterday, last week/year, ago, in 2020, when I was young, this morning (já passou)</div>
<div class="xp-example"><strong>I saw him yesterday.</strong>Vi ele ontem. (nunca “have seen … yesterday”)</div>`;

  const decideMaterial = `
<h4>Fluxograma: Present Perfect ou Simple Past?</h4>
<ol>
<li>Tem <strong>marcador de tempo terminado</strong> (yesterday, ago, in 2020)? → <strong>Simple Past</strong>.</li>
<li>É <strong>experiência de vida</strong> sem “quando” (ever/never)? → <strong>Present Perfect</strong>.</li>
<li>Começou no passado e <strong>continua agora</strong> (for/since)? → <strong>Present Perfect</strong>.</li>
<li>Ação passada com <strong>resultado que importa agora</strong> (“I've lost my keys”)? → <strong>Present Perfect</strong>.</li>
</ol>
<div class="xp-good"><strong>Regra rápida:</strong> tem “quando exatamente”? Simple Past. Não tem? Present Perfect é candidato.</div>`;

  const materials = [
    { id: "part", icon: "📋", label: "Tabela de particípios irregulares", html: participlesTable },
    { id: "mark", icon: "⏱️", label: "Marcadores de tempo (qual tempo usar)", html: markersMaterial },
    { id: "dec", icon: "🧭", label: "Fluxograma: Perfect ou Past?", html: decideMaterial },
  ];

  const steps = [
    {
      title: "A ponte sem tradução direta",
      show: ["pp_hook_lbox", "pp_hook_lt", "pp_hook_lx", "pp_hook_rbox", "pp_hook_rt", "pp_hook_rx"],
      balloon: { anchor: "pp_hook_rbox", placement: "top",
        text: "“I went to Paris.” e “I've been to Paris.” não são a mesma coisa em inglês — mas em português, “Já fui a Paris” mistura os dois conceitos numa frase só.",
        why: "O Present Perfect não tem equivalente direto em português. Nesta lição você separa duas ideias que seu cérebro está acostumado a tratar como uma só." },
    },
    {
      title: "Formação: have/has + particípio",
      show: ["pp_form1_box", "pp_form1_ph", "pp_form1_mn", "pp_form2_box", "pp_form2_ph", "pp_form2_mn"],
      highlight: ["pp_form1_box"],
      balloon: { anchor: "pp_form1_box", placement: "bottom",
        text: "Present Perfect = <strong>have/has + particípio</strong> (3ª forma do verbo). Verbos regulares usam a mesma forma do passado (+ed); irregulares têm forma própria.",
        why: "É a estrutura que carrega todos os usos que você vai ver nesta lição — decore a formação antes de entrar nas nuances de uso.",
        deep: `<p>Particípios irregulares de altíssima frequência:</p>
<div class="xp-example"><strong>go → gone / be → been / do → done</strong>"I haven't gone yet." / "I've been there." / "I've done it already."</div>
<div class="xp-example"><strong>see → seen / make → made</strong>"Have you seen this?" / "She's made a decision."</div>` },
      exercises: [
        { kind: "fill", prompt: "Complete com o particípio:", sentence: "I have ___ my homework. (do)",
          answer: "done", explain: "particípio de “do” é “done”: I have done my homework." },
        { kind: "fill", prompt: "E agora (3ª pessoa):", sentence: "She ___ left already. (have)",
          answer: "has", explain: "3ª pessoa usa “has”: She has left already." },
      ],
    },
    {
      title: "Uso 1: experiência de vida",
      show: ["pp_exp1_box", "pp_exp1_ph", "pp_exp1_mn", "pp_exp2_box", "pp_exp2_ph", "pp_exp2_mn"],
      balloon: { anchor: "pp_exp1_box", placement: "bottom",
        text: `“Have you ever been to Japan?” pergunta sobre <strong>experiência de vida</strong>, sem momento específico. "<span class="xp-term" tabindex="0" data-tip="Advérbios usados com Present Perfect pra falar de experiência, sem apontar quando exatamente aconteceu.">Ever</span>"/"never" são os parceiros clássicos desse uso.`,
        why: "Você está perguntando \"isso já aconteceu na sua vida, alguma vez?\" — não \"quando isso aconteceu\", que seria Simple Past.",
        deep: `<p>"Ever" e "never" ficam entre o auxiliar e o particípio:</p>
<div class="xp-example"><strong>"Has she ever tried Brazilian food?"</strong>Ela já experimentou comida brasileira alguma vez?</div>` },
      exercises: [
        { kind: "order", prompt: "Monte a pergunta:", answer: ["have", "you", "ever", "been", "to", "Japan"],
          explain: "Ever fica entre o sujeito e o particípio: Have you ever been to Japan?" },
      ],
    },
    {
      title: "Uso 2: começou no passado, continua agora",
      show: ["pp_forsince_lbox", "pp_forsince_lt", "pp_forsince_lx", "pp_forsince_rbox", "pp_forsince_rt", "pp_forsince_rx"],
      balloon: { anchor: "pp_forsince_rbox", placement: "top",
        text: "<strong>For</strong> marca <strong>duração</strong> (\"for 5 years\"); <strong>since</strong> marca o <strong>ponto de partida</strong> no tempo (\"since 2019\"). Ambos descrevem algo que começou no passado e continua até agora.",
        why: "Essa é a diferença que mais confunde: nenhum dos dois é sobre um evento pontual — é sobre algo que ainda está acontecendo.",
        deep: `<p>Mais exemplos do mesmo padrão:</p>
<div class="xp-example"><strong>"I've known her for ten years."</strong>Conheço ela há dez anos (e ainda conheço).</div>
<div class="xp-example"><strong>"We've been together since college."</strong>Estamos juntos desde a faculdade.</div>` },
      exercises: [
        { kind: "fill", prompt: "for ou since?", sentence: "I've lived here ___ 2015.", answer: "since",
          options: ["for", "since"], explain: "2015 é um ponto de partida → since. Duração usaria for (for 9 years)." },
        { kind: "fill", prompt: "for ou since?", sentence: "She's worked here ___ five years.", answer: "for",
          options: ["for", "since"], explain: "“five years” é duração → for. Ponto no tempo usaria since." },
      ],
    },
    {
      title: "Uso 3: resultado presente de ação passada",
      show: ["pp_result_box", "pp_result_ph", "pp_result_mn"],
      highlight: ["pp_result_box"],
      balloon: { anchor: "pp_result_box", placement: "bottom",
        text: "“I've lost my keys.” não é só \"perdi as chaves\" — é <strong>\"não tenho as chaves agora\"</strong>. O Present Perfect aqui destaca o <strong>resultado presente</strong>, não o momento em que perdeu.",
        why: "É o uso mais sutil: a ação já terminou, mas a consequência dela ainda importa agora — por isso não usa Simple Past.",
        deep: `<p>Compare com o Simple Past, que só relata o evento:</p>
<div class="xp-example"><strong>"I lost my keys yesterday."</strong>Só conta o que aconteceu ontem — pode já ter encontrado as chaves depois.</div>
<div class="xp-example"><strong>"I've lost my keys."</strong>Ainda estou sem as chaves agora — é por isso que estou falando disso.</div>` },
    },
    {
      title: "O contraste crucial: tempo específico quebra o Present Perfect",
      show: ["pp_crucial_lbox", "pp_crucial_lt", "pp_crucial_lx", "pp_crucial_rbox", "pp_crucial_rt", "pp_crucial_rx"],
      balloon: { anchor: "pp_crucial_rbox", placement: "top",
        text: "Present Perfect <strong>não aceita</strong> marcador de tempo específico (yesterday, last year, in 2020...). Se tem hora marcada, é <strong>Simple Past</strong>: “I saw him yesterday.”, não “*I have seen him yesterday*”.",
        why: "É a regra mais prática pra decidir qual tempo usar: tem \"quando exatamente\" na frase? Simple Past. Não tem? Present Perfect é uma opção.",
        deep: `<p>Mais pares errado/certo:</p>
<div class="xp-bad"><strong>Errado</strong> "I have finished it last night."</div>
<div class="xp-good"><strong>Certo</strong> "I finished it last night." (tempo específico → Simple Past)</div>` },
      exercises: [
        { kind: "choice", question: "Qual está correto?",
          options: ["I have seen him yesterday.", "I saw him yesterday.", "I have saw him yesterday."], answer: 1,
          explain: "“yesterday” é tempo terminado → Simple Past: I saw him yesterday." },
      ],
    },
    {
      title: "Contração falada e Present Perfect Continuous",
      show: ["pp_cont1_box", "pp_cont1_ph", "pp_cont1_mn", "pp_cont2_box", "pp_cont2_ph", "pp_cont2_mn"],
      balloon: { anchor: "pp_cont2_box", placement: "top",
        text: "Na fala, “have” quase sempre contrai: <strong>I've, She's, We've</strong>. E “have/has been + verbo-ing” (Present Perfect Continuous) enfatiza a <strong>duração/repetição recente</strong> de uma atividade.",
        why: "“I've been meaning to call you” é um chunk fixo super comum — decore como bloco pronto, não tente montar palavra por palavra.",
        deep: `<p>Cuidado: “She's” pode ser “she is” OU “she has” — o contexto (o que vem depois) desambigua:</p>
<div class="xp-example"><strong>"She's tired." (is)</strong>vs. <strong>"She's finished." (has)</strong></div>` },
    },
    {
      title: "Treino: particípios irregulares (flashcards)",
      dim: ["pp_form1_box", "pp_form2_box"],
      balloon: { anchor: "pp_form1_box", placement: "bottom",
        text: "O que mais trava o Present Perfect é o particípio irregular. Vire os cartões e teste antes de olhar — abra 📎 <strong>Materiais</strong> para a tabela completa." },
      exercises: [
        { kind: "flashcards", prompt: "Base → particípio:", cards: [
          { front: "go", back: "<strong>gone / been</strong><br>“I've gone / I've been there.”" },
          { front: "see", back: "<strong>seen</strong><br>“Have you seen it?”" },
          { front: "eat", back: "<strong>eaten</strong><br>“I've eaten already.”" },
          { front: "write", back: "<strong>written</strong><br>“She's written a book.”" },
          { front: "break", back: "<strong>broken</strong><br>“I've broken my phone.”" },
          { front: "take", back: "<strong>taken</strong><br>“He's taken the day off.”" },
        ] },
      ],
    },
    {
      title: "Treino: identifique o uso",
      dim: ["pp_form1_box", "pp_form2_box"],
      highlight: ["pp_result_box", "pp_exp1_box"],
      balloon: { anchor: "pp_result_box", placement: "bottom",
        text: "Reconhecer qual dos três usos está em jogo é o que te faz escolher Present Perfect na hora de falar. Ligue os pares 👇" },
      exercises: [
        { kind: "match", prompt: "Ligue a frase ao uso:", pairs: [
          ["Have you ever flown?", "experiência de vida"],
          ["I've lost my wallet.", "resultado presente"],
          ["I've lived here since 2020.", "começou e continua"],
        ], explain: "Ever → experiência; resultado que importa agora → resultado presente; since/for → continua." },
      ],
    },
    {
      title: "Teste final: bateria completa",
      balloon: { anchor: "pp_crucial_rbox", placement: "top",
        text: "Prova de fogo em vários formatos. Você conheceu seu chefe há 3 anos e ainda trabalha com ele — comece por aqui 👇" },
      quiz: {
        question: "Você conheceu seu chefe atual há 3 anos e ainda trabalha com ele hoje. Qual frase é natural?",
        options: ["I knew him 3 years ago.", "I've known him for 3 years.", "I know him since 3 years.", "I have known him 3 years ago."],
        answer: 1,
        explain: "Começou no passado e continua — Present Perfect com \"for\" (duração): \"I've known him for 3 years.\"",
      },
      exercises: [
        { kind: "fill", prompt: "1) Complete:", sentence: "Have you ___ your keys? I can't find mine. (lose)",
          answer: "lost", explain: "particípio de lose = lost: “Have you lost your keys?”" },
        { kind: "order", prompt: "2) Ordene:", answer: ["I", "have", "never", "been", "there"],
          explain: "never entre auxiliar e particípio: I have never been there." },
        { kind: "choice", question: "3) “She ___ to Italy last summer.”",
          options: ["has gone", "went", "has been"], answer: 1,
          explain: "“last summer” é tempo terminado → Simple Past: She went to Italy last summer." },
      ],
    },
  ];

  window.INGLES_PRESENT_PERFECT_DIAGRAM = {
    title: "Present Perfect: Have/Has + Particípio",
    subtitle: "A ponte sem tradução direta: experiência de vida, resultado presente e ação que continua",
    width: W, height: H, autoplayMs: 9000, materials, elements, steps,
  };
})();
