import { useRef, type CSSProperties, type MouseEvent } from 'react';
import type { Point, SnakeState } from '../lib/snake';

type SnakeBoardProps = {
  freeMode: boolean;
  onAim: (point: Point) => void;
  state: SnakeState;
};

function positionStyle(point: Point, size: number): CSSProperties {
  return { width: `${100 / size}%`, height: `${100 / size}%`, transform: `translate3d(${point.x * 100}%, ${point.y * 100}%, 0)` };
}

export function SnakeBoard({ state, freeMode, onAim }: SnakeBoardProps) {
  const previousPositions = useRef(new Map<string, Point>());
  const nextPositions = new Map<string, Point>();

  function followMouse(event: MouseEvent<HTMLDivElement>) {
    if (!freeMode) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const target = { x: ((event.clientX - bounds.left) / bounds.width) * state.size, y: ((event.clientY - bounds.top) / bounds.height) * state.size };
    onAim(target);
  }

  const parts = state.snakes.flatMap((snake, snakeIndex) => snake.body.map((part, partIndex) => {
    const key = `${snakeIndex}-${partIndex}`;
    const previous = previousPositions.current.get(key);
    const crossedEdge = previous && (Math.abs(previous.x - part.x) > 1 || Math.abs(previous.y - part.y) > 1);
    nextPositions.set(key, part);
    return (
      <span
        className={`snake-part snake-part--${snake.color} ${partIndex === 0 ? 'snake-part--head' : ''} ${crossedEdge ? 'snake-part--teleport' : ''}`}
        key={key}
        style={positionStyle(part, state.size)}
      />
    );
  }));
  previousPositions.current = nextPositions;

  return (
    <div
      className={`snake-board ${freeMode ? 'snake-board--free' : ''}`}
      onMouseMove={followMouse}
      role="grid"
      aria-label="Snake game board"
      style={{ backgroundSize: `${100 / state.size}% ${100 / state.size}%` }}
    >
      {parts}
      {state.foods.map((food) => (
        <span className="snake-food" key={`${food.x}-${food.y}`} style={positionStyle(food, state.size)}>{food.symbol}</span>
      ))}
    </div>
  );
}
