/* End-to-end harness for the content-ingestion pipeline. Runs each content
   type it is given through extraction and quiz generation, reporting pass/fail
   per stage so a failure is attributable to one module.

   Usage:
     npm run pipeline:test -- --pdf ./sample.pdf --url https://example.com/article
     npm run pipeline:test -- --video ./clip.mp4 --skip-quiz
     npm run pipeline:test -- --docx ./notes.docx --questions 3 --regenerate */

import { extractFromDocx } from '../src/lib/pipeline/extract/docx'
import { extractFromPdf } from '../src/lib/pipeline/extract/pdf'
import { ExtractionError, type ExtractedContent, type SourceType } from '../src/lib/pipeline/extract/types'
import { extractFromVideo } from '../src/lib/pipeline/extract/video'
import { extractFromWebsite } from '../src/lib/pipeline/extract/website'
import { generateQuiz } from '../src/lib/pipeline/quiz/generate'
import { resolveProvider } from '../src/lib/pipeline/quiz/providers'
import { regenerateQuestion } from '../src/lib/pipeline/quiz/regenerate'
import { QuestionSchema, type Question } from '../src/lib/pipeline/quiz/schema'

type Stage = 'extraction' | 'non-empty text' | 'quiz json' | 'regenerate'
type Verdict = 'PASS' | 'FAIL' | 'SKIP'

const TEXT_PREVIEW_CHARS = 500

type Args = {
  video?: string
  pdf?: string
  docx?: string
  url?: string
  questions: number
  skipQuiz: boolean
  regenerate: boolean
}

