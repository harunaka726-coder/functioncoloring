import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  CONTACT_URL,
  PRIVACY_POLICY_URL,
  TRANSLATIONS,
  type AppLanguage,
  type MessageKey,
} from './translations';

const STORAGE_KEY = 'fc_language';

type I18nContextValue = {
  language: AppLanguage;
  resolved: 'ja' | 'en' | 'es' | 'zh';
  setLanguage: (lang: AppLanguage) => void;
  t: (key: MessageKey, vars?: Record<string, string | number>) => string;
  contactUrl: string;
  privacyUrl: string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function resolveDeviceLang(): 'ja' | 'en' | 'es' | 'zh' {
  const code =
    (typeof navigator !== 'undefined'
      ? navigator.language.split('-')[0]
      : 'en'
    ).toLowerCase() ?? 'en';
  if (code.startsWith('ja')) return 'ja';
  if (code.startsWith('es')) return 'es';
  if (code.startsWith('zh')) return 'zh';
  return 'en';
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v === 'auto' || v === 'ja' || v === 'en' || v === 'es' || v === 'zh') {
        return v;
      }
    } catch {
      /* ignore */
    }
    return 'auto';
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      /* ignore */
    }
  }, [language]);

  const setLanguage = useCallback((lang: AppLanguage) => {
    setLanguageState(lang);
  }, []);

  const resolved = language === 'auto' ? resolveDeviceLang() : language;

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      resolved,
      setLanguage,
      t: (key, vars) => {
        let s = TRANSLATIONS[resolved][key] ?? TRANSLATIONS.en[key] ?? key;
        if (vars) {
          for (const [k, v] of Object.entries(vars)) {
            s = s.split(`{${k}}`).join(String(v));
          }
        }
        return s;
      },
      contactUrl: resolved === 'ja' ? CONTACT_URL.ja : CONTACT_URL.en,
      privacyUrl: PRIVACY_POLICY_URL,
    }),
    [language, resolved, setLanguage],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}