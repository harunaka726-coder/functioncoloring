import type { FunctionKind, MathFunction, ViewBounds } from '../types/functions';
import { createId } from '../utils/id';

export const DEFAULT_BOUNDS: ViewBounds = {
  xMin: -12,
  xMax: 12,
  yMin: -12,
  yMax: 12,
};

/**
 * 領域検出・ペイントの対象ワールド（±110 全域）。
 */
export const PAINT_WORLD_BOUNDS: ViewBounds = {
  xMin: -110,
  xMax: 110,
  yMin: -110,
  yMax: 110,
};

/** パン可能なワールド範囲（中心がこの外に出ない） */
export const WORLD_LIMIT = 120;

/** 未ペイント領域の色 */
export const DEFAULT_REGION_COLOR = '#FFFFFF';

/** ズーム: base 幅に対する倍率の下限・上限 */
export const MIN_ZOOM = 0.08;
export const MAX_ZOOM = 8;

/** ベース解像度（ワールド span に応じて引き上げ） */
/** Higher than native app — large PC canvases need finer region edges. */
export const REGION_GRID_RESOLUTION = 220;
export const CURVE_SAMPLE_COUNT = 180;

export const DEFAULT_STROKE_COLOR = '#0F172A';

export const STROKE_PALETTE = [
  '#0F172A',
  '#1D4ED8',
  '#B91C1C',
  '#047857',
  '#7C2D12',
  '#6D28D9',
  '#0E7490',
  '#C2410C',
  '#BE185D',
];

export const REGION_PALETTE = [
  '#FCA5A5',
  '#FCD34D',
  '#86EFAC',
  '#93C5FD',
  '#C4B5FD',
  '#F9A8D4',
  '#5EEAD4',
  '#FDBA74',
  '#A5B4FC',
  '#FDE68A',
  '#6EE7B7',
  '#FDA4AF',
];

export const DEFAULT_PARAMS: Record<FunctionKind, Record<string, number>> = {
  polynomial: { degree: 2 },
  proportional: { a: 1 },
  inverse: { a: 2, b: 0 },
  absolute: { a: 1, h: 0, k: 0 },
  rational: { a: 1, b: 0, c: 1, d: -1 },
  root: { a: 1, b: 1, c: 0, d: 0 },
  exp: { a: 1, b: 2, c: 0 },
  log: { a: 1, b: 10, h: 0, k: 0 },
  circle: { h: 0, k: 0, r: 4 },
  ellipse: { h: 0, k: 0, rx: 5, ry: 3 },
  sine: { a: 2, b: 1, c: 0, d: 0 },
  cosine: { a: 2, b: 1, c: 0, d: 0 },
  tangent: { a: 1, b: 1, c: 0, d: 0 },
  custom: {},
};

export function defaultCoeffs(degree: number): number[] {
  const d = Math.max(0, Math.min(8, Math.round(degree)));
  const coeffs = new Array<number>(d + 1).fill(0);
  if (d >= 2) {
    coeffs[2] = 0.15;
    coeffs[0] = -3;
  } else if (d === 1) {
    coeffs[1] = 0.5;
    coeffs[0] = -1;
  } else {
    coeffs[0] = 1;
  }
  return coeffs;
}

export function createMathFunction(
  kind: FunctionKind,
  _index = 0,
): MathFunction {
  const base: MathFunction = {
    id: createId(),
    kind,
    params: { ...DEFAULT_PARAMS[kind] },
    strokeColor: DEFAULT_STROKE_COLOR,
    strokeWidth: 1.75,
    visible: true,
  };

  if (kind === 'polynomial') {
    base.coeffs = defaultCoeffs(2);
    base.params = { degree: 2 };
  }
  if (kind === 'custom') {
    base.expression = 'sin(x)+x/5';
  }

  return base;
}

/** 初回デモ用 */
export function createInitialFunctions(): MathFunction[] {
  const circle = createMathFunction('circle');
  const poly = createMathFunction('polynomial');
  poly.coeffs = [ -1, 0.5, 0 ]; // 0.5x - 1 （1次）
  poly.params = { degree: 1 };
  const quad = createMathFunction('polynomial');
  quad.coeffs = [-3, 0, 0.15];
  quad.params = { degree: 2 };
  return [circle, poly, quad];
}
