import { REGION_GRID_RESOLUTION } from '../constants/defaults';
import type { MathFunction, Point, Region, ViewBounds } from '../types/functions';
import { createId } from '../utils/id';
import { lookupPaintColor, type PaintColorMap } from './paintColors';
import { regionSignature } from './evaluators';
import { mathToScreen } from './sampling';

/**
 * 表示範囲に合わせた高解像度グリッドで領域を検出。
 * 色は paintColors マップから復元（関数の増減後もキープ）。
 */
export function detectRegions(
  functions: MathFunction[],
  viewBounds: ViewBounds,
  resolution = REGION_GRID_RESOLUTION,
  paintColors: PaintColorMap = {},
): Region[] {
  const visible = functions.filter((f) => f.visible);
  if (visible.length === 0) return [];

  const bounds = viewBounds;
  const span = Math.max(bounds.xMax - bounds.xMin, bounds.yMax - bounds.yMin);
  // 滑らかさと速度のバランス（大きすぎると UI が固まる）
  const res = Math.min(320, Math.max(resolution, Math.round(span / 0.1)));
  const { grid, nx, ny, dx, dy } = sampleVertexGrid(visible, bounds, res);
  const signatures = collectSignatures(grid, nx, ny);
  const regions: Region[] = [];

  for (const signature of signatures) {
    const polygons = buildFilledPolygons(
      grid,
      nx,
      ny,
      bounds,
      dx,
      dy,
      signature,
    );
    if (polygons.length === 0) continue;

    regions.push({
      id: createId('region'),
      signature,
      color: lookupPaintColor(signature, paintColors),
      polygons,
      cellCount: polygons.length,
    });
  }

  return regions;
}

function sampleVertexGrid(
  functions: MathFunction[],
  bounds: ViewBounds,
  resolution: number,
) {
  const nx = resolution + 1;
  const ny = resolution + 1;
  const dx = (bounds.xMax - bounds.xMin) / resolution;
  const dy = (bounds.yMax - bounds.yMin) / resolution;
  const grid: string[] = new Array(nx * ny);

  for (let j = 0; j < ny; j += 1) {
    const y = bounds.yMin + j * dy;
    for (let i = 0; i < nx; i += 1) {
      const x = bounds.xMin + i * dx;
      grid[j * nx + i] = regionSignature(functions, x, y);
    }
  }

  return { grid, nx, ny, dx, dy };
}

function collectSignatures(grid: string[], nx: number, ny: number): string[] {
  const set = new Set<string>();
  for (let k = 0; k < nx * ny; k += 1) set.add(grid[k]);
  return [...set];
}

function buildFilledPolygons(
  grid: string[],
  nx: number,
  ny: number,
  bounds: ViewBounds,
  dx: number,
  dy: number,
  signature: string,
): Point[][] {
  const polygons: Point[][] = [];

  for (let j = 0; j < ny - 1; j += 1) {
    let runStart = -1;

    const flushRun = (runEnd: number) => {
      if (runStart < 0) return;
      const x0 = bounds.xMin + runStart * dx;
      const x1 = bounds.xMin + (runEnd + 1) * dx;
      const y0 = bounds.yMin + j * dy;
      const y1 = y0 + dy;
      polygons.push([
        { x: x0, y: y1 },
        { x: x1, y: y1 },
        { x: x1, y: y0 },
        { x: x0, y: y0 },
      ]);
      runStart = -1;
    };

    for (let i = 0; i < nx - 1; i += 1) {
      const tl = grid[(j + 1) * nx + i] === signature;
      const tr = grid[(j + 1) * nx + i + 1] === signature;
      const br = grid[j * nx + i + 1] === signature;
      const bl = grid[j * nx + i] === signature;
      const mask = (tl ? 8 : 0) | (tr ? 4 : 0) | (br ? 2 : 0) | (bl ? 1 : 0);

      if (mask === 15) {
        if (runStart < 0) runStart = i;
        continue;
      }

      flushRun(i - 1);

      if (mask === 0) continue;

      const x0 = bounds.xMin + i * dx;
      const x1 = x0 + dx;
      const y0 = bounds.yMin + j * dy;
      const y1 = y0 + dy;
      const fragments = marchingSquareFill(mask, x0, x1, y0, y1);
      for (const poly of fragments) {
        if (poly.length >= 3) polygons.push(poly);
      }
    }

    flushRun(nx - 2);
  }

  return polygons;
}

function marchingSquareFill(
  mask: number,
  x0: number,
  x1: number,
  y0: number,
  y1: number,
): Point[][] {
  const TL: Point = { x: x0, y: y1 };
  const TR: Point = { x: x1, y: y1 };
  const BR: Point = { x: x1, y: y0 };
  const BL: Point = { x: x0, y: y0 };
  const top: Point = { x: (x0 + x1) / 2, y: y1 };
  const right: Point = { x: x1, y: (y0 + y1) / 2 };
  const bottom: Point = { x: (x0 + x1) / 2, y: y0 };
  const left: Point = { x: x0, y: (y0 + y1) / 2 };

  switch (mask) {
    case 1:
      return [[BL, left, bottom]];
    case 2:
      return [[BR, bottom, right]];
    case 3:
      return [[BL, left, right, BR]];
    case 4:
      return [[TR, right, top]];
    case 5:
      return [
        [TR, right, top],
        [BL, left, bottom],
      ];
    case 6:
      return [[TR, BR, bottom, top]];
    case 7:
      return [[TR, BR, BL, left, top]];
    case 8:
      return [[TL, top, left]];
    case 9:
      return [[TL, top, bottom, BL]];
    case 10:
      return [
        [TL, top, left],
        [BR, bottom, right],
      ];
    case 11:
      return [[TL, top, right, BR, BL]];
    case 12:
      return [[TL, TR, right, left]];
    case 13:
      return [[TL, TR, right, bottom, BL]];
    case 14:
      return [[TL, TR, BR, bottom, left]];
    case 15:
      return [[TL, TR, BR, BL]];
    default:
      return [];
  }
}

export function regionsToSvgPaths(
  regions: Region[],
  bounds: ViewBounds,
  canvasWidth: number,
  canvasHeight: number,
): { regionId: string; color: string; d: string }[] {
  return regions.map((region) => ({
    regionId: region.id,
    color: region.color,
    d: polygonsToPathD(region.polygons, bounds, canvasWidth, canvasHeight),
  }));
}

function polygonsToPathD(
  polygons: Point[][],
  bounds: ViewBounds,
  width: number,
  height: number,
): string {
  const parts: string[] = [];

  for (const poly of polygons) {
    if (poly.length < 3) continue;
    const first = mathToScreen(poly[0], bounds, width, height);
    parts.push(`M${first.x.toFixed(2)} ${first.y.toFixed(2)}`);
    for (let i = 1; i < poly.length; i += 1) {
      const p = mathToScreen(poly[i], bounds, width, height);
      parts.push(`L${p.x.toFixed(2)} ${p.y.toFixed(2)}`);
    }
    parts.push('Z');
  }

  return parts.join('');
}
