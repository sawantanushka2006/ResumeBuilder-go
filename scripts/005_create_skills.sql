-- Create skills table
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  resume_id uuid not null references public.resumes(id) on delete cascade,
  category text not null,
  skills text[] not null,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.skills enable row level security;

-- Create RLS policies
create policy "skills_select_own"
  on public.skills for select
  using (
    exists (
      select 1 from public.resumes
      where resumes.id = skills.resume_id
      and resumes.user_id = auth.uid()
    )
  );

create policy "skills_insert_own"
  on public.skills for insert
  with check (
    exists (
      select 1 from public.resumes
      where resumes.id = skills.resume_id
      and resumes.user_id = auth.uid()
    )
  );

create policy "skills_update_own"
  on public.skills for update
  using (
    exists (
      select 1 from public.resumes
      where resumes.id = skills.resume_id
      and resumes.user_id = auth.uid()
    )
  );

create policy "skills_delete_own"
  on public.skills for delete
  using (
    exists (
      select 1 from public.resumes
      where resumes.id = skills.resume_id
      and resumes.user_id = auth.uid()
    )
  );
