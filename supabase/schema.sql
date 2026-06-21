-- Up Mission — full database schema (reproduces the live `up-mission` project).
-- Apply with: supabase db reset  (or paste into the SQL editor).

-- ───────────────── Enums ─────────────────
create type difficulty as enum ('easy', 'medium', 'hard');
create type verify_kind as enum ('ai', 'friend');
create type quest_status as enum ('pending', 'completed');
create type rarity as enum ('rare', 'mega', 'ultra');
create type friendship_status as enum ('pending', 'accepted');
create type activity_kind as enum ('finished', 'passed_you', 'milestone', 'added_you');

-- ───────────────── Tables ─────────────────
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text not null default 'New Player',
  equipped_mob_id text not null default 'cat',
  equipped_accessory_id text,
  coins int not null default 100,
  xp int not null default 0,
  streak int not null default 0,
  freezes_left int not null default 3,
  last_completed_date date,
  created_at timestamptz not null default now()
);

create table inventory_mobs (
  user_id uuid not null references profiles(id) on delete cascade,
  mob_id text not null,
  primary key (user_id, mob_id)
);

create table inventory_accessories (
  user_id uuid not null references profiles(id) on delete cascade,
  accessory_id text not null,
  primary key (user_id, accessory_id)
);

create table quest_templates (
  id serial primary key,
  title text not null,
  emoji text not null,
  difficulty difficulty not null,
  verify verify_kind not null
);

create table user_quests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  quest_date date not null,
  title text not null,
  emoji text not null,
  difficulty difficulty not null,
  verify verify_kind not null,
  status quest_status not null default 'pending',
  rarity rarity,
  coins_awarded int,
  xp_awarded int,
  video_path text,
  verified boolean not null default false,
  verify_reason text,
  created_at timestamptz not null default now(),
  unique (user_id, quest_date)
);

create table friendships (
  id uuid primary key default gen_random_uuid(),
  requester uuid not null references profiles(id) on delete cascade,
  addressee uuid not null references profiles(id) on delete cascade,
  status friendship_status not null default 'pending',
  created_at timestamptz not null default now(),
  unique (requester, addressee)
);

create table activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  actor_name text not null,
  actor_emoji text not null,
  kind activity_kind not null,
  detail text not null,
  created_at timestamptz not null default now()
);

create index activity_user_idx on activity(user_id, created_at desc);
create index user_quests_user_idx on user_quests(user_id, quest_date desc);

-- ───────────────── Auto-create profile on signup ─────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username, display_name)
  values (new.id, 'player_' || substr(new.id::text, 1, 8), 'New Player');
  insert into public.inventory_mobs (user_id, mob_id) values (new.id, 'cat');
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ───────────────── Row Level Security ─────────────────
alter table profiles enable row level security;
alter table inventory_mobs enable row level security;
alter table inventory_accessories enable row level security;
alter table quest_templates enable row level security;
alter table user_quests enable row level security;
alter table friendships enable row level security;
alter table activity enable row level security;

create policy "profiles read" on profiles for select to authenticated using (true);
create policy "profiles insert own" on profiles for insert to authenticated with check (id = auth.uid());
create policy "profiles update own" on profiles for update to authenticated using (id = auth.uid());

create policy "inv mobs all own" on inventory_mobs for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "inv acc all own" on inventory_accessories for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "templates read" on quest_templates for select to authenticated using (true);

create policy "quests all own" on user_quests for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "friendships read" on friendships for select to authenticated
  using (requester = auth.uid() or addressee = auth.uid());
create policy "friendships insert" on friendships for insert to authenticated
  with check (requester = auth.uid());
create policy "friendships update" on friendships for update to authenticated
  using (requester = auth.uid() or addressee = auth.uid());
create policy "friendships delete" on friendships for delete to authenticated
  using (requester = auth.uid() or addressee = auth.uid());

create policy "activity read own" on activity for select to authenticated
  using (user_id = auth.uid());

