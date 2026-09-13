-- Dotra profiles, links, storage, RLS
create extension if not exists "pgcrypto";

create table if not exists public.dotra_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  slug text unique,
  display_name text not null default '',
  tagline text not null default '',
  avatar_path text,
  banner_path text,
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.dotra_links (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.dotra_profiles (id) on delete cascade,
  label text not null default '',
  href text not null default '',
  description text not null default '',
  icon text not null default 'globe',
  sort_order integer not null default 0,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists dotra_links_profile_id_sort_idx
  on public.dotra_links (profile_id, sort_order);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists dotra_profiles_set_updated_at on public.dotra_profiles;
create trigger dotra_profiles_set_updated_at
  before update on public.dotra_profiles
  for each row execute function public.set_updated_at();

drop trigger if exists dotra_links_set_updated_at on public.dotra_links;
create trigger dotra_links_set_updated_at
  before update on public.dotra_links
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_dotra_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.dotra_profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_dotra on auth.users;
create trigger on_auth_user_created_dotra
  after insert on auth.users
  for each row execute function public.handle_new_dotra_user();

alter table public.dotra_profiles enable row level security;
alter table public.dotra_links enable row level security;

drop policy if exists "dotra_profiles_select_own_or_public" on public.dotra_profiles;
create policy "dotra_profiles_select_own_or_public"
  on public.dotra_profiles for select
  using (
    auth.uid() = id
    or onboarding_completed_at is not null
  );

drop policy if exists "dotra_profiles_update_own" on public.dotra_profiles;
create policy "dotra_profiles_update_own"
  on public.dotra_profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "dotra_profiles_insert_own" on public.dotra_profiles;
create policy "dotra_profiles_insert_own"
  on public.dotra_profiles for insert
  with check (auth.uid() = id);

drop policy if exists "dotra_links_select_visible" on public.dotra_links;
create policy "dotra_links_select_visible"
  on public.dotra_links for select
  using (
    auth.uid() = profile_id
    or exists (
      select 1 from public.dotra_profiles p
      where p.id = dotra_links.profile_id
        and p.onboarding_completed_at is not null
    )
  );

drop policy if exists "dotra_links_insert_own" on public.dotra_links;
create policy "dotra_links_insert_own"
  on public.dotra_links for insert
  with check (auth.uid() = profile_id);

drop policy if exists "dotra_links_update_own" on public.dotra_links;
create policy "dotra_links_update_own"
  on public.dotra_links for update
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

drop policy if exists "dotra_links_delete_own" on public.dotra_links;
create policy "dotra_links_delete_own"
  on public.dotra_links for delete
  using (auth.uid() = profile_id);

insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('banners', 'banners', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "avatars_public_read" on storage.objects;
create policy "avatars_public_read"
  on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "avatars_owner_write" on storage.objects;
create policy "avatars_owner_write"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "avatars_owner_update" on storage.objects;
create policy "avatars_owner_update"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "avatars_owner_delete" on storage.objects;
create policy "avatars_owner_delete"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "banners_public_read" on storage.objects;
create policy "banners_public_read"
  on storage.objects for select
  using (bucket_id = 'banners');

drop policy if exists "banners_owner_write" on storage.objects;
create policy "banners_owner_write"
  on storage.objects for insert
  with check (
    bucket_id = 'banners'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "banners_owner_update" on storage.objects;
create policy "banners_owner_update"
  on storage.objects for update
  using (
    bucket_id = 'banners'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "banners_owner_delete" on storage.objects;
create policy "banners_owner_delete"
  on storage.objects for delete
  using (
    bucket_id = 'banners'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
