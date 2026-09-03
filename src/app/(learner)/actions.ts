'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { slugify } from '@/lib/constants'
import type { ActionResult } from '@/app/(auth)/actions'

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
  publicPortfolio: boolean
}

export async function saveLearnerProfile(input: LearnerProfileInput): Promise<ActionResult> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'You are not signed in.' }

  if (!input.fullName.trim()) {
    return {
      ok: false,
      error: 'Your name is required.',
      fieldErrors: { fullName: 'Enter your full name' },
    }
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

  const slug =
    existing?.portfolio_slug ??
    `${slugify(input.fullName) || 'learner'}-${user.id.slice(0, 6)}`

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
    public_portfolio: input.publicPortfolio,
    portfolio_slug: slug,
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

/* ── Enrolment ─────────────────────────────────────────────────────────── */

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
  const { data: existing } = await supabase
    .from('enrollments')
    .select('id')
    .eq('course_id', courseId)
    .eq('learner_id', user.id)
    .maybeSingle()
  if (existing) return { ok: true, data: { id: existing.id } }

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

  const { data } = await supabase
    .from('enrollments')
    .select('id, status')
    .eq('course_id', courseId)
    .eq('learner_id', user.id)
    .maybeSingle()

  return data ? { ...data, userId: user.id } : null
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
  }

  revalidatePath(`/learn/${courseId}`)
  return { ok: true, data: { nextBlockId, courseComplete } }
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
  answers: Record<string, number>
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
  const { data: priorAttempts } = await supabase
    .from('quiz_attempts')
    .select('id, passed, attempted_at')
    .eq('quiz_id', quiz.id)
    .eq('learner_id', enrolment.userId)
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

  const { error: attemptError } = await supabase
    .from('quiz_attempts')
    .insert({ quiz_id: quiz.id, learner_id: enrolment.userId, score, passed })
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
