export type MineCell = {
  adjacent: number;
  flagged: boolean;
  isMine: boolean;
  revealed: boolean;
};

export type MineDifficulty = {
  id: 'easy' | 'medium' | 'hard';
  label: string;
  mines: number;
  size: number;
};

export const MINE_DIFFICULTIES: MineDifficulty[] = [
  { id: 'easy', label: 'Easy', mines: 10, size: 9 },
  { id: 'medium', label: 'Medium', mines: 50, size: 16 },
  { id: 'hard', label: 'Hard', mines: 100, size: 20 },
];

export function createEmptyMineBoard(size: number): MineCell[] {
  return Array.from({ length: size ** 2 }, () => ({
    adjacent: 0, flagged: false, isMine: false, revealed: false,
  }));
}

export function createMineBoard(safeIndex: number, difficulty: MineDifficulty): MineCell[] {
  const { mines, size } = difficulty;
  const board = createEmptyMineBoard(size);
  const safeCells = new Set([safeIndex, ...neighbors(safeIndex, size)]);
  const available = board.map((_, index) => index).filter((index) => !safeCells.has(index));
  shuffle(available).slice(0, mines).forEach((index) => {
    board[index].isMine = true;
  });
  board.forEach((cell, index) => {
    cell.adjacent = neighbors(index, size).filter((neighbor) => board[neighbor].isMine).length;
  });
  return board;
}

export function revealCells(board: MineCell[], start: number, size: number) {
  const nextBoard = board.map((cell) => ({ ...cell }));
  const queue = [start];
  const visited = new Set<number>();
  while (queue.length) {
    const index = queue.shift();
    if (index === undefined || visited.has(index)) continue;
    visited.add(index);
    const cell = nextBoard[index];
    if (cell.flagged) continue;
    cell.revealed = true;
    if (!cell.isMine && cell.adjacent === 0) queue.push(...neighbors(index, size));
  }
  return nextBoard;
}

export function toggleFlag(board: MineCell[], index: number) {
  if (board[index].revealed) return board;
  return board.map((cell, cellIndex) => cellIndex === index ? { ...cell, flagged: !cell.flagged } : cell);
}

function neighbors(index: number, size: number) {
  const row = Math.floor(index / size);
  const column = index % size;
  const cells: number[] = [];
  for (let rowStep = -1; rowStep <= 1; rowStep += 1) {
    for (let columnStep = -1; columnStep <= 1; columnStep += 1) {
      const nextRow = row + rowStep;
      const nextColumn = column + columnStep;
      if ((rowStep || columnStep) && nextRow >= 0 && nextRow < size && nextColumn >= 0 && nextColumn < size) {
        cells.push(nextRow * size + nextColumn);
      }
    }
  }
  return cells;
}

function shuffle(items: number[]) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[randomIndex]] = [items[randomIndex], items[index]];
  }
  return items;
}
