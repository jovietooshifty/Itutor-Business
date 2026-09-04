'use client'

import * as React from 'react'
import { Button } from '@/components/ui'

/**
 * The crop step between choosing a file and uploading it.
 *
 * Without this, whatever came off the phone went straight to Storage at its
 * original dimensions, and every surface that renders it — a 16:9 card
 * thumbnail, a circular avatar, a 140px banner — cropped it differently with
 * `object-cover`. The same artwork letterboxed one way on a course card and
 * another on the company header, which is why the cover never sat right.
 *
 * Cropping happens on a canvas in the browser, so what is uploaded is already
 * the right shape and size. Nothing server-side has to know about it.
 */

export type ImagePreset = 'cover' | 'avatar' | 'stamp'

export type PresetSpec = {
  label: string
  /** width / height. */
  aspect: number
  outputWidth: number
  outputHeight: number
  maxBytes: number
  /** Circular mask on the crop preview. Output is still a square image. */
  circular: boolean
  /**
   * Force PNG output. Stamps composite onto certificates, so re-encoding one
   * as JPEG would replace its transparent background with white and put a
   * white rectangle on every certificate.
   */
  png: boolean
}

export const IMAGE_PRESETS: Record<ImagePreset, PresetSpec> = {
  cover: {
    label: 'Cover / thumbnail',
    aspect: 16 / 9,
    outputWidth: 1600,
    outputHeight: 900,
    maxBytes: 5 * 1024 * 1024,
    circular: false,
    png: false,
  },
  avatar: {
    label: 'Photo / logo',
    aspect: 1,
    outputWidth: 512,
    outputHeight: 512,
    maxBytes: 5 * 1024 * 1024,
    circular: true,
    png: false,
  },
  stamp: {
    label: 'Stamp',
    aspect: 1,
    outputWidth: 512,
    outputHeight: 512,
    maxBytes: 2 * 1024 * 1024,
    circular: true,
    png: true,
  },
}

/** How wide the crop stage is drawn. Height follows from the aspect. */
const STAGE_WIDTH = 320

/**
 * Below this on either side, an image is a mistake rather than a small image —
 * a favicon or a sprite picked by accident. A preset's outputWidth is the
 * IDEAL, not a gate: everything above this floor is accepted and saved at
 * whatever size it can genuinely fill.
 */
const HARD_MIN_PX = 96

type Loaded = { image: HTMLImageElement; width: number; height: number }

