import Link from 'next/link'
import { cn } from '@/lib/cn'

export type CourseTab = 'overview' | 'sequence' | 'learners' | 'settings'

/**
 * Course management tabs. Every one of them stays inside the tab set — the
 * Sequence tab used to link out to the builder, so clicking a tab made the tab
 * bar disappear. It now renders the same editor in its 'manage' variant, and
 * the build flow is a separate, clearly-labelled action.
 */
export function CourseTabs({ courseId, active }: { courseId: string; active: CourseTab }) {
  const tabs: { key: CourseTab; label: string; href: string }[] = [
    { key: 'overview', label: 'Overview', href: `/courses/${courseId}/manage` },
    { key: 'sequence', label: 'Sequence', href: `/courses/${courseId}/manage/sequence` },
    { key: 'learners', label: 'Learners', href: `/courses/${courseId}/manage/learners` },
    { key: 'settings', label: 'Settings', href: `/courses/${courseId}/manage/settings` },
  ]

  return (
    <nav className="mb-7 flex gap-1 border-b border-border">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          aria-current={tab.key === active ? 'page' : undefined}
          className={cn(
            '-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold no-underline transition-colors duration-fast',
            tab.key === active
              ? 'border-[color:var(--itutor-green)] text-[var(--itutor-green)]'
              : 'border-transparent text-ink-muted hover:text-ink'
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  )
}
