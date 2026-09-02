'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, Mail, Settings } from 'lucide-react'
import { cn } from '@/components/ui'
import { BUSINESS_HOME } from '@/components/ui/logo'
import { SettingsModal, type SettingsInitial } from '@/components/business/settings-modal'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/courses', label: 'Courses' },
  { href: '/learners', label: 'Learners' },
]

export function BusinessTopNav({ settings }: { settings: SettingsInitial }) {
  const pathname = usePathname()
  const [settingsOpen, setSettingsOpen] = React.useState(false)

  return (
    <>
      <header className="flex items-center gap-8 bg-ink px-7 py-3.5">
        {/*
          KNOWN ISSUE #1 (handoff §7): in the export this wordmark was a plain
          <span> with no link at all. It is now the dashboard home link.
        */}
        <Link
          href={BUSINESS_HOME}
          className="font-display text-[17px] font-bold text-white no-underline"
        >
          iTutor Business
        </Link>

        <nav className="flex gap-6">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm no-underline transition-colors',
                  active ? 'font-semibold text-white' : 'font-medium text-white/60 hover:text-white/90'
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <button
            type="button"
            aria-label="Notifications"
            className="flex text-white/70 transition-colors hover:text-white"
          >
            <Bell size={18} />
          </button>
          <button
            type="button"
            aria-label="Messages"
            className="flex text-white/70 transition-colors hover:text-white"
          >
            <Mail size={18} />
          </button>
          <button
            type="button"
            aria-label="Settings"
            onClick={() => setSettingsOpen(true)}
            className="grid h-8 w-8 place-items-center rounded-lg border border-white/15 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Settings size={16} />
          </button>
        </div>
      </header>

      {settingsOpen && (
        <SettingsModal initial={settings} onClose={() => setSettingsOpen(false)} />
      )}
    </>
  )
}
