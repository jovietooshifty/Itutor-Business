'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Download, ExternalLink, FileText, Lightbulb, Target } from 'lucide-react'
import { Button, Card, Checkbox } from '@/components/ui'
import { completeBlock } from '@/app/(learner)/actions'
import { asSlides, asText, asVideo, type BlockType } from '@/lib/course'
import type { MaterialView } from '@/lib/material-view'

/** True for a file we can play ourselves and therefore actually gate on. */
function isDirectVideo(url: string) {
  return /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(url)
}

/**
 * Renders one lesson and decides when it may be marked complete.
 *
 * The gating is deliberately honest: it only claims to know you finished
 * something when it can actually tell. A video file we play ourselves fires
 * `ended`; a legacy YouTube link in an iframe tells us nothing, so that case
 * asks for a confirmation instead of pretending to have watched along.
 *
 * The authored framing — guidelines, notes, pointers, summary — is placed
 * around the material rather than appended to it. "Take notes as you watch"
 * after the video has finished is not guidance, it is a postmortem.
 */
export function BlockPlayer({
  courseId,
  blockId,
  type,
  content,
  completed,
  materialUrl,
  materialDisplay = null,
}: {
  courseId: string
  blockId: string
  type: Exclude<BlockType, 'quiz'>
  content: unknown
  completed: boolean
  /** Signed URL for the uploaded file, minted server-side. Null if there is none. */
  materialUrl: string | null
  /** How to show an uploaded document in the page — see lib/material-view. */
  materialDisplay?: MaterialView | null
}) {
  const router = useRouter()
  const [done, setDone] = React.useState(false)
  const [confirmed, setConfirmed] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [pending, startTransition] = React.useTransition()

  // Already-completed lessons are freely revisitable, so nothing to earn.
  const canComplete = completed || done || confirmed

  function finish() {
    setError(null)
    startTransition(async () => {
      const result = await completeBlock(courseId, blockId)
      if (!result.ok) {
        setError(result.error)
        return
      }
      const next = result.data!.nextBlockId
      router.push(next ? `/learn/${courseId}/${next}` : `/learn/${courseId}`)
    })
  }

  return (
    <>
      {type === 'video' ? (
        <VideoLesson
          content={content}
          materialUrl={materialUrl}
          onWatched={() => setDone(true)}
        />
      ) : type === 'slides' ? (
        <SlidesLesson
          content={content}
          materialUrl={materialUrl}
          materialDisplay={materialDisplay}
        />
      ) : (
        <TextLesson
          content={content}
          materialUrl={materialUrl}
          materialDisplay={materialDisplay}
          onRead={() => setDone(true)}
        />
      )}

      {!canComplete && (
        <div className="mt-4 rounded-lg border border-surface-border bg-white px-4 py-3.5">
          <Checkbox
            label={
              type === 'video'
                ? "I've watched this video"
                : type === 'slides'
                  ? "I've been through these slides"
                  : "I've read this"
            }
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
          />
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-md bg-danger-bg px-4 py-3 text-sm text-danger-fg">{error}</p>
      )}

      <div className="mt-5 flex justify-end">
        <Button size="lg" accent="coral" loading={pending} disabled={!canComplete} onClick={finish}>
          {completed ? 'Continue' : 'Mark complete & continue'}
        </Button>
      </div>
    </>
  )
}

/* ── Framing ───────────────────────────────────────────────────────────── */

/** The author's instruction, above the material because that is when it helps. */
function Guidance({ icon: Icon, label, body }: { icon: typeof Target; label: string; body: string }) {
  if (!body.trim()) return null
  return (
    <div className="mb-4 flex items-start gap-3 rounded-lg border border-coral-soft bg-coral-soft px-4 py-3.5">
      <Icon size={16} className="mt-0.5 shrink-0 text-coral" aria-hidden />
      <div className="min-w-0">
        <p className="m-0 text-xs font-bold uppercase tracking-wide text-[#9a3412]">{label}</p>
        <p className="m-0 mt-1 whitespace-pre-wrap text-sm leading-relaxed text-ink">{body}</p>
      </div>
    </div>
  )
}

