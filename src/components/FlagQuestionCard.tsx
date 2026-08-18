import type { Language } from '../i18n/LanguageContext';
import { flagImageUrl, type FlagQuestion } from '../lib/flags';

type FlagQuestionCardProps = {
  language: Language;
  onAnswer: (code: string) => void;
  question: FlagQuestion;
  selected: string | null;
};

export function FlagQuestionCard({ language, onAnswer, question, selected }: FlagQuestionCardProps) {
  const names = new Intl.DisplayNames([language], { type: 'region' });
  const countryName = names.of(question.answer) ?? question.answer;

  function answerClass(code: string) {
    if (!selected) return 'flag-answer';
    if (code === question.answer) return 'flag-answer flag-answer--correct';
    return 'flag-answer flag-answer--wrong';
  }

  return (
    <div className="flag-question-card">
      <div className="flag-display"><img alt={`Flag of ${countryName}`} src={flagImageUrl(question.answer)} /></div>
      <h2>Which country has this flag?</h2>
      <div className="flag-answers">
        {question.options.map((code) => (
          <button className={answerClass(code)} disabled={selected !== null} key={code} onClick={() => onAnswer(code)}>
            {names.of(code) ?? code}
          </button>
        ))}
      </div>
    </div>
  );
}
