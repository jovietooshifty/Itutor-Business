-- ============================================================================
-- Course builder step 4 — Review & publish (handoff flow 4, build step 6).
--
-- Every course up to now was live the instant its visibility was set to
-- 'public': courses_select_public only checked visibility, so a course with a
-- title and zero blocks was listable in the marketplace mid-edit. This adds an
-- explicit draft/published state so nothing is externally reachable — listed
-- OR resolvable by its share link — until the business deliberately publishes
-- it from the review screen.
-- ============================================================================

create type public.course_status as enum ('draft', 'published');

alter table public.courses
  add column if not exists status public.course_status not null default 'draft';

create index if not exists courses_status_idx on public.courses (status)
  where status = 'published';

comment on column public.courses.status is
  'Draft courses are invisible outside the owning business, regardless of
   visibility — set to published from the Review & Publish step.';

-- ── RLS: both public-reach paths now also require status = published ───────

drop policy if exists courses_select_public on public.courses;
create policy courses_select_public on public.courses
  for select using (
    visibility = 'public'::public.course_visibility
    and status = 'published'::public.course_status
  );

create or replace function public.course_by_share_token(p_token text)
returns table (
  id uuid,
  business_id uuid,
  title text,
  thumbnail_url text,
  description text,
  tagline text,
  what_you_will_learn text[],
  visibility public.course_visibility,
  business_name text,
  business_logo_url text
)
language sql
stable
security definer
set search_path = public
as $fn$
  select c.id, c.business_id, c.title, c.thumbnail_url, c.description, c.tagline,
         c.what_you_will_learn, c.visibility, b.name, b.logo_url
  from public.courses c
  join public.businesses b on b.id = c.business_id
  where c.share_token = p_token
    and c.status = 'published'::public.course_status
  limit 1;
$fn$;
