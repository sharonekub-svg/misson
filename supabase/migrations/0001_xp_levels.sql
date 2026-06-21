-- Migration: add XP + Levels to BOUNTY.
-- Apply to the live database (SQL editor or `supabase db push`). Safe to re-run.
--
-- Until this is applied the web app derives XP client-side from your felled
-- beasts, so nothing breaks; applying it makes XP authoritative server-side.

alter table profiles add column if not exists xp int not null default 0;
alter table user_quests add column if not exists xp_awarded int;

-- Backfill XP for beasts already felled, so existing Wardens keep their rank.
update profiles p set xp = sub.total
from (
  select user_id, sum(case difficulty when 'easy' then 10 when 'medium' then 20 else 35 end) as total
  from user_quests where status = 'completed'
  group by user_id
) sub
where p.id = sub.user_id and p.xp = 0;

-- complete_quest now awards XP alongside coins and records it on the quest row.
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
    values (f.fid, prof.display_name, '🐱', 'finished', 'felled today''s beast');
  end loop;

  return q;
end; $$;
