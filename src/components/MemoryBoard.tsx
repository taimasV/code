import type { MemoryCard } from '../lib/memory';

type MemoryBoardProps = {
  cards: MemoryCard[];
  columns: number;
  flipped: number[];
  matched: number[];
  onCardClick: (index: number) => void;
};

export function MemoryBoard({ cards, columns, flipped, matched, onCardClick }: MemoryBoardProps) {
  return (
    <div className="memory-board" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }} role="grid" aria-label="Memory card board">
      {cards.map((card, index) => {
        const isVisible = flipped.includes(index) || matched.includes(index);
        return (
          <button
            aria-label={isVisible ? card.symbol : `Hidden card ${index + 1}`}
            className={`memory-card ${isVisible ? 'memory-card--visible' : ''} ${matched.includes(index) ? 'memory-card--matched' : ''}`}
            disabled={matched.includes(index)}
            key={card.id}
            onClick={() => onCardClick(index)}
            role="gridcell"
          >
            <span>{isVisible ? card.symbol : '?'}</span>
          </button>
        );
      })}
    </div>
  );
}
