import { describe, expect, it } from "vitest";
import { compileTimeline } from "@/core/timeline";
import { validateExplainer, r } from "@/schema/explainer";
import { ease, springOut, windowProgress } from "@/core/interpolate";
import { stableRandoms } from "@/core/prng";
import { routeCurve, routeElbow, routeLine } from "@/core/connectors";

const demo = () =>
  validateExplainer({
    slug: "teste",
    title: "Teste",
    category: "Testes",
    elements: [
      { id: "a", kind: "box", label: "A", at: r(100, 100, 200, 100) },
      { id: "b", kind: "box", label: "B", at: r(500, 100, 200, 100) },
      { id: "t1", kind: "token", text: "x", group: "toks", at: r(100, 300, 80, 40) },
      { id: "t2", kind: "token", text: "y", group: "toks", at: r(200, 300, 80, 40) },
      { id: "seta", kind: "connector", from: "a", to: "b", route: "line" },
      { id: "barras", kind: "bars", values: [0.2, 0.4], at: r(100, 400, 120, 100) },
    ],
    scenes: [
      { id: "s1", title: "Um", duration: 4000, add: ["a"] },
      {
        id: "s2",
        title: "Dois",
        duration: 6000,
        add: ["b", { id: "seta", enter: { type: "draw" } }, { id: "@toks", enter: { type: "pop", stagger: 200 } }],
        cues: [
          { at: 1000, duration: 1000, target: "a", do: "move", by: { x: 50, y: 0 } },
          { at: 500, target: "b", do: "highlight" },
          { at: 2000, duration: 800, target: "barras", do: "setBars", values: [1, 0.1] },
          { at: 100, target: "barras", do: "show" },
        ],
      },
      { id: "s3", title: "Três", duration: 4000, remove: ["a"], set: { b: { tone: "hot" } } },
    ],
  });

describe("compileTimeline", () => {
  it("calcula fronteiras absolutas das cenas", () => {
    const tl = compileTimeline(demo(), "wide");
    expect(tl.totalMs).toBe(14000);
    expect(tl.scenes.map((s) => s.startMs)).toEqual([0, 4000, 10000]);
    expect(tl.sceneAt(0)).toBe(0);
    expect(tl.sceneAt(4000)).toBe(1);
    expect(tl.sceneAt(9999)).toBe(1);
    expect(tl.sceneAt(99999)).toBe(2);
  });

  it("acumula visibilidade add/remove entre cenas (ida e volta)", () => {
    const tl = compileTimeline(demo(), "wide");
    expect(tl.getState(3999).elements.get("b")!.visible).toBe(false);
    expect(tl.getState(9000).elements.get("a")!.visible).toBe(true);
    expect(tl.getState(11000).elements.get("a")!.visible).toBe(false);
    // voltar no tempo restaura — nada "vaza"
    expect(tl.getState(9000).elements.get("a")!.visible).toBe(true);
  });

  it("set persiste dali em diante; cues são locais à cena", () => {
    const tl = compileTimeline(demo(), "wide");
    expect(tl.getState(9000).elements.get("b")!.toneOverride).toBeUndefined();
    expect(tl.getState(11000).elements.get("b")!.toneOverride).toBe("hot");
    // cue move na cena 2 desloca "a"…
    const mid = tl.getState(4000 + 2001).elements.get("a")!;
    expect(mid.dx).toBeGreaterThan(49);
    // …mas o efeito não existe na cena 3 (escopo local) — "a" nem está visível
    expect(tl.getState(11000).elements.get("a")!.dx).toBe(0);
  });

  it("getState é determinístico (mesmo t → deepEqual)", () => {
    const tl = compileTimeline(demo(), "wide");
    for (const t of [0, 1234, 4321, 6789, 13999]) {
      const a = tl.getState(t);
      const b = tl.getState(t);
      expect(JSON.parse(JSON.stringify(a))).toEqual(JSON.parse(JSON.stringify(b)));
    }
  });

  it("settleMs cobre o fim de todos os enters da cena (elementos não ficam com opacidade 0 ao pousar direto na cena)", () => {
    const tl = compileTimeline(demo(), "wide");
    const s2 = tl.scenes[1]; // add: b (fade 600), seta (draw default), @toks (pop stagger 200, dur 600)
    // t2 devia ser 600 (fade padrão) e t1 devia ser 200 (delay do 2º token) + 600 = 800
    expect(s2.settleMs).toBeGreaterThanOrEqual(800);
    const atSettle = tl.getState(s2.startMs + s2.settleMs);
    expect(atSettle.elements.get("b")!.opacity).toBeCloseTo(1, 5);
    expect(atSettle.elements.get("t2")!.opacity).toBeCloseTo(1, 5);
  });

  it("stagger de grupo escalona os enters", () => {
    const tl = compileTimeline(demo(), "wide");
    const s = tl.scenes[1];
    expect(s.enters.get("t1")!.delay).toBe(0);
    expect(s.enters.get("t2")!.delay).toBe(200);
  });

  it("cue show revela só na cena; setBars interpola", () => {
    const tl = compileTimeline(demo(), "wide");
    expect(tl.getState(2000).elements.get("barras")!.visible).toBe(false);
    const inScene = tl.getState(4000 + 3000).elements.get("barras")!;
    expect(inScene.visible).toBe(true);
    expect(inScene.values![0]).toBeGreaterThan(0.2);
    expect(tl.getState(11000).elements.get("barras")!.visible).toBe(false);
  });

  it("highlight ativa dim automático no resto do palco", () => {
    const tl = compileTimeline(demo(), "wide");
    const st = tl.getState(4000 + 2000);
    expect(st.elements.get("b")!.highlight).toBe(1);
    expect(st.elements.get("a")!.dim).toBeGreaterThan(0);
  });

  it("câmera enquadra o conteúdo visível e anima entre cenas", () => {
    const tl = compileTimeline(demo(), "wide");
    const cam1 = tl.scenes[0].cameraTarget;
    const cam2 = tl.scenes[1].cameraTarget;
    expect(cam1.scale).toBeGreaterThan(cam2.scale); // cena 2 tem mais conteúdo
    const during = tl.getState(4000 + 350).camera;
    expect(during.scale).toBeLessThan(cam1.scale);
    expect(during.scale).toBeGreaterThan(cam2.scale);
  });
});

