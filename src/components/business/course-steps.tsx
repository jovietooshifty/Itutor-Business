import Link from 'next/link'
import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'
import { COURSE_BUILD_STEPS, type CourseStepKey } from '@/lib/course'

/**
 * The builder's progress rail. Steps before the current one link back so any
 * answer can be revisited — a course that has not been created yet (step 1 of
 * a brand-new course) has no id to link to, so it renders as plain text.
 */
export function CourseSteps({
  current,
  courseId,
}: {
  current: CourseStepKey
  courseId?: string
}) {
  const currentIndex = COURSE_BUILD_STEPS.findIndex((step) => step.key === current)

  function hrefFor(key: CourseStepKey) {
    if (!courseId) return null
    if (key === 'basics') return `/courses/${courseId}/basics`
    if (key === 'content') return `/courses/${courseId}`
    return `/courses/${courseId}/details`
  }

  return (
    <ol className="m-0 mb-6 flex list-none flex-wrap items-center gap-x-2 gap-y-2 p-0">
      {COURSE_BUILD_STEPS.map((step, index) => {
        const done = index < currentIndex
        const active = index === currentIndex
        const href = done ? hrefFor(step.key) : null

        const body = (
          <span
            className={cn(
              'inline-flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-[13px] font-semibold transition-colors duration-fast',
              active && 'bg-brand-light text-[var(--itutor-green)]',
              done && 'text-ink-muted hover:text-ink',
              !active && !done && 'text-[#9ca3af]'
            )}
          >
            <span
              className={cn(
                'grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold',
                active && 'bg-itutor-green text-white',
                done && 'bg-brand-light text-[var(--itutor-green)]',
                !active && !done && 'bg-surface-inset text-[#9ca3af]'
              )}
            >
              {done ? <Check size={12} strokeWidth={3} aria-hidden /> : index + 1}
            </span>
            {step.label}
          </span>
        )

        return (
          <li key={step.key} className="flex items-center gap-2">
            {href ? (
              <Link href={href} className="no-underline">
                {body}
              </Link>
            ) : (
              body
            )}
            {index < COURSE_BUILD_STEPS.length - 1 && (
              <span className="h-px w-5 bg-surface-border" aria-hidden />
            )}
          </li>
        )
      })}
    </ol>
  )
}
