import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Courses — iTutor Business' }

/** Route stub. Built in handoff flow 4/6/7. */
export default function Page() {
  return (
    <main className="mx-auto max-w-[960px] p-10">
      <h1 className="font-display text-[28px] font-bold text-ink">Courses</h1>
      <p className="mt-2 text-sm text-ink-muted">Course builder and course management are build steps 4–7.</p>
    </main>
  )
}
