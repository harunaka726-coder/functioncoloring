import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { DEFAULT_BOUNDS, DEFAULT_REGION_COLOR } from '../constants/defaults';
import { regionSignature } from '../math/evaluators';
import { regionsToSvgPaths } from '../math/regions';
import { pointsToPolyline, sampleCurve } from '../math/sampling';
import {
  panBounds,
  pixelDeltaToMath,
  screenToMath,
  zoomBounds,
} from '../math/viewport';
import type { MathFunction, Region, ViewBounds } from '../types/functions';

export type GraphCanvasHandle = {
  getSvgElement: () => SVGSVGElement | null;
};

type Props = {
  functions: MathFunction[];
  regions: Region[];
  bounds: ViewBounds;
  width: number;
  height: number;
  showGrid: boolean;
  showAxes: boolean;
  showLabels: boolean;
  onViewBoundsChange: (bounds: ViewBounds, recompute: boolean) => void;
  onRegionPick: (signature: string, color: string) => void;
};

function gridStep(span: number): number {
  if (span > 60) return 10;
  if (span > 30) return 5;
  if (span > 15) return 2;
  return 1;
}

function GridAndAxes({
  bounds,
  width,
  height,
  showGrid,
  showAxes,
  showLabels,
}: {
  bounds: ViewBounds;
  width: number;
  height: number;
  showGrid: boolean;
  showAxes: boolean;
  showLabels: boolean;
}) {
  if (!showGrid && !showAxes && !showLabels) return null;

  const lines: React.ReactNode[] = [];
  const labels: React.ReactNode[] = [];
  const xSpan = bounds.xMax - bounds.xMin;
  const ySpan = bounds.yMax - bounds.yMin;
  const step = gridStep(Math.min(xSpan, ySpan));

  const x0 = ((0 - bounds.xMin) / xSpan) * width;
  const y0 = height - ((0 - bounds.yMin) / ySpan) * height;

  const xStart = Math.ceil(bounds.xMin / step) * step;
  for (let x = xStart; x <= bounds.xMax + 1e-9; x += step) {
    const sx = ((x - bounds.xMin) / xSpan) * width;
    const isAxis = Math.abs(x) < 1e-9;

    if (isAxis && showAxes) {
      lines.push(
        <line
          key={`vx-${x}`}
          x1={sx}
          y1={0}
          x2={sx}
          y2={height}
          stroke="#334155"
          strokeWidth={1.5}
        />,
      );
    } else if (!isAxis && showGrid) {
      lines.push(
        <line
          key={`vx-${x}`}
          x1={sx}
          y1={0}
          x2={sx}
          y2={height}
          stroke="#E2E8F0"
          strokeWidth={1}
        />,
      );
    }

    if (showLabels && !isAxis) {
      labels.push(
        <text
          key={`lx-${x}`}
          x={sx}
          y={Math.min(height - 4, Math.max(12, y0 + 14))}
          fontSize={10}
          fill="#64748B"
          textAnchor="middle"
        >
          {Number(x.toFixed(2))}
        </text>,
      );
    }
  }

  const yStart = Math.ceil(bounds.yMin / step) * step;
  for (let y = yStart; y <= bounds.yMax + 1e-9; y += step) {
    const sy = height - ((y - bounds.yMin) / ySpan) * height;
    const isAxis = Math.abs(y) < 1e-9;

    if (isAxis && showAxes) {
      lines.push(
        <line
          key={`hy-${y}`}
          x1={0}
          y1={sy}
          x2={width}
          y2={sy}
          stroke="#334155"
          strokeWidth={1.5}
        />,
      );
    } else if (!isAxis && showGrid) {
      lines.push(
        <line
          key={`hy-${y}`}
          x1={0}
          y1={sy}
          x2={width}
          y2={sy}
          stroke="#E2E8F0"
          strokeWidth={1}
        />,
      );
    }

    if (showLabels && !isAxis) {
      labels.push(
        <text
          key={`ly-${y}`}
          x={Math.min(width - 8, Math.max(8, x0 + 8))}
          y={sy + 3}
          fontSize={10}
          fill="#64748B"
          textAnchor="start"
        >
          {Number(y.toFixed(2))}
        </text>,
      );
    }
  }

  return (
    <g>
      {lines}
      {labels}
    </g>
  );
}

