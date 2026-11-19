import { CURVE_SAMPLE_COUNT } from '../constants/defaults';
import type { MathFunction, Point, ViewBounds } from '../types/functions';
import { sampleExplicitY } from './evaluators';

export type CurvePath = {
  functionId: string;
  polylines: Point[][];
};

export function sampleCurve(
  fn: MathFunction,
  bounds: ViewBounds,
  samples = CURVE_SAMPLE_COUNT,
): CurvePath {
  if (fn.kind === 'circle') {
    return sampleCircleParametric(fn, samples);
  }
  if (fn.kind === 'ellipse') {
    return sampleEllipseParametric(fn, samples);
  }

  const polylines: Point[][] = [];
  let current: Point[] = [];
  const dx = (bounds.xMax - bounds.xMin) / (samples - 1);
  const pad = (bounds.yMax - bounds.yMin) * 0.15;

  for (let i = 0; i < samples; i += 1) {
    const x = bounds.xMin + i * dx;
    const ys = sampleExplicitY(fn, x);
    const y = ys[0];
    const inView =
      ys.length > 0 &&
      Number.isFinite(y) &&
      y >= bounds.yMin - pad &&
      y <= bounds.yMax + pad;

    if (inView) {
      // 大きなジャンプは漸近線などでセグメントを切る
      if (current.length > 0) {
        const prev = current[current.length - 1];
        if (Math.abs(y - prev.y) > (bounds.yMax - bounds.yMin) * 0.45) {
          if (current.length >= 2) polylines.push(current);
          current = [];
        }
      }
      current.push({ x, y });
    } else if (current.length >= 2) {
      polylines.push(current);
      current = [];
    } else {
      current = [];
    }
  }

  if (current.length >= 2) polylines.push(current);
  return { functionId: fn.id, polylines };
}

function sampleCircleParametric(
  fn: MathFunction,
  samples: number,
): CurvePath {
  const { h, k, r } = fn.params;
  const points: Point[] = [];
  for (let i = 0; i <= samples; i += 1) {
    const theta = (i / samples) * Math.PI * 2;
    points.push({
      x: h + r * Math.cos(theta),
      y: k + r * Math.sin(theta),
    });
  }
  return { functionId: fn.id, polylines: [points] };
}

function sampleEllipseParametric(
  fn: MathFunction,
  samples: number,
): CurvePath {
  const { h, k, rx, ry } = fn.params;
  const points: Point[] = [];
  for (let i = 0; i <= samples; i += 1) {
    const theta = (i / samples) * Math.PI * 2;
    points.push({
      x: h + rx * Math.cos(theta),
      y: k + ry * Math.sin(theta),
    });
  }
  return { functionId: fn.id, polylines: [points] };
}

export function mathToScreen(
  point: Point,
  bounds: ViewBounds,
  width: number,
  height: number,
): Point {
  const sx =
    ((point.x - bounds.xMin) / (bounds.xMax - bounds.xMin)) * width;
  const sy =
    height -
    ((point.y - bounds.yMin) / (bounds.yMax - bounds.yMin)) * height;
  return { x: sx, y: sy };
}

export function pointsToPolyline(
  points: Point[],
  bounds: ViewBounds,
  width: number,
  height: number,
): string {
  return points
    .map((p) => {
      const s = mathToScreen(p, bounds, width, height);
      return `${s.x.toFixed(2)},${s.y.toFixed(2)}`;
    })
    .join(' ');
}
