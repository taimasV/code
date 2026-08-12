type ChessMovesProps = {
  moves: string[];
};

export function ChessMoves({ moves }: ChessMovesProps) {
  const rows = Array.from({ length: Math.ceil(moves.length / 2) }, (_, index) => ({
    number: index + 1,
    white: moves[index * 2],
    black: moves[index * 2 + 1],
  }));

  return (
    <div className="chess-moves" aria-label="Move history">
      <h2>Moves</h2>
      {rows.length ? rows.map((row) => (
        <div className="chess-move" key={row.number}>
          <span>{row.number}.</span><strong>{row.white}</strong><strong>{row.black ?? ''}</strong>
        </div>
      )) : <p>No moves yet</p>}
    </div>
  );
}
