export type ReversiColor = 'black' | 'white';
export type ReversiBoard = Array<ReversiColor | null>;
export type ReversiMove = { cell: number; flips: number[] };

const directions = [
  [-1, -1], [-1, 0], [-1, 1], [0, -1],
  [0, 1], [1, -1], [1, 0], [1, 1],
];
const corners = new Set([0, 7, 56, 63]);
const risky = new Set([1, 6, 8, 9, 14, 15, 48, 49, 54, 55, 57, 62]);

export function createReversiBoard(): ReversiBoard {
  const board: ReversiBoard = Array(64).fill(null);
  board[27] = 'white'; board[28] = 'black';
  board[35] = 'black'; board[36] = 'white';
  return board;
}

export function getReversiMoves(board: ReversiBoard, color: ReversiColor) {
  return board.flatMap((cell, index) => {
    if (cell) return [];
    const flips = directions.flatMap(([rowStep, columnStep]) => getLineFlips(board, color, index, rowStep, columnStep));
    return flips.length ? [{ cell: index, flips }] : [];
  });
}

export function applyReversiMove(board: ReversiBoard, color: ReversiColor, move: ReversiMove) {
  const next = [...board];
  next[move.cell] = color;
  move.flips.forEach((cell) => { next[cell] = color; });
  return next;
}

export function chooseReversiBotMove(board: ReversiBoard) {
  const moves = getReversiMoves(board, 'white');
  const scored = moves.map((move) => {
    const next = applyReversiMove(board, 'white', move);
    const opponentMobility = getReversiMoves(next, 'black').length;
    const edge = isEdge(move.cell) ? 25 : 0;
    return {
      move,
      score: move.flips.length * 4 + edge + (corners.has(move.cell) ? 500 : 0)
        - (risky.has(move.cell) ? 130 : 0) - opponentMobility * 5 + Math.random() * 5,
    };
  });
  scored.sort((first, second) => second.score - first.score);
  return scored[0]?.move;
}

export function countReversiPieces(board: ReversiBoard) {
  return {
    black: board.filter((cell) => cell === 'black').length,
    white: board.filter((cell) => cell === 'white').length,
  };
}

function getLineFlips(board: ReversiBoard, color: ReversiColor, start: number, rowStep: number, columnStep: number) {
  const opponent = color === 'black' ? 'white' : 'black';
  let row = Math.floor(start / 8) + rowStep;
  let column = start % 8 + columnStep;
  const flips: number[] = [];
  while (inside(row, column)) {
    const index = row * 8 + column;
    if (board[index] === opponent) flips.push(index);
    else return board[index] === color && flips.length ? flips : [];
    row += rowStep;
    column += columnStep;
  }
  return [];
}

function inside(row: number, column: number) { return row >= 0 && row < 8 && column >= 0 && column < 8; }
function isEdge(cell: number) { const row = Math.floor(cell / 8); const column = cell % 8; return row === 0 || row === 7 || column === 0 || column === 7; }
