import { useState } from 'react';
import { DetectiveCaseCard } from '../components/DetectiveCaseCard';
import { GamePageHeader } from '../components/GamePageHeader';
import { detectiveCases } from '../lib/detective';

export function DetectivePage() {
  const [caseIndex, setCaseIndex] = useState(0);
  const [revealedClues, setRevealedClues] = useState(1);
  const [wrongAnswers, setWrongAnswers] = useState<number[]>([]);
  const [interviewedPeople, setInterviewedPeople] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const currentCase = detectiveCases[caseIndex];

  function answer(index: number) {
    if (index !== currentCase.correctAnswer) {
      setWrongAnswers((current) => [...current, index]);
      return;
    }
    setScore((current) => current + Math.max(1, 5 - revealedClues - wrongAnswers.length - interviewedPeople.length));
    setSolved(true);
  }

  function nextCase() {
    if (caseIndex === detectiveCases.length - 1) {
      setFinished(true);
      return;
    }
    setCaseIndex((current) => current + 1);
    setRevealedClues(1);
    setWrongAnswers([]);
    setInterviewedPeople([]);
    setSolved(false);
  }

  function restart() {
    setCaseIndex(0);
    setRevealedClues(1);
    setWrongAnswers([]);
    setInterviewedPeople([]);
    setSolved(false);
    setScore(0);
    setFinished(false);
  }

  return (
    <main className="container game-page">
      <GamePageHeader number="17" />
      <section className="game-panel game-panel--detective">
        <span className="game-icon" aria-hidden="true">🔎</span>
        <h1>Detective</h1>
        <p className="game-status">Cases: {Math.min(caseIndex + 1, detectiveCases.length)} / {detectiveCases.length} · Score: {score}</p>
        {finished ? <div className="detective-result"><span>🏅</span><h2>All cases solved!</h2><p>Your final score is <strong>{score} / {detectiveCases.length * 4}</strong>.</p><button className="restart-button" onClick={restart}>Play again</button></div> : <>
          <DetectiveCaseCard key={caseIndex} currentCase={currentCase} revealedClues={revealedClues} wrongAnswers={wrongAnswers} interviewedPeople={interviewedPeople} solved={solved} onAnswer={answer} onInterrogate={(person) => setInterviewedPeople((current) => [...current, person])} onReveal={() => setRevealedClues((count) => count + 1)} />
          {solved && <button className="restart-button" onClick={nextCase}>{caseIndex === detectiveCases.length - 1 ? 'See results' : 'Next case'}</button>}
        </>}
      </section>
    </main>
  );
}