/** Supporting material, below. */
function Aside({ label, body }: { label: string; body: string }) {
  if (!body.trim()) return null
  return (
    <div className="mt-4 rounded-lg border border-surface-border bg-surface-inset px-4 py-3.5">
      <p className="m-0 text-xs font-bold uppercase tracking-wide text-[#9ca3af]">{label}</p>
      <p className="m-0 mt-1 whitespace-pre-wrap text-sm leading-relaxed text-ink">{body}</p>
    </div>
  )
}

/* ── Video ─────────────────────────────────────────────────────────────── */

function VideoLesson({
  content,
  materialUrl,
  onWatched,
}: {
  content: unknown
  materialUrl: string | null
  onWatched: () => void
}) {
  const value = asVideo(content)

  return (
    <>
      <Guidance icon={Target} label="Before you start" body={value.guidelines} />

      <Card className="p-6 md:p-8">
        <VideoSurface value={value} materialUrl={materialUrl} onWatched={onWatched} />
        <Aside label="Notes" body={value.notes} />
      </Card>
    </>
  )
}

function VideoSurface({
  value,
  materialUrl,
  onWatched,
}: {
  value: ReturnType<typeof asVideo>
  materialUrl: string | null
  onWatched: () => void
}) {
  // An uploaded file is one we serve and can therefore gate on honestly.
  if (value.path && materialUrl) {
    return (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <video
        src={materialUrl}
        controls
        onEnded={onWatched}
        className="w-full rounded-lg bg-black"
        // Seeking past the end would otherwise fire `ended` immediately.
        controlsList="nodownload"
      />
    )
  }

  if (value.path) {
    return (
      <p className="m-0 text-sm text-ink-muted">
        This video could not be loaded. Try again, or let the course owner know.
      </p>
    )
  }

  /* Everything below is legacy: courses authored when a video could be a link.
     The builder no longer writes these, but a course that has one still has to
     play. */
  const url = value.url
  if (!url) {
    return <p className="m-0 text-sm text-ink-muted">This lesson has no video yet.</p>
  }

  if (isDirectVideo(url)) {
    return (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <video
        src={url}
        controls
        onEnded={onWatched}
        className="w-full rounded-lg bg-black"
        controlsList="nodownload"
      />
    )
  }

  const embed = toEmbedUrl(url)
  return embed ? (
    <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
      <iframe
        src={embed}
        title="Lesson video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full border-0"
      />
    </div>
  ) : (
    <ExternalContent url={url} label="Open the video" />
  )
}

/** YouTube and Vimeo watch URLs are not embeddable as-is. */
function toEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') return `https://www.youtube.com/embed${parsed.pathname}`
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const id = parsed.searchParams.get('v')
      if (id) return `https://www.youtube.com/embed/${id}`
      if (parsed.pathname.startsWith('/embed/')) return url
    }
    if (host === 'vimeo.com') return `https://player.vimeo.com/video${parsed.pathname}`
    return null
  } catch {
    return null
  }
}

/* ── Slides ────────────────────────────────────────────────────────────── */

/**
 * A deck, framed the way a text lesson is.
 *
 * A PDF gets the browser's own viewer, which already does pagination, zoom and
 * fullscreen better than anything worth rebuilding here. A .pptx has no viewer
 * anywhere, so it is offered as a download and says so plainly — the author was
 * warned about this when they uploaded it.
 */
