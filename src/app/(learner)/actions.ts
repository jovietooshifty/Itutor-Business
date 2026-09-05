'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  LEARNER_BIO_MAX_CHARS,
  LEARNER_BIO_MAX_WORDS,
  countWords,
} from '@/lib/constants'
import {
  ID_MAX_BYTES,
  isAcceptedIdFile,
  type IdDocumentType,
} from '@/lib/identification'
import { notifyCompletion, notifyEnrolment } from '@/lib/email/notify'
import type { ActionResult } from '@/app/(auth)/actions'

/** Private bucket; ID documents sit under learner/{user_id}/ like certifications. */
const ID_BUCKET = 'certifications'

export type LearnerCertificationInput = {
  name: string
  file_url: string | null
  visible_on_portfolio: boolean
}

export type LearnerProfileInput = {
  fullName: string
  dateOfBirth: string
  avatarUrl: string | null
  bio: string
  employed: boolean | null
  jobTitle: string
  yearsExperience: string
  employerName: string
  phoneCountryCode: string
  phone: string
  preferredLanguage: string
  timezone: string
  skills: string[]
  certifications: LearnerCertificationInput[]
  /** Storage path of the identification document. */
  idDocumentUrl: string | null
  idDocumentType: IdDocumentType | null
}

export async function saveLearnerProfile(input: LearnerProfileInput): Promise<ActionResult> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'You are not signed in.' }

  /* Mandatory, and enforced here rather than only in the form: a photo and a
     form of identification are what let a business know who it is putting on a
     jobsite, and the client is not where that gets protected. */
  const fieldErrors: Record<string, string> = {}

  if (!input.fullName.trim()) fieldErrors.fullName = 'Enter your full name'
  if (!input.avatarUrl) fieldErrors.avatarUrl = 'Add a profile photo'

  if (!input.idDocumentUrl) {
    fieldErrors.identification = 'Add a form of identification'
  } else if (!input.idDocumentType) {
    fieldErrors.identification = 'Say which document this is'
  }

  if (input.bio.length > LEARNER_BIO_MAX_CHARS) {
    fieldErrors.bio = `Keep your bio under ${LEARNER_BIO_MAX_CHARS} characters`
  } else if (countWords(input.bio) > LEARNER_BIO_MAX_WORDS) {
    fieldErrors.bio = `Keep your bio under ${LEARNER_BIO_MAX_WORDS} words`
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: 'Check the highlighted fields.', fieldErrors }
  }

  const { error: userError } = await supabase
    .from('users')
    .update({ full_name: input.fullName.trim() })
    .eq('id', user.id)
  if (userError) return { ok: false, error: userError.message }

  // Read the existing profile first: employer_business_id is locked when the
  // learner arrived through a business invite and must not be overwritten here.
  const { data: existing } = await supabase
    .from('learner_profiles')
    .select('employer_locked, employer_business_id, portfolio_slug')
    .eq('user_id', user.id)
    .maybeSingle()

  /* The slug is no longer derived from the name. With the public/private
     toggle gone, possession of the link IS the access control, and
     slugify(name) + 6 hex characters of a uuid is guessable by anyone who
     knows the name. The column now defaults to 9 random bytes — the same
     construction certificates.certificate_id uses — so this leaves it alone
     and lets the database generate it. See 20260904000400. */
  const { error: profileError } = await supabase.from('learner_profiles').upsert({
    user_id: user.id,
    date_of_birth: input.dateOfBirth || null,
    avatar_url: input.avatarUrl,
    bio: input.bio.trim() || null,
    employed: input.employed,
    job_title: input.employed ? input.jobTitle.trim() || null : null,
    years_experience: input.employed ? input.yearsExperience || null : null,
    employer_name: existing?.employer_locked
      ? undefined
      : input.employed
        ? input.employerName.trim() || null
        : null,
    phone_country_code: input.phoneCountryCode || null,
    phone: input.phone.trim() || null,
    preferred_language: input.preferredLanguage || null,
    timezone: input.timezone || null,
    id_document_url: input.idDocumentUrl,
    id_document_type: input.idDocumentType,
    /* Portfolios are reached by an unguessable link and nothing else, so there
       is no public/private state left to store. The column stays until it can
       be dropped; true is the only value the product has. */
    public_portfolio: true,
  })
  if (profileError) return { ok: false, error: profileError.message }

  await supabase.from('learner_skills').delete().eq('user_id', user.id)
  const skills = [...new Set(input.skills.map((s) => s.trim()).filter(Boolean))]
  if (skills.length) {
    const { error } = await supabase
      .from('learner_skills')
      .insert(skills.map((skill) => ({ user_id: user.id, skill })))
    if (error) return { ok: false, error: error.message }
  }

  await supabase.from('learner_certifications').delete().eq('user_id', user.id)
  const certs = input.certifications.filter((c) => c.name.trim())
  if (certs.length) {
    const { error } = await supabase.from('learner_certifications').insert(
      certs.map((c) => ({
        user_id: user.id,
        name: c.name.trim(),
        file_url: c.file_url,
        visible_on_portfolio: c.visible_on_portfolio,
      }))
    )
    if (error) return { ok: false, error: error.message }
  }

  revalidatePath('/marketplace')
  revalidatePath('/learner/signup/profile')
  return { ok: true }
}

