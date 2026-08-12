import { normalizeMove, type Position } from 'chessops/chess';
import type { Move, Role } from 'chessops/types';
import type { ChessRating } from './chessBot';

const roles: Role[] = ['queen', 'rook', 'bishop', 'knight', 'pawn'];
const values: Record<Role, number> = { king: 0, queen: 900, rook: 500, bishop: 330, knight: 320, pawn: 100 };

export function chooseVariantBotMove(position: Position, rating: ChessRating) {
  const moves = legalMoves(position);
  const scored = moves.map((move) => ({ move, score: scoreMove(position, move) }));
  scored.sort((first, second) => second.score - first.score);
  const choiceCounts: Record<ChessRating, number> = { 400: 18, 800: 10, 1200: 6, 1600: 3, 2000: 2, 2200: 1 };
  const choices = scored.slice(0, Math.min(choiceCounts[rating], scored.length));
  return choices[Math.floor(Math.random() * choices.length)].move;
}

function legalMoves(position: Position) {
  const moves: Move[] = [];
  for (const [from, destinations] of position.allDests()) {
    for (const to of destinations) {
      const piece = position.board.get(from);
      const promotion = piece?.role === 'pawn' && (to < 8 || to >= 56) ? 'queen' : undefined;
      moves.push(normalizeMove(position, { from, to, promotion }));
    }
  }
  const pocket = position.pockets?.[position.turn];
  if (pocket) for (const role of roles) {
    if (pocket[role] < 1) continue;
    for (const to of position.dropDests()) {
      const move: Move = { role, to };
      if (position.isLegal(move)) moves.push(move);
    }
  }
  return moves;
}

function scoreMove(position: Position, move: Move) {
  const next = position.clone();
  const captured = 'from' in move ? position.board.get(move.to) : undefined;
  next.play(move);
  const outcome = next.outcome();
  if (outcome?.winner === position.turn) return 100_000;
  let score = captured ? values[captured.role] : 0;
  if (next.isCheck()) score += position.rules === '3check' ? 500 : 70;
  if ('promotion' in move && move.promotion) score += values[move.promotion] - values.pawn;
  score += evaluateMaterial(next) * (position.turn === 'white' ? 1 : -1) * 0.08;
  return score + Math.random() * 15;
}

function evaluateMaterial(position: Position) {
  let score = 0;
  for (const [, piece] of position.board) score += values[piece.role] * (piece.color === 'white' ? 1 : -1);
  if (position.pockets) for (const role of roles) {
    score += position.pockets.white[role] * values[role] * 0.8;
    score -= position.pockets.black[role] * values[role] * 0.8;
  }
  return score;
}
