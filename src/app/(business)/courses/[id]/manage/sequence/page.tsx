import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { Button } from '@/components/ui'
import { CourseTabs } from '@/components/business/course-tabs'
import {
  CourseSequence,
  type BuilderBlock,
  type BuilderCourse,
} from '@/components/business/course-sequence'
import type { EditableQuestion } from '@/components/business/question-editor'
import { getBusinessContext } from '@/lib/business'
import { createClient } from '@/lib/supabase/server'
import type { QuizScope } from '@/lib/course'

export const metadata: Metadata = { title: 'Course sequence — iTutor Business' }

type QuizRow = {
  id: string
  passing_score: number
  scope: QuizScope
  scope_block_ids: string[]
  reveal_answers: boolean
  retry_max: number | null
  retry_cooldown_hours: number | null
}

/**
 * Course management, Sequence tab. Renders the same block editor the builder
 * uses, in its 'manage' variant — the tab used to link out to the builder,
 * which made the tab bar vanish when you clicked one of its own tabs.
 */
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const context = await getBusinessContext()
  if (!context) redirect('/login')

  const supabase = await createClient()
  const [{ data: course }, { data: blocks }] = await Promise.all([
    supabase
      .from('courses')
      .select('id, business_id, title, quiz_retry_max_default, quiz_retry_cooldown_hours_default')
      .eq('id', id)
      .maybeSingle(),
    supabase
      .from('course_blocks')
      .select(
        'id, type, title, content_ref, quiz_navigation_override, position, quizzes(id, passing_score, scope, scope_block_ids, reveal_answers, retry_max, retry_cooldown_hours)'
      )
      .eq('course_id', id)
      .order('position'),
  ])

  if (!course || course.business_id !== context.businessId) notFound()

  const normalised = (blocks ?? []).map((block) => {
    const embedded = block.quizzes as QuizRow | QuizRow[] | null
    return { block, quiz: Array.isArray(embedded) ? (embedded[0] ?? null) : embedded }
  })

  const quizIds = normalised.map((n) => n.quiz?.id).filter((qid): qid is string => Boolean(qid))
  const { data: questionRows } = quizIds.length
    ? await supabase
        .from('quiz_questions')
        .select('id, quiz_id, question_text, options, correct_option, explanation, position')
        .in('quiz_id', quizIds)
        .order('position')
    : { data: [] }

  const questionsByQuiz = new Map<string, EditableQuestion[]>()
  for (const row of questionRows ?? []) {
    const list = questionsByQuiz.get(row.quiz_id) ?? []
    list.push({
      id: row.id,
      questionText: row.question_text,
      options: (row.options as string[]) ?? [],
      correctOption: row.correct_option,
      explanation: row.explanation,
    })
    questionsByQuiz.set(row.quiz_id, list)
  }

  const builderCourse: BuilderCourse = {
    id: course.id,
    title: course.title,
    retryMaxDefault: course.quiz_retry_max_default,
    retryCooldownHoursDefault: course.quiz_retry_cooldown_hours_default,
  }

  const builderBlocks: BuilderBlock[] = normalised.map(({ block, quiz }) => ({
    id: block.id,
    type: block.type,
    title: block.title ?? '',
    content: block.content_ref,
    navigationOverride: block.quiz_navigation_override,
    questions: quiz ? (questionsByQuiz.get(quiz.id) ?? []) : [],
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
  }))

  return (
    <main className="mx-auto max-w-[960px] p-6 md:p-10">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0 font-display text-[28px] font-bold text-ink">{course.title}</h1>
        {/* The step-by-step build flow is still there for a course being set
            up; this tab is the same editor without the wizard around it. */}
        <Link href={`/courses/${course.id}`} className="no-underline">
          <Button variant="secondary" size="sm">
            Open the build flow
          </Button>
        </Link>
      </div>

      <CourseTabs courseId={course.id} active="sequence" />

      <CourseSequence
        variant="manage"
        course={builderCourse}
        initialBlocks={builderBlocks}
        canDelete={context.role === 'admin'}
      />
    </main>
  )
}