describe("interpolate/prng/connectors", () => {
  it("easings clampam e springs convergem", () => {
    expect(ease("out", -1)).toBe(0);
    expect(ease("inOut", 2)).toBe(1);
    expect(springOut(1)).toBe(1);
    expect(springOut(0.99)).toBeCloseTo(1, 1);
    expect(windowProgress(5, 10, 100)).toBe(0);
    expect(windowProgress(200, 10, 100)).toBe(1);
  });

  it("prng é estável por chave", () => {
    expect(stableRandoms("k", 3)).toEqual(stableRandoms("k", 3));
    expect(stableRandoms("k", 3)).not.toEqual(stableRandoms("k2", 3));
  });

  it("conectores têm comprimento e pointAt coerentes", () => {
    const a = { x: 0, y: 0 }, b = { x: 100, y: 0 };
    const line = routeLine(a, b);
    expect(line.length).toBeCloseTo(100, 1);
    expect(line.pointAt(0.5).x).toBeCloseTo(50, 1);
    const elbow = routeElbow({ x: 0, y: 0 }, { x: 100, y: 50 });
    expect(Math.abs(elbow.length - 150)).toBeLessThan(2); // amostragem corta o canto de leve
    const curve = routeCurve(a, b);
    expect(curve.pointAt(1).x).toBeCloseTo(100, 1);
  });
});

describe("validateExplainer", () => {
  it("rejeita referências quebradas", () => {
    expect(() =>
      validateExplainer({
        slug: "x",
        title: "X",
        category: "c",
        elements: [{ id: "a", kind: "box", at: r(0, 0, 10, 10) }],
        scenes: [{ id: "s", title: "s", add: ["fantasma"] }],
      }),
    ).toThrow(/fantasma/);
  });

  it("rejeita quiz com answer fora do intervalo", () => {
    expect(() =>
      validateExplainer({
        slug: "x",
        title: "X",
        category: "c",
        elements: [{ id: "a", kind: "box", at: r(0, 0, 10, 10) }],
        scenes: [
          { id: "s", title: "s", add: ["a"], quiz: { question: "?", options: ["a", "b"], answer: 5, explain: "" } },
        ],
      }),
    ).toThrow(/quiz/);
  });
});
