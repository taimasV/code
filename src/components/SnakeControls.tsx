import type { Direction } from '../lib/snake';

type SnakeControlsProps = {
  onMove: (direction: Direction) => void;
};

export function SnakeControls({ onMove }: SnakeControlsProps) {
  return (
    <div className="snake-controls" aria-label="Snake controls">
      <button className="snake-control snake-control--up" onClick={() => onMove('up')} aria-label="Move up">↑</button>
      <button className="snake-control snake-control--left" onClick={() => onMove('left')} aria-label="Move left">←</button>
      <button className="snake-control snake-control--down" onClick={() => onMove('down')} aria-label="Move down">↓</button>
      <button className="snake-control snake-control--right" onClick={() => onMove('right')} aria-label="Move right">→</button>
    </div>
  );
}
