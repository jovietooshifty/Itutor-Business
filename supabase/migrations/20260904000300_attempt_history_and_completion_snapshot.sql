-- ============================================================================
-- Two records that were being derived when they needed to be stored.
--
-- 1. quiz_attempts could be COUNTED but not read as a history: no attempt
--    number, no start, no submit time. An admin looking at a learner could see
--    "latest score 60%" and nothing about how they got there.
--
-- 2. enrollments recorded THAT someone finished but not WHAT they finished.
--    completionPct was done/total against the live block count, so adding a
--    block to a course silently dropped every past graduate below 100% — even
--    though block_progress rows are only created at enrolment, so those
--    learners were never given the new block in the first place.
-- ============================================================================

-- ── 1. Attempt history ──────────────────────────────────────────────────────

alter table public.quiz_attempts
  add column attempt_number int,
  add column started_at timestamptz,
  add column submitted_at timestamptz;

comment on column public.quiz_attempts.attempt_number is
  'Which attempt this was for this (quiz, learner), from 1. Assigned by trigger — never sent by the client, which cannot be trusted to count its own tries.';
comment on column public.quiz_attempts.started_at is
  'When the learner opened the quiz. Null for attempts recorded before this column existed.';
comment on column public.quiz_attempts.submitted_at is
  'When they submitted. Distinct from attempted_at only in that it is explicit; attempted_at stays the ordering key for compatibility.';

-- Existing rows, in the order they happened. `id` breaks ties so the numbering
-- is deterministic when two attempts share a timestamp.
with numbered as (
  select
    id,
    row_number() over (
      partition by quiz_id, learner_id order by attempted_at, id
    ) as n
  from public.quiz_attempts
)
update public.quiz_attempts a
set attempt_number = numbered.n,
    submitted_at = a.attempted_at
from numbered
where numbered.id = a.id;

/*
 * SECURITY DEFINER because the count has to see every attempt on the quiz by
 * this learner, and a learner's own RLS view is not the authority on how many
 * tries they have had — that is the whole point of the number.
 */
create function app_private.set_quiz_attempt_number()
returns trigger
language plpgsql
security definer
set search_path = ''
as $fn$
begin
  if new.attempt_number is null then
    select coalesce(max(a.attempt_number), 0) + 1
      into new.attempt_number
    from public.quiz_attempts a
    where a.quiz_id = new.quiz_id
      and a.learner_id = new.learner_id;
  end if;

  new.submitted_at := coalesce(new.submitted_at, new.attempted_at, now());
  return new;
end $fn$;

create trigger quiz_attempts_set_attempt_number
  before insert on public.quiz_attempts
  for each row execute function app_private.set_quiz_attempt_number();

create index quiz_attempts_learner_idx
  on public.quiz_attempts (learner_id, quiz_id, attempt_number);

-- ── 2. Completion is measured against what they were actually given ─────────

alter table public.enrollments add column completed_block_total int;

comment on column public.enrollments.completed_block_total is
  'How many blocks the course had when this enrolment completed. Completion is a share of THIS, not of the live block count — a course that grows afterwards does not un-finish the people who finished it.';

/*
 * The exact historical number, not a guess: block_progress rows are created at
 * enrolment, one per block that existed then, and an enrolment only reaches
 * 'completed' once every one of them is done. So the row count IS the block
 * count at completion.
 */
update public.enrollments e
set completed_block_total = (
  select count(*) from public.block_progress p where p.enrollment_id = e.id
)
where e.status = 'completed'
  and e.completed_block_total is null;

create function app_private.snapshot_completed_block_total()
returns trigger
language plpgsql
security definer
set search_path = ''
as $fn$
begin
  -- Only on the transition into 'completed', and only once: re-running must
  -- not overwrite a snapshot with a later, larger block count.
  if new.status = 'completed' and new.completed_block_total is null then
    select count(*) into new.completed_block_total
    from public.block_progress p
    where p.enrollment_id = new.id;
  end if;

  return new;
end $fn$;

create trigger enrollments_snapshot_block_total
  before insert or update of status on public.enrollments
  for each row execute function app_private.snapshot_completed_block_total();