async function main(): Promise<number> {
  const args = parseArgs(process.argv.slice(2))
  const targets: Array<{ sourceType: SourceType; input: string }> = []
  if (args.video) targets.push({ sourceType: 'video', input: args.video })
  if (args.pdf) targets.push({ sourceType: 'pdf', input: args.pdf })
  if (args.docx) targets.push({ sourceType: 'docx', input: args.docx })
  if (args.url) targets.push({ sourceType: 'website', input: args.url })

  if (targets.length === 0) {
    printUsage()
    return 1
  }

  if (!args.skipQuiz) {
    try {
      const provider = resolveProvider()
      console.log(`\nquiz provider: ${provider.name} (${provider.model})`)
    } catch (error) {
      console.error(`\nCannot generate quizzes: ${errorMessage(error)}`)
      console.error('Run with --skip-quiz to test extraction only.')
      return 1
    }
  }

  const results: Array<{ sourceType: SourceType; stages: Map<Stage, Verdict> }> = []

  for (const target of targets) {
    console.log(`\n${'='.repeat(72)}`)
    console.log(`${target.sourceType.toUpperCase()}  ${target.input}`)
    console.log('='.repeat(72))
    results.push({ sourceType: target.sourceType, stages: await runTarget(target.sourceType, target.input, args) })
  }

  console.log(`\n${'='.repeat(72)}`)
  console.log('SUMMARY')
  console.log('='.repeat(72))

  let failed = 0
  for (const result of results) {
    const parts = [...result.stages].map(([stage, verdict]) => `${verdict} ${stage}`)
    /* A skipped stage is not a failure — --skip-quiz is a normal way to run
       this, and a stage skipped because an earlier one failed is already
       counted by that earlier FAIL. */
    const ok = ![...result.stages.values()].includes('FAIL')
    if (!ok) failed += 1
    console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${result.sourceType.padEnd(8)} ${parts.join('  |  ')}`)
  }

  const passed = results.length - failed
  console.log(`\n  ${passed}/${results.length} content type${results.length === 1 ? '' : 's'} passed with no failures`)

  return failed === 0 ? 0 : 1
}

async function runTarget(sourceType: SourceType, input: string, args: Args): Promise<Map<Stage, Verdict>> {
  const stages = new Map<Stage, Verdict>()

  /* Each content type is isolated so one path's failure never aborts the run —
     the point of the harness is seeing all four verdicts in one pass. */
  let extracted: ExtractedContent | undefined
  const startedAt = Date.now()
  try {
    extracted = await extract(sourceType, input)
    stages.set('extraction', 'PASS')
    report('PASS', 'extraction', `${elapsed(startedAt)}  ${describe(extracted)}`)
  } catch (error) {
    stages.set('extraction', 'FAIL')
    report('FAIL', 'extraction', `${elapsed(startedAt)}  ${errorMessage(error)}`)
  }

  if (!extracted) {
    stages.set('non-empty text', 'SKIP')
    report('SKIP', 'non-empty text', '(extraction failed)')
    stages.set('quiz json', 'SKIP')
    report('SKIP', 'quiz json', '(extraction failed)')
    return stages
  }

  for (const warning of extracted.warnings) {
    console.log(`        warn: ${warning}`)
  }

  const hasText = extracted.text.trim().length > 0
  stages.set('non-empty text', hasText ? 'PASS' : 'FAIL')
  report(hasText ? 'PASS' : 'FAIL', 'non-empty text', `${extracted.text.length} chars`)

  console.log(`\n  extracted text (first ${TEXT_PREVIEW_CHARS} chars):`)
  console.log(indent(preview(extracted.text) || '(empty)'))

  if (!hasText) {
    stages.set('quiz json', 'SKIP')
    report('SKIP', 'quiz json', '(no text to generate from)')
    return stages
  }

  if (args.skipQuiz) {
    stages.set('quiz json', 'SKIP')
    report('SKIP', 'quiz json', '(--skip-quiz)')
    return stages
  }

  const quizStartedAt = Date.now()
  try {
    const { questions, warnings } = await generateQuiz(extracted.text, sourceType, args.questions)
    for (const warning of warnings) console.log(`        warn: ${warning}`)

    /* generateQuiz already validated; re-checking here is what makes the
       harness's "quiz json valid" verdict independent of the module under
       test rather than a restatement of it. */
    const invalid = questions.filter((question) => !QuestionSchema.safeParse(question).success)
    if (invalid.length > 0) throw new Error(`${invalid.length} question(s) failed schema re-validation`)

    stages.set('quiz json', 'PASS')
    report('PASS', 'quiz json', `${elapsed(quizStartedAt)}  ${questions.length} questions, schema valid`)

    console.log('\n  quiz json:')
    console.log(indent(JSON.stringify({ questions }, null, 2)))

    if (args.regenerate) stages.set('regenerate', await runRegenerate(extracted.text, questions))
  } catch (error) {
    stages.set('quiz json', 'FAIL')
    report('FAIL', 'quiz json', `${elapsed(quizStartedAt)}  ${errorMessage(error)}`)
  }

  return stages
}

async function runRegenerate(sourceText: string, questions: Question[]): Promise<Verdict> {
  const startedAt = Date.now()
  const original = questions[0]
  try {
    const replacement = await regenerateQuestion(sourceText, original, { avoid: questions })

    /* The replacement is checked against the questions it was told to avoid.
       Without that check a duplicate reads as a pass, which is exactly how the
       sibling-collision bug hid. */
    const survivors = questions.filter((q) => q.question_text !== original.question_text)
    const clash = survivors.find(
      (q) =>
        q.question_text === replacement.question_text ||
        q.options.filter((option) => replacement.options.includes(option)).length >= 2,
    )

    const verdict: Verdict = clash ? 'FAIL' : 'PASS'
    if (clash) {
      report('FAIL', 'regenerate', `${elapsed(startedAt)}  regenerated question overlaps an existing one`)
      console.log(`        clashes with: ${clash.question_text}`)
    } else {
      report('PASS', 'regenerate', `${elapsed(startedAt)}  returned a distinct, schema-valid replacement`)
    }

    console.log('\n  regenerated question (replacing the first):')
    console.log(indent(JSON.stringify(replacement, null, 2)))
    return verdict
  } catch (error) {
    report('FAIL', 'regenerate', `${elapsed(startedAt)}  ${errorMessage(error)}`)
    return 'FAIL'
  }
}

function extract(sourceType: SourceType, input: string): Promise<ExtractedContent> {
  switch (sourceType) {
    case 'video':
      return extractFromVideo(input)
    case 'pdf':
      return extractFromPdf(input)
    case 'docx':
      return extractFromDocx(input)
    case 'website':
      return extractFromWebsite(input)
  }
}

function describe(extracted: ExtractedContent): string {
  const details = [`${extracted.text.length} chars`]
  if ('pageCount' in extracted) details.push(`${(extracted as { pageCount: number }).pageCount} pages`)
  if ('isScanned' in extracted) details.push(`isScanned=${(extracted as { isScanned: boolean }).isScanned}`)
  return details.join(', ')
}

function parseArgs(argv: string[]): Args {
  const args: Args = { questions: 5, skipQuiz: false, regenerate: false }

  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i]
    const value = argv[i + 1]
    const needsValue = () => {
      if (!value || value.startsWith('--')) throw new Error(`${flag} needs a value`)
      i += 1
      return value
    }

    switch (flag) {
      case '--video':
        args.video = needsValue()
        break
      case '--pdf':
        args.pdf = needsValue()
        break
      case '--docx':
        args.docx = needsValue()
        break
      case '--url':
        args.url = needsValue()
        break
      case '--questions': {
        const parsed = Number(needsValue())
        if (!Number.isInteger(parsed) || parsed < 1) throw new Error('--questions must be a positive integer')
        args.questions = parsed
        break
      }
      case '--skip-quiz':
        args.skipQuiz = true
        break
      case '--regenerate':
        args.regenerate = true
        break
      default:
        throw new Error(`Unknown flag: ${flag}`)
    }
  }

  return args
}

function printUsage(): void {
  console.log(`
Runs the content-ingestion pipeline end to end for each content type given.

  npm run pipeline:test -- [options]

  --video <path>     transcribe with local faster-whisper (needs Python + faster-whisper)
  --pdf <path>       extract with pdfjs, flags likely-scanned PDFs
  --docx <path>      extract with mammoth
  --url <url>        fetch and extract readable content with Readability
  --questions <n>    questions to generate per source (default 5)
  --skip-quiz        extraction only, no DeepSeek calls
  --regenerate       additionally exercise regenerateQuestion on the first question

At least one content flag is required. Quiz generation needs GEMINI_API_KEY or
DEEPSEEK_API_KEY in .env.local; set QUIZ_LLM_PROVIDER to force one.
`)
}

const report = (verdict: Verdict, stage: Stage, detail: string): void =>
  console.log(`  [${verdict}] ${stage.padEnd(15)} ${detail}`)

const elapsed = (since: number): string => `${((Date.now() - since) / 1000).toFixed(1)}s`

const preview = (text: string): string =>
  text.length > TEXT_PREVIEW_CHARS ? `${text.slice(0, TEXT_PREVIEW_CHARS)}…` : text

const indent = (text: string): string =>
  text
    .split('\n')
    .map((line) => `    ${line}`)
    .join('\n')

function errorMessage(error: unknown): string {
  if (error instanceof ExtractionError || error instanceof Error) return error.message
  return String(error)
}

/* Sets exitCode rather than calling process.exit(): forcing exit while a
   spawned transcriber or a pdfjs worker is still closing its handles trips a
   libuv assertion on Windows and masks the real exit status. */
main()
  .then((code) => {
    process.exitCode = code
  })
  .catch((error: unknown) => {
    console.error(`\nHarness crashed: ${errorMessage(error)}`)
    process.exitCode = 1
  })
