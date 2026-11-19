import { DEFAULT_REGION_COLOR } from '../constants/defaults';

export type PaintColorMap = Record<string, string>;

/** 永続カラーマップから色を取得（関数増減時は親/子シグネチャから継承） */
export function lookupPaintColor(
  signature: string,
  map: PaintColorMap,
): string {
  if (!signature) return DEFAULT_REGION_COLOR;
  if (map[signature]) return map[signature];

  const parts = signature.split('|').filter(Boolean);

  // 関数追加: 1パート除いた親を探す
  for (let i = 0; i < parts.length; i += 1) {
    const parent = [...parts.slice(0, i), ...parts.slice(i + 1)].join('|');
    if (parent && map[parent]) return map[parent];
  }

  // 関数削除: 新シグネチャの全パートを含む古いキーを探す
  for (const [key, color] of Object.entries(map)) {
    if (color === DEFAULT_REGION_COLOR) continue;
    const keyParts = key.split('|').filter(Boolean);
    if (keyParts.length <= parts.length) continue;
    if (parts.every((p) => keyParts.includes(p))) return color;
    // 同じ id のビットが一致するものが多ければ採用
    const keyMap = Object.fromEntries(keyParts.map((p) => p.split(':')));
    let match = 0;
    let total = 0;
    for (const p of parts) {
      const [id, bit] = p.split(':');
      total += 1;
      if (keyMap[id] === bit) match += 1;
    }
    if (total > 0 && match === total) return color;
  }

  return DEFAULT_REGION_COLOR;
}

export function mergePaintColors(
  map: PaintColorMap,
  updates: PaintColorMap,
): PaintColorMap {
  return { ...map, ...updates };
}

export function isPaintedColor(color: string): boolean {
  return color.toUpperCase() !== DEFAULT_REGION_COLOR.toUpperCase();
}
