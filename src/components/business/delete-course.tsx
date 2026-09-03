'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { Button, Card, Input } from '@/components/ui'
import { deleteCourse } from '@/app/(business)/courses/actions'

/**
 * Deleting a course takes its blocks, quizzes, enrolments, progress AND any
 * certificates already issued from it — all cascading foreign keys. That is
 * not recoverable, so it asks for the course title rather than a yes/no.
 */
export function DeleteCourse({
  courseId,
  courseTitle,
  enrolledCount,
  isAdmin,
}: {
  courseId: string
  courseTitle: string
  enrolledCount: number
  isAdmin: boolean
}) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [confirm, setConfirm] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [pending, startTransition] = React.useTransition()

  const matches = confirm.trim() === courseTitle.trim()

  function remove() {
    setError(null)
    startTransition(async () => {
      const result = await deleteCourse(courseId)
      if (!result.ok) {
        setError(result.error)
        return
      }
      router.push('/courses')
      router.refresh()
    })
  }

  return (
    <Card className="mt-5 border-[color:var(--danger-fg)]/25 p-6">
      <h2 className="m-0 font-display text-base font-bold text-ink">Delete this course</h2>
      <p className="m-0 mt-1 text-sm text-ink-muted">
        Removes the course, its content and every enrolment
        {enrolledCount > 0 && ` — including ${enrolledCount} learner${enrolledCount === 1 ? '' : 's'} currently enrolled`}
        . Certificates issued from it go too. This cannot be undone.
      </p>

      {!isAdmin ? (
        <p className="m-0 mt-3 text-xs font-semibold text-[#9ca3af]">
          Only an admin can delete a course.
        </p>
      ) : !open ? (
        <div className="mt-4">
          <Button variant="danger" onClick={() => setOpen(true)}>
            <Trash2 size={15} /> Delete course
          </Button>
        </div>
      ) : (
        <div className="mt-4">
          <label htmlFor="confirm-title" className="mb-1.5 block text-sm text-ink">
            Type <span className="font-semibold">{courseTitle}</span> to confirm
          </label>
          <div className="flex flex-wrap gap-2">
            <Input
              id="confirm-title"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder={courseTitle}
              className="max-w-[320px]"
            />
            <Button variant="danger" loading={pending} disabled={!matches} onClick={remove}>
              Delete permanently
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setOpen(false)
                setConfirm('')
                setError(null)
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-3 rounded-md bg-danger-bg px-3 py-2 text-sm text-danger-fg">{error}</p>
      )}
    </Card>
  )
}
