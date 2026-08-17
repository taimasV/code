import { useEffect, useState } from 'react';
import { GamePageHeader } from '../components/GamePageHeader';
import { MinesweeperBoard } from '../components/MinesweeperBoard';
import { GameWinStreakBadge } from '../components/GameWinStreak';
import {
  MINE_DIFFICULTIES, createEmptyMineBoard, createMineBoard,
  revealCells, toggleFlag,
} from '../lib/minesweeper';
import { useGameAttempt } from '../lib/useGameAttempt';

type Tool = 'reveal' | 'flag';

export function MinesweeperPage() {
  const [difficulty, setDifficulty] = useState(MINE_DIFFICULTIES[0]);
  const [board, setBoard] = useState(() => createEmptyMineBoard(difficulty.size));
  const [started, setStarted] = useState(false);
  const [lost, setLost] = useState(false);
  const [tool, setTool] = useState<Tool>('reveal');
  const [seconds, setSeconds] = useState(0);
  const { attemptId, startNewAttempt } = useGameAttempt();
  const won = started && !lost && board.every((cell) => cell.isMine || cell.revealed);
  const flags = board.filter((cell) => cell.flagged).length;

  useEffect(() => {
    if (!started || lost || won) return;
    const timer = window.setInterval(() => setSeconds((current) => current + 1), 1000);
    return () => window.clearInterval(timer);
  }, [started, lost, won]);

  function reveal(index: number) {
    if (lost || won) return;
    if (tool === 'flag') {
      flag(index);
      return;
    }
    const current = started ? board : createMineBoard(index, difficulty);
    if (!started) setStarted(true);
    if (current[index].flagged) return;
    if (current[index].isMine) setLost(true);
    setBoard(revealCells(current, index, difficulty.size));
  }

  function flag(index: number) {
    const canAddFlag = board[index].flagged || flags < difficulty.mines;
    if (started && !lost && !won && canAddFlag) setBoard(toggleFlag(board, index));
  }

  function startGame(nextDifficulty = difficulty) {
    setDifficulty(nextDifficulty);
    setBoard(createEmptyMineBoard(nextDifficulty.size));
    setStarted(false);
    setLost(false);
    setTool('reveal');
    setSeconds(0);
    startNewAttempt();
  }

  const status = lost ? 'Boom! Try again 💥' : won ? 'Field cleared! 🎉' : `${difficulty.mines - flags} mines left`;
  const time = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  return (
    <main className="container game-page">
      <GamePageHeader number="07" />
      <section className="game-panel game-panel--mines">
        <span className="game-icon" aria-hidden="true">💣</span>
        <h1>Minesweeper</h1>
        <div className="difficulty-tabs" aria-label="Difficulty">
          {MINE_DIFFICULTIES.map((option) => (
            <button
              className={difficulty.id === option.id ? 'difficulty-tab difficulty-tab--active' : 'difficulty-tab'}
              key={option.id}
              onClick={() => startGame(option)}
            >
              {option.label} <span>{option.mines} mines</span>
            </button>
          ))}
        </div>
        <div className="mine-stats">
          <p className={`game-status ${won ? 'game-status--winner' : ''}`}>{status}</p>
          <p className="game-timer" aria-label={`Time ${time}`}>⏱ {time}</p>
        </div>
        <GameWinStreakBadge active attemptId={attemptId} game="minesweeper" result={won ? 'win' : lost ? 'loss' : null} />
        <div className="mine-tools" aria-label="Minesweeper tools">
          <button className={tool === 'reveal' ? 'mine-tool mine-tool--active' : 'mine-tool'} onClick={() => setTool('reveal')}>⛏ Reveal</button>
          <button className={tool === 'flag' ? 'mine-tool mine-tool--active' : 'mine-tool'} onClick={() => setTool('flag')} disabled={!started}>🚩 Flag</button>
        </div>
        <MinesweeperBoard board={board} size={difficulty.size} locked={lost || won} lost={lost} onReveal={reveal} onFlag={flag} />
        <p className="game-hint">Your first move always opens an empty area. Right-click to place a flag.</p>
        <button className="restart-button" onClick={() => startGame()}>New field</button>
      </section>
    </main>
  );
}
