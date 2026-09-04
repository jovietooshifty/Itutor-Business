-- ============================================================================
-- The company panel on the two surfaces where a learner decides to join.
--
-- Both /c/[token] and /learn/[courseId] showed the business NAME and nothing
-- else — a learner was being asked to hand over a resume and a phone number
-- to a string. Everything they would reasonably want first (who this is, what
-- they do, where they are, how to reach them) already sits on `businesses`
-- and `business_locations`.
--
-- This has to be a definer function because /c/[token] serves anonymous
-- visitors: `businesses` is not readable to anon, which is exactly why
-- course_by_share_token() exists and returns two hand-picked columns.
--
-- The published-course guard is the part that matters. Without it this is an
-- enumeration endpoint over every business on the platform, including ones
-- that have never published anything.
-- ============================================================================

create or replace function public.company_for_join(p_business_id uuid)
returns table (
  id uuid,
  name text,
  logo_url text,
  cover_url text,
  description text,
  tagline text,
  industry text,
  website text,
  contact_email text,
  contact_phone text,
  city text,
  region text,
  country text,
  course_count bigint,
  learner_count bigint
)
language sql
stable
security definer
set search_path = public
as $fn$
  select
    b.id,
    b.name,
    b.logo_url,
    b.cover_url,
    b.description,
    b.tagline,
    b.industry,
    b.website,
    -- Deliberately the business's own contact fields, never the admin's
    -- personal phone on business_members. Both are required before a course
    -- can be created (see lib/company-gate.ts) and both are labelled in the
    -- profile form as publicly visible.
    b.contact_email,
    b.contact_phone,
    loc.city,
    loc.region,
    loc.country,
    (
      select count(*) from public.courses c2
      where c2.business_id = b.id and c2.status = 'published'::public.course_status
    ) as course_count,
    (
      select count(distinct e.learner_id)
      from public.enrollments e
      join public.courses c3 on c3.id = e.course_id
      where c3.business_id = b.id
        and c3.status = 'published'::public.course_status
    ) as learner_count
  from public.businesses b
  left join lateral (
    select l.city, l.region, l.country
    from public.business_locations l
    where l.business_id = b.id
    order by l.position, l.created_at
    limit 1
  ) loc on true
  where b.id = p_business_id
    -- Reachable only for a business that has actually published something.
    and exists (
      select 1 from public.courses c
      where c.business_id = b.id
        and c.status = 'published'::public.course_status
    )
  limit 1;
$fn$;

revoke all on function public.company_for_join(uuid) from public;
grant execute on function public.company_for_join(uuid) to anon, authenticated;

comment on function public.company_for_join(uuid) is
  'The company panel shown to a learner deciding whether to join a course. Public by design, and only for a business with at least one published course.';
