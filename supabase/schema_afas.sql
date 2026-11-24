-- AFA Platform: real `afas` table for testing actual submissions.
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query),
-- after schema.sql. This is for the peer-testing activity branch
-- (feature/real-submission-prototype) — safe to drop later if this stays experimental.

create table if not exists public.afas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  afa_type text not null,
  application_name text not null,
  fields jsonb not null default '{}'::jsonb,
  files jsonb not null default '[]'::jsonb,
  status text not null default 'submitted' check (status in ('submitted', 'dept_chair', 'ofa', 'approved', 'returned')),
  created_at timestamptz not null default now()
);

alter table public.afas enable row level security;

create policy "Users can view their own AFAs"
  on public.afas for select
  using (auth.uid() = user_id);

create policy "Users can insert their own AFAs"
  on public.afas for insert
  with check (auth.uid() = user_id);
