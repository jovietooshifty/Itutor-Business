'use client'

import * as React from 'react'
import Link from 'next/link'
import { BookOpen, Search } from 'lucide-react'
import { Badge, Card, Input, cn } from '@/components/ui'

export type MarketplaceCourse = {
  id: string
  title: string
  description: string | null
  thumbnailUrl: string | null
  durationLabel: string | null
  businessName: string
  tags: string[]
  blockCount: number
  /** Set once the learner has joined — the card becomes "Continue". */
  enrolled: boolean
}

/**
 * The browse grid. Filtering is client-side on purpose: the whole catalogue a
 * learner can see is already on the page, so a round trip per keystroke would
 * buy nothing.
 */
export function MarketplaceGrid({ courses }: { courses: MarketplaceCourse[] }) {
  const [search, setSearch] = React.useState('')
  const [tag, setTag] = React.useState<string | null>(null)

  const allTags = React.useMemo(
    () => Array.from(new Set(courses.flatMap((c) => c.tags))).sort(),
    [courses]
  )

  const query = search.trim().toLowerCase()
  const visible = courses.filter((course) => {
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
      <div className="mb-4 rounded-xl border border-border bg-white p-4">
        <div className="relative">
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
            {courses.length === 0
              ? 'No courses are published yet. Check back soon.'
              : 'Nothing matches that search.'}
          </p>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((course) => (
            <Link key={course.id} href={`/learn/${course.id}`} className="no-underline">
              <Card className="h-full overflow-hidden p-0 transition-shadow duration-fast hover:shadow-md">
                <div className="relative grid h-[120px] place-items-center bg-coral-soft">
                  {course.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={course.thumbnailUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <BookOpen size={38} strokeWidth={1.6} className="text-coral" aria-hidden />
                  )}
                  {course.enrolled && (
                    <span className="absolute left-2.5 top-2.5 rounded-full bg-coral px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                      Enrolled
                    </span>
                  )}
                </div>

                <div className="p-[18px]">
                  {course.tags[0] && (
                    <Badge tone="neutral">{course.tags[0]}</Badge>
                  )}
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
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
