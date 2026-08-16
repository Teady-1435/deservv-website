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
