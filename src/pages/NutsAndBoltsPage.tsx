import { useState } from 'react';
import { GamePageHeader } from '../components/GamePageHeader';
import { NutsAndBoltsBoard } from '../components/NutsAndBoltsBoard';
import { NutsDifficultySelect } from '../components/NutsDifficultySelect';
import { GameWinStreakBadge } from '../components/GameWinStreak';
import { canMoveNut, createNutsBoard, isNutsPuzzleSolved, moveNut, type NutsBoard, type NutsDifficulty } from '../lib/nutsAndBolts';
import { useGameAttempt } from '../lib/useGameAttempt';

export function NutsAndBoltsPage() {
  const [difficulty, setDifficulty] = useState<NutsDifficulty>('easy');
  const [board, setBoard] = useState(() => createNutsBoard('easy'));
  const [selected, setSelected] = useState<number | null>(null);
  const [history, setHistory] = useState<NutsBoard[]>([]);
  const { attemptId, startNewAttempt } = useGameAttempt();
  const solved = isNutsPuzzleSolved(board);

  function selectBolt(bolt: number) {
    if (solved) return;
    if (selected === null) {
      if (board[bolt].length > 0) setSelected(bolt);
      return;
    }
    if (selected === bolt) {
      setSelected(null);
      return;
    }
    if (canMoveNut(board, selected, bolt)) {
      setHistory((current) => [...current, board]);
      setBoard(moveNut(board, selected, bolt));
      setSelected(null);
      return;
    }
    if (board[bolt].length > 0) setSelected(bolt);
  }

  function undo() {
    const previous = history[history.length - 1];
    if (!previous) return;
    setBoard(previous);
    setHistory((current) => current.slice(0, -1));
    setSelected(null);
  }

  function restart() {
    setBoard(createNutsBoard(difficulty));
    setHistory([]);
    setSelected(null);
    startNewAttempt();
  }

  function changeDifficulty(nextDifficulty: NutsDifficulty) {
    setDifficulty(nextDifficulty);
    setBoard(createNutsBoard(nextDifficulty));
    setHistory([]);
    setSelected(null);
    startNewAttempt();
  }

  return (
    <main className="container game-page">
      <GamePageHeader number="19" />
      <section className="game-panel game-panel--nuts">
        <span className="game-icon" aria-hidden="true">🔩</span>
        <h1>Nuts and Bolts</h1>
        <p className={`game-status ${solved ? 'game-status--winner' : ''}`}>
          {solved ? `Sorted in ${history.length} moves! 🎉` : `Moves: ${history.length}`}
        </p>
        <GameWinStreakBadge active attemptId={attemptId} game="nuts-and-bolts" result={solved ? 'win' : null} />
        <NutsDifficultySelect value={difficulty} onChange={changeDifficulty} />
        <NutsAndBoltsBoard board={board} selected={selected} onSelect={selectBolt} />
        <p className="game-hint">{selected === null ? 'Choose a bolt.' : 'Now choose where to move the top nut.'}</p>
        <div className="nuts-actions">
          <button className="mine-tool" disabled={history.length === 0} onClick={undo}>Undo</button>
          <button className="restart-button" onClick={restart}>Restart</button>
        </div>
      </section>
    </main>
  );
}
