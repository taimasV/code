import type { CSSProperties } from 'react';
import type { Point, SnakeState } from '../lib/snake';

type SnakeBoardProps = {
  state: SnakeState;
};

function positionStyle(point: Point, size: number): CSSProperties {
  return {
    width: `${100 / size}%`,
    height: `${100 / size}%`,
    transform: `translate3d(${point.x * 100}%, ${point.y * 100}%, 0)`,
  };
}

export function SnakeBoard({ state }: SnakeBoardProps) {
  return (
    <div
      className="snake-board"
      role="grid"
      aria-label="Snake game board"
      style={{ backgroundSize: `${100 / state.size}% ${100 / state.size}%` }}
    >
      {state.snakes.flatMap((snake) => snake.body.map((part, partIndex) => (
        <span
          className={`snake-part snake-part--${snake.color} ${partIndex === 0 ? 'snake-part--head' : ''}`}
          key={partIndex}
          style={positionStyle(part, state.size)}
        />
      )))}
      {state.foods.map((food) => (
        <span className="snake-food" key={`${food.x}-${food.y}`} style={positionStyle(food, state.size)}>{food.symbol}</span>
      ))}
    </div>
  );
}
