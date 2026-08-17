import { BOLT_CAPACITY, type NutsBoard } from '../lib/nutsAndBolts';

type NutsAndBoltsBoardProps = {
  board: NutsBoard;
  selected: number | null;
  onSelect: (bolt: number) => void;
};

export function NutsAndBoltsBoard({ board, selected, onSelect }: NutsAndBoltsBoardProps) {
  return (
    <div className="nuts-board" aria-label="Nuts and bolts puzzle">
      {board.map((nuts, boltIndex) => (
        <button
          aria-label={`Bolt ${boltIndex + 1}, ${nuts.length} nuts`}
          className={`nuts-bolt ${selected === boltIndex ? 'nuts-bolt--selected' : ''}`}
          key={boltIndex}
          onClick={() => onSelect(boltIndex)}
          type="button"
        >
          <span className="nuts-bolt__cap" />
          <span className="nuts-bolt__shaft" />
          <span className="nuts-stack">
            {Array.from({ length: BOLT_CAPACITY }, (_, slot) => {
              const nutIndex = BOLT_CAPACITY - slot - 1;
              const color = nuts[nutIndex];
              const isTop = nutIndex === nuts.length - 1;
              return <span className={`nuts-piece ${color ? `nuts-piece--${color}` : ''} ${isTop ? 'nuts-piece--top' : ''}`} key={slot} />;
            })}
          </span>
          <span className="nuts-bolt__base" />
        </button>
      ))}
    </div>
  );
}
