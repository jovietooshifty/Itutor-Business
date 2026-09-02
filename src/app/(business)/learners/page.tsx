import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Learners — iTutor Business' }

/** Route stub. Built in handoff flow 7. */
export default function Page() {
  return (
    <main className="mx-auto max-w-[960px] p-10">
      <h1 className="font-display text-[28px] font-bold text-ink">Learners</h1>
      <p className="mt-2 text-sm text-ink-muted">Learner tracking and drill-down is build step 7.</p>
    </main>
  )
}
