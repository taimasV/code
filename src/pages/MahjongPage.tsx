import { useEffect, useState } from 'react';
import { GamePageHeader } from '../components/GamePageHeader';
import { MahjongBoard } from '../components/MahjongBoard';
import { GameWinStreakBadge } from '../components/GameWinStreak';
import {
  MAHJONG_LEVELS, createMahjongTiles, hasMahjongMove,
  removeMahjongPair, shuffleRemainingTiles,
} from '../lib/mahjong';
import { useGameAttempt } from '../lib/useGameAttempt';

export function MahjongPage() {
  const [levelIndex, setLevelIndex] = useState(0);
  const level = MAHJONG_LEVELS[levelIndex];
  const [tiles, setTiles] = useState(() => createMahjongTiles(level));
  const [selected, setSelected] = useState<number | null>(null);
  const [pairs, setPairs] = useState(0);
  const { attemptId, startNewAttempt } = useGameAttempt();
  const won = tiles.every((tile) => tile.removed);

  useEffect(() => {
    if (!won && !hasMahjongMove(tiles, level)) setTiles((current) => shuffleRemainingTiles(current));
  }, [level, tiles, won]);

  function chooseTile(index: number) {
    if (selected === null) {
      setSelected(index);
      return;
    }
    const next = removeMahjongPair(tiles, selected, index);
    if (next) {
      setTiles(next);
      setPairs((current) => current + 1);
      setSelected(null);
    } else setSelected(index);
  }

  function start(nextIndex = levelIndex) {
    const nextLevel = MAHJONG_LEVELS[nextIndex];
    setLevelIndex(nextIndex);
    setTiles(createMahjongTiles(nextLevel));
    setSelected(null);
    setPairs(0);
    startNewAttempt();
  }

  return (
    <main className="container game-page">
      <GamePageHeader number="11" />
      <section className="game-panel game-panel--mahjong">
        <span className="game-icon" aria-hidden="true">🀄</span>
        <h1>Mahjong</h1>
        <div className="difficulty-tabs" aria-label="Difficulty">
          {MAHJONG_LEVELS.map((option, index) => (
            <button className={levelIndex === index ? 'difficulty-tab difficulty-tab--active' : 'difficulty-tab'} key={option.label} onClick={() => start(index)}>
              {option.label} <span>{option.positions.length} tiles</span>
            </button>
          ))}
        </div>
        <p className={`game-status ${won ? 'game-status--winner' : ''}`}>{won ? `Board cleared in ${pairs} pairs! 🎉` : `Pairs removed: ${pairs}`}</p>
        <GameWinStreakBadge active attemptId={attemptId} game="mahjong" result={won ? 'win' : null} />
        <MahjongBoard level={level} tiles={tiles} selected={selected} onTileClick={chooseTile} />
        <p className="game-hint">Match identical open tiles. A tile must have nothing above it and at least one free side.</p>
        <div className="chess-actions"><button className="restart-button" onClick={() => start()}>New layout</button><button className="mine-tool" onClick={() => setTiles(shuffleRemainingTiles(tiles))}>Shuffle</button></div>
      </section>
    </main>
  );
}
