export type Direction = 'up' | 'down' | 'left' | 'right';
export type Point = { x: number; y: number };
export type SnakeFood = Point & { points: number; symbol: string };
export type Snake = { body: Point[]; direction: Direction; color: string };
export type SnakeState = { snakes: Snake[]; foods: SnakeFood[]; score: number; size: number; status: 'playing' | 'lost' | 'won' };

export const SOLO_SIZE = 16;

const moves: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const foodKinds = [
  { symbol: '🍎', points: 1 },
  { symbol: '🍇', points: 2 },
  { symbol: '🍓', points: 2 },
  { symbol: '⭐', points: 3 },
];

export function createSnakeGame(): SnakeState {
  const snake: Snake = {
    body: [{ x: 4, y: 8 }, { x: 3, y: 8 }, { x: 2, y: 8 }],
    direction: 'right',
    color: 'player',
  };
  return {
    snakes: [snake],
    foods: [randomGridFood([snake], SOLO_SIZE)],
    score: 0,
    size: SOLO_SIZE,
    status: 'playing',
  };
}

export function changeDirection(current: Direction, next: Direction) {
  const opposite: Record<Direction, Direction> = {
    up: 'down', down: 'up', left: 'right', right: 'left',
  };
  return opposite[current] === next ? current : next;
}

export function advanceSnakeGame(state: SnakeState, direction: Direction): SnakeState {
  if (state.status !== 'playing') return state;
  const snake = state.snakes[0];
  const nextDirection = changeDirection(snake.direction, direction);
  const head = add(snake.body[0], moves[nextDirection]);

  if (outside(head, state.size) || snake.body.some((part) => equal(part, head))) {
    return { ...state, status: 'lost' };
  }

  const ate = equal(head, state.foods[0]);
  const body = [head, ...(ate ? snake.body : snake.body.slice(0, -1))];
  const snakes = [{ ...snake, direction: nextDirection, body }];
  return {
    ...state,
    snakes,
    foods: ate ? [randomGridFood(snakes, state.size)] : state.foods,
    score: state.score + (ate ? state.foods[0].points : 0),
    status: body.length === state.size ** 2 ? 'won' : 'playing',
  };
}

function randomGridFood(snakes: Snake[], size: number): SnakeFood {
  const occupied = snakes.flatMap((snake) => snake.body);
  const freeCells = Array.from({ length: size ** 2 }, (_, index) => ({
    x: index % size,
    y: Math.floor(index / size),
  })).filter((cell) => !occupied.some((part) => equal(part, cell)));
  const point = freeCells[Math.floor(Math.random() * freeCells.length)] ?? { x: 0, y: 0 };
  return { ...point, ...foodKinds[Math.floor(Math.random() * foodKinds.length)] };
}

function add(a: Point, b: Point) { return { x: a.x + b.x, y: a.y + b.y }; }
function outside(point: Point, size: number) { return point.x < 0 || point.y < 0 || point.x >= size || point.y >= size; }
function equal(a: Point, b: Point) { return a.x === b.x && a.y === b.y; }
