-- MINDMONEY Stage 1 foundation schema.
-- Apply only to a new development Supabase project after reviewing the SQL.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  currency_code text not null default 'NGN' check (currency_code ~ '^[A-Z]{3}$'),
  timezone text not null default 'Africa/Lagos',
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.income_sources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  source_type text not null check (source_type in ('salary','allowance','freelance','business','gift','other')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  income_source_id uuid references public.income_sources(id) on delete set null,
  transaction_type text not null check (transaction_type in ('income','expense','transfer','refund','borrowed_money','repayment')),
  category text not null,
  description text not null,
  amount_minor bigint not null check (amount_minor > 0),
  currency_code text not null default 'NGN' check (currency_code ~ '^[A-Z]{3}$'),
  occurred_at timestamptz not null default now(),
  source text not null default 'manual' check (source in ('manual','bank_import','system')),
  external_reference text,
  created_at timestamptz not null default now(),
  unique (user_id, source, external_reference)
);

create table if not exists public.debts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  creditor_name text not null,
  original_amount_minor bigint not null check (original_amount_minor > 0),
  outstanding_amount_minor bigint not null check (outstanding_amount_minor >= 0),
  interest_rate numeric(7,4) not null default 0 check (interest_rate >= 0),
  due_date date,
  notes text,
  status text not null default 'active' check (status in ('active','paid','restructured')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  period_type text not null check (period_type in ('weekly','monthly')),
  starts_on date not null,
  ends_on date not null,
  amount_minor bigint not null check (amount_minor >= 0),
  currency_code text not null default 'NGN',
  created_at timestamptz not null default now(),
  check (ends_on >= starts_on)
);

create table if not exists public.savings_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  target_amount_minor bigint not null check (target_amount_minor > 0),
  current_amount_minor bigint not null default 0 check (current_amount_minor >= 0),
  target_date date,
  created_at timestamptz not null default now()
);

create index if not exists transactions_user_date_idx on public.transactions(user_id, occurred_at desc);
create index if not exists debts_user_status_idx on public.debts(user_id, status);
create index if not exists budgets_user_dates_idx on public.budgets(user_id, starts_on, ends_on);

alter table public.profiles enable row level security;
alter table public.income_sources enable row level security;
alter table public.transactions enable row level security;
alter table public.debts enable row level security;
alter table public.budgets enable row level security;
alter table public.savings_goals enable row level security;

create policy "profiles_select_own" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "income_sources_all_own" on public.income_sources for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "transactions_all_own" on public.transactions for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "debts_all_own" on public.debts for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "budgets_all_own" on public.budgets for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "savings_goals_all_own" on public.savings_goals for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- Create a profile row automatically when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
