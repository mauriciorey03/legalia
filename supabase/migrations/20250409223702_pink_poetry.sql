/*
  # User Profiles Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, matches auth.users.id)
      - `full_name` (text)
      - `subscription_plan` (text)
      - `subscription_status` (text)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on profiles table
    - Add policies for authenticated users to read/update their own profile
*/

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  subscription_plan text default 'free',
  subscription_status text default 'active',
  updated_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can read own profile"
  on profiles
  for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);