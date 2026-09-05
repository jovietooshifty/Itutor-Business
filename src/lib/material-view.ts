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
  /** A picture. Shown with <img>, not an iframe — an ID is usually photographed. */
  | { kind: 'image'; url: string; fileName: string }
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
 * Every path that gives up on showing a document in the page says so in the
 * logs, loudly enough to find.
 *
 * The first version of this swallowed all three failure modes and returned a
 * download link, which is indistinguishable from "this format is not
 * supported" — so a document that failed to convert looked exactly like one
 * that was never going to, and there was nothing to search for.
 */
function fellBack(reason: string, detail?: unknown): void {
  console.error(`[material-view] falling back to a download link: ${reason}`, detail ?? '')
}

/**
 * Reads a file through the signed URL that was already minted for it.
 *
 * Deliberately not `storage.download()`. That is a second, independent
 * authorization check against the same object, and the two can disagree —
 * minting a signed URL and fetching the bytes go through different Storage
 * endpoints. Since the page has already produced a working signed URL for
 * this reader, using it is one decision rather than two, and the bytes the
 * server converts are exactly the bytes the browser would have downloaded.
 */
export async function bytesFromSignedUrl(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) {
      fellBack(`signed URL returned HTTP ${res.status}`, url.split('?')[0])
      return null
    }
    return Buffer.from(await res.arrayBuffer())
  } catch (cause) {
    fellBack('fetching the signed URL threw', cause)
    return null
  }
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

  /* Photographs, which is what identification usually is. HEIC is included
     even though Safari is the only browser that renders it — the alternative
     is refusing the default output of every iPhone, and a broken <img> at
     least still offers the link. */
  if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'heic', 'heif'].includes(ext)) {
    return { kind: 'image', url, fileName: name }
  }

  if (ext === 'docx' || ext === 'doc') {
    const buffer = await loadBytes()
    if (!buffer) {
      fellBack('could not read the file bytes', { path, ext })
      return { kind: 'link', url, fileName: name, reason: 'It could not be read for display.' }
    }

    /* .doc is the old binary format, which mammoth cannot parse — only .docx.
       Attempting it throws, so the catch below is the .doc path in practice. */
    try {
      const result = await mammoth.convertToHtml({ buffer })
      const html = sanitizeDocumentHtml(result.value)

      if (!html.trim()) {
        fellBack('conversion produced no markup', { path })
        return {
          kind: 'link',
          url,
          fileName: name,
          reason: 'It has no text to show — it may be made up of images.',
        }
      }
      if (Buffer.byteLength(html, 'utf8') > MAX_HTML_BYTES) {
        fellBack('converted markup exceeded the size cap', {
          path,
          bytes: Buffer.byteLength(html, 'utf8'),
        })
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
    } catch (cause) {
      fellBack('mammoth threw while converting', cause)
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
      fellBack('could not read the file bytes', { path, ext })
      return { kind: 'link', url, fileName: name, reason: 'It could not be read for display.' }
    }
    return { kind: 'text', text: buffer.toString('utf8'), fileName: name, url }
  }

  fellBack('no viewer for this file type', { path, ext })
  return { kind: 'link', url, fileName: name, reason: null }
}
