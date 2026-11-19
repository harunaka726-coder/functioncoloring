import { useI18n } from '../i18n/I18nContext';

type Props = { onBack: () => void };

export function HowToScreen({ onBack }: Props) {
  const { t } = useI18n();

  return (
    <div className="screen screen--howto">
      <header className="screen-header screen-header--row">
        <button
          type="button"
          className="back-btn"
          onClick={onBack}
          aria-label={t('cancel')}
        >
          ‹
        </button>
        <h1 className="screen-title">{t('howToTitle')}</h1>
        <span className="back-spacer" />
      </header>
      <div className="howto-body">
        <p className="howto-text">{t('howToBody')}</p>
      </div>
    </div>
  );
}