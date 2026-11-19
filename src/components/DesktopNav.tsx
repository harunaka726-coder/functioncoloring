import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import type { AppLanguage } from '../i18n/translations';

export type AppScreen = 'home' | 'album' | 'howto' | 'settings';

type Props = {
  screen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
};

const LANGS: { value: AppLanguage; label: string }[] = [
  { value: 'ja', label: '日本語' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'zh', label: '中文' },
];

export function DesktopNav({ screen, onNavigate }: Props) {
  const { t, language, setLanguage, resolved } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const langValue: AppLanguage =
    language === 'auto' ? resolved : language;

  return (
    <header className="desktop-header">
      <button
        type="button"
        className="desktop-brand"
        onClick={() => onNavigate('home')}
      >
        {t('appName')}
      </button>
      <div className="desktop-header__right" ref={rootRef}>
        <label className="desktop-lang">
          <span className="visually-hidden">{t('language')}</span>
          <select
            value={langValue}
            aria-label={t('language')}
            onChange={(e) => setLanguage(e.target.value as AppLanguage)}
          >
            {LANGS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className={`desktop-menu-btn${open ? ' desktop-menu-btn--open' : ''}`}
          aria-expanded={open}
          aria-haspopup="menu"
          onClick={() => setOpen((v) => !v)}
        >
          {t('menu')}
          <span aria-hidden>▾</span>
        </button>
        {open && (
          <div className="desktop-menu" role="menu">
            <button
              type="button"
              role="menuitem"
              className={screen === 'home' ? 'is-active' : ''}
              onClick={() => {
                onNavigate('home');
                setOpen(false);
              }}
            >
              {t('tabHome')}
            </button>
            <button
              type="button"
              role="menuitem"
              className={screen === 'album' ? 'is-active' : ''}
              onClick={() => {
                onNavigate('album');
                setOpen(false);
              }}
            >
              {t('album')}
            </button>
            <button
              type="button"
              role="menuitem"
              className={screen === 'howto' ? 'is-active' : ''}
              onClick={() => {
                onNavigate('howto');
                setOpen(false);
              }}
            >
              {t('howToPlay')}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
