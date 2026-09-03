import { access } from 'node:fs/promises'
import { resolveSttProvider, SttError, type SttProviderName } from './stt'
import { ExtractionError, THIN_TEXT_CHARS, type ExtractedContent } from './types'

export { type SttProvider } from './stt'

export type VideoInput =
  | string
  /* Bytes plus a filename: the filename is what the MIME type is derived from,
     which decides both the model and whether frames are read at all. */
  | { buffer: Buffer; filename: string }

export type VideoOptions = { provider?: SttProviderName }

/* Transcription sits behind the SttProvider seam in ./stt — this function does
   not know or care which provider ran, so switching between hosted Gemini and
   local faster-whisper is a config change, not a code change. */
export async function extractFromVideo(
  input: VideoInput,
  options: VideoOptions = {},
): Promise<ExtractedContent> {
  if (typeof input === 'string') {
    try {
      await access(input)
    } catch (cause) {
      throw new ExtractionError('video', `No such file: ${input}`, { cause })
    }
  }

  let transcript: string
  try {
    const provider = resolveSttProvider(options.provider)
    const raw = await provider.transcribe(
      typeof input === 'string' ? { path: input } : { buffer: input.buffer, filename: input.filename },
    )
    transcript = raw.replace(/\s+/g, ' ').trim()
  } catch (cause) {
    /* SttError messages are already specific and actionable, so they are
       passed through rather than being wrapped in something vaguer. */
    const message = cause instanceof SttError ? cause.message : 'Transcription failed'
    throw new ExtractionError('video', message, { cause })
  }

  const warnings: string[] = []
  if (transcript.length === 0) {
    warnings.push('Transcription produced no text — the file may have no audio track or only silence.')
  } else if (transcript.length < THIN_TEXT_CHARS) {
    warnings.push(`Transcript is only ${transcript.length} characters — too thin to generate a meaningful quiz.`)
  }

  return { text: transcript, sourceType: 'video', warnings }
}
