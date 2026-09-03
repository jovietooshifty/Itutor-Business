import { createClient } from '@/lib/supabase/server'

export type LearnerRow = {
  enrollmentId: string
  learnerId: string
  name: string
  email: string
  courseId: string
  courseTitle: string
  enrolledAt: string
  status: 'in_progress' | 'completed'
  /** 0-100, share of the course's blocks marked complete. */
  completionPct: number
  /** Most recent quiz score in this course, or null if they've sat none. */
  latestQuizScore: number | null
}

type EnrollmentRow = {
  id: string
  learner_id: string
  course_id: string
  status: 'in_progress' | 'completed'
  enrolled_at: string
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
    supabase.from('course_blocks').select('id, course_id, type').in('course_id', courseIds),
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
  const quizBlockIds = (blocks ?? []).filter((b) => b.type === 'quiz').map((b) => b.id)
  const courseByBlock = new Map((blocks ?? []).map((b) => [b.id, b.course_id]))

  const latestScore = new Map<string, { score: number; at: string }>()
  if (quizBlockIds.length > 0) {
    const { data: quizzes } = await supabase
      .from('quizzes')
      .select('id, block_id')
      .in('block_id', quizBlockIds)

    const courseByQuiz = new Map(
      (quizzes ?? []).map((q) => [q.id, courseByBlock.get(q.block_id) ?? null])
    )

    if (quizzes?.length) {
      const { data: attempts } = await supabase
        .from('quiz_attempts')
        .select('quiz_id, learner_id, score, attempted_at')
        .in(
          'quiz_id',
          quizzes.map((q) => q.id)
        )
        .in('learner_id', learnerIds)

      for (const attempt of attempts ?? []) {
        const courseId = courseByQuiz.get(attempt.quiz_id)
        if (!courseId) continue
        const key = `${attempt.learner_id}:${courseId}`
        const held = latestScore.get(key)
        if (!held || attempt.attempted_at > held.at) {
          latestScore.set(key, { score: attempt.score, at: attempt.attempted_at })
        }
      }
    }
  }

  return enrollments.map((enrollment) => {
    const total = blockTotals.get(enrollment.course_id) ?? 0
    const done = completedByEnrollment.get(enrollment.id) ?? 0

    return {
      enrollmentId: enrollment.id,
      learnerId: enrollment.learner_id,
      name: enrollment.users?.full_name || enrollment.users?.email || 'Learner',
      email: enrollment.users?.email ?? '',
      courseId: enrollment.course_id,
      courseTitle: enrollment.courses?.title ?? 'Course',
      enrolledAt: enrollment.enrolled_at,
      status: enrollment.status,
      completionPct: total ? Math.round((done / total) * 100) : 0,
      latestQuizScore: latestScore.get(`${enrollment.learner_id}:${enrollment.course_id}`)?.score ?? null,
    }
  })
}

const ENROLLMENT_SELECT =
  'id, learner_id, course_id, status, enrolled_at, users(full_name, email), courses(title)'

/** Everyone enrolled in one course. */
export async function loadCourseLearners(courseId: string): Promise<LearnerRow[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('enrollments')
    .select(ENROLLMENT_SELECT)
    .eq('course_id', courseId)
    .order('enrolled_at', { ascending: false })

  return buildRows((data ?? []) as unknown as EnrollmentRow[])
}

/** Everyone enrolled in any of a business's courses. */
export async function loadBusinessLearners(businessId: string): Promise<LearnerRow[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('enrollments')
    .select(ENROLLMENT_SELECT)
    .eq('business_id', businessId)
    .order('enrolled_at', { ascending: false })

  return buildRows((data ?? []) as unknown as EnrollmentRow[])
}
