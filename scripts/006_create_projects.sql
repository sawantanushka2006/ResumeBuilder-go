-- Create projects table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  resume_id uuid not null references public.resumes(id) on delete cascade,
  name text not null,
  description text,
  technologies text[],
  start_date date,
  end_date date,
  is_ongoing boolean default false,
  url text,
  github_url text,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.projects enable row level security;

-- Create RLS policies
create policy "projects_select_own"
  on public.projects for select
  using (
    exists (
      select 1 from public.resumes
      where resumes.id = projects.resume_id
      and resumes.user_id = auth.uid()
    )
  );

create policy "projects_insert_own"
  on public.projects for insert
  with check (
    exists (
      select 1 from public.resumes
      where resumes.id = projects.resume_id
      and resumes.user_id = auth.uid()
    )
  );

create policy "projects_update_own"
  on public.projects for update
  using (
    exists (
      select 1 from public.resumes
      where resumes.id = projects.resume_id
      and resumes.user_id = auth.uid()
    )
  );

create policy "projects_delete_own"
  on public.projects for delete
  using (
    exists (
      select 1 from public.resumes
      where resumes.id = projects.resume_id
      and resumes.user_id = auth.uid()
    )
  );
