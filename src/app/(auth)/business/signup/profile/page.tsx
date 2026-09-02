import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { CompanyProfileForm } from '@/components/business/company-profile-form'
import { Logo, BUSINESS_HOME } from '@/components/ui/logo'
import { getBusinessContext, loadCompanyProfile } from '@/lib/business'

export const metadata: Metadata = { title: 'Company profile — iTutor Business' }

/** Step 2 of 2 of business signup. Same form as /company-profile, onboarding chrome. */
export default async function BusinessSignupProfilePage() {
  const context = await getBusinessContext()
  if (!context) redirect('/login')

  const initial = await loadCompanyProfile(context.businessId)
  if (!initial) redirect('/login')

  return (
    <div className="min-h-screen bg-surface-soft pb-[110px] font-sans">
      <header className="sticky top-0 z-30 border-b border-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] items-center gap-3 px-6 py-3.5">
          {/*
            KNOWN ISSUE #1 (handoff §7): the export pointed this logo back to
            the landing page. The account exists and is signed in by this
            point, so the business side's real home is the dashboard.
          */}
          <Logo href={BUSINESS_HOME} size="sm" />
          <span className="ml-auto text-sm text-ink-muted">Step 2 of 2 — Company Profile</span>
        </div>
      </header>

      <CompanyProfileForm
        initial={initial}
        mode="onboarding"
        canEdit={context.role === 'admin'}
      />
    </div>
  )
}
