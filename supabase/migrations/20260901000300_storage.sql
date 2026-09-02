-- ============================================================================
-- iTutor Business — Storage buckets and their access policies
--
-- Path conventions (the first path segment is the owning entity's id, which
-- is what every policy below keys off):
--   business-assets/{business_id}/logo-*.ext | stamp-*.ext | cover-*.ext
--   avatars/{user_id}/avatar-*.ext
--   certifications/business/{business_id}/*  (private)
--   certifications/learner/{user_id}/*       (private)
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('business-assets', 'business-assets', true, 5242880,
   array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']),
  ('avatars', 'avatars', true, 2097152,
   array['image/png', 'image/jpeg', 'image/webp']),
  ('certifications', 'certifications', false, 10485760,
   array['image/png', 'image/jpeg', 'image/webp', 'application/pdf'])
on conflict (id) do nothing;

-- ── business-assets ─────────────────────────────────────────────────────────
-- Public read (logos and stamps render on marketplace cards and certificates).
-- Writes are restricted to Admins of the business named in the first segment.
create policy "business assets are publicly readable"
  on storage.objects for select
  using (bucket_id = 'business-assets');

create policy "admins write their own business assets"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'business-assets'
    and public.is_business_admin(((storage.foldername(name))[1])::uuid)
  );

create policy "admins update their own business assets"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'business-assets'
    and public.is_business_admin(((storage.foldername(name))[1])::uuid)
  );

create policy "admins delete their own business assets"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'business-assets'
    and public.is_business_admin(((storage.foldername(name))[1])::uuid)
  );

-- ── avatars ─────────────────────────────────────────────────────────────────
create policy "avatars are publicly readable"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "users write their own avatar"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "users update their own avatar"
  on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "users delete their own avatar"
  on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- ── certifications (private) ────────────────────────────────────────────────
-- Business certs: readable by any member, writable by Admins.
create policy "members read their business certifications"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'certifications'
    and (storage.foldername(name))[1] = 'business'
    and public.is_business_member(((storage.foldername(name))[2])::uuid)
  );

create policy "admins write their business certifications"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'certifications'
    and (storage.foldername(name))[1] = 'business'
    and public.is_business_admin(((storage.foldername(name))[2])::uuid)
  );

create policy "admins delete their business certifications"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'certifications'
    and (storage.foldername(name))[1] = 'business'
    and public.is_business_admin(((storage.foldername(name))[2])::uuid)
  );

-- Learner certs: the learner owns them; business staff may read them for a
-- learner they can already see (enrolled in their course, or their employee).
create policy "learners read their own certifications"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'certifications'
    and (storage.foldername(name))[1] = 'learner'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

create policy "business staff read visible learners certifications"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'certifications'
    and (storage.foldername(name))[1] = 'learner'
    and public.can_read_learner(((storage.foldername(name))[2])::uuid)
  );

create policy "learners write their own certifications"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'certifications'
    and (storage.foldername(name))[1] = 'learner'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

create policy "learners delete their own certifications"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'certifications'
    and (storage.foldername(name))[1] = 'learner'
    and (storage.foldername(name))[2] = auth.uid()::text
  );
