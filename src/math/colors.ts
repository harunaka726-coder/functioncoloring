import { DEFAULT_REGION_COLOR, REGION_PALETTE } from '../constants/defaults';

/** HSL から鮮やかなランダムカラーを生成 */
export function randomVibrantColor(): string {
  const h = Math.floor(Math.random() * 360);
  const s = 55 + Math.floor(Math.random() * 30);
  const l = 55 + Math.floor(Math.random() * 20);
  return `hsl(${h}, ${s}%, ${l}%)`;
}

export function shuffleRegionColors(count: number): string[] {
  const colors: string[] = [];
  for (let i = 0; i < count; i += 1) {
    if (Math.random() > 0.35) {
      colors.push(REGION_PALETTE[Math.floor(Math.random() * REGION_PALETTE.length)]);
    } else {
      colors.push(randomVibrantColor());
    }
  }
  return colors;
}

/** 新規領域は白（ペイントするまで無色） */
export function colorForSignature(_signature: string, _index: number): string {
  return DEFAULT_REGION_COLOR;
}

/** Excel / PowerPoint 風の標準カラーパレット */
export const PICKER_THEME_COLORS = [
  '#FFFFFF',
  '#000000',
  '#E7E6E6',
  '#44546A',
  '#4472C4',
  '#ED7D31',
  '#A5A5A5',
  '#FFC000',
  '#5B9BD5',
  '#70AD47',
];

export const PICKER_STANDARD_COLORS = [
  '#C00000',
  '#FF0000',
  '#FFC000',
  '#FFFF00',
  '#92D050',
  '#00B050',
  '#00B0F0',
  '#0070C0',
  '#002060',
  '#7030A0',
  '#F4B183',
  '#FFE699',
  '#C6EFCE',
  '#BDD7EE',
  '#D0CECE',
  '#F8CBAD',
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FFEAA7',
  '#DDA0DD',
  '#98D8C8',
  '#F7DC6F',
  '#BB8FCE',
  '#F1948A',
  '#85C1E9',
  '#82E0AA',
  '#F5B041',
  '#AF7AC5',
];
