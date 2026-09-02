-- ============================================================================
-- iTutor Business — Row Level Security
--
-- PERMISSION MATRIX (business_members.role)
--
--   Capability                                        Admin  Operator  Auditor
--   ------------------------------------------------  -----  --------  -------
--   View company profile / team / settings              Y       Y         Y
--   Edit company profile, locations, certs, languages   Y       -         -
--   Edit org notification prefs (own row)               Y       Y         Y
--   Invite / remove members, change roles               Y       -         -
--   View courses, blocks, quizzes, questions            Y       Y         Y
--   Create / edit courses, blocks, quizzes, questions   Y       Y         -
--   Delete courses / blocks / quizzes / questions       Y       -         -
--   Enroll / unenroll learners                          Y       Y         -
--   View enrollments, progress, attempts, certificates  Y       Y         Y
--   Issue certificates                                  Y       Y         -
--   View enrolled learners' profiles (read-only)        Y       Y         Y
--
-- NOTE: the handoff doc refers to "the matrix in the original spec", which is
-- not present in this repo. The matrix above is the inferred reading —
-- Admin = full control, Operator = build and run training, Auditor =
-- read-only — with destructive deletes reserved to Admin. Confirm against the
-- original spec and adjust the role arrays below if it differs.
-- ============================================================================

-- ── Helper functions ────────────────────────────────────────────────────────
-- These are SECURITY DEFINER so that policies on business_members can call
-- them without recursing into business_members' own RLS.

create or replace function public.current_user_type()
returns public.user_type
language sql
stable
security definer
set search_path = public
as $fn$
  select user_type from public.users where id = auth.uid();
$fn$;

create or replace function public.business_role(p_business_id uuid)
returns public.member_role
language sql
stable
security definer
set search_path = public
as $fn$
  select m.role
  from public.business_members m
  where m.business_id = p_business_id
    and m.user_id = auth.uid()
    and m.status = 'active'
  limit 1;
$fn$;

