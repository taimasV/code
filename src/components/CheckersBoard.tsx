import type { CheckerBoard, CheckerColor, CheckerMove } from '../lib/checkers';

type CheckersBoardProps = {
  board: CheckerBoard;
  moves: CheckerMove[];
  onCellClick: (index: number) => void;
  selected: number | null;
  turn: CheckerColor;
};

export function CheckersBoard({ board, moves, onCellClick, selected, turn }: CheckersBoardProps) {
  const targets = new Set(moves.filter((move) => move.from === selected).map((move) => move.to));
  return (
    <div className="checkers-board" role="grid" aria-label="Checkers board">
      {board.map((piece, index) => {
        const row = Math.floor(index / 8);
        const playable = (row + index % 8) % 2 === 1;
        const canSelect = piece?.color === turn && moves.some((move) => move.from === index);
        return (
          <button
            className={`checker-square ${playable ? 'checker-square--dark' : 'checker-square--light'} ${selected === index ? 'checker-square--selected' : ''} ${targets.has(index) ? 'checker-square--target' : ''}`}
            disabled={!playable}
            key={index}
            onClick={() => onCellClick(index)}
            role="gridcell"
          >
            {piece && <span className={`checker-piece checker-piece--${piece.color} ${piece.king ? 'checker-piece--king' : ''} ${canSelect ? 'checker-piece--selectable' : ''}`}>{piece.king ? '★' : ''}</span>}
          </button>
        );
      })}
    </div>
  );
}
