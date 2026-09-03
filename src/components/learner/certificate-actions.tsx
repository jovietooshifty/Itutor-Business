'use client'

import * as React from 'react'
import { Copy, Linkedin, Printer } from 'lucide-react'
import { Button } from '@/components/ui'
import type { CertificateDetails } from '@/components/learner/certificate-card'

/**
 * Actions on a certificate. "Add to LinkedIn" is deliberately not the generic
 * share link — handoff §7 calls that out: it targets LinkedIn's add-certification
 * form with the fields pre-filled, which is a different thing from posting a
 * link to a feed.
 */
export function CertificateActions({ details }: { details: CertificateDetails }) {
  const [copied, setCopied] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Built on the client so it reflects the domain the holder is actually on.
  const verifyUrl =
    typeof window === 'undefined'
      ? ''
      : `${window.location.origin}/verify/${details.certificateId}`

  const issued = new Date(details.issuedAt)
  const linkedInUrl =
    'https://www.linkedin.com/profile/add?' +
    new URLSearchParams({
      startTask: 'CERTIFICATION_NAME',
      name: details.courseTitle,
      organizationName: details.businessName,
      issueYear: String(issued.getFullYear()),
      issueMonth: String(issued.getMonth() + 1),
      certUrl: verifyUrl,
      certId: details.certificateId,
    }).toString()

  const shareTargets = [
    {
      label: 'WhatsApp',
      href: `https://wa.me/?text=${encodeURIComponent(`${details.courseTitle} ${verifyUrl}`)}`,
    },
    {
      label: 'Email',
      href: `mailto:?subject=${encodeURIComponent(details.courseTitle)}&body=${encodeURIComponent(verifyUrl)}`,
    },
    {
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(verifyUrl)}`,
    },
    {
      label: 'X',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(details.courseTitle)}&url=${encodeURIComponent(verifyUrl)}`,
    },
  ]

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(verifyUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('Could not copy the link — copy it from the address bar instead.')
    }
  }

  return (
    <div className="print:hidden">
      <div className="flex flex-wrap gap-3">
        {/* Real PDF rendering is a server-side job; the browser's own
            print-to-PDF is honest about what this does. */}
        <Button onClick={() => window.print()}>
          <Printer size={15} /> Download / Print
        </Button>

        <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" className="no-underline">
          <Button variant="secondary">
            <Linkedin size={15} /> Add to LinkedIn
          </Button>
        </a>

        <Button variant="secondary" onClick={copyLink}>
          <Copy size={15} /> {copied ? 'Copied' : 'Copy link'}
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-[#9ca3af]">Share</span>
        {shareTargets.map((target) => (
          <a
            key={target.label}
            href={target.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-surface-border px-3.5 py-1.5 text-xs font-semibold text-ink no-underline transition-colors duration-fast hover:border-[color:var(--itutor-green)] hover:text-[var(--itutor-green)]"
          >
            {target.label}
          </a>
        ))}
      </div>

      {error && <p className="mt-3 text-xs font-semibold text-danger-fg">{error}</p>}

      <p className="mt-4 text-xs text-ink-muted">
        Anyone with the link can confirm this certificate without signing in.
      </p>
    </div>
  )
}
