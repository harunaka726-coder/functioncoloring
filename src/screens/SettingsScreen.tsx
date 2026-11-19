import { useRef, useState, type ChangeEvent, type ReactNode } from 'react';
import {
  deleteAlbum,
  exportAlbum,
  importAlbum,
  parseAlbumImportFile,
} from '../album/storage';
import { useI18n } from '../i18n/I18nContext';
import type { AppLanguage } from '../i18n/translations';
import { downloadBlob } from '../utils/pngExport';

type Props = {
  onOpenHowTo: () => void;
};

const LANG_OPTIONS: {
  value: AppLanguage;
  labelKey:
    | 'languageAuto'
    | 'languageJa'
    | 'languageEn'
    | 'languageEs'
    | 'languageZh';
}[] = [
  { value: 'auto', labelKey: 'languageAuto' },
  { value: 'ja', labelKey: 'languageJa' },
  { value: 'en', labelKey: 'languageEn' },
  { value: 'es', labelKey: 'languageEs' },
  { value: 'zh', labelKey: 'languageZh' },
];

export function SettingsScreen({ onOpenHowTo }: Props) {
  const { t, language, setLanguage, contactUrl, privacyUrl } = useI18n();
  const [langOpen, setLangOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);
  const importModeRef = useRef<'overwrite' | 'append' | null>(null);

  const currentLangLabel = t(
    LANG_OPTIONS.find((o) => o.value === language)?.labelKey ?? 'languageAuto',
  );

  const onExport = () => {
    try {
      const result = exportAlbum();
      if (result.kind === 'empty') {
        window.alert(`${t('settings')}: ${t('exportEmpty')}`);
        return;
      }
      if (result.kind === 'blob') {
        downloadBlob(result.blob, result.filename);
        window.alert(`${t('settings')}: ${t('exportDone')}`);
      }
    } catch {
      window.alert(`${t('settings')}: ${t('exportFailed')}`);
    }
  };

  const runImport = (mode: 'overwrite' | 'append') => {
    importModeRef.current = mode;
    setImportOpen(false);
    window.setTimeout(() => importRef.current?.click(), 450);
  };

  const onImportFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    const mode = importModeRef.current;
    importModeRef.current = null;
    if (!file || !mode) return;
    setImporting(true);
    try {
      const text = await file.text();
      const data = parseAlbumImportFile(text);
      const count = importAlbum(data, mode);
      window.alert(`${t('settings')}: ${t('importDone')} (${count})`);
    } catch {
      window.alert(`${t('settings')}: ${t('importFailed')}`);
    } finally {
      setImporting(false);
    }
  };

  const onDelete = () => {
    if (!window.confirm(t('deleteConfirm'))) return;
    deleteAlbum();
  };

  return (
    <div className="screen screen--settings">
      <header className="screen-header">
        <h1 className="screen-title">{t('settings')}</h1>
      </header>

      <div className="settings-scroll">
        <p className="settings-section">{t('language')}</p>
        <button
          type="button"
          className="settings-row"
          onClick={() => setLangOpen(true)}
        >
          <span>{t('language')}</span>
          <span className="settings-row__value">{currentLangLabel} ▾</span>
        </button>

        <p className="settings-section">{t('info')}</p>
        <button type="button" className="settings-row" onClick={onOpenHowTo}>
          <span>{t('howToPlay')}</span>
          <span aria-hidden>›</span>
        </button>
        <a
          className="settings-row settings-row--link"
          href={privacyUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>{t('privacyPolicy')}</span>
          <span aria-hidden>↗</span>
        </a>
        <a
          className="settings-row settings-row--link"
          href={contactUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>{t('contact')}</span>
          <span aria-hidden>↗</span>
        </a>

        <p className="settings-section">{t('album')}</p>
        <button type="button" className="settings-row" onClick={onExport}>
          {t('exportAlbum')}
        </button>
        <button
          type="button"
          className="settings-row"
          onClick={() => setImportOpen(true)}
        >
          {t('importAlbum')}
        </button>
        <button
          type="button"
          className="settings-row settings-row--danger"
          onClick={onDelete}
        >
          {t('deleteAlbum')}
        </button>
        <input
          ref={importRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={onImportFile}
        />
      </div>

      {langOpen && (
        <SettingsModal onClose={() => setLangOpen(false)}>
          {LANG_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className="settings-row"
              onClick={() => {
                setLanguage(opt.value);
                setLangOpen(false);
              }}
            >
              {t(opt.labelKey)}
            </button>
          ))}
        </SettingsModal>
      )}

      {importOpen && (
        <SettingsModal onClose={() => setImportOpen(false)} title={t('importAlbum')}>
          <button
            type="button"
            className="settings-row"
            onClick={() => runImport('overwrite')}
          >
            {t('importOverwrite')}
          </button>
          <button
            type="button"
            className="settings-row"
            onClick={() => runImport('append')}
          >
            {t('importAppend')}
          </button>
          <button
            type="button"
            className="btn-text"
            onClick={() => setImportOpen(false)}
          >
            {t('cancel')}
          </button>
        </SettingsModal>
      )}

      {importing && (
        <div className="busy-overlay">
          <span className="spinner" />
          <p>{t('importing')}</p>
        </div>
      )}
    </div>
  );
}

function SettingsModal({
  children,
  onClose,
  title,
}: {
  children: ReactNode;
  onClose: () => void;
  title?: string;
}) {
  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={onClose}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <div
        className="modal-sheet modal-sheet--compact"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {title && <h2 className="modal-title">{title}</h2>}
        {children}
      </div>
    </div>
  );
}