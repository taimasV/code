import { useEffect, useState } from 'react';
import { dartNumbers, scoreDart, type DartThrow } from '../lib/darts';

type DartboardProps = { disabled: boolean; throws: DartThrow[]; onThrow: (result: DartThrow) => void };
type AimPhase = 'horizontal' | 'vertical';

function useMovingAim(active: boolean, phase: AimPhase) {
  const [position, setPosition] = useState(0.08);

  useEffect(() => {
    if (!active) return;
    let frame = 0;
    const startedAt = performance.now();
    const update = (now: number) => {
      const progress = ((now - startedAt) % 1800) / 1800;
      const wave = progress <= 0.5 ? progress * 2 : (1 - progress) * 2;
      setPosition(0.08 + wave * 0.84);
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [active, phase]);

  return position;
}

export function Dartboard({ disabled, throws, onThrow }: DartboardProps) {
  const [phase, setPhase] = useState<AimPhase>('horizontal');
  const [lockedX, setLockedX] = useState<number | null>(null);
  const aim = useMovingAim(!disabled, phase);
  const targetX = lockedX ?? aim;
  const targetY = phase === 'vertical' ? aim : 0.5;

  function lockOrThrow() {
    if (disabled) return;
    if (phase === 'horizontal') {
      setLockedX(aim);
      setPhase('vertical');
      return;
    }
    onThrow(scoreDart(targetX, targetY));
    setLockedX(null);
    setPhase('horizontal');
  }

  return (
    <div className="dart-game">
      <div className={`dartboard ${disabled ? 'dartboard--disabled' : ''}`} role="img" aria-label="Numbered dartboard with double and triple rings">
        {dartNumbers.map((number, index) => {
          const angle = index * Math.PI / 10;
          const position = { left: `${50 + Math.sin(angle) * 46}%`, top: `${50 - Math.cos(angle) * 46}%` };
          return <span className="dart-number" key={number} style={position}>{number}</span>;
        })}
        {!disabled && <>
          <span className="dart-aim-line dart-aim-line--x" style={{ left: `${targetX * 100}%` }} />
          {phase === 'vertical' && <span className="dart-aim-line dart-aim-line--y" style={{ top: `${targetY * 100}%` }} />}
          <span className="dart-crosshair" style={{ left: `${targetX * 100}%`, top: `${targetY * 100}%` }} />
        </>}
        {throws.map((dart, index) => (
          <span className="dart-mark" key={index} style={{ left: `${dart.x * 100}%`, top: `${dart.y * 100}%` }}>{index + 1}</span>
        ))}
      </div>
      <div className="dart-ring-legend"><span>Outer ring <strong>×2</strong></span><span>Middle ring <strong>×3</strong></span></div>
      <p className="dart-aim-hint">{phase === 'horizontal' ? 'Stop the horizontal slider' : 'Stop the vertical slider and throw'}</p>
      <button className="restart-button dart-aim-button" disabled={disabled} onClick={lockOrThrow}>
        {phase === 'horizontal' ? 'Lock horizontal' : 'Throw dart'}
      </button>
    </div>
  );
}
