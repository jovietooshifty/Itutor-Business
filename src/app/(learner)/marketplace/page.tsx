import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Browse courses — iTutor Business' }

/** Route stub. Built in handoff flow 8. */
export default function Page() {
  return (
    <main className="mx-auto max-w-[960px] p-10">
      <h1 className="font-display text-[28px] font-bold text-ink">Browse courses</h1>
      <p className="mt-2 text-sm text-ink-muted">The learner marketplace and course player are build step 8.</p>
    </main>
  )
}
