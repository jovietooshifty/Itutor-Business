import { BadgeCheck } from 'lucide-react'

export type CertificateDetails = {
  certificateId: string
  issuedAt: string
  learnerName: string
  courseTitle: string
  businessName: string
  /** Only rendered when the business actually uploaded one — handoff §7. */
  businessStampUrl: string | null
}

/**
 * The certificate itself. Shared by the holder's view and the public
 * verification page so the two can never drift apart — a certificate that
 * looked different depending on who opened it would undermine the point.
 */
export function CertificateCard({
  details,
  verified = false,
}: {
  details: CertificateDetails
  /** The public verification page asserts this; the holder's view does not. */
  verified?: boolean
}) {
  const issued = new Date(details.issuedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="rounded-2xl border-[3px] border-[color:var(--itutor-green)] bg-white px-8 py-10 text-center shadow-card md:px-14 md:py-12">
      {verified && (
        <span className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-brand-light px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-[var(--itutor-green)]">
          <BadgeCheck size={14} aria-hidden /> Verified
        </span>
      )}

      <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-[#9ca3af]">
        Certificate of Completion
      </p>

      <p className="m-0 mt-7 text-sm text-ink-muted">This certifies that</p>
      <p className="m-0 mt-1.5 font-display text-[30px] font-bold leading-tight text-ink">
        {details.learnerName}
      </p>

      <p className="m-0 mt-5 text-sm text-ink-muted">has successfully completed</p>
      <p className="m-0 mt-1.5 font-display text-[22px] font-bold leading-snug text-ink">
        {details.courseTitle}
      </p>

      <p className="m-0 mt-5 text-sm text-ink-muted">
        issued by <span className="font-semibold text-ink">{details.businessName}</span>
      </p>

      {/* No placeholder when there is no stamp — an empty frame reads as a
          missing seal rather than a business that never uploaded one. */}
      {details.businessStampUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={details.businessStampUrl}
          alt={`${details.businessName} stamp`}
          className="mx-auto mt-7 h-[86px] w-[86px] object-contain"
        />
      )}

      <div className="mt-8 border-t border-border pt-5 text-xs text-[#9ca3af]">
        <p className="m-0">Issued {issued}</p>
        <p className="m-0 mt-1">
          Certificate ID <span className="font-mono font-semibold">{details.certificateId}</span>
        </p>
      </div>
    </div>
  )
}
