'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui'
import { inviteToRetake } from '@/app/(business)/courses/actions'

/**
 * Offers a past student the course again.
 *
 * Deliberately confirmed rather than one-click: it creates a second enrolment
 * and unlocks the first block, which the learner will see. It does not touch
 * the completed one — their certificate, completion date and 100% all stand.
 */
export function InviteToRetake({
  courseId,
  learnerId,
  learnerName,
  courseTitle,
}: {
  courseId: string
  learnerId: string
  learnerName: string
  courseTitle: string
}) {
  const router = useRouter()
  const [confirming, setConfirming] = React.useState(false)
  const [pending, startTransition] = React.useTransition()
  const [error, setError] = React.useState<string | null>(null)
  const [done, setDone] = React.useState(false)

  function invite() {
    setError(null)
    startTransition(async () => {
      const result = await inviteToRetake(courseId, learnerId)
      if (!result.ok) {
        setError(result.error)
        return
      }
      setConfirming(false)
      setDone(true)
      router.refresh()
    })
  }

  if (done) {
    return (
      <p className="m-0 mt-2.5 text-xs font-semibold text-[var(--itutor-green)]">
        Invited to retake. Their previous completion is unchanged.
      </p>
    )
  }

  return (
    <div className="mt-3">
      {confirming ? (
        <div className="rounded-md bg-surface-inset px-3.5 py-3">
          <p className="m-0 text-xs text-ink">
            Give {learnerName.split(' ')[0]} a fresh run at{' '}
            <span className="font-semibold">{courseTitle}</span>, including the newer blocks? Their
            completed record and certificate stay exactly as they are.
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            <Button size="sm" loading={pending} onClick={invite}>
              Invite to retake
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setConfirming(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink"
        >
          <RotateCcw size={13} aria-hidden /> Invite to retake
        </button>
      )}

      {error && (
        <p className="m-0 mt-2 rounded-md bg-danger-bg px-3 py-2 text-xs text-danger-fg">{error}</p>
      )}
    </div>
  )
}
