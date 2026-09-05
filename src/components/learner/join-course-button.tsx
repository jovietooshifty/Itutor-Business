'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { enrolInCourse } from '@/app/(learner)/actions'

/**
 * Joins a course straight from the marketplace card.
 *
 * Browsing and joining were the same click before this: the whole tile linked
 * to the course page, and enrolling meant getting there and finding the button.
 *
 * Failure is worth showing in place rather than swallowing — enrolInCourse
 * refuses anyone without a photo and a resume on file, and that refusal is the
 * one thing a learner most needs to read.
 */
export function JoinCourseButton({ courseId }: { courseId: string }) {
  const router = useRouter()
  const [pending, startTransition] = React.useTransition()
  const [error, setError] = React.useState<string | null>(null)

  function join() {
    setError(null)
    startTransition(async () => {
      const result = await enrolInCourse(courseId)
      if (!result.ok) {
        setError(result.error)
        return
      }
      router.push(`/learn/${courseId}`)
      router.refresh()
    })
  }

  return (
    <div className="relative z-10 flex flex-col items-end gap-1.5">
      <Button
        accent="coral"
        size="sm"
        loading={pending}
        onClick={(e) => {
          // The whole tile is a link underneath; this must not also follow it.
          e.preventDefault()
          e.stopPropagation()
          join()
        }}
      >
        Join
      </Button>
      {error && (
        <p className="m-0 max-w-[220px] text-right text-[11px] leading-snug text-danger-fg">
          {error}
        </p>
      )}
    </div>
  )
}
