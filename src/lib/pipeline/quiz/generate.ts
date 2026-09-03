import type { SourceType } from '../extract/types'
import { callLlmForJson, type CallOptions } from './client'
import { buildQuizPrompt } from './prompts'
import { QuizResponseSchema, type Question } from './schema'

export const MAX_QUESTIONS = 20

export type GeneratedQuiz = {
  questions: Question[]
  warnings: string[]
}

export async function generateQuiz(
  sourceText: string,
  sourceType: SourceType,
  numQuestions: number,
  options?: CallOptions,
): Promise<GeneratedQuiz> {
  if (!Number.isInteger(numQuestions) || numQuestions < 1 || numQuestions > MAX_QUESTIONS) {
    throw new Error(`numQuestions must be an integer between 1 and ${MAX_QUESTIONS}, got ${numQuestions}`)
  }
  if (sourceText.trim().length === 0) {
    throw new Error('sourceText is empty — nothing to generate questions from')
  }

  const prompt = buildQuizPrompt(sourceText, sourceType, numQuestions)
  const { questions } = await callLlmForJson(prompt, QuizResponseSchema, options)

  const warnings: string[] = []
  if (questions.length !== numQuestions) {
    warnings.push(`Asked for ${numQuestions} questions, model returned ${questions.length}.`)
  }

  return { questions, warnings }
}
