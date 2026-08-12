import type { PieceSymbol } from 'chess.js';

type PromotionPickerProps = {
  color: 'w' | 'b';
  onChoose: (piece: Exclude<PieceSymbol, 'p' | 'k'>) => void;
};

const options = [
  { piece: 'q' as const, white: '♕', black: '♛', label: 'Queen' },
  { piece: 'r' as const, white: '♖', black: '♜', label: 'Rook' },
  { piece: 'b' as const, white: '♗', black: '♝', label: 'Bishop' },
  { piece: 'n' as const, white: '♘', black: '♞', label: 'Knight' },
];

export function PromotionPicker({ color, onChoose }: PromotionPickerProps) {
  return (
    <div className="promotion-picker">
      <p>Promote pawn to:</p>
      <div>{options.map((option) => (
        <button aria-label={option.label} key={option.piece} onClick={() => onChoose(option.piece)}>
          {color === 'w' ? option.white : option.black}
        </button>
      ))}</div>
    </div>
  );
}
