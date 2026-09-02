-- ============================================================================
-- iTutor Business — core schema
-- Mirrors section 4 of itutor-business-claude-code-handoff.md.
-- Deviations and additions are called out inline with "NOTE:".
-- ============================================================================

create extension if not exists "pgcrypto";

-- ── Enums ───────────────────────────────────────────────────────────────────
create type public.user_type as enum ('business_owner', 'company_member', 'learner');
create type public.business_status as enum ('active');
create type public.business_type as enum ('independent', 'franchise', 'chain');
create type public.member_role as enum ('admin', 'operator', 'auditor');
create type public.member_status as enum ('invited', 'active');
create type public.course_visibility as enum ('public', 'private');
create type public.block_type as enum ('video', 'text', 'website', 'quiz');
create type public.quiz_navigation as enum ('allow_back', 'lock_forward');
create type public.quiz_navigation_override as enum ('allow_back', 'lock_forward', 'inherit');
create type public.quiz_scope as enum ('preceding_block', 'since_last_quiz', 'specific_blocks', 'whole_course', 'none');
create type public.enrollment_status as enum ('in_progress', 'completed');
create type public.block_progress_status as enum ('locked', 'unlocked', 'completed');

-- ── Shared helpers ──────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $fn$
begin
  new.updated_at := now();
  return new;
end $fn$;

-- ============================================================================
-- Accounts
-- ============================================================================

-- NOTE: the handoff model lists `password_hash` on users. Supabase Auth owns
-- credentials in auth.users, so this table is the public mirror of an auth user
-- and deliberately carries no password column.
-- NOTE: `full_name` is an addition — both the Learner and the member profile
-- builders collect "Full name", and the Team list renders it.
create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  user_type public.user_type not null,
  email_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index users_email_key on public.users (lower(email));
create trigger users_set_updated_at before update on public.users
  for each row execute function public.set_updated_at();

-- NOTE additions, all driven by the Company Profile screen in
-- Organization Sign-Up.dc.html: owner_id, cover_url, contact_phone,
-- contact_email, timezone.
create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.users (id) on delete set null,
  name text not null,
  position_of_owner text,
  logo_url text,
  stamp_url text,
  cover_url text,
  description text,
  tagline text,
  industry text,
  company_size text,
  year_founded int check (year_founded is null or year_founded between 1800 and 2200),
  business_type public.business_type,
  website text,
  contact_phone text,
  contact_email text,
  timezone text,
  status public.business_status not null default 'active',
  -- Org-wide default retake policy, e.g. { "max_attempts": 3, "cooldown_hours": 24 }
  quiz_retake_policy jsonb not null default '{"max_attempts": 3, "cooldown_hours": 24}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index businesses_owner_id_idx on public.businesses (owner_id);
create trigger businesses_set_updated_at before update on public.businesses
  for each row execute function public.set_updated_at();

create table public.business_locations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  street text,
  city text,
  region text,
  country text,
  position int not null default 0,
  created_at timestamptz not null default now()
);
create index business_locations_business_id_idx on public.business_locations (business_id);

create table public.business_certifications (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  name text not null,
  file_url text,
  created_at timestamptz not null default now()
);
create index business_certifications_business_id_idx on public.business_certifications (business_id);

-- NOTE: addition — "Training language(s)" chips on the Company Profile screen.
create table public.business_training_languages (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  language text not null,
  unique (business_id, language)
);

-- NOTE: `invited_email` is an addition. An invite is created before the invitee
-- has an account, so user_id stays null until the invite is accepted.
create table public.business_members (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  user_id uuid references public.users (id) on delete cascade,
  invited_email text,
  role public.member_role not null default 'operator',
  invited_by uuid references public.users (id) on delete set null,
  status public.member_status not null default 'invited',
  joined_at timestamptz,
  created_at timestamptz not null default now(),
  constraint business_members_identity_present
    check (user_id is not null or invited_email is not null),
  constraint business_members_active_needs_user
    check (status <> 'active' or user_id is not null)
);
create unique index business_members_business_user_key
  on public.business_members (business_id, user_id) where user_id is not null;
create unique index business_members_business_invite_key
  on public.business_members (business_id, lower(invited_email)) where invited_email is not null;
create index business_members_user_id_idx on public.business_members (user_id);

-- Distinct from learner_profiles, trimmed to avoid redundancy.
create table public.member_profiles (
  user_id uuid primary key references public.users (id) on delete cascade,
  avatar_url text,
  bio text,
  job_title text,
  phone_country_code text,
  phone text,
  preferred_language text,
  updated_at timestamptz not null default now()
);
create trigger member_profiles_set_updated_at before update on public.member_profiles
  for each row execute function public.set_updated_at();

