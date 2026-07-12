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
        why: "Toda recursão precisa de duas coisas: um <strong>caso base</strong> (onde para) e um <strong>passo</strong> que se aproxima dele. Sem isso, não termina.",
        deep: `<p>A mesma ideia pode ser escrita como um laço (iteração) — a diferença é que a recursão deixa a linguagem/o runtime guardar automaticamente "onde eu estava" a cada chamada, usando a própria pilha de execução, em vez de você gerenciar essa memória manualmente com uma variável.</p>
<div class="xp-example"><strong>fact(4) de duas formas</strong>Recursiva:
function fact(n) { return n <= 1 ? 1 : n * fact(n - 1); }

Iterativa (equivalente, sem recursão):
let r = 1; for (let i = 2; i <= 4; i++) r *= i;</div>
<p>Recursão costuma ser mais natural para problemas que já são definidos recursivamente por natureza — árvores, grafos, divisão do problema em subproblemas menores do mesmo tipo (como veremos em busca binária e merge sort) — mesmo quando uma versão iterativa também seria possível.</p>` },
    },
    {
      title: "Chamada inicial: fact(4)",
      show: ["hdr", "f4"], highlight: ["f4"],
      balloon: { anchor: "f4", placement: "right",
        text: "Chamamos <strong>fact(4)</strong>. Ela vira <strong>4 · fact(3)</strong> — mas precisa do resultado de fact(3) para terminar. Então fica <strong>empilhada</strong>, esperando.",
        why: "Cada chamada ainda não resolvida ocupa um <span class=\"xp-term\" tabindex=\"0\" data-tip=\"Bloco de memória com os argumentos e o ponto de retorno de uma chamada.\">frame</span> na pilha de chamadas.",
        deep: `<p>Um "frame" guarda tudo que a chamada precisa lembrar para continuar de onde parou: o valor de <code>n</code> (aqui, 4) e o ponto exato do código para onde voltar quando fact(3) devolver um resultado.</p>
<div class="xp-example"><strong>O que o frame de fact(4) guarda</strong>n = 4
próximo passo: multiplicar 4 pelo resultado que fact(3) vai devolver
ainda não sei esse resultado — preciso esperar</div>
<p>Essa é a diferença central entre "chamar" e "empilhar": fact(4) não termina sua execução ao chamar fact(3) — ela pausa exatamente naquele ponto, com seu frame guardado na pilha, e só volta a rodar quando a chamada de dentro devolver um valor.</p>` },
    },
    {
      title: "fact(4) chama fact(3)",
      show: ["f3"], highlight: ["f3"],
      balloon: { anchor: "f3", placement: "right",
        text: "Para calcular 4 · fact(3), o programa <strong>empilha fact(3)</strong> acima de fact(4) e desce para resolvê-la primeiro.",
        why: "A execução de fact(4) fica <strong>pausada</strong> no meio, guardada no frame, até fact(3) devolver um valor.",
        deep: `<p>A pilha de chamadas segue a regra <strong>LIFO</strong> (last in, first out) — o mesmo princípio de uma pilha de pratos: você só consegue tirar o prato do topo, nunca um do meio. fact(3) está no topo agora, então é ela que roda em seguida.</p>
<div class="xp-example"><strong>Estado da pilha neste momento</strong>topo →  fact(3)  [n=3, esperando fact(2)]
base →  fact(4)  [n=4, esperando fact(3)]</div>
<p>fact(4) não "sabe" nem precisa saber como fact(3) vai calcular seu resultado — ela só confia que, quando fact(3) devolver algo, esse valor estará correto. É essa confiança (chamada às vezes de "salto de fé recursivo") que torna a recursão simples de raciocinar, mesmo com vários níveis empilhados.</p>` },
    },
    {
      title: "fact(3) chama fact(2)",
      show: ["f2"], highlight: ["f2"],
      balloon: { anchor: "f2", placement: "right",
        text: "Mesma história: fact(3) precisa de fact(2), então <strong>empilha fact(2)</strong>. A pilha cresce a cada nível.",
        why: "É essa pilha que dá à recursão sua <strong>memória</strong>: cada nível lembra onde parou.",
        deep: `<p>Cada novo nível de empilhamento consome um pouco de memória real do programa — é por isso que recursão sem limite (sem caso base alcançável) eventualmente trava com um erro de memória, e não roda para sempre em silêncio.</p>
<div class="xp-example"><strong>Pilha crescendo, um frame por chamada pendente</strong>topo →  fact(2)  [n=2, esperando fact(1)]
        fact(3)  [n=3, esperando fact(2)]
base →  fact(4)  [n=4, esperando fact(3)]</div>
<p>Para <code>fact(4)</code>, a pilha nunca cresce além de 4 frames — mas para entradas muito maiores (ex.: <code>fact(100000)</code>), o número de frames pendentes cresce junto, e é isso que eventualmente pode estourar o limite de pilha da linguagem, um erro comum chamado <em>stack overflow</em> (visto adiante).</p>` },
    },
    {
      title: "fact(2) chama fact(1)",
      show: ["f1"], highlight: ["f1"], pulse: ["f1"],
      balloon: { anchor: "f1", placement: "right",
        text: "fact(2) empilha <strong>fact(1)</strong>. Chegamos ao <strong>caso base</strong>: fact(1) <strong>não</strong> chama mais ninguém.",
        why: "Atingir o caso base é o que <strong>destrava</strong> toda a pilha. Daqui em diante, ela começa a desempilhar.",
        deep: `<p>O caso base é a única parte da função que não depende de nenhuma chamada pendente — ele tem a resposta na hora, sem esperar por mais ninguém. É o "chão" que impede a pilha de crescer para sempre.</p>
<div class="xp-example"><strong>A condição de parada no código</strong>function fact(n) {
  if (n <= 1) return 1;      // caso base: resposta imediata
  return n * fact(n - 1);    // passo recursivo: depende de outra chamada
}</div>
<p>Note que o caso base precisa ser alcançável a partir de qualquer entrada válida — aqui, como <code>n</code> diminui 1 a cada chamada e o caso base é <code>n &lt;= 1</code>, qualquer número inteiro positivo eventualmente chega lá. Se o passo recursivo não se aproximasse do caso base (ex.: chamasse <code>fact(n)</code> de novo, sem decrementar), a recursão nunca pararia.</p>` },
    },
    {
      title: "Caso base retorna 1",
      show: ["r1"], hide: ["f1"], highlight: ["r1"],
      balloon: { anchor: "r1", placement: "right",
        text: "fact(1) devolve <strong>1</strong> diretamente e <strong>sai da pilha</strong> (pop). O controle volta para quem a chamou: fact(2).",
        why: "Os retornos acontecem na <strong>ordem inversa</strong> das chamadas — o último a entrar é o primeiro a sair (LIFO).",
        deep: `<p>Esse é o momento de virada: até aqui a pilha só crescia (empilhando chamadas pendentes); a partir daqui ela só encolhe (cada frame resolve e sai). fact(1) foi o último a entrar na pilha e é o primeiro a sair — o "L" e o primeiro "F" de LIFO.</p>
<div class="xp-example"><strong>Antes e depois do pop</strong>Antes: topo → fact(1) [n=1] · fact(2) · fact(3) · fact(4) → base
fact(1) retorna 1, sai da pilha
Depois: topo → fact(2) [agora sabe: fact(1) = 1] · fact(3) · fact(4) → base</div>
<p>fact(2) estava pausada exatamente no ponto "preciso multiplicar 2 pelo resultado de fact(1)" — agora que esse resultado chegou (1), ela pode finalmente terminar seu próprio cálculo.</p>` },
    },
    {
      title: "fact(2) retorna 2",
      show: ["r2"], hide: ["f2"], highlight: ["r2"],
      balloon: { anchor: "r2", placement: "right",
        text: "Agora que fact(1) = 1, fact(2) finalmente calcula <strong>2 · 1 = 2</strong>, retorna e <strong>desempilha</strong>.",
        why: "Cada frame estava só esperando o valor de baixo. Com ele em mãos, resolve na hora e some.",
        deep: `<p>Repare que o trabalho de multiplicar acontece só agora, na volta — não na ida. A recursão desce empilhando chamadas "em suspenso" e só faz as contas de fato durante o desempilhamento, de dentro para fora.</p>
<div class="xp-example"><strong>O que estava pendurado, agora se resolve</strong>fact(2) = 2 * fact(1)
        = 2 * 1
        = 2   → retorna, sai da pilha</div>
<p>Esse padrão — "ida" que só empilha trabalho, "volta" que o executa — é comum a qualquer recursão que combina resultados de subchamadas (soma de uma árvore, merge de duas listas ordenadas): a combinação sempre acontece na fase de retorno, nunca na fase de chamada.</p>` },
    },
    {
      title: "fact(3) retorna 6",
      show: ["r3"], hide: ["f3"], highlight: ["r3"],
      balloon: { anchor: "r3", placement: "right",
        text: "Com fact(2) = 2, fact(3) calcula <strong>3 · 2 = 6</strong> e retorna.",
        why: "A pilha encolhe na mesma medida em que cresceu — só que de cima para baixo.",
        deep: `<p>A cada retorno, o resultado "sobe" um nível e é imediatamente consumido pelo frame de baixo — nenhum resultado intermediário precisa ser guardado em uma variável global ou estrutura externa, a própria pilha faz esse transporte.</p>
<div class="xp-example"><strong>Encolhendo simetricamente ao crescimento</strong>Cresceu:  fact(4) → fact(3) → fact(2) → fact(1)
Encolhe:  fact(1)=1 → fact(2)=2 → fact(3)=6 → (falta fact(4))</div>
<p>Só falta um frame: fact(4), que ainda está esperando esse resultado de 6 para fazer sua própria multiplicação e finalmente fechar toda a cadeia.</p>` },
    },
    {
      title: "fact(4) retorna 24",
      show: ["r4"], hide: ["f4"], highlight: ["r4"], pulse: ["r4"],
      balloon: { anchor: "r4", placement: "right",
        text: "Por fim, fact(4) usa fact(3) = 6: <strong>4 · 6 = 24</strong>. A pilha está vazia e temos a <strong>resposta: 24</strong>.",
        why: "Repare na simetria: empilhamos 4→3→2→1 e desempilhamos 1→2→3→4. Toda recursão tem esse formato de ‘ida e volta’.",
        deep: `<p>O resultado final, 24, nunca foi calculado "de uma vez" — foi construído em 4 pequenas multiplicações, cada uma feita por um frame diferente, na volta. Ninguém precisou pensar em "4 × 3 × 2 × 1" de uma vez só.</p>
<div class="xp-example"><strong>A cadeia completa de ida e volta</strong>Ida:   fact(4) → fact(3) → fact(2) → fact(1)
Volta: fact(1)=1 → fact(2)=2·1=2 → fact(3)=3·2=6 → fact(4)=4·6=24</div>
<p>Esse formato simétrico — descer decompondo o problema, subir recombinando os resultados — é o esqueleto que reaparece em recursões bem mais ricas: percorrer uma árvore, dividir um array ao meio (merge sort), ou explorar caminhos possíveis (backtracking). Muda o que cada frame faz; o mecanismo da pilha é sempre este.</p>` },
    },
    {
      title: "E sem caso base?",
      highlight: ["def"], pulse: ["def"],
      balloon: { anchor: "def", placement: "bottom",
        text: "Se o caso base não existisse (ou nunca fosse atingido), cada chamada empilharia outra <strong>para sempre</strong> — até a memória da pilha acabar: <strong>stack overflow</strong>.",
        why: "Por isso o caso base não é um detalhe: é o que garante que a recursão <strong>termina</strong>.",
        deep: `<p>Esse não é um erro raro de teoria — é um dos bugs mais comuns em código recursivo iniciante, geralmente por esquecer o caso base ou por escrever um passo que não se aproxima dele.</p>
<div class="xp-bad"><strong>Sem caso base (ou inalcançável)</strong>function fact(n) { return n * fact(n - 1); }
// fact(1) chama fact(0), que chama fact(-1), que chama fact(-2)... nunca para</div>
<div class="xp-good"><strong>Com caso base alcançável</strong>function fact(n) { if (n <= 1) return 1; return n * fact(n - 1); }
// para garantidamente quando n chega a 1</div>
<p>O nome "stack overflow" descreve literalmente o que acontece: a memória reservada para a pilha de chamadas (geralmente pequena, alguns megabytes) se esgota antes da memória geral do programa, então o erro aparece rápido — é o runtime avisando que uma recursão não vai terminar sozinha.</p>` },
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
