type GameRulesProps = {
  rules: string[];
  tip?: string;
};

export function GameRules({ rules, tip }: GameRulesProps) {
  return (
    <section className="game-rules" aria-labelledby="game-rules-title">
      <h2 id="game-rules-title">How to play</h2>
      <ol>
        {rules.map((rule) => <li key={rule}>{rule}</li>)}
      </ol>
      {tip && <p><strong>Tip:</strong> {tip}</p>}
    </section>
  );
}
