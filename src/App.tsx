import { useState } from 'react';
import { FooterNav, type FooterTab } from './components/FooterNav';
import { I18nProvider } from './i18n/I18nContext';
import { AlbumScreen } from './screens/AlbumScreen';
import { HomeScreen } from './screens/HomeScreen';
import { HowToScreen } from './screens/HowToScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import type { AlbumProject } from './types/albumProject';

type Screen = 'home' | 'settings' | 'howto' | 'album';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [restoreProject, setRestoreProject] = useState<AlbumProject | null>(
    null,
  );

  const footerActive: FooterTab =
    screen === 'home' ? 'home' : screen === 'album' ? 'album' : 'settings';

  return (
    <I18nProvider>
      <div className="app">
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
          <HowToScreen onBack={() => setScreen('settings')} />
        )}
        {screen === 'album' && (
          <AlbumScreen
            onReEdit={(project) => {
              setRestoreProject(project);
              setScreen('home');
            }}
          />
        )}
        <FooterNav
          active={footerActive}
          onChange={(tab) => setScreen(tab)}
        />
      </div>
    </I18nProvider>
  );
}