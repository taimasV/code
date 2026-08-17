create table public.game_win_streaks (
  user_id uuid not null references auth.users (id) on delete cascade,
  game_key text not null check (game_key in ('chess', 'checkers', 'reversi')),
  current_streak integer not null default 0 check (current_streak >= 0),
  best_streak integer not null default 0 check (best_streak >= 0),
  last_attempt_id uuid,
  updated_at timestamptz not null default now(),
  primary key (user_id, game_key)
);

alter table public.game_win_streaks enable row level security;

create policy "read own game win streaks"
  on public.game_win_streaks for select
  using (auth.uid() = user_id);

grant select on table public.game_win_streaks to authenticated;

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
  if p_game_key not in ('chess', 'checkers', 'reversi') then
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
