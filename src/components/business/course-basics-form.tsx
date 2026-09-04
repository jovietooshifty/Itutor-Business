'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, X } from 'lucide-react'
import { Button, Field, Input, SegmentedControl, Textarea } from '@/components/ui'
import { ImageUpload } from '@/components/ui/image-upload'
import { MultiSelectCombobox } from '@/components/ui/combobox'
import { CourseSteps } from '@/components/business/course-steps'
import {
  COURSE_TAG_GROUPS,
  COURSE_TAG_MAX,
  normalizeCourseTag,
  type CourseBasics,
  type CourseVisibility,
} from '@/lib/course'
import { createCourse, updateCourseBasics } from '@/app/(business)/courses/actions'

/**
 * Course Builder step 1 — what the course IS. Nothing here depends on the
 * material existing, which is why duration and quiz defaults now live in step
 * 3 instead: you cannot estimate a runtime for content you have not added, and
 * quiz settings mean nothing before there is a quiz.
 *
 * The same form creates a course (no courseId) and edits one (courseId set),
 * so "Back" from the sequence lands somewhere that can actually change things.
 */
export function CourseBasicsForm({
  businessId,
  courseId,
  initial,
  variant = 'wizard',
}: {
  businessId: string
  courseId?: string
  initial: CourseBasics
  /**
   * 'settings' is the same fields on the course's own Settings tab: no step
   * rail, no "continue", and saving stays put. Editing a live course's title
   * should not march you towards Publish.
   */
  variant?: 'wizard' | 'settings'
}) {
  const isWizard = variant === 'wizard'
  const router = useRouter()
  const [pending, startTransition] = React.useTransition()
  const [error, setError] = React.useState<string | null>(null)
  const [saved, setSaved] = React.useState(false)
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({})

  const [title, setTitle] = React.useState(initial.title)

  /**
   * Field errors come back from a submit, so they describe the values as they
   * were then. Typing makes them stale: "Give the course a title" sitting under
   * a filled-in title box reads as the form rejecting what is on screen, and
   * sends people looking for a second problem that is not there.
   */
  function editTitle(next: string) {
    setTitle(next)
    if (fieldErrors.title) {
      setFieldErrors(({ title: _cleared, ...rest }) => rest)
    }
  }
  const [description, setDescription] = React.useState(initial.description)
  const [visibility, setVisibility] = React.useState<CourseVisibility>(initial.visibility)
  const [tags, setTags] = React.useState<string[]>(initial.tags)
  const [outcomes, setOutcomes] = React.useState<string[]>(initial.whatYouWillLearn)
  const [outcomeDraft, setOutcomeDraft] = React.useState('')
  const [thumbnailUrl, setThumbnailUrl] = React.useState(initial.thumbnailUrl)

  /**
   * The id of a course this form created, so a second submit edits it instead
   * of inserting a second one. Without this, every submit on /courses/new is
   * another INSERT — which is where the duplicate zero-block drafts came from.
   */
  const [createdId, setCreatedId] = React.useState<string | null>(null)
  const activeId = courseId ?? createdId

  const isEdit = Boolean(courseId)

  /**
   * Normalised on the way in, not on save — the chip the author sees is then
   * the string that gets stored, so "safety" typed by hand and "Safety" from
   * the list cannot both end up on the same course.
   */
  function toggleTag(raw: string) {
    const tag = normalizeCourseTag(raw)
    if (!tag) return
    setTags((prev) => {
      if (prev.includes(tag)) return prev.filter((t) => t !== tag)
      if (prev.length >= COURSE_TAG_MAX) return prev
      return [...prev, tag]
    })
  }

  function addOutcome() {
    const value = outcomeDraft.trim()
    if (!value) return
    setOutcomes((prev) => [...prev, value])
    setOutcomeDraft('')
  }

  function submit() {
    setError(null)
    setSaved(false)
    setFieldErrors({})

    const input: CourseBasics = {
      title,
      description,
      visibility,
      tags,
      whatYouWillLearn: outcomes,
      thumbnailUrl,
    }

    startTransition(async () => {
      const result = activeId
        ? await updateCourseBasics(activeId, input)
        : await createCourse(input)

      if (!result.ok) {
        setError(result.error)
        setFieldErrors(result.fieldErrors ?? {})
        return
      }

      const id = activeId ?? (result as { data?: { id: string } }).data?.id
      if (!activeId && id) setCreatedId(id)

      if (!isWizard) {
        setSaved(true)
        router.refresh()
        return
      }

      /* Creating replaces /courses/new in history rather than stacking on it.
         The course exists now, so that URL no longer describes anything — and
         going Back to it and submitting again was the other way duplicate
         drafts got made. Editing keeps its push, so Back still means basics. */
      if (courseId) router.push(`/courses/${id}`)
      else router.replace(`/courses/${id}`)
    })
  }


  const Wrapper = isWizard ? 'main' : 'div'

  return (
    <Wrapper className={isWizard ? 'mx-auto max-w-[880px] p-6 md:p-10' : undefined}>
      {isWizard && (
        <>
          <CourseSteps current="basics" courseId={courseId} />

          <h1 className="m-0 mb-1.5 font-display text-[28px] font-bold text-ink">
            {isEdit ? 'Course basics' : 'Create a course'}
          </h1>
          <p className="m-0 mb-8 text-sm text-ink-muted">
            Set up what the course is — you&apos;ll add the material next.
          </p>
        </>
      )}

      <div className="rounded-xl border border-[#f3f4f6] bg-white p-6 shadow-sm md:p-7">
        <div className="flex flex-col gap-5 sm:flex-row">
          <ImageUpload
            bucket="business-assets"
            path={`${businessId}/course-thumbnails`}
            preset="cover"
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
                onChange={(e) => editTitle(e.target.value)}
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
          <p className="mb-2 text-xs text-[#9ca3af]">
            Up to {COURSE_TAG_MAX}. Search the list, or type your own and press Enter.
          </p>
          {tags.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-light px-3 py-1.5 text-[13px] font-semibold text-[var(--itutor-green)]"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => toggleTag(tag)}
                    aria-label={`Remove ${tag}`}
                    className="cursor-pointer opacity-70 hover:opacity-100"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
          <MultiSelectCombobox
            groups={COURSE_TAG_GROUPS}
            selected={tags}
            onToggle={toggleTag}
            max={COURSE_TAG_MAX}
            allowCustom
            placeholder="Search categories…"
          />
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

        <div className="mt-6">
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
      </div>

      {error && (
        <p className="mt-4 rounded-md bg-danger-bg px-4 py-3 text-sm text-danger-fg">{error}</p>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        {isWizard ? (
          <Link href="/courses" className="no-underline">
            <Button variant="ghost">
              <ArrowLeft size={15} /> All courses
            </Button>
          </Link>
        ) : (
          <span />
        )}
        <Button size="lg" onClick={submit} loading={pending}>
          {!isWizard ? 'Save changes' : isEdit ? 'Save and continue' : 'Continue to content'}
        </Button>
      </div>

      {saved && (
        <p className="mt-2.5 text-right text-xs font-semibold text-[var(--itutor-green)]">Saved</p>
      )}
    </Wrapper>
  )
}
