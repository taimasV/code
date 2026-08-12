import type { Color, Role } from 'chessops/types';
import type { MaterialSide } from 'chessops/setup';

const roles: Role[] = ['queen', 'rook', 'bishop', 'knight', 'pawn'];
const symbols: Record<Color, Record<Role, string>> = {
  white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
  black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' },
};

type CrazyhousePocketProps = {
  color: Color;
  material: MaterialSide;
  onSelect: (role: Role) => void;
  selected: Role | null;
};

export function CrazyhousePocket({ color, material, onSelect, selected }: CrazyhousePocketProps) {
  return (
    <div className="crazyhouse-pocket">
      <span>{color === 'white' ? 'White' : 'Black'} pocket</span>
      {roles.map((role) => material[role] > 0 && (
        <button className={selected === role ? 'pocket-piece pocket-piece--selected' : 'pocket-piece'} key={role} onClick={() => onSelect(role)}>
          {symbols[color][role]} <small>×{material[role]}</small>
        </button>
      ))}
      {!material.nonEmpty() && <small>Empty</small>}
    </div>
  );
}