/* ── Identification upload ─────────────────────────────────────────────── */

/**
 * Stores an identification document and returns its storage PATH, not a URL.
 *
 * The bucket is private, so there is no public URL to hand back; admins get a
 * short-lived signed one when they open the learner's record. This matters
 * more here than it did for resumes — a photographed ID card is the single
 * most sensitive thing this product stores, and a public object URL would make
 * it readable by anyone holding the link, with no login at all.
 */
export async function uploadIdentification(
  form: FormData
): Promise<ActionResult<{ path: string }>> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'You are not signed in.' }

  const file = form.get('file')
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: 'No file was received.' }
  }
  if (file.size > ID_MAX_BYTES) {
    return { ok: false, error: `Keep the file under ${ID_MAX_BYTES / 1024 / 1024}MB.` }
  }
  if (!isAcceptedIdFile(file)) {
    return { ok: false, error: 'Use a photo (PNG, JPEG, HEIC or WebP) or a PDF.' }
  }

  const extension = file.name.match(/\.(png|jpe?g|webp|heic|heif|pdf)$/i)?.[0].toLowerCase() ?? '.jpg'

  /* The path has to start `learner/{user_id}/` — every storage policy on this
     bucket keys off those two segments. The timestamp is what makes replacing
     a document a new object rather than a cache-busting problem. */
  const path = `learner/${user.id}/id-${Date.now()}${extension}`

  const { error } = await supabase.storage
    .from(ID_BUCKET)
    .upload(path, file, { contentType: file.type || undefined, upsert: true })
  if (error) return { ok: false, error: error.message }

  return { ok: true, data: { path } }
}

/* ── Enrolment ─────────────────────────────────────────────────────────── */

/**
 * What a learner must have on file before they can join a course: a photo, and
 * a form of identification. Together they answer the only question a business
 * has before putting someone on a jobsite — who is this.
 */
async function enrolmentBlockers(userId: string): Promise<string[]> {
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('learner_profiles')
    .select('avatar_url, id_document_url')
    .eq('user_id', userId)
    .maybeSingle()

  const missing: string[] = []
  if (!profile?.avatar_url) missing.push('a profile photo')
  if (!profile?.id_document_url) missing.push('a form of identification')
  return missing
}

/**
 * Enrols the signed-in learner and lays down the progress rows the player
 * reads. RLS (enrollments_insert_self) is what actually decides whether the
 * course is joinable — it goes through can_read_course, so a private course is
 * reachable only via its share link and an unpublished one not at all.
 *
 * Blocks start locked apart from the first: the sequence is the point of the
 * course, so the player unlocks the next one as each is completed.
 */
