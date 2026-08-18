import { useState } from 'react';
import { FlagQuestionCard } from '../components/FlagQuestionCard';
import { GamePageHeader } from '../components/GamePageHeader';
import { useLanguage } from '../i18n/LanguageContext';
import { createFlagQuestions, FLAG_LEVELS } from '../lib/flags';

export function FlagsPage() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [questions, setQuestions] = useState(() => createFlagQuestions(FLAG_LEVELS[0]));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const { language } = useLanguage();
  const finished = questionIndex >= questions.length;
  const question = questions[questionIndex];

  function start(nextLevelIndex = levelIndex) {
    setLevelIndex(nextLevelIndex);
    setQuestions(createFlagQuestions(FLAG_LEVELS[nextLevelIndex]));
    setQuestionIndex(0);
    setSelected(null);
    setScore(0);
  }

  function answer(code: string) {
    if (selected || !question) return;
    setSelected(code);
    if (code === question.answer) setScore((current) => current + 100);
  }

  function nextQuestion() {
    setSelected(null);
    setQuestionIndex((current) => current + 1);
  }

  return (
    <main className="container game-page">
      <GamePageHeader number="20" />
      <section className="game-panel game-panel--flags">
        <span className="game-icon" aria-hidden="true">🌍</span>
        <h1>Country Flags</h1>
        <div className="difficulty-tabs" aria-label="Difficulty">
          {FLAG_LEVELS.map((level, index) => (
            <button className={levelIndex === index ? 'difficulty-tab difficulty-tab--active' : 'difficulty-tab'} key={level.key} onClick={() => start(index)}>
              {level.label} <span>{level.rounds} rounds</span>
            </button>
          ))}
        </div>
        <p className="game-status">Score: {score} · {Math.min(questionIndex + 1, questions.length)} / {questions.length}</p>
        {finished ? (
          <div className="flags-result"><span>🏆</span><h2>Quiz complete!</h2><p>You scored <strong>{score} / {questions.length * 100}</strong></p><button className="restart-button" onClick={() => start()}>Play again</button></div>
        ) : question && <>
          <FlagQuestionCard language={language} onAnswer={answer} question={question} selected={selected} />
          {selected && <button className="restart-button" onClick={nextQuestion}>{questionIndex === questions.length - 1 ? 'See result' : 'Next flag'}</button>}
        </>}
      </section>
    </main>
  );
}
