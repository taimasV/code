import { useState } from 'react';
import { GameCard } from '../components/GameCard';

type Category = 'quick' | 'strategy';

const quickGames = [
  { title: 'Tic-Tac-Toe', icon: '❌', description: 'Get three symbols in a row', href: '/tic-tac-toe' },
  { title: 'Connect 4', icon: '🟡', description: 'Connect four pieces in a row', href: '/connect-four' },
  { title: 'Snake', icon: '🐍', description: 'Grow without hitting your tail', href: '/snake' },
  { title: 'Memory', icon: '🧠', description: 'Find all the matching pairs', href: '/memory' },
  { title: 'Battleship', icon: '🚢', description: 'Find and sink the enemy fleet', href: '/battleship' },
  { title: 'Aim / Reaction', icon: '🎯', description: 'Test your reaction speed' },
  { title: 'Minesweeper', icon: '💣', description: 'Clear the field using clues', href: '/minesweeper' },
];

const strategyGames = [
  { title: 'Chess', icon: '♟️', description: 'The classic game of strategy', href: '/chess' },
  { title: 'Checkers', icon: '⚫', description: 'Lead your pieces to promotion', href: '/checkers' },
  { title: 'Reversi', icon: '⚪', description: 'Capture more pieces than your rival' },
  { title: 'Detective', icon: '🔎', description: 'Solve clues and uncover the mystery' },
];

export function HomePage() {
  const [category, setCategory] = useState<Category>('quick');
  const games = category === 'quick' ? quickGames : strategyGames;

  return (
    <main className="container home-page">
      <section className="hero">
        <span className="eyebrow">Your game collection</span>
        <h1>Choose a game<br />and play</h1>
        <p>Eleven favorite games in one place.</p>
      </section>

      <section className="games-section" aria-labelledby="games-title">
        <div className="section-heading">
          <h2 id="games-title">Games</h2>
          <span>8 of 11 ready</span>
        </div>
        <div className="game-tabs" role="tablist" aria-label="Game categories">
          <button
            className={category === 'quick' ? 'game-tab game-tab--active' : 'game-tab'}
            onClick={() => setCategory('quick')}
            role="tab"
            aria-selected={category === 'quick'}
          >
            Quick games <span>7</span>
          </button>
          <button
            className={category === 'strategy' ? 'game-tab game-tab--active' : 'game-tab'}
            onClick={() => setCategory('strategy')}
            role="tab"
            aria-selected={category === 'strategy'}
          >
            Advanced games <span>4</span>
          </button>
        </div>
        <div className="games-grid" role="tabpanel">
          {games.map((game) => <GameCard key={game.title} {...game} />)}
        </div>
      </section>
    </main>
  );
}
