import { Link } from 'wouter';

type GameCardProps = {
  title: string;
  icon: string;
  description: string;
  href?: string;
};

export function GameCard({ title, icon, description, href }: GameCardProps) {
  const content = (
    <>
      <span className="game-card__icon" aria-hidden="true">{icon}</span>
      <div className="game-card__content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {href ? <span className="game-card__arrow">→</span> : <span className="game-card__soon">Soon</span>}
    </>
  );

  return href ? (
    <Link className="game-card game-card--active" href={href}>{content}</Link>
  ) : (
    <article className="game-card game-card--disabled">{content}</article>
  );
}
