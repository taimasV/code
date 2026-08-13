export type DotColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange' | 'cyan' | 'pink' | 'lime' | 'brown' | 'navy' | 'teal';
export type DotDifficulty = 'Easy' | 'Medium' | 'Hard';
export type DotPair = { color: DotColor; ends: [number, number] };
export type DotLevel = { difficulty: DotDifficulty; label: string; pairs: DotPair[]; size: number };
export type DotPaths = Partial<Record<DotColor, number[]>>;

const colors: DotColor[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'cyan', 'pink', 'lime', 'brown', 'navy', 'teal'];
const easy: Array<Array<[number, number]>> = [
  [[12,5],[4,7],[6,10],[11,13]], [[11,4],[5,10],[6,3],[2,0]], [[11,10],[9,6],[7,2],[1,15]], [[10,2],[3,9],[5,0],[4,12]], [[0,10],[9,8],[12,7],[3,1]],
  [[7,11],[15,0],[1,5],[9,3]], [[2,8],[12,14],[15,10],[9,3]], [[5,10],[6,8],[12,14],[15,3]], [[10,15],[11,1],[0,13],[9,6]], [[3,5],[9,15],[14,13],[12,2]],
  [[14,0],[1,5],[9,2],[3,15]], [[1,5],[9,6],[2,13],[12,0]], [[2,0],[4,14],[15,10],[9,3]], [[10,0],[4,12],[13,7],[3,6]], [[9,13],[12,14],[15,2],[1,0]],
  [[11,4],[5,9],[10,7],[3,0]], [[2,13],[14,15],[11,10],[9,3]], [[6,3],[2,5],[9,11],[15,0]], [[2,10],[9,0],[4,14],[15,3]], [[14,8],[9,6],[5,4],[0,15]],
];
const mediumBase: Array<Array<[number, number]>> = [
  [[12,22],[21,6],[7,18],[23,14],[9,20]], [[8,19],[24,12],[7,22],[21,15],[10,4]], [[8,22],[23,4],[3,6],[7,21],[20,0]], [[18,9],[4,8],[13,17],[16,2],[1,24]], [[6,21],[20,1],[2,14],[19,8],[7,24]],
  [[12,22],[23,7],[6,21],[20,5],[0,24]], [[2,18],[17,1],[0,10],[11,15],[20,4]], [[24,14],[13,17],[16,8],[9,1],[0,18]], [[0,2],[3,6],[5,13],[18,20],[21,4]], [[12,16],[11,22],[23,13],[8,6],[5,24]],
];

export const DOT_LEVELS: DotLevel[] = [
  ...makeLevels(easy, 'Easy', 4),
  ...makeLevels([...mediumBase, ...mediumBase.map((pairs) => pairs.map(([a, b]): [number, number] => [mirror(a, 5), mirror(b, 5)]))], 'Medium', 5),
  ...Array.from({ length: 20 }, (_, index) => makeHardLevel(index)),
];

export function endpointColor(level: DotLevel, cell: number) { return level.pairs.find((pair) => pair.ends.includes(cell))?.color; }

export function extendDotPath(paths: DotPaths, level: DotLevel, color: DotColor, cell: number) {
  const path = paths[color] ?? [];
  const pair = level.pairs.find((item) => item.color === color);
  if (pair && path.length > 1 && pair.ends.includes(path[path.length - 1])) return paths;
  const existingIndex = path.indexOf(cell);
  if (existingIndex >= 0) return { ...paths, [color]: path.slice(0, existingIndex + 1) };
  const last = path[path.length - 1];
  if (last === undefined || !isAdjacent(last, cell, level.size)) return paths;
  const endpoint = endpointColor(level, cell);
  if (endpoint && endpoint !== color) return paths;
  const occupied = Object.entries(paths).some(([other, cells]) => other !== color && cells?.includes(cell));
  return occupied ? paths : { ...paths, [color]: [...path, cell] };
}

export function isDotLevelComplete(paths: DotPaths, level: DotLevel) {
  return countConnectedPairs(paths, level) === level.pairs.length && new Set(Object.values(paths).flat()).size === level.size ** 2;
}
export function countConnectedPairs(paths: DotPaths, level: DotLevel) {
  return level.pairs.filter((pair) => {
    const path = paths[pair.color] ?? [];
    return pair.ends.includes(path[0]) && pair.ends.includes(path[path.length - 1]) && path[0] !== path[path.length - 1];
  }).length;
}

function makeLevels(pack: Array<Array<[number, number]>>, difficulty: DotDifficulty, size: number): DotLevel[] {
  return pack.map((pairs, index) => ({ difficulty, label: `${difficulty} ${index + 1}`, size, pairs: pairs.map((ends, colorIndex) => ({ color: colors[colorIndex], ends })) }));
}
function makeHardLevel(index: number): DotLevel {
  const snake = Array.from({ length: 10 }, (_, row) => {
    const cells = Array.from({ length: 10 }, (__, column) => row * 10 + column);
    return row % 2 ? cells.reverse() : cells;
  }).flat();
  const baseLengths = [9, 8, 8, 9, 8, 8, 9, 8, 8, 9, 8, 8];
  const shift = index % baseLengths.length;
  const lengths = [...baseLengths.slice(shift), ...baseLengths.slice(0, shift)];
  const transform = (cell: number) => transformCell(cell, 10, index % 4, Math.floor(index / 4) % 2 === 1);
  let offset = 0;
  const pairs = lengths.map((length, colorIndex) => {
    const segment = snake.slice(offset, offset + length);
    offset += length;
    return { color: colors[colorIndex], ends: [transform(segment[0]), transform(segment[segment.length - 1])] as [number, number] };
  });
  return { difficulty: 'Hard', label: `Hard ${index + 1}`, size: 10, pairs };
}
function transformCell(cell: number, size: number, rotations: number, reflect: boolean) {
  let row = Math.floor(cell / size); let column = cell % size;
  if (reflect) column = size - 1 - column;
  for (let turn = 0; turn < rotations; turn += 1) [row, column] = [column, size - 1 - row];
  return row * size + column;
}
function mirror(cell: number, size: number) { return Math.floor(cell / size) * size + size - 1 - cell % size; }
function isAdjacent(first: number, second: number, size: number) { return Math.abs(Math.floor(first / size) - Math.floor(second / size)) + Math.abs(first % size - second % size) === 1; }
