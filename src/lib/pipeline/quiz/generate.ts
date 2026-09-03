import type { SourceType } from '../extract/types'
import { callLlmForJson, type CallOptions } from './client'
import { buildQuizPrompt } from './prompts'
import { MAX_QUESTIONS, QuizResponseSchema, type Question } from './schema'

export { MAX_QUESTIONS }

/**
 * How many questions to write. `'auto'` hands the decision to the model: the
 * count follows what the material actually covers, which is the right answer
 * more often than any fixed number — a 90-second clip and a 40-page manual do
 * not both warrant five questions.
 */
export type QuestionCount = number | 'auto'

export type GeneratedQuiz = {
  questions: Question[]
  warnings: string[]
}

export async function generateQuiz(
  sourceText: string,
  sourceType: SourceType,
  numQuestions: QuestionCount,
  options?: CallOptions,
): Promise<GeneratedQuiz> {
  /* The range check belongs to the specific-number path only. 'auto' has no
     number to be out of range, and the ceiling it does have is enforced in the
     schema, which truncates rather than rejecting. */
  if (numQuestions !== 'auto') {
    if (!Number.isInteger(numQuestions) || numQuestions < 1 || numQuestions > MAX_QUESTIONS) {
      throw new Error(`numQuestions must be an integer between 1 and ${MAX_QUESTIONS}, got ${numQuestions}`)
    }
  }
  if (sourceText.trim().length === 0) {
    throw new Error('sourceText is empty — nothing to generate questions from')
  }

  const prompt = buildQuizPrompt(sourceText, sourceType, numQuestions)
  const { questions } = await callLlmForJson(prompt, QuizResponseSchema, options)

  const warnings: string[] = []

  /* "Fewer than asked for" is only a shortfall when a number was asked for.
     Under 'auto' the count IS the answer, so reporting it as a miss would be
     reporting the feature working as a fault. */
  if (numQuestions !== 'auto' && questions.length !== numQuestions) {
    warnings.push(`Asked for ${numQuestions} questions, model returned ${questions.length}.`)
  }
  if (numQuestions === 'auto' && questions.length === MAX_QUESTIONS) {
    warnings.push(
      `Stopped at the ${MAX_QUESTIONS}-question maximum — the material may warrant splitting across two quizzes.`,
    )
  }

  return { questions, warnings }
}
