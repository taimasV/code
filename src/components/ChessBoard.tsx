import type { Chess, Color, PieceSymbol, Square } from 'chess.js';

const pieces: Record<Color, Record<PieceSymbol, string>> = {
  w: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
  b: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' },
};

type ChessBoardProps = {
  chess: Chess;
  legalTargets: Set<Square>;
  onSquareClick: (square: Square) => void;
  selected: Square | null;
};

export function ChessBoard({ chess, legalTargets, onSquareClick, selected }: ChessBoardProps) {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const squares = Array.from({ length: 64 }, (_, index) => {
    const rank = 8 - Math.floor(index / 8);
    return `${files[index % 8]}${rank}` as Square;
  });

  return (
    <div className="chess-board" role="grid" aria-label="Chess board">
      {squares.map((square, index) => {
        const piece = chess.get(square);
        const isLight = (Math.floor(index / 8) + index % 8) % 2 === 0;
        return (
          <button
            aria-label={`${square}${piece ? `, ${piece.color === 'w' ? 'white' : 'black'} ${piece.type}` : ''}`}
            className={`chess-square ${isLight ? 'chess-square--light' : 'chess-square--dark'} ${selected === square ? 'chess-square--selected' : ''} ${legalTargets.has(square) ? 'chess-square--legal' : ''}`}
            key={square}
            onClick={() => onSquareClick(square)}
            role="gridcell"
          >
            {piece && <span className={`chess-piece chess-piece--${piece.color}`}>{pieces[piece.color][piece.type]}</span>}
            {index % 8 === 0 && <small className="chess-rank">{square[1]}</small>}
            {index >= 56 && <small className="chess-file">{square[0]}</small>}
          </button>
        );
      })}
    </div>
  );
}
