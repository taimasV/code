create table public.user_streaks (
  user_id uuid primary key references auth.users (id) on delete cascade,
  current_streak integer not null default 0 check (current_streak >= 0),
  longest_streak integer not null default 0 check (longest_streak >= 0),
  last_active_date date,
  updated_at timestamptz not null default now()
);

alter table public.user_streaks enable row level security;

create policy "read own streak"
  on public.user_streaks for select
  using (auth.uid() = user_id);

grant select on table public.user_streaks to authenticated;

create or replace function public.record_daily_streak()
returns table (
  current_streak integer,
  longest_streak integer,
  last_active_date date
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  player_id uuid := auth.uid();
  activity_day date := (timezone('Asia/Qyzylorda', now()) - interval '13 hours')::date;
begin
  if player_id is null then
    raise exception 'Authentication required';
  end if;

  insert into public.user_streaks (user_id)
  values (player_id)
  on conflict (user_id) do nothing;

  return query
  update public.user_streaks as streak
  set
    current_streak = case
      when streak.last_active_date = activity_day then streak.current_streak
      when streak.last_active_date = activity_day - 1 then streak.current_streak + 1
      else 1
    end,
    longest_streak = greatest(
      streak.longest_streak,
      case
        when streak.last_active_date = activity_day then streak.current_streak
        when streak.last_active_date = activity_day - 1 then streak.current_streak + 1
        else 1
      end
    ),
    last_active_date = activity_day,
    updated_at = now()
  where streak.user_id = player_id
  returning streak.current_streak, streak.longest_streak, streak.last_active_date;
end;
$$;

revoke all on function public.record_daily_streak() from public;
grant execute on function public.record_daily_streak() to authenticated;
