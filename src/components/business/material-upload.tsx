'use client'

import * as React from 'react'
import { FileText, Loader2, Presentation, Upload, Video, X } from 'lucide-react'
import { Button, cn } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import {
  DOCUMENT_MIME_TYPES,
  MATERIAL_BUCKET,
  SLIDE_MIME_TYPES,
  VIDEO_MIME_TYPES,
  materialPath,
} from '@/lib/course'

/** What each kind of block will accept, in one place. */
function mimeTypesFor(kind: 'video' | 'document' | 'slides'): readonly string[] {
  if (kind === 'video') return VIDEO_MIME_TYPES
  if (kind === 'slides') return SLIDE_MIME_TYPES
  return DOCUMENT_MIME_TYPES
}

/** Matches the bucket's own file_size_limit, so the check fails before the wire. */
const MAX_BYTES = 500 * 1024 * 1024

export type MaterialValue = { path: string | null; fileName: string | null }

/**
 * Uploads one file into the private `course-material` bucket and hands the
 * parent back its object path.
 *
 * A path, not a URL: the bucket is private (a private course's material is the
 * product, and an unguessable public URL is not access control), so every
 * surface that shows the file mints its own short-lived signed URL — the
 * preview here, and the player for the learner.
 */
export function MaterialUpload({
  courseId,
  blockId,
  kind,
  value,
  onChange,
  disabled,
}: {
  courseId: string
  blockId: string
  kind: 'video' | 'document' | 'slides'
  value: MaterialValue
  onChange: (next: MaterialValue) => void
  disabled?: boolean
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)

  const accept = mimeTypesFor(kind).join(',')

  // Signed previews expire, so this re-runs whenever the stored path changes
  // rather than caching a URL that would quietly go dead mid-session.
  React.useEffect(() => {
    let cancelled = false
    setPreviewUrl(null)
    if (!value.path || kind !== 'video') return

    void (async () => {
      const supabase = createClient()
      const { data } = await supabase.storage
        .from(MATERIAL_BUCKET)
        .createSignedUrl(value.path!, 60 * 60)
      if (!cancelled) setPreviewUrl(data?.signedUrl ?? null)
    })()

    return () => {
      cancelled = true
    }
  }, [value.path, kind])

  async function handleFile(file: File) {
    setError(null)

    const allowed: readonly string[] = mimeTypesFor(kind)
    if (file.type && !allowed.includes(file.type)) {
      setError(
        kind === 'video'
          ? 'That is not a video file. MP4, WebM, MOV and OGG are accepted.'
          : kind === 'slides'
            ? // .ppt is named because it looks acceptable and is not: a
              // different format entirely, which nothing here can read.
              'That is not a deck. Upload a PDF or a .pptx — an older .ppt needs saving as one of those first.'
            : 'That is not a document. PDF, Word, plain text and Markdown are accepted.'
      )
      return
    }
    if (file.size > MAX_BYTES) {
      setError(`That file is ${(file.size / 1024 / 1024).toFixed(0)} MB — the limit is 500 MB.`)
      return
    }

    setBusy(true)
    try {
      const supabase = createClient()
      const path = materialPath(courseId, blockId, file.name)

      const { error: uploadError } = await supabase.storage
        .from(MATERIAL_BUCKET)
        .upload(path, file, { upsert: false, contentType: file.type || undefined })
      if (uploadError) throw uploadError

      onChange({ path, fileName: file.name })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed.')
    } finally {
      setBusy(false)
    }
  }

  /**
   * Clears the reference but leaves the object in the bucket. Deleting it here
   * would strand the learner mid-course if the author changes their mind
   * before saving; unreferenced objects are cheap, a broken lesson is not.
   */
  function clear() {
    setError(null)
    onChange({ path: null, fileName: null })
  }

  const Icon = kind === 'video' ? Video : kind === 'slides' ? Presentation : FileText

  return (
    <div>
      {value.path ? (
        <div className="rounded-lg border border-surface-border bg-white">
          <div className="flex items-center gap-3 p-3.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-surface-inset text-ink-muted">
              <Icon size={16} aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-ink">
                {value.fileName ?? 'Uploaded file'}
              </span>
              <span className="block text-xs text-[#9ca3af]">Uploaded</span>
            </span>
            <button
              type="button"
              onClick={clear}
              disabled={disabled || busy}
              aria-label="Remove this file"
              className="shrink-0 text-[#9ca3af] transition-colors duration-fast hover:text-[var(--danger-fg)] disabled:opacity-40"
            >
              <X size={15} />
            </button>
          </div>

          {kind === 'video' && previewUrl && (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video
              src={previewUrl}
              controls
              className="w-full rounded-b-lg bg-black"
              preload="metadata"
            />
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || busy}
          className={cn(
            'flex w-full flex-col items-center gap-2 rounded-lg border border-dashed border-surface-border',
            'bg-surface-inset px-4 py-8 text-center transition-colors duration-fast',
            'hover:border-[color:var(--itutor-green)] hover:text-[var(--itutor-green)]',
            'disabled:cursor-not-allowed disabled:opacity-60'
          )}
        >
          {busy ? (
            <Loader2 className="animate-[spin_0.8s_linear_infinite] text-ink-muted" size={20} />
          ) : (
            <Upload size={20} className="text-[#9ca3af]" aria-hidden />
          )}
          <span className="text-sm font-semibold text-ink">
            {busy
              ? 'Uploading…'
              : kind === 'video'
                ? 'Upload a video file'
                : 'Upload a document'}
          </span>
          <span className="text-xs text-[#9ca3af]">
            {kind === 'video'
              ? 'MP4, WebM, MOV or OGG · up to 500 MB'
              : 'PDF, Word, plain text or Markdown · up to 500 MB'}
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void handleFile(file)
          e.target.value = ''
        }}
      />

      {error && <p className="mt-2 text-xs text-[var(--danger-fg)]">{error}</p>}

      {value.path && !busy && (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="mt-2"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          Replace file
        </Button>
      )}
    </div>
  )
}
