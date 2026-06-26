/* ============================================================================
 * recursao.data.js — Explicador: Recursão e a pilha de chamadas
 * fact(4) empilha frames (push) e os desempilha (return) na ordem inversa.
 * Mesmo motor: aqui só há dados (elements + steps). Não edite o engine.
 * ==========================================================================*/
(function () {
  const W = 1280, H = 700;

  // geometria da pilha: frames empilham p/ cima (o mais recente no topo)
  const fx = 345, fw = 260, fh = 66, fstep = 90;
  const fy = (k) => 525 - (4 - k) * fstep;        // k = 1..4 → topo..base
  const rx = 650, rw = 320, rh = 52;              // chips de retorno (à direita)

  const elements = [
    // definição (sempre visível a partir da cena 1)
    { id: "def", type: "box", x: 440, y: 64, w: 400, h: 76, rx: 12, stroke: "var(--accent)",
      mono: true, label: ["fact(n) = n · fact(n−1)", "fact(1) = 1   (caso base)"] },

    { id: "hdr", type: "label", x: fx + fw / 2, y: 232, anchor: "middle", sub: true,
      label: "Pilha de chamadas (cresce ↑)" },

    // frames da pilha
    { id: "f4", type: "box", x: fx, y: fy(4), w: fw, h: fh, rx: 10, mono: true, label: ["fact(4)", "4 · fact(3)"] },
    { id: "f3", type: "box", x: fx, y: fy(3), w: fw, h: fh, rx: 10, mono: true, label: ["fact(3)", "3 · fact(2)"] },
    { id: "f2", type: "box", x: fx, y: fy(2), w: fw, h: fh, rx: 10, mono: true, label: ["fact(2)", "2 · fact(1)"] },
    { id: "f1", type: "box", x: fx, y: fy(1), w: fw, h: fh, rx: 10, mono: true, label: ["fact(1)", "caso base"] },

    // chips de retorno (verdes), na mesma linha de cada frame
    { id: "r1", type: "token", x: rx, y: fy(1) + (fh - rh) / 2, w: rw, h: rh, fill: "#11351f", stroke: "var(--good)", mono: true, label: "fact(1) = 1" },
    { id: "r2", type: "token", x: rx, y: fy(2) + (fh - rh) / 2, w: rw, h: rh, fill: "#11351f", stroke: "var(--good)", mono: true, label: "fact(2) = 2 · 1 = 2" },
    { id: "r3", type: "token", x: rx, y: fy(3) + (fh - rh) / 2, w: rw, h: rh, fill: "#11351f", stroke: "var(--good)", mono: true, label: "fact(3) = 3 · 2 = 6" },
    { id: "r4", type: "token", x: rx, y: fy(4) + (fh - rh) / 2, w: rw, h: rh, fill: "#11351f", stroke: "var(--good)", mono: true, label: "fact(4) = 4 · 6 = 24" },
  ];

  const steps = [
    {
      title: "O que é recursão",
      show: ["def"], highlight: ["def"],
      balloon: { anchor: "def", placement: "bottom",
        text: "<strong>Recursão</strong> é uma função que chama a si mesma. O <strong>fatorial</strong> é o exemplo clássico: <strong>fact(n) = n · fact(n−1)</strong>, parando em <strong>fact(1) = 1</strong>.",
        why: "Toda recursão precisa de duas coisas: um <strong>caso base</strong> (onde para) e um <strong>passo</strong> que se aproxima dele. Sem isso, não termina." },
    },
    {
      title: "Chamada inicial: fact(4)",
      show: ["hdr", "f4"], highlight: ["f4"],
      balloon: { anchor: "f4", placement: "right",
        text: "Chamamos <strong>fact(4)</strong>. Ela vira <strong>4 · fact(3)</strong> — mas precisa do resultado de fact(3) para terminar. Então fica <strong>empilhada</strong>, esperando.",
        why: "Cada chamada ainda não resolvida ocupa um <span class=\"xp-term\" tabindex=\"0\" data-tip=\"Bloco de memória com os argumentos e o ponto de retorno de uma chamada.\">frame</span> na pilha de chamadas." },
    },
    {
      title: "fact(4) chama fact(3)",
      show: ["f3"], highlight: ["f3"],
      balloon: { anchor: "f3", placement: "right",
        text: "Para calcular 4 · fact(3), o programa <strong>empilha fact(3)</strong> acima de fact(4) e desce para resolvê-la primeiro.",
        why: "A execução de fact(4) fica <strong>pausada</strong> no meio, guardada no frame, até fact(3) devolver um valor." },
    },
    {
      title: "fact(3) chama fact(2)",
      show: ["f2"], highlight: ["f2"],
      balloon: { anchor: "f2", placement: "right",
        text: "Mesma história: fact(3) precisa de fact(2), então <strong>empilha fact(2)</strong>. A pilha cresce a cada nível.",
        why: "É essa pilha que dá à recursão sua <strong>memória</strong>: cada nível lembra onde parou." },
    },
    {
      title: "fact(2) chama fact(1)",
      show: ["f1"], highlight: ["f1"], pulse: ["f1"],
      balloon: { anchor: "f1", placement: "right",
        text: "fact(2) empilha <strong>fact(1)</strong>. Chegamos ao <strong>caso base</strong>: fact(1) <strong>não</strong> chama mais ninguém.",
        why: "Atingir o caso base é o que <strong>destrava</strong> toda a pilha. Daqui em diante, ela começa a desempilhar." },
    },
    {
      title: "Caso base retorna 1",
      show: ["r1"], hide: ["f1"], highlight: ["r1"],
      balloon: { anchor: "r1", placement: "right",
        text: "fact(1) devolve <strong>1</strong> diretamente e <strong>sai da pilha</strong> (pop). O controle volta para quem a chamou: fact(2).",
        why: "Os retornos acontecem na <strong>ordem inversa</strong> das chamadas — o último a entrar é o primeiro a sair (LIFO)." },
    },
    {
      title: "fact(2) retorna 2",
      show: ["r2"], hide: ["f2"], highlight: ["r2"],
      balloon: { anchor: "r2", placement: "right",
        text: "Agora que fact(1) = 1, fact(2) finalmente calcula <strong>2 · 1 = 2</strong>, retorna e <strong>desempilha</strong>.",
        why: "Cada frame estava só esperando o valor de baixo. Com ele em mãos, resolve na hora e some." },
    },
    {
      title: "fact(3) retorna 6",
      show: ["r3"], hide: ["f3"], highlight: ["r3"],
      balloon: { anchor: "r3", placement: "right",
        text: "Com fact(2) = 2, fact(3) calcula <strong>3 · 2 = 6</strong> e retorna.",
        why: "A pilha encolhe na mesma medida em que cresceu — só que de cima para baixo." },
    },
    {
      title: "fact(4) retorna 24",
      show: ["r4"], hide: ["f4"], highlight: ["r4"], pulse: ["r4"],
      balloon: { anchor: "r4", placement: "right",
        text: "Por fim, fact(4) usa fact(3) = 6: <strong>4 · 6 = 24</strong>. A pilha está vazia e temos a <strong>resposta: 24</strong>.",
        why: "Repare na simetria: empilhamos 4→3→2→1 e desempilhamos 1→2→3→4. Toda recursão tem esse formato de ‘ida e volta’." },
    },
    {
      title: "E sem caso base?",
      highlight: ["def"], pulse: ["def"],
      balloon: { anchor: "def", placement: "bottom",
        text: "Se o caso base não existisse (ou nunca fosse atingido), cada chamada empilharia outra <strong>para sempre</strong> — até a memória da pilha acabar: <strong>stack overflow</strong>.",
        why: "Por isso o caso base não é um detalhe: é o que garante que a recursão <strong>termina</strong>." },
    },
    {
      title: "Teste rápido",
      balloon: { anchor: "def", placement: "bottom",
        text: "Confirme o que você entendeu 👇" },
      quiz: {
        question: "O que acontece se uma função recursiva nunca atinge o caso base?",
        options: [
          "Ela retorna 0 automaticamente",
          "Empilha chamadas até estourar a memória da pilha (stack overflow)",
          "O compilador a transforma em laço sozinho",
          "Ela passa a rodar em O(1)",
        ],
        answer: 1,
        explain: "Sem atingir o caso base, cada chamada cria mais um frame indefinidamente, até a pilha esgotar a memória — o famoso stack overflow.",
      },
    },
    {
      title: "Resumo",
      show: ["r1", "r2", "r3", "r4"], highlight: ["r4"],
      balloon: { anchor: "r4", placement: "right",
        text: "Recursão = <strong>caso base</strong> + <strong>passo recursivo</strong>. As chamadas <strong>empilham</strong> (LIFO) e se resolvem na <strong>ordem inversa</strong>, combinando os retornos: fact(4) = 24.",
        why: "O mesmo modelo explica recursões mais ricas (árvores, dividir-e-conquistar, backtracking): muda o que cada frame faz, não o mecanismo da pilha." },
    },
  ];

  window.RECURSAO_DIAGRAM = {
    title: "Recursão e a pilha de chamadas",
    subtitle: "fact(4): empilhar as chamadas e desempilhar os retornos",
    width: W, height: H, autoplayMs: 8000, elements, steps,
  };
})();
