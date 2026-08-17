import { Link } from 'wouter';

export function GamePageHeader({ number }: { number: string }) {
  return (
    <header className="game-header">
      <Link href="/games" className="back-link">← All games</Link>
      <span className="game-number">{number} / 19</span>
    </header>
  );
}
