/** 関数の種類 */
export type FunctionKind =
  | 'polynomial'
  | 'proportional'
  | 'inverse'
  | 'absolute'
  | 'rational'
  | 'root'
  | 'exp'
  | 'log'
  | 'circle'
  | 'ellipse'
  | 'sine'
  | 'cosine'
  | 'tangent'
  | 'custom';

export type ParamDef = {
  key: string;
  /** i18n MessageKey。無い場合は key をそのまま表示 */
  labelKey?:
    | 'paramPropA'
    | 'paramHShift'
    | 'paramKShift'
    | 'paramBaseB'
    | 'paramBaseBLog'
    | 'paramCenterX'
    | 'paramCenterY'
    | 'paramRadius'
    | 'paramRx'
    | 'paramRy'
    | 'paramAmplitude'
    | 'paramFrequency'
    | 'paramPhase'
    | 'paramVShift';
  label?: string;
  min: number;
  max: number;
  step: number;
};

export type MathFunction = {
  id: string;
  kind: FunctionKind;
  /** スライダー用の数値パラメータ */
  params: Record<string, number>;
  /** n次多項式の係数: coeffs[i] は x^i の係数 */
  coeffs?: number[];
  /** 自由入力式（custom）。例: sin(x)+x^2, abs(x)*cos(x) */
  expression?: string;
  strokeColor: string;
  strokeWidth: number;
  visible: boolean;
};

export type Region = {
  id: string;
  signature: string;
  color: string;
  polygons: Point[][];
  cellCount: number;
};

export type Point = { x: number; y: number };

export type ViewBounds = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

export const FUNCTION_KIND_KEYS: Record<
  FunctionKind,
  | 'kindPolynomial'
  | 'kindProportional'
  | 'kindInverse'
  | 'kindAbsolute'
  | 'kindRational'
  | 'kindRoot'
  | 'kindExp'
  | 'kindLog'
  | 'kindCircle'
  | 'kindEllipse'
  | 'kindSine'
  | 'kindCosine'
  | 'kindTangent'
  | 'kindCustom'
> = {
  polynomial: 'kindPolynomial',
  proportional: 'kindProportional',
  inverse: 'kindInverse',
  absolute: 'kindAbsolute',
  rational: 'kindRational',
  root: 'kindRoot',
  exp: 'kindExp',
  log: 'kindLog',
  circle: 'kindCircle',
  ellipse: 'kindEllipse',
  sine: 'kindSine',
  cosine: 'kindCosine',
  tangent: 'kindTangent',
  custom: 'kindCustom',
};

/** @deprecated 表示は FUNCTION_KIND_KEYS + i18n を使う */
export const FUNCTION_KIND_LABELS: Record<FunctionKind, string> = {
  polynomial: 'n次関数（多項式）',
  proportional: '比例 y = ax',
  inverse: '反比例 y = a/x + b',
  absolute: '絶対値 y = a|x−h| + k',
  rational: '有理関数 y = (ax+b)/(cx+d)',
  root: '無理関数 y = a√(bx+c) + d',
  exp: '指数関数 y = a·b^x + c',
  log: '対数関数 y = a·log_b(x−h) + k',
  circle: '円 (x−h)²+(y−k)²=r²',
  ellipse: '楕円',
  sine: '正弦 y = a·sin(bx+c)+d',
  cosine: '余弦 y = a·cos(bx+c)+d',
  tangent: '正接 y = a·tan(bx+c)+d',
  custom: '自由入力（数式）',
};

