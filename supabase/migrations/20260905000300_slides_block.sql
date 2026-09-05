-- ============================================================================
-- A slide deck as a block type.
--
-- Courses were video, text or quiz. A deck is how most workplace training
-- already exists — the safety briefing someone built in PowerPoint years ago —
-- and forcing it through the text block meant either retyping it or attaching
-- it as a document that downloads.
--
-- On format: a browser has no PowerPoint viewer, and converting .pptx to
-- anything renderable needs LibreOffice, which a serverless function does not
-- have. PDF is what actually shows in the page, and every deck tool exports it
-- in one step. So both are accepted — a PDF renders inline, a .pptx is read
-- for its text (so quizzes still work) and offered as a download — and the
-- builder says which is which rather than letting an author find out from a
-- learner.
-- ============================================================================

alter type public.block_type add value if not exists 'slides';

comment on type public.block_type is
  'What a course block holds. `slides` is a deck: a PDF renders in the page, a .pptx is text-extracted for quiz generation and downloaded to view.';

/*
 * The deck formats, added to what course-material already accepts. .ppt (the
 * pre-2007 binary) is deliberately absent: it cannot be parsed by the same
 * means as .pptx, so accepting it would only produce an upload that silently
 * yields no text.
 */
update storage.buckets
set allowed_mime_types = (
  select array_agg(distinct m)
  from unnest(
    allowed_mime_types || array[
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ]
  ) as m
)
where id = 'course-material';
