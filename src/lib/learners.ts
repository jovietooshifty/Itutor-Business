import { createClient } from '@/lib/supabase/server'

/** One sitting of one quiz. */
export type LearnerAttempt = {
  attemptNumber: number
  score: number
  passed: boolean
  startedAt: string | null
  submittedAt: string
  /** Seconds from opening the quiz to submitting, when the start was recorded. */
  durationSeconds: number | null
}

/** One quiz in the course, and everything this learner did on it. */
export type LearnerQuiz = {
  quizId: string
  blockId: string
  title: string
  passingScore: number
  /** retry_max is the TOTAL allowed; null means a single attempt. */
  attemptsAllowed: number
  attemptsUsed: number
  bestScore: number | null
  latestScore: number | null
  passed: boolean
  /** Oldest first. */
  attempts: LearnerAttempt[]
}

export type LearnerRow = {
  enrollmentId: string
  learnerId: string
  name: string
  email: string
  courseId: string
  courseTitle: string
  enrolledAt: string
  status: 'in_progress' | 'completed'
  /** Which time round this is for this (course, learner). 1 for the original. */
  cycle: number
  /** 0-100. For a completed enrolment this is measured against the block count
   *  at completion, so it stays at 100 — see completedBlockTotal. */
  completionPct: number
  /** Blocks this enrolment was actually given. Null until it completes. */
  completedBlockTotal: number | null
  /** Blocks the course has now. */
  liveBlockTotal: number
  /**
   * Finished the course, and it has grown since. Their record is complete and
   * stays complete; they simply have not seen the newer material.
   */
  isPastStudent: boolean
  /** Most recent quiz score in this course, or null if they've sat none. */
  latestQuizScore: number | null
  /** Every quiz in the course that this learner has attempted, in course order. */
  quizzes: LearnerQuiz[]
}

type EnrollmentRow = {
  id: string
  learner_id: string
  course_id: string
  status: 'in_progress' | 'completed'
  enrolled_at: string
  cycle: number
  completed_block_total: number | null
  users: { full_name: string | null; email: string } | null
  courses: { title: string } | null
}

/**
 * Turns enrolments into the rows both learner views render. Progress and quiz
 * scores live in separate tables, so they are fetched per batch rather than
 * per row — the alternative is a query per learner.
 *
 * Everything here reads through the caller's session: RLS
 * (enrollments_select_business, block_progress_select_business,
 * quiz_attempts_select_business, users_select_visible_learner) is what limits
 * this to learners of the caller's own courses.
 */
