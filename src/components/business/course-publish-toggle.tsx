'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Globe, Lock } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import type { CourseStatus, CourseVisibility } from '@/lib/course'
import { publishCourse, unpublishCourse } from '@/app/(business)/courses/actions'

/**
 * Publishing, as a control on the Settings tab.
 *
 * The Overview tab used to carry a button labelled "Publishing" — a status
 * wearing a button's clothes, which then routed into the build flow to say the
 * same thing the badge beside the course title already says. Status belongs to
 * that badge; the *action* belongs here, next to the other course-level
 * settings, and does the work in place.
 */
export function CoursePublishToggle({
  courseId,
  status,
  visibility,
  blockCount,
  hasTitle,
}: {
  courseId: string
  status: CourseStatus
  visibility: CourseVisibility
  blockCount: number
  hasTitle: boolean
}) {
  const router = useRouter()
  const [pending, startTransition] = React.useTransition()
  const [error, setError] = React.useState<string | null>(null)

  const published = status === 'published'
  // The same two gates publishCourse() enforces, so the button explains itself
  // instead of failing on press.
  const blocker = !hasTitle
    ? 'Give the course a title above before publishing.'
    : blockCount === 0
      ? 'Add at least one block before publishing.'
      : null

  function toggle() {
    setError(null)
    startTransition(async () => {
      const result = published ? await unpublishCourse(courseId) : await publishCourse(courseId)
      if (!result.ok) {
        setError(result.error)
        return
      }
      router.refresh()
    })
  }

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="m-0 flex items-center gap-2 font-display text-base font-bold text-ink">
            {published ? <Globe size={16} aria-hidden /> : <Lock size={16} aria-hidden />}
            {published ? 'This course is live' : 'This course is not published'}
          </h3>
          <p className="m-0 mt-1 text-sm text-ink-muted">
            {published
              ? visibility === 'public'
                ? 'Listed in the marketplace, and joinable by its share link.'
                : 'Hidden from the marketplace, but joinable by its share link.'
              : 'Nobody outside your business can reach it — not by link, not by search.'}
          </p>
          {blocker && !published && (
            <p className="m-0 mt-1.5 text-xs font-semibold text-[#b45309]">{blocker}</p>
          )}
        </div>

        <Button
          variant={published ? 'secondary' : 'primary'}
          loading={pending}
          disabled={!published && Boolean(blocker)}
          onClick={toggle}
        >
          {published ? 'Unpublish' : 'Publish course'}
        </Button>
      </div>

      {error && (
        <p className="mt-3 rounded-md bg-danger-bg px-3 py-2 text-sm text-danger-fg">{error}</p>
      )}
    </Card>
  )
}
