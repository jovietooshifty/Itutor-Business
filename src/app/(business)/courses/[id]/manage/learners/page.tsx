import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { CourseTabs } from '@/components/business/course-tabs'
import { LearnerTable } from '@/components/business/learner-table'
import { getBusinessContext } from '@/lib/business'
import { currentCycles, loadCourseLearners } from '@/lib/learners'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Course learners — iTutor Business' }

/** Course management, Learners tab (handoff flow 7). */
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const context = await getBusinessContext()
  if (!context) redirect('/login')

  const supabase = await createClient()
  const [{ data: course }, allEnrolments] = await Promise.all([
    supabase.from('courses').select('id, business_id, title').eq('id', id).maybeSingle(),
    loadCourseLearners(id),
  ])

  if (!course || course.business_id !== context.businessId) notFound()

  // The roster is who is on the course now, so a retake replaces its
  // predecessor rather than appearing beside it.
  const learners = currentCycles(allEnrolments)

  return (
    <main className="mx-auto max-w-[960px] p-6 md:p-10">
      <h1 className="m-0 mb-5 font-display text-[28px] font-bold text-ink">{course.title}</h1>
      <CourseTabs courseId={course.id} active="learners" />
      <LearnerTable
        rows={learners}
        canRemove={context.role !== 'auditor'}
        hrefBase={`/courses/${course.id}/manage/learners`}
      />
    </main>
  )
}
