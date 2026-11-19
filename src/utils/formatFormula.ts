import type { MathFunction } from '../types/functions';

function fmtNum(n: number): string {
  const rounded = Math.abs(n) < 1e-9 ? 0 : Number(n.toFixed(4));
  let s = String(rounded);
  if (/e/i.test(s)) {
    s = rounded.toFixed(4);
  }
  if (s.includes('.')) {
    s = s.replace(/\.?0+$/, '');
  }
  return s;
}

function signed(n: number): string {
  if (Math.abs(n) < 1e-9) return '+0';
  return n < 0 ? `-${fmtNum(Math.abs(n))}` : `+${fmtNum(n)}`;
}

function coefPrefix(a: number): string {
  if (Math.abs(Math.abs(a) - 1) < 1e-9) return a < 0 ? '-' : '';
  return fmtNum(a);
}

function polyTerm(coeff: number, power: number, first: boolean): string | null {
  if (Math.abs(coeff) < 1e-9) return null;
  const abs = Math.abs(coeff);
  const sign = first ? (coeff < 0 ? '-' : '') : coeff < 0 ? '-' : '+';
  if (power === 0) {
    return `${sign}${fmtNum(abs)}`;
  }
  const coefStr = Math.abs(abs - 1) < 1e-9 ? '' : fmtNum(abs);
  const xPart = power === 1 ? 'x' : `x^${power}`;
  return `${sign}${coefStr}${xPart}`;
}

function formatPolynomial(coeffs: number[]): string {
  const parts: string[] = [];
  for (let i = coeffs.length - 1; i >= 0; i--) {
    const term = polyTerm(coeffs[i] ?? 0, i, parts.length === 0);
    if (term != null) parts.push(term);
  }
  return parts.length === 0 ? '0' : parts.join('');
}

function shifted(varName: string, h: number): string {
  if (Math.abs(h) < 1e-9) return varName;
  return h > 0 ? `${varName}-${fmtNum(h)}` : `${varName}+${fmtNum(-h)}`;
}

/** リスト表示用の具体的な数式（例: y=2x^3+x^2-7） */
export function formatFormula(fn: MathFunction): string {
  const p = fn.params;

  switch (fn.kind) {
    case 'polynomial':
      return `y=${formatPolynomial(fn.coeffs ?? [0])}`;

    case 'proportional': {
      const a = p.a ?? 0;
      if (Math.abs(a - 1) < 1e-9) return 'y=x';
      if (Math.abs(a + 1) < 1e-9) return 'y=-x';
      return `y=${fmtNum(a)}x`;
    }

    case 'inverse': {
      const a = p.a ?? 0;
      const b = p.b ?? 0;
      return Math.abs(b) < 1e-9
        ? `y=${fmtNum(a)}/x`
        : `y=${fmtNum(a)}/x${signed(b)}`;
    }

    case 'absolute': {
      const a = p.a ?? 1;
      const h = p.h ?? 0;
      const k = p.k ?? 0;
      let s = `y=${coefPrefix(a)}|${shifted('x', h)}|`;
      if (Math.abs(k) >= 1e-9) s += signed(k);
      return s;
    }

    case 'rational': {
      const a = p.a ?? 0;
      const b = p.b ?? 0;
      const c = p.c ?? 0;
      const d = p.d ?? 0;
      const num =
        Math.abs(a) < 1e-9
          ? fmtNum(b)
          : Math.abs(b) < 1e-9
            ? `${fmtNum(a)}x`
            : `${fmtNum(a)}x${signed(b)}`;
      const den =
        Math.abs(c) < 1e-9
          ? fmtNum(d)
          : Math.abs(d) < 1e-9
            ? `${fmtNum(c)}x`
            : `${fmtNum(c)}x${signed(d)}`;
      return `y=(${num})/(${den})`;
    }

    case 'root': {
      const a = p.a ?? 1;
      const b = p.b ?? 1;
      const c = p.c ?? 0;
      const d = p.d ?? 0;
      let inside = Math.abs(b - 1) < 1e-9 ? 'x' : `${fmtNum(b)}x`;
      if (Math.abs(c) >= 1e-9) inside += signed(c);
      let s = `y=${coefPrefix(a)}√(${inside})`;
      if (Math.abs(d) >= 1e-9) s += signed(d);
      return s;
    }

    case 'exp': {
      const a = p.a ?? 1;
      const b = p.b ?? 2;
      const c = p.c ?? 0;
      let s = `y=${coefPrefix(a)}${fmtNum(b)}^x`;
      if (Math.abs(c) >= 1e-9) s += signed(c);
      return s;
    }

    case 'log': {
      const a = p.a ?? 1;
      const b = p.b ?? 10;
      const h = p.h ?? 0;
      const k = p.k ?? 0;
      let s = `y=${coefPrefix(a)}log_${fmtNum(b)}(${shifted('x', h)})`;
      if (Math.abs(k) >= 1e-9) s += signed(k);
      return s;
    }

    case 'circle': {
      const h = p.h ?? 0;
      const k = p.k ?? 0;
      const r = p.r ?? 1;
      const xp = Math.abs(h) < 1e-9 ? 'x^2' : `(${shifted('x', h)})^2`;
      const yp = Math.abs(k) < 1e-9 ? 'y^2' : `(${shifted('y', k)})^2`;
      return `${xp}+${yp}=${fmtNum(r)}^2`;
    }

    case 'ellipse': {
      const h = p.h ?? 0;
      const k = p.k ?? 0;
      const rx = p.rx ?? 1;
      const ry = p.ry ?? 1;
      const xp = Math.abs(h) < 1e-9 ? 'x^2' : `(${shifted('x', h)})^2`;
      const yp = Math.abs(k) < 1e-9 ? 'y^2' : `(${shifted('y', k)})^2`;
      return `${xp}/${fmtNum(rx)}^2+${yp}/${fmtNum(ry)}^2=1`;
    }

    case 'sine':
    case 'cosine':
    case 'tangent': {
      const name =
        fn.kind === 'sine' ? 'sin' : fn.kind === 'cosine' ? 'cos' : 'tan';
      const a = p.a ?? 1;
      const b = p.b ?? 1;
      const c = p.c ?? 0;
      const d = p.d ?? 0;
      let arg = Math.abs(b - 1) < 1e-9 ? 'x' : `${fmtNum(b)}x`;
      if (Math.abs(c) >= 1e-9) arg += signed(c);
      let s = `y=${coefPrefix(a)}${name}(${arg})`;
      if (Math.abs(d) >= 1e-9) s += signed(d);
      return s;
    }

    case 'custom':
      return `y=${fn.expression?.trim() || '?'}`;

    default:
      return 'y=?';
  }
}
