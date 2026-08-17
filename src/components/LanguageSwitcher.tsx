import { useLanguage, type Language } from '../i18n/LanguageContext';
import './language-switcher.css';

const languages: Language[] = ['en', 'ru', 'fr'];

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <div className="language-switcher" aria-label={t('language')}>
      {languages.map((option) => (
        <button
          aria-pressed={language === option}
          className={language === option ? 'language-switcher__button language-switcher__button--active' : 'language-switcher__button'}
          key={option}
          onClick={() => setLanguage(option)}
          type="button"
        >{option.toUpperCase()}</button>
      ))}
    </div>
  );
}
