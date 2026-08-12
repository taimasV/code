import { useEffect, useState } from 'react';
import { GamePageHeader } from '../components/GamePageHeader';
import { MemoryBoard } from '../components/MemoryBoard';
import { MEMORY_DIFFICULTIES, createMemoryDeck } from '../lib/memory';

export function MemoryPage() {
  const [difficulty, setDifficulty] = useState(MEMORY_DIFFICULTIES[0]);
  const [cards, setCards] = useState(() => createMemoryDeck(difficulty.pairs));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const hasWon = matched.length === cards.length;

  useEffect(() => {
    if (flipped.length !== 2) return;
    const [first, second] = flipped;
    const isMatch = cards[first].symbol === cards[second].symbol;
    const timer = window.setTimeout(() => {
      if (isMatch) setMatched((current) => [...current, first, second]);
      setFlipped([]);
    }, isMatch ? 500 : 1000);
    return () => window.clearTimeout(timer);
  }, [cards, flipped]);

  function flipCard(index: number) {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;
    if (flipped.length === 1) setMoves((current) => current + 1);
    setFlipped((current) => [...current, index]);
  }

  function startGame(nextDifficulty = difficulty) {
    setDifficulty(nextDifficulty);
    setCards(createMemoryDeck(nextDifficulty.pairs));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  }

  return (
    <main className="container game-page">
      <GamePageHeader number="04" />
      <section className="game-panel game-panel--memory">
        <span className="game-icon" aria-hidden="true">🧠</span>
        <h1>Memory</h1>
        <div className="difficulty-tabs" aria-label="Difficulty">
          {MEMORY_DIFFICULTIES.map((option) => (
            <button
              className={difficulty.id === option.id ? 'difficulty-tab difficulty-tab--active' : 'difficulty-tab'}
              key={option.id}
              onClick={() => startGame(option)}
            >
              {option.label} <span>{option.pairs} pairs</span>
            </button>
          ))}
        </div>
        <p className={`game-status ${hasWon ? 'game-status--winner' : ''}`}>
          {hasWon ? `You won in ${moves} moves! 🎉` : `Moves: ${moves}`}
        </p>
        <MemoryBoard cards={cards} columns={difficulty.columns} flipped={flipped} matched={matched} onCardClick={flipCard} />
        <button className="restart-button" onClick={() => startGame()}>Shuffle cards</button>
      </section>
    </main>
  );
}
