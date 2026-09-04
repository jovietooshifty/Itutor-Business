import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { LearnerRecordView } from '@/components/business/learner-record-view'
import { getBusinessContext } from '@/lib/business'
import { loadLearnerRecord } from '@/lib/learner-record'

export const metadata: Metadata = { title: 'Learner — iTutor Business' }

/**
 * The per-learner drill-down from the business-wide directory, read-only. RLS
 * decides whether this learner is visible at all: can_read_learner() is true
 * only for someone enrolled in one of the caller's courses (or who lists them
 * as employer), so a miss here is a 404 rather than a permission error.
 *
 * Reached from a course's Learners tab, the course-scoped copy of this page is
 * used instead, so that going back stays inside the course.
 */
export default async function Page({ params }: { params: Promise<{ learnerId: string }> }) {
  const { learnerId } = await params

  const context = await getBusinessContext()
  if (!context) redirect('/login')

  const record = await loadLearnerRecord(learnerId, context.businessId)
  if (!record) notFound()

  return (
    <main className="mx-auto max-w-[880px] p-6 md:p-10">
      <Link
        href="/learners"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted no-underline hover:text-ink"
      >
        <ArrowLeft size={15} aria-hidden /> All learners
      </Link>

      <LearnerRecordView record={record} canInvite={context.role !== 'auditor'} />
    </main>
  )
}
