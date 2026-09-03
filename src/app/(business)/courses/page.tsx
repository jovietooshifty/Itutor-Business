import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Badge, Button, Card } from '@/components/ui'
import { CourseCard } from '@/components/course-card'
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
              <div key={course.id} className="relative">
                <CourseCard
                  href={`/courses/${course.id}/manage`}
                  title={course.title}
                  thumbnailUrl={course.thumbnail_url}
                  providerName={context.businessName}
                  description={course.description}
                  meta={
                    blockCount === 0
                      ? 'No blocks yet'
                      : `${blockCount} ${blockCount === 1 ? 'block' : 'blocks'}${
                          course.duration_label ? ` · ${course.duration_label}` : ''
                        }`
                  }
                  chips={
                    <>
                      <Badge tone={course.status === 'published' ? 'success' : 'neutral'}>
                        {course.status === 'published' ? 'Published' : 'Draft'}
                      </Badge>
                      <Badge tone="neutral">
                        {course.visibility === 'public' ? 'Public' : 'Private'}
                      </Badge>
                    </>
                  }
                  thumbnailPrompt={
                    canCreate
                      ? { href: `/courses/${course.id}/basics`, label: 'Add a thumbnail' }
                      : undefined
                  }
                  footerLeft={
                    course.status === 'published' ? 'Live' : 'Not published yet'
                  }
                  actionLabel="Manage"
                />

                {canCreate && (
                  <div className="absolute right-2.5 top-2.5 z-20">
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
            )
          })}
        </div>
      )}
    </main>
  )
}
