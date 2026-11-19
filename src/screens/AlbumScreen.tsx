import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react';
import {
  deleteAlbum,
  deleteAlbumItem,
  exportAlbum,
  importAlbum,
  listAlbum,
  parseAlbumImportFile,
  type AlbumItem,
} from '../album/storage';
import { AdSlot } from '../components/AdSlot';
import { Icons } from '../components/Icons';
import { useI18n } from '../i18n/I18nContext';
import type { AlbumProject } from '../types/albumProject';
import { downloadBlob, downloadDataUrl } from '../utils/pngExport';

type Props = {
  onReEdit: (project: AlbumProject) => void;
};

export function AlbumScreen({ onReEdit }: Props) {
  const { t } = useI18n();
  const [items, setItems] = useState<AlbumItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [importOpen, setImportOpen] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);
  const importModeRef = useRef<'overwrite' | 'append' | null>(null);

  const reload = useCallback(() => {
    setLoading(true);
    setItems(listAlbum());
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const onDelete = (item: AlbumItem) => {
    if (!window.confirm(t('deleteImageConfirm'))) return;
    deleteAlbumItem(item.id);
    reload();
  };

  const onDeleteAll = () => {
    if (!window.confirm(t('deleteConfirm'))) return;
    deleteAlbum();
    reload();
  };

  const onDownload = (item: AlbumItem) => {
    downloadDataUrl(item.thumbnailDataUrl, `function-coloring-${item.id}.png`);
  };

  const onExportJson = () => {
    const result = exportAlbum();
    if (result.kind === 'empty') {
      window.alert(`${t('album')}: ${t('exportEmpty')}`);
      return;
    }
    if (result.kind === 'blob') {
      downloadBlob(result.blob, result.filename);
      window.alert(`${t('album')}: ${t('exportDone')}`);
    }
  };

  const runImport = (mode: 'overwrite' | 'append') => {
    importModeRef.current = mode;
    setImportOpen(false);
    window.setTimeout(() => importRef.current?.click(), 300);
  };

  const onImportFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    const mode = importModeRef.current;
    importModeRef.current = null;
    if (!file || !mode) return;
    try {
      const text = await file.text();
      const data = parseAlbumImportFile(text);
      const count = importAlbum(data, mode);
      reload();
      window.alert(`${t('album')}: ${t('importDone')} (${count})`);
    } catch {
      window.alert(`${t('album')}: ${t('importFailed')}`);
    }
  };

  return (
    <div className="screen screen--album">
      <header className="screen-header screen-header--row">
        <h1 className="screen-title">{t('album')}</h1>
        <div className="album-toolbar">
          <button type="button" className="btn-ghost" onClick={onExportJson}>
            {t('exportAlbum')}
          </button>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => setImportOpen(true)}
          >
            {t('importAlbum')}
          </button>
          <button
            type="button"
            className="btn-ghost btn-ghost--danger"
            onClick={onDeleteAll}
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
      </header>

      <div className="album-body">
        {loading ? (
          <span className="spinner spinner--center" />
        ) : items.length === 0 ? (
          <p className="empty-msg">{t('albumEmpty')}</p>
        ) : (
          <div className="album-grid">
            {items.map((item) => (
              <article key={item.id} className="album-card">
                <img
                  className="album-thumb"
                  src={item.thumbnailDataUrl}
                  alt=""
                />
                <time
                  className="album-date"
                  dateTime={new Date(item.createdAt).toISOString()}
                >
                  {new Date(item.createdAt).toLocaleString()}
                </time>
                <div className="album-actions">
                  <button
                    type="button"
                    className="album-action"
                    title={t('downloadImage')}
                    onClick={() => onDownload(item)}
                  >
                    {Icons.download()}
                  </button>
                  <button
                    type="button"
                    className="album-action"
                    title={t('reEdit')}
                    onClick={() => {
                      if (!item.project) {
                        window.alert(`${t('album')}: ${t('reEditUnavailable')}`);
                        return;
                      }
                      onReEdit(item.project);
                    }}
                  >
                    {Icons.edit()}
                  </button>
                  <button
                    type="button"
                    className="album-action album-action--danger"
                    title={t('deleteImage')}
                    onClick={() => onDelete(item)}
                  >
                    {Icons.trash()}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <AdSlot className="ad-slot--inline" />

      {importOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setImportOpen(false)}
          onKeyDown={(ev) => ev.key === 'Escape' && setImportOpen(false)}
        >
          <div
            className="modal-sheet modal-sheet--compact"
            role="dialog"
            aria-modal="true"
            onClick={(ev) => ev.stopPropagation()}
            onKeyDown={(ev) => ev.stopPropagation()}
          >
            <h2 className="modal-title">{t('importAlbum')}</h2>
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
          </div>
        </div>
      )}
    </div>
  );
}
