export type MergeBoard = Array<number | null>;

export const MERGE_SIZE = 25;
export const MERGE_ITEMS = [
  { symbol: '🌱', name: 'Seedling' },
  { symbol: '🌿', name: 'Herb' },
  { symbol: '🌷', name: 'Flower' },
  { symbol: '🌳', name: 'Tree' },
  { symbol: '🍎', name: 'Apple' },
  { symbol: '🧺', name: 'Fruit basket' },
  { symbol: '🥧', name: 'Royal pie' },
  { symbol: '🏆', name: 'Golden trophy' },
];

export function createMergeBoard() {
  let board: MergeBoard = Array(MERGE_SIZE).fill(null);
  for (let index = 0; index < 6; index += 1) board = addMergeItem(board);
  return board;
}

export function addMergeItem(board: MergeBoard) {
  const emptyCells = board.flatMap((item, index) => item === null ? [index] : []);
  if (!emptyCells.length) return board;
  const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const next = [...board];
  next[cell] = Math.random() < 0.85 ? 0 : 1;
  return next;
}

export function moveOrMerge(board: MergeBoard, from: number, to: number) {
  const source = board[from];
  const target = board[to];
  if (source === null || from === to) return { board, mergedLevel: null };
  const next = [...board];
  if (target === null) {
    next[to] = source;
    next[from] = null;
    return { board: next, mergedLevel: null };
  }
  if (target !== source || source >= MERGE_ITEMS.length - 1) return { board, mergedLevel: null };
  next[from] = null;
  next[to] = source + 1;
  return { board: next, mergedLevel: source + 1 };
}

export function canMerge(board: MergeBoard) {
  return board.some((item, index) => item !== null && item < MERGE_ITEMS.length - 1
    && board.some((other, otherIndex) => otherIndex !== index && other === item));
}
