# 🧠 tech-learn — Diagramas explicativos animados

Coleção de **explicadores interativos** que ensinam conceitos de tecnologia
passo a passo, com animação, realces e **balões** que aparecem em cada etapa.
Tudo em **HTML + CSS + JavaScript puro** — sem build, sem dependências. É só
abrir no navegador.

O primeiro diagrama explica **como funciona uma rede Transformer**, do texto cru
até a próxima palavra prevista.

## ▶️ Como rodar

Abra `index.html` direto no navegador (`file://`), ou suba um servidor local
(recomendado, evita restrições de `file://`):

```bash
python3 -m http.server 8000
# depois acesse http://localhost:8000
```

Navegue com os botões **Anterior / Próximo**, o botão **Reproduzir** (autoplay),
o índice lateral de etapas, ou o teclado: **← →** trocam de cena e **espaço**
dá play/pause.

## 🗂 Estrutura

```
tech-learn/
├── index.html                  # vitrine: lista os explicadores
├── engine/
│   ├── explainer.css           # tema e animações (genérico)
│   └── explainer.js            # motor: timeline, render SVG, balões, controles
└── explainers/
    ├── transformer.html        # página: carrega o motor + os dados
    └── transformer.data.js     # CONTEÚDO: elementos + cenas do Transformer
```

O **motor** (`engine/`) é genérico e nunca precisa ser editado para criar um
novo diagrama. Cada explicador é só um **arquivo de dados** + uma página HTML
fininha que instancia o motor.

## ✨ Como criar um novo explicador

1. **Copie** `explainers/transformer.html` e `explainers/transformer.data.js`
   com o nome do seu tema (ex.: `tcp.html` / `tcp.data.js`).
2. No `.data.js`, defina dois arrays: `elements` (o que aparece) e `steps`
   (a narração). No fim, exponha o objeto em `window.SEU_DIAGRAMA`.
3. No `.html`, troque a referência do script e a linha de instanciação para
   `new Explainer(window.SEU_DIAGRAMA).mount("#app")`.
4. Adicione um card apontando para a nova página em `index.html`.

### Contrato dos dados

```js
window.MEU_DIAGRAMA = {
  title: "Título", subtitle: "Subtítulo",
  width: 1280, height: 760,        // viewBox do SVG
  autoplayMs: 8000,                // tempo por cena no autoplay
  elements: [ /* ver abaixo */ ],
  steps:    [ /* ver abaixo */ ],
};
```

**Elementos** (cada um precisa de `id` único). Tipos suportados:

| `type`   | Para quê | Campos principais |
|----------|----------|-------------------|
| `box`    | caixa/etapa | `x, y, w, h, label` (string ou array de linhas), `fill`, `mono`, `rx` |
| `token`  | "chip" de token | igual ao box, com estilo de token |
| `label`  | texto solto | `x, y, label, anchor` (`start`/`middle`/`end`), `size`, `sub`, `mono` |
| `arrow`  | seta/conector | `x1,y1,x2,y2` **ou** `path`; opções `color`, `noHead`, `dashed` |
| `vector` | coluna de barras (ex.: embedding) | `x, y, w, h, values:[0..1], color` |
| `matrix` | grade de células (ex.: atenção) | `x, y, rows, cols, cell, color` |

Por padrão todo elemento começa **oculto**. Use `base: true` para já nascer
visível.

**Cenas** (`steps`). Campos de cada cena:

```js
{
  title: "Nome da etapa",          // aparece no índice e no balão
  balloon: {                       // o balão explicativo
    anchor: "id_do_elemento",      // ou { x, y } em coords do SVG
    placement: "right",            // top | right | bottom | left
    text: "Texto com <strong>HTML</strong>.",
    why:  "Explica POR QUE essa etapa existe (opcional).",
  },
  show:      ["id1", "id2"],        // revela elementos (acumula entre cenas)
  hide:      ["id3"],               // esconde elementos
  highlight: ["id1"],               // contorno/brilho de destaque
  dim:       ["id4"],               // esmaece
  pulse:     ["id2"],               // pulsa continuamente
  enter(ctx) { /* opcional */ },    // animação sob medida (ver abaixo)
}
```

`show`/`hide` **acumulam**: o que foi mostrado continua visível nas cenas
seguintes (bom para um diagrama que "cresce"). Elementos que você quer
exclusivos de uma cena (zoom/detalhe) **não** entram em `show`/`hide` — revele-os
dentro de `enter(ctx)` e o motor os esconde sozinho ao trocar de cena.

### `enter(ctx)` — animações sob medida

Para efeitos especiais, a cena pode trazer uma função `enter(ctx)`. O `ctx`
oferece helpers prontos:

| Helper | O que faz |
|--------|-----------|
| `ctx.show(id)` / `ctx.hide(id)` | revela/esconde um elemento |
| `ctx.drawArrow(id)` | anima o traçado de uma seta |
| `ctx.setBars(id, [vals])` | reanima as alturas das barras de um `vector` |
| `ctx.lightCells(id, [[r,c,op], …])` | acende células de uma `matrix` em cascata |
| `ctx.moveTo(id, x, y)` | desloca um elemento (px) |
| `ctx.pulse(id, on)` | liga/desliga o pulso |
| `ctx.el(id)` / `ctx.svgEl(tag, attrs)` | acesso direto ao SVG p/ casos avançados |

Exemplo (revelar barras em cascata e acender uma matriz):

```js
enter: (ctx) => {
  ["v0", "v1", "v2"].forEach((id, i) => setTimeout(() => ctx.show(id), i * 90));
  setTimeout(() => ctx.lightCells("attn", [[2, 1, .95], [0, 0, .6]]), 400);
}
```

## ♿ Acessibilidade & desempenho

- Respeita `prefers-reduced-motion`: com a preferência ligada, as animações são
  reduzidas a quase nada.
- SVG escala sozinho para a tela; layout responsivo simples (o índice lateral
  recolhe em telas estreitas).

## 📄 Licença

Uso livre para fins educacionais.
