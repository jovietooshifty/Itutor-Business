'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getBusinessContext } from '@/lib/business'
import {
  DEFAULT_COURSE_DETAILS,
  EMPTY_CONTENT,
  effectiveNavigation,
  retriesAllowed,
} from '@/lib/course'
import type {
  BlockType,
  CourseBasics,
  CourseDetails,
  QuizNavigationOverride,
  QuizScope,
} from '@/lib/course'
import type { Database } from '@/lib/types/database'
import type { ActionResult } from '@/app/(auth)/actions'

/** Step 1 — what the course is. */
export type CourseBasicsInput = CourseBasics

/** Step 3 — settings that need the material to exist first. */
export type CourseDetailsInput = CourseDetails

export type QuizConfigInput = {
  passingScore: number
  scope: QuizScope
  scopeBlockIds: string[]
  revealAnswers: boolean
  navigationOverride: QuizNavigationOverride
  retryMax: number | null
  retryCooldownHours: number | null
}

/**
 * Every write here goes through the caller's own Supabase session, so RLS is
 * the real authorization boundary (see the permission matrix at the top of
 * 20260901000200_rls.sql — Auditors cannot write, only Admins can delete).
 * These guards exist to turn a silent RLS no-op into a readable message.
 */
async function requireEditor(): Promise<
  { ok: true; businessId: string; userId: string } | { ok: false; error: string }
> {
  const context = await getBusinessContext()
  if (!context) return { ok: false, error: 'You are not signed in to a business account.' }
  if (context.role === 'auditor') {
    return { ok: false, error: 'Auditors have read-only access to courses.' }
  }
  return { ok: true, businessId: context.businessId, userId: context.userId }
}

/** Confirms the course belongs to the caller's business before touching it. */
async function ownedCourse(courseId: string, businessId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('courses')
    .select(
      'id, business_id, quiz_navigation_default, quiz_retry_max_default, quiz_retry_cooldown_hours_default'
    )
    .eq('id', courseId)
    .maybeSingle()

  if (!data || data.business_id !== businessId) return null
  return data
}

function validateBasics(input: CourseBasicsInput): Record<string, string> | null {
  const fieldErrors: Record<string, string> = {}

  if (!input.title.trim()) fieldErrors.title = 'Give the course a title.'
  if (input.title.trim().length > 200) fieldErrors.title = 'Keep the title under 200 characters.'

  return Object.keys(fieldErrors).length > 0 ? fieldErrors : null
}

function validateDetails(input: CourseDetailsInput): Record<string, string> | null {
  const fieldErrors: Record<string, string> = {}

  if (input.retryMaxDefault !== null && input.retryMaxDefault < 1) {
    fieldErrors.retryMaxDefault = 'Allow at least one attempt, or switch retries off.'
  }
  if (input.retryCooldownHoursDefault !== null && input.retryCooldownHoursDefault < 0) {
    fieldErrors.retryCooldownHoursDefault = 'A wait cannot be negative.'
  }

  // The retries/navigation rule, applied to the course-level defaults. The
  // database has the matching CHECK constraint; this is here so the user gets
  // a sentence rather than a constraint violation.
  if (
    !retriesAllowed(input.quizNavigationDefault) &&
    (input.retryMaxDefault !== null || input.retryCooldownHoursDefault !== null)
  ) {
    fieldErrors.retryMaxDefault =
      'Retries need "Allow going back". Switch navigation, or turn retries off.'
  }

  return Object.keys(fieldErrors).length > 0 ? fieldErrors : null
}

/* ── Course ────────────────────────────────────────────────────────────── */

/**
 * Step 1. The course is created from its basics alone — duration and quiz
 * defaults are step 3, and start at DEFAULT_COURSE_DETAILS until then.
 */
export async function createCourse(
  input: CourseBasicsInput
): Promise<ActionResult<{ id: string }>> {
  const auth = await requireEditor()
  if (!auth.ok) return { ok: false, error: auth.error }

  const fieldErrors = validateBasics(input)
  if (fieldErrors) return { ok: false, error: 'Check the highlighted fields.', fieldErrors }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('courses')
    .insert({
      business_id: auth.businessId,
      created_by: auth.userId,
      title: input.title.trim(),
      description: input.description.trim() || null,
      visibility: input.visibility,
      what_you_will_learn: input.whatYouWillLearn.map((s) => s.trim()).filter(Boolean),
      thumbnail_url: input.thumbnailUrl,
      duration_label: null,
      quiz_navigation_default: DEFAULT_COURSE_DETAILS.quizNavigationDefault,
      quiz_retry_max_default: DEFAULT_COURSE_DETAILS.retryMaxDefault,
      quiz_retry_cooldown_hours_default: DEFAULT_COURSE_DETAILS.retryCooldownHoursDefault,
    })
    .select('id')
    .single()

  if (error || !data) return { ok: false, error: error?.message ?? 'Could not create the course.' }

  const tagResult = await replaceTags(data.id, input.tags)
  if (!tagResult.ok) return tagResult

  revalidatePath('/courses')
  return { ok: true, data: { id: data.id } }
}

