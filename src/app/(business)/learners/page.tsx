import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { LearnerTable } from '@/components/business/learner-table'
import { getBusinessContext } from '@/lib/business'
import { loadBusinessLearners } from '@/lib/learners'

export const metadata: Metadata = { title: 'Learners — iTutor Business' }

/** Everyone enrolled across the business's courses (handoff flow 7). */
export default async function Page() {
  const context = await getBusinessContext()
  if (!context) redirect('/login')

  const learners = await loadBusinessLearners(context.businessId)

  return (
    <main className="mx-auto max-w-[960px] p-6 md:p-10">
      <h1 className="m-0 font-display text-[28px] font-bold text-ink">Learners</h1>
      <p className="m-0 mb-6 mt-1 text-sm text-ink-muted">
        Everyone enrolled in your courses. Select a learner to see their full record.
      </p>

      <LearnerTable rows={learners} showCourse />
    </main>
  )
}
