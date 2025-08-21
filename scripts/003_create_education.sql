-- Create education table
create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  resume_id uuid not null references public.resumes(id) on delete cascade,
  institution text not null,
  degree text not null,
  field_of_study text,
  start_date date,
  end_date date,
  is_current boolean default false,
  gpa text,
  description text,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.education enable row level security;

-- Create RLS policies
create policy "education_select_own"
  on public.education for select
  using (
    exists (
      select 1 from public.resumes
      where resumes.id = education.resume_id
      and resumes.user_id = auth.uid()
    )
  );

create policy "education_insert_own"
  on public.education for insert
  with check (
    exists (
      select 1 from public.resumes
      where resumes.id = education.resume_id
      and resumes.user_id = auth.uid()
    )
  );

create policy "education_update_own"
  on public.education for update
  using (
    exists (
      select 1 from public.resumes
      where resumes.id = education.resume_id
      and resumes.user_id = auth.uid()
    )
  );

create policy "education_delete_own"
  on public.education for delete
  using (
    exists (
      select 1 from public.resumes
      where resumes.id = education.resume_id
      and resumes.user_id = auth.uid()
    )
  );
