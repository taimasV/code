import { CONNECT_COLUMNS, type ConnectCell } from '../lib/connectFour';

type ConnectFourBoardProps = {
  board: ConnectCell[];
  locked: boolean;
  winningCells: number[];
  onColumnClick: (column: number) => void;
};

export function ConnectFourBoard({ board, locked, winningCells, onColumnClick }: ConnectFourBoardProps) {
  return (
    <div className="connect-board" role="grid" aria-label="Connect Four board">
      {board.map((cell, index) => {
        const column = index % CONNECT_COLUMNS;
        return (
          <button
            aria-label={`Drop a piece in column ${column + 1}`}
            className={`connect-slot ${winningCells.includes(index) ? 'connect-slot--winner' : ''}`}
            disabled={locked}
            key={index}
            onClick={() => onColumnClick(column)}
            role="gridcell"
          >
            <span className={cell ? `connect-piece connect-piece--${cell}` : 'connect-piece'} />
          </button>
        );
      })}
    </div>
  );
}
