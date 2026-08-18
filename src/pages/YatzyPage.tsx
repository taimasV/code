import { useState } from 'react';
import { GamePageHeader } from '../components/GamePageHeader';
import { YatzyDice } from '../components/YatzyDice';
import { rollYatzyDice, yatzyCategories } from '../lib/yatzy';

const emptyDice = [1, 1, 1, 1, 1];
const emptyHeld = [false, false, false, false, false];

export function YatzyPage() {
  const [dice, setDice] = useState(emptyDice);
  const [held, setHeld] = useState(emptyHeld);
  const [rollsLeft, setRollsLeft] = useState(3);
  const [hasRolled, setHasRolled] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});
  const finished = Object.keys(scores).length === yatzyCategories.length;
  const upper = yatzyCategories.slice(0, 6).reduce((total, category) => total + (scores[category.id] ?? 0), 0);
  const bonus = upper >= 63 ? 35 : 0;
  const total = Object.values(scores).reduce((sum, score) => sum + score, 0) + bonus;

  function roll() {
    if (rollsLeft === 0 || finished) return;
    setDice((current) => rollYatzyDice(current, held));
    setRollsLeft((left) => left - 1);
    setHasRolled(true);
  }

  function chooseCategory(id: string, score: number) {
    if (!hasRolled || scores[id] !== undefined) return;
    setScores((current) => ({ ...current, [id]: score }));
    setDice(emptyDice);
    setHeld(emptyHeld);
    setRollsLeft(3);
    setHasRolled(false);
  }

  function restart() {
    setDice(emptyDice);
    setHeld(emptyHeld);
    setRollsLeft(3);
    setHasRolled(false);
    setScores({});
  }

  return (
    <main className="container game-page">
      <GamePageHeader number="22" />
      <section className="game-panel game-panel--yatzy">
        <span className="game-icon" aria-hidden="true">🎲</span>
        <h1>Yatzy</h1>
        <p className="game-status">{finished ? `Final score: ${total}` : `Round ${Object.keys(scores).length + 1} of 13`}</p>
        <div className="yatzy-table">
          <span className="yatzy-table__label">ROLL • HOLD • SCORE</span>
          <YatzyDice dice={dice} held={held} canHold={hasRolled && !finished} onToggle={(index) => setHeld((current) => current.map((value, dieIndex) => dieIndex === index ? !value : value))} />
          <button className="restart-button yatzy-roll" disabled={rollsLeft === 0 || finished} onClick={roll}>Roll dice <span>{rollsLeft} left</span></button>
          <p className="game-hint">Roll up to three times. Click dice to hold them, then choose a score.</p>
        </div>
        <div className="yatzy-scorecard">
          {yatzyCategories.map((category) => {
            const saved = scores[category.id];
            const preview = hasRolled ? category.score(dice) : 0;
            const className = saved !== undefined ? 'yatzy-score yatzy-score--saved' : 'yatzy-score';
            return <button className={className} disabled={!hasRolled || saved !== undefined || finished} key={category.id} onClick={() => chooseCategory(category.id, preview)}><span>{category.label}</span><strong>{saved ?? (hasRolled ? preview : '—')}</strong></button>;
          })}
        </div>
        <div className="yatzy-total"><span>Upper bonus: <strong>{bonus}</strong></span><span>Total: <strong>{total}</strong></span></div>
        {finished && <button className="restart-button" onClick={restart}>Play again</button>}
      </section>
    </main>
  );
}
