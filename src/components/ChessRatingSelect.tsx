import { CHESS_RATINGS, type ChessRating } from '../lib/chessBot';

type ChessRatingSelectProps = {
  onBack: () => void;
  onSelect: (rating: ChessRating) => void;
};

const levels: Record<ChessRating, { label: string; description: string }> = {
  400: { label: 'Beginner', description: 'Misses tactics often' },
  800: { label: 'Casual', description: 'Knows basic captures' },
  1200: { label: 'Club', description: 'Sees simple threats' },
  1600: { label: 'Advanced', description: 'Plans several moves' },
  2000: { label: 'Expert', description: 'Strong tactics and position' },
  2200: { label: 'Master', description: 'Deepest calculation' },
};

export function ChessRatingSelect({ onBack, onSelect }: ChessRatingSelectProps) {
  return (
    <div className="chess-rating-select">
      <p>Choose bot strength</p>
      <div className="chess-rating-grid">
        {CHESS_RATINGS.map((rating, index) => (
          <button key={rating} onClick={() => onSelect(rating)}>
            <div className="rating-title"><strong>{levels[rating].label}</strong><small>~{rating}</small></div>
            <div className="rating-meter" aria-label={`Strength ${index + 1} of 6`}>
              {CHESS_RATINGS.map((value, bar) => <span className={bar <= index ? 'rating-bar--filled' : ''} key={value} />)}
            </div>
            <p>{levels[rating].description}</p>
          </button>
        ))}
      </div>
      <p className="rating-note">Ratings are approximate difficulty levels, not official ratings.</p>
      <button className="mine-tool" onClick={onBack}>← Back to modes</button>
    </div>
  );
}
