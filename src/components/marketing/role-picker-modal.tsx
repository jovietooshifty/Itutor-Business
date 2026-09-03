'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowRight, Building2, GraduationCap, X } from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * "Business or learner?" as a dialog rather than a section further down the
 * page — the two sign-up paths are a choice to make at the moment you click
 * Get Started, not something to scroll for.
 */
export function RolePickerModal({ onClose }: { onClose: () => void }) {
  const dialogRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    dialogRef.current?.focus()

    // The page behind a modal should not scroll with it.
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [onClose])

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-5"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="role-picker-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[680px] rounded-3xl bg-white p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] outline-none md:p-10"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-surface-inset text-[#6b7280] hover:text-ink"
        >
          <X size={15} />
        </button>

        <div className="mb-7 text-center">
          <h2
            id="role-picker-title"
            className="m-0 mb-2 font-display text-[26px] font-bold tracking-heading text-ink"
          >
            How would you like to get started?
          </h2>
          <p className="m-0 text-sm text-ink-muted">
            You can always invite the rest of your team, or switch roles, later.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <RoleCard
            href="/business/signup"
            icon={<Building2 size={26} strokeWidth={2} aria-hidden />}
            title="I'm a Business"
            description="Onboard and train your contractors"
            accent="brand"
          />
          <RoleCard
            href="/learner/signup"
            icon={<GraduationCap size={26} strokeWidth={2} aria-hidden />}
            title="I'm a Learner"
            description="Take courses and grow your skills"
            accent="coral"
          />
        </div>

        <p className="m-0 mt-6 text-center text-sm text-ink-muted">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-[var(--itutor-green)] underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

function RoleCard({
  href,
  icon,
  title,
  description,
  accent,
}: {
  href: string
  icon: React.ReactNode
  title: string
  description: string
  accent: 'brand' | 'coral'
}) {
  const isBrand = accent === 'brand'

  return (
    <Link
      href={href}
      className={cn(
        'block rounded-2xl border border-[#f3f4f6] bg-white p-6 no-underline shadow-sm',
        'transition-[transform,box-shadow,border-color] duration-slow ease-out',
        'hover:-translate-y-1 hover:shadow-md',
        isBrand
          ? 'hover:border-[color:color-mix(in_oklab,var(--brand)_30%,transparent)]'
          : 'hover:border-[color:color-mix(in_oklab,var(--coral)_30%,transparent)]'
      )}
    >
      <span
        className={cn(
          'mb-4 grid h-12 w-12 place-items-center rounded-xl',
          isBrand ? 'bg-brand-light text-[var(--itutor-green)]' : 'bg-coral-soft text-coral'
        )}
      >
        {icon}
      </span>
      <span className="block font-display text-lg font-bold text-ink">{title}</span>
      <span className="mt-1 block text-sm text-ink-muted">{description}</span>
      <span
        className={cn(
          'mt-4 inline-flex items-center gap-1.5 text-sm font-semibold',
          isBrand ? 'text-[var(--itutor-green)]' : 'text-coral'
        )}
      >
        Get started <ArrowRight size={14} aria-hidden />
      </span>
    </Link>
  )
}

/** Opens the picker. Every "Get Started"/"Sign up" entry point uses this. */
export function RolePickerTrigger({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>
      {open && <RolePickerModal onClose={() => setOpen(false)} />}
    </>
  )
}
