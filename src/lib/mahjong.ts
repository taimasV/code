export type MahjongTile = { id: number; removed: boolean; symbol: string };
export type MahjongPosition = { x: number; y: number; z: number };
export type MahjongLevel = {
  columns: number;
  label: string;
  positions: MahjongPosition[];
  rows: number;
};

function rectangle(columns: number, rows: number, x: number, y: number, z: number) {
  return Array.from({ length: columns * rows }, (_, index) => ({
    x: x + (index % columns) * 2,
    y: y + Math.floor(index / columns) * 2,
    z,
  }));
}

export const MAHJONG_LEVELS: MahjongLevel[] = [
  {
    label: 'Easy', columns: 6, rows: 4,
    positions: [...rectangle(6, 4, 0, 0, 0), ...rectangle(5, 3, 1, 1, 1), ...rectangle(1, 1, 4, 2, 2)],
  },
  {
    label: 'Medium', columns: 8, rows: 5,
    positions: [...rectangle(8, 5, 0, 0, 0), ...rectangle(7, 4, 1, 1, 1), ...rectangle(4, 2, 4, 4, 2), ...rectangle(2, 1, 7, 5, 3)],
  },
  {
    label: 'Hard', columns: 10, rows: 6,
    positions: [...rectangle(10, 6, 0, 0, 0), ...rectangle(9, 5, 1, 1, 1), ...rectangle(6, 3, 4, 4, 2), ...rectangle(1, 1, 9, 5, 3)],
  },
];

const symbols = ['🀀', '🀁', '🀂', '🀃', '🀄', '🀅', '🀆', '🀇', '🀈', '🀉', '🀊', '🀋', '🀌', '🀍', '🀎', '🀏', '🀐', '🀑', '🀒', '🀓', '🀔', '🀕', '🀖', '🀗'];

export function createMahjongTiles(level: MahjongLevel): MahjongTile[] {
  const pairs = Array.from({ length: level.positions.length / 2 }, (_, index) => symbols[index % symbols.length]);
  return shuffle([...pairs, ...pairs]).map((symbol, id) => ({ id, removed: false, symbol }));
}

export function getOpenMahjongTiles(tiles: MahjongTile[], level: MahjongLevel) {
  const open = new Set<number>();
  level.positions.forEach((position, index) => {
    if (tiles[index].removed) return;
    const active = level.positions.flatMap((other, otherIndex) => tiles[otherIndex].removed ? [] : [{ ...other, index: otherIndex }]);
    const covered = active.some((other) => other.z > position.z && overlaps(position, other));
    const leftBlocked = active.some((other) => other.z === position.z && other.x === position.x - 2 && Math.abs(other.y - position.y) < 2);
    const rightBlocked = active.some((other) => other.z === position.z && other.x === position.x + 2 && Math.abs(other.y - position.y) < 2);
    if (!covered && (!leftBlocked || !rightBlocked)) open.add(index);
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

function overlaps(first: MahjongPosition, second: MahjongPosition) {
  return Math.abs(first.x - second.x) < 2 && Math.abs(first.y - second.y) < 2;
}

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const random = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[random]] = [copy[random], copy[index]];
  }
  return copy;
}
