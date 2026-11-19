import type { ReactNode } from 'react';
import { useI18n } from '../i18n/I18nContext';

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
            icon="grid"
          />
          <IconBtn
            label={t('axes')}
            onClick={onToggleAxes}
            active={showAxes}
            tone="toggle"
            icon="axes"
          />
          <IconBtn
            label={t('labels')}
            onClick={onToggleLabels}
            active={showLabels}
            tone="toggle"
            icon="labels"
          />
          <span className="action-bar__spacer" />
          <IconBtn
            label={t('reset')}
            onClick={onReset}
            tone="secondary"
            icon="reset"
          />
          <IconBtn label={t('save')} onClick={onSave} tone="tonal" icon="save" />
          <IconBtn
            label={t('downloadImage')}
            onClick={onDownload}
            tone="tonal"
            icon="download"
          />
          <IconBtn
            label={t('share')}
            onClick={onShare}
            tone="tonal"
            icon="share"
          />
          <IconBtn
            label={t('paint')}
            onClick={onPaintPress}
            tone="primary"
            icon="paint"
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
  icon: string;
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
      <ActionIcon name={icon} />
    </button>
  );
}

function ActionIcon({ name }: { name: string }) {
  const paths: Record<string, ReactNode> = {
    grid: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
    axes: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
    labels: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M7 8h10M7 12h6M7 16h8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
    reset: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 4v6h6M20 20v-6h-6M5 19a8 8 0 0014-3M19 5a8 8 0 00-14 3"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
    save: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M5 20h14a1 1 0 001-1V7l-4-4H5a1 1 0 00-1 1v15a1 1 0 001 1z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M9 3v5h6V3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    download: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3v12m0 0l4-4m-4 4l-4-4M4 20h16"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
    share: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M8 12l8-5v10l-8-5z"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="currentColor"
        />
      </svg>
    ),
    paint: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="8" cy="16" r="4" fill="currentColor" />
        <path
          d="M12 12l7-7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  };
  return <>{paths[name] ?? null}</>;
}