create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  language_pref text not null default 'en' check (language_pref in ('en','es')),
  reputation int not null default 60,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists leagues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text not null,
  tier int not null,
  max_teams int not null,
  reputation int not null
);

create table if not exists clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  short_name text not null,
  league_id uuid references leagues(id) on delete cascade,
  stadium text not null,
  budget bigint not null default 20000000,
  reputation int not null default 65,
  founded int not null,
  colors text not null,
  is_ai boolean not null default true,
  manager_id uuid
);

create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text not null,
  fifa_rank int not null,
  reputation int not null,
  manager_id uuid
);

create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  nationality text not null,
  age int not null,
  position text not null,
  club_id uuid references clubs(id) on delete set null,
  pace int not null,
  shooting int not null,
  passing int not null,
  dribbling int not null,
  defending int not null,
  physical int not null,
  potential int not null,
  morale int not null default 70,
  fitness int not null default 90,
  form int not null default 70,
  value bigint not null,
  wage bigint not null,
  contract_until int,
  is_injured boolean not null default false,
  injury_weeks int not null default 0,
  is_suspended boolean not null default false,
  goals int not null default 0,
  assists int not null default 0,
  appearances int not null default 0
);

create table if not exists tactics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  club_id uuid references clubs(id) on delete cascade,
  formation text not null,
  playing_style text not null,
  mentality text not null,
  tempo int not null default 50,
  pressing int not null default 50,
  defensive_line int not null default 50,
  unique(user_id, club_id)
);

create table if not exists seasons (
  id uuid primary key default gen_random_uuid(),
  league_id uuid references leagues(id) on delete cascade,
  season_number int not null,
  year int not null,
  is_active boolean not null default true,
  matchday int not null default 1,
  total_matchdays int not null default 38
);

create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  season_id text not null,
  matchday int not null,
  home_club_id uuid references clubs(id),
  away_club_id uuid references clubs(id),
  home_score int,
  away_score int,
  home_xg numeric(5,2) not null default 0,
  away_xg numeric(5,2) not null default 0,
  home_possession int not null default 50,
  away_possession int not null default 50,
  status text not null default 'scheduled'
);

create table if not exists standings (
  id uuid primary key default gen_random_uuid(),
  season_id text not null,
  club_id uuid references clubs(id) on delete cascade,
  played int not null default 0,
  wins int not null default 0,
  draws int not null default 0,
  losses int not null default 0,
  goals_for int not null default 0,
  goals_against int not null default 0,
  goals_diff int not null default 0,
  points int not null default 0
);

create table if not exists transfers (
  id uuid primary key default gen_random_uuid(),
  player_id uuid,
  from_club_id uuid references clubs(id),
  to_club_id uuid references clubs(id),
  fee bigint not null,
  is_loan boolean not null default false,
  status text not null,
  season_id text not null,
  created_at timestamptz not null default now()
);