/** Step 1, revisited — what "Back" from the sequence lets you change. */
export async function updateCourseBasics(
  courseId: string,
  input: CourseBasicsInput
): Promise<ActionResult> {
  const auth = await requireEditor()
  if (!auth.ok) return { ok: false, error: auth.error }
  if (!(await ownedCourse(courseId, auth.businessId))) {
    return { ok: false, error: 'Course not found.' }
  }

  const fieldErrors = validateBasics(input)
  if (fieldErrors) return { ok: false, error: 'Check the highlighted fields.', fieldErrors }

  const supabase = await createClient()
  const { error } = await supabase
    .from('courses')
    .update({
      title: input.title.trim(),
      description: input.description.trim() || null,
      visibility: input.visibility,
      what_you_will_learn: input.whatYouWillLearn.map((s) => s.trim()).filter(Boolean),
      thumbnail_url: input.thumbnailUrl,
    })
    .eq('id', courseId)

  if (error) return { ok: false, error: error.message }

  const tagResult = await replaceTags(courseId, input.tags)
  if (!tagResult.ok) return tagResult

  revalidatePath(`/courses/${courseId}`)
  revalidatePath('/courses')
  return { ok: true }
}

/** Step 3 — duration and the course-wide quiz defaults. */
export async function updateCourseDetails(
  courseId: string,
  input: CourseDetailsInput
): Promise<ActionResult> {
  const auth = await requireEditor()
  if (!auth.ok) return { ok: false, error: auth.error }
  if (!(await ownedCourse(courseId, auth.businessId))) {
    return { ok: false, error: 'Course not found.' }
  }

  const fieldErrors = validateDetails(input)
  if (fieldErrors) return { ok: false, error: 'Check the highlighted fields.', fieldErrors }

  const supabase = await createClient()

  // Clearing the retry defaults BEFORE the navigation change keeps the update
  // legal in the order the database checks it: flipping navigation to
  // lock_forward while defaults are still set violates the CHECK constraint,
  // and the same flip trips the course-level trigger if any inheriting quiz
  // block still has retries of its own.
  if (!retriesAllowed(input.quizNavigationDefault)) {
    const { error: clearError } = await supabase
      .from('courses')
      .update({ quiz_retry_max_default: null, quiz_retry_cooldown_hours_default: null })
      .eq('id', courseId)
    if (clearError) return { ok: false, error: clearError.message }

    const cleared = await clearInheritedRetries(courseId)
    if (!cleared.ok) return cleared
  }

  const { error } = await supabase
    .from('courses')
    .update({
      duration_label: input.durationLabel.trim() || null,
      quiz_navigation_default: input.quizNavigationDefault,
      quiz_retry_max_default: input.retryMaxDefault,
      quiz_retry_cooldown_hours_default: input.retryCooldownHoursDefault,
    })
    .eq('id', courseId)

  if (error) return { ok: false, error: error.message }

  // There is no per-quiz override UI anymore, so every quiz block's retry
  // settings are meant to track the course default live. addBlock seeds a new
  // block from whatever the default is at creation time, but without this a
  // block created before this save would keep whatever (likely null) value it
  // was seeded with, silently out of step with the default set just now.
  if (retriesAllowed(input.quizNavigationDefault)) {
    const synced = await syncInheritedRetries(
      courseId,
      input.retryMaxDefault,
      input.retryCooldownHoursDefault
    )
    if (!synced.ok) return synced
  }

  revalidatePath(`/courses/${courseId}`)
  revalidatePath('/courses')
  return { ok: true }
}

/**
 * Drops retries from every quiz that INHERITS the course navigation default.
 * Blocks with an explicit `allow_back` override keep theirs — their effective
 * navigation is unaffected by the course default changing.
 */
