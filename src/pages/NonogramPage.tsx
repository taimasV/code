import { useState } from 'react';
import { GamePageHeader } from '../components/GamePageHeader';
import { NonogramBoard } from '../components/NonogramBoard';
import { GameWinStreakBadge } from '../components/GameWinStreak';
import { createNonogramBoard, isNonogramComplete, NONOGRAM_PUZZLES, type NonogramMark } from '../lib/nonogram';
import { useGameAttempt } from '../lib/useGameAttempt';

export function NonogramPage() {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [board, setBoard] = useState(createNonogramBoard);
  const { attemptId, startNewAttempt } = useGameAttempt();
  const puzzle = NONOGRAM_PUZZLES[puzzleIndex];
  const won = isNonogramComplete(board, puzzle);

  function change(cell: number, mark: NonogramMark) {
    setBoard((current) => current.map((value, index) => index === cell ? mark : value));
  }
  function nextPuzzle() {
    setPuzzleIndex((current) => (current + 1) % NONOGRAM_PUZZLES.length);
    setBoard(createNonogramBoard());
    startNewAttempt();
  }
  function restart() {
    setBoard(createNonogramBoard());
    startNewAttempt();
  }
  return (
    <main className="container game-page">
      <GamePageHeader number="15" />
      <section className="game-panel game-panel--nonogram">
        <span className="game-icon" aria-hidden="true">🖼️</span>
        <h1>Nonogram</h1>
        <p className={`game-status ${won ? 'game-status--winner' : ''}`}>{won ? 'Picture complete! 🎉' : `Puzzle ${puzzleIndex + 1} · Use the clues to reveal the picture`}</p>
        <GameWinStreakBadge active attemptId={attemptId} game="nonogram" result={won ? 'win' : null} />
        <NonogramBoard board={board} puzzle={puzzle} locked={won} onChange={change} />
        <p className="game-hint">Click to fill a square. Right-click to mark an empty square with ×.</p>
        <div className="chess-actions">
          <button className="restart-button" onClick={restart}>Restart</button>
          <button className="restart-button restart-button--quiet" onClick={nextPuzzle}>Next puzzle</button>
        </div>
      </section>
    </main>
  );
}