async function buildRows(enrollments: EnrollmentRow[]): Promise<LearnerRow[]> {
  if (enrollments.length === 0) return []

  const supabase = await createClient()
  const enrollmentIds = enrollments.map((e) => e.id)
  const courseIds = Array.from(new Set(enrollments.map((e) => e.course_id)))
  const learnerIds = Array.from(new Set(enrollments.map((e) => e.learner_id)))

  const [{ data: blocks }, { data: progress }] = await Promise.all([
    supabase
      .from('course_blocks')
      .select('id, course_id, type, title, position')
      .in('course_id', courseIds)
      .order('position'),
    supabase
      .from('block_progress')
      .select('enrollment_id, status')
      .in('enrollment_id', enrollmentIds),
  ])

  const blockTotals = new Map<string, number>()
  for (const block of blocks ?? []) {
    blockTotals.set(block.course_id, (blockTotals.get(block.course_id) ?? 0) + 1)
  }

  const completedByEnrollment = new Map<string, number>()
  for (const row of progress ?? []) {
    if (row.status !== 'completed') continue
    completedByEnrollment.set(
      row.enrollment_id,
      (completedByEnrollment.get(row.enrollment_id) ?? 0) + 1
    )
  }

  // Quiz scores hang off quizzes, which hang off blocks — so map each quiz
  // back to its course before matching attempts to enrolments.
  const quizBlocks = (blocks ?? []).filter((b) => b.type === 'quiz')
  const blockById = new Map((blocks ?? []).map((b) => [b.id, b]))

  /** learnerId:courseId → that learner's quizzes in this course. */
  const quizzesByLearnerCourse = new Map<string, LearnerQuiz[]>()

  if (quizBlocks.length > 0) {
    const { data: quizzes } = await supabase
      .from('quizzes')
      .select('id, block_id, passing_score, retry_max')
      .in(
        'block_id',
        quizBlocks.map((b) => b.id)
      )

    if (quizzes?.length) {
      const { data: attempts } = await supabase
        .from('quiz_attempts')
        .select('quiz_id, learner_id, score, passed, attempt_number, started_at, submitted_at, attempted_at')
        .in(
          'quiz_id',
          quizzes.map((q) => q.id)
        )
        .in('learner_id', learnerIds)

      /** quizId:learnerId → attempts, oldest first. */
      const byQuizLearner = new Map<string, LearnerAttempt[]>()
      for (const attempt of attempts ?? []) {
        const submittedAt = attempt.submitted_at ?? attempt.attempted_at
        const startedAt = attempt.started_at ?? null
        const key = `${attempt.quiz_id}:${attempt.learner_id}`
        const list = byQuizLearner.get(key) ?? []
        list.push({
          // Null only for rows written before attempt_number existed and
          // somehow missed the backfill; position in the sorted list is the
          // same answer.
          attemptNumber: attempt.attempt_number ?? list.length + 1,
          score: attempt.score,
          passed: attempt.passed,
          startedAt,
          submittedAt,
          durationSeconds: startedAt
            ? Math.max(
                0,
                Math.round((Date.parse(submittedAt) - Date.parse(startedAt)) / 1000)
              )
            : null,
        })
        byQuizLearner.set(key, list)
      }
      for (const list of byQuizLearner.values()) {
        list.sort((a, b) => a.attemptNumber - b.attemptNumber)
      }

      /* Quizzes are walked in course order (the blocks query is ordered by
         position), so each learner's list comes out in the order they meet
         them rather than in whatever order PostgREST returned the quizzes. */
      const orderedQuizzes = quizBlocks
        .map((block) => ({ block, quiz: quizzes.find((q) => q.block_id === block.id) }))
        .filter((pair): pair is { block: (typeof quizBlocks)[number]; quiz: NonNullable<typeof pair.quiz> } =>
          Boolean(pair.quiz)
        )

      for (const learnerId of learnerIds) {
        for (const { block, quiz } of orderedQuizzes) {
          const sat = byQuizLearner.get(`${quiz.id}:${learnerId}`)
          if (!sat?.length) continue

          const courseId = block.course_id
          const key = `${learnerId}:${courseId}`
          const list = quizzesByLearnerCourse.get(key) ?? []
          list.push({
            quizId: quiz.id,
            blockId: block.id,
            title: block.title || blockById.get(block.id)?.title || 'Quiz',
            passingScore: quiz.passing_score,
            attemptsAllowed: quiz.retry_max ?? 1,
            attemptsUsed: sat.length,
            bestScore: Math.max(...sat.map((a) => a.score)),
            latestScore: sat[sat.length - 1].score,
            passed: sat.some((a) => a.passed),
            attempts: sat,
          })
          quizzesByLearnerCourse.set(key, list)
        }
      }
    }
  }

  return enrollments.map((enrollment) => {
    const liveBlockTotal = blockTotals.get(enrollment.course_id) ?? 0
    const done = completedByEnrollment.get(enrollment.id) ?? 0
    const completed = enrollment.status === 'completed'

    /* Completion is a share of what this enrolment was actually given, not of
       what the course holds today. block_progress rows are created at
       enrolment, so a block added later was never on their path — measuring
       against the live count was quietly demoting people who had finished. */
    const denominator = completed
      ? (enrollment.completed_block_total ?? done ?? liveBlockTotal)
      : liveBlockTotal

    const quizzes = quizzesByLearnerCourse.get(`${enrollment.learner_id}:${enrollment.course_id}`) ?? []
    const lastQuiz = quizzes[quizzes.length - 1]

    return {
      enrollmentId: enrollment.id,
      learnerId: enrollment.learner_id,
      name: enrollment.users?.full_name || enrollment.users?.email || 'Learner',
      email: enrollment.users?.email ?? '',
      courseId: enrollment.course_id,
      courseTitle: enrollment.courses?.title ?? 'Course',
      enrolledAt: enrollment.enrolled_at,
      status: enrollment.status,
      cycle: enrollment.cycle,
      completionPct: denominator ? Math.min(100, Math.round((done / denominator) * 100)) : 0,
      completedBlockTotal: enrollment.completed_block_total,
      liveBlockTotal,
      isPastStudent: completed && liveBlockTotal > (enrollment.completed_block_total ?? done),
      latestQuizScore: lastQuiz?.latestScore ?? null,
      quizzes,
    }
  })
}

const ENROLLMENT_SELECT =
  'id, learner_id, course_id, status, enrolled_at, cycle, completed_block_total, users(full_name, email), courses(title)'

/**
 * Narrows a set of rows to the current enrolment per (course, learner).
 *
 * A retake is a second enrolment for the same pair rather than a reset of the
 * first, so the raw loaders return every cycle — which is the history an admin
 * wants on a learner's record, and double-counting on a roster. Any surface
 * answering "who is on this course" applies this; the learner record does not.
 */
export function currentCycles(rows: LearnerRow[]): LearnerRow[] {
  const best = new Map<string, LearnerRow>()
  for (const row of rows) {
    const key = `${row.courseId}:${row.learnerId}`
    const held = best.get(key)
    if (!held || row.cycle > held.cycle) best.set(key, row)
  }
  // Map preserves insertion order, which is the loaders' enrolled_at ordering.
  return rows.filter((row) => best.get(`${row.courseId}:${row.learnerId}`) === row)
}

/** Everyone enrolled in one course. Every cycle — see currentCycles(). */
export async function loadCourseLearners(courseId: string): Promise<LearnerRow[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('enrollments')
    .select(ENROLLMENT_SELECT)
    .eq('course_id', courseId)
    .order('enrolled_at', { ascending: false })

  return buildRows((data ?? []) as unknown as EnrollmentRow[])
}

/** Everyone enrolled in any of a business's courses. Every cycle. */
export async function loadBusinessLearners(businessId: string): Promise<LearnerRow[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('enrollments')
    .select(ENROLLMENT_SELECT)
    .eq('business_id', businessId)
    .order('enrolled_at', { ascending: false })

  return buildRows((data ?? []) as unknown as EnrollmentRow[])
}
