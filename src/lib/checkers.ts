export type CheckerColor = 'red' | 'black';
export type CheckerPiece = { color: CheckerColor; king: boolean };
export type CheckerBoard = Array<CheckerPiece | null>;
export type CheckerMove = { captured?: number; from: number; to: number };

export function createCheckersBoard(): CheckerBoard {
  return Array.from({ length: 64 }, (_, index) => {
    const row = Math.floor(index / 8);
    const playable = (row + index % 8) % 2 === 1;
    if (!playable || (row > 2 && row < 5)) return null;
    return { color: row < 3 ? 'black' : 'red', king: false };
  });
}

export function getLegalMoves(board: CheckerBoard, color: CheckerColor, onlyFrom?: number) {
  const pieces = board.map((piece, index) => ({ piece, index }))
    .filter(({ piece, index }) => piece?.color === color && (onlyFrom === undefined || index === onlyFrom));
  const captures = pieces.flatMap(({ piece, index }) => getPieceMoves(board, index, piece!, true));
  if (captures.length) return captures;
  if (onlyFrom !== undefined) return [];
  return pieces.flatMap(({ piece, index }) => getPieceMoves(board, index, piece!, false));
}

export function applyCheckerMove(board: CheckerBoard, move: CheckerMove) {
  const next = [...board];
  const piece = next[move.from];
  if (!piece) return { board, promoted: false };
  next[move.from] = null;
  if (move.captured !== undefined) next[move.captured] = null;
  const targetRow = Math.floor(move.to / 8);
  const promoted = !piece.king && ((piece.color === 'red' && targetRow === 0) || (piece.color === 'black' && targetRow === 7));
  next[move.to] = promoted ? { ...piece, king: true } : piece;
  return { board: next, promoted };
}

export function chooseCheckerBotMove(board: CheckerBoard, onlyFrom?: number) {
  const moves = getLegalMoves(board, 'black', onlyFrom);
  const scored = moves.map((move) => {
    const result = applyCheckerMove(board, move);
    const piece = result.board[move.to];
    const advance = Math.floor(move.to / 8);
    const center = move.to % 8 >= 2 && move.to % 8 <= 5 ? 8 : 0;
    return { move, score: (move.captured !== undefined ? 120 : 0) + (result.promoted ? 100 : 0) + (piece?.king ? 20 : advance * 3) + center + Math.random() * 12 };
  });
  scored.sort((first, second) => second.score - first.score);
  return scored[0]?.move;
}

function getPieceMoves(board: CheckerBoard, from: number, piece: CheckerPiece, capturesOnly: boolean) {
  const row = Math.floor(from / 8);
  const column = from % 8;
  const rowSteps = piece.king ? [-1, 1] : piece.color === 'red' ? [-1] : [1];
  const moves: CheckerMove[] = [];
  for (const rowStep of rowSteps) for (const columnStep of [-1, 1]) {
    const nearRow = row + rowStep;
    const nearColumn = column + columnStep;
    if (!inside(nearRow, nearColumn)) continue;
    const near = nearRow * 8 + nearColumn;
    if (!capturesOnly && !board[near]) moves.push({ from, to: near });
    const farRow = row + rowStep * 2;
    const farColumn = column + columnStep * 2;
    if (inside(farRow, farColumn) && board[near]?.color !== piece.color && board[near] && !board[farRow * 8 + farColumn]) {
      moves.push({ from, to: farRow * 8 + farColumn, captured: near });
    }
  }
  return capturesOnly ? moves.filter((move) => move.captured !== undefined) : moves;
}

function inside(row: number, column: number) {
  return row >= 0 && row < 8 && column >= 0 && column < 8;
}