create table if not exists managers (
  id uuid primary key,
  name text not null,
  nationality text not null,
  reputation int not null,
  experience int not null,
  salary bigint not null,
  contract_length int not null,
  team_type text not null,
  team_id uuid,
  is_ai boolean not null default true
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  lobby_id uuid,
  sender_username text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists youth_players (
  id uuid primary key default gen_random_uuid(),
  club_id uuid references clubs(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  age int not null,
  position text not null,
  potential int not null,
  created_at timestamptz not null default now()
);

create table if not exists saves (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  name text not null,
  mode text not null check (mode in ('solo','multiplayer')),
  club_id uuid references clubs(id),
  season_id text,
  cheats_enabled jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists multiplayer_lobbies (
  id uuid primary key,
  invite_code text unique not null,
  host_user_id uuid references users(id) on delete cascade,
  league_name text not null,
  difficulty text not null,
  max_players int not null default 20,
  status text not null default 'waiting',
  available_team_ids uuid[] not null,
  rules text not null,
  season_id text,
  created_at timestamptz not null default now()
);

create table if not exists multiplayer_players (
  id uuid primary key default gen_random_uuid(),
  lobby_id uuid references multiplayer_lobbies(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  club_id uuid references clubs(id),
  is_ready boolean not null default false,
  created_at timestamptz not null default now(),
  unique(lobby_id, user_id)
);

create table if not exists league_settings (
  id uuid primary key default gen_random_uuid(),
  lobby_id uuid references multiplayer_lobbies(id) on delete cascade,
  host_user_id uuid references users(id) on delete cascade,
  difficulty text not null,
  allowed_team_ids uuid[] not null,
  rules text not null,
  cheats_enabled jsonb not null default '{}'::jsonb
);

create table if not exists international_offers (
  id uuid primary key,
  user_id uuid references users(id) on delete cascade,
  national_team_id uuid references teams(id) on delete cascade,
  offer_status text not null,
  salary bigint not null,
  created_at timestamptz not null default now()
);

create table if not exists national_team_jobs (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade,
  manager_user_id uuid references users(id) on delete set null,
  contract_salary bigint not null,
  contract_until int not null,
  active boolean not null default true
);

create or replace function has_enabled_cheats(payload jsonb)
returns boolean
language sql
immutable
as $$
  select coalesce(bool_or((value)::text in ('true','"true"')), false)
  from jsonb_each(coalesce(payload, '{}'::jsonb));
$$;

create or replace function is_connorb()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from users u
    where u.id = auth.uid() and u.username = 'ConnorB'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users(id, username, language_pref, reputation, is_admin)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    'en',
    60,
    coalesce(new.raw_user_meta_data->>'username', '') = 'ConnorB'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table users enable row level security;
alter table saves enable row level security;
alter table multiplayer_lobbies enable row level security;
alter table multiplayer_players enable row level security;
alter table league_settings enable row level security;
alter table messages enable row level security;
alter table international_offers enable row level security;
alter table national_team_jobs enable row level security;

create policy users_select_own on users for select using (auth.uid() = id);
create policy users_update_own on users for update using (auth.uid() = id);

create policy saves_select_own on saves for select using (auth.uid() = user_id);
create policy saves_insert_guard on saves for insert with check (
  auth.uid() = user_id and (mode = 'solo' or is_connorb() or not has_enabled_cheats(cheats_enabled))
);
create policy saves_update_guard on saves for update using (auth.uid() = user_id) with check (
  mode = 'solo' or is_connorb() or not has_enabled_cheats(cheats_enabled)
);

create policy lobbies_read on multiplayer_lobbies for select using (true);
create policy lobbies_create on multiplayer_lobbies for insert with check (auth.uid() = host_user_id);
create policy lobbies_update_host on multiplayer_lobbies for update using (auth.uid() = host_user_id or is_connorb());

create policy players_read on multiplayer_players for select using (true);
create policy players_join on multiplayer_players for insert with check (auth.uid() = user_id);
create policy players_update_self on multiplayer_players for update using (auth.uid() = user_id or is_connorb());

create policy settings_read on league_settings for select using (true);
create policy settings_write on league_settings for insert with check (
  auth.uid() = host_user_id and (is_connorb() or not has_enabled_cheats(cheats_enabled))
);
create policy settings_update on league_settings for update using (auth.uid() = host_user_id or is_connorb()) with check (
  is_connorb() or not has_enabled_cheats(cheats_enabled)
);

create policy messages_read on messages for select using (true);
create policy messages_write on messages for insert with check (
  exists (
    select 1 from multiplayer_players mp
    where mp.lobby_id = messages.lobby_id and mp.user_id = auth.uid()
  )
);

create policy offers_read_own on international_offers for select using (auth.uid() = user_id);
create policy offers_write_own on international_offers for insert with check (auth.uid() = user_id);

create policy jobs_read on national_team_jobs for select using (true);
create policy jobs_update_admin on national_team_jobs for update using (is_connorb());
