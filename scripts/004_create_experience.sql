-- Create experience table
create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(),
  resume_id uuid not null references public.resumes(id) on delete cascade,
  company text not null,
  position text not null,
  location text,
  start_date date,
  end_date date,
  is_current boolean default false,
  description text,
  achievements text[],
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.experience enable row level security;

-- Create RLS policies
create policy "experience_select_own"
  on public.experience for select
  using (
    exists (
      select 1 from public.resumes
      where resumes.id = experience.resume_id
      and resumes.user_id = auth.uid()
    )
  );

create policy "experience_insert_own"
  on public.experience for insert
  with check (
    exists (
      select 1 from public.resumes
      where resumes.id = experience.resume_id
      and resumes.user_id = auth.uid()
    )
  );

create policy "experience_update_own"
  on public.experience for update
  using (
    exists (
      select 1 from public.resumes
      where resumes.id = experience.resume_id
      and resumes.user_id = auth.uid()
    )
  );

create policy "experience_delete_own"
  on public.experience for delete
  using (
    exists (
      select 1 from public.resumes
      where resumes.id = experience.resume_id
      and resumes.user_id = auth.uid()
    )
  );
