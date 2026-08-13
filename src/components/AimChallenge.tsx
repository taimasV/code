import { useEffect, useRef, useState } from 'react';

type Target = { x: number; y: number; size: number };

function createTarget(score: number): Target {
  const size = Math.max(38, 68 - score);
  return { x: Math.random() * (100 - size / 4 - 8) + 4, y: Math.random() * (100 - size / 4 - 8) + 4, size };
}

export function AimChallenge() {
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [target, setTarget] = useState(() => createTarget(0));
  const scoreRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setSeconds((current) => {
        if (current > 1) return current - 1;
        setRunning(false);
        setBest((oldBest) => Math.max(oldBest, scoreRef.current));
        return 0;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  function start() {
    setScore(0);
    scoreRef.current = 0;
    setSeconds(30);
    setTarget(createTarget(0));
    setRunning(true);
  }

  function hitTarget() {
    if (!running) return;
    const nextScore = score + 1;
    setScore(nextScore);
    scoreRef.current = nextScore;
    setTarget(createTarget(nextScore));
  }

  return (
    <div className="reaction-game">
      <div className="reaction-stats"><span>Score <strong>{score}</strong></span><span>Time <strong>{seconds}s</strong></span><span>Best <strong>{best}</strong></span></div>
      <div className="aim-arena">
        {running ? (
          <button className="aim-target" style={{ left: `${target.x}%`, top: `${target.y}%`, width: target.size, height: target.size }} onClick={hitTarget} aria-label="Target" />
        ) : (
          <div className="reaction-overlay"><strong>{seconds === 0 ? `Time! Score: ${score}` : 'Hit as many targets as you can'}</strong><button className="restart-button" onClick={start}>{seconds === 0 ? 'Play again' : 'Start challenge'}</button></div>
        )}
      </div>
      <p className="game-hint">Targets get smaller as your score grows.</p>
    </div>
  );
}
