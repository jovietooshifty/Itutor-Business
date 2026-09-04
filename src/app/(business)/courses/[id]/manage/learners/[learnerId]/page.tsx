import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { CourseTabs } from '@/components/business/course-tabs'
import { LearnerRecordView } from '@/components/business/learner-record-view'
import { getBusinessContext } from '@/lib/business'
import { loadLearnerRecord } from '@/lib/learner-record'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Learner — iTutor Business' }

/**
 * The same learner record as /learners/[learnerId], reached from inside a
 * course and staying there.
 *
 * The course's Learners tab used to link at the global directory route, whose
 * back link is hardcoded to /learners — so Course → Learners → a learner →
 * Back left you in the all-learners list, outside the course you were managing.
 * This route keeps the course tab bar overhead and sends Back to the course's
 * own learner list.
 */
export default async function Page({
  params,
}: {
  params: Promise<{ id: string; learnerId: string }>
}) {
  const { id, learnerId } = await params

  const context = await getBusinessContext()
  if (!context) redirect('/login')

  const supabase = await createClient()
  const [{ data: course }, record] = await Promise.all([
    supabase.from('courses').select('id, business_id, title').eq('id', id).maybeSingle(),
    loadLearnerRecord(learnerId, context.businessId),
  ])

  if (!course || course.business_id !== context.businessId) notFound()
  if (!record) notFound()

  return (
    <main className="mx-auto max-w-[960px] p-6 md:p-10">
      <h1 className="m-0 mb-5 font-display text-[28px] font-bold text-ink">{course.title}</h1>
      <CourseTabs courseId={course.id} active="learners" />

      <Link
        href={`/courses/${course.id}/manage/learners`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted no-underline hover:text-ink"
      >
        <ArrowLeft size={15} aria-hidden /> Course learners
      </Link>

      <LearnerRecordView record={record} canInvite={context.role !== 'auditor'} />
    </main>
  )
}
