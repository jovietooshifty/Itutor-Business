import { execFile } from 'node:child_process'
import { access } from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'
import { ExtractionError, THIN_TEXT_CHARS, truncateForMessage, type ExtractedContent } from './types'

const execFileAsync = promisify(execFile)

/* The one deliberately swappable seam in this pipeline. Swapping local Whisper
   for a hosted STT API (Deepgram, AssemblyAI, OpenAI's Whisper endpoint) means
   adding a class that implements this interface and changing `activeProvider`
   below — nothing else in the pipeline names a provider or knows which one ran. */
export interface SttProvider {
  readonly name: string
  transcribe(filePath: string): Promise<string>
}

/* Local, open-source, no API key: faster-whisper (CTranslate2) driven through
   a small Python helper. faster-whisper decodes with PyAV, which bundles its
   own FFmpeg libraries, so a video container can be handed over directly — no
   separate audio-extraction step and no system ffmpeg install. */
export class FasterWhisperProvider implements SttProvider {
  readonly name = 'faster-whisper (local)'

  async transcribe(filePath: string): Promise<string> {
    const script = path.join(__dirname, 'whisper_transcribe.py')

    /* Windows ships `python`, most Unix machines only `python3`; the override
       keeps that a config detail rather than a guess. */
    const python = process.env.PYTHON_BIN ?? 'python'

    let stdout: string
    try {
      const result = await execFileAsync(python, [script, filePath], {
        /* A long transcript's JSON comfortably exceeds the 1MB default. */
        maxBuffer: 20 * 1024 * 1024,
        /* No timeout on purpose: transcription time scales with audio length
           and CPU speed, so any fixed ceiling would kill legitimate long runs. */
        env: process.env,
      })
      stdout = result.stdout
    } catch (cause) {
      throw new ExtractionError('video', describeSubprocessFailure(cause, python), { cause })
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(stdout.trim())
    } catch (cause) {
      throw new ExtractionError(
        'video',
        `Transcriber returned output that is not JSON: "${truncateForMessage(stdout, 200)}"`,
        { cause },
      )
    }

    if (typeof parsed !== 'object' || parsed === null || typeof (parsed as { text?: unknown }).text !== 'string') {
      throw new ExtractionError('video', 'Transcriber returned JSON without a "text" string')
    }

    return (parsed as { text: string }).text
  }
}

const activeProvider: SttProvider = new FasterWhisperProvider()

export async function extractFromVideo(filePath: string): Promise<ExtractedContent> {
  try {
    await access(filePath)
  } catch (cause) {
    throw new ExtractionError('video', `No such file: ${filePath}`, { cause })
  }

  const transcript = (await activeProvider.transcribe(filePath)).replace(/\s+/g, ' ').trim()

  const warnings: string[] = []
  if (transcript.length === 0) {
    warnings.push('Transcription produced no text — the file may have no audio track or only silence.')
  } else if (transcript.length < THIN_TEXT_CHARS) {
    warnings.push(`Transcript is only ${transcript.length} characters — too thin to generate a meaningful quiz.`)
  }

  return { text: transcript, sourceType: 'video', warnings }
}

/* The three predictable first-run failures — no Python, no faster-whisper, no
   model download — are worth naming explicitly, since a raw ENOENT or a
   Python traceback tail is not an actionable error message. */
function describeSubprocessFailure(cause: unknown, python: string): string {
  const err = cause as { code?: string | number; stderr?: string }
  const stderr = typeof err.stderr === 'string' ? err.stderr : ''

  if (err.code === 'ENOENT') {
    return `Python not found (tried "${python}"). Install Python 3, or set PYTHON_BIN to the right executable.`
  }
  if (/ModuleNotFoundError.*faster_whisper/s.test(stderr)) {
    return 'Python is installed but faster-whisper is not. Run: pip install faster-whisper'
  }
  if (stderr.includes('Python was not found')) {
    return `"${python}" resolved to the Windows Store stub rather than a real install. Install Python 3, or set PYTHON_BIN.`
  }
  return `Transcription failed (exit ${String(err.code)}): ${truncateForMessage(stderr, 300) || 'no stderr output'}`
}
