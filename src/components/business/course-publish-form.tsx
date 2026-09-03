'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, CircleAlert, Globe, Lock } from 'lucide-react'
import { Badge, Button } from '@/components/ui'
import { CourseSteps } from '@/components/business/course-steps'
import { NAVIGATION_LABELS, type CourseStatus, type CourseVisibility, type QuizNavigation } from '@/lib/course'
import { publishCourse, unpublishCourse } from '@/app/(business)/courses/actions'

/**
 * Course Builder step 4 — Review & publish (build step 6). A published course
 * becomes reachable outside the business: listed in the marketplace if public,
 * or resolvable by its share link either way. Nothing crosses that line until
 * this screen's Publish button is pressed — see
 * 20260903000100_course_publish_status.sql.
 */
export function CoursePublishForm({
  courseId,
  status,
  title,
  description,
  thumbnailUrl,
  visibility,
  durationLabel,
  blockSummary,
  blockCount,
  hasQuiz,
  quizNavigationDefault,
  quizRetryMaxDefault,
}: {
  courseId: string
  status: CourseStatus
  title: string
  description: string | null
  thumbnailUrl: string | null
  visibility: CourseVisibility
  durationLabel: string | null
  blockSummary: { label: string; count: number }[]
  blockCount: number
  hasQuiz: boolean
  quizNavigationDefault: QuizNavigation
  quizRetryMaxDefault: number | null
}) {
  const [pending, startTransition] = React.useTransition()
  const [error, setError] = React.useState<string | null>(null)

  const missingTitle = !title.trim()
  const missingBlocks = blockCount === 0
  const ready = !missingTitle && !missingBlocks

  function toggle() {
    setError(null)
    startTransition(async () => {
      const result = status === 'published' ? await unpublishCourse(courseId) : await publishCourse(courseId)
      if (!result.ok) {
        setError(result.error)
        return
      }
    })
  }

  return (
    <main className="mx-auto max-w-[880px] p-6 md:p-10">
      <CourseSteps current="publish" courseId={courseId} />

      <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
        <h1 className="m-0 font-display text-[28px] font-bold text-ink">Review &amp; publish</h1>
        <Badge tone={status === 'published' ? 'success' : 'neutral'}>
          {status === 'published' ? 'Published' : 'Draft'}
        </Badge>
      </div>
      <p className="m-0 mb-8 text-sm text-ink-muted">
        {status === 'published'
          ? visibility === 'public'
            ? 'Live and listed in the marketplace.'
            : 'Live — joinable only via its share link.'
          : 'Invisible outside your business until you publish it.'}
      </p>

      <div className="rounded-xl border border-[#f3f4f6] bg-white p-6 shadow-sm md:p-7">
        <div className="flex flex-wrap items-start gap-4">
          {thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnailUrl}
              alt=""
              className="h-[70px] w-[100px] shrink-0 rounded-lg object-cover"
            />
          ) : (
            <div className="grid h-[70px] w-[100px] shrink-0 place-items-center rounded-lg bg-surface-inset text-xs text-[#9ca3af]">
              No thumbnail
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h2 className="m-0 font-display text-h4 font-bold text-ink">
              {title.trim() || 'Untitled course'}
            </h2>
            {description && (
              <p className="m-0 mt-1 line-clamp-2 text-sm text-ink-muted">{description}</p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#9ca3af]">
              <span className="inline-flex items-center gap-1">
                {visibility === 'public' ? <Globe size={12} /> : <Lock size={12} />}
                {visibility === 'public' ? 'Public' : 'Private'}
              </span>
              {durationLabel && <span>{durationLabel}</span>}
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-surface-border pt-5">
          <h3 className="m-0 mb-2 text-sm font-semibold text-ink">Content</h3>
          {blockCount === 0 ? (
            <p className="m-0 text-sm text-[#9ca3af]">No blocks yet.</p>
          ) : (
            <p className="m-0 text-sm text-ink-muted">
              {blockSummary.map((b) => `${b.count} ${b.label.toLowerCase()}${b.count > 1 ? 's' : ''}`).join(', ')}
            </p>
          )}
        </div>

        <div className="mt-5 border-t border-surface-border pt-5">
          <h3 className="m-0 mb-2 text-sm font-semibold text-ink">Quiz behavior</h3>
          {!hasQuiz ? (
            <p className="m-0 text-sm text-[#9ca3af]">No quizzes in this course.</p>
          ) : (
            <p className="m-0 text-sm text-ink-muted">
              {NAVIGATION_LABELS[quizNavigationDefault]}
              {quizRetryMaxDefault !== null && ` · up to ${quizRetryMaxDefault} attempt${quizRetryMaxDefault > 1 ? 's' : ''} per quiz`}
            </p>
          )}
        </div>
      </div>

      {!ready && (
        <div className="mt-4 rounded-md border border-[#fde68a] bg-[#fffbeb] px-4 py-3">
          <p className="m-0 flex items-center gap-2 text-sm font-semibold text-[#92400e]">
            <CircleAlert size={15} /> Not ready to publish
          </p>
          <ul className="m-0 mt-1.5 list-disc pl-5 text-sm text-[#92400e]">
            {missingTitle && <li>Add a title — step 1, Basics.</li>}
            {missingBlocks && <li>Add at least one block — step 2, Content.</li>}
          </ul>
        </div>
      )}

      {ready && status === 'published' && (
        <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-[var(--itutor-green)]">
          <CheckCircle2 size={15} /> This course is live.
        </p>
      )}

      {error && (
        <p className="mt-4 rounded-md bg-danger-bg px-4 py-3 text-sm text-danger-fg">{error}</p>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <Link href={`/courses/${courseId}/details`} className="no-underline">
          <Button variant="ghost">
            <ArrowLeft size={15} /> Back to details
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/courses" className="no-underline">
            <Button variant="secondary">Exit</Button>
          </Link>
          {status === 'published' ? (
            <Button variant="danger" size="lg" loading={pending} onClick={toggle}>
              Unpublish
            </Button>
          ) : (
            <Button size="lg" loading={pending} disabled={!ready} onClick={toggle}>
              Publish
            </Button>
          )}
        </div>
      </div>
    </main>
  )
}
