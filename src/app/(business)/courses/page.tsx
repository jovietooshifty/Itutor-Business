import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Badge, Button, Card } from '@/components/ui'
import { CourseCard } from '@/components/course-card'
import { ShareCourseButton } from '@/components/business/share-course-modal'
import { CompanyGateBanner } from '@/components/business/company-gate-banner'
import { getBusinessContext } from '@/lib/business'
import { loadCompanyGate } from '@/lib/company-gate'
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

  const [supabase, gate] = await Promise.all([createClient(), loadCompanyGate(context.businessId)])
  /* The embed names its foreign key. Two relationships now exist between
     courses and course_blocks — the course's blocks, and courses.build_block_id
     pointing back at one — so a bare `course_blocks(id)` is ambiguous and
     PostgREST refuses the whole query. */
  /* The company cover doubles as the default course artwork, so a card is
     never blank while a thumbnail is outstanding. A course thumbnail_url
     always wins. */
  const { data: business } = await supabase
    .from('businesses')
    .select('logo_url, cover_url')
    .eq('id', context.businessId)
    .maybeSingle()

  const { data: courses, error } = await supabase
    .from('courses')
    .select(
      'id, title, description, thumbnail_url, visibility, status, share_token, duration_label, updated_at, course_blocks!course_blocks_course_id_fkey(id)'
    )
    .eq('business_id', context.businessId)
    .order('updated_at', { ascending: false })

  /* Without this, a failed query is indistinguishable from an empty account:
     the page rendered "No courses yet" while three courses sat in the table. */
  if (error) throw new Error(`Could not load courses: ${error.message}`)

  const canCreate = context.role !== 'auditor'
  // Editing an existing course stays open; making a NEW one waits on the
  // company profile, because that is what a learner reads before joining.
  const canCreateNew = canCreate && gate.complete

  return (
    <main className="mx-auto max-w-[1120px] p-6 md:p-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="m-0 font-display text-[28px] font-bold text-ink">Courses</h1>
          <p className="m-0 mt-1 text-sm text-ink-muted">
            Build training your team can be assigned to.
          </p>
        </div>
        {canCreate &&
          (canCreateNew ? (
            <Link href="/courses/new">
              <Button>
                <Plus size={16} /> Create course
              </Button>
            </Link>
          ) : (
            <Button disabled>
              <Plus size={16} /> Create course
            </Button>
          ))}
      </div>

      {canCreate && <CompanyGateBanner gate={gate} action="create a course" className="mb-6" />}

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
                  fallbackThumbnailUrl={business?.cover_url ?? null}
                  providerName={context.businessName}
                  providerLogoUrl={business?.logo_url ?? null}
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
