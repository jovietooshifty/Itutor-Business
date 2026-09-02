import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { CompanyProfileForm } from '@/components/business/company-profile-form'
import { getBusinessContext, loadCompanyProfile } from '@/lib/business'

export const metadata: Metadata = { title: 'Company profile — iTutor Business' }

/**
 * Company Profile as its own routed page (handoff flow 2). The gear settings
 * modal links out to here rather than embedding it as a tab.
 */
export default async function CompanyProfilePage() {
  const context = await getBusinessContext()
  if (!context) redirect('/login')

  const initial = await loadCompanyProfile(context.businessId)
  if (!initial) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-surface-soft pb-[110px]">
      <div className="mx-auto max-w-[1200px] px-6 pt-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm font-semibold text-ink-muted no-underline hover:text-ink"
        >
          <ChevronLeft size={16} /> Back to dashboard
        </Link>
        <h1 className="mt-3 font-display text-[28px] font-bold text-ink">Company Profile</h1>
        <p className="mt-1 text-sm text-ink-muted">
          This is what learners and invited team members see about your business.
        </p>
      </div>

      <CompanyProfileForm
        initial={initial}
        mode="manage"
        canEdit={context.role === 'admin'}
      />
    </div>
  )
}
