import { validateExplainer, type ExplainerInput } from "@/schema/explainer";

// Gerado por v2/scripts/convert-v1.ts a partir de explainers/recursao.data.js (v1).
// Câmera usa o default do schema (fit:"all") — sem ajuste fino de enquadramento
// por cena. Revise o relatório do conversor para avisos específicos deste arquivo.
const data: ExplainerInput = {
  slug: "recursao",
  title: "Recursão e a pilha de chamadas",
  subtitle: "fact(4): empilhar as chamadas e desempilhar os retornos",
  category: "Algoritmos & Estruturas de Dados",
  tags: ["recursão", "algoritmo"],
  level: "intro",
  glossary: {
    frame: "Bloco de memória com os argumentos e o ponto de retorno de uma chamada.",
  },
  elements: [
    {
      id: "def",
      tone: "accent",
      kind: "box",
      at: {
        x: 550,
        y: 82,
        w: 500,
        h: 98,
      },
      label: "fact(n) = n · fact(n−1)",
      sub: "fact(1) = 1   (caso base)",
      variant: "outline",
    },
    {
      id: "hdr",
      kind: "label",
      at: {
        x: 431,
        y: 277,
        w: 326,
        h: 42,
      },
      text: "Pilha de chamadas (cresce ↑)",
      align: "center",
      muted: true,
    },
    {
      id: "f4",
      kind: "box",
      at: {
        x: 431,
        y: 675,
        w: 325,
        h: 85,
      },
      label: "fact(4)",
      sub: "4 · fact(3)",
      variant: "outline",
    },
    {
      id: "f3",
      kind: "box",
      at: {
        x: 431,
        y: 559,
        w: 325,
        h: 85,
      },
      label: "fact(3)",
      sub: "3 · fact(2)",
      variant: "outline",
    },
    {
      id: "f2",
      kind: "box",
      at: {
        x: 431,
        y: 444,
        w: 325,
        h: 85,
      },
      label: "fact(2)",
      sub: "2 · fact(1)",
      variant: "outline",
    },
    {
      id: "f1",
      kind: "box",
      at: {
        x: 431,
        y: 328,
        w: 325,
        h: 85,
      },
      label: "fact(1)",
      sub: "caso base",
      variant: "outline",
    },
    {
      id: "r1",
      kind: "token",
      at: {
        x: 813,
        y: 337,
        w: 400,
        h: 67,
      },
      text: "fact(1) = 1",
      mono: true,
    },
    {
      id: "r2",
      kind: "token",
      at: {
        x: 813,
        y: 453,
        w: 400,
        h: 67,
      },
      text: "fact(2) = 2 · 1 = 2",
      mono: true,
    },
    {
      id: "r3",
      kind: "token",
      at: {
        x: 813,
        y: 568,
        w: 400,
        h: 67,
      },
      text: "fact(3) = 3 · 2 = 6",
      mono: true,
    },
    {
      id: "r4",
      kind: "token",
      at: {
        x: 813,
        y: 684,
        w: 400,
        h: 67,
      },
      text: "fact(4) = 4 · 6 = 24",
      mono: true,
    },
  ],
  scenes: [
    {
      id: "s1",
      title: "O que é recursão",
      duration: 8000,
      add: ["def"],
      remove: [],
      set: {},
      cues: [
        {
          at: 0,
          target: "def",
          do: "highlight",
        },
      ],
      caption: {
        anchor: "def",
        placement: "bottom",
        text: "**Recursão** é uma função que chama a si mesma. O **fatorial** é o exemplo clássico: **fact(n) = n · fact(n−1)**, parando em **fact(1) = 1**.",
        why: "Toda recursão precisa de duas coisas: um **caso base** (onde para) e um **passo** que se aproxima dele. Sem isso, não termina.",
      },
    },
    {
      id: "s2",
      title: "Chamada inicial: fact(4)",
      duration: 8000,
      add: ["hdr", "f4"],
      remove: [],
      set: {},
      cues: [
        {
          at: 0,
          target: "f4",
          do: "highlight",
        },
      ],
      caption: {
        anchor: "f4",
        placement: "right",
        text: "Chamamos **fact(4)**. Ela vira **4 · fact(3)** — mas precisa do resultado de fact(3) para terminar. Então fica **empilhada**, esperando.",
        why: "Cada chamada ainda não resolvida ocupa um {{frame}} na pilha de chamadas.",
      },
    },
    {
      id: "s3",
      title: "fact(4) chama fact(3)",
      duration: 8000,
      add: ["f3"],
      remove: [],
      set: {},
      cues: [
        {
          at: 0,
          target: "f3",
          do: "highlight",
        },
      ],
      caption: {
        anchor: "f3",
        placement: "right",
        text: "Para calcular 4 · fact(3), o programa **empilha fact(3)** acima de fact(4) e desce para resolvê-la primeiro.",
        why: "A execução de fact(4) fica **pausada** no meio, guardada no frame, até fact(3) devolver um valor.",
      },
    },
    {
      id: "s4",
      title: "fact(3) chama fact(2)",
      duration: 8000,
      add: ["f2"],
      remove: [],
      set: {},
      cues: [
        {
          at: 0,
          target: "f2",
          do: "highlight",
        },
      ],
      caption: {
        anchor: "f2",
        placement: "right",
        text: "Mesma história: fact(3) precisa de fact(2), então **empilha fact(2)**. A pilha cresce a cada nível.",
        why: "É essa pilha que dá à recursão sua **memória**: cada nível lembra onde parou.",
      },
    },
    {
      id: "s5",
      title: "fact(2) chama fact(1)",
      duration: 8000,
      add: ["f1"],
      remove: [],
      set: {},
      cues: [
        {
          at: 0,
          target: "f1",
          do: "highlight",
        },
        {
          at: 0,
          target: "f1",
          do: "pulse",
          times: 2,
        },
      ],
      caption: {
        anchor: "f1",
        placement: "right",
        text: "fact(2) empilha **fact(1)**. Chegamos ao **caso base**: fact(1) **não** chama mais ninguém.",
        why: "Atingir o caso base é o que **destrava** toda a pilha. Daqui em diante, ela começa a desempilhar.",
      },
    },
    {
      id: "s6",
      title: "Caso base retorna 1",
      duration: 8000,
      add: ["r1"],
      remove: ["f1"],
      set: {},
      cues: [
        {
          at: 0,
          target: "r1",
          do: "highlight",
        },
      ],
      caption: {
        anchor: "r1",
        placement: "right",
        text: "fact(1) devolve **1** diretamente e **sai da pilha** (pop). O controle volta para quem a chamou: fact(2).",
        why: "Os retornos acontecem na **ordem inversa** das chamadas — o último a entrar é o primeiro a sair (LIFO).",
      },
    },
    {
      id: "s7",
      title: "fact(2) retorna 2",
      duration: 8000,
      add: ["r2"],
      remove: ["f2"],
      set: {},
      cues: [
        {
          at: 0,
          target: "r2",
          do: "highlight",
        },
      ],
      caption: {
        anchor: "r2",
        placement: "right",
        text: "Agora que fact(1) = 1, fact(2) finalmente calcula **2 · 1 = 2**, retorna e **desempilha**.",
        why: "Cada frame estava só esperando o valor de baixo. Com ele em mãos, resolve na hora e some.",
      },
    },
    {
      id: "s8",
      title: "fact(3) retorna 6",
      duration: 8000,
      add: ["r3"],
      remove: ["f3"],
      set: {},
      cues: [
        {
          at: 0,
          target: "r3",
          do: "highlight",
        },
      ],
      caption: {
        anchor: "r3",
        placement: "right",
        text: "Com fact(2) = 2, fact(3) calcula **3 · 2 = 6** e retorna.",
        why: "A pilha encolhe na mesma medida em que cresceu — só que de cima para baixo.",
      },
    },
    {
      id: "s9",
      title: "fact(4) retorna 24",
      duration: 8000,
      add: ["r4"],
      remove: ["f4"],
      set: {},
      cues: [
        {
          at: 0,
          target: "r4",
          do: "highlight",
        },
        {
          at: 0,
          target: "r4",
          do: "pulse",
          times: 2,
        },
      ],
      caption: {
        anchor: "r4",
        placement: "right",
        text: "Por fim, fact(4) usa fact(3) = 6: **4 · 6 = 24**. A pilha está vazia e temos a **resposta: 24**.",
        why: "Repare na simetria: empilhamos 4→3→2→1 e desempilhamos 1→2→3→4. Toda recursão tem esse formato de ‘ida e volta’.",
      },
    },
    {
      id: "s10",
      title: "E sem caso base?",
      duration: 8000,
      add: [],
      remove: [],
      set: {},
      cues: [
        {
          at: 0,
          target: "def",
          do: "highlight",
        },
        {
          at: 0,
          target: "def",
          do: "pulse",
          times: 2,
        },
      ],
      caption: {
        anchor: "def",
        placement: "bottom",
        text: "Se o caso base não existisse (ou nunca fosse atingido), cada chamada empilharia outra **para sempre** — até a memória da pilha acabar: **stack overflow**.",
        why: "Por isso o caso base não é um detalhe: é o que garante que a recursão **termina**.",
      },
    },
    {
      id: "s11",
      title: "Teste rápido",
      duration: 8000,
      add: [],
      remove: [],
      set: {},
      cues: [],
      caption: {
        anchor: "def",
        placement: "bottom",
        text: "Confirme o que você entendeu 👇",
      },
      quiz: {
        question: "O que acontece se uma função recursiva nunca atinge o caso base?",
        options: [
          "Ela retorna 0 automaticamente",
          "Empilha chamadas até estourar a memória da pilha (stack overflow)",
          "O compilador a transforma em laço sozinho",
          "Ela passa a rodar em O(1)",
        ],
        answer: 1,
        explain:
          "Sem atingir o caso base, cada chamada cria mais um frame indefinidamente, até a pilha esgotar a memória — o famoso stack overflow.",
      },
    },
    {
      id: "s12",
      title: "Resumo",
      duration: 8000,
      add: ["r1", "r2", "r3", "r4"],
      remove: [],
      set: {},
      cues: [
        {
          at: 0,
          target: "r4",
          do: "highlight",
        },
      ],
      caption: {
        anchor: "r4",
        placement: "right",
        text: "Recursão = **caso base** + **passo recursivo**. As chamadas **empilham** (LIFO) e se resolvem na **ordem inversa**, combinando os retornos: fact(4) = 24.",
        why: "O mesmo modelo explica recursões mais ricas (árvores, dividir-e-conquistar, backtracking): muda o que cada frame faz, não o mecanismo da pilha.",
      },
    },
  ],
};

export const recursao = validateExplainer(data);
