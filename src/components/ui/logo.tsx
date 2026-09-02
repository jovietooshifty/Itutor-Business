import Link from 'next/link'
import { GraduationCap } from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * KNOWN ISSUE #1 (handoff §7): in the design export, several internal pages
 * linked their logo back to the signup/landing screen, and the business
 * dashboard's logo was not a link at all.
 *
 * `href` is therefore a REQUIRED prop with no default — every caller has to
 * state where its side's home actually is. Use the constants below rather
 * than a literal, so the two homes stay defined in one place.
 */
export const BUSINESS_HOME = '/dashboard'
export const LEARNER_HOME = '/marketplace'
export const PUBLIC_HOME = '/'

export function Logo({
  href,
  accent = 'brand',
  theme = 'light',
  size = 'md',
  className,
}: {
  href: string
  accent?: 'brand' | 'coral'
  theme?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const dims = { sm: 28, md: 32, lg: 36 }[size]
  const iconSize = { sm: 15, md: 17, lg: 18 }[size]
  const textSize = { sm: 'text-[15px]', md: 'text-lg', lg: 'text-xl' }[size]

  return (
    <Link href={href} className={cn('flex items-center gap-2.5 no-underline', className)}>
      <span
        className={cn(
          'grid shrink-0 place-items-center rounded-[10px]',
          accent === 'coral' ? 'bg-coral' : 'bg-itutor-green'
        )}
        style={{ width: dims, height: dims }}
      >
        <GraduationCap size={iconSize} color="#fff" />
      </span>
      <span
        className={cn(
          'font-display font-bold',
          textSize,
          theme === 'dark' ? 'text-white' : 'text-ink'
        )}
      >
        iTutor{' '}
        <span
          className={cn(
            'font-medium',
            theme === 'dark' ? 'text-white/60' : 'text-ink-muted'
          )}
        >
          Business
        </span>
      </span>
    </Link>
  )
}
