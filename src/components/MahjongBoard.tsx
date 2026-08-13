import { getOpenMahjongTiles, type MahjongLevel, type MahjongTile } from '../lib/mahjong';

type MahjongBoardProps = {
  level: MahjongLevel;
  onTileClick: (index: number) => void;
  selected: number | null;
  tiles: MahjongTile[];
};

export function MahjongBoard({ level, onTileClick, selected, tiles }: MahjongBoardProps) {
  const open = getOpenMahjongTiles(tiles, level);
  let offset = 0;
  return (
    <div className="mahjong-board">
      {level.rows.map((length, row) => {
        const rowTiles = tiles.slice(offset, offset + length);
        const rowOffset = offset;
        offset += length;
        return (
          <div className="mahjong-row" key={row} style={{ gridTemplateColumns: `repeat(${length}, 1fr)`, width: `${length / level.columns * 100}%` }}>
            {rowTiles.map((tile, column) => {
              const index = rowOffset + column;
              return (
                <button
                  aria-label={`${tile.symbol}${open.has(index) ? ', open' : ', blocked'}`}
                  className={`mahjong-tile ${tile.removed ? 'mahjong-tile--removed' : ''} ${selected === index ? 'mahjong-tile--selected' : ''}`}
                  disabled={tile.removed || !open.has(index)}
                  key={tile.id}
                  onClick={() => onTileClick(index)}
                >{tile.symbol}</button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
