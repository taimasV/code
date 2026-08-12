export type ConnectCell = 'red' | 'yellow' | null;

export const CONNECT_ROWS = 6;
export const CONNECT_COLUMNS = 7;

export function createConnectBoard(): ConnectCell[] {
  return Array(CONNECT_ROWS * CONNECT_COLUMNS).fill(null) as ConnectCell[];
}

export function dropPiece(board: ConnectCell[], column: number, player: NonNullable<ConnectCell>) {
  const nextBoard = [...board];
  for (let row = CONNECT_ROWS - 1; row >= 0; row -= 1) {
    const index = row * CONNECT_COLUMNS + column;
    if (!nextBoard[index]) {
      nextBoard[index] = player;
      return nextBoard;
    }
  }
  return null;
}

export function findConnectWinner(board: ConnectCell[]) {
  const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
  for (let row = 0; row < CONNECT_ROWS; row += 1) {
    for (let column = 0; column < CONNECT_COLUMNS; column += 1) {
      const start = row * CONNECT_COLUMNS + column;
      if (!board[start]) continue;
      for (const [rowStep, columnStep] of directions) {
        const cells = Array.from({ length: 4 }, (_, step) => {
          const nextRow = row + rowStep * step;
          const nextColumn = column + columnStep * step;
          return nextRow * CONNECT_COLUMNS + nextColumn;
        });
        const fits = cells.every((_, step) => {
          const nextRow = row + rowStep * step;
          const nextColumn = column + columnStep * step;
          return nextRow >= 0 && nextRow < CONNECT_ROWS && nextColumn >= 0 && nextColumn < CONNECT_COLUMNS;
        });
        if (fits && cells.every((index) => board[index] === board[start])) return cells;
      }
    }
  }
  return [];
}
