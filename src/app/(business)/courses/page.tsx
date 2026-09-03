import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { BookOpen, Plus } from 'lucide-react'
import { Badge, Button, Card } from '@/components/ui'
import { ShareCourseButton } from '@/components/business/share-course-modal'
import { getBusinessContext } from '@/lib/business'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Courses — iTutor Business' }

/**
 * Course index. This is the way in to the builder (flow 4); the full courses
 * grid with the Share class modal is flow 6, so this lists what exists rather
 * than reproducing "Courses.dc.html".
 */
export default async function Page() {
  const context = await getBusinessContext()
  if (!context) redirect('/login')

  const supabase = await createClient()
  const { data: courses } = await supabase
    .from('courses')
    .select(
      'id, title, description, thumbnail_url, visibility, status, share_token, duration_label, updated_at, course_blocks(id)'
    )
    .eq('business_id', context.businessId)
    .order('updated_at', { ascending: false })

  const canCreate = context.role !== 'auditor'

  return (
    <main className="mx-auto max-w-[1120px] p-6 md:p-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="m-0 font-display text-[28px] font-bold text-ink">Courses</h1>
          <p className="m-0 mt-1 text-sm text-ink-muted">
            Build training your team can be assigned to.
          </p>
        </div>
        {canCreate && (
          <Link href="/courses/new">
            <Button>
              <Plus size={16} /> Create course
            </Button>
          </Link>
        )}
      </div>

      {!courses || courses.length === 0 ? (
        <Card className="py-14 text-center">
          <p className="m-0 text-sm text-ink-muted">
            No courses yet.
            {canCreate
              ? ' Create your first one to get started.'
              : ' Auditors have read-only access.'}
          </p>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const blockCount = (course.course_blocks as { id: string }[] | null)?.length ?? 0
            return (
              <Card
                key={course.id}
                className="relative h-full overflow-hidden p-0 transition-shadow duration-fast hover:shadow-md"
              >
                {/* The whole tile is the link — management is what you want on
                    a course you already built. Everything interactive sits
                    above it in the stacking order so it can still be clicked. */}
                <Link
                  href={`/courses/${course.id}/manage`}
                  className="absolute inset-0 z-0"
                  aria-label={`Manage ${course.title}`}
                />

                <div className="relative grid h-[120px] place-items-center bg-brand-light">
                  {course.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={course.thumbnail_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <BookOpen
                      size={38}
                      strokeWidth={1.6}
                      className="text-[var(--itutor-green)]"
                      aria-hidden
                    />
                  )}
                  {canCreate && (
                    <div className="absolute right-2.5 top-2.5 z-10">
                      <ShareCourseButton
                        course={{
                          id: course.id,
                          title: course.title,
                          shareToken: course.share_token,
                          isPrivate: course.visibility === 'private',
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="p-[18px]">
                  <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
                    <Badge tone={course.status === 'published' ? 'success' : 'neutral'}>
                      {course.status === 'published' ? 'Published' : 'Draft'}
                    </Badge>
                    <Badge tone="neutral">
                      {course.visibility === 'public' ? 'Public' : 'Private'}
                    </Badge>
                  </div>

                  <h2 className="m-0 font-display text-base font-bold leading-snug text-ink">
                    {course.title}
                  </h2>
                  {course.description && (
                    <p className="m-0 mt-1.5 line-clamp-2 text-sm text-ink-muted">
                      {course.description}
                    </p>
                  )}

                  <p className="m-0 mt-3 text-xs text-[#9ca3af]">
                    {blockCount === 0
                      ? 'No blocks yet'
                      : `${blockCount} ${blockCount === 1 ? 'block' : 'blocks'}`}
                    {course.duration_label ? ` · ${course.duration_label}` : ''}
                  </p>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </main>
  )
}
