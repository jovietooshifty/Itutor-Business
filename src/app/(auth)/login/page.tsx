import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { LoginForm } from './form'
import { Logo, PUBLIC_HOME } from '@/components/ui/logo'

export const metadata: Metadata = { title: 'Log in — iTutor Business' }

const PROMISES = [
  'Track completions and certifications across your team',
  'Pick up any course exactly where you left off',
  'Download certificates the moment you finish',
]

/**
 * Two panels on a forest ground: what the product does on the left, the form
 * on the right. Both sides of the app land here — a business owner and a
 * learner sign in through the same door — so the copy speaks to both.
 */
export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-forest p-5 font-sans md:p-8">
      <div className="grid w-full max-w-[1160px] gap-6 lg:grid-cols-2">
        {/* Decorative on small screens, where the form is all that matters. */}
        <section className="hidden flex-col justify-between rounded-3xl bg-[color:color-mix(in_oklab,var(--forest)_82%,white)] p-10 lg:flex">
          <div>
            <Logo href={PUBLIC_HOME} theme="dark" />

            <h1 className="m-0 mt-12 font-display text-[38px] font-bold leading-[1.15] tracking-heading text-white">
              Welcome back to
              <br />
              <span className="text-brand-accent">your training hub.</span>
            </h1>

            <p className="m-0 mt-5 max-w-[420px] text-base leading-relaxed text-white/70">
              Log in to manage your team&apos;s courses, or pick up your own training exactly where
              you left off.
            </p>

            <ul className="m-0 mt-9 grid list-none gap-3.5 p-0">
              {PROMISES.map((promise) => (
                <li key={promise} className="flex items-start gap-3 text-sm text-white/90">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-accent/20 text-brand-accent">
                    <Check size={12} strokeWidth={3} aria-hidden />
                  </span>
                  {promise}
                </li>
              ))}
            </ul>
          </div>

          <p className="m-0 mt-12 text-xs text-white/40">
            © {new Date().getFullYear()} iTutor Business
          </p>
        </section>

        <section className="rounded-3xl bg-white px-8 py-10 shadow-card md:px-10 md:py-11">
          {/* The wordmark only appears here when the left panel is hidden. */}
          <div className="mb-7 lg:hidden">
            <Logo href={PUBLIC_HOME} />
          </div>

          <h2 className="m-0 font-display text-[26px] font-bold tracking-heading text-ink">
            Welcome back
          </h2>
          <p className="mb-6 mt-1.5 text-sm text-[#6b7280]">
            Log in to your business or learner account.
          </p>

          {/* LoginForm reads ?next= via useSearchParams, which needs a boundary. */}
          <Suspense fallback={<div className="h-[286px]" />}>
            <LoginForm />
          </Suspense>

          <div className="mt-6 border-t border-border pt-5 text-center text-sm text-[#6b7280]">
            <p className="m-0">
              New here?{' '}
              <Link
                href="/business/signup"
                className="font-semibold text-[var(--itutor-green)] underline"
              >
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
        </section>
      </div>
    </main>
  )
}
