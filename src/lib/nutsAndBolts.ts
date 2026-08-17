export const BOLT_CAPACITY = 3;

export type NutColor = 'coral' | 'blue' | 'green' | 'gold' | 'purple';
export type NutsBoard = NutColor[][];
export type NutsDifficulty = 'easy' | 'medium' | 'hard';

const LEVELS: Record<NutsDifficulty, NutsBoard> = {
  easy: [
    ['coral', 'blue', 'green'], ['green', 'coral', 'blue'],
    ['blue', 'green', 'coral'], [], [],
  ],
  medium: [
    ['coral', 'blue', 'green'], ['green', 'gold', 'blue'],
    ['gold', 'coral', 'green'], ['blue', 'gold', 'coral'], [], [],
  ],
  hard: [
    ['coral', 'blue', 'green'], ['green', 'gold', 'purple'],
    ['purple', 'coral', 'blue'], ['blue', 'green', 'gold'],
    ['gold', 'purple', 'coral'], [], [],
  ],
};

export function createNutsBoard(difficulty: NutsDifficulty = 'easy'): NutsBoard {
  return LEVELS[difficulty].map((bolt) => [...bolt]);
}

export function canMoveNut(board: NutsBoard, from: number, to: number) {
  if (from === to || board[from].length === 0 || board[to].length === BOLT_CAPACITY) return false;
  const movingNut = board[from][board[from].length - 1];
  const targetNut = board[to][board[to].length - 1];
  return targetNut === undefined || targetNut === movingNut;
}

export function moveNut(board: NutsBoard, from: number, to: number): NutsBoard {
  if (!canMoveNut(board, from, to)) return board;
  const next = board.map((bolt) => [...bolt]);
  const nut = next[from].pop();
  if (nut) next[to].push(nut);
  return next;
}

export function isNutsPuzzleSolved(board: NutsBoard) {
  return board.every((bolt) =>
    bolt.length === 0
    || (bolt.length === BOLT_CAPACITY && bolt.every((nut) => nut === bolt[0])),
  );
}
