export type Player = 'blue' | 'red';
export type Position = { row: number; column: number };
export type Wall = Position & { orientation: 'horizontal' | 'vertical' };
export type Pawns = Record<Player, Position>;

export const BOARD_SIZE = 9;
export const STARTING_WALLS = 10;
const directions = [
  { row: -1, column: 0 }, { row: 1, column: 0 },
  { row: 0, column: -1 }, { row: 0, column: 1 },
];

export function createPawns(): Pawns {
  return { blue: { row: 8, column: 4 }, red: { row: 0, column: 4 } };
}

export function getLegalMoves(player: Player, pawns: Pawns, walls: Wall[]) {
  const start = pawns[player];
  const opponent = pawns[player === 'blue' ? 'red' : 'blue'];
  const moves: Position[] = [];
  directions.forEach((direction) => {
    const adjacent = add(start, direction);
    if (!inside(adjacent) || isBlocked(start, adjacent, walls)) return;
    if (!same(adjacent, opponent)) {
      moves.push(adjacent);
      return;
    }
    const behind = add(adjacent, direction);
    if (inside(behind) && !isBlocked(adjacent, behind, walls)) {
      moves.push(behind);
      return;
    }
    const sideSteps = direction.row
      ? [{ row: 0, column: -1 }, { row: 0, column: 1 }]
      : [{ row: -1, column: 0 }, { row: 1, column: 0 }];
    sideSteps.forEach((step) => {
      const diagonal = add(adjacent, step);
      if (inside(diagonal) && !isBlocked(adjacent, diagonal, walls)) moves.push(diagonal);
    });
  });
  return moves;
}

export function canPlaceWall(wall: Wall, walls: Wall[], pawns: Pawns) {
  if (wall.row < 0 || wall.column < 0 || wall.row >= BOARD_SIZE - 1 || wall.column >= BOARD_SIZE - 1) return false;
  if (walls.some((placed) => wallsOverlap(wall, placed))) return false;
  const nextWalls = [...walls, wall];
  return getPathLength('blue', pawns, nextWalls) < Infinity && getPathLength('red', pawns, nextWalls) < Infinity;
}

export function getPathLength(player: Player, pawns: Pawns, walls: Wall[]) {
  const start = pawns[player];
  const goalRow = player === 'blue' ? 0 : BOARD_SIZE - 1;
  const queue = [{ position: start, distance: 0 }];
  const visited = new Set([key(start)]);
  while (queue.length) {
    const current = queue.shift()!;
    if (current.position.row === goalRow) return current.distance;
    directions.forEach((direction) => {
      const next = add(current.position, direction);
      if (!inside(next) || visited.has(key(next)) || isBlocked(current.position, next, walls)) return;
      visited.add(key(next));
      queue.push({ position: next, distance: current.distance + 1 });
    });
  }
  return Infinity;
}

export function hasWon(player: Player, position: Position) {
  return player === 'blue' ? position.row === 0 : position.row === BOARD_SIZE - 1;
}

export function same(first: Position, second: Position) {
  return first.row === second.row && first.column === second.column;
}

function isBlocked(first: Position, second: Position, walls: Wall[]) {
  if (first.row !== second.row) {
    const row = Math.min(first.row, second.row);
    return walls.some((wall) => wall.orientation === 'horizontal' && wall.row === row
      && (wall.column === first.column || wall.column + 1 === first.column));
  }
  const column = Math.min(first.column, second.column);
  return walls.some((wall) => wall.orientation === 'vertical' && wall.column === column
    && (wall.row === first.row || wall.row + 1 === first.row));
}

function wallsOverlap(first: Wall, second: Wall) {
  if (first.orientation !== second.orientation) return first.row === second.row && first.column === second.column;
  return first.orientation === 'horizontal'
    ? first.row === second.row && Math.abs(first.column - second.column) <= 1
    : first.column === second.column && Math.abs(first.row - second.row) <= 1;
}

function add(first: Position, second: Position) {
  return { row: first.row + second.row, column: first.column + second.column };
}
function inside(position: Position) {
  return position.row >= 0 && position.column >= 0 && position.row < BOARD_SIZE && position.column < BOARD_SIZE;
}
function key(position: Position) { return `${position.row}-${position.column}`; }
