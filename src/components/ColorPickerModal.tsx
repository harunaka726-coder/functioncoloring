import { useI18n } from '../i18n/I18nContext';
import {
  PICKER_STANDARD_COLORS,
  PICKER_THEME_COLORS,
} from '../math/colors';

type Props = {
  open: boolean;
  currentColor?: string;
  onSelect: (color: string) => void;
  onClose: () => void;
};

export function ColorPickerModal({
  open,
  currentColor,
  onSelect,
  onClose,
}: Props) {
  const { t } = useI18n();
  if (!open) return null;

  return (
    <div
      className="modal-backdrop modal-backdrop--panel"
      role="presentation"
      onClick={onClose}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <div
        className="modal-sheet modal-sheet--compact modal-sheet--panel"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <h2 className="modal-title">{t('colorPickerTitle')}</h2>
        <p className="color-section-label">{t('colorTheme')}</p>
        <div className="swatch-row">
          {PICKER_THEME_COLORS.map((color) => (
            <Swatch
              key={`t-${color}`}
              color={color}
              selected={currentColor === color}
              onPress={() => onSelect(color)}
            />
          ))}
        </div>
        <p className="color-section-label">{t('colorStandard')}</p>
        <div className="swatch-row">
          {PICKER_STANDARD_COLORS.map((color) => (
            <Swatch
              key={`s-${color}`}
              color={color}
              selected={currentColor === color}
              onPress={() => onSelect(color)}
            />
          ))}
        </div>
        <button type="button" className="btn-text" onClick={onClose}>
          {t('cancel')}
        </button>
      </div>
    </div>
  );
}

function Swatch({
  color,
  selected,
  onPress,
}: {
  color: string;
  selected: boolean;
  onPress: () => void;
}) {
  const isLight =
    color.toUpperCase() === '#FFFFFF' || color.toUpperCase() === '#FFFF00';
  return (
    <button
      type="button"
      className={`picker-swatch${isLight ? ' picker-swatch--border' : ''}${selected ? ' picker-swatch--selected' : ''}`}
      style={{ backgroundColor: color }}
      onClick={onPress}
      aria-pressed={selected}
    />
  );
}