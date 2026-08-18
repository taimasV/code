import { useState } from 'react';
import { Dartboard } from '../components/Dartboard';
import { GamePageHeader } from '../components/GamePageHeader';
import type { DartThrow } from '../lib/darts';

const MAX_THROWS = 9;

export function DartsPage() {
  const [throws, setThrows] = useState<DartThrow[]>([]);
  const total = throws.reduce((score, dart) => score + dart.score, 0);
  const finished = throws.length === MAX_THROWS;
  const latest = throws[throws.length - 1];

  function restart() {
    setThrows([]);
  }

  return (
    <main className="container game-page">
      <GamePageHeader number="21" />
      <section className="game-panel game-panel--darts">
        <span className="game-icon" aria-hidden="true">🎯</span>
        <h1>Darts</h1>
        <p className="game-status">{finished ? `Game over · ${total} points` : latest ? `${latest.label}: +${latest.score}` : 'Stop both sliders to throw'}</p>
        <div className="darts-cabinet">
          <div className="darts-cabinet__brand"><span>★</span> PLAYROOM DARTS <span>★</span></div>
          <div className="darts-stats">
            <span>Score <strong>{total}</strong></span>
            <span>Darts <strong>{throws.length} / {MAX_THROWS}</strong></span>
            <span>Round <strong>{Math.min(3, Math.floor(throws.length / 3) + 1)} / 3</strong></span>
          </div>
          <Dartboard disabled={finished} throws={throws} onThrow={(dart) => setThrows((current) => [...current, dart])} />
          <div className="darts-history">
            {throws.length === 0 ? <span className="darts-empty">Your throws will appear here</span> : throws.map((dart, index) => <span key={index}>{index + 1}. {dart.score}</span>)}
          </div>
        </div>
        <button className="restart-button" onClick={restart}>{finished ? 'Play again' : 'Restart'}</button>
      </section>
    </main>
  );
}
