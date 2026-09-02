import type { Metadata } from 'next'
import Link from 'next/link'
import { LearnerSignupForm } from './form'
import { AuthSplitLayout, StepIndicator } from '@/components/auth/auth-shell'

export const metadata: Metadata = { title: 'Create your account — iTutor Business' }

export default function LearnerSignupPage() {
  return (
    <AuthSplitLayout
      accent="coral"
      headline="Build skills that"
      headlineAccent="move you forward."
      subcopy="Browse courses from real businesses and independent instructors, and track every certificate you earn."
      bullets={[
        'Learn at your own pace, on any device',
        'Track certificates and completions in one place',
        'Get matched to courses from businesses that invite you',
      ]}
    >
      <StepIndicator accent="coral" current={1} labels={['Account', 'Profile']} />

      <h2 className="m-0 font-display text-[26px] font-bold tracking-heading text-ink">
        Create your account
      </h2>
      <p className="mb-6 mt-1.5 text-sm text-[#6b7280]">
        Step 1 of 2 — let&apos;s start with the basics.
      </p>

      <LearnerSignupForm />

      <p className="mt-5 text-center text-sm text-[#6b7280]">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-coral underline">
          Log in
        </Link>
      </p>
    </AuthSplitLayout>
  )
}
