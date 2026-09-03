import { execFile } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'
import { SttError, nameOf, type SttInput, type SttProvider } from './types'

const execFileAsync = promisify(execFile)

/* Local, open-source, no API key and no data leaving the machine: faster-whisper
   (CTranslate2) driven through a small Python helper. It decodes with PyAV,
   which bundles its own FFmpeg libraries, so a video container can be handed
   over directly — no separate audio-extraction step, no system ffmpeg.

   Opt in with STT_PROVIDER=faster-whisper. It is not the default because it
   needs Python plus `pip install faster-whisper` on the host, which rules out
   serverless. */
export class FasterWhisperProvider implements SttProvider {
  readonly name = 'faster-whisper (local)'

  async transcribe(input: SttInput): Promise<string> {
    /* The Python helper reads a real file, so bytes have to be staged on disk
       first — and cleaned up afterwards, since media files are large. */
    if (!input.path) {
      const directory = await mkdtemp(path.join(tmpdir(), 'itutor-stt-'))
      const staged = path.join(directory, path.basename(nameOf(input)))
      try {
        await writeFile(staged, input.buffer as Buffer)
        return await this.transcribe({ path: staged })
      } finally {
        await rm(directory, { recursive: true, force: true })
      }
    }

    return this.runPython(input.path)
  }

  private async runPython(filePath: string): Promise<string> {
    const script = path.join(__dirname, '..', 'whisper_transcribe.py')

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
      throw new SttError(describeSubprocessFailure(cause, python), { cause })
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(stdout.trim())
    } catch (cause) {
      throw new SttError(`Transcriber returned output that is not JSON: "${stdout.slice(0, 200)}"`, { cause })
    }

    if (typeof parsed !== 'object' || parsed === null || typeof (parsed as { text?: unknown }).text !== 'string') {
      throw new SttError('Transcriber returned JSON without a "text" string')
    }

    return (parsed as { text: string }).text
  }
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
  return `Transcription failed (exit ${String(err.code)}): ${stderr.slice(0, 300) || 'no stderr output'}`
}
