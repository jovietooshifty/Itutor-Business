'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ExternalLink } from 'lucide-react'
import { Button, Card, Checkbox } from '@/components/ui'
import { completeBlock } from '@/app/(learner)/actions'
import type { BlockType, TextContent, VideoContent, WebsiteContent } from '@/lib/course'

/** True for a file we can play ourselves and therefore actually gate on. */
function isDirectVideo(url: string) {
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url)
}

/**
 * Renders one lesson and decides when it may be marked complete.
 *
 * The gating is deliberately honest: it only claims to know you finished
 * something when it can actually tell. A video file we play ourselves fires
 * `ended`; a YouTube link in an iframe tells us nothing, so that case asks for
 * a confirmation instead of pretending to have watched along.
 */
export function BlockPlayer({
  courseId,
  blockId,
  type,
  content,
  completed,
}: {
  courseId: string
  blockId: string
  type: Exclude<BlockType, 'quiz'>
  content: unknown
  completed: boolean
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
      <Card className="p-6 md:p-8">
        {type === 'video' && (
          <VideoBlock content={content} onWatched={() => setDone(true)} />
        )}
        {type === 'text' && <TextBlock content={content} onRead={() => setDone(true)} />}
        {type === 'website' && <WebsiteBlock content={content} />}
      </Card>

      {!canComplete && (
        <div className="mt-4 rounded-lg border border-surface-border bg-white px-4 py-3.5">
          <Checkbox
            label={
              type === 'video'
                ? "I've watched this video"
                : type === 'website'
                  ? "I've read the linked page"
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

/* ── Video ─────────────────────────────────────────────────────────────── */

function VideoBlock({ content, onWatched }: { content: unknown; onWatched: () => void }) {
  const value = (content ?? {}) as Partial<VideoContent>
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
        // Seeking past the end would otherwise fire `ended` immediately.
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

/* ── Text ──────────────────────────────────────────────────────────────── */

function TextBlock({ content, onRead }: { content: unknown; onRead: () => void }) {
  const value = (content ?? {}) as Partial<TextContent>

  // Scroll-to-end gating, per the handoff. Only meaningful for text we render
  // ourselves — an uploaded file or a URL is read somewhere we cannot observe.
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

  if (value.mode === 'url' || value.mode === 'upload') {
    return value.url ? (
      <ExternalContent url={value.url} label={value.fileName ?? 'Open the document'} />
    ) : (
      <p className="m-0 text-sm text-ink-muted">This lesson has no document yet.</p>
    )
  }

  if (!value.body?.trim()) {
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

/* ── Website ───────────────────────────────────────────────────────────── */

function WebsiteBlock({ content }: { content: unknown }) {
  const value = (content ?? {}) as Partial<WebsiteContent>
  return value.url ? (
    <ExternalContent url={value.url} label="Open the page" />
  ) : (
    <p className="m-0 text-sm text-ink-muted">This lesson has no link yet.</p>
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
