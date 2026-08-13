export type MahjongTile = {
  id: number;
  removed: boolean;
  symbol: string;
};

export type MahjongLevel = {
  columns: number;
  label: string;
  rows: number[];
};

export const MAHJONG_LEVELS: MahjongLevel[] = [
  { label: 'Easy', columns: 8, rows: [6, 8, 8, 6] },
  { label: 'Medium', columns: 10, rows: [6, 8, 10, 10, 8, 6] },
  { label: 'Hard', columns: 12, rows: [8, 10, 12, 12, 12, 12, 10, 8] },
];

const symbols = ['🀀', '🀁', '🀂', '🀃', '🀄', '🀅', '🀆', '🀇', '🀈', '🀉', '🀊', '🀋', '🀌', '🀍', '🀎', '🀏', '🀐', '🀑', '🀒', '🀓', '🀔', '🀕', '🀖', '🀗'];

export function createMahjongTiles(level: MahjongLevel): MahjongTile[] {
  const count = level.rows.reduce((sum, row) => sum + row, 0);
  const pairs = Array.from({ length: count / 2 }, (_, index) => symbols[index % symbols.length]);
  return shuffle([...pairs, ...pairs]).map((symbol, id) => ({ id, removed: false, symbol }));
}

export function getOpenMahjongTiles(tiles: MahjongTile[], level: MahjongLevel) {
  const open = new Set<number>();
  let offset = 0;
  level.rows.forEach((length) => {
    const active = Array.from({ length }, (_, index) => offset + index).filter((index) => !tiles[index].removed);
    if (active.length) {
      open.add(active[0]);
      open.add(active[active.length - 1]);
    }
    offset += length;
  });
  return open;
}

export function removeMahjongPair(tiles: MahjongTile[], first: number, second: number) {
  if (first === second || tiles[first].symbol !== tiles[second].symbol) return null;
  return tiles.map((tile, index) => index === first || index === second ? { ...tile, removed: true } : tile);
}

export function hasMahjongMove(tiles: MahjongTile[], level: MahjongLevel) {
  const open = [...getOpenMahjongTiles(tiles, level)];
  return open.some((first, index) => open.slice(index + 1).some((second) => tiles[first].symbol === tiles[second].symbol));
}

export function shuffleRemainingTiles(tiles: MahjongTile[]) {
  const activeSymbols = shuffle(tiles.filter((tile) => !tile.removed).map((tile) => tile.symbol));
  let activeIndex = 0;
  return tiles.map((tile) => tile.removed ? tile : { ...tile, symbol: activeSymbols[activeIndex++] });
}

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const random = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[random]] = [copy[random], copy[index]];
  }
  return copy;
}
