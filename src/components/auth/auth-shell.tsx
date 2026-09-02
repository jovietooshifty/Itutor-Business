'use client'

import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/components/ui'
import { Logo, PUBLIC_HOME } from '@/components/ui/logo'

/**
 * The split auth layout shared by Organization Sign-Up step 1 and
 * Learner Sign-Up step 1: a dark selling panel beside a white form card.
 */
export function AuthSplitLayout({
  accent,
  headline,
  headlineAccent,
  subcopy,
  bullets,
  children,
}: {
  accent: 'brand' | 'coral'
  headline: string
  headlineAccent: string
  subcopy: string
  bullets: string[]
  children: React.ReactNode
}) {
  const isCoral = accent === 'coral'
  return (
    <main
      className={cn(
        'flex min-h-screen items-center justify-center p-8 font-sans',
        isCoral ? 'bg-auth-learner' : 'bg-auth'
      )}
    >
      <div className="flex w-full max-w-marketing flex-col gap-6 lg:flex-row">
        <aside
          className={cn(
            'hidden w-full flex-col justify-between rounded-3xl p-10 text-white lg:flex lg:w-[55%]',
            isCoral ? 'bg-auth-panel-learner' : 'bg-auth-panel'
          )}
        >
          {/* Pre-auth screen: the public landing page is the correct home here. */}
          <Logo href={PUBLIC_HOME} accent={accent} theme="dark" size="lg" />

          <div className="grid gap-6">
            <h1 className="m-0 font-display text-[44px] font-bold leading-[1.1] tracking-heading">
              {headline}
              <br />
              <span className={isCoral ? 'text-coral' : 'text-itutor-green'}>{headlineAccent}</span>
            </h1>
            <p className="m-0 max-w-[420px] text-[15px] leading-relaxed text-white/70">{subcopy}</p>
            <ul className="m-0 grid list-none gap-3 p-0 text-sm text-white/85">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span
                    className={cn(
                      'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full',
                      isCoral ? 'bg-white/15 text-coral' : 'bg-[rgba(25,147,86,0.2)] text-itutor-green'
                    )}
                  >
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <p className="m-0 text-xs text-white/40">© 2026 iTutor Business</p>
        </aside>

        <section className="flex flex-1">
          <div className="mx-auto flex w-full max-w-[576px] flex-col rounded-3xl bg-white px-10 py-11 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
            {children}
          </div>
        </section>
      </div>
    </main>
  )
}

/** The "1 Account —— 2 Profile" stepper at the top of each signup card. */
export function StepIndicator({
  accent,
  current,
  labels,
}: {
  accent: 'brand' | 'coral'
  current: 1 | 2
  labels: [string, string]
}) {
  const activeBg = accent === 'coral' ? 'bg-coral' : 'bg-itutor-green'
  return (
    <div className="mb-8 flex items-center gap-3">
      {labels.map((label, i) => {
        const step = (i + 1) as 1 | 2
        const active = step <= current
        return (
          <React.Fragment key={label}>
            {i > 0 && <div className="h-0.5 flex-1 bg-[#e5e7eb]" />}
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'grid h-[26px] w-[26px] shrink-0 place-items-center rounded-full text-xs font-bold',
                  active ? cn(activeBg, 'text-white') : 'bg-[#e5e7eb] text-[#9ca3af]'
                )}
              >
                {step}
              </span>
              <span
                className={cn(
                  'text-sm',
                  active ? 'font-semibold text-ink' : 'font-medium text-[#9ca3af]'
                )}
              >
                {label}
              </span>
            </div>
          </React.Fragment>
        )
      })}
    </div>
  )
}

/** Four-segment password meter, scored by passwordStrength(). */
export function PasswordMeter({ score, label }: { score: number; label: string }) {
  const colors = ['#e5e7eb', '#dc2626', '#ea580c', '#ca8a04', '#199356']
  return (
    <>
      <div className="mt-2 flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="h-1 flex-1 rounded-sm"
            style={{ background: i < score ? colors[score] : '#e5e7eb' }}
          />
        ))}
      </div>
      <p className="mt-1 text-[11px] font-semibold text-[#6b7280]">{label}</p>
    </>
  )
}
