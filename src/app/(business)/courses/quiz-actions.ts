'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getBusinessContext } from '@/lib/business'
import { generateQuiz, MAX_QUESTIONS, type QuestionCount } from '@/lib/pipeline/quiz/generate'
import { regenerateQuestion } from '@/lib/pipeline/quiz/regenerate'
import { OPTIONS_PER_QUESTION, type Question } from '@/lib/pipeline/quiz/schema'
import type { SourceType } from '@/lib/pipeline/extract/types'
import type { ActionResult } from '@/app/(auth)/actions'

export type QuestionInput = {
  questionText: string
  options: string[]
  correctOption: number
  explanation: string | null
}

/**
 * A video block inside this quiz's scope that has an upload but nothing
 * readable yet. Returned so the quiz page can send the admin straight to that
 * block's transcript step instead of just refusing to generate — the video is
 * there, the one missing step is transcribing it.
 *
 * Only blocks with an actual upload appear here. A video block with nothing
 * uploaded cannot be transcribed, so offering it would be a dead end.
 */
export type TranscriptNeeded = { blockId: string; title: string }

export type GenerateQuestionsResult =
  | { ok: true; data: { added: number; blocksUsed: number; warnings: string[] } }
  | { ok: false; error: string; needsTranscript?: TranscriptNeeded[] }

/** Admin/Operator only, same as every other course write. */
async function requireEditor(courseId: string): Promise<ActionResult<{ businessId: string }>> {
  const context = await getBusinessContext()
  if (!context) return { ok: false, error: 'You are not signed in to a business account.' }
  if (context.role === 'auditor') {
    return { ok: false, error: 'Auditors have read-only access to courses.' }
  }

  const supabase = await createClient()
  const { data } = await supabase
    .from('courses')
    .select('business_id')
    .eq('id', courseId)
    .maybeSingle()

  if (!data || data.business_id !== context.businessId) {
    return { ok: false, error: 'Course not found.' }
  }
  return { ok: true, data: { businessId: context.businessId } }
}

/** The quiz row for a block, which is also where its scope lives. */
async function quizForBlock(blockId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('quizzes')
    .select('id, scope, scope_block_ids')
    .eq('block_id', blockId)
    .maybeSingle()
  return data
}

function validate(input: QuestionInput): string | null {
  if (input.questionText.trim().length < 8) return 'Write a question of at least 8 characters.'
  if (input.options.length !== OPTIONS_PER_QUESTION) {
    return `Each question needs exactly ${OPTIONS_PER_QUESTION} options.`
  }
  if (input.options.some((o) => !o.trim())) return 'Every option needs text.'
  if (new Set(input.options.map((o) => o.trim())).size !== input.options.length) {
    return 'Options must be different from each other.'
  }
  if (input.correctOption < 0 || input.correctOption >= OPTIONS_PER_QUESTION) {
    return 'Mark which option is correct.'
  }
  return null
}

/* ── Source text ───────────────────────────────────────────────────────── */

/**
 * Collects the material a quiz is meant to test, following its own scope
 * setting — the same rule the player uses, resolved here so generation covers
 * what the quiz claims to cover.
 *
 * Nothing is parsed at this point. Extraction happens once, when the material
 * is saved on its own walkthrough page, and lands in `source_text`; by the
 * time a quiz asks for it, the answer is a column read. That is what makes
 * "generate" fast, and what lets the quiz page say up front which of the
 * blocks above it are actually usable — rather than finding out mid-call.
 */
