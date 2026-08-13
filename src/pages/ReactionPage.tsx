import { useState } from 'react';
import { AimChallenge } from '../components/AimChallenge';
import { GamePageHeader } from '../components/GamePageHeader';
import { ReactionTest } from '../components/ReactionTest';

type ReactionMode = 'aim' | 'reaction';

export function ReactionPage() {
  const [mode, setMode] = useState<ReactionMode>('aim');

  return (
    <main className="container game-page">
      <GamePageHeader number="06" />
      <section className="game-panel game-panel--reaction">
        <span className="game-icon" aria-hidden="true">🎯</span>
        <h1>Aim / Reaction</h1>
        <div className="difficulty-tabs" aria-label="Game mode">
          <button className={mode === 'aim' ? 'difficulty-tab difficulty-tab--active' : 'difficulty-tab'} onClick={() => setMode('aim')}>Aim Challenge <span>30 seconds</span></button>
          <button className={mode === 'reaction' ? 'difficulty-tab difficulty-tab--active' : 'difficulty-tab'} onClick={() => setMode('reaction')}>Reaction Test <span>5 rounds</span></button>
        </div>
        {mode === 'aim' ? <AimChallenge key="aim" /> : <ReactionTest key="reaction" />}
      </section>
    </main>
  );
}
