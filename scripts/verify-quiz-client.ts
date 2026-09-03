/* Offline verification of the quiz client's schema validation and retry
   behaviour. Drives generateQuiz/regenerateQuestion against an injected stub
   provider, so it needs no network and no API key — run it after touching
   anything under quiz/.

   Run: npm run pipeline:verify */
import { LlmError, type LlmCallOptions, type LlmMessage, type LlmProvider } from '../src/lib/pipeline/quiz/providers'
import { generateQuiz } from '../src/lib/pipeline/quiz/generate'
import { regenerateQuestion } from '../src/lib/pipeline/quiz/regenerate'

const VALID = {
  question_text: 'What internal temperature must poultry reach to be safe to serve?',
  options: ['63C', '68C', '74C', '82C'],
  correct_option: 2,
  explanation: 'Poultry must reach 74C to destroy salmonella.',
}

class StubProvider implements LlmProvider {
  readonly name = 'stub'
  readonly model = 'stub-1'
  calls: Array<{ system: string; messages: LlmMessage[]; options: LlmCallOptions }> = []

  constructor(private readonly scripted: Array<string | LlmError>) {}

  async complete(system: string, messages: LlmMessage[], options: LlmCallOptions): Promise<string> {
    this.calls.push({ system, messages, options })
    const next = this.scripted[Math.min(this.calls.length - 1, this.scripted.length - 1)]
    if (next instanceof LlmError) throw next
    return next
  }
}

const results: Array<[string, boolean, string]> = []
const check = (name: string, ok: boolean, detail = '') => results.push([name, ok, detail])

const quizPayload = (q = VALID) => JSON.stringify({ questions: [q] })

