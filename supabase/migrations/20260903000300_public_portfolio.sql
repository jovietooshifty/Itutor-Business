-- ============================================================================
-- Public learner portfolio (handoff flow 10).
--
-- The row-level policies already decide WHO is public — learner_profiles,
-- learner_skills and certificates each have a *_public_portfolio policy. What
-- they cannot express is the join: a portfolio needs the learner's name (in
-- public.users, readable only to themselves and their business) and each
-- certificate's course and issuer (through public.enrollments, likewise
-- private). An anonymous visitor could therefore read a certificate row
-- without being able to tell whose it was or what it was for.
--
-- These two definer functions close that gap and nothing more. Note what is
-- absent from the first: phone, phone_country_code, timezone and employer.
-- learner_profiles_select_public_portfolio exposes the whole row to anon, so
-- the handoff's "portfolio page excluding private contact fields" is enforced
-- here in the column list rather than left to the page template.
-- ============================================================================

create or replace function public.portfolio_by_slug(p_slug text)
returns table (
  user_id uuid,
  full_name text,
  avatar_url text,
  bio text,
  job_title text,
  years_experience text
)
language sql
stable
security definer
set search_path = public
as $fn$
  select lp.user_id, u.full_name, lp.avatar_url, lp.bio, lp.job_title, lp.years_experience
  from public.learner_profiles lp
  join public.users u on u.id = lp.user_id
  where lp.portfolio_slug = p_slug
    and lp.public_portfolio = true
  limit 1;
$fn$;

revoke all on function public.portfolio_by_slug(text) from public;
grant execute on function public.portfolio_by_slug(text) to anon, authenticated;

-- Certificates the learner has chosen to show. Mirrors
-- certificates_select_public_portfolio: both flags must be true.
create or replace function public.portfolio_certificates(p_slug text)
returns table (
  certificate_id text,
  issued_at timestamptz,
  course_title text,
  business_name text
)
language sql
stable
security definer
set search_path = public
as $fn$
  select cert.certificate_id, cert.issued_at, c.title, b.name
  from public.certificates cert
  join public.enrollments e on e.id = cert.enrollment_id
  join public.learner_profiles lp on lp.user_id = e.learner_id
  join public.courses c on c.id = e.course_id
  join public.businesses b on b.id = c.business_id
  where lp.portfolio_slug = p_slug
    and lp.public_portfolio = true
    and cert.visible_on_portfolio = true
  order by cert.issued_at desc;
$fn$;

revoke all on function public.portfolio_certificates(text) from public;
grant execute on function public.portfolio_certificates(text) to anon, authenticated;
