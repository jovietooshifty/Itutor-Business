/* The speech-to-text seam. Swapping providers means adding a file here and a
   line in resolveSttProvider() — extract/video.ts never names one. */
export type SttInput = {
  /* Present when the media is already on disk. Local Whisper needs a real
     path; hosted providers can use either. */
  path?: string
  buffer?: Buffer
  /* Used to derive the MIME type when there is no path to read it from. */
  filename?: string
}

export interface SttProvider {
  readonly name: string
  transcribe(input: SttInput): Promise<string>
}

export class SttError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options)
    this.name = 'SttError'
  }
}

const MIME_TYPES: Record<string, string> = {
  '.mp3': 'audio/mp3',
  '.m4a': 'audio/mp4',
  '.aac': 'audio/aac',
  '.wav': 'audio/wav',
  '.flac': 'audio/flac',
  '.ogg': 'audio/ogg',
  '.opus': 'audio/ogg',
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.webm': 'video/webm',
  '.mkv': 'video/x-matroska',
  '.avi': 'video/x-msvideo',
  '.mpeg': 'video/mpeg',
  '.mpg': 'video/mpeg',
}

export const SUPPORTED_MEDIA_EXTENSIONS = Object.keys(MIME_TYPES)

export function mimeTypeForName(name: string): string {
  const extension = name.slice(name.lastIndexOf('.')).toLowerCase()
  const mimeType = MIME_TYPES[extension]
  if (!mimeType) {
    throw new SttError(
      `Unsupported media type "${extension}" — supported: ${SUPPORTED_MEDIA_EXTENSIONS.join(', ')}`,
    )
  }
  return mimeType
}

export function nameOf(input: SttInput): string {
  const name = input.path ?? input.filename
  if (!name) {
    throw new SttError('Cannot determine the media type — pass a path or a filename alongside the buffer')
  }
  return name
}

export const TRANSCRIBE_INSTRUCTION =
  'Transcribe the speech in this recording verbatim. Output only the transcript text — no timestamps, ' +
  'no speaker labels, no commentary, and no markdown. If there is no intelligible speech, output nothing.'
