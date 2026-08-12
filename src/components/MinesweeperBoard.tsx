import type { MouseEvent } from 'react';
import type { MineCell } from '../lib/minesweeper';

type MinesweeperBoardProps = {
  board: MineCell[];
  size: number;
  locked: boolean;
  lost: boolean;
  onReveal: (index: number) => void;
  onFlag: (index: number) => void;
};

export function MinesweeperBoard({ board, size, locked, lost, onReveal, onFlag }: MinesweeperBoardProps) {
  function flagCell(event: MouseEvent, index: number) {
    event.preventDefault();
    onFlag(index);
  }

  return (
    <div className="mine-board-scroll">
      <div
        className="mine-board"
        style={{ gridTemplateColumns: `repeat(${size}, 1fr)`, width: size === 9 ? 'min(100%, 486px)' : `${size * 30 + 14}px` }}
        role="grid"
        aria-label="Minesweeper board"
      >
      {board.map((cell, index) => {
        const showMine = cell.isMine && (cell.revealed || lost);
        const content = cell.flagged && !showMine ? '🚩' : showMine ? '💣' : cell.revealed && cell.adjacent ? cell.adjacent : '';
        return (
          <button
            aria-label={`Cell ${index + 1}${cell.flagged ? ', flagged' : ''}`}
            className={`mine-cell ${cell.revealed ? 'mine-cell--revealed' : ''} mine-cell--number-${cell.adjacent}`}
            disabled={locked || cell.revealed}
            key={index}
            onClick={() => onReveal(index)}
            onContextMenu={(event) => flagCell(event, index)}
            role="gridcell"
          >
            {content}
          </button>
        );
      })}
      </div>
    </div>
  );
}
