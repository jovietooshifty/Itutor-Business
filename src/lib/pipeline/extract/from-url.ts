import { extractFromDocx } from './docx'
import { extractFromPdf } from './pdf'
import { fetchRemoteFile } from './source'
import { SUPPORTED_MEDIA_EXTENSIONS } from './stt/types'
import { ExtractionError, type ExtractedContent } from './types'
import { extractFromVideo } from './video'
import { extractFromWebsite } from './website'

/* One entry point for "there is a URL, get me the text".

   This is what a server route actually has: a course block stores a URL, and
   whether it points at an article, an uploaded PDF, a Word file or a video is
   not known until it is fetched. Routing on the extension alone is not enough
   — object storage URLs often carry a signature query string or no extension
   at all — so the response's own content-type is consulted first. */
export async function extractFromUrl(url: string): Promise<ExtractedContent> {
  const kind = await classify(url)

  if (kind === 'html') return extractFromWebsite(url)

  const file = await fetchRemoteFile(url, kind === 'media' ? 'video' : kind)

  switch (kind) {
    case 'pdf':
      return extractFromPdf(file.buffer)
    case 'docx':
      return extractFromDocx(file.buffer)
    case 'media':
      return extractFromVideo({ buffer: file.buffer, filename: file.filename })
  }
}

type Kind = 'html' | 'pdf' | 'docx' | 'media'

/* A HEAD request first: it settles the type without pulling a large body, and
   a server that rejects HEAD simply falls through to the extension. */
async function classify(url: string): Promise<Kind> {
  let contentType = ''
  try {
    const head = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: AbortSignal.timeout(15_000),
    })
    if (head.ok) contentType = (head.headers.get('content-type') ?? '').toLowerCase()
  } catch {
    /* Network failures are left to the extractor that runs next, so the error
       the caller sees comes from the real attempt rather than this probe. */
  }

  const fromType = kindFromContentType(contentType)
  if (fromType) return fromType

  const fromExtension = kindFromPath(url)
  if (fromExtension) return fromExtension

  /* Unknown types are treated as pages: Readability gives a clear "no readable
     content" error, which is a better failure than a binary parser's. */
  return 'html'
}

function kindFromContentType(contentType: string): Kind | null {
  if (!contentType) return null
  if (contentType.includes('application/pdf')) return 'pdf'
  if (contentType.includes('officedocument.wordprocessingml.document')) return 'docx'
  if (contentType.startsWith('audio/') || contentType.startsWith('video/')) return 'media'
  if (contentType.includes('text/html') || contentType.includes('application/xhtml')) return 'html'
  return null
}

function kindFromPath(url: string): Kind | null {
  let pathname: string
  try {
    pathname = new URL(url).pathname.toLowerCase()
  } catch {
    throw new ExtractionError('website', `Not a valid URL: ${url}`)
  }

  if (pathname.endsWith('.pdf')) return 'pdf'
  if (pathname.endsWith('.docx')) return 'docx'
  if (SUPPORTED_MEDIA_EXTENSIONS.some((extension) => pathname.endsWith(extension))) return 'media'
  return null
}
