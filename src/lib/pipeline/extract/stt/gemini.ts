import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { SttError, TRANSCRIBE_INSTRUCTION, mimeTypeForPath, type SttProvider } from './types'

const BASE_URL = process.env.GEMINI_BASE_URL ?? 'https://generativelanguage.googleapis.com/v1beta'
const UPLOAD_URL = BASE_URL.replace('/v1beta', '/upload/v1beta')

/* Purpose-built transcription model, and the better choice for audio — but it
   accepts audio only. Handing it a video container fails with "Image input
   modality is not enabled for this model", because the frames register as
   image input. */
const DEFAULT_AUDIO_MODEL = 'gemini-3.5-transcribe'

/* Video therefore goes to a general multimodal model, which reads the frames
   and the audio track together. Costlier per minute than audio-only, so the
   cheaper path for a long recording is still to extract its audio first. */
const DEFAULT_VIDEO_MODEL = 'gemini-3.1-flash-lite'

/* Inline base64 inflates payloads by ~33%, and the request has a hard ceiling
   around 20MB. Anything above this goes through the Files API instead, which
   also lets long recordings work at all. */
const INLINE_LIMIT_BYTES = 12 * 1024 * 1024

const TRANSIENT_ATTEMPTS = 3
const TRANSIENT_BACKOFF_MS = [5_000, 20_000]

const GENERATE_TIMEOUT_MS = 600_000
const UPLOAD_TIMEOUT_MS = 600_000
const PROCESSING_TIMEOUT_MS = 600_000

export class GeminiSttProvider implements SttProvider {
  readonly name = 'gemini (hosted)'

  constructor(
    private readonly apiKey: string,
    private readonly audioModel = process.env.GEMINI_STT_MODEL ?? DEFAULT_AUDIO_MODEL,
    private readonly videoModel = process.env.GEMINI_STT_VIDEO_MODEL ?? DEFAULT_VIDEO_MODEL,
  ) {}

  /* Reported for logging only; the model actually used depends on the file. */
  get model(): string {
    return `${this.audioModel} / ${this.videoModel}`
  }

  async transcribe(filePath: string): Promise<string> {
    const mimeType = mimeTypeForPath(filePath)
    const { size } = await stat(filePath)
    const model = mimeType.startsWith('video/') ? this.videoModel : this.audioModel

    const mediaPart =
      size <= INLINE_LIMIT_BYTES
        ? { inlineData: { mimeType, data: (await readFile(filePath)).toString('base64') } }
        : { fileData: await this.uploadFile(filePath, mimeType, size) }

    return this.generate(mediaPart, model)
  }

