import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from './form'
import { Logo, PUBLIC_HOME } from '@/components/ui/logo'

export const metadata: Metadata = { title: 'Log in — iTutor Business' }

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-mint-wash p-8 font-sans">
      <div className="absolute left-10 top-8">
        <Logo href={PUBLIC_HOME} />
      </div>

      <div className="w-full max-w-[440px] rounded-3xl bg-white px-10 py-11 shadow-card">
        <h1 className="m-0 font-display text-[26px] font-bold tracking-heading text-ink">
          Welcome back
        </h1>
        <p className="mb-6 mt-1.5 text-sm text-[#6b7280]">
          Log in to your business or learner account.
        </p>

        {/* LoginForm reads ?next= via useSearchParams, which needs a boundary. */}
        <Suspense fallback={<div className="h-[232px]" />}>
          <LoginForm />
        </Suspense>

        <div className="mt-6 border-t border-border pt-5 text-center text-sm text-[#6b7280]">
          <p className="m-0">
            New here?{' '}
            <Link href="/business/signup" className="font-semibold text-[var(--itutor-green)] underline">
              Create a business account
            </Link>
          </p>
          <p className="m-0 mt-1.5">
            Looking to learn?{' '}
            <Link href="/learner/signup" className="font-semibold text-coral underline">
              Sign up as a learner
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
