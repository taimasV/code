import { useState } from 'react';
import { ConnectDotsBoard } from '../components/ConnectDotsBoard';
import { GamePageHeader } from '../components/GamePageHeader';
import { GameWinStreakBadge } from '../components/GameWinStreak';
import { DOT_LEVELS, countConnectedPairs, isDotLevelComplete, type DotDifficulty, type DotPaths } from '../lib/connectDots';
import { useGameAttempt } from '../lib/useGameAttempt';

export function ConnectDotsPage() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [paths, setPaths] = useState<DotPaths>({});
  const { attemptId, startNewAttempt } = useGameAttempt();
  const level = DOT_LEVELS[levelIndex];
  const won = isDotLevelComplete(paths, level);
  const connected = countConnectedPairs(paths, level);
  const filled = new Set(Object.values(paths).flat()).size;
  const levelsInDifficulty = DOT_LEVELS.filter((option) => option.difficulty === level.difficulty);
  const difficultyStart = DOT_LEVELS.findIndex((option) => option.difficulty === level.difficulty);
  const difficultyEnd = difficultyStart + levelsInDifficulty.length - 1;

  function start(index = levelIndex) {
    setLevelIndex(index);
    setPaths({});
    startNewAttempt();
  }

  return (
    <main className="container game-page">
      <GamePageHeader number="12" />
      <section className="game-panel game-panel--dots">
        <span className="game-icon" aria-hidden="true">🔵</span>
        <h1>Connect Dots</h1>
        <div className="difficulty-tabs" aria-label="Difficulty">
          {(['Easy', 'Medium', 'Hard'] as DotDifficulty[]).map((difficulty) => (
            <button className={level.difficulty === difficulty ? 'difficulty-tab difficulty-tab--active' : 'difficulty-tab'} key={difficulty} onClick={() => start(DOT_LEVELS.findIndex((option) => option.difficulty === difficulty))}>{difficulty}<span>20 levels</span></button>
          ))}
        </div>
        <div className="dots-level-controls" aria-label="Level selection">
          <button className="mine-tool" disabled={levelIndex === difficultyStart} onClick={() => start(levelIndex - 1)}>←</button>
          <select value={levelIndex} onChange={(event) => start(Number(event.target.value))} aria-label="Level">
            {levelsInDifficulty.map((option, index) => <option value={difficultyStart + index} key={option.label}>{option.label}</option>)}
          </select>
          <button className="mine-tool" disabled={levelIndex === difficultyEnd} onClick={() => start(levelIndex + 1)}>→</button>
        </div>
        <p className={`game-status ${won ? 'game-status--winner' : ''}`}>{won ? 'All dots connected! 🎉' : `Connected: ${connected}/${level.pairs.length} · Filled: ${filled}/${level.size ** 2}`}</p>
        <GameWinStreakBadge active attemptId={attemptId} game="connect-dots" result={won ? 'win' : null} />
        <ConnectDotsBoard level={level} paths={paths} onPathsChange={setPaths} />
        <p className="game-hint">Connect every matching pair without crossing lines. Each puzzle has one path layout, and it covers the whole board.</p>
        <div className="chess-actions">
          <button className="mine-tool" onClick={() => start()}>Reset paths</button>
          {won && levelIndex < difficultyEnd && <button className="restart-button" onClick={() => start(levelIndex + 1)}>Next level →</button>}
        </div>
      </section>
    </main>
  );
}
