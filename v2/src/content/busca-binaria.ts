import { validateExplainer, type ExplainerInput } from "@/schema/explainer";

// Gerado por v2/scripts/convert-v1.ts a partir de explainers/busca-binaria.data.js (v1).
// Câmera usa o default do schema (fit:"all") — sem ajuste fino de enquadramento
// por cena. Revise o relatório do conversor para avisos específicos deste arquivo.
const data: ExplainerInput = {
  slug: "busca-binaria",
  title: "Busca Binária",
  subtitle: "Dividir para conquistar: achar um valor em O(log n)",
  category: "Algoritmos & Estruturas de Dados",
  tags: ["busca binária", "algoritmo"],
  level: "intro",
  glossary: {
    mid: "mid = (lo + hi) / 2, arredondado para baixo.",
  },
  elements: [
    {
      id: "alvo",
      tone: "accent",
      kind: "box",
      at: {
        x: 675,
        y: 193,
        w: 250,
        h: 82,
      },
      label: "alvo = 41",
      sub: "procurar este valor",
      variant: "outline",
    },
    {
      id: "cmp",
      kind: "label",
      at: {
        x: 181,
        y: 221,
        w: 163,
        h: 42,
      },
      text: "comparações: 0",
      align: "center",
      muted: true,
    },
    {
      id: "p_mid",
      kind: "token",
      at: {
        x: 179,
        y: 345,
        w: 85,
        h: 44,
      },
      text: "mid ▾",
    },
    {
      id: "p_lo",
      kind: "token",
      at: {
        x: 184,
        y: 581,
        w: 75,
        h: 44,
      },
      text: "▴ lo",
    },
    {
      id: "p_hi",
      kind: "token",
      at: {
        x: 184,
        y: 653,
        w: 75,
        h: 44,
      },
      text: "▴ hi",
    },
    {
      id: "a0",
      kind: "box",
      at: {
        x: 175,
        y: 411,
        w: 93,
        h: 93,
      },
      label: "3",
      variant: "outline",
    },
    {
      id: "i0",
      kind: "label",
      at: {
        x: 184,
        y: 516,
        w: 75,
        h: 42,
      },
      text: "0",
      align: "center",
      muted: true,
    },
    {
      id: "a1",
      kind: "box",
      at: {
        x: 280,
        y: 411,
        w: 93,
        h: 93,
      },
      label: "8",
      variant: "outline",
    },
    {
      id: "i1",
      kind: "label",
      at: {
        x: 289,
        y: 516,
        w: 75,
        h: 42,
      },
      text: "1",
      align: "center",
      muted: true,
    },
    {
      id: "a2",
      kind: "box",
      at: {
        x: 385,
        y: 411,
        w: 93,
        h: 93,
      },
      label: "12",
      variant: "outline",
    },
    {
      id: "i2",
      kind: "label",
      at: {
        x: 394,
        y: 516,
        w: 75,
        h: 42,
      },
      text: "2",
      align: "center",
      muted: true,
    },
    {
      id: "a3",
      kind: "box",
      at: {
        x: 490,
        y: 411,
        w: 93,
        h: 93,
      },
      label: "15",
      variant: "outline",
    },
    {
      id: "i3",
      kind: "label",
      at: {
        x: 499,
        y: 516,
        w: 75,
        h: 42,
      },
      text: "3",
      align: "center",
      muted: true,
    },
    {
      id: "a4",
      kind: "box",
      at: {
        x: 595,
        y: 411,
        w: 93,
        h: 93,
      },
      label: "21",
      variant: "outline",
    },
    {
      id: "i4",
      kind: "label",
      at: {
        x: 604,
        y: 516,
        w: 75,
        h: 42,
      },
      text: "4",
      align: "center",
      muted: true,
    },
    {
      id: "a5",
      kind: "box",
      at: {
        x: 700,
        y: 411,
        w: 93,
        h: 93,
      },
      label: "27",
      variant: "outline",
    },
    {
      id: "i5",
      kind: "label",
      at: {
        x: 709,
        y: 516,
        w: 75,
        h: 42,
      },
      text: "5",
      align: "center",
      muted: true,
    },
    {
      id: "a6",
      kind: "box",
      at: {
        x: 805,
        y: 411,
        w: 93,
        h: 93,
      },
      label: "33",
      variant: "outline",
    },
    {
      id: "i6",
      kind: "label",
      at: {
        x: 814,
        y: 516,
        w: 75,
        h: 42,
      },
      text: "6",
      align: "center",
      muted: true,
    },
    {
      id: "a7",
      kind: "box",
      at: {
        x: 910,
        y: 411,
        w: 93,
        h: 93,
      },
      label: "41",
      variant: "outline",
    },
    {
      id: "i7",
      kind: "label",
      at: {
        x: 919,
        y: 516,
        w: 75,
        h: 42,
      },
      text: "7",
      align: "center",
      muted: true,
    },
    {
      id: "a8",
      kind: "box",
      at: {
        x: 1015,
        y: 411,
        w: 93,
        h: 93,
      },
      label: "50",
      variant: "outline",
    },
    {
      id: "i8",
      kind: "label",
      at: {
        x: 1024,
        y: 516,
        w: 75,
        h: 42,
      },
      text: "8",
      align: "center",
      muted: true,
    },
    {
      id: "a9",
      kind: "box",
      at: {
        x: 1120,
        y: 411,
        w: 93,
        h: 93,
      },
      label: "64",
      variant: "outline",
    },
    {
      id: "i9",
      kind: "label",
      at: {
        x: 1129,
        y: 516,
        w: 75,
        h: 42,
      },
      text: "9",
      align: "center",
      muted: true,
    },
    {
      id: "a10",
      kind: "box",
      at: {
        x: 1225,
        y: 411,
        w: 93,
        h: 93,
      },
      label: "72",
      variant: "outline",
    },
    {
      id: "i10",
      kind: "label",
      at: {
        x: 1234,
        y: 516,
        w: 75,
        h: 42,
      },
      text: "10",
      align: "center",
      muted: true,
    },
    {
      id: "a11",
      kind: "box",
      at: {
        x: 1330,
        y: 411,
        w: 93,
        h: 93,
      },
      label: "89",
      variant: "outline",
    },
    {
      id: "i11",
      kind: "label",
      at: {
        x: 1339,
        y: 516,
        w: 75,
        h: 42,
      },
      text: "11",
      align: "center",
      muted: true,
    },
  ],
  scenes: [
    {
      id: "s1",
      title: "Um array ordenado",
      duration: 8000,
      add: [
        "cmp",
        "a0",
        "i0",
        "a1",
        "i1",
        "a2",
        "i2",
        "a3",
        "i3",
        "a4",
        "i4",
        "a5",
        "i5",
        "a6",
        "i6",
        "a7",
        "i7",
        "a8",
        "i8",
        "a9",
        "i9",
        "a10",
        "i10",
        "a11",
        "i11",
      ],
      remove: [],
      set: {},
      cues: [
        {
          at: 0,
          target: "a0",
          do: "highlight",
        },
        {
          at: 0,
          target: "a1",
          do: "highlight",
        },
        {
          at: 0,
          target: "a2",
          do: "highlight",
        },
        {
          at: 0,
          target: "a3",
          do: "highlight",
        },
        {
          at: 0,
          target: "a4",
          do: "highlight",
        },
        {
          at: 0,
          target: "a5",
          do: "highlight",
        },
        {
          at: 0,
          target: "a6",
          do: "highlight",
        },
        {
          at: 0,
          target: "a7",
          do: "highlight",
        },
        {
          at: 0,
          target: "a8",
          do: "highlight",
        },
        {
          at: 0,
          target: "a9",
          do: "highlight",
        },
        {
          at: 0,
          target: "a10",
          do: "highlight",
        },
        {
          at: 0,
          target: "a11",
          do: "highlight",
        },
      ],
      caption: {
        anchor: "a5",
        placement: "bottom",
        text: "A busca binária precisa de um **array ordenado**. Cada posição tem um **índice** (embaixo) e um **valor** (dentro).",
        why: "É a ordenação que permite, ao olhar um único elemento do meio, descartar **metade** dos candidatos de uma vez.",
      },
    },
    {
      id: "s2",
      title: "O que queremos achar",
      duration: 8000,
      add: ["alvo"],
      remove: [],
      set: {},
      cues: [
        {
          at: 0,
          target: "alvo",
          do: "highlight",
        },
      ],
      caption: {
        anchor: "alvo",
        placement: "bottom",
        text: "Queremos o índice do valor **41**. Uma busca linear olharia posição por posição — até **12** comparações aqui.",
        why: "A busca binária faz muito menos: ela **divide para conquistar**.",
      },
    },
    {
      id: "s3",
      title: "Marque os limites: lo e hi",
      duration: 8000,
      add: ["p_lo", "p_hi"],
      remove: [],
      set: {
        cmp: {
          text: "comparações: 0",
        },
      },
      cues: [
        {
          at: 0,
          target: "p_lo",
          do: "move",
          by: {
            x: 0,
            y: 0,
          },
        },
        {
          at: 0,
          target: "p_hi",
          do: "move",
          by: {
            x: 1155,
            y: 0,
          },
        },
        {
          at: 0,
          target: "a0",
          do: "highlight",
        },
        {
          at: 0,
          target: "a1",
          do: "highlight",
        },
        {
          at: 0,
          target: "a2",
          do: "highlight",
        },
        {
          at: 0,
          target: "a3",
          do: "highlight",
        },
        {
          at: 0,
          target: "a4",
          do: "highlight",
        },
        {
          at: 0,
          target: "a5",
          do: "highlight",
        },
        {
          at: 0,
          target: "a6",
          do: "highlight",
        },
        {
          at: 0,
          target: "a7",
          do: "highlight",
        },
        {
          at: 0,
          target: "a8",
          do: "highlight",
        },
        {
          at: 0,
          target: "a9",
          do: "highlight",
        },
        {
          at: 0,
          target: "a10",
          do: "highlight",
        },
        {
          at: 0,
          target: "a11",
          do: "highlight",
        },
      ],
      caption: {
        anchor: "p_lo",
        placement: "bottom",
        text: "Dois ponteiros delimitam a janela de busca: **lo** no início (0) e **hi** no fim (11). O alvo, se existir, está entre eles.",
        why: "A cada passo a janela [lo, hi] encolhe. Quando lo passa de hi sem achar, o valor não está no array.",
      },
    },
    {
      id: "s4",
      title: "Sonda 1: olhe o meio",
      duration: 8000,
      add: ["p_mid"],
      remove: [],
      set: {
        cmp: {
          text: "comparações: 1",
        },
      },
      cues: [
        {
          at: 0,
          target: "p_lo",
          do: "move",
          by: {
            x: 0,
            y: 0,
          },
        },
        {
          at: 0,
          target: "p_hi",
          do: "move",
          by: {
            x: 1155,
            y: 0,
          },
        },
        {
          at: 0,
          target: "p_mid",
          do: "move",
          by: {
            x: 525,
            y: 0,
          },
        },
        {
          at: 0,
          target: "a0",
          do: "highlight",
        },
        {
          at: 0,
          target: "a1",
          do: "highlight",
        },
        {
          at: 0,
          target: "a2",
          do: "highlight",
        },
        {
          at: 0,
          target: "a3",
          do: "highlight",
        },
        {
          at: 0,
          target: "a4",
          do: "highlight",
        },
        {
          at: 0,
          target: "a5",
          do: "highlight",
        },
        {
          at: 0,
          target: "a6",
          do: "highlight",
        },
        {
          at: 0,
          target: "a7",
          do: "highlight",
        },
        {
          at: 0,
          target: "a8",
          do: "highlight",
        },
        {
          at: 0,
          target: "a9",
          do: "highlight",
        },
        {
          at: 0,
          target: "a10",
          do: "highlight",
        },
        {
          at: 0,
          target: "a11",
          do: "highlight",
        },
        {
          at: 0,
          target: "a5",
          do: "pulse",
          times: 2,
        },
      ],
      caption: {
        anchor: "a5",
        placement: "top",
        text: "{{mid}} = (0 + 11) / 2 = **5** → valor **27**. Como **27 < 41**, o alvo está à **direita**.",
        why: "Toda a metade esquerda (índices 0–5) pode ser descartada: lá os valores só diminuem.",
      },
    },
    {
      id: "s5",
      title: "Descarte a esquerda: lo = 6",
      duration: 8000,
      add: [],
      remove: [],
      set: {
        cmp: {
          text: "comparações: 2",
        },
      },
      cues: [
        {
          at: 0,
          target: "p_lo",
          do: "move",
          by: {
            x: 630,
            y: 0,
          },
        },
        {
          at: 0,
          target: "p_hi",
          do: "move",
          by: {
            x: 1155,
            y: 0,
          },
        },
        {
          at: 0,
          target: "p_mid",
          do: "move",
          by: {
            x: 840,
            y: 0,
          },
        },
        {
          at: 0,
          target: "a6",
          do: "highlight",
        },
        {
          at: 0,
          target: "a7",
          do: "highlight",
        },
        {
          at: 0,
          target: "a8",
          do: "highlight",
        },
        {
          at: 0,
          target: "a9",
          do: "highlight",
        },
        {
          at: 0,
          target: "a10",
          do: "highlight",
        },
        {
          at: 0,
          target: "a11",
          do: "highlight",
        },
        {
          at: 0,
          target: "a0",
          do: "dim",
        },
        {
          at: 0,
          target: "a1",
          do: "dim",
        },
        {
          at: 0,
          target: "a2",
          do: "dim",
        },
        {
          at: 0,
          target: "a3",
          do: "dim",
        },
        {
          at: 0,
          target: "a4",
          do: "dim",
        },
        {
          at: 0,
          target: "a5",
          do: "dim",
        },
        {
          at: 0,
          target: "a8",
          do: "pulse",
          times: 2,
        },
      ],
      caption: {
        anchor: "a8",
        placement: "top",
        text: "Movemos **lo = mid + 1 = 6**. Nova janela: 6–11. mid = (6 + 11) / 2 = **8** → valor **50**. Agora **50 > 41**: o alvo está à **esquerda**.",
        why: "Em duas sondas já restam só 6 dos 12 elementos — e logo bem menos.",
      },
    },
    {
      id: "s6",
      title: "Descarte a direita: hi = 7",
      duration: 8000,
      add: [],
      remove: [],
      set: {
        cmp: {
          text: "comparações: 3",
        },
      },
      cues: [
        {
          at: 0,
          target: "p_lo",
          do: "move",
          by: {
            x: 630,
            y: 0,
          },
        },
        {
          at: 0,
          target: "p_hi",
          do: "move",
          by: {
            x: 735,
            y: 0,
          },
        },
        {
          at: 0,
          target: "p_mid",
          do: "move",
          by: {
            x: 630,
            y: 0,
          },
        },
        {
          at: 0,
          target: "a6",
          do: "highlight",
        },
        {
          at: 0,
          target: "a7",
          do: "highlight",
        },
        {
          at: 0,
          target: "a0",
          do: "dim",
        },
        {
          at: 0,
          target: "a1",
          do: "dim",
        },
        {
          at: 0,
          target: "a2",
          do: "dim",
        },
        {
          at: 0,
          target: "a3",
          do: "dim",
        },
        {
          at: 0,
          target: "a4",
          do: "dim",
        },
        {
          at: 0,
          target: "a5",
          do: "dim",
        },
        {
          at: 0,
          target: "a8",
          do: "dim",
        },
        {
          at: 0,
          target: "a9",
          do: "dim",
        },
        {
          at: 0,
          target: "a10",
          do: "dim",
        },
        {
          at: 0,
          target: "a11",
          do: "dim",
        },
        {
          at: 0,
          target: "a6",
          do: "pulse",
          times: 2,
        },
      ],
      caption: {
        anchor: "a6",
        placement: "top",
        text: "Movemos **hi = mid − 1 = 7**. Janela: 6–7. mid = (6 + 7) / 2 = **6** → valor **33**. Como **33 < 41**, vá para a direita: **lo = 7**.",
        why: "A janela tem só dois elementos. Mais uma sonda decide.",
      },
    },
    {
      id: "s7",
      title: "Achou! índice 7",
      duration: 8000,
      add: [],
      remove: [],
      set: {
        cmp: {
          text: "comparações: 4",
        },
      },
      cues: [
        {
          at: 0,
          target: "p_lo",
          do: "move",
          by: {
            x: 735,
            y: 0,
          },
        },
        {
          at: 0,
          target: "p_hi",
          do: "move",
          by: {
            x: 735,
            y: 0,
          },
        },
        {
          at: 0,
          target: "p_mid",
          do: "move",
          by: {
            x: 735,
            y: 0,
          },
        },
        {
          at: 120,
          target: "a7",
          do: "pulse",
          times: 2,
        },
        {
          at: 0,
          target: "a7",
          do: "highlight",
        },
        {
          at: 0,
          target: "a0",
          do: "dim",
        },
        {
          at: 0,
          target: "a1",
          do: "dim",
        },
        {
          at: 0,
          target: "a2",
          do: "dim",
        },
        {
          at: 0,
          target: "a3",
          do: "dim",
        },
        {
          at: 0,
          target: "a4",
          do: "dim",
        },
        {
          at: 0,
          target: "a5",
          do: "dim",
        },
        {
          at: 0,
          target: "a6",
          do: "dim",
        },
        {
          at: 0,
          target: "a8",
          do: "dim",
        },
        {
          at: 0,
          target: "a9",
          do: "dim",
        },
        {
          at: 0,
          target: "a10",
          do: "dim",
        },
        {
          at: 0,
          target: "a11",
          do: "dim",
        },
      ],
      caption: {
        anchor: "a7",
        placement: "top",
        text: "Janela: 7–7. mid = **7** → valor **41**. **41 == 41** ✅ — encontrado no índice **7** em apenas **4** comparações.",
        why: "A linear poderia gastar 8 comparações para chegar aqui; a binária garantiu 4 no pior caso.",
      },
    },
    {
      id: "s8",
      title: "E se o valor não existir?",
      duration: 8000,
      add: [],
      remove: [],
      set: {
        cmp: {
          text: "comparações: 4",
        },
      },
      cues: [
        {
          at: 0,
          target: "p_lo",
          do: "move",
          by: {
            x: 840,
            y: 0,
          },
        },
        {
          at: 0,
          target: "p_hi",
          do: "move",
          by: {
            x: 735,
            y: 0,
          },
        },
        {
          at: 0,
          target: "p_mid",
          do: "move",
          by: {
            x: 735,
            y: 0,
          },
        },
        {
          at: 0,
          target: "a0",
          do: "dim",
        },
        {
          at: 0,
          target: "a1",
          do: "dim",
        },
        {
          at: 0,
          target: "a2",
          do: "dim",
        },
        {
          at: 0,
          target: "a3",
          do: "dim",
        },
        {
          at: 0,
          target: "a4",
          do: "dim",
        },
        {
          at: 0,
          target: "a5",
          do: "dim",
        },
        {
          at: 0,
          target: "a6",
          do: "dim",
        },
        {
          at: 0,
          target: "a7",
          do: "dim",
        },
        {
          at: 0,
          target: "a8",
          do: "dim",
        },
        {
          at: 0,
          target: "a9",
          do: "dim",
        },
        {
          at: 0,
          target: "a10",
          do: "dim",
        },
        {
          at: 0,
          target: "a11",
          do: "dim",
        },
      ],
      caption: {
        anchor: {
          x: 640,
          y: 250,
        },
        placement: "bottom",
        text: "Procurando **42** (que não está aqui): a janela encolhe até **lo (8) ultrapassar hi (7)** — repare nos ponteiros **cruzados** abaixo. Janela vazia ⇒ **não encontrado**.",
        why: "O critério de parada é **lo > hi**. É ele que garante o término: ou o valor aparece, ou a janela esvazia provando que ele não existe.",
      },
    },
    {
      id: "s9",
      title: "Por que é O(log n)",
      duration: 8000,
      add: [],
      remove: [],
      set: {
        cmp: {
          text: "comparações: 4",
        },
      },
      cues: [
        {
          at: 0,
          target: "p_lo",
          do: "move",
          by: {
            x: 735,
            y: 0,
          },
        },
        {
          at: 0,
          target: "p_hi",
          do: "move",
          by: {
            x: 735,
            y: 0,
          },
        },
        {
          at: 0,
          target: "p_mid",
          do: "move",
          by: {
            x: 735,
            y: 0,
          },
        },
        {
          at: 0,
          target: "a7",
          do: "highlight",
        },
        {
          at: 0,
          target: "a0",
          do: "dim",
        },
        {
          at: 0,
          target: "a1",
          do: "dim",
        },
        {
          at: 0,
          target: "a2",
          do: "dim",
        },
        {
          at: 0,
          target: "a3",
          do: "dim",
        },
        {
          at: 0,
          target: "a4",
          do: "dim",
        },
        {
          at: 0,
          target: "a5",
          do: "dim",
        },
        {
          at: 0,
          target: "a6",
          do: "dim",
        },
        {
          at: 0,
          target: "a8",
          do: "dim",
        },
        {
          at: 0,
          target: "a9",
          do: "dim",
        },
        {
          at: 0,
          target: "a10",
          do: "dim",
        },
        {
          at: 0,
          target: "a11",
          do: "dim",
        },
      ],
      caption: {
        anchor: {
          x: 640,
          y: 250,
        },
        placement: "bottom",
        text: "Cada sonda corta o espaço de busca **pela metade**: 12 → 6 → 3 → 1. O número de passos é **log₂(n)**.",
        why: "Por isso a escala impressiona: 1.000 itens ≈ 10 passos; 1.000.000 ≈ 20 passos. Dobrar os dados custa **uma** comparação a mais.",
      },
    },
    {
      id: "s10",
      title: "Teste rápido",
      duration: 8000,
      add: [],
      remove: [],
      set: {},
      cues: [],
      caption: {
        anchor: {
          x: 640,
          y: 250,
        },
        placement: "bottom",
        text: "Confirme a intuição de escala 👇",
      },
      quiz: {
        question:
          "Numa busca binária sobre 1.000.000 de itens ordenados, quantas comparações no pior caso (aprox.)?",
        options: ["Cerca de 1.000.000", "Cerca de 500.000", "Cerca de 20", "Cerca de 1.000"],
        answer: 2,
        explain:
          "log₂(1.000.000) ≈ 20. Como cada passo corta o espaço pela metade, mesmo milhões de itens caem em ~20 comparações.",
      },
    },
    {
      id: "s11",
      title: "Resumo",
      duration: 8000,
      add: [],
      remove: [],
      set: {
        cmp: {
          text: "comparações: 4",
        },
      },
      cues: [
        {
          at: 0,
          target: "p_lo",
          do: "move",
          by: {
            x: 735,
            y: 0,
          },
        },
        {
          at: 0,
          target: "p_hi",
          do: "move",
          by: {
            x: 735,
            y: 0,
          },
        },
        {
          at: 0,
          target: "p_mid",
          do: "move",
          by: {
            x: 735,
            y: 0,
          },
        },
        {
          at: 0,
          target: "a7",
          do: "highlight",
        },
        {
          at: 0,
          target: "a0",
          do: "dim",
        },
        {
          at: 0,
          target: "a1",
          do: "dim",
        },
        {
          at: 0,
          target: "a2",
          do: "dim",
        },
        {
          at: 0,
          target: "a3",
          do: "dim",
        },
        {
          at: 0,
          target: "a4",
          do: "dim",
        },
        {
          at: 0,
          target: "a5",
          do: "dim",
        },
        {
          at: 0,
          target: "a6",
          do: "dim",
        },
        {
          at: 0,
          target: "a8",
          do: "dim",
        },
        {
          at: 0,
          target: "a9",
          do: "dim",
        },
        {
          at: 0,
          target: "a10",
          do: "dim",
        },
        {
          at: 0,
          target: "a11",
          do: "dim",
        },
      ],
      caption: {
        anchor: "a7",
        placement: "top",
        text: "Busca binária: **array ordenado** → comparar com o **meio** → descartar a metade impossível → repetir até a janela ter 1 elemento.",
        why: "Pré-requisito é a ordenação. Se os dados mudam muito e você busca o tempo todo, vale manter ordenado (ou usar uma hash map para O(1) médio).",
      },
    },
  ],
};

export const buscaBinaria = validateExplainer(data);
