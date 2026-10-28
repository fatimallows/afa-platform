-- AFA Platform: profiles table + auto-create trigger
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query).

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'faculty'
    check (role in ('faculty', 'student', 'dept_chair', 'dean', 'nstp_office', 'fic', 'ofa_admin')),
  college text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-creates a profile row whenever someone signs in for the first time.
-- Everyone defaults to 'faculty' for now since that's the primary persona
-- being built against — replace with real role assignment (e.g. by college
-- or an admin invite flow) once that part of the platform exists.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    'faculty'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
