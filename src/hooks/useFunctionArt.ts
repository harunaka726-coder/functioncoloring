import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import {
  createInitialFunctions,
  createMathFunction,
  DEFAULT_BOUNDS,
  defaultCoeffs,
} from '../constants/defaults';
import { colorRegionsWithPalette, type ColorPalette } from '../constants/palettes';
import {
  isPaintedColor,
  mergePaintColors,
  type PaintColorMap,
} from '../math/paintColors';
import { detectRegions } from '../math/regions';
import { boundsEqual, fitBoundsToCanvas } from '../math/viewport';
import type { AlbumProject } from '../types/albumProject';
import type {
  FunctionKind,
  MathFunction,
  Region,
  ViewBounds,
} from '../types/functions';

type Snapshot = {
  functions: MathFunction[];
  regions: Region[];
  paintColors: PaintColorMap;
  bounds: ViewBounds;
};

type State = {
  functions: MathFunction[];
  regions: Region[];
  bounds: ViewBounds;
  baseBounds: ViewBounds;
  canvasWidth: number;
  canvasHeight: number;
  showGrid: boolean;
  showAxes: boolean;
  showLabels: boolean;
  paintColors: PaintColorMap;
  past: Snapshot[];
  future: Snapshot[];
};

type Action =
  | { type: 'ADD_FUNCTION'; kind: FunctionKind }
  | { type: 'REMOVE_FUNCTION'; id: string }
  | { type: 'UPDATE_PARAMS'; id: string; params: Record<string, number>; deferRegions?: boolean }
  | { type: 'UPDATE_COEFFS'; id: string; coeffs: number[]; degree: number; deferRegions?: boolean }
  | { type: 'UPDATE_EXPRESSION'; id: string; expression: string }
  | {
      type: 'UPDATE_STYLE';
      id: string;
      strokeColor?: string;
      strokeWidth?: number;
      visible?: boolean;
    }
  | { type: 'PAINT'; palette: ColorPalette }
  | { type: 'SET_REGION_COLOR'; signature: string; color: string }
  | { type: 'RESET' }
  | { type: 'SET_CANVAS_SIZE'; width: number; height: number }
  | { type: 'SET_BOUNDS'; bounds: ViewBounds; recompute?: boolean }
  | { type: 'TOGGLE_GRID' }
  | { type: 'TOGGLE_AXES' }
  | { type: 'TOGGLE_LABELS' }
  | { type: 'RECOMPUTE_REGIONS' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'PUSH_HISTORY' }
  | { type: 'RESTORE_PROJECT'; project: AlbumProject };

const HISTORY_LIMIT = 40;

function recompute(
  functions: MathFunction[],
  bounds: ViewBounds,
  paintColors: PaintColorMap,
): Region[] {
  return detectRegions(functions, bounds, undefined, paintColors);
}

function colorsFromRegions(regions: Region[]): PaintColorMap {
  const map: PaintColorMap = {};
  for (const r of regions) {
    if (isPaintedColor(r.color)) map[r.signature] = r.color;
  }
  return map;
}

function snapshotOf(state: State): Snapshot {
  return {
    functions: state.functions,
    regions: state.regions,
    paintColors: state.paintColors,
    bounds: state.bounds,
  };
}

