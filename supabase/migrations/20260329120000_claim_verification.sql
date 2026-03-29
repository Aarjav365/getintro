-- Email verification for claims + server-side waitlist inserts only
alter table public.waitlist add column if not exists email text;

create unique index if not exists waitlist_email_lower_unique
  on public.waitlist (lower(email))
  where email is not null;

drop policy if exists "waitlist_insert_public" on public.waitlist;

create table if not exists public.claim_verifications (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  username text not null,
  code_hash text not null,
  expires_at timestamptz not null,
  consumed boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists claim_verifications_active_lookup
  on public.claim_verifications (lower(email), username)
  where not consumed;

alter table public.claim_verifications enable row level security;

-- No anon/authenticated policies: only service_role (used by API server) can access.
