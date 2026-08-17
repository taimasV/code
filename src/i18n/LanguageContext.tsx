import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { en, type TranslationKey } from './en';
import { fr } from './fr';
import { ru } from './ru';

export type Language = 'en' | 'ru' | 'fr';
type Variables = Record<string, string | number>;
type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, variables?: Variables) => string;
};

const dictionaries = { en, ru, fr };
const LanguageContext = createContext<LanguageContextValue | null>(null);

function getInitialLanguage(): Language {
  const saved = localStorage.getItem('playroom-language');
  if (saved === 'en' || saved === 'ru' || saved === 'fr') return saved;
  if (navigator.language.toLowerCase().startsWith('ru')) return 'ru';
  if (navigator.language.toLowerCase().startsWith('fr')) return 'fr';
  return 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    localStorage.setItem('playroom-language', language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage,
    t: (key, variables) => Object.entries(variables ?? {}).reduce(
      (text, [name, replacement]) => text.split(`{${name}}`).join(String(replacement)),
      dictionaries[language][key],
    ),
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
}
