import Link from 'next/link'
import { cn } from '@/lib/cn'

export type CourseTab = 'overview' | 'learners' | 'settings'

/**
 * Course management tabs. Every one of them stays inside the tab set, and none
 * of them leads back into the build flow — a course that exists is managed
 * here, not re-walked through the wizard.
 *
 * Sequence was a fourth tab. Its editor is on Overview now: the two were a
 * summary of the content and the content itself, and the summary added nothing.
 */
export function CourseTabs({ courseId, active }: { courseId: string; active: CourseTab }) {
  const tabs: { key: CourseTab; label: string; href: string }[] = [
    { key: 'overview', label: 'Overview', href: `/courses/${courseId}/manage` },
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
