import * as mammoth from 'mammoth'

/**
 * How an uploaded document should be shown in the page rather than downloaded.
 *
 * A browser has no DOCX viewer, so a signed URL to a .docx can only ever be a
 * download — which drops a learner out of the lesson, into a file manager, and
 * into Word, to read two paragraphs. There is no way to convert to real PDF in
 * this runtime either: that needs LibreOffice or an external service, neither
 * of which exists on a serverless function.
 *
 * What does work is rendering the document's own markup inline. `mammoth` is
 * already a dependency — the extraction pipeline uses `extractRawText` on the
 * same files for quiz generation — and `convertToHtml` keeps the structure a
 * reader needs: headings, lists, tables, and the bold an author told them to
 * look for.
 *
 * PDFs need none of this. Browsers render them natively in an iframe.
 */

export type MaterialView =
  /** Render the signed URL in an iframe — the browser has a viewer for it. */
  | { kind: 'embed'; url: string; fileName: string }
  /** Converted document markup, already sanitised. `url` is the original. */
  | { kind: 'html'; html: string; fileName: string; url: string; warnings: string[] }
  /** Plain text, rendered as-is. `url` is the original. */
  | { kind: 'text'; text: string; fileName: string; url: string }
  /** Nothing better available — a link out, with a reason. */
  | { kind: 'link'; url: string; fileName: string; reason: string | null }

/**
 * Beyond this the converted markup is more likely to hang the page than to be
 * read in it — usually a document that is mostly embedded images, since
 * mammoth inlines those as base64.
 */
const MAX_HTML_BYTES = 3 * 1024 * 1024

function extensionOf(path: string): string {
  return path.toLowerCase().match(/\.([a-z0-9]+)(?:\?|$)/)?.[1] ?? ''
}

/**
 * Strips anything executable from converted markup.
 *
 * Defence in depth rather than the primary control: mammoth builds its output
 * from a fixed element set with its own serialiser, so document contents
 * cannot smuggle tags through it. This guards the case where that assumption
 * stops holding, because the input is a file someone uploaded.
 */
export function sanitizeDocumentHtml(html: string): string {
  return (
    html
      // Whole elements that can execute or load, contents included.
      .replace(/<\s*(script|style|iframe|object|embed|link|meta|base)\b[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
      // ...and their self-closing or unterminated forms.
      .replace(/<\s*(script|style|iframe|object|embed|link|meta|base)\b[^>]*>/gi, '')
      // Inline event handlers, quoted or bare.
      .replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, '')
      .replace(/\son[a-z]+\s*=\s*'[^']*'/gi, '')
      .replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, '')
      // javascript:/vbscript: in any URL attribute.
      .replace(/(href|src|action)\s*=\s*"\s*(javascript|vbscript|data:text\/html)[^"]*"/gi, '$1="#"')
      .replace(/(href|src|action)\s*=\s*'\s*(javascript|vbscript|data:text\/html)[^']*'/gi, "$1='#'")
  )
}

/**
 * Decides how to present one uploaded file.
 *
 * `bytes` is only read for the formats that need converting, so a PDF costs
 * nothing here — the caller can pass a lazy loader and it will not be called.
 */
export async function materialView({
  path,
  fileName,
  url,
  loadBytes,
}: {
  /** Storage object path, used for its extension. */
  path: string
  fileName: string | null
  /** Signed URL, for the formats the browser can show itself. */
  url: string
  loadBytes: () => Promise<Buffer | null>
}): Promise<MaterialView> {
  const name = fileName ?? path.split('/').pop() ?? 'Document'
  const ext = extensionOf(fileName ?? path)

  if (ext === 'pdf') return { kind: 'embed', url, fileName: name }

  if (ext === 'docx' || ext === 'doc') {
    const buffer = await loadBytes()
    if (!buffer) {
      return { kind: 'link', url, fileName: name, reason: 'It could not be read for display.' }
    }

    /* .doc is the old binary format, which mammoth cannot parse — only .docx.
       Attempting it throws, so the catch below is the .doc path in practice. */
    try {
      const result = await mammoth.convertToHtml({ buffer })
      const html = sanitizeDocumentHtml(result.value)

      if (!html.trim()) {
        return {
          kind: 'link',
          url,
          fileName: name,
          reason: 'It has no text to show — it may be made up of images.',
        }
      }
      if (Buffer.byteLength(html, 'utf8') > MAX_HTML_BYTES) {
        return {
          kind: 'link',
          url,
          fileName: name,
          reason: 'It is too large to show in the page.',
        }
      }

      return {
        kind: 'html',
        html,
        fileName: name,
        url,
        warnings: result.messages.map((m) => m.message),
      }
    } catch {
      return {
        kind: 'link',
        url,
        fileName: name,
        reason:
          ext === 'doc'
            ? 'Older .doc files cannot be shown in the page. Re-save it as .docx or PDF.'
            : 'It could not be converted for display.',
      }
    }
  }

  if (ext === 'txt' || ext === 'md' || ext === 'markdown') {
    const buffer = await loadBytes()
    if (!buffer) {
      return { kind: 'link', url, fileName: name, reason: 'It could not be read for display.' }
    }
    return { kind: 'text', text: buffer.toString('utf8'), fileName: name, url }
  }

  return { kind: 'link', url, fileName: name, reason: null }
}
