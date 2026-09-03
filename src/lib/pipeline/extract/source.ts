import { readFile } from 'node:fs/promises'
import { ExtractionError, type SourceType } from './types'

/* Extractors accept either a local path or the bytes themselves.

   The bytes form is what makes the pipeline usable from a server route: an
   uploaded document arrives as a stream or lives in Supabase Storage behind a
   URL, and serverless has no persistent filesystem to stage it on. */
export type BinaryInput = string | Buffer

/* Guards against buffering something enormous into a function's memory. A
   course video can exceed this, in which case it needs to be handed to a
   transcription provider as a stream rather than pulled through here. */
export const MAX_REMOTE_BYTES = 50 * 1024 * 1024

export async function toBuffer(input: BinaryInput, sourceType: SourceType): Promise<Buffer> {
  if (Buffer.isBuffer(input)) return input
  try {
    return await readFile(input)
  } catch (cause) {
    throw new ExtractionError(sourceType, `Could not read file at ${input}`, { cause })
  }
}

export type RemoteFile = {
  buffer: Buffer
  contentType: string
  filename: string
}

/* Downloads a file so a path-free extractor can work on it. Kept separate from
   extractFromWebsite, which is for readable HTML pages — this is for binaries
   sitting behind a URL, such as an upload in object storage. */
export async function fetchRemoteFile(url: string, sourceType: SourceType): Promise<RemoteFile> {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    throw new ExtractionError(sourceType, `Not a valid URL: ${url}`)
  }

  let response: Response
  try {
    response = await fetch(parsed, { redirect: 'follow', signal: AbortSignal.timeout(120_000) })
  } catch (cause) {
    throw new ExtractionError(sourceType, `Could not download ${parsed.href}`, { cause })
  }

  if (!response.ok) {
    throw new ExtractionError(sourceType, `Download failed with HTTP ${response.status}: ${parsed.href}`)
  }

  /* Checked before reading the body where the server declares it, so an
     oversized file is rejected without pulling it into memory first. */
  const declared = Number(response.headers.get('content-length') ?? '0')
  if (declared > MAX_REMOTE_BYTES) {
    throw new ExtractionError(
      sourceType,
      `File is ${formatMb(declared)}, over the ${formatMb(MAX_REMOTE_BYTES)} limit for downloading into memory`,
    )
  }

  const buffer = Buffer.from(await response.arrayBuffer())
  if (buffer.length > MAX_REMOTE_BYTES) {
    throw new ExtractionError(
      sourceType,
      `File is ${formatMb(buffer.length)}, over the ${formatMb(MAX_REMOTE_BYTES)} limit for downloading into memory`,
    )
  }

  return {
    buffer,
    contentType: (response.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase(),
    filename: decodeURIComponent(parsed.pathname.split('/').filter(Boolean).pop() ?? 'download'),
  }
}

function formatMb(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`
}
