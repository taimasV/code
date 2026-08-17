import { useState } from 'react';
import type { DetectiveCase } from '../lib/detectiveTypes';

type DetectiveCaseCardProps = {
  currentCase: DetectiveCase;
  revealedClues: number;
  wrongAnswers: number[];
  interviewedPeople: number[];
  solved: boolean;
  onAnswer: (answer: number) => void;
  onReveal: () => void;
  onInterrogate: (person: number) => void;
};

export function DetectiveCaseCard(props: DetectiveCaseCardProps) {
  const { currentCase, interviewedPeople, onAnswer, onInterrogate, onReveal, revealedClues, solved, wrongAnswers } = props;
  const [showPeople, setShowPeople] = useState(false);
  const hasMoreClues = revealedClues < currentCase.clues.length;
  return (
    <div className="detective-case">
      <div className="detective-scene">
        <span>Case file</span><h2>{currentCase.title}</h2>
        <div className="detective-meta"><span>📍 {currentCase.location}</span><span>🕒 {currentCase.time}</span></div>
        <p>{currentCase.scene}</p>
      </div>
      <figure className="detective-photo">
        <img src={currentCase.image} alt={currentCase.imageAlt} />
        <figcaption>Scene photograph — inspect it for visual clues</figcaption>
      </figure>
      <div className="detective-interrogation">
        <button className="restart-button" onClick={() => setShowPeople((visible) => !visible)}>{showPeople ? 'Close interviews' : 'Interrogate person'}</button>
        {showPeople && <div className="detective-people">
          {currentCase.people.map((person, index) => {
            const interviewed = interviewedPeople.includes(index);
            return <div className="detective-person" key={person.name}><div><strong>{person.name}</strong><span>{person.role}</span></div>{interviewed ? <p>“{person.statement}”</p> : <button className="mine-tool" disabled={solved} onClick={() => onInterrogate(index)}>Ask questions</button>}</div>;
          })}
        </div>}
      </div>
      <div className="detective-clues">
        <h3>Clues</h3>
        <ol>{currentCase.clues.slice(0, revealedClues).map((clue) => <li key={clue}>{clue}</li>)}</ol>
        {hasMoreClues && !solved && <button className="mine-tool" onClick={onReveal}>Reveal another clue</button>}
      </div>
      <div className="detective-question">
        <h3>{currentCase.question}</h3>
        <div className="detective-answers">
          {currentCase.answers.map((answer, index) => {
            const wrong = wrongAnswers.includes(index);
            const correct = solved && index === currentCase.correctAnswer;
            return <button className={correct ? 'detective-answer detective-answer--correct' : wrong ? 'detective-answer detective-answer--wrong' : 'detective-answer'} disabled={solved || wrong} key={answer} onClick={() => onAnswer(index)}>{answer}</button>;
          })}
        </div>
      </div>
      {solved && <p className="detective-explanation"><strong>Solved!</strong> {currentCase.explanation}</p>}
    </div>
  );
}
