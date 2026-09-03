import { access } from 'node:fs/promises'
import { resolveSttProvider, SttError, type SttProviderName } from './stt'
import { ExtractionError, THIN_TEXT_CHARS, type ExtractedContent } from './types'

export { type SttProvider } from './stt'

/* Transcription sits behind the SttProvider seam in ./stt — this function does
   not know or care which provider ran, so switching between hosted Gemini and
   local faster-whisper is a config change, not a code change. */
export async function extractFromVideo(
  filePath: string,
  options: { provider?: SttProviderName } = {},
): Promise<ExtractedContent> {
  try {
    await access(filePath)
  } catch (cause) {
    throw new ExtractionError('video', `No such file: ${filePath}`, { cause })
  }

  let transcript: string
  try {
    const provider = resolveSttProvider(options.provider)
    transcript = (await provider.transcribe(filePath)).replace(/\s+/g, ' ').trim()
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
