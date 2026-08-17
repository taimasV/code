import { MERGE_ITEMS } from '../lib/merge';

export function MergeCollection({ highestLevel }: { highestLevel: number }) {
  return (
    <div className="merge-collection" aria-label="Discovered items">
      {MERGE_ITEMS.map((item, level) => (
        <div className={level <= highestLevel ? 'merge-discovery merge-discovery--open' : 'merge-discovery'} key={item.name} title={level <= highestLevel ? item.name : 'Not discovered'}>
          <span>{level <= highestLevel ? item.symbol : '?'}</span>
          <small>{level + 1}</small>
        </div>
      ))}
    </div>
  );
}
