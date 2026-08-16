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
