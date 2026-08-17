import type { NutsDifficulty } from '../lib/nutsAndBolts';

type NutsDifficultySelectProps = {
  value: NutsDifficulty;
  onChange: (difficulty: NutsDifficulty) => void;
};

const difficulties: { value: NutsDifficulty; label: string; detail: string }[] = [
  { value: 'easy', label: 'Easy', detail: '3 colors' },
  { value: 'medium', label: 'Medium', detail: '4 colors' },
  { value: 'hard', label: 'Hard', detail: '5 colors' },
];

export function NutsDifficultySelect({ value, onChange }: NutsDifficultySelectProps) {
  return (
    <div className="nuts-difficulty" aria-label="Difficulty">
      {difficulties.map((difficulty) => (
        <button
          className={value === difficulty.value ? 'nuts-difficulty--active' : ''}
          key={difficulty.value}
          onClick={() => onChange(difficulty.value)}
          type="button"
        >
          <strong>{difficulty.label}</strong>
          <small>{difficulty.detail}</small>
        </button>
      ))}
    </div>
  );
}
