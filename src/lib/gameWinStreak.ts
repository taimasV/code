import { supabase } from './supabase';

export type StreakGame =
  | 'nuts-and-bolts' | 'connect-dots' | 'minesweeper' | 'mahjong' | 'battleship'
  | 'chess' | 'checkers' | 'reversi' | 'sudoku' | 'nonogram' | 'wordle';
export type GameResult = 'win' | 'loss' | null;
export type GameWinStreak = { current: number; best: number };

function parseRow(value: unknown): GameWinStreak {
  const row = Array.isArray(value) ? value[0] : value;
  if (!row || typeof row !== 'object') throw new Error('Invalid win streak response');
  const fields = row as Record<string, unknown>;
  if (typeof fields.current_streak !== 'number' || typeof fields.best_streak !== 'number') {
    throw new Error('Invalid win streak response');
  }
  return { current: fields.current_streak, best: fields.best_streak };
}

export async function loadGameWinStreak(game: StreakGame) {
  const { data, error } = await supabase
    .from('game_win_streaks')
    .select('current_streak, best_streak')
    .eq('game_key', game)
    .maybeSingle();
  if (error) throw error;
  return data ? parseRow(data as unknown) : { current: 0, best: 0 };
}

export async function recordGameResult(game: StreakGame, attemptId: string, won: boolean) {
  const { data, error } = await supabase.rpc('record_game_result', {
    p_game_key: game,
    p_attempt_id: attemptId,
    p_won: won,
  });
  if (error) throw error;
  return parseRow(data as unknown);
}
