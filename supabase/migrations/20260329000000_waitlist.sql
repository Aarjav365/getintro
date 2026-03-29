-- Waitlist: one row per claimed username (public anon read + insert for landing flow)
create table if not exists public.waitlist (
  username text primary key
    check (
      char_length(username) <= 30
      and username ~ '^[a-z0-9_]+$'
    ),
  created_at timestamptz not null default now()
);

alter table public.waitlist enable row level security;

drop policy if exists "waitlist_select_public" on public.waitlist;
create policy "waitlist_select_public"
  on public.waitlist for select
  to anon, authenticated
  using (true);

drop policy if exists "waitlist_insert_public" on public.waitlist;
create policy "waitlist_insert_public"
  on public.waitlist for insert
  to anon, authenticated
  with check (true);
