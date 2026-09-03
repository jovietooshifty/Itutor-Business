import { ExtractionError, THIN_TEXT_CHARS, type ExtractedContent, type SourceType } from './types'

/**
 * Extraction for material uploaded through the builder, as opposed to the
 * local `scripts/` pipeline that reads files off disk.
 *
 * Everything heavy is behind a dynamic import. Every server action in the
 * course-builder route shares one module graph, and a static import of pdfjs
 * or mammoth puts them on it — which is exactly how a jsdom load failure once
 * took down every unrelated action on the builder page (see the note above
 * `readWebsite` in courses/quiz-actions.ts). The cost of reaching for a parser
 * only when a document actually needs one is a few milliseconds; the cost of
 * not doing it was a 500 on "delete block".
 */
export async function extractFromUpload(
  bytes: Uint8Array,
  fileName: string,
  mimeType: string | null
): Promise<ExtractedContent> {
  const kind = classify(fileName, mimeType)

  if (kind === 'pdf') {
    const { extractFromPdfBuffer } = await import('./pdf')
    const { text, warnings } = await extractFromPdfBuffer(bytes, fileName)
    return { text, sourceType: 'pdf', warnings }
  }

  if (kind === 'docx') {
    const { extractFromDocxBuffer } = await import('./docx')
    return extractFromDocxBuffer(bytes, fileName)
  }

  if (kind === 'plain') {
    const text = new TextDecoder('utf-8').decode(bytes).replace(/[ \t]+/g, ' ').trim()
    const warnings: string[] = []
    if (text.length === 0) {
      warnings.push(`"${fileName}" is empty.`)
    } else if (text.length < THIN_TEXT_CHARS) {
      warnings.push(
        `Only ${text.length} characters in "${fileName}" — too thin to generate a meaningful quiz.`
      )
    }
    // 'docx' stands in for "a written document" in SourceType; the label the
    // prompt uses is close enough and inventing a fifth source type to say
    // "a .txt file" would buy nothing.
    return { text, sourceType: 'docx', warnings }
  }

  throw new ExtractionError(
    'docx',
    `"${fileName}" is not a document this can read. Upload a PDF, a Word .docx, or plain text.`
  )
}

/** Mime type first, extension as the fallback — browsers get both wrong. */
function classify(
  fileName: string,
  mimeType: string | null
): 'pdf' | 'docx' | 'plain' | 'unknown' {
  const mime = (mimeType ?? '').toLowerCase()
  if (mime === 'application/pdf') return 'pdf'
  if (mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return 'docx'
  }
  if (mime.startsWith('text/')) return 'plain'

  const ext = fileName.toLowerCase().split('.').pop() ?? ''
  if (ext === 'pdf') return 'pdf'
  if (ext === 'docx') return 'docx'
  if (ext === 'txt' || ext === 'md' || ext === 'markdown') return 'plain'

  // .doc is the one worth naming: it is a different format entirely, not a
  // .docx with an older extension, and mammoth cannot read it.
  return 'unknown'
}

export type { SourceType }
