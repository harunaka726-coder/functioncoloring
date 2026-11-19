import { IoGlobeOutline } from 'react-icons/io5';
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
      <div className="desktop-header__right">
        <nav className="desktop-links" aria-label="Main">
          <button
            type="button"
            className={screen === 'home' ? 'is-active' : ''}
            onClick={() => onNavigate('home')}
          >
            {t('tabHome')}
          </button>
          <button
            type="button"
            className={screen === 'album' ? 'is-active' : ''}
            onClick={() => onNavigate('album')}
          >
            {t('album')}
          </button>
          <button
            type="button"
            className={screen === 'howto' ? 'is-active' : ''}
            onClick={() => onNavigate('howto')}
          >
            {t('howToPlay')}
          </button>
        </nav>
        <label className="desktop-lang">
          <IoGlobeOutline size={18} aria-hidden />
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
      </div>
    </header>
  );
}
