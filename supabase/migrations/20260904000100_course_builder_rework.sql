-- ============================================================================
-- Course builder rework — sequence-first, one page per block.
--
-- Three things change in the data model:
--
--   1. The 'website' block type goes away. Links cannot be fetched reliably
--      enough to feed quiz generation, so authored material is uploads (and
--      typed rich text) only. The same call removes the 'link' method from
--      video and the 'url' mode from text.
--
--   2. Blocks now carry the text a quiz can actually be generated from
--      (`source_text`) and the state of getting it there (`source_status`).
--      Rich text is ready the moment it is typed; an uploaded document is
--      extracted on save; a video waits on transcription, which is the one
--      case the builder cannot finish by itself.
--
--   3. The builder remembers where you were (`courses.build_stage`,
--      `build_block_id`), so an abandoned draft resumes rather than restarts.
--
-- Plus a `course-material` bucket, because "upload only" needs somewhere to
-- put the file.
-- ============================================================================

-- ── 1. Retire the website block type ────────────────────────────────────────
-- Existing website blocks become text blocks that keep their URL in the body.
-- Pre-launch there is little or none of this, but dropping rows to simplify a
-- migration is not a trade this makes.
update public.course_blocks
set
  type = 'text'::public.block_type,
  content_ref = jsonb_build_object(
    'mode', 'rich',
    'body', case
              when coalesce(content_ref ->> 'url', '') = '' then ''
              else 'Reference: ' || (content_ref ->> 'url')
            end,
    'path', null::text,
    'fileName', null::text,
    'pointers', '',
    'summary', ''
  )
where type = 'website'::public.block_type;

-- Postgres cannot drop a value from an enum in place, so the type is swapped.
-- Nothing else in the schema depends on block_type — no function signature, no
-- index, no column default — so the rewrite is confined to this one column.
alter type public.block_type rename to block_type__pre_rework;
create type public.block_type as enum ('video', 'text', 'quiz');

alter table public.course_blocks
  alter column "type" type public.block_type
  using "type"::text::public.block_type;

drop type public.block_type__pre_rework;

comment on type public.block_type is
  'Authored material is uploaded or typed. External links went away with the website block type — they could not be read reliably enough to generate questions from.';

-- ── 2. content_ref shapes ───────────────────────────────────────────────────
-- Video: `method` is gone (upload is the only path). `url` survives as a
-- read-only legacy field so a previously-linked video still plays rather than
-- vanishing; the builder no longer writes it.
update public.course_blocks
set content_ref = jsonb_build_object(
  'path',       content_ref -> 'path',
  'fileName',   content_ref -> 'fileName',
  'url',        content_ref -> 'url',
  'captions',   coalesce(content_ref -> 'captions', 'true'::jsonb),
  'guidelines', coalesce(content_ref -> 'guidelines', '""'::jsonb),
  'notes',      coalesce(content_ref -> 'notes', '""'::jsonb),
  'transcript', coalesce(content_ref -> 'transcript', '""'::jsonb)
)
where type = 'video'::public.block_type;

-- Text: mode 'url' folds into 'rich' with the link appended to the body — the
-- same treatment website blocks just got, for the same reason.
update public.course_blocks
set content_ref = jsonb_build_object(
  'mode', case when content_ref ->> 'mode' = 'upload' then 'upload' else 'rich' end,
  'body', case
            when content_ref ->> 'mode' = 'url' and coalesce(content_ref ->> 'url', '') <> ''
              then btrim(coalesce(content_ref ->> 'body', '') || E'\n\nReference: ' || (content_ref ->> 'url'))
            else coalesce(content_ref ->> 'body', '')
          end,
  'path',     content_ref -> 'path',
  'fileName', content_ref -> 'fileName',
  'pointers', coalesce(content_ref ->> 'pointers', ''),
  'summary',  coalesce(content_ref ->> 'summary', '')
)
where type = 'text'::public.block_type;

-- ── 3. Source text for quiz generation ──────────────────────────────────────
create type public.block_source_status as enum ('empty', 'ready', 'pending', 'failed');