export async function enrolInCourse(courseId: string): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Sign in to enrol.' }

  // Already enrolled is a no-op, not an error — the button just becomes
  // "Continue" on the next render.
  const { data: existingRows } = await supabase
    .from('enrollments')
    .select('id')
    .eq('course_id', courseId)
    .eq('learner_id', user.id)
    .order('cycle', { ascending: false })
    .limit(1)
  const existing = existingRows?.[0]
  if (existing) return { ok: true, data: { id: existing.id } }

  // Checked after the already-enrolled short-circuit, so tightening the
  // requirements never locks someone out of a course they are already on.
  const missing = await enrolmentBlockers(user.id)
  if (missing.length > 0) {
    return {
      ok: false,
      error: `Add ${missing.join(' and ')} to your profile before joining a course.`,
    }
  }

  const { data: course } = await supabase
    .from('courses')
    .select('business_id')
    .eq('id', courseId)
    .maybeSingle()
  if (!course) return { ok: false, error: 'That course is not available.' }

  const { data: enrollment, error } = await supabase
    .from('enrollments')
    .insert({ course_id: courseId, learner_id: user.id, business_id: course.business_id })
    .select('id')
    .single()

  if (error || !enrollment) {
    return { ok: false, error: error?.message ?? 'Could not enrol in that course.' }
  }

  const { data: blocks } = await supabase
    .from('course_blocks')
    .select('id')
    .eq('course_id', courseId)
    .order('position')

  if (blocks?.length) {
    const { error: progressError } = await supabase.from('block_progress').insert(
      blocks.map((block, index) => ({
        enrollment_id: enrollment.id,
        block_id: block.id,
        status: index === 0 ? ('unlocked' as const) : ('locked' as const),
      }))
    )
    if (progressError) return { ok: false, error: progressError.message }
  }

  /* Awaited rather than fired and forgotten: a serverless function that has
     returned may be frozen mid-request, so a detached promise is not reliably
     delivered. notifyEnrolment never throws — see lib/email/notify. */
  await notifyEnrolment(courseId, user.id)

  revalidatePath('/marketplace')
  revalidatePath(`/learn/${courseId}`)
  return { ok: true, data: { id: enrollment.id } }
}

/* ── Course player ─────────────────────────────────────────────────────── */

/** The learner's enrolment for a course, or null when they are not in it. */
async function enrolmentFor(courseId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  /* The highest cycle, not the only one: an admin offering a retake creates a
     second enrolment for the same pair, and the course a learner is doing now
     is always the newest. See 20260904000600. */
  const { data } = await supabase
    .from('enrollments')
    .select('id, status')
    .eq('course_id', courseId)
    .eq('learner_id', user.id)
    .order('cycle', { ascending: false })
    .limit(1)

  const current = data?.[0]
  return current ? { ...current, userId: user.id } : null
}

/**
 * Marks a lesson finished and opens the next one. The sequence is the point of
 * a course, so unlocking is the only way forward — a learner cannot skip ahead
 * by editing a URL, because every later block is still 'locked'.
 *
 * Finishing the last block completes the enrolment. The CHECK constraint on
 * enrollments ties completed_at to the status, so both move together.
 */
