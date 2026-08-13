import type { DotLevel, DotPair } from './connectDots';

const steps = [[1, 0], [-1, 0], [0, 1], [0, -1]];

export function countDotSolutions(level: DotLevel, limit = 2, requireFullBoard = true) {
  const endpoints = new Map<number, number>();
  level.pairs.forEach((pair, index) => pair.ends.forEach((cell) => endpoints.set(cell, index)));
  const occupied = new Set(endpoints.keys());
  let solutions = 0;

  function search(remaining: number[]) {
    if (solutions >= limit) return;
    if (!remaining.length) {
      if (!requireFullBoard || occupied.size === level.size ** 2) solutions += 1;
      return;
    }
    let chosen = remaining[0];
    let choices: number[][] | undefined;
    for (const pairIndex of remaining) {
      const paths = enumeratePaths(level.pairs[pairIndex], level, occupied, endpoints);
      if (!paths.length) return;
      if (!choices || paths.length < choices.length) {
        chosen = pairIndex;
        choices = paths;
      }
      if (paths.length === 1) break;
    }
    for (const path of choices ?? []) {
      const added = path.filter((cell) => !occupied.has(cell));
      added.forEach((cell) => occupied.add(cell));
      search(remaining.filter((index) => index !== chosen));
      added.forEach((cell) => occupied.delete(cell));
      if (solutions >= limit) return;
    }
  }

  search(level.pairs.map((_, index) => index));
  return solutions;
}

function enumeratePaths(pair: DotPair, level: DotLevel, occupied: Set<number>, endpoints: Map<number, number>) {
  const [start, end] = pair.ends;
  const paths: number[][] = [];
  const visited = new Set([start]);
  const path = [start];

  function walk(cell: number) {
    if (cell === end) {
      paths.push([...path]);
      return;
    }
    const candidates = neighbors(cell, level.size).filter((next) => {
      if (visited.has(next)) return false;
      if (next === end) return true;
      return !occupied.has(next) && !endpoints.has(next);
    });
    candidates.sort((first, second) => distance(first, end, level.size) - distance(second, end, level.size));
    for (const next of candidates) {
      visited.add(next);
      path.push(next);
      walk(next);
      path.pop();
      visited.delete(next);
    }
  }

  walk(start);
  return paths;
}

function neighbors(cell: number, size: number) {
  const row = Math.floor(cell / size);
  const column = cell % size;
  return steps.flatMap(([rowStep, columnStep]) => {
    const nextRow = row + rowStep;
    const nextColumn = column + columnStep;
    return nextRow >= 0 && nextRow < size && nextColumn >= 0 && nextColumn < size
      ? [nextRow * size + nextColumn] : [];
  });
}

function distance(first: number, second: number, size: number) {
  return Math.abs(Math.floor(first / size) - Math.floor(second / size)) + Math.abs(first % size - second % size);
}
