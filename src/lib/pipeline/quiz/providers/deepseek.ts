import { LlmError, type LlmCallOptions, type LlmMessage, type LlmProvider } from './types'

const BASE_URL = process.env.DEEPSEEK_BASE_URL ?? 'https://api.deepseek.com'
const DEFAULT_MODEL = 'deepseek-v4-flash'

const REQUEST_TIMEOUT_MS = 120_000

/* Deliberately a thin fetch wrapper rather than the openai SDK: DeepSeek is
   OpenAI-compatible, but `thinking` is not part of the SDK's typed request
   shape, and one REST call does not justify the dependency to work around it. */
export class DeepSeekProvider implements LlmProvider {
  readonly name = 'deepseek'
  readonly model: string

  constructor(private readonly apiKey: string, model?: string) {
    this.model = model ?? process.env.DEEPSEEK_MODEL ?? DEFAULT_MODEL
  }

  async complete(system: string, messages: LlmMessage[], options: LlmCallOptions): Promise<string> {
    const body = {
      model: this.model,
      messages: [{ role: 'system', content: system }, ...messages],
      response_format: { type: 'json_object' },
      /* DeepSeek documents thinking as enabled by default at high effort for
         the v4 family, so leaving it out does not give a fast answer — it
         silently spends latency and tokens on reasoning this task does not
         need. Non-thinking has to be requested explicitly. */
      thinking: { type: options.thinking ? 'enabled' : 'disabled' },
      temperature: options.temperature ?? 0.4,
      max_tokens: options.maxTokens ?? 8000,
      stream: false,
    }

    let response: Response
    try {
      response = await fetch(`${BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.apiKey}` },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })
    } catch (cause) {
      const timedOut = cause instanceof Error && cause.name === 'TimeoutError'
      throw new LlmError(
        timedOut
          ? `DeepSeek did not respond within ${REQUEST_TIMEOUT_MS / 1000}s`
          : 'Could not reach the DeepSeek API (network error)',
        { cause },
      )
    }

    if (!response.ok) {
      const raw = await response.text().catch(() => '')
      throw new LlmError(
        `DeepSeek API returned HTTP ${response.status}${statusHint(response.status)}: ${raw.slice(0, 300)}`,
        { transient: response.status === 429 || response.status >= 500 },
      )
    }

    let payload: unknown
    try {
      payload = await response.json()
    } catch (cause) {
      throw new LlmError('DeepSeek API returned a non-JSON body', { cause })
    }

    const content = (payload as { choices?: Array<{ message?: { content?: unknown } }> })?.choices?.[0]?.message
      ?.content
    if (typeof content !== 'string') {
      throw new LlmError('DeepSeek API response had no message content', { fatal: false })
    }

    return content
  }
}

function statusHint(status: number): string {
  switch (status) {
    case 401:
      return ' — check DEEPSEEK_API_KEY'
    case 402:
      return ' — the DeepSeek account is out of credit, top it up at platform.deepseek.com/top_up'
    case 429:
      return ' — rate limited, retry in a moment'
    default:
      return ''
  }
}
