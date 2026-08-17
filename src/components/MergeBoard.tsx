import { MERGE_ITEMS, type MergeBoard as MergeBoardState } from '../lib/merge';

type MergeBoardProps = {
  board: MergeBoardState;
  selected: number | null;
  onSelect: (cell: number) => void;
};

export function MergeBoard({ board, onSelect, selected }: MergeBoardProps) {
  return (
    <div className="merge-board" role="grid" aria-label="Merge item board">
      {board.map((level, index) => {
        const item = level === null ? null : MERGE_ITEMS[level];
        return (
          <button
            className={`merge-cell ${selected === index ? 'merge-cell--selected' : ''} ${item ? 'merge-cell--filled' : ''}`}
            key={index}
            onClick={() => onSelect(index)}
            aria-label={item && level !== null ? `${item.name}, level ${level + 1}` : 'Empty cell'}
          >
            {item && level !== null && <span className="merge-item" key={level}><span>{item.symbol}</span><small>{level + 1}</small></span>}
          </button>
        );
      })}
    </div>
  );
}