create table public.learner_profiles (
  user_id uuid primary key references public.users (id) on delete cascade,
  date_of_birth date,
  avatar_url text,
  bio text,
  employed boolean,
  job_title text,
  years_experience text,
  -- Locked (not learner-editable) when the learner arrived via an invite.
  employer_business_id uuid references public.businesses (id) on delete set null,
  employer_locked boolean not null default false,
  employer_name text,
  phone_country_code text,
  phone text,
  preferred_language text,
  timezone text,
  public_portfolio boolean not null default false,
  portfolio_slug text,
  updated_at timestamptz not null default now()
);
create unique index learner_profiles_portfolio_slug_key
  on public.learner_profiles (lower(portfolio_slug)) where portfolio_slug is not null;
create index learner_profiles_employer_idx on public.learner_profiles (employer_business_id);
create trigger learner_profiles_set_updated_at before update on public.learner_profiles
  for each row execute function public.set_updated_at();

create table public.learner_skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  skill text not null,
  unique (user_id, skill)
);

-- NOTE: `visible_on_portfolio` is an addition — the Learner Sign-Up profile
-- builder has a per-certification "Show on portfolio" checkbox.
create table public.learner_certifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  name text not null,
  file_url text,
  visible_on_portfolio boolean not null default true,
  created_at timestamptz not null default now()
);
create index learner_certifications_user_id_idx on public.learner_certifications (user_id);

-- NOTE: addition — the Notifications tab of the gear settings modal.
create table public.business_notification_prefs (
  business_id uuid not null references public.businesses (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  notify_course_complete boolean not null default true,
  notify_signups boolean not null default true,
  notify_product_updates boolean not null default false,
  primary key (business_id, user_id)
);

-- ============================================================================
-- Courses
-- ============================================================================

-- NOTE: `what_you_will_learn` is an addition that resolves known issue #5 — the
-- course landing page's "What you'll learn" had no editable source.
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  title text not null,
  thumbnail_url text,
  description text,
  tagline text,
  what_you_will_learn text[] not null default '{}',
  visibility public.course_visibility not null default 'private',
  share_token text not null default encode(gen_random_bytes(24), 'hex'),
  quiz_navigation_default public.quiz_navigation not null default 'allow_back',
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index courses_share_token_key on public.courses (share_token);
create index courses_business_id_idx on public.courses (business_id);
create index courses_visibility_idx on public.courses (visibility) where visibility = 'public';
create trigger courses_set_updated_at before update on public.courses
  for each row execute function public.set_updated_at();

create table public.course_tags (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  tag text not null,
  unique (course_id, tag)
);

-- "order" is a reserved word in SQL, so the column is named `position`.
create table public.course_blocks (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  type public.block_type not null,
  position int not null,
  title text,
  content_ref jsonb not null default '{}'::jsonb,
  quiz_navigation_override public.quiz_navigation_override not null default 'inherit',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index course_blocks_course_id_position_idx on public.course_blocks (course_id, position);
create trigger course_blocks_set_updated_at before update on public.course_blocks
  for each row execute function public.set_updated_at();

create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  block_id uuid not null unique references public.course_blocks (id) on delete cascade,
  title text,
  passing_score int not null default 80 check (passing_score between 0 and 100),
  scope public.quiz_scope not null default 'preceding_block',
  scope_block_ids uuid[] not null default '{}',
  reveal_answers boolean not null default false,
  retry_max int check (retry_max is null or retry_max >= 1),
  retry_cooldown_hours int check (retry_cooldown_hours is null or retry_cooldown_hours >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint quizzes_scope_block_ids_matches_scope check (
    (scope = 'specific_blocks' and array_length(scope_block_ids, 1) >= 1)
    or (scope <> 'specific_blocks' and coalesce(array_length(scope_block_ids, 1), 0) = 0)
  )
);
create trigger quizzes_set_updated_at before update on public.quizzes
  for each row execute function public.set_updated_at();

create table public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes (id) on delete cascade,
  position int not null default 0,
  question_text text not null,
  options jsonb not null,
  correct_option int not null,
  explanation text,
  created_at timestamptz not null default now(),
  constraint quiz_questions_options_is_array check (jsonb_typeof(options) = 'array'),
  constraint quiz_questions_at_least_two_options check (jsonb_array_length(options) >= 2),
  constraint quiz_questions_correct_option_in_range
    check (correct_option >= 0 and correct_option < jsonb_array_length(options))
);
create index quiz_questions_quiz_id_position_idx on public.quiz_questions (quiz_id, position);

-- ============================================================================
-- Enrollment & progress
-- ============================================================================

create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  learner_id uuid not null references public.users (id) on delete cascade,
  business_id uuid references public.businesses (id) on delete set null,
  status public.enrollment_status not null default 'in_progress',
  enrolled_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (course_id, learner_id),
  constraint enrollments_completed_at_matches_status
    check ((status = 'completed') = (completed_at is not null))
);
create index enrollments_learner_id_idx on public.enrollments (learner_id);
create index enrollments_business_id_idx on public.enrollments (business_id);

