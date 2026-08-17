export type NonogramMark = 0 | 1 | 2;

export const NONOGRAM_PUZZLES = [
  ['0011111100','0111111110','1101101011','1111111111','0111111110','0011111100','0001111000','0010110100','0101001010','1000000001'],
  ['0001100000','0011110000','0111111000','1111111100','1111111110','0111111000','0011110000','0010010000','0100001000','1000000100'],
  ['1000000001','0100000010','0010000100','0001001000','0000110000','0000110000','0001001000','0010000100','0100000010','1000000001'],
];

export function createNonogramBoard(size = 10): NonogramMark[] {
  return Array(size ** 2).fill(0) as NonogramMark[];
}

export function getNonogramClues(lines: string[]) {
  const rows = lines.map(lineClues);
  const columns = Array.from({ length: lines[0].length }, (_, column) =>
    lineClues(lines.map((row) => row[column]).join('')));
  return { columns, rows };
}

export function isNonogramComplete(board: NonogramMark[], puzzle: string[]) {
  return board.every((mark, index) => (mark === 1) === (puzzle[Math.floor(index / 10)][index % 10] === '1'));
}

function lineClues(line: string) {
  const groups = line.match(/1+/g);
  return groups ? groups.map((group) => group.length) : [0];
}
