'use client'

import * as React from 'react'

export { cn } from '@/lib/cn'
import { cn } from '@/lib/cn'

/* ── Button ────────────────────────────────────────────────────────────── */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'
/** Business screens are green-keyed, learner screens coral-keyed. */
export type Accent = 'brand' | 'coral'

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-[34px] px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-7 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  accent = 'brand',
  fullWidth,
  loading,
  className,
  children,
  disabled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  accent?: Accent
  fullWidth?: boolean
  loading?: boolean
}) {
  const accentBg = accent === 'coral' ? 'bg-coral' : 'bg-itutor-green'
  const accentHover = accent === 'coral' ? 'hover:brightness-110' : 'hover:bg-brand-dark'

  const variants: Record<ButtonVariant, string> = {
    primary: cn(accentBg, accentHover, 'text-white'),
    secondary: 'bg-white text-ink border border-surface-border hover:bg-surface-inset',
    ghost: 'bg-transparent text-ink-muted hover:bg-surface-inset',
    danger: 'bg-[var(--danger-fg)] text-white hover:brightness-110',
  }

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-bold font-sans',
        'transition-colors duration-fast ease-out',
        'disabled:cursor-not-allowed disabled:opacity-60',
        SIZE_CLASSES[size],
        variants[variant],
        fullWidth && 'w-full',
        className
      )}
    >
      {loading && <Spinner />}
      {children}
    </button>
  )
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-block h-3.5 w-3.5 shrink-0 rounded-full border-2 border-white/40 border-t-white',
        'animate-[spin_0.6s_linear_infinite]',
        className
      )}
    />
  )
}

/* ── Field wrapper ─────────────────────────────────────────────────────── */

export function Field({
  label,
  hint,
  error,
  optional,
  htmlFor,
  children,
  className,
}: {
  label?: string
  hint?: string
  error?: string | null
  optional?: boolean
  htmlFor?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="mb-1.5 block text-sm font-medium text-[#374151]"
        >
          {label}
          {optional && <span className="font-normal text-[#9ca3af]"> (optional)</span>}
        </label>
      )}
      {hint && <p className="mb-2 mt-0 text-xs leading-relaxed text-[#9ca3af]">{hint}</p>}
      {children}
      {error && <p className="mt-1 text-xs text-[var(--danger-fg)]">{error}</p>}
    </div>
  )
}

const CONTROL_BASE =
  'w-full rounded-md border bg-white px-3 py-2.5 text-sm font-sans text-ink outline-none ' +
  'placeholder:text-[#9ca3af] focus:border-[color:var(--itutor-green)] ' +
  'disabled:bg-surface-inset disabled:text-ink-muted read-only:bg-surface-inset'

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }
>(function Input({ className, invalid, ...props }, ref) {
  return (
    <input
      ref={ref}
      {...props}
      className={cn(CONTROL_BASE, invalid ? 'border-[#fca5a5]' : 'border-surface-border', className)}
    />
  )
})

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      {...props}
      className={cn(CONTROL_BASE, 'resize-y border-surface-border', className)}
    />
  )
})

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className, children, ...props }, ref) {
  return (
    <select
      ref={ref}
      {...props}
      className={cn(CONTROL_BASE, 'h-[42px] border-surface-border py-0', className)}
    >
      {children}
    </select>
  )
})

/* ── Card / Badge / Avatar / ProgressBar ───────────────────────────────── */

export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn('rounded-xl border border-[#f3f4f6] bg-white p-7 shadow-sm', className)}
    >
      {children}
    </div>
  )
}

