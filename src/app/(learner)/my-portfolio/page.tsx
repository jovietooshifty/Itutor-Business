import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'My portfolio — iTutor' }

/** Route stub. Built in handoff flow 10. */
export default function Page() {
  return (
    <main className="mx-auto max-w-[960px] p-10">
      <h1 className="font-display text-[28px] font-bold text-ink">My portfolio</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Certificates and the public portfolio page are build step 10.
      </p>
    </main>
  )
}
