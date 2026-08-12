export type Direction = 'up' | 'down' | 'left' | 'right';
export type SnakeMode = 'solo' | 'bots';
export type Point = { x: number; y: number };
export type SnakeFood = Point & { points: number; symbol: string };
export type Snake = { body: Point[]; direction: Direction; color: string; isBot: boolean };
export type SnakeState = { snakes: Snake[]; foods: SnakeFood[]; score: number; size: number; status: 'playing' | 'lost' | 'won' };

export const SOLO_SIZE = 16;
export const ARENA_SIZE = 24;
const moves: Record<Direction, Point> = {
  up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 },
};
const foodKinds = [
  { symbol: '🍎', points: 1 }, { symbol: '🍇', points: 2 },
  { symbol: '🍓', points: 2 }, { symbol: '⭐', points: 3 },
];
const botSpawns = [
  { x: 18, y: 3 }, { x: 18, y: 7 }, { x: 18, y: 12 },
  { x: 18, y: 17 }, { x: 18, y: 21 },
];
const botColors = ['bot-one', 'bot-two', 'bot-three', 'bot-four', 'bot-five'];

export function createSnakeGame(mode: SnakeMode): SnakeState {
  if (mode === 'solo') {
    const snake: Snake = { body: [{ x: 4, y: 8 }, { x: 3, y: 8 }, { x: 2, y: 8 }], direction: 'right', color: 'player', isBot: false };
    return { snakes: [snake], foods: [randomFood([snake], [], SOLO_SIZE)], score: 0, size: SOLO_SIZE, status: 'playing' };
  }
  const player = makeArenaSnake(5, 12, 'player', false, 9);
  const bots = botSpawns.map((spawn, index) => makeArenaSnake(spawn.x, spawn.y, botColors[index], true, 8));
  const snakes = [player, ...bots];
  const foods: SnakeFood[] = [];
  while (foods.length < 7) foods.push(randomFood(snakes, foods, ARENA_SIZE));
  return { snakes, foods, score: 0, size: ARENA_SIZE, status: 'playing' };
}

export function changeDirection(current: Direction, next: Direction) {
  const opposite: Record<Direction, Direction> = { up: 'down', down: 'up', left: 'right', right: 'left' };
  return opposite[current] === next ? current : next;
}

export function advanceSnakeGame(state: SnakeState, direction: Direction, mode: SnakeMode, target?: Point) {
  if (state.status !== 'playing') return state;
  return mode === 'bots' ? advanceArena(state, target ?? state.foods[0]) : advanceSolo(state, direction);
}

function advanceSolo(state: SnakeState, direction: Direction): SnakeState {
  const snake = state.snakes[0];
  const nextDirection = changeDirection(snake.direction, direction);
  const head = add(snake.body[0], moves[nextDirection]);
  if (outside(head, state.size) || snake.body.some((part) => equal(part, head))) return { ...state, status: 'lost' };
  const ate = equal(head, state.foods[0]);
  const body = [head, ...(ate ? snake.body : snake.body.slice(0, -1))];
  const snakes = [{ ...snake, direction: nextDirection, body }];
  return {
    ...state, snakes, foods: ate ? [randomFood(snakes, [], state.size)] : state.foods,
    score: state.score + (ate ? state.foods[0].points : 0), status: body.length === state.size ** 2 ? 'won' : 'playing',
  };
}

