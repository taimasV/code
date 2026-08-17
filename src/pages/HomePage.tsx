import { useState } from 'react';
import { Link } from 'wouter';
import { AccountControls } from '../components/AccountControls';
import { DailyStreak } from '../components/DailyStreak';
import { GameCard } from '../components/GameCard';
import { useLanguage } from '../i18n/LanguageContext';
import type { TranslationKey } from '../i18n/en';
import { useCurrentUser } from '../lib/useCurrentUser';

type Category = 'quick' | 'strategy';
type GameDefinition = { title: TranslationKey; icon: string; description: TranslationKey; href: string };

const quickGames: GameDefinition[] = [
  { title: 'gameTicTitle', icon: '❌', description: 'gameTicDesc', href: '/tic-tac-toe' },
  { title: 'gameConnectTitle', icon: '🟡', description: 'gameConnectDesc', href: '/connect-four' },
  { title: 'gameSnakeTitle', icon: '🐍', description: 'gameSnakeDesc', href: '/snake' },
  { title: 'gameMemoryTitle', icon: '🧠', description: 'gameMemoryDesc', href: '/memory' },
  { title: 'gameBattleTitle', icon: '🚢', description: 'gameBattleDesc', href: '/battleship' },
  { title: 'gameReactionTitle', icon: '🎯', description: 'gameReactionDesc', href: '/reaction' },
  { title: 'gameMinesTitle', icon: '💣', description: 'gameMinesDesc', href: '/minesweeper' },
  { title: 'gameMahjongTitle', icon: '🀄', description: 'gameMahjongDesc', href: '/mahjong' },
  { title: 'gameDotsTitle', icon: '🔵', description: 'gameDotsDesc', href: '/connect-dots' },
  { title: 'gameMergeTitle', icon: '🧩', description: 'gameMergeDesc', href: '/merge' },
  { title: 'gameNutsTitle', icon: '🔩', description: 'gameNutsDesc', href: '/nuts-and-bolts' },
];

const strategyGames: GameDefinition[] = [
  { title: 'gameChessTitle', icon: '♟️', description: 'gameChessDesc', href: '/chess' },
  { title: 'gameCheckersTitle', icon: '⚫', description: 'gameCheckersDesc', href: '/checkers' },
  { title: 'gameReversiTitle', icon: '⚪', description: 'gameReversiDesc', href: '/reversi' },
  { title: 'gameQuoridorTitle', icon: '🚧', description: 'gameQuoridorDesc', href: '/quoridor' },
  { title: 'gameDetectiveTitle', icon: '🔎', description: 'gameDetectiveDesc', href: '/detective' },
  { title: 'gameSudokuTitle', icon: '🔢', description: 'gameSudokuDesc', href: '/sudoku' },
  { title: 'gameNonogramTitle', icon: '🖼️', description: 'gameNonogramDesc', href: '/nonogram' },
  { title: 'gameWordleTitle', icon: '🟩', description: 'gameWordleDesc', href: '/wordle' },
];

export function HomePage() {
  const [category, setCategory] = useState<Category>('quick');
  const { t } = useLanguage();
  const { loading, user } = useCurrentUser();
  const games = category === 'quick' ? quickGames : strategyGames;

  return (
    <main className="container home-page">
      <header className="home-header">
        <span className="home-brand">Playroom</span>
        <div className="home-tools"><DailyStreak /><AccountControls /></div>
      </header>
      <section className="hero">
        <span className="eyebrow">{t('collection')}</span>
        <h1>{t('chooseGame')}</h1>
        <p>{t('collectionIntro')}</p>
        {!loading && !user && (
          <div className="hero-actions">
            <Link href="/register" className="hero-button hero-button--primary">{t('createAccount')}</Link>
            <Link href="/login" className="hero-button hero-button--secondary">{t('signIn')}</Link>
          </div>
        )}
      </section>
      <section className="games-section" aria-labelledby="games-title">
        <div className="section-heading"><h2 id="games-title">{t('games')}</h2></div>
        <div className="game-tabs" role="tablist" aria-label={t('games')}>
          <button className={category === 'quick' ? 'game-tab game-tab--active' : 'game-tab'} onClick={() => setCategory('quick')} role="tab" aria-selected={category === 'quick'}>{t('quickGames')} <span>11</span></button>
          <button className={category === 'strategy' ? 'game-tab game-tab--active' : 'game-tab'} onClick={() => setCategory('strategy')} role="tab" aria-selected={category === 'strategy'}>{t('advancedGames')} <span>8</span></button>
        </div>
        <div className="games-grid" role="tabpanel">
          {games.map((game) => <GameCard key={game.title} {...game} title={t(game.title)} description={t(game.description)} />)}
        </div>
      </section>
    </main>
  );
}
