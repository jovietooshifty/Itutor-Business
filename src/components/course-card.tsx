import Link from 'next/link'
import { BookOpen, ImagePlus } from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * The course tile, shaped like the class cards on myitutor.com/explore:
 * a full-bleed thumbnail, then title, who it is by, a meta line, the
 * description, and a footer that pairs a fact on the left with the action on
 * the right.
 *
 * Shared by the business grid and the learner marketplace so a course looks
 * like the same object on both sides of the product — only the chips and the
 * footer action differ.
 */
export function CourseCard({
  href,
  title,
  thumbnailUrl,
  fallbackThumbnailUrl = null,
  providerName,
  providerLogoUrl,
  meta,
  description,
  chips,
  footerLeft,
  actionLabel,
  accent = 'brand',
  /** Business side only: nudges an admin to upload artwork. */
  thumbnailPrompt,
}: {
  href: string
  title: string
  thumbnailUrl: string | null
  /**
   * Shown when the course has no artwork of its own — in practice the
   * provider's cover image. A card is never blank, and "Add a thumbnail"
   * becomes a nudge over real artwork instead of sitting in a gap. Setting a
   * course's own thumbnail_url overrides it.
   */
  fallbackThumbnailUrl?: string | null
  providerName: string
  providerLogoUrl?: string | null
  meta?: string
  description?: string | null
  chips?: React.ReactNode
  footerLeft?: React.ReactNode
  actionLabel: string
  accent?: 'brand' | 'coral'
  thumbnailPrompt?: { href: string; label: string }
}) {
  const isBrand = accent === 'brand'
  const artwork = thumbnailUrl ?? fallbackThumbnailUrl

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-card border border-[#e5e7eb] bg-white transition-[transform,box-shadow] duration-slow ease-out hover:-translate-y-1 hover:shadow-hover-card">
      {/* One link covers the tile; anything clickable sits above it. */}
      <Link href={href} className="absolute inset-0 z-0" aria-label={title} />

      <div
        className={cn(
          'relative grid h-[132px] place-items-center',
          isBrand ? 'bg-brand-light' : 'bg-coral-soft'
        )}
      >
        {artwork ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={artwork} alt="" className="h-full w-full object-cover" />
        ) : (
          <BookOpen
            size={40}
            strokeWidth={1.6}
            className={isBrand ? 'text-[var(--itutor-green)]' : 'text-coral'}
            aria-hidden
          />
        )}

        {chips && <div className="absolute left-2.5 top-2.5 z-10 flex gap-1.5">{chips}</div>}

        {/* Keyed on the course's OWN artwork, not on what is displayed: the
            fallback fills the space but is still not this course's picture. */}
        {!thumbnailUrl && thumbnailPrompt && (
          <Link
            href={thumbnailPrompt.href}
            className="absolute bottom-2.5 right-2.5 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-ink no-underline shadow-sm transition-colors duration-fast hover:bg-white"
          >
            <ImagePlus size={13} aria-hidden /> {thumbnailPrompt.label}
          </Link>
        )}
      </div>

      <div className="flex flex-1 flex-col p-[18px]">
        <h3 className="m-0 font-display text-base font-bold leading-snug text-ink">{title}</h3>

        <div className="mt-1.5 flex items-center gap-2">
          {providerLogoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={providerLogoUrl}
              alt=""
              className="h-5 w-5 shrink-0 rounded-full object-cover"
            />
          ) : (
            <span
              className={cn(
                'grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white',
                isBrand ? 'bg-itutor-green' : 'bg-coral'
              )}
              aria-hidden
            >
              {providerName.charAt(0).toUpperCase()}
            </span>
          )}
          <span className="truncate text-xs text-ink-muted">by {providerName}</span>
        </div>

        {meta && <p className="m-0 mt-2 text-xs text-[#9ca3af]">{meta}</p>}

        {description && (
          <p className="m-0 mt-2 line-clamp-2 text-sm leading-relaxed text-ink-muted">
            {description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#f3f4f6] pt-3.5">
          <span className="min-w-0 text-xs text-[#9ca3af]">{footerLeft}</span>
          <span
            className={cn(
              // The whole tile is one link underneath; the pill is a label, not a
              // second target, so clicks have to fall through to it.
              'pointer-events-none shrink-0 rounded-full px-4 py-2 text-xs font-bold text-white',
              isBrand ? 'bg-itutor-green' : 'bg-coral'
            )}
          >
            {actionLabel}
          </span>
        </div>
      </div>
    </div>
  )
}