async function clearInheritedRetries(courseId: string): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: blocks, error } = await supabase
    .from('course_blocks')
    .select('id, quiz_navigation_override')
    .eq('course_id', courseId)
    .eq('type', 'quiz')
    .eq('quiz_navigation_override', 'inherit')

  if (error) return { ok: false, error: error.message }
  if (!blocks || blocks.length === 0) return { ok: true }

  const { error: quizError } = await supabase
    .from('quizzes')
    .update({ retry_max: null, retry_cooldown_hours: null })
    .in(
      'block_id',
      blocks.map((b) => b.id)
    )

  if (quizError) return { ok: false, error: quizError.message }
  return { ok: true }
}

/**
 * Pushes the course's new retry default onto every quiz that INHERITS the
 * course navigation default — the mirror image of clearInheritedRetries, for
 * when retries are still allowed but the default itself changed. Same
 * exemption: a block with an explicit `allow_back` override keeps its own
 * value rather than being overwritten.
 */
async function syncInheritedRetries(
  courseId: string,
  retryMax: number | null,
  retryCooldownHours: number | null
): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: blocks, error } = await supabase
    .from('course_blocks')
    .select('id')
    .eq('course_id', courseId)
    .eq('type', 'quiz')
    .eq('quiz_navigation_override', 'inherit')

  if (error) return { ok: false, error: error.message }
  if (!blocks || blocks.length === 0) return { ok: true }

  const { error: quizError } = await supabase
    .from('quizzes')
    .update({
      retry_max: retryMax,
      retry_cooldown_hours: retryMax === null ? null : retryCooldownHours,
    })
    .in(
      'block_id',
      blocks.map((b) => b.id)
    )

  if (quizError) return { ok: false, error: quizError.message }
  return { ok: true }
}

async function replaceTags(courseId: string, tags: string[]): Promise<ActionResult> {
  const supabase = await createClient()
  const unique = Array.from(new Set(tags.map((t) => t.trim()).filter(Boolean)))

  const { error: deleteError } = await supabase
    .from('course_tags')
    .delete()
    .eq('course_id', courseId)
  if (deleteError) return { ok: false, error: deleteError.message }

  if (unique.length === 0) return { ok: true }

  const { error } = await supabase
    .from('course_tags')
    .insert(unique.map((tag) => ({ course_id: courseId, tag })))
  if (error) return { ok: false, error: error.message }

  return { ok: true }
}

/* ── Blocks ────────────────────────────────────────────────────────────── */

export async function addBlock(
  courseId: string,
  type: BlockType,
  index: number
): Promise<ActionResult<{ id: string }>> {
  const auth = await requireEditor()
  if (!auth.ok) return { ok: false, error: auth.error }

  const course = await ownedCourse(courseId, auth.businessId)
  if (!course) return { ok: false, error: 'Course not found.' }

  const supabase = await createClient()

  const { data: existing, error: listError } = await supabase
    .from('course_blocks')
    .select('id, position')
    .eq('course_id', courseId)
    .order('position')
  if (listError) return { ok: false, error: listError.message }

  const at = Math.max(0, Math.min(index, existing?.length ?? 0))

  // Push everything at or after the insertion point down one slot. Descending
  // order matters only if (course_id, position) were unique — it is not — but
  // it keeps the sequence sane if that constraint is ever added.
  const toShift = (existing ?? []).slice(at).reverse()
  for (const block of toShift) {
    const { error } = await supabase
      .from('course_blocks')
      .update({ position: block.position + 1 })
      .eq('id', block.id)
    if (error) return { ok: false, error: error.message }
  }

  const { data, error } = await supabase
    .from('course_blocks')
    .insert({
      course_id: courseId,
      type,
      position: at,
      content_ref: EMPTY_CONTENT[type] as never,
    })
    .select('id')
    .single()

  if (error || !data) return { ok: false, error: error?.message ?? 'Could not add the block.' }

  if (type === 'quiz') {
    // Seed the quiz row from the course defaults. The database's retry trigger
    // accepts these because a fresh block inherits the course navigation, and
    // the course CHECK guarantees defaults are only set under allow_back.
    const { error: quizError } = await supabase.from('quizzes').insert({
      block_id: data.id,
      retry_max: course.quiz_retry_max_default,
      retry_cooldown_hours:
        course.quiz_retry_max_default === null
          ? null
          : course.quiz_retry_cooldown_hours_default,
    })
    if (quizError) return { ok: false, error: quizError.message }
  }

  revalidatePath(`/courses/${courseId}`)
  return { ok: true, data: { id: data.id } }
}