export function ImageCropModal({
  file,
  preset,
  onCancel,
  onCropped,
}: {
  file: File
  preset: ImagePreset
  onCancel: () => void
  /** The cropped result, ready to upload. */
  onCropped: (blob: Blob, fileName: string) => void
}) {
  const spec = IMAGE_PRESETS[preset]
  const stageHeight = Math.round(STAGE_WIDTH / spec.aspect)

  const [loaded, setLoaded] = React.useState<Loaded | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [zoom, setZoom] = React.useState(1)
  const [offset, setOffset] = React.useState({ x: 0, y: 0 })
  const dragFrom = React.useRef<{ x: number; y: number; ox: number; oy: number } | null>(null)

  React.useEffect(() => {
    let revoked = false
    const url = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      if (revoked) return
      /* Only a genuine mistake is refused — a favicon picked instead of a
         photo. Anything else is accepted and saved at the resolution it
         actually has: a 946×187 banner becomes a 332×187 thumbnail rather
         than being stretched to 1600×900, or turned away for the crime of
         not being tall enough. See outputWidth below. */
      if (image.naturalWidth < HARD_MIN_PX || image.naturalHeight < HARD_MIN_PX) {
        setError(
          `That image is only ${image.naturalWidth}×${image.naturalHeight}. Pick one at least ` +
            `${HARD_MIN_PX}px on both sides.`
        )
        return
      }
      setLoaded({ image, width: image.naturalWidth, height: image.naturalHeight })
    }
    image.onerror = () => setError('That file could not be read as an image.')
    image.src = url

    return () => {
      revoked = true
      URL.revokeObjectURL(url)
    }
  }, [file])

  /**
   * The scale at which the image exactly covers the stage. Everything is
   * expressed relative to this so `zoom = 1` is always "no gaps".
   */
  const baseScale = loaded
    ? Math.max(STAGE_WIDTH / loaded.width, stageHeight / loaded.height)
    : 1
  const scale = baseScale * zoom
  const drawnWidth = loaded ? loaded.width * scale : 0
  const drawnHeight = loaded ? loaded.height * scale : 0

  /** Keeps the stage covered: the image can never be dragged off its edges. */
  const clamp = React.useCallback(
    (next: { x: number; y: number }) => {
      const maxX = Math.max(0, (drawnWidth - STAGE_WIDTH) / 2)
      const maxY = Math.max(0, (drawnHeight - stageHeight) / 2)
      return {
        x: Math.min(maxX, Math.max(-maxX, next.x)),
        y: Math.min(maxY, Math.max(-maxY, next.y)),
      }
    },
    [drawnWidth, drawnHeight, stageHeight]
  )

  React.useEffect(() => setOffset((prev) => clamp(prev)), [clamp])

  /**
   * What this crop can actually yield, in real source pixels.
   *
   * The stage is a window `STAGE_WIDTH / scale` wide in the source, so that —
   * capped at the preset's ideal — is the largest output containing no
   * invented detail. Upscaling was the thing worth avoiding, not small
   * images: a 946×187 banner saves at 332×187, sharp, instead of being
   * stretched fourfold to hit 1600×900.
   *
   * It tracks the zoom slider, so the size quoted on screen is always the
   * size that will be written.
   */
  const outputWidth = loaded
    ? Math.max(1, Math.min(spec.outputWidth, Math.floor(STAGE_WIDTH / scale)))
    : spec.outputWidth
  const outputHeight = Math.max(1, Math.round(outputWidth / spec.aspect))
  const belowIdeal = outputWidth < spec.outputWidth

  function crop() {
    if (!loaded) return

    const canvas = document.createElement('canvas')
    canvas.width = outputWidth
    canvas.height = outputHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      setError('Your browser could not process the image.')
      return
    }

    // Stage coordinates scale to output coordinates by exactly this much.
    const ratio = outputWidth / STAGE_WIDTH
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(
      loaded.image,
      outputWidth / 2 - (drawnWidth / 2 - offset.x) * ratio,
      outputHeight / 2 - (drawnHeight / 2 - offset.y) * ratio,
      drawnWidth * ratio,
      drawnHeight * ratio
    )

    const type = spec.png ? 'image/png' : 'image/jpeg'
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError('Could not save the cropped image.')
          return
        }
        const base = file.name.replace(/\.[^.]+$/, '')
        onCropped(blob, `${base}.${spec.png ? 'png' : 'jpg'}`)
      },
      type,
      spec.png ? undefined : 0.9
    )
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Crop ${spec.label.toLowerCase()}`}
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[400px] rounded-xl bg-white p-5 shadow-lg"
      >
        <h2 className="m-0 font-display text-base font-bold text-ink">Position your image</h2>
        <p className="m-0 mt-1 text-xs text-ink-muted">
          Drag to move, and use the slider to zoom. Saved at {outputWidth}×{outputHeight}.
        </p>

        {error ? (
          <>
            <p className="mt-4 rounded-md bg-danger-bg px-3.5 py-3 text-sm text-danger-fg">
              {error}
            </p>
            <div className="mt-4 flex justify-end">
              <Button variant="secondary" onClick={onCancel}>
                Choose another image
              </Button>
            </div>
          </>
        ) : (
          <>
            <div
              className="relative mx-auto mt-4 cursor-grab touch-none overflow-hidden bg-surface-inset"
              style={{
                width: STAGE_WIDTH,
                height: stageHeight,
                borderRadius: spec.circular ? '9999px' : 12,
              }}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId)
                dragFrom.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y }
              }}
              onPointerMove={(e) => {
                const from = dragFrom.current
                if (!from) return
                setOffset(
                  clamp({
                    x: from.ox + (e.clientX - from.x),
                    y: from.oy + (e.clientY - from.y),
                  })
                )
              }}
              onPointerUp={() => {
                dragFrom.current = null
              }}
              onPointerCancel={() => {
                dragFrom.current = null
              }}
            >
              {loaded && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={loaded.image.src}
                  alt=""
                  draggable={false}
                  className="pointer-events-none absolute left-1/2 top-1/2 max-w-none select-none"
                  style={{
                    width: drawnWidth,
                    height: drawnHeight,
                    transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
                  }}
                />
              )}
            </div>

            {/* Advisory, not a gate. The image is saved at the size shown
                above either way; this only says it will be softer than the
                ideal on a large screen, which is the author's call to make. */}
            {belowIdeal && (
              <p className="m-0 mt-3 rounded-md bg-[#fffbeb] px-3 py-2 text-xs text-[#92400e]">
                Smaller than the ideal {spec.outputWidth}×{spec.outputHeight}, so it may look soft
                on a large screen. Saved sharp at {outputWidth}×{outputHeight} rather than
                stretched.
              </p>
            )}

            <label className="mt-4 block">
              <span className="mb-1.5 block text-xs font-semibold text-[#374151]">Zoom</span>
              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-[var(--itutor-green)]"
              />
            </label>

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" onClick={onCancel}>
                Cancel
              </Button>
              <Button onClick={crop} disabled={!loaded}>
                Use this
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/** Shared file-level checks, before an image is even decoded. */
export function checkImageFile(file: File, preset: ImagePreset): string | null {
  const spec = IMAGE_PRESETS[preset]
  if (file.size > spec.maxBytes) {
    return `That image is ${(file.size / 1024 / 1024).toFixed(1)}MB. The limit is ${
      spec.maxBytes / 1024 / 1024
    }MB.`
  }
  if (!/^image\/(png|jpeg|webp)$/.test(file.type)) {
    return 'Use a PNG, JPEG or WebP image.'
  }
  return null
}
