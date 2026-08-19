import { useEffect, useMemo, useState } from 'react';
import { GamePageHeader } from '../components/GamePageHeader';
import { SudokuBoard } from '../components/SudokuBoard';
import { GameWinStreakBadge } from '../components/GameWinStreak';
import { createSudokuPuzzle, hasSudokuMistake, isSudokuComplete, sudokuFixedCells } from '../lib/sudoku';
import { useGameAttempt } from '../lib/useGameAttempt';

export function SudokuPage() {
  const [board, setBoard] = useState(createSudokuPuzzle);
  const [selected, setSelected] = useState<number | null>(null);
  const { attemptId, startNewAttempt } = useGameAttempt();
  const fixed = useMemo(sudokuFixedCells, []);
  const won = isSudokuComplete(board);
  const mistake = hasSudokuMistake(board);

  function enter(value: number | null) {
    if (selected === null || fixed.has(selected) || won) return;
    setBoard((current) => current.map((cell, index) => index === selected ? value : cell));
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (/^[1-9]$/.test(event.key)) enter(Number(event.key));
      if (event.key === 'Backspace' || event.key === 'Delete') enter(null);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  function restart() {
    setBoard(createSudokuPuzzle());
    setSelected(null);
    startNewAttempt();
  }

  const status = won ? 'Puzzle solved! 🎉' : mistake ? 'Some numbers are incorrect' : 'Fill every row, column, and 3×3 box';
  return (
    <main className="container game-page">
      <GamePageHeader number="14" />
      <section className="game-panel game-panel--sudoku">
        <span className="game-icon" aria-hidden="true">🔢</span>
        <h1>Sudoku</h1>
        <p className={`game-status ${won ? 'game-status--winner' : ''}`}>{status}</p>
        <GameWinStreakBadge active attemptId={attemptId} game="sudoku" result={won ? 'win' : null} />
        <SudokuBoard board={board} fixed={fixed} selected={selected} onSelect={setSelected} />
        <div className="sudoku-keypad" aria-label="Number pad">
          {Array.from({ length: 9 }, (_, index) => <button key={index} onClick={() => enter(index + 1)}>{index + 1}</button>)}
          <button onClick={() => enter(null)} aria-label="Erase">⌫</button>
        </div>
        <button className="restart-button" onClick={restart}>Restart</button>
      </section>
    </main>
  );
}
