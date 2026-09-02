'use client'

import * as React from 'react'
import { ImagePlus, Loader2 } from 'lucide-react'
import { cn } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'

/**
 * Real replacement for the export's <image-slot> tag: uploads straight to
 * Supabase Storage and hands the parent the resulting public URL.
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
  shape = 'circle',
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
  shape?: 'circle' | 'rect'
  width: number | string
  height: number | string
  placeholder?: string
  className?: string
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleFile(file: File) {
    setBusy(true)
    setError(null)
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'png'
      const objectPath = `${path}/${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(objectPath, file, { upsert: true, cacheControl: '3600' })
      if (uploadError) throw uploadError

      const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath)
      onChange(data.publicUrl)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        aria-label={placeholder}
        className={cn(
          'relative grid place-items-center overflow-hidden border border-dashed border-[#d1d5db] bg-surface-inset',
          'cursor-pointer text-[#9ca3af] transition-colors hover:border-[color:var(--itutor-green)] hover:text-[var(--itutor-green)]',
          shape === 'circle' ? 'rounded-full' : 'rounded-xl'
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
          if (file) void handleFile(file)
          e.target.value = ''
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
