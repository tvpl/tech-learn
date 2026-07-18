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
 * @property {string} [deep]   HTML de aprofundamento (exemplos, listas, comparações
 *                              "evite/prefira"); some botão "🔎 Saiba mais" que abre
 *                              um painel modal. Use as classes .xp-example/.xp-good/
 *                              .xp-bad para reaproveitar o visual do motor.
 * @property {string} [deepTitle]  Título do painel (padrão: title da cena).
 */

/**
 * @typedef {Object} Quiz
 * @property {string} question
 * @property {string[]} options
 * @property {number} answer   Índice da opção correta.
 * @property {string} [explain]
 */

/**
 * @typedef {Object} Exercise  Atividade interativa em step.exercises[].
 * @property {"choice"|"fill"|"match"|"order"|"flashcards"} kind  Tipo do exercício.
 * @property {string} [prompt]   Enunciado (ou use "question" no kind "choice").
 * @property {string} [question] Enunciado do kind "choice".
 * @property {string} [explain]  Feedback mostrado ao concluir (não em flashcards).
 * -- choice: múltipla escolha
 * @property {string[]} [options]  choice: alternativas; fill: chips opcionais.
 * @property {number} [answer]     choice: índice correto.  (Em "fill"/"order" é outra coisa, ver abaixo.)
 * -- fill: complete a lacuna. `sentence` deve conter "___".
 * @property {string} [sentence]   fill: frase com "___" na lacuna.
 * @property {string|string[]} [accept]  fill: respostas alternativas aceitas.
 * -- match: ligar pares.  order: ordenar palavras.  flashcards: cartões.
 * @property {[string,string][]} [pairs]  match: pares [esquerda, direita].
 * @property {string[]} [words]    order: banco de palavras embaralhado (opcional; padrão = shuffle de answer).
 * @property {{front:string,back:string}[]} [cards]  flashcards: frente/verso (HTML).
 */

/**
 * @typedef {Object} Material  Anexo de referência (diagram.materials[]).
 * @property {string} id
 * @property {string} label   Rótulo no botão/menu.
 * @property {string} [icon]  Emoji (padrão 📄).
 * @property {string} html    HTML do conteúdo (abre no painel "Saiba mais").
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
 * @property {Exercise[]} [exercises]  Atividades interativas (choice/fill/match/order/flashcards).
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
 * @property {Material[]} [materials]  Anexos de referência (botão 📎 no cabeçalho).
 * @property {Element[]} elements
 * @property {Step[]} steps
 */

export {}; // marca como módulo p/ o editor; não afeta os scripts clássicos
