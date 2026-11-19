import type { PaintColorMap } from '../math/paintColors';
import type { MathFunction, ViewBounds } from './functions';

/** 再編集用にアルバムへ一緒に保存するプロジェクト状態 */
export type AlbumProject = {
  version: 1;
  functions: MathFunction[];
  paintColors: PaintColorMap;
  bounds: ViewBounds;
  showGrid: boolean;
  showAxes: boolean;
  showLabels: boolean;
};
