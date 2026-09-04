'use client'

import * as React from 'react'
import { ImagePlus, Loader2 } from 'lucide-react'
import { cn } from '@/components/ui'
import {
  ImageCropModal,
  checkImageFile,
  IMAGE_PRESETS,
  type ImagePreset,
} from '@/components/ui/image-crop'
import { createClient } from '@/lib/supabase/client'

/**
 * Real replacement for the export's <image-slot> tag: crops the chosen image
 * to a known aspect and size, uploads the result to Supabase Storage, and
 * hands the parent the resulting public URL.
 *
 * The crop step is what stops the same file rendering differently on every
 * surface. `preset` decides the shape, the output dimensions, the minimum
 * acceptable upload and whether transparency is preserved — see IMAGE_PRESETS.
 *
 * KNOWN ISSUE #4 (handoff §7) — "stamp should render only if uploaded, no
 * placeholder gap". This component is the *editor*, so it always shows a drop
 * target; read-only surfaces must render nothing when the URL is null. See
 * <OptionalImage> below, which is what display surfaces should use.
 */
export function ImageUpload({
  bucket,
  path,
  value,
  onChange,
  shape,
  preset,
  width,
  height,
  placeholder = 'Upload',
  className,
}: {
  bucket: 'business-assets' | 'avatars'
  /** Folder prefix — must start with the owning entity's id (see storage policies). */
  path: string
  value: string | null
  onChange: (url: string | null) => void
  /**
   * Preview shape only. Left for the callers that set it; `preset` is the one
   * that decides what actually gets stored, and implies a shape of its own.
   */
  shape?: 'circle' | 'rect'
  /**
   * What this image is for. Omitting it keeps the old behaviour — the raw file
   * straight to Storage — so an unconverted caller is unchanged rather than
   * silently re-cropped.
   */
  preset?: ImagePreset
  width: number | string
  height: number | string
  placeholder?: string
  className?: string
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  /** Set while the crop modal is open, holding the file being positioned. */
  const [cropping, setCropping] = React.useState<File | null>(null)

  const effectiveShape =
    shape ?? (preset && !IMAGE_PRESETS[preset].circular ? 'rect' : 'circle')

  /** Uploads a Blob under `name`'s extension and reports the public URL. */
  async function put(body: Blob, name: string) {
    setBusy(true)
    setError(null)
    try {
      const supabase = createClient()
      const ext = name.split('.').pop()?.toLowerCase() ?? 'png'
      const objectPath = `${path}/${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(objectPath, body, {
          upsert: true,
          cacheControl: '3600',
          contentType: body.type || undefined,
        })
      if (uploadError) throw uploadError

      const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath)
      onChange(data.publicUrl)
    } catch (e) {
      setError(describeUploadError(e))
    } finally {
      setBusy(false)
    }
  }

  function handleFile(file: File) {
    setError(null)

    if (!preset) {
      void put(file, file.name)
      return
    }

    // Size and type are rejected before decoding, so a 30MB file never has to
    // be read into memory just to be refused.
    const problem = checkImageFile(file, preset)
    if (problem) {
      setError(problem)
      return
    }
    setCropping(file)
  }

  return (
    <div className={className}>
      {cropping && preset && (
        <ImageCropModal
          file={cropping}
          preset={preset}
          onCancel={() => setCropping(null)}
          onCropped={(blob, name) => {
            setCropping(null)
            void put(blob, name)
          }}
        />
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        aria-label={placeholder}
        className={cn(
          'relative grid place-items-center overflow-hidden border border-dashed border-[#d1d5db] bg-surface-inset',
          'cursor-pointer text-[#9ca3af] transition-colors hover:border-[color:var(--itutor-green)] hover:text-[var(--itutor-green)]',
          effectiveShape === 'circle' ? 'rounded-full' : 'rounded-xl'
        )}
        style={{ width, height }}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt={placeholder} className="h-full w-full object-cover" />
        ) : busy ? (
          <Loader2 className="animate-[spin_0.8s_linear_infinite]" size={18} />
        ) : (
          <span className="flex flex-col items-center gap-1 px-2 text-center">
            <ImagePlus size={16} />
            <span className="text-[10.5px] leading-tight">{placeholder}</span>
          </span>
        )}
        {busy && value && (
          <span className="absolute inset-0 grid place-items-center bg-white/60">
            <Loader2 className="animate-[spin_0.8s_linear_infinite]" size={18} />
          </span>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          e.target.value = ''
          if (file) handleFile(file)
        }}
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="mt-1 block w-full text-center text-[10.5px] text-[#9ca3af] hover:text-[var(--danger-fg)]"
        >
          Remove
        </button>
      )}
      {error && <p className="mt-1 text-[10.5px] text-[var(--danger-fg)]">{error}</p>}
    </div>
  )
}

/**
 * Turns a Storage failure into something an admin can act on.
 *
 * The one that matters is the row-level security rejection. Postgres phrases it
 * as "new row violates row-level security policy", which is true and useless:
 * it names the mechanism, not the cause, and the cause is almost always one of
 * two ordinary things — the session expired in a tab that has been open a
 * while, or this member is not an Admin of the business. Both have obvious next
 * steps, and neither is discoverable from the raw string.
 */
function describeUploadError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error ?? '')

  if (/row-level security|violates row-level|not authorized|Unauthorized|JWT/i.test(message)) {
    return 'Could not save that image — your sign-in may have expired, or only an Admin can change it. Reload the page and try again.'
  }
  if (/exceeded the maximum allowed size|Payload too large|entity too large|413/i.test(message)) {
    return 'That image is too large. The limit is 5 MB.'
  }
  if (/mime type|content type|not supported|invalid_mime/i.test(message)) {
    return 'That file type is not supported. Use a PNG, JPEG or WebP image.'
  }
  if (/Failed to fetch|NetworkError|network/i.test(message)) {
    return 'Could not reach the server. Check your connection and try again.'
  }

  // Anything unrecognised keeps its original text — a wrong guess is worse
  // than an unfamiliar message when someone has to report the problem.
  return message || 'Upload failed.'
}

/**
 * Display-side counterpart. Renders nothing at all when there is no image —
 * no placeholder, no reserved box, no gap. This is the piece that resolves
 * known issue #4 wherever a stamp or logo is *shown* rather than edited.
 */
export function OptionalImage({
  src,
  alt,
  width,
  height,
  className,
  rounded = 'full',
}: {
  src: string | null | undefined
  alt: string
  width: number
  height: number
  className?: string
  rounded?: 'full' | 'xl' | 'none'
}) {
  if (!src) return null
  const radius = rounded === 'full' ? 'rounded-full' : rounded === 'xl' ? 'rounded-xl' : ''
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn('object-cover', radius, className)}
      style={{ width, height }}
    />
  )
}
