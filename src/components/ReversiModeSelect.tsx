export type ReversiOpponent = 'local' | 'bot';

export function ReversiModeSelect({ onSelect }: { onSelect: (opponent: ReversiOpponent) => void }) {
  return (
    <div className="chess-mode-select">
      <p>Choose an opponent</p>
      <div className="chess-mode-grid">
        <button onClick={() => onSelect('local')}><span>👥</span><strong>Two players</strong><small>Play together on one device</small></button>
        <button onClick={() => onSelect('bot')}><span>🤖</span><strong>Play vs bot</strong><small>You play Black against the computer</small></button>
      </div>
    </div>
  );
}
