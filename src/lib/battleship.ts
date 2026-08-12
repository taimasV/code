export type Orientation = 'horizontal' | 'vertical';
export type BattleShip = { id: number; size: number; cells: number[] };

export const BATTLE_SIZE = 10;
export const FLEET_SIZES = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

export function getPlacement(start: number, size: number, orientation: Orientation) {
  const row = Math.floor(start / BATTLE_SIZE);
  const column = start % BATTLE_SIZE;
  if (orientation === 'horizontal' && column + size > BATTLE_SIZE) return [];
  if (orientation === 'vertical' && row + size > BATTLE_SIZE) return [];
  return Array.from({ length: size }, (_, offset) => start + (orientation === 'horizontal' ? offset : offset * BATTLE_SIZE));
}

export function canPlaceShip(ships: BattleShip[], cells: number[]) {
  if (!cells.length) return false;
  const blocked = new Set(ships.flatMap((ship) => ship.cells.flatMap(neighborsWithSelf)));
  return cells.every((cell) => !blocked.has(cell));
}

export function addShip(ships: BattleShip[], start: number, size: number, orientation: Orientation) {
  const cells = getPlacement(start, size, orientation);
  if (!canPlaceShip(ships, cells)) return null;
  return [...ships, { id: ships.length, size, cells }];
}

export function createRandomFleet() {
  let ships: BattleShip[] = [];
  FLEET_SIZES.forEach((size) => {
    let placed = false;
    while (!placed) {
      const start = Math.floor(Math.random() * BATTLE_SIZE ** 2);
      const orientation: Orientation = Math.random() > 0.5 ? 'horizontal' : 'vertical';
      const next = addShip(ships, start, size, orientation);
      if (next) { ships = next; placed = true; }
    }
  });
  return ships;
}

export function isFleetSunk(ships: BattleShip[], shots: Set<number>) {
  return ships.every((ship) => ship.cells.every((cell) => shots.has(cell)));
}

export function isHit(ships: BattleShip[], cell: number) {
  return ships.some((ship) => ship.cells.includes(cell));
}

export function isSunk(ship: BattleShip, shots: Set<number>) {
  return ship.cells.every((cell) => shots.has(cell));
}

export function chooseBotShot(shots: Set<number>) {
  const available = Array.from({ length: BATTLE_SIZE ** 2 }, (_, index) => index).filter((cell) => !shots.has(cell));
  return available[Math.floor(Math.random() * available.length)];
}

function neighborsWithSelf(index: number) {
  const row = Math.floor(index / BATTLE_SIZE);
  const column = index % BATTLE_SIZE;
  const cells: number[] = [];
  for (let rowStep = -1; rowStep <= 1; rowStep += 1) {
    for (let columnStep = -1; columnStep <= 1; columnStep += 1) {
      const nextRow = row + rowStep;
      const nextColumn = column + columnStep;
      if (nextRow >= 0 && nextRow < BATTLE_SIZE && nextColumn >= 0 && nextColumn < BATTLE_SIZE) {
        cells.push(nextRow * BATTLE_SIZE + nextColumn);
      }
    }
  }
  return cells;
}
