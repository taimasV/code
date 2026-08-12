import { type Chess, type Move, type PieceSymbol } from 'chess.js';

export const CHESS_RATINGS = [400, 800, 1200, 1600, 2000, 2200] as const;
export type ChessRating = typeof CHESS_RATINGS[number];

const values: Record<PieceSymbol, number> = { p: 100, n: 320, b: 335, r: 500, q: 900, k: 0 };
const settings: Record<ChessRating, { depth: number; randomness: number; width: number }> = {
  400: { depth: 1, randomness: 240, width: 99 },
  800: { depth: 1, randomness: 100, width: 99 },
  1200: { depth: 2, randomness: 55, width: 24 },
  1600: { depth: 3, randomness: 18, width: 16 },
  2000: { depth: 3, randomness: 3, width: 24 },
  2200: { depth: 4, randomness: 0, width: 14 },
};

export function chooseBotMove(chess: Chess, rating: ChessRating) {
  const config = settings[rating];
  const cache = new Map<string, number>();
  const moves = orderedMoves(chess, config.width);
  const scored = moves.map((move) => {
    chess.move(move);
    const score = -search(chess, config.depth - 1, -100_000, 100_000, config.width, cache);
    chess.undo();
    return { move, score: score + (Math.random() - 0.5) * config.randomness };
  });
  scored.sort((first, second) => second.score - first.score);
  return scored[0].move;
}

function search(chess: Chess, depth: number, alpha: number, beta: number, width: number, cache: Map<string, number>): number {
  if (chess.isCheckmate()) return -99_000 - depth;
  if (chess.isDraw()) return 0;
  if (depth === 0) return evaluate(chess);
  const key = `${chess.fen()}|${depth}`;
  const stored = cache.get(key);
  if (stored !== undefined) return stored;
  let best = -100_000;
  for (const move of orderedMoves(chess, width)) {
    chess.move(move);
    const score = -search(chess, depth - 1, -beta, -alpha, width, cache);
    chess.undo();
    best = Math.max(best, score);
    alpha = Math.max(alpha, score);
    if (alpha >= beta) break;
  }
  cache.set(key, best);
  return best;
}

function evaluate(chess: Chess) {
  let whiteScore = 0;
  chess.board().forEach((row, rowIndex) => row.forEach((piece, column) => {
    if (!piece) return;
    const rank = piece.color === 'w' ? 7 - rowIndex : rowIndex;
    const center = 7 - (Math.abs(3.5 - column) + Math.abs(3.5 - rowIndex));
    const position = positionalValue(piece.type, rank, center, column);
    whiteScore += (values[piece.type] + position) * (piece.color === 'w' ? 1 : -1);
  }));
  const mobility = chess.moves().length * 2;
  const turnSign = chess.turn() === 'w' ? 1 : -1;
  return whiteScore * turnSign + mobility + (chess.isCheck() ? -35 : 0);
}

function positionalValue(piece: PieceSymbol, rank: number, center: number, file: number) {
  if (piece === 'p') return rank * 9 + center * 2;
  if (piece === 'n') return center * 8;
  if (piece === 'b') return center * 5;
  if (piece === 'r') return rank === 6 ? 18 : 0;
  if (piece === 'q') return center * 2;
  if (piece === 'k') return rank < 2 && (file < 3 || file > 4) ? 28 : -center * 3;
  return 0;
}

function orderedMoves(chess: Chess, limit: number) {
  return chess.moves({ verbose: true })
    .sort((first, second) => movePriority(second) - movePriority(first))
    .slice(0, limit);
}

function movePriority(move: Move) {
  return (move.captured ? values[move.captured] * 10 - values[move.piece] : 0)
    + (move.promotion ? values[move.promotion] : 0)
    + (move.san.includes('#') ? 100_000 : move.san.includes('+') ? 80 : 0)
    + (move.san.includes('O-O') ? 35 : 0);
}
