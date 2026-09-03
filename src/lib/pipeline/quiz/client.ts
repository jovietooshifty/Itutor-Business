import { z } from 'zod'
import type { PromptPair } from './prompts'
import { LlmError, resolveProvider, type LlmMessage, type LlmProvider, type ProviderName } from './providers'

export { LlmError } from './providers'

export type CallOptions = {
  provider?: ProviderName | LlmProvider
  thinking?: boolean
  temperature?: number
  maxTokens?: number
}

/* One place where a model's reply is turned into validated data, shared by
   generateQuiz and regenerateQuestion so neither owns its own retry logic.

   JSON mode (both vendors) guarantees syntactically valid JSON but not
   conformance to our shape, which is why the zod pass is load-bearing rather
   than a formality. */
export async function callLlmForJson<T>(
  prompt: PromptPair,
  schema: z.ZodType<T>,
  options: CallOptions = {},
): Promise<T> {
  const provider =
    typeof options.provider === 'object' ? options.provider : resolveProvider(options.provider)

  const messages: LlmMessage[] = [{ role: 'user', content: prompt.user }]

  const first = await attempt(provider, prompt.system, messages, schema, options)
  if (first.ok) return first.value

  /* An overloaded or rate-limited provider needs a pause before the retry;
     retrying instantly just lands on the same busy backend. */
  if (first.transient) {
    await new Promise((resolve) => setTimeout(resolve, first.retryAfterMs))
  }

  /* Retry once. For a bad-content failure the model is shown its own rejected
     output and the reason; for a transient one there is nothing to correct, so
     the original request is simply repeated. Auth, quota and malformed-request
     errors never reach here — they are fatal and already threw. */
  const retryMessages: LlmMessage[] = first.transient
    ? messages
    : [
        ...messages,
        { role: 'assistant', content: first.raw },
        {
          role: 'user',
          content:
            `That response was rejected: ${first.reason}\n\n` +
            'Reply again with only a single valid json object in the required shape. No fences, no commentary.',
        },
      ]

  const second = await attempt(provider, prompt.system, retryMessages, schema, options)
  if (second.ok) return second.value

  /* Naming the failure class matters: "unusable output" sends you auditing the
     prompt and schema, when a repeated 429 means the quota is spent and the
     prompt was never the problem. */
  const bothTransient = first.transient && second.transient
  const headline = bothTransient
    ? `${provider.name} (${provider.model}) was unavailable on both attempts — this is a provider limit, not a bad response.`
    : `${provider.name} (${provider.model}) returned unusable output twice.`

  throw new LlmError(`${headline}\n  attempt 1: ${first.reason}\n  attempt 2: ${second.reason}`, {
    transient: bothTransient,
  })
}

/* Even in JSON mode both vendors occasionally wrap the object in a markdown
   fence, or add a line of preamble. Each of those is otherwise a guaranteed
   parse failure that burns the single retry, so they are stripped first: take
   the fenced body if present, else the outermost braces. */
function stripCodeFence(content: string): string {
  const trimmed = content.trim()

  const fenced = /^```(?:json)?\s*\n?([\s\S]*?)\n?```$/i.exec(trimmed)
  if (fenced) return fenced[1].trim()

  if (!trimmed.startsWith('{')) {
    const first = trimmed.indexOf('{')
    const last = trimmed.lastIndexOf('}')
    if (first !== -1 && last > first) return trimmed.slice(first, last + 1)
  }

  return trimmed
}

type AttemptResult<T> =
  | { ok: true; value: T }
  | { ok: false; reason: string; raw: string; transient: boolean; retryAfterMs: number }

async function attempt<T>(
  provider: LlmProvider,
  system: string,
  messages: LlmMessage[],
  schema: z.ZodType<T>,
  options: CallOptions,
): Promise<AttemptResult<T>> {
  let content: string
  try {
    content = await provider.complete(system, messages, {
      thinking: options.thinking ?? false,
      temperature: options.temperature,
      maxTokens: options.maxTokens,
    })
  } catch (error) {
    /* Providers mark blocked, truncated, overloaded and rate-limited responses
       as non-fatal; those are worth one more attempt, everything else is not. */
    if (error instanceof LlmError && !error.fatal) {
      return { ok: false, reason: error.message, raw: '', transient: error.transient, retryAfterMs: error.retryAfterMs }
    }
    throw error
  }

  /* Both vendors can return empty content on occasion — DeepSeek documents it
     for JSON mode. That is the same class of problem as malformed JSON (a
     response arrived but is unusable), so it feeds the same retry. */
  if (content.trim().length === 0) {
    return { ok: false, reason: 'response content was empty', raw: '', transient: false, retryAfterMs: 0 }
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(stripCodeFence(content))
  } catch (cause) {
    return {
      ok: false,
      reason: `not valid JSON (${cause instanceof Error ? cause.message : 'parse error'})`,
      raw: content,
      transient: false,
      retryAfterMs: 0,
    }
  }

  const result = schema.safeParse(parsed)
  if (!result.success) {
    return {
      ok: false,
      reason: `did not match the schema — ${z.prettifyError(result.error)}`,
      raw: content,
      transient: false,
      retryAfterMs: 0,
    }
  }

  return { ok: true, value: result.data }
}
