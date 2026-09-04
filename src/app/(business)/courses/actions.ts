'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getBusinessContext } from '@/lib/business'
import {
  DEFAULT_COURSE_DETAILS,
  EMPTY_CONTENT,
  MATERIAL_BUCKET,
  asText,
  asVideo,
  effectiveNavigation,
  retriesAllowed,
} from '@/lib/course'
import type {
  BlockSourceStatus,
  BlockType,
  CourseBasics,
  CourseBuildStage,
  CourseDetails,
  QuizNavigationOverride,
  QuizScope,
} from '@/lib/course'
import { MAX_QUESTIONS } from '@/lib/pipeline/quiz/schema'
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
  /** `null` is "no specific number" — the model decides. See quizzes.generation_count. */
  generationCount: number | null
}

/** One walkthrough page's worth of edits. */
export type BlockPageInput = {
  title: string
  /** VideoContent or TextContent. Ignored for quiz blocks, which carry none. */
  content?: unknown
  quiz?: QuizConfigInput
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
      // Basics are done the moment the course exists, so an abandoned draft
      // resumes at the sequence rather than back at the form just completed.
      build_stage: 'sequence',
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
      // Details answered — the only thing left in the flow is Publish.
      build_stage: 'publish',
      build_block_id: null,
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

/* ── The walkthrough ───────────────────────────────────────────────────── */

/**
 * Remembers where the builder was left, so an abandoned draft resumes instead
 * of restarting. Called on entering a screen as well as on save: someone who
 * opens page three and closes the tab meant to be on page three.
 *
 * Deliberately silent about failure. This is bookkeeping for a convenience —
 * blocking a page render or a save on it would trade something that works for
 * something that only sometimes helps.
 */
export async function recordBuildProgress(
  courseId: string,
  stage: CourseBuildStage,
  blockId: string | null = null
): Promise<ActionResult> {
  const auth = await requireEditor()
  if (!auth.ok) return { ok: false, error: auth.error }
  if (!(await ownedCourse(courseId, auth.businessId))) {
    return { ok: false, error: 'Course not found.' }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('courses')
    .update({ build_stage: stage, build_block_id: blockId })
    .eq('id', courseId)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

/** The three source columns, decided together — see saveBlockPage. */
type DerivedSource = {
  source_text: string | null
  source_status: BlockSourceStatus
  source_error: string | null
}

/**
 * Pulls the text out of an uploaded document so a quiz can be generated from
 * it. Storage holds the file; the parsers read bytes.
 *
 * Both the download and the parse are allowed to fail without failing the
 * save. An author who has just uploaded a scanned PDF should still keep their
 * title, their pointers and their summary — the block simply records that its
 * material could not be read, and the quiz page says so.
 */
async function extractUploadedSource(
  path: string,
  fileName: string | null
): Promise<{ derived: DerivedSource; warnings: string[] }> {
  const supabase = await createClient()
  const { data, error } = await supabase.storage.from(MATERIAL_BUCKET).download(path)

  if (error || !data) {
    return {
      derived: {
        source_text: null,
        source_status: 'failed',
        source_error: `Could not open the uploaded file (${error?.message ?? 'not found'}).`,
      },
      warnings: [],
    }
  }

  try {
    // Dynamic, for the reason spelled out at the top of extract/upload.ts: a
    // static import puts pdfjs and mammoth on every builder action's module
    // graph, and one of them failing to load takes all of them down.
    const { extractFromUpload } = await import('@/lib/pipeline/extract/upload')
    const bytes = new Uint8Array(await data.arrayBuffer())
    const extracted = await extractFromUpload(bytes, fileName ?? path, data.type || null)

    if (!extracted.text.trim()) {
      return {
        derived: {
          source_text: null,
          source_status: 'failed',
          source_error:
            extracted.warnings[0] ??
            'No readable text came out of that file. A scanned document needs OCR, which this does not do yet.',
        },
        warnings: extracted.warnings,
      }
    }

    return {
      derived: {
        source_text: extracted.text,
        source_status: 'ready',
        // A thin-text warning is worth keeping around: it is the difference
        // between a quiz that reads the material and one that guesses.
        source_error: extracted.warnings[0] ?? null,
      },
      warnings: extracted.warnings,
    }
  } catch (cause) {
    return {
      derived: {
        source_text: null,
        source_status: 'failed',
        source_error: cause instanceof Error ? cause.message : 'That file could not be read.',
      },
      warnings: [],
    }
  }
}

/**
 * Saves one walkthrough page: the block's title, its content, and — for a quiz
 * page — its configuration, in a single call.
 *
 * It also decides what the block's `source_text` now is, because that is a
 * consequence of the content rather than a separate thing to ask about:
 *
 *   rich text   the body IS the source, ready immediately
 *   document    extracted here, on the way in
 *   video       'pending' until a transcript exists. Transcription is a slow
 *               hosted call, so it is transcribeBlockVideo's job rather than a
 *               side effect of pressing Save — see the note there.
 */
export async function saveBlockPage(
  courseId: string,
  blockId: string,
  input: BlockPageInput
): Promise<ActionResult<{ warnings: string[] }>> {
  const auth = await requireEditor()
  if (!auth.ok) return { ok: false, error: auth.error }
  if (!(await ownedCourse(courseId, auth.businessId))) {
    return { ok: false, error: 'Course not found.' }
  }

  const supabase = await createClient()
  const { data: block, error: loadError } = await supabase
    .from('course_blocks')
    .select('id, type, content_ref, source_text, source_status')
    .eq('id', blockId)
    .eq('course_id', courseId)
    .maybeSingle()

  if (loadError) return { ok: false, error: loadError.message }
  if (!block) return { ok: false, error: 'That block no longer exists.' }

  const update: Database['public']['Tables']['course_blocks']['Update'] = {
    title: input.title.trim() || null,
  }
  const warnings: string[] = []

  /** Nothing to say about the source — a quiz block, or a document left alone. */
  const unchanged = null

  const empty: DerivedSource = { source_text: null, source_status: 'empty', source_error: null }
  let derived: DerivedSource | null = unchanged

  if (block.type === 'video') {
    const video = asVideo(input.content)
    const transcript = video.transcript.trim()

    update.content_ref = video as never
    derived = transcript
      ? { source_text: transcript, source_status: 'ready', source_error: null }
      : video.path
        ? // The one thing the builder cannot do for itself. Recorded as
          // pending rather than failed: nothing is wrong, it is just not done.
          { source_text: null, source_status: 'pending', source_error: null }
        : empty
  } else if (block.type === 'text') {
    const text = asText(input.content)
    update.content_ref = text as never

    if (text.mode === 'rich') {
      derived = text.body.trim()
        ? { source_text: text.body, source_status: 'ready', source_error: null }
        : empty
    } else if (!text.path) {
      derived = empty
    } else {
      const previousPath = asText(block.content_ref).path
      // Re-extract when the file changed, and when the last attempt did not
      // end in usable text — which makes plain "Save" the retry for a document
      // that failed, without a separate button to go and find.
      const needsExtraction = previousPath !== text.path || block.source_status !== 'ready'

      if (needsExtraction) {
        const result = await extractUploadedSource(text.path, text.fileName)
        derived = result.derived
        warnings.push(...result.warnings)
      }
    }
  }

  if (derived) {
    update.source_text = derived.source_text
    update.source_status = derived.source_status
    update.source_error = derived.source_error
  }

  const { error } = await supabase
    .from('course_blocks')
    .update(update)
    .eq('id', blockId)
    .eq('course_id', courseId)

  if (error) return { ok: false, error: error.message }

  if (block.type === 'quiz' && input.quiz) {
    const quizResult = await updateQuizConfig(courseId, blockId, input.quiz)
    if (!quizResult.ok) return quizResult
  }

  await recordBuildProgress(courseId, 'walkthrough', blockId)

  revalidatePath(`/courses/${courseId}`)
  return { ok: true, data: { warnings } }
}

/**
 * Bytes have to come through this function's memory to reach the transcriber,
 * so the ceiling is about what a request can hold, not what the model accepts.
 * Past it, pasting a transcript is the honest answer.
 */
const MAX_TRANSCRIBE_BYTES = 50 * 1024 * 1024

/**
 * Transcribes a block's uploaded video, which is what moves it from 'pending'
 * to 'ready' and lets the quizzes after it be generated.
 *
 * Deliberately its own action rather than part of saving. Reading a PDF is
 * milliseconds; transcribing a recording is a hosted model call measured in
 * minutes. Folding that into Save would mean "Continue to next page"
 * occasionally hanging for two minutes and sometimes hitting the request
 * timeout — so the author asks for it, knowing it takes a while, and a failure
 * costs them nothing they typed.
 */
export async function transcribeBlockVideo(
  courseId: string,
  blockId: string
): Promise<ActionResult<{ transcript: string; warnings: string[] }>> {
  const auth = await requireEditor()
  if (!auth.ok) return { ok: false, error: auth.error }
  if (!(await ownedCourse(courseId, auth.businessId))) {
    return { ok: false, error: 'Course not found.' }
  }

  const supabase = await createClient()
  const { data: block } = await supabase
    .from('course_blocks')
    .select('id, type, content_ref')
    .eq('id', blockId)
    .eq('course_id', courseId)
    .maybeSingle()

  if (!block) return { ok: false, error: 'That block no longer exists.' }
  if (block.type !== 'video') return { ok: false, error: 'That block is not a video.' }

  const video = asVideo(block.content_ref)
  if (!video.path) return { ok: false, error: 'Upload a video first, then transcribe it.' }

  // Checked from the object listing rather than after downloading, so an
  // oversized file is refused without pulling it into memory to find out.
  const slash = video.path.lastIndexOf('/')
  const { data: entries } = await supabase.storage
    .from(MATERIAL_BUCKET)
    .list(video.path.slice(0, slash))
  const size = entries?.find((entry) => entry.name === video.path!.slice(slash + 1))?.metadata
    ?.size as number | undefined

  if (size && size > MAX_TRANSCRIBE_BYTES) {
    return {
      ok: false,
      error:
        `That video is ${Math.round(size / 1024 / 1024)} MB, over the ` +
        `${MAX_TRANSCRIBE_BYTES / 1024 / 1024} MB limit for transcribing here. Paste a transcript instead.`,
    }
  }

  const { data: file, error: downloadError } = await supabase.storage
    .from(MATERIAL_BUCKET)
    .download(video.path)

  if (downloadError || !file) {
    return { ok: false, error: `Could not open the video (${downloadError?.message ?? 'not found'}).` }
  }

  let transcript: string
  let warnings: string[]
  try {
    // Dynamic for the same reason as the document extractors — see the note at
    // the top of extract/upload.ts.
    const { transcribeUpload } = await import('@/lib/pipeline/extract/upload')
    const bytes = new Uint8Array(await file.arrayBuffer())
    const result = await transcribeUpload(bytes, video.fileName ?? video.path)
    transcript = result.text.trim()
    warnings = result.warnings
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : 'Transcription failed.'
    // The block stays 'pending' — nothing about it got worse, it just still
    // has no transcript, and now says why.
    await supabase
      .from('course_blocks')
      .update({ source_status: 'pending', source_error: message })
      .eq('id', blockId)
      .eq('course_id', courseId)

    revalidatePath(`/courses/${courseId}`)
    return { ok: false, error: message }
  }

  if (!transcript) {
    const message =
      warnings[0] ?? 'That video produced no transcript — it may have no audio track, or only silence.'
    await supabase
      .from('course_blocks')
      .update({ source_status: 'pending', source_error: message })
      .eq('id', blockId)
      .eq('course_id', courseId)

    revalidatePath(`/courses/${courseId}`)
    return { ok: false, error: message }
  }

  // Written into content_ref as well as source_text so the author can read and
  // correct it in the same box they could have pasted one into. A transcript
  // is a first draft, not a fact.
  const { error } = await supabase
    .from('course_blocks')
    .update({
      content_ref: { ...video, transcript } as never,
      source_text: transcript,
      source_status: 'ready',
      source_error: warnings[0] ?? null,
    })
    .eq('id', blockId)
    .eq('course_id', courseId)

  if (error) return { ok: false, error: error.message }

  revalidatePath(`/courses/${courseId}`)
  return { ok: true, data: { transcript, warnings } }
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

  // null is a legitimate value here — "no specific number" — so only an actual
  // number is range-checked. The database CHECK says the same thing.
  if (
    input.generationCount !== null &&
    (!Number.isInteger(input.generationCount) ||
      input.generationCount < 1 ||
      input.generationCount > MAX_QUESTIONS)
  ) {
    return { ok: false, error: `Ask for between 1 and ${MAX_QUESTIONS} questions, or no specific number.` }
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
      generation_count: input.generationCount,
    })
    .eq('block_id', blockId)

  if (error) return { ok: false, error: error.message }

  revalidatePath(`/courses/${courseId}`)
  return { ok: true }
}

/* ── Deleting ──────────────────────────────────────────────────────────── */

/**
 * Deletes a course outright. Admin-only per the RLS matrix, and an Operator's
 * delete is filtered out by the policy rather than rejected, so a zero row
 * count is the tell.
 *
 * Everything hanging off it goes too — blocks, quizzes, questions, enrolments,
 * progress and certificates all cascade from the foreign keys. That includes
 * certificates already issued to learners, which is why this is Admin-only and
 * why the UI asks for the course title before enabling it.
 */
export async function deleteCourse(courseId: string): Promise<ActionResult> {
  const auth = await requireEditor()
  if (!auth.ok) return { ok: false, error: auth.error }
  if (!(await ownedCourse(courseId, auth.businessId))) {
    return { ok: false, error: 'Course not found.' }
  }

  const supabase = await createClient()
  const { error, count } = await supabase
    .from('courses')
    .delete({ count: 'exact' })
    .eq('id', courseId)

  if (error) return { ok: false, error: error.message }
  if (count === 0) return { ok: false, error: 'Only an admin can delete a course.' }

  revalidatePath('/courses')
  return { ok: true }
}

/** Unenrols a learner. Admin/Operator per enrollments_delete_editor. */
export async function removeEnrollment(
  courseId: string,
  enrollmentId: string
): Promise<ActionResult> {
  const auth = await requireEditor()
  if (!auth.ok) return { ok: false, error: auth.error }
  if (!(await ownedCourse(courseId, auth.businessId))) {
    return { ok: false, error: 'Course not found.' }
  }

  const supabase = await createClient()
  const { error, count } = await supabase
    .from('enrollments')
    .delete({ count: 'exact' })
    .eq('id', enrollmentId)
    .eq('course_id', courseId)

  if (error) return { ok: false, error: error.message }
  if (count === 0) {
    return { ok: false, error: 'That learner is no longer enrolled, or you cannot remove them.' }
  }

  revalidatePath(`/courses/${courseId}/manage/learners`)
  revalidatePath('/learners')
  return { ok: true }
}

/**
 * Offers a past student the course again, as a NEW enrolment.
 *
 * The old one is not touched. Reopening it would destroy the record of having
 * passed — the completion date, the block-count snapshot the 100% is measured
 * against, and the certificate's provenance — which is the whole reason a
 * "past student" is marked as complete rather than dragged back to 60%.
 *
 * `enrollments` used to be unique on (course_id, learner_id), which made this
 * impossible; it is now unique on (course_id, learner_id, cycle) and a trigger
 * assigns the next cycle. See 20260904000600.
 */
export async function inviteToRetake(
  courseId: string,
  learnerId: string
): Promise<ActionResult<{ enrollmentId: string }>> {
  const auth = await requireEditor()
  if (!auth.ok) return { ok: false, error: auth.error }
  if (!(await ownedCourse(courseId, auth.businessId))) {
    return { ok: false, error: 'Course not found.' }
  }

  const supabase = await createClient()

  /* Only a finished enrolment can be retaken. Someone still working through
     the course does not need a second copy of it, and handing them one would
     split their progress across two rows. */
  const { data: cycles } = await supabase
    .from('enrollments')
    .select('id, status, cycle')
    .eq('course_id', courseId)
    .eq('learner_id', learnerId)
    .order('cycle', { ascending: false })
    .limit(1)

  const latest = cycles?.[0]
  if (!latest) return { ok: false, error: 'That learner is not enrolled in this course.' }
  if (latest.status !== 'completed') {
    return { ok: false, error: 'They are still working through this course.' }
  }

  // Through the caller's own session: enrollments_insert_editor is what decides
  // whether this member may enrol anyone on this course at all.
  const { data: enrollment, error } = await supabase
    .from('enrollments')
    .insert({ course_id: courseId, learner_id: learnerId, business_id: auth.businessId })
    .select('id')
    .single()

  if (error || !enrollment) {
    return { ok: false, error: error?.message ?? 'Could not create the new enrolment.' }
  }

  const { data: blocks } = await supabase
    .from('course_blocks')
    .select('id')
    .eq('course_id', courseId)
    .order('position')

  /* block_progress is learner-write-only by RLS (block_progress_write_learner),
     so the scaffold goes in with the service role — the same reasoning
     issueCertificate uses. The authority to enrol was already established by
     the insert above; laying down the progress rows is a mechanical
     consequence of it, not a second decision. */
  if (blocks?.length) {
    const admin = createAdminClient()
    const { error: progressError } = await admin.from('block_progress').insert(
      blocks.map((block, index) => ({
        enrollment_id: enrollment.id,
        block_id: block.id,
        status: index === 0 ? ('unlocked' as const) : ('locked' as const),
      }))
    )
    if (progressError) {
      // A retake with no unlocked blocks is a dead end, so the half-made
      // enrolment goes rather than sitting there unopenable.
      await supabase.from('enrollments').delete().eq('id', enrollment.id)
      return { ok: false, error: progressError.message }
    }
  }

  revalidatePath(`/courses/${courseId}/manage/learners`)
  revalidatePath(`/courses/${courseId}/manage`)
  revalidatePath('/learners')
  return { ok: true, data: { enrollmentId: enrollment.id } }
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
