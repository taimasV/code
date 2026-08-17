import { useState } from 'react';
import { Link } from 'wouter';
import { GameCard } from '../components/GameCard';
import { AccountControls } from '../components/AccountControls';
import { DailyStreak } from '../components/DailyStreak';

type Category = 'quick' | 'strategy';

const quickGames = [
  { title: 'Tic-Tac-Toe', icon: '❌', description: 'Get three symbols in a row', href: '/tic-tac-toe' },
  { title: 'Connect 4', icon: '🟡', description: 'Connect four pieces in a row', href: '/connect-four' },
  { title: 'Snake', icon: '🐍', description: 'Grow without hitting your tail', href: '/snake' },
  { title: 'Memory', icon: '🧠', description: 'Find all the matching pairs', href: '/memory' },
  { title: 'Battleship', icon: '🚢', description: 'Find and sink the enemy fleet', href: '/battleship' },
  { title: 'Aim / Reaction', icon: '🎯', description: 'Test your reaction speed', href: '/reaction' },
  { title: 'Minesweeper', icon: '💣', description: 'Clear the field using clues', href: '/minesweeper' },
  { title: 'Mahjong', icon: '🀄', description: 'Match open pairs of tiles', href: '/mahjong' },
  { title: 'Connect Dots', icon: '🔵', description: 'Fill the board with colored paths', href: '/connect-dots' },
  { title: 'Merge Garden', icon: '🧩', description: 'Find and combine items to improve them', href: '/merge' },
  { title: 'Nuts and Bolts', icon: '🔩', description: 'Sort every nut by color', href: '/nuts-and-bolts' },
];

const strategyGames = [
  { title: 'Chess', icon: '♟️', description: 'The classic game of strategy', href: '/chess' },
  { title: 'Checkers', icon: '⚫', description: 'Lead your pieces to promotion', href: '/checkers' },
  { title: 'Reversi', icon: '⚪', description: 'Capture more pieces than your rival', href: '/reversi' },
  { title: 'Quoridor', icon: '🚧', description: 'Race across the board and build walls', href: '/quoridor' },
  { title: 'Detective', icon: '🔎', description: 'Study clues and solve every mystery', href: '/detective' },
  { title: 'Sudoku', icon: '🔢', description: 'Complete every row, column, and box', href: '/sudoku' },
  { title: 'Nonogram', icon: '🖼️', description: 'Reveal pictures using number clues', href: '/nonogram' },
  { title: 'Wordle', icon: '🟩', description: 'Guess a hidden word in six tries', href: '/wordle' },
];

export function HomePage() {
  const [category, setCategory] = useState<Category>('quick');
  const games = category === 'quick' ? quickGames : strategyGames;
  return (
    <main className="container home-page">
      <header className="home-header">
        <span className="home-brand">Playroom</span>
        <div className="home-tools"><DailyStreak /><AccountControls /></div>
      </header>
      <section className="hero">
        <span className="eyebrow">Your game collection</span>
        <h1>Choose a game<br />and play</h1>
        <p>Nineteen favorite games in one place.</p>
        <div className="hero-actions">
          <Link href="/register" className="hero-button hero-button--primary">Create account</Link>
          <Link href="/login" className="hero-button hero-button--secondary">Sign in</Link>
        </div>
      </section>
      <section className="games-section" aria-labelledby="games-title">
        <div className="section-heading"><h2 id="games-title">Games</h2></div>
        <div className="game-tabs" role="tablist" aria-label="Game categories">
          <button className={category === 'quick' ? 'game-tab game-tab--active' : 'game-tab'} onClick={() => setCategory('quick')} role="tab" aria-selected={category === 'quick'}>Quick games <span>11</span></button>
          <button className={category === 'strategy' ? 'game-tab game-tab--active' : 'game-tab'} onClick={() => setCategory('strategy')} role="tab" aria-selected={category === 'strategy'}>Advanced games <span>8</span></button>
        </div>
        <div className="games-grid" role="tabpanel">{games.map((game) => <GameCard key={game.title} {...game} />)}</div>
      </section>
    </main>
  );
}
