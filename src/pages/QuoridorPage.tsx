import { useEffect, useState } from 'react';
import { GamePageHeader } from '../components/GamePageHeader';
import { QuoridorBoard } from '../components/QuoridorBoard';
import { QuoridorModeSelect, type QuoridorMode } from '../components/QuoridorModeSelect';
import {
  STARTING_WALLS, canPlaceWall, createPawns, getLegalMoves, hasWon,
  type Pawns, type Player, type Position, type Wall,
} from '../lib/quoridor';
import { chooseQuoridorBotAction } from '../lib/quoridorBot';

type Action = 'move' | Wall['orientation'];

export function QuoridorPage() {
  const [mode, setMode] = useState<QuoridorMode | null>(null);
  const [pawns, setPawns] = useState<Pawns>(createPawns);
  const [walls, setWalls] = useState<Wall[]>([]);
  const [wallsLeft, setWallsLeft] = useState<Record<Player, number>>({ blue: STARTING_WALLS, red: STARTING_WALLS });
  const [turn, setTurn] = useState<Player>('blue');
  const [winner, setWinner] = useState<Player | null>(null);
  const [action, setAction] = useState<Action>('move');
  const legalMoves = getLegalMoves(turn, pawns, walls);
  const botThinking = mode === 'bot' && turn === 'red' && !winner;

  useEffect(() => {
    if (!botThinking) return;
    const timer = window.setTimeout(() => {
      const choice = chooseQuoridorBotAction(pawns, walls, wallsLeft.red);
      if (choice.type === 'wall') {
        setWalls((current) => [...current, choice.wall]);
        setWallsLeft((current) => ({ ...current, red: current.red - 1 }));
        setTurn('blue');
      } else {
        setPawns((current) => ({ ...current, red: choice.position }));
        if (hasWon('red', choice.position)) setWinner('red');
        else setTurn('blue');
      }
      setAction('move');
    }, 650);
    return () => window.clearTimeout(timer);
  }, [botThinking, pawns, walls, wallsLeft.red]);

  function finishTurn() {
    setTurn((current) => current === 'blue' ? 'red' : 'blue');
    setAction('move');
  }

  function movePawn(position: Position) {
    if (botThinking || !legalMoves.some((move) => move.row === position.row && move.column === position.column)) return;
    setPawns((current) => ({ ...current, [turn]: position }));
    if (hasWon(turn, position)) setWinner(turn);
    else finishTurn();
  }

  function placeWall(wall: Wall) {
    if (botThinking || !wallsLeft[turn] || !canPlaceWall(wall, walls, pawns)) return;
    setWalls((current) => [...current, wall]);
    setWallsLeft((current) => ({ ...current, [turn]: current[turn] - 1 }));
    finishTurn();
  }

  function start(nextMode: QuoridorMode) {
    setMode(nextMode);
    setPawns(createPawns());
    setWalls([]);
    setWallsLeft({ blue: STARTING_WALLS, red: STARTING_WALLS });
    setTurn('blue');
    setWinner(null);
    setAction('move');
  }

  const playerName = turn === 'blue' ? 'Blue' : 'Red';
  const status = winner ? `${winner === 'blue' ? 'Blue' : 'Red'} wins! 🎉` : botThinking ? 'Bot is thinking…' : `${playerName}'s turn`;

  return (
    <main className="container game-page">
      <GamePageHeader number="13" />
      <section className="game-panel game-panel--quoridor">
        <span className="game-icon" aria-hidden="true">🚧</span>
        <h1>Quoridor</h1>
        {!mode ? <QuoridorModeSelect onSelect={start} /> : <>
          <p className={`game-status ${winner ? 'game-status--winner' : ''}`}>{status}</p>
          <div className="quoridor-info"><span>🔵 Walls: <strong>{wallsLeft.blue}</strong></span><span>🔴 Walls: <strong>{wallsLeft.red}</strong></span></div>
          <div className="quoridor-tools">
            <button className={action === 'move' ? 'mine-tool mine-tool--active' : 'mine-tool'} disabled={botThinking} onClick={() => setAction('move')}>Move pawn</button>
            <button className={action === 'horizontal' ? 'mine-tool mine-tool--active' : 'mine-tool'} disabled={botThinking || !wallsLeft[turn]} onClick={() => setAction('horizontal')}>Horizontal wall</button>
            <button className={action === 'vertical' ? 'mine-tool mine-tool--active' : 'mine-tool'} disabled={botThinking || !wallsLeft[turn]} onClick={() => setAction('vertical')}>Vertical wall</button>
          </div>
          <QuoridorBoard action={action} disabled={botThinking} legalMoves={legalMoves} onMove={movePawn} onWall={placeWall} pawns={pawns} turn={turn} walls={walls} winner={winner} />
          <p className="game-hint">Reach the opposite side first. Walls may slow your rival, but every player must always have a path.</p>
          <div className="chess-actions"><button className="restart-button" onClick={() => start(mode)}>New game</button><button className="mine-tool" onClick={() => setMode(null)}>Change mode</button></div>
        </>}
      </section>
    </main>
  );
}
