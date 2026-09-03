import { FasterWhisperProvider } from './faster-whisper'
import { GeminiSttProvider } from './gemini'
import { SttError, type SttProvider } from './types'

export { SttError, type SttProvider } from './types'

export type SttProviderName = 'gemini' | 'faster-whisper'

/* Hosted Gemini is the default: it needs no Python, no model download and no
   local CPU budget, so it works the same on a laptop and on serverless.
   faster-whisper stays available for the case where audio must not leave the
   machine — set STT_PROVIDER=faster-whisper. */
export function resolveSttProvider(name?: SttProviderName): SttProvider {
  const requested = name ?? (process.env.STT_PROVIDER as SttProviderName | undefined)

  if (requested === 'faster-whisper') return new FasterWhisperProvider()
  if (requested === 'gemini') return new GeminiSttProvider(requireGeminiKey())
  if (requested) {
    throw new SttError(`Unknown STT_PROVIDER "${requested}" — expected "gemini" or "faster-whisper"`)
  }

  return new GeminiSttProvider(requireGeminiKey())
}

function requireGeminiKey(): string {
  const key = process.env.GEMINI_API_KEY
  if (!key) {
    throw new SttError(
      'GEMINI_API_KEY is not set — needed for hosted transcription. Set it in .env.local, or use ' +
        'STT_PROVIDER=faster-whisper to transcribe locally instead.',
    )
  }
  return key
}