export async function updateBlock(
  courseId: string,
  blockId: string,
  patch: { title?: string | null; content?: unknown }
): Promise<ActionResult> {
  const auth = await requireEditor()
  if (!auth.ok) return { ok: false, error: auth.error }
  if (!(await ownedCourse(courseId, auth.businessId))) {
    return { ok: false, error: 'Course not found.' }
  }

  const supabase = await createClient()
  const update: Database['public']['Tables']['course_blocks']['Update'] = {}
  if (patch.title !== undefined) update.title = patch.title?.trim() || null
  if (patch.content !== undefined) update.content_ref = patch.content as never

  if (Object.keys(update).length === 0) return { ok: true }

  const { error } = await supabase
    .from('course_blocks')
    .update(update)
    .eq('id', blockId)
    .eq('course_id', courseId)

  if (error) return { ok: false, error: error.message }

  revalidatePath(`/courses/${courseId}`)
  return { ok: true }
}

export async function reorderBlocks(
  courseId: string,
  orderedIds: string[]
): Promise<ActionResult> {
  const auth = await requireEditor()
  if (!auth.ok) return { ok: false, error: auth.error }
  if (!(await ownedCourse(courseId, auth.businessId))) {
    return { ok: false, error: 'Course not found.' }
  }

  const supabase = await createClient()
  for (const [position, id] of orderedIds.entries()) {
    const { error } = await supabase
      .from('course_blocks')
      .update({ position })
      .eq('id', id)
      .eq('course_id', courseId)
    if (error) return { ok: false, error: error.message }
  }

  revalidatePath(`/courses/${courseId}`)
  return { ok: true }
}

export async function deleteBlock(courseId: string, blockId: string): Promise<ActionResult> {
  const auth = await requireEditor()
  if (!auth.ok) return { ok: false, error: auth.error }
  if (!(await ownedCourse(courseId, auth.businessId))) {
    return { ok: false, error: 'Course not found.' }
  }

  const supabase = await createClient()

  // Deleting is Admin-only per the RLS matrix; an Operator's delete is filtered
  // out by the policy rather than rejected, so the row count is the tell.
  const { error, count } = await supabase
    .from('course_blocks')
    .delete({ count: 'exact' })
    .eq('id', blockId)
    .eq('course_id', courseId)

  if (error) return { ok: false, error: error.message }
  if (count === 0) {
    return { ok: false, error: 'Only an admin can delete blocks from a course.' }
  }

  // Close the gap the delete left behind.
  const { data: remaining } = await supabase
    .from('course_blocks')
    .select('id')
    .eq('course_id', courseId)
    .order('position')

  if (remaining) {
    const result = await reorderBlocks(
      courseId,
      remaining.map((b) => b.id)
    )
    if (!result.ok) return result
  }

  revalidatePath(`/courses/${courseId}`)
  return { ok: true }
}

/* ── Quiz configuration ────────────────────────────────────────────────── */

export async function updateQuizConfig(
  courseId: string,
  blockId: string,
  input: QuizConfigInput
): Promise<ActionResult> {
  const auth = await requireEditor()
  if (!auth.ok) return { ok: false, error: auth.error }

  const course = await ownedCourse(courseId, auth.businessId)
  if (!course) return { ok: false, error: 'Course not found.' }

  // THE dependency rule from the handoff spec, enforced here in the API layer
  // and not only in the UI. The database backs it with triggers as well; this
  // check exists so a rejection reads as a sentence.
  const navigation = effectiveNavigation(
    course.quiz_navigation_default,
    input.navigationOverride
  )
  const wantsRetries = input.retryMax !== null || input.retryCooldownHours !== null

  if (wantsRetries && !retriesAllowed(navigation)) {
    return {
      ok: false,
      error:
        'Retries need "Allow going back". Change this quiz\'s navigation, or turn retries off.',
      fieldErrors: { retryMax: 'Not available with forward-only navigation.' },
    }
  }

  if (input.retryMax !== null && input.retryMax < 1) {
    return { ok: false, error: 'Allow at least one attempt, or switch retries off.' }
  }

  if (input.scope === 'specific_blocks' && input.scopeBlockIds.length === 0) {
    return { ok: false, error: 'Pick at least one block for the quiz to cover.' }
  }

  const supabase = await createClient()

  // Retries must be cleared before the override tightens, or the block trigger
  // rejects the navigation change while retries are still on the quiz row.
  if (!retriesAllowed(navigation)) {
    const { error: clearError } = await supabase
      .from('quizzes')
      .update({ retry_max: null, retry_cooldown_hours: null })
      .eq('block_id', blockId)
    if (clearError) return { ok: false, error: clearError.message }
  }

  const { error: blockError } = await supabase
    .from('course_blocks')
    .update({ quiz_navigation_override: input.navigationOverride })
    .eq('id', blockId)
    .eq('course_id', courseId)
  if (blockError) return { ok: false, error: blockError.message }

  const { error } = await supabase
    .from('quizzes')
    .update({
      passing_score: input.passingScore,
      scope: input.scope,
      scope_block_ids: input.scope === 'specific_blocks' ? input.scopeBlockIds : [],
      reveal_answers: input.revealAnswers,
      retry_max: input.retryMax,
      retry_cooldown_hours: input.retryMax === null ? null : input.retryCooldownHours,
    })
    .eq('block_id', blockId)

  if (error) return { ok: false, error: error.message }

  revalidatePath(`/courses/${courseId}`)
  return { ok: true }
}

