import {
  BOARD_SIZE, canPlaceWall, getLegalMoves, getPathLength,
  type Pawns, type Position, type Wall,
} from './quoridor';

export type QuoridorBotAction =
  | { type: 'move'; position: Position }
  | { type: 'wall'; wall: Wall };

export function chooseQuoridorBotAction(pawns: Pawns, walls: Wall[], wallsLeft: number): QuoridorBotAction {
  const moves = getLegalMoves('red', pawns, walls);
  const winningMove = moves.find((move) => move.row === BOARD_SIZE - 1);
  if (winningMove) return { type: 'move', position: winningMove };

  const blueDistance = getPathLength('blue', pawns, walls);
  const redDistance = getPathLength('red', pawns, walls);
  const wall = wallsLeft ? chooseWall(pawns, walls, blueDistance, redDistance) : null;
  if (wall && blueDistance <= redDistance + 1) return { type: 'wall', wall };

  const position = [...moves].sort((first, second) => {
    const firstPawns = { ...pawns, red: first };
    const secondPawns = { ...pawns, red: second };
    return getPathLength('red', firstPawns, walls) - getPathLength('red', secondPawns, walls);
  })[0] ?? pawns.red;
  return { type: 'move', position };
}

function chooseWall(pawns: Pawns, walls: Wall[], blueDistance: number, redDistance: number) {
  const candidates: Array<{ wall: Wall; score: number }> = [];
  for (let row = 0; row < BOARD_SIZE - 1; row += 1) {
    for (let column = 0; column < BOARD_SIZE - 1; column += 1) {
      (['horizontal', 'vertical'] as const).forEach((orientation) => {
        const wall = { row, column, orientation };
        if (!canPlaceWall(wall, walls, pawns)) return;
        const nextWalls = [...walls, wall];
        const blueDelay = getPathLength('blue', pawns, nextWalls) - blueDistance;
        const redDelay = getPathLength('red', pawns, nextWalls) - redDistance;
        candidates.push({ wall, score: blueDelay * 2 - redDelay });
      });
    }
  }
  candidates.sort((first, second) => second.score - first.score);
  return candidates[0]?.score > 0 ? candidates[0].wall : null;
}
