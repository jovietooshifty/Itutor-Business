'use client'

import * as React from 'react'
import { Mail, Share2, X } from 'lucide-react'
import { Button, Input, cn } from '@/components/ui'
import { resetShareLink } from '@/app/(business)/courses/actions'

export type ShareCourse = {
  id: string
  title: string
  shareToken: string
  isPrivate: boolean
}

/**
 * The share affordance on a course card. Owns the modal so the courses grid
 * can stay a server component.
 */
export function ShareCourseButton({ course }: { course: ShareCourse }) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Share ${course.title}`}
        title="Share"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-surface-border text-[#6b7280] transition-colors duration-fast hover:border-[color:var(--itutor-green)] hover:text-[var(--itutor-green)]"
      >
        <Share2 size={15} aria-hidden />
      </button>
      {open && <ShareCourseModal course={course} onClose={() => setOpen(false)} />}
    </>
  )
}

/** Where a share link points. Falls back to the current origin in dev. */
function shareUrl(token: string) {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (typeof window === 'undefined' ? '' : window.location.origin)
  return `${base}/c/${token}`
}

export function ShareCourseModal({
  course,
  onClose,
}: {
  course: ShareCourse
  onClose: () => void
}) {
  // Held locally so a reset updates the link in place, without a round trip
  // through the server component that opened this.
  const [token, setToken] = React.useState(course.shareToken)
  const [copied, setCopied] = React.useState(false)
  const [reset, setReset] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [pending, startTransition] = React.useTransition()

  const dialogRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    dialogRef.current?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const link = shareUrl(token)
  const encodedLink = encodeURIComponent(link)
  const encodedTitle = encodeURIComponent(course.title)

  const socials = [
    { label: 'WhatsApp', href: `https://wa.me/?text=${encodedTitle}%20${encodedLink}` },
    { label: 'Email', href: `mailto:?subject=${encodedTitle}&body=${encodedLink}`, icon: Mail },
    {
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedLink}`,
    },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}` },
    { label: 'X', href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedLink}` },
  ]

  async function copy() {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('Could not copy — select the link and copy it manually.')
    }
  }

  function handleReset() {
    setError(null)
    startTransition(async () => {
      const result = await resetShareLink(course.id)
      if (!result.ok) {
        setError(result.error)
        return
      }
      setToken(result.data!.shareToken)
      setReset(true)
      window.setTimeout(() => setReset(false), 2500)
    })
  }

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
        aria-label={`Share ${course.title}`}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[440px] rounded-2xl bg-white p-7 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] outline-none"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-[26px] w-[26px] place-items-center rounded-full bg-surface-inset text-[#6b7280] hover:text-ink"
        >
          <X size={14} />
        </button>

        <h3 className="m-0 mb-1 font-display text-[18px] font-bold text-ink">
          Share &ldquo;{course.title}&rdquo;
        </h3>
        <p className="m-0 mb-[18px] text-[13px] text-[#9ca3af]">
          Anyone with this link can view the course.
        </p>

        <div className="flex gap-2">
          <Input value={link} readOnly onFocus={(e) => e.currentTarget.select()} />
          <Button onClick={copy} className="shrink-0">
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {socials.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-surface-border px-3.5 py-2 text-xs font-semibold text-ink no-underline transition-colors duration-fast hover:border-[color:var(--itutor-green)] hover:text-[var(--itutor-green)]"
            >
              {Icon && <Icon size={12} aria-hidden />}
              {label}
            </a>
          ))}
        </div>

        {course.isPrivate && (
          <p className="m-0 mt-4 rounded-md bg-surface-inset px-3 py-2.5 text-xs leading-relaxed text-[#9ca3af]">
            This is a private course — anyone with this link can join, and it won&apos;t appear on
            the public marketplace.
          </p>
        )}

        {error && <p className="m-0 mt-3 text-xs font-semibold text-danger-fg">{error}</p>}

        <div className="mt-3.5 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            disabled={pending}
            title="Generates a new link and breaks the old one"
            className={cn(
              'text-xs font-semibold text-[#9ca3af] hover:text-ink disabled:opacity-50',
              pending && 'cursor-wait'
            )}
          >
            Reset link
          </button>
          {reset && (
            <span className="text-xs font-semibold text-[var(--itutor-green)]">Link reset</span>
          )}
        </div>
      </div>
    </div>
  )
}
