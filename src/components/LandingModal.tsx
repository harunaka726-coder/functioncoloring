import { useI18n } from '../i18n/I18nContext';

type Props = {
  open: boolean;
  onStart: () => void;
};

export function LandingModal({ open, onStart }: Props) {
  const { t } = useI18n();
  if (!open) return null;

  return (
    <div className="landing-backdrop" role="dialog" aria-modal="true">
      <div className="landing-card">
        <p className="landing-kicker">{t('appName')}</p>
        <h1 className="landing-title">{t('howToTitle')}</h1>
        <p className="landing-body">{t('howToBody')}</p>
        <button type="button" className="landing-cta" onClick={onStart}>
          {t('tryIt')}
        </button>
      </div>
    </div>
  );
}
