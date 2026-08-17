import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { recordDailyStreak, type Streak } from '../lib/streak';
import './daily-streak.css';
import { useLanguage } from '../i18n/LanguageContext';

const milestones = [3, 10, 30, 50, 100, 150, 200] as const;
const levelIcons = ['◇', '◆', '◈', '✹', '★', '✦', '♛', '★'] as const;

function getLevel(days: number) {
  return milestones.reduce((level, milestone, index) => days >= milestone ? index + 1 : level, 0);
}

function getNextMilestone(days: number) {
  return milestones.find((milestone) => milestone > days);
}

export function DailyStreak() {
  const { t } = useLanguage();
  const [streak, setStreak] = useState<Streak | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const recordedUser = useRef<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const userId = session?.user.id ?? null;
      setIsGuest(!userId);
      if (!userId) {
        recordedUser.current = null;
        setStreak(null);
        return;
      }
      if (recordedUser.current === userId) return;

      recordedUser.current = userId;
      window.setTimeout(() => {
        void recordDailyStreak().then(setStreak).catch(() => setStreak(null));
      }, 0);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  if (isGuest) {
    return <Link href="/login" className="streak streak--guest">{t('startStreak')}</Link>;
  }

  if (!streak) return null;

  const level = getLevel(streak.currentStreak);
  const nextMilestone = getNextMilestone(streak.currentStreak);

  return (
    <div className={`streak streak--level-${level}`} title={t('bestStreak', { count: streak.longestStreak })}>
      <span className="streak__icon" aria-hidden="true">{levelIcons[level]}</span>
      <strong>{streak.currentStreak}</strong>
      <span>{streak.currentStreak === 1 ? t('day') : t('days')}</span>
      {nextMilestone && <small>{t('nextMilestone', { count: nextMilestone })}</small>}
    </div>
  );
}