create table public.block_progress (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments (id) on delete cascade,
  block_id uuid not null references public.course_blocks (id) on delete cascade,
  status public.block_progress_status not null default 'locked',
  completed_at timestamptz,
  unique (enrollment_id, block_id)
);
create index block_progress_enrollment_id_idx on public.block_progress (enrollment_id);

create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes (id) on delete cascade,
  learner_id uuid not null references public.users (id) on delete cascade,
  score int not null check (score between 0 and 100),
  passed boolean not null,
  attempted_at timestamptz not null default now()
);
create index quiz_attempts_quiz_learner_idx on public.quiz_attempts (quiz_id, learner_id);

create table public.certificates (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null unique references public.enrollments (id) on delete cascade,
  -- Public, shareable identifier used by the no-login verification page.
  certificate_id text not null unique default upper(encode(gen_random_bytes(9), 'hex')),
  issued_at timestamptz not null default now(),
  visible_on_portfolio boolean not null default true
);

-- ============================================================================
-- Quiz retries <-> navigation dependency rule
--
-- retry_max / retry_cooldown_hours may only be non-null when the quiz's
-- EFFECTIVE navigation setting is 'allow_back'. Effective navigation is the
-- block's quiz_navigation_override, or the course's quiz_navigation_default
-- when the override is 'inherit'.
--
-- The rule spans three tables, so a CHECK constraint cannot express it. It is
-- enforced by three triggers so it cannot be circumvented from either
-- direction: writing retries onto a locked quiz, OR flipping navigation to
-- locked while retries are already set.
-- ============================================================================

create or replace function public.effective_quiz_navigation(p_block_id uuid)
returns public.quiz_navigation
language sql
stable
security definer
set search_path = public
as $fn$
  select case
           when b.quiz_navigation_override = 'inherit'::public.quiz_navigation_override
             then c.quiz_navigation_default
           else b.quiz_navigation_override::text::public.quiz_navigation
         end
  from public.course_blocks b
  join public.courses c on c.id = b.course_id
  where b.id = p_block_id;
$fn$;

comment on function public.effective_quiz_navigation(uuid) is
  'Resolves a quiz block navigation setting: the block override, or the course default when the override is inherit.';

-- Direction 1: writing a quiz row.
create or replace function public.enforce_quiz_retry_rule()
returns trigger
language plpgsql
security definer
set search_path = public
as $fn$
declare
  v_nav public.quiz_navigation;
begin
  if new.retry_max is null and new.retry_cooldown_hours is null then
    return new;
  end if;

  v_nav := public.effective_quiz_navigation(new.block_id);

  if v_nav is distinct from 'allow_back'::public.quiz_navigation then
    raise exception
      'retry_max and retry_cooldown_hours must be NULL when the effective navigation is %; retries require allow_back (block %)',
      coalesce(v_nav::text, 'unresolved'), new.block_id
      using errcode = 'check_violation';
  end if;

  return new;
end $fn$;

create trigger quizzes_enforce_retry_rule
  before insert or update of block_id, retry_max, retry_cooldown_hours on public.quizzes
  for each row execute function public.enforce_quiz_retry_rule();

-- Direction 2: flipping a block's override.
create or replace function public.enforce_block_navigation_retry_rule()
returns trigger
language plpgsql
security definer
set search_path = public
as $fn$
declare
  v_nav public.quiz_navigation;
begin
  if new.quiz_navigation_override = old.quiz_navigation_override then
    return new;
  end if;

  v_nav := case
             when new.quiz_navigation_override = 'inherit'::public.quiz_navigation_override
               then (select quiz_navigation_default from public.courses where id = new.course_id)
             else new.quiz_navigation_override::text::public.quiz_navigation
           end;

  if v_nav is distinct from 'allow_back'::public.quiz_navigation
     and exists (
       select 1 from public.quizzes q
       where q.block_id = new.id
         and (q.retry_max is not null or q.retry_cooldown_hours is not null)
     )
  then
    raise exception
      'cannot set navigation to % on block % — its quiz still has retries configured; clear retry_max and retry_cooldown_hours first',
      v_nav, new.id
      using errcode = 'check_violation';
  end if;

  return new;
