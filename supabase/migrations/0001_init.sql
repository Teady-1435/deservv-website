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
