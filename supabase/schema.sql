-- 오운완 · Supabase 스키마
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 실행하세요.
-- (여러 번 실행해도 안전하도록 작성했습니다.)

-- ─────────────────────────────────────────────
-- profiles: 사용자 표시 이름 (auth.users 1:1)
-- ─────────────────────────────────────────────
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  name       text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles are self-managed" on public.profiles;
create policy "profiles are self-managed"
  on public.profiles
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ─────────────────────────────────────────────
-- workouts: 운동 기록
-- ─────────────────────────────────────────────
create table if not exists public.workouts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  name       text not null,
  sets       integer not null default 1,
  reps       integer not null default 0,
  weight     numeric not null default 0,
  category   text not null check (category in ('lower', 'upper', 'core', 'cardio')),
  date       text not null,          -- KST 기준 'YYYY-MM-DD'
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists workouts_user_date_idx
  on public.workouts (user_id, date);

alter table public.workouts enable row level security;

drop policy if exists "workouts are self-managed" on public.workouts;
create policy "workouts are self-managed"
  on public.workouts
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
