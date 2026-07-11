/* ============================================================================
 * explainer.types.js — Tipos (JSDoc) do contrato de dados dos explicadores
 * ----------------------------------------------------------------------------
 * NÃO é executado em runtime — serve só para autocomplete e checagem no editor
 * (VS Code etc.) sem precisar de TypeScript. Para ativar num arquivo de dados,
 * comece-o com:
 *
 *     /** @type {import("../engine/explainer.types.js").Diagram} *\/
 *     const diagram = { title: "...", elements: [...], steps: [...] };
 *
 * Veja o README ("Contrato dos dados") e o AGENTS.md para a explicação textual.
 * ==========================================================================*/

/**
 * @typedef {"box"|"token"|"label"|"arrow"|"vector"|"matrix"} ElementType
 */

/**
 * @typedef {Object} Element
 * @property {string} id            Identificador único no diagrama.
 * @property {ElementType} [type]   Padrão "box".
 * @property {boolean} [base]       Se true, já nasce visível.
 * @property {string} [group]       Nome de grupo (revelável com "@grupo" / ctx.reveal).
 * @property {string} [className]   Classe CSS extra.
 * @property {number} [x] @property {number} [y]
 * @property {number} [w] @property {number} [h] @property {number} [rx]
 * @property {string|string[]} [label]  Texto (string, linhas, ou string com "\n").
 * @property {string} [fill] @property {string} [stroke]
 * @property {string} [style]       CSS bruto extra (escape hatch genérico; prefira
 *                                  fill/stroke/size/anchor quando cobrirem o caso).
 * @property {boolean} [mono] @property {boolean} [sub]
 * @property {number} [size]        Tamanho de fonte (label).
 * @property {"start"|"middle"|"end"} [anchor]  Alinhamento (label).
 * @property {number} [x1] @property {number} [y1] @property {number} [x2] @property {number} [y2]
 * @property {string} [path]        Caminho SVG (arrow).
 * @property {string} [color]       Cor (arrow/vector/matrix).
 * @property {boolean} [noHead] @property {boolean} [dashed]  Opções de seta.
 * @property {number[]} [values]    Alturas 0..1 (vector).
 * @property {number} [rows] @property {number} [cols] @property {number} [cell]  (matrix)
 */

/**
 * @typedef {Object} Balloon
 * @property {string|{x:number,y:number}} [anchor]  Id do elemento ou ponto no SVG.
 * @property {"top"|"right"|"bottom"|"left"} [placement]
 * @property {string} [text]   HTML do corpo (aceita <span class="xp-term" data-tip>).
 * @property {string} [why]    Bloco "Por que?" (opcional).
 */

/**
 * @typedef {Object} Quiz
 * @property {string} question
 * @property {string[]} options
 * @property {number} answer   Índice da opção correta.
 * @property {string} [explain]
 */

/**
 * @typedef {Object} Ctx  Helpers passados para enter(ctx).
 * @property {(id:string)=>void} show
 * @property {(id:string)=>void} hide
 * @property {(target:string|string[], stagger?:number)=>void} reveal
 * @property {(id:string)=>void} drawArrow
 * @property {(id:string, vals:number[])=>void} setBars
 * @property {(id:string, cells:[number,number,number?][])=>void} lightCells
 * @property {(id:string, x:number, y:number)=>void} moveTo
 * @property {(id:string, on?:boolean)=>void} pulse
 * @property {(id:string)=>SVGGElement|undefined} el
 * @property {(tag:string, attrs?:Object)=>SVGElement} svgEl
 */

/**
 * @typedef {Object} Step
 * @property {string} [title]
 * @property {Balloon} [balloon]
 * @property {Quiz} [quiz]
 * @property {string[]} [show]      Aceita "@grupo".
 * @property {string[]} [hide]
 * @property {string[]} [highlight]
 * @property {string[]} [dim]
 * @property {string[]} [pulse]
 * @property {(ctx:Ctx)=>void} [enter]  Animação sob medida (deve ser idempotente).
 */

/**
 * @typedef {Object} Diagram
 * @property {string} title
 * @property {string} [subtitle]
 * @property {number} [width] @property {number} [height]
 * @property {number} [autoplayMs]
 * @property {Element[]} elements
 * @property {Step[]} steps
 */

export {}; // marca como módulo p/ o editor; não afeta os scripts clássicos
