import type { LetterResult } from '../lib/wordle';

const rows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

type WordleKeyboardProps = {
  results: Record<string, LetterResult>;
  onKey: (key: string) => void;
};

export function WordleKeyboard({ onKey, results }: WordleKeyboardProps) {
  return (
    <div className="wordle-keyboard" aria-label="Wordle keyboard">
      {rows.map((row, index) => (
        <div className="wordle-keyboard-row" key={row}>
          {index === 2 && <button className="wordle-key--wide" onClick={() => onKey('ENTER')}>Enter</button>}
          {[...row].map((letter) => <button className={`wordle-key wordle-key--${results[letter] ?? 'empty'}`} key={letter} onClick={() => onKey(letter)}>{letter}</button>)}
          {index === 2 && <button className="wordle-key--wide" aria-label="Erase" onClick={() => onKey('BACKSPACE')}>⌫</button>}
        </div>
      ))}
    </div>
  );
}