export async function completeBlock(
  courseId: string,
  blockId: string
): Promise<ActionResult<{ nextBlockId: string | null; courseComplete: boolean }>> {
  const enrolment = await enrolmentFor(courseId)
  if (!enrolment) return { ok: false, error: 'You are not enrolled in this course.' }

  const supabase = await createClient()

  const { error } = await supabase
    .from('block_progress')
    .update({ status: 'completed', completed_at: new Date().toISOString() })
    .eq('enrollment_id', enrolment.id)
    .eq('block_id', blockId)
  if (error) return { ok: false, error: error.message }

  const { data: blocks } = await supabase
    .from('course_blocks')
    .select('id')
    .eq('course_id', courseId)
    .order('position')

  const ordered = (blocks ?? []).map((b) => b.id)
  const nextBlockId = ordered[ordered.indexOf(blockId) + 1] ?? null

  if (nextBlockId) {
    // Only ever opens a lock — a block already completed stays completed, so
    // revisiting an earlier lesson cannot reset progress.
    const { error: unlockError } = await supabase
      .from('block_progress')
      .update({ status: 'unlocked' })
      .eq('enrollment_id', enrolment.id)
      .eq('block_id', nextBlockId)
      .eq('status', 'locked')
    if (unlockError) return { ok: false, error: unlockError.message }
  }

  const { count: unfinished } = await supabase
    .from('block_progress')
    .select('id', { count: 'exact', head: true })
    .eq('enrollment_id', enrolment.id)
    .neq('status', 'completed')

  const courseComplete = !unfinished
  if (courseComplete && enrolment.status !== 'completed') {
    const { error: enrolError } = await supabase
      .from('enrollments')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', enrolment.id)
    if (enrolError) return { ok: false, error: enrolError.message }

    await issueCertificate(enrolment.id)
    // After the certificate exists, so the email cannot promise one that does not.
    await notifyCompletion(courseId, enrolment.userId)
  }

  revalidatePath(`/learn/${courseId}`)
  revalidatePath('/my-portfolio')
  return { ok: true, data: { nextBlockId, courseComplete } }
}

/**
 * Issues the certificate for a finished enrolment.
 *
 * certificates_insert_editor reserves inserts for Admin/Operator, on the
 * reasoning that "course completion is confirmed server-side" — the learner
 * finishing the course is not the one who gets to assert it. This IS that
 * server-side confirmation (completeBlock has just counted every block done),
 * so it writes with the service role rather than the learner's session.
 *
 * The unique constraint on enrollment_id makes a second call a no-op, which
 * matters because revisiting the last lesson runs this path again.
 */
async function issueCertificate(enrollmentId: string) {
  const admin = createAdminClient()

  const { data: existing } = await admin
    .from('certificates')
    .select('id')
    .eq('enrollment_id', enrollmentId)
    .maybeSingle()
  if (existing) return

  // certificate_id is generated by the column default — a public, shareable
  // identifier that is not the row's uuid.
  await admin.from('certificates').insert({ enrollment_id: enrollmentId })
}

export type QuizOutcome = {
  score: number
  passed: boolean
  /** Attempts used, including this one, and the cap. */
  attemptsUsed: number
  attemptsAllowed: number
  /** Set when they failed and have nothing left — the terminal state. */
  exhausted: boolean
  /** Per-question feedback, only when the quiz reveals answers. */
  review: { questionId: string; correctOption: number; explanation: string | null }[]
}

/**
 * Grades a quiz. This has to run server-side: quiz_questions is staff-only by
 * RLS and learners read it through quiz_questions_for_learner(), which strips
 * correct_option precisely so the answers never reach the browser. Grading
 * therefore goes through the service role.
 *
 * retry_max is the TOTAL attempts allowed (the builder labels it "Maximum
 * attempts"); null means no retries, i.e. a single attempt.
 */
