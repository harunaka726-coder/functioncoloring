/**
 * 簡易数式パーサ / 評価器。
 * 対応: + - * / ^, 括弧, x, pi, e,
 *       sin cos tan abs sqrt log ln log10,
 *       暗黙の乗算（2x, )(, xsin は非対応だが 2*x, sin(x) はOK）
 *
 * 組み合わせ例: sin(x)+x^2, abs(x)*cos(x), (x^2-1)/(x-1)
 */

type Token =
  | { type: 'num'; value: number }
  | { type: 'id'; value: string }
  | { type: 'op'; value: string }
  | { type: 'lparen' }
  | { type: 'rparen' }
  | { type: 'comma' };

const FUNCTIONS = new Set([
  'sin',
  'cos',
  'tan',
  'abs',
  'sqrt',
  'log',
  'ln',
  'log10',
  'exp',
]);

export type CompiledExpression = (x: number) => number;

export function compileExpression(source: string): {
  ok: true;
  eval: CompiledExpression;
} | { ok: false; error: string } {
  try {
    const tokens = tokenize(source);
    if (tokens.length === 0) {
      return { ok: false, error: '式が空です' };
    }
    let pos = 0;

    const peek = () => tokens[pos];
    const consume = () => tokens[pos++];

    const parseExpression = (): CompiledExpression => parseAdd();

    const parseAdd = (): CompiledExpression => {
      let left = parseMul();
      while (true) {
        const t = peek();
        if (!(t?.type === 'op' && (t.value === '+' || t.value === '-'))) break;
        const op = consume() as Extract<Token, { type: 'op' }>;
        const right = parseMul();
        const L = left;
        left =
          op.value === '+'
            ? (x) => L(x) + right(x)
            : (x) => L(x) - right(x);
      }
      return left;
    };

    const parseMul = (): CompiledExpression => {
      let left = parsePow();
      while (true) {
        const t = peek();
        if (!(t?.type === 'op' && (t.value === '*' || t.value === '/'))) break;
        const op = consume() as Extract<Token, { type: 'op' }>;
        const right = parsePow();
        const L = left;
        left =
          op.value === '*'
            ? (x) => L(x) * right(x)
            : (x) => {
                const d = right(x);
                return Math.abs(d) < 1e-12 ? NaN : L(x) / d;
              };
      }
      return left;
    };

    const parsePow = (): CompiledExpression => {
      const base = parseUnary();
      const t = peek();
      if (t?.type === 'op' && t.value === '^') {
        consume();
        const exp = parsePow(); // 右結合
        return (x) => base(x) ** exp(x);
      }
      return base;
    };

    const parseUnary = (): CompiledExpression => {
      const t = peek();
      if (t?.type === 'op' && t.value === '+') {
        consume();
        return parseUnary();
      }
      if (t?.type === 'op' && t.value === '-') {
        consume();
        const inner = parseUnary();
        return (x) => -inner(x);
      }
      return parsePrimary();
    };

    const parsePrimary = (): CompiledExpression => {
      const t = peek();
      if (!t) throw new Error('式が途中で終わっています');

      if (t.type === 'num') {
        consume();
        const v = t.value;
        return () => v;
      }

      if (t.type === 'id') {
        consume();
        const name = t.value.toLowerCase();

        if (name === 'x') return (x) => x;
        if (name === 'pi') return () => Math.PI;
        if (name === 'e') return () => Math.E;

        if (FUNCTIONS.has(name)) {
          if (peek()?.type !== 'lparen') {
            throw new Error(`${name} の後に ( が必要です`);
          }
          consume();
          const arg = parseExpression();
          if (peek()?.type !== 'rparen') throw new Error(') が不足しています');
          consume();
          return (x) => applyFn(name, arg(x));
        }

        throw new Error(`未知の識別子: ${t.value}`);
      }

      if (t.type === 'lparen') {
        consume();
        const inner = parseExpression();
        if (peek()?.type !== 'rparen') throw new Error(') が不足しています');
        consume();
        return inner;
      }

      throw new Error(`予期しないトークンです`);
    };

    const fn = parseExpression();
    if (pos < tokens.length) throw new Error('式の末尾に余分な文字があります');

    // 動作確認
    const test = fn(0);
    if (typeof test !== 'number') throw new Error('評価に失敗しました');

    return { ok: true, eval: fn };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : '式の解析に失敗しました',
    };
  }
}

function applyFn(name: string, v: number): number {
  switch (name) {
    case 'sin':
      return Math.sin(v);
    case 'cos':
      return Math.cos(v);
    case 'tan':
      return Math.tan(v);
    case 'abs':
      return Math.abs(v);
    case 'sqrt':
      return v < 0 ? NaN : Math.sqrt(v);
    case 'ln':
    case 'log':
      return v <= 0 ? NaN : Math.log(v);
    case 'log10':
      return v <= 0 ? NaN : Math.log10(v);
    case 'exp':
      return Math.exp(v);
    default:
      return NaN;
  }
}

function tokenize(source: string): Token[] {
  const s = source.replace(/\s+/g, '');
  const tokens: Token[] = [];
  let i = 0;

  while (i < s.length) {
    const ch = s[i];

    if (/[0-9.]/.test(ch)) {
      let j = i + 1;
      while (j < s.length && /[0-9.]/.test(s[j])) j += 1;
      const num = Number(s.slice(i, j));
      if (Number.isNaN(num)) throw new Error(`不正な数値: ${s.slice(i, j)}`);
      tokens.push({ type: 'num', value: num });
      i = j;
      continue;
    }

    if (/[a-zA-Z_]/.test(ch)) {
      let j = i + 1;
      while (j < s.length && /[a-zA-Z0-9_]/.test(s[j])) j += 1;
      tokens.push({ type: 'id', value: s.slice(i, j) });
      i = j;
      continue;
    }

    if ('+-*/^'.includes(ch)) {
      tokens.push({ type: 'op', value: ch });
      i += 1;
      continue;
    }

    if (ch === '(') {
      tokens.push({ type: 'lparen' });
      i += 1;
      continue;
    }
    if (ch === ')') {
      tokens.push({ type: 'rparen' });
      i += 1;
      continue;
    }
    if (ch === ',') {
      tokens.push({ type: 'comma' });
      i += 1;
      continue;
    }

    throw new Error(`使えない文字: ${ch}`);
  }

  return tokens;
}

export function tryEvalExpression(source: string, x: number): number {
  const compiled = compileExpression(source);
  if (!compiled.ok) return NaN;
  try {
    return compiled.eval(x);
  } catch {
    return NaN;
  }
}
