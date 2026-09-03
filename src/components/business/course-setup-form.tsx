'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X } from 'lucide-react'
import { Button, Field, Input, Select, Textarea, cn } from '@/components/ui'
import { ImageUpload } from '@/components/ui/image-upload'
import {
  COURSE_TAG_SUGGESTIONS,
  NAVIGATION_LABELS,
  RETRY_COOLDOWN_OPTIONS,
  retriesAllowed,
  type CourseSetupInitial,
  type CourseVisibility,
  type QuizNavigation,
} from '@/lib/course'
import { createCourse, type CourseSetupInput } from '@/app/(business)/courses/actions'

/**
 * Course Builder screen 1 — "Create a course". Collects the basics, then hands
 * off to the sequence builder.
 *
 * "What you'll learn" is on this screen deliberately. Handoff §7 flags it as an
 * orphaned data binding on the course landing page with no admin-editable
 * source; `courses.what_you_will_learn` exists in the schema, so this is that
 * source.
 */
export function CourseSetupForm({ initial }: { initial: CourseSetupInitial }) {
  const router = useRouter()
  const [pending, startTransition] = React.useTransition()
  const [error, setError] = React.useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({})

  const [title, setTitle] = React.useState(initial.title)
  const [description, setDescription] = React.useState(initial.description)
  const [durationLabel, setDurationLabel] = React.useState(initial.durationLabel)
  const [visibility, setVisibility] = React.useState<CourseVisibility>(initial.visibility)
  const [tags, setTags] = React.useState<string[]>(initial.tags)
  const [outcomes, setOutcomes] = React.useState<string[]>(initial.whatYouWillLearn)
  const [outcomeDraft, setOutcomeDraft] = React.useState('')
  const [thumbnailUrl, setThumbnailUrl] = React.useState(initial.thumbnailUrl)

  const [navigation, setNavigation] = React.useState<QuizNavigation>(
    initial.quizNavigationDefault
  )
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

  function addOutcome() {
    const value = outcomeDraft.trim()
    if (!value) return
    setOutcomes((prev) => [...prev, value])
    setOutcomeDraft('')
  }

  function submit() {
    setError(null)
    setFieldErrors({})

    const input: CourseSetupInput = {
      title,
      description,
      durationLabel,
      visibility,
      tags,
      whatYouWillLearn: outcomes,
      thumbnailUrl,
      quizNavigationDefault: navigation,
      retryMaxDefault: retryMax,
      retryCooldownHoursDefault: retryMax === null ? null : retryCooldown,
    }

    startTransition(async () => {
      const result = await createCourse(input)
      if (!result.ok) {
        setError(result.error)
        setFieldErrors(result.fieldErrors ?? {})
        return
      }
      router.push(`/courses/${result.data!.id}`)
    })
  }

  const suggestions = COURSE_TAG_SUGGESTIONS.filter((t) => !tags.includes(t))

  return (
    <main className="mx-auto max-w-[880px] p-6 md:p-10">
      <h1 className="m-0 mb-1.5 font-display text-[28px] font-bold text-ink">Create a course</h1>
      <p className="m-0 mb-8 text-sm text-ink-muted">
        Set up the basics — you&apos;ll build the lesson sequence next.
      </p>

      <div className="rounded-xl border border-[#f3f4f6] bg-white p-6 shadow-sm md:p-7">
        <div className="flex flex-col gap-5 sm:flex-row">
          <ImageUpload
            bucket="business-assets"
            path={`${initial.businessId}/course-thumbnails`}
            value={thumbnailUrl}
            onChange={setThumbnailUrl}
            shape="rect"
            width={140}
            height={100}
            placeholder="Thumbnail"
            className="shrink-0"
          />
          <div className="flex-1">
            <Field label="Course title" htmlFor="course-title" error={fieldErrors.title}>
              <Input
                id="course-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Food Safety & Sanitation Basics"
                invalid={Boolean(fieldErrors.title)}
              />
            </Field>
          </div>
        </div>

        <Field
          className="mt-6"
          label="Short description"
          hint="Shown on marketplace cards."
          htmlFor="course-description"
        >
          <Textarea
            id="course-description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What will learners get out of this course?"
          />
        </Field>

        <div className="mt-6">
          <span className="mb-1.5 block text-sm font-medium text-[#374151]">Category / tags</span>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 rounded-full bg-brand-light px-3 py-1.5 text-[13px] font-semibold text-[var(--itutor-green)]"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}
                  aria-label={`Remove ${tag}`}
                  className="cursor-pointer opacity-70 hover:opacity-100"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            {suggestions.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setTags((prev) => [...prev, tag])}
                className="inline-flex items-center gap-1 rounded-full border border-dashed border-surface-border px-3 py-1.5 text-[13px] text-ink-muted transition-colors duration-fast hover:border-[color:var(--itutor-green)] hover:text-[var(--itutor-green)]"
              >
                <Plus size={12} /> {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <span className="mb-1.5 block text-sm font-medium text-[#374151]">
            What learners will be able to do
          </span>
          <p className="mb-2 text-xs text-[#9ca3af]">
            One outcome per line. These appear on the course landing page.
          </p>
          {outcomes.length > 0 && (
            <ul className="mb-2 grid list-none gap-2 p-0">
              {outcomes.map((outcome, index) => (
                <li
                  key={`${outcome}-${index}`}
                  className="flex items-center justify-between gap-3 rounded-md bg-surface-inset px-3 py-2 text-sm text-ink"
                >
                  {outcome}
                  <button
                    type="button"
                    onClick={() => setOutcomes((prev) => prev.filter((_, i) => i !== index))}
                    aria-label={`Remove "${outcome}"`}
                    className="shrink-0 text-ink-muted hover:text-ink"
                  >
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="flex gap-2">
            <Input
              value={outcomeDraft}
              onChange={(e) => setOutcomeDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addOutcome()
                }
              }}
              placeholder="e.g. Store and label food safely"
            />
            <Button type="button" variant="secondary" onClick={addOutcome}>
              Add
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <span className="mb-1.5 block text-sm font-medium text-[#374151]">Visibility</span>
            <SegmentedControl
              options={[
                { value: 'public', label: 'Public' },
                { value: 'private', label: 'Private' },
              ]}
              value={visibility}
              onChange={(v) => setVisibility(v as CourseVisibility)}
            />
            <p className="mt-1.5 text-xs text-[#9ca3af]">
              {visibility === 'public'
                ? 'Listed in the marketplace and joinable by anyone.'
                : 'Hidden from the marketplace — joinable only via a share link.'}
            </p>
          </div>

          <Field label="Estimated duration" htmlFor="course-duration">
            <Input
              id="course-duration"
              value={durationLabel}
              onChange={(e) => setDurationLabel(e.target.value)}
              placeholder="e.g. 2 hrs"
            />
          </Field>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-[#f3f4f6] bg-white p-6 shadow-sm md:p-7">
        <h3 className="m-0 font-display text-base font-bold text-ink">Quiz defaults</h3>
        <p className="m-0 mb-5 mt-1 text-xs text-[#9ca3af]">
          Applies to every quiz block, unless overridden per quiz.
        </p>

        <div>
          <span className="mb-1.5 block text-sm font-medium text-[#374151]">Quiz navigation</span>
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
      </div>

      {error && (
        <p className="mt-4 rounded-md bg-danger-bg px-4 py-3 text-sm text-danger-fg">{error}</p>
      )}

      <div className="mt-6 flex justify-end">
        <Button size="lg" onClick={submit} loading={pending}>
          Continue to builder
        </Button>
      </div>
    </main>
  )
}

export function SegmentedControl({
  options,
  value,
  onChange,
  className,
}: {
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
  className?: string
}) {
  return (
    <div
      className={cn(
        'inline-flex rounded-lg border border-surface-border bg-surface-inset p-1',
        className
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
          className={cn(
            'rounded-md px-3.5 py-1.5 text-[13px] font-semibold transition-colors duration-fast',
            value === option.value
              ? 'bg-white text-ink shadow-sm'
              : 'text-ink-muted hover:text-ink'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
