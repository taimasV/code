import type { DotLevel } from './connectDots';

export function countDotSolutions(level: DotLevel, limit = 2, requireFullBoard = true) {
  return new NumberlinkCounter(level, limit, requireFullBoard).count();
}

class NumberlinkCounter {
  private readonly size: number;
  private readonly x: number[];
  private readonly y: number[];
  private readonly keys: number[];
  private readonly table: number[];
  private readonly mates: number[];
  private readonly start: number[];
  private readonly history: Array<[number, number]> = [];
  private readonly memo: Array<Map<string, number>>;

  constructor(
    private readonly level: DotLevel,
    private readonly limit: number,
    private readonly requireFullBoard: boolean,
  ) {
    this.size = level.size ** 2;
    this.x = Array(this.size);
    this.y = Array(this.size);
    this.keys = Array(this.size);
    this.table = Array(this.size).fill(0);
    this.mates = Array.from({ length: this.size }, (_, cell) => cell);
    this.start = Array(this.size + 1);
    this.memo = Array.from({ length: this.size }, () => new Map());
    this.initializeOrder();
    level.pairs.forEach((pair, pairIndex) => pair.ends.forEach((cell) => {
      this.table[this.key(cell % level.size, Math.floor(cell / level.size))] = pairIndex + 1;
    }));
  }

  count() { return this.solve(0); }

  private initializeOrder() {
    let column = 0;
    let row = 0;
    for (let cell = 0; cell < this.size; cell += 1) {
      this.x[cell] = column;
      this.y[cell] = row;
      this.keys[row * this.level.size + column] = cell;
      if (cell === this.size - 1) break;
      do {
        column -= 1;
        row += 1;
        if (column < 0) {
          column = row;
          row = 0;
        }
      } while (column >= this.level.size || row >= this.level.size);
    }
    for (let cell = 0; cell < this.size; cell += 1) {
      const columnAtCell = this.x[cell];
      const rowAtCell = this.y[cell];
      this.start[cell] = rowAtCell > 0
        ? this.key(columnAtCell, rowAtCell - 1)
        : columnAtCell > 0 ? this.key(columnAtCell - 1, rowAtCell) : 0;
    }
    this.start[this.size] = this.size;
  }

  private solve(cell: number): number {
    if (cell > 0) {
      for (let hidden = this.start[cell - 1]; hidden < this.start[cell]; hidden += 1) {
        if (this.table[hidden] === 0) {
          const unfinished = this.mates[hidden] !== -1 && this.mates[hidden] !== hidden;
          const unused = this.mates[hidden] === hidden;
          if (unfinished || (this.requireFullBoard && unused)) return 0;
        } else if (this.mates[hidden] === hidden) return 0;
      }
    }
    if (cell === this.size) return 1;
    const state = this.mates.slice(this.start[cell], cell).join(',');
    const saved = this.memo[cell].get(state);
    if (saved !== undefined) return saved;
    const solutions = this.connect(cell);
    this.memo[cell].set(state, solutions);
    return solutions;
  }

  private connect(cell: number) {
    const left = this.x[cell] > 0 ? this.key(this.x[cell] - 1, this.y[cell]) : -1;
    const up = this.y[cell] > 0 ? this.key(this.x[cell], this.y[cell] - 1) : -1;
    const checkpoint = this.history.length;
    let solutions = this.solve(cell + 1);
    if (up >= 0 && solutions < this.limit && this.unite(cell, up)) {
      solutions += this.solve(cell + 1);
    }
    this.revert(checkpoint);
    if (left >= 0 && solutions < this.limit && this.unite(cell, left)) {
      solutions += this.solve(cell + 1);
      if (up >= 0 && solutions < this.limit && this.unite(cell, up)) {
        solutions += this.solve(cell + 1);
      }
    }
    this.revert(checkpoint);
    return Math.min(solutions, this.limit);
  }

  private unite(first: number, second: number) {
    const firstEnd = this.mates[first];
    const secondEnd = this.mates[second];
    if (firstEnd === -1 || secondEnd === -1) return false;
    if (first === secondEnd && second === firstEnd) return false;
    this.change(first, -1);
    this.change(second, -1);
    this.change(firstEnd, secondEnd);
    this.change(secondEnd, firstEnd);
    if (this.mates[first] === -1 && this.table[first] > 0) return false;
    if (this.mates[second] === -1 && this.table[second] > 0) return false;
    return !(this.table[firstEnd] > 0 && this.table[secondEnd] > 0
      && this.table[firstEnd] !== this.table[secondEnd]);
  }

  private change(cell: number, value: number) {
    if (this.mates[cell] === value) return;
    this.history.push([cell, this.mates[cell]]);
    this.mates[cell] = value;
  }

  private revert(checkpoint: number) {
    while (this.history.length > checkpoint) {
      const [cell, value] = this.history.pop() as [number, number];
      this.mates[cell] = value;
    }
  }

  private key(column: number, row: number) { return this.keys[row * this.level.size + column]; }
}
