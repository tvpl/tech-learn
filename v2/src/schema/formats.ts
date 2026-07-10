/**
 * Formatos de saída. O conteúdo é AUTORADO num "mundo" 16:9 (1600×900).
 * Cada formato define um canvas lógico próprio + regiões nomeadas:
 *   - title    → faixa de título/progresso
 *   - stage    → viewport do diagrama (a câmera enquadra o mundo aqui dentro)
 *   - caption  → card fixo de narração (null = balão flutuante ancorado, como na v1)
 * As safe areas do 9:16 (UI do Instagram/TikTok) já estão descontadas das regiões.
 */

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type FormatId = "wide" | "vertical" | "feed";

export interface FormatSpec {
  id: FormatId;
  /** Canvas lógico (coordenadas internas do formato). */
  canvas: { w: number; h: number };
  /** Pixels do arquivo final (Remotion). */
  render: { w: number; h: number };
  fps: number;
  regions: {
    title: Rect;
    stage: Rect;
    caption: Rect | null;
    watermark: Rect;
  };
}

/** Mundo de autoria: todas as posições dos elementos vivem neste espaço. */
export const WORLD = { w: 1600, h: 900 } as const;

export const FORMATS: Record<FormatId, FormatSpec> = {
  wide: {
    id: "wide",
    canvas: { w: 1600, h: 900 },
    render: { w: 1920, h: 1080 },
    fps: 30,
    regions: {
      title: { x: 40, y: 22, w: 1520, h: 62 },
      stage: { x: 0, y: 92, w: 1600, h: 764 },
      caption: null, // balão flutuante ancorado no elemento
      watermark: { x: 1240, y: 858, w: 340, h: 30 },
    },
  },
  vertical: {
    id: "vertical",
    canvas: { w: 900, h: 1600 },
    render: { w: 1080, h: 1920 },
    fps: 30,
    regions: {
      // safe areas: ~185px topo (username/áudio) e ~270px base (legenda/ações)
      title: { x: 44, y: 200, w: 812, h: 120 },
      stage: { x: 20, y: 340, w: 860, h: 680 },
      caption: { x: 44, y: 1044, w: 812, h: 256 },
      watermark: { x: 44, y: 1310, w: 812, h: 26 },
    },
  },
  feed: {
    id: "feed",
    canvas: { w: 1080, h: 1350 },
    render: { w: 1080, h: 1350 },
    fps: 30,
    regions: {
      title: { x: 48, y: 40, w: 984, h: 104 },
      stage: { x: 24, y: 168, w: 1032, h: 850 },
      caption: { x: 48, y: 1042, w: 984, h: 236 },
      watermark: { x: 48, y: 1296, w: 984, h: 26 },
    },
  },
};

export const rectCenter = (r: Rect) => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });

export const rectUnion = (rects: Rect[]): Rect => {
  if (rects.length === 0) return { x: 0, y: 0, w: WORLD.w, h: WORLD.h };
  let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
  for (const r of rects) {
    x1 = Math.min(x1, r.x);
    y1 = Math.min(y1, r.y);
    x2 = Math.max(x2, r.x + r.w);
    y2 = Math.max(y2, r.y + r.h);
  }
  return { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
};
