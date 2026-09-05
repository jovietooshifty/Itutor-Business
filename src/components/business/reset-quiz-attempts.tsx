'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui'
import { resetQuizAttempts } from '@/app/(business)/courses/actions'

/**
 * Gives one learner their attempts back on one quiz.
 *
 * Confirmed rather than one-click, because it changes what a learner can do
 * without them asking — but it is not destructive, and the copy says so: the
 * scores stay on this page, they simply stop counting.
 */
export function ResetQuizAttempts({
  courseId,
  quizId,
  learnerId,
  quizTitle,
  attemptsUsed,
  attemptsAllowed,
}: {
  courseId: string
  quizId: string
  learnerId: string
  quizTitle: string
  attemptsUsed: number
  attemptsAllowed: number
}) {
  const router = useRouter()
  const [confirming, setConfirming] = React.useState(false)
  const [pending, startTransition] = React.useTransition()
  const [error, setError] = React.useState<string | null>(null)

  function reset() {
    setError(null)
    startTransition(async () => {
      const result = await resetQuizAttempts(courseId, quizId, learnerId)
      if (!result.ok) {
        setError(result.error)
        return
      }
      setConfirming(false)
      router.refresh()
    })
  }

  if (attemptsUsed === 0) return null

  return (
    <div className="mt-2">
      {confirming ? (
        <div className="rounded-md bg-surface-inset px-3 py-2.5">
          <p className="m-0 text-xs text-ink">
            Give back all {attemptsAllowed} attempt{attemptsAllowed === 1 ? '' : 's'} on{' '}
            <span className="font-semibold">{quizTitle}</span>? The{' '}
            {attemptsUsed === 1 ? 'score' : 'scores'} below stay on their record — they just stop
            counting.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button size="sm" loading={pending} onClick={reset}>
              Reset attempts
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
          <RotateCcw size={12} aria-hidden /> Reset attempts
        </button>
      )}

      {error && (
        <p className="m-0 mt-2 rounded-md bg-danger-bg px-3 py-2 text-xs text-danger-fg">{error}</p>
      )}
    </div>
  )
}
