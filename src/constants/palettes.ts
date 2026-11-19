/** 参考サイトの配色を収録したペイント用パレット */
import { randomVibrantColor } from '../math/colors';

export type PaintColorCount = 2 | 3 | 4 | 5;

export type ColorPalette = {
  id: string;
  name: string;
  colors: string[];
};

/** 2色 — https://www.webcoach.jp/media/web-design/11335/ */
export const PALETTES_2: ColorPalette[] = [
  { id: '2-bw', name: 'ブラック × ホワイト', colors: ['#000000', '#FFFFFF'] },
  { id: '2-navy-beige', name: 'ネイビー × ベージュ', colors: ['#000080', '#F5F5DC'] },
  { id: '2-charcoal-ivory', name: 'チャコール × アイボリー', colors: ['#36454F', '#FFFFF0'] },
  { id: '2-coral-cream', name: 'コーラル × クリーム', colors: ['#F88379', '#FFFDD0'] },
  { id: '2-pink-mint', name: 'ベビーピンク × ミント', colors: ['#F4BCD7', '#A6ECD0'] },
  { id: '2-lavender-gray', name: 'ラベンダー × グレー', colors: ['#CAB8D9', '#D3D3D3'] },
  { id: '2-black-red', name: 'ブラック × レッド', colors: ['#000000', '#FF0000'] },
  { id: '2-green-gold', name: 'ダークグリーン × ゴールド', colors: ['#006400', '#FFD700'] },
  { id: '2-purple-silver', name: 'パープル × シルバー', colors: ['#800080', '#C0C0C0'] },
  { id: '2-yellow-black', name: 'イエロー × ブラック', colors: ['#FFFF00', '#000000'] },
  { id: '2-orange-blue', name: 'オレンジ × ブルー', colors: ['#FFA500', '#0000FF'] },
  { id: '2-magenta-cyan', name: 'マゼンタ × シアン', colors: ['#FF00FF', '#00FFFF'] },
  { id: '2-corp-blue', name: 'コーポレートブルー × 白', colors: ['#005BAC', '#FFFFFF'] },
  { id: '2-orange-white', name: 'オレンジ × ホワイト', colors: ['#FFA500', '#FFFFFF'] },
  { id: '2-dusty-brown', name: 'くすみピンク × ブラウン', colors: ['#D8AAB7', '#8B4513'] },
  { id: '2-red-gold', name: 'レッド × ゴールド', colors: ['#FF0000', '#FFD700'] },
  { id: '2-organic', name: 'グリーン × ベージュ', colors: ['#228B22', '#F5F5DC'] },
  { id: '2-sale', name: 'レッド × イエロー', colors: ['#FF0000', '#FFFF00'] },
  { id: '2-muji', name: 'ホワイト × ベージュ', colors: ['#FFFFFF', '#F5F5DC'] },
  { id: '2-navy-white', name: 'ダークブルー × ホワイト', colors: ['#00008B', '#FFFFFF'] },
  { id: '2-gold-ivory', name: 'ゴールド × アイボリー', colors: ['#FFD700', '#FFFFF0'] },
];

/** 3色 — https://paletadecolores.org/ja/3-color-palettes.html */
export const PALETTES_3: ColorPalette[] = [
  { id: '3-dusty', name: 'くすみピンク×グレージュ', colors: ['#F4EDE8', '#D8A7A7', '#8C7F78'] },
  { id: '3-navy-gold', name: 'ネイビー×白×ゴールド', colors: ['#1D2A44', '#F7F5F0', '#C9A227'] },
  { id: '3-mint', name: 'ミント×白×グレー', colors: ['#FFFFFF', '#A8DCC9', '#5E6B6B'] },
  { id: '3-terra', name: 'テラコッタ×ベージュ×オリーブ', colors: ['#C8693E', '#EADBC8', '#6B7A3A'] },
  { id: '3-contrast', name: '黒×白×レッド', colors: ['#111111', '#FFFFFF', '#D62828'] },
  { id: '3-lavender', name: 'ラベンダー×クリーム×ネイビー', colors: ['#C8B8E2', '#FFF8E7', '#2E3A5E'] },
  { id: '3-pastel', name: 'パステル3色', colors: ['#F9C5D1', '#BFE3F2', '#FBE7A1'] },
  { id: '3-mono', name: 'モノトーン', colors: ['#1C1C1E', '#8E8E93', '#F2F2F7'] },
  { id: '3-sage', name: 'セージ×白×木の茶色', colors: ['#A9BA9D', '#FAFAF7', '#8B6B4A'] },
  { id: '3-wine', name: 'ワイン×ベージュ×黒', colors: ['#6D1A2E', '#E8D8C4', '#1A1A1A'] },
  { id: '3-blue-beige', name: 'くすみブルー×ベージュ×白', colors: ['#8EA4BD', '#E3D5C3', '#FFFFFF'] },
  { id: '3-brown', name: 'ブラウン×キャメル×アイボリー', colors: ['#4A3428', '#C19A6B', '#FFFFF0'] },
  { id: '3-vivid', name: 'ビビッド3原色', colors: ['#E4007C', '#00A0E9', '#FFE100'] },
  { id: '3-tropical', name: 'ティール×コーラル×クリーム', colors: ['#1B7A7A', '#F4A28C', '#FFF6E8'] },
];