function withHistory(state: State, next: State): State {
  const past = [...state.past, snapshotOf(state)].slice(-HISTORY_LIMIT);
  return { ...next, past, future: [] };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'PUSH_HISTORY':
      return { ...state, past: [...state.past, snapshotOf(state)].slice(-HISTORY_LIMIT), future: [] };

    case 'UNDO': {
      if (state.past.length === 0) return state;
      const prev = state.past[state.past.length - 1];
      return {
        ...state,
        functions: prev.functions,
        regions: prev.regions,
        paintColors: prev.paintColors,
        bounds: prev.bounds,
        past: state.past.slice(0, -1),
        future: [snapshotOf(state), ...state.future].slice(0, HISTORY_LIMIT),
      };
    }

    case 'REDO': {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      return {
        ...state,
        functions: next.functions,
        regions: next.regions,
        paintColors: next.paintColors,
        bounds: next.bounds,
        past: [...state.past, snapshotOf(state)].slice(-HISTORY_LIMIT),
        future: state.future.slice(1),
      };
    }

    case 'ADD_FUNCTION': {
      const nextFns = [
        ...state.functions,
        createMathFunction(action.kind, state.functions.length),
      ];
      return withHistory(state, {
        ...state,
        functions: nextFns,
        regions: recompute(nextFns, state.bounds, state.paintColors),
      });
    }

    case 'REMOVE_FUNCTION': {
      const nextFns = state.functions.filter((f) => f.id !== action.id);
      return withHistory(state, {
        ...state,
        functions: nextFns,
        regions: recompute(nextFns, state.bounds, state.paintColors),
      });
    }

    case 'UPDATE_PARAMS': {
      const nextFns = state.functions.map((f) => {
        if (f.id !== action.id) return f;
        const params = { ...f.params, ...action.params };
        if (f.kind === 'polynomial' && action.params.degree != null) {
          const degree = Math.max(0, Math.min(8, Math.round(action.params.degree)));
          const old = f.coeffs ?? defaultCoeffs(degree);
          const coeffs = defaultCoeffs(degree);
          for (let i = 0; i < Math.min(old.length, coeffs.length); i += 1) {
            coeffs[i] = old[i];
          }
          return { ...f, params: { ...params, degree }, coeffs };
        }
        return { ...f, params };
      });
      return {
        ...state,
        functions: nextFns,
        regions: action.deferRegions
          ? state.regions
          : recompute(nextFns, state.bounds, state.paintColors),
      };
    }

    case 'UPDATE_COEFFS': {
      const nextFns = state.functions.map((f) =>
        f.id === action.id
          ? {
              ...f,
              coeffs: action.coeffs,
              params: { ...f.params, degree: action.degree },
            }
          : f,
      );
      return {
        ...state,
        functions: nextFns,
        regions: action.deferRegions
          ? state.regions
          : recompute(nextFns, state.bounds, state.paintColors),
      };
    }

    case 'UPDATE_EXPRESSION': {
      const nextFns = state.functions.map((f) =>
        f.id === action.id ? { ...f, expression: action.expression } : f,
      );
      return withHistory(state, {
        ...state,
        functions: nextFns,
        regions: recompute(nextFns, state.bounds, state.paintColors),
      });
    }

    case 'UPDATE_STYLE': {
      const nextFns = state.functions.map((f) =>
        f.id === action.id
          ? {
              ...f,
              strokeColor: action.strokeColor ?? f.strokeColor,
              strokeWidth: action.strokeWidth ?? f.strokeWidth,
              visible: action.visible ?? f.visible,
            }
          : f,
      );
      const visibilityChanged =
        action.visible != null &&
        state.functions.some((f) => f.id === action.id && f.visible !== action.visible);
      return {
        ...state,
        functions: nextFns,
        regions: visibilityChanged
          ? recompute(nextFns, state.bounds, state.paintColors)
          : state.regions,
      };
    }

    case 'PAINT': {
      const assigned = colorRegionsWithPalette(
        state.regions.map((r) => r.signature),
        action.palette.colors,
      );
      const regions = state.regions.map((r) => ({
        ...r,
        color: assigned.get(r.signature) ?? action.palette.colors[0],
      }));
      return withHistory(state, {
        ...state,
        regions,
        paintColors: mergePaintColors(state.paintColors, colorsFromRegions(regions)),
      });
    }

    case 'SET_REGION_COLOR': {
      const regions = state.regions.map((r) =>
        r.signature === action.signature ? { ...r, color: action.color } : r,
      );
      return withHistory(state, {
        ...state,
        regions,
        paintColors: {
          ...state.paintColors,
          [action.signature]: action.color,
        },
      });
    }

    case 'RESET': {
      const functions = createInitialFunctions();
      const fitted =
        state.canvasWidth > 0
          ? fitBoundsToCanvas(DEFAULT_BOUNDS, state.canvasWidth, state.canvasHeight)
          : DEFAULT_BOUNDS;
      return withHistory(state, {
        ...state,
        functions,
        baseBounds: DEFAULT_BOUNDS,
        bounds: fitted,
        paintColors: {},
        regions: recompute(functions, fitted, {}),
        showGrid: false,
        showAxes: true,
        showLabels: true,
      });
    }

    case 'SET_CANVAS_SIZE': {
      const cx = (state.bounds.xMin + state.bounds.xMax) / 2;
      const cy = (state.bounds.yMin + state.bounds.yMax) / 2;
      const span = Math.min(
        state.bounds.xMax - state.bounds.xMin,
        state.bounds.yMax - state.bounds.yMin,
      );
      const square: ViewBounds = {
        xMin: cx - span / 2,
        xMax: cx + span / 2,
        yMin: cy - span / 2,
        yMax: cy + span / 2,
      };
      const nextBounds = fitBoundsToCanvas(square, action.width, action.height);
      if (
        state.canvasWidth === action.width &&
        state.canvasHeight === action.height &&
        boundsEqual(nextBounds, state.bounds)
      ) {
        return state;
      }
      return {
        ...state,
        canvasWidth: action.width,
        canvasHeight: action.height,
        bounds: nextBounds,
        regions: recompute(state.functions, nextBounds, state.paintColors),
      };
    }

    case 'SET_BOUNDS': {
      if (boundsEqual(action.bounds, state.bounds) && !action.recompute) {
        return state;
      }
      return {
        ...state,
        bounds: action.bounds,
        regions: action.recompute
          ? recompute(state.functions, action.bounds, state.paintColors)
          : state.regions,
      };
    }

    case 'RECOMPUTE_REGIONS':
      return {
        ...state,
        regions: recompute(state.functions, state.bounds, state.paintColors),
      };

    case 'TOGGLE_GRID':
      return { ...state, showGrid: !state.showGrid };
    case 'TOGGLE_AXES':
      return { ...state, showAxes: !state.showAxes };
    case 'TOGGLE_LABELS':
      return { ...state, showLabels: !state.showLabels };

    case 'RESTORE_PROJECT': {
      const { project } = action;
      const bounds =
        state.canvasWidth > 0
          ? fitBoundsToCanvas(
              project.bounds,
              state.canvasWidth,
              state.canvasHeight,
            )
          : project.bounds;
      return withHistory(state, {
        ...state,
        functions: project.functions,
        paintColors: project.paintColors,
        bounds,
        baseBounds: project.bounds,
        showGrid: project.showGrid,
        showAxes: project.showAxes,
        showLabels: project.showLabels,
        regions: recompute(project.functions, bounds, project.paintColors),
      });
    }

    default:
      return state;
  }
}

