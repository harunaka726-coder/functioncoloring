import { MAX_ZOOM, MIN_ZOOM, WORLD_LIMIT } from '../constants/defaults';
import type { ViewBounds } from '../types/functions';

/**
 * キャンバスの縦横比に合わせて表示範囲を拡げ、
 * 「数学座標 1 目盛り」が X/Y で同じピクセル長になるようにする。
 */
export function fitBoundsToCanvas(
  base: ViewBounds,
  width: number,
  height: number,
): ViewBounds {
  if (width <= 0 || height <= 0) return base;

  const cx = (base.xMin + base.xMax) / 2;
  const cy = (base.yMin + base.yMax) / 2;
  const baseW = base.xMax - base.xMin;
  const baseH = base.yMax - base.yMin;
  const canvasAspect = width / height;
  const baseAspect = baseW / baseH;

  if (canvasAspect > baseAspect) {
    const newW = baseH * canvasAspect;
    return {
      xMin: cx - newW / 2,
      xMax: cx + newW / 2,
      yMin: base.yMin,
      yMax: base.yMax,
    };
  }

  const newH = baseW / canvasAspect;
  return {
    xMin: base.xMin,
    xMax: base.xMax,
    yMin: cy - newH / 2,
    yMax: cy + newH / 2,
  };
}

export function boundsEqual(a: ViewBounds, b: ViewBounds, eps = 1e-6): boolean {
  return (
    Math.abs(a.xMin - b.xMin) < eps &&
    Math.abs(a.xMax - b.xMax) < eps &&
    Math.abs(a.yMin - b.yMin) < eps &&
    Math.abs(a.yMax - b.yMax) < eps
  );
}

export function panBounds(
  bounds: ViewBounds,
  dxMath: number,
  dyMath: number,
): ViewBounds {
  let next: ViewBounds = {
    xMin: bounds.xMin + dxMath,
    xMax: bounds.xMax + dxMath,
    yMin: bounds.yMin + dyMath,
    yMax: bounds.yMax + dyMath,
  };
  return clampWorld(next);
}

/**
 * 画面上の焦点 (fx, fy) を中心に scale 倍ズーム。
 * scale > 1 で拡大（見える範囲が狭くなる）。
 */
export function zoomBounds(
  bounds: ViewBounds,
  scale: number,
  focusX: number,
  focusY: number,
  baseSpan: number,
): ViewBounds {
  const width = bounds.xMax - bounds.xMin;
  const height = bounds.yMax - bounds.yMin;
  if (!(width > 0) || !(height > 0) || !(baseSpan > 0)) return bounds;
  if (!Number.isFinite(scale) || scale <= 0) return bounds;

  const minSpan = Math.min(width, height);
  if (!(minSpan > 0)) return bounds;

  const currentZoom = baseSpan / minSpan;
  let nextZoom = currentZoom * scale;
  nextZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextZoom));
  const applied = nextZoom / currentZoom;
  if (!Number.isFinite(applied) || applied <= 0) return bounds;

  const newW = width / applied;
  const newH = height / applied;
  const rx = (focusX - bounds.xMin) / width;
  const ry = (focusY - bounds.yMin) / height;
  if (!Number.isFinite(rx) || !Number.isFinite(ry)) return bounds;

  const next: ViewBounds = {
    xMin: focusX - rx * newW,
    xMax: focusX + (1 - rx) * newW,
    yMin: focusY - ry * newH,
    yMax: focusY + (1 - ry) * newH,
  };
  return clampWorld(next);
}

function clampWorld(bounds: ViewBounds): ViewBounds {
  const w = bounds.xMax - bounds.xMin;
  const h = bounds.yMax - bounds.yMin;
  let cx = (bounds.xMin + bounds.xMax) / 2;
  let cy = (bounds.yMin + bounds.yMax) / 2;
  cx = Math.min(WORLD_LIMIT, Math.max(-WORLD_LIMIT, cx));
  cy = Math.min(WORLD_LIMIT, Math.max(-WORLD_LIMIT, cy));
  return {
    xMin: cx - w / 2,
    xMax: cx + w / 2,
    yMin: cy - h / 2,
    yMax: cy + h / 2,
  };
}

/** ピクセル移動量 → 数学座標オフセット（Yは上が正なので反転） */
export function pixelDeltaToMath(
  dxPx: number,
  dyPx: number,
  bounds: ViewBounds,
  width: number,
  height: number,
): { dx: number; dy: number } {
  const dx = (-dxPx / width) * (bounds.xMax - bounds.xMin);
  const dy = (dyPx / height) * (bounds.yMax - bounds.yMin);
  return { dx, dy };
}

export function screenToMath(
  sx: number,
  sy: number,
  bounds: ViewBounds,
  width: number,
  height: number,
): { x: number; y: number } {
  return {
    x: bounds.xMin + (sx / width) * (bounds.xMax - bounds.xMin),
    y: bounds.yMax - (sy / height) * (bounds.yMax - bounds.yMin),
  };
}