async function run() {
  /* 1. Malformed JSON then valid. */
  let stub = new StubProvider(['not json at all {[', quizPayload()])
  try {
    const quiz = await generateQuiz('source text', 'pdf', 1, { provider: stub })
    check('malformed JSON → recovers on retry', stub.calls.length === 2 && quiz.questions.length === 1, `${stub.calls.length} calls`)
  } catch (e) {
    check('malformed JSON → recovers on retry', false, String(e))
  }

  /* 2. The retry must actually show the model its rejected output. */
  const retryTurn = stub.calls[1]?.messages ?? []
  check(
    'retry replays the bad output plus a corrective turn',
    retryTurn.length === 3 && retryTurn[1].role === 'assistant' && retryTurn[2].content.includes('rejected'),
    `${retryTurn.length} messages`,
  )

  /* 2b. Fenced and preamble-wrapped JSON must parse without burning a retry. */
  stub = new StubProvider(['```json\n' + quizPayload() + '\n```'])
  try {
    await generateQuiz('source text', 'pdf', 1, { provider: stub })
    check('markdown-fenced JSON accepted on first attempt', stub.calls.length === 1, `${stub.calls.length} calls`)
  } catch (e) {
    check('markdown-fenced JSON accepted on first attempt', false, String(e))
  }

  stub = new StubProvider(['Here is your quiz:\n' + quizPayload()])
  try {
    await generateQuiz('source text', 'pdf', 1, { provider: stub })
    check('JSON with preamble accepted on first attempt', stub.calls.length === 1, `${stub.calls.length} calls`)
  } catch (e) {
    check('JSON with preamble accepted on first attempt', false, String(e))
  }

  /* 3. Empty content. */
  stub = new StubProvider(['   ', quizPayload()])
  try {
    await generateQuiz('source text', 'pdf', 1, { provider: stub })
    check('empty content → recovers on retry', stub.calls.length === 2)
  } catch (e) {
    check('empty content → recovers on retry', false, String(e))
  }

  /* 4. Schema violation twice → throws naming both attempts. */
  stub = new StubProvider([quizPayload({ ...VALID, options: ['a', 'b', 'c'] })])
  try {
    await generateQuiz('source text', 'pdf', 1, { provider: stub })
    check('3 options rejected twice → throws', false, 'did not throw')
  } catch (e) {
    const m = e instanceof Error ? e.message : String(e)
    check(
      '3 options rejected twice → throws after exactly 2 calls',
      stub.calls.length === 2 && m.includes('attempt 1') && m.includes('attempt 2'),
      `${stub.calls.length} calls`,
    )
  }

  /* 5. Duplicate options rejected. */
  stub = new StubProvider([quizPayload({ ...VALID, options: ['a', 'a', 'b', 'c'] }), quizPayload()])
  try {
    await generateQuiz('source text', 'pdf', 1, { provider: stub })
    check('duplicate options rejected then retried', stub.calls.length === 2)
  } catch (e) {
    check('duplicate options rejected then retried', false, String(e))
  }

  /* 6. correct_option out of range rejected. */
  stub = new StubProvider([quizPayload({ ...VALID, correct_option: 7 }), quizPayload()])
  try {
    await generateQuiz('source text', 'pdf', 1, { provider: stub })
    check('correct_option out of range rejected then retried', stub.calls.length === 2)
  } catch (e) {
    check('correct_option out of range rejected then retried', false, String(e))
  }

  /* 7. Fatal error → no retry. */
  stub = new StubProvider([new LlmError('HTTP 401 — check key', { fatal: true })])
  try {
    await generateQuiz('source text', 'pdf', 1, { provider: stub })
    check('fatal error → no retry', false, 'did not throw')
  } catch {
    check('fatal error → no retry', stub.calls.length === 1, `${stub.calls.length} call(s)`)
  }

  /* 8. Transient error → retried once, then succeeds. */
  stub = new StubProvider([new LlmError('HTTP 503 — overloaded', { transient: true }), quizPayload()])
  const startedAt = Date.now()
  try {
    await generateQuiz('source text', 'pdf', 1, { provider: stub })
    const waited = Date.now() - startedAt
    check('transient 503 → retried after a pause, then succeeds', stub.calls.length === 2 && waited >= 2500, `${stub.calls.length} calls, waited ${waited}ms`)
  } catch (e) {
    check('transient 503 → retried after a pause, then succeeds', false, String(e))
  }

  /* 9. Thinking is off by default. */
  stub = new StubProvider([quizPayload()])
  await generateQuiz('source text', 'pdf', 1, { provider: stub })
  check('thinking disabled by default', stub.calls[0].options.thinking === false, String(stub.calls[0].options.thinking))

  /* 10. numQuestions guard fires before any call. */
  stub = new StubProvider([quizPayload()])
  try {
    await generateQuiz('source text', 'pdf', 0, { provider: stub })
    check('numQuestions=0 rejected before any call', false, 'did not throw')
  } catch {
    check('numQuestions=0 rejected before any call', stub.calls.length === 0)
  }

  /* 11. Empty source rejected before any call. */
  stub = new StubProvider([quizPayload()])
  try {
    await generateQuiz('   ', 'pdf', 1, { provider: stub })
    check('empty sourceText rejected before any call', false, 'did not throw')
  } catch {
    check('empty sourceText rejected before any call', stub.calls.length === 0)
  }

  /* 12. regenerateQuestion shares the same path and passes siblings through. */
  stub = new StubProvider(['garbage', JSON.stringify({ question: VALID })])
  const sibling = { ...VALID, question_text: 'What is the danger zone temperature range?' }
  try {
    const q = await regenerateQuestion('source text', VALID, { provider: stub, avoid: [VALID, sibling] })
    const promptSawSibling = stub.calls[0].messages[0].content.includes('danger zone')
    check('regenerateQuestion retries, validates, and passes siblings to the prompt', stub.calls.length === 2 && q.options.length === 4 && promptSawSibling, `siblingInPrompt=${promptSawSibling}`)
  } catch (e) {
    check('regenerateQuestion retries, validates, and passes siblings to the prompt', false, String(e))
  }

  console.log('')
  let failed = 0
  for (const [name, ok, detail] of results) {
    if (!ok) failed += 1
    console.log(`  [${ok ? 'PASS' : 'FAIL'}] ${name}${ok || !detail ? '' : ` — ${detail}`}`)
  }
  console.log(`\n  ${results.length - failed}/${results.length} checks passed`)
  process.exitCode = failed === 0 ? 0 : 1
}

run()
