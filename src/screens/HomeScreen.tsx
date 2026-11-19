import { useEffect, useRef, useState } from 'react';
import { saveToAlbum } from '../album/storage';
import { ActionBar } from '../components/ActionBar';
import { ColorPickerModal } from '../components/ColorPickerModal';
import { FunctionPanel } from '../components/FunctionPanel';
import { GraphCanvas, type GraphCanvasHandle } from '../components/GraphCanvas';
import { Icons } from '../components/Icons';
import { PaintModal } from '../components/PaintModal';
import { useFunctionArt } from '../hooks/useFunctionArt';
import { useI18n } from '../i18n/I18nContext';
import type { AlbumProject } from '../types/albumProject';
import { downloadDataUrl, svgElementToPngDataUrl } from '../utils/pngExport';

type Props = {
  restoreProject?: AlbumProject | null;
  onRestoreConsumed?: () => void;
};

export function HomeScreen({ restoreProject, onRestoreConsumed }: Props) {
  const art = useFunctionArt();
  const { t } = useI18n();
  const canvasRef = useRef<GraphCanvasHandle>(null);
  const paneRef = useRef<HTMLDivElement>(null);

  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [paintOpen, setPaintOpen] = useState(false);
  const [colorPick, setColorPick] = useState<{
    signature: string;
    color: string;
  } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (canvasSize.width > 0 && canvasSize.height > 0) {
      art.setCanvasSize(canvasSize.width, canvasSize.height);
    }
  }, [canvasSize.width, canvasSize.height, art.setCanvasSize]);

  useEffect(() => {
    if (!restoreProject) return;
    art.restoreProject(restoreProject);
    onRestoreConsumed?.();
  }, [restoreProject, art.restoreProject, onRestoreConsumed]);

  useEffect(() => {
    const el = paneRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0]?.contentRect ?? {
        width: 0,
        height: 0,
      };
      setCanvasSize({
        width: Math.floor(width),
        height: Math.floor(height),
      });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const capturePng = async (): Promise<string> => {
    const svg = canvasRef.current?.getSvgElement();
    if (!svg) throw new Error('capture');
    return svgElementToPngDataUrl(svg);
  };

  const onSave = async () => {
    try {
      setBusy(true);
      const dataUrl = await capturePng();
      saveToAlbum(dataUrl, art.snapshotProject());
      window.alert(`${t('appName')}: ${t('savedToAppAlbum')}`);
    } catch {
      window.alert(`${t('appName')}: ${t('saveFailed')}`);
    } finally {
      setBusy(false);
    }
  };

  const onDownload = async () => {
    try {
      setBusy(true);
      const dataUrl = await capturePng();
      downloadDataUrl(dataUrl, `function-coloring-${Date.now()}.png`);
    } catch {
      window.alert(`${t('appName')}: ${t('saveFailed')}`);
    } finally {
      setBusy(false);
    }
  };

  const onShare = async () => {
    try {
      setBusy(true);
      const dataUrl = await capturePng();
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], 'function-coloring.png', {
        type: 'image/png',
      });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: t('appName'),
        });
      } else {
        downloadDataUrl(dataUrl, 'function-coloring.png');
      }
    } catch {
      window.alert(`${t('appName')}: ${t('shareFailed')}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="screen screen--home">
      <header className="screen-header screen-header--mobile-only">
        <h1 className="brand">{t('appName')}</h1>
      </header>

      <ActionBar
        showGrid={art.showGrid}
        showAxes={art.showAxes}
        showLabels={art.showLabels}
        onPaintPress={() => setPaintOpen(true)}
        onReset={art.reset}
        onToggleGrid={art.toggleGrid}
        onToggleAxes={art.toggleAxes}
        onToggleLabels={art.toggleLabels}
        onSave={onSave}
        onShare={onShare}
        onDownload={onDownload}
      />

      <div className="home-body">
        <div className="canvas-pane">
          <div className="canvas-card">
            <div ref={paneRef} className="canvas-card__inner">
              <div className="canvas-card__shot">
                <GraphCanvas
                  ref={canvasRef}
                  functions={art.functions}
                  regions={art.regions}
                  bounds={art.bounds}
                  width={canvasSize.width}
                  height={canvasSize.height}
                  showGrid={art.showGrid}
                  showAxes={art.showAxes}
                  showLabels={art.showLabels}
                  onViewBoundsChange={art.setViewBounds}
                  onRegionPick={(signature, color) =>
                    setColorPick({ signature, color })
                  }
                />
              </div>
            </div>
            <div className="history-overlay">
              <button
                type="button"
                className={`history-btn${!art.canUndo ? ' history-btn--off' : ''}`}
                aria-label={t('undo')}
                disabled={!art.canUndo}
                onClick={art.undo}
              >
                {Icons.undo()}
              </button>
              <button
                type="button"
                className={`history-btn${!art.canRedo ? ' history-btn--off' : ''}`}
                aria-label={t('redo')}
                disabled={!art.canRedo}
                onClick={art.redo}
              >
                {Icons.redo()}
              </button>
            </div>
          </div>
        </div>

        <div className="panel-pane">
          <FunctionPanel
            functions={art.functions}
            onAdd={art.addFunction}
            onRemove={art.removeFunction}
            onUpdateParams={art.updateParams}
            onUpdateCoeffs={art.updateCoeffs}
            onUpdateExpression={art.updateExpression}
            onUpdateStyle={art.updateStyle}
          />
          <PaintModal
            open={paintOpen}
            onClose={() => setPaintOpen(false)}
            onApply={art.paint}
          />
          <ColorPickerModal
            open={colorPick != null}
            currentColor={colorPick?.color}
            onClose={() => setColorPick(null)}
            onSelect={(color) => {
              if (colorPick) art.setRegionColor(colorPick.signature, color);
              setColorPick(null);
            }}
          />
        </div>
      </div>

      {busy && (
        <div className="busy-overlay" aria-live="polite">
          <span className="spinner" />
        </div>
      )}
    </div>
  );
}
