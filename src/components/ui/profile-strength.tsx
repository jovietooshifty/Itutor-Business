'use client'

import { Check } from 'lucide-react'
import { cn, ProgressBar, type Accent } from '@/components/ui'

export type StrengthItem = { label: string; done: boolean }

/** The sticky "Profile Strength" sidebar shared by both profile builders. */
export function ProfileStrength({
  items,
  accent = 'brand',
  autosaveNote = true,
}: {
  items: StrengthItem[]
  accent?: Accent
  autosaveNote?: boolean
}) {
  const done = items.filter((i) => i.done).length
  const pct = items.length ? (done / items.length) * 100 : 0

  return (
    <div className="rounded-xl border border-[#f3f4f6] bg-white p-6 shadow-sm">
      <h4 className="m-0 font-display text-[15px] font-bold text-ink">Profile Strength</h4>
      <p className="mb-1.5 mt-2.5">
        <span
          className={cn(
            'text-[30px] font-extrabold',
            accent === 'coral' ? 'text-coral' : 'text-itutor-green'
          )}
        >
          {done}
        </span>
        <span className="text-base font-semibold text-[#9ca3af]">/{items.length}</span>
      </p>
      <ProgressBar value={pct} accent={accent} />

      <div className="mt-5 grid gap-2.5">
        {items.map((item) => (
          <div
            key={item.label}
            className={cn(
              'flex items-center gap-2 text-[12.5px]',
              item.done ? 'text-ink' : 'text-[#9ca3af]'
            )}
          >
            <span
              className="grid h-4 w-4 shrink-0 place-items-center rounded-full"
              style={{
                background: item.done
                  ? accent === 'coral'
                    ? 'rgba(194,65,12,0.12)'
                    : 'rgba(25,147,86,0.15)'
                  : 'var(--neutral-bg)',
                color: item.done
                  ? accent === 'coral'
                    ? 'var(--coral)'
                    : 'var(--itutor-green)'
                  : '#d1d5db',
              }}
            >
              <Check size={10} strokeWidth={3} />
            </span>
            {item.label}
          </div>
        ))}
      </div>

      {autosaveNote && (
        <div className="mt-4 flex items-center gap-1.5 border-t border-[#f3f4f6] pt-3.5 text-xs text-[#9ca3af]">
          <Check size={12} /> Autosaved as you go
        </div>
      )}
    </div>
  )
}

/** The fixed bottom action bar on both profile builders. */
export function StickyFooterBar({
  left,
  children,
}: {
  left: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6 py-4">
        <span className="text-sm text-ink-muted">{left}</span>
        {children}
      </div>
    </div>
  )
}