  private async generate(mediaPart: unknown, model: string): Promise<string> {
    const response = await this.request(
      `${BASE_URL}/models/${model}:generateContent`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': this.apiKey },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: TRANSCRIBE_INSTRUCTION }, mediaPart] }],
          generationConfig: { temperature: 0 },
        }),
      },
      GENERATE_TIMEOUT_MS,
    )

    const payload = (await response.json()) as GenerateResponse
    const candidate = payload.candidates?.[0]

    if (!candidate) {
      const blocked = payload.promptFeedback?.blockReason
      throw new SttError(
        blocked
          ? `Gemini blocked the audio (${blocked})`
          : 'Gemini returned no transcription candidates',
      )
    }
    if (candidate.finishReason && candidate.finishReason !== 'STOP') {
      throw new SttError(`Gemini stopped transcribing early (${candidate.finishReason})`)
    }

    return readTranscript(candidate)
  }

  /* Resumable upload: start to get a session URL, then send the bytes and
     finalize, then wait for the file to leave PROCESSING — a file referenced
     before it is ACTIVE is rejected by generateContent. */
  private async uploadFile(filePath: string, mimeType: string, size: number): Promise<FileData> {
    const start = await this.request(
      `${UPLOAD_URL}/files`,
      {
        method: 'POST',
        headers: {
          'x-goog-api-key': this.apiKey,
          'X-Goog-Upload-Protocol': 'resumable',
          'X-Goog-Upload-Command': 'start',
          'X-Goog-Upload-Header-Content-Length': String(size),
          'X-Goog-Upload-Header-Content-Type': mimeType,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file: { display_name: path.basename(filePath) } }),
      },
      UPLOAD_TIMEOUT_MS,
    )

    const sessionUrl = start.headers.get('x-goog-upload-url')
    if (!sessionUrl) throw new SttError('Gemini did not return an upload session URL')

    const uploaded = await this.request(
      sessionUrl,
      {
        method: 'POST',
        headers: {
          'Content-Length': String(size),
          'X-Goog-Upload-Offset': '0',
          'X-Goog-Upload-Command': 'upload, finalize',
        },
        body: await readFile(filePath),
      },
      UPLOAD_TIMEOUT_MS,
    )

    const file = ((await uploaded.json()) as { file?: RemoteFile }).file
    if (!file?.uri || !file.name) throw new SttError('Gemini upload returned no file reference')

    await this.waitUntilActive(file)
    return { fileUri: file.uri, mimeType }
  }

  private async waitUntilActive(file: RemoteFile): Promise<void> {
    const deadline = Date.now() + PROCESSING_TIMEOUT_MS
    let state = file.state

    while (state === 'PROCESSING') {
      if (Date.now() > deadline) {
        throw new SttError(`Gemini was still processing the upload after ${PROCESSING_TIMEOUT_MS / 1000}s`)
      }
      await new Promise((resolve) => setTimeout(resolve, 2_000))
      const polled = await this.request(
        `${BASE_URL}/${file.name}`,
        { headers: { 'x-goog-api-key': this.apiKey } },
        30_000,
      )
      state = ((await polled.json()) as RemoteFile).state
    }

    if (state === 'FAILED') {
      throw new SttError('Gemini could not process the uploaded media (unsupported or corrupt encoding)')
    }
  }

  /* Transcription models return 429/503 often enough under load that a single
     attempt makes the whole video path look broken. Overload and rate limits
     get a bounded number of retries with growing backoff; anything else fails
     immediately, since replaying a rejected request changes nothing. */
  private async request(url: string, init: RequestInit, timeoutMs: number): Promise<Response> {
    let lastError: SttError | undefined

    for (let attempt = 0; attempt < TRANSIENT_ATTEMPTS; attempt += 1) {
      if (attempt > 0) {
        await new Promise((resolve) => setTimeout(resolve, TRANSIENT_BACKOFF_MS[attempt - 1]))
      }

      let response: Response
      try {
        response = await fetch(url, { ...init, signal: AbortSignal.timeout(timeoutMs) })
      } catch (cause) {
        const timedOut = cause instanceof Error && cause.name === 'TimeoutError'
        throw new SttError(
          timedOut ? `Gemini request timed out after ${timeoutMs / 1000}s` : 'Could not reach the Gemini API',
          { cause },
        )
      }

      if (response.ok) return response

      const raw = await response.text().catch(() => '')
      lastError = new SttError(
        `Gemini API returned HTTP ${response.status}${sttStatusHint(response.status)}: ${apiMessage(raw)}`,
      )

      if (response.status !== 429 && response.status < 500) throw lastError
    }

    throw new SttError(`${lastError?.message ?? 'Gemini API failed'} (after ${TRANSIENT_ATTEMPTS} attempts)`)
  }
}

type FileData = { fileUri: string; mimeType: string }
type RemoteFile = { uri?: string; name?: string; state?: string }

type GenerateResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string; audioTranscription?: { text?: string } }> }
    finishReason?: string
  }>
  promptFeedback?: { blockReason?: string }
}

/* gemini-3.5-transcribe returns the transcript as `audioTranscription.text`,
   while the general chat models put it in `text`. Reading both keeps the
   provider working across either choice of GEMINI_STT_MODEL. */
function readTranscript(candidate: NonNullable<GenerateResponse['candidates']>[number]): string {
  return (candidate.content?.parts ?? [])
    .map((part) => part.audioTranscription?.text ?? part.text ?? '')
    .join(' ')
    .trim()
}

function apiMessage(raw: string): string {
  try {
    return (JSON.parse(raw) as { error?: { message?: string } }).error?.message ?? raw.slice(0, 300)
  } catch {
    return raw.slice(0, 300)
  }
}

function sttStatusHint(status: number): string {
  switch (status) {
    case 400:
      return ' — malformed request, or the media type is not accepted'
    case 401:
    case 403:
      return ' — check GEMINI_API_KEY'
    case 404:
      return ' — unknown model; check GEMINI_STT_MODEL'
    case 429:
      return ' — rate limited or out of quota'
    default:
      return ''
  }
}
