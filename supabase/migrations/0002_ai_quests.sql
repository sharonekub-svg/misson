-- Migration: AI-generated daily missions.
-- Apply to the live database (SQL editor or `supabase db push`). Safe to re-run.
--
-- The web app generates each day's mission with Claude (via the `generate-quest`
-- Edge Function) and stores it through this RPC. Until this is applied (and the
-- Edge Function deployed with ANTHROPIC_API_KEY), the app falls back to the
-- legacy template picker, so nothing breaks in the meantime.

-- Fetch-or-create today's mission.
--   * If today's mission already exists, return it (ignores p_title).
--   * If p_title is NULL, return NULL (lets the client check "do we have one yet?").
--   * Otherwise insert the provided AI-generated title (always AI-verified).
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

revoke all on function public.ensure_today_quest_ai(text) from public, anon;
grant execute on function public.ensure_today_quest_ai(text) to authenticated;