-- ───────────────── Game functions ─────────────────
create or replace function public.ensure_today_quest()
returns user_quests language plpgsql security invoker set search_path = public as $$
declare
  uid uuid := auth.uid();
  d date := current_date;
  diff difficulty;
  tmpl quest_templates;
  q user_quests;
begin
  if uid is null then raise exception 'not authenticated'; end if;
  select * into q from user_quests where user_id = uid and quest_date = d;
  if found then return q; end if;
  diff := case extract(dow from d)::int
            when 0 then 'easy'::difficulty when 1 then 'easy'::difficulty when 2 then 'easy'::difficulty
            when 3 then 'medium'::difficulty when 4 then 'medium'::difficulty
            else 'hard'::difficulty end;
  select * into tmpl from quest_templates where difficulty = diff order by random() limit 1;
  insert into user_quests (user_id, quest_date, title, emoji, difficulty, verify)
  values (uid, d, tmpl.title, tmpl.emoji, tmpl.difficulty, tmpl.verify)
  returning * into q;
  return q;
end; $$;

-- AI-aware variant: stores a mission title generated by the `generate-quest`
-- Edge Function. Returns the existing mission if today's already exists, or
-- NULL when p_title is NULL and none exists yet (so the client can ask first).
create or replace function public.ensure_today_quest_ai(p_title text default null)
returns user_quests language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
  d date := current_date;
  diff difficulty;
  q user_quests;
begin
  if uid is null then raise exception 'not authenticated'; end if;
  select * into q from user_quests where user_id = uid and quest_date = d;
  if found then return q; end if;
  if p_title is null then return null; end if;
  diff := case extract(dow from d)::int
            when 0 then 'easy'::difficulty when 1 then 'easy'::difficulty when 2 then 'easy'::difficulty
            when 3 then 'medium'::difficulty when 4 then 'medium'::difficulty
            else 'hard'::difficulty end;
  insert into user_quests (user_id, quest_date, title, emoji, difficulty, verify)
  values (uid, d, p_title, '🎯', diff, 'ai')
  returning * into q;
  return q;
end; $$;

create or replace function public.complete_quest(
  p_quest_id uuid, p_video_path text, p_verified boolean, p_verify_reason text
) returns user_quests language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
  q user_quests; prof profiles;
  r double precision := random();
  bonus double precision; won_rarity rarity; base int; mult double precision;
  coins_won int; xp_won int; new_streak int; f record;
begin
  if uid is null then raise exception 'not authenticated'; end if;
  select * into q from user_quests where id = p_quest_id and user_id = uid;
  if not found then raise exception 'quest not found'; end if;
  if q.status = 'completed' then return q; end if;
  if not p_verified then raise exception 'quest not verified'; end if;

  select * into prof from profiles where id = uid;

  bonus := case q.difficulty when 'hard' then 0.18 when 'medium' then 0.08 else 0 end;
  if r < 0.06 + bonus then won_rarity := 'ultra';
  elsif r < 0.30 + bonus * 1.5 then won_rarity := 'mega';
  else won_rarity := 'rare'; end if;

  base := case q.difficulty when 'easy' then 20 when 'medium' then 35 else 55 end;
  mult := case won_rarity when 'ultra' then 3.0 when 'mega' then 1.8 else 1.0 end;
  coins_won := round(base * mult);
  if prof.equipped_mob_id in ('fox', 'elephant') then coins_won := round(coins_won * 1.10); end if;

  -- XP scales with the beast's tier (harder beasts give more).
  xp_won := case q.difficulty when 'easy' then 10 when 'medium' then 20 else 35 end;

  if prof.last_completed_date = current_date then new_streak := prof.streak;
  elsif prof.last_completed_date = current_date - 1 then new_streak := prof.streak + 1;
  else new_streak := 1; end if;

  update profiles set coins = coins + coins_won, xp = xp + xp_won, streak = new_streak,
    last_completed_date = current_date where id = uid;

  update user_quests set status = 'completed', rarity = won_rarity, coins_awarded = coins_won,
    xp_awarded = xp_won, video_path = p_video_path, verified = true, verify_reason = p_verify_reason
    where id = q.id returning * into q;

  for f in
    select case when requester = uid then addressee else requester end as fid
    from friendships where status = 'accepted' and (requester = uid or addressee = uid)
  loop
    insert into activity (user_id, actor_name, actor_emoji, kind, detail)
    values (f.fid, prof.display_name, '🐱', 'finished', 'finished today''s quest');
  end loop;

  return q;
