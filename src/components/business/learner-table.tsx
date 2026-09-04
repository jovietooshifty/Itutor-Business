'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, UserMinus } from 'lucide-react'
import { Avatar, Badge, Card, Input, ProgressBar, Select, cn } from '@/components/ui'
import { removeEnrollment } from '@/app/(business)/courses/actions'
import type { LearnerRow } from '@/lib/learners'

type StatusFilter = 'all' | 'in_progress' | 'completed'
type ScoreFilter = 'all' | 'passing' | 'below' | 'none'

/** Below this a learner is flagged as struggling, matching the design's cut. */
const SCORE_THRESHOLD = 70

export function LearnerTable({
  rows,
  showCourse = false,
  canRemove = false,
  hrefBase = '/learners',
}: {
  rows: LearnerRow[]
  /** The business-wide list spans courses, so it names them per row. */
  showCourse?: boolean
  /** Admin/Operator get an unenrol control on each row. */
  canRemove?: boolean
  /**
   * Where a row leads, with the learner id appended. The course's own Learners
   * tab passes its course-scoped route so that opening a learner — and coming
   * back — stays inside the course. Left at the global directory, clicking a
   * learner from inside a course dropped you into the all-learners list.
   */
  hrefBase?: string
}) {
  const router = useRouter()
  const [search, setSearch] = React.useState('')
  const [status, setStatus] = React.useState<StatusFilter>('all')
  const [score, setScore] = React.useState<ScoreFilter>('all')
  const [confirmingId, setConfirmingId] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [pending, startTransition] = React.useTransition()

  function remove(row: LearnerRow) {
    setError(null)
    startTransition(async () => {
      const result = await removeEnrollment(row.courseId, row.enrollmentId)
      if (!result.ok) {
        setError(result.error)
        return
      }
      setConfirmingId(null)
      router.refresh()
    })
  }

  const query = search.trim().toLowerCase()
  const visible = rows.filter((row) => {
    if (status !== 'all' && row.status !== status) return false
    if (score === 'passing' && (row.latestQuizScore ?? -1) < SCORE_THRESHOLD) return false
    if (score === 'below' && (row.latestQuizScore ?? Infinity) >= SCORE_THRESHOLD) return false
    if (score === 'none' && row.latestQuizScore !== null) return false
    if (!query) return true
    return (
      row.name.toLowerCase().includes(query) ||
      row.email.toLowerCase().includes(query) ||
      (showCourse && row.courseTitle.toLowerCase().includes(query))
    )
  })

  return (
    <>
      <div className="mb-5 flex flex-wrap gap-3 rounded-xl border border-border bg-white p-4">
        <div className="relative min-w-[220px] flex-1">
          <Search
            size={15}
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search learners…"
            aria-label="Search learners"
            className="pl-9"
          />
        </div>
        <Select
          aria-label="Filter by status"
          value={status}
          onChange={(e) => setStatus(e.target.value as StatusFilter)}
          className="w-[160px]"
        >
          <option value="all">All statuses</option>
          <option value="in_progress">In progress</option>
          <option value="completed">Completed</option>
        </Select>
        <Select
          aria-label="Filter by quiz score"
          value={score}
          onChange={(e) => setScore(e.target.value as ScoreFilter)}
          className="w-[180px]"
        >
          <option value="all">Any score</option>
          <option value="passing">{SCORE_THRESHOLD}% and above</option>
          <option value="below">Below {SCORE_THRESHOLD}%</option>
          <option value="none">No quiz taken</option>
        </Select>
      </div>

      {error && (
        <p className="mb-4 rounded-md bg-danger-bg px-4 py-3 text-sm text-danger-fg">{error}</p>
      )}

      {visible.length === 0 ? (
        <Card className="py-14 text-center">
          <p className="m-0 text-sm text-ink-muted">
            {rows.length === 0 ? 'No one has enrolled yet.' : 'No learners match those filters.'}
          </p>
        </Card>
      ) : (
        <div className="grid overflow-hidden rounded-lg border border-border">
          {visible.map((row) => (
            <div
              key={row.enrollmentId}
              className="relative flex flex-wrap items-center gap-4 border-b border-border bg-white px-4 py-3.5 last:border-b-0 hover:bg-surface-inset"
            >
              {/* The row links through, but the remove control has to sit
                  outside the anchor or clicking it would navigate. */}
              <Link
                href={`${hrefBase}/${row.learnerId}`}
                className="absolute inset-0 z-0"
                aria-label={`View ${row.name}`}
              />
              <Avatar name={row.name} size={38} />

              <div className="min-w-[160px] flex-1">
                <div className="text-sm font-semibold text-ink">{row.name}</div>
                <div className="text-xs text-[#9ca3af]">{row.email}</div>
                {showCourse && (
                  <div className="mt-0.5 text-xs text-ink-muted">{row.courseTitle}</div>
                )}
              </div>

              <div className="w-[140px]">
                <div className="mb-1 text-xs text-ink-muted">{row.completionPct}% complete</div>
                <ProgressBar value={row.completionPct} />
              </div>

              <div className="w-[92px] text-sm">
                {row.latestQuizScore === null ? (
                  <span className="text-[#9ca3af]">No quiz</span>
                ) : (
                  <span
                    className={cn(
                      'font-semibold',
                      row.latestQuizScore >= SCORE_THRESHOLD
                        ? 'text-[var(--itutor-green)]'
                        : 'text-danger-fg'
                    )}
                  >
                    {row.latestQuizScore}%
                  </span>
                )}
              </div>

              {/* "Past student" is still a completion — it says the course
                  grew after they finished it, not that they fell short. */}
              <Badge tone={row.status === 'completed' ? 'success' : 'neutral'}>
                <span
                  title={
                    row.isPastStudent
                      ? `Completed before ${row.liveBlockTotal - (row.completedBlockTotal ?? 0)} ${
                          row.liveBlockTotal - (row.completedBlockTotal ?? 0) === 1
                            ? 'block was'
                            : 'blocks were'
                        } added`
                      : undefined
                  }
                >
                  {row.status !== 'completed'
                    ? 'In progress'
                    : row.isPastStudent
                      ? 'Past student'
                      : 'Completed'}
                </span>
              </Badge>

              {canRemove && (
                <div className="relative z-10 flex shrink-0 items-center gap-2">
                  {confirmingId === row.enrollmentId ? (
                    <>
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => remove(row)}
                        className="text-xs font-semibold text-danger-fg hover:underline disabled:opacity-50"
                      >
                        {pending ? 'Removing…' : 'Confirm'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmingId(null)}
                        className="text-xs font-semibold text-ink-muted hover:text-ink"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmingId(row.enrollmentId)}
                      title={`Unenrol ${row.name} from ${row.courseTitle}`}
                      aria-label={`Unenrol ${row.name} from ${row.courseTitle}`}
                      className="text-[#9ca3af] transition-colors duration-fast hover:text-[var(--danger-fg)]"
                    >
                      <UserMinus size={15} />
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