export async function submitQuiz(
  courseId: string,
  blockId: string,
  answers: Record<string, number>,
  /**
   * When the learner opened the quiz, from the player. Recorded so the admin's
   * view can show time taken. Client-supplied and therefore advisory — it is
   * display only, and never used to decide anything.
   */
  startedAt?: string | null
): Promise<ActionResult<QuizOutcome>> {
  const enrolment = await enrolmentFor(courseId)
  if (!enrolment) return { ok: false, error: 'You are not enrolled in this course.' }

  const supabase = await createClient()
  const admin = createAdminClient()

  const { data: quiz } = await supabase
    .from('quizzes')
    .select('id, passing_score, reveal_answers, retry_max, retry_cooldown_hours')
    .eq('block_id', blockId)
    .maybeSingle()
  if (!quiz) return { ok: false, error: 'That quiz is not available.' }

  const { data: questions } = await admin
    .from('quiz_questions')
    .select('id, correct_option, explanation')
    .eq('quiz_id', quiz.id)
  if (!questions?.length) return { ok: false, error: 'This quiz has no questions yet.' }

  const attemptsAllowed = quiz.retry_max ?? 1
  /* Superseded attempts are excluded everywhere the limit is counted: an
     administrator resetting this learner gives the attempts back without
     erasing what they scored. See 20260905000100. */
  const { data: priorAttempts } = await supabase
    .from('quiz_attempts')
    .select('id, passed, attempted_at')
    .eq('quiz_id', quiz.id)
    .eq('learner_id', enrolment.userId)
    .is('superseded_at', null)
    .order('attempted_at', { ascending: false })

  const prior = priorAttempts ?? []
  if (prior.some((a) => a.passed)) {
    return { ok: false, error: 'You have already passed this quiz.' }
  }
  if (prior.length >= attemptsAllowed) {
    return {
      ok: false,
      error: 'You have used all your attempts. Contact your training administrator.',
    }
  }

  // The cooldown is measured from the last attempt, so it applies between
  // attempts rather than from when the quiz was first opened.
  const cooldownHours = quiz.retry_cooldown_hours
  if (cooldownHours && prior[0]) {
    const readyAt = new Date(prior[0].attempted_at).getTime() + cooldownHours * 3_600_000
    if (Date.now() < readyAt) {
      return {
        ok: false,
        error: `You can retry after ${new Date(readyAt).toLocaleString()}.`,
      }
    }
  }

  const correct = questions.filter((q) => answers[q.id] === q.correct_option).length
  const score = Math.round((correct / questions.length) * 100)
  const passed = score >= quiz.passing_score

  /* attempt_number is assigned by trigger rather than sent from here — a
     client cannot be trusted to count its own tries, and two submits racing
     would otherwise pick the same number. */
  const { error: attemptError } = await supabase.from('quiz_attempts').insert({
    quiz_id: quiz.id,
    learner_id: enrolment.userId,
    score,
    passed,
    started_at: startedAt ?? null,
    submitted_at: new Date().toISOString(),
  })
  if (attemptError) return { ok: false, error: attemptError.message }

  const attemptsUsed = prior.length + 1

  if (passed) {
    const result = await completeBlock(courseId, blockId)
    if (!result.ok) return result
  }

  revalidatePath(`/learn/${courseId}`)
  return {
    ok: true,
    data: {
      score,
      passed,
      attemptsUsed,
      attemptsAllowed,
      exhausted: !passed && attemptsUsed >= attemptsAllowed,
      review: quiz.reveal_answers
        ? questions.map((q) => ({
            questionId: q.id,
            correctOption: q.correct_option,
            explanation: q.explanation,
          }))
        : [],
    },
  }
}

/* ── Portfolio ─────────────────────────────────────────────────────────── */

/** Publishes or hides the learner's whole portfolio page. */
export async function setPortfolioVisibility(isPublic: boolean): Promise<ActionResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'You are not signed in.' }

  const { error } = await supabase
    .from('learner_profiles')
    .update({ public_portfolio: isPublic })
    .eq('user_id', user.id)

  if (error) return { ok: false, error: error.message }

  revalidatePath('/my-portfolio')
  return { ok: true }
}

/**
 * Shows or hides one certificate on the portfolio. Both flags matter: the
 * portfolio has to be public AND the certificate visible, which is exactly
 * what certificates_select_public_portfolio checks, so hiding either one takes
 * it off the public page.
 *
 * certificates_update_learner_visibility is what permits this — the learner
 * may flip this column on their own certificate and nothing else.
 */
export async function setCertificateVisibility(
  certificateId: string,
  visible: boolean
): Promise<ActionResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'You are not signed in.' }

  const { error, count } = await supabase
    .from('certificates')
    .update({ visible_on_portfolio: visible }, { count: 'exact' })
    .eq('certificate_id', certificateId.toUpperCase())

  if (error) return { ok: false, error: error.message }
  if (count === 0) return { ok: false, error: 'That certificate is not yours to change.' }

  revalidatePath('/my-portfolio')
  return { ok: true }
}
