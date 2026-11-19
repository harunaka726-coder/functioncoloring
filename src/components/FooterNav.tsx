import type { ReactNode } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { Icons } from './Icons';

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
        icon={Icons.home(active === 'home')}
      />
      <Tab
        label={t('album')}
        active={active === 'album'}
        onPress={() => onChange('album')}
        icon={Icons.album(active === 'album')}
      />
      <Tab
        label={t('tabSettings')}
        active={active === 'settings'}
        onPress={() => onChange('settings')}
        icon={Icons.settings(active === 'settings')}
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
  icon: ReactNode;
}) {
  return (
    <button
      type="button"
      className={`footer-tab${active ? ' footer-tab--active' : ''}`}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      onClick={onPress}
    >
      {icon}
    </button>
  );
}
