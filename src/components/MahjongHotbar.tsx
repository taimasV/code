import { getMahjongTileColor } from '../lib/mahjong';

export type HotbarTile = {
  id: number;
  matched: boolean;
  symbol: string;
};

type MahjongHotbarProps = {
  tiles: HotbarTile[];
};

export function MahjongHotbar({ tiles }: MahjongHotbarProps) {
  return (
    <div className="mahjong-hotbar-wrap">
      <div className="mahjong-hotbar-title"><span>Hot bar</span><strong>{tiles.length} / 4</strong></div>
      <div className="mahjong-hotbar" aria-label={`Hot bar: ${tiles.length} of 4 slots filled`}>
        {Array.from({ length: 4 }, (_, index) => {
          const tile = tiles[index];
          return (
            <div className="mahjong-hotbar-slot" key={tile?.id ?? `empty-${index}`}>
              {tile && (
                <span className={`mahjong-hotbar-tile mahjong-tile--${getMahjongTileColor(tile.symbol)} ${tile.matched ? 'mahjong-hotbar-tile--matched' : ''}`}>
                  {tile.symbol}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
