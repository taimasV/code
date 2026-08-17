create table public.profiles (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  nickname text not null check (char_length(trim(nickname)) between 2 and 24),
  updated_at timestamptz not null default now()
);

create unique index profiles_nickname_unique
  on public.profiles (lower(trim(nickname)));

alter table public.profiles enable row level security;

create policy "read own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "insert own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy "update own profile"
  on public.profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update on table public.profiles to authenticated;
