'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button, Field, Input, SegmentedControl, Select } from '@/components/ui'
import { CourseSteps } from '@/components/business/course-steps'
import {
  NAVIGATION_LABELS,
  RETRY_COOLDOWN_OPTIONS,
  retriesAllowed,
  type CourseDetails,
  type QuizNavigation,
} from '@/lib/course'
import { updateCourseDetails } from '@/app/(business)/courses/actions'

/**
 * Course Builder step 3 — the settings that only make sense once the material
 * exists. Duration is asked here rather than on step 1 because you cannot
 * estimate one for content you have not added yet, and the quiz defaults are
 * hidden entirely until the course actually contains a quiz.
 */
export function CourseDetailsForm({
  courseId,
  initial,
  hasQuiz,
  blockCount,
}: {
  courseId: string
  initial: CourseDetails
  hasQuiz: boolean
  blockCount: number
}) {
  const router = useRouter()
  const [pending, startTransition] = React.useTransition()
  const [error, setError] = React.useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({})

  const [durationLabel, setDurationLabel] = React.useState(initial.durationLabel)
  const [navigation, setNavigation] = React.useState<QuizNavigation>(initial.quizNavigationDefault)
  const [retryMax, setRetryMax] = React.useState<number | null>(initial.retryMaxDefault)
  const [retryCooldown, setRetryCooldown] = React.useState<number | null>(
    initial.retryCooldownHoursDefault
  )

  const canRetry = retriesAllowed(navigation)

  /**
   * Switching to forward-only clears retries in the same gesture. Leaving them
   * set would put the form in a state the database's CHECK constraint rejects,
   * and the user would only find out on save.
   */
  function changeNavigation(next: QuizNavigation) {
    setNavigation(next)
    if (!retriesAllowed(next)) {
      setRetryMax(null)
      setRetryCooldown(null)
    }
  }

  function save(then: () => void) {
    setError(null)
    setFieldErrors({})

    startTransition(async () => {
      const result = await updateCourseDetails(courseId, {
        durationLabel,
        quizNavigationDefault: navigation,
        retryMaxDefault: retryMax,
        retryCooldownHoursDefault: retryMax === null ? null : retryCooldown,
      })

      if (!result.ok) {
        setError(result.error)
        setFieldErrors(result.fieldErrors ?? {})
        return
      }
      then()
    })
  }

  return (
    <main className="mx-auto max-w-[880px] p-6 md:p-10">
      <CourseSteps current="details" courseId={courseId} />

      <h1 className="m-0 mb-1.5 font-display text-[28px] font-bold text-ink">Course details</h1>
      <p className="m-0 mb-8 text-sm text-ink-muted">
        {blockCount === 0
          ? 'This course has no material yet — go back and add some first.'
          : `Now that the material is in place (${blockCount} ${
              blockCount === 1 ? 'block' : 'blocks'
            }), set how it runs.`}
      </p>

      <div className="rounded-xl border border-[#f3f4f6] bg-white p-6 shadow-sm md:p-7">
        <Field
          label="Estimated duration"
          hint="How long the material above takes to get through."
          htmlFor="course-duration"
        >
          <Input
            id="course-duration"
            value={durationLabel}
            onChange={(e) => setDurationLabel(e.target.value)}
            placeholder="e.g. 2 hrs"
          />
        </Field>
      </div>

      <div className="mt-5 rounded-xl border border-[#f3f4f6] bg-white p-6 shadow-sm md:p-7">
        <h3 className="m-0 font-display text-base font-bold text-ink">Quiz defaults</h3>
        <p className="m-0 mb-5 mt-1 text-xs text-[#9ca3af]">
          Applies to every quiz block, unless overridden on the quiz itself.
        </p>

        {!hasQuiz ? (
          <p className="m-0 rounded-md border border-dashed border-surface-border px-4 py-6 text-center text-xs text-[#9ca3af]">
            No quizzes in this course yet. Add a quiz block on the previous step and these
            settings will appear.
          </p>
        ) : (
          <>
            <div>
              <span className="mb-1.5 block text-sm font-medium text-[#374151]">
                Quiz navigation
              </span>
              <SegmentedControl
                options={[
                  { value: 'allow_back', label: NAVIGATION_LABELS.allow_back },
                  { value: 'lock_forward', label: NAVIGATION_LABELS.lock_forward },
                ]}
                value={navigation}
                onChange={(v) => changeNavigation(v as QuizNavigation)}
              />
            </div>

            <div className="mt-5">
              <span className="mb-1.5 block text-sm font-medium text-[#374151]">Retries</span>
              {!canRetry ? (
                <p className="m-0 text-xs text-[#9ca3af]">
                  Not available — requires &ldquo;{NAVIGATION_LABELS.allow_back}&rdquo;
                </p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Maximum attempts"
                    htmlFor="retry-max"
                    error={fieldErrors.retryMaxDefault}
                  >
                    <Input
                      id="retry-max"
                      type="number"
                      min={1}
                      value={retryMax ?? ''}
                      placeholder="No retries"
                      onChange={(e) => {
                        const raw = e.target.value.trim()
                        setRetryMax(raw === '' ? null : Number(raw))
                      }}
                      invalid={Boolean(fieldErrors.retryMaxDefault)}
                    />
                  </Field>
                  <Field label="Wait before retry" htmlFor="retry-cooldown">
                    <Select
                      id="retry-cooldown"
                      value={retryCooldown ?? 0}
                      disabled={retryMax === null}
                      onChange={(e) => setRetryCooldown(Number(e.target.value))}
                    >
                      {RETRY_COOLDOWN_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </Field>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {error && (
        <p className="mt-4 rounded-md bg-danger-bg px-4 py-3 text-sm text-danger-fg">{error}</p>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        {/* Saves before stepping back, so nothing typed here is lost. */}
        <Button
          variant="ghost"
          loading={pending}
          onClick={() => save(() => router.push(`/courses/${courseId}`))}
        >
          <ArrowLeft size={15} /> Back to content
        </Button>
        <div className="flex items-center gap-3">
          <Link href="/courses" className="no-underline">
            <Button variant="secondary">Exit</Button>
          </Link>
          <Button
            size="lg"
            loading={pending}
            onClick={() => save(() => router.push(`/courses/${courseId}/publish`))}
          >
            Continue to publish
          </Button>
        </div>
      </div>
    </main>
  )
}
