import { useState } from 'react';
import {
  createRandomPalette,
  PALETTES_BY_COUNT,
  type ColorPalette,
  type PaintColorCount,
} from '../constants/palettes';
import { useI18n } from '../i18n/I18nContext';
import { PALETTE_NAMES_EN } from '../i18n/paletteNamesEn';

type Props = {
  open: boolean;
  onClose: () => void;
  onApply: (palette: ColorPalette) => void;
};

const COUNTS: PaintColorCount[] = [2, 3, 4, 5];

export function PaintModal({ open, onClose, onApply }: Props) {
  const { t, resolved } = useI18n();
  const [count, setCount] = useState<PaintColorCount>(3);
  const palettes = PALETTES_BY_COUNT[count];

  const paletteLabel = (palette: ColorPalette) => {
    if (palette.id.startsWith('random-')) {
      return t('paintRandom', { n: count });
    }
    if (resolved === 'ja') return palette.name;
    return PALETTE_NAMES_EN[palette.id] ?? palette.name;
  };

  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={onClose}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <div
        className="modal-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="paint-modal-title"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <h2 id="paint-modal-title" className="modal-title">
          {t('paint')}
        </h2>

        <div className="count-chips">
          {COUNTS.map((c) => (
            <button
              key={c}
              type="button"
              className={`count-chip${count === c ? ' count-chip--on' : ''}`}
              onClick={() => setCount(c)}
            >
              {t('paintColorCount', { n: c })}
            </button>
          ))}
        </div>

        <input type="hidden" value={count} readOnly />

        <div className="palette-list">
          <button
            type="button"
            className="palette-row palette-row--random"
            onClick={() => {
              onApply(createRandomPalette(count));
              onClose();
            }}
          >
            <span className="swatches">
              {Array.from({ length: count }).map((_, i) => (
                <span
                  key={`rand-preview-${i}`}
                  className="swatch"
                  style={{
                    backgroundColor: [
                      '#F43F5E',
                      '#F59E0B',
                      '#10B981',
                      '#3B82F6',
                      '#8B5CF6',
                    ][i % 5],
                  }}
                />
              ))}
            </span>
            <span className="palette-name">{t('paintRandom', { n: count })}</span>
          </button>

          {palettes.map((palette) => (
            <button
              key={palette.id}
              type="button"
              className="palette-row"
              onClick={() => {
                onApply(palette);
                onClose();
              }}
            >
              <span className="swatches">
                {palette.colors.map((color) => (
                  <span
                    key={`${palette.id}-${color}`}
                    className={`swatch${color.toUpperCase() === '#FFFFFF' ? ' swatch--outline' : ''}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </span>
              <span className="palette-name">{paletteLabel(palette)}</span>
            </button>
          ))}
        </div>

        <button type="button" className="btn-text" onClick={onClose}>
          {t('cancel')}
        </button>
      </div>
    </div>
  );
}