export type ChessVariant = 'standard' | 'crazyhouse' | 'threecheck';

type ChessVariantSelectProps = {
  onSelect: (variant: ChessVariant) => void;
};

const variants = [
  { id: 'standard' as const, icon: '♟️', title: 'Standard', description: 'Classic chess rules' },
  { id: 'crazyhouse' as const, icon: '🌀', title: 'Crazyhouse', description: 'Drop captured pieces back on the board' },
  { id: 'threecheck' as const, icon: '⚡', title: 'Three-check', description: 'Give three checks to win' },
];

export function ChessVariantSelect({ onSelect }: ChessVariantSelectProps) {
  return (
    <div className="chess-mode-select">
      <p>Choose chess rules</p>
      <div className="chess-variant-grid">
        {variants.map((variant) => (
          <button key={variant.id} onClick={() => onSelect(variant.id)}>
            <span aria-hidden="true">{variant.icon}</span>
            <strong>{variant.title}</strong>
            <small>{variant.description}</small>
          </button>
        ))}
      </div>
    </div>
  );
}
