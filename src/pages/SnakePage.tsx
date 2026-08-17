import { useEffect, useRef, useState } from 'react';
import { GamePageHeader } from '../components/GamePageHeader';
import { SnakeBoard } from '../components/SnakeBoard';
import { SnakeControls } from '../components/SnakeControls';
import { advanceSnakeGame, changeDirection, createSnakeGame, type Direction } from '../lib/snake';

const keyDirections: Record<string, Direction | undefined> = {
  ArrowUp: 'up', w: 'up', ArrowDown: 'down', s: 'down',
  ArrowLeft: 'left', a: 'left', ArrowRight: 'right', d: 'right',
};

export function SnakePage() {
  const [game, setGame] = useState(createSnakeGame);
  const [running, setRunning] = useState(false);
  const direction = useRef<Direction>('right');

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      const next = keyDirections[event.key];
      if (!next) return;
      event.preventDefault();
      direction.current = changeDirection(direction.current, next);
      setRunning(true);
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (!running || game.status !== 'playing') return;
    const timer = window.setInterval(() => {
      setGame((current) => advanceSnakeGame(current, direction.current));
    }, 135);
    return () => window.clearInterval(timer);
  }, [game.status, running]);

  function move(next: Direction) {
    direction.current = changeDirection(direction.current, next);
    setRunning(true);
  }

  function startGame() {
    setGame(createSnakeGame());
    direction.current = 'right';
    setRunning(false);
  }

  const status = game.status === 'lost'
    ? 'Game over!'
    : game.status === 'won' ? 'Board filled! 🎉' : `Score: ${game.score}`;

  return (
    <main className="container game-page">
      <GamePageHeader number="03" />
      <section className="game-panel game-panel--snake">
        <span className="game-icon" aria-hidden="true">🐍</span>
        <h1>Snake</h1>
        <p className={game.status === 'won' ? 'game-status game-status--winner' : 'game-status'}>{status}</p>
        <SnakeBoard state={game} />
        <div className="snake-actions">
          <button className="restart-button" onClick={() => game.status === 'playing' ? setRunning(!running) : startGame()}>
            {game.status !== 'playing' ? 'Play again' : running ? 'Pause' : 'Start'}
          </button>
          <button className="mine-tool" onClick={startGame}>Restart</button>
        </div>
        <SnakeControls onMove={move} />
        <p className="game-hint">Use arrow keys, WASD, or the buttons.</p>
      </section>
    </main>
  );
}
