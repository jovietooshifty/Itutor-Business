import { createClient } from '@/lib/supabase/server'
import { blockTypeMeta, type BlockType } from '@/lib/course'
import type { BuilderBlock } from '@/components/business/course-sequence'
import type {
  PriorBlock,
  QuizState,
  WalkthroughBlock,
} from '@/components/business/block-walkthrough'
import type { EditableQuestion } from '@/components/business/question-editor'

/**
 * The two loads the builder needs, in one place.
 *
 * Both the build flow and the Sequence tab render the same editors, and both
 * previously carried their own copy of a fairly involved query — the
 * one-to-one quiz embed that PostgREST sometimes hands back as an array, the
 * separate questions fetch. Two copies of that drifted the moment a column was
 * added; there is nothing screen-specific about either of them.
 */

/* One unbroken literal on purpose: supabase-js infers the row type from this
   string, and a concatenated one degrades to `string` and takes the whole
   result type down with it. */
// prettier-ignore
const BLOCK_COLUMNS = 'id, type, title, content_ref, quiz_navigation_override, position, source_status, source_error, quizzes(id, passing_score, scope, scope_block_ids, reveal_answers, retry_max, retry_cooldown_hours, generation_count)'

type QuizRow = {
  id: string
  passing_score: number
  scope: QuizState['scope']
  scope_block_ids: string[]
  reveal_answers: boolean
  retry_max: number | null
  retry_cooldown_hours: number | null
  generation_count: number | null
}

/** The embed is one-to-one (quizzes.block_id is unique) but PostgREST still
    hands it back as an array on some shapes, so normalise both. */
function oneQuiz(embedded: unknown): QuizRow | null {
  const value = embedded as QuizRow | QuizRow[] | null
  return Array.isArray(value) ? (value[0] ?? null) : value
}

function quizState(row: QuizRow | null): QuizState {
  return {
    passingScore: row?.passing_score ?? 80,
    scope: row?.scope ?? 'preceding_block',
    scopeBlockIds: row?.scope_block_ids ?? [],
    revealAnswers: row?.reveal_answers ?? false,
    retryMax: row?.retry_max ?? null,
    retryCooldownHours: row?.retry_cooldown_hours ?? null,
    // null means "no specific number", which is also the column default.
    generationCount: row?.generation_count ?? null,
  }
}

/** How a block is named wherever it is referred to from somewhere else. */
function blockLabel(title: string | null, type: BlockType, index: number): string {
  return title?.trim() || `${blockTypeMeta(type).label} block ${index + 1}`
}

export type LoadedCourse = { id: string; businessId: string; title: string }

/* ── The sequence screen ───────────────────────────────────────────────── */

export async function loadSequence(
  courseId: string
): Promise<{ course: LoadedCourse; blocks: BuilderBlock[] } | null> {
  const supabase = await createClient()

  const [{ data: course }, { data: rows }] = await Promise.all([
    supabase.from('courses').select('id, business_id, title').eq('id', courseId).maybeSingle(),
    supabase
      .from('course_blocks')
      .select('id, type, title, position, source_status, quizzes(id)')
      .eq('course_id', courseId)
      .order('position'),
  ])

  if (!course) return null

  const quizIds = (rows ?? [])
    .map((row) => oneQuiz(row.quizzes)?.id)
    .filter((id): id is string => Boolean(id))

  // One query for every quiz's question count rather than one per block.
  const { data: questionRows } = quizIds.length
    ? await supabase.from('quiz_questions').select('quiz_id').in('quiz_id', quizIds)
    : { data: [] }

  const countByQuiz = new Map<string, number>()
  for (const row of questionRows ?? []) {
    countByQuiz.set(row.quiz_id, (countByQuiz.get(row.quiz_id) ?? 0) + 1)
  }

  const blocks: BuilderBlock[] = (rows ?? []).map((row) => {
    const quizId = oneQuiz(row.quizzes)?.id
    return {
      id: row.id,
      type: row.type,
      title: row.title ?? '',
      sourceStatus: row.source_status,
      questionCount: quizId ? (countByQuiz.get(quizId) ?? 0) : 0,
    }
  })

  return {
    course: { id: course.id, businessId: course.business_id, title: course.title },
    blocks,
  }
}

/* ── One walkthrough page ──────────────────────────────────────────────── */

export type LoadedWalkthrough = {
  course: LoadedCourse
  block: WalkthroughBlock
  index: number
  total: number
  priorBlocks: PriorBlock[]
  previousBlockId: string | null
  nextBlockId: string | null
}

export async function loadWalkthrough(
  courseId: string,
  blockId: string
): Promise<LoadedWalkthrough | null> {
  const supabase = await createClient()

  const [{ data: course }, { data: rows }] = await Promise.all([
    supabase.from('courses').select('id, business_id, title').eq('id', courseId).maybeSingle(),
    supabase.from('course_blocks').select(BLOCK_COLUMNS).eq('course_id', courseId).order('position'),
  ])

  if (!course) return null

  const ordered = rows ?? []
  const index = ordered.findIndex((row) => row.id === blockId)
  if (index === -1) return null

  const row = ordered[index]
  const quiz = oneQuiz(row.quizzes)

  // Questions are only ever needed for the block being edited, so this stays a
  // single-quiz fetch rather than the whole course's.
  let questions: EditableQuestion[] = []
  if (row.type === 'quiz' && quiz) {
    // Staff read quiz_questions directly (quiz_questions_select_staff); it is
    // only the learner side that goes through the answer-stripping RPC.
    const { data: questionRows } = await supabase
      .from('quiz_questions')
      .select('id, question_text, options, correct_option, explanation, position')
      .eq('quiz_id', quiz.id)
      .order('position')

    questions = (questionRows ?? []).map((question) => ({
      id: question.id,
      questionText: question.question_text,
      options: (question.options as string[]) ?? [],
      correctOption: question.correct_option,
      explanation: question.explanation,
    }))
  }

  const block: WalkthroughBlock = {
    id: row.id,
    type: row.type,
    title: row.title ?? '',
    content: row.content_ref,
    sourceStatus: row.source_status,
    sourceError: row.source_error,
    navigationOverride: row.quiz_navigation_override,
    quiz: row.type === 'quiz' ? quizState(quiz) : null,
    questions,
  }

  const priorBlocks: PriorBlock[] = ordered.slice(0, index).map((prior, priorIndex) => ({
    id: prior.id,
    label: blockLabel(prior.title, prior.type, priorIndex),
    type: prior.type,
    sourceStatus: prior.source_status,
  }))

  return {
    course: { id: course.id, businessId: course.business_id, title: course.title },
    block,
    index,
    total: ordered.length,
    priorBlocks,
    previousBlockId: ordered[index - 1]?.id ?? null,
    nextBlockId: ordered[index + 1]?.id ?? null,
  }
}
