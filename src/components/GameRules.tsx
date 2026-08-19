import { useEffect, useState } from 'react';
import { useLanguage, type Language } from '../i18n/LanguageContext';
import { getGameRules } from '../i18n/gameRules';

const labels: Record<Language, { close: string; open: string; title: string }> = {
  en: { close: 'Close', open: 'Open game rules', title: 'How to play' },
  ru: { close: 'Закрыть', open: 'Открыть правила игры', title: 'Как играть' },
  kk: { close: 'Жабу', open: 'Ойын ережелерін ашу', title: 'Қалай ойнау керек' },
  fr: { close: 'Fermer', open: 'Ouvrir les règles du jeu', title: 'Comment jouer' },
};

export function GameRules({ gameNumber }: { gameNumber: string }) {
  const [open, setOpen] = useState(false);
  const { language } = useLanguage();
  const rules = getGameRules(gameNumber, language);
  const text = labels[language];

  useEffect(() => {
    if (!open) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  return (
    <>
      <button className="game-rules-button" type="button" aria-label={text.open} onClick={() => setOpen(true)}>?</button>
      {open && (
        <div className="game-rules-backdrop" role="presentation" onMouseDown={() => setOpen(false)}>
          <section className="game-rules-dialog" role="dialog" aria-modal="true" aria-labelledby="game-rules-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="game-rules-close" type="button" aria-label={text.close} onClick={() => setOpen(false)}>×</button>
            <span className="game-rules-symbol" aria-hidden="true">?</span>
            <h2 id="game-rules-title">{text.title}</h2>
            <ol>{rules.map((rule) => <li key={rule}>{rule}</li>)}</ol>
          </section>
        </div>
      )}
    </>
  );
}
