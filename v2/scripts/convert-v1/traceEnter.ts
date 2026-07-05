import type { RawElement, RawStep, TraceCall, TraceEvent } from "./types";

/**
 * Em vez de fazer parsing estático do `enter(ctx)` (JS arbitrário, com
 * helpers locais como `place()` em busca-binaria.data.js), EXECUTAMOS a
 * função de verdade com um `ctx` que grava cada chamada em vez de mexer no
 * DOM, e um `setTimeout` interceptado que soma delays aninhados — assim
 * capturamos fielmente o efeito de qualquer helper local sem entender seu
 * código-fonte.
 *
 * IMPORTANTE: `step.enter` foi definido via `window.eval(...)` do jsdom (ver
 * loadV1.ts) — um `setTimeout(...)` sem qualificador dentro dele resolve
 * para `window.setTimeout`, não o do processo Node. Por isso recebemos a
 * MESMA `window` usada para carregar o arquivo, e patchamos ela.
 */
export function buildGroups(elements: RawElement[]): Map<string, string[]> {
  const groups = new Map<string, string[]>();
  for (const el of elements) {
    if (el.group) {
      if (!groups.has(el.group)) groups.set(el.group, []);
      groups.get(el.group)!.push(el.id);
    }
  }
  return groups;
}

/**
 * Espelha `reveal()` REAL do engine (engine/explainer.js) — que é diferente
 * de `_ids()` (usado em step.show/hide/highlight/dim/pulse): `reveal(target)`
 * trata `target` como nome de GRUPO SEM PRECISAR do prefixo "@" quando é uma
 * string que bate com um grupo conhecido; senão usa o array literal ou
 * embrulha a string única — nunca expande "@" dentro de um array.
 */
function expandRevealTarget(target: string | string[], groups: Map<string, string[]>): string[] {
  if (typeof target === "string" && groups.has(target)) return groups.get(target)!;
  return Array.isArray(target) ? target : [target];
}

function makeElProxy(id: string, record: (call: TraceCall, target: string, args?: Record<string, unknown>) => void) {
  const target: Record<string, unknown> = {};
  return new Proxy(target, {
    set(t, prop, value) {
      if (prop === "textContent") record("setLabel", id, { text: String(value) });
      else record("UNSUPPORTED_DOM_ACCESS", id, { prop: String(prop), op: "set" });
      t[prop as string] = value;
      return true;
    },
    get(t, prop) {
      // querySelector/addEventListener etc. — acesso genérico não suportado automaticamente.
      if (typeof prop === "string" && !(prop in t)) {
        record("UNSUPPORTED_DOM_ACCESS", id, { prop, op: "get" });
      }
      return t[prop as string];
    },
  });
}

/** Traça um único step: roda `enter(ctx)` de verdade e devolve os eventos capturados. */
/** Formato mínimo que precisamos de uma "window" — deliberadamente frouxo,
 * porque jsdom (DOMWindow) e o Node têm assinaturas de `setTimeout`
 * incompatíveis no nível de tipos (mesmo sendo compatíveis em runtime). */
export interface SetTimeoutHost {
  setTimeout: (cb: (...args: unknown[]) => void, delay?: number, ...args: unknown[]) => unknown;
}

export function traceStep(window: SetTimeoutHost, step: RawStep, groups: Map<string, string[]>): TraceEvent[] {
  if (typeof step.enter !== "function") return [];

  const events: TraceEvent[] = [];
  let currentAt = 0;
  const record = (call: TraceCall, target: string, args?: Record<string, unknown>) => {
    events.push({ at: currentAt, call, target, args });
  };

  const realSetTimeout = window.setTimeout;
  const fakeSetTimeout = (cb: (...a: unknown[]) => void, delay?: number, ...rest: unknown[]) => {
    const prevAt = currentAt;
    currentAt = prevAt + (delay ?? 0);
    try {
      cb(...rest);
    } finally {
      currentAt = prevAt;
    }
    return 0;
  };

  const show = (id: string) => record("show", id);
  const hide = (id: string) => record("hide", id);
  const reveal = (target: string | string[], stagger = 80) => {
    expandRevealTarget(target, groups).forEach((id, k) => fakeSetTimeout(() => show(id), k * stagger));
  };
  const moveTo = (id: string, x: number, y: number) => record("moveTo", id, { x, y });
  const drawArrow = (id: string) => record("drawArrow", id);
  const setBars = (id: string, vals: number[]) => record("setBars", id, { vals: [...vals] });
  const setLabel = (id: string, text: string) => record("setLabel", id, { text });
  const lightCells = (id: string, cells: Array<[number, number, number?]>) =>
    record("lightCells", id, { cells: cells.map((c) => [...c]) });
  const pulse = (id: string, on = true) => {
    if (on) record("pulse", id);
  };
  const el = (id: string) => makeElProxy(id, record);
  const svgEl = () => makeElProxy("__svg__", record);

  const ctx = { show, hide, reveal, moveTo, drawArrow, setBars, setLabel, lightCells, pulse, el, svgEl };

  window.setTimeout = fakeSetTimeout;
  try {
    step.enter(ctx);
  } catch (e) {
    record("UNSUPPORTED_DOM_ACCESS", "__enter__", { error: String(e) });
  } finally {
    window.setTimeout = realSetTimeout;
  }
  return events;
}
