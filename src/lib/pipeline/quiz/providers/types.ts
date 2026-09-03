/* The vendor seam for quiz generation. The project handoff calls for the LLM
   to sit "behind an internal interface — not hardcoded to one vendor", and
   swapping DeepSeek for Gemini is the first exercise of that: only the files in
   this folder know which vendor is in play. Everything above it — prompts,
   schema, validation, retry — is shared. */

export type LlmMessage = {
  /* 'assistant' is the neutral name; providers map it to their own ('model'
     for Gemini). */
  role: 'user' | 'assistant'
  content: string
}

export type LlmCallOptions = {
  /* Non-thinking by default. Both vendors default to thinking ON, and for a
     structured extraction task it buys nothing but latency and tokens — so it
     has to be switched off explicitly rather than left unset. */
  thinking?: boolean
  temperature?: number
  maxTokens?: number
}

export interface LlmProvider {
  readonly name: string
  readonly model: string
  /* Returns the raw text of the model's reply. Parsing, schema validation and
     retries are the caller's job, so every provider behaves identically. */
  complete(system: string, messages: LlmMessage[], options: LlmCallOptions): Promise<string>
}

export class LlmError extends Error {
  /* Auth, quota and malformed-request failures stay fatal: retrying an
     identical request against them is pointless, so the shared retry loop
     rethrows immediately instead of burning a second call. */
  readonly fatal: boolean

  /* Set for overload and rate-limit responses (5xx, 429). These are retryable
     like a bad-content response, but only after a pause — an instant retry
     usually lands on the same overloaded backend. */
  readonly transient: boolean

  /* How long to wait before retrying a transient failure. A rate limit needs
     to outlast its quota window, which is far longer than the moment an
     overloaded backend needs. */
  readonly retryAfterMs: number

  constructor(
    message: string,
    options?: { cause?: unknown; fatal?: boolean; transient?: boolean; retryAfterMs?: number },
  ) {
    super(message, options)
    this.name = 'LlmError'
    this.transient = options?.transient ?? false
    this.fatal = options?.fatal ?? !this.transient
    this.retryAfterMs = options?.retryAfterMs ?? 3_000
  }
}
