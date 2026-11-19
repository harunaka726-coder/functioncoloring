import type { ReactNode } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { Icons } from './Icons';

type Props = {
  showGrid: boolean;
  showAxes: boolean;
  showLabels: boolean;
  onPaintPress: () => void;
  onReset: () => void;
  onToggleGrid: () => void;
  onToggleAxes: () => void;
  onToggleLabels: () => void;
  onSave: () => void;
  onShare: () => void;
  onDownload: () => void;
};

export function ActionBar({
  showGrid,
  showAxes,
  showLabels,
  onPaintPress,
  onReset,
  onToggleGrid,
  onToggleAxes,
  onToggleLabels,
  onSave,
  onShare,
  onDownload,
}: Props) {
  const { t } = useI18n();

  return (
    <div className="action-bar">
      <div className="action-bar__scroll">
        <div className="action-bar__inner">
          <IconBtn
            label={t('grid')}
            onClick={onToggleGrid}
            active={showGrid}
            tone="toggle"
            icon={Icons.grid()}
          />
          <IconBtn
            label={t('axes')}
            onClick={onToggleAxes}
            active={showAxes}
            tone="toggle"
            icon={Icons.axes()}
          />
          <IconBtn
            label={t('labels')}
            onClick={onToggleLabels}
            active={showLabels}
            tone="toggle"
            icon={Icons.labels()}
          />
          <span className="action-bar__spacer" />
          <IconBtn
            label={t('reset')}
            onClick={onReset}
            tone="secondary"
            icon={Icons.reset()}
          />
          <IconBtn
            label={t('save')}
            onClick={onSave}
            tone="tonal"
            icon={Icons.album(false)}
          />
          <IconBtn
            label={t('downloadImage')}
            onClick={onDownload}
            tone="tonal"
            icon={Icons.download()}
          />
          <IconBtn
            label={t('share')}
            onClick={onShare}
            tone="tonal"
            icon={Icons.share()}
          />
          <IconBtn
            label={t('paint')}
            onClick={onPaintPress}
            tone="primary"
            icon={Icons.paint()}
          />
        </div>
      </div>
    </div>
  );
}

function IconBtn({
  label,
  onClick,
  tone,
  active,
  icon,
  disabled,
}: {
  label: string;
  onClick: () => void;
  tone: 'primary' | 'secondary' | 'tonal' | 'toggle';
  active?: boolean;
  icon: ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className={`action-icon action-icon--${tone}${active ? ' action-icon--on' : ''}`}
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
    >
      {icon}
    </button>
  );
}
