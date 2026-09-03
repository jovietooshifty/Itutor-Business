'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { Card, Toggle, cn } from '@/components/ui'
import { setCertificateVisibility, setPortfolioVisibility } from '@/app/(learner)/actions'

export type PortfolioCertificate = {
  certificateId: string
  courseTitle: string
  businessName: string
  issuedAt: string
  visible: boolean
}

/**
 * The two visibility switches from the handoff: the portfolio as a whole, and
 * each certificate on it. Both have to be on for anything to be publicly
 * readable — which is exactly what certificates_select_public_portfolio
 * checks — so the per-certificate rows are disabled while the portfolio itself
 * is private, rather than implying they do something on their own.
 */
export function PortfolioControls({
  isPublic,
  slug,
  certificates,
}: {
  isPublic: boolean
  slug: string | null
  certificates: PortfolioCertificate[]
}) {
  const router = useRouter()
  const [pending, startTransition] = React.useTransition()
  const [error, setError] = React.useState<string | null>(null)

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

  return (
    <>
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="m-0 font-display text-base font-bold text-ink">Public portfolio</h2>
            <p className="m-0 mt-1 text-sm text-ink-muted">
              {isPublic
                ? 'Anyone with your link can see the certificates you’ve chosen to show.'
                : 'Your portfolio is private. Nobody else can open it.'}
            </p>
          </div>
          <Toggle
            checked={isPublic}
            accent="coral"
            label="Make my portfolio public"
            onChange={(next) => {
              if (pending) return
              run(() => setPortfolioVisibility(next))
            }}
          />
        </div>

        {isPublic && slug && (
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-md bg-surface-inset px-3.5 py-2.5">
            <span className="text-xs text-ink-muted">Your link:</span>
            <Link href={`/p/${slug}`} className="text-xs font-semibold text-coral">
              /p/{slug}
            </Link>
          </div>
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
                  disabled={pending || !isPublic}
                  title={
                    isPublic
                      ? cert.visible
                        ? 'Hide from my public portfolio'
                        : 'Show on my public portfolio'
                      : 'Make your portfolio public first'
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
