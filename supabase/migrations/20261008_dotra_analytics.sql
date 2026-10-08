-- Analytics events for public profile views and link clicks
create table if not exists public.dotra_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.dotra_profiles (id) on delete cascade,
  event_type text not null check (event_type in ('view', 'click')),
  link_id uuid,
  link_href text,
  link_icon text,
  link_label text,
  visitor_key text,
  created_at timestamptz not null default now()
);

create index if not exists dotra_events_profile_created_idx
  on public.dotra_events (profile_id, created_at desc);

create index if not exists dotra_events_profile_type_idx
  on public.dotra_events (profile_id, event_type, created_at desc);

alter table public.dotra_events enable row level security;

drop policy if exists "dotra_events_insert_public_profiles" on public.dotra_events;
create policy "dotra_events_insert_public_profiles"
  on public.dotra_events for insert
  with check (
    exists (
      select 1
      from public.dotra_profiles p
      where p.id = profile_id
        and p.onboarding_completed_at is not null
    )
  );

drop policy if exists "dotra_events_select_own" on public.dotra_events;
create policy "dotra_events_select_own"
  on public.dotra_events for select
  using (auth.uid() = profile_id);
