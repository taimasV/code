const pipsByFace = [
  [4], [0, 8], [0, 4, 8], [0, 2, 6, 8], [0, 2, 4, 6, 8], [0, 2, 3, 5, 6, 8],
];

type YatzyDiceProps = {
  dice: number[];
  held: boolean[];
  canHold: boolean;
  onToggle: (index: number) => void;
};

export function YatzyDice({ dice, held, canHold, onToggle }: YatzyDiceProps) {
  return (
    <div className="yatzy-dice" aria-label="Dice">
      {dice.map((die, index) => (
        <button className={held[index] ? 'yatzy-die yatzy-die--held' : 'yatzy-die'} disabled={!canHold} key={index} onClick={() => onToggle(index)} aria-label={`Die ${index + 1}: ${die}${held[index] ? ', held' : ''}`}>
          <span className="yatzy-die__face" aria-hidden="true">
            {Array.from({ length: 9 }, (_, pip) => <i className={pipsByFace[die - 1].includes(pip) ? 'yatzy-pip yatzy-pip--visible' : 'yatzy-pip'} key={pip} />)}
          </span>
        </button>
      ))}
    </div>
  );
}
