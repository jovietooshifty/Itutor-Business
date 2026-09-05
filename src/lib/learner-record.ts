import { createClient } from '@/lib/supabase/server'
import { loadBusinessLearners, type LearnerRow } from '@/lib/learners'
import { bytesFromSignedUrl, materialView, type MaterialView } from '@/lib/material-view'
import type { IdDocumentType } from '@/lib/identification'

/** Where the private resume/certification files live. */
const PRIVATE_BUCKET = 'certifications'
/** Long enough to read a resume without leaving a durable public URL behind. */
const SIGNED_URL_SECONDS = 60 * 30

export type LearnerRecord = {
  learnerId: string
  name: string
  email: string
  avatarUrl: string | null
  jobTitle: string | null
  employerName: string | null
  /** null when the learner never answered. */
  employed: boolean | null
  yearsExperience: string | null
  /** Country code and number already joined for display. */
  phone: string | null
  bio: string | null
  skills: string[]
  /** Optional and ungated — no verification, no bearing on enrolment. */
  certifications: { id: string; name: string; fileUrl: string | null }[]
  /**
   * The learner's identification, already resolved to how it should be shown.
   * Null when they have not provided one — which also means they cannot have
   * enrolled, so it should not happen for anyone on this page.
   */
  identification: { type: IdDocumentType | null; view: MaterialView | null } | null
  /** This learner's enrolments in the caller's courses. */
  enrolments: LearnerRow[]
}

/**
 * Everything an admin should see when they open a learner.
 *
 * The old page selected bio, job_title, employed, years_experience,
 * phone_country_code and phone, then rendered two of the six. Everything
 * queried is now surfaced, plus employer_name and avatar_url, which were on
 * the table and never asked for.
 *
 * RLS is the boundary: can_read_learner() is true only for someone enrolled in
 * one of the caller's courses (or who lists them as employer), so a learner
 * outside that comes back as null rather than as a permission error.
 */
export async function loadLearnerRecord(
  learnerId: string,
  businessId: string
): Promise<LearnerRecord | null> {
  const supabase = await createClient()

  const [{ data: learner }, { data: profile }, { data: skills }, { data: certifications }, rows] =
    await Promise.all([
      supabase.from('users').select('id, full_name, email').eq('id', learnerId).maybeSingle(),
      supabase
        .from('learner_profiles')
        // prettier-ignore
        .select('avatar_url, bio, job_title, employed, years_experience, employer_name, phone_country_code, phone, id_document_url, id_document_type')
        .eq('user_id', learnerId)
        .maybeSingle(),
      supabase.from('learner_skills').select('skill').eq('user_id', learnerId),
      supabase
        .from('learner_certifications')
        .select('id, name, file_url')
        .eq('user_id', learnerId)
        .order('created_at'),
      loadBusinessLearners(businessId),
    ])

  if (!learner) return null

  /* The identification lives in a private bucket and is served through a
     short-lived signed URL. This is the most sensitive thing the product
     stores — a photographed ID card — so it is never a public object URL, and
     the link expires. */
  let identification: LearnerRecord['identification'] = null
  if (profile?.id_document_url) {
    const path = profile.id_document_url
    const { data: signed } = await supabase.storage
      .from(PRIVATE_BUCKET)
      .createSignedUrl(path, SIGNED_URL_SECONDS)

    identification = {
      type: profile.id_document_type ?? null,
      view: signed?.signedUrl
        ? await materialView({
            path,
            fileName: path.split('/').pop() ?? 'Identification',
            url: signed.signedUrl,
            loadBytes: () => bytesFromSignedUrl(signed.signedUrl),
          })
        : null,
    }
  }

  const phone = [profile?.phone_country_code, profile?.phone]
    .filter((part) => Boolean(part?.trim()))
    .join(' ')
    .trim()

  return {
    learnerId: learner.id,
    name: learner.full_name || learner.email,
    email: learner.email,
    avatarUrl: profile?.avatar_url ?? null,
    jobTitle: profile?.job_title ?? null,
    employerName: profile?.employer_name ?? null,
    employed: profile?.employed ?? null,
    yearsExperience: profile?.years_experience ?? null,
    phone: phone || null,
    bio: profile?.bio ?? null,
    skills: (skills ?? []).map((s) => s.skill),
    certifications: (certifications ?? []).map((c) => ({
      id: c.id,
      name: c.name,
      fileUrl: c.file_url,
    })),
    identification,
    enrolments: rows.filter((row) => row.learnerId === learnerId),
  }
}
