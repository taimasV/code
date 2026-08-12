export type MemoryCard = {
  id: number;
  symbol: string;
};

export type MemoryDifficulty = {
  columns: number;
  id: 'easy' | 'medium' | 'hard';
  label: string;
  pairs: number;
};

export const MEMORY_DIFFICULTIES: MemoryDifficulty[] = [
  { id: 'easy', label: 'Easy', pairs: 6, columns: 4 },
  { id: 'medium', label: 'Medium', pairs: 10, columns: 5 },
  { id: 'hard', label: 'Hard', pairs: 15, columns: 6 },
];

const symbols = [
  '🚀', '🌈', '🎸', '🍉', '⭐', '🎨', '🦊', '🌵',
  '🍕', '⚽', '🎲', '🐳', '🍓', '🎈', '🌙',
];

export function createMemoryDeck(pairCount: number): MemoryCard[] {
  const selected = symbols.slice(0, pairCount);
  return shuffle([...selected, ...selected].map((symbol, id) => ({ id, symbol })));
}

function shuffle(cards: MemoryCard[]) {
  for (let index = cards.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [cards[index], cards[randomIndex]] = [cards[randomIndex], cards[index]];
  }
  return cards;
}
