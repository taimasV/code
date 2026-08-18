export type YatzyCategory = {
  id: string;
  label: string;
  score: (dice: number[]) => number;
};

const counts = (dice: number[]) => Array.from({ length: 6 }, (_, index) => dice.filter((die) => die === index + 1).length);
const sum = (dice: number[]) => dice.reduce((total, die) => total + die, 0);
const hasStraight = (dice: number[], length: number) => {
  const values = new Set(dice);
  const starts = length === 5 ? [1, 2] : [1, 2, 3];
  return starts.some((start) => Array.from({ length }, (_, index) => start + index).every((value) => values.has(value)));
};

export const yatzyCategories: YatzyCategory[] = [
  ...Array.from({ length: 6 }, (_, index) => ({
    id: `number-${index + 1}`,
    label: ['Ones', 'Twos', 'Threes', 'Fours', 'Fives', 'Sixes'][index],
    score: (dice: number[]) => dice.filter((die) => die === index + 1).length * (index + 1),
  })),
  { id: 'three-kind', label: 'Three of a kind', score: (dice) => counts(dice).some((count) => count >= 3) ? sum(dice) : 0 },
  { id: 'four-kind', label: 'Four of a kind', score: (dice) => counts(dice).some((count) => count >= 4) ? sum(dice) : 0 },
  { id: 'full-house', label: 'Full house', score: (dice) => counts(dice).includes(3) && counts(dice).includes(2) ? 25 : 0 },
  { id: 'small-straight', label: 'Small straight', score: (dice) => hasStraight(dice, 4) ? 30 : 0 },
  { id: 'large-straight', label: 'Large straight', score: (dice) => hasStraight(dice, 5) ? 40 : 0 },
  { id: 'yatzy', label: 'Yatzy', score: (dice) => counts(dice).includes(5) ? 50 : 0 },
  { id: 'chance', label: 'Chance', score: sum },
];

export function rollYatzyDice(dice: number[], held: boolean[]) {
  return dice.map((die, index) => held[index] ? die : Math.floor(Math.random() * 6) + 1);
}