/* ── Sharing ───────────────────────────────────────────────────────────── */

/**
 * Regenerates a course's share token, which permanently breaks every link
 * already handed out — that is the point of it. For a private course the link
 * is the only way in, so this is how access gets revoked.
 */
export async function resetShareLink(
  courseId: string
): Promise<ActionResult<{ shareToken: string }>> {
  const auth = await requireEditor()
  if (!auth.ok) return { ok: false, error: auth.error }
  if (!(await ownedCourse(courseId, auth.businessId))) {
    return { ok: false, error: 'Course not found.' }
  }

  // Same shape the column's own default produces: 24 random bytes, hex.
  const token = Array.from(crypto.getRandomValues(new Uint8Array(24)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  const supabase = await createClient()
  const { error } = await supabase
    .from('courses')
    .update({ share_token: token })
    .eq('id', courseId)

  if (error) return { ok: false, error: error.message }

  revalidatePath('/courses')
  return { ok: true, data: { shareToken: token } }
}

/* ── Publish ───────────────────────────────────────────────────────────── */

/**
 * Step 4. Flips a course from draft to published — the moment it becomes
 * reachable outside the business (marketplace listing, share link; see
 * 20260903000100_course_publish_status.sql). Re-checks the two things a
 * course cannot be published without, even though the UI already keeps you
 * from getting here without them, so this cannot be bypassed by calling the
 * action directly.
 */
export async function publishCourse(courseId: string): Promise<ActionResult> {
  const auth = await requireEditor()
  if (!auth.ok) return { ok: false, error: auth.error }
  if (!(await ownedCourse(courseId, auth.businessId))) {
    return { ok: false, error: 'Course not found.' }
  }

  const supabase = await createClient()
  const [{ data: course }, { count: blockCount }] = await Promise.all([
    supabase.from('courses').select('title').eq('id', courseId).maybeSingle(),
    supabase
      .from('course_blocks')
      .select('id', { count: 'exact', head: true })
      .eq('course_id', courseId),
  ])

  if (!course?.title.trim()) {
    return { ok: false, error: 'Add a title before publishing — see step 1, Basics.' }
  }
  if (!blockCount) {
    return { ok: false, error: 'Add at least one block before publishing — see step 2, Content.' }
  }

  const { error: publishError } = await supabase
    .from('courses')
    .update({ status: 'published' })
    .eq('id', courseId)
  if (publishError) return { ok: false, error: publishError.message }

  revalidatePath(`/courses/${courseId}`)
  revalidatePath('/courses')
  return { ok: true }
}

/** Pulls a published course back out of the marketplace and off its share link. */
export async function unpublishCourse(courseId: string): Promise<ActionResult> {
  const auth = await requireEditor()
  if (!auth.ok) return { ok: false, error: auth.error }
  if (!(await ownedCourse(courseId, auth.businessId))) {
    return { ok: false, error: 'Course not found.' }
  }

  const supabase = await createClient()
  const { error: unpublishError } = await supabase
    .from('courses')
    .update({ status: 'draft' })
    .eq('id', courseId)
  if (unpublishError) return { ok: false, error: unpublishError.message }

  revalidatePath(`/courses/${courseId}`)
  revalidatePath('/courses')
  return { ok: true }
}
