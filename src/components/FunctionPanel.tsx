import React, { useEffect, useMemo, useState } from 'react';
import { STROKE_PALETTE } from '../constants/defaults';
import { compileExpression } from '../math/expression';
import { useI18n } from '../i18n/I18nContext';
import {
  FUNCTION_KIND_KEYS,
  FUNCTION_KIND_ORDER,
  PARAM_LABELS,
  type FunctionKind,
  type MathFunction,
} from '../types/functions';
import { formatFormula } from '../utils/formatFormula';

type Props = {
  functions: MathFunction[];
  onAdd: (kind: FunctionKind) => void;
  onRemove: (id: string) => void;
  onUpdateParams: (id: string, params: Record<string, number>) => void;
  onUpdateCoeffs: (id: string, coeffs: number[], degree: number) => void;
  onUpdateExpression: (id: string, expression: string) => void;
  onUpdateStyle: (
    id: string,
    style: { strokeColor?: string; strokeWidth?: number; visible?: boolean },
  ) => void;
};

export function FunctionPanel({
  functions,
  onAdd,
  onRemove,
  onUpdateParams,
  onUpdateCoeffs,
  onUpdateExpression,
  onUpdateStyle,
}: Props) {
  const { t } = useI18n();
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div className="function-panel">
      <div className="function-panel__scroll">
        <div className="function-panel__list">
          {functions.length === 0 ? (
            <p className="function-panel__empty">{t('addFunction')}</p>
          ) : (
            functions.map((fn) => (
              <FunctionCard
                key={fn.id}
                fn={fn}
                onUpdateParams={onUpdateParams}
                onUpdateCoeffs={onUpdateCoeffs}
                onUpdateExpression={onUpdateExpression}
                onUpdateStyle={onUpdateStyle}
                onRemove={onRemove}
              />
            ))
          )}
        </div>
      </div>

      <button
        type="button"
        className="fab-add"
        aria-label={t('addFunction')}
        onClick={() => setPickerOpen(true)}
      >
        +
      </button>

      {pickerOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setPickerOpen(false)}
          onKeyDown={(e: React.KeyboardEvent) =>
            e.key === 'Escape' && setPickerOpen(false)
          }
        >
          <div
            className="modal-sheet modal-sheet--bottom"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <div className="sheet-handle" />
            <h2 className="modal-title">{t('addFunction')}</h2>
            <div className="kind-list">
              {FUNCTION_KIND_ORDER.map((kind) => (
                <button
                  key={kind}
                  type="button"
                  className="kind-row"
                  onClick={() => {
                    onAdd(kind);
                    setPickerOpen(false);
                  }}
                >
                  {t(FUNCTION_KIND_KEYS[kind])}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="btn-text"
              onClick={() => setPickerOpen(false)}
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function coeffLabel(i: number, constLabel: string): string {
  if (i === 0) return constLabel;
  if (i === 1) return 'a₁ (x)';
  return `a${toSub(i)} (x^${i})`;
}

function toSub(n: number): string {
  const subs = '₀₁₂₃₄₅₆₇₈₉';
  return String(n)
    .split('')
    .map((d) => subs[Number(d)] ?? d)
    .join('');
}

function FunctionCard({
  fn,
  onUpdateParams,
  onUpdateCoeffs,
  onUpdateExpression,
  onUpdateStyle,
  onRemove,
}: {
  fn: MathFunction;
  onUpdateParams: (id: string, params: Record<string, number>) => void;
  onUpdateCoeffs: (id: string, coeffs: number[], degree: number) => void;
  onUpdateExpression: (id: string, expression: string) => void;
  onUpdateStyle: (
    id: string,
    style: { strokeColor?: string; strokeWidth?: number; visible?: boolean },
  ) => void;
  onRemove: (id: string) => void;
}) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const [exprDraft, setExprDraft] = useState(fn.expression ?? '');
  const paramDefs = PARAM_LABELS[fn.kind];

  useEffect(() => {
    setExprDraft(fn.expression ?? '');
  }, [fn.id, fn.expression]);

  const exprStatus = useMemo(() => {
    if (fn.kind !== 'custom') return null;
    return compileExpression(fn.expression ?? '');
  }, [fn.kind, fn.expression]);

  const formula = useMemo(() => formatFormula(fn), [fn]);

  return (
    <article className="fn-card">
      <div className="fn-card__header">
        <button
          type="button"
          className="fn-card__title-btn"
          onClick={() => setExpanded((v) => !v)}
        >
          <span
            className="fn-card__swatch"
            style={{ backgroundColor: fn.strokeColor }}
          />
          <span className="fn-card__title">{formula}</span>
        </button>
        <button
          type="button"
          className="icon-btn icon-btn--muted"
          aria-label={fn.visible ? 'hide' : 'show'}
          onClick={() => onUpdateStyle(fn.id, { visible: !fn.visible })}
        >
          {fn.visible ? '👁' : '🚫'}
        </button>
        <button
          type="button"
          className="icon-btn icon-btn--danger"
          aria-label="delete"
          onClick={() => onRemove(fn.id)}
        >
          🗑
        </button>
      </div>

      {expanded && (
        <div className="fn-card__body">
          {fn.kind === 'polynomial' && (
            <PolynomialEditor
              fn={fn}
              onUpdateParams={onUpdateParams}
              onUpdateCoeffs={onUpdateCoeffs}
              degreeLabel={t('degreeLabel')}
              constLabel={t('coeffConst')}
            />
          )}

          {fn.kind === 'custom' && (
            <div className="custom-block">
              <label className="field-label">{t('expressionLabel')}</label>
              <input
                className="expr-input"
                value={exprDraft}
                autoCapitalize="off"
                autoCorrect="off"
                placeholder={t('expressionPlaceholder')}
                onChange={(e) => setExprDraft(e.target.value)}
                onBlur={() => onUpdateExpression(fn.id, exprDraft)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onUpdateExpression(fn.id, exprDraft);
                }}
              />
              <button
                type="button"
                className="btn-primary-sm"
                onClick={() => onUpdateExpression(fn.id, exprDraft)}
              >
                {t('apply')}
              </button>
              <p className="hint">{t('expressionHint1')}</p>
              <p className="hint">{t('expressionHint2')}</p>
              {exprStatus && !exprStatus.ok && (
                <p className="field-error">{exprStatus.error}</p>
              )}
            </div>
          )}

          {paramDefs.map((def) => {
            const value = Number(fn.params[def.key] ?? 0);
            const label = def.labelKey ? t(def.labelKey) : (def.label ?? def.key);
            return (
              <div key={def.key} className="param-row">
                <div className="param-label-row">
                  <span className="field-label">{label}</span>
                  <input
                    className="param-num-input"
                    inputMode="decimal"
                    value={String(Number(value.toFixed(2)))}
                    onChange={(e) => {
                      const n = Number(e.target.value);
                      if (!Number.isNaN(n)) {
                        onUpdateParams(fn.id, { [def.key]: n });
                      }
                    }}
                  />
                </div>
                <input
                  type="range"
                  className="range"
                  min={def.min}
                  max={def.max}
                  step={def.step}
                  value={Math.min(def.max, Math.max(def.min, value))}
                  style={{ accentColor: fn.strokeColor }}
                  onChange={(e) =>
                    onUpdateParams(fn.id, { [def.key]: Number(e.target.value) })
                  }
                />
              </div>
            );
          })}

          <p className="section-label">{t('strokeColor')}</p>
          <div className="color-dots">
            {STROKE_PALETTE.map((color) => (
              <button
                key={color}
                type="button"
                className={`color-dot${fn.strokeColor === color ? ' color-dot--active' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => onUpdateStyle(fn.id, { strokeColor: color })}
              />
            ))}
          </div>

          <div className="param-label-row">
            <span className="field-label">{t('strokeWidth')}</span>
            <span className="param-value">{fn.strokeWidth.toFixed(1)}</span>
          </div>
          <input
            type="range"
            className="range"
            min={1}
            max={6}
            step={0.5}
            value={fn.strokeWidth}
            onChange={(e) =>
              onUpdateStyle(fn.id, { strokeWidth: Number(e.target.value) })
            }
          />
        </div>
      )}
    </article>
  );
}

function PolynomialEditor({
  fn,
  onUpdateParams,
  onUpdateCoeffs,
  degreeLabel,
  constLabel,
}: {
  fn: MathFunction;
  onUpdateParams: (id: string, params: Record<string, number>) => void;
  onUpdateCoeffs: (id: string, coeffs: number[], degree: number) => void;
  degreeLabel: string;
  constLabel: string;
}) {
  const degree = Math.round(fn.params.degree ?? 2);
  const coeffs = fn.coeffs ?? [0];

  return (
    <div>
      <div className="param-label-row">
        <span className="field-label">{degreeLabel}</span>
        <input
          className="param-num-input"
          inputMode="numeric"
          value={String(degree)}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (!Number.isNaN(n)) onUpdateParams(fn.id, { degree: n });
          }}
        />
      </div>
      <input
        type="range"
        className="range"
        min={0}
        max={8}
        step={1}
        value={degree}
        style={{ accentColor: fn.strokeColor }}
        onChange={(e) =>
          onUpdateParams(fn.id, { degree: Number(e.target.value) })
        }
      />

      {[...coeffs]
        .map((c, i) => ({ c, i }))
        .reverse()
        .map(({ c, i }) => (
          <div key={`c-${i}`} className="param-row">
            <div className="param-label-row">
              <span className="field-label">{coeffLabel(i, constLabel)}</span>
              <input
                className="param-num-input"
                inputMode="decimal"
                value={String(Number(c.toFixed(3)))}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  if (Number.isNaN(n)) return;
                  const next = [...coeffs];
                  next[i] = n;
                  onUpdateCoeffs(fn.id, next, degree);
                }}
              />
            </div>
            <input
              type="range"
              className="range"
              min={-5}
              max={5}
              step={0.05}
              value={Math.min(5, Math.max(-5, c))}
              style={{ accentColor: fn.strokeColor }}
              onChange={(e) => {
                const next = [...coeffs];
                next[i] = Number(e.target.value);
                onUpdateCoeffs(fn.id, next, degree);
              }}
            />
          </div>
        ))}
    </div>
  );
}