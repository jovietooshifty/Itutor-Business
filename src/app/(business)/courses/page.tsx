import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Badge, Button, Card } from '@/components/ui'
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
    .select('id, title, description, visibility, duration_label, updated_at, course_blocks(id)')
    .eq('business_id', context.businessId)
    .order('updated_at', { ascending: false })

  const canCreate = context.role !== 'auditor'

  return (
    <main className="mx-auto max-w-[960px] p-6 md:p-10">
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
        <div className="grid gap-4">
          {courses.map((course) => {
            const blockCount = (course.course_blocks as { id: string }[] | null)?.length ?? 0
            return (
              <Link key={course.id} href={`/courses/${course.id}`} className="no-underline">
                <Card className="p-5 transition-shadow duration-fast hover:shadow-md">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="m-0 font-display text-h4 font-bold text-ink">
                        {course.title}
                      </h2>
                      {course.description && (
                        <p className="m-0 mt-1 line-clamp-2 text-sm text-ink-muted">
                          {course.description}
                        </p>
                      )}
                    </div>
                    <Badge tone={course.visibility === 'public' ? 'success' : 'neutral'}>
                      {course.visibility === 'public' ? 'Public' : 'Private'}
                    </Badge>
                  </div>
                  <p className="m-0 mt-3 text-xs text-[#9ca3af]">
                    {blockCount === 0
                      ? 'No blocks yet'
                      : `${blockCount} ${blockCount === 1 ? 'block' : 'blocks'}`}
                    {course.duration_label ? ` · ${course.duration_label}` : ''}
                  </p>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}
