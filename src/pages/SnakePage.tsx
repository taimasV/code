import { useEffect, useRef, useState } from 'react';
import { GamePageHeader } from '../components/GamePageHeader';
import { SnakeBoard } from '../components/SnakeBoard';
import { SnakeControls } from '../components/SnakeControls';
import { advanceSnakeGame, changeDirection, createSnakeGame, type Direction, type Point, type SnakeMode } from '../lib/snake';

const keyDirections: Record<string, Direction | undefined> = {
  ArrowUp: 'up', w: 'up', ArrowDown: 'down', s: 'down',
  ArrowLeft: 'left', a: 'left', ArrowRight: 'right', d: 'right',
};

export function SnakePage() {
  const [mode, setMode] = useState<SnakeMode>('solo');
  const [game, setGame] = useState(() => createSnakeGame('solo'));
  const [running, setRunning] = useState(false);
  const direction = useRef<Direction>('right');
  const target = useRef<Point>({ x: 10, y: 8 });
  const head = useRef<Point>(game.snakes[0].body[0]);
  head.current = game.snakes[0].body[0];

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      const next = keyDirections[event.key];
      if (!next) return;
      event.preventDefault();
      direction.current = changeDirection(direction.current, next);
      const vectors: Record<Direction, Point> = { up: { x: 0, y: -6 }, down: { x: 0, y: 6 }, left: { x: -6, y: 0 }, right: { x: 6, y: 0 } };
      target.current = { x: head.current.x + vectors[next].x, y: head.current.y + vectors[next].y };
      setRunning(true);
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (!running || game.status !== 'playing') return;
    const timer = window.setInterval(() => {
      setGame((current) => advanceSnakeGame(current, direction.current, mode, target.current));
    }, mode === 'solo' ? 135 : 40);
    return () => window.clearInterval(timer);
  }, [game.status, mode, running]);

  function move(next: Direction) {
    direction.current = changeDirection(direction.current, next);
    const vectors: Record<Direction, Point> = { up: { x: 0, y: -6 }, down: { x: 0, y: 6 }, left: { x: -6, y: 0 }, right: { x: 6, y: 0 } };
    target.current = { x: head.current.x + vectors[next].x, y: head.current.y + vectors[next].y };
    setRunning(true);
  }

  function aim(point: Point) {
    target.current = point;
    setRunning(true);
  }

  function startGame(nextMode = mode) {
    setMode(nextMode);
    setGame(createSnakeGame(nextMode));
    direction.current = 'right';
    target.current = { x: 10, y: 8 };
    setRunning(false);
  }

  const status = game.status === 'lost' ? 'Game over!' : game.status === 'won' ? 'Board filled! 🎉' : `Score: ${game.score}`;

  return (
    <main className="container game-page">
      <GamePageHeader number="03" />
      <section className="game-panel game-panel--snake">
        <span className="game-icon" aria-hidden="true">🐍</span>
        <h1>Snake</h1>
        <div className="difficulty-tabs" aria-label="Game mode">
          <button className={mode === 'solo' ? 'difficulty-tab difficulty-tab--active' : 'difficulty-tab'} onClick={() => startGame('solo')}>Solo <span>Fill the board</span></button>
          <button className={mode === 'bots' ? 'difficulty-tab difficulty-tab--active' : 'difficulty-tab'} onClick={() => startGame('bots')}>With bots <span>Avoid rivals</span></button>
        </div>
        <p className={game.status === 'won' ? 'game-status game-status--winner' : 'game-status'}>{status}</p>
        <SnakeBoard state={game} freeMode={mode === 'bots'} onAim={aim} />
        <div className="snake-actions">
          <button className="restart-button" onClick={() => game.status === 'playing' ? setRunning(!running) : startGame()}>{game.status !== 'playing' ? 'Play again' : running ? 'Pause' : 'Start'}</button>
          <button className="mine-tool" onClick={() => startGame()}>Restart</button>
        </div>
        <SnakeControls onMove={move} />
        <p className="game-hint">{mode === 'bots' ? 'Move your mouse over the arena to steer. The edges wrap around.' : 'Use arrow keys, WASD, or the buttons.'}</p>
      </section>
    </main>
  );
}
