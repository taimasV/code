import type { ReversiBoard as Board, ReversiMove } from '../lib/reversi';

type ReversiBoardProps = {
  board: Board;
  disabled: boolean;
  moves: ReversiMove[];
  onMove: (move: ReversiMove) => void;
};

export function ReversiBoard({ board, disabled, moves, onMove }: ReversiBoardProps) {
  const moveMap = new Map(moves.map((move) => [move.cell, move]));
  return (
    <div className="reversi-board" role="grid" aria-label="Reversi board">
      {board.map((piece, index) => {
        const move = moveMap.get(index);
        return (
          <button
            aria-label={`Cell ${index + 1}${piece ? `, ${piece}` : move ? ', legal move' : ''}`}
            className={`reversi-cell ${move ? 'reversi-cell--legal' : ''}`}
            disabled={disabled || !move}
            key={index}
            onClick={() => move && onMove(move)}
            role="gridcell"
          >
            {piece && <span className={`reversi-piece reversi-piece--${piece}`} />}
          </button>
        );
      })}
    </div>
  );
}
