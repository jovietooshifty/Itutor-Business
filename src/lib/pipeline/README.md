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

**The video path** needs a local Python toolchain — this is the only piece that
is not `npm install`-able:

```bash
winget install Python.Python.3.12   # if `python --version` fails
pip install faster-whisper          # pulls ctranslate2 and av
python -c "import faster_whisper"   # should print nothing and exit 0
```

The first transcription downloads model weights (~500MB for `small`) from
Hugging Face and caches them; later runs are offline. The other three paths do
not touch Python at all.

- `PYTHON_BIN` — set this if `python` is not the right executable. On Windows,
  a bare `python` may resolve to the Microsoft Store stub, which the pipeline
  detects and reports explicitly; `py` usually works instead.
- `WHISPER_MODEL_SIZE` — defaults to `small`. `base` is faster and less
  accurate, `medium` the reverse.

**ffmpeg is not required.** faster-whisper decodes through PyAV, which bundles
its own FFmpeg libraries, so video containers are read directly. If some exotic
codec ever fails to decode, installing system ffmpeg and pre-transcoding to wav
is the fallback.

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
