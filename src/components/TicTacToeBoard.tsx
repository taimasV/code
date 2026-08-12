type Cell = 'X' | 'O' | null;

type TicTacToeBoardProps = {
  cells: Cell[];
  winningCells: number[];
  onCellClick: (index: number) => void;
};

export function TicTacToeBoard({ cells, winningCells, onCellClick }: TicTacToeBoardProps) {
  return (
    <div className="tic-board" role="grid" aria-label="Tic-tac-toe board">
      {cells.map((cell, index) => (
        <button
          className={`tic-cell tic-cell--${cell?.toLowerCase() ?? 'empty'} ${winningCells.includes(index) ? 'tic-cell--winner' : ''}`}
          disabled={cell !== null}
          key={index}
          onClick={() => onCellClick(index)}
          aria-label={cell ? `Cell ${index + 1}: ${cell}` : `Place a symbol in cell ${index + 1}`}
          role="gridcell"
        >
          {cell}
        </button>
      ))}
    </div>
  );
}
