import { supabase } from './supabase';

export type Streak = {
  currentStreak: number;
  longestStreak: number;
};

type StreakRow = {
  current_streak: number;
  longest_streak: number;
};

function isStreakRow(value: unknown): value is StreakRow {
  if (!value || typeof value !== 'object') return false;
  const row = value as Record<string, unknown>;
  return typeof row.current_streak === 'number' && typeof row.longest_streak === 'number';
}

export async function recordDailyStreak(): Promise<Streak> {
  const { data, error } = await supabase.rpc('record_daily_streak');
  if (error) throw error;

  const value: unknown = data;
  const row = Array.isArray(value) ? value[0] : value;
  if (!isStreakRow(row)) throw new Error('Invalid streak response');

  return { currentStreak: row.current_streak, longestStreak: row.longest_streak };
}
