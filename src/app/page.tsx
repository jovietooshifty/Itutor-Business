import Link from 'next/link'
import { Button } from '@/components/ui'
import { Logo, PUBLIC_HOME } from '@/components/ui/logo'

/**
 * Placeholder root. The full marketing landing page with the gated
 * marketplace preview is handoff flow 8 (Landing Page.dc.html) — not part of
 * build steps 1–3, so this is a route stub, not an attempt at that design.
 */
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-mint-wash p-8 font-sans">
      <Logo href={PUBLIC_HOME} size="lg" />

      <div className="max-w-[560px] text-center">
        <h1 className="font-display text-h2 font-bold tracking-heading text-ink">
          Set your team up for success.
        </h1>
        <p className="mt-3 text-base leading-relaxed text-ink-muted">
          Onboard contractors, assign courses, and see who&apos;s certified — all from one
          dashboard.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/business/signup">
          <Button size="lg">Create a business account</Button>
        </Link>
        <Link href="/learner/signup">
          <Button size="lg" accent="coral">
            Sign up as a learner
          </Button>
        </Link>
        <Link href="/login">
          <Button size="lg" variant="secondary">
            Log in
          </Button>
        </Link>
      </div>

      <p className="text-xs text-ink-muted">
        Landing page and marketplace preview are build step 8.
      </p>
    </main>
  )
}
