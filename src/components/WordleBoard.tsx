import { scoreGuess, type WordleLength } from '../lib/wordle';

type WordleBoardProps = {
  answer: string;
  current: string;
  guesses: string[];
  length: WordleLength;
};

export function WordleBoard({ answer, current, guesses, length }: WordleBoardProps) {
  return (
    <div className="wordle-board" aria-label="Wordle board">
      {Array.from({ length: 6 }, (_, row) => {
        const guess = guesses[row] ?? (row === guesses.length ? current : '');
        const scores = guesses[row] ? scoreGuess(guess, answer) : [];
        return (
          <div className="wordle-row" key={row} style={{ gridTemplateColumns: `repeat(${length}, 1fr)` }}>
            {Array.from({ length }, (__, column) => (
              <span className={`wordle-cell wordle-cell--${scores[column] ?? 'empty'}`} key={column}>{guess[column] ?? ''}</span>
            ))}
          </div>
        );
      })}
    </div>
  );
}