end; $$;

create or replace function public.send_friend_request(p_username text)
returns void language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); target profiles; me profiles;
begin
  if uid is null then raise exception 'not authenticated'; end if;
  select * into target from profiles where username = p_username;
  if not found then raise exception 'user not found'; end if;
  if target.id = uid then raise exception 'cannot add yourself'; end if;
  select * into me from profiles where id = uid;
  insert into friendships (requester, addressee, status) values (uid, target.id, 'pending')
    on conflict (requester, addressee) do nothing;
  insert into activity (user_id, actor_name, actor_emoji, kind, detail)
  values (target.id, me.display_name, '🐱', 'added_you', 'sent you a friend request');
end; $$;

create or replace function public.respond_friend_request(p_request_id uuid, p_accept boolean)
returns void language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid();
begin
  if uid is null then raise exception 'not authenticated'; end if;
  if p_accept then
    update friendships set status = 'accepted' where id = p_request_id and addressee = uid;
  else
    delete from friendships where id = p_request_id and addressee = uid;
  end if;
end; $$;

create or replace function public.get_leaderboard()
returns table (id uuid, username text, display_name text, equipped_mob_id text,
  streak int, finished_today boolean, is_you boolean)
language sql security invoker set search_path = public as $$
  with my_friends as (
    select case when requester = auth.uid() then addressee else requester end as fid
    from friendships where status = 'accepted' and (requester = auth.uid() or addressee = auth.uid())
  )
  select p.id, p.username, p.display_name, p.equipped_mob_id, p.streak,
         p.last_completed_date = current_date as finished_today,
         p.id = auth.uid() as is_you
  from profiles p
  where p.id = auth.uid() or p.id in (select fid from my_friends)
  order by p.streak desc;
$$;

-- ───────────────── Function grants (lock down to authenticated) ─────────────────
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.complete_quest(uuid, text, boolean, text) from public, anon;
grant execute on function public.complete_quest(uuid, text, boolean, text) to authenticated;
revoke all on function public.send_friend_request(text) from public, anon;
grant execute on function public.send_friend_request(text) to authenticated;
revoke all on function public.respond_friend_request(uuid, boolean) from public, anon;
grant execute on function public.respond_friend_request(uuid, boolean) to authenticated;
revoke all on function public.ensure_today_quest() from public, anon;
grant execute on function public.ensure_today_quest() to authenticated;
revoke all on function public.ensure_today_quest_ai(text) from public, anon;
grant execute on function public.ensure_today_quest_ai(text) to authenticated;
revoke all on function public.get_leaderboard() from public, anon;
grant execute on function public.get_leaderboard() to authenticated;

-- ───────────────── Storage ─────────────────
insert into storage.buckets (id, name, public) values ('quest-videos', 'quest-videos', false)
  on conflict (id) do nothing;

create policy "quest videos: own folder read" on storage.objects for select to authenticated
  using (bucket_id = 'quest-videos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "quest videos: own folder insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'quest-videos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "quest videos: own folder update" on storage.objects for update to authenticated
  using (bucket_id = 'quest-videos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "quest videos: own folder delete" on storage.objects for delete to authenticated
  using (bucket_id = 'quest-videos' and (storage.foldername(name))[1] = auth.uid()::text);
