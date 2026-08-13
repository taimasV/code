import { useEffect, useRef, useState } from 'react';

type TestState = 'idle' | 'waiting' | 'ready' | 'result' | 'finished' | 'early';

export function ReactionTest() {
  const [state, setState] = useState<TestState>('idle');
  const [results, setResults] = useState<number[]>([]);
  const readyAt = useRef(0);

  useEffect(() => {
    if (state !== 'waiting') return;
    const timer = window.setTimeout(() => {
      readyAt.current = performance.now();
      setState('ready');
    }, 1500 + Math.random() * 3000);
    return () => window.clearTimeout(timer);
  }, [state]);

  function startRound() { setState('waiting'); }

  function pressPanel() {
    if (state === 'waiting') setState('early');
    if (state === 'ready') {
      const time = Math.round(performance.now() - readyAt.current);
      const nextResults = [...results, time];
      setResults(nextResults);
      setState(nextResults.length === 5 ? 'finished' : 'result');
    }
  }

  function restart() { setResults([]); setState('waiting'); }

  const latest = results[results.length - 1];
  const average = results.length ? Math.round(results.reduce((sum, time) => sum + time, 0) / results.length) : 0;
  const message = state === 'waiting' ? 'Wait for green…' : state === 'ready' ? 'CLICK!' : state === 'early'
    ? 'Too early!' : state === 'result' ? `${latest} ms` : state === 'finished' ? `Average: ${average} ms` : 'Test your reaction time';

  return (
    <div className="reaction-game">
      <div className="reaction-stats"><span>Round <strong>{Math.min(results.length + 1, 5)}/5</strong></span><span>Best <strong>{results.length ? `${Math.min(...results)} ms` : '—'}</strong></span></div>
      <button className={`reaction-panel reaction-panel--${state}`} onClick={pressPanel} disabled={!['waiting', 'ready'].includes(state)}>
        <strong>{message}</strong>
        <small>{state === 'waiting' ? 'Do not click yet' : state === 'ready' ? 'Tap anywhere in this box' : ''}</small>
      </button>
      {state === 'idle' && <button className="restart-button" onClick={startRound}>Start test</button>}
      {state === 'early' && <button className="restart-button" onClick={startRound}>Try again</button>}
      {state === 'result' && <button className="restart-button" onClick={startRound}>Next round</button>}
      {state === 'finished' && <button className="restart-button" onClick={restart}>Test again</button>}
    </div>
  );
}
