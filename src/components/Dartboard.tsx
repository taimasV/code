import type { MouseEvent } from 'react';
import { dartNumbers, scoreDart, type DartThrow } from '../lib/darts';

type DartboardProps = { disabled: boolean; throws: DartThrow[]; onThrow: (result: DartThrow) => void };

export function Dartboard({ disabled, throws, onThrow }: DartboardProps) {
  function throwDart(event: MouseEvent<HTMLButtonElement>) {
    if (disabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    onThrow(scoreDart((event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height));
  }

  return (
    <button className="dartboard" disabled={disabled} onClick={throwDart} aria-label="Dartboard: click to throw">
      {dartNumbers.map((number, index) => {
        const angle = index * Math.PI / 10;
        const position = { left: `${50 + Math.sin(angle) * 45}%`, top: `${50 - Math.cos(angle) * 45}%` };
        return <span className="dart-number" key={number} style={position}>{number}</span>;
      })}
      {throws.map((dart, index) => (
        <span className="dart-mark" key={index} style={{ left: `${dart.x * 100}%`, top: `${dart.y * 100}%` }}>{index + 1}</span>
      ))}
    </button>
  );
}
