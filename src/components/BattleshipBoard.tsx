import { BATTLE_SIZE, isHit, isSunk, type BattleShip } from '../lib/battleship';

type BattleshipBoardProps = {
  disabled?: boolean;
  hideShips?: boolean;
  label: string;
  onCellClick?: (cell: number) => void;
  ships: BattleShip[];
  shots: Set<number>;
};

export function BattleshipBoard({ disabled, hideShips, label, onCellClick, ships, shots }: BattleshipBoardProps) {
  return (
    <div className="battle-board" role="grid" aria-label={label}>
      {Array.from({ length: BATTLE_SIZE ** 2 }, (_, cell) => {
        const ship = ships.find((item) => item.cells.includes(cell));
        const wasShot = shots.has(cell);
        const hit = wasShot && isHit(ships, cell);
        const showShip = ship && (!hideShips || (wasShot && isSunk(ship, shots)));
        return (
          <button
            aria-label={`${label} cell ${cell + 1}${hit ? ', hit' : wasShot ? ', miss' : ''}`}
            className={`battle-cell ${showShip ? 'battle-cell--ship' : ''} ${hit ? 'battle-cell--hit' : ''} ${wasShot && !hit ? 'battle-cell--miss' : ''}`}
            disabled={disabled || wasShot}
            key={cell}
            onClick={() => onCellClick?.(cell)}
            role="gridcell"
          >
            {hit ? '×' : wasShot ? '•' : ''}
          </button>
        );
      })}
    </div>
  );
}