async function gatherSourceText(
  courseId: string,
  blockId: string,
  scope: string,
  scopeBlockIds: string[]
): Promise<{
  text: string
  sourceType: SourceType
  warnings: string[]
  blocksUsed: number
  needsTranscript: TranscriptNeeded[]
}> {
  const supabase = await createClient()
  const { data: blocks } = await supabase
    .from('course_blocks')
    .select('id, type, title, source_text, source_status, source_error, position, content_ref')
    .eq('course_id', courseId)
    .order('position')

  const ordered = blocks ?? []
  const selfIndex = ordered.findIndex((b) => b.id === blockId)
  const before = selfIndex < 0 ? ordered : ordered.slice(0, selfIndex)

  let sources = before
  if (scope === 'preceding_block') {
    sources = before.slice(-1)
  } else if (scope === 'since_last_quiz') {
    const lastQuiz = before.map((b) => b.type).lastIndexOf('quiz')
    sources = lastQuiz === -1 ? before : before.slice(lastQuiz + 1)
  } else if (scope === 'specific_blocks') {
    sources = ordered.filter((b) => scopeBlockIds.includes(b.id))
  } else if (scope === 'none') {
    sources = []
  }

  const warnings: string[] = []
  const parts: string[] = []
  const needsTranscript: TranscriptNeeded[] = []
  let sawVideo = false
  let sawWritten = false

  for (const block of sources) {
    if (block.type === 'quiz') continue
    const label = block.title?.trim() || `a ${block.type} block`

    /* An uploaded-but-unread video is recoverable in one step, so it is
       collected separately from the blocks that are simply empty. */
    if (block.type === 'video' && block.source_status !== 'ready') {
      const uploaded = Boolean((block.content_ref as { path?: string | null } | null)?.path)
      if (uploaded) needsTranscript.push({ blockId: block.id, title: label })
    }

    if (block.source_status === 'ready' && block.source_text?.trim()) {
      parts.push(`## ${label}\n${block.source_text.trim()}`)
      if (block.type === 'video') sawVideo = true
      else sawWritten = true
      // A block can be readable and still thin; that note was recorded at
      // extraction time and is worth repeating here, where it changes whether
      // the resulting questions can be trusted.
      if (block.source_error) warnings.push(`"${label}": ${block.source_error}`)
      continue
    }

    if (block.source_status === 'pending') {
      warnings.push(
        `Skipped "${label}" — it is still waiting on a transcript. Paste one on its page, or come back to this quiz later.`
      )
    } else if (block.source_status === 'failed') {
      warnings.push(`Skipped "${label}" — ${block.source_error ?? 'its material could not be read.'}`)
    } else {
      warnings.push(`Skipped "${label}" — it has no material yet.`)
    }
  }

  // The source label only steers a phrase in the prompt ("transcript of a
  // training video" vs "Word training document"), so a mixed set is described
  // as written material rather than inventing a fifth label for "both".
  const sourceType: SourceType = sawVideo && !sawWritten ? 'video' : 'docx'

  return {
    text: parts.join('\n\n').trim(),
    sourceType,
    warnings,
    blocksUsed: parts.length,
    needsTranscript,
  }
}

/* ── Generation ────────────────────────────────────────────────────────── */

/**
 * Generates questions from the course's own material and saves them.
 * Generation is additive: it appends to whatever is already there, so a
 * partial set can be topped up without losing hand-written questions.
 */
export async function generateQuestions(
  courseId: string,
  blockId: string,
  count: QuestionCount
): Promise<GenerateQuestionsResult> {
  const auth = await requireEditor(courseId)
  if (!auth.ok) return auth

  // 'auto' has no number to check. Its ceiling is in the prompt and enforced
  // by the response schema, which truncates rather than rejecting.
  if (count !== 'auto' && (!Number.isInteger(count) || count < 1 || count > MAX_QUESTIONS)) {
    return { ok: false, error: `Ask for between 1 and ${MAX_QUESTIONS} questions.` }
  }

  const quiz = await quizForBlock(blockId)
  if (!quiz) return { ok: false, error: 'That quiz is not set up yet.' }

  const { text, sourceType, warnings, blocksUsed, needsTranscript } = await gatherSourceText(
    courseId,
    blockId,
    quiz.scope,
    quiz.scope_block_ids ?? []
  )

  if (!text) {
    /* Questions come from the transcript, not the video file, so an untranscribed
       upload is a missing step rather than missing material. Naming the block and
       handing back its id lets the caller offer that step instead of a dead end. */
    if (needsTranscript.length > 0) {
      const [first] = needsTranscript
      return {
        ok: false,
        error:
          needsTranscript.length === 1
            ? `“${first.title}” has not been transcribed yet. Quizzes are written from the transcript, not the video itself.`
            : `${needsTranscript.length} videos in this quiz’s scope have not been transcribed yet. Quizzes are written from the transcript, not the video itself.`,
        needsTranscript,
      }
    }

    return {
      ok: false,
      error:
        warnings[0] ??
        'There is no readable material in this quiz’s scope yet — add content above it first.',
    }
  }

  let generated
  try {
    generated = await generateQuiz(text, sourceType, count)
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Question generation failed.',
    }
  }

  const supabase = await createClient()
  const { count: existing } = await supabase
    .from('quiz_questions')
    .select('id', { count: 'exact', head: true })
    .eq('quiz_id', quiz.id)

  const { error } = await supabase.from('quiz_questions').insert(
    generated.questions.map((question, index) => ({
      quiz_id: quiz.id,
      question_text: question.question_text,
      options: question.options,
      correct_option: question.correct_option,
      explanation: question.explanation,
      position: (existing ?? 0) + index,
    }))
  )
  if (error) return { ok: false, error: error.message }

  revalidatePath(`/courses/${courseId}`)
  return {
    ok: true,
    data: {
      added: generated.questions.length,
      blocksUsed,
      warnings: [...warnings, ...generated.warnings],
    },
  }
}

