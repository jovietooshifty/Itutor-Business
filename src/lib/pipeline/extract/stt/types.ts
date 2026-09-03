/* The speech-to-text seam. Swapping providers means adding a file here and a
   line in resolveSttProvider() — extract/video.ts never names one. */
export interface SttProvider {
  readonly name: string
  transcribe(filePath: string): Promise<string>
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

export function mimeTypeForPath(filePath: string): string {
  const extension = filePath.slice(filePath.lastIndexOf('.')).toLowerCase()
  const mimeType = MIME_TYPES[extension]
  if (!mimeType) {
    throw new SttError(
      `Unsupported media type "${extension}" — supported: ${Object.keys(MIME_TYPES).join(', ')}`,
    )
  }
  return mimeType
}

export const TRANSCRIBE_INSTRUCTION =
  'Transcribe the speech in this recording verbatim. Output only the transcript text — no timestamps, ' +
  'no speaker labels, no commentary, and no markdown. If there is no intelligible speech, output nothing.'
