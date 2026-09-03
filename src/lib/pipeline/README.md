# Content-ingestion + quiz-generation pipeline

Standalone as of now: nothing in `src/app/**` imports this. Four extraction
paths converge on one quiz-generation call, exercised end to end by
`scripts/test-pipeline.ts`. The intended next step is to expose these as
server-side API routes called from the course builder.

```
extractFromVideo(path)    ─┐
extractFromPdf(path)      ─┤
extractFromDocx(path)     ─┼─→  generateQuiz(text, sourceType, n)  →  Question[]
extractFromWebsite(url)   ─┘         regenerateQuestion(text, q)   →  Question
```

Every extractor returns `{ text, sourceType, warnings }`. Genuine failures
throw `ExtractionError`; "succeeded but the text looks unusable" (scanned PDF,
silent video, thin page) comes back as a `warnings` entry so the caller decides.

## Inputs: paths, bytes, or a URL

`extractFromPdf` / `extractFromDocx` take a local path **or** a `Buffer`, and
`extractFromVideo` takes a path or `{ buffer, filename }`. Bytes are the form a
server route has: an upload arrives as a stream and serverless has no
persistent filesystem to stage it on.

When all you have is a URL — which is what a course block stores — use the
dispatcher:

```ts
import { extractFromUrl } from '@/lib/pipeline/extract/from-url'
const { text, sourceType, warnings } = await extractFromUrl(url)
```

It HEADs the URL, routes on the response's own content-type (falling back to
the extension, since object-storage URLs often carry a signature query string
or no extension), and hands off to the right extractor — PDF, docx, media, or
the readable-HTML reader. Do **not** point `extractFromWebsite` at an uploaded
document: it rejects any non-HTML content-type by design.

Remote downloads are capped at `MAX_REMOTE_BYTES` (50MB) so a large file cannot
be pulled into a function's memory. Media above that needs streaming to the
transcription provider instead.

## Running the harness

```bash
npm run pipeline:test -- --pdf ./sample.pdf --docx ./notes.docx --url https://example.com/article
npm run pipeline:test -- --video ./clip.mp4 --skip-quiz     # extraction only, no API spend
npm run pipeline:test -- --pdf ./sample.pdf --regenerate    # also exercise regenerateQuestion
```

`--skip-quiz` is the fast loop while debugging extraction. Exit code is non-zero
if any stage failed, so it can go into CI later.

`npm run pipeline:verify` checks the schema-validation and retry-once logic
against a stub provider — no network, no API key. Run it after changing
anything under `quiz/`.

## Prerequisites

**Quiz generation** needs `GEMINI_API_KEY` or `DEEPSEEK_API_KEY` in `.env.local`
(see `.env.example`). Gemini is preferred when both are set; `QUIZ_LLM_PROVIDER`
forces one. The harness runs outside Next.js, so it loads that file via Node's
`--env-file-if-exists`; nothing else is required.

**The video/audio path** needs nothing beyond that same `GEMINI_API_KEY` —
transcription is hosted, so there is no Python, no model download and no local
CPU cost, and it works the same on a laptop as on serverless. Files up to 12MB
are sent inline; larger ones go through Gemini's Files API, so long recordings
work too.

Audio and video deliberately use **different models**: the purpose-built
`gemini-3.5-transcribe` is better for audio but rejects video outright — "Image
input modality is not enabled for this model", because the frames count as
image input — so video goes to a general multimodal model. Override either with
`GEMINI_STT_MODEL` / `GEMINI_STT_VIDEO_MODEL`.

Video also costs more per minute than audio, since the model reads frames as
well as the audio track. For a long recording, extracting its audio first is
the cheaper path.

Transcription models return 429/503 under load often enough that a single
attempt makes the path look broken, so overload responses get three attempts
with growing backoff.

### Transcribing locally instead

Set `STT_PROVIDER=faster-whisper` when media must not leave the machine. This is
the one piece that is not `npm install`-able, and it cannot run on serverless:

```bash
winget install Python.Python.3.12   # if `python --version` fails
pip install faster-whisper          # pulls ctranslate2 and av
python -c "import faster_whisper"   # should print nothing and exit 0
```

First run downloads weights (~500MB for `small`) and caches them. No system
ffmpeg needed — faster-whisper decodes through PyAV, which bundles its own
FFmpeg libraries, so video containers are read directly.

- `PYTHON_BIN` — on Windows a bare `python` may resolve to the Microsoft Store
  stub, which the pipeline detects and reports explicitly; `py` usually works.
- `WHISPER_MODEL_SIZE` — defaults to `small`.

## Swapping the LLM

`quiz/providers/` is the only place that knows a vendor. `resolveProvider()`
picks one from the environment; `client.ts` owns the shared prompt → parse →
validate → retry-once flow and never names a vendor, so prompts, schema and
validation are identical whichever model runs.

Adding a third vendor means one new file implementing `LlmProvider.complete()`
plus a line in `resolveProvider()`. Providers translate two things into their
own dialect: the assistant turn's name, and how thinking is disabled (Gemini
`thinkingConfig.thinkingBudget: 0`, DeepSeek `thinking: {type: 'disabled'}`).
Both vendors default thinking **on**, which for this task is latency without
benefit, so the pipeline turns it off explicitly.

Model defaults are pinned, not aliased — `gemini-flash-latest` hung past a 45s
timeout in testing while pinned models answered fine, and an alias can shift
behaviour with no code change. `GEMINI_MODEL` / `DEEPSEEK_MODEL` override.

Two things learned the hard way when swapping models:

- **Free-tier quota is per model, and daily.** Repeated testing exhausted
  `gemini-3.5-flash`'s daily allowance; `gemini-3.1-flash-lite` still worked
  because it has its own bucket. A repeated 429 says nothing about the prompt —
  the client now reports that as a provider limit rather than "unusable
  output", which is the difference between waiting for a reset and auditing a
  schema that was never wrong.
- **Not every model accepts `thinkingConfig`.** `gemini-3.5-flash-lite` and
  `gemini-3.6-flash` reject `thinkingBudget: 0` with a bare HTTP 400 "invalid
  argument". If a model swap 400s, that config is the first thing to suspect.

## Swapping the speech-to-text provider

`extract/video.ts` defines `SttProvider` and picks the active one in a single
assignment. Moving to a hosted API (Deepgram, AssemblyAI, OpenAI's Whisper
endpoint) means adding a class that implements `transcribe(filePath)` and
changing that one line — no other file in the pipeline names a provider or
knows which one ran.

Worth noting: the Gemini key already in use lists a `gemini-3.5-transcribe`
model, so a hosted STT provider is available without adding a second vendor or
requiring Python locally.

## Known limits

- **Scanned PDFs** are detected and reported (`isScanned: true`), not OCR'd.
  The threshold is `SCANNED_CHARS_PER_PAGE` in `extract/pdf.ts`.
- **Client-rendered pages** cannot be read by a plain fetch. Readability
  returning nothing throws with that as the likely cause; there is no headless
  browser here.
- **Anti-bot blocks** (403/429, Cloudflare interstitials) are reported clearly
  rather than worked around.
- **Source text is truncated** at `MAX_SOURCE_CHARS` (40k, ~10k tokens) before
  generation — a cost bound, not a model limit.