/** Replaces one question with a fresh take on the same material. */
export async function regenerateOneQuestion(
  courseId: string,
  blockId: string,
  questionId: string
): Promise<ActionResult> {
  const auth = await requireEditor(courseId)
  if (!auth.ok) return auth

  const quiz = await quizForBlock(blockId)
  if (!quiz) return { ok: false, error: 'That quiz is not set up yet.' }

  const supabase = await createClient()
  // The whole set, not just the one being replaced: regenerateQuestion needs
  // the siblings as `avoid`, or the model can hand back a duplicate of one of
  // them.
  const { data: all } = await supabase
    .from('quiz_questions')
    .select('id, question_text, options, correct_option, explanation')
    .eq('quiz_id', quiz.id)
    .order('position')

  const toQuestion = (row: {
    question_text: string
    options: unknown
    correct_option: number
    explanation: string | null
  }): Question => ({
    question_text: row.question_text,
    options: row.options as string[],
    correct_option: row.correct_option,
    explanation: row.explanation,
  })

  const current = (all ?? []).find((q) => q.id === questionId)
  if (!current) return { ok: false, error: 'That question no longer exists.' }

  const { text } = await gatherSourceText(
    courseId,
    blockId,
    quiz.scope,
    quiz.scope_block_ids ?? []
  )
  if (!text) return { ok: false, error: 'There is no material to regenerate from.' }

  let replacement: Question
  try {
    replacement = await regenerateQuestion(text, toQuestion(current), {
      avoid: (all ?? []).filter((q) => q.id !== questionId).map(toQuestion),
    })
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Regeneration failed.' }
  }

  const { error } = await supabase
    .from('quiz_questions')
    .update({
      question_text: replacement.question_text,
      options: replacement.options,
      correct_option: replacement.correct_option,
      explanation: replacement.explanation,
    })
    .eq('id', questionId)

  if (error) return { ok: false, error: error.message }

  revalidatePath(`/courses/${courseId}`)
  return { ok: true }
}

/* ── Manual entry ──────────────────────────────────────────────────────── */

export async function addQuestion(
  courseId: string,
  blockId: string,
  input: QuestionInput
): Promise<ActionResult> {
  const auth = await requireEditor(courseId)
  if (!auth.ok) return auth

  const invalid = validate(input)
  if (invalid) return { ok: false, error: invalid }

  const quiz = await quizForBlock(blockId)
  if (!quiz) return { ok: false, error: 'That quiz is not set up yet.' }

  const supabase = await createClient()
  const { count } = await supabase
    .from('quiz_questions')
    .select('id', { count: 'exact', head: true })
    .eq('quiz_id', quiz.id)

  const { error } = await supabase.from('quiz_questions').insert({
    quiz_id: quiz.id,
    question_text: input.questionText.trim(),
    options: input.options.map((o) => o.trim()),
    correct_option: input.correctOption,
    explanation: input.explanation?.trim() || null,
    position: count ?? 0,
  })

  if (error) return { ok: false, error: error.message }

  revalidatePath(`/courses/${courseId}`)
  return { ok: true }
}

export async function updateQuestion(
  courseId: string,
  questionId: string,
  input: QuestionInput
): Promise<ActionResult> {
  const auth = await requireEditor(courseId)
  if (!auth.ok) return auth

  const invalid = validate(input)
  if (invalid) return { ok: false, error: invalid }

  const supabase = await createClient()
  const { error } = await supabase
    .from('quiz_questions')
    .update({
      question_text: input.questionText.trim(),
      options: input.options.map((o) => o.trim()),
      correct_option: input.correctOption,
      explanation: input.explanation?.trim() || null,
    })
    .eq('id', questionId)

  if (error) return { ok: false, error: error.message }

  revalidatePath(`/courses/${courseId}`)
  return { ok: true }
}