end $fn$;

create trigger course_blocks_enforce_navigation_retry_rule
  before update of quiz_navigation_override on public.course_blocks
  for each row execute function public.enforce_block_navigation_retry_rule();

-- Direction 3: flipping the course default, which changes every inheriting block.
create or replace function public.enforce_course_navigation_retry_rule()
returns trigger
language plpgsql
security definer
set search_path = public
as $fn$
declare
  v_offending uuid;
begin
  if new.quiz_navigation_default = old.quiz_navigation_default
     or new.quiz_navigation_default = 'allow_back'::public.quiz_navigation then
    return new;
  end if;

  select b.id into v_offending
  from public.course_blocks b
  join public.quizzes q on q.block_id = b.id
  where b.course_id = new.id
    and b.quiz_navigation_override = 'inherit'::public.quiz_navigation_override
    and (q.retry_max is not null or q.retry_cooldown_hours is not null)
  limit 1;

  if v_offending is not null then
    raise exception
      'cannot set course % default navigation to % — block % inherits it and still has quiz retries configured',
      new.id, new.quiz_navigation_default, v_offending
      using errcode = 'check_violation';
  end if;

  return new;
end $fn$;

create trigger courses_enforce_navigation_retry_rule
  before update of quiz_navigation_default on public.courses
  for each row execute function public.enforce_course_navigation_retry_rule();

-- ============================================================================
-- Auth wiring — mirror auth.users into public.users and bootstrap the
-- account's owned rows. Businesses are auto-activated (no manual approval).
-- ============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $fn$
declare
  v_user_type public.user_type;
  v_full_name text;
  v_org_name text;
  v_position text;
  v_business_id uuid;
begin
  v_user_type := coalesce(
    nullif(new.raw_user_meta_data->>'user_type', '')::public.user_type,
    'learner'::public.user_type
  );
  v_full_name := nullif(trim(new.raw_user_meta_data->>'full_name'), '');

  insert into public.users (id, email, full_name, user_type, email_verified)
  values (new.id, new.email, v_full_name, v_user_type, new.email_confirmed_at is not null)
  on conflict (id) do nothing;

  if v_user_type = 'business_owner' then
    v_org_name := nullif(trim(new.raw_user_meta_data->>'org_name'), '');
    v_position := nullif(trim(new.raw_user_meta_data->>'position'), '');

    insert into public.businesses (owner_id, name, position_of_owner)
    values (new.id, coalesce(v_org_name, 'Untitled organization'), v_position)
    returning id into v_business_id;

    insert into public.business_members (business_id, user_id, role, status, joined_at)
    values (v_business_id, new.id, 'admin', 'active', now());

    insert into public.business_notification_prefs (business_id, user_id)
    values (v_business_id, new.id);

    insert into public.member_profiles (user_id, job_title)
    values (new.id, v_position)
    on conflict (user_id) do nothing;

  elsif v_user_type = 'company_member' then
    insert into public.member_profiles (user_id) values (new.id)
    on conflict (user_id) do nothing;

  else
    insert into public.learner_profiles (user_id, date_of_birth)
    values (new.id, nullif(new.raw_user_meta_data->>'date_of_birth', '')::date)
    on conflict (user_id) do nothing;
  end if;

  return new;
end $fn$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep public.users.email / email_verified in step with auth.users.
create or replace function public.handle_auth_user_updated()
returns trigger
language plpgsql
security definer
set search_path = public
as $fn$
begin
  update public.users
  set email = new.email,
      email_verified = new.email_confirmed_at is not null
  where id = new.id;
  return new;
end $fn$;

create trigger on_auth_user_updated
  after update of email, email_confirmed_at on auth.users
  for each row execute function public.handle_auth_user_updated();

-- When an invited member finishes signing up, bind the pending invite to them.
create or replace function public.claim_pending_invites()
returns trigger
language plpgsql
security definer
set search_path = public
as $fn$
begin
  update public.business_members
  set user_id = new.id,
      status = 'active',
      joined_at = coalesce(joined_at, now()),
      invited_email = null
  where user_id is null
    and lower(invited_email) = lower(new.email);
  return new;
end $fn$;

create trigger users_claim_pending_invites
  after insert on public.users
  for each row execute function public.claim_pending_invites();
