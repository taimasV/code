import { useLanguage } from '../i18n/LanguageContext';

export function SupabaseSetupMessage() {
  const { t } = useLanguage();
  return (
    <section className="card">
      <h2>{t('connectSupabase')}</h2>
      <p className="message">
        {t('supabaseHelp')}
      </p>
    </section>
  );
}