function SlidesLesson({
  content,
  materialUrl,
  materialDisplay,
}: {
  content: unknown
  materialUrl: string | null
  materialDisplay: MaterialView | null
}) {
  const value = asSlides(content)

  return (
    <>
      <Guidance icon={Target} label="What to look for" body={value.pointers} />

      <Card className="p-6 md:p-8">
        {!value.path || !materialUrl ? (
          <p className="m-0 text-sm text-ink-muted">
            {value.path
              ? 'This deck could not be loaded. Try again, or let the course owner know.'
              : 'This lesson has no slides yet.'}
          </p>
        ) : materialDisplay?.kind === 'embed' ? (
          <div>
            <iframe
              src={materialDisplay.url}
              title={materialDisplay.fileName}
              className="h-[75vh] w-full rounded-lg border border-surface-border bg-surface-inset"
            />
            <MaterialFooter url={materialDisplay.url} fileName={materialDisplay.fileName} />
          </div>
        ) : (
          <div>
            {/* The honest version of "we cannot show this". Nothing renders a
                PowerPoint file in a browser, so pretending otherwise with a
                broken frame would be worse than saying so. */}
            <p className="m-0 mb-3 rounded-md bg-surface-inset px-3.5 py-2.5 text-xs text-ink-muted">
              This deck is a PowerPoint file, which cannot be shown inside the lesson. Download it
              to go through it, then come back.
            </p>
            <ExternalContent url={materialUrl} label={value.fileName ?? 'Open the deck'} />
          </div>
        )}
      </Card>

      {/* No auto-completion here. A PDF is read inside the browser's own
          viewer, which tells us nothing about how far someone scrolled, and a
          downloaded deck is read somewhere else entirely — so the confirmation
          checkbox is the honest gate, exactly as it is for a linked video. */}

      {value.summary.trim() && (
        <div className="mt-4 flex items-start gap-3 rounded-lg border border-[color:var(--itutor-green)] bg-brand-light px-4 py-3.5">
          <Lightbulb size={16} className="mt-0.5 shrink-0 text-[var(--itutor-green)]" aria-hidden />
          <div className="min-w-0">
            <p className="m-0 text-xs font-bold uppercase tracking-wide text-[var(--itutor-green)]">
              The takeaway
            </p>
            <p className="m-0 mt-1 whitespace-pre-wrap text-sm leading-relaxed text-ink">
              {value.summary}
            </p>
          </div>
        </div>
      )}
    </>
  )
}

/* ── Text ──────────────────────────────────────────────────────────────── */

function TextLesson({
  content,
  materialUrl,
  materialDisplay,
  onRead,
}: {
  content: unknown
  materialUrl: string | null
  materialDisplay: MaterialView | null
  onRead: () => void
}) {
  const value = asText(content)

  return (
    <>
      <Guidance icon={Target} label="What to look for" body={value.pointers} />

      <Card className="p-6 md:p-8">
        <TextSurface
          value={value}
          materialUrl={materialUrl}
          materialDisplay={materialDisplay}
          onRead={onRead}
        />
      </Card>

      {value.summary.trim() && (
        <div className="mt-4 flex items-start gap-3 rounded-lg border border-[color:var(--itutor-green)] bg-brand-light px-4 py-3.5">
          <Lightbulb
            size={16}
            className="mt-0.5 shrink-0 text-[var(--itutor-green)]"
            aria-hidden
          />
          <div className="min-w-0">
            <p className="m-0 text-xs font-bold uppercase tracking-wide text-[var(--itutor-green)]">
              The takeaway
            </p>
            <p className="m-0 mt-1 whitespace-pre-wrap text-sm leading-relaxed text-ink">
              {value.summary}
            </p>
          </div>
        </div>
      )}
    </>
  )
}

