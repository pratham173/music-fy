/**
 * Supabase SQL Schema for StudyFlow
 * Run these commands in your Supabase SQL editor
 */

-- User profiles (already exists in original schema)
-- create table profiles (
--   id uuid primary key references auth.users on delete cascade,
--   email text unique
-- );

-- Study sessions table
create table if not exists study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  pdf_name text not null,
  chapter_name text,
  theme text check (theme in ('exam_cram', 'problem_solver', 'deep_diver')),
  content jsonb,
  created_at timestamptz default now()
);

-- User preferences table
create table if not exists study_preferences (
  user_id uuid primary key references auth.users on delete cascade,
  default_theme text default 'exam_cram',
  auto_save boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security
alter table study_sessions enable row level security;
alter table study_preferences enable row level security;

-- Policies for study_sessions
create policy "Users can view own sessions" 
  on study_sessions for select 
  using (auth.uid() = user_id);

create policy "Users can create own sessions" 
  on study_sessions for insert 
  with check (auth.uid() = user_id);

create policy "Users can update own sessions" 
  on study_sessions for update 
  using (auth.uid() = user_id);

create policy "Users can delete own sessions" 
  on study_sessions for delete 
  using (auth.uid() = user_id);

-- Policies for study_preferences
create policy "Users can view own preferences" 
  on study_preferences for select 
  using (auth.uid() = user_id);

create policy "Users can insert own preferences" 
  on study_preferences for insert 
  with check (auth.uid() = user_id);

create policy "Users can update own preferences" 
  on study_preferences for update 
  using (auth.uid() = user_id);

-- Indexes for better performance
create index if not exists study_sessions_user_id_idx on study_sessions(user_id);
create index if not exists study_sessions_created_at_idx on study_sessions(created_at desc);
create index if not exists study_sessions_theme_idx on study_sessions(theme);

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to automatically update updated_at
create trigger update_study_preferences_updated_at
  before update on study_preferences
  for each row
  execute function update_updated_at_column();
