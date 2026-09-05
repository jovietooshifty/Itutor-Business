-- ============================================================================
-- A form of identification, in place of a resume.
--
-- The resume asked learners to make a case for themselves. What a business
-- actually needs before putting someone on a jobsite is proof they are who
-- they say they are — and it is a far smaller ask of a contractor filling this
-- in on a phone: photograph a card you already carry, rather than compose a
-- work history.
--
-- resume_url and resume_data are left in place rather than dropped. Nothing
-- reads or writes them any more, and keeping them means this change loses
-- nothing if the decision is revisited. They can go in a later migration once
-- it is clear they are not wanted.
-- ============================================================================

create type public.id_document_type as enum ('national_id', 'drivers_permit', 'passport');

comment on type public.id_document_type is
  'Which document was provided: a national ID card, a driver''s permit, or a passport.';

alter table public.learner_profiles
  add column id_document_url text,
  add column id_document_type public.id_document_type;

comment on column public.learner_profiles.id_document_url is
  'Storage path (not a public URL) of the identification document, in the private `certifications` bucket under learner/{user_id}/. Served to admins through a short-lived signed URL.';

/*
 * The bucket already accepts PDFs and the three web image formats, and its
 * policies already key on learner/{user_id}/ — the learner writes and reads
 * their own, business staff read only for a learner they can already see. An
 * ID is photographed far more often than it is scanned, so images matter more
 * here than they did for resumes; HEIC is added because that is what an iPhone
 * produces by default.
 */
update storage.buckets
set allowed_mime_types = array[
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/heic',
  'image/heif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]
where id = 'certifications';
