import { useEffect, useState } from 'react';
import { BattleshipBoard } from '../components/BattleshipBoard';
import { GamePageHeader } from '../components/GamePageHeader';
import { GameWinStreakBadge } from '../components/GameWinStreak';
import {
  FLEET_SIZES, addShip, chooseBotShot, createRandomFleet,
  isFleetSunk, isHit, isSunk, type BattleShip, type Orientation,
} from '../lib/battleship';
import { useGameAttempt } from '../lib/useGameAttempt';

type Phase = 'placing' | 'battle' | 'won' | 'lost';

export function BattleshipPage() {
  const [phase, setPhase] = useState<Phase>('placing');
  const [orientation, setOrientation] = useState<Orientation>('horizontal');
  const [playerShips, setPlayerShips] = useState<BattleShip[]>([]);
  const [botShips, setBotShips] = useState<BattleShip[]>([]);
  const [playerShots, setPlayerShots] = useState(new Set<number>());
  const [botShots, setBotShots] = useState(new Set<number>());
  const [botTurn, setBotTurn] = useState(false);
  const [placementError, setPlacementError] = useState('');
  const [battleNotice, setBattleNotice] = useState('Choose a cell to fire.');
  const [sunkNotice, setSunkNotice] = useState('');
  const { attemptId, startNewAttempt } = useGameAttempt();
  const nextShipSize = FLEET_SIZES[playerShips.length];
  const playerShipsLeft = playerShips.filter((ship) => !isSunk(ship, botShots)).length;
  const botShipsLeft = botShips.filter((ship) => !isSunk(ship, playerShots)).length;

  useEffect(() => {
    if (!botTurn || phase !== 'battle') return;
    const timer = window.setTimeout(() => {
      const shot = chooseBotShot(botShots);
      const nextShots = new Set(botShots).add(shot);
      setBotShots(nextShots);
      const sunkShip = playerShips.find((ship) => ship.cells.includes(shot) && isSunk(ship, nextShots));
      const shipsLeft = playerShips.filter((ship) => !isSunk(ship, nextShots)).length;
      if (isFleetSunk(playerShips, nextShots)) setPhase('lost');
      else if (sunkShip) {
        setBattleNotice('The enemy sank your ship.');
        setSunkNotice(`Your ship was sunk. ${shipsLeft} ships left.`);
      }
      else setBattleNotice(isHit(playerShips, shot) ? 'The enemy hit your ship!' : 'The enemy missed. Your turn!');
      setBotTurn(false);
    }, 550);
    return () => window.clearTimeout(timer);
  }, [botShots, botTurn, phase, playerShips]);

  function placeShip(cell: number) {
    if (!nextShipSize) return;
    const next = addShip(playerShips, cell, nextShipSize, orientation);
    if (!next) {
      setPlacementError('Ships cannot touch each other or leave the board.');
      return;
    }
    setPlayerShips(next);
    setPlacementError('');
  }

  function startBattle() {
    if (playerShips.length !== FLEET_SIZES.length) return;
    setBotShips(createRandomFleet());
    setPhase('battle');
    setBattleNotice('Choose a cell to fire.');
    setSunkNotice('');
  }

  function shoot(cell: number) {
    if (phase !== 'battle' || botTurn || playerShots.has(cell)) return;
    const nextShots = new Set(playerShots).add(cell);
    setPlayerShots(nextShots);
    const sunkShip = botShips.find((ship) => ship.cells.includes(cell) && isSunk(ship, nextShots));
    const shipsLeft = botShips.filter((ship) => !isSunk(ship, nextShots)).length;
    setSunkNotice(sunkShip ? `Enemy ship sunk! ${shipsLeft} enemy ships left.` : '');
    if (isFleetSunk(botShips, nextShots)) setPhase('won');
    else {
      setBattleNotice(sunkShip ? `Enemy ship sunk! ${shipsLeft} ships left.` : isHit(botShips, cell) ? 'Hit!' : 'Miss!');
      setBotTurn(true);
    }
  }

  function reset() {
    setPhase('placing');
    setPlayerShips([]);
    setBotShips([]);
    setPlayerShots(new Set());
    setBotShots(new Set());
    setBotTurn(false);
    setPlacementError('');
    setBattleNotice('Choose a cell to fire.');
    setSunkNotice('');
    startNewAttempt();
  }

  const status = phase === 'placing'
    ? nextShipSize ? `Place a ${nextShipSize}-deck ship` : 'Fleet ready!'
    : phase === 'won' ? 'You sank the enemy fleet! 🎉'
    : phase === 'lost' ? 'Your fleet was sunk!' : botTurn ? 'Enemy is aiming…' : battleNotice;

  return (
    <main className="container game-page">
      <GamePageHeader number="05" />
      <section className="game-panel game-panel--battle">
        <span className="game-icon" aria-hidden="true">🚢</span>
        <h1>Battleship</h1>
        <p className={`game-status ${phase === 'won' ? 'game-status--winner' : ''}`}>{status}</p>
        <GameWinStreakBadge
          active
          attemptId={attemptId}
          game="battleship"
          result={phase === 'won' ? 'win' : phase === 'lost' ? 'loss' : null}
        />
        {phase !== 'placing' && (
          <>
            <div className="battle-score" aria-label="Ships remaining">
              <span>Your ships: <strong>{playerShipsLeft}</strong></span>
              <span>Enemy ships: <strong>{botShipsLeft}</strong></span>
            </div>
            {sunkNotice && <p className="battle-sunk-notice">{sunkNotice}</p>}
          </>
        )}

        {phase === 'placing' ? (
          <>
            <div className="battle-tools">
              <button className={orientation === 'horizontal' ? 'mine-tool mine-tool--active' : 'mine-tool'} onClick={() => setOrientation('horizontal')}>↔ Horizontal</button>
              <button className={orientation === 'vertical' ? 'mine-tool mine-tool--active' : 'mine-tool'} onClick={() => setOrientation('vertical')}>↕ Vertical</button>
            </div>
            <BattleshipBoard label="Your fleet" ships={playerShips} shots={new Set()} onCellClick={placeShip} />
            <p className="battle-message">{placementError || `${playerShips.length} of ${FLEET_SIZES.length} ships placed`}</p>
            <div className="battle-actions">
              <button className="mine-tool" onClick={() => setPlayerShips(playerShips.slice(0, -1))} disabled={!playerShips.length}>Undo</button>
              <button className="mine-tool" onClick={() => setPlayerShips(createRandomFleet())}>Place randomly</button>
              <button className="restart-button" onClick={startBattle} disabled={Boolean(nextShipSize)}>Start battle</button>
            </div>
          </>
        ) : (
          <>
            <div className="battle-fields">
              <div><h2>Your fleet</h2><BattleshipBoard label="Your fleet" ships={playerShips} shots={botShots} disabled /></div>
              <div><h2>Enemy waters</h2><BattleshipBoard label="Enemy waters" ships={botShips} shots={playerShots} hideShips disabled={botTurn || phase !== 'battle'} onCellClick={shoot} /></div>
            </div>
            <button className="restart-button" onClick={reset}>{phase === 'battle' ? 'Restart' : 'Play again'}</button>
          </>
        )}
      </section>
    </main>
  );
}
