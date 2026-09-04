'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Check, Copy, ExternalLink, Eye, EyeOff, Share2 } from 'lucide-react'
import { Button, Card, cn } from '@/components/ui'
import { setCertificateVisibility } from '@/app/(learner)/actions'

export type PortfolioCertificate = {
  certificateId: string
  courseTitle: string
  businessName: string
  issuedAt: string
  visible: boolean
}

/**
 * The learner's own portfolio: a share bar, then per-certificate visibility.
 *
 * The public/private toggle is gone. A portfolio is reached by a link nobody
 * can guess — a random 18-character slug, the same construction as a
 * certificate id — and that is the privacy model in full. The toggle was asked
 * during signup, before a learner had any idea what a portfolio was, and it
 * answered a question they had no way to have an opinion on yet.
 *
 * Per-certificate visibility stays: choosing which of your courses an employer
 * sees is a real decision, and it is made here, with the list in front of you.
 */
export function PortfolioControls({
  slug,
  certificates,
}: {
  slug: string | null
  certificates: PortfolioCertificate[]
}) {
  const router = useRouter()
  const [pending, startTransition] = React.useTransition()
  const [error, setError] = React.useState<string | null>(null)
  const [copied, setCopied] = React.useState(false)

  function run(action: () => Promise<{ ok: boolean; error?: string }>) {
    setError(null)
    startTransition(async () => {
      const result = await action()
      if (!result.ok) {
        setError(result.error ?? 'Something went wrong.')
        return
      }
      router.refresh()
    })
  }

  /* Built in the browser so the link is right on any host — a preview
     deployment, localhost, or the real domain. */
  const [origin, setOrigin] = React.useState('')
  React.useEffect(() => setOrigin(window.location.origin), [])
  const shareUrl = slug ? `${origin}/p/${slug}` : ''
  const shareText = 'Here is my training portfolio:'

  const shareTargets = slug
    ? [
        {
          label: 'WhatsApp',
          href: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
        },
        {
          label: 'X',
          href: `https://x.com/intent/post?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
        },
      ]
    : []

  return (
    <>
      <Card className="p-6">
        <h2 className="m-0 flex items-center gap-2 font-display text-base font-bold text-ink">
          <Share2 size={16} aria-hidden /> Share your portfolio
        </h2>
        <p className="m-0 mt-1 text-sm text-ink-muted">
          Anyone with this link can see the certificates you show below. It is not listed
          anywhere and cannot be searched for — only people you send it to can open it.
        </p>

        {slug ? (
          <>
            <div className="mt-4 flex flex-wrap gap-2">
              <input
                readOnly
                value={shareUrl}
                onFocus={(e) => e.currentTarget.select()}
                aria-label="Your portfolio link"
                className="min-w-[200px] flex-1 rounded-md border border-surface-border bg-surface-inset px-3 py-2.5 text-[12.5px] font-sans text-ink outline-none"
              />
              <Button
                accent="coral"
                onClick={() => {
                  void navigator.clipboard.writeText(shareUrl)
                  setCopied(true)
                  window.setTimeout(() => setCopied(false), 2000)
                }}
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? 'Copied' : 'Copy link'}
              </Button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {shareTargets.map((target) => (
                <a
                  key={target.label}
                  href={target.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-surface-border px-3.5 py-1.5 text-xs font-semibold text-ink no-underline transition-colors duration-fast hover:border-coral hover:text-coral"
                >
                  {target.label}
                </a>
              ))}
              {/* Instagram has no web share URL — it takes a link from the
                  clipboard, pasted into a bio or a DM — so this says what to
                  do rather than pretending to be a share button. */}
              <span className="text-xs text-[#9ca3af]">
                For Instagram, copy the link and paste it in your bio or a message.
              </span>
            </div>

            <p className="m-0 mt-3">
              <Link
                href={`/p/${slug}`}
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-coral"
              >
                See what employers see <ExternalLink size={13} aria-hidden />
              </Link>
            </p>
          </>
        ) : (
          <p className="m-0 mt-4 rounded-md bg-surface-inset px-3.5 py-2.5 text-sm text-ink-muted">
            Your link is created with your profile. Finish setting your profile up and it will
            appear here.
          </p>
        )}
      </Card>

      {error && (
        <p className="mt-4 rounded-md bg-danger-bg px-4 py-3 text-sm text-danger-fg">{error}</p>
      )}

      <h2 className="mb-3 mt-7 font-display text-lg font-bold text-ink">Certificates</h2>

      {certificates.length === 0 ? (
        <Card className="py-10 text-center">
          <p className="m-0 text-sm text-ink-muted">
            No certificates yet — finish a course and one is issued automatically.
          </p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {certificates.map((cert) => (
            <Card key={cert.certificateId} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/certificates/${cert.certificateId}`}
                    className="font-display text-base font-bold text-ink no-underline hover:underline"
                  >
                    {cert.courseTitle}
                  </Link>
                  <p className="m-0 mt-0.5 text-sm text-ink-muted">{cert.businessName}</p>
                  <p className="m-0 mt-1 text-xs text-[#9ca3af]">
                    Issued {new Date(cert.issuedAt).toLocaleDateString()} ·{' '}
                    <span className="font-mono">{cert.certificateId}</span>
                  </p>
                </div>

                <button
                  type="button"
                  disabled={pending}
                  title={
                    cert.visible
                      ? 'Hide from my portfolio'
                      : 'Show on my portfolio'
                  }
                  onClick={() =>
                    run(() => setCertificateVisibility(cert.certificateId, !cert.visible))
                  }
                  className={cn(
                    'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors duration-fast disabled:cursor-not-allowed disabled:opacity-50',
                    cert.visible
                      ? 'border-coral text-coral'
                      : 'border-surface-border text-ink-muted'
                  )}
                >
                  {cert.visible ? <Eye size={13} /> : <EyeOff size={13} />}
                  {cert.visible ? 'Shown' : 'Hidden'}
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
