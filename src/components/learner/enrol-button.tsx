'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { enrolInCourse } from '@/app/(learner)/actions'

export function EnrolButton({
  courseId,
  firstBlockId,
}: {
  courseId: string
  /** Where to drop them once they are in. Null for a course with no lessons. */
  firstBlockId: string | null
}) {
  const router = useRouter()
  const [pending, startTransition] = React.useTransition()
  const [error, setError] = React.useState<string | null>(null)

  function enrol() {
    setError(null)
    startTransition(async () => {
      const result = await enrolInCourse(courseId)
      if (!result.ok) {
        setError(result.error)
        return
      }
      router.push(firstBlockId ? `/learn/${courseId}/${firstBlockId}` : `/learn/${courseId}`)
    })
  }

  return (
    <div>
      <Button size="lg" accent="coral" loading={pending} onClick={enrol}>
        Enrol in this course
      </Button>
      {error && <p className="m-0 mt-2 text-sm font-semibold text-danger-fg">{error}</p>}
    </div>
  )
}
