-- =====================================================================
-- Deservv — run this ONCE in the Supabase SQL editor BEFORE deploying.
--
-- This is migrations 0001 + 0002 + 0003 concatenated for convenience.
-- Every statement is idempotent, so re-running is safe.
--
-- READ THIS BEFORE YOU RUN IT:
--   Section 2 DELETES duplicate signup rows that share an email address.
--   It keeps the OLDEST row of each duplicate set and re-points that
--   person's assessment and payment records at the surviving row first,
--   so no child data is orphaned. If you would rather inspect the
--   duplicates before anything is deleted, run this first:
--
--     select lower(email) as email, count(*)
--       from signups group by 1 having count(*) > 1;
--
--   If that returns zero rows, there is nothing to delete and the
--   section is a no-op.
-- =====================================================================


-- =====================================================================
-- SECTION 1 of 3 — baseline schema (0001_init.sql)
-- =====================================================================
-- Baseline schema. Safe to re-run.
create extension if not exists "pgcrypto";

create table if not exists signups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  created_at timestamptz default now()
);

create table if not exists assessment_responses (
  id uuid primary key default gen_random_uuid(),
  signup_id uuid references signups(id),
  q1_role text,
  q2_ai_usage text,
  q3_goal text,
  q4_time_commit text,
  q5_blocker text,
  q6_urgency text,
  tier text,
  created_at timestamptz default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  signup_id uuid references signups(id),
  razorpay_order_id text,
  razorpay_payment_id text,
  status text default 'created',
  amount integer default 1000000,
  created_at timestamptz default now()
);


-- =====================================================================
-- SECTION 2 of 3 — hardening (0002_hardening.sql)
-- Adds columns the new API routes write, de-duplicates signups by email,
-- adds the unique index the upsert depends on, and ENABLES RLS.
-- =====================================================================
-- Signup storage hardening. Idempotent: safe to run more than once.

-- 1. Columns the app now writes.
alter table signups add column if not exists source text;
alter table signups add column if not exists updated_at timestamptz default now();
alter table assessment_responses add column if not exists answers jsonb;
alter table payments add column if not exists updated_at timestamptz default now();
alter table payments add column if not exists currency text default 'INR';

-- 2. One signup per email. Required for the upsert in /api/signup.
--    De-duplicate first, keeping the oldest row so existing foreign keys survive.
update signups s
   set email = lower(trim(s.email))
 where s.email <> lower(trim(s.email));

with ranked as (
  select id, email,
         row_number() over (partition by lower(email) order by created_at asc, id asc) as rn
    from signups
),
keepers as (
  select lower(email) as email_key, id as keeper_id from ranked where rn = 1
),
dupes as (
  select r.id as dupe_id, k.keeper_id
    from ranked r
    join keepers k on k.email_key = lower(r.email)
   where r.rn > 1
)
update assessment_responses a
   set signup_id = d.keeper_id
  from dupes d
 where a.signup_id = d.dupe_id;

with ranked as (
  select id, email,
         row_number() over (partition by lower(email) order by created_at asc, id asc) as rn
    from signups
),
keepers as (
  select lower(email) as email_key, id as keeper_id from ranked where rn = 1
),
dupes as (
  select r.id as dupe_id, k.keeper_id
    from ranked r
    join keepers k on k.email_key = lower(r.email)
   where r.rn > 1
)
update payments p
   set signup_id = d.keeper_id
  from dupes d
 where p.signup_id = d.dupe_id;

delete from signups s
 where exists (
   select 1 from signups o
    where lower(o.email) = lower(s.email)
      and (o.created_at, o.id) < (s.created_at, s.id)
 );

create unique index if not exists signups_email_key on signups (email);

-- 3. Lookup indexes.
create index if not exists signups_created_at_idx on signups (created_at desc);
create index if not exists assessment_signup_idx on assessment_responses (signup_id);
create index if not exists assessment_created_at_idx on assessment_responses (created_at desc);
create index if not exists payments_signup_idx on payments (signup_id);
create index if not exists payments_status_idx on payments (status);
create index if not exists payments_created_at_idx on payments (created_at desc);

-- 4. Keep updated_at honest.
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists signups_set_updated_at on signups;
create trigger signups_set_updated_at
  before update on signups
  for each row execute function set_updated_at();

drop trigger if exists payments_set_updated_at on payments;
create trigger payments_set_updated_at
  before update on payments
  for each row execute function set_updated_at();

-- 5. Lock the tables down.
--    NEXT_PUBLIC_SUPABASE_URL ships to the browser, so anon must never read
--    applicant data. Every write in this app goes through the service role,
--    which bypasses RLS. No policies means no anon access, which is correct.
alter table signups enable row level security;
alter table assessment_responses enable row level security;
alter table payments enable row level security;

revoke all on signups from anon;
revoke all on assessment_responses from anon;
revoke all on payments from anon;


-- =====================================================================
-- SECTION 3 of 3 — Cashfree columns (0003_cashfree.sql)
-- =====================================================================
-- Cashfree support alongside the existing Razorpay columns.

alter table payments add column if not exists provider text default 'razorpay';
alter table payments add column if not exists cf_order_id text;
alter table payments add column if not exists cf_payment_id text;
alter table payments add column if not exists webhook_event text;

-- Backfill existing rows so provider is never null.
update payments set provider = 'razorpay' where provider is null;

-- Required by the upserts in /api/cashfree/*. Partial, so the many NULL
-- cf_order_id rows from the Razorpay era do not collide.
create unique index if not exists payments_cf_order_id_key
  on payments (cf_order_id)
  where cf_order_id is not null;

create index if not exists payments_provider_idx on payments (provider);
