import type { CSSProperties } from 'react';
import { BOARD_SIZE, canPlaceWall, same, type Pawns, type Player, type Position, type Wall } from '../lib/quoridor';

type QuoridorBoardProps = {
  action: 'move' | Wall['orientation'];
  disabled: boolean;
  legalMoves: Position[];
  onMove: (position: Position) => void;
  onWall: (wall: Wall) => void;
  pawns: Pawns;
  turn: Player;
  walls: Wall[];
  winner: Player | null;
};

function cellStyle(row: number, column: number): CSSProperties {
  return { gridRow: row * 2 + 1, gridColumn: column * 2 + 1 };
}

function wallStyle(wall: Wall): CSSProperties {
  return wall.orientation === 'horizontal'
    ? { gridRow: wall.row * 2 + 2, gridColumn: `${wall.column * 2 + 1} / span 3` }
    : { gridRow: `${wall.row * 2 + 1} / span 3`, gridColumn: wall.column * 2 + 2 };
}

export function QuoridorBoard(props: QuoridorBoardProps) {
  const { action, disabled, legalMoves, onMove, onWall, pawns, turn, walls, winner } = props;
  const cells = Array.from({ length: BOARD_SIZE ** 2 }, (_, index) => ({
    row: Math.floor(index / BOARD_SIZE), column: index % BOARD_SIZE,
  }));
  const slots = Array.from({ length: (BOARD_SIZE - 1) ** 2 }, (_, index) => ({
    row: Math.floor(index / (BOARD_SIZE - 1)), column: index % (BOARD_SIZE - 1),
  }));

  return (
    <div className="quoridor-board" role="grid" aria-label="Quoridor board">
      {cells.map((cell) => {
        const pawn = same(cell, pawns.blue) ? 'blue' : same(cell, pawns.red) ? 'red' : null;
        const legal = action === 'move' && legalMoves.some((move) => same(move, cell));
        return (
          <button className={`quoridor-cell ${legal ? 'quoridor-cell--legal' : ''}`} disabled={!legal || disabled || Boolean(winner)} key={`${cell.row}-${cell.column}`} onClick={() => onMove(cell)} style={cellStyle(cell.row, cell.column)} aria-label={pawn ? `${pawn} pawn` : `Row ${cell.row + 1}, column ${cell.column + 1}`}>
            {pawn && <span className={`quoridor-pawn quoridor-pawn--${pawn}`} />}
          </button>
        );
      })}
      {walls.map((wall, index) => <span className={`quoridor-wall quoridor-wall--${wall.orientation}`} key={`wall-${index}`} style={wallStyle(wall)} />)}
      {action !== 'move' && slots.map((slot) => {
        const wall = { ...slot, orientation: action };
        const allowed = !disabled && !winner && canPlaceWall(wall, walls, pawns);
        return <button className="quoridor-wall-slot" disabled={!allowed} key={`${action}-${slot.row}-${slot.column}`} onClick={() => onWall(wall)} style={wallStyle(wall)} aria-label={`Place ${action} wall`} />;
      })}
      <span className={`quoridor-turn quoridor-turn--${turn}`} aria-hidden="true" />
    </div>
  );
}
