import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import {
  CourseSequence,
  type BuilderBlock,
  type BuilderCourse,
} from '@/components/business/course-sequence'
import { getBusinessContext } from '@/lib/business'
import { createClient } from '@/lib/supabase/server'
import type { QuizScope } from '@/lib/course'

export const metadata: Metadata = { title: 'Course builder — iTutor Business' }

type QuizRow = {
  passing_score: number
  scope: QuizScope
  scope_block_ids: string[]
  reveal_answers: boolean
  retry_max: number | null
  retry_cooldown_hours: number | null
}

/** Course Builder screen 2 — the lesson sequence for one course. */
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const context = await getBusinessContext()
  if (!context) redirect('/login')

  const supabase = await createClient()

  const [{ data: course }, { data: blocks }] = await Promise.all([
    supabase
      .from('courses')
      .select(
        'id, business_id, title, quiz_navigation_default, quiz_retry_max_default, quiz_retry_cooldown_hours_default'
      )
      .eq('id', id)
      .maybeSingle(),
    supabase
      .from('course_blocks')
      .select(
        'id, type, title, content_ref, quiz_navigation_override, position, quizzes(passing_score, scope, scope_block_ids, reveal_answers, retry_max, retry_cooldown_hours)'
      )
      .eq('course_id', id)
      .order('position'),
  ])

  // RLS already hides other businesses' courses, so a miss here is a 404 rather
  // than a permission error — but check the owner explicitly so a course that
  // is merely *visible* (a public one) can never be opened in the editor.
  if (!course || course.business_id !== context.businessId) notFound()

  const builderCourse: BuilderCourse = {
    id: course.id,
    title: course.title,
    quizNavigationDefault: course.quiz_navigation_default,
    retryMaxDefault: course.quiz_retry_max_default,
    retryCooldownHoursDefault: course.quiz_retry_cooldown_hours_default,
  }

  const builderBlocks: BuilderBlock[] = (blocks ?? []).map((block) => {
    // The embed is one-to-one (quizzes.block_id is unique) but PostgREST still
    // hands it back as an array on some shapes, so normalise both.
    const embedded = block.quizzes as QuizRow | QuizRow[] | null
    const quiz = Array.isArray(embedded) ? (embedded[0] ?? null) : embedded

    return {
      id: block.id,
      type: block.type,
      title: block.title ?? '',
      content: block.content_ref,
      navigationOverride: block.quiz_navigation_override,
      quiz:
        block.type === 'quiz'
          ? {
              passingScore: quiz?.passing_score ?? 80,
              scope: quiz?.scope ?? 'preceding_block',
              scopeBlockIds: quiz?.scope_block_ids ?? [],
              revealAnswers: quiz?.reveal_answers ?? false,
              retryMax: quiz?.retry_max ?? null,
              retryCooldownHours: quiz?.retry_cooldown_hours ?? null,
            }
          : null,
    }
  })

  return (
    <CourseSequence
      course={builderCourse}
      initialBlocks={builderBlocks}
      canDelete={context.role === 'admin'}
    />
  )
}
