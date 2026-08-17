import { getNonogramClues, type NonogramMark } from '../lib/nonogram';

type NonogramBoardProps = {
  board: NonogramMark[];
  puzzle: string[];
  locked: boolean;
  onChange: (cell: number, mark: NonogramMark) => void;
};

export function NonogramBoard({ board, locked, onChange, puzzle }: NonogramBoardProps) {
  const clues = getNonogramClues(puzzle);
  function change(cell: number, mark: NonogramMark) {
    if (!locked) onChange(cell, mark);
  }
  return (
    <div className="nonogram-board" role="grid" aria-label="Nonogram board">
      <span className="nonogram-corner" />
      {clues.columns.map((clue, column) => <span className="nonogram-column-clue" key={`c${column}`}>{clue.map((number, index) => <b key={`${column}-${index}`}>{number}</b>)}</span>)}
      {clues.rows.map((clue, row) => (
        <div className="nonogram-row" key={`r${row}`}>
          <span className="nonogram-row-clue">{clue.join(' ')}</span>
          {board.slice(row * 10, row * 10 + 10).map((mark, column) => {
            const cell = row * 10 + column;
            return <button
              aria-label={`Row ${row + 1}, column ${column + 1}`}
              className={`nonogram-cell nonogram-cell--${mark}`}
              key={cell}
              onClick={() => change(cell, mark === 1 ? 0 : 1)}
              onContextMenu={(event) => { event.preventDefault(); change(cell, mark === 2 ? 0 : 2); }}
            >{mark === 2 ? '×' : ''}</button>;
          })}
        </div>
      ))}
    </div>
  );
}