export function SectionCard({
  title,
  subtitle,
  optional,
  children,
  className,
}: {
  title: string
  subtitle?: string
  optional?: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <Card className={className}>
      <h3 className="font-display text-h4 font-bold text-ink">
        {title}
        {optional && (
          <span className="ml-2 text-[11px] font-semibold uppercase tracking-[0.05em] text-[#9ca3af]">
            optional
          </span>
        )}
      </h3>
      {subtitle && <p className="mt-1 text-xs text-[#9ca3af]">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </Card>
  )
}

const BADGE_TONES = {
  neutral: 'bg-neutral-bg text-neutral-fg',
  success: 'bg-success-bg text-success-fg',
  warning: 'bg-warning-bg text-warning-fg',
  danger: 'bg-danger-bg text-danger-fg',
  info: 'bg-info-bg text-info-fg',
} as const

export function Badge({
  tone = 'neutral',
  children,
  className,
}: {
  tone?: keyof typeof BADGE_TONES
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-2xs font-bold',
        BADGE_TONES[tone],
        className
      )}
    >
      {children}
    </span>
  )
}

/** Initials avatar; deterministic hue so a given name always looks the same. */
export function Avatar({
  name,
  src,
  size = 36,
  className,
}: {
  name?: string | null
  src?: string | null
  size?: number
  className?: string
}) {
  const initials = (name ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')

  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={name ?? ''}
        width={size}
        height={size}
        className={cn('shrink-0 rounded-full object-cover', className)}
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <span
      className={cn(
        'grid shrink-0 place-items-center rounded-full bg-brand-light font-bold text-[var(--itutor-green)]',
        className
      )}
      style={{ width: size, height: size, fontSize: Math.max(10, size * 0.38) }}
    >
      {initials || '?'}
    </span>
  )
}

export function ProgressBar({
  value,
  accent = 'brand',
  height = 10,
  className,
}: {
  value: number
  accent?: Accent
  height?: number
  className?: string
}) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('w-full overflow-hidden rounded-full bg-neutral-bg', className)}
      style={{ height }}
    >
      <div
        className={cn(
          'h-full rounded-full transition-[width] duration-slow ease-out',
          accent === 'coral' ? 'bg-coral' : 'bg-itutor-green'
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export function Checkbox({
  label,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: React.ReactNode }) {
  return (
    <label className={cn('flex cursor-pointer items-center gap-2.5 text-sm text-ink', className)}>
      <input
        type="checkbox"
        {...props}
        className="h-4 w-4 shrink-0 accent-[var(--itutor-green)]"
      />
      {label}
    </label>
  )
}

export function Toggle({
  checked,
  onChange,
  accent = 'brand',
  label,
}: {
  checked: boolean
  onChange: (next: boolean) => void
  accent?: Accent
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-[26px] w-11 shrink-0 rounded-full transition-colors duration-fast',
        checked ? (accent === 'coral' ? 'bg-coral' : 'bg-itutor-green') : 'bg-[#d1d5db]'
      )}
    >
      <span
        className="absolute top-0.5 h-[22px] w-[22px] rounded-full bg-white shadow-md transition-[left] duration-fast"
        style={{ left: checked ? 20 : 2 }}
      />
    </button>
  )
}

/* ── Segmented control ─────────────────────────────────────────────────── */

export function SegmentedControl({
  options,
  value,
  onChange,
  className,
}: {
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
  className?: string
}) {
  return (
    <div
      className={cn(
        'inline-flex rounded-lg border border-surface-border bg-surface-inset p-1',
        className
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
          className={cn(
            'rounded-md px-3.5 py-1.5 text-[13px] font-semibold transition-colors duration-fast',
            value === option.value
              ? 'bg-white text-ink shadow-sm'
              : 'text-ink-muted hover:text-ink'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

/* ── Chip ──────────────────────────────────────────────────────────────── */

export function Chip({
  children,
  onRemove,
  accent = 'brand',
}: {
  children: React.ReactNode
  onRemove?: () => void
  accent?: Accent
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold',
        accent === 'coral' ? 'bg-coral-soft text-[#9a3412]' : 'bg-brand-light text-[var(--itutor-green)]'
      )}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove"
          className="cursor-pointer leading-none opacity-70 hover:opacity-100"
        >
          ×
        </button>
      )}
    </span>
  )
}
