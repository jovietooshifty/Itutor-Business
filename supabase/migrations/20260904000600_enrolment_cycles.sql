-- ============================================================================
-- Retaking a course, without rewriting the record of having passed it.
--
-- A learner who completed a course before two blocks were added shows as a
-- "past student": complete, and staying complete. The admin's next move is to
-- offer them the new material — and that has to create a NEW enrolment rather
-- than reopening the old one, or the act of retaking destroys the evidence
-- that they finished the first time, along with the block count snapshot the
-- percentage is measured against and the certificate's provenance.
--
-- `unique (course_id, learner_id)` made that impossible: one row per person
-- per course, forever. The key gains a cycle number.
-- ============================================================================

alter table public.enrollments add column cycle int not null default 1;

comment on column public.enrollments.cycle is
  'Which time round this is for this (course, learner). 1 for an original enrolment; an admin offering a retake creates the next. The learner-facing app always reads the highest cycle; the admin''s learner record shows every one.';

alter table public.enrollments drop constraint enrollments_course_id_learner_id_key;

alter table public.enrollments
  add constraint enrollments_course_learner_cycle_key unique (course_id, learner_id, cycle);

-- The learner app resolves "my enrolment" as the highest cycle for the pair,
-- which is this index's whole job.
create index enrollments_course_learner_cycle_idx
  on public.enrollments (course_id, learner_id, cycle desc);

/*
 * Assigns the next cycle when one is not given.
 *
 * SECURITY DEFINER for the same reason quiz_attempts' numbering is: the count
 * has to see every cycle for the pair, and enrolments_insert_self restricts a
 * learner to their own rows — which is not the authority on how many times
 * they have been round.
 *
 * Only fires when `cycle` was left at its default of 1 AND an earlier cycle
 * already exists, so an ordinary first enrolment is untouched and an explicit
 * cycle is respected.
 */
create function app_private.set_enrollment_cycle()
returns trigger
language plpgsql
security definer
set search_path = ''
as $fn$
declare
  highest int;
begin
  select max(e.cycle) into highest
  from public.enrollments e
  where e.course_id = new.course_id
    and e.learner_id = new.learner_id
    and e.id <> new.id;

  if highest is not null and new.cycle <= highest then
    new.cycle := highest + 1;
  end if;

  return new;
end $fn$;

create trigger enrollments_set_cycle
  before insert on public.enrollments
  for each row execute function app_private.set_enrollment_cycle();
