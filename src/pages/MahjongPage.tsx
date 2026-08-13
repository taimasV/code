import { useEffect, useState } from 'react';
import { GamePageHeader } from '../components/GamePageHeader';
import { MahjongBoard } from '../components/MahjongBoard';
import {
  MAHJONG_LEVELS, createMahjongTiles, hasMahjongMove,
  removeMahjongPair, shuffleRemainingTiles,
} from '../lib/mahjong';

export function MahjongPage() {
  const [levelIndex, setLevelIndex] = useState(0);
  const level = MAHJONG_LEVELS[levelIndex];
  const [tiles, setTiles] = useState(() => createMahjongTiles(level));
  const [selected, setSelected] = useState<number | null>(null);
  const [pairs, setPairs] = useState(0);
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
              {option.label} <span>{option.rows.reduce((sum, row) => sum + row, 0)} tiles</span>
            </button>
          ))}
        </div>
        <p className={`game-status ${won ? 'game-status--winner' : ''}`}>{won ? `Board cleared in ${pairs} pairs! 🎉` : `Pairs removed: ${pairs}`}</p>
        <MahjongBoard level={level} tiles={tiles} selected={selected} onTileClick={chooseTile} />
        <p className="game-hint">Match identical open tiles. A tile is open when it is at either end of its row.</p>
        <div className="chess-actions"><button className="restart-button" onClick={() => start()}>New layout</button><button className="mine-tool" onClick={() => setTiles(shuffleRemainingTiles(tiles))}>Shuffle</button></div>
      </section>
    </main>
  );
}
