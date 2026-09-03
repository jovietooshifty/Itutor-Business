-- ============================================================================
-- Close the publish gate that 20260903000100 left half open.
--
-- That migration added courses.status and required 'published' in
-- courses_select_public, but can_read_course() carries its OWN copy of the
-- "public means readable" rule, and every child table's read policy goes
-- through it — course_tags, course_blocks, quizzes, quiz_questions — as does
-- enrollments_insert_self. So a draft course's row was hidden while its
-- blocks and questions stayed world-readable, and it could still be enrolled
-- in. Both halves of the rule have to agree.
--
-- Replaced in place (create or replace) so the function keeps its OID and the
-- policies referencing it keep working. It lives in app_private since
-- 20260901000400 moved the policy helpers there.
-- ============================================================================

create or replace function app_private.can_read_course(p_course_id uuid)
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
        (
          c.visibility = 'public'::public.course_visibility
          and c.status = 'published'::public.course_status
        )
        or app_private.is_business_member(c.business_id)
        -- An existing enrolment survives the course being unpublished: the
        -- learner is already part way through it.
        or exists (
          select 1 from public.enrollments e
          where e.course_id = c.id and e.learner_id = auth.uid()
        )
      )
  );
$fn$;
