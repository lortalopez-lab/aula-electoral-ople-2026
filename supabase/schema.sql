-- Aula Electoral OPLEV 2026: historial y sesiones privadas por usuario.
-- Ejecutar una vez en el SQL Editor del proyecto Supabase.
create table if not exists public.ople_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint ople_progress_state_object check (jsonb_typeof(state) = 'object')
);
alter table public.ople_progress enable row level security;
revoke all on public.ople_progress from anon;
grant select, insert, update on public.ople_progress to authenticated;
drop policy if exists ople_progress_select_self on public.ople_progress;
drop policy if exists ople_progress_insert_self on public.ople_progress;
drop policy if exists ople_progress_update_self on public.ople_progress;
create policy ople_progress_select_self on public.ople_progress for select to authenticated using ((select auth.uid()) = user_id);
create policy ople_progress_insert_self on public.ople_progress for insert to authenticated with check ((select auth.uid()) = user_id);
create policy ople_progress_update_self on public.ople_progress for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create or replace function public.ople_touch_updated_at()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end $$;
drop trigger if exists ople_progress_touch_updated_at on public.ople_progress;
create trigger ople_progress_touch_updated_at before update on public.ople_progress for each row execute function public.ople_touch_updated_at();