function advanceArena(state: SnakeState, target: Point): SnakeState {
  const heads = state.snakes.map((snake, index) => {
    const destination = index === 0 ? target : nearestFood(snake.body[0], state.foods, state.size);
    return wrap(add(snake.body[0], scale(normalize(shortestVector(snake.body[0], destination, state.size)), 0.045)), state.size);
  });
  const dead = new Set<number>();
  heads.forEach((head, index) => {
    const bodies = state.snakes.flatMap((snake, snakeIndex) => snakeIndex === index ? snake.body.slice(3) : snake.body);
    const headHit = heads.some((otherHead, otherIndex) => otherIndex !== index && distance(head, otherHead, state.size) < 0.5);
    if (headHit || bodies.some((part) => distance(head, part, state.size) < 0.46)) dead.add(index);
  });
  if (dead.has(0)) return { ...state, foods: [...state.foods, ...dropFood(state.snakes[0])], status: 'lost' };

  const foods = [...state.foods];
  let score = state.score;
  const snakes = state.snakes.map((snake, index) => {
    if (dead.has(index)) {
      foods.push(...dropFood(snake));
      return respawnBot(index);
    }
    const foodIndex = foods.findIndex((food) => distance(heads[index], food, state.size) < 0.58);
    const ate = foodIndex >= 0;
    if (ate) {
      const [food] = foods.splice(foodIndex, 1);
      if (index === 0) score += food.points;
    }
    return { ...snake, body: followBody(heads[index], snake.body, ate, state.size) };
  });
  while (foods.length < 7) foods.push(randomFood(snakes, foods, state.size));
  return { ...state, snakes, foods, score };
}

function followBody(head: Point, oldBody: Point[], grow: boolean, size: number) {
  const body = [head];
  (grow ? oldBody : oldBody.slice(0, -1)).forEach((part) => {
    const leader = body[body.length - 1];
    const vector = shortestVector(part, leader, size);
    const length = magnitude(vector);
    body.push(length > 0.5 ? wrap(add(part, scale(normalize(vector), length - 0.5)), size) : part);
  });
  return body;
}

function makeArenaSnake(x: number, y: number, color: string, isBot: boolean, length: number): Snake {
  return { body: Array.from({ length }, (_, index) => ({ x: x - index * 0.5, y })), direction: 'right', color, isBot };
}
function respawnBot(index: number) { const spawn = botSpawns[index - 1]; return makeArenaSnake(spawn.x, spawn.y, botColors[index - 1], true, 8); }
function dropFood(snake: Snake) { return snake.body.filter((_, index) => index % 2 === 0).map((part) => ({ ...part, ...foodKinds[Math.floor(Math.random() * foodKinds.length)] })); }
function randomFood(snakes: Snake[], foods: SnakeFood[], size: number): SnakeFood {
  let point = { x: Math.random() * (size - 2) + 1, y: Math.random() * (size - 2) + 1 };
  while ([...snakes.flatMap((snake) => snake.body), ...foods].some((item) => distance(item, point, size) < 0.8)) point = { x: Math.random() * (size - 2) + 1, y: Math.random() * (size - 2) + 1 };
  return { ...point, ...foodKinds[Math.floor(Math.random() * foodKinds.length)] };
}
function nearestFood(head: Point, foods: SnakeFood[], size: number) { return [...foods].sort((a, b) => distance(head, a, size) - distance(head, b, size))[0]; }
function shortestVector(from: Point, to: Point, size: number) { let x = to.x - from.x; let y = to.y - from.y; if (Math.abs(x) > size / 2) x -= Math.sign(x) * size; if (Math.abs(y) > size / 2) y -= Math.sign(y) * size; return { x, y }; }
function distance(a: Point, b: Point, size: number) { return magnitude(shortestVector(a, b, size)); }
function magnitude(point: Point) { return Math.hypot(point.x, point.y); }
function normalize(point: Point) { const length = magnitude(point) || 1; return { x: point.x / length, y: point.y / length }; }
function scale(point: Point, amount: number) { return { x: point.x * amount, y: point.y * amount }; }
function add(a: Point, b: Point) { return { x: a.x + b.x, y: a.y + b.y }; }
function wrap(point: Point, size: number) { return { x: (point.x + size) % size, y: (point.y + size) % size }; }
function outside(point: Point, size: number) { return point.x < 0 || point.y < 0 || point.x >= size || point.y >= size; }
function equal(a: Point, b: Point) { return a.x === b.x && a.y === b.y; }
