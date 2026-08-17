import type { SudokuCell } from '../lib/sudoku';

type SudokuBoardProps = {
  board: SudokuCell[];
  fixed: Set<number>;
  selected: number | null;
  onSelect: (cell: number) => void;
};

export function SudokuBoard({ board, fixed, onSelect, selected }: SudokuBoardProps) {
  return (
    <div className="sudoku-board" role="grid" aria-label="Sudoku board">
      {board.map((value, cell) => {
        const same = selected !== null && value !== null && value === board[selected];
        const related = selected !== null && sharesGroup(cell, selected);
        const classes = ['sudoku-cell', fixed.has(cell) ? 'sudoku-cell--fixed' : '',
          selected === cell ? 'sudoku-cell--selected' : '', same ? 'sudoku-cell--same' : '',
          related ? 'sudoku-cell--related' : ''].filter(Boolean).join(' ');
        return <button className={classes} key={cell} onClick={() => onSelect(cell)}>{value}</button>;
      })}
    </div>
  );
}

function sharesGroup(first: number, second: number) {
  const firstRow = Math.floor(first / 9); const secondRow = Math.floor(second / 9);
  const firstColumn = first % 9; const secondColumn = second % 9;
  return firstRow === secondRow || firstColumn === secondColumn
    || (Math.floor(firstRow / 3) === Math.floor(secondRow / 3)
      && Math.floor(firstColumn / 3) === Math.floor(secondColumn / 3));
}