function createInitialState(): State {
  const functions = createInitialFunctions();
  const baseBounds = DEFAULT_BOUNDS;
  return {
    functions,
    regions: recompute(functions, baseBounds, {}),
    bounds: baseBounds,
    baseBounds,
    canvasWidth: 0,
    canvasHeight: 0,
    showGrid: false,
    showAxes: true,
    showLabels: true,
    paintColors: {},
    past: [],
    future: [],
  };
}

export function useFunctionArt() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const recomputeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const editSession = useRef(false);

  const beginParamEdit = useCallback(() => {
    if (!editSession.current) {
      editSession.current = true;
      dispatch({ type: 'PUSH_HISTORY' });
    }
  }, []);

  const scheduleRegions = useCallback(() => {
    if (recomputeTimer.current) clearTimeout(recomputeTimer.current);
    recomputeTimer.current = setTimeout(() => {
      dispatch({ type: 'RECOMPUTE_REGIONS' });
      editSession.current = false;
    }, 140);
  }, []);

  useEffect(() => {
    return () => {
      if (recomputeTimer.current) clearTimeout(recomputeTimer.current);
    };
  }, []);

  const addFunction = useCallback((kind: FunctionKind) => {
    dispatch({ type: 'ADD_FUNCTION', kind });
  }, []);

  const removeFunction = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_FUNCTION', id });
  }, []);

  const updateParams = useCallback(
    (id: string, params: Record<string, number>) => {
      beginParamEdit();
      dispatch({ type: 'UPDATE_PARAMS', id, params, deferRegions: true });
      scheduleRegions();
    },
    [beginParamEdit, scheduleRegions],
  );

  const updateCoeffs = useCallback(
    (id: string, coeffs: number[], degree: number) => {
      beginParamEdit();
      dispatch({ type: 'UPDATE_COEFFS', id, coeffs, degree, deferRegions: true });
      scheduleRegions();
    },
    [beginParamEdit, scheduleRegions],
  );

  const updateExpression = useCallback((id: string, expression: string) => {
    dispatch({ type: 'UPDATE_EXPRESSION', id, expression });
  }, []);

  const updateStyle = useCallback(
    (
      id: string,
      style: { strokeColor?: string; strokeWidth?: number; visible?: boolean },
    ) => {
      dispatch({ type: 'UPDATE_STYLE', id, ...style });
    },
    [],
  );

  const paint = useCallback((palette: ColorPalette) => {
    dispatch({ type: 'PAINT', palette });
  }, []);

  const setRegionColor = useCallback((signature: string, color: string) => {
    dispatch({ type: 'SET_REGION_COLOR', signature, color });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);

  const setCanvasSize = useCallback((width: number, height: number) => {
    dispatch({ type: 'SET_CANVAS_SIZE', width, height });
  }, []);

  const setViewBounds = useCallback((bounds: ViewBounds, recomputeFlag = true) => {
    dispatch({ type: 'SET_BOUNDS', bounds, recompute: recomputeFlag });
  }, []);

  const toggleGrid = useCallback(() => dispatch({ type: 'TOGGLE_GRID' }), []);
  const toggleAxes = useCallback(() => dispatch({ type: 'TOGGLE_AXES' }), []);
  const toggleLabels = useCallback(() => dispatch({ type: 'TOGGLE_LABELS' }), []);

  const restoreProject = useCallback((project: AlbumProject) => {
    dispatch({ type: 'RESTORE_PROJECT', project });
  }, []);

  const snapshotProject = useCallback((): AlbumProject => {
    return {
      version: 1,
      functions: state.functions,
      paintColors: state.paintColors,
      bounds: state.bounds,
      showGrid: state.showGrid,
      showAxes: state.showAxes,
      showLabels: state.showLabels,
    };
  }, [
    state.functions,
    state.paintColors,
    state.bounds,
    state.showGrid,
    state.showAxes,
    state.showLabels,
  ]);

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  return useMemo(
    () => ({
      functions: state.functions,
      regions: state.regions,
      bounds: state.bounds,
      showGrid: state.showGrid,
      showAxes: state.showAxes,
      showLabels: state.showLabels,
      canUndo,
      canRedo,
      addFunction,
      removeFunction,
      updateParams,
      updateCoeffs,
      updateExpression,
      updateStyle,
      paint,
      setRegionColor,
      reset,
      undo,
      redo,
      setCanvasSize,
      setViewBounds,
      toggleGrid,
      toggleAxes,
      toggleLabels,
      restoreProject,
      snapshotProject,
    }),
    [
      state.functions,
      state.regions,
      state.bounds,
      state.showGrid,
      state.showAxes,
      state.showLabels,
      canUndo,
      canRedo,
      addFunction,
      removeFunction,
      updateParams,
      updateCoeffs,
      updateExpression,
      updateStyle,
      paint,
      setRegionColor,
      reset,
      undo,
      redo,
      setCanvasSize,
      setViewBounds,
      toggleGrid,
      toggleAxes,
      toggleLabels,
      restoreProject,
      snapshotProject,
    ],
  );
}