export const GraphCanvas = forwardRef<GraphCanvasHandle, Props>(function GraphCanvas(
  {
    functions,
    regions,
    bounds,
    width,
    height,
    showGrid,
    showAxes,
    showLabels,
    onViewBoundsChange,
    onRegionPick,
  },
  ref,
) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [previewBounds, setPreviewBounds] = useState<ViewBounds | null>(null);

  const startBoundsRef = useRef(bounds);
  const liveBoundsRef = useRef(bounds);
  const gesturingRef = useRef(false);
  const regionsRef = useRef(regions);
  regionsRef.current = regions;
  const functionsRef = useRef(functions);
  functionsRef.current = functions;
  const rafRef = useRef<number | null>(null);
  const pendingBoundsRef = useRef<ViewBounds | null>(null);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const panActiveRef = useRef(false);
  const wheelEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const baseSpan = DEFAULT_BOUNDS.xMax - DEFAULT_BOUNDS.xMin;

  useImperativeHandle(ref, () => ({
    getSvgElement: () => svgRef.current,
  }));

  const displayBounds = previewBounds ?? bounds;
  if (!gesturingRef.current) {
    liveBoundsRef.current = bounds;
  }

  const schedulePreview = useCallback((next: ViewBounds) => {
    pendingBoundsRef.current = next;
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const b = pendingBoundsRef.current;
      if (b) {
        liveBoundsRef.current = b;
        setPreviewBounds(b);
      }
    });
  }, []);

  const finishGesture = useCallback(() => {
    if (!gesturingRef.current) return;
    gesturingRef.current = false;
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (pendingBoundsRef.current) {
      liveBoundsRef.current = pendingBoundsRef.current;
      pendingBoundsRef.current = null;
    }
    const finalBounds = liveBoundsRef.current;
    setPreviewBounds(null);
    onViewBoundsChange(finalBounds, true);
  }, [onViewBoundsChange]);

  const regionPaths = useMemo(() => {
    if (width <= 0 || height <= 0) return [];
    return regionsToSvgPaths(regions, displayBounds, width, height);
  }, [regions, displayBounds, width, height]);

  const curves = useMemo(() => {
    const samples = previewBounds ? 90 : undefined;
    return functions
      .filter((f) => f.visible)
      .map((f) => ({ fn: f, path: sampleCurve(f, displayBounds, samples) }));
  }, [functions, displayBounds, previewBounds]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    panActiveRef.current = false;
    gesturingRef.current = true;
    startBoundsRef.current = liveBoundsRef.current;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!gesturingRef.current || !pointerStartRef.current) return;
    if (width <= 0 || height <= 0) return;
    const dx = e.clientX - pointerStartRef.current.x;
    const dy = e.clientY - pointerStartRef.current.y;
    if (!panActiveRef.current) {
      if (Math.hypot(dx, dy) < 10) return;
      panActiveRef.current = true;
    }
    const { dx: mdx, dy: mdy } = pixelDeltaToMath(
      dx,
      dy,
      startBoundsRef.current,
      width,
      height,
    );
    schedulePreview(panBounds(startBoundsRef.current, mdx, mdy));
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const el = e.currentTarget as HTMLElement;
    if (el.hasPointerCapture(e.pointerId)) {
      el.releasePointerCapture(e.pointerId);
    }
    if (panActiveRef.current) {
      finishGesture();
    } else if (pointerStartRef.current && width > 0 && height > 0) {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const p = screenToMath(x, y, liveBoundsRef.current, width, height);
      const signature = regionSignature(functionsRef.current, p.x, p.y);
      if (signature) {
        const region = regionsRef.current.find((r) => r.signature === signature);
        onRegionPick(signature, region?.color ?? DEFAULT_REGION_COLOR);
      }
      gesturingRef.current = false;
    }
    pointerStartRef.current = null;
    panActiveRef.current = false;
  };

  const onWheel = (e: React.WheelEvent) => {
    if (!(e.ctrlKey || e.metaKey)) return;
    e.preventDefault();
    if (width <= 0 || height <= 0) return;
    gesturingRef.current = true;
    if (!startBoundsRef.current || !panActiveRef.current) {
      startBoundsRef.current = liveBoundsRef.current;
    }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const scale = Math.exp(-e.deltaY * 0.002);
    const focal = screenToMath(x, y, startBoundsRef.current, width, height);
    if (!Number.isFinite(focal.x) || !Number.isFinite(focal.y)) return;
    const next = zoomBounds(
      startBoundsRef.current,
      scale,
      focal.x,
      focal.y,
      baseSpan,
    );
    if (
      !Number.isFinite(next.xMin) ||
      !Number.isFinite(next.xMax) ||
      !Number.isFinite(next.yMin) ||
      !Number.isFinite(next.yMax)
    ) {
      return;
    }
    schedulePreview(next);
    if (wheelEndTimerRef.current) clearTimeout(wheelEndTimerRef.current);
    wheelEndTimerRef.current = setTimeout(() => {
      finishGesture();
    }, 120);
  };

  return (
    <>
      <div
        className="graph-canvas"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        style={{ touchAction: 'none' }}
      >
        {width > 0 && height > 0 && (
          <svg
            ref={svgRef}
            className="graph-svg"
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label="Function graph"
          >
            <rect x={0} y={0} width={width} height={height} fill="#FFFFFF" />

            {regionPaths.map((region) => {
              if (region.color.toUpperCase() === DEFAULT_REGION_COLOR) {
                return null;
              }
              return (
                <path
                  key={region.regionId}
                  d={region.d}
                  fill={region.color}
                  fillOpacity={0.78}
                  stroke={region.color}
                  strokeWidth={0.8}
                  strokeOpacity={0.78}
                  fillRule="nonzero"
                />
              );
            })}

            <GridAndAxes
              bounds={displayBounds}
              width={width}
              height={height}
              showGrid={showGrid}
              showAxes={showAxes}
              showLabels={showLabels}
            />

            {curves.map(({ fn, path }) =>
              path.polylines.map((poly, i) => (
                <polyline
                  key={`${fn.id}-${i}`}
                  points={pointsToPolyline(poly, displayBounds, width, height)}
                  fill="none"
                  stroke={fn.strokeColor}
                  strokeWidth={fn.strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )),
            )}
          </svg>
        )}
      </div>
    </>
  );
});