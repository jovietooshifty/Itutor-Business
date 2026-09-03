import { LlmError, type LlmCallOptions, type LlmMessage, type LlmProvider } from './types'

const BASE_URL =
  process.env.GEMINI_BASE_URL ?? 'https://generativelanguage.googleapis.com/v1beta'

/* Pinned rather than using the `gemini-flash-latest` alias: an alias can shift
   model behaviour under us without a code change, and in testing it also hung
   past a 45s timeout while the pinned models answered fine.

   3.5-flash over the newer 3.8-flash on measured latency — 2.5s vs 14.1s for
   the same trivial request. Override with GEMINI_MODEL to trade that back for
   capability. */
const DEFAULT_MODEL = 'gemini-3.5-flash'

const REQUEST_TIMEOUT_MS = 120_000

export class GeminiProvider implements LlmProvider {
  readonly name = 'gemini'
  readonly model: string

  constructor(private readonly apiKey: string, model?: string) {
    this.model = model ?? process.env.GEMINI_MODEL ?? DEFAULT_MODEL
  }

  async complete(system: string, messages: LlmMessage[], options: LlmCallOptions): Promise<string> {
    const body = {
      systemInstruction: { parts: [{ text: system }] },
      contents: messages.map((message) => ({
        /* Gemini names the assistant turn 'model'. */
        role: message.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: message.content }],
      })),
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: options.temperature ?? 0.4,
        maxOutputTokens: options.maxTokens ?? 8000,
        /* A budget of 0 disables thinking. Gemini thinks by default, which for
           this task is latency without benefit. */
        ...(options.thinking ? {} : { thinkingConfig: { thinkingBudget: 0 } }),
      },
    }

    let response: Response
    try {
      response = await fetch(`${BASE_URL}/models/${this.model}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': this.apiKey },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })
    } catch (cause) {
      const timedOut = cause instanceof Error && cause.name === 'TimeoutError'
      throw new LlmError(
        timedOut
          ? `Gemini did not respond within ${REQUEST_TIMEOUT_MS / 1000}s (model ${this.model})`
          : 'Could not reach the Gemini API (network error)',
        { cause },
      )
    }

    if (!response.ok) {
      const raw = await response.text().catch(() => '')
      throw new LlmError(
        `Gemini API returned HTTP ${response.status}${statusHint(response.status)}: ${extractApiMessage(raw)}`,
        {
          transient: isTransient(response.status),
          /* Gemini's per-minute quota resets on a 60s window, so a few seconds
             of backoff is guaranteed to fail again. */
          retryAfterMs: response.status === 429 ? retryDelayFromBody(raw) : 3_000,
        },
      )
    }

    let payload: GeminiResponse
    try {
      payload = (await response.json()) as GeminiResponse
    } catch (cause) {
      throw new LlmError('Gemini API returned a non-JSON body', { cause })
    }

    const candidate = payload.candidates?.[0]

    /* A blocked or truncated response is a content-level problem, so it is
       marked non-fatal and the shared retry loop gets a chance at it. */
    if (!candidate) {
      const blockReason = payload.promptFeedback?.blockReason
      throw new LlmError(
        blockReason
          ? `Gemini blocked the prompt (${blockReason}) — the source text may have tripped a safety filter`
          : 'Gemini returned no candidates',
        { fatal: false },
      )
    }
    if (candidate.finishReason === 'MAX_TOKENS') {
      throw new LlmError('Gemini hit the output token limit — raise maxTokens or ask for fewer questions', {
        fatal: false,
      })
    }
    if (candidate.finishReason && candidate.finishReason !== 'STOP') {
      throw new LlmError(`Gemini stopped early (${candidate.finishReason})`, { fatal: false })
    }

    /* Long JSON can arrive split across several parts, so they are joined
       rather than reading parts[0]. */
    return (candidate.content?.parts ?? [])
      .map((part) => part.text ?? '')
      .join('')
  }
}

type GeminiResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> }
    finishReason?: string
  }>
  promptFeedback?: { blockReason?: string }
}

function extractApiMessage(raw: string): string {
  try {
    const parsed = JSON.parse(raw) as { error?: { message?: string } }
    return parsed.error?.message ?? raw.slice(0, 300)
  } catch {
    return raw.slice(0, 300)
  }
}

/* 429 and 5xx say "ask again shortly", not "this request is wrong". */
function isTransient(status: number): boolean {
  return status === 429 || status >= 500
}

const DEFAULT_RATE_LIMIT_DELAY_MS = 35_000

/* Gemini returns a RetryInfo detail with a `retryDelay` like "27s" on quota
   errors. Honouring it beats guessing; the fallback outlasts a 60s window's
   worst case without stalling forever. */
function retryDelayFromBody(raw: string): number {
  const match = /"retryDelay"\s*:\s*"(\d+(?:\.\d+)?)s"/.exec(raw)
  if (!match) return DEFAULT_RATE_LIMIT_DELAY_MS
  const seconds = Number(match[1])
  if (!Number.isFinite(seconds)) return DEFAULT_RATE_LIMIT_DELAY_MS
  return Math.min(Math.ceil(seconds * 1000) + 1_000, 60_000)
}

function statusHint(status: number): string {
  switch (status) {
    case 400:
      return ' — malformed request, or GEMINI_API_KEY is not a valid key'
    case 503:
      return ' — the model is overloaded'
    case 401:
    case 403:
      return ' — check GEMINI_API_KEY and that the Generative Language API is enabled'
    case 404:
      return ' — unknown model; check GEMINI_MODEL'
    case 429:
      return ' — rate limited or out of quota'
    default:
      return ''
  }
}
