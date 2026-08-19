import { Link } from 'wouter';
import { useLanguage } from '../i18n/LanguageContext';
import { GameRules } from './GameRules';

export function GamePageHeader({ number }: { number: string }) {
  const { t } = useLanguage();
  return (
    <header className="game-header">
      <Link href="/games" className="back-link">{t('allGames')}</Link>
      <div className="game-header__tools">
        <span className="game-number">{number} / 22</span>
        <GameRules gameNumber={number} />
      </div>
    </header>
  );
}
