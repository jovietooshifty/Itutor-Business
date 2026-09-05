'use client'

import * as React from 'react'
import { FileCheck2, ShieldCheck, Upload, X } from 'lucide-react'
import { cn } from '@/components/ui'
import {
  ID_ACCEPT_ATTRIBUTE,
  ID_DOCUMENT_OPTIONS,
  ID_MAX_BYTES,
  isAcceptedIdFile,
  type IdDocumentType,
} from '@/lib/identification'
import { uploadIdentification } from '@/app/(learner)/actions'

export type IdentificationValue = {
  /** Storage path in the private bucket. */
  url: string | null
  type: IdDocumentType | null
  /** Original file name, for display only. */
  fileName: string | null
}

/**
 * Pick which document, then photograph or upload it.
 *
 * The type is chosen first on purpose: it tells the learner which of the
 * things in their wallet counts, before they go looking for a scanner.
 */
export function IdentificationField({
  value,
  onChange,
  invalid,
}: {
  value: IdentificationValue
  onChange: (next: IdentificationValue) => void
  invalid?: boolean
}) {
  const [uploading, setUploading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function upload(file: File) {
    setError(null)

    if (file.size > ID_MAX_BYTES) {
      setError(
        `That file is ${(file.size / 1024 / 1024).toFixed(1)}MB. The limit is ${
          ID_MAX_BYTES / 1024 / 1024
        }MB.`
      )
      return
    }
    if (!isAcceptedIdFile(file)) {
      setError('Use a photo (PNG, JPEG, HEIC or WebP) or a PDF.')
      return
    }

    setUploading(true)
    try {
      const form = new FormData()
      form.set('file', file)
      const result = await uploadIdentification(form)
      if (!result.ok) {
        setError(result.error)
        return
      }
      onChange({ ...value, url: result.data!.path, fileName: file.name })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div
      className={cn(
        'rounded-xl border p-4 md:p-5',
        invalid ? 'border-[#fca5a5] bg-[#fef2f2]' : 'border-surface-border bg-white'
      )}
    >
      <span className="mb-2 block text-sm font-medium text-[#374151]">
        Which document are you sending?
      </span>
      <div className="grid gap-2.5 sm:grid-cols-3">
        {ID_DOCUMENT_OPTIONS.map((option) => {
          const active = value.type === option.value
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange({ ...value, type: option.value })}
              className={cn(
                'rounded-lg border p-3 text-left transition-colors duration-fast',
                active
                  ? 'border-coral bg-coral-soft'
                  : 'border-surface-border bg-white hover:border-coral'
              )}
            >
              <span className="block text-sm font-bold text-ink">{option.label}</span>
              <span className="mt-0.5 block text-xs leading-snug text-[#9ca3af]">
                {option.hint}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-4">
        {value.url ? (
          <div className="flex flex-wrap items-center gap-3 rounded-lg bg-surface-inset px-3.5 py-3">
            <FileCheck2 size={16} className="shrink-0 text-[var(--itutor-green)]" aria-hidden />
            <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">
              {value.fileName || 'Your document'}
            </span>
            <button
              type="button"
              onClick={() => onChange({ ...value, url: null, fileName: null })}
              className="inline-flex items-center gap-1 text-xs font-semibold text-ink-muted hover:text-danger-fg"
            >
              <X size={13} aria-hidden /> Replace
            </button>
          </div>
        ) : (
          <label
            className={cn(
              'flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-surface-border px-4 py-8 text-center',
              'transition-colors duration-fast hover:border-coral',
              (uploading || !value.type) && 'pointer-events-none opacity-60'
            )}
          >
            <Upload size={20} className="text-[#9ca3af]" aria-hidden />
            <span className="text-sm font-semibold text-ink">
              {uploading
                ? 'Uploading…'
                : value.type
                  ? 'Take a photo or choose a file'
                  : 'Pick a document type first'}
            </span>
            <span className="text-xs text-[#9ca3af]">
              A clear photo is fine — up to {ID_MAX_BYTES / 1024 / 1024}MB.
            </span>
            <input
              type="file"
              accept={ID_ACCEPT_ATTRIBUTE}
              // Opens the camera directly on a phone, which is how most of
              // these will be taken.
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                e.target.value = ''
                if (file) void upload(file)
              }}
            />
          </label>
        )}
      </div>

      <p className="m-0 mt-3 flex items-start gap-2 text-xs text-[#9ca3af]">
        <ShieldCheck size={14} className="mt-0.5 shrink-0" aria-hidden />
        Stored privately. Only a business running a course you have joined can open it, and never
        anyone else.
      </p>

      {error && (
        <p className="m-0 mt-3 rounded-md bg-danger-bg px-3 py-2 text-xs text-danger-fg">{error}</p>
      )}
    </div>
  )
}
