import { useEffect, useState, type PointerEvent } from 'react';
import { endpointColor, extendDotPath, type DotColor, type DotLevel, type DotPaths } from '../lib/connectDots';

type ConnectDotsBoardProps = {
  level: DotLevel;
  onPathsChange: (paths: DotPaths) => void;
  paths: DotPaths;
};

export function ConnectDotsBoard({ level, onPathsChange, paths }: ConnectDotsBoardProps) {
  const [drawing, setDrawing] = useState<DotColor | null>(null);
  useEffect(() => {
    const stop = () => setDrawing(null);
    window.addEventListener('pointerup', stop);
    return () => window.removeEventListener('pointerup', stop);
  }, []);

  function begin(cell: number) {
    const color = endpointColor(level, cell) ?? findPathColor(paths, cell);
    if (!color) return;
    const current = paths[color] ?? [];
    const nextPaths = endpointColor(level, cell) ? { ...paths, [color]: [cell] } : { ...paths, [color]: current.slice(0, current.indexOf(cell) + 1) };
    onPathsChange(nextPaths);
    setDrawing(color);
  }

  function enter(event: PointerEvent<HTMLButtonElement>, cell: number) {
    if (!drawing || event.buttons === 0) return;
    onPathsChange(extendDotPath(paths, level, drawing, cell));
  }

  function movePointer(event: PointerEvent<HTMLDivElement>) {
    if (!drawing) return;
    const element = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>('[data-dot-cell]');
    const cell = Number(element?.dataset.dotCell);
    if (Number.isInteger(cell)) onPathsChange(extendDotPath(paths, level, drawing, cell));
  }

  return (
    <div className="dots-board" onPointerMove={movePointer} style={{ gridTemplateColumns: `repeat(${level.size}, 1fr)` }} role="grid" aria-label="Connect dots board">
      {Array.from({ length: level.size ** 2 }, (_, cell) => {
        const color = findPathColor(paths, cell);
        const path = color ? paths[color] ?? [] : [];
        const pathIndex = path.indexOf(cell);
        const endpoint = endpointColor(level, cell);
        const directions = color ? getDirections(path[pathIndex - 1], cell, path[pathIndex + 1], level.size) : [];
        return (
          <button
            aria-label={`Cell ${cell + 1}${endpoint ? `, ${endpoint} dot` : ''}`}
            className={`dots-cell ${color ? `dots-cell--${color}` : ''}`}
            data-dot-cell={cell}
            key={cell}
            onPointerDown={(event) => { event.preventDefault(); begin(cell); }}
            onPointerEnter={(event) => enter(event, cell)}
            role="gridcell"
          >
            {directions.map((direction) => <span className={`dots-line dots-line--${direction}`} key={direction} />)}
            {color && <span className="dots-path-center" />}
            {endpoint && <span className={`dots-endpoint dots-endpoint--${endpoint}`} />}
          </button>
        );
      })}
    </div>
  );
}

function findPathColor(paths: DotPaths, cell: number) {
  return Object.entries(paths).find(([, path]) => path?.includes(cell))?.[0] as DotColor | undefined;
}

function getDirections(previous: number | undefined, cell: number, next: number | undefined, size: number) {
  return [directionName(cell, previous, size), directionName(cell, next, size)].filter((direction): direction is string => Boolean(direction));
}

function directionName(cell: number, neighbor: number | undefined, size: number) {
  if (neighbor === undefined) return undefined;
  if (neighbor === cell - size) return 'up';
  if (neighbor === cell + size) return 'down';
  if (neighbor === cell - 1) return 'left';
  if (neighbor === cell + 1) return 'right';
  return undefined;
}
