'use client'

import * as React from 'react'
import Link from 'next/link'
import { BookOpen, Search } from 'lucide-react'
import { Badge, Button, Card, Input, cn } from '@/components/ui'
import { JoinCourseButton } from '@/components/learner/join-course-button'

export type MarketplaceCourse = {
  id: string
  title: string
  description: string | null
  /** The provider's banner — courses no longer carry their own artwork. */
  imageUrl: string | null
  durationLabel: string | null
  businessName: string
  tags: string[]
  blockCount: number
  /** Set once the learner has joined. */
  enrolled: boolean
}

type Scope = 'all' | 'mine'

/**
 * The browse grid. Filtering is client-side on purpose: the whole catalogue a
 * learner can see is already on the page, so a round trip per keystroke would
 * buy nothing.
 */
export function MarketplaceGrid({ courses }: { courses: MarketplaceCourse[] }) {
  const [search, setSearch] = React.useState('')
  const [tag, setTag] = React.useState<string | null>(null)
  const [scope, setScope] = React.useState<Scope>('all')

  const allTags = React.useMemo(
    () => Array.from(new Set(courses.flatMap((c) => c.tags))).sort(),
    [courses]
  )
  const enrolledCount = courses.filter((c) => c.enrolled).length

  const query = search.trim().toLowerCase()
  const visible = courses.filter((course) => {
    if (scope === 'mine' && !course.enrolled) return false
    if (tag && !course.tags.includes(tag)) return false
    if (!query) return true
    return (
      course.title.toLowerCase().includes(query) ||
      course.description?.toLowerCase().includes(query) ||
      course.businessName.toLowerCase().includes(query)
    )
  })

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-3 rounded-xl border border-border bg-white p-4">
        <div className="relative min-w-[220px] flex-1">
          <Search
            size={15}
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses…"
            aria-label="Search courses"
            className="pl-9"
          />
        </div>

        {/* Everything a learner has joined is otherwise scattered through the
            whole catalogue, found only by spotting an "Enrolled" chip. */}
        <div className="flex shrink-0 items-center gap-1 rounded-lg bg-surface-inset p-1">
          {(
            [
              { value: 'all', label: 'All courses' },
              { value: 'mine', label: `My courses${enrolledCount ? ` (${enrolledCount})` : ''}` },
            ] as const
          ).map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={scope === option.value}
              onClick={() => setScope(option.value)}
              className={cn(
                'rounded-md px-3.5 py-2 text-[13px] font-semibold transition-colors duration-fast',
                scope === option.value
                  ? 'bg-white text-ink shadow-sm'
                  : 'text-ink-muted hover:text-ink'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {allTags.length > 0 && (
        <div className="mb-8 flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#9ca3af]">
            Filter by skill
          </span>
          {allTags.map((t) => {
            const active = tag === t
            return (
              <button
                key={t}
                type="button"
                aria-pressed={active}
                onClick={() => setTag(active ? null : t)}
                className={cn(
                  'rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors duration-fast',
                  active
                    ? 'border-coral bg-coral-soft text-[#9a3412]'
                    : 'border-surface-border bg-white text-ink-muted hover:border-coral hover:text-coral'
                )}
              >
                {t}
              </button>
            )
          })}
        </div>
      )}

      {visible.length === 0 ? (
        <Card className="py-14 text-center">
          <p className="m-0 text-sm text-ink-muted">
            {scope === 'mine' && enrolledCount === 0
              ? 'You have not joined any courses yet.'
              : courses.length === 0
                ? 'No courses are published yet. Check back soon.'
                : 'Nothing matches that search.'}
          </p>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((course) => (
            /* The tile is a link, with the action sitting above it — the same
               shape CourseCard uses. Join has to be a real control, so it
               cannot be nested inside the anchor. */
            <Card
              key={course.id}
              className="relative flex h-full flex-col overflow-hidden p-0 transition-shadow duration-fast hover:shadow-md"
            >
              <Link
                href={`/learn/${course.id}`}
                className="absolute inset-0 z-0"
                aria-label={course.title}
              />

              <div className="relative grid h-[120px] shrink-0 place-items-center bg-coral-soft">
                {course.imageUrl ? (
                  /* `contain` so a wide wordmark keeps both ends — see the
                     same reasoning in CourseCard. */
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={course.imageUrl} alt="" className="h-full w-full object-contain" />
                ) : (
                  <BookOpen size={38} strokeWidth={1.6} className="text-coral" aria-hidden />
                )}
                {course.enrolled && (
                  <span className="absolute left-2.5 top-2.5 rounded-full bg-coral px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                    Enrolled
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-[18px]">
                {course.tags[0] && <Badge tone="neutral">{course.tags[0]}</Badge>}
                <h2 className="m-0 mt-2.5 font-display text-base font-bold leading-snug text-ink">
                  {course.title}
                </h2>
                <p className="m-0 mt-1 text-xs text-ink-muted">{course.businessName}</p>
                {course.description && (
                  <p className="m-0 mt-2 line-clamp-2 text-sm text-ink-muted">
                    {course.description}
                  </p>
                )}
                <p className="m-0 mt-3 text-xs text-[#9ca3af]">
                  {course.blockCount === 0
                    ? 'No lessons yet'
                    : `${course.blockCount} ${course.blockCount === 1 ? 'lesson' : 'lessons'}`}
                  {course.durationLabel ? ` · ${course.durationLabel}` : ''}
                </p>

                <div className="mt-auto flex items-start justify-end pt-4">
                  {course.enrolled ? (
                    <Link href={`/learn/${course.id}`} className="relative z-10 no-underline">
                      <Button accent="coral" size="sm" variant="secondary">
                        View course
                      </Button>
                    </Link>
                  ) : (
                    <JoinCourseButton courseId={course.id} />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
