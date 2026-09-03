import type { Metadata } from 'next'
import Link from 'next/link'
import { ForgotPasswordForm } from './form'
import { Logo, PUBLIC_HOME } from '@/components/ui/logo'

export const metadata: Metadata = { title: 'Reset your password — iTutor Business' }

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-forest p-5 font-sans md:p-8">
      <div className="w-full max-w-[440px] rounded-3xl bg-white px-8 py-10 shadow-card md:px-10">
        <div className="mb-7">
          <Logo href={PUBLIC_HOME} />
        </div>

        <h1 className="m-0 font-display text-[26px] font-bold tracking-heading text-ink">
          Reset your password
        </h1>
        <p className="mb-6 mt-1.5 text-sm text-[#6b7280]">
          Enter your email and we&apos;ll send you a link to set a new one.
        </p>

        <ForgotPasswordForm />

        <p className="m-0 mt-6 border-t border-border pt-5 text-center text-sm text-[#6b7280]">
          Remembered it?{' '}
          <Link href="/login" className="font-semibold text-[var(--itutor-green)] underline">
            Back to log in
          </Link>
        </p>
      </div>
    </main>
  )
}
