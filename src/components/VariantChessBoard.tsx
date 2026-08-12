import type { Position } from 'chessops/chess';
import type { Color, Role, Square } from 'chessops/types';

const symbols: Record<Color, Record<Role, string>> = {
  white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
  black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' },
};

type VariantChessBoardProps = {
  legalTargets: Set<Square>;
  onSquareClick: (square: Square) => void;
  position: Position;
  selected: Square | null;
};

export function VariantChessBoard({ legalTargets, onSquareClick, position, selected }: VariantChessBoardProps) {
  const displaySquares = Array.from({ length: 64 }, (_, index) => ((7 - Math.floor(index / 8)) * 8 + index % 8) as Square);

  return (
    <div className="chess-board" role="grid" aria-label="Variant chess board">
      {displaySquares.map((square, index) => {
        const piece = position.board.get(square);
        const file = String.fromCharCode(97 + square % 8);
        const rank = String(Math.floor(square / 8) + 1);
        return (
          <button
            className={`chess-square ${(Math.floor(index / 8) + index % 8) % 2 ? 'chess-square--dark' : 'chess-square--light'} ${selected === square ? 'chess-square--selected' : ''} ${legalTargets.has(square) ? 'chess-square--legal' : ''}`}
            key={square}
            onClick={() => onSquareClick(square)}
            role="gridcell"
          >
            {piece && <span className={`chess-piece chess-piece--${piece.color === 'white' ? 'w' : 'b'}`}>{symbols[piece.color][piece.role]}</span>}
            {index % 8 === 0 && <small className="chess-rank">{rank}</small>}
            {index >= 56 && <small className="chess-file">{file}</small>}
          </button>
        );
      })}
    </div>
  );
}
