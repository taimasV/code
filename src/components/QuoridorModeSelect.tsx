export type QuoridorMode = 'local' | 'bot';

export function QuoridorModeSelect({ onSelect }: { onSelect: (mode: QuoridorMode) => void }) {
  return (
    <div className="chess-mode-select">
      <p>Choose an opponent</p>
      <div className="chess-mode-grid">
        <button onClick={() => onSelect('local')}><span>👥</span><strong>Two players</strong><small>Play together on one device</small></button>
        <button onClick={() => onSelect('bot')}><span>🤖</span><strong>Play vs bot</strong><small>You are Blue and move first</small></button>
      </div>
    </div>
  );
}