comment on type public.block_source_status is
  'How far a block is from having text a quiz can be generated from. pending is the honest state for an uploaded video: the builder cannot transcribe, so the quiz page offers to come back to it.';

alter table public.course_blocks
  add column if not exists source_text text,
  add column if not exists source_status public.block_source_status not null default 'empty',
  add column if not exists source_error text;

comment on column public.course_blocks.source_text is
  'Extracted prose for quiz generation: the body of a rich-text block, the text pulled out of an uploaded document, or a video transcript.';
comment on column public.course_blocks.source_error is
  'What to tell the author about reading this material: why extraction failed, or why what came out is too thin to build a quiz on. Shown next to the block rather than swallowed.';

-- Rich text needs no extraction pass — the body IS the source.
update public.course_blocks
set source_text = content_ref ->> 'body',
    source_status = 'ready'::public.block_source_status
where type = 'text'::public.block_type
  and content_ref ->> 'mode' = 'rich'
  and coalesce(content_ref ->> 'body', '') <> '';

-- ── 4. Question count: a number, or the model's judgement ───────────────────
-- NULL means "no specific number" — let coverage of the material decide. That
-- is the default because a 90-second video and a 40-page manual should not
-- both get five questions just because five is a tidy number.
alter table public.quizzes
  add column if not exists generation_count int;

alter table public.quizzes
  drop constraint if exists quizzes_generation_count_range;
alter table public.quizzes
  add constraint quizzes_generation_count_range
  check (generation_count is null or generation_count between 1 and 20);

comment on column public.quizzes.generation_count is
  'How many questions to generate. NULL = let the model decide from the material, capped at 20.';

-- ── 5. Resuming an abandoned draft ──────────────────────────────────────────
create type public.course_build_stage as enum (
  'basics', 'sequence', 'walkthrough', 'details', 'publish'
);

alter table public.courses
  add column if not exists build_stage public.course_build_stage not null default 'basics',
  add column if not exists build_block_id uuid
    references public.course_blocks (id) on delete set null;

-- Courses that already exist did not record a cursor, and defaulting all of
-- them to 'basics' would send "Resume" back to a form their author finished
-- weeks ago. Having blocks is the one thing that can be read off the data, so
-- that is what decides.
update public.courses c
set build_stage = 'sequence'::public.course_build_stage
where exists (select 1 from public.course_blocks b where b.course_id = c.id);

comment on column public.courses.build_stage is
  'Where the builder was last left. Drives "Resume building" on a draft course''s overview.';
comment on column public.courses.build_block_id is
  'Which walkthrough page was open, when build_stage is walkthrough. Nulled if that block is deleted, which drops the resume back to the first page.';

-- ── 6. Somewhere to put the uploads ─────────────────────────────────────────
-- Private, unlike business-assets: a private course's material is the product,
-- and an unguessable public URL is not an access control. Reads go through
-- signed URLs minted for someone who has already passed can_read_course.
--
-- Path convention: course-material/{course_id}/{block_id}/{filename}
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'course-material', 'course-material', false, 524288000,
  array[
    'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-m4v',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain', 'text/markdown'
  ]
)
on conflict (id) do nothing;

-- Readers: anyone who can already read the course the material belongs to.
create policy "course material follows course visibility"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'course-material'
    and app_private.can_read_course(((storage.foldername(name))[1])::uuid)
  );

-- Writers: Admins and Operators of the owning business, same as every other
-- course write (see the permission matrix in 20260901000200_rls.sql).
create policy "editors write their course material"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'course-material'
    and app_private.can_edit_business_content(
      app_private.course_business_id(((storage.foldername(name))[1])::uuid)
    )
  );

create policy "editors update their course material"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'course-material'
    and app_private.can_edit_business_content(
      app_private.course_business_id(((storage.foldername(name))[1])::uuid)
    )
  );

create policy "editors delete their course material"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'course-material'
    and app_private.can_edit_business_content(
      app_private.course_business_id(((storage.foldername(name))[1])::uuid)
    )
  );
