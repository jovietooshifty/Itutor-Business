-- ============================================================================
-- Course builder (handoff flow 4) — fields the setup screen writes that the
-- original schema had no home for.
--
-- "Course Builder.dc.html" screen 1 collects an estimated duration and a pair
-- of course-level quiz retry defaults. Duration is also what the marketplace
-- course cards render as `durationLabel`.
-- ============================================================================

-- Free text, not a number: the design's own placeholder is "e.g. 2 hrs", and
-- the marketplace cards show strings like "45 min" and "1.5 hrs". Storing the
-- label avoids inventing a unit and formatting it back differently.
alter table public.courses
  add column if not exists duration_label text;

-- Seed values copied onto each new quiz block. The per-quiz columns on
-- public.quizzes stay authoritative — these only decide what a fresh quiz
-- block starts with, which is what "unless overridden per quiz" means.
alter table public.courses
  add column if not exists quiz_retry_max_default int,
  add column if not exists quiz_retry_cooldown_hours_default int;

alter table public.courses
  drop constraint if exists courses_quiz_retry_max_default_positive;
alter table public.courses
  add constraint courses_quiz_retry_max_default_positive
  check (quiz_retry_max_default is null or quiz_retry_max_default >= 1);

alter table public.courses
  drop constraint if exists courses_quiz_retry_cooldown_default_non_negative;
alter table public.courses
  add constraint courses_quiz_retry_cooldown_default_non_negative
  check (quiz_retry_cooldown_hours_default is null or quiz_retry_cooldown_hours_default >= 0);

-- The retries/navigation dependency rule, applied to the defaults.
--
-- On public.quizzes this rule needs three triggers because effective
-- navigation spans course -> block -> quiz. Here both sides of the rule live
-- in the same row, so a plain CHECK covers it — including the case of flipping
-- the course default to lock_forward while retry defaults are still set.
alter table public.courses
  drop constraint if exists courses_retry_defaults_require_allow_back;
alter table public.courses
  add constraint courses_retry_defaults_require_allow_back
  check (
    (quiz_retry_max_default is null and quiz_retry_cooldown_hours_default is null)
    or quiz_navigation_default = 'allow_back'::public.quiz_navigation
  );

comment on column public.courses.duration_label is
  'Human-entered estimate shown on marketplace cards, e.g. "2 hrs". Not computed.';
comment on column public.courses.quiz_retry_max_default is
  'Seeds quizzes.retry_max on newly created quiz blocks. Requires quiz_navigation_default = allow_back.';
comment on column public.courses.quiz_retry_cooldown_hours_default is
  'Seeds quizzes.retry_cooldown_hours on newly created quiz blocks. Requires quiz_navigation_default = allow_back.';
