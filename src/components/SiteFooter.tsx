import { useI18n } from '../i18n/I18nContext';
import { AdSlot } from './AdSlot';

export function SiteFooter() {
  const { t, contactUrl, privacyUrl } = useI18n();

  return (
    <footer className="site-footer">
      <AdSlot className="ad-slot--footer" />
      <p className="site-footer__copy">© 2026 Haru Nakajima</p>
      <nav className="site-footer__links" aria-label="Site">
        <a href={privacyUrl} target="_blank" rel="noopener noreferrer">
          {t('privacyPolicy')}
        </a>
        <a href={contactUrl} target="_blank" rel="noopener noreferrer">
          {t('contact')}
        </a>
        <a
          href="https://harunakajima.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('otherWorks')}
        </a>
      </nav>
    </footer>
  );
}
