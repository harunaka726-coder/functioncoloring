import { useEffect, useState } from 'react';
import { DesktopNav, type AppScreen } from './components/DesktopNav';
import { FooterNav, type FooterTab } from './components/FooterNav';
import { LandingModal } from './components/LandingModal';
import { SiteFooter } from './components/SiteFooter';
import { I18nProvider } from './i18n/I18nContext';
import { AlbumScreen } from './screens/AlbumScreen';
import { HomeScreen } from './screens/HomeScreen';
import { HowToScreen } from './screens/HowToScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import type { AlbumProject } from './types/albumProject';

const LANDING_KEY = 'fc_web_landing_seen';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('home');
  const [restoreProject, setRestoreProject] = useState<AlbumProject | null>(
    null,
  );
  const [landingOpen, setLandingOpen] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(LANDING_KEY) !== '1') {
        setLandingOpen(true);
      }
    } catch {
      setLandingOpen(true);
    }
  }, []);

  const dismissLanding = () => {
    try {
      localStorage.setItem(LANDING_KEY, '1');
    } catch {
      /* ignore */
    }
    setLandingOpen(false);
    setScreen('home');
  };

  const footerActive: FooterTab =
    screen === 'home' ? 'home' : screen === 'album' ? 'album' : 'settings';

  const go = (next: AppScreen) => setScreen(next);

  return (
    <I18nProvider>
      <div className="app">
        <DesktopNav screen={screen} onNavigate={go} />

        <div className="app-main">
          <div
            className={`app-page${screen !== 'home' ? ' app-page--hidden' : ''}`}
            aria-hidden={screen !== 'home'}
          >
            <HomeScreen
              restoreProject={restoreProject}
              onRestoreConsumed={() => setRestoreProject(null)}
            />
          </div>
          {screen === 'settings' && (
            <SettingsScreen onOpenHowTo={() => setScreen('howto')} />
          )}
          {screen === 'howto' && (
            <HowToScreen onBack={() => setScreen('home')} />
          )}
          {screen === 'album' && (
            <AlbumScreen
              onReEdit={(project) => {
                setRestoreProject(project);
                setScreen('home');
              }}
            />
          )}
        </div>

        <SiteFooter />

        <FooterNav
          active={footerActive}
          onChange={(tab) => {
            if (tab === 'settings') setScreen('settings');
            else setScreen(tab);
          }}
        />

        <LandingModal open={landingOpen} onStart={dismissLanding} />
      </div>
    </I18nProvider>
  );
}
