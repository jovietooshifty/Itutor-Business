import { DeepSeekProvider } from './deepseek'
import { GeminiProvider } from './gemini'
import { LlmError, type LlmProvider } from './types'

export { LlmError, type LlmCallOptions, type LlmMessage, type LlmProvider } from './types'

export type ProviderName = 'gemini' | 'deepseek'

/* Resolution order: an explicit QUIZ_LLM_PROVIDER wins, otherwise whichever
   key is present, preferring Gemini when both are. Keeping this in one
   function means callers never name a vendor. */
export function resolveProvider(name?: ProviderName): LlmProvider {
  const requested = name ?? (process.env.QUIZ_LLM_PROVIDER as ProviderName | undefined)

  if (requested === 'gemini') return new GeminiProvider(requireKey('GEMINI_API_KEY'))
  if (requested === 'deepseek') return new DeepSeekProvider(requireKey('DEEPSEEK_API_KEY'))
  if (requested) {
    throw new LlmError(`Unknown QUIZ_LLM_PROVIDER "${requested}" — expected "gemini" or "deepseek"`)
  }

  if (process.env.GEMINI_API_KEY) return new GeminiProvider(process.env.GEMINI_API_KEY)
  if (process.env.DEEPSEEK_API_KEY) return new DeepSeekProvider(process.env.DEEPSEEK_API_KEY)

  throw new LlmError(
    'No LLM API key found — set GEMINI_API_KEY or DEEPSEEK_API_KEY in .env.local (see .env.example)',
  )
}

function requireKey(variable: string): string {
  const value = process.env[variable]
  if (!value) {
    throw new LlmError(`${variable} is not set — add it to .env.local (see .env.example)`)
  }
  return value
}
