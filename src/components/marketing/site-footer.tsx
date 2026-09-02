import Link from 'next/link'
import { Mail } from 'lucide-react'
import { Logo, PUBLIC_HOME } from '@/components/ui/logo'

const COMPANY_LINKS = [
  { label: 'About', href: '#how-it-works' },
  { label: 'Contact', href: 'mailto:support@myitutor.com' },
]

/**
 * Privacy and Terms have no pages yet, so they point at the support inbox
 * rather than at `#` — a dead anchor that silently does nothing is worse than
 * a link that reaches a human. Swap these for real routes when they exist.
 */
const LEGAL_LINKS = [
  { label: 'Privacy', href: 'mailto:support@myitutor.com?subject=Privacy%20policy' },
  { label: 'Terms', href: 'mailto:support@myitutor.com?subject=Terms%20of%20service' },
]

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-black text-white">
      <div className="mx-auto grid max-w-marketing gap-12 px-6 pb-10 pt-16 md:grid-cols-[2fr_1fr_1fr] md:px-10">
        <div>
          <Logo href={PUBLIC_HOME} theme="dark" />
          <p className="mt-5 max-w-[360px] text-sm leading-relaxed text-white/60">
            Training and course management for businesses, and the people who work with them.
          </p>
          <a
            href="mailto:support@myitutor.com"
            className="mt-5 inline-flex items-center gap-2 text-sm text-white/80 no-underline hover:text-white"
          >
            <Mail size={16} className="text-brand" aria-hidden />
            support@myitutor.com
          </a>
        </div>

        <FooterColumn title="Company" links={COMPANY_LINKS} />
        <FooterColumn title="Legal" links={LEGAL_LINKS} />
      </div>

      <div className="mx-auto flex max-w-marketing flex-wrap items-center justify-between gap-4 border-t border-white/10 px-6 pb-10 pt-6 text-sm text-white/50 md:px-10">
        <p className="m-0">© {new Date().getFullYear()} iTutor Business</p>
        <Link
          href="#role-picker"
          className="inline-flex h-9 items-center rounded-lg px-4 text-sm font-bold text-white no-underline transition-colors duration-fast hover:bg-white/10"
        >
          Sign up
        </Link>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: { label: string; href: string }[]
}) {
  return (
    <div>
      <h3 className="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-white/50">
        {title}
      </h3>
      <ul className="mt-5 grid list-none gap-3 p-0 text-sm">
        {links.map((link) => (
          <li key={link.label}>
            <a href={link.href} className="text-white/75 no-underline hover:text-white">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
