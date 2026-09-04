-- One-off cleanup for the duplicate zero-block drafts.
--
-- These were not created on entry to the builder — /courses/new renders a form
-- against no row at all. They came from `createCourse` running on every submit
-- of that form: going Back to /courses/new and pressing Continue again made a
-- second course with the same title. The form now replaces that URL in history
-- and reuses the id it just made, so no further orphans accumulate; this clears
-- the ones already in the table.
--
-- A draft with zero blocks is the whole signal. It cannot be published (see
-- publishCourse), cannot be enrolled in, and shows a learner nothing. The
-- title, description and thumbnail these rows carry are not evidence of work
-- worth keeping — they are step 1 of a flow that was abandoned at step 2,
-- which is exactly the failure mode.
--
-- The cutoff is a FIXED timestamp, not a rolling interval. This is a one-off
-- for rows that already exist: a rolling window would keep firing on future
-- drafts and could delete a course someone is part way through building, and
-- the application fix means there are no future rows for it to catch.

delete from public.courses c
where c.status = 'draft'
  and c.created_at < '2026-09-04T00:00:00Z'
  and not exists (select 1 from public.course_blocks b where b.course_id = c.id)
  and not exists (select 1 from public.enrollments e where e.course_id = c.id);

-- NOTE: any thumbnail these courses uploaded stays in the business-assets
-- bucket, unreferenced. Storage objects are not covered by the foreign-key
-- cascade, and deleting them from SQL is not worth a migration for a handful
-- of files.