export const PARAM_LABELS: Record<FunctionKind, ParamDef[]> = {
  polynomial: [],
  proportional: [{ key: 'a', labelKey: 'paramPropA', min: -5, max: 5, step: 0.1 }],
  inverse: [
    { key: 'a', label: 'a', min: -10, max: 10, step: 0.1 },
    { key: 'b', label: 'b', min: -10, max: 10, step: 0.1 },
  ],
  absolute: [
    { key: 'a', label: 'a', min: -5, max: 5, step: 0.1 },
    { key: 'h', labelKey: 'paramHShift', min: -8, max: 8, step: 0.1 },
    { key: 'k', labelKey: 'paramKShift', min: -8, max: 8, step: 0.1 },
  ],
  rational: [
    { key: 'a', label: 'a', min: -5, max: 5, step: 0.1 },
    { key: 'b', label: 'b', min: -5, max: 5, step: 0.1 },
    { key: 'c', label: 'c', min: -5, max: 5, step: 0.1 },
    { key: 'd', label: 'd', min: -5, max: 5, step: 0.1 },
  ],
  root: [
    { key: 'a', label: 'a', min: -5, max: 5, step: 0.1 },
    { key: 'b', label: 'b', min: -3, max: 3, step: 0.1 },
    { key: 'c', label: 'c', min: -10, max: 10, step: 0.1 },
    { key: 'd', label: 'd', min: -5, max: 5, step: 0.1 },
  ],
  exp: [
    { key: 'a', label: 'a', min: -5, max: 5, step: 0.1 },
    { key: 'b', labelKey: 'paramBaseB', min: 0.1, max: 5, step: 0.1 },
    { key: 'c', label: 'c', min: -5, max: 5, step: 0.1 },
  ],
  log: [
    { key: 'a', label: 'a', min: -5, max: 5, step: 0.1 },
    { key: 'b', labelKey: 'paramBaseBLog', min: 0.2, max: 10, step: 0.1 },
    { key: 'h', label: 'h', min: -8, max: 8, step: 0.1 },
    { key: 'k', label: 'k', min: -8, max: 8, step: 0.1 },
  ],
  circle: [
    { key: 'h', labelKey: 'paramCenterX', min: -8, max: 8, step: 0.1 },
    { key: 'k', labelKey: 'paramCenterY', min: -8, max: 8, step: 0.1 },
    { key: 'r', labelKey: 'paramRadius', min: 0.5, max: 8, step: 0.1 },
  ],
  ellipse: [
    { key: 'h', labelKey: 'paramCenterX', min: -8, max: 8, step: 0.1 },
    { key: 'k', labelKey: 'paramCenterY', min: -8, max: 8, step: 0.1 },
    { key: 'rx', labelKey: 'paramRx', min: 0.5, max: 8, step: 0.1 },
    { key: 'ry', labelKey: 'paramRy', min: 0.5, max: 8, step: 0.1 },
  ],
  sine: [
    { key: 'a', labelKey: 'paramAmplitude', min: -5, max: 5, step: 0.1 },
    { key: 'b', labelKey: 'paramFrequency', min: -3, max: 3, step: 0.1 },
    { key: 'c', labelKey: 'paramPhase', min: -Math.PI, max: Math.PI, step: 0.1 },
    { key: 'd', labelKey: 'paramVShift', min: -5, max: 5, step: 0.1 },
  ],
  cosine: [
    { key: 'a', labelKey: 'paramAmplitude', min: -5, max: 5, step: 0.1 },
    { key: 'b', labelKey: 'paramFrequency', min: -3, max: 3, step: 0.1 },
    { key: 'c', labelKey: 'paramPhase', min: -Math.PI, max: Math.PI, step: 0.1 },
    { key: 'd', labelKey: 'paramVShift', min: -5, max: 5, step: 0.1 },
  ],
  tangent: [
    { key: 'a', labelKey: 'paramAmplitude', min: -5, max: 5, step: 0.1 },
    { key: 'b', labelKey: 'paramFrequency', min: -3, max: 3, step: 0.1 },
    { key: 'c', labelKey: 'paramPhase', min: -Math.PI, max: Math.PI, step: 0.1 },
    { key: 'd', labelKey: 'paramVShift', min: -5, max: 5, step: 0.1 },
  ],
  custom: [],
};

/** ピッカー表示順 */
export const FUNCTION_KIND_ORDER: FunctionKind[] = [
  'polynomial',
  'proportional',
  'inverse',
  'absolute',
  'rational',
  'root',
  'exp',
  'log',
  'sine',
  'cosine',
  'tangent',
  'circle',
  'ellipse',
  'custom',
];
