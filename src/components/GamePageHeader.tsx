import { Link } from 'wouter';
import { useLanguage } from '../i18n/LanguageContext';

export function GamePageHeader({ number }: { number: string }) {
  const { t } = useLanguage();
  return (
    <header className="game-header">
      <Link href="/games" className="back-link">{t('allGames')}</Link>
      <span className="game-number">{number} / 19</span>
    </header>
  );
}
