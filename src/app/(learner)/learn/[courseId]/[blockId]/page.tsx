import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { ProgressBar } from '@/components/ui'
import { BlockPlayer } from '@/components/learner/block-player'
import { QuizPlayer, type QuizQuestion } from '@/components/learner/quiz-player'
import {
  MATERIAL_BUCKET,
  asText,
  asVideo,
  blockTypeMeta,
  effectiveNavigation,
  type BlockType,
} from '@/lib/course'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Lesson — iTutor' }

/**
 * One lesson of the player. A block is only reachable once its progress row
 * says so: everything after the first starts 'locked', and completing a lesson
 * is what opens the next. Editing the URL to skip ahead lands back on the
 * course page.
 */
export default async function Page({
  params,
}: {
  params: Promise<{ courseId: string; blockId: string }>
}) {
  const { courseId, blockId } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('course_id', courseId)
    .eq('learner_id', user.id)
    .maybeSingle()

  // Not enrolled: the landing page is where they enrol.
  if (!enrollment) redirect(`/learn/${courseId}`)

  const [{ data: course }, { data: blocks }, { data: progress }] = await Promise.all([
    supabase
      .from('courses')
      .select('id, title, quiz_navigation_default')
      .eq('id', courseId)
      .maybeSingle(),
    supabase
      .from('course_blocks')
      .select('id, type, title, content_ref, quiz_navigation_override, position')
      .eq('course_id', courseId)
      .order('position'),
    supabase
      .from('block_progress')
      .select('block_id, status')
      .eq('enrollment_id', enrollment.id),
  ])

  if (!course) notFound()

  const lessons = blocks ?? []
  const block = lessons.find((b) => b.id === blockId)
  if (!block) notFound()

  const statusByBlock = new Map((progress ?? []).map((p) => [p.block_id, p.status]))
  const status = statusByBlock.get(blockId)

  // The gate. A locked lesson is not reachable, however you got here.
  if (status === 'locked') redirect(`/learn/${courseId}`)

  const index = lessons.findIndex((b) => b.id === blockId)
  const completedCount = (progress ?? []).filter((p) => p.status === 'completed').length
  const percent = lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0
  const meta = blockTypeMeta(block.type as BlockType)

  /* ── Uploaded material is behind a private bucket ────────────────────── */

  /**
   * The `course-material` bucket is not public, so the file is reached through
   * a short-lived signed URL minted here — for a learner who has already
   * cleared the enrolment check above and the bucket's own can_read_course
   * policy. An hour outlasts any lesson while keeping a copied URL from
   * becoming a permanent back door into a private course.
   */
  let materialUrl: string | null = null
  const materialPath =
    block.type === 'video'
      ? asVideo(block.content_ref).path
      : block.type === 'text'
        ? asText(block.content_ref).path
        : null

  if (materialPath) {
    const { data: signed } = await supabase.storage
      .from(MATERIAL_BUCKET)
      .createSignedUrl(materialPath, 60 * 60)
    materialUrl = signed?.signedUrl ?? null
  }

  /* ── Quiz blocks need their config, questions and attempt history ────── */

  let quiz: {
    questions: QuizQuestion[]
    passingScore: number
    allowBack: boolean
    attemptsUsed: number
    attemptsAllowed: number
    alreadyPassed: boolean
  } | null = null

  if (block.type === 'quiz') {
    const { data: quizRow } = await supabase
      .from('quizzes')
      .select('id, passing_score, retry_max')
      .eq('block_id', blockId)
      .maybeSingle()

    if (quizRow) {
      // Answers never reach the browser: this RPC returns the questions with
      // correct_option stripped, and the table itself is staff-only.
      const [{ data: questions }, { data: attempts }] = await Promise.all([
        supabase.rpc('quiz_questions_for_learner', { p_quiz_id: quizRow.id }),
        supabase
          .from('quiz_attempts')
          .select('passed')
          .eq('quiz_id', quizRow.id)
          .eq('learner_id', user.id),
      ])

      quiz = {
        questions: (questions ?? []).map((q) => ({
          id: q.id,
          questionText: q.question_text,
          options: Array.isArray(q.options) ? (q.options as string[]) : [],
        })),
        passingScore: quizRow.passing_score,
        allowBack:
          effectiveNavigation(course.quiz_navigation_default, block.quiz_navigation_override) ===
          'allow_back',
        attemptsUsed: (attempts ?? []).length,
        // null means no retries, i.e. one attempt (see submitQuiz).
        attemptsAllowed: quizRow.retry_max ?? 1,
        alreadyPassed: (attempts ?? []).some((a) => a.passed),
      }
    }
  }

  return (
    <main className="mx-auto max-w-[820px] p-6 md:p-10">
      <Link
        href={`/learn/${courseId}`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted no-underline hover:text-ink"
      >
        <ArrowLeft size={15} aria-hidden /> {course.title}
      </Link>

      <div className="mb-6 mt-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#9ca3af]">
            Lesson {index + 1} of {lessons.length} · {meta.label}
          </span>
          <span className="text-xs text-[#9ca3af]">{percent}% complete</span>
        </div>
        <ProgressBar value={percent} accent="coral" />
      </div>

      <h1 className="m-0 mb-6 font-display text-[26px] font-bold leading-tight text-ink">
        {block.title?.trim() || `${meta.label} ${index + 1}`}
      </h1>

      {block.type === 'quiz' ? (
        quiz ? (
          <QuizPlayer
            courseId={courseId}
            blockId={blockId}
            questions={quiz.questions}
            passingScore={quiz.passingScore}
            allowBack={quiz.allowBack}
            attemptsUsed={quiz.attemptsUsed}
            attemptsAllowed={quiz.attemptsAllowed}
            alreadyPassed={quiz.alreadyPassed}
          />
        ) : (
          <p className="text-sm text-ink-muted">This quiz is not set up yet.</p>
        )
      ) : (
        <BlockPlayer
          courseId={courseId}
          blockId={blockId}
          type={block.type as Exclude<BlockType, 'quiz'>}
          content={block.content_ref}
          completed={status === 'completed'}
          materialUrl={materialUrl}
        />
      )}
    </main>
  )
}
