-- ホジョカレ Phase 1: 無料チェッカーのリード保存と30日前アラートの送信記録
-- 実行方法: Supabase ダッシュボード > SQL Editor に貼り付けて実行
--          (または supabase cli: supabase db push)

create extension if not exists pgcrypto;

-- チェッカーで計算したユーザー(リード)。同一条件の再計算は upsert で重複させない
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  program_id text not null,
  koufu_kettei_date date not null,
  shuuryou_yotei_date date not null,
  kessan_month int not null check (kessan_month between 1 and 12),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists leads_dedup_idx
  on public.leads (email, program_id, koufu_kettei_date, shuuryou_yotei_date, kessan_month);

create index if not exists leads_email_idx on public.leads (email);

-- 30日前アラートの送信記録(リード×期限キーで1回だけ送る)
create table if not exists public.alert_logs (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  deadline_key text not null,
  due_date date not null,
  sent_at timestamptz not null default now(),
  unique (lead_id, deadline_key)
);

-- RLS を有効化しポリシーは作らない = anon キーからは一切アクセス不可。
-- 書き込みはサーバーの service_role キー経由のみ(RLS をバイパス)。
alter table public.leads enable row level security;
alter table public.alert_logs enable row level security;
