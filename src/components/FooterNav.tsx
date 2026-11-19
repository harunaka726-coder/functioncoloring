import { useI18n } from '../i18n/I18nContext';

export type FooterTab = 'home' | 'album' | 'settings';

type Props = {
  active: FooterTab;
  onChange: (tab: FooterTab) => void;
};

export function FooterNav({ active, onChange }: Props) {
  const { t } = useI18n();

  return (
    <nav className="footer-nav" aria-label="Main">
      <Tab
        label={t('tabHome')}
        active={active === 'home'}
        onPress={() => onChange('home')}
        icon="home"
      />
      <Tab
        label={t('album')}
        active={active === 'album'}
        onPress={() => onChange('album')}
        icon="album"
      />
      <Tab
        label={t('tabSettings')}
        active={active === 'settings'}
        onPress={() => onChange('settings')}
        icon="settings"
      />
    </nav>
  );
}

function Tab({
  label,
  active,
  onPress,
  icon,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  icon: string;
}) {
  return (
    <button
      type="button"
      className={`footer-tab${active ? ' footer-tab--active' : ''}`}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      onClick={onPress}
    >
      <FooterIcon name={icon} />
    </button>
  );
}

function FooterIcon({ name }: { name: string }) {
  if (name === 'home') {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 19V5l8-3 8 3v14H4z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path d="M9 19v-6h6v6" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    );
  }
  if (name === 'album') {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect
          x="3"
          y="5"
          width="18"
          height="14"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <circle cx="8.5" cy="11" r="2" fill="currentColor" />
        <path
          d="M3 16l4-4 3 3 4-5 6 6"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </svg>
    );
  }
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}