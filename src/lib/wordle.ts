export type WordleLength = 5 | 6;
export type LetterResult = 'correct' | 'present' | 'absent' | 'empty';

const words: Record<WordleLength, string[]> = {
  5: ['APPLE', 'BEACH', 'CHAIR', 'DREAM', 'GRAPE', 'HOUSE', 'LIGHT', 'MOUSE'],
  6: ['BRIDGE', 'CASTLE', 'FOREST', 'GARDEN', 'PLANET', 'SILVER', 'WINTER', 'YELLOW'],
};

export function chooseWord(length: WordleLength, previous?: string) {
  const options = words[length].filter((word) => word !== previous);
  return options[Math.floor(Math.random() * options.length)];
}

export function scoreGuess(guess: string, answer: string): LetterResult[] {
  const result: LetterResult[] = Array(answer.length).fill('absent') as LetterResult[];
  const remaining = [...answer];
  [...guess].forEach((letter, index) => {
    if (letter === answer[index]) {
      result[index] = 'correct';
      remaining[index] = '';
    }
  });
  [...guess].forEach((letter, index) => {
    if (result[index] === 'correct') return;
    const match = remaining.indexOf(letter);
    if (match >= 0) {
      result[index] = 'present';
      remaining[match] = '';
    }
  });
  return result;
}

export function keyboardResults(guesses: string[], answer: string) {
  const strength: Record<LetterResult, number> = { empty: 0, absent: 1, present: 2, correct: 3 };
  const results: Record<string, LetterResult> = {};
  guesses.forEach((guess) => scoreGuess(guess, answer).forEach((result, index) => {
    const letter = guess[index];
    if (!results[letter] || strength[result] > strength[results[letter]]) results[letter] = result;
  }));
  return results;
}
