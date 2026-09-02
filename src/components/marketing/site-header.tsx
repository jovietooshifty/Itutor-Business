import Link from 'next/link'
import { Logo, PUBLIC_HOME } from '@/components/ui/logo'

/**
 * Sticky marketing header. Dark, translucent and blurred over whatever
 * scrolls beneath it, per "Landing Page.dc.html".
 *
 * `bg-brand` would be ambiguous here — the theme defines both a `brand`
 * colour and a `brand` gradient, which generate the same class — so the
 * gradient is referenced explicitly as a background-image.
 */
export function SiteHeader() {
  return (
    <header
      id="top"
      className="sticky top-0 z-40 border-b border-white/10 bg-black/[0.92] shadow-[0_4px_24px_rgba(0,0,0,0.12)] backdrop-blur-[24px] backdrop-saturate-[180%]"
    >
      <nav className="mx-auto flex max-w-marketing items-center justify-between gap-4 px-6 py-4 md:px-10">
        <Logo href={PUBLIC_HOME} theme="dark" />

        <Link
          href="#how-it-works"
          className="hidden text-sm font-medium text-white/70 no-underline transition-colors duration-fast hover:text-white sm:block"
        >
          How it works
        </Link>

        <div className="flex items-center gap-4 md:gap-6">
          <Link
            href="/login"
            className="text-sm font-medium text-white/70 no-underline transition-colors duration-fast hover:text-white"
          >
            Log in
          </Link>
          <Link
            href="#role-picker"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-[image:var(--gradient-brand)] px-5 text-sm font-bold text-white no-underline shadow-button-green transition-[filter] duration-fast hover:brightness-110"
          >
            Sign up
          </Link>
        </div>
      </nav>
    </header>
  )
}
