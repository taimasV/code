import { Link } from 'wouter';

type GamePageHeaderProps = {
  number: string;
};

export function GamePageHeader({ number }: GamePageHeaderProps) {
  return (
    <header className="game-header">
      <Link href="/" className="back-link">← All games</Link>
      <span className="game-number">{number} / 11</span>
    </header>
  );
}
