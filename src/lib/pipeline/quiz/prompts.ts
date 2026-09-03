import type { SourceType } from '../extract/types'
import { OPTIONS_PER_QUESTION, type Question } from './schema'

/* A cost and latency bound on pathological inputs (an hours-long transcript),
   not a context-window limit — deepseek-v4-flash could take far more. Roughly
   10k tokens of source. */
export const MAX_SOURCE_CHARS = 40_000

export type PromptPair = { system: string; user: string }

const SOURCE_LABELS: Record<SourceType, string> = {
  video: 'transcript of a training video',
  pdf: 'PDF training document',
  docx: 'Word training document',
  website: 'training article from a website',
}

/* JSON output mode guarantees syntactically valid JSON but not conformance to
   our shape, so the schema is spelled out here as well as validated after the
   call. The literal word "json" must appear in the prompt for DeepSeek's JSON
   mode to engage. */
const SHAPE_RULES = `Return json in exactly this shape:

{
  "questions": [
    {
      "question_text": "Which internal temperature must poultry reach to be safe to serve?",
      "options": ["63°C (145°F)", "68°C (155°F)", "74°C (165°F)", "82°C (180°F)"],
      "correct_option": 2,
      "explanation": "Poultry must reach 74°C (165°F) to destroy salmonella."
    }
  ]
}

Rules:
- Exactly ${OPTIONS_PER_QUESTION} options per question, all plausible, all distinct.
- Exactly one option is correct. "correct_option" is its zero-based index.
- "explanation" states briefly why the correct option is right.
- Every question must be answerable from the source material alone. Do not use
  outside knowledge, and do not ask about the document's formatting or structure.
- Vary what you test: recall, application, and cause-and-effect, not four
  rephrasings of one fact.
- Output only the json object, with no markdown fences or commentary.`

export function buildQuizPrompt(
  sourceText: string,
  sourceType: SourceType,
  numQuestions: number,
): PromptPair {
  const { text, truncated } = clampSource(sourceText)

  return {
    system:
      'You write multiple-choice comprehension questions for workplace training courses in the food industry. ' +
      `You always reply with a single valid json object.\n\n${SHAPE_RULES}`,
    user:
      `Write ${numQuestions} multiple-choice question${numQuestions === 1 ? '' : 's'} based on the following ` +
      `${SOURCE_LABELS[sourceType]}.` +
      (truncated ? ' (The source was truncated; use only what is given.)' : '') +
      `\n\n--- SOURCE START ---\n${text}\n--- SOURCE END ---`,
  }
}

/* `avoid` carries the other questions already in the quiz. Without it the model
   only knows the one question it is replacing, so it reliably dodges that one
   and collides with a sibling instead — observed in testing, where a
   regenerated question restated another question verbatim. */
export function buildRegeneratePrompt(
  sourceText: string,
  existingQuestion: Question,
  avoid: Question[] = [],
): PromptPair {
  const { text, truncated } = clampSource(sourceText)

  const alreadyAsked = avoid
    .filter((question) => question.question_text !== existingQuestion.question_text)
    .map((question, index) => `${index + 1}. ${question.question_text}`)
    .join('\n')

  return {
    system:
      'You write multiple-choice comprehension questions for workplace training courses in the food industry. ' +
      'You always reply with a single valid json object.\n\n' +
      `Return json in exactly this shape: { "question": { "question_text": string, "options": ` +
      `[${OPTIONS_PER_QUESTION} distinct strings], "correct_option": number, "explanation": string } }\n\n` +
      SHAPE_RULES.slice(SHAPE_RULES.indexOf('Rules:')),
    user:
      'Replace the question below with a different one drawn from the same source material. It must test ' +
      'different content — not a rewording of the original.' +
      (truncated ? ' (The source was truncated; use only what is given.)' : '') +
      `\n\nQuestion to replace: ${existingQuestion.question_text}\n` +
      `Its options were: ${existingQuestion.options.join(' | ')}\n` +
      (alreadyAsked
        ? `\nThese questions are already in the quiz. Your replacement must not overlap with any of them:\n${alreadyAsked}\n`
        : '') +
      `\n--- SOURCE START ---\n${text}\n--- SOURCE END ---`,
  }
}

function clampSource(sourceText: string): { text: string; truncated: boolean } {
  const trimmed = sourceText.trim()
  return trimmed.length > MAX_SOURCE_CHARS
    ? { text: trimmed.slice(0, MAX_SOURCE_CHARS), truncated: true }
    : { text: trimmed, truncated: false }
}
