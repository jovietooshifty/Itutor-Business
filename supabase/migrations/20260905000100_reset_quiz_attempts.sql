-- ============================================================================
-- Letting an administrator give a learner their attempts back.
--
-- A learner who has used every attempt is stuck: submitQuiz counts the rows in
-- quiz_attempts and refuses once that reaches retry_max, and nothing could
-- change that short of editing the table by hand.
--
-- The obvious implementation — delete the attempts — is the wrong one. Those
-- rows are the record an admin reads to decide whether a reset is warranted at
-- all (60, then 55, then 40 is a different conversation from a single 40), and
-- a feature whose first act is to destroy the evidence for using it is a bad
-- trade. Attempts are marked superseded instead: they stop counting against
-- the limit and stay on the learner's record.
-- ============================================================================

alter table public.quiz_attempts add column superseded_at timestamptz;

comment on column public.quiz_attempts.superseded_at is
  'Set when an administrator reset this learner''s attempts on this quiz. A superseded attempt no longer counts towards retry_max and is not the learner''s current score, but stays visible in their history.';

-- Every count of "attempts used" filters on this, so it is the whole index.
create index quiz_attempts_live_idx
  on public.quiz_attempts (quiz_id, learner_id)
  where superseded_at is null;

/*
 * Admin/Operator of the business that owns the quiz may reset. Expressed as a
 * policy rather than handled with the service role because that is where the
 * rest of this schema puts authorization — see the matrix at the top of
 * 20260901000200_rls.sql. Auditors are excluded: can_edit_business_content is
 * false for them, as it is everywhere else they cannot write.
 *
 * Note this is UPDATE only. Nothing may delete an attempt.
 */
create policy quiz_attempts_update_editor on public.quiz_attempts
  for update to authenticated
  using (app_private.can_edit_business_content(app_private.quiz_business_id(quiz_id)))
  with check (app_private.can_edit_business_content(app_private.quiz_business_id(quiz_id)));
