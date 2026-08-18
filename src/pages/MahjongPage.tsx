import { useEffect, useState } from 'react';
import { GamePageHeader } from '../components/GamePageHeader';
import { MahjongBoard } from '../components/MahjongBoard';
import { MahjongHotbar, type HotbarTile } from '../components/MahjongHotbar';
import { GameWinStreakBadge } from '../components/GameWinStreak';
import {
  MAHJONG_LEVELS, createMahjongTiles, hasMahjongMove,
  shuffleRemainingTiles,
} from '../lib/mahjong';
import { useGameAttempt } from '../lib/useGameAttempt';

export function MahjongPage() {
  const [levelIndex, setLevelIndex] = useState(0);
  const level = MAHJONG_LEVELS[levelIndex];
  const [tiles, setTiles] = useState(() => createMahjongTiles(level));
  const [hotbar, setHotbar] = useState<HotbarTile[]>([]);
  const [pairs, setPairs] = useState(0);
  const [score, setScore] = useState(0);
  const { attemptId, startNewAttempt } = useGameAttempt();
  const matchingIds = hotbar.filter((tile) => tile.matched).map((tile) => tile.id);
  const matchingKey = matchingIds.join(',');
  const atCapacity = hotbar.length >= 4;
  const barFull = atCapacity && matchingIds.length === 0;
  const won = tiles.every((tile) => tile.removed) && hotbar.length === 0;

  useEffect(() => {
    if (matchingIds.length === 0) return;
    const timer = window.setTimeout(() => {
      const matched = new Set(matchingIds);
      setHotbar((current) => current.filter((tile) => !matched.has(tile.id)));
      setPairs((current) => current + matchingIds.length / 2);
      setScore((current) => current + matchingIds.length * 50);
    }, 480);
    return () => window.clearTimeout(timer);
  }, [matchingKey]);

  useEffect(() => {
    const hasBoardTiles = tiles.some((tile) => !tile.removed);
    if (hasBoardTiles && !atCapacity && !hasMahjongMove(tiles, level)) {
      setTiles((current) => shuffleRemainingTiles(current));
    }
  }, [atCapacity, level, tiles]);

  function chooseTile(index: number) {
    if (atCapacity || tiles[index].removed) return;
    const picked = tiles[index];
    setTiles((current) => current.map((tile, tileIndex) => tileIndex === index ? { ...tile, removed: true } : tile));
    setHotbar((current) => {
      const pair = current.find((tile) => !tile.matched && tile.symbol === picked.symbol);
      if (!pair) return [...current, { id: picked.id, matched: false, symbol: picked.symbol }];
      return current
        .map((tile) => tile.id === pair.id ? { ...tile, matched: true } : tile)
        .concat({ id: picked.id, matched: true, symbol: picked.symbol });
    });
  }

  function start(nextIndex = levelIndex) {
    const nextLevel = MAHJONG_LEVELS[nextIndex];
    setLevelIndex(nextIndex);
    setTiles(createMahjongTiles(nextLevel));
    setHotbar([]);
    setPairs(0);
    setScore(0);
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
        <p className={`game-status ${won ? 'game-status--winner' : ''}`}>{won ? `Board cleared! Score: ${score} 🎉` : barFull ? `Hot bar is full — score: ${score}` : `Score: ${score} · Pairs: ${pairs}`}</p>
        <GameWinStreakBadge active attemptId={attemptId} game="mahjong" result={won ? 'win' : null} />
        <MahjongBoard level={level} locked={atCapacity} tiles={tiles} onTileClick={chooseTile} />
        <MahjongHotbar tiles={hotbar} />
        <p className="game-hint">Move open tiles to the hot bar. Two identical tiles disappear and give 100 points.</p>
        <button className="restart-button" onClick={() => start()}>New layout</button>
      </section>
    </main>
  );
}
