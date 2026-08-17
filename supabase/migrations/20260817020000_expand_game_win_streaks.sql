alter table public.game_win_streaks
  drop constraint game_win_streaks_game_key_check;

alter table public.game_win_streaks
  add constraint game_win_streaks_game_key_check check (game_key in (
    'nuts-and-bolts', 'connect-dots', 'minesweeper', 'mahjong', 'battleship',
    'chess', 'checkers', 'reversi', 'sudoku', 'nonogram', 'wordle'
  ));

create or replace function public.record_game_result(
  p_game_key text,
  p_attempt_id uuid,
  p_won boolean
)
returns table (current_streak integer, best_streak integer)
language plpgsql
security definer
set search_path = ''
as $$
declare
  player_id uuid := auth.uid();
begin
  if player_id is null then
    raise exception 'Authentication required';
  end if;
  if p_game_key not in (
    'nuts-and-bolts', 'connect-dots', 'minesweeper', 'mahjong', 'battleship',
    'chess', 'checkers', 'reversi', 'sudoku', 'nonogram', 'wordle'
  ) then
    raise exception 'Unsupported game';
  end if;

  insert into public.game_win_streaks (user_id, game_key)
  values (player_id, p_game_key)
  on conflict (user_id, game_key) do nothing;

  return query
  update public.game_win_streaks as streak
  set
    current_streak = case when p_won then streak.current_streak + 1 else 0 end,
    best_streak = greatest(streak.best_streak, case when p_won then streak.current_streak + 1 else 0 end),
    last_attempt_id = p_attempt_id,
    updated_at = now()
  where streak.user_id = player_id
    and streak.game_key = p_game_key
    and streak.last_attempt_id is distinct from p_attempt_id
  returning streak.current_streak, streak.best_streak;

  if not found then
    return query
    select streak.current_streak, streak.best_streak
    from public.game_win_streaks as streak
    where streak.user_id = player_id and streak.game_key = p_game_key;
  end if;
end;
$$;

revoke all on function public.record_game_result(text, uuid, boolean) from public;
grant execute on function public.record_game_result(text, uuid, boolean) to authenticated;