export async function deleteQuestion(
  courseId: string,
  questionId: string
): Promise<ActionResult> {
  const auth = await requireEditor(courseId)
  if (!auth.ok) return auth

  const supabase = await createClient()
  // Deleting a question is Admin-only per the RLS matrix; an Operator's delete
  // is filtered out rather than rejected, so the row count is the tell.
  const { error, count } = await supabase
    .from('quiz_questions')
    .delete({ count: 'exact' })
    .eq('id', questionId)

  if (error) return { ok: false, error: error.message }
  if (count === 0) return { ok: false, error: 'Only an admin can delete questions.' }

  revalidatePath(`/courses/${courseId}`)
  return { ok: true }
}

/* ── CSV import ────────────────────────────────────────────────────────── */

/** Splits one CSV line, honouring quoted fields containing commas. */
function splitCsvLine(line: string): string[] {
  const cells: string[] = []
  let cell = ''
  let quoted = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (quoted) {
      if (char === '"') {
        if (line[i + 1] === '"') {
          cell += '"'
          i++
        } else {
          quoted = false
        }
      } else {
        cell += char
      }
    } else if (char === '"') {
      quoted = true
    } else if (char === ',') {
      cells.push(cell)
      cell = ''
    } else {
      cell += char
    }
  }
  cells.push(cell)
  return cells.map((c) => c.trim())
}

/**
 * Imports questions from CSV: question, option 1-4, correct, explanation.
 * "correct" accepts either 1-4 or A-D, because both are what people actually
 * type. The header row is optional and detected, not required.
 *
 * A row that does not validate stops the import with its line number rather
 * than importing a partial set — a half-imported quiz is harder to fix than a
 * rejected file.
 */
export async function importQuestionsCsv(
  courseId: string,
  blockId: string,
  csv: string
): Promise<ActionResult<{ added: number }>> {
  const auth = await requireEditor(courseId)
  if (!auth.ok) return auth

  const quiz = await quizForBlock(blockId)
  if (!quiz) return { ok: false, error: 'That quiz is not set up yet.' }

  const lines = csv
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
  if (lines.length === 0) return { ok: false, error: 'That file is empty.' }

  if (/^"?question/i.test(lines[0])) lines.shift()
  if (lines.length === 0) return { ok: false, error: 'That file has a header but no rows.' }

  const parsed: QuestionInput[] = []
  for (const [index, line] of lines.entries()) {
    const cells = splitCsvLine(line)
    if (cells.length < 6) {
      return {
        ok: false,
        error: `Line ${index + 1}: expected at least 6 columns (question, four options, correct answer).`,
      }
    }

    const [questionText, ...rest] = cells
    const options = rest.slice(0, OPTIONS_PER_QUESTION)
    const correctRaw = (rest[OPTIONS_PER_QUESTION] ?? '').toUpperCase()
    const explanation = rest[OPTIONS_PER_QUESTION + 1] ?? null

    const correctOption = /^[A-D]$/.test(correctRaw)
      ? correctRaw.charCodeAt(0) - 65
      : Number(correctRaw) - 1

    const input: QuestionInput = {
      questionText,
      options,
      correctOption,
      explanation: explanation || null,
    }

    const invalid = validate(input)
    if (invalid) return { ok: false, error: `Line ${index + 1}: ${invalid}` }
    parsed.push(input)
  }

  const supabase = await createClient()
  const { count } = await supabase
    .from('quiz_questions')
    .select('id', { count: 'exact', head: true })
    .eq('quiz_id', quiz.id)

  const { error } = await supabase.from('quiz_questions').insert(
    parsed.map((question, index) => ({
      quiz_id: quiz.id,
      question_text: question.questionText.trim(),
      options: question.options.map((o) => o.trim()),
      correct_option: question.correctOption,
      explanation: question.explanation?.trim() || null,
      position: (count ?? 0) + index,
    }))
  )
  if (error) return { ok: false, error: error.message }

  revalidatePath(`/courses/${courseId}`)
  return { ok: true, data: { added: parsed.length } }
}
