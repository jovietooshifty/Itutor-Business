import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { LearnerProfileForm } from '@/components/learner/learner-profile-form'
import { Logo, LEARNER_HOME } from '@/components/ui/logo'
import { loadLearnerProfile } from '@/lib/learner'

export const metadata: Metadata = { title: 'Your profile — iTutor Business' }

/** Step 2 of 2 of learner signup. */
export default async function LearnerSignupProfilePage() {
  const initial = await loadLearnerProfile()
  if (!initial) redirect('/login')

  return (
    <div className="min-h-screen bg-surface-soft pb-[110px] font-sans">
      <header className="sticky top-0 z-30 border-b border-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] items-center gap-3 px-6 py-3.5">
          {/*
            KNOWN ISSUE #1 (handoff §7): the export pointed this logo at the
            landing page. The learner is signed in here, so their real home is
            the marketplace.
          */}
          <Logo href={LEARNER_HOME} accent="coral" size="sm" />
          <span className="ml-auto text-sm text-ink-muted">Step 2 of 2 — Your Profile</span>
        </div>
      </header>

      <LearnerProfileForm initial={initial} mode="onboarding" />
    </div>
  )
}
