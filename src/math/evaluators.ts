import type { MathFunction, Point } from '../types/functions';
import { tryEvalExpression } from './expression';

/**
 * 陰関数 F(x,y)。領域分割は sign(F)。
 * y = f(x) 系: F = y - f(x)
 * 円・楕円: 内側が負
 */
export function evaluateImplicit(fn: MathFunction, x: number, y: number): number {
  if (fn.kind === 'circle') {
    const { h, k, r } = fn.params;
    return (x - h) ** 2 + (y - k) ** 2 - r ** 2;
  }
  if (fn.kind === 'ellipse') {
    const { h, k, rx, ry } = fn.params;
    return ((x - h) / rx) ** 2 + ((y - k) / ry) ** 2 - 1;
  }

  const ys = sampleExplicitY(fn, x);
  if (ys.length === 0 || Number.isNaN(ys[0])) return Number.NaN;
  return y - ys[0];
}

export function signBit(value: number): '0' | '1' {
  if (Number.isNaN(value)) return '0';
  return value >= 0 ? '1' : '0';
}

/**
 * 関数 id 付きの安定シグネチャ（追加・削除しても色を継承しやすい）。
 * 例: "fn_a:0|fn_b:1"
 */
export function regionSignature(
  functions: MathFunction[],
  x: number,
  y: number,
): string {
  return functions
    .filter((f) => f.visible)
    .slice()
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((f) => `${f.id}:${signBit(evaluateImplicit(f, x, y))}`)
    .join('|');
}

function evalPolynomial(coeffs: number[], x: number): number {
  let y = 0;
  let xp = 1;
  for (let i = 0; i < coeffs.length; i += 1) {
    y += coeffs[i] * xp;
    xp *= x;
  }
  return y;
}

/** 明示関数 y = f(x)。円・楕円は上下2値 */
export function sampleExplicitY(fn: MathFunction, x: number): number[] {
  const p = fn.params;

  switch (fn.kind) {
    case 'polynomial': {
      const coeffs = fn.coeffs ?? [0];
      return [evalPolynomial(coeffs, x)];
    }
    case 'proportional':
      return [p.a * x];
    case 'inverse': {
      if (Math.abs(x) < 1e-9) return [];
      return [p.a / x + p.b];
    }
    case 'absolute':
      return [p.a * Math.abs(x - p.h) + p.k];
    case 'rational': {
      const den = p.c * x + p.d;
      if (Math.abs(den) < 1e-9) return [];
      return [(p.a * x + p.b) / den];
    }
    case 'root': {
      const inside = p.b * x + p.c;
      if (inside < 0) return [];
      return [p.a * Math.sqrt(inside) + p.d];
    }
    case 'exp': {
      if (p.b <= 0) return [];
      return [p.a * p.b ** x + p.c];
    }
    case 'log': {
      const arg = x - p.h;
      if (arg <= 0 || p.b <= 0 || Math.abs(p.b - 1) < 1e-9) return [];
      return [p.a * (Math.log(arg) / Math.log(p.b)) + p.k];
    }
    case 'sine':
      return [p.a * Math.sin(p.b * x + p.c) + p.d];
    case 'cosine':
      return [p.a * Math.cos(p.b * x + p.c) + p.d];
    case 'tangent': {
      const t = Math.tan(p.b * x + p.c);
      if (!Number.isFinite(t) || Math.abs(t) > 50) return [];
      return [p.a * t + p.d];
    }
    case 'circle': {
      const dx = x - p.h;
      const under = p.r * p.r - dx * dx;
      if (under < 0) return [];
      const dy = Math.sqrt(under);
      return [p.k + dy, p.k - dy];
    }
    case 'ellipse': {
      const dx = (x - p.h) / p.rx;
      const under = 1 - dx * dx;
      if (under < 0) return [];
      const dy = p.ry * Math.sqrt(under);
      return [p.k + dy, p.k - dy];
    }
    case 'custom': {
      const expr = fn.expression ?? '';
      const y = tryEvalExpression(expr, x);
      if (!Number.isFinite(y)) return [];
      return [y];
    }
    default:
      return [];
  }
}

export function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