/**
 * 4色 — Canva「100の色の組み合わせ」系
 * https://www.canva.com/ja_jp/learn/100-color-combinations/
 */
export const PALETTES_4: ColorPalette[] = [
  { id: '4-fresh', name: '新鮮＆鮮明', colors: ['#F98866', '#FF420E', '#80BD9E', '#89DA59'] },
  { id: '4-cool-blue', name: 'クールブルー', colors: ['#B8D1E0', '#85AED0', '#4B6D90', '#192740'] },
  { id: '4-outdoor', name: 'アウトドア＆自然', colors: ['#2E5E4E', '#7CB342', '#C5E1A5', '#8D6E63'] },
  { id: '4-autumn', name: 'バーモントの秋', colors: ['#B71C1C', '#1B5E20', '#E65100', '#F9A825'] },
  { id: '4-day-night', name: '昼と夜', colors: ['#0D1B2A', '#1B3A4B', '#F77F00', '#FCBF49'] },
  { id: '4-citrus', name: '柑橘系', colors: ['#F77F00', '#FCBF49', '#6A994E', '#A7C957'] },
  { id: '4-tropical', name: '鮮明＆トロピカル', colors: ['#FF2E63', '#FF6B9D', '#F9C74F', '#90BE6D'] },
  { id: '4-berry', name: 'ベリー', colors: ['#4A1942', '#E63946', '#B5E48C', '#52B69A'] },
  { id: '4-nautical', name: '色褪せない航海', colors: ['#003049', '#0077B6', '#F8F1E3', '#D62828'] },
  { id: '4-modern', name: 'モダン＆新鮮', colors: ['#1B4332', '#FFFFFF', '#40916C', '#95D5B2'] },
  { id: '4-pastel', name: 'パステル', colors: ['#A8DADC', '#F4A261', '#E9C46A', '#E76F51'] },
  { id: '4-jewel', name: '宝石のような色調', colors: ['#5A189A', '#E63946', '#F4D35E', '#E76F51'] },
  { id: '4-spa', name: '穏やか＆温泉', colors: ['#CAD2C5', '#D8F3DC', '#A0C4FF', '#FFAFCC'] },
  { id: '4-retro', name: 'スタイリッシュ＆レトロ', colors: ['#4CC9F0', '#F72585', '#4361EE', '#B8C0FF'] },
];

/**
 * 5色 — https://shikisai101.com/color-scheme/colors/5/ のテイストを参考
 */
