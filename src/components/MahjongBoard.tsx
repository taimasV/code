import type { CSSProperties } from 'react';
import { getOpenMahjongTiles, type MahjongLevel, type MahjongPosition, type MahjongTile } from '../lib/mahjong';

type MahjongBoardProps = {
  level: MahjongLevel;
  onTileClick: (index: number) => void;
  selected: number | null;
  tiles: MahjongTile[];
};

function tileStyle(position: MahjongPosition): CSSProperties {
  return {
    gridColumn: `${position.x + 1} / span 2`,
    gridRow: `${position.y + 1} / span 2`,
    zIndex: position.z + 1,
    transform: `translate(${position.z * 4}px, ${position.z * -5}px)`,
  };
}

export function MahjongBoard({ level, onTileClick, selected, tiles }: MahjongBoardProps) {
  const open = getOpenMahjongTiles(tiles, level);
  return (
    <div
      className="mahjong-board"
      style={{
        aspectRatio: `${level.columns * 0.78} / ${level.rows}`,
        gridTemplateColumns: `repeat(${level.columns * 2}, 1fr)`,
        gridTemplateRows: `repeat(${level.rows * 2}, 1fr)`,
      }}
    >
      {tiles.map((tile, index) => {
        const position = level.positions[index];
        return (
          <button
            aria-label={`${tile.symbol}${open.has(index) ? ', open' : ', blocked'}, layer ${position.z + 1}`}
            className={`mahjong-tile ${tile.removed ? 'mahjong-tile--removed' : ''} ${selected === index ? 'mahjong-tile--selected' : ''}`}
            disabled={tile.removed || !open.has(index)}
            key={tile.id}
            onClick={() => onTileClick(index)}
            style={tileStyle(position)}
          >{tile.symbol}</button>
        );
      })}
    </div>
  );
}