create or replace function public.is_business_member(p_business_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $fn$
  select public.business_role(p_business_id) is not null;
$fn$;

create or replace function public.has_business_role(
  p_business_id uuid,
  p_roles public.member_role[]
)
returns boolean
language sql
stable
security definer
set search_path = public
as $fn$
  select public.business_role(p_business_id) = any (p_roles);
$fn$;

-- Can the current user administer this business? (Admin only.)
create or replace function public.is_business_admin(p_business_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $fn$
  select public.business_role(p_business_id) = 'admin'::public.member_role;
$fn$;

-- Can the current user author training content? (Admin or Operator.)
create or replace function public.can_edit_business_content(p_business_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $fn$
  select public.business_role(p_business_id)
         = any (array['admin', 'operator']::public.member_role[]);
$fn$;

-- Which business does a course belong to?
create or replace function public.course_business_id(p_course_id uuid)
returns uuid
language sql
stable
security definer
set search_path = public
as $fn$
  select business_id from public.courses where id = p_course_id;
$fn$;

create or replace function public.block_business_id(p_block_id uuid)
returns uuid
language sql
stable
security definer
set search_path = public
as $fn$
  select c.business_id
  from public.course_blocks b
  join public.courses c on c.id = b.course_id
  where b.id = p_block_id;
$fn$;

create or replace function public.quiz_business_id(p_quiz_id uuid)
returns uuid
language sql
stable
security definer
set search_path = public
as $fn$
  select c.business_id
  from public.quizzes q
  join public.course_blocks b on b.id = q.block_id
  join public.courses c on c.id = b.course_id
  where q.id = p_quiz_id;
$fn$;

-- Is the course readable by the current user? Members of the owning business
-- (any role), enrolled learners, and anyone at all when it is public.
create or replace function public.can_read_course(p_course_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $fn$
  select exists (
    select 1
    from public.courses c
    where c.id = p_course_id
      and (
        c.visibility = 'public'::public.course_visibility
        or public.is_business_member(c.business_id)
        or exists (
          select 1 from public.enrollments e
          where e.course_id = c.id and e.learner_id = auth.uid()
        )
      )
  );
$fn$;

-- Is this learner visible to the current user's business staff? True when the
-- learner is enrolled in one of their courses, or lists them as employer.
create or replace function public.can_read_learner(p_learner_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $fn$
  select exists (
    select 1
    from public.enrollments e
    join public.courses c on c.id = e.course_id
    where e.learner_id = p_learner_id
      and public.is_business_member(c.business_id)
  )
  or exists (
    select 1
    from public.learner_profiles lp
    where lp.user_id = p_learner_id
      and lp.employer_business_id is not null
      and public.is_business_member(lp.employer_business_id)
  );
$fn$;

-- ── Enable RLS everywhere ───────────────────────────────────────────────────
alter table public.users                       enable row level security;
alter table public.businesses                  enable row level security;
alter table public.business_locations          enable row level security;
alter table public.business_certifications     enable row level security;
alter table public.business_training_languages enable row level security;
alter table public.business_members            enable row level security;
alter table public.business_notification_prefs enable row level security;
alter table public.member_profiles             enable row level security;
alter table public.learner_profiles            enable row level security;
alter table public.learner_skills              enable row level security;
alter table public.learner_certifications      enable row level security;
alter table public.courses                     enable row level security;
alter table public.course_tags                 enable row level security;
alter table public.course_blocks               enable row level security;
alter table public.quizzes                     enable row level security;
alter table public.quiz_questions              enable row level security;
alter table public.enrollments                 enable row level security;
alter table public.block_progress              enable row level security;
alter table public.quiz_attempts               enable row level security;
alter table public.certificates                enable row level security;

-- ============================================================================
-- users
-- ============================================================================
create policy users_select_self on public.users
  for select using (id = auth.uid());

-- Team lists: you can see the users you share a business with.
create policy users_select_shared_business on public.users
  for select using (
    exists (
      select 1 from public.business_members m
      where m.user_id = public.users.id
        and public.is_business_member(m.business_id)
    )
  );

-- Admin/Operator/Auditor read-only view of an enrolled learner.
create policy users_select_visible_learner on public.users
  for select using (public.can_read_learner(public.users.id));

create policy users_update_self on public.users
  for update using (id = auth.uid()) with check (id = auth.uid());

-- ============================================================================
-- businesses
-- ============================================================================
create policy businesses_select_member on public.businesses
  for select using (public.is_business_member(id));

-- Marketplace: a business that lists public courses is publicly readable so
-- its name, logo and tagline can render on the course card.
create policy businesses_select_public_provider on public.businesses
  for select using (
    exists (
      select 1 from public.courses c
      where c.business_id = public.businesses.id
        and c.visibility = 'public'::public.course_visibility
    )
  );

-- A learner can see the business that employs them.
create policy businesses_select_employer on public.businesses
  for select using (
    exists (
      select 1 from public.learner_profiles lp
      where lp.user_id = auth.uid() and lp.employer_business_id = public.businesses.id
    )
  );

-- Businesses are normally created by the handle_new_user trigger. This covers
-- the owner creating an additional business directly.
create policy businesses_insert_owner on public.businesses
  for insert to authenticated with check (owner_id = auth.uid());

create policy businesses_update_admin on public.businesses
  for update using (public.is_business_admin(id))
  with check (public.is_business_admin(id));

create policy businesses_delete_owner on public.businesses
  for delete using (owner_id = auth.uid() and public.is_business_admin(id));

-- ============================================================================
-- business_locations / business_certifications / business_training_languages
-- Read: any member. Write: Admin only.
-- ============================================================================
create policy business_locations_select_member on public.business_locations
  for select using (public.is_business_member(business_id));
create policy business_locations_write_admin on public.business_locations
  for all using (public.is_business_admin(business_id))
  with check (public.is_business_admin(business_id));

create policy business_certifications_select_member on public.business_certifications
  for select using (public.is_business_member(business_id));
create policy business_certifications_write_admin on public.business_certifications
  for all using (public.is_business_admin(business_id))
  with check (public.is_business_admin(business_id));

create policy business_languages_select_member on public.business_training_languages
  for select using (public.is_business_member(business_id));
create policy business_languages_write_admin on public.business_training_languages
  for all using (public.is_business_admin(business_id))
  with check (public.is_business_admin(business_id));

-- ============================================================================
-- business_members
-- Read: any member of the same business (plus your own invite row).
-- Write: Admin only.
-- ============================================================================
create policy business_members_select_member on public.business_members
  for select using (public.is_business_member(business_id) or user_id = auth.uid());

create policy business_members_insert_admin on public.business_members
  for insert to authenticated with check (public.is_business_admin(business_id));

create policy business_members_update_admin on public.business_members
  for update using (public.is_business_admin(business_id))
  with check (public.is_business_admin(business_id));

create policy business_members_delete_admin on public.business_members
  for delete using (public.is_business_admin(business_id));

-- ============================================================================
-- business_notification_prefs — each member owns their own row.
-- ============================================================================
create policy notification_prefs_own on public.business_notification_prefs
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ============================================================================
-- member_profiles
-- Read: self, and anyone you share a business with. Write: self only —
-- an Admin cannot edit a colleague's personal profile.
-- ============================================================================
create policy member_profiles_select_self on public.member_profiles
  for select using (user_id = auth.uid());

create policy member_profiles_select_shared_business on public.member_profiles
  for select using (
    exists (
      select 1 from public.business_members m
      where m.user_id = public.member_profiles.user_id
        and public.is_business_member(m.business_id)
    )
  );

create policy member_profiles_insert_self on public.member_profiles
  for insert to authenticated with check (user_id = auth.uid());
create policy member_profiles_update_self on public.member_profiles
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ============================================================================
-- learner_profiles
-- Read: self, business staff for enrolled/employed learners, and the public
-- when the learner has switched their portfolio on. Write: self only.
-- ============================================================================
create policy learner_profiles_select_self on public.learner_profiles
  for select using (user_id = auth.uid());

create policy learner_profiles_select_business_staff on public.learner_profiles
  for select using (public.can_read_learner(user_id));

create policy learner_profiles_select_public_portfolio on public.learner_profiles
  for select using (public_portfolio = true);

create policy learner_profiles_insert_self on public.learner_profiles
  for insert to authenticated with check (user_id = auth.uid());
create policy learner_profiles_update_self on public.learner_profiles
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ============================================================================
-- learner_skills / learner_certifications — same visibility shape.
-- ============================================================================
create policy learner_skills_select_self on public.learner_skills
  for select using (user_id = auth.uid());
create policy learner_skills_select_business_staff on public.learner_skills
  for select using (public.can_read_learner(user_id));
create policy learner_skills_select_public_portfolio on public.learner_skills
  for select using (
    exists (
      select 1 from public.learner_profiles lp
      where lp.user_id = public.learner_skills.user_id and lp.public_portfolio = true
    )
  );
create policy learner_skills_write_self on public.learner_skills
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy learner_certifications_select_self on public.learner_certifications
  for select using (user_id = auth.uid());
create policy learner_certifications_select_business_staff on public.learner_certifications
  for select using (public.can_read_learner(user_id));
-- Public portfolio honours BOTH switches: the profile toggle and the per-item one.
create policy learner_certifications_select_public_portfolio on public.learner_certifications
  for select using (
    visible_on_portfolio = true
    and exists (
      select 1 from public.learner_profiles lp
      where lp.user_id = public.learner_certifications.user_id and lp.public_portfolio = true
    )
  );
create policy learner_certifications_write_self on public.learner_certifications
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ============================================================================
-- courses
-- Read: members (any role), enrolled learners, and everyone for public courses.
-- Private courses are NEVER listed — they are reachable only through their
-- share link, which is resolved by public.course_by_share_token() below.
-- Write: Admin + Operator. Delete: Admin only.
-- ============================================================================
create policy courses_select_public on public.courses
  for select using (visibility = 'public'::public.course_visibility);

create policy courses_select_member on public.courses
  for select using (public.is_business_member(business_id));

create policy courses_select_enrolled on public.courses
  for select using (
    exists (
      select 1 from public.enrollments e
      where e.course_id = public.courses.id and e.learner_id = auth.uid()
    )
  );

create policy courses_insert_editor on public.courses
  for insert to authenticated
  with check (public.can_edit_business_content(business_id) and created_by = auth.uid());

create policy courses_update_editor on public.courses
  for update using (public.can_edit_business_content(business_id))
  with check (public.can_edit_business_content(business_id));

create policy courses_delete_admin on public.courses
  for delete using (public.is_business_admin(business_id));

-- ============================================================================
-- course_tags / course_blocks / quizzes / quiz_questions
-- Visibility follows the parent course; writes follow the parent business.
-- ============================================================================
create policy course_tags_select on public.course_tags
  for select using (public.can_read_course(course_id));
create policy course_tags_write_editor on public.course_tags
  for all using (public.can_edit_business_content(public.course_business_id(course_id)))
  with check (public.can_edit_business_content(public.course_business_id(course_id)));

create policy course_blocks_select on public.course_blocks
  for select using (public.can_read_course(course_id));
create policy course_blocks_insert_editor on public.course_blocks
  for insert to authenticated
  with check (public.can_edit_business_content(public.course_business_id(course_id)));
create policy course_blocks_update_editor on public.course_blocks
  for update using (public.can_edit_business_content(public.course_business_id(course_id)))
  with check (public.can_edit_business_content(public.course_business_id(course_id)));
create policy course_blocks_delete_admin on public.course_blocks
  for delete using (public.is_business_admin(public.course_business_id(course_id)));

create policy quizzes_select on public.quizzes
  for select using (
    exists (
      select 1 from public.course_blocks b
      where b.id = public.quizzes.block_id and public.can_read_course(b.course_id)
    )
  );
create policy quizzes_insert_editor on public.quizzes
  for insert to authenticated
  with check (public.can_edit_business_content(public.block_business_id(block_id)));
create policy quizzes_update_editor on public.quizzes
  for update using (public.can_edit_business_content(public.block_business_id(block_id)))
  with check (public.can_edit_business_content(public.block_business_id(block_id)));
create policy quizzes_delete_admin on public.quizzes
  for delete using (public.is_business_admin(public.block_business_id(block_id)));

-- Learners can read a question's text and options but must never read
-- correct_option / explanation directly. The app serves questions to learners
-- through public.quiz_questions_for_learner() (defined below), which strips
-- the answer; the table itself is staff-only.
create policy quiz_questions_select_staff on public.quiz_questions
  for select using (public.is_business_member(public.quiz_business_id(quiz_id)));
create policy quiz_questions_insert_editor on public.quiz_questions
  for insert to authenticated
  with check (public.can_edit_business_content(public.quiz_business_id(quiz_id)));
create policy quiz_questions_update_editor on public.quiz_questions
  for update using (public.can_edit_business_content(public.quiz_business_id(quiz_id)))
  with check (public.can_edit_business_content(public.quiz_business_id(quiz_id)));
create policy quiz_questions_delete_admin on public.quiz_questions
  for delete using (public.is_business_admin(public.quiz_business_id(quiz_id)));

-- ============================================================================
-- enrollments
-- Read: the learner, and any member of the course's business.
-- Write: the learner (self-enrol in a readable course) or Admin/Operator.
-- Delete (unenrol): Admin/Operator.
-- ============================================================================
create policy enrollments_select_learner on public.enrollments
  for select using (learner_id = auth.uid());

create policy enrollments_select_business on public.enrollments
  for select using (public.is_business_member(public.course_business_id(course_id)));

create policy enrollments_insert_self on public.enrollments
  for insert to authenticated
  with check (learner_id = auth.uid() and public.can_read_course(course_id));

create policy enrollments_insert_editor on public.enrollments
  for insert to authenticated
  with check (public.can_edit_business_content(public.course_business_id(course_id)));

create policy enrollments_update_learner on public.enrollments
  for update using (learner_id = auth.uid()) with check (learner_id = auth.uid());

create policy enrollments_update_editor on public.enrollments
  for update using (public.can_edit_business_content(public.course_business_id(course_id)))
  with check (public.can_edit_business_content(public.course_business_id(course_id)));

create policy enrollments_delete_editor on public.enrollments
  for delete using (public.can_edit_business_content(public.course_business_id(course_id)));

-- ============================================================================
-- block_progress — owned by the learner, readable by business staff.
-- ============================================================================
create policy block_progress_select_learner on public.block_progress
  for select using (
    exists (
      select 1 from public.enrollments e
      where e.id = public.block_progress.enrollment_id and e.learner_id = auth.uid()
    )
  );
create policy block_progress_select_business on public.block_progress
  for select using (
    exists (
      select 1 from public.enrollments e
      where e.id = public.block_progress.enrollment_id
        and public.is_business_member(public.course_business_id(e.course_id))
    )
  );
create policy block_progress_write_learner on public.block_progress
  for all using (
    exists (
      select 1 from public.enrollments e
      where e.id = public.block_progress.enrollment_id and e.learner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.enrollments e
      where e.id = public.block_progress.enrollment_id and e.learner_id = auth.uid()
    )
  );

-- ============================================================================
-- quiz_attempts — the learner writes their own attempts; staff read them.
-- Attempts are append-only: no update or delete policy exists for anyone.
-- ============================================================================
create policy quiz_attempts_select_learner on public.quiz_attempts
  for select using (learner_id = auth.uid());
create policy quiz_attempts_select_business on public.quiz_attempts
  for select using (public.is_business_member(public.quiz_business_id(quiz_id)));
create policy quiz_attempts_insert_learner on public.quiz_attempts
  for insert to authenticated with check (learner_id = auth.uid());

-- ============================================================================
-- certificates
-- Read: the learner, business staff, and the public when the learner's
-- portfolio and the certificate itself are both visible.
-- Insert: Admin/Operator (course completion is confirmed server-side).
-- Update: the learner may only flip visible_on_portfolio.
-- ============================================================================
create policy certificates_select_learner on public.certificates
  for select using (
    exists (
      select 1 from public.enrollments e
      where e.id = public.certificates.enrollment_id and e.learner_id = auth.uid()
    )
  );

create policy certificates_select_business on public.certificates
  for select using (
    exists (
      select 1 from public.enrollments e
      where e.id = public.certificates.enrollment_id
        and public.is_business_member(public.course_business_id(e.course_id))
    )
  );

create policy certificates_select_public_portfolio on public.certificates
  for select using (
    visible_on_portfolio = true
    and exists (
      select 1
      from public.enrollments e
      join public.learner_profiles lp on lp.user_id = e.learner_id
      where e.id = public.certificates.enrollment_id and lp.public_portfolio = true
    )
  );

create policy certificates_insert_editor on public.certificates
  for insert to authenticated
  with check (
    exists (
      select 1 from public.enrollments e
      where e.id = public.certificates.enrollment_id
        and public.can_edit_business_content(public.course_business_id(e.course_id))
    )
  );

create policy certificates_update_learner_visibility on public.certificates
  for update using (
    exists (
      select 1 from public.enrollments e
      where e.id = public.certificates.enrollment_id and e.learner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.enrollments e
      where e.id = public.certificates.enrollment_id and e.learner_id = auth.uid()
    )
  );

-- ============================================================================
-- Definer-scoped RPCs for the three cases RLS alone cannot express
-- ============================================================================

-- Private courses are joinable ONLY via their share link, never listed. This
-- resolves a token to the single matching course without granting any
-- table-wide read of private rows.
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
  limit 1;
$fn$;

revoke all on function public.course_by_share_token(text) from public;
grant execute on function public.course_by_share_token(text) to anon, authenticated;

-- Public, no-login certificate verification (flow 9).
create or replace function public.verify_certificate(p_certificate_id text)
returns table (
  certificate_id text,
  issued_at timestamptz,
  learner_name text,
  course_title text,
  business_name text,
  business_stamp_url text
)
language sql
stable
security definer
set search_path = public
as $fn$
  select cert.certificate_id,
         cert.issued_at,
         u.full_name,
         c.title,
         b.name,
         b.stamp_url
  from public.certificates cert
  join public.enrollments e on e.id = cert.enrollment_id
  join public.users u on u.id = e.learner_id
  join public.courses c on c.id = e.course_id
  join public.businesses b on b.id = c.business_id
  where cert.certificate_id = upper(trim(p_certificate_id))
  limit 1;
$fn$;

revoke all on function public.verify_certificate(text) from public;
grant execute on function public.verify_certificate(text) to anon, authenticated;

-- Questions as a learner may see them: no correct_option, no explanation.
-- Only serves quizzes belonging to a course the caller can actually read.
create or replace function public.quiz_questions_for_learner(p_quiz_id uuid)
returns table (
  id uuid,
  -- quoted: `position` is a reserved word in a RETURNS TABLE column list
  "position" int,
  question_text text,
  options jsonb
)
language sql
stable
security definer
set search_path = public
as $fn$
  select q.id, q.position, q.question_text, q.options
  from public.quiz_questions q
  join public.quizzes z on z.id = q.quiz_id
  join public.course_blocks b on b.id = z.block_id
  where q.quiz_id = p_quiz_id
    and public.can_read_course(b.course_id)
  order by q.position, q.created_at;
$fn$;

revoke all on function public.quiz_questions_for_learner(uuid) from public;
grant execute on function public.quiz_questions_for_learner(uuid) to authenticated;