export const PALETTES_5: ColorPalette[] = [
  { id: '5-natural', name: 'ナチュラル（タイルと麻）', colors: ['#E8DFD0', '#C4B7A6', '#8B7355', '#5C4033', '#2F2A25'] },
  { id: '5-classic', name: 'クラシック・ゴージャス', colors: ['#1A1A2E', '#4A1942', '#C9A227', '#F5F0E6', '#8B0000'] },
  { id: '5-marine', name: '海辺のウッドデッキ', colors: ['#E8F1F5', '#7EB6D9', '#1B4F72', '#D4A373', '#FAF3E8'] },
  { id: '5-cafe', name: '木のカフェとミント', colors: ['#D4A373', '#FAEDCD', '#CCD5AE', '#E9EDC9', '#FEFAE0'] },
  { id: '5-neon', name: 'ネオンの夜の街', colors: ['#0F0E17', '#FF2E63', '#08D9D6', '#EAEAEA', '#7F5AF0'] },
  { id: '5-coral-navy', name: 'コーラルとネイビー', colors: ['#003049', '#D62828', '#F77F00', '#EAE2B7', '#FCBF49'] },
  { id: '5-blue-grad', name: '青のグラデーション', colors: ['#03045E', '#0077B6', '#00B4D8', '#90E0EF', '#CAF0F8'] },
  { id: '5-pastel-box', name: 'パステルの立方体', colors: ['#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF'] },
  { id: '5-spring', name: '春の庭', colors: ['#F72585', '#B5179E', '#7209B7', '#4CC9F0', '#80ED99'] },
  { id: '5-sunset', name: '春の夕焼け', colors: ['#FF6B6B', '#FFA07A', '#FFD93D', '#6BCB77', '#4D96FF'] },
  { id: '5-toy', name: 'おもちゃ箱', colors: ['#EF476F', '#FFD166', '#06D6A0', '#118AB2', '#073B4C'] },
  { id: '5-latte', name: 'カフェラテの層', colors: ['#3E2723', '#5D4037', '#8D6E63', '#D7CCC8', '#EFEBE9'] },
  { id: '5-field', name: '夏の終わりの畑', colors: ['#606C38', '#283618', '#FEFAE0', '#DDA15E', '#BC6C25'] },
  { id: '5-stripe', name: '青と白のストライプ', colors: ['#03045E', '#023E8A', '#0077B6', '#ADE8F4', '#FFFFFF'] },
];

export const PALETTES_BY_COUNT: Record<PaintColorCount, ColorPalette[]> = {
  2: PALETTES_2,
  3: PALETTES_3,
  4: PALETTES_4,
  5: PALETTES_5,
};

/** 指定色数のランダムパレットを生成 */
export function createRandomPalette(count: PaintColorCount): ColorPalette {
  const colors: string[] = [];
  for (let i = 0; i < count; i += 1) {
    colors.push(randomVibrantColor());
  }
  return {
    id: `random-${count}-${Date.now()}`,
    name: `Random (${count})`,
    colors,
  };
}

/**
 * パレット色を領域に割り当てる。
 * - 隣接領域はできるだけ違う色
 * - パレット内の色をできるだけ均等に使う（3色以上が2色に潰れない）
 */
export function colorRegionsWithPalette(
  signatures: string[],
  palette: string[],
): Map<string, string> {
  const colors = palette.filter(Boolean);
  if (colors.length === 0) return new Map();

  const adj = new Map<string, Set<string>>();
  for (const s of signatures) adj.set(s, new Set());

  for (let i = 0; i < signatures.length; i += 1) {
    for (let j = i + 1; j < signatures.length; j += 1) {
      const a = signatures[i];
      const b = signatures[j];
      if (areAdjacentSignatures(a, b)) {
        adj.get(a)!.add(b);
        adj.get(b)!.add(a);
      }
    }
  }

  const order = [...signatures].sort(
    (a, b) => (adj.get(b)?.size ?? 0) - (adj.get(a)?.size ?? 0),
  );

  const assigned = new Map<string, string>();
  const usage = new Map<string, number>();
  for (const c of colors) usage.set(c, 0);

  for (const sig of order) {
    const forbidden = new Set<string>();
    for (const n of adj.get(sig) ?? []) {
      const c = assigned.get(n);
      if (c) forbidden.add(c);
    }

    const allowed = colors.filter((c) => !forbidden.has(c));
    const pool = allowed.length > 0 ? allowed : colors;

    // 使用回数が少ない色を優先（同点ならランダム）
    let best = pool[0];
    let bestScore = Infinity;
    for (const c of pool) {
      const score = usage.get(c) ?? 0;
      if (
        score < bestScore ||
        (score === bestScore && Math.random() < 0.5)
      ) {
        best = c;
        bestScore = score;
      }
    }

    assigned.set(sig, best);
    usage.set(best, (usage.get(best) ?? 0) + 1);
  }

  return assigned;
}

/** id:bit|id:bit 形式で、ちょうど1関数ぶん符号が違うとき隣接 */
function areAdjacentSignatures(a: string, b: string): boolean {
  const mapA = Object.fromEntries(
    a.split('|').filter(Boolean).map((p) => p.split(':')),
  );
  const mapB = Object.fromEntries(
    b.split('|').filter(Boolean).map((p) => p.split(':')),
  );
  const ids = Object.keys(mapA);
  if (ids.length !== Object.keys(mapB).length) return false;
  let diff = 0;
  for (const id of ids) {
    if (mapB[id] == null) return false;
    if (mapA[id] !== mapB[id]) diff += 1;
  }
  return diff === 1;
}
