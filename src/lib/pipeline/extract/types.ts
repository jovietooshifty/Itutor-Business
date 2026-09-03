export type SourceType = 'video' | 'pdf' | 'docx' | 'website'

/* Every extractor returns this shape so quiz generation and the test harness
   can treat all four ingestion paths identically.

   `warnings` is the channel for "extraction succeeded but the text looks
   unusable" — a scanned PDF, an empty document, a page with almost no prose.
   Those return normally so the caller can decide; only genuine failures throw
   ExtractionError. */
export type ExtractedContent = {
  text: string
  sourceType: SourceType
  warnings: string[]
}

export class ExtractionError extends Error {
  readonly sourceType: SourceType

  constructor(sourceType: SourceType, message: string, options?: { cause?: unknown }) {
    super(message, options)
    this.name = 'ExtractionError'
    this.sourceType = sourceType
  }
}

/* Below this, prose is sparse enough that a quiz generated from it would be
   guesswork rather than comprehension. Used by several extractors. */
export const THIN_TEXT_CHARS = 200

export function truncateForMessage(value: string, max = 400): string {
  const collapsed = value.replace(/\s+/g, ' ').trim()
  return collapsed.length > max ? `${collapsed.slice(0, max)}…` : collapsed
}
