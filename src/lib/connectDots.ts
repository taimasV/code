export type DotColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange' | 'cyan' | 'pink' | 'lime' | 'brown' | 'navy' | 'teal' | 'gray' | 'magenta';
export type DotDifficulty = 'Easy' | 'Medium' | 'Hard';
export type DotPair = { color: DotColor; ends: [number, number] };
export type DotLevel = { difficulty: DotDifficulty; label: string; pairs: DotPair[]; size: number };
export type DotPaths = Partial<Record<DotColor, number[]>>;

const colors: DotColor[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'cyan', 'pink', 'lime', 'brown', 'navy', 'teal', 'gray', 'magenta'];
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
const hard: Array<Array<[number, number]>> = [
  [[4,30],[12,31],[13,44],[14,29],[16,28],[24,50],[33,63],[40,83],[45,84],[47,75],[48,85]],
  [[1,30],[4,31],[14,32],[15,98],[16,55],[24,94],[36,77],[50,72],[51,92],[71,93],[84,86]],
  [[4,20],[5,73],[6,97],[16,38],[22,46],[27,96],[30,91],[44,85],[57,63],[67,83]],
  [[2,10],[3,79],[4,86],[18,55],[25,38],[31,45],[33,58],[57,76],[62,75],[72,74]],
  [[3,41],[15,56],[31,95],[33,64],[36,74],[45,52],[50,93],[51,94],[66,87],[71,82],[77,85]],
  [[7,41],[8,35],[12,37],[13,22],[14,28],[49,94],[51,67],[54,72],[56,88],[64,82],[66,74]],
  [[12,50],[13,55],[17,68],[20,29],[25,51],[34,63],[36,71],[48,66],[52,74],[61,91],[76,92],[86,88]],
  [[7,71],[8,19],[10,45],[11,92],[22,25],[24,43],[31,52],[36,57],[38,88],[41,66],[53,76]],
  [[5,20],[13,21],[15,17],[16,96],[23,40],[25,46],[36,44],[42,50],[52,60],[61,73],[65,94],[75,77],[90,93]],
  [[2,50],[14,22],[15,47],[16,28],[29,63],[39,88],[45,60],[49,85],[53,80],[70,82],[79,98]],
  [[1,20],[7,31],[8,95],[14,30],[15,24],[16,50],[17,55],[36,77],[51,83],[61,81]],
  [[4,20],[5,55],[6,59],[16,48],[22,78],[27,30],[36,85],[51,73],[58,98],[61,75]],
  [[5,13],[9,33],[10,12],[11,30],[15,40],[17,49],[27,42],[34,55],[36,75],[51,83],[61,82],[68,85]],
  [[3,20],[4,87],[11,27],[15,92],[23,50],[44,46],[45,54],[52,58],[71,95],[75,77]],
  [[0,37],[5,64],[12,41],[13,25],[22,31],[27,93],[54,95],[61,83],[62,87],[77,94]],
  [[2,30],[3,68],[15,75],[16,47],[17,77],[22,25],[51,74],[54,73],[63,79],[78,85]],
  [[8,29],[12,30],[13,73],[14,66],[15,40],[20,28],[34,54],[44,81],[48,85],[52,63],[58,86]],
  [[3,10],[9,98],[13,20],[15,49],[23,32],[30,60],[31,73],[36,85],[42,84],[44,55],[53,64],[61,83],[68,70]],
  [[0,97],[21,63],[23,42],[24,72],[25,88],[26,37],[44,90],[47,54],[56,94],[66,84],[70,82]],
  [[1,41],[2,25],[3,9],[13,67],[22,24],[26,48],[36,47],[55,63],[57,87],[62,83],[64,84],[72,95]],
];

export const DOT_LEVELS: DotLevel[] = [
  ...makeLevels(easy, 'Easy', 4),
  ...makeLevels([...mediumBase, ...mediumBase.map((pairs) => pairs.map(([a, b]): [number, number] => [mirror(a, 5), mirror(b, 5)]))], 'Medium', 5),
  ...makeLevels(hard, 'Hard', 10),
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
function mirror(cell: number, size: number) { return Math.floor(cell / size) * size + size - 1 - cell % size; }
function isAdjacent(first: number, second: number, size: number) { return Math.abs(Math.floor(first / size) - Math.floor(second / size)) + Math.abs(first % size - second % size) === 1; }
