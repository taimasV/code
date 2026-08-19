import { useCallback, useEffect, useState } from 'react';
import { GamePageHeader } from '../components/GamePageHeader';
import { GameWinStreakBadge } from '../components/GameWinStreak';
import { WordleBoard } from '../components/WordleBoard';
import { WordleKeyboard } from '../components/WordleKeyboard';
import { chooseWord, keyboardResults, type WordleLength } from '../lib/wordle';
import { useGameAttempt } from '../lib/useGameAttempt';

export function WordlePage() {
  const [length, setLength] = useState<WordleLength>(5);
  const [answer, setAnswer] = useState(() => chooseWord(5));
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState('');
  const { attemptId, startNewAttempt } = useGameAttempt();
  const won = guesses.includes(answer);
  const lost = !won && guesses.length === 6;

  const press = useCallback((key: string) => {
    if (won || lost) return;
    if (key === 'BACKSPACE') {
      setCurrent((word) => word.slice(0, -1));
      return;
    }
    if (key === 'ENTER') {
      if (current.length !== length) return;
      setGuesses((items) => [...items, current]);
      setCurrent('');
      return;
    }
    if (/^[A-Z]$/.test(key) && current.length < length) {
      setCurrent((word) => word + key);
    }
  }, [current, length, lost, won]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (/^[a-zA-Z]$/.test(event.key)) press(event.key.toUpperCase());
      else if (event.key === 'Enter') press('ENTER');
      else if (event.key === 'Backspace' || event.key === 'Delete') press('BACKSPACE');
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [press]);

  function start(nextLength = length) {
    setLength(nextLength);
    setAnswer(chooseWord(nextLength, nextLength === length ? answer : undefined));
    setGuesses([]);
    setCurrent('');
    startNewAttempt();
  }

  const status = won ? `You found ${answer}! 🎉` : lost ? `The word was ${answer}` : `${6 - guesses.length} guesses left`;
  return (
    <main className="container game-page">
      <GamePageHeader number="16" />
      <section className="game-panel game-panel--wordle">
        <span className="game-icon" aria-hidden="true">🟩</span>
        <h1>Wordle</h1>
        <div className="difficulty-tabs" aria-label="Word length">
          {([5, 6] as WordleLength[]).map((option) => <button className={length === option ? 'difficulty-tab difficulty-tab--active' : 'difficulty-tab'} key={option} onClick={() => start(option)}>{option} letters<span>6 guesses</span></button>)}
        </div>
        <p className={`game-status ${won ? 'game-status--winner' : ''}`}>{status}</p>
        <GameWinStreakBadge active attemptId={attemptId} game="wordle" result={won ? 'win' : lost ? 'loss' : null} />
        <WordleBoard answer={answer} current={current} guesses={guesses} length={length} />
        <WordleKeyboard results={keyboardResults(guesses, answer)} onKey={press} />
        <button className="restart-button" onClick={() => start()}>New word</button>
      </section>
    </main>
  );
}
