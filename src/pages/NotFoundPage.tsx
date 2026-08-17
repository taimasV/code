import { Link } from 'wouter';
import { useLanguage } from '../i18n/LanguageContext';

export function NotFoundPage() {
  const { t } = useLanguage();
  return (
    <main className="container">
      <section className="hello">
        <h1>{t('pageNotFound')}</h1>
        <p><Link href="/games">{t('returnGames')}</Link></p>
      </section>
    </main>
  );
}
