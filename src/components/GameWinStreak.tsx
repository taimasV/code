import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import {
  loadGameWinStreak, recordGameResult,
  type GameResult, type GameWinStreak, type StreakGame,
} from '../lib/gameWinStreak';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import './game-win-streak.css';
import { useLanguage } from '../i18n/LanguageContext';

type GameWinStreakProps = {
  active: boolean;
  attemptId: string;
  game: StreakGame;
  result: GameResult;
};

export function GameWinStreakBadge({ active, attemptId, game, result }: GameWinStreakProps) {
  const { t } = useLanguage();
  const [streak, setStreak] = useState<GameWinStreak | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const reportedAttempt = useRef<string | null>(null);

  useEffect(() => {
    if (!active || !isSupabaseConfigured) return;
    let cancelled = false;

    async function syncStreak() {
      const { data } = await supabase.auth.getUser();
      if (cancelled) return;
      setIsGuest(!data.user);
      if (!data.user) return;

      const next = result && reportedAttempt.current !== attemptId
        ? await recordGameResult(game, attemptId, result === 'win')
        : await loadGameWinStreak(game);
      if (result) reportedAttempt.current = attemptId;
      if (!cancelled) setStreak(next);
    }

    void syncStreak().catch(() => setStreak(null));
    return () => { cancelled = true; };
  }, [active, attemptId, game, result]);

  if (!active) return null;
  if (isGuest) return <Link href="/login" className="win-streak win-streak--guest">{t('saveWins')}</Link>;
  if (!streak) return null;

  return (
    <div className={`win-streak ${streak.current >= 3 ? 'win-streak--hot' : ''}`}>
      <span aria-hidden="true">♦</span>
      <strong>{t('winStreak', { count: streak.current })}</strong>
      <small>{t('best', { count: streak.best })}</small>
    </div>
  );
}
