import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { Button } from '@/components/ui'
import { CourseTabs } from '@/components/business/course-tabs'
import { CourseSequence } from '@/components/business/course-sequence'
import { loadSequence } from '@/lib/builder'
import { getBusinessContext } from '@/lib/business'

export const metadata: Metadata = { title: 'Course sequence — iTutor Business' }

/**
 * Course management, Sequence tab. Renders the same ordering editor the
 * builder uses, in its 'manage' variant — the tab used to link out to the
 * builder, which made the tab bar vanish when you clicked one of its own tabs.
 *
 * Each row opens that block's own page, so a single block can be fixed without
 * walking the whole flow.
 */
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const context = await getBusinessContext()
  if (!context) redirect('/login')

  const loaded = await loadSequence(id)
  if (!loaded || loaded.course.businessId !== context.businessId) notFound()

  return (
    <main className="mx-auto max-w-[960px] p-6 md:p-10">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0 font-display text-[28px] font-bold text-ink">{loaded.course.title}</h1>
        {/* The step-by-step build flow is still there for a course being set
            up; this tab is the same editor without the wizard around it. */}
        <Link href={`/courses/${loaded.course.id}`} className="no-underline">
          <Button variant="secondary" size="sm">
            Open the build flow
          </Button>
        </Link>
      </div>

      <CourseTabs courseId={loaded.course.id} active="sequence" />

      <CourseSequence
        variant="manage"
        course={{ id: loaded.course.id, title: loaded.course.title }}
        initialBlocks={loaded.blocks}
        canDelete={context.role === 'admin'}
      />
    </main>
  )
}
