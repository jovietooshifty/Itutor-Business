import type { Metadata } from 'next'
import Link from 'next/link'
import { BusinessSignupForm } from './form'
import { AuthSplitLayout, StepIndicator } from '@/components/auth/auth-shell'

export const metadata: Metadata = { title: 'Create your business account — iTutor Business' }

export default function BusinessSignupPage() {
  return (
    <AuthSplitLayout
      accent="brand"
      headline="Set your team"
      headlineAccent="up for success."
      subcopy="Onboard contractors, assign courses, and see who's certified — all from one dashboard."
      bullets={[
        'Role-based access for every contractor',
        'Assign and track courses across your team',
        'Live dashboards for completions & certifications',
      ]}
    >
      <StepIndicator accent="brand" current={1} labels={['Account', 'Company Profile']} />

      <h2 className="m-0 font-display text-[26px] font-bold tracking-heading text-ink">
        Create your business account
      </h2>
      <p className="mb-6 mt-1.5 text-sm text-[#6b7280]">
        Step 1 of 2 — let&apos;s start with the basics.
      </p>

      <BusinessSignupForm />

      <p className="mt-5 text-center text-sm text-[#6b7280]">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-[var(--itutor-green)] underline">
          Log in
        </Link>
      </p>
    </AuthSplitLayout>
  )
}
