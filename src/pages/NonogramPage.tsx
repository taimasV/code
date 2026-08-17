import { useState } from 'react';
import { GamePageHeader } from '../components/GamePageHeader';
import { NonogramBoard } from '../components/NonogramBoard';
import { GameRules } from '../components/GameRules';
import { createNonogramBoard, isNonogramComplete, NONOGRAM_PUZZLES, type NonogramMark } from '../lib/nonogram';

export function NonogramPage() {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [board, setBoard] = useState(createNonogramBoard);
  const puzzle = NONOGRAM_PUZZLES[puzzleIndex];
  const won = isNonogramComplete(board, puzzle);

  function change(cell: number, mark: NonogramMark) {
    setBoard((current) => current.map((value, index) => index === cell ? mark : value));
  }
  function nextPuzzle() {
    setPuzzleIndex((current) => (current + 1) % NONOGRAM_PUZZLES.length);
    setBoard(createNonogramBoard());
  }
  return (
    <main className="container game-page">
      <GamePageHeader number="15" />
      <section className="game-panel game-panel--nonogram">
        <span className="game-icon" aria-hidden="true">🖼️</span>
        <h1>Nonogram</h1>
        <p className={`game-status ${won ? 'game-status--winner' : ''}`}>{won ? 'Picture complete! 🎉' : `Puzzle ${puzzleIndex + 1} · Use the clues to reveal the picture`}</p>
        <GameRules
          rules={[
            'Numbers beside a row describe groups of filled squares in that row.',
            'Numbers above a column describe groups of filled squares in that column.',
            'Groups appear in the shown order and have at least one empty square between them.',
            'Fill the correct squares to reveal the hidden picture.',
          ]}
          tip="Click to fill a square. Right-click squares you know are empty to mark them with ×. Crosses are optional."
        />
        <NonogramBoard board={board} puzzle={puzzle} locked={won} onChange={change} />
        <p className="game-hint">Click to fill a square. Right-click to mark an empty square with ×.</p>
        <div className="chess-actions">
          <button className="restart-button" onClick={() => setBoard(createNonogramBoard())}>Restart</button>
          <button className="restart-button restart-button--quiet" onClick={nextPuzzle}>Next puzzle</button>
        </div>
      </section>
    </main>
  );
}