function TextSurface({
  value,
  materialUrl,
  materialDisplay,
  onRead,
}: {
  value: ReturnType<typeof asText>
  materialUrl: string | null
  materialDisplay: MaterialView | null
  onRead: () => void
}) {
  // Scroll-to-end gating, per the handoff. Meaningful for anything we render
  // ourselves — including a converted document, which is now most of them.
  // Only a file handed to the browser's own viewer is read where we cannot see.
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    function check() {
      const node = scrollRef.current
      if (!node) return
      // Content shorter than its container is already fully read.
      if (node.scrollHeight - node.clientHeight <= 8) return onRead()
      if (node.scrollTop + node.clientHeight >= node.scrollHeight - 8) onRead()
    }

    check()
    el.addEventListener('scroll', check, { passive: true })
    return () => el.removeEventListener('scroll', check)
  }, [onRead])

  if (value.mode === 'upload') {
    if (!value.path) {
      return <p className="m-0 text-sm text-ink-muted">This lesson has no document yet.</p>
    }
    if (!materialUrl) {
      return (
        <p className="m-0 text-sm text-ink-muted">
          This document could not be loaded. Try again, or let the course owner know.
        </p>
      )
    }

    /* A PDF goes to the browser's own viewer. It is read inside an iframe we
       cannot observe, so the "I've read this" checkbox stays the gate. */
    if (materialDisplay?.kind === 'embed') {
      return (
        <div>
          <iframe
            src={materialDisplay.url}
            title={materialDisplay.fileName}
            className="h-[70vh] w-full rounded-lg border border-surface-border bg-surface-inset"
          />
          <MaterialFooter url={materialDisplay.url} fileName={materialDisplay.fileName} />
        </div>
      )
    }

    /* A converted document is our own markup, so it scrolls in the page and
       reaching the end counts as having read it — the same gate the rich-text
       lesson below has always used. */
    if (materialDisplay?.kind === 'html') {
      return (
        <div>
          <div
            ref={scrollRef}
            className="prose-material max-h-[70vh] overflow-y-auto text-[15px] leading-relaxed text-ink"
            // Converted by mammoth from the uploaded .docx and sanitised
            // server-side — see sanitizeDocumentHtml in lib/material-view.
            dangerouslySetInnerHTML={{ __html: materialDisplay.html }}
          />
          <MaterialFooter url={materialUrl} fileName={materialDisplay.fileName} />
        </div>
      )
    }

    if (materialDisplay?.kind === 'text') {
      return (
        <div>
          <div
            ref={scrollRef}
            className="max-h-[70vh] overflow-y-auto whitespace-pre-wrap text-[15px] leading-relaxed text-ink"
          >
            {materialDisplay.text}
          </div>
          <MaterialFooter url={materialUrl} fileName={materialDisplay.fileName} />
        </div>
      )
    }

    // Nothing we can render: say why, and still let them open it.
    return (
      <div>
        {materialDisplay?.kind === 'link' && materialDisplay.reason && (
          <p className="m-0 mb-3 rounded-md bg-surface-inset px-3.5 py-2.5 text-xs text-ink-muted">
            {materialDisplay.reason}
          </p>
        )}
        <ExternalContent url={materialUrl} label={value.fileName ?? 'Open the document'} />
      </div>
    )
  }

  if (!value.body.trim()) {
    return <p className="m-0 text-sm text-ink-muted">This lesson has no content yet.</p>
  }

  return (
    <div
      ref={scrollRef}
      className="max-h-[60vh] overflow-y-auto whitespace-pre-wrap text-[15px] leading-relaxed text-ink"
    >
      {value.body}
    </div>
  )
}

/**
 * Under a document shown in the page: what it is, and a way to keep it.
 *
 * Reading happens here now, so the download is the secondary action rather
 * than the only one — but a learner who wants the file on their phone for the
 * shop floor should still be able to take it.
 */
function MaterialFooter({ url, fileName }: { url: string; fileName: string }) {
  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-surface-border pt-3">
      <span className="inline-flex min-w-0 items-center gap-1.5 text-xs text-[#9ca3af]">
        <FileText size={13} className="shrink-0" aria-hidden />
        <span className="truncate">{fileName}</span>
      </span>
      <a
        href={url}
        download={fileName}
        className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-ink-muted no-underline hover:text-ink"
      >
        <Download size={13} aria-hidden /> Download
      </a>
    </div>
  )
}

function ExternalContent({ url, label }: { url: string; label: string }) {
  let host = url
  try {
    host = new URL(url).hostname
  } catch {
    /* Leave the raw string — it is still the most useful thing to show. */
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-lg border border-surface-border bg-surface-inset px-4 py-4 no-underline transition-colors duration-fast hover:border-coral"
    >
      <ExternalLink size={18} className="shrink-0 text-coral" aria-hidden />
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-ink">{label}</span>
        <span className="block truncate text-xs text-[#9ca3af]">{host}</span>
      </span>
    </a>
  )
}
