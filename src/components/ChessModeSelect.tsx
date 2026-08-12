export type ChessOpponent = 'local' | 'bot';

type ChessModeSelectProps = {
  onBack: () => void;
  onSelect: (opponent: ChessOpponent) => void;
};

const opponents = [
  { id: 'local' as const, icon: '👥', title: 'Two players', description: 'Play together on one device' },
  { id: 'bot' as const, icon: '🤖', title: 'Play vs bot', description: 'You play White against the computer' },
];

export function ChessModeSelect({ onBack, onSelect }: ChessModeSelectProps) {
  return (
    <div className="chess-mode-select">
      <p>Choose an opponent</p>
      <div className="chess-mode-grid">
        {opponents.map((opponent) => (
          <button key={opponent.id} onClick={() => onSelect(opponent.id)}>
            <span aria-hidden="true">{opponent.icon}</span>
            <strong>{opponent.title}</strong>
            <small>{opponent.description}</small>
          </button>
        ))}
      </div>
      <button className="mine-tool chess-setup-back" onClick={onBack}>← Back to variants</button>
    </div>
  );
}
